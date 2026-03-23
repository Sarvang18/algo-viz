import type { Step, DSSnapshot } from '../Step';

export function* binarySearch(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr].sort((a, b) => a - b);
  const target = state[Math.floor(state.length * 0.75)];

  yield {
    action: "custom",
    indices: [],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 2, vars: { target } }
  };

  let left = 0;
  let right = state.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    yield {
      action: "highlight",
      indices: [left, right],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 5, vars: { left, right, mid, target } }
    };

    yield {
      action: "compare",
      indices: [mid],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 7, vars: { left, right, mid, target, "state[mid]": state[mid] } }
    };

    if (state[mid] === target) {
      yield {
        action: "found",
        indices: [mid],
        snapshot: { type: 'array', data: [...state] },
        meta: { line: 9, vars: { result: "Found at index " + mid } }
      };
      return;
    }

    if (state[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
}

export const binarySearchCode = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // Target found!
    }

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`;
