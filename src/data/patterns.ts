export interface PatternInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  problems: string[];
  order: number;
}

export const patterns: PatternInfo[] = [
  {
    id: "1d-dp",
    name: "1D DP",
    icon: "TrendingUp",
    description: "Problems where the state depends on a single index. The foundation of all DP.",
    problems: ["fibonacci", "climbing-stairs", "house-robber", "min-cost-climbing-stairs", "decode-ways", "max-subarray"],
    order: 1,
  },
  {
    id: "lis",
    name: "LIS / Increasing Sequence",
    icon: "BarChart3",
    description: "Find the longest increasing subsequence using nested-loop DP with comparison-based transitions.",
    problems: ["lis"],
    order: 2,
  },
  {
    id: "grid-2d-dp",
    name: "Grid / 2D DP",
    icon: "Grid3x3",
    description: "Path and region problems on a 2D grid where each cell depends on its neighbors.",
    problems: ["unique-paths", "min-path-sum"],
    order: 3,
  },
  {
    id: "knapsack",
    name: "0/1 Knapsack",
    icon: "Package",
    description: "Take-or-leave decisions with a capacity constraint. The core of subset-sum problems.",
    problems: ["knapsack-01", "partition-equal-subset-sum", "target-sum"],
    order: 4,
  },
  {
    id: "unbounded-knapsack",
    name: "Unbounded Knapsack",
    icon: "Coins",
    description: "Items can be reused unlimited times. Coin change is the canonical example.",
    problems: ["coin-change"],
    order: 5,
  },
  {
    id: "subsequence-dp",
    name: "Subsequence DP",
    icon: "AlignHorizontalJustifyCenter",
    description: "Compare two sequences using a 2D table. Match → diagonal, mismatch → max of top/left.",
    problems: ["lcs"],
    order: 6,
  },
  {
    id: "string-dp",
    name: "String DP",
    icon: "Type",
    description: "Edit distance, palindromes, and other string transformation problems.",
    problems: ["edit-distance", "decode-ways", "longest-palindromic-substring"],
    order: 7,
  },
  {
    id: "state-machine-dp",
    name: "State Machine DP",
    icon: "GitBranch",
    description: "Model each day as a finite state machine with transitions between hold/cash states.",
    problems: ["best-time-to-buy-and-sell-stock"],
    order: 8,
  },
];

export const patternsById: Record<string, PatternInfo> = Object.fromEntries(
  patterns.map((p) => [p.id, p])
);
