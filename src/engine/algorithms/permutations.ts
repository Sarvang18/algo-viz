import type { Step, DSSnapshot } from '../Step';

export function* permutations(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr].slice(0, 4); // Limit to 4 executing 24 sequences cleanly instead of crashing at 10!
  let result: number[][] = [];
  
  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 1, vars: { input: JSON.stringify(state) } } };

  function* backtrack(first: number): Generator<Step<DSSnapshot>, void, unknown> {
    if (first === state.length) {
      result.push([...state]);
      yield { action: "found", indices: Array.from({length: state.length}, (_,i)=>i), snapshot: { type: 'array', data: [...state] }, meta: { line: 3, vars: { Found: JSON.stringify([...state]), TotalPermutations: result.length } } };
      return;
    }

    for (let i = first; i < state.length; i++) {
      yield { action: "highlight", indices: [first, i], snapshot: { type: 'array', data: [...state] }, meta: { line: 6, vars: { first, indexI: i } } };
      
      const temp1 = state[first]; state[first] = state[i]; state[i] = temp1;
      yield { action: "swap", indices: [first, i], snapshot: { type: 'array', data: [...state] }, meta: { line: 8, vars: { status: "Swapped", sequence: JSON.stringify([...state]) } } };
      
      yield* backtrack(first + 1);
      
      const temp2 = state[first]; state[first] = state[i]; state[i] = temp2;
      yield { action: "compare", indices: [first, i], snapshot: { type: 'array', data: [...state] }, meta: { line: 11, vars: { status: "Backtracked", sequence: JSON.stringify([...state]) } } };
    }
  }

  yield* backtrack(0);
}

export const permutationsCode = `function permute(nums) {
  let result = [];
  
  function backtrack(first) {
    if (first === nums.length) {
      result.push([...nums]);
      return;
    }
    for (let i = first; i < nums.length; i++) {
      [nums[first], nums[i]] = [nums[i], nums[first]];
      backtrack(first + 1);
      [nums[first], nums[i]] = [nums[i], nums[first]];
    }
  }
  
  backtrack(0);
  return result;
}`;
