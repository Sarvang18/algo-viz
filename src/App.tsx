import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { ArrayVisualizer } from './components/Visualizer/ArrayVisualizer';
import { TreeVisualizer } from './components/Visualizer/TreeVisualizer';
import { HanoiVisualizer } from './components/Visualizer/HanoiVisualizer';
import { MatrixVisualizer } from './components/Visualizer/MatrixVisualizer';
import { GraphVisualizer } from './components/Visualizer/GraphVisualizer';
import { PlaybackControls } from './components/Controls/PlaybackControls';
import { VariablesPanel } from './components/Visualizer/VariablesPanel';
import { ComplexityPanel } from './components/Visualizer/ComplexityPanel';
import { LandingPage } from './components/LandingPage';
import { runAlgorithm } from './engine/runner';
import { getAlgorithmById } from './engine/catalog';
import { Database, ArrowLeft, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchModal } from './components/Navigation/SearchModal';
import { clearAlgorithm } from './store/visualizerSlice';
import type { RootState } from './store/store';
import { ChatbotWidget } from './components/Chatbot/ChatbotWidget';
import { VideoExporter } from './components/Controls/VideoExporter';
import type { DSNode } from './engine/Step';

const CodeEditor = lazy(() => import('./components/Editor/CodeEditor').then((module) => ({ default: module.CodeEditor })));

const createRandomInput = (algorithmId: string): number[] => {
  if (algorithmId === 'threeSum') {
    const first = Math.floor(Math.random() * 30) + 1;
    const second = Math.floor(Math.random() * 30) + 1;
    const values = [-first, -second, first + second];
    while (values.length < 12) values.push(Math.floor(Math.random() * 81) - 40);
    return values;
  }

  const unique = new Set<number>();
  while (unique.size < 12) unique.add(Math.floor(Math.random() * 99) + 1);
  return [...unique];
};

const buildBalancedTree = (values: number[]): { root: string; nodes: Record<string, DSNode> } => {
  const sorted = [...new Set(values)].sort((a, b) => a - b);
  while (sorted.length < 7) sorted.push((sorted.at(-1) ?? 0) + 1);
  const selected = sorted.slice(0, 7);
  const nodes: Record<string, DSNode> = {
    '1': { id: '1', value: selected[3], left: '2', right: '3' },
    '2': { id: '2', value: selected[1], left: '4', right: '5' },
    '3': { id: '3', value: selected[5], left: '6', right: '7' },
    '4': { id: '4', value: selected[0] },
    '5': { id: '5', value: selected[2] },
    '6': { id: '6', value: selected[4] },
    '7': { id: '7', value: selected[6] },
  };
  return { root: '1', nodes };
};

function App() {
  const dispatch = useDispatch();
  const { currentAlgorithm, dsType } = useSelector((state: RootState) => state.visualizer);
  
  const [inputArray, setInputArray] = useState([34, 12, 5, 9, 42, 67, 23, 1, 88, 55, 10, 2]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const exportTargetRef = useRef<HTMLDivElement>(null);

  const activeAlgoObj = currentAlgorithm ? getAlgorithmById(currentAlgorithm) : null;

  useEffect(() => {
    const handleToggleSearch = () => setIsSearchOpen(prev => !prev);
    window.addEventListener('toggle-search-modal', handleToggleSearch);
    return () => window.removeEventListener('toggle-search-modal', handleToggleSearch);
  }, []);

  useEffect(() => {
    if (!activeAlgoObj || !activeAlgoObj.generator) return;

    if (activeAlgoObj.dsType === 'array') {
      const algorithmInput = activeAlgoObj.id === 'threeSum' && inputArray.every((value) => value > 0)
        ? [-25, -10, -7, -3, 2, 5, 8, 10, 15, 17, 20, 25]
        : inputArray;
      runAlgorithm(activeAlgoObj.generator, algorithmInput, { type: 'array', data: [...algorithmInput] });
    } else if (activeAlgoObj.dsType === 'hanoi') {
      const disks = [4, 3, 2, 1]; // Setup 4 explicit disks
      runAlgorithm(activeAlgoObj.generator, 4, { type: 'hanoi', pegs: [disks, [], []] });
    } else if (activeAlgoObj.dsType === 'matrix') {
      runAlgorithm(activeAlgoObj.generator, null, { type: 'matrix', data: [], boardType: 'grid' });
    } else if (activeAlgoObj.dsType === 'graph') {
      runAlgorithm(activeAlgoObj.generator, null, { type: 'graph', nodes: [], edges: [], directed: true });
    } else if (activeAlgoObj.dsType === 'tree') {
      const tree = buildBalancedTree(inputArray);
      runAlgorithm(activeAlgoObj.generator, tree, { type: 'tree', ...tree });
    }
  }, [inputArray, currentAlgorithm, activeAlgoObj]);

  if (!currentAlgorithm || !activeAlgoObj) {
    return (
      <>
        <LandingPage />
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <ChatbotWidget />
      </>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-auto bg-[#0a0a0f] font-sans text-gray-100 xl:h-screen xl:overflow-hidden">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ChatbotWidget />
      
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 flex min-h-[72px] w-full shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl md:px-8">
        <div className="flex items-center gap-6">
          <button 
             aria-label="Return to algorithm catalog"
             onClick={() => dispatch(clearAlgorithm())}
             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
             <div className="p-1.5 bg-white/5 rounded-md group-hover:bg-white/10 transition-colors border border-white/10 group-hover:border-white/20">
               <ArrowLeft size={16} />
             </div>
             <span className="font-semibold text-sm tracking-wide">Catalog</span>
          </button>
          <div className="w-[1px] h-8 bg-white/10" />
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm flex items-center gap-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{activeAlgoObj.name}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            aria-label="Search algorithms"
            onClick={() => setIsSearchOpen(true)}
            className="hidden w-48 items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-gray-400 shadow-inner transition-all hover:border-white/30 hover:text-white sm:flex"
          >
            <div className="flex items-center gap-2">
              <Search size={14} />
              <span>Search...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">
              <span>⌘</span><span>K</span>
            </div>
          </button>
          
          {activeAlgoObj.randomizable && (
            <button
              onClick={() => setInputArray(createRandomInput(activeAlgoObj.id))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider shadow-lg backdrop-blur-md transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10 md:px-5"
            >
              New Example
            </button>
          )}
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="relative z-10 flex w-full flex-1 flex-col gap-4 overflow-visible p-3 md:gap-6 md:p-6 xl:flex-row xl:overflow-hidden">
        <div className="flex h-[700px] w-full shrink-0 flex-col gap-4 md:gap-6 xl:h-full xl:w-[480px]">
          <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
             <Suspense fallback={<div className="grid h-full place-items-center text-sm text-white/40">Loading code editor…</div>}><CodeEditor /></Suspense>
          </div>
          <div className="shrink-0 flex gap-6 h-[30%] min-h-[160px]">
             <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md bg-black/40"><VariablesPanel /></div>
             <div className="w-[180px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md bg-black/40"><ComplexityPanel /></div>
          </div>
        </div>

        <div ref={exportTargetRef} className="relative flex min-h-[650px] min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md xl:min-h-0">
          <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-white/5 z-10">
             <div className="flex items-center gap-3">
               <Database size={18} className="text-purple-400" />
               <h2 className="font-semibold text-gray-200 tracking-wide">Execution Timeline</h2>
             </div>
             <VideoExporter targetRef={exportTargetRef} />
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {dsType === 'array' && <ArrayVisualizer />}
              {dsType === 'tree' && <TreeVisualizer />}
              {dsType === 'hanoi' && <HanoiVisualizer />}
              {dsType === 'matrix' && <MatrixVisualizer />}
              {dsType === 'graph' && <GraphVisualizer />}
            </div>
          </div>
          
          <div className="shrink-0 z-20">
             <PlaybackControls />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;
