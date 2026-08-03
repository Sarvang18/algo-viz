import type { Step, DSSnapshot } from '../Step';
import { graphNodes, graphSnapshot, outgoingEdges, weightedDirectedEdges } from './graphData.ts';

const formatDistances = (distances: number[]): string =>
  distances.map((distance) => distance === Infinity ? '∞' : distance).join(', ');

export function* dijkstra(): Generator<Step<DSSnapshot>, void, unknown> {
  const distances = Array(graphNodes.length).fill(Infinity) as number[];
  const visited = new Set<string>();
  distances[0] = 0;

  yield { action: 'custom', indices: ['0'], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 2, vars: { source: 'A', distances: formatDistances(distances) } } };

  while (visited.size < graphNodes.length) {
    let current = -1;
    for (let index = 0; index < distances.length; index++) {
      if (!visited.has(String(index)) && (current === -1 || distances[index] < distances[current])) current = index;
    }
    if (current === -1 || distances[current] === Infinity) break;

    const currentId = String(current);
    visited.add(currentId);
    yield { action: 'visit', indices: [currentId], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 7, vars: { visiting: currentId, distance: distances[current] } } };

    for (const edge of outgoingEdges(weightedDirectedEdges, currentId)) {
      const next = Number(edge.to);
      const candidate = distances[current] + (edge.weight ?? 0);
      yield { action: 'compare', indices: [edge.id, edge.to], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 9, vars: { edge: edge.id, candidate, previous: distances[next] } } };
      if (candidate < distances[next]) {
        distances[next] = candidate;
        yield { action: 'highlight', indices: [edge.id, edge.to], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 11, vars: { relaxed: edge.id, distances: formatDistances(distances) } } };
      }
    }
  }

  yield { action: 'found', indices: [...visited], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 15, vars: { distances: formatDistances(distances), result: [...distances] } } };
}

export function* bellmanFord(): Generator<Step<DSSnapshot>, void, unknown> {
  const distances = Array(graphNodes.length).fill(Infinity) as number[];
  distances[0] = 0;

  yield { action: 'custom', indices: ['0'], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 2, vars: { source: 'A', distances: formatDistances(distances) } } };

  for (let pass = 1; pass < graphNodes.length; pass++) {
    let changed = false;
    for (const edge of weightedDirectedEdges) {
      const from = Number(edge.from);
      const to = Number(edge.to);
      const weight = edge.weight ?? 0;
      yield { action: 'compare', indices: [edge.id], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 5, vars: { pass, edge: edge.id } } };
      if (distances[from] !== Infinity && distances[from] + weight < distances[to]) {
        distances[to] = distances[from] + weight;
        changed = true;
        yield { action: 'highlight', indices: [edge.id, edge.to], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 7, vars: { pass, relaxed: edge.id, distances: formatDistances(distances) } } };
      }
    }
    if (!changed) break;
  }

  const hasNegativeCycle = weightedDirectedEdges.some((edge) => {
    const from = Number(edge.from);
    const to = Number(edge.to);
    return distances[from] !== Infinity && distances[from] + (edge.weight ?? 0) < distances[to];
  });
  yield { action: hasNegativeCycle ? 'swap' : 'found', indices: graphNodes.map((node) => node.id), snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 12, vars: { hasNegativeCycle, distances: formatDistances(distances), result: [...distances] } } };
}

export function* floydWarshall(): Generator<Step<DSSnapshot>, void, unknown> {
  const size = graphNodes.length;
  const distances = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => row === col ? 0 : Infinity),
  );
  for (const edge of weightedDirectedEdges) distances[Number(edge.from)][Number(edge.to)] = edge.weight ?? 0;

  yield { action: 'custom', indices: [], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 2, vars: { intermediate: 'none' } } };

  for (let middle = 0; middle < size; middle++) {
    yield { action: 'visit', indices: [String(middle)], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 4, vars: { intermediate: middle } } };
    for (let from = 0; from < size; from++) {
      for (let to = 0; to < size; to++) {
        const candidate = distances[from][middle] + distances[middle][to];
        if (candidate < distances[from][to]) {
          distances[from][to] = candidate;
          yield { action: 'highlight', indices: [String(from), String(middle), String(to)], snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 8, vars: { path: `${from} → ${middle} → ${to}`, distance: candidate } } };
        }
      }
    }
  }

  const displayMatrix = distances.map((row) => row.map((value) => value === Infinity ? '∞' : value));
  yield { action: 'found', indices: graphNodes.map((node) => node.id), snapshot: graphSnapshot(weightedDirectedEdges, true), meta: { line: 13, vars: { allPairs: JSON.stringify(displayMatrix), result: displayMatrix } } };
}

export const dijkstraCode = `function dijkstra(graph, source) {
  const dist = Array(graph.length).fill(Infinity), used = new Set();
  dist[source] = 0;
  while (used.size < graph.length) {
    let node = -1;
    for (let i = 0; i < dist.length; i++)
      if (!used.has(i) && (node < 0 || dist[i] < dist[node])) node = i;
    if (node < 0 || dist[node] === Infinity) break;
    used.add(node);
    for (const [next, weight] of graph[node])
      dist[next] = Math.min(dist[next], dist[node] + weight);
  }
  return dist;
}`;

export const bellmanFordCode = `function bellmanFord(edges, vertexCount, source) {
  const dist = Array(vertexCount).fill(Infinity);
  dist[source] = 0;
  for (let pass = 1; pass < vertexCount; pass++) {
    let changed = false;
    for (const [from, to, weight] of edges) {
      if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
        dist[to] = dist[from] + weight;
        changed = true;
      }
    }
    if (!changed) break;
  }
  const hasNegativeCycle = edges.some(([from, to, weight]) =>
    dist[from] !== Infinity && dist[from] + weight < dist[to]);
  return { dist, hasNegativeCycle };
}`;

export const floydWarshallCode = `function floydWarshall(matrix) {
  const dist = matrix.map(row => [...row]);
  for (let middle = 0; middle < dist.length; middle++)
    for (let from = 0; from < dist.length; from++)
      for (let to = 0; to < dist.length; to++)
        dist[from][to] = Math.min(
          dist[from][to],
          dist[from][middle] + dist[middle][to]
        );
  return dist;
}`;
