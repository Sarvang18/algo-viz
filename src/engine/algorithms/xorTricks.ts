import type { Step, DSSnapshot } from '../Step';

export function* xorTricks(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  // Find the single number in array where every other appears twice
  const nums = [4, 1, 2, 1, 2, 3, 4];
  const n = nums.length;

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...nums] },
    meta: { line: 1, vars: { n, problem: 'Find single number (XOR all)' } }
  };

  let result = 0;

  for (let i = 0; i < n; i++) {
    const prevResult = result;
    result ^= nums[i];

    yield {
      action: "compare", indices: [i],
      snapshot: { type: 'array', data: [...nums] },
      meta: { line: 4, vars: { i, 'nums[i]': nums[i], prevXOR: prevResult, binary: prevResult.toString(2).padStart(4, '0'), newXOR: result, newBinary: result.toString(2).padStart(4, '0') } }
    };

    if (result !== prevResult + nums[i]) {
      yield {
        action: "highlight", indices: [i],
        snapshot: { type: 'array', data: [...nums] },
        meta: { line: 5, vars: { xorResult: result, binary: result.toString(2).padStart(4, '0'), info: `XOR cancels duplicates` } }
      };
    }
  }

  // Find the answer in the array and highlight it
  const ansIdx = nums.indexOf(result);
  yield {
    action: "found", indices: [ansIdx],
    snapshot: { type: 'array', data: [...nums] },
    meta: { line: 8, vars: { singleNumber: result, binary: result.toString(2).padStart(4, '0') } }
  };
}

export const xorTricksCode = `function findSingle(nums) {
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    result ^= nums[i];
    // XOR with itself = 0
    // Duplicates cancel out
  }
  return result;
}`;
