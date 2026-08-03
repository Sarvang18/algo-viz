const code = (source: string) => source.trim();

const heapSort = code(`
def heap_sort(values):
    a = values[:]

    def heapify(size, root):
        largest = root
        left, right = 2 * root + 1, 2 * root + 2
        if left < size and a[left] > a[largest]: largest = left
        if right < size and a[right] > a[largest]: largest = right
        if largest != root:
            a[root], a[largest] = a[largest], a[root]
            heapify(size, largest)

    for i in range(len(a) // 2 - 1, -1, -1): heapify(len(a), i)
    for end in range(len(a) - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        heapify(end, 0)
    return a
`);

const treeTraversal = (order: 'inorder' | 'preorder' | 'postorder') => code(`
class Node:
    def __init__(self, value, left=None, right=None):
        self.value, self.left, self.right = value, left, right

def ${order}(root):
    result = []
    def visit(node):
        if not node: return
${order === 'preorder' ? '        result.append(node.value)\n        visit(node.left)\n        visit(node.right)' : order === 'inorder' ? '        visit(node.left)\n        result.append(node.value)\n        visit(node.right)' : '        visit(node.left)\n        visit(node.right)\n        result.append(node.value)'}
    visit(root)
    return result
`);

export const pythonTranslations: Record<string, string> = {
  linearSearch: code(`
def linear_search(values, target):
    for index, value in enumerate(values):
        if value == target:
            return index
    return -1
`),
  binarySearch: code(`
def binary_search(values, target):
    left, right = 0, len(values) - 1
    while left <= right:
        middle = (left + right) // 2
        if values[middle] == target: return middle
        if values[middle] < target: left = middle + 1
        else: right = middle - 1
    return -1
`),
  ternarySearch: code(`
def ternary_search(values, target):
    left, right = 0, len(values) - 1
    while left <= right:
        third = (right - left) // 3
        mid1, mid2 = left + third, right - third
        if values[mid1] == target: return mid1
        if values[mid2] == target: return mid2
        if target < values[mid1]: right = mid1 - 1
        elif target > values[mid2]: left = mid2 + 1
        else: left, right = mid1 + 1, mid2 - 1
    return -1
`),
  bubbleSort: code(`
def bubble_sort(values):
    a = values[:]
    for end in range(len(a) - 1, 0, -1):
        swapped = False
        for i in range(end):
            if a[i] > a[i + 1]:
                a[i], a[i + 1] = a[i + 1], a[i]
                swapped = True
        if not swapped: break
    return a
`),
  selectionSort: code(`
def selection_sort(values):
    a = values[:]
    for i in range(len(a)):
        smallest = min(range(i, len(a)), key=a.__getitem__)
        a[i], a[smallest] = a[smallest], a[i]
    return a
`),
  insertionSort: code(`
def insertion_sort(values):
    a = values[:]
    for i in range(1, len(a)):
        key, j = a[i], i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a
`),
  mergeSort: code(`
def merge_sort(values):
    if len(values) <= 1: return values[:]
    middle = len(values) // 2
    left, right = merge_sort(values[:middle]), merge_sort(values[middle:])
    merged = []
    while left and right:
        merged.append(left.pop(0) if left[0] <= right[0] else right.pop(0))
    return merged + left + right
`),
  quickSort: code(`
def quick_sort(values):
    a = values[:]
    def sort(low, high):
        if low >= high: return
        pivot, i = a[high], low
        for j in range(low, high):
            if a[j] <= pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[high] = a[high], a[i]
        sort(low, i - 1)
        sort(i + 1, high)
    sort(0, len(a) - 1)
    return a
`),
  heapSort,
  countingSort: code(`
def counting_sort(values):
    if not values: return []
    low, high = min(values), max(values)
    count = [0] * (high - low + 1)
    for value in values: count[value - low] += 1
    return [value for i, amount in enumerate(count)
            for value in [i + low] * amount]
`),
  radixSort: code(`
def radix_sort(values):
    if not values: return []
    a, place = values[:], 1
    while max(a) // place:
        buckets = [[] for _ in range(10)]
        for value in a: buckets[(value // place) % 10].append(value)
        a = [value for bucket in buckets for value in bucket]
        place *= 10
    return a
`),
  bucketSort: code(`
def bucket_sort(values):
    if len(values) < 2: return values[:]
    low, high = min(values), max(values)
    if low == high: return values[:]
    buckets = [[] for _ in values]
    for value in values:
        index = min(len(values) - 1,
                    int((value - low) * len(values) / (high - low + 1)))
        buckets[index].append(value)
    return [value for bucket in buckets for value in sorted(bucket)]
`),
  twoSum: code(`
def two_sum(values, target):
    seen = {}
    for index, value in enumerate(values):
        if target - value in seen:
            return [seen[target - value], index]
        seen[value] = index
    return []
`),
  threeSum: code(`
def three_sum(values):
    values, result = sorted(values), []
    for i in range(len(values) - 2):
        if i and values[i] == values[i - 1]: continue
        left, right = i + 1, len(values) - 1
        while left < right:
            total = values[i] + values[left] + values[right]
            if total < 0: left += 1
            elif total > 0: right -= 1
            else:
                result.append([values[i], values[left], values[right]])
                left += 1; right -= 1
                while left < right and values[left] == values[left - 1]: left += 1
    return result
`),
  slidingWindowMax: code(`
from collections import deque

def sliding_window_maximum(values, window_size):
    queue, result = deque(), []
    for i, value in enumerate(values):
        while queue and queue[0] <= i - window_size: queue.popleft()
        while queue and values[queue[-1]] <= value: queue.pop()
        queue.append(i)
        if i >= window_size - 1: result.append(values[queue[0]])
    return result
`),
  longestSubstring: code(`
def longest_unique_substring(text):
    last_seen, left, best = {}, 0, 0
    for right, char in enumerate(text):
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        best = max(best, right - left + 1)
    return best
`),
  factorial: code(`
def factorial(n):
    if n < 0: raise ValueError("n must be non-negative")
    return 1 if n < 2 else n * factorial(n - 1)
`),
  fibonacci: code(`
def fibonacci(n):
    if n < 2: return n
    return fibonacci(n - 1) + fibonacci(n - 2)
`),
  towerOfHanoi: code(`
def tower_of_hanoi(n, source, auxiliary, destination):
    moves = []
    def move(count, start, helper, end):
        if count == 0: return
        move(count - 1, start, end, helper)
        moves.append((start, end))
        move(count - 1, helper, start, end)
    move(n, source, auxiliary, destination)
    return moves
`),
  nQueens: code(`
def solve_n_queens(n):
    board, answers = [-1] * n, []
    columns, diagonals, anti_diagonals = set(), set(), set()
    def place(row):
        if row == n:
            answers.append(board[:]); return
        for column in range(n):
            if column in columns or row - column in diagonals or row + column in anti_diagonals: continue
            board[row] = column
            columns.add(column); diagonals.add(row - column); anti_diagonals.add(row + column)
            place(row + 1)
            columns.remove(column); diagonals.remove(row - column); anti_diagonals.remove(row + column)
    place(0)
    return answers
`),
  sudokuSolver: code(`
def solve_sudoku(board):
    def candidates(row, column):
        used = set(board[row]) | {board[r][column] for r in range(9)}
        box_row, box_col = row - row % 3, column - column % 3
        used |= {board[r][c] for r in range(box_row, box_row + 3)
                 for c in range(box_col, box_col + 3)}
        return set(range(1, 10)) - used

    def solve():
        choices = [(candidates(r, c), r, c) for r in range(9)
                   for c in range(9) if board[r][c] == 0]
        if not choices: return True
        options, row, column = min(choices, key=lambda item: len(item[0]))
        for value in options:
            board[row][column] = value
            if solve(): return True
            board[row][column] = 0
        return False
    return board if solve() else None
`),
  permutations: code(`
def permutations(values):
    result = []
    def build(first):
        if first == len(values): result.append(values[:]); return
        for i in range(first, len(values)):
            values[first], values[i] = values[i], values[first]
            build(first + 1)
            values[first], values[i] = values[i], values[first]
    build(0)
    return result
`),
  subsetGen: code(`
def subsets(values):
    result = []
    def build(index, current):
        if index == len(values): result.append(current[:]); return
        build(index + 1, current)
        current.append(values[index])
        build(index + 1, current)
        current.pop()
    build(0, [])
    return result
`),
  inorder: treeTraversal('inorder'),
  preorder: treeTraversal('preorder'),
  postorder: treeTraversal('postorder'),
  levelOrder: code(`
from collections import deque

def level_order(root):
    if not root: return []
    queue, result = deque([root]), []
    while queue:
        node = queue.popleft()
        result.append(node.value)
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
    return result
`),
  heightDepth: code(`
def tree_height(root):
    if not root: return 0
    return 1 + max(tree_height(root.left), tree_height(root.right))
`),
  diameter: code(`
def tree_diameter(root):
    longest = 0
    def height(node):
        nonlocal longest
        if not node: return 0
        left, right = height(node.left), height(node.right)
        longest = max(longest, left + right)
        return 1 + max(left, right)
    height(root)
    return longest
`),
  lca: code(`
def lowest_common_ancestor(root, first, second):
    if not root or root is first or root is second: return root
    left = lowest_common_ancestor(root.left, first, second)
    right = lowest_common_ancestor(root.right, first, second)
    if left and right: return root
    return left or right
`),
  balancedTree: code(`
def is_balanced(root):
    def height(node):
        if not node: return 0
        left, right = height(node.left), height(node.right)
        if left < 0 or right < 0 or abs(left - right) > 1: return -1
        return 1 + max(left, right)
    return height(root) >= 0
`),
  bstInsert: code(`
class Node:
    def __init__(self, value):
        self.value, self.left, self.right = value, None, None

def insert(root, value):
    if not root: return Node(value)
    if value < root.value: root.left = insert(root.left, value)
    elif value > root.value: root.right = insert(root.right, value)
    return root

def search(root, value):
    if not root or root.value == value: return root
    return search(root.left if value < root.value else root.right, value)

def delete(root, value):
    if not root: return None
    if value < root.value: root.left = delete(root.left, value)
    elif value > root.value: root.right = delete(root.right, value)
    elif not root.left: return root.right
    elif not root.right: return root.left
    else:
        successor = root.right
        while successor.left: successor = successor.left
        root.value = successor.value
        root.right = delete(root.right, successor.value)
    return root
`),
  kthSmallest: code(`
def kth_smallest(root, k):
    stack, node = [], root
    while stack or node:
        while node: stack.append(node); node = node.left
        node = stack.pop(); k -= 1
        if k == 0: return node.value
        node = node.right
    raise ValueError("k exceeds the number of nodes")
`),
  avlTree: code(`
class AvlNode:
    def __init__(self, value):
        self.value, self.left, self.right, self.height = value, None, None, 1

def insert_avl(root, value):
    if not root: return AvlNode(value)
    if value < root.value: root.left = insert_avl(root.left, value)
    elif value > root.value: root.right = insert_avl(root.right, value)
    else: return root
    height = lambda node: node.height if node else 0
    root.height = 1 + max(height(root.left), height(root.right))
    balance = height(root.left) - height(root.right)
    def rotate_right(y):
        x, middle = y.left, y.left.right
        x.right, y.left = y, middle
        y.height = 1 + max(height(y.left), height(y.right))
        x.height = 1 + max(height(x.left), height(x.right))
        return x
    def rotate_left(x):
        y, middle = x.right, x.right.left
        y.left, x.right = x, middle
        x.height = 1 + max(height(x.left), height(x.right))
        y.height = 1 + max(height(y.left), height(y.right))
        return y
    if balance > 1:
        if value > root.left.value: root.left = rotate_left(root.left)
        return rotate_right(root)
    if balance < -1:
        if value < root.right.value: root.right = rotate_right(root.right)
        return rotate_left(root)
    return root
`),
  segmentTree: code(`
class SegmentTree:
    def __init__(self, values):
        self.size = len(values)
        self.tree = [0] * (2 * self.size)
        self.tree[self.size:] = values
        for i in range(self.size - 1, 0, -1):
            self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]

    def range_sum(self, left, right):
        left += self.size; right += self.size
        total = 0
        while left < right:
            if left & 1: total += self.tree[left]; left += 1
            if right & 1: right -= 1; total += self.tree[right]
            left //= 2; right //= 2
        return total
`),
  fenwickTree: code(`
class FenwickTree:
    def __init__(self, values):
        self.tree = [0] * (len(values) + 1)
        for index, value in enumerate(values): self.add(index, value)

    def add(self, index, delta):
        index += 1
        while index < len(self.tree):
            self.tree[index] += delta
            index += index & -index

    def prefix_sum(self, index):
        total = 0
        while index > 0:
            total += self.tree[index]
            index -= index & -index
        return total
`),
  trie: code(`
class Trie:
    def __init__(self):
        self.children, self.terminal = {}, False

    def insert(self, word):
        node = self
        for char in word: node = node.children.setdefault(char, Trie())
        node.terminal = True

    def search(self, word):
        node = self
        for char in word:
            if char not in node.children: return False
            node = node.children[char]
        return node.terminal

    def starts_with(self, prefix):
        node = self
        for char in prefix:
            if char not in node.children: return False
            node = node.children[char]
        return True
`),
  bfs: code(`
from collections import deque

def bfs(graph, start):
    queue, seen, order = deque([start]), {start}, []
    while queue:
        node = queue.popleft(); order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in seen:
                seen.add(neighbor); queue.append(neighbor)
    return order
`),
  dfs: code(`
def dfs(graph, start):
    seen, order = set(), []
    def visit(node):
        seen.add(node); order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in seen: visit(neighbor)
    visit(start)
    return order
`),
  dijkstra: code(`
from heapq import heappop, heappush

def dijkstra(graph, source):
    distance, heap = {node: float('inf') for node in graph}, [(0, source)]
    distance[source] = 0
    while heap:
        current, node = heappop(heap)
        if current != distance[node]: continue
        for neighbor, weight in graph[node]:
            candidate = current + weight
            if candidate < distance[neighbor]:
                distance[neighbor] = candidate
                heappush(heap, (candidate, neighbor))
    return distance
`),
  bellmanFord: code(`
def bellman_ford(vertex_count, edges, source):
    distance = [float('inf')] * vertex_count
    distance[source] = 0
    for _ in range(vertex_count - 1):
        changed = False
        for start, end, weight in edges:
            if distance[start] != float('inf') and distance[start] + weight < distance[end]:
                distance[end] = distance[start] + weight; changed = True
        if not changed: break
    if any(distance[u] != float('inf') and distance[u] + w < distance[v]
           for u, v, w in edges):
        raise ValueError("negative-weight cycle")
    return distance
`),
  floydWarshall: code(`
def floyd_warshall(matrix):
    distance = [row[:] for row in matrix]
    for middle in range(len(distance)):
        for start in range(len(distance)):
            for end in range(len(distance)):
                distance[start][end] = min(
                    distance[start][end],
                    distance[start][middle] + distance[middle][end])
    return distance
`),
  kruskal: code(`
def kruskal(vertex_count, edges):
    parent, rank, tree = list(range(vertex_count)), [0] * vertex_count, []
    def find(node):
        if parent[node] != node: parent[node] = find(parent[node])
        return parent[node]
    def union(a, b):
        a, b = find(a), find(b)
        if a == b: return False
        if rank[a] < rank[b]: a, b = b, a
        parent[b] = a
        if rank[a] == rank[b]: rank[a] += 1
        return True
    for start, end, weight in sorted(edges, key=lambda edge: edge[2]):
        if union(start, end): tree.append((start, end, weight))
    return tree
`),
  prim: code(`
from heapq import heappop, heappush

def prim(graph, start=0):
    seen, heap, tree = {start}, [], []
    for neighbor, weight in graph[start]: heappush(heap, (weight, start, neighbor))
    while heap and len(seen) < len(graph):
        weight, source, node = heappop(heap)
        if node in seen: continue
        seen.add(node); tree.append((source, node, weight))
        for neighbor, cost in graph[node]:
            if neighbor not in seen: heappush(heap, (cost, node, neighbor))
    return tree
`),
  kahn: code(`
from collections import deque

def topological_sort(graph):
    indegree = {node: 0 for node in graph}
    for neighbors in graph.values():
        for neighbor in neighbors: indegree[neighbor] += 1
    queue = deque(node for node, degree in indegree.items() if degree == 0)
    order = []
    while queue:
        node = queue.popleft(); order.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0: queue.append(neighbor)
    if len(order) != len(graph): raise ValueError("graph contains a cycle")
    return order
`),
  dfsTopo: code(`
def topological_sort(graph):
    state, order = {}, []
    def visit(node):
        if state.get(node) == 1: raise ValueError("graph contains a cycle")
        if state.get(node) == 2: return
        state[node] = 1
        for neighbor in graph[node]: visit(neighbor)
        state[node] = 2; order.append(node)
    for node in graph: visit(node)
    return order[::-1]
`),
  unionFind: code(`
class DisjointSet:
    def __init__(self, size):
        self.parent, self.rank = list(range(size)), [0] * size
    def find(self, node):
        if self.parent[node] != node:
            self.parent[node] = self.find(self.parent[node])
        return self.parent[node]
    def union(self, first, second):
        first, second = self.find(first), self.find(second)
        if first == second: return False
        if self.rank[first] < self.rank[second]: first, second = second, first
        self.parent[second] = first
        if self.rank[first] == self.rank[second]: self.rank[first] += 1
        return True
`),
  tarjan: code(`
def strongly_connected_components(graph):
    index, indices, low, stack, on_stack, components = 0, {}, {}, [], set(), []
    def visit(node):
        nonlocal index
        indices[node] = low[node] = index; index += 1
        stack.append(node); on_stack.add(node)
        for neighbor in graph[node]:
            if neighbor not in indices: visit(neighbor); low[node] = min(low[node], low[neighbor])
            elif neighbor in on_stack: low[node] = min(low[node], indices[neighbor])
        if low[node] == indices[node]:
            component = []
            while True:
                member = stack.pop(); on_stack.remove(member); component.append(member)
                if member == node: break
            components.append(component)
    for node in graph:
        if node not in indices: visit(node)
    return components
`),
  bridges: code(`
def bridges_and_articulation_points(graph):
    time, discovered, low, bridges, points = 0, {}, {}, [], set()
    def visit(node, parent=None):
        nonlocal time
        discovered[node] = low[node] = time; time += 1
        children = 0
        for neighbor in graph[node]:
            if neighbor == parent: continue
            if neighbor not in discovered:
                children += 1; visit(neighbor, node)
                low[node] = min(low[node], low[neighbor])
                if low[neighbor] > discovered[node]: bridges.append((node, neighbor))
                if parent is not None and low[neighbor] >= discovered[node]: points.add(node)
            else: low[node] = min(low[node], discovered[neighbor])
        if parent is None and children > 1: points.add(node)
    for node in graph:
        if node not in discovered: visit(node)
    return bridges, points
`),
  fibonacciDp: code(`
def fibonacci_dp(n):
    if n < 2: return n
    previous, current = 0, 1
    for _ in range(2, n + 1): previous, current = current, previous + current
    return current
`),
  climbingStairs: code(`
def climb_stairs(n):
    previous, current = 1, 1
    for _ in range(n): previous, current = current, previous + current
    return previous
`),
  knapsack: code(`
def knapsack(weights, values, capacity):
    best = [0] * (capacity + 1)
    for weight, value in zip(weights, values):
        for limit in range(capacity, weight - 1, -1):
            best[limit] = max(best[limit], best[limit - weight] + value)
    return best[capacity]
`),
  lcs: code(`
def longest_common_subsequence(first, second):
    previous = [0] * (len(second) + 1)
    for a in first:
        current = [0]
        for j, b in enumerate(second, 1):
            current.append(previous[j - 1] + 1 if a == b
                           else max(previous[j], current[-1]))
        previous = current
    return previous[-1]
`),
  lis: code(`
from bisect import bisect_left

def longest_increasing_subsequence(values):
    tails = []
    for value in values:
        index = bisect_left(tails, value)
        if index == len(tails): tails.append(value)
        else: tails[index] = value
    return len(tails)
`),
  editDistance: code(`
def edit_distance(first, second):
    previous = list(range(len(second) + 1))
    for i, a in enumerate(first, 1):
        current = [i]
        for j, b in enumerate(second, 1):
            current.append(previous[j - 1] if a == b else
                           1 + min(previous[j], current[-1], previous[j - 1]))
        previous = current
    return previous[-1]
`),
  dpTrees: code(`
def maximum_path_sum(root):
    answer = float('-inf')
    def gain(node):
        nonlocal answer
        if not node: return 0
        left, right = max(0, gain(node.left)), max(0, gain(node.right))
        answer = max(answer, node.value + left + right)
        return node.value + max(left, right)
    gain(root)
    return answer
`),
  dpGrids: code(`
def minimum_cost_path(grid):
    rows, columns = len(grid), len(grid[0])
    best = [[float('inf')] * columns for _ in range(rows)]
    best[0][0] = grid[0][0]
    for row in range(rows):
        for column in range(columns):
            if row: best[row][column] = min(best[row][column], best[row - 1][column] + grid[row][column])
            if column: best[row][column] = min(best[row][column], best[row][column - 1] + grid[row][column])
    return best[-1][-1]
`),
  bitmaskDp: code(`
def minimum_assignment_cost(cost):
    size, infinity = len(cost), float('inf')
    best = [infinity] * (1 << size); best[0] = 0
    for mask in range(1 << size):
        worker = mask.bit_count()
        if worker == size: continue
        for job in range(size):
            if not mask & (1 << job):
                next_mask = mask | (1 << job)
                best[next_mask] = min(best[next_mask], best[mask] + cost[worker][job])
    return best[-1]
`),
  activitySelection: code(`
def activity_selection(starts, ends):
    activities = sorted(zip(starts, ends), key=lambda item: item[1])
    selected, last_end = [], float('-inf')
    for start, end in activities:
        if start >= last_end:
            selected.append((start, end)); last_end = end
    return selected
`),
  fractionalKnapsack: code(`
def fractional_knapsack(values, weights, capacity):
    items = sorted(zip(values, weights), key=lambda item: item[0] / item[1], reverse=True)
    total = 0.0
    for value, weight in items:
        if capacity == 0: break
        taken = min(weight, capacity)
        total += taken * value / weight
        capacity -= taken
    return total
`),
  huffmanCoding: code(`
from heapq import heapify, heappop, heappush

def huffman_codes(frequencies):
    serial = 0
    heap = [[frequency, serial, char] for char, frequency in frequencies.items()]
    heapify(heap)
    while len(heap) > 1:
        left, right = heappop(heap), heappop(heap); serial += 1
        heappush(heap, [left[0] + right[0], serial, (left, right)])
    codes = {}
    def walk(node, prefix=''):
        if isinstance(node[2], str): codes[node[2]] = prefix or '0'; return
        walk(node[2][0], prefix + '0'); walk(node[2][1], prefix + '1')
    if heap: walk(heap[0])
    return codes
`),
  jobScheduling: code(`
def job_scheduling(jobs):
    jobs = sorted(jobs, key=lambda job: job[2], reverse=True)
    slots = [None] * max((deadline for _, deadline, _ in jobs), default=0)
    for job_id, deadline, profit in jobs:
        for slot in range(min(deadline, len(slots)) - 1, -1, -1):
            if slots[slot] is None:
                slots[slot] = (job_id, profit); break
    return [job for job in slots if job is not None]
`),
  kmp: code(`
def kmp(text, pattern):
    lps = [0] * len(pattern)
    length = 0
    for i in range(1, len(pattern)):
        while length and pattern[i] != pattern[length]: length = lps[length - 1]
        if pattern[i] == pattern[length]: length += 1
        lps[i] = length
    matches, j = [], 0
    for i, char in enumerate(text):
        while j and char != pattern[j]: j = lps[j - 1]
        if char == pattern[j]: j += 1
        if j == len(pattern): matches.append(i - j + 1); j = lps[j - 1]
    return matches
`),
  rabinKarp: code(`
def rabin_karp(text, pattern, base=256, modulus=1_000_000_007):
    if len(pattern) > len(text): return []
    power = pow(base, len(pattern) - 1, modulus)
    target_hash = window_hash = 0
    for i in range(len(pattern)):
        target_hash = (target_hash * base + ord(pattern[i])) % modulus
        window_hash = (window_hash * base + ord(text[i])) % modulus
    matches = []
    for start in range(len(text) - len(pattern) + 1):
        if target_hash == window_hash and text[start:start + len(pattern)] == pattern: matches.append(start)
        if start + len(pattern) < len(text):
            window_hash = ((window_hash - ord(text[start]) * power) * base + ord(text[start + len(pattern)])) % modulus
    return matches
`),
  zAlgo: code(`
def z_search(text, pattern):
    combined = pattern + '$' + text
    z, left, right = [0] * len(combined), 0, 0
    for i in range(1, len(combined)):
        if i <= right: z[i] = min(right - i + 1, z[i - left])
        while i + z[i] < len(combined) and combined[z[i]] == combined[i + z[i]]: z[i] += 1
        if i + z[i] - 1 > right: left, right = i, i + z[i] - 1
    return [i - len(pattern) - 1 for i, value in enumerate(z) if value == len(pattern)]
`),
  manacher: code(`
def longest_palindrome(text):
    transformed = '^#' + '#'.join(text) + '#$'
    radius = [0] * len(transformed); center = right = 0
    for i in range(1, len(transformed) - 1):
        mirror = 2 * center - i
        if i < right: radius[i] = min(right - i, radius[mirror])
        while transformed[i + radius[i] + 1] == transformed[i - radius[i] - 1]: radius[i] += 1
        if i + radius[i] > right: center, right = i, i + radius[i]
    length = max(radius, default=0); center = radius.index(length)
    start = (center - length) // 2
    return text[start:start + length]
`),
  xorTricks: code(`
def find_single(values):
    result = 0
    for value in values: result ^= value
    return result
`),
  subsetsBits: code(`
def bitmask_subsets(values):
    return [[values[i] for i in range(len(values)) if mask & (1 << i)]
            for mask in range(1 << len(values))]
`),
  powerOf2: code(`
def is_power_of_two(value):
    return value > 0 and value & (value - 1) == 0
`),
  minMaxHeap: code(`
import heapq

class MinMaxHeap:
    def __init__(self): self.minimum, self.maximum = [], []
    def push(self, value):
        heapq.heappush(self.minimum, value); heapq.heappush(self.maximum, -value)
    def min(self): return self.minimum[0]
    def max(self): return -self.maximum[0]
`),
  heapSort2: heapSort,
  kthLargest: code(`
from heapq import heapreplace, heappush

def kth_largest(values, k):
    heap = []
    for value in values:
        if len(heap) < k: heappush(heap, value)
        elif value > heap[0]: heapreplace(heap, value)
    return heap[0]
`),
  mergeKSorted: code(`
from heapq import heappop, heappush

def merge_k_sorted(lists):
    heap, result = [], []
    for list_index, values in enumerate(lists):
        if values: heappush(heap, (values[0], list_index, 0))
    while heap:
        value, list_index, index = heappop(heap); result.append(value)
        if index + 1 < len(lists[list_index]):
            heappush(heap, (lists[list_index][index + 1], list_index, index + 1))
    return result
`),
  sieve: code(`
def sieve(limit):
    prime = [True] * (limit + 1)
    prime[0:2] = [False, False]
    for number in range(2, int(limit ** 0.5) + 1):
        if prime[number]:
            prime[number * number:limit + 1:number] = [False] * (((limit - number * number) // number) + 1)
    return [number for number, is_prime in enumerate(prime) if is_prime]
`),
  gcd: code(`
def gcd(first, second):
    while second: first, second = second, first % second
    return abs(first)
`),
  modularArithmetic: code(`
def modular_power(base, exponent, modulus):
    result, base = 1, base % modulus
    while exponent:
        if exponent & 1: result = result * base % modulus
        base = base * base % modulus
        exponent >>= 1
    return result
`),
  fastExponentiation: code(`
def fast_power(base, exponent):
    result = 1
    while exponent:
        if exponent & 1: result *= base
        base *= base
        exponent >>= 1
    return result
`),
};
