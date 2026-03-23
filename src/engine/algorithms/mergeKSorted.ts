import type { Step, DSSnapshot } from '../Step';

export function* mergeKSorted(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  // 4 sorted lists
  const lists = [
    [1, 5, 9],
    [2, 6, 12],
    [3, 7, 10],
    [4, 8, 11],
  ];

  // Flatten to display
  const flat: number[] = lists.flat();
  const result: number[] = [];

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...flat] },
    meta: { line: 1, vars: { lists: lists.length, totalElements: flat.length, info: '4 sorted lists' } }
  };

  // Pointers for each list
  const ptrs = new Array(lists.length).fill(0);

  while (result.length < flat.length) {
    // Find minimum across all list heads
    let minVal = Infinity;
    let minList = -1;

    for (let i = 0; i < lists.length; i++) {
      if (ptrs[i] < lists[i].length) {
        const flatIdx = lists.slice(0, i).reduce((sum, l) => sum + l.length, 0) + ptrs[i];
        yield {
          action: "compare", indices: [flatIdx],
          snapshot: { type: 'array', data: [...flat] },
          meta: { line: 5, vars: { list: i, value: lists[i][ptrs[i]], currentMin: minVal === Infinity ? '∞' : minVal } }
        };

        if (lists[i][ptrs[i]] < minVal) {
          minVal = lists[i][ptrs[i]];
          minList = i;
        }
      }
    }

    if (minList === -1) break;

    const flatIdx = lists.slice(0, minList).reduce((sum, l) => sum + l.length, 0) + ptrs[minList];
    result.push(minVal);
    ptrs[minList]++;

    yield {
      action: "found", indices: [flatIdx],
      snapshot: { type: 'array', data: [...flat] },
      meta: { line: 8, vars: { extracted: minVal, fromList: minList, merged: result.join(',') } }
    };
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...result] },
    meta: { line: 12, vars: { result: result.join(','), sorted: true } }
  };
}

export const mergeKSortedCode = `function mergeKSorted(lists) {
  let result = [];
  let ptrs = new Array(lists.length).fill(0);
  let total = lists.reduce((s, l) => s + l.length, 0);
  while (result.length < total) {
    let minVal = Infinity, minList = -1;
    for (let i = 0; i < lists.length; i++) {
      if (ptrs[i] < lists[i].length &&
          lists[i][ptrs[i]] < minVal) {
        minVal = lists[i][ptrs[i]];
        minList = i;
      }
    }
    result.push(minVal);
    ptrs[minList]++;
  }
  return result;
}`;
