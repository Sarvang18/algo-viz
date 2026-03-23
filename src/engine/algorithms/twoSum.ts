import type { Step, DSSnapshot } from '../Step';

export function* twoSum(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  const target = state[0] + state[state.length - 1]; // Arbitrary target guaranteed to exist
  let left = 0, right = state.length - 1;
  state.sort((a,b) => a-b);
  
  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 3, vars: { target } } };
  
  while(left < right) {
    const sum = state[left] + state[right];
    yield { action: "highlight", indices: [left, right], snapshot: { type: 'array', data: [...state] }, meta: { line: 6, vars: { left, right, sum, target } } };
    if (sum === target) {
      yield { action: "found", indices: [left, right], snapshot: { type: 'array', data: [...state] }, meta: { line: 8, vars: { result: "Values: " + state[left] + ", " + state[right] } } };
      return;
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
}

export const twoSumCode = `function twoSum(arr, target) {
  let left = 0, right = arr.length - 1;
  arr.sort((a, b) => a - b);
  while (left < right) {
    let sum = arr[left] + arr[right];
    if (sum === target) return [arr[left], arr[right]];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}`;
