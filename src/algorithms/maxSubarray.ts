import type { Algorithm, VizStep, Language } from "@/types";

export const maxSubarray: Algorithm = {
  metadata: {
    id: "max-subarray",
    title: "Maximum Subarray",
    leetcode: 53,
    difficulty: "Easy",
    pattern: "1d-dp",
    dataStructure: "Array",
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    tableType: "1D",
    description: "Given an integer array nums, find the subarray with the largest sum and return its sum. A subarray is a contiguous part of the array.",
    stateDefinition: {
      notation: "dp[i]",
      description: "The maximum sum of a subarray ending at index i.",
    },
    transition: {
      notation: "dp[i] = max(nums[i], dp[i-1] + nums[i])",
      description: "Either start fresh at nums[i], or extend the best subarray ending at i-1 by including nums[i].",
    },
    baseCases: [
      { notation: "dp[0] = nums[0]", description: "The best subarray ending at index 0 is just nums[0]." },
    ],
    complexity: {
      time: "O(n)",
      space: "O(n)",
      optimizedSpace: "O(1)",
      optimizationNote: "Only dp[i-1] is needed, so a single variable suffices (Kadane's algorithm).",
    },
    whyDP: [
      "The maximum subarray ending at i depends on whether extending the previous subarray is better than starting fresh.",
      "Overlapping subproblems: dp[i-1] is reused when computing dp[i].",
      "Optimal substructure: the best subarray ending at i either extends the best ending at i-1 or starts anew.",
      "This is Kadane's algorithm — the canonical 1D DP for maximum subarray.",
    ],
    commonMistakes: [
      "Forgetting the option to start fresh (max(nums[i], dp[i-1] + nums[i]), not just dp[i-1] + nums[i]).",
      "Returning dp[n-1] instead of max(dp) — the best subarray may not end at the last element.",
      "Not handling all-negative arrays (the answer is the largest single element).",
    ],
    input: {
      type: "array",
      default: "-2,1,-3,4,-1,2,1,-5,4",
      placeholder: "Enter numbers (e.g., -2,1,-3,4,-1,2,1,-5,4)",
      validate: (input) => {
        const parts = input.split(",").map((s) => parseInt(s.trim()));
        return parts.length >= 1 && parts.length <= 20 && parts.every((n) => !isNaN(n));
      },
      parse: (input) => input.split(",").map((s) => parseInt(s.trim())),
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const nums = input as number[];
    const n = nums.length;
    const steps: VizStep[] = [];
    const dp: number[] = new Array(n).fill(0);

    steps.push({
      type: "init",
      state: { i: 0 },
      dependencies: [],
      activeLine: 3,
      explanation: `Array: [${nums.join(", ")}]. We'll compute dp[i] = max subarray sum ending at index i.`,
      tableSnapshot1D: [...dp],
    });

    dp[0] = nums[0];
    steps.push({
      type: "base_case",
      state: { i: 0 },
      dependencies: [],
      result: nums[0],
      activeLine: 4,
      explanation: `Base case: dp[0] = nums[0] = ${nums[0]}. The only subarray ending at index 0 is [${nums[0]}].`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 0 }],
    });

    for (let i = 1; i < n; i++) {
      const dep = { i: i - 1 };
      const val1 = nums[i];
      const val2 = dp[i - 1] + nums[i];
      const result = Math.max(val1, val2);

      steps.push({
        type: "compare",
        state: { i },
        dependencies: [dep],
        candidates: [
          { source: { i }, value: val1, label: `Start fresh: nums[${i}] = ${val1}` },
          { source: dep, value: val2, label: `Extend: dp[${i - 1}] + nums[${i}] = ${dp[i - 1]} + ${val1} = ${val2}` },
        ],
        activeLine: 6,
        explanation: `Index ${i}: Start fresh (${val1}) or extend previous (${dp[i - 1]} + ${val1} = ${val2}).`,
        tableSnapshot1D: [...dp],
        highlightedCells: [dep, { i }],
      });

      dp[i] = result;
      steps.push({
        type: "cell_update",
        state: { i },
        dependencies: [dep],
        candidates: [
          { source: { i }, value: val1, label: `Fresh` },
          { source: dep, value: val2, label: `Extend` },
        ],
        result,
        activeLine: 6,
        explanation: `dp[${i}] = max(${val1}, ${val2}) = ${result}. ${result === val1 ? "Starting fresh is better." : "Extending is better."}`,
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i }],
      });
    }

    const answer = Math.max(...dp);
    steps.push({
      type: "result",
      state: { i: dp.indexOf(answer) },
      dependencies: [],
      result: answer,
      activeLine: 8,
      explanation: `Final result: Maximum subarray sum = ${answer}. Found at index ${dp.indexOf(answer)}.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: dp.indexOf(answer) }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def maxSubArray(nums):",
        "    n = len(nums)",
        "    dp = [0] * n",
        "    dp[0] = nums[0]",
        "    for i in range(1, n):",
        "        dp[i] = max(nums[i], dp[i-1] + nums[i])",
        "    return max(dp)",
      ];
    }
    if (language === "java") {
      return [
        "public int maxSubArray(int[] nums) {",
        "    int n = nums.length;",
        "    int[] dp = new int[n];",
        "    dp[0] = nums[0];",
        "    for (int i = 1; i < n; i++) {",
        "        dp[i] = Math.max(nums[i], dp[i-1] + nums[i]);",
        "    }",
        "    int max = dp[0];",
        "    for (int x : dp) max = Math.max(max, x);",
        "    return max;",
        "}",
      ];
    }
    return [
      "int maxSubArray(vector<int>& nums) {",
      "    int n = nums.size();",
      "    vector<int> dp(n, 0);",
      "    dp[0] = nums[0];",
      "    for (int i = 1; i < n; i++) {",
      "        dp[i] = max(nums[i], dp[i-1] + nums[i]);",
      "    }",
      "    return *max_element(dp.begin(), dp.end());",
      "}",
    ];
  },
};
