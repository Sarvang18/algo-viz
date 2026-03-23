import type { Step, DSSnapshot } from '../Step';

export function* bitmaskDp(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  // Assignment Problem: n workers → n tasks, minimize total cost
  const cost = [
    [9, 2, 7, 8],
    [6, 4, 3, 7],
    [5, 8, 1, 8],
    [7, 6, 9, 4],
  ];
  const n = cost.length;
  const INF = 999;
  const totalMasks = 1 << n; // 16

  const dp: number[] = new Array(totalMasks).fill(INF);
  dp[0] = 0;

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...dp] },
    meta: { line: 1, vars: { workers: n, tasks: n, totalStates: totalMasks, problem: 'Min Cost Assignment (Bitmask DP)' } }
  };

  for (let mask = 0; mask < totalMasks; mask++) {
    if (dp[mask] === INF) continue;

    // Count bits set = which worker we're assigning
    let worker = 0;
    for (let b = 0; b < n; b++) {
      if (mask & (1 << b)) worker++;
    }
    if (worker >= n) continue;

    yield {
      action: "highlight", indices: [mask],
      snapshot: { type: 'array', data: [...dp] },
      meta: { line: 4, vars: { mask, binary: mask.toString(2).padStart(n, '0'), worker, 'dp[mask]': dp[mask] } }
    };

    for (let task = 0; task < n; task++) {
      if (mask & (1 << task)) continue; // task already assigned

      const newMask = mask | (1 << task);
      const newCost = dp[mask] + cost[worker][task];

      yield {
        action: "compare", indices: [mask, newMask],
        snapshot: { type: 'array', data: [...dp] },
        meta: { line: 7, vars: { worker, task, 'cost': cost[worker][task], currentCost: dp[newMask], newCost } }
      };

      if (newCost < dp[newMask]) {
        dp[newMask] = newCost;
        yield {
          action: "swap", indices: [newMask],
          snapshot: { type: 'array', data: [...dp] },
          meta: { line: 8, vars: { newMask, binary: newMask.toString(2).padStart(n, '0'), 'dp[newMask]': dp[newMask] } }
        };
      }
    }
  }

  yield {
    action: "found", indices: [totalMasks - 1],
    snapshot: { type: 'array', data: [...dp] },
    meta: { line: 12, vars: { minCost: dp[totalMasks - 1], allAssigned: (totalMasks - 1).toString(2).padStart(n, '0') } }
  };
}

export const bitmaskDpCode = `function minCostAssignment(cost) {
  const n = cost.length;
  const INF = Infinity;
  let dp = new Array(1 << n).fill(INF);
  dp[0] = 0;
  for (let mask = 0; mask < (1 << n); mask++) {
    if (dp[mask] === INF) continue;
    let worker = popcount(mask);
    for (let task = 0; task < n; task++) {
      if (mask & (1 << task)) continue;
      let newMask = mask | (1 << task);
      dp[newMask] = Math.min(dp[newMask],
        dp[mask] + cost[worker][task]);
    }
  }
  return dp[(1 << n) - 1];
}`;
