import type { Step, DSSnapshot, DSNode } from '../Step';

export function* dpTrees(input: { root: string, nodes: Record<string, DSNode> }): Generator<Step<DSSnapshot>, void, unknown> {
  const nodes = JSON.parse(JSON.stringify(input.nodes)) as Record<string, DSNode>;
  const root = input.root;

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'tree', root, nodes },
    meta: { line: 1, vars: { problem: 'Max Root-to-Leaf Path Sum' } }
  };

  const dpVals: Record<string, number> = {};

  function* solve(nodeId: string | undefined): Generator<Step<DSSnapshot>, number, unknown> {
    if (!nodeId || !nodes[nodeId]) return 0;

    const node = nodes[nodeId];

    yield {
      action: "highlight", indices: [nodeId],
      snapshot: { type: 'tree', root, nodes },
      meta: { line: 3, vars: { visiting: nodeId, value: node.value } }
    };

    const leftVal: number = node.left ? yield* solve(node.left) : 0;
    const rightVal: number = node.right ? yield* solve(node.right) : 0;

    const val = (typeof node.value === 'number' ? node.value : 0);
    dpVals[nodeId] = val + Math.max(leftVal, rightVal);

    yield {
      action: "compare", indices: [nodeId],
      snapshot: { type: 'tree', root, nodes },
      meta: { line: 6, vars: { node: nodeId, value: val, leftMax: leftVal, rightMax: rightVal, 'dp[node]': dpVals[nodeId] } }
    };

    yield {
      action: "found", indices: [nodeId],
      snapshot: { type: 'tree', root, nodes },
      meta: { line: 7, vars: { node: nodeId, 'dp[node]': dpVals[nodeId], bestChild: Math.max(leftVal, rightVal) } }
    };

    return dpVals[nodeId];
  }

  const result: number = yield* solve(root);

  yield {
    action: "found", indices: [root],
    snapshot: { type: 'tree', root, nodes },
    meta: { line: 10, vars: { maxPathSum: result } }
  };
}

export const dpTreesCode = `function maxPathSum(root) {
  if (!root) return 0;
  function solve(node) {
    if (!node) return 0;
    let left = solve(node.left);
    let right = solve(node.right);
    return node.value + Math.max(left, right);
  }
  return solve(root);
}`;
