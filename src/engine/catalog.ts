import type { DSType } from './Step';
import { bubbleSortCode, bubbleSort } from './algorithms/bubbleSort';
import { quickSortCode, quickSort } from './algorithms/quickSort';
import { treeTraversalsCode, preorder, inorder, postorder } from './algorithms/treeTraversals';
import { binarySearchCode, binarySearch } from './algorithms/binarySearch';
import { insertionSortCode, insertionSort } from './algorithms/insertionSort';
import { mergeSortCode, mergeSort } from './algorithms/mergeSort';

import { linearSearchCode, linearSearch } from './algorithms/linearSearch';
import { ternarySearchCode, ternarySearch } from './algorithms/ternarySearch';
import { selectionSortCode, selectionSort } from './algorithms/selectionSort';
import { heapSortArrayCode, heapSortArray } from './algorithms/heapSortArray';
import { countingSortCode, countingSort } from './algorithms/countingSort';
import { radixSortCode, radixSort } from './algorithms/radixSort';
import { bucketSortCode, bucketSort } from './algorithms/bucketSort';
import { twoSumCode, twoSum } from './algorithms/twoSum';
import { threeSumCode, threeSum } from './algorithms/threeSum';
import { slidingWindowMaxCode, slidingWindowMax } from './algorithms/slidingWindowMax';
import { longestSubstringCode, longestSubstring } from './algorithms/longestSubstring';

import { factorialCode, factorial } from './algorithms/factorial';
import { fibonacciCode, fibonacci } from './algorithms/fibonacci';
import { towerOfHanoiCode, towerOfHanoi } from './algorithms/towerOfHanoi';

import { nQueensCode, nQueens } from './algorithms/nQueens';
import { sudokuSolverCode, sudokuSolver } from './algorithms/sudokuSolver';
import { permutationsCode, permutations } from './algorithms/permutations';
import { subsetGenCode, subsetGen } from './algorithms/subsetGen';

import * as Tr from './algorithms/treeProblems';
import * as AdvTr from './algorithms/advancedTrees';
import * as GTr from './algorithms/graphTraversals';
import * as SP from './algorithms/shortestPath';
import * as MST from './algorithms/mstAndTopo';
import * as StringMatch from './algorithms/stringMatching';

import { fibonacciDpCode, fibonacciDp } from './algorithms/fibonacciDp';
import { climbingStairsCode, climbingStairs } from './algorithms/climbingStairs';
import { knapsackCode, knapsack } from './algorithms/knapsack';
import { lcsCode, lcs } from './algorithms/lcs';
import { lisCode, lis } from './algorithms/lis';
import { editDistanceCode, editDistance } from './algorithms/editDistance';
import { dpTreesCode, dpTrees } from './algorithms/dpTrees';
import { dpGridsCode, dpGrids } from './algorithms/dpGrids';
import { bitmaskDpCode, bitmaskDp } from './algorithms/bitmaskDp';

import { activitySelectionCode, activitySelection } from './algorithms/activitySelection';
import { fractionalKnapsackCode, fractionalKnapsack } from './algorithms/fractionalKnapsack';
import { huffmanCodingCode, huffmanCoding } from './algorithms/huffmanCoding';
import { jobSchedulingCode, jobScheduling } from './algorithms/jobScheduling';

import { xorTricksCode, xorTricks } from './algorithms/xorTricks';
import { subsetsBitsCode, subsetsBits } from './algorithms/subsetsBits';
import { powerOf2Code, powerOf2 } from './algorithms/powerOf2';

import { minMaxHeapCode, minMaxHeap } from './algorithms/minMaxHeap';
import { heapSort2Code, heapSort2 } from './algorithms/heapSort2';
import { kthLargestCode, kthLargest } from './algorithms/kthLargest';
import { mergeKSortedCode, mergeKSorted } from './algorithms/mergeKSorted';

import { sieveCode, sieve } from './algorithms/sieve';
import { gcdCode, gcd } from './algorithms/gcd';
import { modularArithmeticCode, modularArithmetic } from './algorithms/modularArithmetic';
import { fastExponentiationCode, fastExponentiation } from './algorithms/fastExponentiation';

export interface AlgorithmMeta {
  id: string;
  name: string;
  dsType: DSType;
  implemented: boolean;
  generator?: any;
  code?: string;
}

export interface SubCategory {
  name: string;
  algorithms: AlgorithmMeta[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  subcategories?: SubCategory[];
  algorithms?: AlgorithmMeta[];
}

export const catalog: CatalogCategory[] = [
  {
    id: 'arrays',
    name: '🔢 1. ARRAY & BASIC ALGORITHMS',
    subcategories: [
      {
        name: '🔹 Searching',
        algorithms: [
          { id: 'linearSearch', name: 'Linear Search', dsType: 'array', implemented: true, generator: linearSearch, code: linearSearchCode },
          { id: 'binarySearch', name: 'Binary Search', dsType: 'array', implemented: true, generator: binarySearch, code: binarySearchCode },
          { id: 'ternarySearch', name: 'Ternary Search', dsType: 'array', implemented: true, generator: ternarySearch, code: ternarySearchCode },
        ]
      },
      {
        name: '🔹 Sorting (CORE)',
        algorithms: [
          { id: 'bubbleSort', name: 'Bubble Sort', dsType: 'array', implemented: true, generator: bubbleSort, code: bubbleSortCode },
          { id: 'selectionSort', name: 'Selection Sort', dsType: 'array', implemented: true, generator: selectionSort, code: selectionSortCode },
          { id: 'insertionSort', name: 'Insertion Sort', dsType: 'array', implemented: true, generator: insertionSort, code: insertionSortCode },
          { id: 'mergeSort', name: 'Merge Sort', dsType: 'array', implemented: true, generator: mergeSort, code: mergeSortCode },
          { id: 'quickSort', name: 'Quick Sort', dsType: 'array', implemented: true, generator: quickSort, code: quickSortCode },
          { id: 'heapSort', name: 'Heap Sort', dsType: 'array', implemented: true, generator: heapSortArray, code: heapSortArrayCode },
          { id: 'countingSort', name: 'Counting Sort', dsType: 'array', implemented: true, generator: countingSort, code: countingSortCode },
          { id: 'radixSort', name: 'Radix Sort', dsType: 'array', implemented: true, generator: radixSort, code: radixSortCode },
          { id: 'bucketSort', name: 'Bucket Sort', dsType: 'array', implemented: true, generator: bucketSort, code: bucketSortCode },
        ]
      },
      {
        name: '🔹 Two Pointer / Sliding Window',
        algorithms: [
          { id: 'twoSum', name: 'Two Sum', dsType: 'array', implemented: true, generator: twoSum, code: twoSumCode },
          { id: 'threeSum', name: '3Sum / 4Sum', dsType: 'array', implemented: true, generator: threeSum, code: threeSumCode },
          { id: 'slidingWindowMax', name: 'Sliding Window Maximum', dsType: 'array', implemented: true, generator: slidingWindowMax, code: slidingWindowMaxCode },
          { id: 'longestSubstring', name: 'Longest Substring Without Repeating', dsType: 'array', implemented: true, generator: longestSubstring, code: longestSubstringCode },
        ]
      }
    ]
  },
  {
    id: 'recursion',
    name: '🌳 2. RECURSION & BACKTRACKING',
    subcategories: [
      {
        name: '🔹 Recursion Basics',
        algorithms: [
          { id: 'factorial', name: 'Factorial', dsType: 'array', implemented: true, generator: factorial, code: factorialCode },
          { id: 'fibonacci', name: 'Fibonacci', dsType: 'array', implemented: true, generator: fibonacci, code: fibonacciCode },
          { id: 'towerOfHanoi', name: 'Tower of Hanoi', dsType: 'hanoi', implemented: true, generator: towerOfHanoi, code: towerOfHanoiCode },
        ]
      },
      {
        name: '🔹 Backtracking',
        algorithms: [
          { id: 'nQueens', name: 'N-Queens', dsType: 'matrix', implemented: true, generator: nQueens, code: nQueensCode },
          { id: 'sudokuSolver', name: 'Sudoku Solver', dsType: 'matrix', implemented: true, generator: sudokuSolver, code: sudokuSolverCode },
          { id: 'permutations', name: 'Permutations / Combinations', dsType: 'array', implemented: true, generator: permutations, code: permutationsCode },
          { id: 'subsetGen', name: 'Subset Generation', dsType: 'array', implemented: true, generator: subsetGen, code: subsetGenCode },
        ]
      }
    ]
  },
  {
    id: 'trees',
    name: '🌲 3. TREE ALGORITHMS',
    subcategories: [
      {
        name: '🔹 Traversals',
        algorithms: [
          { id: 'inorder', name: 'Inorder', dsType: 'tree', implemented: true, generator: inorder, code: treeTraversalsCode },
          { id: 'preorder', name: 'Preorder', dsType: 'tree', implemented: true, generator: preorder, code: treeTraversalsCode },
          { id: 'postorder', name: 'Postorder', dsType: 'tree', implemented: true, generator: postorder, code: treeTraversalsCode },
          { id: 'levelOrder', name: 'Level Order (BFS)', dsType: 'tree', implemented: true, generator: Tr.levelOrder, code: Tr.levelOrderCode },
        ]
      },
      {
        name: '🔹 Binary Tree Problems',
        algorithms: [
          { id: 'heightDepth', name: 'Height / Depth', dsType: 'tree', implemented: true, generator: Tr.heightDepth, code: Tr.heightDepthCode },
          { id: 'diameter', name: 'Diameter', dsType: 'tree', implemented: true, generator: Tr.diameter, code: Tr.diameterCode },
          { id: 'lca', name: 'LCA (Lowest Common Ancestor)', dsType: 'tree', implemented: true, generator: Tr.lca, code: Tr.lcaCode },
          { id: 'balancedTree', name: 'Balanced Tree', dsType: 'tree', implemented: true, generator: Tr.balancedTree, code: Tr.balancedTreeCode },
        ]
      },
      {
        name: '🔹 BST (Binary Search Tree)',
        algorithms: [
          { id: 'bstInsert', name: 'Insert / Delete / Search', dsType: 'tree', implemented: true, generator: Tr.bstInsert, code: Tr.bstInsertCode },
          { id: 'kthSmallest', name: 'Kth smallest', dsType: 'tree', implemented: true, generator: Tr.kthSmallest, code: Tr.kthSmallestCode },
        ]
      },
      {
        name: '🔹 Advanced Trees',
        algorithms: [
          { id: 'avlTree', name: 'AVL Tree', dsType: 'tree', implemented: true, generator: Tr.avlTree, code: Tr.avlTreeCode },
          { id: 'segmentTree', name: 'Segment Tree', dsType: 'array', implemented: true, generator: AdvTr.segmentTree, code: AdvTr.segmentTreeCode },
          { id: 'fenwickTree', name: 'Fenwick Tree (BIT)', dsType: 'array', implemented: true, generator: AdvTr.fenwickTree, code: AdvTr.fenwickTreeCode },
          { id: 'trie', name: 'Trie', dsType: 'array', implemented: true, generator: AdvTr.trie, code: AdvTr.trieCode },
        ]
      }
    ]
  },
  {
    id: 'graphs',
    name: '🕸️ 4. GRAPH ALGORITHMS',
    subcategories: [
      {
        name: '🔹 Traversal',
        algorithms: [
           { id: 'bfs', name: 'BFS', dsType: 'matrix', implemented: true, generator: GTr.bfs, code: GTr.bfsCode },
           { id: 'dfs', name: 'DFS', dsType: 'matrix', implemented: true, generator: GTr.dfs, code: GTr.dfsCode },
        ]
      },
      {
        name: '🔹 Shortest Path',
        algorithms: [
           { id: 'dijkstra', name: 'Dijkstra', dsType: 'matrix', implemented: true, generator: SP.dijkstra, code: SP.dijkstraCode },
           { id: 'bellmanFord', name: 'Bellman-Ford', dsType: 'matrix', implemented: true, generator: SP.bellmanFord, code: SP.bellmanFordCode },
           { id: 'floydWarshall', name: 'Floyd-Warshall', dsType: 'matrix', implemented: true, generator: SP.floydWarshall, code: SP.floydWarshallCode },
        ]
      },
      {
        name: '🔹 Minimum Spanning Tree',
        algorithms: [
           { id: 'kruskal', name: 'Kruskal', dsType: 'matrix', implemented: true, generator: MST.kruskal, code: MST.kruskalCode },
           { id: 'prim', name: 'Prim', dsType: 'matrix', implemented: true, generator: MST.prim, code: MST.primCode },
        ]
      },
      {
        name: '🔹 Topological Sort',
        algorithms: [
           { id: 'kahn', name: 'Kahn’s Algorithm', dsType: 'matrix', implemented: true, generator: MST.kahn, code: MST.kahnCode },
           { id: 'dfsTopo', name: 'DFS-based topo sort', dsType: 'matrix', implemented: true, generator: MST.dfsTopo, code: MST.dfsTopoCode },
        ]
      },
      {
        name: '🔹 Advanced',
        algorithms: [
           { id: 'unionFind', name: 'Union-Find (Disjoint Set)', dsType: 'matrix', implemented: true, generator: MST.unionFind, code: MST.unionFindCode },
           { id: 'tarjan', name: 'Tarjan’s Algorithm (SCC)', dsType: 'matrix', implemented: true, generator: MST.tarjan, code: MST.tarjanCode },
           { id: 'bridges', name: 'Bridges & Articulation Points', dsType: 'matrix', implemented: true, generator: MST.bridges, code: MST.bridgesCode },
        ]
      },
    ]
  },
  {
    id: 'dp',
    name: '🧮 5. DYNAMIC PROGRAMMING',
    subcategories: [
      {
        name: '🔹 Basic DP',
        algorithms: [
          { id: 'fibonacciDp', name: 'Fibonacci DP', dsType: 'array', implemented: true, generator: fibonacciDp, code: fibonacciDpCode },
          { id: 'climbingStairs', name: 'Climbing Stairs', dsType: 'array', implemented: true, generator: climbingStairs, code: climbingStairsCode },
        ]
      },
      {
        name: '🔹 Classic Problems',
        algorithms: [
          { id: 'knapsack', name: '0/1 Knapsack', dsType: 'array', implemented: true, generator: knapsack, code: knapsackCode },
          { id: 'lcs', name: 'Longest Common Subsequence', dsType: 'array', implemented: true, generator: lcs, code: lcsCode },
          { id: 'lis', name: 'Longest Increasing Subsequence', dsType: 'array', implemented: true, generator: lis, code: lisCode },
          { id: 'editDistance', name: 'Edit Distance', dsType: 'array', implemented: true, generator: editDistance, code: editDistanceCode },
        ]
      },
      {
        name: '🔹 Advanced DP',
        algorithms: [
          { id: 'dpTrees', name: 'DP on Trees', dsType: 'tree', implemented: true, generator: dpTrees, code: dpTreesCode },
          { id: 'dpGrids', name: 'DP on Grids', dsType: 'matrix', implemented: true, generator: dpGrids, code: dpGridsCode },
          { id: 'bitmaskDp', name: 'Bitmask DP', dsType: 'array', implemented: true, generator: bitmaskDp, code: bitmaskDpCode },
        ]
      }
    ]
  },
  {
    id: 'greedy',
    name: '🔗 6. GREEDY ALGORITHMS',
    subcategories: [
      {
        name: '🔹 Core Algorithms',
        algorithms: [
          { id: 'activitySelection', name: 'Activity Selection', dsType: 'array', implemented: true, generator: activitySelection, code: activitySelectionCode },
          { id: 'fractionalKnapsack', name: 'Fractional Knapsack', dsType: 'array', implemented: true, generator: fractionalKnapsack, code: fractionalKnapsackCode },
          { id: 'huffmanCoding', name: 'Huffman Coding', dsType: 'array', implemented: true, generator: huffmanCoding, code: huffmanCodingCode },
          { id: 'jobScheduling', name: 'Job Scheduling', dsType: 'array', implemented: true, generator: jobScheduling, code: jobSchedulingCode },
        ]
      }
    ]
  },
  {
    id: 'strings',
    name: '🧵 7. STRING ALGORITHMS',
    subcategories: [
      {
        name: '🔹 String Matching',
        algorithms: [
          { id: 'kmp', name: 'KMP (Pattern Matching)', dsType: 'array', implemented: true, generator: StringMatch.kmp, code: StringMatch.kmpCode },
          { id: 'rabinKarp', name: 'Rabin-Karp', dsType: 'array', implemented: true, generator: StringMatch.rabinKarp, code: StringMatch.rabinKarpCode },
          { id: 'zAlgo', name: 'Z Algorithm', dsType: 'array', implemented: true, generator: StringMatch.zAlgo, code: StringMatch.zAlgoCode },
          { id: 'manacher', name: 'Manacher’s Algorithm', dsType: 'array', implemented: true, generator: StringMatch.manacher, code: StringMatch.manacherCode },
        ]
      }
    ]
  },
  {
    id: 'bits',
    name: '🧠 8. BIT MANIPULATION',
    subcategories: [
      {
        name: '🔹 Bit Operations',
        algorithms: [
          { id: 'xorTricks', name: 'XOR tricks', dsType: 'array', implemented: true, generator: xorTricks, code: xorTricksCode },
          { id: 'subsetsBits', name: 'Subsets using bits', dsType: 'array', implemented: true, generator: subsetsBits, code: subsetsBitsCode },
          { id: 'powerOf2', name: 'Power of 2 checks', dsType: 'array', implemented: true, generator: powerOf2, code: powerOf2Code },
        ]
      }
    ]
  },
  {
    id: 'heaps',
    name: '📦 9. HEAPS & PRIORITY QUEUES',
    subcategories: [
      {
        name: '🔹 Heap Algorithms',
        algorithms: [
          { id: 'minMaxHeap', name: 'Min Heap / Max Heap', dsType: 'array', implemented: true, generator: minMaxHeap, code: minMaxHeapCode },
          { id: 'heapSort2', name: 'Heap Sort', dsType: 'array', implemented: true, generator: heapSort2, code: heapSort2Code },
          { id: 'kthLargest', name: 'Kth Largest Element', dsType: 'array', implemented: true, generator: kthLargest, code: kthLargestCode },
          { id: 'mergeKSorted', name: 'Merge K Sorted Lists', dsType: 'array', implemented: true, generator: mergeKSorted, code: mergeKSortedCode },
        ]
      }
    ]
  },
  {
    id: 'math',
    name: '🧮 10. MATHEMATICAL ALGORITHMS',
    subcategories: [
      {
        name: '🔹 Number Theory',
        algorithms: [
          { id: 'sieve', name: 'Sieve of Eratosthenes', dsType: 'array', implemented: true, generator: sieve, code: sieveCode },
          { id: 'gcd', name: 'GCD (Euclid’s Algorithm)', dsType: 'array', implemented: true, generator: gcd, code: gcdCode },
          { id: 'modularArithmetic', name: 'Modular Arithmetic', dsType: 'array', implemented: true, generator: modularArithmetic, code: modularArithmeticCode },
          { id: 'fastExponentiation', name: 'Fast Exponentiation', dsType: 'array', implemented: true, generator: fastExponentiation, code: fastExponentiationCode },
        ]
      }
    ]
  },
  {
    id: 'advanced',
    name: '🧊 11. ADVANCED TOPICS (HIGH LEVEL)',
    subcategories: [
      {
        name: '🔹 Specialized Structures',
        algorithms: [
          { id: 'segmentTreeLazy', name: 'Segment Tree with Lazy Propagation', dsType: 'array', implemented: false },
          { id: 'hld', name: 'Heavy-Light Decomposition', dsType: 'array', implemented: false },
          { id: 'mosAlgorithm', name: 'Mo’s Algorithm', dsType: 'array', implemented: false },
          { id: 'suffixArray', name: 'Suffix Array / Suffix Tree', dsType: 'array', implemented: false },
          { id: 'convexHull', name: 'Convex Hull', dsType: 'array', implemented: false },
        ]
      }
    ]
  }
];

export const getAlgorithmById = (id: string): AlgorithmMeta | null => {
  for (const cat of catalog) {
    if (cat.algorithms) {
      const match = cat.algorithms.find(a => a.id === id);
      if (match) return match;
    }
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        const match = sub.algorithms.find(a => a.id === id);
        if (match) return match;
      }
    }
  }
  return null;
};
