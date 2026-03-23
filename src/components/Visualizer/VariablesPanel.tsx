import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

export const VariablesPanel: React.FC = () => {
  const { steps, stepIndex } = useSelector((state: RootState) => state.visualizer);

  if (steps.length === 0) return (
    <div className="h-full w-full flex flex-col bg-transparent">
       <div className="px-5 py-4 text-[11px] tracking-widest uppercase font-black text-white/50 border-b border-white/10 shrink-0 bg-white/5 shadow-inner">
         Live Variables
       </div>
       <div className="flex-1 flex items-center justify-center text-white/30 text-sm font-medium italic">
         Execute algorithm to view data
       </div>
    </div>
  );
  
  const currentStep = steps[stepIndex];
  const vars = currentStep?.meta?.vars || {};

  return (
    <div className="h-full w-full flex flex-col bg-transparent">
      <div className="px-5 py-4 text-[11px] tracking-widest uppercase font-black text-white/50 border-b border-white/10 shrink-0 bg-white/5 shadow-inner">
        Live Variables
      </div>
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(vars).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10 shadow-inner hover:bg-white/10 transition-colors">
              <span className="text-blue-300 font-mono text-xs">{key}</span>
              <span className="text-green-400 font-mono text-sm font-bold drop-shadow-sm truncate pl-2">{String(value)}</span>
            </div>
          ))}
          {Object.keys(vars).length === 0 && (
            <div className="col-span-2 text-xs text-white/30 italic mt-2 text-center">No variables tracked at this step.</div>
          )}
        </div>
      </div>
    </div>
  );
};
