import type { Step, DSSnapshot } from '../Step';

export function* activitySelection(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  // Activities: [start, end] sorted by end time
  const starts  = [1, 3, 0, 5, 8, 5];
  const ends    = [2, 4, 6, 7, 9, 9];
  const n = starts.length;

  // Display end times as the array (bar heights)
  const display: number[] = [...ends];

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...display] },
    meta: { line: 1, vars: { activities: n, info: 'Sorted by end time' } }
  };

  const selected: number[] = [0]; // first activity always selected

  yield {
    action: "found", indices: [0],
    snapshot: { type: 'array', data: [...display] },
    meta: { line: 3, vars: { selected: 1, lastEnd: ends[0], activity: `[${starts[0]},${ends[0]}]` } }
  };

  let lastEnd = ends[0];

  for (let i = 1; i < n; i++) {
    yield {
      action: "compare", indices: [i],
      snapshot: { type: 'array', data: [...display] },
      meta: { line: 5, vars: { i, start: starts[i], end: ends[i], lastEnd, compatible: starts[i] >= lastEnd } }
    };

    if (starts[i] >= lastEnd) {
      selected.push(i);
      lastEnd = ends[i];
      yield {
        action: "found", indices: [i],
        snapshot: { type: 'array', data: [...display] },
        meta: { line: 7, vars: { selected: selected.length, lastEnd, activity: `[${starts[i]},${ends[i]}]` } }
      };
    } else {
      yield {
        action: "swap", indices: [i],
        snapshot: { type: 'array', data: [...display] },
        meta: { line: 9, vars: { skipped: true, overlaps: `start ${starts[i]} < lastEnd ${lastEnd}` } }
      };
    }
  }

  yield {
    action: "found", indices: selected,
    snapshot: { type: 'array', data: [...display] },
    meta: { line: 11, vars: { totalSelected: selected.length, activities: selected.map(i => `[${starts[i]},${ends[i]}]`).join(' ') } }
  };
}

export const activitySelectionCode = `function activitySelection(starts, ends) {
  let n = starts.length;
  let selected = [0];
  let lastEnd = ends[0];
  for (let i = 1; i < n; i++) {
    if (starts[i] >= lastEnd) {
      selected.push(i);
      lastEnd = ends[i];
    }
  }
  return selected;
}`;
