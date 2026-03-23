import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setAlgorithm } from '../../store/visualizerSlice';
import { catalog } from '../../engine/catalog';
import type { AlgorithmMeta } from '../../engine/catalog';
import Fuse from 'fuse.js';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Flatten catalog for search
const allAlgorithms: (AlgorithmMeta & { categoryName: string })[] = [];
catalog.forEach(cat => {
  if (cat.subcategories) {
    cat.subcategories.forEach(sub => {
      sub.algorithms.forEach(algo => allAlgorithms.push({ ...algo, categoryName: sub.name }));
    });
  }
  if (cat.algorithms) {
    cat.algorithms.forEach(algo => allAlgorithms.push({ ...algo, categoryName: cat.name }));
  }
});

const fuse = new Fuse(allAlgorithms, {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'tags', weight: 1.5 },
    { name: 'categoryName', weight: 1 }
  ],
  threshold: 0.3,
  includeScore: true,
});

const RECOMMENDED_IDS = ['bubbleSort', 'dijkstra', 'fibonacciDp', 'nQueens'];
const recommendedAlgos = allAlgorithms.filter(a => RECOMMENDED_IDS.includes(a.id));

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const results = query
    ? fuse.search(query).map(r => r.item)
    : recommendedAlgos;

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open modal - handled by parent via custom event or state
          // To keep it clean, we dispatch a custom event that App/LandingPage listens to
          window.dispatchEvent(new CustomEvent('toggle-search-modal'));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (algo: AlgorithmMeta) => {
    if (algo.implemented) {
      dispatch(setAlgorithm({ id: algo.id, type: algo.dsType }));
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-4 border-b border-white/10 bg-white/5">
              <Search size={22} className="text-gray-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search algorithms, data structures, or topics..."
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-gray-500 font-medium"
              />
              <button 
                onClick={onClose}
                className="ml-3 p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto p-2 flex-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {!query && (
                <div className="px-3 py-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Recommended
                </div>
              )}
              {query && results.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <p className="mb-2 text-lg font-medium text-gray-300">No results found for "{query}"</p>
                  <p className="text-sm">Try searching for concepts like "sorting", "graph", or "dp"</p>
                </div>
              )}

              <div className="flex flex-col gap-1">
                {results.map((algo, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={algo.id}
                      onClick={() => handleSelect(algo)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 text-left group
                        ${isSelected ? 'bg-blue-600/20 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.3)]' : 'hover:bg-white/5 bg-transparent'}
                        ${!algo.implemented ? 'opacity-50' : ''}
                      `}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isSelected ? 'text-blue-100' : 'text-gray-200'}`}>
                            {algo.name}
                          </span>
                          {!algo.implemented && (
                            <span className="text-[9px] bg-white/10 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Soon</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 truncate max-w-[400px]">
                          in {algo.categoryName} {algo.tags ? `• ${algo.tags.slice(0, 3).join(', ')}` : ''}
                        </span>
                      </div>
                      
                      {isSelected && algo.implemented && (
                        <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold shrink-0 animate-in fade-in slide-in-from-right-2">
                          <span className="hidden sm:inline">Launch</span>
                          <CornerDownLeft size={14} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer with shortcuts */}
            <div className="px-4 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs font-medium text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-white/10 border border-white/5 text-gray-300">↑</span>
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-white/10 border border-white/5 text-gray-300">↓</span>
                  <span className="ml-1">Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center justify-center h-5 px-1.5 rounded bg-white/10 border border-white/5 text-gray-300">
                    <CornerDownLeft size={12} />
                  </span>
                  <span className="ml-1">Select</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Close</span>
                <span className="flex items-center justify-center h-5 px-1.5 rounded bg-white/10 border border-white/5 text-gray-300">ESC</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
