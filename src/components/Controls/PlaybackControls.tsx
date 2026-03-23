import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { play, pause, stepForward, stepBackward, setStepIndex, setSpeed } from '../../store/visualizerSlice';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const SPEED_PRESETS = [
  { label: '0.25x', ms: 2000 },
  { label: '0.5x',  ms: 1000 },
  { label: '1x',    ms: 500  },
  { label: '2x',    ms: 250  },
  { label: '4x',    ms: 125  },
];

function getSpeedLabel(ms: number): string {
  const preset = SPEED_PRESETS.find(p => p.ms === ms);
  return preset ? preset.label : `${ms}ms`;
}

export const PlaybackControls: React.FC = () => {
  const dispatch = useDispatch();
  const { isPlaying, stepIndex, steps, playbackSpeed } = useSelector((state: RootState) => state.visualizer);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speedRef = useRef<HTMLDivElement>(null);

  // Close speed menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (speedRef.current && !speedRef.current.contains(e.target as Node)) {
        setShowSpeedMenu(false);
      }
    };
    if (showSpeedMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSpeedMenu]);

  // Playback interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && stepIndex < steps.length - 1) {
      interval = setInterval(() => {
        dispatch(stepForward());
      }, playbackSpeed);
    } else if (stepIndex >= steps.length - 1 && isPlaying) {
      dispatch(pause());
    }
    return () => clearInterval(interval);
  }, [isPlaying, stepIndex, steps.length, playbackSpeed, dispatch]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setStepIndex(Number(e.target.value)));
  };

  return (
    <div className="flex flex-col items-center w-full px-4 gap-4 bg-gray-900 border-t border-gray-800 py-4 shadow-xl">
      <div className="flex items-center gap-6">
        <button onClick={() => dispatch(stepBackward())} disabled={stepIndex === 0} className="text-gray-300 hover:text-white disabled:opacity-30 transition-colors">
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={() => isPlaying ? dispatch(pause()) : dispatch(play())} 
          disabled={steps.length === 0 || (stepIndex === steps.length - 1 && !isPlaying)}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-full p-3 flex items-center justify-center transition-all disabled:opacity-30 shadow-lg"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-[2px]" />}
        </button>

        <button onClick={() => dispatch(stepForward())} disabled={stepIndex >= steps.length - 1} className="text-gray-300 hover:text-white disabled:opacity-30 transition-colors">
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center w-full max-w-4xl gap-4 text-xs font-semibold text-gray-400 mt-2">
        <span className="whitespace-nowrap">Step: {stepIndex}/{steps.length > 0 ? steps.length - 1 : 0}</span>
        <input 
          type="range" 
          min={0} 
          max={steps.length > 0 ? steps.length - 1 : 0} 
          value={stepIndex} 
          onChange={handleSliderChange}
          className="flex-1 cursor-pointer accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none"
        />
        
        {/* Speed control */}
        <div className="relative ml-2" ref={speedRef}>
          <button
            onClick={() => setShowSpeedMenu(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 text-xs font-bold tracking-wide
              ${showSpeedMenu
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
              }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {getSpeedLabel(playbackSpeed)}
          </button>

          {showSpeedMenu && (
            <div className="absolute bottom-full right-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-2 min-w-[140px]">
                <div className="text-[9px] text-white/40 uppercase tracking-[0.15em] font-bold px-2 pb-1.5 mb-1 border-b border-white/5">
                  Speed
                </div>
                {SPEED_PRESETS.map(preset => (
                  <button
                    key={preset.ms}
                    onClick={() => {
                      dispatch(setSpeed(preset.ms));
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100
                      ${playbackSpeed === preset.ms
                        ? 'bg-blue-600/25 text-blue-400'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <span>{preset.label}</span>
                    {playbackSpeed === preset.ms && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
