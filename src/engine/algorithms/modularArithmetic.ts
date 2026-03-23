import type { Step, DSSnapshot } from '../Step';

export function* modularArithmetic(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  // Demonstrate modular exponentiation: compute (base^exp) mod m
  const base = 3;
  const exp = 13;
  const mod = 1000;

  // Show the binary expansion of exponent
  const expBinary = exp.toString(2);
  const bits = expBinary.split('').map(Number);

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...bits] },
    meta: { line: 1, vars: { base, exp, mod, binary: expBinary, problem: `${base}^${exp} mod ${mod}` } }
  };

  let result = 1;
  let power = base % mod;

  for (let i = bits.length - 1; i >= 0; i--) {
    const bit = bits[i];

    yield {
      action: "highlight", indices: [i],
      snapshot: { type: 'array', data: [...bits] },
      meta: { line: 4, vars: { bitPosition: bits.length - 1 - i, bit, currentResult: result, currentPower: power } }
    };

    if (bit === 1) {
      result = (result * power) % mod;
      yield {
        action: "found", indices: [i],
        snapshot: { type: 'array', data: [...bits] },
        meta: { line: 6, vars: { multiply: true, result, 'result * power % mod': result } }
      };
    } else {
      yield {
        action: "compare", indices: [i],
        snapshot: { type: 'array', data: [...bits] },
        meta: { line: 8, vars: { bit: 0, skipped: 'bit is 0' } }
      };
    }

    power = (power * power) % mod;

    yield {
      action: "swap", indices: [i],
      snapshot: { type: 'array', data: [...bits] },
      meta: { line: 9, vars: { 'power²': power, squaring: `${Math.sqrt(power)} → ${power}` } }
    };
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...bits] },
    meta: { line: 12, vars: { result, answer: `${base}^${exp} mod ${mod} = ${result}` } }
  };
}

export const modularArithmeticCode = `function modPow(base, exp, mod) {
  let result = 1;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }
  return result;
}`;
