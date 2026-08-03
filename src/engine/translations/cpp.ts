const code = (source: string) => source.trim();
const cpp = (body: string) => code(`#include <bits/stdc++.h>
using namespace std;

${body.trim()}`);

const heapSort = cpp(`
vector<int> heapSort(vector<int> values) {
    auto heapify = [&](auto&& self, int size, int root) -> void {
        int largest = root, left = 2 * root + 1, right = left + 1;
        if (left < size && values[left] > values[largest]) largest = left;
        if (right < size && values[right] > values[largest]) largest = right;
        if (largest != root) {
            swap(values[root], values[largest]);
            self(self, size, largest);
        }
    };
    for (int i = values.size() / 2 - 1; i >= 0; --i) heapify(heapify, values.size(), i);
    for (int end = values.size() - 1; end > 0; --end) {
        swap(values[0], values[end]);
        heapify(heapify, end, 0);
    }
    return values;
}`);

const treeTraversal = (order: 'inorder' | 'preorder' | 'postorder') => cpp(`
struct Node {
    int value;
    Node *left = nullptr, *right = nullptr;
};

vector<int> ${order}(Node* root) {
    vector<int> result;
    function<void(Node*)> visit = [&](Node* node) {
        if (!node) return;
${order === 'preorder' ? '        result.push_back(node->value);\n        visit(node->left);\n        visit(node->right);' : order === 'inorder' ? '        visit(node->left);\n        result.push_back(node->value);\n        visit(node->right);' : '        visit(node->left);\n        visit(node->right);\n        result.push_back(node->value);'}
    };
    visit(root);
    return result;
}`);

export const cppTranslations: Record<string, string> = {
  linearSearch: cpp(`
int linearSearch(const vector<int>& values, int target) {
    for (int i = 0; i < static_cast<int>(values.size()); ++i)
        if (values[i] == target) return i;
    return -1;
}`),
  binarySearch: cpp(`
int binarySearch(const vector<int>& values, int target) {
    int left = 0, right = static_cast<int>(values.size()) - 1;
    while (left <= right) {
        int middle = left + (right - left) / 2;
        if (values[middle] == target) return middle;
        if (values[middle] < target) left = middle + 1;
        else right = middle - 1;
    }
    return -1;
}`),
  ternarySearch: cpp(`
int ternarySearch(const vector<int>& values, int target) {
    int left = 0, right = static_cast<int>(values.size()) - 1;
    while (left <= right) {
        int third = (right - left) / 3;
        int mid1 = left + third, mid2 = right - third;
        if (values[mid1] == target) return mid1;
        if (values[mid2] == target) return mid2;
        if (target < values[mid1]) right = mid1 - 1;
        else if (target > values[mid2]) left = mid2 + 1;
        else left = mid1 + 1, right = mid2 - 1;
    }
    return -1;
}`),
  bubbleSort: cpp(`
vector<int> bubbleSort(vector<int> values) {
    for (int end = values.size() - 1; end > 0; --end) {
        bool swapped = false;
        for (int i = 0; i < end; ++i)
            if (values[i] > values[i + 1]) swap(values[i], values[i + 1]), swapped = true;
        if (!swapped) break;
    }
    return values;
}`),
  selectionSort: cpp(`
vector<int> selectionSort(vector<int> values) {
    for (int i = 0; i < static_cast<int>(values.size()); ++i) {
        int smallest = i;
        for (int j = i + 1; j < static_cast<int>(values.size()); ++j)
            if (values[j] < values[smallest]) smallest = j;
        swap(values[i], values[smallest]);
    }
    return values;
}`),
  insertionSort: cpp(`
vector<int> insertionSort(vector<int> values) {
    for (int i = 1; i < static_cast<int>(values.size()); ++i) {
        int key = values[i], j = i - 1;
        while (j >= 0 && values[j] > key) values[j + 1] = values[j], --j;
        values[j + 1] = key;
    }
    return values;
}`),
  mergeSort: cpp(`
vector<int> mergeSort(vector<int> values) {
    if (values.size() <= 1) return values;
    int middle = values.size() / 2;
    vector<int> left(values.begin(), values.begin() + middle);
    vector<int> right(values.begin() + middle, values.end());
    left = mergeSort(left); right = mergeSort(right);
    vector<int> result;
    merge(left.begin(), left.end(), right.begin(), right.end(), back_inserter(result));
    return result;
}`),
  quickSort: cpp(`
vector<int> quickSort(vector<int> values) {
    function<void(int, int)> sort = [&](int low, int high) {
        if (low >= high) return;
        int pivot = values[high], next = low;
        for (int i = low; i < high; ++i)
            if (values[i] <= pivot) swap(values[next++], values[i]);
        swap(values[next], values[high]);
        sort(low, next - 1); sort(next + 1, high);
    };
    sort(0, static_cast<int>(values.size()) - 1);
    return values;
}`),
  heapSort,
  countingSort: cpp(`
vector<int> countingSort(const vector<int>& values) {
    if (values.empty()) return {};
    auto limits = minmax_element(values.begin(), values.end());
    auto lowIt = limits.first, highIt = limits.second;
    vector<int> count(*highIt - *lowIt + 1), result;
    for (int value : values) ++count[value - *lowIt];
    for (int i = 0; i < static_cast<int>(count.size()); ++i)
        result.insert(result.end(), count[i], i + *lowIt);
    return result;
}`),
  radixSort: cpp(`
vector<int> radixSort(vector<int> values) {
    if (values.empty()) return values;
    for (long long place = 1; *max_element(values.begin(), values.end()) / place > 0; place *= 10) {
        vector<vector<int>> buckets(10);
        for (int value : values) buckets[(value / place) % 10].push_back(value);
        values.clear();
        for (auto& bucket : buckets) values.insert(values.end(), bucket.begin(), bucket.end());
    }
    return values;
}`),
  bucketSort: cpp(`
vector<double> bucketSort(vector<double> values) {
    if (values.size() < 2) return values;
    auto limits = minmax_element(values.begin(), values.end());
    auto lowIt = limits.first, highIt = limits.second;
    if (*lowIt == *highIt) return values;
    vector<vector<double>> buckets(values.size());
    for (double value : values) {
        int index = min(values.size() - 1,
            static_cast<size_t>((value - *lowIt) * values.size() / (*highIt - *lowIt)));
        buckets[index].push_back(value);
    }
    values.clear();
    for (auto& bucket : buckets) {
        sort(bucket.begin(), bucket.end());
        values.insert(values.end(), bucket.begin(), bucket.end());
    }
    return values;
}`),
  twoSum: cpp(`
vector<int> twoSum(const vector<int>& values, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < static_cast<int>(values.size()); ++i) {
        if (seen.count(target - values[i])) return {seen[target - values[i]], i};
        seen[values[i]] = i;
    }
    return {};
}`),
  threeSum: cpp(`
vector<array<int, 3>> threeSum(vector<int> values) {
    sort(values.begin(), values.end());
    vector<array<int, 3>> result;
    for (int i = 0; i + 2 < static_cast<int>(values.size()); ++i) {
        if (i && values[i] == values[i - 1]) continue;
        int left = i + 1, right = values.size() - 1;
        while (left < right) {
            int total = values[i] + values[left] + values[right];
            if (total < 0) ++left;
            else if (total > 0) --right;
            else {
                result.push_back({values[i], values[left++], values[right--]});
                while (left < right && values[left] == values[left - 1]) ++left;
            }
        }
    }
    return result;
}`),
  slidingWindowMax: cpp(`
vector<int> slidingWindowMaximum(const vector<int>& values, int windowSize) {
    deque<int> queue;
    vector<int> result;
    for (int i = 0; i < static_cast<int>(values.size()); ++i) {
        while (!queue.empty() && queue.front() <= i - windowSize) queue.pop_front();
        while (!queue.empty() && values[queue.back()] <= values[i]) queue.pop_back();
        queue.push_back(i);
        if (i >= windowSize - 1) result.push_back(values[queue.front()]);
    }
    return result;
}`),
  longestSubstring: cpp(`
int longestUniqueSubstring(const string& text) {
    unordered_map<char, int> lastSeen;
    int left = 0, best = 0;
    for (int right = 0; right < static_cast<int>(text.size()); ++right) {
        if (lastSeen.count(text[right])) left = max(left, lastSeen[text[right]] + 1);
        lastSeen[text[right]] = right;
        best = max(best, right - left + 1);
    }
    return best;
}`),
  factorial: cpp(`
long long factorial(int n) {
    if (n < 0) throw invalid_argument("n must be non-negative");
    return n < 2 ? 1 : n * factorial(n - 1);
}`),
  fibonacci: cpp(`
long long fibonacci(int n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}`),
  towerOfHanoi: cpp(`
vector<pair<char, char>> towerOfHanoi(int n, char source, char auxiliary, char destination) {
    vector<pair<char, char>> moves;
    function<void(int, char, char, char)> move = [&](int count, char start, char helper, char end) {
        if (!count) return;
        move(count - 1, start, end, helper);
        moves.push_back({start, end});
        move(count - 1, helper, start, end);
    };
    move(n, source, auxiliary, destination);
    return moves;
}`),
  nQueens: cpp(`
vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> answers;
    vector<string> board(n, string(n, '.'));
    vector<bool> columns(n), diagonals(2 * n), antiDiagonals(2 * n);
    function<void(int)> place = [&](int row) {
        if (row == n) { answers.push_back(board); return; }
        for (int column = 0; column < n; ++column) {
            if (columns[column] || diagonals[row - column + n] || antiDiagonals[row + column]) continue;
            board[row][column] = 'Q';
            columns[column] = diagonals[row - column + n] = antiDiagonals[row + column] = true;
            place(row + 1);
            board[row][column] = '.';
            columns[column] = diagonals[row - column + n] = antiDiagonals[row + column] = false;
        }
    };
    place(0);
    return answers;
}`),
  sudokuSolver: cpp(`
bool solveSudoku(vector<vector<int>>& board) {
    int bestRow = -1, bestColumn = -1;
    vector<int> bestOptions;
    for (int row = 0; row < 9; ++row) for (int column = 0; column < 9; ++column) {
        if (board[row][column]) continue;
        vector<bool> used(10);
        for (int i = 0; i < 9; ++i) used[board[row][i]] = used[board[i][column]] = true;
        for (int r = row / 3 * 3; r < row / 3 * 3 + 3; ++r)
            for (int c = column / 3 * 3; c < column / 3 * 3 + 3; ++c) used[board[r][c]] = true;
        vector<int> options;
        for (int value = 1; value <= 9; ++value) if (!used[value]) options.push_back(value);
        if (bestRow < 0 || options.size() < bestOptions.size())
            bestRow = row, bestColumn = column, bestOptions = options;
    }
    if (bestRow < 0) return true;
    for (int value : bestOptions) {
        board[bestRow][bestColumn] = value;
        if (solveSudoku(board)) return true;
        board[bestRow][bestColumn] = 0;
    }
    return false;
}`),
  permutations: cpp(`
vector<vector<int>> permutations(vector<int> values) {
    vector<vector<int>> result;
    function<void(int)> build = [&](int first) {
        if (first == static_cast<int>(values.size())) { result.push_back(values); return; }
        for (int i = first; i < static_cast<int>(values.size()); ++i) {
            swap(values[first], values[i]); build(first + 1); swap(values[first], values[i]);
        }
    };
    build(0);
    return result;
}`),
  subsetGen: cpp(`
vector<vector<int>> subsets(const vector<int>& values) {
    vector<vector<int>> result;
    vector<int> current;
    function<void(int)> build = [&](int index) {
        if (index == static_cast<int>(values.size())) { result.push_back(current); return; }
        build(index + 1);
        current.push_back(values[index]); build(index + 1); current.pop_back();
    };
    build(0);
    return result;
}`),
  inorder: treeTraversal('inorder'),
  preorder: treeTraversal('preorder'),
  postorder: treeTraversal('postorder'),
  levelOrder: cpp(`
struct Node { int value; Node *left = nullptr, *right = nullptr; };

vector<int> levelOrder(Node* root) {
    if (!root) return {};
    queue<Node*> pending({root});
    vector<int> order;
    while (!pending.empty()) {
        Node* node = pending.front(); pending.pop();
        order.push_back(node->value);
        if (node->left) pending.push(node->left);
        if (node->right) pending.push(node->right);
    }
    return order;
}`),
  heightDepth: cpp(`
struct Node { int value; Node *left = nullptr, *right = nullptr; };

int treeHeight(Node* root) {
    return root ? 1 + max(treeHeight(root->left), treeHeight(root->right)) : 0;
}`),
  diameter: cpp(`
struct Node { int value; Node *left = nullptr, *right = nullptr; };

int treeDiameter(Node* root) {
    int longest = 0;
    function<int(Node*)> height = [&](Node* node) {
        if (!node) return 0;
        int left = height(node->left), right = height(node->right);
        longest = max(longest, left + right);
        return 1 + max(left, right);
    };
    height(root);
    return longest;
}`),
  lca: cpp(`
struct Node { int value; Node *left = nullptr, *right = nullptr; };

Node* lowestCommonAncestor(Node* root, Node* first, Node* second) {
    if (!root || root == first || root == second) return root;
    Node* left = lowestCommonAncestor(root->left, first, second);
    Node* right = lowestCommonAncestor(root->right, first, second);
    return left && right ? root : (left ? left : right);
}`),
  balancedTree: cpp(`
struct Node { int value; Node *left = nullptr, *right = nullptr; };

bool isBalanced(Node* root) {
    function<int(Node*)> height = [&](Node* node) {
        if (!node) return 0;
        int left = height(node->left), right = height(node->right);
        if (left < 0 || right < 0 || abs(left - right) > 1) return -1;
        return 1 + max(left, right);
    };
    return height(root) >= 0;
}`),
  bstInsert: cpp(`
struct Node { int value; Node *left = nullptr, *right = nullptr; explicit Node(int v) : value(v) {} };

Node* insert(Node* root, int value) {
    if (!root) return new Node(value);
    if (value < root->value) root->left = insert(root->left, value);
    else if (value > root->value) root->right = insert(root->right, value);
    return root;
}
Node* search(Node* root, int value) {
    if (!root || root->value == value) return root;
    return search(value < root->value ? root->left : root->right, value);
}
Node* erase(Node* root, int value) {
    if (!root) return nullptr;
    if (value < root->value) root->left = erase(root->left, value);
    else if (value > root->value) root->right = erase(root->right, value);
    else if (!root->left) { Node* next = root->right; delete root; return next; }
    else if (!root->right) { Node* next = root->left; delete root; return next; }
    else {
        Node* successor = root->right;
        while (successor->left) successor = successor->left;
        root->value = successor->value;
        root->right = erase(root->right, successor->value);
    }
    return root;
}`),
  kthSmallest: cpp(`
struct Node { int value; Node *left = nullptr, *right = nullptr; };

int kthSmallest(Node* root, int k) {
    stack<Node*> nodes;
    while (root || !nodes.empty()) {
        while (root) nodes.push(root), root = root->left;
        root = nodes.top(); nodes.pop();
        if (--k == 0) return root->value;
        root = root->right;
    }
    throw out_of_range("k exceeds the number of nodes");
}`),
  avlTree: cpp(`
struct AvlNode {
    int value, height = 1;
    AvlNode *left = nullptr, *right = nullptr;
    explicit AvlNode(int v) : value(v) {}
};
int height(AvlNode* node) { return node ? node->height : 0; }
void refresh(AvlNode* node) { node->height = 1 + max(height(node->left), height(node->right)); }
AvlNode* rotateRight(AvlNode* root) {
    AvlNode* next = root->left; root->left = next->right; next->right = root;
    refresh(root); refresh(next); return next;
}
AvlNode* rotateLeft(AvlNode* root) {
    AvlNode* next = root->right; root->right = next->left; next->left = root;
    refresh(root); refresh(next); return next;
}
AvlNode* insertAvl(AvlNode* root, int value) {
    if (!root) return new AvlNode(value);
    if (value < root->value) root->left = insertAvl(root->left, value);
    else if (value > root->value) root->right = insertAvl(root->right, value);
    else return root;
    refresh(root);
    int balance = height(root->left) - height(root->right);
    if (balance > 1) { if (value > root->left->value) root->left = rotateLeft(root->left); return rotateRight(root); }
    if (balance < -1) { if (value < root->right->value) root->right = rotateRight(root->right); return rotateLeft(root); }
    return root;
}`),
  segmentTree: cpp(`
class SegmentTree {
    int size;
    vector<long long> tree;
public:
    explicit SegmentTree(const vector<int>& values) : size(values.size()), tree(2 * size) {
        copy(values.begin(), values.end(), tree.begin() + size);
        for (int i = size - 1; i; --i) tree[i] = tree[2 * i] + tree[2 * i + 1];
    }
    long long rangeSum(int left, int right) const {
        long long total = 0;
        for (left += size, right += size; left < right; left /= 2, right /= 2) {
            if (left & 1) total += tree[left++];
            if (right & 1) total += tree[--right];
        }
        return total;
    }
};`),
  fenwickTree: cpp(`
class FenwickTree {
    vector<long long> tree;
public:
    explicit FenwickTree(const vector<int>& values) : tree(values.size() + 1) {
        for (int i = 0; i < static_cast<int>(values.size()); ++i) add(i, values[i]);
    }
    void add(int index, int delta) {
        for (++index; index < static_cast<int>(tree.size()); index += index & -index) tree[index] += delta;
    }
    long long prefixSum(int end) const {
        long long total = 0;
        for (; end > 0; end -= end & -end) total += tree[end];
        return total;
    }
};`),
  trie: cpp(`
class Trie {
    struct Node { unordered_map<char, unique_ptr<Node>> children; bool terminal = false; };
    Node root;
public:
    void insert(const string& word) {
        Node* node = &root;
        for (char character : word) {
            if (!node->children[character]) node->children[character] = make_unique<Node>();
            node = node->children[character].get();
        }
        node->terminal = true;
    }
    bool search(const string& word) const {
        const Node* node = &root;
        for (char character : word) {
            auto found = node->children.find(character);
            if (found == node->children.end()) return false;
            node = found->second.get();
        }
        return node->terminal;
    }
};`),
  bfs: cpp(`
vector<int> bfs(const vector<vector<int>>& graph, int start) {
    vector<bool> seen(graph.size());
    queue<int> pending({start});
    vector<int> order;
    seen[start] = true;
    while (!pending.empty()) {
        int node = pending.front(); pending.pop(); order.push_back(node);
        for (int neighbor : graph[node]) if (!seen[neighbor]) {
            seen[neighbor] = true; pending.push(neighbor);
        }
    }
    return order;
}`),
  dfs: cpp(`
vector<int> dfs(const vector<vector<int>>& graph, int start) {
    vector<bool> seen(graph.size());
    vector<int> order;
    function<void(int)> visit = [&](int node) {
        seen[node] = true; order.push_back(node);
        for (int neighbor : graph[node]) if (!seen[neighbor]) visit(neighbor);
    };
    visit(start);
    return order;
}`),
  dijkstra: cpp(`
vector<long long> dijkstra(const vector<vector<pair<int, int>>>& graph, int source) {
    const long long infinity = numeric_limits<long long>::max();
    vector<long long> distance(graph.size(), infinity);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> heap;
    distance[source] = 0; heap.push({0, source});
    while (!heap.empty()) {
        auto entry = heap.top(); heap.pop();
        long long current = entry.first; int node = entry.second;
        if (current != distance[node]) continue;
        for (auto edge : graph[node]) {
            int neighbor = edge.first, weight = edge.second;
            if (current + weight < distance[neighbor]) {
                distance[neighbor] = current + weight;
                heap.push({distance[neighbor], neighbor});
            }
        }
    }
    return distance;
}`),
  bellmanFord: cpp(`
struct Edge { int from, to, weight; };

vector<long long> bellmanFord(int vertices, const vector<Edge>& edges, int source) {
    const long long infinity = numeric_limits<long long>::max() / 4;
    vector<long long> distance(vertices, infinity); distance[source] = 0;
    for (int pass = 1; pass < vertices; ++pass) {
        bool changed = false;
        for (auto edge : edges)
            if (distance[edge.from] != infinity && distance[edge.from] + edge.weight < distance[edge.to])
                distance[edge.to] = distance[edge.from] + edge.weight, changed = true;
        if (!changed) break;
    }
    for (auto edge : edges)
        if (distance[edge.from] != infinity && distance[edge.from] + edge.weight < distance[edge.to])
            throw invalid_argument("negative-weight cycle");
    return distance;
}`),
  floydWarshall: cpp(`
vector<vector<long long>> floydWarshall(vector<vector<long long>> distance) {
    for (int middle = 0; middle < static_cast<int>(distance.size()); ++middle)
        for (int start = 0; start < static_cast<int>(distance.size()); ++start)
            for (int end = 0; end < static_cast<int>(distance.size()); ++end)
                distance[start][end] = min(distance[start][end],
                    distance[start][middle] + distance[middle][end]);
    return distance;
}`),
  kruskal: cpp(`
struct Edge { int from, to, weight; };
struct DisjointSet {
    vector<int> parent, rank;
    explicit DisjointSet(int n) : parent(n), rank(n) { iota(parent.begin(), parent.end(), 0); }
    int find(int node) { return parent[node] == node ? node : parent[node] = find(parent[node]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b); if (a == b) return false;
        if (rank[a] < rank[b]) swap(a, b); parent[b] = a;
        if (rank[a] == rank[b]) ++rank[a]; return true;
    }
};
vector<Edge> kruskal(int vertices, vector<Edge> edges) {
    sort(edges.begin(), edges.end(), [](auto a, auto b) { return a.weight < b.weight; });
    DisjointSet sets(vertices); vector<Edge> tree;
    for (auto edge : edges) if (sets.unite(edge.from, edge.to)) tree.push_back(edge);
    return tree;
}`),
  prim: cpp(`
vector<tuple<int, int, int>> prim(const vector<vector<pair<int, int>>>& graph, int start = 0) {
    using Entry = tuple<int, int, int>;
    priority_queue<Entry, vector<Entry>, greater<>> heap;
    vector<bool> seen(graph.size()); vector<Entry> tree;
    seen[start] = true;
    for (auto edge : graph[start]) heap.push({edge.second, start, edge.first});
    while (!heap.empty() && tree.size() + 1 < graph.size()) {
        auto entry = heap.top(); heap.pop();
        int weight = get<0>(entry), source = get<1>(entry), node = get<2>(entry);
        if (seen[node]) continue;
        seen[node] = true; tree.push_back({source, node, weight});
        for (auto edge : graph[node]) if (!seen[edge.first]) heap.push({edge.second, node, edge.first});
    }
    return tree;
}`),
  kahn: cpp(`
vector<int> topologicalSort(const vector<vector<int>>& graph) {
    vector<int> indegree(graph.size()), order;
    for (const auto& neighbors : graph) for (int neighbor : neighbors) ++indegree[neighbor];
    queue<int> pending;
    for (int node = 0; node < static_cast<int>(graph.size()); ++node) if (!indegree[node]) pending.push(node);
    while (!pending.empty()) {
        int node = pending.front(); pending.pop(); order.push_back(node);
        for (int neighbor : graph[node]) if (!--indegree[neighbor]) pending.push(neighbor);
    }
    if (order.size() != graph.size()) throw invalid_argument("graph contains a cycle");
    return order;
}`),
  dfsTopo: cpp(`
vector<int> topologicalSort(const vector<vector<int>>& graph) {
    vector<int> state(graph.size()), order;
    function<void(int)> visit = [&](int node) {
        if (state[node] == 1) throw invalid_argument("graph contains a cycle");
        if (state[node] == 2) return;
        state[node] = 1;
        for (int neighbor : graph[node]) visit(neighbor);
        state[node] = 2; order.push_back(node);
    };
    for (int node = 0; node < static_cast<int>(graph.size()); ++node) visit(node);
    reverse(order.begin(), order.end());
    return order;
}`),
  unionFind: cpp(`
class DisjointSet {
    vector<int> parent, rank;
public:
    explicit DisjointSet(int size) : parent(size), rank(size) { iota(parent.begin(), parent.end(), 0); }
    int find(int node) { return parent[node] == node ? node : parent[node] = find(parent[node]); }
    bool unite(int first, int second) {
        first = find(first); second = find(second);
        if (first == second) return false;
        if (rank[first] < rank[second]) swap(first, second);
        parent[second] = first;
        if (rank[first] == rank[second]) ++rank[first];
        return true;
    }
};`),
  tarjan: cpp(`
vector<vector<int>> stronglyConnectedComponents(const vector<vector<int>>& graph) {
    int time = 0;
    vector<int> index(graph.size(), -1), low(graph.size()), stack;
    vector<bool> onStack(graph.size()); vector<vector<int>> components;
    function<void(int)> visit = [&](int node) {
        index[node] = low[node] = time++; stack.push_back(node); onStack[node] = true;
        for (int neighbor : graph[node]) {
            if (index[neighbor] < 0) visit(neighbor), low[node] = min(low[node], low[neighbor]);
            else if (onStack[neighbor]) low[node] = min(low[node], index[neighbor]);
        }
        if (low[node] == index[node]) {
            components.emplace_back();
            while (true) {
                int member = stack.back(); stack.pop_back(); onStack[member] = false;
                components.back().push_back(member); if (member == node) break;
            }
        }
    };
    for (int node = 0; node < static_cast<int>(graph.size()); ++node) if (index[node] < 0) visit(node);
    return components;
}`),
  bridges: cpp(`
pair<vector<pair<int, int>>, vector<int>> bridgesAndArticulationPoints(const vector<vector<int>>& graph) {
    int time = 0;
    vector<int> discovered(graph.size(), -1), low(graph.size()); vector<bool> point(graph.size());
    vector<pair<int, int>> bridges;
    function<void(int, int)> visit = [&](int node, int parent) {
        discovered[node] = low[node] = time++; int children = 0;
        for (int neighbor : graph[node]) {
            if (neighbor == parent) continue;
            if (discovered[neighbor] < 0) {
                ++children; visit(neighbor, node); low[node] = min(low[node], low[neighbor]);
                if (low[neighbor] > discovered[node]) bridges.push_back({node, neighbor});
                if (parent >= 0 && low[neighbor] >= discovered[node]) point[node] = true;
            } else low[node] = min(low[node], discovered[neighbor]);
        }
        if (parent < 0 && children > 1) point[node] = true;
    };
    for (int node = 0; node < static_cast<int>(graph.size()); ++node) if (discovered[node] < 0) visit(node, -1);
    vector<int> points; for (int node = 0; node < static_cast<int>(graph.size()); ++node) if (point[node]) points.push_back(node);
    return {bridges, points};
}`),
  fibonacciDp: cpp(`
long long fibonacciDP(int n) {
    if (n < 2) return n;
    long long previous = 0, current = 1;
    for (int i = 2; i <= n; ++i) {
        long long next = previous + current; previous = current; current = next;
    }
    return current;
}`),
  climbingStairs: cpp(`
long long climbStairs(int n) {
    long long previous = 1, current = 1;
    for (int i = 0; i < n; ++i) {
        long long next = previous + current; previous = current; current = next;
    }
    return previous;
}`),
  knapsack: cpp(`
int knapsack(const vector<int>& weights, const vector<int>& values, int capacity) {
    vector<int> best(capacity + 1);
    for (int i = 0; i < static_cast<int>(weights.size()); ++i)
        for (int limit = capacity; limit >= weights[i]; --limit)
            best[limit] = max(best[limit], best[limit - weights[i]] + values[i]);
    return best[capacity];
}`),
  lcs: cpp(`
int longestCommonSubsequence(const string& first, const string& second) {
    vector<int> previous(second.size() + 1), current(second.size() + 1);
    for (char a : first) {
        for (int j = 1; j <= static_cast<int>(second.size()); ++j)
            current[j] = a == second[j - 1] ? previous[j - 1] + 1 : max(previous[j], current[j - 1]);
        swap(previous, current); fill(current.begin(), current.end(), 0);
    }
    return previous.back();
}`),
  lis: cpp(`
int longestIncreasingSubsequence(const vector<int>& values) {
    vector<int> tails;
    for (int value : values) {
        auto position = lower_bound(tails.begin(), tails.end(), value);
        if (position == tails.end()) tails.push_back(value); else *position = value;
    }
    return tails.size();
}`),
  editDistance: cpp(`
int editDistance(const string& first, const string& second) {
    vector<int> previous(second.size() + 1), current(second.size() + 1);
    iota(previous.begin(), previous.end(), 0);
    for (int i = 1; i <= static_cast<int>(first.size()); ++i) {
        current[0] = i;
        for (int j = 1; j <= static_cast<int>(second.size()); ++j)
            current[j] = first[i - 1] == second[j - 1] ? previous[j - 1]
                : 1 + min({previous[j], current[j - 1], previous[j - 1]});
        swap(previous, current);
    }
    return previous.back();
}`),
  dpTrees: cpp(`
struct Node { int value; Node *left = nullptr, *right = nullptr; };

int maximumPathSum(Node* root) {
    int answer = numeric_limits<int>::min();
    function<int(Node*)> gain = [&](Node* node) {
        if (!node) return 0;
        int left = max(0, gain(node->left)), right = max(0, gain(node->right));
        answer = max(answer, node->value + left + right);
        return node->value + max(left, right);
    };
    gain(root);
    return answer;
}`),
  dpGrids: cpp(`
int minimumCostPath(const vector<vector<int>>& grid) {
    int rows = grid.size(), columns = grid[0].size();
    vector<vector<int>> best(rows, vector<int>(columns, numeric_limits<int>::max()));
    best[0][0] = grid[0][0];
    for (int row = 0; row < rows; ++row) for (int column = 0; column < columns; ++column) {
        if (row) best[row][column] = min(best[row][column], best[row - 1][column] + grid[row][column]);
        if (column) best[row][column] = min(best[row][column], best[row][column - 1] + grid[row][column]);
    }
    return best.back().back();
}`),
  bitmaskDp: cpp(`
int minimumAssignmentCost(const vector<vector<int>>& cost) {
    int size = cost.size(), infinity = numeric_limits<int>::max() / 2;
    vector<int> best(1 << size, infinity); best[0] = 0;
    for (int mask = 0; mask < (1 << size); ++mask) {
        int worker = __builtin_popcount(static_cast<unsigned>(mask));
        if (worker == size) continue;
        for (int job = 0; job < size; ++job) if (!(mask & (1 << job)))
            best[mask | (1 << job)] = min(best[mask | (1 << job)], best[mask] + cost[worker][job]);
    }
    return best.back();
}`),
  activitySelection: cpp(`
vector<pair<int, int>> activitySelection(vector<pair<int, int>> activities) {
    sort(activities.begin(), activities.end(), [](auto a, auto b) { return a.second < b.second; });
    vector<pair<int, int>> selected; int lastEnd = numeric_limits<int>::min();
    for (auto activity : activities) if (activity.first >= lastEnd)
        selected.push_back(activity), lastEnd = activity.second;
    return selected;
}`),
  fractionalKnapsack: cpp(`
struct Item { double value, weight; };

double fractionalKnapsack(vector<Item> items, double capacity) {
    sort(items.begin(), items.end(), [](auto a, auto b) { return a.value / a.weight > b.value / b.weight; });
    double total = 0;
    for (auto item : items) {
        double taken = min(item.weight, capacity);
        total += taken * item.value / item.weight; capacity -= taken;
        if (!capacity) break;
    }
    return total;
}`),
  huffmanCoding: cpp(`
struct Node { char character; int frequency; Node *left, *right; };

unordered_map<char, string> huffmanCodes(const unordered_map<char, int>& frequencies) {
    auto compare = [](Node* a, Node* b) { return a->frequency > b->frequency; };
    priority_queue<Node*, vector<Node*>, decltype(compare)> heap(compare);
    for (const auto& entry : frequencies)
        heap.push(new Node{entry.first, entry.second, nullptr, nullptr});
    while (heap.size() > 1) {
        Node* left = heap.top(); heap.pop(); Node* right = heap.top(); heap.pop();
        heap.push(new Node{'\\0', left->frequency + right->frequency, left, right});
    }
    unordered_map<char, string> codes;
    function<void(Node*, string)> walk = [&](Node* node, string prefix) {
        if (!node->left && !node->right) { codes[node->character] = prefix.empty() ? "0" : prefix; return; }
        walk(node->left, prefix + "0"); walk(node->right, prefix + "1");
    };
    if (!heap.empty()) walk(heap.top(), "");
    return codes;
}`),
  jobScheduling: cpp(`
struct Job { int id, deadline, profit; };

vector<Job> jobScheduling(vector<Job> jobs) {
    sort(jobs.begin(), jobs.end(), [](auto a, auto b) { return a.profit > b.profit; });
    int limit = 0; for (auto job : jobs) limit = max(limit, job.deadline);
    vector<Job> slots(limit, Job{-1, 0, 0});
    for (auto job : jobs) for (int slot = min(job.deadline, limit) - 1; slot >= 0; --slot)
        if (slots[slot].id < 0) { slots[slot] = job; break; }
    vector<Job> result; for (auto job : slots) if (job.id >= 0) result.push_back(job);
    return result;
}`),
  kmp: cpp(`
vector<int> kmp(const string& text, const string& pattern) {
    vector<int> prefix(pattern.size()), matches;
    for (int i = 1, length = 0; i < static_cast<int>(pattern.size()); ++i) {
        while (length && pattern[i] != pattern[length]) length = prefix[length - 1];
        if (pattern[i] == pattern[length]) ++length;
        prefix[i] = length;
    }
    for (int i = 0, j = 0; i < static_cast<int>(text.size()); ++i) {
        while (j && text[i] != pattern[j]) j = prefix[j - 1];
        if (text[i] == pattern[j]) ++j;
        if (j == static_cast<int>(pattern.size())) matches.push_back(i - j + 1), j = prefix[j - 1];
    }
    return matches;
}`),
  rabinKarp: cpp(`
vector<int> rabinKarp(const string& text, const string& pattern) {
    const long long base = 256, modulus = 1'000'000'007;
    if (pattern.size() > text.size()) return {};
    long long power = 1, targetHash = 0, windowHash = 0;
    for (int i = 1; i < static_cast<int>(pattern.size()); ++i) power = power * base % modulus;
    for (int i = 0; i < static_cast<int>(pattern.size()); ++i)
        targetHash = (targetHash * base + pattern[i]) % modulus,
        windowHash = (windowHash * base + text[i]) % modulus;
    vector<int> matches;
    for (int start = 0; start + pattern.size() <= text.size(); ++start) {
        if (targetHash == windowHash && text.compare(start, pattern.size(), pattern) == 0) matches.push_back(start);
        if (start + pattern.size() < text.size())
            windowHash = ((windowHash - text[start] * power % modulus + modulus) * base + text[start + pattern.size()]) % modulus;
    }
    return matches;
}`),
  zAlgo: cpp(`
vector<int> zSearch(const string& text, const string& pattern) {
    string combined = pattern + "$" + text; vector<int> z(combined.size()), matches;
    int left = 0, right = 0;
    for (int i = 1; i < static_cast<int>(combined.size()); ++i) {
        if (i <= right) z[i] = min(right - i + 1, z[i - left]);
        while (i + z[i] < static_cast<int>(combined.size()) && combined[z[i]] == combined[i + z[i]]) ++z[i];
        if (i + z[i] - 1 > right) left = i, right = i + z[i] - 1;
        if (z[i] == static_cast<int>(pattern.size())) matches.push_back(i - pattern.size() - 1);
    }
    return matches;
}`),
  manacher: cpp(`
string longestPalindrome(const string& text) {
    string transformed = "^";
    for (char character : text) transformed += "#" + string(1, character);
    transformed += "#$";
    vector<int> radius(transformed.size()); int center = 0, right = 0;
    for (int i = 1; i + 1 < static_cast<int>(transformed.size()); ++i) {
        int mirror = 2 * center - i;
        if (i < right) radius[i] = min(right - i, radius[mirror]);
        while (transformed[i + radius[i] + 1] == transformed[i - radius[i] - 1]) ++radius[i];
        if (i + radius[i] > right) center = i, right = i + radius[i];
    }
    center = max_element(radius.begin(), radius.end()) - radius.begin();
    int length = radius[center], start = (center - length) / 2;
    return text.substr(start, length);
}`),
  xorTricks: cpp(`
int findSingle(const vector<int>& values) {
    return accumulate(values.begin(), values.end(), 0, bit_xor<int>());
}`),
  subsetsBits: cpp(`
vector<vector<int>> bitmaskSubsets(const vector<int>& values) {
    vector<vector<int>> result;
    for (unsigned mask = 0; mask < (1u << values.size()); ++mask) {
        result.emplace_back();
        for (int i = 0; i < static_cast<int>(values.size()); ++i)
            if (mask & (1u << i)) result.back().push_back(values[i]);
    }
    return result;
}`),
  powerOf2: cpp(`
bool isPowerOfTwo(unsigned value) {
    return value && !(value & (value - 1));
}`),
  minMaxHeap: cpp(`
class MinMaxHeap {
    priority_queue<int, vector<int>, greater<>> minimum;
    priority_queue<int> maximum;
public:
    void push(int value) { minimum.push(value); maximum.push(value); }
    int min() const { return minimum.top(); }
    int max() const { return maximum.top(); }
};`),
  heapSort2: heapSort,
  kthLargest: cpp(`
int kthLargest(const vector<int>& values, int k) {
    priority_queue<int, vector<int>, greater<>> heap;
    for (int value : values) {
        heap.push(value);
        if (static_cast<int>(heap.size()) > k) heap.pop();
    }
    return heap.top();
}`),
  mergeKSorted: cpp(`
vector<int> mergeKSorted(const vector<vector<int>>& lists) {
    using Entry = tuple<int, int, int>;
    priority_queue<Entry, vector<Entry>, greater<>> heap;
    for (int list = 0; list < static_cast<int>(lists.size()); ++list)
        if (!lists[list].empty()) heap.push({lists[list][0], list, 0});
    vector<int> result;
    while (!heap.empty()) {
        auto entry = heap.top(); heap.pop();
        int value = get<0>(entry), list = get<1>(entry), index = get<2>(entry);
        result.push_back(value);
        if (++index < static_cast<int>(lists[list].size())) heap.push({lists[list][index], list, index});
    }
    return result;
}`),
  sieve: cpp(`
vector<int> sieve(int limit) {
    vector<bool> prime(limit + 1, true); prime[0] = prime[1] = false;
    for (int number = 2; number * number <= limit; ++number)
        if (prime[number]) for (int multiple = number * number; multiple <= limit; multiple += number)
            prime[multiple] = false;
    vector<int> result;
    for (int number = 2; number <= limit; ++number) if (prime[number]) result.push_back(number);
    return result;
}`),
  gcd: cpp(`
long long gcdEuclid(long long first, long long second) {
    while (second) {
        long long temporary = first % second; first = second; second = temporary;
    }
    return abs(first);
}`),
  modularArithmetic: cpp(`
long long modularPower(long long base, long long exponent, long long modulus) {
    long long result = 1; base %= modulus;
    while (exponent) {
        if (exponent & 1) result = result * base % modulus;
        base = base * base % modulus; exponent >>= 1;
    }
    return result;
}`),
  fastExponentiation: cpp(`
long long fastPower(long long base, long long exponent) {
    long long result = 1;
    while (exponent) {
        if (exponent & 1) result *= base;
        base *= base; exponent >>= 1;
    }
    return result;
}`),
};
