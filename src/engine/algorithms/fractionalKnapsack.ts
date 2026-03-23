import type { Step, DSSnapshot } from '../Step';

export function* fractionalKnapsack(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const values  = [60, 100, 120, 80, 50];
  const weights = [10, 20, 30, 15, 25];
  const W = 50;
  const n = values.length;

  // Compute value/weight ratios and sort by ratio descending
  const items = values.map((v, i) => ({ v, w: weights[i], ratio: v / weights[i], idx: i }));
  items.sort((a, b) => b.ratio - a.ratio);

  const ratioDisplay: number[] = items.map(it => Math.round(it.ratio * 10));

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: ratioDisplay },
    meta: { line: 1, vars: { capacity: W, items: n, info: 'Sorted by value/weight ratio' } }
  };

  let remaining = W;
  let totalValue = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    yield {
      action: "highlight", indices: [i],
      snapshot: { type: 'array', data: ratioDisplay },
      meta: { line: 4, vars: { item: i + 1, value: item.v, weight: item.w, ratio: item.ratio.toFixed(1), remaining } }
    };

    if (item.w <= remaining) {
      remaining -= item.w;
      totalValue += item.v;
      yield {
        action: "found", indices: [i],
        snapshot: { type: 'array', data: ratioDisplay },
        meta: { line: 6, vars: { taken: 'full', value: item.v, remaining, totalValue } }
      };
    } else {
      const fraction = remaining / item.w;
      totalValue += item.v * fraction;
      yield {
        action: "compare", indices: [i],
        snapshot: { type: 'array', data: ratioDisplay },
        meta: { line: 8, vars: { taken: `${(fraction * 100).toFixed(0)}%`, fractionalValue: (item.v * fraction).toFixed(1), totalValue: totalValue.toFixed(1) } }
      };
      remaining = 0;
      break;
    }
  }

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: ratioDisplay },
    meta: { line: 12, vars: { maxValue: totalValue.toFixed(1) } }
  };
}

export const fractionalKnapsackCode = `function fractionalKnapsack(values, weights, W) {
  let items = values.map((v, i) => ({v, w: weights[i], ratio: v / weights[i]}));
  items.sort((a, b) => b.ratio - a.ratio);
  let remaining = W, totalValue = 0;
  for (let item of items) {
    if (item.w <= remaining) {
      remaining -= item.w;
      totalValue += item.v;
    } else {
      totalValue += item.v * (remaining / item.w);
      break;
    }
  }
  return totalValue;
}`;
