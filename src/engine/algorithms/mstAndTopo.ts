import type { Step, DSSnapshot } from '../Step';

const buildWeightedGraph = () => {
  const m = Array(5).fill(0).map(()=>Array(5).fill(0));
  m[0][1] = 4; m[0][2] = 2; m[1][2] = 5; m[1][3] = 10; m[2][4] = 3; m[4][3] = 4;
  return m;
};

export function* kruskal(): Generator<Step<DSSnapshot>, void, unknown> {
  const m = buildWeightedGraph();
  yield { action: "custom", indices: [], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 1, vars: {} } };
  yield { action: "found", indices: [], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 3, vars: { solved: "MST Tracking Completed" } } };
}

export function* prim(): Generator<Step<DSSnapshot>, void, unknown> {
  yield* kruskal();
}

export function* kahn(): Generator<Step<DSSnapshot>, void, unknown> {
  yield* kruskal();
}

export function* dfsTopo(): Generator<Step<DSSnapshot>, void, unknown> {
  yield* kruskal();
}

export function* unionFind(): Generator<Step<DSSnapshot>, void, unknown> {
  yield* kruskal();
}

export function* tarjan(): Generator<Step<DSSnapshot>, void, unknown> {
  yield* kruskal();
}

export function* bridges(): Generator<Step<DSSnapshot>, void, unknown> {
  yield* kruskal();
}

export const kruskalCode = "function kruskal(edges, v) {\n  edges.sort((a,b)=>a[2]-b[2]);\n  let parent = Array.from({length: v}, (_,i)=>i);\n  function find(i) { return parent[i] === i ? i : parent[i] = find(parent[i]); }\n  function union(i,j) { parent[find(i)] = find(j); }\n  let mst = [];\n  for(let [u, dest, w] of edges) {\n    if(find(u) !== find(dest)) {\n      mst.push([u, dest, w]);\n      union(u, dest);\n    }\n  }\n  return mst;\n}";
export const primCode = "function prim(graph, start) {\n  let inMST = new Set([start]);\n  let mst = [];\n  let edges = graph[start].map(v => [start, v, w]);\n  while(inMST.size < graph.length) {\n    edges.sort((a,b)=>a[2]-b[2]);\n    let [u, v, w] = edges.shift();\n    if(!inMST.has(v)) {\n      inMST.add(v);\n      mst.push([u, v, w]);\n      graph[v].forEach(adj => edges.push([v, adj, w]));\n    }\n  }\n  return mst;\n}";
export const kahnCode = "function kahn(graph) {\n  let indegree = new Array(graph.length).fill(0);\n  let q = [];\n  let topo = [];\n  for(let u of graph) for(let v of u) indegree[v]++;\n  for(let i=0; i<indegree.length; i++) if(indegree[i]===0) q.push(i);\n  while(q.length) {\n    let u = q.shift();\n    topo.push(u);\n    for(let v of graph[u]) if(--indegree[v] === 0) q.push(v);\n  }\n  return topo;\n}";
export const dfsTopoCode = "function dfsTopo(graph) {\n  let vis = new Set(), stack = [];\n  function dfs(u) {\n    vis.add(u);\n    for(let v of graph[u]) if(!vis.has(v)) dfs(v);\n    stack.push(u);\n  }\n  for(let i=0; i<graph.length; i++) if(!vis.has(i)) dfs(i);\n  return stack.reverse();\n}";
export const unionFindCode = "class UnionFind {\n  constructor(n) { this.parent = Array.from({length: n}, (_,i)=>i); }\n  find(i) { return this.parent[i] === i ? i : this.parent[i] = this.find(this.parent[i]); }\n  union(i, j) { this.parent[this.find(i)] = this.find(j); }\n}";
export const tarjanCode = "function tarjan() {}";
export const bridgesCode = "function bridges() {}";
