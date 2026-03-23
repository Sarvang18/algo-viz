import type { Step, DSSnapshot } from '../Step';

export function* radixSort(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  const max = Math.max(...state);
  for(let exp = 1; Math.floor(max/exp) > 0; exp *= 10) {
     const output = new Array(state.length).fill(0);
     const count = new Array(10).fill(0);
     for(let i = 0; i < state.length; i++) {
        count[Math.floor(state[i]/exp) % 10]++;
     }
     for(let i = 1; i < 10; i++) count[i] += count[i-1];
     for(let i = state.length - 1; i >= 0; i--) {
        const d = Math.floor(state[i]/exp) % 10;
        output[count[d] - 1] = state[i];
        count[d]--;
     }
     for(let i = 0; i < state.length; i++) {
        state[i] = output[i];
        yield { action: "swap", indices: [i], snapshot: { type: 'array', data: [...state] }, meta: { line: 12, vars: { exp, i, val: state[i] } } };
     }
  }
  yield { action: "found", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 15, vars: { result: "Sorted" } } };
}

export const radixSortCode = `function radixSort(arr) {
  const max = Math.max(...arr);
  for(let exp = 1; Math.floor(max/exp) > 0; exp *= 10) {
     const output = new Array(arr.length).fill(0);
     const count = new Array(10).fill(0);
     for(let i = 0; i < arr.length; i++) count[Math.floor(arr[i]/exp) % 10]++;
     for(let i = 1; i < 10; i++) count[i] += count[i-1];
     for(let i = arr.length - 1; i >= 0; i--) {
        output[count[Math.floor(arr[i]/exp) % 10] - 1] = arr[i];
        count[Math.floor(arr[i]/exp) % 10]--;
     }
     for(let i = 0; i < arr.length; i++) arr[i] = output[i];
  }
  return arr;
}`;
