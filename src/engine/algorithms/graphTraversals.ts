import type { Step, DSSnapshot } from '../Step';

const buildMatrix = () => {
    const m = Array(5).fill(0).map(()=>Array(5).fill(0));
    m[0][1] = 1; m[0][2] = 1;
    m[1][3] = 1; m[2][4] = 1; m[3][4] = 1;
    return m;
};

export function* bfs(): Generator<Step<DSSnapshot>, void, unknown> {
  const m = buildMatrix();
  yield { action: "custom", indices: [], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 1, vars: {} } };
  const q = [0];
  const vis = new Set([0]);
  while(q.length > 0) {
    const u = q.shift()!;
    yield { action: "visit", indices: [`${u},${u}`], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 6, vars: { dequeue: u } } };
    for(let v = 0; v < 5; v++) {
      if(m[u][v] && !vis.has(v)) {
        vis.add(v);
        q.push(v);
        yield { action: "highlight", indices: [`${u},${v}`], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 10, vars: { edgeQueue: `${u} -> ${v}` } } };
      }
    }
  }
}

export function* dfs(): Generator<Step<DSSnapshot>, void, unknown> {
  const m = buildMatrix();
  const vis = new Set<number>();
  yield { action: "custom", indices: [], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 1, vars: {} } };
  
  function* explore(u: number): Generator<Step<DSSnapshot>, void, unknown> {
    vis.add(u);
    yield { action: "visit", indices: [`${u},${u}`], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 5, vars: { exploreDFS: u } } };
    for(let v = 0; v < 5; v++) {
      if(m[u][v] && !vis.has(v)) {
        yield { action: "highlight", indices: [`${u},${v}`], snapshot: { type: 'matrix', data: m, boardType: 'grid' }, meta: { line: 8, vars: { enteringPath: `${u} -> ${v}` } } };
        yield* explore(v);
      }
    }
  }
  yield* explore(0);
}

export const bfsCode = "function bfs(graph, start) {\n  let q = [start], vis = new Set([start]);\n  while(q.length) {\n    let u = q.shift();\n    for(let v of graph[u]) {\n      if(!vis.has(v)) {\n        vis.add(v);\n        q.push(v);\n      }\n    }\n  }\n}";
export const dfsCode = "function dfs(graph, u, vis = new Set()) {\n  vis.add(u);\n  for(let v of graph[u]) {\n    if(!vis.has(v)) dfs(graph, v, vis);\n  }\n}";
