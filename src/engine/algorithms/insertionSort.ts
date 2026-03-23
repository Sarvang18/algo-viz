import type { Step, DSSnapshot } from '../Step';

export function* insertionSort(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];

  for (let i = 1; i < state.length; i++) {
    let key = state[i];
    let j = i - 1;

    yield {
      action: "highlight",
      indices: [i],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 3, vars: { i, key, j } }
    };

    while (j >= 0 && state[j] > key) {
      yield {
        action: "compare",
        indices: [j, j + 1],
        snapshot: { type: 'array', data: [...state] },
        meta: { line: 7, vars: { i, key, j, "state[j]": state[j] } }
      };

      state[j + 1] = state[j];
      
      yield {
        action: "swap",
        indices: [j, j + 1],
        snapshot: { type: 'array', data: [...state] },
        meta: { line: 9, vars: { i, key, j } }
      };
      j = j - 1;
    }
    state[j + 1] = key;
    
    yield {
      action: "custom",
      indices: [j + 1],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 12, vars: { i, key, j } }
    };
  }

  yield {
    action: "found",
    indices: [],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 15, vars: { result: "Sorted" } }
  };
}

export const insertionSortCode = `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`;
