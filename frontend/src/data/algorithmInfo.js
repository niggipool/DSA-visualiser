/**
 * Static reference content for every algorithm listed in the UI.
 *
 * Moved out of AlgorithmsPage verbatim so the page file stays readable. The
 * content itself is unchanged. For algorithms the backend can actually run, the
 * authoritative complexity numbers now come from the API's `meta` block
 * instead — this map covers descriptions and the "coming soon" entries.
 */

export const categories = [
  "Sorting",
  "Searching",
  "Graph",
  "Tree",
  "Dynamic Programming",
  "String",
  "Hashing",
];

export const algorithmsByCategory = {
  Sorting: [
    "Bubble Sort",
    "Selection Sort",
    "Insertion Sort",
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
    "Counting Sort",
    "Radix Sort",
  ],
  Searching: ["Linear Search", "Binary Search"],
  Graph: ["DFS", "BFS", "Dijkstra", "A*", "Bellman-Ford", "Kruskal", "Prim"],
  Tree: ["BST", "AVL", "Red-Black"],
  "Dynamic Programming": ["Fibonacci", "Knapsack", "LCS"],
  String: ["KMP", "Rabin-Karp", "Z-Algorithm"],
  Hashing: ["Hash Table", "Open Addressing", "Chaining"],
};

export const starterArray = [42, 17, 68, 9, 31, 56, 24, 73, 12, 49];

export function algorithmDetails(category, algorithm) {
  if (algorithm === "Bubble Sort")
    return {
      description:
        "Classic Bubble Sort repeatedly steps through the array, compares adjacent elements, and swaps them when they are in the wrong order. Each pass bubbles the largest unsorted element into position.",
      concepts: [
        [
          "Adjacent comparison.",
          "Only neighboring values are compared on each step.",
        ],
        ["Stable sort.", "Equal values keep their relative order."],
        ["Complexity.", "Average and worst case: O(n²). Space: O(1)."],
      ],
    };

  if (algorithm === "Selection Sort")
    return {
      description:
        "Selection Sort repeatedly searches the unsorted portion of the array for the smallest element and places it at the beginning of that portion.",
      concepts: [
        [
          "Find the minimum.",
          "Each pass searches the unsorted portion for the smallest value.",
        ],
        [
          "Place the minimum.",
          "The smallest element is swapped into its correct position.",
        ],
        ["Complexity.", "Best, average, and worst case: O(n²). Space: O(1)."],
      ],
    };

  if (algorithm === "Insertion Sort")
    return {
      description:
        "Insertion Sort builds the sorted portion of an array one element at a time. Each new value is compared with the sorted portion and inserted into its correct position.",
      concepts: [
        [
          "Sorted portion.",
          "The left side of the array is kept sorted as the algorithm progresses.",
        ],
        [
          "Shifting.",
          "Larger elements are shifted to the right to make space for the current value.",
        ],
        [
          "Complexity.",
          "Average and worst case: O(n²). Best case: O(n). Space: O(1).",
        ],
      ],
    };

  if (algorithm === "Merge Sort")
    return {
      description:
        "Merge Sort uses divide and conquer to sort an array. It repeatedly divides the array into smaller subarrays, sorts them, and merges the sorted pieces back together.",
      concepts: [
        [
          "Divide and conquer.",
          "The array is repeatedly divided into smaller subarrays.",
        ],
        ["Merge.", "Two sorted subarrays are combined into one sorted array."],
        [
          "Complexity.",
          "Best, average, and worst case: O(n log n). Space: O(n).",
        ],
      ],
    };

  if (algorithm === "Quick Sort")
    return {
      description:
        "Quick Sort selects a pivot and partitions the array around it. Values smaller than the pivot move to one side while larger values move to the other, and the partitions are sorted recursively.",
      concepts: [
        [
          "Pivot.",
          "A selected element acts as the reference for partitioning the array.",
        ],
        [
          "Partitioning.",
          "Elements are rearranged so values fall on the appropriate side of the pivot.",
        ],
        ["Complexity.", "Average case: O(n log n). Worst case: O(n²)."],
      ],
    };

  if (algorithm === "Heap Sort")
    return {
      description:
        "Heap Sort organizes the array into a heap structure and repeatedly removes the largest element, placing it at the end of the array.",
      concepts: [
        [
          "Max heap.",
          "The largest value is maintained at the root of the heap.",
        ],
        [
          "Heapify.",
          "Heapify restores the heap property after elements are moved.",
        ],
        [
          "Complexity.",
          "Best, average, and worst case: O(n log n). Space: O(1).",
        ],
      ],
    };

  if (algorithm === "Counting Sort")
    return {
      description:
        "Counting Sort counts how many times each value occurs and uses those frequencies to construct the sorted output without directly comparing elements.",
      concepts: [
        [
          "Frequency counting.",
          "A count is maintained for each value in the input range.",
        ],
        [
          "Non-comparison sort.",
          "Elements are sorted using their values rather than pairwise comparisons.",
        ],
        [
          "Complexity.",
          "Time: O(n + k), where k is the range of input values. Space: O(k).",
        ],
      ],
    };

  if (algorithm === "Radix Sort")
    return {
      description:
        "Radix Sort sorts numbers by processing their digits one position at a time, typically starting with the least significant digit.",
      concepts: [
        [
          "Digit by digit.",
          "Numbers are grouped according to individual digit positions.",
        ],
        [
          "Stable sorting.",
          "The sorting method used for each digit must preserve the relative order of equal digits.",
        ],
        [
          "Complexity.",
          "Time: O(d(n + k)), where d is the number of digits and k is the digit range.",
        ],
      ],
    };

  if (algorithm === "Linear Search")
    return {
      description:
        "Linear Search checks elements one by one until the target is found or the entire collection has been examined.",
      concepts: [
        [
          "Sequential scan.",
          "Elements are checked from the beginning toward the end.",
        ],
        [
          "No sorting required.",
          "Linear Search can operate directly on unsorted data.",
        ],
        [
          "Complexity.",
          "Best case: O(1). Average and worst case: O(n). Space: O(1).",
        ],
      ],
    };

  if (algorithm === "Binary Search")
    return {
      description:
        "Binary Search finds a target in a sorted array by repeatedly checking the middle element and eliminating half of the remaining search space.",
      concepts: [
        [
          "Sorted input.",
          "The array must be sorted for Binary Search to work correctly.",
        ],
        [
          "Divide the search space.",
          "Each comparison eliminates approximately half of the remaining elements.",
        ],
        [
          "Complexity.",
          "Best case: O(1). Average and worst case: O(log n). Space: O(1) iteratively.",
        ],
      ],
    };

  if (algorithm === "DFS")
    return {
      description:
        "Depth-First Search explores a graph by following one path as deeply as possible before backtracking and exploring another path.",
      concepts: [
        [
          "Depth first.",
          "The algorithm explores as far as possible along a branch before returning.",
        ],
        [
          "Stack.",
          "DFS can use recursion or an explicit stack to track vertices.",
        ],
        ["Complexity.", "Time: O(V + E). Space: O(V)."],
      ],
    };

  if (algorithm === "BFS")
    return {
      description:
        "Breadth-First Search explores a graph level by level, visiting nearby vertices before moving farther away from the starting vertex.",
      concepts: [
        [
          "Level order.",
          "Vertices are explored according to their distance from the starting vertex.",
        ],
        [
          "Queue.",
          "A queue determines the order in which discovered vertices are processed.",
        ],
        ["Complexity.", "Time: O(V + E). Space: O(V)."],
      ],
    };

  if (algorithm === "Dijkstra")
    return {
      description:
        "Dijkstra's algorithm finds shortest paths from a starting vertex to other vertices in a weighted graph with non-negative edge weights.",
      concepts: [
        [
          "Shortest path.",
          "The algorithm continuously improves the known shortest distance to each vertex.",
        ],
        [
          "Greedy choice.",
          "The unvisited vertex with the smallest known distance is processed next.",
        ],
        ["Complexity.", "With a binary heap: O((V + E) log V). Space: O(V)."],
      ],
    };

  if (algorithm === "A*")
    return {
      description:
        "A* is a pathfinding algorithm that combines the cost already traveled with a heuristic estimate of the remaining distance to guide the search toward the target.",
      concepts: [
        [
          "Heuristic.",
          "An estimate of the remaining distance helps guide the search.",
        ],
        [
          "Path cost.",
          "The algorithm considers both the cost already traveled and the estimated remaining cost.",
        ],
        [
          "Complexity.",
          "Performance depends heavily on the graph and heuristic used.",
        ],
      ],
    };

  if (algorithm === "Bellman-Ford")
    return {
      description:
        "Bellman-Ford calculates shortest paths from a starting vertex by repeatedly relaxing every edge. Unlike Dijkstra's algorithm, it can handle negative edge weights.",
      concepts: [
        [
          "Edge relaxation.",
          "Distances are repeatedly updated when a shorter path is discovered.",
        ],
        [
          "Negative weights.",
          "Bellman-Ford can work with negative edge weights.",
        ],
        ["Complexity.", "Time: O(VE). Space: O(V)."],
      ],
    };

  if (algorithm === "Kruskal")
    return {
      description:
        "Kruskal's algorithm builds a minimum spanning tree by considering edges in increasing order of weight and adding an edge when it does not create a cycle.",
      concepts: [
        [
          "Sort edges.",
          "Edges are processed from the smallest weight to the largest.",
        ],
        [
          "Cycle detection.",
          "An edge is added only when it does not form a cycle.",
        ],
        [
          "Complexity.",
          "Time: O(E log E), primarily due to sorting the edges.",
        ],
      ],
    };

  if (algorithm === "Prim")
    return {
      description:
        "Prim's algorithm constructs a minimum spanning tree by starting from a vertex and repeatedly adding the cheapest edge that connects the growing tree to a new vertex.",
      concepts: [
        ["Growing tree.", "The spanning tree expands one vertex at a time."],
        [
          "Minimum edge.",
          "The cheapest edge connecting the current tree to an unvisited vertex is selected.",
        ],
        ["Complexity.", "Using a binary heap: O(E log V)."],
      ],
    };

  if (algorithm === "BST")
    return {
      description:
        "A Binary Search Tree organizes values so that smaller values are stored in the left subtree and larger values are stored in the right subtree.",
      concepts: [
        [
          "Ordering property.",
          "Left descendants are smaller and right descendants are larger than the node.",
        ],
        [
          "Search.",
          "The ordering allows entire subtrees to be skipped during searches.",
        ],
        [
          "Complexity.",
          "Average search, insertion, and deletion: O(log n). Worst case: O(n).",
        ],
      ],
    };

  if (algorithm === "AVL")
    return {
      description:
        "An AVL Tree is a self-balancing Binary Search Tree that maintains a balanced height after insertions and deletions.",
      concepts: [
        [
          "Balance factor.",
          "Each node tracks the height difference between its left and right subtrees.",
        ],
        [
          "Rotations.",
          "Tree rotations restore balance when the tree becomes too uneven.",
        ],
        ["Complexity.", "Search, insertion, and deletion: O(log n)."],
      ],
    };

  if (algorithm === "Red-Black")
    return {
      description:
        "A Red-Black Tree is a self-balancing Binary Search Tree that uses node colors and structural rules to keep the tree approximately balanced.",
      concepts: [
        ["Node colors.", "Each node is assigned either red or black."],
        [
          "Balancing rules.",
          "Color and structural properties prevent the tree from becoming excessively tall.",
        ],
        ["Complexity.", "Search, insertion, and deletion: O(log n)."],
      ],
    };

  if (algorithm === "Fibonacci")
    return {
      description:
        "The Fibonacci problem demonstrates Dynamic Programming by breaking the sequence into overlapping subproblems and storing previously calculated results.",
      concepts: [
        [
          "Overlapping subproblems.",
          "The same smaller Fibonacci values are needed multiple times.",
        ],
        [
          "Memoization.",
          "Previously calculated results can be stored and reused.",
        ],
        [
          "Complexity.",
          "Dynamic Programming reduces the standard recursive approach to O(n) time.",
        ],
      ],
    };

  if (algorithm === "Knapsack")
    return {
      description:
        "The Knapsack problem determines which items should be selected under a capacity constraint to maximize total value.",
      concepts: [
        [
          "Choice.",
          "For each item, the algorithm considers whether including it improves the result.",
        ],
        [
          "Capacity.",
          "The available capacity limits which combinations of items can be selected.",
        ],
        [
          "Complexity.",
          "The classic 0/1 Knapsack Dynamic Programming solution takes O(nW) time and space.",
        ],
      ],
    };

  if (algorithm === "LCS")
    return {
      description:
        "Longest Common Subsequence finds the longest sequence of characters that appears in the same relative order in two strings, without requiring the characters to be adjacent.",
      concepts: [
        [
          "Subsequence.",
          "Characters must maintain their relative order but do not need to be consecutive.",
        ],
        [
          "Dynamic Programming.",
          "Solutions to smaller prefixes are stored and reused.",
        ],
        [
          "Complexity.",
          "Standard Dynamic Programming solution: O(mn) time and O(mn) space.",
        ],
      ],
    };

  if (algorithm === "KMP")
    return {
      description:
        "Knuth-Morris-Pratt searches for a pattern inside a string while avoiding unnecessary comparisons by using information about previously matched characters.",
      concepts: [
        [
          "Pattern matching.",
          "KMP searches for occurrences of a pattern within a larger text.",
        ],
        [
          "LPS array.",
          "The Longest Prefix Suffix array determines how far the pattern can shift after a mismatch.",
        ],
        [
          "Complexity.",
          "Time: O(n + m), where n is the text length and m is the pattern length.",
        ],
      ],
    };

  if (algorithm === "Rabin-Karp")
    return {
      description:
        "Rabin-Karp uses hashing to compare a pattern against sections of a larger string efficiently, checking actual characters when hash values match.",
      concepts: [
        [
          "Hashing.",
          "Strings are converted into numerical hash values for quick comparison.",
        ],
        [
          "Rolling hash.",
          "The hash can be updated efficiently as the search window moves.",
        ],
        [
          "Complexity.",
          "Average case: O(n + m). Worst case: O(nm) due to hash collisions.",
        ],
      ],
    };

  if (algorithm === "Z-Algorithm")
    return {
      description:
        "The Z-Algorithm preprocesses a string to determine how many characters from each position match the prefix of the string.",
      concepts: [
        [
          "Z-array.",
          "Each position stores the length of the longest substring starting there that matches the prefix.",
        ],
        [
          "Pattern matching.",
          "A combined pattern and text can be processed to find pattern occurrences.",
        ],
        ["Complexity.", "Time: O(n). Space: O(n)."],
      ],
    };

  if (algorithm === "Hash Table")
    return {
      description:
        "A Hash Table stores key-value pairs by converting keys into array indices using a hash function, allowing fast average-case insertion, lookup, and deletion.",
      concepts: [
        [
          "Hash function.",
          "A key is transformed into an index used to locate its stored value.",
        ],
        [
          "Collision.",
          "Different keys can produce the same index and require collision handling.",
        ],
        [
          "Complexity.",
          "Average insertion, lookup, and deletion: O(1). Worst case: O(n).",
        ],
      ],
    };

  if (algorithm === "Open Addressing")
    return {
      description:
        "Open Addressing resolves hash collisions by searching for another available position within the same hash table.",
      concepts: [
        [
          "Collision resolution.",
          "When a position is occupied, another position is searched according to a probing strategy.",
        ],
        [
          "Probing.",
          "Linear, quadratic, or double hashing can determine the next position to inspect.",
        ],
        [
          "Complexity.",
          "Average operations are O(1) with a suitable load factor and hash function.",
        ],
      ],
    };

  if (algorithm === "Chaining")
    return {
      description:
        "Chaining resolves hash collisions by storing multiple entries at the same table position, commonly using linked lists or other collections.",
      concepts: [
        ["Buckets.", "Each hash table position can contain multiple entries."],
        [
          "Collision handling.",
          "Keys that map to the same index are stored together.",
        ],
        [
          "Complexity.",
          "Average insertion and lookup: O(1). Worst case: O(n).",
        ],
      ],
    };

  return {
    description: `${algorithm} is a ${category.toLowerCase()} algorithm. Its interactive backend visualizer is not implemented yet.`,
    concepts: [
      [
        "Category.",
        `${category} algorithms solve related computational problems.`,
      ],
      ["Selected algorithm.", `${algorithm} is available to explore here.`],
      ["Visualizer status.", "Backend visualization is coming soon."],
    ],
  };
}
