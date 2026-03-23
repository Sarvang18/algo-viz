import type { Step, DSSnapshot } from '../Step';

export function* factorial(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const n = Math.min(arr.length, 7); 
  const state = Array.from({length: n}, (_, i) => i + 1);
  
  yield {
    action: "custom",
    indices: [],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 1, vars: { n } }
  };

  function* fact(num: number): Generator<Step<DSSnapshot>, number, unknown> {
    const idx = num - 1;
    yield {
      action: "highlight",
      indices: [idx],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 2, vars: { num } }
    };

    if (num <= 1) {
      return 1;
    }
    const prev = yield* fact(num - 1);
    const product = num * prev;

    state[idx] = product;
    yield {
      action: "swap",
      indices: [idx],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 6, vars: { num, prev, product } }
    };

    return product;
  }

  const finalRes = yield* fact(n);

  yield {
    action: "found",
    indices: [n - 1],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 9, vars: { result: finalRes } }
  };
}

export const factorialCode = `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`;
