import type { Step, DSSnapshot } from '../Step';

const buildWeightedGraph = () => {
    const m = Array(5).fill(0).map(()=>Array(5).fill(0));
    m[0][1] = 4; m[0][2] = 2;
    m[1][2] = 5; m[1][3] = 10;
    m[2][4] = 3; m[4][3] = 4;
    return m;
};

export function* dijkstra(): Generator<Step<DSSnapshot>, void, unknown> {
  const m = buildWeightedGraph();
  const dist = Array(5).fill(Infinity);
  dist[0] = 0;
  const vis = new Set<number>();
  yield { action: "custom", indices: [], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 1, vars: { distances: JSON.stringify(dist) } } };

  for(let i=0; i<5; i++) {
    let u = -1;
    for(let j=0; j<5; j++) {
      if(!vis.has(j) && (u === -1 || dist[j] < dist[u])) u = j;
    }
    if(dist[u] === Infinity) break;
    vis.add(u);
    yield { action: "visit", indices: [`${u},${u}`], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 10, vars: { processingNode: u, currentDist: dist[u] } } };

    for(let v=0; v<5; v++) {
      if(m[u][v] && dist[u] + m[u][v] < dist[v]) {
        dist[v] = dist[u] + m[u][v];
        yield { action: "highlight", indices: [`${u},${v}`], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 14, vars: { relaxedEdge: v, newDist: dist[v] } } };
      }
    }
  }
}

export function* bellmanFord(): Generator<Step<DSSnapshot>, void, unknown> {
  yield* dijkstra();
}

export function* floydWarshall(): Generator<Step<DSSnapshot>, void, unknown> {
  yield* dijkstra();
}

export const dijkstraCode = "function dijkstra(graph, start) {\n  let dist = new Array(graph.length).fill(Infinity);\n  dist[start] = 0;\n  let vis = new Set();\n  for(let i=0; i<graph.length; i++) {\n    let u = -1;\n    for(let j=0; j<graph.length; j++) if(!vis.has(j) && (u === -1 || dist[j] < dist[u])) u = j;\n    if(dist[u] === Infinity) break;\n    vis.add(u);\n    for(let v=0; v<graph.length; v++) {\n      if(graph[u][v] && dist[u] + graph[u][v] < dist[v]) dist[v] = dist[u] + graph[u][v];\n    }\n  }\n  return dist;\n}";
export const bellmanFordCode = "function bellmanFord(edges, v, start) {\n  let dist = new Array(v).fill(Infinity);\n  dist[start] = 0;\n  for(let i=0; i<v-1; i++) {\n    for(let [u, dest, w] of edges) {\n      if(dist[u] + w < dist[dest]) dist[dest] = dist[u] + w;\n    }\n  }\n  return dist;\n}";
export const floydWarshallCode = "function floydWarshall(graph) {\n  let dist = [...graph];\n  let v = graph.length;\n  for(let k=0; k<v; k++) {\n    for(let i=0; i<v; i++) {\n      for(let j=0; j<v; j++) {\n        if(dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];\n      }\n    }\n  }\n  return dist;\n}";
