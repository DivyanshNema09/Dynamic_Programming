import type { Algorithm, ProblemRecord } from "@/types";
import { fibonacci } from "@/algorithms/fibonacci";
import { climbingStairs } from "@/algorithms/climbingStairs";
import { houseRobber } from "@/algorithms/houseRobber";
import { minCostClimbingStairs } from "@/algorithms/minCostClimbingStairs";
import { coinChange } from "@/algorithms/coinChange";
import { knapsack01 } from "@/algorithms/knapsack01";
import { lcs } from "@/algorithms/lcs";
import { editDistance } from "@/algorithms/editDistance";
import { lis } from "@/algorithms/lis";
import { uniquePaths } from "@/algorithms/uniquePaths";
import { minPathSum } from "@/algorithms/minPathSum";
import { maxSubarray } from "@/algorithms/maxSubarray";
import { partitionEqualSubsetSum } from "@/algorithms/partitionEqualSubsetSum";
import { targetSum } from "@/algorithms/targetSum";
import { decodeWays } from "@/algorithms/decodeWays";
import { longestPalindromicSubstring } from "@/algorithms/longestPalindromicSubstring";
import { bestTimeToBuyAndSellStock } from "@/algorithms/bestTimeToBuyAndSellStock";

export const problems: ProblemRecord[] = [
  fibonacci,
  climbingStairs,
  houseRobber,
  minCostClimbingStairs,
  coinChange,
  knapsack01,
  lcs,
  editDistance,
  lis,
  uniquePaths,
  minPathSum,
  maxSubarray,
  partitionEqualSubsetSum,
  targetSum,
  decodeWays,
  longestPalindromicSubstring,
  bestTimeToBuyAndSellStock,
].map((alg) => ({ metadata: alg.metadata, algorithm: alg }));

export const problemsById: Record<string, ProblemRecord> = Object.fromEntries(
  problems.map((p) => [p.metadata.id, p])
);

export function getProblem(id: string): ProblemRecord | undefined {
  return problemsById[id];
}

export function getAlgorithms(): Algorithm[] {
  return problems.map((p) => p.algorithm);
}
