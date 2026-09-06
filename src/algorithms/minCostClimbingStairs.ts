import type { Algorithm, VizStep, Language } from "@/types";

export const minCostClimbingStairs: Algorithm = {
  metadata: {
    id: "min-cost-climbing-stairs",
    title: "Min Cost Climbing Stairs",
    leetcode: 746,
    difficulty: "Easy",
    pattern: "1d-dp",
    dataStructure: "Array",
    companies: ["Amazon", "Google"],
    tableType: "1D",
    description: "You are given an integer array cost where cost[i] is the cost of i-th step on a staircase. Once you pay the cost, you can climb one or two steps. You can start from step 0 or step 1. Find the minimum cost to reach the top.",
    stateDefinition: {
      notation: "dp[i]",
      description: "The minimum cost to reach step i.",
    },
    transition: {
      notation: "dp[i] = cost[i] + min(dp[i-1], dp[i-2])",
      description: "To reach step i, pay cost[i] and come from the cheaper of step i-1 or step i-2.",
    },
    baseCases: [
      { notation: "dp[0] = cost[0]", description: "Cost to stand on step 0." },
      { notation: "dp[1] = cost[1]", description: "Cost to stand on step 1." },
    ],
    complexity: {
      time: "O(n)",
      space: "O(n)",
      optimizedSpace: "O(1)",
      optimizationNote: "Only two previous values are needed, so two variables suffice.",
    },
    whyDP: [
      "The minimum cost to reach step i depends on the costs to reach steps i-1 and i-2.",
      "Subproblems overlap: the cost to reach step i is reused when computing step i+1.",
      "Optimal substructure: the cheapest path to step i uses the cheapest path to a previous step.",
    ],
    commonMistakes: [
      "Confusing the cost to reach a step with the cost of the step itself.",
      "Forgetting that you can start from step 0 or step 1.",
      "Returning dp[n-1] instead of min(dp[n-1], dp[n-2]) — the top is beyond the last step.",
    ],
    input: {
      type: "array",
      default: "10,15,20",
      placeholder: "Enter costs (e.g., 10,15,20)",
      validate: (input) => {
        const parts = input.split(",").map((s) => parseInt(s.trim()));
        return parts.length >= 2 && parts.every((n) => !isNaN(n) && n >= 0 && n <= 1000);
      },
      parse: (input) => input.split(",").map((s) => parseInt(s.trim())),
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const cost = input as number[];
    const n = cost.length;
    const steps: VizStep[] = [];
    const dp: number[] = new Array(n).fill(0);

    steps.push({
      type: "init",
      state: { i: 0 },
      dependencies: [],
      activeLine: 3,
      explanation: `We have ${n} steps with costs [${cost.join(", ")}]. We want the minimum cost to reach the top.`,
      tableSnapshot1D: [...dp],
    });

    dp[0] = cost[0];
    steps.push({
      type: "base_case",
      state: { i: 0 },
      dependencies: [],
      result: cost[0],
      activeLine: 4,
      explanation: `Base case: dp[0] = cost[0] = ${cost[0]}.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 0 }],
    });

    dp[1] = cost[1];
    steps.push({
      type: "base_case",
      state: { i: 1 },
      dependencies: [],
      result: cost[1],
      activeLine: 5,
      explanation: `Base case: dp[1] = cost[1] = ${cost[1]}.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 1 }],
    });

    for (let i = 2; i < n; i++) {
      const dep1 = { i: i - 1 };
      const dep2 = { i: i - 2 };
      const val1 = dp[i - 1];
      const val2 = dp[i - 2];
      const minPrev = Math.min(val1, val2);
      const result = cost[i] + minPrev;

      steps.push({
        type: "compare",
        state: { i },
        dependencies: [dep1, dep2],
        candidates: [
          { source: dep1, value: val1, label: `dp[${i - 1}]` },
          { source: dep2, value: val2, label: `dp[${i - 2}]` },
        ],
        activeLine: 7,
        explanation: `Step ${i} costs ${cost[i]}. Coming from step ${i - 1} (${val1}) or step ${i - 2} (${val2}). Min = ${minPrev}.`,
        tableSnapshot1D: [...dp],
        highlightedCells: [dep1, dep2, { i }],
      });

      dp[i] = result;
      steps.push({
        type: "cell_update",
        state: { i },
        dependencies: [dep1, dep2],
        candidates: [
          { source: dep1, value: val1, label: `From step ${i - 1}` },
          { source: dep2, value: val2, label: `From step ${i - 2}` },
        ],
        result,
        activeLine: 7,
        explanation: `dp[${i}] = cost[${i}] + min(dp[${i - 1}], dp[${i - 2}]) = ${cost[i]} + ${minPrev} = ${result}.`,
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i }],
      });
    }

    const answer = Math.min(dp[n - 1], dp[n - 2]);
    steps.push({
      type: "result",
      state: { i: n - 1 },
      dependencies: [{ i: n - 1 }, { i: n - 2 }],
      result: answer,
      activeLine: 9,
      explanation: `Final result: min(dp[${n - 1}], dp[${n - 2}]) = min(${dp[n - 1]}, ${dp[n - 2]}) = ${answer}. The top is beyond the last step.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: n - 1 }, { i: n - 2 }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def minCostClimbingStairs(cost):",
        "    n = len(cost)",
        "    dp = [0] * n",
        "    dp[0] = cost[0]",
        "    dp[1] = cost[1]",
        "    for i in range(2, n):",
        "        dp[i] = cost[i] + min(dp[i-1], dp[i-2])",
        "    return min(dp[n-1], dp[n-2])",
      ];
    }
    if (language === "java") {
      return [
        "public int minCostClimbingStairs(int[] cost) {",
        "    int n = cost.length;",
        "    int[] dp = new int[n];",
        "    dp[0] = cost[0];",
        "    dp[1] = cost[1];",
        "    for (int i = 2; i < n; i++) {",
        "        dp[i] = cost[i] + Math.min(dp[i-1], dp[i-2]);",
        "    }",
        "    return Math.min(dp[n-1], dp[n-2]);",
        "}",
      ];
    }
    return [
      "int minCostClimbingStairs(vector<int>& cost) {",
      "    int n = cost.size();",
      "    vector<int> dp(n, 0);",
      "    dp[0] = cost[0];",
      "    dp[1] = cost[1];",
      "    for (int i = 2; i < n; i++) {",
      "        dp[i] = cost[i] + min(dp[i-1], dp[i-2]);",
      "    }",
      "    return min(dp[n-1], dp[n-2]);",
      "}",
    ];
  },
};
