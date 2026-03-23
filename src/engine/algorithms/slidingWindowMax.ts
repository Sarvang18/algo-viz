import type { Step, DSSnapshot } from '../Step';

export function* slidingWindowMax(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  const k = 3;
  let maxVals = [];
  
  for(let i=0; i<=state.length-k; i++) {
    let windowIndices = [i, i+1, i+2];
    yield { action: "highlight", indices: windowIndices, snapshot: { type: 'array', data: [...state] }, meta: { line: 5, vars: { i, k } } };
    let windowMax = Math.max(state[i], state[i+1], state[i+2]);
    maxVals.push(windowMax);
    yield { action: "found", indices: windowIndices, snapshot: { type: 'array', data: [...state] }, meta: { line: 7, vars: { windowMax, allMaxes: JSON.stringify(maxVals) } } };
  }
}

export const slidingWindowMaxCode = `function slidingWindowMax(arr, k=3) {
  let maxVals = [];
  for(let i=0; i<=arr.length-k; i++) {
    let windowMax = Math.max(arr[i], arr[i+1], arr[i+2]);
    maxVals.push(windowMax);
  }
  return maxVals;
}`;
