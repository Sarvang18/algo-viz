import type { Step, DSSnapshot } from '../Step';

export function* subsetsBits(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const set = [1, 2, 3, 4];
  const n = set.length;
  const total = 1 << n; // 2^n = 16

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...set] },
    meta: { line: 1, vars: { set: set.join(','), n, totalSubsets: total } }
  };

  for (let mask = 0; mask < total; mask++) {
    const subset: number[] = [];
    const highlighted: number[] = [];

    for (let bit = 0; bit < n; bit++) {
      if (mask & (1 << bit)) {
        subset.push(set[bit]);
        highlighted.push(bit);
      }
    }

    yield {
      action: highlighted.length > 0 ? "highlight" : "custom",
      indices: highlighted,
      snapshot: { type: 'array', data: [...set] },
      meta: { line: 4, vars: { mask, binary: mask.toString(2).padStart(n, '0'), subset: `{${subset.join(',')}}` } }
    };

    if (highlighted.length === n) {
      yield {
        action: "found", indices: highlighted,
        snapshot: { type: 'array', data: [...set] },
        meta: { line: 6, vars: { mask, fullSet: true, subset: `{${subset.join(',')}}` } }
      };
    }
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...set] },
    meta: { line: 9, vars: { totalGenerated: total, info: 'All 2^n subsets generated' } }
  };
}

export const subsetsBitsCode = `function generateSubsets(set) {
  let n = set.length;
  let subsets = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    let subset = [];
    for (let bit = 0; bit < n; bit++) {
      if (mask & (1 << bit)) {
        subset.push(set[bit]);
      }
    }
    subsets.push(subset);
  }
  return subsets;
}`;
