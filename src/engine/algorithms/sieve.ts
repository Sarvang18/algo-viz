import type { Step, DSSnapshot } from '../Step';

export function* sieve(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const limit = 30;
  const isPrime = new Array(limit + 1).fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...isPrime] },
    meta: { line: 1, vars: { limit, info: '1 = prime candidate, 0 = not prime' } }
  };

  yield {
    action: "swap", indices: [0, 1],
    snapshot: { type: 'array', data: [...isPrime] },
    meta: { line: 2, vars: { '0': 'not prime', '1': 'not prime' } }
  };

  for (let p = 2; p * p <= limit; p++) {
    if (isPrime[p] === 0) continue;

    yield {
      action: "found", indices: [p],
      snapshot: { type: 'array', data: [...isPrime] },
      meta: { line: 4, vars: { prime: p, marking: `multiples of ${p}` } }
    };

    for (let j = p * p; j <= limit; j += p) {
      if (isPrime[j] === 1) {
        isPrime[j] = 0;

        yield {
          action: "swap", indices: [j],
          snapshot: { type: 'array', data: [...isPrime] },
          meta: { line: 6, vars: { composite: j, divisor: p, info: `${j} = ${p} × ${j / p}` } }
        };
      }
    }
  }

  // Collect all primes
  const primes = isPrime.map((v, i) => v === 1 ? i : -1).filter(x => x > 0);
  const primeIndices = primes.map(p => p);

  yield {
    action: "found", indices: primeIndices,
    snapshot: { type: 'array', data: [...isPrime] },
    meta: { line: 10, vars: { primes: primes.join(','), count: primes.length } }
  };
}

export const sieveCode = `function sieve(limit) {
  let isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= limit; p++) {
    if (!isPrime[p]) continue;
    for (let j = p * p; j <= limit; j += p) {
      isPrime[j] = false;
    }
  }
  return isPrime;
}`;
