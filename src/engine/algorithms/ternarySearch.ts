import type { Step, DSSnapshot } from '../Step';

export function* ternarySearch(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr].sort((a, b) => a - b);
  const target = state[Math.floor(state.length * 0.75)];
  let l = 0, r = state.length - 1;
  while(r >= l) {
    let mid1 = l + Math.floor((r - l) / 3);
    let mid2 = r - Math.floor((r - l) / 3);
    yield { action: "highlight", indices: [l, r], snapshot: { type: 'array', data: [...state] }, meta: { line: 5, vars: { l, r, mid1, mid2, target } } };
    yield { action: "compare", indices: [mid1, mid2], snapshot: { type: 'array', data: [...state] }, meta: { line: 6, vars: { l, r, mid1, mid2, target } } };
    
    if (state[mid1] === target) {
      yield { action: "found", indices: [mid1], snapshot: { type: 'array', data: [...state] }, meta: { line: 8, vars: { result: "Found at mid1: " + mid1 } } };
      return;
    }
    if (state[mid2] === target) {
      yield { action: "found", indices: [mid2], snapshot: { type: 'array', data: [...state] }, meta: { line: 11, vars: { result: "Found at mid2: " + mid2 } } };
      return;
    }
    if (target < state[mid1]) {
      r = mid1 - 1;
    } else if (target > state[mid2]) {
      l = mid2 + 1;
    } else {
      l = mid1 + 1;
      r = mid2 - 1;
    }
  }
}

export const ternarySearchCode = `function ternarySearch(arr, target) {
  let l = 0, r = arr.length - 1;
  while (r >= l) {
    let mid1 = l + Math.floor((r - l) / 3);
    let mid2 = r - Math.floor((r - l) / 3);
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;
    if (target < arr[mid1]) r = mid1 - 1;
    else if (target > arr[mid2]) l = mid2 + 1;
    else { l = mid1 + 1; r = mid2 - 1; }
  }
  return -1;
}`;
