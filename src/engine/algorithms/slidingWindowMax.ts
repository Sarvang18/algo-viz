import type { Step, DSSnapshot } from '../Step';

export function* slidingWindowMax(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const values = [...arr];
  const windowSize = Math.min(3, values.length);
  const deque: number[] = [];
  const maxima: number[] = [];

  for (let right = 0; right < values.length; right++) {
    while (deque.length && deque[0] <= right - windowSize) deque.shift();
    while (deque.length && values[deque.at(-1)!] <= values[right]) deque.pop();
    deque.push(right);
    yield { action: 'highlight', indices: [...deque], snapshot: { type: 'array', data: [...values] }, meta: { line: 6, vars: { right, deque: deque.join(', '), windowSize } } };
    if (right >= windowSize - 1) {
      maxima.push(values[deque[0]]);
      yield { action: 'found', indices: [deque[0]], snapshot: { type: 'array', data: [...values] }, meta: { line: 9, vars: { windowMaximum: values[deque[0]], maxima: maxima.join(', ') } } };
    }
  }
}

export const slidingWindowMaxCode = `function slidingWindowMaximum(values, windowSize) {
  const deque = [], result = [];
  for (let right = 0; right < values.length; right++) {
    while (deque.length && deque[0] <= right - windowSize) deque.shift();
    while (deque.length && values[deque.at(-1)] <= values[right]) deque.pop();
    deque.push(right);
    if (right >= windowSize - 1) result.push(values[deque[0]]);
  }
  return result;
}`;
