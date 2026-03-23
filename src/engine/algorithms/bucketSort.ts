import type { Step, DSSnapshot } from '../Step';

export function* bucketSort(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  if(state.length <= 0) return;
  
  let min = state[0], max = state[0];
  for (let i=1; i<state.length; i++) {
    if (state[i] < min) min = state[i];
    else if (state[i] > max) max = state[i];
  }
  const bucketCount = 5;
  const buckets: number[][] = Array.from({length: bucketCount}, () => []);
  
  for(let i=0; i<state.length; i++) {
    yield { action: "highlight", indices: [i], snapshot: { type: 'array', data: [...state] }, meta: { line: 10, vars: { i, val: state[i] } } };
    const bucketIndex = Math.floor(((state[i] - min) / (max - min + 1)) * bucketCount);
    // Safety clamp
    const safeIdx = Math.min(bucketIndex, bucketCount - 1);
    buckets[safeIdx].push(state[i]);
  }
  
  let idx = 0;
  for(let i=0; i<bucketCount; i++) {
    buckets[i].sort((a,b) => a-b);
    for(let j=0; j<buckets[i].length; j++) {
      state[idx] = buckets[i][j];
      yield { action: "swap", indices: [idx], snapshot: { type: 'array', data: [...state] }, meta: { line: 17, vars: { bucket: i, idx, val: state[idx] } } };
      idx++;
    }
  }
  yield { action: "found", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 20, vars: { result: "Sorted" } } };
}

export const bucketSortCode = `function bucketSort(arr) {
  if (arr.length <= 0) return arr;
  let min = Math.min(...arr), max = Math.max(...arr);
  const bucketCount = 5;
  const buckets = Array.from({length: bucketCount}, () => []);
  for(let i=0; i<arr.length; i++) {
    const bucketIndex = Math.min(Math.floor(((arr[i] - min) / (max - min + 1)) * bucketCount), bucketCount - 1);
    buckets[bucketIndex].push(arr[i]);
  }
  let idx = 0;
  for(let i=0; i<bucketCount; i++) {
    buckets[i].sort((a,b) => a-b);
    for(let j=0; j<buckets[i].length; j++) arr[idx++] = buckets[i][j];
  }
  return arr;
}`;
