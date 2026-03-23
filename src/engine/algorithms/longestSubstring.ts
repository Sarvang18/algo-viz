import type { Step, DSSnapshot } from '../Step';

export function* longestSubstring(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  let maxLen = 0, start = 0;
  let seen = new Map<number, number>();
  
  for(let end=0; end<state.length; end++) {
    if (seen.has(state[end])) {
      start = Math.max(seen.get(state[end])! + 1, start);
    }
    yield { action: "highlight", indices: Array.from({length: end - start + 1}, (_, i) => start + i), snapshot: { type: 'array', data: [...state] }, meta: { line: 6, vars: { start, end, maxLen } } };
    seen.set(state[end], end);
    maxLen = Math.max(maxLen, end - start + 1);
    yield { action: "compare", indices: [start, end], snapshot: { type: 'array', data: [...state] }, meta: { line: 9, vars: { currentMaxLen: maxLen } } };
  }
}

export const longestSubstringCode = `function lengthOfLongestSubstring(s) {
  let maxLen = 0, start = 0;
  let seen = new Map();
  for(let end=0; end<s.length; end++) {
    if(seen.has(s[end])) start = Math.max(seen.get(s[end]) + 1, start);
    seen.set(s[end], end);
    maxLen = Math.max(maxLen, end - start + 1);
  }
  return maxLen;
}`;
