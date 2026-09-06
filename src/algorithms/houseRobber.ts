import type { Algorithm, VizStep, Language } from "@/types";

export const houseRobber: Algorithm = {
  metadata: {
    id: "house-robber",
    title: "House Robber",
    leetcode: 198,
    difficulty: "Easy",
    pattern: "1d-dp",
    dataStructure: "Array",
    companies: ["Google", "Amazon", "Microsoft"],
    tableType: "1D",
    description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money. Adjacent houses have security systems connected. Determine the maximum amount you can rob without alerting the police.",
    stateDefinition: {
      notation: "dp[i]",
      description: "The maximum amount of money that can be robbed from houses 0 through i.",
    },
    transition: {
      notation: "dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
      description: "Either skip house i (take dp[i-1]) or rob house i (add nums[i] to dp[i-2]).",
    },
    baseCases: [
      { notation: "dp[0] = nums[0]", description: "Only one house: rob it." },
      { notation: "dp[1] = max(nums[0], nums[1])", description: "Two houses: rob the richer one." },
    ],
    complexity: {
      time: "O(n)",
      space: "O(n)",
      optimizedSpace: "O(1)",
      optimizationNote: "Only dp[i-1] and dp[i-2] are needed, so two variables suffice.",
    },
    whyDP: [
      "The decision at house i depends on decisions at houses i-1 and i-2.",
      "Overlapping subproblems: the optimal loot up to house i is reused for house i+1.",
      "Optimal substructure: the best choice at each house builds on the best choices before it.",
    ],
    commonMistakes: [
      "Forgetting that you cannot rob two adjacent houses.",
      "Using dp[i-1] + nums[i] instead of dp[i-2] + nums[i] (adjacent constraint).",
      "Incorrect base cases when the array has fewer than 2 elements.",
    ],
    input: {
      type: "array",
      default: "2,7,9,3,1",
      placeholder: "Enter house values (e.g., 2,7,9,3,1)",
      validate: (input) => {
        const parts = input.split(",").map((s) => parseInt(s.trim()));
        return parts.length >= 1 && parts.every((n) => !isNaN(n) && n >= 0 && n <= 1000);
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
      explanation: `We have ${n} houses with values [${nums.join(", ")}]. We want the maximum loot without robbing adjacent houses.`,
      tableSnapshot1D: [...dp],
    });

    dp[0] = nums[0];
    steps.push({
      type: "base_case",
      state: { i: 0 },
      dependencies: [],
      result: nums[0],
      activeLine: 4,
      explanation: `Base case: dp[0] = nums[0] = ${nums[0]}. With one house, rob it.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 0 }],
    });

    if (n >= 2) {
      dp[1] = Math.max(nums[0], nums[1]);
      steps.push({
        type: "base_case",
        state: { i: 1 },
        dependencies: [],
        result: dp[1],
        activeLine: 5,
        explanation: `Base case: dp[1] = max(nums[0], nums[1]) = max(${nums[0]}, ${nums[1]}) = ${dp[1]}. Rob the richer house.`,
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i: 1 }],
      });
    }

    for (let i = 2; i < n; i++) {
      const dep1 = { i: i - 1 };
      const dep2 = { i: i - 2 };
      const skipVal = dp[i - 1];
      const robVal = dp[i - 2] + nums[i];
      const result = Math.max(skipVal, robVal);

      steps.push({
        type: "compare",
        state: { i },
        dependencies: [dep1, dep2],
        candidates: [
          { source: dep1, value: skipVal, label: `dp[${i - 1}] (skip house ${i})` },
          { source: dep2, value: robVal, label: `dp[${i - 2}] + nums[${i}] = ${dp[i - 2]} + ${nums[i]} (rob house ${i})` },
        ],
        activeLine: 7,
        explanation: `House ${i} has ${nums[i]}. Skip it: dp[${i - 1}] = ${skipVal}. Rob it: dp[${i - 2}] + nums[${i}] = ${robVal}.`,
        tableSnapshot1D: [...dp],
        highlightedCells: [dep1, dep2, { i }],
      });

      dp[i] = result;
      steps.push({
        type: "cell_update",
        state: { i },
        dependencies: [dep1, dep2],
        candidates: [
          { source: dep1, value: skipVal, label: `Skip` },
          { source: dep2, value: robVal, label: `Rob` },
        ],
        result,
        activeLine: 7,
        explanation: `dp[${i}] = max(${skipVal}, ${robVal}) = ${result}. ${result === robVal ? "Robbing house " + i + " is better." : "Skipping house " + i + " is better."}`,
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i }],
      });
    }

    steps.push({
      type: "result",
      state: { i: n - 1 },
      dependencies: [],
      result: dp[n - 1],
      activeLine: 9,
      explanation: `Final result: Maximum loot = ${dp[n - 1]}.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: n - 1 }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def rob(nums):",
        "    n = len(nums)",
        "    if n == 1: return nums[0]",
        "    dp = [0] * n",
        "    dp[0] = nums[0]",
        "    dp[1] = max(nums[0], nums[1])",
        "    for i in range(2, n):",
        "        dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
        "    return dp[n-1]",
      ];
    }
    if (language === "java") {
      return [
        "public int rob(int[] nums) {",
        "    int n = nums.length;",
        "    if (n == 1) return nums[0];",
        "    int[] dp = new int[n];",
        "    dp[0] = nums[0];",
        "    dp[1] = Math.max(nums[0], nums[1]);",
        "    for (int i = 2; i < n; i++) {",
        "        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);",
        "    }",
        "    return dp[n-1];",
        "}",
      ];
    }
    return [
      "int rob(vector<int>& nums) {",
      "    int n = nums.size();",
      "    if (n == 1) return nums[0];",
      "    vector<int> dp(n, 0);",
      "    dp[0] = nums[0];",
      "    dp[1] = max(nums[0], nums[1]);",
      "    for (int i = 2; i < n; i++) {",
      "        dp[i] = max(dp[i-1], dp[i-2] + nums[i]);",
      "    }",
      "    return dp[n-1];",
      "}",
    ];
  },
};
