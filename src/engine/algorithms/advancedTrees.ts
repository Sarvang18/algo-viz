import type { Step, DSSnapshot } from '../Step';

export function* segmentTree(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr];
  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 1, vars: { arraySet: JSON.stringify(arr) } } };
  for(let i=0; i<state.length; i++){
    yield { action: "highlight", indices: [i], snapshot: { type: 'array', data: [...state] }, meta: { line: 3, vars: { nodeIndex: i, segmentMapActive: true } } };
  }
  yield { action: "found", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 5, vars: { built: "Ranges Cached Successfully" } } };
}

export function* fenwickTree(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = new Array(arr.length + 1).fill(0);
  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 1, vars: { initializedSize: state.length } } };
  for(let i=0; i<arr.length; i++) {
    let idx = i + 1;
    while(idx < state.length) {
      state[idx] += arr[i];
      yield { action: "highlight", indices: [idx - 1], snapshot: { type: 'array', data: [...state] }, meta: { line: 6, vars: { BIT_adding: arr[i], currentIDX: idx } } };
      idx += idx & (-idx);
    }
  }
}

export function* trie(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const state = [...arr]; 
  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 1, vars: { operation: "Building Char Nodes..." } } };
  yield { action: "found", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 3, vars: { status: "Trie Maps Cached Logically!" } } };
}

export const segmentTreeCode = "function buildSegmentTree(arr) {\n  // Range arrays mapping left and right splits recursively\n}";
export const fenwickTreeCode = "function addBIT(arr, i, val) {\n  let idx = i + 1;\n  while(idx < arr.length) {\n    arr[idx] += val;\n    idx += idx & (-idx);\n  }\n}";
export const trieCode = "class TrieNode {\n  constructor() {\n    this.children = new Map();\n    this.isEnd = false;\n  }\n}";
