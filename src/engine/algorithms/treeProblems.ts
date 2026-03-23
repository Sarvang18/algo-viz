import type { Step, DSSnapshot, DSNode } from '../Step';

const buildTree = () => ({
  '1': { id: '1', value: 50, left: '2', right: '3' },
  '2': { id: '2', value: 25, left: '4', right: '5' },
  '3': { id: '3', value: 75, left: '6', right: '7' },
  '4': { id: '4', value: 12 },
  '5': { id: '5', value: 37 },
  '6': { id: '6', value: 62 },
  '7': { id: '7', value: 87 },
} as Record<string, DSNode>);

export function* levelOrder(): Generator<Step<DSSnapshot>, void, unknown> {
  const nodes = buildTree();
  yield { action: "custom", indices: [], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 1, vars: {} } };
  const queue = ['1'];
  while(queue.length > 0) {
    const curr = queue.shift()!;
    yield { action: "visit", indices: [curr], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 4, vars: { visiting: curr } } };
    if(nodes[curr].left) queue.push(nodes[curr].left!);
    if(nodes[curr].right) queue.push(nodes[curr].right!);
  }
}

export function* heightDepth(): Generator<Step<DSSnapshot>, void, unknown> {
  const nodes = buildTree();
  function* dfs(id: string): Generator<Step<DSSnapshot>, number, unknown> {
    if(!id) return 0;
    yield { action: "visit", indices: [id], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 2, vars: { node: id } } };
    const l: number = nodes[id].left ? yield* dfs(nodes[id].left!) : 0;
    const r: number = nodes[id].right ? yield* dfs(nodes[id].right!) : 0;
    yield { action: "compare", indices: [id], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 5, vars: { height: Math.max(l, r) + 1 } } };
    return Math.max(l, r) + 1;
  }
  yield* dfs('1');
}

export function* diameter(): Generator<Step<DSSnapshot>, void, unknown> {
  const nodes = buildTree();
  let maxD = 0;
  function* dfs(id: string): Generator<Step<DSSnapshot>, number, unknown> {
    if(!id) return 0;
    yield { action: "visit", indices: [id], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 4, vars: { node: id } } };
    const l: number = nodes[id].left ? yield* dfs(nodes[id].left!) : 0;
    const r: number = nodes[id].right ? yield* dfs(nodes[id].right!) : 0;
    maxD = Math.max(maxD, l + r);
    yield { action: "found", indices: [id], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 8, vars: { maxD } } };
    return Math.max(l, r) + 1;
  }
  yield* dfs('1');
}

export function* lca(): Generator<Step<DSSnapshot>, void, unknown> {
  const nodes = buildTree();
  const p = '4', q = '5';
  function* dfs(id: string | undefined): Generator<Step<DSSnapshot>, string | null, unknown> {
    if(!id) return null;
    yield { action: "visit", indices: [id], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 3, vars: { node: id } } };
    if(id === p || id === q) return id;
    const l = yield* dfs(nodes[id].left);
    const r = yield* dfs(nodes[id].right);
    if(l && r) {
      yield { action: "found", indices: [id], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 8, vars: { lca: id } } };
      return id;
    }
    return l ? l : r;
  }
  yield* dfs('1');
}

export function* balancedTree(): Generator<Step<DSSnapshot>, void, unknown> {
  const nodes = buildTree();
  function* dfs(id: string | undefined): Generator<Step<DSSnapshot>, number, unknown> {
    if(!id) return 0;
    yield { action: "visit", indices: [id], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 2, vars: { node: id } } };
    const l = yield* dfs(nodes[id].left);
    const r = yield* dfs(nodes[id].right);
    if(l === -1 || r === -1 || Math.abs(l - r) > 1) return -1;
    yield { action: "compare", indices: [id], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 7, vars: { height: Math.max(l, r) + 1 } } };
    return Math.max(l, r) + 1;
  }
  yield* dfs('1');
}

export function* bstInsert(): Generator<Step<DSSnapshot>, void, unknown> {
  const nodes = buildTree();
  const target = 65;
  let curr = '1';
  while(curr) {
    yield { action: "visit", indices: [curr], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 4, vars: { curr: nodes[curr].value, target } } };
    if((nodes[curr].value as number) > target) {
      if(!nodes[curr].left) {
        nodes['8'] = { id: '8', value: target };
        nodes[curr].left = '8';
        yield { action: "found", indices: ['8'], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 7, vars: { inserted: target } } };
        break;
      }
      curr = nodes[curr].left!;
    } else {
      if(!nodes[curr].right) {
        nodes['8'] = { id: '8', value: target };
        nodes[curr].right = '8';
        yield { action: "found", indices: ['8'], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 12, vars: { inserted: target } } };
        break;
      }
      curr = nodes[curr].right!;
    }
  }
}

export function* kthSmallest(): Generator<Step<DSSnapshot>, void, unknown> {
  const nodes = buildTree();
  let k = 3;
  function* inOrder(id: string | undefined): Generator<Step<DSSnapshot>, void, unknown> {
    if(!id) return;
    yield* inOrder(nodes[id].left);
    k--;
    yield { action: "visit", indices: [id], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 6, vars: { k_remaining: k } } };
    if(k === 0) {
      yield { action: "found", indices: [id], snapshot: { type: 'tree', root: '1', nodes }, meta: { line: 8, vars: { result: nodes[id].value } } };
      return;
    }
    yield* inOrder(nodes[id].right);
  }
  yield* inOrder('1');
}

export function* avlTree(): Generator<Step<DSSnapshot>, void, unknown> {
  yield* bstInsert();
}

export const levelOrderCode = "function levelOrder(root) {\n  let queue = [root];\n  while(queue.length) {\n    let curr = queue.shift();\n    if(curr.left) queue.push(curr.left);\n    if(curr.right) queue.push(curr.right);\n  }\n}";
export const heightDepthCode = "function height(root) {\n  if(!root) return 0;\n  return Math.max(height(root.left), height(root.right)) + 1;\n}";
export const diameterCode = "function diameter(root) {\n  let maxD = 0;\n  function dfs(node) {\n    if(!node) return 0;\n    let l = dfs(node.left);\n    let r = dfs(node.right);\n    maxD = Math.max(maxD, l + r);\n    return Math.max(l, r) + 1;\n  }\n  dfs(root);\n  return maxD;\n}";
export const lcaCode = "function lca(root, p, q) {\n  if(!root) return null;\n  if(root === p || root === q) return root;\n  let l = lca(root.left, p, q);\n  let r = lca(root.right, p, q);\n  if(l && r) return root;\n  return l ? l : r;\n}";
export const balancedTreeCode = "function isBalanced(root) {\n  function dfs(node) {\n    if(!node) return 0;\n    let l = dfs(node.left);\n    let r = dfs(node.right);\n    if(l === -1 || r === -1 || Math.abs(l - r) > 1) return -1;\n    return Math.max(l, r) + 1;\n  }\n  return dfs(root) !== -1;\n}";
export const bstInsertCode = "function insertBST(root, val) {\n  if(!root) return new TreeNode(val);\n  if(val < root.val) root.left = insertBST(root.left, val);\n  else root.right = insertBST(root.right, val);\n  return root;\n}";
export const kthSmallestCode = "function kthSmallest(root, k) {\n  let res = null;\n  function inOrder(node) {\n    if(!node) return;\n    inOrder(node.left);\n    k--;\n    if(k === 0) res = node.val;\n    inOrder(node.right);\n  }\n  inOrder(root);\n  return res;\n}";
export const avlTreeCode = "function insertAVL(root, val) {\n  // Standard BST insert followed by balancing rotations\n  return root;\n}";
