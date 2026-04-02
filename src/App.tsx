import { useEffect, useState, useRef } from 'react';
import { ArrayVisualizer } from './components/Visualizer/ArrayVisualizer';
import { TreeVisualizer } from './components/Visualizer/TreeVisualizer';
import { HanoiVisualizer } from './components/Visualizer/HanoiVisualizer';
import { MatrixVisualizer } from './components/Visualizer/MatrixVisualizer';
import { PlaybackControls } from './components/Controls/PlaybackControls';
import { CodeEditor } from './components/Editor/CodeEditor';
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
      runAlgorithm(activeAlgoObj.generator as any, inputArray, { type: 'array', data: [...inputArray] });
    } else if (activeAlgoObj.dsType === 'hanoi') {
      const disks = [4, 3, 2, 1]; // Setup 4 explicit disks
      runAlgorithm(activeAlgoObj.generator as any, 4, { type: 'hanoi', pegs: [disks, [], []] });
    } else if (activeAlgoObj.dsType === 'matrix') {
      runAlgorithm(activeAlgoObj.generator as any, null, { type: 'matrix', data: [], boardType: 'chess' });
    } else if (activeAlgoObj.dsType === 'tree') {
      const nodes: Record<string, any> = {
        '1': { id: '1', value: inputArray[0]*2, left: '2', right: '3' },
        '2': { id: '2', value: inputArray[1], left: '4', right: '5' },
        '3': { id: '3', value: inputArray[2], left: '6', right: '7' },
        '4': { id: '4', value: inputArray[3] },
        '5': { id: '5', value: inputArray[4] },
        '6': { id: '6', value: inputArray[5] },
        '7': { id: '7', value: inputArray[6] },
      };
      runAlgorithm(activeAlgoObj.generator as any, { root: '1', nodes }, { type: 'tree', root: '1', nodes });
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
    <div className="flex bg-[#0a0a0f] h-screen text-gray-100 flex-col overflow-hidden font-sans w-full relative">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ChatbotWidget />
      
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="h-[72px] flex items-center px-8 bg-white/5 border-b border-white/10 shrink-0 backdrop-blur-xl z-20 w-full relative justify-between">
        <div className="flex items-center gap-6">
          <button 
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
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-between w-48 px-3 py-1.5 bg-black/40 border border-white/10 hover:border-white/30 rounded-lg text-gray-400 hover:text-white transition-all shadow-inner text-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search size={14} />
              <span>Search...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">
              <span>⌘</span><span>K</span>
            </div>
          </button>
          
          <button 
            onClick={() => {
              const newArr = Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 1);
              setInputArray(newArr);
            }}
            className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 border border-white/10 shadow-lg backdrop-blur-md cursor-pointer hover:border-blue-500/30"
          >
            Randomize Input
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 w-full z-10 relative">
        <div className="w-[480px] flex gap-6 flex-col shrink-0 h-full">
          <div className="flex-1 min-h-[300px] relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md bg-black/40">
             <CodeEditor />
          </div>
          <div className="shrink-0 flex gap-6 h-[30%] min-h-[160px]">
             <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md bg-black/40"><VariablesPanel /></div>
             <div className="w-[180px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md bg-black/40"><ComplexityPanel /></div>
          </div>
        </div>

        <div ref={exportTargetRef} className="flex-1 flex flex-col rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md bg-black/40 overflow-hidden relative min-w-0">
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
