import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { motion, AnimatePresence } from 'framer-motion';

export const MatrixVisualizer: React.FC = () => {
  const { steps, stepIndex } = useSelector((state: RootState) => state.visualizer);

  if (steps.length === 0) return null;

  const currentStep = steps[stepIndex];
  if (currentStep.snapshot.type !== 'matrix') return null;

  const { data, boardType } = currentStep.snapshot;
  const highlightIndices = new Set(currentStep.indices.map(String));
  
  const isChess = boardType === 'chess';
  const isSudoku = boardType === 'sudoku';
  
  const size = isSudoku ? 9 : data.length;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent p-4 pb-16">
      <div 
        className={`grid ${isSudoku ? 'gap-[1.5px] bg-white/20 border-2 border-white/20 p-0.5' : 'border-4 border-gray-800 shadow-2xl drop-shadow-2xl'}`} 
        style={{ 
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          width: isSudoku ? '450px' : '400px',
          height: isSudoku ? '450px' : '400px'
        }}
      >
        {data.map((row, rIndex) => (
          row.map((cell, cIndex) => {
            const isHighlighted = highlightIndices.has(`${rIndex},${cIndex}`);
            
            // Chess logical coloring
            const isDark = (rIndex + cIndex) % 2 === 1;
            let bgColor = isChess 
              ? (isDark ? 'bg-[#769656]' : 'bg-[#eeeed2]')
              : 'bg-gray-900';
              
            // Sudoku 3x3 block visual separation rules physically integrated into tailwind borders seamlessly
            let sudokuBorder = '';
            if (isSudoku) {
                // Paint bottom border slightly thicker for row block bounds
                if (rIndex % 3 === 2 && rIndex !== 8) sudokuBorder += 'border-b-[3px] border-b-white/40 ';
                // Paint right border slightly thicker for col block bounds 
                if (cIndex % 3 === 2 && cIndex !== 8) sudokuBorder += 'border-r-[3px] border-r-white/40';
            }
              
            // Coloring Action execution layers specifically highlighting algorithm logic sequentially
            if (isHighlighted) {
               if (currentStep.action === 'highlight') bgColor = 'bg-yellow-400';
               if (currentStep.action === 'compare') bgColor = 'bg-blue-400';
               if (currentStep.action === 'swap') bgColor = 'bg-red-400';
               if (currentStep.action === 'found') bgColor = 'bg-green-400';
            }
            
            return (
              <div 
                key={`${rIndex}-${cIndex}`} 
                className={`relative flex items-center justify-center overflow-hidden flex-1 ${bgColor} ${sudokuBorder} transition-colors duration-200`}
              >
                <AnimatePresence mode="popLayout">
                  {cell !== '' && cell !== 0 && cell !== null && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      className={`${isChess ? 'text-4xl text-black/80 drop-shadow-md' : 'text-2xl font-black text-white/90 drop-shadow-sm'}`}
                    >
                      {isChess && cell === 'Q' ? '♛' : cell}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ))}
      </div>
      {isChess && <h4 className="mt-8 uppercase font-black tracking-widest text-sm text-white/50">Chess Backtracking Engine</h4>}
      {isSudoku && <h4 className="mt-8 uppercase font-black tracking-widest text-sm text-white/50">Sudoku Permutation Bounds</h4>}
    </div>
  );
};
