import type { Step, DSSnapshot } from '../Step';

export function* kthLargest(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const input = [...arr];
  const n = input.length;
  const k = 3;

  // Use a min-heap of size k
  const heap: number[] = [];

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...input] },
    meta: { line: 1, vars: { n, k, problem: `Find ${k}rd largest element` } }
  };

  for (let i = 0; i < n; i++) {
    yield {
      action: "highlight", indices: [i],
      snapshot: { type: 'array', data: [...input] },
      meta: { line: 3, vars: { processing: input[i], heapSize: heap.length } }
    };

    if (heap.length < k) {
      heap.push(input[i]);
      heap.sort((a, b) => a - b); // maintain min-heap order
      yield {
        action: "found", indices: [i],
        snapshot: { type: 'array', data: [...input] },
        meta: { line: 5, vars: { added: input[i], heap: heap.join(','), heapMin: heap[0] } }
      };
    } else if (input[i] > heap[0]) {
      const evicted = heap[0];
      heap[0] = input[i];
      heap.sort((a, b) => a - b);
      yield {
        action: "swap", indices: [i],
        snapshot: { type: 'array', data: [...input] },
        meta: { line: 7, vars: { replaced: `${evicted} → ${input[i]}`, heap: heap.join(','), kthLargest: heap[0] } }
      };
    } else {
      yield {
        action: "compare", indices: [i],
        snapshot: { type: 'array', data: [...input] },
        meta: { line: 9, vars: { skipped: `${input[i]} <= heap min ${heap[0]}` } }
      };
    }
  }

  // Highlight the answer in the original array
  const ansIdx = input.indexOf(heap[0]);
  yield {
    action: "found", indices: [ansIdx],
    snapshot: { type: 'array', data: [...input] },
    meta: { line: 12, vars: { kthLargest: heap[0], k, topK: heap.join(',') } }
  };
}

export const kthLargestCode = `function kthLargest(arr, k) {
  let heap = []; // min-heap of size k
  for (let num of arr) {
    if (heap.length < k) {
      heap.push(num);
      heap.sort((a, b) => a - b);
    } else if (num > heap[0]) {
      heap[0] = num;
      heap.sort((a, b) => a - b);
    }
  }
  return heap[0]; // k-th largest
}`;
