import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

export const ComplexityPanel: React.FC = () => {
  const { currentAlgorithm } = useSelector((state: RootState) => state.visualizer);

  const complexities: Record<string, { time: string, space: string, name: string }> = {
    // Original ones
    bubbleSort: { time: 'O(n²)', space: 'O(1)', name: 'Bubble Sort' },
    quickSort: { time: 'O(n log n)', space: 'O(log n)', name: 'Quick Sort' },
    preorder: { time: 'O(n)', space: 'O(n)', name: 'Preorder' },
    inorder: { time: 'O(n)', space: 'O(n)', name: 'Inorder' },
    postorder: { time: 'O(n)', space: 'O(n)', name: 'Postorder' },
    binarySearch: { time: 'O(log n)', space: 'O(1)', name: 'Binary Search' },
    insertionSort: { time: 'O(n²)', space: 'O(1)', name: 'Insertion Sort' },
    mergeSort: { time: 'O(n log n)', space: 'O(n)', name: 'Merge Sort' },

    // New Arrays
    linearSearch: { time: 'O(n)', space: 'O(1)', name: 'Linear Search' },
    ternarySearch: { time: 'O(log₃ n)', space: 'O(1)', name: 'Ternary Search' },
    selectionSort: { time: 'O(n²)', space: 'O(1)', name: 'Selection Sort' },
    heapSort: { time: 'O(n log n)', space: 'O(1)', name: 'Heap Sort' },
    countingSort: { time: 'O(n + k)', space: 'O(n + k)', name: 'Counting Sort' },
    radixSort: { time: 'O(d * (n + b))', space: 'O(n + b)', name: 'Radix Sort' },
    bucketSort: { time: 'O(n + k)', space: 'O(n + k)', name: 'Bucket Sort' },
    threeSum: { time: 'O(n²)', space: 'O(1)', name: '3Sum' },
    slidingWindowMax: { time: 'O(n)', space: 'O(1)', name: 'Sliding Window Maximum' },
    longestSubstring: { time: 'O(n)', space: 'O(min(n, a))', name: 'Longest Substring Without Repeating' },

    factorial: { time: 'O(n)', space: 'O(n)', name: 'Factorial' },
    fibonacci: { time: 'O(2^n)', space: 'O(n)', name: 'Fibonacci' },
    towerOfHanoi: { time: 'O(2^n)', space: 'O(n)', name: 'Tower of Hanoi' },

    nQueens: { time: 'O(N!)', space: 'O(N)', name: 'N-Queens' },
    sudokuSolver: { time: 'O(9^(N*N))', space: 'O(N*N)', name: 'Sudoku Solver' },
    permutations: { time: 'O(N * N!)', space: 'O(N)', name: 'Permutations / Combinations' },
    subsetGen: { time: 'O(N * 2^N)', space: 'O(N)', name: 'Subset Generation' },

    // Trees
    levelOrder: { time: 'O(N)', space: 'O(N)', name: 'Level Order (BFS)' },
    heightDepth: { time: 'O(N)', space: 'O(H)', name: 'Height / Depth' },
    diameter: { time: 'O(N)', space: 'O(H)', name: 'Diameter' },
    lca: { time: 'O(N)', space: 'O(H)', name: 'Lowest Common Ancestor' },
    balancedTree: { time: 'O(N)', space: 'O(H)', name: 'Balanced Tree' },
    bstInsert: { time: 'O(H)', space: 'O(1)', name: 'BST Insert' },
    kthSmallest: { time: 'O(H + K)', space: 'O(H)', name: 'Kth Smallest Element' },
    avlTree: { time: 'O(log N)', space: 'O(1)', name: 'AVL Tree' },
    segmentTree: { time: 'O(N)', space: 'O(N)', name: 'Segment Tree' },
    fenwickTree: { time: 'O(N log N)', space: 'O(N)', name: 'Fenwick Tree (BIT)' },
    trie: { time: 'O(L)', space: 'O(N*L)', name: 'Trie' },

    // Strings
    kmp: { time: 'O(N + M)', space: 'O(M)', name: 'KMP Algorithm' },
    rabinKarp: { time: 'O(N + M)', space: 'O(1)', name: 'Rabin-Karp' },
    zAlgo: { time: 'O(N + M)', space: 'O(N + M)', name: 'Z Algorithm' },
    manacher: { time: 'O(N)', space: 'O(N)', name: 'Manacher’s Algorithm' },

    // Graphs
    bfs: { time: 'O(V + E)', space: 'O(V)', name: 'BFS' },
    dfs: { time: 'O(V + E)', space: 'O(V)', name: 'DFS' },
    dijkstra: { time: 'O((V + E) log V)', space: 'O(V)', name: 'Dijkstra' },
    bellmanFord: { time: 'O(V * E)', space: 'O(V)', name: 'Bellman-Ford' },
    floydWarshall: { time: 'O(V³)', space: 'O(V²)', name: 'Floyd-Warshall' },
    kruskal: { time: 'O(E log E)', space: 'O(V + E)', name: 'Kruskal' },
    prim: { time: 'O(E log V)', space: 'O(V + E)', name: 'Prim' },
    kahn: { time: 'O(V + E)', space: 'O(V)', name: 'Kahn’s Algorithm' },
    dfsTopo: { time: 'O(V + E)', space: 'O(V)', name: 'DFS Topo Sort' },
    unionFind: { time: 'O(α(V))', space: 'O(V)', name: 'Union-Find' },
    tarjan: { time: 'O(V + E)', space: 'O(V)', name: 'Tarjan’s Algorithm' },
    bridges: { time: 'O(V + E)', space: 'O(V)', name: 'Bridges & Articulation' },
  };

  const data = (currentAlgorithm && complexities[currentAlgorithm]) 
    ? complexities[currentAlgorithm] 
    : { time: '?', space: '?', name: 'Unknown' };

  return (
    <div className="h-full w-full flex flex-col bg-transparent">
      <div className="px-5 py-4 text-[11px] tracking-widest uppercase font-black text-white/50 border-b border-white/10 shrink-0 bg-white/5 shadow-inner">
        Complexity
      </div>
      <div className="flex flex-col gap-4 p-5 flex-1">
        <div className="flex flex-col">
          <span className="text-white/30 font-mono text-[10px] uppercase tracking-widest mb-1 font-bold">Time</span>
          <span className="text-blue-400 font-mono text-lg font-bold drop-shadow-sm">{data.time}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white/30 font-mono text-[10px] uppercase tracking-widest mb-1 font-bold">Space</span>
          <span className="text-purple-400 font-mono text-lg font-bold drop-shadow-sm">{data.space}</span>
        </div>
      </div>
    </div>
  );
};
