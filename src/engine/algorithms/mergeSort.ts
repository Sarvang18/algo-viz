import type { Step, DSSnapshot } from '../Step';

export function* mergeSort(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];

  function* sort(l: number, r: number): Generator<Step<DSSnapshot>, void, unknown> {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    yield* sort(l, m);
    yield* sort(m + 1, r);
    yield* merge(l, m, r);
  }

  function* merge(l: number, m: number, r: number): Generator<Step<DSSnapshot>, void, unknown> {
    const left = state.slice(l, m + 1);
    const right = state.slice(m + 1, r + 1);
    
    let i = 0, j = 0, k = l;

    yield {
      action: "highlight",
      indices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 11, vars: { l, m, r } }
    };

    while (i < left.length && j < right.length) {
      yield {
        action: "compare",
        indices: [k],
        snapshot: { type: 'array', data: [...state] },
        meta: { line: 15, vars: { k, "left[i]": left[i], "right[j]": right[j] } }
      };

      if (left[i] <= right[j]) {
        state[k] = left[i];
        i++;
      } else {
        state[k] = right[j];
        j++;
      }
      
      yield {
        action: "swap",
        indices: [k],
        snapshot: { type: 'array', data: [...state] },
        meta: { line: 18, vars: { k, "state[k]": state[k] } }
      };
      
      k++;
    }

    while (i < left.length) {
      state[k] = left[i];
      yield {
        action: "swap",
        indices: [k],
        snapshot: { type: 'array', data: [...state] },
        meta: { line: 22, vars: { k, "state[k]": state[k] } }
      };
      i++;
      k++;
    }

    while (j < right.length) {
      state[k] = right[j];
      yield {
        action: "swap",
        indices: [k],
        snapshot: { type: 'array', data: [...state] },
        meta: { line: 23, vars: { k, "state[k]": state[k] } }
      };
      j++;
      k++;
    }
  }

  yield* sort(0, state.length - 1);

  yield {
    action: "found",
    indices: [],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 27, vars: { result: "Sorted" } }
  };
}

export const mergeSortCode = `function mergeSort(arr) {
  function sort(l, r) {
    if (l >= r) return;
    let m = l + Math.floor((r - l) / 2);
    sort(l, m);
    sort(m + 1, r);
    merge(l, m, r);
  }

  function merge(l, m, r) {
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
  }

  sort(0, arr.length - 1);
  return arr;
}`;
