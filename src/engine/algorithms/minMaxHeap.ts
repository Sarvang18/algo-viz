import type { Step, DSSnapshot } from '../Step';

export function* minMaxHeap(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const heap: number[] = [];

  const insertions = [35, 20, 45, 10, 50, 15, 30, 5, 40, 25];

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...heap] },
    meta: { line: 1, vars: { operation: 'Build Min Heap via insertions', items: insertions.join(',') } }
  };

  for (const val of insertions) {
    heap.push(val);

    yield {
      action: "highlight", indices: [heap.length - 1],
      snapshot: { type: 'array', data: [...heap] },
      meta: { line: 3, vars: { inserted: val, position: heap.length - 1 } }
    };

    // Bubble up (heapify up)
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);

      yield {
        action: "compare", indices: [i, parent],
        snapshot: { type: 'array', data: [...heap] },
        meta: { line: 5, vars: { child: heap[i], parent: heap[parent], childIdx: i, parentIdx: parent } }
      };

      if (heap[i] < heap[parent]) {
        const temp = heap[i];
        heap[i] = heap[parent];
        heap[parent] = temp;

        yield {
          action: "swap", indices: [i, parent],
          snapshot: { type: 'array', data: [...heap] },
          meta: { line: 7, vars: { swapped: `${heap[parent]} ↔ ${heap[i]}` } }
        };
        i = parent;
      } else {
        break;
      }
    }

    yield {
      action: "found", indices: [0],
      snapshot: { type: 'array', data: [...heap] },
      meta: { line: 9, vars: { heapSize: heap.length, min: heap[0] } }
    };
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...heap] },
    meta: { line: 11, vars: { finalMin: heap[0], heapSize: heap.length } }
  };
}

export const minMaxHeapCode = `function insertMinHeap(heap, val) {
  heap.push(val);
  let i = heap.length - 1;
  while (i > 0) {
    let parent = Math.floor((i - 1) / 2);
    if (heap[i] < heap[parent]) {
      [heap[i], heap[parent]] = [heap[parent], heap[i]];
      i = parent;
    } else break;
  }
}`;
