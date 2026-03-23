import type { Step, DSSnapshot } from '../Step';

export function* threeSum(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  state.sort((a,b) => a-b);
  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 3, vars: { arr: "Sorted array" } } };
  for(let i=0; i<state.length-2; i++) {
    if (i > 0 && state[i] === state[i-1]) continue;
    let l = i+1, r = state.length-1;
    while(l < r) {
      const sum = state[i] + state[l] + state[r];
      yield { action: "highlight", indices: [i, l, r], snapshot: { type: 'array', data: [...state] }, meta: { line: 8, vars: { i, l, r, sum } } };
      if (sum === 0) {
        yield { action: "found", indices: [i, l, r], snapshot: { type: 'array', data: [...state] }, meta: { line: 10, vars: { result: "Triplet: " + state[i] + ", " + state[l] + ", " + state[r] } } };
        while(l < r && state[l] === state[l+1]) l++;
        while(l < r && state[r] === state[r-1]) r--;
        l++; r--;
      } else if (sum < 0) {
        l++;
      } else {
        r--;
      }
    }
  }
}

export const threeSumCode = `function threeSum(arr) {
  let ans = [];
  arr.sort((a,b) => a-b);
  for(let i=0; i<arr.length-2; i++) {
    if(i > 0 && arr[i] === arr[i-1]) continue;
    let l = i+1, r = arr.length-1;
    while(l < r) {
      let sum = arr[i] + arr[l] + arr[r];
      if(sum === 0) {
        ans.push([arr[i], arr[l], arr[r]]);
        while(l < r && arr[l] === arr[l+1]) l++;
        while(l < r && arr[r] === arr[r-1]) r--;
        l++; r--;
      } else if(sum < 0) l++;
      else r--;
    }
  }
  return ans;
}`;
