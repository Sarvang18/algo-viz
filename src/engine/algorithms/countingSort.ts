import type { Step, DSSnapshot } from '../Step';

export function* countingSort(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  const max = Math.max(...state);
  const count = new Array(max + 1).fill(0);
  
  for(let i=0; i<state.length; i++) {
    count[state[i]]++;
    yield { action: "custom", indices: [i], snapshot: { type: 'array', data: [...state] }, meta: { line: 5, vars: { i, val: state[i], "count[val]": count[state[i]] } } };
  }
  
  let idx = 0;
  for(let i=0; i<=max; i++) {
    while(count[i] > 0) {
      state[idx] = i;
      count[i]--;
      yield { action: "swap", indices: [idx], snapshot: { type: 'array', data: [...state] }, meta: { line: 11, vars: { idx, val: i } } };
      idx++;
    }
  }
  yield { action: "found", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 16, vars: { result: "Sorted" } } };
}

export const countingSortCode = `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  for (let i = 0; i < arr.length; i++) count[arr[i]]++;
  let idx = 0;
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      arr[idx++] = i;
      count[i]--;
    }
  }
  return arr;
}`;
