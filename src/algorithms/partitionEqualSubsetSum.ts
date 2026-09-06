import type { Algorithm, VizStep, Language } from "@/types";

export const partitionEqualSubsetSum: Algorithm = {
  metadata: {
    id: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    leetcode: 416,
    difficulty: "Medium",
    pattern: "knapsack",
    dataStructure: "2D Array",
    companies: ["Amazon", "Google", "Microsoft"],
    tableType: "2D",
    description: "Given an integer array nums, return true if you can partition the array into two subsets such that the sum of elements in both subsets is equal.",
    stateDefinition: {
      notation: "dp[i][s]",
      description: "Whether we can achieve sum s using a subset of the first i elements.",
    },
    transition: {
      notation: "dp[i][s] = dp[i-1][s] || dp[i-1][s - nums[i]]",
      description: "Either skip nums[i] (keep dp[i-1][s]) or take it (check dp[i-1][s - nums[i]]).",
    },
    baseCases: [
      { notation: "dp[0][0] = true", description: "Sum 0 is always achievable with no elements." },
      { notation: "dp[0][s] = false for s > 0", description: "No positive sum achievable with 0 elements." },
    ],
    complexity: {
      time: "O(n * target)",
      space: "O(n * target)",
      optimizedSpace: "O(target)",
      optimizationNote: "Since dp[i] only depends on dp[i-1], we can use a 1D boolean array, iterating sums in reverse.",
    },
    whyDP: [
      "The partition problem reduces to: can we find a subset with sum = totalSum/2?",
      "This is a 0/1 knapsack variant — each element is either in the subset or not.",
      "Overlapping subproblems: the same (index, sum) state is reached via different paths.",
      "Optimal substructure: if we can achieve sum s using items 0..i-1, we can achieve s using items 0..i.",
    ],
    commonMistakes: [
      "Not checking if totalSum is odd (if so, partition is impossible).",
      "Iterating sums forward in the space-optimized version (causes double-counting).",
      "Forgetting that the target is totalSum/2, not totalSum.",
    ],
    input: {
      type: "array",
      default: "1,5,11,5",
      placeholder: "Enter numbers (e.g., 1,5,11,5)",
      validate: (input) => {
        const parts = input.split(",").map((s) => parseInt(s.trim()));
        return parts.length >= 1 && parts.length <= 10 && parts.every((n) => !isNaN(n) && n > 0);
      },
      parse: (input) => input.split(",").map((s) => parseInt(s.trim())),
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const nums = input as number[];
    const n = nums.length;
    const total = nums.reduce((a, b) => a + b, 0);
    const steps: VizStep[] = [];

    if (total % 2 !== 0) {
      steps.push({
        type: "result",
        state: { i: 0 },
        dependencies: [],
        result: 0,
        activeLine: 2,
        explanation: `Total sum = ${total}, which is odd. Cannot partition into two equal subsets. Result: false.`,
      });
      return steps;
    }

    const target = total / 2;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(target + 1).fill(0));
    dp[0][0] = 1; // true

    steps.push({
      type: "init",
      state: { i: 0, j: 0 },
      dependencies: [],
      activeLine: 4,
      explanation: `Total sum = ${total}, target = ${total}/${2} = ${target}. We'll check if any subset sums to ${target}.`,
      tableSnapshot: dp.map((r) => [...r]),
    });

    steps.push({
      type: "base_case",
      state: { i: 0, j: 0 },
      dependencies: [],
      result: 1,
      activeLine: 5,
      explanation: "Base case: dp[0][0] = true. Sum 0 is always achievable with no elements.",
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: 0, j: 0 }],
    });

    for (let i = 1; i <= n; i++) {
      for (let s = 0; s <= target; s++) {
        const dep1 = { i: i - 1, j: s };
        const skipVal = dp[i - 1][s];
        const candidates: { source: { i: number; j: number }; value: number; label: string }[] = [
          { source: dep1, value: skipVal, label: `Skip nums[${i - 1}]: dp[${i - 1}][${s}] = ${skipVal ? "true" : "false"}` },
        ];

        let result = skipVal;
        if (nums[i - 1] <= s) {
          const dep2 = { i: i - 1, j: s - nums[i - 1] };
          const takeVal = dp[i - 1][s - nums[i - 1]];
          candidates.push({
            source: dep2,
            value: takeVal,
            label: `Take nums[${i - 1}]=${nums[i - 1]}: dp[${i - 1}][${s - nums[i - 1]}] = ${takeVal ? "true" : "false"}`,
          });
          result = skipVal || takeVal ? 1 : 0;
        }

        const deps = candidates.map((c) => c.source);

        if (s === 0) {
          dp[i][s] = 1;
          steps.push({
            type: "cell_update",
            state: { i, j: s },
            dependencies: [],
            candidates: [{ source: { i, j: s }, value: 1, label: `Sum 0 always achievable` }],
            result: 1,
            activeLine: 7,
            explanation: `dp[${i}][0] = true. Sum 0 is always achievable.`,
            tableSnapshot: dp.map((r) => [...r]),
            highlightedCells: [{ i, j: s }],
          });
          continue;
        }

        steps.push({
          type: "compare",
          state: { i, j: s },
          dependencies: deps,
          candidates,
          activeLine: 7,
          explanation: `dp[${i}][${s}]: Can we make sum ${s} using items 0..${i - 1}? ${nums[i - 1] <= s ? `Skip or take ${nums[i - 1]}.` : `Item too large, must skip.`}`,
          tableSnapshot: dp.map((r) => [...r]),
          highlightedCells: [...deps, { i, j: s }],
        });

        dp[i][s] = result;
        steps.push({
          type: "cell_update",
          state: { i, j: s },
          dependencies: deps,
          candidates,
          result,
          activeLine: 7,
          explanation: `dp[${i}][${s}] = ${result ? "true" : "false"}. ${result ? "This sum is achievable." : "This sum is not achievable."}`,
          tableSnapshot: dp.map((r) => [...r]),
          highlightedCells: [{ i, j: s }],
        });
      }
    }

    steps.push({
      type: "result",
      state: { i: n, j: target },
      dependencies: [],
      result: dp[n][target],
      activeLine: 10,
      explanation: `Final result: ${dp[n][target] ? "true — the array can be partitioned into two equal-sum subsets." : "false — no such partition exists."}`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: n, j: target }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def canPartition(nums):",
        "    total = sum(nums)",
        "    if total % 2 != 0: return False",
        "    target = total // 2",
        "    dp = [False] * (target + 1)",
        "    dp[0] = True",
        "    for num in nums:",
        "        for s in range(target, num - 1, -1):",
        "            dp[s] = dp[s] or dp[s - num]",
        "    return dp[target]",
      ];
    }
    if (language === "java") {
      return [
        "public boolean canPartition(int[] nums) {",
        "    int total = 0;",
        "    for (int n : nums) total += n;",
        "    if (total % 2 != 0) return false;",
        "    int target = total / 2;",
        "    boolean[] dp = new boolean[target + 1];",
        "    dp[0] = true;",
        "    for (int num : nums) {",
        "        for (int s = target; s >= num; s--) {",
        "            dp[s] = dp[s] || dp[s - num];",
        "        }",
        "    }",
        "    return dp[target];",
        "}",
      ];
    }
    return [
      "bool canPartition(vector<int>& nums) {",
      "    int total = accumulate(nums.begin(), nums.end(), 0);",
      "    if (total % 2 != 0) return false;",
      "    int target = total / 2;",
      "    vector<bool> dp(target + 1, false);",
      "    dp[0] = true;",
      "    for (int num : nums) {",
      "        for (int s = target; s >= num; s--) {",
      "            dp[s] = dp[s] || dp[s - num];",
      "        }",
      "    }",
      "    return dp[target];",
      "}",
    ];
  },
};
