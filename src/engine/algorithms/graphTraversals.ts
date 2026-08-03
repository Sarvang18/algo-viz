import type { Step, DSSnapshot } from '../Step';
import { graphSnapshot, outgoingEdges, traversalEdges } from './graphData.ts';

export function* bfs(): Generator<Step<DSSnapshot>, void, unknown> {
  const queue = ['0'];
  const visited = new Set(queue);

  yield { action: 'custom', indices: [], snapshot: graphSnapshot(traversalEdges, true), meta: { line: 2, vars: { queue: 'A' } } };

  while (queue.length > 0) {
    const node = queue.shift()!;
    yield { action: 'visit', indices: [node], snapshot: graphSnapshot(traversalEdges, true), meta: { line: 4, vars: { visiting: node, queue: queue.join(', ') || 'empty' } } };

    for (const edge of outgoingEdges(traversalEdges, node)) {
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      queue.push(edge.to);
      yield { action: 'highlight', indices: [edge.id, edge.to], snapshot: graphSnapshot(traversalEdges, true), meta: { line: 7, vars: { discovered: edge.to, queue: queue.join(', ') } } };
    }
  }

  yield { action: 'found', indices: [...visited], snapshot: graphSnapshot(traversalEdges, true), meta: { line: 10, vars: { traversal: [...visited].join(' → ') } } };
}

export function* dfs(): Generator<Step<DSSnapshot>, void, unknown> {
  const visited = new Set<string>();
  const order: string[] = [];

  function* explore(node: string): Generator<Step<DSSnapshot>, void, unknown> {
    visited.add(node);
    order.push(node);
    yield { action: 'visit', indices: [node], snapshot: graphSnapshot(traversalEdges, true), meta: { line: 3, vars: { visiting: node, depthFirstOrder: order.join(' → ') } } };

    for (const edge of outgoingEdges(traversalEdges, node)) {
      if (visited.has(edge.to)) continue;
      yield { action: 'highlight', indices: [edge.id], snapshot: graphSnapshot(traversalEdges, true), meta: { line: 6, vars: { traversing: `${edge.from} → ${edge.to}` } } };
      yield* explore(edge.to);
    }
  }

  yield { action: 'custom', indices: [], snapshot: graphSnapshot(traversalEdges, true), meta: { line: 1, vars: { start: '0' } } };
  yield* explore('0');
  yield { action: 'found', indices: order, snapshot: graphSnapshot(traversalEdges, true), meta: { line: 10, vars: { traversal: order.join(' → ') } } };
}

export const bfsCode = `function bfs(graph, start) {
  const queue = [start], visited = new Set([start]);
  while (queue.length) {
    const node = queue.shift();
    for (const next of graph[node]) {
      if (visited.has(next)) continue;
      visited.add(next);
      queue.push(next);
    }
  }
  return [...visited];
}`;

export const dfsCode = `function dfs(graph, start) {
  const visited = new Set(), order = [];
  function explore(node) {
    visited.add(node);
    order.push(node);
    for (const next of graph[node]) {
      if (!visited.has(next)) explore(next);
    }
  }
  explore(start);
  return order;
}`;
