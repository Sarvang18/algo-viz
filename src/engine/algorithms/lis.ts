import type { Step, DSSnapshot } from '../Step';

export function* lis(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const input = [...arr];
  const n = input.length;
  const dp: number[] = new Array(n).fill(1);

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...input] },
    meta: { line: 1, vars: { n, info: 'dp[] initialized to 1 for each element' } }
  };

  let maxLen = 1;

  for (let i = 1; i < n; i++) {
    yield {
      action: "highlight", indices: [i],
      snapshot: { type: 'array', data: [...input] },
      meta: { line: 3, vars: { i, 'arr[i]': input[i], 'dp[i]': dp[i] } }
    };

    for (let j = 0; j < i; j++) {
      yield {
        action: "compare", indices: [j, i],
        snapshot: { type: 'array', data: [...input] },
        meta: { line: 5, vars: { i, j, 'arr[j]': input[j], 'arr[i]': input[i], 'dp[j]': dp[j], 'dp[i]': dp[i] } }
      };

      if (input[j] < input[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        yield {
          action: "swap", indices: [i],
          snapshot: { type: 'array', data: [...input] },
          meta: { line: 6, vars: { i, j, 'dp[i]': dp[i], extended: `${input[j]} → ${input[i]}` } }
        };
      }
    }

    maxLen = Math.max(maxLen, dp[i]);
    yield {
      action: "found", indices: [i],
      snapshot: { type: 'array', data: [...input] },
      meta: { line: 8, vars: { i, 'dp[i]': dp[i], maxLIS: maxLen } }
    };
  }

  // Highlight the LIS elements
  const lisIndices: number[] = [];
  let curLen = maxLen;
  for (let i = n - 1; i >= 0; i--) {
    if (dp[i] === curLen) {
      lisIndices.unshift(i);
      curLen--;
    }
  }

  yield {
    action: "found", indices: lisIndices,
    snapshot: { type: 'array', data: [...input] },
    meta: { line: 10, vars: { lisLength: maxLen, lis: lisIndices.map(i => input[i]).join(',') } }
  };
}

export const lisCode = `function lis(arr) {
  const n = arr.length;
  let dp = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
}`;
