import type { Step, DSSnapshot } from '../Step';

export function* gcd(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const pairs: [number, number][] = [[48, 18], [56, 98], [270, 192], [105, 252]];

  const display = pairs.map(([a, _b]) => a);

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...display] },
    meta: { line: 1, vars: { pairs: pairs.map(([a, b]) => `gcd(${a},${b})`).join(', ') } }
  };

  for (let idx = 0; idx < pairs.length; idx++) {
    let [a, b] = pairs[idx];
    const origA = a, origB = b;

    yield {
      action: "highlight", indices: [idx],
      snapshot: { type: 'array', data: [...display] },
      meta: { line: 3, vars: { computing: `gcd(${a}, ${b})` } }
    };

    let step = 0;
    while (b !== 0) {
      step++;
      const remainder = a % b;

      yield {
        action: "compare", indices: [idx],
        snapshot: { type: 'array', data: [...display] },
        meta: { line: 5, vars: { step, a, b, 'a % b': remainder, operation: `${a} mod ${b} = ${remainder}` } }
      };

      a = b;
      b = remainder;
    }

    display[idx] = a;

    yield {
      action: "found", indices: [idx],
      snapshot: { type: 'array', data: [...display] },
      meta: { line: 8, vars: { result: `gcd(${origA}, ${origB}) = ${a}`, steps: step } }
    };
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...display] },
    meta: { line: 10, vars: { results: display.join(',') } }
  };
}

export const gcdCode = `function gcd(a, b) {
  // Euclidean Algorithm
  while (b !== 0) {
    let remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}`;
