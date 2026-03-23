import type { Step, DSSnapshot } from '../Step';

export function* heapSortArray(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  const n = state.length;
  
  function* heapify(n: number, i: number): Generator<Step<DSSnapshot>, void, unknown> {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < n && state[l] > state[largest]) largest = l;
    if (r < n && state[r] > state[largest]) largest = r;
    if (largest !== i) {
      const temp = state[i]; state[i] = state[largest]; state[largest] = temp;
      yield { action: "swap", indices: [i, largest], snapshot: { type: 'array', data: [...state] }, meta: { line: 9, vars: { largest, l, r } } };
      yield* heapify(n, largest);
    }
  }
  
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    const temp = state[0]; state[0] = state[i]; state[i] = temp;
    yield { action: "swap", indices: [0, i], snapshot: { type: 'array', data: [...state] }, meta: { line: 16, vars: { i } } };
    yield* heapify(i, 0);
  }
  yield { action: "found", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 19, vars: { result: "Sorted" } } };
}

export const heapSortArrayCode = `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    let temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr, n, i) {
  let largest = i, l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    let temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
    heapify(arr, n, largest);
  }
}`;
