import type { Step, DSSnapshot } from '../Step';

export function* powerOf2(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const testNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 32, 64];

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...testNumbers] },
    meta: { line: 1, vars: { checking: testNumbers.length, trick: 'n & (n-1) === 0' } }
  };

  for (let i = 0; i < testNumbers.length; i++) {
    const num = testNumbers[i];
    const isPow2 = num > 0 && (num & (num - 1)) === 0;

    yield {
      action: "compare", indices: [i],
      snapshot: { type: 'array', data: [...testNumbers] },
      meta: { line: 3, vars: { n: num, binary: num.toString(2), 'n-1': num - 1, 'n-1_binary': (num - 1).toString(2), 'n&(n-1)': num & (num - 1) } }
    };

    if (isPow2) {
      yield {
        action: "found", indices: [i],
        snapshot: { type: 'array', data: [...testNumbers] },
        meta: { line: 5, vars: { n: num, isPowerOf2: true, binary: num.toString(2), info: 'Only 1 bit set' } }
      };
    } else {
      yield {
        action: "swap", indices: [i],
        snapshot: { type: 'array', data: [...testNumbers] },
        meta: { line: 7, vars: { n: num, isPowerOf2: false, binary: num.toString(2), bitCount: num.toString(2).split('').filter((b: string) => b === '1').length } }
      };
    }
  }

  const powersFound = testNumbers.filter(n => n > 0 && (n & (n - 1)) === 0);
  const powIndices = testNumbers.map((n, i) => n > 0 && (n & (n - 1)) === 0 ? i : -1).filter(i => i !== -1);

  yield {
    action: "found", indices: powIndices,
    snapshot: { type: 'array', data: [...testNumbers] },
    meta: { line: 10, vars: { powersOf2: powersFound.join(','), count: powersFound.length } }
  };
}

export const powerOf2Code = `function isPowerOf2(n) {
  // If n is a power of 2, it has exactly one bit set
  // n & (n-1) clears the lowest set bit
  // If result is 0, only one bit was set
  return n > 0 && (n & (n - 1)) === 0;
}

function checkAll(numbers) {
  return numbers.filter(n => isPowerOf2(n));
}`;
