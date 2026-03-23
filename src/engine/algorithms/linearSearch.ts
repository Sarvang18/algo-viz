import type { Step, DSSnapshot } from '../Step';

export function* linearSearch(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  const target = state[Math.floor(state.length * 0.75)]; // arbitrary target
  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 2, vars: { target } } };
  for(let i=0; i<state.length; i++) {
    yield { action: "highlight", indices: [i], snapshot: { type: 'array', data: [...state] }, meta: { line: 4, vars: { i, target } } };
    yield { action: "compare", indices: [i], snapshot: { type: 'array', data: [...state] }, meta: { line: 5, vars: { i, target, "arr[i]": state[i] } } };
    if (state[i] === target) {
      yield { action: "found", indices: [i], snapshot: { type: 'array', data: [...state] }, meta: { line: 6, vars: { result: "Found at index " + i } } };
      return;
    }
  }
}

export const linearSearchCode = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`;
