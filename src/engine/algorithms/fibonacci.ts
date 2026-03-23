import type { Step, DSSnapshot } from '../Step';

export function* fibonacci(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const n = Math.min(arr.length, 10);
  const state = Array(n).fill(0);
  
  yield {
    action: "custom",
    indices: [],
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 1, vars: { n } }
  };

  function* fib(i: number): Generator<Step<DSSnapshot>, number, unknown> {
    yield {
      action: "highlight",
      indices: [Math.min(i, n - 1)],
      snapshot: { type: 'array', data: [...state] },
      meta: { line: 2, vars: { i } }
    };

    if (i <= 1) {
      state[i] = i;  
      yield { action: "swap", indices: [i], snapshot: { type: 'array', data: [...state] }, meta: { line: 3, vars: { i, val: i } } };
      return i;
    }

    const a = yield* fib(i - 1);
    const b = yield* fib(i - 2);
    
    if (i < n) {
      state[i] = a + b;
      yield {
        action: "compare",
        indices: [i, i - 1, i - 2].filter(x => x >= 0 && x < n),
        snapshot: { type: 'array', data: [...state] },
        meta: { line: 6, vars: { i, a, b, "a+b": a + b } }
      };
    }
    
    return a + b;
  }

  const finalRes = yield* fib(n - 1);
  
  yield {
    action: "found",
    indices: Array.from({length: n}, (_, i) => i),
    snapshot: { type: 'array', data: [...state] },
    meta: { line: 10, vars: { result: finalRes } }
  };
}

export const fibonacciCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;
