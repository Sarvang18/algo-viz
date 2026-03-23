import type { Step, DSSnapshot } from '../Step';

export function* lcs(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const s1 = "ABCBDAB";
  const s2 = "BDCAB";
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  // Show characters of both strings
  const charDisplay: (string | number)[] = [...s1.split(''), '|', ...s2.split('')];
  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: charDisplay },
    meta: { line: 1, vars: { s1, s2, m, n } }
  };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const s1Idx = i - 1;
      const s2Idx = m + 1 + (j - 1); // offset past separator

      yield {
        action: "compare", indices: [s1Idx, s2Idx],
        snapshot: { type: 'array', data: charDisplay },
        meta: { line: 4, vars: { i, j, 's1[i-1]': s1[i - 1], 's2[j-1]': s2[j - 1] } }
      };

      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        yield {
          action: "found", indices: [s1Idx, s2Idx],
          snapshot: { type: 'array', data: charDisplay },
          meta: { line: 5, vars: { i, j, match: `${s1[i - 1]}==${s2[j - 1]}`, 'dp[i][j]': dp[i][j], lcsLen: dp[i][j] } }
        };
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        yield {
          action: "highlight", indices: [s1Idx, s2Idx],
          snapshot: { type: 'array', data: charDisplay },
          meta: { line: 7, vars: { i, j, noMatch: true, 'dp[i][j]': dp[i][j] } }
        };
      }
    }
  }

  // Backtrack to find the LCS string
  let lcsStr = '';
  let ci = m, cj = n;
  while (ci > 0 && cj > 0) {
    if (s1[ci - 1] === s2[cj - 1]) {
      lcsStr = s1[ci - 1] + lcsStr;
      ci--; cj--;
    } else if (dp[ci - 1][cj] > dp[ci][cj - 1]) {
      ci--;
    } else {
      cj--;
    }
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: charDisplay },
    meta: { line: 12, vars: { lcsLength: dp[m][n], lcsString: lcsStr } }
  };
}

export const lcsCode = `function lcs(s1, s2) {
  const m = s1.length, n = s2.length;
  let dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`;
