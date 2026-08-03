import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { motion } from 'framer-motion';

export const HanoiVisualizer: React.FC = () => {
  const { steps, stepIndex } = useSelector((state: RootState) => state.visualizer);

  if (steps.length === 0) return <div className="text-gray-500 font-mono text-sm tracking-widest text-white/50 animate-pulse italic">Awaiting Recursive Backtracking Logic...</div>;

  const currentStep = steps[stepIndex];
  if (currentStep.snapshot.type !== 'hanoi') return null;

  const { pegs } = currentStep.snapshot;
  
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-end bg-transparent px-2 pb-12 sm:px-10">
      
      <div className="flex w-full max-w-4xl flex-row items-end justify-center gap-2 sm:gap-10 lg:gap-24">
        {pegs.map((peg, pegIndex) => (
          <div key={pegIndex} className="relative flex h-64 w-24 flex-col-reverse items-center justify-start rounded-b-xl border-b-[12px] border-white/10 opacity-90 drop-shadow-2xl transition-opacity sm:w-32">
            {/* The rigid metallic center rod */}
            <div className="absolute bottom-0 w-3.5 h-[110%] bg-gradient-to-t from-gray-500/50 to-gray-400/20 rounded-t-full z-0 drop-shadow-lg" />
            
            {/* Dynamic Rendering Stack for animated execution */}
            {peg.map((disk) => {
               const diskWidth = 40 + (disk * 18);
               
               return (
                 <motion.div
                   layout
                   key={disk} // Crucial for framer layouts tracking absolute peg drops
                   initial={{ opacity: 0, y: -200, scale: 0.9 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.6 }}
                   className="h-10 rounded-full flex items-center justify-center text-white font-black drop-shadow-2xl z-10 mb-1.5 border-t border-white/30 border-b-[6px] border-black/30"
                   style={{ 
                     width: `${diskWidth}px`, 
                     background: `hsl(${disk * 65}, 90%, 65%)`,
                     boxShadow: `0 0 15px hsl(${disk * 65}, 90%, 65%, 0.4)`
                   }}
                 >
                   {disk}
                 </motion.div>
               );
            })}

            {/* Platform marker text */}
            <h5 className="absolute -bottom-8 font-black uppercase tracking-widest text-xs text-white/40 drop-shadow-sm">PEG {pegIndex + 1}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};
