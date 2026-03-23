import type { Step, DSSnapshot } from '../Step';

export function* knapsack(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const weights = [2, 3, 4, 5];
  const values  = [3, 4, 5, 6];
  const W = 8;
  const n = weights.length;
  const dp: number[] = new Array(W + 1).fill(0);

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...dp] },
    meta: { line: 1, vars: { capacity: W, items: n, weights: weights.join(','), values: values.join(',') } }
  };

  for (let i = 0; i < n; i++) {
    yield {
      action: "highlight", indices: [],
      snapshot: { type: 'array', data: [...dp] },
      meta: { line: 3, vars: { item: i + 1, weight: weights[i], value: values[i] } }
    };

    for (let w = W; w >= weights[i]; w--) {
      const newVal = dp[w - weights[i]] + values[i];

      yield {
        action: "compare", indices: [w, w - weights[i]],
        snapshot: { type: 'array', data: [...dp] },
        meta: { line: 5, vars: { item: i + 1, w, 'dp[w]': dp[w], 'dp[w-wt]+val': newVal } }
      };

      if (newVal > dp[w]) {
        dp[w] = newVal;
        yield {
          action: "swap", indices: [w],
          snapshot: { type: 'array', data: [...dp] },
          meta: { line: 6, vars: { w, 'dp[w]': dp[w], updated: true } }
        };
      }
    }

    yield {
      action: "found", indices: [W],
      snapshot: { type: 'array', data: [...dp] },
      meta: { line: 8, vars: { afterItem: i + 1, bestSoFar: dp[W] } }
    };
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...dp] },
    meta: { line: 10, vars: { result: dp[W] } }
  };
}

export const knapsackCode = `function knapsack(weights, values, W) {
  const n = weights.length;
  let dp = new Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let w = W; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[W];
}`;
