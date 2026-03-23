import type { Step, DSSnapshot } from '../Step';

export function* subsetGen(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const nums = [...arr].slice(0, 4); // Limit scaling safely.
  const state: number[] = [];
  let subsets: number[][] = [];

  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 1, vars: { targetSet: JSON.stringify(nums) } } };

  function* backtrack(start: number): Generator<Step<DSSnapshot>, void, unknown> {
    subsets.push([...state]);
    yield { action: "found", indices: Array.from({length: state.length}, (_,i)=>i), snapshot: { type: 'array', data: [...state] }, meta: { line: 3, vars: { SubsetAdded: JSON.stringify([...state]) } } };

    for (let i = start; i < nums.length; i++) {
      state.push(nums[i]);
      yield { action: "compare", indices: [state.length - 1], snapshot: { type: 'array', data: [...state] }, meta: { line: 6, vars: { indexI: i, pushing: nums[i] } } };
      
      yield* backtrack(i + 1);
      
      const popped = state.pop();
      yield { action: "swap", indices: [state.length], snapshot: { type: 'array', data: [...state] }, meta: { line: 9, vars: { indexI: i, popping: popped, returning_to_state: JSON.stringify([...state]) } } };
    }
  }

  yield* backtrack(0);
}

export const subsetGenCode = `function subsets(nums) {
  let res = [];
  function backtrack(start, currentSubset) {
    res.push([...currentSubset]);
    for (let i = start; i < nums.length; i++) {
      currentSubset.push(nums[i]);
      backtrack(i + 1, currentSubset);
      currentSubset.pop();
    }
  }
  backtrack(0, []);
  return res;
}`;
