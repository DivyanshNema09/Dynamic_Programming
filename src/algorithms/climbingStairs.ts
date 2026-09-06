import type { Algorithm, VizStep, Language } from "@/types";

export const climbingStairs: Algorithm = {
  metadata: {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    leetcode: 70,
    difficulty: "Easy",
    pattern: "1d-dp",
    dataStructure: "Array",
    companies: ["Amazon", "Google", "Microsoft"],
    tableType: "1D",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    stateDefinition: {
      notation: "dp[i]",
      description: "The number of distinct ways to reach step i.",
    },
    transition: {
      notation: "dp[i] = dp[i-1] + dp[i-2]",
      description: "To reach step i, you either came from step i-1 (1 step) or step i-2 (2 steps).",
    },
    baseCases: [
      { notation: "dp[0] = 1", description: "There is 1 way to be at the ground (step 0): do nothing." },
      { notation: "dp[1] = 1", description: "There is 1 way to reach step 1: take one step." },
    ],
    complexity: {
      time: "O(n)",
      space: "O(n)",
      optimizedSpace: "O(1)",
      optimizationNote: "Only two previous values are needed, so we can use two variables.",
    },
    whyDP: [
      "The number of ways to reach step i depends on the number of ways to reach steps i-1 and i-2.",
      "Subproblems overlap: the same step counts are reused across different paths.",
      "Optimal substructure holds: the total ways to step i is the sum of ways to its predecessors.",
    ],
    commonMistakes: [
      "Setting dp[0] = 0 instead of dp[0] = 1 (there's one way to be at the start).",
      "Forgetting that you can take 2 steps at once, not just 1.",
      "Off-by-one: the answer is dp[n], not dp[n-1].",
    ],
    input: {
      type: "array",
      default: "5",
      placeholder: "Enter n (e.g., 5)",
      validate: (input) => {
        const n = parseInt(input.trim());
        return !isNaN(n) && n >= 1 && n <= 30;
      },
      parse: (input) => parseInt(input.trim()),
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const n = input as number;
    const steps: VizStep[] = [];
    const dp: number[] = new Array(n + 1).fill(0);

    steps.push({
      type: "init",
      state: { i: 0 },
      dependencies: [],
      activeLine: 3,
      explanation: `We want to find the number of ways to climb ${n} stairs. We'll build a DP table of size ${n + 1}.`,
      tableSnapshot1D: [...dp],
    });

    dp[0] = 1;
    steps.push({
      type: "base_case",
      state: { i: 0 },
      dependencies: [],
      result: 1,
      activeLine: 4,
      explanation: "Base case: dp[0] = 1. There is 1 way to be at step 0 (the ground).",
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 0 }],
    });

    dp[1] = 1;
    steps.push({
      type: "base_case",
      state: { i: 1 },
      dependencies: [],
      result: 1,
      activeLine: 5,
      explanation: "Base case: dp[1] = 1. There is 1 way to reach step 1 (take one step).",
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 1 }],
    });

    for (let i = 2; i <= n; i++) {
      const dep1 = { i: i - 1 };
      const dep2 = { i: i - 2 };
      const val1 = dp[i - 1];
      const val2 = dp[i - 2];
      const result = val1 + val2;

      steps.push({
        type: "compare",
        state: { i },
        dependencies: [dep1, dep2],
        candidates: [
          { source: dep1, value: val1, label: `dp[${i - 1}]` },
          { source: dep2, value: val2, label: `dp[${i - 2}]` },
        ],
        activeLine: 7,
        explanation: `Computing dp[${i}]: From step ${i - 1} (${val1} ways) or step ${i - 2} (${val2} ways).`,
        tableSnapshot1D: [...dp],
        highlightedCells: [dep1, dep2, { i }],
      });

      dp[i] = result;
      steps.push({
        type: "cell_update",
        state: { i },
        dependencies: [dep1, dep2],
        candidates: [
          { source: dep1, value: val1, label: `dp[${i - 1}]` },
          { source: dep2, value: val2, label: `dp[${i - 2}]` },
        ],
        result,
        activeLine: 7,
        explanation: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${val1} + ${val2} = ${result}.`,
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i }],
      });
    }

    steps.push({
      type: "result",
      state: { i: n },
      dependencies: [],
      result: dp[n],
      activeLine: 9,
      explanation: `Final result: There are ${dp[n]} distinct ways to climb ${n} stairs.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: n }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def climbStairs(n):",
        "    if n <= 2: return n",
        "    dp = [0] * (n + 1)",
        "    dp[0] = 1",
        "    dp[1] = 1",
        "    for i in range(2, n + 1):",
        "        dp[i] = dp[i-1] + dp[i-2]",
        "    return dp[n]",
      ];
    }
    if (language === "java") {
      return [
        "public int climbStairs(int n) {",
        "    if (n <= 2) return n;",
        "    int[] dp = new int[n + 1];",
        "    dp[0] = 1;",
        "    dp[1] = 1;",
        "    for (int i = 2; i <= n; i++) {",
        "        dp[i] = dp[i-1] + dp[i-2];",
        "    }",
        "    return dp[n];",
        "}",
      ];
    }
    return [
      "int climbStairs(int n) {",
      "    if (n <= 2) return n;",
      "    vector<int> dp(n + 1, 0);",
      "    dp[0] = 1;",
      "    dp[1] = 1;",
      "    for (int i = 2; i <= n; i++) {",
      "        dp[i] = dp[i-1] + dp[i-2];",
      "    }",
      "    return dp[n];",
      "}",
    ];
  },
};
