import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { play, pause, stepForward, stepBackward, setStepIndex, setSpeed } from '../../store/visualizerSlice';
import { Play, Pause, SkipBack, SkipForward, FastForward } from 'lucide-react';

export const PlaybackControls: React.FC = () => {
  const dispatch = useDispatch();
  const { isPlaying, stepIndex, steps, playbackSpeed } = useSelector((state: RootState) => state.visualizer);

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
          disabled={steps.length === 0 || stepIndex === steps.length - 1 && !isPlaying}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-full p-3 flex items-center justify-center transition-all disabled:opacity-30 shadow-lg"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-[2px]" />}
        </button>

        <button onClick={() => dispatch(stepForward())} disabled={stepIndex >= steps.length - 1} className="text-gray-300 hover:text-white disabled:opacity-30 transition-colors">
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center w-full max-w-4xl gap-4 text-xs font-semibold text-gray-400 mt-2">
        <span>Step: {stepIndex}/{steps.length > 0 ? steps.length - 1 : 0}</span>
        <input 
          type="range" 
          min={0} 
          max={steps.length > 0 ? steps.length - 1 : 0} 
          value={stepIndex} 
          onChange={handleSliderChange}
          className="flex-1 cursor-pointer accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none"
        />
        
        <div className="flex items-center gap-2 relative group cursor-pointer ml-4">
          <FastForward size={16} />
          <span>{playbackSpeed}ms</span>
          
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-3 mb-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
            <div className="bg-gray-800/95 backdrop-blur-md pt-3 pb-2 px-4 rounded-xl shadow-2xl border border-white/10 flex flex-col items-center">
              <span className="text-[10px] text-white/50 mb-2 uppercase tracking-widest font-bold">Playback Speed</span>
              <input 
                type="range" 
                min={50} max={1000} step={25} 
                value={playbackSpeed}
                onChange={(e) => dispatch(setSpeed(Number(e.target.value)))}
                className="accent-blue-500 w-28 cursor-pointer shadow-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
