import { BlogPost } from './types';

export const algorithmsWhenToUsePost: BlogPost = {
  slug: "algorithms-when-to-use",
  title: "When to Use Which Algorithm: Practical Guidance",
  excerpt: "A concise decision guide for choosing algorithms and data structures based on constraints like input size, memory, stability, and real-world trade-offs.",
  date: "January 15, 2026",
  author: "nemostorm",
  readTime: "10 min read",
  category: "Algorithms",
  content: `
# When to Use Which Algorithm: Practical Guidance

Picking the right algorithm is often more important than micro-optimizing code. This guide helps you make pragmatic choices based on common constraints: input size, time complexity, memory, stability, required guarantees, and code maintainability.

## 1. Sorting

- Small arrays (n < ~30): use insertion sort — simple and fast due to low overhead.
- General-purpose sorting in memory: use QuickSort (average O(n log n)) — fast, but not stable by default; use introsort (std::sort) which falls back to heap sort for worst-case.
- Stable sorts: use MergeSort (O(n log n), stable, needs O(n) extra memory) or Timsort (Python/Java uses it) for partially ordered data.
- Nearly-sorted data: insertion sort or Timsort excel.
- Very large keys or integer keys in a bounded range: consider Radix Sort or Counting Sort (linear time O(n + k)).

## 2. Searching and key-value lookup

- Random access by index: arrays / vectors.
- Fast membership and key lookup: hash tables (unordered_map) — average O(1), but worst-case O(n); needs good hash functions and memory.
- Ordered data and range queries: balanced binary search trees (std::map / TreeMap) — O(log n) and ordered iteration.
- Constant-memory tiny sets: sorted array + binary search for small, mostly-static sets.

## 3. Strings and text

- Substring search small patterns: Knuth-Morris-Pratt (KMP) or built-in library functions.
- Multiple pattern search: Aho–Corasick.
- Large-scale full-text search: inverted indexes (Elasticsearch), suffix arrays/trees for advanced queries.
- Prefix queries: Tries for fast prefix lookups at the cost of memory.

## 4. Graph algorithms

- Unweighted shortest path: BFS (O(V + E)).
- Weighted non-negative edges: Dijkstra with a binary heap (O((V+E) log V)). Use a Fibonacci heap only for theoretical gains; binary heap is practical.
- Negative edges allowed: Bellman-Ford (O(VE)).
- All pairs shortest paths for small graphs: Floyd–Warshall (O(n^3)). For sparse graphs, run Dijkstra from each node.
- Minimum spanning tree: Kruskal (use union-find) or Prim (priority queue) depending on representation.
- When you need heuristics (pathfinding on grids/maps): A* with an admissible heuristic.

## 5. Dynamic programming vs Greedy

- Greedy works when the problem has optimal substructure and the greedy choice property (e.g., activity selection, Huffman coding).
- Use dynamic programming when overlapping subproblems exist and greedy fails (e.g., knapsack 0/1, sequence alignment).

## 6. Divide and conquer

- Use when you can split the problem into independent subproblems (e.g., MergeSort, QuickSelect, Karatsuba multiplication). It often leads to O(n log n) or better depending on combination cost.

## 7. Streaming and online algorithms

- Use streaming algorithms (reservoir sampling, Count–Min sketch, hyperloglog) when data is too large to store and you need approximate answers with bounded memory.

## 8. Parallel & external memory

- For CPU-bound large tasks, use parallel algorithms (parallel sort, map-reduce patterns). Ensure data partitioning minimizes synchronization.
- For datasets that don't fit in RAM, use external-memory algorithms (external mergesort) or databases designed for out-of-core processing.

## 9. Heuristics & approximation

- When exact solutions are NP-hard (TSP, set cover), consider approximation algorithms or heuristics (greedy, simulated annealing, genetic algorithms) and validate quality on representative inputs.

## 10. Specialized data structures

- Priority needs: binary heap (std::priority_queue) for fastest insert/pop; pairing or Fibonacci heaps only when decrease-key dominates and you need theoretical bounds.
- Disjoint-set / Union-Find: use for connectivity, Kruskal's MST, and grouping problems.
- Segment trees / Fenwick (BIT): range queries and point updates; BIT is simpler and faster for prefix sums.
- Bitsets: compact set of booleans and very fast bitwise operations for dense boolean vectors.
- Bloom filters: probabilistic set membership with false positives but no false negatives — useful for cache existence checks.

## 11. Practical decision checklist

1. What's the input size? If tiny, prefer readability. If huge, prioritize O(n) or O(n log n).
2. Is memory constrained? Favor in-place or streaming algorithms.
3. Is stability required for sorting? Choose stable sorts.
4. Are inputs adversarial? Avoid algorithms with poor worst-case unless protected (use introsort).
5. Do you need exact or approximate answers? Pick appropriate heuristics or sketches.
6. Is concurrency/parallelism an option? Consider parallel algorithms or external processing.

## 12. Measure and profile

Always benchmark with real-ish data. Algorithmic complexity is a guide, but constants, locality, memory access patterns, and implementation quality matter.

## Conclusion

Algorithm selection balances theoretical complexity, input characteristics, and engineering trade-offs. Start with the simplest correct approach, profile, then iterate to a more specialized algorithm if needed.

[INTERACTIVE_CODE_EDITOR]
`
};

export default algorithmsWhenToUsePost;
