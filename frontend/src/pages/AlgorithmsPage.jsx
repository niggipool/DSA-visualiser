import { useEffect, useState } from "react";
import { fetchSortSteps, isImplemented } from "../services/api.js";
import { useStepPlayer } from "../hooks/useStepPlayer.js";
import { Link } from "react-router-dom";
import ArrayVisualizer from "../components/ArrayVisualizer.jsx";
import ComplexityPanel from "../components/ComplexityPanel.jsx";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  ChevronRight,
  ChevronDown,
  StepBack,
} from "lucide-react";

const categories = [
  "Sorting",
  "Searching",
  "Graph",
  "Tree",
  "Dynamic Programming",
  "String",
  "Hashing",
];
const algorithmsByCategory = {
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
const starterArray = [42, 17, 68, 9, 31, 56, 24, 73, 12, 49];

//DETAILS
function algorithmDetails(category, algorithm) {
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

function adaptApiSteps(result) {
  let comparisons = 0;
  let swaps = 0;

  const frames = result.steps.map((step) => {
    if (step.type === "compare") comparisons += 1;
    if (step.swapped || step.type === "swap") swaps += 1;

    return {
      array: step.array,
      ids: step.ids ?? step.array.map((_, index) => index),
      indices: step.indices ?? [],
      active: step.active ?? null,
      compared: step.compared ?? [],
      comparisons,
      swaps,
      sorted: step.sorted ?? [],
      message: step.message ?? "",
      type: step.type ?? "event",
    };
  });

  return [
    {
      array: frames[0]?.array ?? result.swapped_array,
      ids: frames[0]?.ids ?? result.swapped_array.map((_, index) => index),
      indices: [],
      active: null,
      compared: [],
      comparisons: 0,
      swaps: 0,
      sorted: [],
      message: "",
      type: "start",
    },

    ...frames,

    {
      array: result.swapped_array,
      ids: frames.at(-1)?.ids ?? result.swapped_array.map((_, index) => index),
      indices: [],
      active: null,
      compared: [],
      comparisons,
      swaps,
      sorted: result.swapped_array.map((_, index) => index),
      message: "Array is fully sorted",
      type: "done",
    },
  ];
}

function EventLogger({ steps, frame }) {
  const events = steps.slice(0, frame + 1).filter((step) => step.message);

  const getTypeStyle = (type) => {
    switch (type) {
      case "compare":
        return "text-yellow-400";

      case "swap":
        return "text-red-400";

      case "shift":
        return "text-orange-400";

      case "insert":
        return "text-emerald-400";

      case "select":
        return "text-cyan-400";

      case "sorted":
        return "text-emerald-300";

      case "done":
        return "text-emerald-400";

      default:
        return "text-zinc-400";
    }
  };

  const formatType = (type) => {
    if (!type) return "EVENT";

    return type.toUpperCase();
  };

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-panel/80">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
          Event Log
        </h3>

        <span className="font-mono text-[10px] text-zinc-600">
          {events.length} events
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto p-3">
        {events.length === 0 ? (
          <p className="px-2 py-4 text-center font-mono text-xs text-zinc-600">
            Waiting for algorithm events...
          </p>
        ) : (
          <div className="space-y-1">
            {events.map((event, index) => {
              const isCurrent = index === events.length - 1;

              return (
                <div
                  key={`${index}-${event.message}`}
                  className={`flex items-start gap-3 rounded-md px-2 py-1.5 transition ${
                    isCurrent ? "bg-white/[0.04]" : ""
                  }`}
                >
                  {/* Event number */}
                  <span className="w-6 shrink-0 text-right font-mono text-[10px] text-zinc-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Event type */}
                  <span
                    className={`w-16 shrink-0 font-mono text-[10px] font-bold ${getTypeStyle(
                      event.type,
                    )}`}
                  >
                    {formatType(event.type)}
                  </span>

                  {/* Message */}
                  <span
                    className={`font-mono text-xs ${
                      isCurrent ? "text-zinc-200" : "text-zinc-500"
                    }`}
                  >
                    {event.message}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="min-w-20 rounded-md border border-white/10 px-2 py-1.5 text-center">
      <p className="font-mono text-[9px] uppercase tracking-[.16em] text-zinc-500">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-base font-bold text-white">{value}</p>
    </div>
  );
}

export default function AlgorithmsPage() {
  const [category, setCategory] = useState("Sorting");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    algorithmsByCategory.Sorting[0],
  );
  const [array, setArray] = useState(starterArray);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(55);
  const [meta, setMeta] = useState(null);
  const [stats, setStats] = useState(null);
  const {
    frame,
    playing,
    atEnd,
    atStart,
    transitionMs,
    play,
    pause,
    next,
    previous,
    reset,
  } = useStepPlayer(steps, speed);
  const [showConcepts, setShowConcepts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const visibleAlgorithms = algorithmsByCategory[category];
  const isArrayVisualizer = isImplemented(selectedAlgorithm);
  const isSortingCategory = category === "Sorting" || category === "Searching";
  const details = algorithmDetails(category, selectedAlgorithm);
  const current = steps[Math.min(frame, Math.max(steps.length - 1, 0))] ?? {
    array,
    ids: array.map((_, index) => index),
    indices: [],
    active: null,
    comparisons: 0,
    swaps: 0,
    sorted: [],
    message: "",
    type: "start",
  };
  useEffect(() => {
    const controller = new AbortController();

    if (!isArrayVisualizer) {
      setSteps([]);
      setMeta(null);
      setStats(null);
      setLoading(false);
      setApiError("");
      return () => controller.abort();
    }
    async function loadSteps() {
      setLoading(true);
      setApiError("");

      try {
        const result = await fetchSortSteps(
          selectedAlgorithm,
          array,
          controller.signal,
        );

        setSteps(adaptApiSteps(result));
        setMeta(result.meta ?? null);
        setStats(result.stats ?? null);
      } catch (error) {
        if (error.name === "AbortError") return;

        setSteps([]);
        setMeta(null);
        setStats(null);
        setApiError(
          error.message || `${selectedAlgorithm} API is unavailable.`,
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSteps();

    return () => controller.abort();
  }, [array, selectedAlgorithm, isArrayVisualizer]);

  const selectCategory = (nextCategory) => {
    setCategory(nextCategory);
    setSelectedAlgorithm(algorithmsByCategory[nextCategory][0]);
    reset();
  };
  const newArray = () =>
    setArray(
      Array.from({ length: 10 }, () => Math.floor(Math.random() * 72) + 8),
    );
  return (
    <div className="min-h-screen bg-ink text-zinc-100 selection:bg-neon selection:text-white">
      <header className="sticky top-0 z-20 border-b border-neon/20 bg-ink/90 shadow-[0_1px_18px_rgba(255,23,68,.09)] backdrop-blur">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="font-mono text-3xl font-bold tracking-[.18em] text-white"
          >
            DSA<span className="text-neon"> </span>VISUALIZER
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-neon">
              Algorithm laboratory
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Algorithms
            </h1>
          </div>
          <button
            onClick={newArray}
            disabled={!isArrayVisualizer}
            className="rounded-md border border-white/15 bg-panel px-3 py-2 text-sm text-zinc-300 transition hover:border-neon/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generate array
          </button>
        </div>
        <section aria-label="Algorithm selection" className="space-y-3">
          <div className="grid overflow-hidden rounded-lg border border-white/10 bg-panel/80 sm:grid-cols-4 lg:grid-cols-7">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => selectCategory(item)}
                className={`min-h-14 border-b border-r border-white/5 px-3 py-3 font-bold transition last:border-r-0 sm:border-b-0 ${category === item ? "bg-neon/10 text-neon shadow-[inset_0_-2px_0_#ff1744]" : "text-white hover:bg-white/[.03] hover:text-white"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div
            className="grid gap-1 rounded-lg border border-white/10 bg-panel/80 p-1.5"
            style={{
              gridTemplateColumns: `repeat(${visibleAlgorithms.length}, minmax(0, 1fr))`,
            }}
          >
            {visibleAlgorithms.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSelectedAlgorithm(item);
                  reset();
                }}
                className={`w-full rounded-md px-3 py-2 font-mono text-xs transition ${
                  selectedAlgorithm === item
                    ? "border border-neon bg-neon/10 text-neon shadow-neon"
                    : "border border-transparent text-white hover:bg-white/[.03] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
        {isSortingCategory ? (
          <section className="mt-3 rounded-lg border border-white/10 bg-panel/80 p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={play}
                disabled={loading || playing || steps.length === 0}
                className="rounded-md border border-neon bg-neon/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-neon/20 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span className="flex items-center gap-1">
                  {" "}
                  <Play size={16} /> Animate flow
                </span>
              </button>
              <button
                onClick={pause}
                disabled={!playing}
                className="rounded-md border border-amber-400/40 px-3 py-2 text-sm text-zinc-300  hover:bg-amber-400/5 disabled:opacity-40"
              >
                <span className="flex items-center gap-1">
                  <Pause size={16} /> Pause{" "}
                </span>
              </button>
              <button
                onClick={reset}
                className="rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
              >
                <span className="flex items-center gap-1">
                  <RotateCcw size={16} /> Reset
                </span>
              </button>
              <button
                onClick={next || atEnd}
                className="rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 disabled:opacity-40 hover:bg-white/10 "
              >
                <span className="flex items-center gap-1">
                  <StepForward size={16} /> Step mode
                </span>
              </button>
              <button
                onClick={previous}
                disabled={loading || atStart}
                className="rounded-md border border-white/15 px-3 py-2 text-sm text-zinc-300 disabled:opacity-40 hover:bg-white/10"
              >
                <span className="flex items-center gap-1">
                  <StepBack size={16} /> Previous
                </span>
              </button>
              <label className="ml-auto flex min-w-48 flex-1 items-center gap-3 px-1 text-sm text-zinc-400 sm:max-w-xs">
                <span>Speed</span>
                <input
                  aria-label="Animation speed"
                  className="accent-neon"
                  type="range"
                  min="15"
                  max="100"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                />
                <span className="font-mono text-xs text-zinc-500">
                  {speed}%
                </span>
              </label>
              <div className="flex gap-2">
                <Metric label="Comparisons" value={current.comparisons} />
                <Metric label="Swaps" value={current.swaps} />
              </div>
            </div>
          </section>
        ) : (
          <ComingSoon algorithm={selectedAlgorithm} />
        )}
        <p className="mt-3 border-l-2 border-neon bg-[#0a1027] px-3 py-2.5 text-sm leading-relaxed text-zinc-300">
          {details.description}
        </p>
        {isArrayVisualizer && (loading || apiError) && (
          <p
            role="status"
            className={`mt-3 rounded-md border px-3 py-2 text-sm ${apiError ? "border-red-500/50 bg-red-500/10 text-red-200" : "border-neon/30 bg-neon/5 text-zinc-300"}`}
          >
            {apiError || `Loading ${selectedAlgorithm} steps from the API…`}
          </p>
        )}
        {isArrayVisualizer ? (
          <section
            id="visualizer"
            className="mt-8 rounded-xl border border-white/10 bg-panel/80 p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {selectedAlgorithm}
                </h2>
              </div>
              <p className="font-mono text-xs text-zinc-500">
                STEP {Math.min(frame + 1, steps.length)} / {steps.length}
              </p>
            </div>

            <ArrayVisualizer step={current} transitionMs={transitionMs} />
          </section>
        ) : (
          <section className="mt-8 rounded-xl border border-white/10 bg-panel/80 p-5 sm:p-7">
            <p className="font-mono text-xs uppercase tracking-[.2em] text-neon">
              {category}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              {selectedAlgorithm}
            </h2>
            <p className="mt-5 text-zinc-400">
              Coming soon — backend visualizer not implemented yet.
            </p>
          </section>
        )}
        <EventLogger steps={steps} frame={frame} />

        {isArrayVisualizer && !loading && !apiError && (
          <ComplexityPanel meta={meta} stats={stats} />
        )}
        <section
          id="concepts"
          className="mt-4 rounded-lg border border-white/10 bg-panel/80"
        >
          <button
            onClick={() => setShowConcepts((value) => !value)}
            aria-expanded={showConcepts}
            className="flex w-full items-center gap-2 px-4 py-3 text-left font-semibold text-zinc-100"
          >
            <span className="text-neon">
              {showConcepts ? <ChevronDown /> : <ChevronRight />}
            </span>{" "}
            Principles & Key Concepts
          </button>
          {showConcepts && (
            <div className="grid gap-4 border-t border-white/10 px-4 py-4 text-sm leading-relaxed text-zinc-400 sm:grid-cols-3">
              {details.concepts.map(([title, text]) => (
                <p key={title}>
                  <strong className="text-zinc-200">{title}</strong>
                  <br />
                  {text}
                </p>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
function ComingSoon({ algorithm }) {
  return (
    <section className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-amber-100">
      <strong>{algorithm}:</strong> Coming soon — backend visualizer not
      implemented yet.
    </section>
  );
}
