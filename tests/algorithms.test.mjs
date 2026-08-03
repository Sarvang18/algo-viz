import test from 'node:test';
import assert from 'node:assert/strict';

import { dijkstra, bellmanFord, floydWarshall } from '../src/engine/algorithms/shortestPath.ts';
import { bridges, dfsTopo, kahn, kruskal, prim, tarjan, unionFind } from '../src/engine/algorithms/mstAndTopo.ts';
import { weightedUndirectedEdges, dagEdges } from '../src/engine/algorithms/graphData.ts';
import { sudokuSolver } from '../src/engine/algorithms/sudokuSolver.ts';
import { avlTree, bstInsert } from '../src/engine/algorithms/treeProblems.ts';
import { segmentTree } from '../src/engine/algorithms/advancedTrees.ts';

const lastStep = (generator) => [...generator].at(-1);

const treeInput = {
  root: '1',
  nodes: {
    '1': { id: '1', value: 40, left: '2', right: '3' },
    '2': { id: '2', value: 20, left: '4', right: '5' },
    '3': { id: '3', value: 60, left: '6', right: '7' },
    '4': { id: '4', value: 10 },
    '5': { id: '5', value: 30 },
    '6': { id: '6', value: 50 },
    '7': { id: '7', value: 70 },
  },
};

test('Dijkstra and Bellman-Ford compute the expected source distances', () => {
  assert.deepEqual(lastStep(dijkstra()).meta.vars.result, [0, 3, 2, 8, 10, 13]);
  assert.deepEqual(lastStep(bellmanFord()).meta.vars.result, [0, 3, 2, 8, 10, 13]);
  assert.equal(lastStep(bellmanFord()).meta.vars.hasNegativeCycle, false);
});

test('Floyd-Warshall computes all-pairs paths and preserves unreachable values', () => {
  const result = lastStep(floydWarshall()).meta.vars.result;
  assert.equal(result[0][5], 13);
  assert.equal(result[5][0], '∞');
  assert.equal(result[3][5], 5);
});

test('Kruskal and Prim produce minimum spanning trees with equal weight', () => {
  const edgeById = new Map(weightedUndirectedEdges.map((edge) => [edge.id, edge]));
  const weight = (ids) => ids.reduce((sum, id) => sum + edgeById.get(id).weight, 0);
  const kruskalResult = lastStep(kruskal()).meta.vars.result;
  const primResult = lastStep(prim()).meta.vars.result;
  assert.equal(kruskalResult.length, 5);
  assert.equal(primResult.length, 5);
  assert.equal(weight(kruskalResult), 13);
  assert.equal(weight(primResult), 13);
});

test('both topological sorts respect every DAG edge', () => {
  for (const algorithm of [kahn, dfsTopo]) {
    const order = lastStep(algorithm()).meta.vars.result;
    const position = new Map(order.map((node, index) => [node, index]));
    for (const edge of dagEdges) assert.ok(position.get(edge.from) < position.get(edge.to));
  }
});

test('Union-Find, Tarjan, and bridge detection return meaningful graph results', () => {
  assert.equal(lastStep(unionFind()).meta.vars.components, 1);
  const components = lastStep(tarjan()).meta.vars.result.map((component) => [...component].sort().join(''));
  assert.deepEqual(components.sort(), ['012', '34', '5']);
  assert.deepEqual(lastStep(bridges()).meta.vars.result, ['1-3']);
});

test('MRV Sudoku completes with a valid board and a bounded timeline', () => {
  const steps = [...sudokuSolver()];
  assert.ok(steps.length < 500, `expected fewer than 500 steps, received ${steps.length}`);
  const board = steps.at(-1).snapshot.data;
  const expected = '123456789';
  for (const row of board) assert.equal([...row].sort().join(''), expected);
  for (let col = 0; col < 9; col++) {
    assert.equal(board.map((row) => row[col]).sort().join(''), expected);
  }
});

test('BST insertion snapshots do not mutate earlier steps', () => {
  const steps = [...bstInsert(treeInput)];
  assert.equal(Object.keys(steps[0].snapshot.nodes).length, 7);
  assert.equal(Object.keys(steps.at(-1).snapshot.nodes).length, 8);
  assert.notEqual(steps[0].snapshot.nodes, steps.at(-1).snapshot.nodes);
});

test('AVL construction remains height-balanced', () => {
  const finalTree = lastStep(avlTree(treeInput)).snapshot;
  const height = (id) => {
    if (!id) return 0;
    const node = finalTree.nodes[id];
    const left = height(node.left), right = height(node.right);
    assert.ok(Math.abs(left - right) <= 1, `node ${id} is not balanced`);
    return Math.max(left, right) + 1;
  };
  height(finalTree.root);
});

test('segment tree root stores the complete range sum', () => {
  const final = lastStep(segmentTree([4, 2, 7, 1, 3]));
  assert.equal(final.snapshot.data[0], 17);
  assert.equal(final.meta.vars.totalRangeSum, 17);
});
