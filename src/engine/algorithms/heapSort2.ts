import type { Step, DSSnapshot } from '../Step';

export function* heapSort2(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  const n = state.length;

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 1, vars: { n, phase: 'Build Max Heap' } }
  };

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapifyDown(state, n, i, 3);
  }

  yield {
    action: "found", indices: [0],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 4, vars: { maxHeapBuilt: true, max: state[0] } }
  };

  // Extract elements one by one
  for (let size = n - 1; size > 0; size--) {
    yield {
      action: "compare", indices: [0, size],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 6, vars: { phase: 'Extract max', max: state[0], position: size } }
    };

    const temp = state[0];
    state[0] = state[size];
    state[size] = temp;

    yield {
      action: "swap", indices: [0, size],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 8, vars: { placed: state[size], atIndex: size } }
    };

    yield* heapifyDown(state, size, 0, 9);
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 12, vars: { sorted: true } }
  };
}

function* heapifyDown(arr: number[], size: number, i: number, baseLine: number): Generator<Step<{ type: 'array'; data: (number | string)[] }>, void, unknown> {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < size && arr[left] > arr[largest]) largest = left;
  if (right < size && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    yield {
      action: "compare", indices: [i, largest],
      snapshot: { type: 'array', data: [...arr] },
      meta: { line: baseLine, vars: { parent: arr[i], child: arr[largest], parentIdx: i, childIdx: largest } }
    };

    const temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;

    yield {
      action: "swap", indices: [i, largest],
      snapshot: { type: 'array', data: [...arr] },
      meta: { line: baseLine + 1, vars: { swapped: `${arr[i]} ↔ ${arr[largest]}` } }
    };

    yield* heapifyDown(arr, size, largest, baseLine);
  }
}

export const heapSort2Code = `function heapSort(arr) {
  let n = arr.length;
  // Build max heap
  for (let i = Math.floor(n/2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  // Extract elements
  for (let size = n - 1; size > 0; size--) {
    [arr[0], arr[size]] = [arr[size], arr[0]];
    heapify(arr, size, 0);
  }
  return arr;
}`;
