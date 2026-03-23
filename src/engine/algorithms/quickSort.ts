import type { Step, DSSnapshot } from '../Step';

export function* quickSort(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];

  function* sort(low: number, high: number): Generator<Step<DSSnapshot>, void, unknown> {
    if (low < high) {
      const pi = yield* partition(low, high);
      yield* sort(low, pi - 1);
      yield* sort(pi + 1, high);
    }
  }

  function* partition(low: number, high: number): Generator<Step<DSSnapshot>, number, unknown> {
    const pivot = state[high];
    let i = (low - 1);

    yield {
      action: "highlight",
      indices: [high],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 10, vars: { pivot, low, high } }
    };

    for (let j = low; j <= high - 1; j++) {
      yield {
        action: "compare",
        indices: [j, high],
        snapshot: { type: 'array', data: [...state] },
        meta: { line: 12, vars: { i, j, "state[j]": state[j], pivot } }
      };

      if (state[j] < pivot) {
        i++;
        const temp = state[i];
        state[i] = state[j];
        state[j] = temp;

        yield {
          action: "swap",
          indices: [i, j],
          snapshot: { type: 'array', data: [...state] },
          meta: { line: 16, vars: { i, j, temp } }
        };
      }
    }

    const temp = state[i + 1];
    state[i + 1] = state[high];
    state[high] = temp;

    yield {
      action: "swap",
      indices: [i + 1, high],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 22, vars: { "pi": i + 1, temp } }
    };
    
    yield {
      action: "found",
      indices: [i + 1],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 26, vars: { "pi": i + 1 } }
    };

    return i + 1;
  }

  yield* sort(0, state.length - 1);

  yield {
    action: "custom",
    indices: [],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 27, vars: {} }
  };
}

export const quickSortCode = `function quickSort(arr) {
  function sort(low, high) {
    if (low < high) {
      let pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  function partition(low, high) {
    let pivot = arr[high];
    let i = (low - 1);
    for (let j = low; j <= high - 1; j++) {
      if (arr[j] < pivot) {
        i++;
        // Swap
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
    // Swap pivot
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return (i + 1);
  }

  sort(0, arr.length - 1);
  return arr;
}`;
