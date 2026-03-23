import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Step, DSType } from '../engine/Step';

interface VisualizerState {
  currentAlgorithm: string | null;
  dsType: DSType | null;
  isPlaying: boolean;
  playbackSpeed: number; // in milliseconds
  stepIndex: number;
  steps: Step[];
}

const initialState: VisualizerState = {
  currentAlgorithm: null,
  dsType: null,
  isPlaying: false,
  playbackSpeed: 500,
  stepIndex: 0,
  steps: [],
};

export const visualizerSlice = createSlice({
  name: 'visualizer',
  initialState,
  reducers: {
    setAlgorithm: (state, action: PayloadAction<{ id: string, type: DSType }>) => {
      state.currentAlgorithm = action.payload.id;
      state.dsType = action.payload.type;
      state.stepIndex = 0;
      state.isPlaying = false;
      state.steps = [];
    },
    clearAlgorithm: (state) => {
      state.currentAlgorithm = null;
      state.dsType = null;
      state.stepIndex = 0;
      state.steps = [];
      state.isPlaying = false;
    },
    setSteps: (state, action: PayloadAction<Step[]>) => {
      state.steps = action.payload;
      state.stepIndex = 0;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    stepForward: (state) => {
      if (state.stepIndex < state.steps.length - 1) {
        state.stepIndex += 1;
      }
    },
    stepBackward: (state) => {
      if (state.stepIndex > 0) {
        state.stepIndex -= 1;
      }
    },
    setStepIndex: (state, action: PayloadAction<number>) => {
      state.stepIndex = action.payload;
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      state.playbackSpeed = action.payload;
    }
  },
});

export const { setAlgorithm, clearAlgorithm, setSteps, play, pause, stepForward, stepBackward, setStepIndex, setSpeed } = visualizerSlice.actions;

export default visualizerSlice.reducer;
