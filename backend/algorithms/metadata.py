

METADATA = {
    # ------------------------------------------------------------------ #
    # Sorting
    # ------------------------------------------------------------------ #
    "bubble-sort": {
        "id": "bubble-sort",
        "name": "Bubble Sort",
        "category": "Sorting",
        "description": (
            "Repeatedly steps through the array comparing adjacent elements and "
            "swapping them when out of order. Each pass bubbles the largest "
            "unsorted value to the end."
        ),
        "time": {"best": "O(n)", "average": "O(n²)", "worst": "O(n²)"},
        "space": "O(1)",
        "stable": True,
        "in_place": True,
        "notes": "Best case is O(n) only because a pass with no swaps exits early.",
    },
    "insertion-sort": {
        "id": "insertion-sort",
        "name": "Insertion Sort",
        "category": "Sorting",
        "description": (
            "Grows a sorted region on the left. Each key is compared backwards "
            "through it, larger values shift right, and the key drops into the gap."
        ),
        "time": {"best": "O(n)", "average": "O(n²)", "worst": "O(n²)"},
        "space": "O(1)",
        "stable": True,
        "in_place": True,
        "notes": "Very fast on nearly-sorted input: most keys lose their first comparison and stay put.",
    },
    "selection-sort": {
        "id": "selection-sort",
        "name": "Selection Sort",
        "category": "Sorting",
        "description": (
            "Each pass scans the unsorted region for the smallest value and swaps "
            "it into the boundary position."
        ),
        "time": {"best": "O(n²)", "average": "O(n²)", "worst": "O(n²)"},
        "space": "O(1)",
        "stable": False,
        "in_place": True,
        "notes": (
            "No best case: it scans the whole remaining region regardless. It does "
            "make at most n-1 swaps, which matters when writes are expensive."
        ),
    },
    "merge-sort": {
        "id": "merge-sort",
        "name": "Merge Sort",
        "category": "Sorting",
        "description": (
            "Divides the array in half, sorts each half, then merges the two "
            "sorted halves back together using an auxiliary buffer."
        ),
        "time": {"best": "O(n log n)", "average": "O(n log n)", "worst": "O(n log n)"},
        "space": "O(n)",
        "stable": True,
        "in_place": False,
        "notes": "The only sort here with a guaranteed O(n log n) worst case, paid for with O(n) extra space.",
    },
    "quick-sort": {
        "id": "quick-sort",
        "name": "Quick Sort",
        "category": "Sorting",
        "description": (
            "Picks a pivot and partitions the array so smaller values sit left and "
            "larger values right, then sorts each side recursively."
        ),
        "time": {"best": "O(n log n)", "average": "O(n log n)", "worst": "O(n²)"},
        "space": "O(log n)",
        "stable": False,
        "in_place": True,
        "notes": (
            "This uses the last element as pivot, so already-sorted input triggers "
            "the O(n²) worst case. Sort a sorted array to see it happen."
        ),
    },
    "heap-sort": {
        "id": "heap-sort",
        "name": "Heap Sort",
        "category": "Sorting",
        "description": (
            "Builds a max heap in place, then repeatedly swaps the root to the end "
            "of the unsorted region and restores the heap property."
        ),
        "time": {"best": "O(n log n)", "average": "O(n log n)", "worst": "O(n log n)"},
        "space": "O(1)",
        "stable": False,
        "in_place": True,
        "notes": "Guaranteed O(n log n) with O(1) space, but poor cache locality makes it slower than quick sort in practice.",
    },
    # ------------------------------------------------------------------ #
    # Searching
    # ------------------------------------------------------------------ #
    "linear-search": {
        "id": "linear-search",
        "name": "Linear Search",
        "category": "Searching",
        "description": "Checks each position in order until the target is found or the array ends.",
        "time": {"best": "O(1)", "average": "O(n)", "worst": "O(n)"},
        "space": "O(1)",
        "stable": None,
        "in_place": True,
        "notes": "The only option on unsorted data, and faster than binary search for very small arrays.",
    },
    "binary-search": {
        "id": "binary-search",
        "name": "Binary Search",
        "category": "Searching",
        "description": (
            "Repeatedly halves a sorted search window by comparing the target with "
            "the middle element."
        ),
        "time": {"best": "O(1)", "average": "O(log n)", "worst": "O(log n)"},
        "space": "O(1)",
        "stable": None,
        "in_place": True,
        "notes": "Requires sorted input. Sorting first costs O(n log n), so it pays off only across many searches.",
    },
    # ------------------------------------------------------------------ #
    # Graphs
    # ------------------------------------------------------------------ #
    "graph-bfs": {
        "id": "graph-bfs",
        "name": "Graph BFS",
        "category": "Graph",
        "description": "Explores the graph in rings of increasing distance using a queue.",
        "time": {"best": "O(V + E)", "average": "O(V + E)", "worst": "O(V + E)"},
        "space": "O(V)",
        "stable": None,
        "in_place": False,
        "notes": "On an unweighted graph, the first time BFS reaches a node is via a shortest path.",
    },
    "graph-dfs": {
        "id": "graph-dfs",
        "name": "Graph DFS",
        "category": "Graph",
        "description": "Follows one branch as deep as possible before backtracking, using a stack.",
        "time": {"best": "O(V + E)", "average": "O(V + E)", "worst": "O(V + E)"},
        "space": "O(V)",
        "stable": None,
        "in_place": False,
        "notes": "Same cost as BFS but no shortest-path guarantee. Used for cycle detection and topological sorting.",
    },
    "dijkstra": {
        "id": "dijkstra",
        "name": "Dijkstra",
        "category": "Graph",
        "description": "Finds shortest paths from one source by always settling the closest unsettled node.",
        "time": {
            "best": "O((V + E) log V)",
            "average": "O((V + E) log V)",
            "worst": "O((V + E) log V)",
        },
        "space": "O(V)",
        "stable": None,
        "in_place": False,
        "notes": "Requires non-negative weights. With a negative edge, a settled node could still improve, breaking it.",
    },
    "astar": {
        "id": "astar",
        "name": "A* Search",
        "category": "Graph",
        "description": "Dijkstra guided by a heuristic, expanding nodes in order of f = g + h.",
        "time": {"best": "O(E)", "average": "depends on heuristic", "worst": "O((V + E) log V)"},
        "space": "O(V)",
        "stable": None,
        "in_place": False,
        "notes": "Optimal only if the heuristic never overestimates. With h = 0 it degenerates into Dijkstra.",
    },
    # ------------------------------------------------------------------ #
    # Trees
    # ------------------------------------------------------------------ #
    "tree-bfs": {
        "id": "tree-bfs",
        "name": "Tree BFS",
        "category": "Tree",
        "description": "Level-order traversal: visits every node at one depth before descending.",
        "time": {"best": "O(n)", "average": "O(n)", "worst": "O(n)"},
        "space": "O(w)",
        "stable": None,
        "in_place": False,
        "notes": "Space is the maximum width of the tree, which for a full tree is about n/2.",
    },
    "tree-dfs": {
        "id": "tree-dfs",
        "name": "Tree DFS",
        "category": "Tree",
        "description": "Depth-first traversal in preorder, inorder or postorder.",
        "time": {"best": "O(n)", "average": "O(n)", "worst": "O(n)"},
        "space": "O(h)",
        "stable": None,
        "in_place": False,
        "notes": "Inorder on a binary search tree yields the values in sorted order.",
    },
    # ------------------------------------------------------------------ #
    # Data structures
    # ------------------------------------------------------------------ #
    "stack": {
        "id": "stack",
        "name": "Stack",
        "category": "Data Structures",
        "description": "Last in, first out. Push, pop and peek all act on the top only.",
        "time": {"push": "O(1)", "pop": "O(1)", "peek": "O(1)", "search": "O(n)"},
        "space": "O(n)",
        "stable": None,
        "in_place": False,
        "notes": "Backs function calls, undo history, and depth-first search.",
    },
    "queue": {
        "id": "queue",
        "name": "Queue",
        "category": "Data Structures",
        "description": "First in, first out. Items enter at the rear and leave from the front.",
        "time": {"enqueue": "O(1)", "dequeue": "O(1)", "peek": "O(1)", "search": "O(n)"},
        "space": "O(n)",
        "stable": None,
        "in_place": False,
        "notes": "A real array-backed queue uses a circular buffer, otherwise dequeue would be O(n).",
    },
    "linked-list": {
        "id": "linked-list",
        "name": "Linked List",
        "category": "Data Structures",
        "description": "Nodes each holding a value and a pointer to the next node.",
        "time": {
            "insert head": "O(1)",
            "insert tail": "O(n)",
            "search": "O(n)",
            "delete": "O(n)",
        },
        "space": "O(n)",
        "stable": None,
        "in_place": False,
        "notes": "No random access: reaching position k costs k hops. The trade is O(1) insertion at the head.",
    },
    "heap-structure": {
        "id": "heap-structure",
        "name": "Heap (Min-Heap)",
        "category": "Data Structures",
        "description": "A complete binary tree in an array where every parent is smaller than its children.",
        "time": {"insert": "O(log n)", "extract min": "O(log n)", "peek": "O(1)", "build": "O(n)"},
        "space": "O(n)",
        "stable": None,
        "in_place": True,
        "notes": "Only partially ordered: siblings have no relationship, which is why it is cheaper than a sorted list.",
    },
    "hash-map": {
        "id": "hash-map",
        "name": "Hash Map",
        "category": "Data Structures",
        "description": "Maps keys to buckets via a hash function, resolving collisions with chains.",
        "time": {"put": "O(1) avg", "get": "O(1) avg", "delete": "O(1) avg", "worst": "O(n)"},
        "space": "O(n)",
        "stable": None,
        "in_place": False,
        "notes": "O(1) assumes a good hash and a low load factor. If every key collides it degrades to a linked list.",
    },
}
