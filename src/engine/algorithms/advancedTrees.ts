import type { Step, DSSnapshot } from '../Step';

export function* segmentTree(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  if (arr.length === 0) return;
  const tree = Array(arr.length * 2 - 1).fill(0) as number[];

  function* build(node: number, left: number, right: number): Generator<Step<DSSnapshot>, number, unknown> {
    yield { action: 'highlight', indices: [node], snapshot: { type: 'array', data: [...tree] }, meta: { line: 3, vars: { node, range: `[${left}, ${right}]` } } };
    if (left === right) {
      tree[node] = arr[left];
      yield { action: 'found', indices: [node], snapshot: { type: 'array', data: [...tree] }, meta: { line: 5, vars: { node, leafValue: tree[node] } } };
      return tree[node];
    }
    const middle = Math.floor((left + right) / 2);
    const leftSum: number = yield* build(node * 2 + 1, left, middle);
    const rightSum: number = yield* build(node * 2 + 2, middle + 1, right);
    tree[node] = leftSum + rightSum;
    yield { action: 'compare', indices: [node, node * 2 + 1, node * 2 + 2], snapshot: { type: 'array', data: [...tree] }, meta: { line: 10, vars: { node, leftSum, rightSum, rangeSum: tree[node] } } };
    return tree[node];
  }

  yield { action: 'custom', indices: [], snapshot: { type: 'array', data: [...tree] }, meta: { line: 1, vars: { input: arr.join(', ') } } };
  const total = yield* build(0, 0, arr.length - 1);
  yield { action: 'found', indices: [0], snapshot: { type: 'array', data: [...tree] }, meta: { line: 14, vars: { totalRangeSum: total, result: tree } } };
}

export function* fenwickTree(arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  const tree = new Array(arr.length + 1).fill(0) as number[];
  yield { action: 'custom', indices: [], snapshot: { type: 'array', data: [...tree] }, meta: { line: 2, vars: { size: arr.length } } };
  for (let index = 0; index < arr.length; index++) {
    let treeIndex = index + 1;
    while (treeIndex <= arr.length) {
      tree[treeIndex] += arr[index];
      yield { action: 'highlight', indices: [treeIndex], snapshot: { type: 'array', data: [...tree] }, meta: { line: 6, vars: { inputIndex: index, value: arr[index], treeIndex } } };
      treeIndex += treeIndex & -treeIndex;
    }
  }
  yield { action: 'found', indices: Array.from({ length: arr.length }, (_, index) => index + 1), snapshot: { type: 'array', data: [...tree] }, meta: { line: 10, vars: { result: tree } } };
}

interface TrieNode {
  children: Map<string, TrieNode>;
  isWord: boolean;
}

const createTrieNode = (): TrieNode => ({ children: new Map(), isWord: false });

export function* trie(): Generator<Step<DSSnapshot>, void, unknown> {
  const words = ['algo', 'all', 'also', 'tree'];
  const root = createTrieNode();
  const prefixes: string[] = [];

  for (const word of words) {
    let node = root;
    let prefix = '';
    yield { action: 'custom', indices: [], snapshot: { type: 'array', data: [...word] }, meta: { line: 3, vars: { inserting: word } } };
    for (let index = 0; index < word.length; index++) {
      const character = word[index];
      prefix += character;
      if (!node.children.has(character)) node.children.set(character, createTrieNode());
      node = node.children.get(character)!;
      prefixes.push(prefix);
      yield { action: 'highlight', indices: [index], snapshot: { type: 'array', data: [...word] }, meta: { line: 7, vars: { character, prefix, newPrefixes: [...new Set(prefixes)].join(', ') } } };
    }
    node.isWord = true;
    yield { action: 'found', indices: Array.from({ length: word.length }, (_, index) => index), snapshot: { type: 'array', data: [...word] }, meta: { line: 11, vars: { completedWord: word } } };
  }
}

export const segmentTreeCode = `function buildSegmentTree(values) {
  const tree = Array(values.length * 2 - 1).fill(0);
  function build(node, left, right) {
    if (left === right) return tree[node] = values[left];
    const middle = Math.floor((left + right) / 2);
    const leftSum = build(node * 2 + 1, left, middle);
    const rightSum = build(node * 2 + 2, middle + 1, right);
    return tree[node] = leftSum + rightSum;
  }
  build(0, 0, values.length - 1);
  return tree;
}`;

export const fenwickTreeCode = `function buildFenwickTree(values) {
  const tree = Array(values.length + 1).fill(0);
  for (let index = 0; index < values.length; index++) {
    let treeIndex = index + 1;
    while (treeIndex <= values.length) {
      tree[treeIndex] += values[index];
      treeIndex += treeIndex & -treeIndex;
    }
  }
  return tree;
}`;

export const trieCode = `class Trie {
  constructor() { this.root = { children: new Map(), isWord: false }; }
  insert(word) {
    let node = this.root;
    for (const character of word) {
      if (!node.children.has(character))
        node.children.set(character, { children: new Map(), isWord: false });
      node = node.children.get(character);
    }
    node.isWord = true;
  }
  contains(word) {
    let node = this.root;
    for (const character of word) {
      if (!node.children.has(character)) return false;
      node = node.children.get(character);
    }
    return node.isWord;
  }
}`;
