import type { GraphEdge, Step, DSSnapshot } from '../Step';
import {
  bridgeEdges,
  dagEdges,
  graphNodes,
  graphSnapshot,
  incidentEdges,
  oppositeNode,
  outgoingEdges,
  sccEdges,
  weightedUndirectedEdges,
} from './graphData.ts';

class DisjointSet {
  private readonly parent: number[];
  private readonly rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, index) => index);
    this.rank = Array(size).fill(0);
  }

  find(value: number): number {
    if (this.parent[value] !== value) this.parent[value] = this.find(this.parent[value]);
    return this.parent[value];
  }

  union(first: number, second: number): boolean {
    let rootA = this.find(first);
    let rootB = this.find(second);
    if (rootA === rootB) return false;
    if (this.rank[rootA] < this.rank[rootB]) [rootA, rootB] = [rootB, rootA];
    this.parent[rootB] = rootA;
    if (this.rank[rootA] === this.rank[rootB]) this.rank[rootA]++;
    return true;
  }

  roots(): number[] {
    return this.parent.map((_, index) => this.find(index));
  }
}

export function* kruskal(): Generator<Step<DSSnapshot>, void, unknown> {
  const dsu = new DisjointSet(graphNodes.length);
  const selected: GraphEdge[] = [];
  const sorted = [...weightedUndirectedEdges].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));

  yield { action: 'custom', indices: [], snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 2, vars: { operation: 'Sort edges by weight' } } };
  for (const edge of sorted) {
    yield { action: 'compare', indices: [edge.id], snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 5, vars: { edge: edge.id, weight: edge.weight } } };
    if (dsu.union(Number(edge.from), Number(edge.to))) {
      selected.push(edge);
      yield { action: 'found', indices: selected.map((item) => item.id), snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 7, vars: { accepted: edge.id, totalWeight: selected.reduce((sum, item) => sum + (item.weight ?? 0), 0) } } };
      if (selected.length === graphNodes.length - 1) break;
    }
  }
  yield { action: 'found', indices: selected.map((edge) => edge.id), snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 11, vars: { mstEdges: selected.map((edge) => edge.id).join(', '), result: selected.map((edge) => edge.id) } } };
}

export function* prim(): Generator<Step<DSSnapshot>, void, unknown> {
  const visited = new Set(['0']);
  const selected: GraphEdge[] = [];

  yield { action: 'visit', indices: ['0'], snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 2, vars: { start: 'A' } } };
  while (visited.size < graphNodes.length) {
    const candidates = weightedUndirectedEdges.filter((edge) => visited.has(edge.from) !== visited.has(edge.to));
    const edge = candidates.reduce<GraphEdge | null>((best, candidate) =>
      !best || (candidate.weight ?? 0) < (best.weight ?? 0) ? candidate : best, null);
    if (!edge) break;
    yield { action: 'compare', indices: candidates.map((candidate) => candidate.id), snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 5, vars: { frontier: candidates.map((candidate) => candidate.id).join(', ') } } };
    selected.push(edge);
    visited.add(visited.has(edge.from) ? edge.to : edge.from);
    yield { action: 'found', indices: [...selected.map((item) => item.id), ...visited], snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 8, vars: { selected: edge.id, totalWeight: selected.reduce((sum, item) => sum + (item.weight ?? 0), 0) } } };
  }
  yield { action: 'found', indices: selected.map((edge) => edge.id), snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 11, vars: { mstEdges: selected.map((edge) => edge.id).join(', '), result: selected.map((edge) => edge.id) } } };
}

export function* kahn(): Generator<Step<DSSnapshot>, void, unknown> {
  const indegree = Array(graphNodes.length).fill(0) as number[];
  for (const edge of dagEdges) indegree[Number(edge.to)]++;
  const queue = graphNodes.filter((node) => indegree[Number(node.id)] === 0).map((node) => node.id);
  const order: string[] = [];

  yield { action: 'custom', indices: queue, snapshot: graphSnapshot(dagEdges, true), meta: { line: 3, vars: { indegree: indegree.join(', '), queue: queue.join(', ') } } };
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    yield { action: 'visit', indices: [node], snapshot: graphSnapshot(dagEdges, true), meta: { line: 5, vars: { removed: node, order: order.join(' → ') } } };
    for (const edge of outgoingEdges(dagEdges, node)) {
      indegree[Number(edge.to)]--;
      if (indegree[Number(edge.to)] === 0) queue.push(edge.to);
      yield { action: 'highlight', indices: [edge.id, edge.to], snapshot: graphSnapshot(dagEdges, true), meta: { line: 8, vars: { edge: edge.id, indegree: indegree.join(', '), queue: queue.join(', ') || 'empty' } } };
    }
  }
  yield { action: order.length === graphNodes.length ? 'found' : 'swap', indices: order, snapshot: graphSnapshot(dagEdges, true), meta: { line: 12, vars: { hasCycle: order.length !== graphNodes.length, result: order } } };
}

export function* dfsTopo(): Generator<Step<DSSnapshot>, void, unknown> {
  const visited = new Set<string>();
  const order: string[] = [];

  function* visit(node: string): Generator<Step<DSSnapshot>, void, unknown> {
    visited.add(node);
    yield { action: 'visit', indices: [node], snapshot: graphSnapshot(dagEdges, true), meta: { line: 4, vars: { entering: node } } };
    for (const edge of outgoingEdges(dagEdges, node)) {
      if (!visited.has(edge.to)) {
        yield { action: 'highlight', indices: [edge.id], snapshot: graphSnapshot(dagEdges, true), meta: { line: 6, vars: { edge: edge.id } } };
        yield* visit(edge.to);
      }
    }
    order.push(node);
    yield { action: 'compare', indices: [node], snapshot: graphSnapshot(dagEdges, true), meta: { line: 9, vars: { pushed: node, stack: order.join(', ') } } };
  }

  for (const node of graphNodes) if (!visited.has(node.id)) yield* visit(node.id);
  order.reverse();
  yield { action: 'found', indices: order, snapshot: graphSnapshot(dagEdges, true), meta: { line: 13, vars: { result: order } } };
}

export function* unionFind(): Generator<Step<DSSnapshot>, void, unknown> {
  const dsu = new DisjointSet(graphNodes.length);
  yield { action: 'custom', indices: [], snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 2, vars: { parents: dsu.roots().join(', ') } } };
  for (const edge of weightedUndirectedEdges) {
    const rootA = dsu.find(Number(edge.from));
    const rootB = dsu.find(Number(edge.to));
    yield { action: 'compare', indices: [edge.id, edge.from, edge.to], snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 5, vars: { edge: edge.id, rootA, rootB } } };
    if (dsu.union(Number(edge.from), Number(edge.to))) {
      yield { action: 'highlight', indices: [edge.id], snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 7, vars: { union: edge.id, parents: dsu.roots().join(', ') } } };
    }
  }
  yield { action: 'found', indices: graphNodes.map((node) => node.id), snapshot: graphSnapshot(weightedUndirectedEdges, false), meta: { line: 10, vars: { components: new Set(dsu.roots()).size, result: dsu.roots() } } };
}

export function* tarjan(): Generator<Step<DSSnapshot>, void, unknown> {
  const discovery = Array(graphNodes.length).fill(-1) as number[];
  const low = Array(graphNodes.length).fill(-1) as number[];
  const stack: string[] = [];
  const onStack = new Set<string>();
  const components: string[][] = [];
  let time = 0;

  function* visit(node: string): Generator<Step<DSSnapshot>, void, unknown> {
    const index = Number(node);
    discovery[index] = low[index] = time++;
    stack.push(node);
    onStack.add(node);
    yield { action: 'visit', indices: [node], snapshot: graphSnapshot(sccEdges, true), meta: { line: 5, vars: { node, discovery: discovery[index], stack: stack.join(', ') } } };

    for (const edge of outgoingEdges(sccEdges, node)) {
      const next = Number(edge.to);
      if (discovery[next] === -1) {
        yield { action: 'highlight', indices: [edge.id], snapshot: graphSnapshot(sccEdges, true), meta: { line: 8, vars: { treeEdge: edge.id } } };
        yield* visit(edge.to);
        low[index] = Math.min(low[index], low[next]);
      } else if (onStack.has(edge.to)) {
        low[index] = Math.min(low[index], discovery[next]);
      }
    }

    if (low[index] === discovery[index]) {
      const component: string[] = [];
      let current: string;
      do {
        current = stack.pop()!;
        onStack.delete(current);
        component.push(current);
      } while (current !== node);
      components.push(component);
      yield { action: 'found', indices: component, snapshot: graphSnapshot(sccEdges, true), meta: { line: 16, vars: { component: component.join(', '), totalComponents: components.length } } };
    }
  }

  for (const node of graphNodes) if (discovery[Number(node.id)] === -1) yield* visit(node.id);
  yield { action: 'found', indices: graphNodes.map((node) => node.id), snapshot: graphSnapshot(sccEdges, true), meta: { line: 20, vars: { result: components } } };
}

export function* bridges(): Generator<Step<DSSnapshot>, void, unknown> {
  const discovery = Array(graphNodes.length).fill(-1) as number[];
  const low = Array(graphNodes.length).fill(-1) as number[];
  const foundBridges: string[] = [];
  const articulation = new Set<string>();
  let time = 0;

  function* visit(node: string, parent: string | null): Generator<Step<DSSnapshot>, void, unknown> {
    const nodeIndex = Number(node);
    discovery[nodeIndex] = low[nodeIndex] = time++;
    let childCount = 0;
    yield { action: 'visit', indices: [node], snapshot: graphSnapshot(bridgeEdges, false), meta: { line: 4, vars: { node, discovery: discovery[nodeIndex] } } };

    for (const edge of incidentEdges(bridgeEdges, node)) {
      const next = oppositeNode(edge, node);
      if (next === parent) continue;
      const nextIndex = Number(next);
      if (discovery[nextIndex] === -1) {
        childCount++;
        yield { action: 'highlight', indices: [edge.id], snapshot: graphSnapshot(bridgeEdges, false), meta: { line: 8, vars: { treeEdge: edge.id } } };
        yield* visit(next, node);
        low[nodeIndex] = Math.min(low[nodeIndex], low[nextIndex]);
        if (low[nextIndex] > discovery[nodeIndex]) {
          foundBridges.push(edge.id);
          yield { action: 'found', indices: [...foundBridges], snapshot: graphSnapshot(bridgeEdges, false), meta: { line: 12, vars: { bridge: edge.id } } };
        }
        if (parent !== null && low[nextIndex] >= discovery[nodeIndex]) articulation.add(node);
      } else {
        low[nodeIndex] = Math.min(low[nodeIndex], discovery[nextIndex]);
      }
    }
    if (parent === null && childCount > 1) articulation.add(node);
  }

  yield* visit('0', null);
  yield { action: 'found', indices: [...foundBridges, ...articulation], snapshot: graphSnapshot(bridgeEdges, false), meta: { line: 19, vars: { bridges: foundBridges.join(', '), articulationPoints: [...articulation].join(', '), result: foundBridges } } };
}

export const kruskalCode = `function kruskal(edges, vertexCount) {
  const dsu = new DisjointSet(vertexCount), mst = [];
  edges.sort((a, b) => a.weight - b.weight);
  for (const edge of edges) {
    if (dsu.union(edge.from, edge.to)) mst.push(edge);
    if (mst.length === vertexCount - 1) break;
  }
  return mst;
}`;

export const primCode = `function prim(graph, start) {
  const visited = new Set([start]), mst = [];
  while (visited.size < graph.length) {
    const candidates = allCrossingEdges(graph, visited);
    const edge = candidates.reduce((a, b) => a.weight < b.weight ? a : b);
    mst.push(edge);
    visited.add(visited.has(edge.from) ? edge.to : edge.from);
  }
  return mst;
}`;

export const kahnCode = `function kahn(graph) {
  const indegree = Array(graph.length).fill(0), order = [];
  for (const edges of graph) for (const next of edges) indegree[next]++;
  const queue = indegree.flatMap((degree, node) => degree === 0 ? [node] : []);
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const next of graph[node]) if (--indegree[next] === 0) queue.push(next);
  }
  return order.length === graph.length ? order : null;
}`;

export const dfsTopoCode = `function topologicalSort(graph) {
  const visited = new Set(), order = [];
  function visit(node) {
    visited.add(node);
    for (const next of graph[node]) if (!visited.has(next)) visit(next);
    order.push(node);
  }
  for (let node = 0; node < graph.length; node++) if (!visited.has(node)) visit(node);
  return order.reverse();
}`;

export const unionFindCode = `class DisjointSet {
  constructor(size) { this.parent = Array.from({ length: size }, (_, i) => i); }
  find(value) {
    if (this.parent[value] !== value) this.parent[value] = this.find(this.parent[value]);
    return this.parent[value];
  }
  union(a, b) {
    const rootA = this.find(a), rootB = this.find(b);
    if (rootA === rootB) return false;
    this.parent[rootB] = rootA;
    return true;
  }
}`;

export const tarjanCode = `function stronglyConnectedComponents(graph) {
  const discovery = Array(graph.length).fill(-1), low = [...discovery];
  const stack = [], onStack = new Set(), result = [];
  let time = 0;
  function visit(node) {
    discovery[node] = low[node] = time++;
    stack.push(node); onStack.add(node);
    for (const next of graph[node]) {
      if (discovery[next] < 0) { visit(next); low[node] = Math.min(low[node], low[next]); }
      else if (onStack.has(next)) low[node] = Math.min(low[node], discovery[next]);
    }
    if (low[node] === discovery[node]) {
      const component = []; let current;
      do { current = stack.pop(); onStack.delete(current); component.push(current); }
      while (current !== node);
      result.push(component);
    }
  }
  for (let node = 0; node < graph.length; node++) if (discovery[node] < 0) visit(node);
  return result;
}`;

export const bridgesCode = `function findBridges(graph) {
  const discovery = Array(graph.length).fill(-1), low = [...discovery], bridges = [];
  let time = 0;
  function visit(node, parent) {
    discovery[node] = low[node] = time++;
    for (const next of graph[node]) {
      if (next === parent) continue;
      if (discovery[next] < 0) {
        visit(next, node);
        low[node] = Math.min(low[node], low[next]);
        if (low[next] > discovery[node]) bridges.push([node, next]);
      } else low[node] = Math.min(low[node], discovery[next]);
    }
  }
  visit(0, -1);
  return bridges;
}`;
