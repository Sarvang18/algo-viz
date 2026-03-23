import type { Step, DSSnapshot } from '../Step';

export function* bubbleSort(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const n = arr.length;
  const state = [...arr]; // clone

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare
      yield {
        action: "compare",
        indices: [j, j + 1],
        snapshot: { type: 'array', data: [...state] },
        meta: {
          line: 5,
          vars: { i, j, "arr[j]": state[j], "arr[j+1]": state[j + 1] }
        }
      };

      if (state[j] > state[j + 1]) {
        // Swap
        const temp = state[j];
        state[j] = state[j + 1];
        state[j + 1] = temp;

        yield {
          action: "swap",
          indices: [j, j + 1],
          snapshot: { type: 'array', data: [...state] },
          meta: {
            line: 7,
            vars: { i, j, "arr[j]": state[j], "arr[j+1]": state[j + 1], temp }
          }
        };
      }
    }
    // Mark element as sorted
    yield {
      action: "found",
      indices: [n - i - 1],
      snapshot: { type: 'array', data: [...state] },
      meta: {
        line: 11,
        vars: { i }
      }
    }
  }
  
  // Final return
  yield {
    action: "custom",
    indices: [],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 13, vars: {} }
  }
}

export const bubbleSortCode = `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`;
