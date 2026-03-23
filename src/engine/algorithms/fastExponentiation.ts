import type { Step, DSSnapshot } from '../Step';

export function* fastExponentiation(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  // Compute base^exp step by step using binary exponentiation
  const base = 2;
  const exp = 10;

  const powers: number[] = [];
  let p = base;
  let e = exp;

  // Precompute all squared powers needed
  while (e > 0) {
    powers.push(p);
    p = p * p;
    e = Math.floor(e / 2);
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...powers] },
    meta: { line: 1, vars: { base, exp, problem: `${base}^${exp}`, method: 'Binary Exponentiation' } }
  };

  let result = 1;
  let currentBase = base;
  let remaining = exp;
  let step = 0;

  while (remaining > 0) {
    step++;
    const useBit = remaining % 2 === 1;

    yield {
      action: "compare", indices: [step - 1 < powers.length ? step - 1 : powers.length - 1],
      snapshot: { type: 'array', data: [...powers] },
      meta: { line: 4, vars: { step, remaining, bit: remaining % 2, currentBase, result } }
    };

    if (useBit) {
      result *= currentBase;
      yield {
        action: "found", indices: [step - 1 < powers.length ? step - 1 : powers.length - 1],
        snapshot: { type: 'array', data: [...powers] },
        meta: { line: 6, vars: { multiply: `result × ${currentBase}`, result, bit: 1 } }
      };
    } else {
      yield {
        action: "highlight", indices: [step - 1 < powers.length ? step - 1 : powers.length - 1],
        snapshot: { type: 'array', data: [...powers] },
        meta: { line: 8, vars: { skip: 'bit is 0', result } }
      };
    }

    currentBase *= currentBase;
    remaining = Math.floor(remaining / 2);

    yield {
      action: "swap", indices: [step - 1 < powers.length ? step - 1 : powers.length - 1],
      snapshot: { type: 'array', data: [...powers] },
      meta: { line: 9, vars: { squared: currentBase, remainingExp: remaining } }
    };
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...powers] },
    meta: { line: 12, vars: { result, answer: `${base}^${exp} = ${result}`, steps: step } }
  };
}

export const fastExponentiationCode = `function fastPow(base, exp) {
  let result = 1;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result *= base;
    }
    base *= base;
    exp = Math.floor(exp / 2);
  }
  return result;
}`;
