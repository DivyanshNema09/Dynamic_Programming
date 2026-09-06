import type { Algorithm, VizStep, Language } from "@/types";

export const targetSum: Algorithm = {
  metadata: {
    id: "target-sum",
    title: "Target Sum",
    leetcode: 494,
    difficulty: "Medium",
    pattern: "knapsack",
    dataStructure: "2D Array",
    companies: ["Amazon", "Google", "Microsoft"],
    tableType: "2D",
    description: "You are given an integer array nums and an integer target. You want to build an expression by adding '+' or '-' before each integer and concatenating them. Return the number of different expressions that evaluate to target.",
    stateDefinition: {
      notation: "dp[i][s]",
      description: "The number of ways to assign signs to the first i elements to achieve sum s.",
    },
    transition: {
      notation: "dp[i][s] = dp[i-1][s - nums[i]] + dp[i-1][s + nums[i]]",
      description: "For each element, either add it (+nums[i]) or subtract it (-nums[i]). Sum both possibilities.",
    },
    baseCases: [
      { notation: "dp[0][0] = 1", description: "One way to achieve sum 0 with 0 elements." },
    ],
    complexity: {
      time: "O(n * sumRange)",
      space: "O(n * sumRange)",
      optimizedSpace: "O(sumRange)",
      optimizationNote: "Since dp[i] only depends on dp[i-1], we can use a 1D array with an offset.",
    },
    whyDP: [
      "The number of ways to achieve sum s with i elements depends on ways to achieve s±nums[i] with i-1 elements.",
      "Overlapping subproblems: the same (index, sum) state is reached from different sign assignments.",
      "This is a knapsack variant — each element contributes positively or negatively.",
      "Can be reduced to a subset-sum problem: find subsets with sum = (totalSum + target) / 2.",
    ],
    commonMistakes: [
      "Not handling negative sums (need an offset for array indexing).",
      "Forgetting that (totalSum + target) must be even and non-negative.",
      "Using multiplication instead of addition for combining choices.",
    ],
    input: {
      type: "array",
      default: "nums=[1,1,1,1,1], target=3",
      placeholder: "nums=[1,1,1,1,1], target=3",
      validate: (input) => {
        const match = input.match(/nums=\[([\d,\s]+)\],\s*target=(-?\d+)/);
        if (!match) return false;
        const nums = match[1].split(",").map((s) => parseInt(s.trim()));
        const target = parseInt(match[2].trim());
        return nums.length >= 1 && nums.length <= 8 && !isNaN(target);
      },
      parse: (input) => {
        const match = input.match(/nums=\[([\d,\s]+)\],\s*target=(-?\d+)/);
        if (!match) return { nums: [], target: 0 };
        const nums = match[1].split(",").map((s) => parseInt(s.trim()));
        const target = parseInt(match[2].trim());
        return { nums, target };
      },
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const { nums, target } = input as { nums: number[]; target: number };
    const n = nums.length;
    const total = nums.reduce((a, b) => a + b, 0);
    const maxSum = total;
    const offset = maxSum;
    const cols = 2 * maxSum + 1;
    const steps: VizStep[] = [];
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(cols).fill(0));

    steps.push({
      type: "init",
      state: { i: 0, j: offset },
      dependencies: [],
      activeLine: 4,
      explanation: `nums = [${nums.join(", ")}], target = ${target}. Sum range: [-${maxSum}, +${maxSum}]. We'll count ways to reach each sum.`,
      tableSnapshot: dp.map((r) => [...r]),
    });

    dp[0][offset] = 1;
    steps.push({
      type: "base_case",
      state: { i: 0, j: offset },
      dependencies: [],
      result: 1,
      activeLine: 5,
      explanation: "Base case: dp[0][0] = 1 (with offset). One way to achieve sum 0 with 0 elements.",
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: 0, j: offset }],
    });

    for (let i = 1; i <= n; i++) {
      for (let s = -maxSum; s <= maxSum; s++) {
        const colIdx = s + offset;
        let ways = 0;
        const candidates: { source: { i: number; j: number }; value: number; label: string }[] = [];

        if (s - nums[i - 1] >= -maxSum) {
          const prevCol = (s - nums[i - 1]) + offset;
          const val = dp[i - 1][prevCol];
          candidates.push({
            source: { i: i - 1, j: prevCol },
            value: val,
            label: `+${nums[i - 1]}: dp[${i - 1}][${s - nums[i - 1]}] = ${val}`,
          });
          ways += val;
        }

        if (s + nums[i - 1] <= maxSum) {
          const prevCol = (s + nums[i - 1]) + offset;
          const val = dp[i - 1][prevCol];
          candidates.push({
            source: { i: i - 1, j: prevCol },
            value: val,
            label: `-${nums[i - 1]}: dp[${i - 1}][${s + nums[i - 1]}] = ${val}`,
          });
          ways += val;
        }

        if (candidates.length === 0) continue;
        if (candidates.every((c) => c.value === 0)) continue;

        const deps = candidates.map((c) => c.source);

        steps.push({
          type: "compare",
          state: { i, j: colIdx },
          dependencies: deps,
          candidates,
          activeLine: 7,
          explanation: `dp[${i}][${s}]: Element ${nums[i - 1]}. Add it (sum ${s - nums[i - 1]}) or subtract it (sum ${s + nums[i - 1]}). Total ways = ${ways}.`,
          tableSnapshot: dp.map((r) => [...r]),
          highlightedCells: [...deps, { i, j: colIdx }],
        });

        dp[i][colIdx] = ways;
        if (ways > 0) {
          steps.push({
            type: "cell_update",
            state: { i, j: colIdx },
            dependencies: deps,
            candidates,
            result: ways,
            activeLine: 7,
            explanation: `dp[${i}][${s}] = ${ways}. ${ways === 0 ? "No ways to reach this sum." : `${ways} way(s) to reach sum ${s} using first ${i} elements.`}`,
            tableSnapshot: dp.map((r) => [...r]),
            highlightedCells: [{ i, j: colIdx }],
          });
        }
      }
    }

    const answer = dp[n][target + offset] || 0;
    steps.push({
      type: "result",
      state: { i: n, j: target + offset },
      dependencies: [],
      result: answer,
      activeLine: 10,
      explanation: `Final result: ${answer} way(s) to reach target ${target}.`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: n, j: target + offset }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def findTargetSumWays(nums, target):",
        "    total = sum(nums)",
        "    if abs(target) > total: return 0",
        "    offset = total",
        "    dp = [0] * (2 * total + 1)",
        "    dp[offset] = 1",
        "    for num in nums:",
        "        next_dp = [0] * (2 * total + 1)",
        "        for s in range(2 * total + 1):",
        "            if dp[s]:",
        "                next_dp[s + num] += dp[s]",
        "                next_dp[s - num] += dp[s]",
        "        dp = next_dp",
        "    return dp[target + offset]",
      ];
    }
    if (language === "java") {
      return [
        "public int findTargetSumWays(int[] nums, int target) {",
        "    int total = 0;",
        "    for (int n : nums) total += n;",
        "    if (Math.abs(target) > total) return 0;",
        "    int offset = total;",
        "    int[] dp = new int[2 * total + 1];",
        "    dp[offset] = 1;",
        "    for (int num : nums) {",
        "        int[] next = new int[2 * total + 1];",
        "        for (int s = 0; s < 2 * total + 1; s++) {",
        "            if (dp[s] != 0) {",
        "                next[s + num] += dp[s];",
        "                next[s - num] += dp[s];",
        "            }",
        "        }",
        "        dp = next;",
        "    }",
        "    return dp[target + offset];",
        "}",
      ];
    }
    return [
      "int findTargetSumWays(vector<int>& nums, int target) {",
      "    int total = accumulate(nums.begin(), nums.end(), 0);",
      "    if (abs(target) > total) return 0;",
      "    int offset = total;",
      "    vector<int> dp(2 * total + 1, 0);",
      "    dp[offset] = 1;",
      "    for (int num : nums) {",
      "        vector<int> next(2 * total + 1, 0);",
      "        for (int s = 0; s < 2 * total + 1; s++) {",
      "            if (dp[s]) {",
      "                next[s + num] += dp[s];",
      "                next[s - num] += dp[s];",
      "            }",
      "        }",
      "        dp = next;",
      "    }",
      "    return dp[target + offset];",
      "}",
    ];
  },
};
