import type { Step, DSSnapshot } from '../Step';

export function* climbingStairs(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const n = 10;
  const dp: number[] = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...dp] },
    meta: { line: 1, vars: { n, 'dp[0]': 1, 'dp[1]': 1 } }
  };

  yield {
    action: "highlight", indices: [0, 1],
    snapshot: { type: 'array', data: [...dp] },
    meta: { line: 3, vars: { 'dp[0]': 1, 'dp[1]': 1, info: 'Base cases' } }
  };

  for (let i = 2; i <= n; i++) {
    yield {
      action: "compare", indices: [i - 1, i - 2],
      snapshot: { type: 'array', data: [...dp] },
      meta: { line: 5, vars: { i, 'dp[i-1]': dp[i - 1], 'dp[i-2]': dp[i - 2] } }
    };

    dp[i] = dp[i - 1] + dp[i - 2];

    yield {
      action: "found", indices: [i],
      snapshot: { type: 'array', data: [...dp] },
      meta: { line: 6, vars: { i, 'dp[i]': dp[i], ways: `${dp[i]} ways to reach step ${i}` } }
    };
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...dp] },
    meta: { line: 8, vars: { result: dp[n], info: `${dp[n]} ways to climb ${n} stairs` } }
  };
}

export const climbingStairsCode = `function climbStairs(n) {
  let dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`;
