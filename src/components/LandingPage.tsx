import React, { useState } from 'react';
import { catalog } from '../engine/catalog';
import type { SubCategory, AlgorithmMeta } from '../engine/catalog';
import { useDispatch } from 'react-redux';
import { setAlgorithm } from '../store/visualizerSlice';
import { Activity, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccordionItem: React.FC<{ sub: SubCategory, onSelect: (algo: AlgorithmMeta) => void }> = ({ sub, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden mb-3 bg-white/5 transition-colors duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="font-semibold text-sm text-gray-200 tracking-wide">{sub.name}</span>
        {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-500" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-2 bg-black/30 border-t border-white/5 shadow-inner">
              {sub.algorithms.map(algo => (
                <button
                  key={algo.id}
                  disabled={!algo.implemented}
                  onClick={() => onSelect(algo)}
                  className={`text-left px-3 py-2.5 rounded-lg transition-all duration-300 font-semibold text-[13px] flex justify-between items-center group
                    ${algo.implemented 
                      ? 'bg-blue-500/10 hover:bg-blue-500/20 border border-transparent hover:border-blue-500/30 text-blue-200 hover:text-white cursor-pointer' 
                      : 'opacity-40 cursor-not-allowed text-gray-500 border border-transparent hover:bg-white/5'}`}
                >
                  <span className="truncate mr-2">{algo.name}</span>
                  <div className="flex gap-2 shrink-0">
                     {!algo.implemented && <span className="text-[9px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-black border border-white/10">Soon</span>}
                     {algo.implemented && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">Launch 🚀</span>}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const dispatch = useDispatch();

  const handleSelect = (algo: AlgorithmMeta) => {
    if (algo.implemented) {
      dispatch(setAlgorithm({ id: algo.id, type: algo.dsType }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 p-8 sm:p-12 relative overflow-auto font-sans">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        <header className="mb-14 flex flex-col items-center justify-center text-center mt-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-6">
            <Activity size={36} className="text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm mb-4">
            algo<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">.platform</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Master 100+ Data Structures & Algorithms with Interactive Visualizations.
          </p>
        </header>

        {/* CSS Multi-column layout reduces overflowing massive columns gracefully */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 w-full">
          {catalog.map(category => (
            <div key={category.id} className="break-inside-avoid mb-8 bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col hover:bg-white/[0.05] transition-colors duration-500">
              <h2 className="text-[13px] font-black text-white/70 mb-5 tracking-widest uppercase border-b border-white/10 pb-3">
                {category.name}
              </h2>
              
              <div className="flex flex-col gap-1">
                {category.subcategories && category.subcategories.map((sub, idx) => (
                  <AccordionItem key={idx} sub={sub} onSelect={handleSelect} />
                ))}

                {category.algorithms && category.algorithms.map(algo => (
                  <button
                    key={algo.id}
                    disabled={!algo.implemented}
                    onClick={() => handleSelect(algo)}
                    className={`text-left px-4 py-3 mb-2 rounded-xl transition-all duration-300 font-semibold text-sm flex justify-between items-center group
                      ${algo.implemented 
                        ? 'bg-blue-500/10 hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)] border border-blue-500/20 hover:border-blue-500/40 text-blue-100 hover:text-white cursor-pointer' 
                        : 'opacity-40 cursor-not-allowed text-gray-400/60 border border-transparent bg-white/5 hover:bg-white/10'}`}
                  >
                    <span className="truncate mr-2">{algo.name}</span>
                    <div className="flex gap-2 shrink-0">
                       {!algo.implemented && <span className="text-[9px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-black border border-white/10">Soon</span>}
                       {algo.implemented && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">Launch 🚀</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
