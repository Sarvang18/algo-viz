const code = (source: string) => source.trim();
const java = (body: string) => code(`import java.util.*;

class Solution {
${body.trim()}
}`);

const heapSort = java(`
    static int[] heapSort(int[] input) {
        int[] values = input.clone();
        for (int i = values.length / 2 - 1; i >= 0; i--) heapify(values, values.length, i);
        for (int end = values.length - 1; end > 0; end--) {
            swap(values, 0, end);
            heapify(values, end, 0);
        }
        return values;
    }
    static void heapify(int[] values, int size, int root) {
        int largest = root, left = 2 * root + 1, right = left + 1;
        if (left < size && values[left] > values[largest]) largest = left;
        if (right < size && values[right] > values[largest]) largest = right;
        if (largest != root) { swap(values, root, largest); heapify(values, size, largest); }
    }
    static void swap(int[] values, int first, int second) {
        int temporary = values[first]; values[first] = values[second]; values[second] = temporary;
    }
`);

const treeTraversal = (order: 'inorder' | 'preorder' | 'postorder') => java(`
    static class Node {
        int value;
        Node left, right;
        Node(int value) { this.value = value; }
    }

    static List<Integer> ${order}(Node root) {
        List<Integer> result = new ArrayList<>();
        visit(root, result);
        return result;
    }
    static void visit(Node node, List<Integer> result) {
        if (node == null) return;
${order === 'preorder' ? '        result.add(node.value);\n        visit(node.left, result);\n        visit(node.right, result);' : order === 'inorder' ? '        visit(node.left, result);\n        result.add(node.value);\n        visit(node.right, result);' : '        visit(node.left, result);\n        visit(node.right, result);\n        result.add(node.value);'}
    }
`);

export const javaTranslations: Record<string, string> = {
  linearSearch: java(`
    static int linearSearch(int[] values, int target) {
        for (int i = 0; i < values.length; i++)
            if (values[i] == target) return i;
        return -1;
    }
`),
  binarySearch: java(`
    static int binarySearch(int[] values, int target) {
        int left = 0, right = values.length - 1;
        while (left <= right) {
            int middle = left + (right - left) / 2;
            if (values[middle] == target) return middle;
            if (values[middle] < target) left = middle + 1;
            else right = middle - 1;
        }
        return -1;
    }
`),
  ternarySearch: java(`
    static int ternarySearch(int[] values, int target) {
        int left = 0, right = values.length - 1;
        while (left <= right) {
            int third = (right - left) / 3;
            int mid1 = left + third, mid2 = right - third;
            if (values[mid1] == target) return mid1;
            if (values[mid2] == target) return mid2;
            if (target < values[mid1]) right = mid1 - 1;
            else if (target > values[mid2]) left = mid2 + 1;
            else { left = mid1 + 1; right = mid2 - 1; }
        }
        return -1;
    }
`),
  bubbleSort: java(`
    static int[] bubbleSort(int[] input) {
        int[] values = input.clone();
        for (int end = values.length - 1; end > 0; end--) {
            boolean swapped = false;
            for (int i = 0; i < end; i++) if (values[i] > values[i + 1]) {
                int temporary = values[i]; values[i] = values[i + 1]; values[i + 1] = temporary;
                swapped = true;
            }
            if (!swapped) break;
        }
        return values;
    }
`),
  selectionSort: java(`
    static int[] selectionSort(int[] input) {
        int[] values = input.clone();
        for (int i = 0; i < values.length; i++) {
            int smallest = i;
            for (int j = i + 1; j < values.length; j++)
                if (values[j] < values[smallest]) smallest = j;
            int temporary = values[i]; values[i] = values[smallest]; values[smallest] = temporary;
        }
        return values;
    }
`),
  insertionSort: java(`
    static int[] insertionSort(int[] input) {
        int[] values = input.clone();
        for (int i = 1; i < values.length; i++) {
            int key = values[i], j = i - 1;
            while (j >= 0 && values[j] > key) { values[j + 1] = values[j]; j--; }
            values[j + 1] = key;
        }
        return values;
    }
`),
  mergeSort: java(`
    static int[] mergeSort(int[] values) {
        if (values.length <= 1) return values.clone();
        int middle = values.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(values, 0, middle));
        int[] right = mergeSort(Arrays.copyOfRange(values, middle, values.length));
        int[] result = new int[values.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length)
            result[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        while (i < left.length) result[k++] = left[i++];
        while (j < right.length) result[k++] = right[j++];
        return result;
    }
`),
  quickSort: java(`
    static int[] quickSort(int[] input) {
        int[] values = input.clone();
        sort(values, 0, values.length - 1);
        return values;
    }
    static void sort(int[] values, int low, int high) {
        if (low >= high) return;
        int pivot = values[high], next = low;
        for (int i = low; i < high; i++) if (values[i] <= pivot) {
            int temporary = values[next]; values[next] = values[i]; values[i] = temporary; next++;
        }
        int temporary = values[next]; values[next] = values[high]; values[high] = temporary;
        sort(values, low, next - 1); sort(values, next + 1, high);
    }
`),
  heapSort,
  countingSort: java(`
    static int[] countingSort(int[] values) {
        if (values.length == 0) return new int[0];
        int low = Arrays.stream(values).min().orElseThrow();
        int high = Arrays.stream(values).max().orElseThrow();
        int[] count = new int[high - low + 1], result = new int[values.length];
        for (int value : values) count[value - low]++;
        int index = 0;
        for (int i = 0; i < count.length; i++)
            while (count[i]-- > 0) result[index++] = i + low;
        return result;
    }
`),
  radixSort: java(`
    static int[] radixSort(int[] input) {
        int[] values = input.clone();
        if (values.length == 0) return values;
        int[] output = new int[values.length];
        for (long place = 1; Arrays.stream(values).max().orElse(0) / place > 0; place *= 10) {
            int[] count = new int[10];
            for (int value : values) count[(int) (value / place % 10)]++;
            for (int i = 1; i < 10; i++) count[i] += count[i - 1];
            for (int i = values.length - 1; i >= 0; i--)
                output[--count[(int) (values[i] / place % 10)]] = values[i];
            values = output.clone();
        }
        return values;
    }
`),
  bucketSort: java(`
    static double[] bucketSort(double[] input) {
        if (input.length < 2) return input.clone();
        double low = Arrays.stream(input).min().orElseThrow();
        double high = Arrays.stream(input).max().orElseThrow();
        if (low == high) return input.clone();
        List<List<Double>> buckets = new ArrayList<>();
        for (int i = 0; i < input.length; i++) buckets.add(new ArrayList<>());
        for (double value : input) {
            int index = Math.min(input.length - 1, (int) ((value - low) * input.length / (high - low)));
            buckets.get(index).add(value);
        }
        double[] result = new double[input.length]; int index = 0;
        for (List<Double> bucket : buckets) {
            Collections.sort(bucket);
            for (double value : bucket) result[index++] = value;
        }
        return result;
    }
`),
  twoSum: java(`
    static int[] twoSum(int[] values, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < values.length; i++) {
            if (seen.containsKey(target - values[i])) return new int[]{seen.get(target - values[i]), i};
            seen.put(values[i], i);
        }
        return new int[0];
    }
`),
  threeSum: java(`
    static List<List<Integer>> threeSum(int[] input) {
        int[] values = input.clone(); Arrays.sort(values);
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i + 2 < values.length; i++) {
            if (i > 0 && values[i] == values[i - 1]) continue;
            int left = i + 1, right = values.length - 1;
            while (left < right) {
                int total = values[i] + values[left] + values[right];
                if (total < 0) left++;
                else if (total > 0) right--;
                else {
                    result.add(List.of(values[i], values[left++], values[right--]));
                    while (left < right && values[left] == values[left - 1]) left++;
                }
            }
        }
        return result;
    }
`),
  slidingWindowMax: java(`
    static int[] slidingWindowMaximum(int[] values, int windowSize) {
        Deque<Integer> queue = new ArrayDeque<>();
        int[] result = new int[values.length - windowSize + 1];
        for (int i = 0; i < values.length; i++) {
            while (!queue.isEmpty() && queue.peekFirst() <= i - windowSize) queue.removeFirst();
            while (!queue.isEmpty() && values[queue.peekLast()] <= values[i]) queue.removeLast();
            queue.addLast(i);
            if (i >= windowSize - 1) result[i - windowSize + 1] = values[queue.peekFirst()];
        }
        return result;
    }
`),
  longestSubstring: java(`
    static int longestUniqueSubstring(String text) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < text.length(); right++) {
            char character = text.charAt(right);
            if (lastSeen.containsKey(character)) left = Math.max(left, lastSeen.get(character) + 1);
            lastSeen.put(character, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
`),
  factorial: java(`
    static long factorial(int n) {
        if (n < 0) throw new IllegalArgumentException("n must be non-negative");
        return n < 2 ? 1 : n * factorial(n - 1);
    }
`),
  fibonacci: java(`
    static long fibonacci(int n) {
        return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
    }
`),
  towerOfHanoi: java(`
    static List<String> towerOfHanoi(int n, char source, char auxiliary, char destination) {
        List<String> moves = new ArrayList<>();
        move(n, source, auxiliary, destination, moves);
        return moves;
    }
    static void move(int count, char start, char helper, char end, List<String> moves) {
        if (count == 0) return;
        move(count - 1, start, end, helper, moves);
        moves.add(start + " -> " + end);
        move(count - 1, helper, start, end, moves);
    }
`),
  nQueens: java(`
    static List<List<String>> solveNQueens(int n) {
        List<List<String>> answers = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        placeQueen(0, board, new boolean[n], new boolean[2 * n], new boolean[2 * n], answers);
        return answers;
    }
    static void placeQueen(int row, char[][] board, boolean[] columns, boolean[] diagonals,
                           boolean[] antiDiagonals, List<List<String>> answers) {
        int n = board.length;
        if (row == n) { answers.add(Arrays.stream(board).map(String::new).toList()); return; }
        for (int column = 0; column < n; column++) {
            if (columns[column] || diagonals[row - column + n] || antiDiagonals[row + column]) continue;
            board[row][column] = 'Q';
            columns[column] = diagonals[row - column + n] = antiDiagonals[row + column] = true;
            placeQueen(row + 1, board, columns, diagonals, antiDiagonals, answers);
            board[row][column] = '.';
            columns[column] = diagonals[row - column + n] = antiDiagonals[row + column] = false;
        }
    }
`),
  sudokuSolver: java(`
    static boolean solveSudoku(int[][] board) {
        int bestRow = -1, bestColumn = -1;
        List<Integer> bestOptions = null;
        for (int row = 0; row < 9; row++) for (int column = 0; column < 9; column++) {
            if (board[row][column] != 0) continue;
            boolean[] used = new boolean[10];
            for (int i = 0; i < 9; i++) { used[board[row][i]] = true; used[board[i][column]] = true; }
            for (int r = row / 3 * 3; r < row / 3 * 3 + 3; r++)
                for (int c = column / 3 * 3; c < column / 3 * 3 + 3; c++) used[board[r][c]] = true;
            List<Integer> options = new ArrayList<>();
            for (int value = 1; value <= 9; value++) if (!used[value]) options.add(value);
            if (bestOptions == null || options.size() < bestOptions.size()) {
                bestRow = row; bestColumn = column; bestOptions = options;
            }
        }
        if (bestOptions == null) return true;
        for (int value : bestOptions) {
            board[bestRow][bestColumn] = value;
            if (solveSudoku(board)) return true;
            board[bestRow][bestColumn] = 0;
        }
        return false;
    }
`),
  permutations: java(`
    static List<List<Integer>> permutations(int[] values) {
        List<List<Integer>> result = new ArrayList<>();
        buildPermutation(values, 0, result);
        return result;
    }
    static void buildPermutation(int[] values, int first, List<List<Integer>> result) {
        if (first == values.length) { result.add(Arrays.stream(values).boxed().toList()); return; }
        for (int i = first; i < values.length; i++) {
            int temporary = values[first]; values[first] = values[i]; values[i] = temporary;
            buildPermutation(values, first + 1, result);
            temporary = values[first]; values[first] = values[i]; values[i] = temporary;
        }
    }
`),
  subsetGen: java(`
    static List<List<Integer>> subsets(int[] values) {
        List<List<Integer>> result = new ArrayList<>();
        buildSubset(values, 0, new ArrayList<>(), result);
        return result;
    }
    static void buildSubset(int[] values, int index, List<Integer> current, List<List<Integer>> result) {
        if (index == values.length) { result.add(new ArrayList<>(current)); return; }
        buildSubset(values, index + 1, current, result);
        current.add(values[index]); buildSubset(values, index + 1, current, result); current.removeLast();
    }
`),
  inorder: treeTraversal('inorder'),
  preorder: treeTraversal('preorder'),
  postorder: treeTraversal('postorder'),
  levelOrder: java(`
    static class Node { int value; Node left, right; }

    static List<Integer> levelOrder(Node root) {
        if (root == null) return List.of();
        Queue<Node> pending = new ArrayDeque<>(); pending.add(root);
        List<Integer> order = new ArrayList<>();
        while (!pending.isEmpty()) {
            Node node = pending.remove(); order.add(node.value);
            if (node.left != null) pending.add(node.left);
            if (node.right != null) pending.add(node.right);
        }
        return order;
    }
`),
  heightDepth: java(`
    static class Node { int value; Node left, right; }

    static int treeHeight(Node root) {
        return root == null ? 0 : 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
    }
`),
  diameter: java(`
    static class Node { int value; Node left, right; }
    static int longest;

    static int treeDiameter(Node root) {
        longest = 0; height(root); return longest;
    }
    static int height(Node node) {
        if (node == null) return 0;
        int left = height(node.left), right = height(node.right);
        longest = Math.max(longest, left + right);
        return 1 + Math.max(left, right);
    }
`),
  lca: java(`
    static class Node { int value; Node left, right; }

    static Node lowestCommonAncestor(Node root, Node first, Node second) {
        if (root == null || root == first || root == second) return root;
        Node left = lowestCommonAncestor(root.left, first, second);
        Node right = lowestCommonAncestor(root.right, first, second);
        return left != null && right != null ? root : (left != null ? left : right);
    }
`),
  balancedTree: java(`
    static class Node { int value; Node left, right; }

    static boolean isBalanced(Node root) { return height(root) >= 0; }
    static int height(Node node) {
        if (node == null) return 0;
        int left = height(node.left), right = height(node.right);
        if (left < 0 || right < 0 || Math.abs(left - right) > 1) return -1;
        return 1 + Math.max(left, right);
    }
`),
  bstInsert: java(`
    static class Node {
        int value; Node left, right;
        Node(int value) { this.value = value; }
    }
    static Node insert(Node root, int value) {
        if (root == null) return new Node(value);
        if (value < root.value) root.left = insert(root.left, value);
        else if (value > root.value) root.right = insert(root.right, value);
        return root;
    }
    static Node search(Node root, int value) {
        if (root == null || root.value == value) return root;
        return search(value < root.value ? root.left : root.right, value);
    }
    static Node delete(Node root, int value) {
        if (root == null) return null;
        if (value < root.value) root.left = delete(root.left, value);
        else if (value > root.value) root.right = delete(root.right, value);
        else if (root.left == null) return root.right;
        else if (root.right == null) return root.left;
        else {
            Node successor = root.right;
            while (successor.left != null) successor = successor.left;
            root.value = successor.value; root.right = delete(root.right, successor.value);
        }
        return root;
    }
`),
  kthSmallest: java(`
    static class Node { int value; Node left, right; }

    static int kthSmallest(Node root, int k) {
        Deque<Node> stack = new ArrayDeque<>();
        while (root != null || !stack.isEmpty()) {
            while (root != null) { stack.push(root); root = root.left; }
            root = stack.pop();
            if (--k == 0) return root.value;
            root = root.right;
        }
        throw new IllegalArgumentException("k exceeds the number of nodes");
    }
`),
  avlTree: java(`
    static class Node {
        int value, height = 1; Node left, right;
        Node(int value) { this.value = value; }
    }
    static int height(Node node) { return node == null ? 0 : node.height; }
    static void refresh(Node node) { node.height = 1 + Math.max(height(node.left), height(node.right)); }
    static Node rotateRight(Node root) {
        Node next = root.left; root.left = next.right; next.right = root;
        refresh(root); refresh(next); return next;
    }
    static Node rotateLeft(Node root) {
        Node next = root.right; root.right = next.left; next.left = root;
        refresh(root); refresh(next); return next;
    }
    static Node insertAvl(Node root, int value) {
        if (root == null) return new Node(value);
        if (value < root.value) root.left = insertAvl(root.left, value);
        else if (value > root.value) root.right = insertAvl(root.right, value);
        else return root;
        refresh(root); int balance = height(root.left) - height(root.right);
        if (balance > 1) { if (value > root.left.value) root.left = rotateLeft(root.left); return rotateRight(root); }
        if (balance < -1) { if (value < root.right.value) root.right = rotateRight(root.right); return rotateLeft(root); }
        return root;
    }
`),
  segmentTree: java(`
    static class SegmentTree {
        private final int size;
        private final long[] tree;
        SegmentTree(int[] values) {
            size = values.length; tree = new long[2 * size];
            for (int i = 0; i < size; i++) tree[size + i] = values[i];
            for (int i = size - 1; i > 0; i--) tree[i] = tree[2 * i] + tree[2 * i + 1];
        }
        long rangeSum(int left, int right) {
            long total = 0;
            for (left += size, right += size; left < right; left /= 2, right /= 2) {
                if ((left & 1) == 1) total += tree[left++];
                if ((right & 1) == 1) total += tree[--right];
            }
            return total;
        }
    }
`),
  fenwickTree: java(`
    static class FenwickTree {
        private final long[] tree;
        FenwickTree(int[] values) {
            tree = new long[values.length + 1];
            for (int i = 0; i < values.length; i++) add(i, values[i]);
        }
        void add(int index, int delta) {
            for (index++; index < tree.length; index += index & -index) tree[index] += delta;
        }
        long prefixSum(int end) {
            long total = 0;
            for (; end > 0; end -= end & -end) total += tree[end];
            return total;
        }
    }
`),
  trie: java(`
    static class Trie {
        private static class Node {
            Map<Character, Node> children = new HashMap<>();
            boolean terminal;
        }
        private final Node root = new Node();
        void insert(String word) {
            Node node = root;
            for (char character : word.toCharArray())
                node = node.children.computeIfAbsent(character, ignored -> new Node());
            node.terminal = true;
        }
        boolean search(String word) {
            Node node = root;
            for (char character : word.toCharArray()) {
                node = node.children.get(character);
                if (node == null) return false;
            }
            return node.terminal;
        }
    }
`),
  bfs: java(`
    static List<Integer> bfs(List<List<Integer>> graph, int start) {
        boolean[] seen = new boolean[graph.size()];
        Queue<Integer> pending = new ArrayDeque<>(); pending.add(start); seen[start] = true;
        List<Integer> order = new ArrayList<>();
        while (!pending.isEmpty()) {
            int node = pending.remove(); order.add(node);
            for (int neighbor : graph.get(node)) if (!seen[neighbor]) {
                seen[neighbor] = true; pending.add(neighbor);
            }
        }
        return order;
    }
`),
  dfs: java(`
    static List<Integer> dfs(List<List<Integer>> graph, int start) {
        boolean[] seen = new boolean[graph.size()]; List<Integer> order = new ArrayList<>();
        visit(graph, start, seen, order); return order;
    }
    static void visit(List<List<Integer>> graph, int node, boolean[] seen, List<Integer> order) {
        seen[node] = true; order.add(node);
        for (int neighbor : graph.get(node)) if (!seen[neighbor]) visit(graph, neighbor, seen, order);
    }
`),
  dijkstra: java(`
    static long[] dijkstra(List<List<int[]>> graph, int source) {
        long[] distance = new long[graph.size()]; Arrays.fill(distance, Long.MAX_VALUE);
        PriorityQueue<long[]> heap = new PriorityQueue<>(Comparator.comparingLong(entry -> entry[0]));
        distance[source] = 0; heap.add(new long[]{0, source});
        while (!heap.isEmpty()) {
            long[] entry = heap.remove(); long current = entry[0]; int node = (int) entry[1];
            if (current != distance[node]) continue;
            for (int[] edge : graph.get(node)) {
                int neighbor = edge[0], weight = edge[1];
                if (current + weight < distance[neighbor]) {
                    distance[neighbor] = current + weight;
                    heap.add(new long[]{distance[neighbor], neighbor});
                }
            }
        }
        return distance;
    }
`),
  bellmanFord: java(`
    static long[] bellmanFord(int vertices, int[][] edges, int source) {
        long infinity = Long.MAX_VALUE / 4;
        long[] distance = new long[vertices]; Arrays.fill(distance, infinity); distance[source] = 0;
        for (int pass = 1; pass < vertices; pass++) {
            boolean changed = false;
            for (int[] edge : edges) if (distance[edge[0]] != infinity && distance[edge[0]] + edge[2] < distance[edge[1]]) {
                distance[edge[1]] = distance[edge[0]] + edge[2]; changed = true;
            }
            if (!changed) break;
        }
        for (int[] edge : edges)
            if (distance[edge[0]] != infinity && distance[edge[0]] + edge[2] < distance[edge[1]])
                throw new IllegalArgumentException("negative-weight cycle");
        return distance;
    }
`),
  floydWarshall: java(`
    static long[][] floydWarshall(long[][] matrix) {
        long[][] distance = Arrays.stream(matrix).map(long[]::clone).toArray(long[][]::new);
        for (int middle = 0; middle < distance.length; middle++)
            for (int start = 0; start < distance.length; start++)
                for (int end = 0; end < distance.length; end++)
                    distance[start][end] = Math.min(distance[start][end],
                        distance[start][middle] + distance[middle][end]);
        return distance;
    }
`),
  kruskal: java(`
    static List<int[]> kruskal(int vertices, int[][] edges) {
        Arrays.sort(edges, Comparator.comparingInt(edge -> edge[2]));
        DisjointSet sets = new DisjointSet(vertices); List<int[]> tree = new ArrayList<>();
        for (int[] edge : edges) if (sets.union(edge[0], edge[1])) tree.add(edge);
        return tree;
    }
    static class DisjointSet {
        int[] parent, rank;
        DisjointSet(int size) { parent = new int[size]; rank = new int[size]; for (int i = 0; i < size; i++) parent[i] = i; }
        int find(int node) { return parent[node] == node ? node : (parent[node] = find(parent[node])); }
        boolean union(int first, int second) {
            first = find(first); second = find(second); if (first == second) return false;
            if (rank[first] < rank[second]) { int temporary = first; first = second; second = temporary; }
            parent[second] = first; if (rank[first] == rank[second]) rank[first]++; return true;
        }
    }
`),
  prim: java(`
    static List<int[]> prim(List<List<int[]>> graph, int start) {
        PriorityQueue<int[]> heap = new PriorityQueue<>(Comparator.comparingInt(edge -> edge[0]));
        boolean[] seen = new boolean[graph.size()]; List<int[]> tree = new ArrayList<>(); seen[start] = true;
        for (int[] edge : graph.get(start)) heap.add(new int[]{edge[1], start, edge[0]});
        while (!heap.isEmpty() && tree.size() + 1 < graph.size()) {
            int[] entry = heap.remove(); int weight = entry[0], source = entry[1], node = entry[2];
            if (seen[node]) continue;
            seen[node] = true; tree.add(new int[]{source, node, weight});
            for (int[] edge : graph.get(node)) if (!seen[edge[0]]) heap.add(new int[]{edge[1], node, edge[0]});
        }
        return tree;
    }
`),
  kahn: java(`
    static List<Integer> topologicalSort(List<List<Integer>> graph) {
        int[] indegree = new int[graph.size()];
        for (List<Integer> neighbors : graph) for (int neighbor : neighbors) indegree[neighbor]++;
        Queue<Integer> pending = new ArrayDeque<>();
        for (int node = 0; node < graph.size(); node++) if (indegree[node] == 0) pending.add(node);
        List<Integer> order = new ArrayList<>();
        while (!pending.isEmpty()) {
            int node = pending.remove(); order.add(node);
            for (int neighbor : graph.get(node)) if (--indegree[neighbor] == 0) pending.add(neighbor);
        }
        if (order.size() != graph.size()) throw new IllegalArgumentException("graph contains a cycle");
        return order;
    }
`),
  dfsTopo: java(`
    static List<Integer> topologicalSort(List<List<Integer>> graph) {
        int[] state = new int[graph.size()]; List<Integer> order = new ArrayList<>();
        for (int node = 0; node < graph.size(); node++) visit(graph, node, state, order);
        Collections.reverse(order); return order;
    }
    static void visit(List<List<Integer>> graph, int node, int[] state, List<Integer> order) {
        if (state[node] == 1) throw new IllegalArgumentException("graph contains a cycle");
        if (state[node] == 2) return;
        state[node] = 1; for (int neighbor : graph.get(node)) visit(graph, neighbor, state, order);
        state[node] = 2; order.add(node);
    }
`),
  unionFind: java(`
    static class DisjointSet {
        private final int[] parent, rank;
        DisjointSet(int size) {
            parent = new int[size]; rank = new int[size];
            for (int i = 0; i < size; i++) parent[i] = i;
        }
        int find(int node) { return parent[node] == node ? node : (parent[node] = find(parent[node])); }
        boolean union(int first, int second) {
            first = find(first); second = find(second);
            if (first == second) return false;
            if (rank[first] < rank[second]) { int temporary = first; first = second; second = temporary; }
            parent[second] = first;
            if (rank[first] == rank[second]) rank[first]++;
            return true;
        }
    }
`),
  tarjan: java(`
    static List<List<Integer>> stronglyConnectedComponents(List<List<Integer>> graph) {
        Tarjan state = new Tarjan(graph); return state.run();
    }
    static class Tarjan {
        final List<List<Integer>> graph, components = new ArrayList<>();
        final int[] index, low; final boolean[] onStack; final Deque<Integer> stack = new ArrayDeque<>();
        int time;
        Tarjan(List<List<Integer>> graph) {
            this.graph = graph; index = new int[graph.size()]; Arrays.fill(index, -1);
            low = new int[graph.size()]; onStack = new boolean[graph.size()];
        }
        List<List<Integer>> run() { for (int node = 0; node < graph.size(); node++) if (index[node] < 0) visit(node); return components; }
        void visit(int node) {
            index[node] = low[node] = time++; stack.push(node); onStack[node] = true;
            for (int neighbor : graph.get(node)) {
                if (index[neighbor] < 0) { visit(neighbor); low[node] = Math.min(low[node], low[neighbor]); }
                else if (onStack[neighbor]) low[node] = Math.min(low[node], index[neighbor]);
            }
            if (low[node] == index[node]) {
                List<Integer> component = new ArrayList<>(); int member;
                do { member = stack.pop(); onStack[member] = false; component.add(member); } while (member != node);
                components.add(component);
            }
        }
    }
`),
  bridges: java(`
    static class BridgeResult {
        List<int[]> bridges = new ArrayList<>(); Set<Integer> articulationPoints = new HashSet<>();
    }
    static BridgeResult bridgesAndArticulationPoints(List<List<Integer>> graph) {
        BridgeSearch search = new BridgeSearch(graph); return search.run();
    }
    static class BridgeSearch {
        final List<List<Integer>> graph; final int[] discovered, low; final BridgeResult result = new BridgeResult(); int time;
        BridgeSearch(List<List<Integer>> graph) { this.graph = graph; discovered = new int[graph.size()]; Arrays.fill(discovered, -1); low = new int[graph.size()]; }
        BridgeResult run() { for (int node = 0; node < graph.size(); node++) if (discovered[node] < 0) visit(node, -1); return result; }
        void visit(int node, int parent) {
            discovered[node] = low[node] = time++; int children = 0;
            for (int neighbor : graph.get(node)) {
                if (neighbor == parent) continue;
                if (discovered[neighbor] < 0) {
                    children++; visit(neighbor, node); low[node] = Math.min(low[node], low[neighbor]);
                    if (low[neighbor] > discovered[node]) result.bridges.add(new int[]{node, neighbor});
                    if (parent >= 0 && low[neighbor] >= discovered[node]) result.articulationPoints.add(node);
                } else low[node] = Math.min(low[node], discovered[neighbor]);
            }
            if (parent < 0 && children > 1) result.articulationPoints.add(node);
        }
    }
`),
  fibonacciDp: java(`
    static long fibonacciDP(int n) {
        if (n < 2) return n;
        long previous = 0, current = 1;
        for (int i = 2; i <= n; i++) { long next = previous + current; previous = current; current = next; }
        return current;
    }
`),
  climbingStairs: java(`
    static long climbStairs(int n) {
        long previous = 1, current = 1;
        for (int i = 0; i < n; i++) { long next = previous + current; previous = current; current = next; }
        return previous;
    }
`),
  knapsack: java(`
    static int knapsack(int[] weights, int[] values, int capacity) {
        int[] best = new int[capacity + 1];
        for (int i = 0; i < weights.length; i++)
            for (int limit = capacity; limit >= weights[i]; limit--)
                best[limit] = Math.max(best[limit], best[limit - weights[i]] + values[i]);
        return best[capacity];
    }
`),
  lcs: java(`
    static int longestCommonSubsequence(String first, String second) {
        int[] previous = new int[second.length() + 1], current = new int[second.length() + 1];
        for (char a : first.toCharArray()) {
            for (int j = 1; j <= second.length(); j++)
                current[j] = a == second.charAt(j - 1) ? previous[j - 1] + 1 : Math.max(previous[j], current[j - 1]);
            int[] temporary = previous; previous = current; current = temporary; Arrays.fill(current, 0);
        }
        return previous[second.length()];
    }
`),
  lis: java(`
    static int longestIncreasingSubsequence(int[] values) {
        int[] tails = new int[values.length]; int size = 0;
        for (int value : values) {
            int left = 0, right = size;
            while (left < right) { int middle = (left + right) / 2; if (tails[middle] < value) left = middle + 1; else right = middle; }
            tails[left] = value; if (left == size) size++;
        }
        return size;
    }
`),
  editDistance: java(`
    static int editDistance(String first, String second) {
        int[] previous = new int[second.length() + 1], current = new int[second.length() + 1];
        for (int i = 0; i <= second.length(); i++) previous[i] = i;
        for (int i = 1; i <= first.length(); i++) {
            current[0] = i;
            for (int j = 1; j <= second.length(); j++)
                current[j] = first.charAt(i - 1) == second.charAt(j - 1) ? previous[j - 1]
                    : 1 + Math.min(previous[j - 1], Math.min(previous[j], current[j - 1]));
            int[] temporary = previous; previous = current; current = temporary;
        }
        return previous[second.length()];
    }
`),
  dpTrees: java(`
    static class Node { int value; Node left, right; }
    static int answer;

    static int maximumPathSum(Node root) {
        answer = Integer.MIN_VALUE; gain(root); return answer;
    }
    static int gain(Node node) {
        if (node == null) return 0;
        int left = Math.max(0, gain(node.left)), right = Math.max(0, gain(node.right));
        answer = Math.max(answer, node.value + left + right);
        return node.value + Math.max(left, right);
    }
`),
  dpGrids: java(`
    static int minimumCostPath(int[][] grid) {
        int rows = grid.length, columns = grid[0].length;
        int[][] best = new int[rows][columns];
        for (int[] row : best) Arrays.fill(row, Integer.MAX_VALUE);
        best[0][0] = grid[0][0];
        for (int row = 0; row < rows; row++) for (int column = 0; column < columns; column++) {
            if (row > 0) best[row][column] = Math.min(best[row][column], best[row - 1][column] + grid[row][column]);
            if (column > 0) best[row][column] = Math.min(best[row][column], best[row][column - 1] + grid[row][column]);
        }
        return best[rows - 1][columns - 1];
    }
`),
  bitmaskDp: java(`
    static int minimumAssignmentCost(int[][] cost) {
        int size = cost.length; int[] best = new int[1 << size]; Arrays.fill(best, Integer.MAX_VALUE / 2); best[0] = 0;
        for (int mask = 0; mask < 1 << size; mask++) {
            int worker = Integer.bitCount(mask);
            if (worker == size) continue;
            for (int job = 0; job < size; job++) if ((mask & 1 << job) == 0)
                best[mask | 1 << job] = Math.min(best[mask | 1 << job], best[mask] + cost[worker][job]);
        }
        return best[best.length - 1];
    }
`),
  activitySelection: java(`
    static List<int[]> activitySelection(int[][] activities) {
        Arrays.sort(activities, Comparator.comparingInt(activity -> activity[1]));
        List<int[]> selected = new ArrayList<>(); int lastEnd = Integer.MIN_VALUE;
        for (int[] activity : activities) if (activity[0] >= lastEnd) {
            selected.add(activity); lastEnd = activity[1];
        }
        return selected;
    }
`),
  fractionalKnapsack: java(`
    static double fractionalKnapsack(double[][] items, double capacity) {
        Arrays.sort(items, (first, second) -> Double.compare(second[0] / second[1], first[0] / first[1]));
        double total = 0;
        for (double[] item : items) {
            double taken = Math.min(item[1], capacity);
            total += taken * item[0] / item[1]; capacity -= taken;
            if (capacity == 0) break;
        }
        return total;
    }
`),
  huffmanCoding: java(`
    static class Node {
        char character; int frequency; Node left, right;
        Node(char character, int frequency, Node left, Node right) {
            this.character = character; this.frequency = frequency; this.left = left; this.right = right;
        }
    }
    static Map<Character, String> huffmanCodes(Map<Character, Integer> frequencies) {
        PriorityQueue<Node> heap = new PriorityQueue<>(Comparator.comparingInt(node -> node.frequency));
        frequencies.forEach((character, frequency) -> heap.add(new Node(character, frequency, null, null)));
        while (heap.size() > 1) {
            Node left = heap.remove(), right = heap.remove();
            heap.add(new Node('\\0', left.frequency + right.frequency, left, right));
        }
        Map<Character, String> codes = new HashMap<>();
        if (!heap.isEmpty()) buildCodes(heap.remove(), "", codes);
        return codes;
    }
    static void buildCodes(Node node, String prefix, Map<Character, String> codes) {
        if (node.left == null && node.right == null) { codes.put(node.character, prefix.isEmpty() ? "0" : prefix); return; }
        buildCodes(node.left, prefix + "0", codes); buildCodes(node.right, prefix + "1", codes);
    }
`),
  jobScheduling: java(`
    static List<int[]> jobScheduling(int[][] jobs) {
        Arrays.sort(jobs, (first, second) -> Integer.compare(second[2], first[2]));
        int limit = Arrays.stream(jobs).mapToInt(job -> job[1]).max().orElse(0);
        int[][] slots = new int[limit][];
        for (int[] job : jobs) for (int slot = Math.min(job[1], limit) - 1; slot >= 0; slot--)
            if (slots[slot] == null) { slots[slot] = job; break; }
        return Arrays.stream(slots).filter(Objects::nonNull).toList();
    }
`),
  kmp: java(`
    static List<Integer> kmp(String text, String pattern) {
        int[] prefix = new int[pattern.length()];
        for (int i = 1, length = 0; i < pattern.length(); i++) {
            while (length > 0 && pattern.charAt(i) != pattern.charAt(length)) length = prefix[length - 1];
            if (pattern.charAt(i) == pattern.charAt(length)) length++;
            prefix[i] = length;
        }
        List<Integer> matches = new ArrayList<>();
        for (int i = 0, j = 0; i < text.length(); i++) {
            while (j > 0 && text.charAt(i) != pattern.charAt(j)) j = prefix[j - 1];
            if (text.charAt(i) == pattern.charAt(j)) j++;
            if (j == pattern.length()) { matches.add(i - j + 1); j = prefix[j - 1]; }
        }
        return matches;
    }
`),
  rabinKarp: java(`
    static List<Integer> rabinKarp(String text, String pattern) {
        long base = 256, modulus = 1_000_000_007L;
        if (pattern.length() > text.length()) return List.of();
        long power = 1, targetHash = 0, windowHash = 0;
        for (int i = 1; i < pattern.length(); i++) power = power * base % modulus;
        for (int i = 0; i < pattern.length(); i++) {
            targetHash = (targetHash * base + pattern.charAt(i)) % modulus;
            windowHash = (windowHash * base + text.charAt(i)) % modulus;
        }
        List<Integer> matches = new ArrayList<>();
        for (int start = 0; start + pattern.length() <= text.length(); start++) {
            if (targetHash == windowHash && text.startsWith(pattern, start)) matches.add(start);
            if (start + pattern.length() < text.length())
                windowHash = ((windowHash - text.charAt(start) * power % modulus + modulus) * base
                    + text.charAt(start + pattern.length())) % modulus;
        }
        return matches;
    }
`),
  zAlgo: java(`
    static List<Integer> zSearch(String text, String pattern) {
        String combined = pattern + "$" + text; int[] z = new int[combined.length()];
        List<Integer> matches = new ArrayList<>(); int left = 0, right = 0;
        for (int i = 1; i < combined.length(); i++) {
            if (i <= right) z[i] = Math.min(right - i + 1, z[i - left]);
            while (i + z[i] < combined.length() && combined.charAt(z[i]) == combined.charAt(i + z[i])) z[i]++;
            if (i + z[i] - 1 > right) { left = i; right = i + z[i] - 1; }
            if (z[i] == pattern.length()) matches.add(i - pattern.length() - 1);
        }
        return matches;
    }
`),
  manacher: java(`
    static String longestPalindrome(String text) {
        StringBuilder transformed = new StringBuilder("^#");
        for (char character : text.toCharArray()) transformed.append(character).append('#');
        transformed.append('$');
        int[] radius = new int[transformed.length()]; int center = 0, right = 0;
        for (int i = 1; i + 1 < transformed.length(); i++) {
            int mirror = 2 * center - i;
            if (i < right) radius[i] = Math.min(right - i, radius[mirror]);
            while (transformed.charAt(i + radius[i] + 1) == transformed.charAt(i - radius[i] - 1)) radius[i]++;
            if (i + radius[i] > right) { center = i; right = i + radius[i]; }
        }
        int best = 0;
        for (int i = 1; i < radius.length; i++) if (radius[i] > radius[best]) best = i;
        int start = (best - radius[best]) / 2;
        return text.substring(start, start + radius[best]);
    }
`),
  xorTricks: java(`
    static int findSingle(int[] values) {
        int result = 0;
        for (int value : values) result ^= value;
        return result;
    }
`),
  subsetsBits: java(`
    static List<List<Integer>> bitmaskSubsets(int[] values) {
        List<List<Integer>> result = new ArrayList<>();
        for (int mask = 0; mask < 1 << values.length; mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < values.length; i++) if ((mask & 1 << i) != 0) subset.add(values[i]);
            result.add(subset);
        }
        return result;
    }
`),
  powerOf2: java(`
    static boolean isPowerOfTwo(int value) {
        return value > 0 && (value & (value - 1)) == 0;
    }
`),
  minMaxHeap: java(`
    static class MinMaxHeap {
        private final PriorityQueue<Integer> minimum = new PriorityQueue<>();
        private final PriorityQueue<Integer> maximum = new PriorityQueue<>(Comparator.reverseOrder());
        void push(int value) { minimum.add(value); maximum.add(value); }
        int min() { return minimum.element(); }
        int max() { return maximum.element(); }
    }
`),
  heapSort2: heapSort,
  kthLargest: java(`
    static int kthLargest(int[] values, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int value : values) { heap.add(value); if (heap.size() > k) heap.remove(); }
        return heap.element();
    }
`),
  mergeKSorted: java(`
    static List<Integer> mergeKSorted(List<List<Integer>> lists) {
        PriorityQueue<int[]> heap = new PriorityQueue<>(Comparator.comparingInt(entry -> entry[0]));
        for (int list = 0; list < lists.size(); list++)
            if (!lists.get(list).isEmpty()) heap.add(new int[]{lists.get(list).getFirst(), list, 0});
        List<Integer> result = new ArrayList<>();
        while (!heap.isEmpty()) {
            int[] entry = heap.remove(); int value = entry[0], list = entry[1], index = entry[2]; result.add(value);
            if (++index < lists.get(list).size()) heap.add(new int[]{lists.get(list).get(index), list, index});
        }
        return result;
    }
`),
  sieve: java(`
    static List<Integer> sieve(int limit) {
        boolean[] prime = new boolean[limit + 1]; Arrays.fill(prime, true);
        prime[0] = prime[1] = false;
        for (int number = 2; number * number <= limit; number++) if (prime[number])
            for (int multiple = number * number; multiple <= limit; multiple += number) prime[multiple] = false;
        List<Integer> result = new ArrayList<>();
        for (int number = 2; number <= limit; number++) if (prime[number]) result.add(number);
        return result;
    }
`),
  gcd: java(`
    static long gcd(long first, long second) {
        while (second != 0) { long temporary = first % second; first = second; second = temporary; }
        return Math.abs(first);
    }
`),
  modularArithmetic: java(`
    static long modularPower(long base, long exponent, long modulus) {
        long result = 1; base %= modulus;
        while (exponent != 0) {
            if ((exponent & 1) != 0) result = result * base % modulus;
            base = base * base % modulus; exponent >>= 1;
        }
        return result;
    }
`),
  fastExponentiation: java(`
    static long fastPower(long base, long exponent) {
        long result = 1;
        while (exponent != 0) {
            if ((exponent & 1) != 0) result *= base;
            base *= base; exponent >>= 1;
        }
        return result;
    }
`),
};
