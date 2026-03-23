import type { Step, DSSnapshot, DSNode } from '../Step';

export function* treeTraversals(
  input: { root: string | null, nodes: Record<string, DSNode> },
  mode: 'pre' | 'in' | 'post'
): Generator<Step<DSSnapshot>, void, unknown> {
  const { root, nodes: nodesMap } = input;
  const nodes = JSON.parse(JSON.stringify(nodesMap));

  yield {
    action: "custom",
    indices: [],
    snapshot: { type: 'tree', root, nodes },
    meta: { line: 1, vars: {} }
  };

  function* traverse(nodeId: string | null): Generator<Step<DSSnapshot>, void, unknown> {
    if (!nodeId) return;

    yield {
      action: "compare",
      indices: [nodeId],
      snapshot: { type: 'tree', root, nodes },
      meta: { line: 3, vars: { curr: nodeId, value: nodes[nodeId].value } }
    };

    if (mode === 'pre') {
      yield {
        action: "found",
        indices: [nodeId],
        snapshot: { type: 'tree', root, nodes },
        meta: { line: 6, vars: { visited: nodeId, value: nodes[nodeId].value } }
      };
    }

    if (nodes[nodeId].left) yield* traverse(nodes[nodeId].left!);

    if (mode === 'in') {
      yield {
        action: "found",
        indices: [nodeId],
        snapshot: { type: 'tree', root, nodes },
        meta: { line: 11, vars: { visited: nodeId, value: nodes[nodeId].value } }
      };
    }

    if (nodes[nodeId].right) yield* traverse(nodes[nodeId].right!);

    if (mode === 'post') {
      yield {
        action: "found",
        indices: [nodeId],
        snapshot: { type: 'tree', root, nodes },
        meta: { line: 16, vars: { visited: nodeId, value: nodes[nodeId].value } }
      };
    }
  }

  yield* traverse(root);
  
  yield {
    action: "custom",
    indices: [],
    snapshot: { type: 'tree', root, nodes },
    meta: { line: 20, vars: { result: "Done" } }
  };
}

export function* preorder(input: any) { yield* treeTraversals(input, 'pre'); }
export function* inorder(input: any) { yield* treeTraversals(input, 'in'); }
export function* postorder(input: any) { yield* treeTraversals(input, 'post'); }

export const treeTraversalsCode = `function traverse(root, mode) {
  function dfs(node) {
    if (!node) return;
    
    // PRE-ORDER
    if (mode === 'pre') visit(node);
    
    dfs(node.left);
    
    // IN-ORDER
    if (mode === 'in') visit(node);
    
    dfs(node.right);
    
    // POST-ORDER
    if (mode === 'post') visit(node);
  }

  dfs(root);
}`;
