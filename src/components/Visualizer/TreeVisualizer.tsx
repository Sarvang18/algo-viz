import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { motion } from 'framer-motion';
import type { DSNode } from '../../engine/Step';

export const TreeVisualizer: React.FC = () => {
  const { steps, stepIndex } = useSelector((state: RootState) => state.visualizer);

  if (steps.length === 0) return null;

  const currentStep = steps[stepIndex];
  if (currentStep?.snapshot?.type !== 'tree') return null;

  const { root, nodes } = currentStep.snapshot;
  
  const layoutNodes: (DSNode & { px: number, py: number })[] = [];
  const links: { from: {x: number, y: number}, to: {x: number, y: number} }[] = [];
  
  const levelHeight = 70;
  
  const traverse = (nodeId: string | null, depth: number, offset: number, span: number) => {
    if (!nodeId) return null;
    const px = offset;
    const py = depth * levelHeight + 50;
    
    layoutNodes.push({ ...nodes[nodeId], px, py });
    
    const node = nodes[nodeId];
    if (node.left) {
      const leftChild = traverse(node.left, depth + 1, offset - span / 2, span / 2);
      if (leftChild) links.push({ from: {x: px, y: py}, to: {x: leftChild.px, y: leftChild.py} });
    }
    if (node.right) {
      const rightChild = traverse(node.right, depth + 1, offset + span / 2, span / 2);
      if (rightChild) links.push({ from: {x: px, y: py}, to: {x: rightChild.px, y: rightChild.py} });
    }
    return { px, py };
  };

  traverse(root, 0, 300, 160); // Base root offset assuming typical dashboard width
  
  return (
     <div className="relative w-full h-full flex items-start justify-center overflow-auto p-4">
       <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
         {links.map((link, i) => (
            <line key={i} x1={link.from.x} y1={link.from.y} x2={link.to.x} y2={link.to.y} stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
         ))}
       </svg>
       {layoutNodes.map((node) => {
        let borderColor = 'border-white/10';
        let bgColor = 'bg-white/5';
        let textColor = 'text-white/60';
        let glow = '';

        if (currentStep.indices.includes(node.id)) {
          if (currentStep.action === 'compare') {
            borderColor = 'border-blue-400';
            bgColor = 'bg-blue-400/20';
            textColor = 'text-blue-400';
            glow = 'shadow-[0_0_25px_rgba(96,165,250,0.6)]';
          }
          if (currentStep.action === 'found') {
            borderColor = 'border-green-400';
            bgColor = 'bg-green-400/20';
            textColor = 'text-green-400';
            glow = 'shadow-[0_0_25px_rgba(74,222,128,0.6)]';
          }
        }

        return (
          <motion.div
            key={node.id}
            layout
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 backdrop-blur-md z-10 transition-all duration-300 ${borderColor} ${bgColor} ${glow}`}
            style={{ left: node.px - 24, top: node.py - 24 }} // center shift
          >
            <span className={`font-bold text-sm ${textColor}`}>{node.value}</span>
          </motion.div>
        );
      })}
     </div>
  );
};
