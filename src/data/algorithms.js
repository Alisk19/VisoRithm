// src/data/algorithms.js
// Removed: recursion-complexity category

export const CATEGORIES = [
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    description: 'Master Quicksort, Mergesort, and the beauty of order from chaos.',
    icon: 'sort',
    algorithms: [
      { id: 'bubble-sort', name: 'Bubble Sort', complexity: 'O(n²)', description: 'Repeatedly steps through the list, swapping adjacent elements if they are in the wrong order.' },
      { id: 'selection-sort', name: 'Selection Sort', complexity: 'O(n²)', description: 'Sorts an array by repeatedly finding the minimum element from the unsorted part.' },
      { id: 'insertion-sort', name: 'Insertion Sort', complexity: 'O(n²)', description: 'Builds the final sorted array one item at a time.' },
      { id: 'merge-sort', name: 'Merge Sort', complexity: 'O(n log n)', description: 'An efficient, general-purpose, divide and conquer sorting algorithm.' },
      { id: 'quick-sort', name: 'Quick Sort', complexity: 'O(n log n)', description: 'Divide-and-conquer algorithm that relies on a pivot to repeatedly partition arrays.' },
    ]
  },
  {
    id: 'searching',
    title: 'Searching Algorithms',
    description: 'Navigate through arrays and trees with optimal efficiency.',
    icon: 'search',
    algorithms: [
      { id: 'linear-search', name: 'Linear Search', complexity: 'O(n)', description: 'Finds a target value within a list sequentially.' },
      { id: 'binary-search', name: 'Binary Search', complexity: 'O(log n)', description: 'Finds the position of a target value within a sorted array.' },
    ]
  },
  {
    id: 'divide-conquer',
    title: 'Divide and Conquer',
    description: 'Break problems down into smaller, simpler subsets.',
    icon: 'call_split',
    algorithms: [
      { id: 'dc-merge-sort', name: 'Merge Sort', complexity: 'O(n log n)', description: 'An efficient, general-purpose, divide and conquer sorting algorithm.' },
      { id: 'dc-quick-sort', name: 'Quick Sort', complexity: 'O(n log n)', description: 'A highly efficient and prevalent sorting algorithm.' },
      { id: 'dc-binary-search', name: 'Binary Search', complexity: 'O(log n)', description: 'Efficiently search across sorted collections via halving.' },
    ]
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    description: 'Algorithm for finding solutions to computational problems by incrementally building candidates.',
    icon: 'undo',
    algorithms: [
      { id: 'n-queens', name: 'N-Queens Problem', complexity: 'O(N!)', description: 'Place N chess queens on an N×N chessboard.' },
      { id: 'rat-in-maze', name: 'Rat in a Maze', complexity: 'O(2^(n²))', description: 'Find a path from source to destination traversing an unblocked grid.' },
      { id: 'subset-sum', name: 'Subset Sum', complexity: 'O(2^n)', description: 'Determine if there is a subset of the given set with sum equal to a given sum.' },
      { id: 'permutations', name: 'Permutations', complexity: 'O(n!)', description: 'Generate all possible permutations of an array/string.' },
    ]
  },
  {
    id: 'branch-bound',
    title: 'Branch and Bound',
    description: 'An algorithm design paradigm for discrete and combinatorial optimization problems.',
    icon: 'account_tree',
    algorithms: [
      { id: 'n-queens-optimized', name: 'N-Queens (Optimized)', complexity: 'O(N!)', description: 'Optimized constraint propagation for chess piece placement.' },
      { id: '0-1-knapsack-bb', name: '0/1 Knapsack', complexity: 'O(2^n)', description: 'Combinatorial optimization using bounding limits.' },
      { id: 'job-assignment', name: 'Job Assignment Problem', complexity: 'O(n!)', description: 'Assigning N jobs to N workers at minimal cost.' },
    ]
  },
  {
    id: 'graph',
    title: 'Graph Algorithms',
    description: 'Visualize BFS, DFS, Prim\'s, Kruskal\'s and the complex webs of connectivity.',
    icon: 'hub',
    algorithms: [
      { id: 'bfs', name: 'Breadth First Search', complexity: 'O(V + E)', description: 'Traverse graph level by level.' },
      { id: 'dfs', name: 'Depth First Search', complexity: 'O(V + E)', description: 'Traverse deep into graph branches before backtracking.' },
      { id: 'prims', name: 'Prim\'s Algorithm', complexity: 'O(E log V)', description: 'Greedy algorithm that finds a minimum spanning tree.' },
      { id: 'kruskal', name: 'Kruskal\'s Algorithm', complexity: 'O(E log V)', description: 'Finds a minimum spanning forest of an undirected edge-weighted graph.' },
    ]
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    description: 'Simplify complicated problems by breaking them down into simpler sub-problems.',
    icon: 'table_chart',
    algorithms: [
      { id: 'fibonacci-dp', name: 'Fibonacci DP', complexity: 'O(n)', description: 'Compute Fibonacci numbers using memoization or state tabulation.' },
      { id: '0-1-knapsack-dp', name: '0/1 Knapsack DP', complexity: 'O(nW)', description: 'Maximize value in a knapsack of capacity W.' },
      { id: 'lcs', name: 'Longest Common Subsequence', complexity: 'O(mn)', description: 'Finds the longest subsequence present in given sequences.' },
    ]
  },
  {
    id: 'greedy',
    title: 'Greedy Algorithms',
    description: 'Make locally optimal choices at each stage.',
    icon: 'trending_up',
    algorithms: [
      { id: 'activity-selection', name: 'Activity Selection', complexity: 'O(n log n)', description: 'Select the maximum number of activities.' },
      { id: 'fractional-knapsack', name: 'Fractional Knapsack', complexity: 'O(n log n)', description: 'Take fractions of items to maximize value.' },
    ]
  },
  {
    id: 'miscellaneous',
    title: 'Miscellaneous',
    description: 'Specialized algorithms for advanced use-cases.',
    icon: 'extension',
    algorithms: [
      { id: 'warshalls', name: 'Warshall\'s Algorithm', complexity: 'O(V³)', description: 'Find the transitive closure of a directed graph.' },
      { id: 'floyds', name: 'Floyd\'s Algorithm', complexity: 'O(V³)', description: 'Shortest path between all pairs of vertices.' },
    ]
  }
];

export function getAllAlgorithms() {
  return CATEGORIES.flatMap(c => c.algorithms.map(a => ({ ...a, category: c.title, categoryId: c.id })));
}

export function getAlgorithmById(id) {
  return getAllAlgorithms().find(a => a.id === id);
}

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}
