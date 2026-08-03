import test from 'node:test';
import assert from 'node:assert/strict';

const arrayInput = [34, 12, 5, 9, 42, 67, 23, 1, 88, 55, 10, 2];
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

const moduleSpecs = {
  bubbleSort: ['bubbleSort'], quickSort: ['quickSort'], treeTraversals: ['preorder', 'inorder', 'postorder'],
  binarySearch: ['binarySearch'], insertionSort: ['insertionSort'], mergeSort: ['mergeSort'],
  linearSearch: ['linearSearch'], ternarySearch: ['ternarySearch'], selectionSort: ['selectionSort'],
  heapSortArray: ['heapSortArray'], countingSort: ['countingSort'], radixSort: ['radixSort'], bucketSort: ['bucketSort'],
  twoSum: ['twoSum'], threeSum: ['threeSum'], slidingWindowMax: ['slidingWindowMax'], longestSubstring: ['longestSubstring'],
  factorial: ['factorial'], fibonacci: ['fibonacci'], towerOfHanoi: ['towerOfHanoi'], nQueens: ['nQueens'],
  sudokuSolver: ['sudokuSolver'], permutations: ['permutations'], subsetGen: ['subsetGen'],
  treeProblems: ['levelOrder', 'heightDepth', 'diameter', 'lca', 'balancedTree', 'bstInsert', 'kthSmallest', 'avlTree'],
  advancedTrees: ['segmentTree', 'fenwickTree', 'trie'], graphTraversals: ['bfs', 'dfs'],
  shortestPath: ['dijkstra', 'bellmanFord', 'floydWarshall'],
  mstAndTopo: ['kruskal', 'prim', 'kahn', 'dfsTopo', 'unionFind', 'tarjan', 'bridges'],
  stringMatching: ['kmp', 'rabinKarp', 'zAlgo', 'manacher'], fibonacciDp: ['fibonacciDp'],
  climbingStairs: ['climbingStairs'], knapsack: ['knapsack'], lcs: ['lcs'], lis: ['lis'],
  editDistance: ['editDistance'], dpTrees: ['dpTrees'], dpGrids: ['dpGrids'], bitmaskDp: ['bitmaskDp'],
  activitySelection: ['activitySelection'], fractionalKnapsack: ['fractionalKnapsack'],
  huffmanCoding: ['huffmanCoding'], jobScheduling: ['jobScheduling'], xorTricks: ['xorTricks'],
  subsetsBits: ['subsetsBits'], powerOf2: ['powerOf2'], minMaxHeap: ['minMaxHeap'], heapSort2: ['heapSort2'],
  kthLargest: ['kthLargest'], mergeKSorted: ['mergeKSorted'], sieve: ['sieve'], gcd: ['gcd'],
  modularArithmetic: ['modularArithmetic'], fastExponentiation: ['fastExponentiation'],
};

const expectedType = (file) => {
  if (file === 'towerOfHanoi') return 'hanoi';
  if (['nQueens', 'sudokuSolver', 'dpGrids'].includes(file)) return 'matrix';
  if (['graphTraversals', 'shortestPath', 'mstAndTopo'].includes(file)) return 'graph';
  if (['treeTraversals', 'treeProblems', 'dpTrees'].includes(file)) return 'tree';
  return 'array';
};

const inputFor = (file) => {
  if (file === 'towerOfHanoi') return 4;
  if (['treeTraversals', 'treeProblems', 'dpTrees'].includes(file)) return treeInput;
  return arrayInput;
};

test('every enabled generator emits a bounded, structurally valid timeline', async (context) => {
  let generatorCount = 0;
  for (const [file, names] of Object.entries(moduleSpecs)) {
    const module = await import(`../src/engine/algorithms/${file}.ts`);
    for (const name of names) {
      await context.test(name, () => {
        generatorCount++;
        const steps = [...module[name](inputFor(file))];
        assert.ok(steps.length > 0, `${name} emitted no steps`);
        assert.ok(steps.length < 10_000, `${name} emitted ${steps.length} steps`);
        for (const step of steps) {
          assert.equal(step.snapshot.type, expectedType(file), `${name} emitted the wrong snapshot type`);
          assert.ok(Array.isArray(step.indices));
          assert.equal(typeof step.meta.line, 'number');
        }
      });
    }
  }
  assert.equal(generatorCount, 77);
});
