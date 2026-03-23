import type { Step, DSSnapshot } from '../Step';

export function* editDistance(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const s1 = "KITTEN";
  const s2 = "SITTING";
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  // Initialize base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  const charDisplay: (string | number)[] = [...s1.split(''), '|', ...s2.split('')];

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: charDisplay },
    meta: { line: 1, vars: { s1, s2, m, n } }
  };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const s1Idx = i - 1;
      const s2Idx = m + 1 + (j - 1);

      yield {
        action: "compare", indices: [s1Idx, s2Idx],
        snapshot: { type: 'array', data: charDisplay },
        meta: { line: 5, vars: { i, j, 's1[i-1]': s1[i - 1], 's2[j-1]': s2[j - 1] } }
      };

      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        yield {
          action: "found", indices: [s1Idx, s2Idx],
          snapshot: { type: 'array', data: charDisplay },
          meta: { line: 6, vars: { match: true, cost: 0, 'dp[i][j]': dp[i][j] } }
        };
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        const op = dp[i][j] === dp[i - 1][j - 1] + 1 ? 'Replace'
                 : dp[i][j] === dp[i - 1][j] + 1 ? 'Delete' : 'Insert';
        yield {
          action: "swap", indices: [s1Idx, s2Idx],
          snapshot: { type: 'array', data: charDisplay },
          meta: { line: 8, vars: { operation: op, cost: 1, 'dp[i][j]': dp[i][j] } }
        };
      }
    }
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: charDisplay },
    meta: { line: 12, vars: { editDistance: dp[m][n], s1, s2 } }
  };
}

export const editDistanceCode = `function editDistance(s1, s2) {
  const m = s1.length, n = s2.length;
  let dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // Delete
          dp[i][j - 1],     // Insert
          dp[i - 1][j - 1]  // Replace
        );
      }
    }
  }
  return dp[m][n];
}`;
