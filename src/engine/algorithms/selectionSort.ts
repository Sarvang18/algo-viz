import type { Step, DSSnapshot } from '../Step';

export function* selectionSort(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  for(let i=0; i<state.length-1; i++) {
    let minIdx = i;
    yield { action: "highlight", indices: [i], snapshot: { type: 'array', data: [...state] }, meta: { line: 3, vars: { i, minIdx } } };
    for(let j=i+1; j<state.length; j++) {
      yield { action: "compare", indices: [j, minIdx], snapshot: { type: 'array', data: [...state] }, meta: { line: 5, vars: { i, j, minIdx } } };
      if (state[j] < state[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      const temp = state[minIdx];
      state[minIdx] = state[i];
      state[i] = temp;
      yield { action: "swap", indices: [i, minIdx], snapshot: { type: 'array', data: [...state] }, meta: { line: 10, vars: { i, minIdx } } };
    }
  }
  yield { action: "found", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 13, vars: { result: "Sorted" } } };
}

export const selectionSortCode = `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      let temp = arr[minIdx];
      arr[minIdx] = arr[i];
      arr[i] = temp;
    }
  }
  return arr;
}`;
