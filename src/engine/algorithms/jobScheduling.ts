import type { Step, DSSnapshot } from '../Step';

export function* jobScheduling(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  // Jobs: [id, deadline, profit] — sorted by profit descending
  const profits   = [100, 80, 60, 40, 20, 10];
  const deadlines = [2, 1, 2, 1, 3, 1];
  const n = profits.length;

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...profits] },
    meta: { line: 1, vars: { jobs: n, info: 'Sorted by profit (descending)' } }
  };

  const maxDeadline = Math.max(...deadlines);
  const slots: (number | string)[] = new Array(maxDeadline).fill('-');
  let totalProfit = 0;

  for (let i = 0; i < n; i++) {
    yield {
      action: "highlight", indices: [i],
      snapshot: { type: 'array', data: [...profits] },
      meta: { line: 4, vars: { job: i + 1, profit: profits[i], deadline: deadlines[i] } }
    };

    // Try to schedule this job in the latest available slot before its deadline
    let scheduled = false;
    for (let j = deadlines[i] - 1; j >= 0; j--) {
      if (slots[j] === '-') {
        slots[j] = profits[i];
        totalProfit += profits[i];
        scheduled = true;

        yield {
          action: "found", indices: [i],
          snapshot: { type: 'array', data: [...profits] },
          meta: { line: 7, vars: { job: i + 1, slot: j + 1, profit: profits[i], totalProfit, schedule: slots.join(',') } }
        };
        break;
      }
    }

    if (!scheduled) {
      yield {
        action: "swap", indices: [i],
        snapshot: { type: 'array', data: [...profits] },
        meta: { line: 10, vars: { job: i + 1, skipped: 'No available slot', profit: profits[i] } }
      };
    }
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: slots.map(s => s === '-' ? 0 : s) as number[] },
    meta: { line: 13, vars: { totalProfit, scheduledSlots: slots.join(',') } }
  };
}

export const jobSchedulingCode = `function jobScheduling(profits, deadlines) {
  let n = profits.length;
  let maxD = Math.max(...deadlines);
  let slots = new Array(maxD).fill(-1);
  let totalProfit = 0;
  for (let i = 0; i < n; i++) {
    for (let j = deadlines[i] - 1; j >= 0; j--) {
      if (slots[j] === -1) {
        slots[j] = i;
        totalProfit += profits[i];
        break;
      }
    }
  }
  return totalProfit;
}`;
