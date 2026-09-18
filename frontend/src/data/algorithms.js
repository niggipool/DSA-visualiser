

export const categories = [
  "Sorting",
  "Searching",
  "Graph",
  "Tree",
  "Data Structures",
  "Dynamic Programming",
  "String",
];

export const algorithmsByCategory = {
  Sorting: [
    "Bubble Sort",
    "Insertion Sort",
    "Selection Sort",
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
    "Counting Sort",
    "Radix Sort",
  ],
  Searching: ["Linear Search", "Binary Search"],
  Graph: ["BFS", "DFS", "Dijkstra", "A*", "Bellman-Ford", "Kruskal", "Prim"],
  Tree: ["Tree BFS", "Tree DFS", "BST", "AVL", "Red-Black"],
  "Data Structures": ["Stack", "Queue", "Linked List", "Heap", "Hash Map"],
  "Dynamic Programming": ["Fibonacci", "Knapsack", "LCS"],
  String: ["KMP", "Rabin-Karp", "Z-Algorithm"],
};

export const REGISTRY = {
  // Sorting
  "Sorting:Bubble Sort": {
    endpoint: "/api/sorting/bubble",
    kind: "array",
    input: "array",
  },
  "Sorting:Insertion Sort": {
    endpoint: "/api/sorting/insertion",
    kind: "array",
    input: "array",
  },
  "Sorting:Selection Sort": {
    endpoint: "/api/sorting/selection",
    kind: "array",
    input: "array",
  },
  "Sorting:Merge Sort": {
    endpoint: "/api/sorting/merge",
    kind: "array",
    input: "array",
  },
  "Sorting:Quick Sort": {
    endpoint: "/api/sorting/quick",
    kind: "array",
    input: "array",
  },
  "Sorting:Counting Sort": {
    endpoint: "/api/sorting/counting",
    kind: "array",
    input: "array",
  },

  // Searching
  "Searching:Linear Search": {
    endpoint: "/api/searching/linear",
    kind: "array",
    input: "search",
  },
  //"Searching:Binary Search": { endpoint: "/api/searching/binary", kind: "array", input: "search" },

  // Graphs
  //"Graph:DFS": { endpoint: "/api/graphs/dfs", kind: "graph", input: "graph" },
  //"Graph:BFS": { endpoint: "/api/graphs/bfs", kind: "graph", input: "graph" },
  //"Graph:Dijkstra": { endpoint: "/api/graphs/dijkstra", kind: "graph", input: "graph" },
  // A* needs a goal: its heuristic measures the distance to one.
  //"Graph:A*": { endpoint: "/api/graphs/astar", kind: "graph", input: "graph", requiresGoal: true },

  // Trees
  //"Tree:Tree BFS": { endpoint: "/api/trees/bfs", kind: "graph", input: "tree" },
  //"Tree:Tree DFS": { endpoint: "/api/trees/dfs", kind: "graph", input: "treeOrder" },

  // Data structures

  "Data Structures:Stack": {
    endpoint: "/api/structures/stack",
    kind: "structure",
    input: "operations",
    ops: ["push", "pop", "peek"],
    sample: "push 12\npush 7\npush 30\npeek\npop\npush 5\npop",
  },
  "Data Structures:Queue": {
    endpoint: "/api/structures/queue",
    kind: "structure",
    input: "operations",
    ops: ["enqueue", "dequeue", "peek"],
    sample:
      "enqueue 12\nenqueue 7\nenqueue 30\npeek\ndequeue\nenqueue 5\ndequeue",
  },
  "Data Structures:Linked List": {
    endpoint: "/api/structures/linked-list",
    kind: "structure",
    input: "operations",
    ops: ["insert_head", "insert_tail", "insert_at", "search", "delete"],
    sample:
      "insert_head 30\ninsert_head 12\ninsert_tail 7\ninsert_at 99 2\nsearch 7\ndelete 99",
  },
  "Data Structures:Heap": {
    endpoint: "/api/structures/heap",
    kind: "structure",
    input: "operations",
    ops: ["insert", "extract", "peek"],
    sample:
      "insert 20\ninsert 15\ninsert 30\ninsert 8\ninsert 12\npeek\nextract",
  },
  "Data Structures:Hash Map": {
    endpoint: "/api/structures/hash-map",
    kind: "structure",
    input: "operations",
    ops: ["put", "get", "delete"],
    sample:
      "put apple 5\nput banana 3\nput cherry 9\nput date 1\nget cherry\ndelete banana\nget banana",
  },
};

export const registryKey = (category, algorithm) => `${category}:${algorithm}`;

export const entryFor = (category, algorithm) =>
  REGISTRY[registryKey(category, algorithm)] ?? null;

export const isImplemented = (category, algorithm) =>
  Boolean(entryFor(category, algorithm));
