import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { motion } from 'framer-motion';

export const ArrayVisualizer: React.FC = () => {
  const { steps, stepIndex } = useSelector((state: RootState) => state.visualizer);

  if (steps.length === 0) {
    return <div className="text-gray-500 h-64 flex items-center justify-center">No algorithm running</div>;
  }

  const currentStep = steps[stepIndex];
  if (currentStep?.snapshot?.type !== 'array') return null;
  const array = currentStep.snapshot.data;

  const isStringArray = array.length > 0 && typeof array[0] === 'string';
  const maxVal = isStringArray ? 1 : Math.max(...(array as number[]));

  return (
    <div className={`flex ${isStringArray ? 'items-center flex-wrap gap-2' : 'items-end flex-nowrap gap-1 sm:gap-2'} justify-center w-full h-80 px-4`}>
      {array.map((value, index) => {
        const heightPercent = isStringArray ? 100 : ((value as number) / maxVal) * 100;
        
        let colorClass = 'bg-white/10 border-white/20 text-white/50';
        let glow = '';
        
        if (currentStep.indices.includes(index) || currentStep.indices.includes(String(index))) {
          if (currentStep.action === 'compare') { colorClass = 'bg-yellow-400/30 border-yellow-400 text-yellow-200'; glow = 'shadow-[0_0_25px_rgba(250,204,21,0.6)] z-10 scale-110'; }
          if (currentStep.action === 'swap') { colorClass = 'bg-red-500/30 border-red-500 text-red-200'; glow = 'shadow-[0_0_25px_rgba(239,68,68,0.6)] z-10 scale-110'; }
          if (currentStep.action === 'found') { colorClass = 'bg-green-500/30 border-green-500 text-green-200'; glow = 'shadow-[0_0_25px_rgba(34,197,94,0.6)] z-10 scale-105'; }
          if (currentStep.action === 'highlight') { colorClass = 'bg-blue-400/40 border-blue-400 text-white'; glow = 'shadow-[0_0_25px_rgba(96,165,250,0.6)] z-10 scale-105'; }
        }
        
        if (value === '|' && isStringArray) {
           return <div key={`${index}-${value}`} className="w-1.5 h-16 bg-white/20 rounded-full mx-2 drop-shadow-lg"></div>;
        }

        const stringStyles = isStringArray 
          ? 'w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-lg sm:text-2xl font-black border-[3px] backdrop-blur-md drop-shadow-xl'
          : 'w-8 sm:w-12 rounded-t-xl border-t-[3px] border-x-[3px] flex flex-col items-center justify-end pb-2 text-xs sm:text-sm font-bold backdrop-blur-md drop-shadow-2xl';

        return (
          <motion.div
            layout
            key={`${index}-${value}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.5 }}
            className={`${stringStyles} transition-colors duration-200 ${colorClass} ${glow}`}
            style={isStringArray ? {} : { height: Math.max(heightPercent, 10) + '%' }}
          >
            {value}
          </motion.div>
        );
      })}
    </div>
  );
};
