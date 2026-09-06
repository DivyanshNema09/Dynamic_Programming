import type { Algorithm, VizStep, Language } from "@/types";

export const knapsack01: Algorithm = {
  metadata: {
    id: "knapsack-01",
    title: "0/1 Knapsack",
    leetcode: 0,
    difficulty: "Medium",
    pattern: "knapsack",
    dataStructure: "2D Array",
    companies: ["Amazon", "Google", "Microsoft"],
    tableType: "2D",
    description: "Given n items with weights and values, and a knapsack with capacity W, find the maximum value you can put in the knapsack. Each item can be used at most once (0/1 choice).",
    stateDefinition: {
      notation: "dp[i][w]",
      description: "The maximum value achievable using items 0..i-1 with knapsack capacity w.",
    },
    transition: {
      notation: "dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i]] + value[i])",
      description: "Either don't take item i (keep dp[i-1][w]) or take it (add its value to the best solution with reduced capacity).",
    },
    baseCases: [
      { notation: "dp[0][w] = 0 for all w", description: "With 0 items, the maximum value is 0 regardless of capacity." },
    ],
    complexity: {
      time: "O(n * W)",
      space: "O(n * W)",
      optimizedSpace: "O(W)",
      optimizationNote: "Since dp[i] only depends on dp[i-1], we can use a 1D array, iterating capacity in reverse.",
    },
    whyDP: [
      "The decision for item i depends on the best solution using items 0..i-1.",
      "Overlapping subproblems: the same (item, capacity) state is reached via different paths.",
      "Optimal substructure: the best solution for (i, w) uses the best solution for (i-1, ...) states.",
      "Each item is used 0 or 1 times — this is the key distinction from unbounded knapsack.",
    ],
    commonMistakes: [
      "Allowing unlimited reuse of items (that's unbounded knapsack, not 0/1).",
      "Iterating capacity forward in the space-optimized version (causes double-counting).",
      "Forgetting to check if weight[i] <= w before considering the 'take' option.",
    ],
    input: {
      type: "knapsack",
      default: "weights=[2,3,4,5], values=[3,4,5,6], capacity=5",
      placeholder: "weights=[2,3,4,5], values=[3,4,5,6], capacity=5",
      validate: (input) => {
        const match = input.match(/weights=\[([\d,\s]+)\],\s*values=\[([\d,\s]+)\],\s*capacity=(\d+)/);
        if (!match) return false;
        const weights = match[1].split(",").map((s) => parseInt(s.trim()));
        const values = match[2].split(",").map((s) => parseInt(s.trim()));
        const capacity = parseInt(match[3].trim());
        return weights.length === values.length && weights.length > 0 && capacity > 0;
      },
      parse: (input) => {
        const match = input.match(/weights=\[([\d,\s]+)\],\s*values=\[([\d,\s]+)\],\s*capacity=(\d+)/);
        if (!match) return { weights: [], values: [], capacity: 0 };
        const weights = match[1].split(",").map((s) => parseInt(s.trim()));
        const values = match[2].split(",").map((s) => parseInt(s.trim()));
        const capacity = parseInt(match[3].trim());
        return { weights, values, capacity };
      },
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const { weights, values, capacity } = input as { weights: number[]; values: number[]; capacity: number };
    const n = weights.length;
    const steps: VizStep[] = [];
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    steps.push({
      type: "init",
      state: { i: 0, j: 0 },
      dependencies: [],
      activeLine: 4,
      explanation: `Items: ${n}, Capacity: ${capacity}. Weights: [${weights.join(", ")}], Values: [${values.join(", ")}]. We'll fill a (${n + 1})×(${capacity + 1}) DP table.`,
      tableSnapshot: dp.map((r) => [...r]),
    });

    // Base case: row 0 is all zeros
    for (let w = 0; w <= capacity; w++) {
      dp[0][w] = 0;
    }
    steps.push({
      type: "base_case",
      state: { i: 0, j: 0 },
      dependencies: [],
      result: 0,
      activeLine: 5,
      explanation: "Base case: dp[0][w] = 0 for all w. With 0 items, max value is 0.",
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: Array.from({ length: capacity + 1 }, (_, w) => ({ i: 0, j: w })),
    });

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        const dep1 = { i: i - 1, j: w };
        const skipVal = dp[i - 1][w];
        const candidates: { source: { i: number; j: number }; value: number; label: string }[] = [
          { source: dep1, value: skipVal, label: `Don't take item ${i - 1}: dp[${i - 1}][${w}] = ${skipVal}` },
        ];

        let result = skipVal;
        if (weights[i - 1] <= w) {
          const dep2 = { i: i - 1, j: w - weights[i - 1] };
          const takeVal = dp[i - 1][w - weights[i - 1]] + values[i - 1];
          candidates.push({
            source: dep2,
            value: takeVal,
            label: `Take item ${i - 1}: dp[${i - 1}][${w - weights[i - 1]}] + ${values[i - 1]} = ${dp[i - 1][w - weights[i - 1]]} + ${values[i - 1]} = ${takeVal}`,
          });
          result = Math.max(skipVal, takeVal);
        }

        const deps = candidates.map((c) => c.source);

        steps.push({
          type: "compare",
          state: { i, j: w },
          dependencies: deps,
          candidates,
          activeLine: 7,
          explanation: `dp[${i}][${w}]: Item ${i - 1} has weight ${weights[i - 1]} and value ${values[i - 1]}. ${weights[i - 1] <= w ? `Can fit (weight ≤ ${w}).` : "Too heavy, must skip."}`,
          tableSnapshot: dp.map((r) => [...r]),
          highlightedCells: [...deps, { i, j: w }],
        });

        dp[i][w] = result;
        steps.push({
          type: "cell_update",
          state: { i, j: w },
          dependencies: deps,
          candidates,
          result,
          activeLine: 7,
          explanation: `dp[${i}][${w}] = ${result}. ${result === skipVal && candidates.length > 1 ? "Skipping is better." : candidates.length > 1 ? "Taking is better." : "Must skip (item too heavy)."}`,
          tableSnapshot: dp.map((r) => [...r]),
          highlightedCells: [{ i, j: w }],
        });
      }
    }

    steps.push({
      type: "result",
      state: { i: n, j: capacity },
      dependencies: [],
      result: dp[n][capacity],
      activeLine: 10,
      explanation: `Final result: Maximum value = ${dp[n][capacity]}.`,
      tableSnapshot: dp.map((r) => [...r]),
      highlightedCells: [{ i: n, j: capacity }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def knapsack(weights, values, capacity):",
        "    n = len(weights)",
        "    dp = [[0] * (capacity + 1) for _ in range(n + 1)]",
        "    for i in range(1, n + 1):",
        "        for w in range(capacity + 1):",
        "            dp[i][w] = dp[i-1][w]",
        "            if weights[i-1] <= w:",
        "                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1])",
        "    return dp[n][capacity]",
      ];
    }
    if (language === "java") {
      return [
        "public int knapsack(int[] weights, int[] values, int capacity) {",
        "    int n = weights.length;",
        "    int[][] dp = new int[n + 1][capacity + 1];",
        "    for (int i = 1; i <= n; i++) {",
        "        for (int w = 0; w <= capacity; w++) {",
        "            dp[i][w] = dp[i-1][w];",
        "            if (weights[i-1] <= w)",
        "                dp[i][w] = Math.max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1]);",
        "        }",
        "    }",
        "    return dp[n][capacity];",
        "}",
      ];
    }
    return [
      "int knapsack(vector<int>& weights, vector<int>& values, int capacity) {",
      "    int n = weights.size();",
      "    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));",
      "    for (int i = 1; i <= n; i++) {",
      "        for (int w = 0; w <= capacity; w++) {",
      "            dp[i][w] = dp[i-1][w];",
      "            if (weights[i-1] <= w)",
      "                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1]);",
      "        }",
      "    }",
      "    return dp[n][capacity];",
      "}",
    ];
  },
};
