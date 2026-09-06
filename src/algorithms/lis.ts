import type { Algorithm, VizStep, Language } from "@/types";

export const lis: Algorithm = {
  metadata: {
    id: "lis",
    title: "Longest Increasing Subsequence",
    leetcode: 300,
    difficulty: "Medium",
    pattern: "lis",
    dataStructure: "Array",
    companies: ["Google", "Amazon", "Microsoft", "Apple"],
    tableType: "1D",
    description: "Given an integer array nums, return the length of the longest strictly increasing subsequence. A subsequence is a sequence that can be derived from the array by deleting some elements without changing the order of the remaining elements.",
    stateDefinition: {
      notation: "dp[i]",
      description: "The length of the longest increasing subsequence ending at index i.",
    },
    transition: {
      notation: "dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]",
      description: "For each element, look at all previous elements. If a previous element is smaller, we can extend its subsequence.",
    },
    baseCases: [
      { notation: "dp[i] = 1 for all i", description: "Every element alone is a subsequence of length 1." },
    ],
    complexity: {
      time: "O(n²)",
      space: "O(n)",
      optimizationNote: "A binary search approach can reduce time to O(n log n), but the DP approach is more intuitive.",
    },
    whyDP: [
      "The LIS ending at index i depends on the LIS ending at smaller indices j.",
      "Overlapping subproblems: the same dp[j] is checked for multiple i values.",
      "Optimal substructure: the best LIS ending at i extends the best LIS ending at some j < i where nums[j] < nums[i].",
      "This is the canonical LIS DP pattern with O(n²) time.",
    ],
    commonMistakes: [
      "Forgetting that the subsequence must be strictly increasing (nums[j] < nums[i], not ≤).",
      "Returning dp[n-1] instead of max(dp) — the LIS may not end at the last element.",
      "Not initializing dp[i] = 1 for all i (each element is a subsequence of length 1).",
    ],
    input: {
      type: "array",
      default: "10,9,2,5,3,7,101,18",
      placeholder: "Enter numbers (e.g., 10,9,2,5,3,7,101,18)",
      validate: (input) => {
        const parts = input.split(",").map((s) => parseInt(s.trim()));
        return parts.length >= 2 && parts.length <= 15 && parts.every((n) => !isNaN(n));
      },
      parse: (input) => input.split(",").map((s) => parseInt(s.trim())),
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const nums = input as number[];
    const n = nums.length;
    const steps: VizStep[] = [];
    const dp: number[] = new Array(n).fill(1);

    steps.push({
      type: "init",
      state: { i: 0 },
      dependencies: [],
      activeLine: 3,
      explanation: `Array: [${nums.join(", ")}]. We'll compute dp[i] = length of LIS ending at index i.`,
      tableSnapshot1D: [...dp],
    });

    // Base cases: all dp[i] = 1
    steps.push({
      type: "base_case",
      state: { i: 0 },
      dependencies: [],
      result: 1,
      activeLine: 4,
      explanation: "Base case: dp[i] = 1 for all i. Each element alone is a subsequence of length 1.",
      tableSnapshot1D: [...dp],
      highlightedCells: Array.from({ length: n }, (_, i) => ({ i })),
    });

    for (let i = 0; i < n; i++) {
      const candidates: { source: { i: number }; value: number; label: string }[] = [];

      for (let j = 0; j < i; j++) {
        if (nums[j] < nums[i]) {
          candidates.push({
            source: { i: j },
            value: dp[j] + 1,
            label: `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]} → dp[${j}] + 1 = ${dp[j]} + 1 = ${dp[j] + 1}`,
          });
        }
      }

      if (candidates.length > 0) {
        const best = candidates.reduce((a, b) => (b.value > a.value ? b : a));
        const deps = candidates.map((c) => c.source);

        steps.push({
          type: "compare",
          state: { i },
          dependencies: deps,
          candidates,
          activeLine: 7,
          explanation: `Index ${i} (value ${nums[i]}): Found ${candidates.length} smaller previous elements. Best extension: ${best.label}`,
          tableSnapshot1D: [...dp],
          highlightedCells: [...deps, { i }],
        });

        dp[i] = best.value;
        steps.push({
          type: "cell_update",
          state: { i },
          dependencies: deps,
          candidates,
          result: best.value,
          activeLine: 7,
          explanation: `dp[${i}] = ${best.value}. LIS ending at index ${i} has length ${best.value}.`,
          tableSnapshot1D: [...dp],
          highlightedCells: [{ i }],
        });
      } else if (i > 0) {
        steps.push({
          type: "cell_update",
          state: { i },
          dependencies: [],
          candidates: [{ source: { i }, value: 1, label: `No smaller element found, dp[${i}] = 1` }],
          result: 1,
          activeLine: 7,
          explanation: `dp[${i}] = 1. No previous element is smaller than ${nums[i]}, so the LIS is just this element.`,
          tableSnapshot1D: [...dp],
          highlightedCells: [{ i }],
        });
      }
    }

    const answer = Math.max(...dp);
    steps.push({
      type: "result",
      state: { i: dp.indexOf(answer) },
      dependencies: [],
      result: answer,
      activeLine: 9,
      explanation: `Final result: LIS length = ${answer}. The longest increasing subsequence ends at index ${dp.indexOf(answer)}.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: dp.indexOf(answer) }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def lengthOfLIS(nums):",
        "    n = len(nums)",
        "    dp = [1] * n",
        "    for i in range(n):",
        "        for j in range(i):",
        "            if nums[j] < nums[i]:",
        "                dp[i] = max(dp[i], dp[j] + 1)",
        "    return max(dp)",
      ];
    }
    if (language === "java") {
      return [
        "public int lengthOfLIS(int[] nums) {",
        "    int n = nums.length;",
        "    int[] dp = new int[n];",
        "    Arrays.fill(dp, 1);",
        "    for (int i = 0; i < n; i++) {",
        "        for (int j = 0; j < i; j++) {",
        "            if (nums[j] < nums[i])",
        "                dp[i] = Math.max(dp[i], dp[j] + 1);",
        "        }",
        "    }",
        "    int max = 0;",
        "    for (int x : dp) max = Math.max(max, x);",
        "    return max;",
        "}",
      ];
    }
    return [
      "int lengthOfLIS(vector<int>& nums) {",
      "    int n = nums.size();",
      "    vector<int> dp(n, 1);",
      "    for (int i = 0; i < n; i++) {",
      "        for (int j = 0; j < i; j++) {",
      "            if (nums[j] < nums[i])",
      "                dp[i] = max(dp[i], dp[j] + 1);",
      "        }",
      "    }",
      "    return *max_element(dp.begin(), dp.end());",
      "}",
    ];
  },
};
