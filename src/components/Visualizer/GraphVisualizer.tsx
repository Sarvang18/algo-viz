import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import type { RootState } from '../../store/store';

const markerId = 'graph-arrowhead';

export const GraphVisualizer: React.FC = () => {
  const { steps, stepIndex } = useSelector((state: RootState) => state.visualizer);
  const currentStep = steps[stepIndex];

  if (!currentStep || currentStep.snapshot.type !== 'graph') return null;

  const { nodes, edges, directed } = currentStep.snapshot;
  const active = new Set(currentStep.indices.map(String));

  const activeColor = currentStep.action === 'found'
    ? '#4ade80'
    : currentStep.action === 'swap'
      ? '#f87171'
      : currentStep.action === 'compare'
        ? '#facc15'
        : '#60a5fa';

  return (
    <div className="relative w-full max-w-3xl aspect-[4/3]" aria-label="Graph visualization">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 600" role="img">
        <defs>
          <marker id={markerId} markerWidth="10" markerHeight="10" refX="22" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="context-stroke" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const from = nodes.find((node) => node.id === edge.from);
          const to = nodes.find((node) => node.id === edge.to);
          if (!from || !to) return null;
          const selected = active.has(edge.id) || active.has(`${edge.from}-${edge.to}`);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          return (
            <g key={edge.id}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={selected ? activeColor : 'rgba(255,255,255,0.22)'}
                strokeWidth={selected ? 5 : 3}
                markerEnd={directed ? `url(#${markerId})` : undefined}
              />
              {edge.weight !== undefined && (
                <text x={midX} y={midY - 8} fill="rgba(255,255,255,0.75)" fontSize="18" textAnchor="middle">
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {nodes.map((node) => {
        const selected = active.has(node.id);
        return (
          <motion.div
            key={node.id}
            layout
            className="absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 font-black shadow-xl"
            style={{
              left: `${(node.x / 800) * 100}%`,
              top: `${(node.y / 600) * 100}%`,
              borderColor: selected ? activeColor : 'rgba(255,255,255,0.25)',
              backgroundColor: selected ? `${activeColor}33` : 'rgba(255,255,255,0.08)',
              color: selected ? activeColor : 'rgba(255,255,255,0.8)',
              boxShadow: selected ? `0 0 28px ${activeColor}88` : undefined,
            }}
          >
            {node.label}
          </motion.div>
        );
      })}
    </div>
  );
};
