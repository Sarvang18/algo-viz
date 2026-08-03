import type { Step, DSSnapshot, DSNode, TreeInput } from '../Step';

const copyTree = (input: TreeInput): TreeInput => ({
  root: input.root,
  nodes: Object.fromEntries(Object.entries(input.nodes).map(([id, node]) => [id, { ...node }])),
});

const snapshot = (root: string | null, nodes: Record<string, DSNode>): DSSnapshot => ({
  type: 'tree',
  root,
  nodes: Object.fromEntries(Object.entries(nodes).map(([id, node]) => [id, { ...node }])),
});

export function* levelOrder(input: TreeInput): Generator<Step<DSSnapshot>, void, unknown> {
  const { root, nodes } = copyTree(input);
  if (!root) return;
  const queue = [root];
  const order: string[] = [];
  yield { action: 'custom', indices: [], snapshot: snapshot(root, nodes), meta: { line: 2, vars: { queue: root } } };
  while (queue.length) {
    const current = queue.shift()!;
    order.push(current);
    yield { action: 'visit', indices: [current], snapshot: snapshot(root, nodes), meta: { line: 4, vars: { visiting: nodes[current].value, queue: queue.join(', ') || 'empty' } } };
    if (nodes[current].left) queue.push(nodes[current].left);
    if (nodes[current].right) queue.push(nodes[current].right);
  }
  yield { action: 'found', indices: order, snapshot: snapshot(root, nodes), meta: { line: 9, vars: { result: order.map((id) => nodes[id].value) } } };
}

export function* heightDepth(input: TreeInput): Generator<Step<DSSnapshot>, void, unknown> {
  const { root, nodes } = copyTree(input);
  function* height(id: string | undefined): Generator<Step<DSSnapshot>, number, unknown> {
    if (!id) return 0;
    yield { action: 'visit', indices: [id], snapshot: snapshot(root, nodes), meta: { line: 3, vars: { visiting: nodes[id].value } } };
    const left: number = yield* height(nodes[id].left);
    const right: number = yield* height(nodes[id].right);
    const result = Math.max(left, right) + 1;
    yield { action: 'compare', indices: [id], snapshot: snapshot(root, nodes), meta: { line: 6, vars: { node: nodes[id].value, left, right, height: result } } };
    return result;
  }
  const result = root ? yield* height(root) : 0;
  yield { action: 'found', indices: root ? [root] : [], snapshot: snapshot(root, nodes), meta: { line: 9, vars: { result } } };
}

export function* diameter(input: TreeInput): Generator<Step<DSSnapshot>, void, unknown> {
  const { root, nodes } = copyTree(input);
  let diameterEdges = 0;
  function* height(id: string | undefined): Generator<Step<DSSnapshot>, number, unknown> {
    if (!id) return 0;
    yield { action: 'visit', indices: [id], snapshot: snapshot(root, nodes), meta: { line: 4, vars: { visiting: nodes[id].value } } };
    const left: number = yield* height(nodes[id].left);
    const right: number = yield* height(nodes[id].right);
    diameterEdges = Math.max(diameterEdges, left + right);
    yield { action: 'compare', indices: [id], snapshot: snapshot(root, nodes), meta: { line: 8, vars: { left, right, diameterEdges } } };
    return Math.max(left, right) + 1;
  }
  if (root) yield* height(root);
  yield { action: 'found', indices: root ? [root] : [], snapshot: snapshot(root, nodes), meta: { line: 12, vars: { result: diameterEdges } } };
}

export function* lca(input: TreeInput): Generator<Step<DSSnapshot>, void, unknown> {
  const { root, nodes } = copyTree(input);
  const leaves = Object.values(nodes).filter((node) => !node.left && !node.right).map((node) => node.id);
  const first = leaves[0] ?? root;
  const second = leaves[1] ?? root;

  function* find(id: string | undefined): Generator<Step<DSSnapshot>, string | null, unknown> {
    if (!id) return null;
    yield { action: 'visit', indices: [id], snapshot: snapshot(root, nodes), meta: { line: 4, vars: { visiting: nodes[id].value, first, second } } };
    if (id === first || id === second) return id;
    const left: string | null = yield* find(nodes[id].left);
    const right: string | null = yield* find(nodes[id].right);
    if (left && right) {
      yield { action: 'found', indices: [id, first ?? '', second ?? ''].filter(Boolean), snapshot: snapshot(root, nodes), meta: { line: 9, vars: { ancestor: nodes[id].value } } };
      return id;
    }
    return left ?? right;
  }

  const result = root ? yield* find(root) : null;
  yield { action: 'found', indices: result ? [result] : [], snapshot: snapshot(root, nodes), meta: { line: 13, vars: { result: result ? nodes[result].value : null } } };
}

export function* balancedTree(input: TreeInput): Generator<Step<DSSnapshot>, void, unknown> {
  const { root, nodes } = copyTree(input);
  function* height(id: string | undefined): Generator<Step<DSSnapshot>, number, unknown> {
    if (!id) return 0;
    yield { action: 'visit', indices: [id], snapshot: snapshot(root, nodes), meta: { line: 3, vars: { visiting: nodes[id].value } } };
    const left: number = yield* height(nodes[id].left);
    const right: number = yield* height(nodes[id].right);
    const current = left < 0 || right < 0 || Math.abs(left - right) > 1 ? -1 : Math.max(left, right) + 1;
    yield { action: current < 0 ? 'swap' : 'compare', indices: [id], snapshot: snapshot(root, nodes), meta: { line: 7, vars: { left, right, balanced: current >= 0 } } };
    return current;
  }
  const result = root ? (yield* height(root)) >= 0 : true;
  yield { action: result ? 'found' : 'swap', indices: root ? [root] : [], snapshot: snapshot(root, nodes), meta: { line: 10, vars: { result } } };
}

export function* bstInsert(input: TreeInput): Generator<Step<DSSnapshot>, void, unknown> {
  const { root, nodes } = copyTree(input);
  const numericValues = Object.values(nodes).map((node) => Number(node.value));
  const target = Math.max(...numericValues) + 5;
  if (!root) return;
  let current = root;
  let nextId = `inserted-${target}`;

  while (true) {
    yield { action: 'visit', indices: [current], snapshot: snapshot(root, nodes), meta: { line: 4, vars: { current: nodes[current].value, target } } };
    const direction = target < Number(nodes[current].value) ? 'left' : 'right';
    const child = nodes[current][direction];
    if (!child) {
      while (nodes[nextId]) nextId += '-1';
      nodes[nextId] = { id: nextId, value: target };
      nodes[current][direction] = nextId;
      yield { action: 'found', indices: [current, nextId], snapshot: snapshot(root, nodes), meta: { line: 8, vars: { inserted: target, parent: nodes[current].value, direction } } };
      return;
    }
    current = child;
  }
}

export function* kthSmallest(input: TreeInput): Generator<Step<DSSnapshot>, void, unknown> {
  const { root, nodes } = copyTree(input);
  const total = Object.keys(nodes).length;
  const targetRank = Math.min(3, total);
  let visited = 0;
  let result: string | null = null;

  function* traverse(id: string | undefined): Generator<Step<DSSnapshot>, void, unknown> {
    if (!id || result) return;
    yield* traverse(nodes[id].left);
    if (result) return;
    visited++;
    yield { action: 'visit', indices: [id], snapshot: snapshot(root, nodes), meta: { line: 6, vars: { rank: visited, targetRank, value: nodes[id].value } } };
    if (visited === targetRank) {
      result = id;
      yield { action: 'found', indices: [id], snapshot: snapshot(root, nodes), meta: { line: 8, vars: { result: nodes[id].value } } };
      return;
    }
    yield* traverse(nodes[id].right);
  }
  if (root) yield* traverse(root);
}

interface AvlNode {
  value: number;
  height: number;
  left: AvlNode | null;
  right: AvlNode | null;
}

const avlHeight = (node: AvlNode | null): number => node?.height ?? 0;
const updateHeight = (node: AvlNode): void => { node.height = Math.max(avlHeight(node.left), avlHeight(node.right)) + 1; };

const rotateRight = (root: AvlNode): AvlNode => {
  const pivot = root.left!;
  root.left = pivot.right;
  pivot.right = root;
  updateHeight(root);
  updateHeight(pivot);
  return pivot;
};

const rotateLeft = (root: AvlNode): AvlNode => {
  const pivot = root.right!;
  root.right = pivot.left;
  pivot.left = root;
  updateHeight(root);
  updateHeight(pivot);
  return pivot;
};

const insertAvl = (node: AvlNode | null, value: number): AvlNode => {
  if (!node) return { value, height: 1, left: null, right: null };
  if (value < node.value) node.left = insertAvl(node.left, value);
  else if (value > node.value) node.right = insertAvl(node.right, value);
  else return node;
  updateHeight(node);
  const balance = avlHeight(node.left) - avlHeight(node.right);
  if (balance > 1 && value < node.left!.value) return rotateRight(node);
  if (balance < -1 && value > node.right!.value) return rotateLeft(node);
  if (balance > 1 && value > node.left!.value) {
    node.left = rotateLeft(node.left!);
    return rotateRight(node);
  }
  if (balance < -1 && value < node.right!.value) {
    node.right = rotateRight(node.right!);
    return rotateLeft(node);
  }
  return node;
};

const avlSnapshot = (root: AvlNode | null): DSSnapshot => {
  const nodes: Record<string, DSNode> = {};
  const visit = (node: AvlNode | null, id: string): string | undefined => {
    if (!node) return undefined;
    const left = visit(node.left, `${id}L`);
    const right = visit(node.right, `${id}R`);
    nodes[id] = { id, value: node.value, left, right };
    return id;
  };
  const rootId = visit(root, 'root') ?? null;
  return { type: 'tree', root: rootId, nodes };
};

export function* avlTree(input: TreeInput): Generator<Step<DSSnapshot>, void, unknown> {
  const values = [...new Set(Object.values(input.nodes).map((node) => Number(node.value)))];
  let root: AvlNode | null = null;
  for (const value of values) {
    root = insertAvl(root, value);
    yield { action: 'found', indices: ['root'], snapshot: avlSnapshot(root), meta: { line: 5, vars: { inserted: value, root: root.value, height: root.height } } };
  }
  yield { action: 'found', indices: ['root'], snapshot: avlSnapshot(root), meta: { line: 9, vars: { result: 'Height-balanced AVL tree', height: avlHeight(root) } } };
}

export const levelOrderCode = `function levelOrder(root) {
  if (!root) return [];
  const queue = [root], order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return order;
}`;

export const heightDepthCode = `function height(root) {
  if (!root) return 0;
  return Math.max(height(root.left), height(root.right)) + 1;
}`;

export const diameterCode = `function diameter(root) {
  let result = 0;
  function height(node) {
    if (!node) return 0;
    const left = height(node.left), right = height(node.right);
    result = Math.max(result, left + right);
    return Math.max(left, right) + 1;
  }
  height(root);
  return result;
}`;

export const lcaCode = `function lowestCommonAncestor(root, first, second) {
  if (!root || root === first || root === second) return root;
  const left = lowestCommonAncestor(root.left, first, second);
  const right = lowestCommonAncestor(root.right, first, second);
  if (left && right) return root;
  return left ?? right;
}`;

export const balancedTreeCode = `function isBalanced(root) {
  function height(node) {
    if (!node) return 0;
    const left = height(node.left), right = height(node.right);
    if (left < 0 || right < 0 || Math.abs(left - right) > 1) return -1;
    return Math.max(left, right) + 1;
  }
  return height(root) >= 0;
}`;

export const bstInsertCode = `function insertBst(root, value) {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) root.left = insertBst(root.left, value);
  else if (value > root.value) root.right = insertBst(root.right, value);
  return root;
}`;

export const kthSmallestCode = `function kthSmallest(root, k) {
  const stack = [];
  let node = root;
  while (stack.length || node) {
    while (node) { stack.push(node); node = node.left; }
    node = stack.pop();
    if (--k === 0) return node.value;
    node = node.right;
  }
  return null;
}`;

export const avlTreeCode = `function insertAvl(root, value) {
  if (!root) return new AvlNode(value);
  if (value < root.value) root.left = insertAvl(root.left, value);
  else if (value > root.value) root.right = insertAvl(root.right, value);
  else return root;
  updateHeight(root);
  const balance = height(root.left) - height(root.right);
  if (balance > 1 && value < root.left.value) return rotateRight(root);
  if (balance < -1 && value > root.right.value) return rotateLeft(root);
  if (balance > 1) { root.left = rotateLeft(root.left); return rotateRight(root); }
  if (balance < -1) { root.right = rotateRight(root.right); return rotateLeft(root); }
  return root;
}`;
