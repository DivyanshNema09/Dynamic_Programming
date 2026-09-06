import type { Algorithm, VizStep, Language } from "@/types";

export const bestTimeToBuyAndSellStock: Algorithm = {
  metadata: {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    leetcode: 121,
    difficulty: "Easy",
    pattern: "state-machine-dp",
    dataStructure: "Array",
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    tableType: "stateMachine",
    description: "You are given an array prices where prices[i] is the price of a given stock on the i-th day. You want to maximize your profit by choosing a single day to buy and a different day in the future to sell. Return the maximum profit.",
    stateDefinition: {
      notation: "dp[i]",
      description: "The minimum price seen so far up to day i (used to compute max profit).",
    },
    transition: {
      notation: "profit = max(profit, prices[i] - minPrice); minPrice = min(minPrice, prices[i])",
      description: "Track the minimum price seen so far. For each day, compute the profit if we sell at today's price.",
    },
    baseCases: [
      { notation: "minPrice = prices[0]", description: "Start with the first day's price as the minimum." },
      { notation: "profit = 0", description: "Initial profit is 0 (no transaction)." },
    ],
    complexity: {
      time: "O(n)",
      space: "O(1)",
      optimizationNote: "Only two variables are needed: minPrice and maxProfit. This is already space-optimized.",
    },
    whyDP: [
      "The maximum profit up to day i depends on the minimum price seen so far.",
      "Overlapping subproblems: the minimum price is updated and reused for each subsequent day.",
      "Optimal substructure: the best profit is max over all days of (price[i] - minPrice so far).",
      "This can be viewed as a state machine with two states: 'holding' and 'not holding'.",
    ],
    commonMistakes: [
      "Buying and selling on the same day (must buy before you sell).",
      "Not updating minPrice before computing profit (or vice versa — order matters).",
      "Returning 0 for negative profit instead of 0 (can't have negative profit, just don't trade).",
    ],
    input: {
      type: "array",
      default: "7,1,5,3,6,4",
      placeholder: "Enter prices (e.g., 7,1,5,3,6,4)",
      validate: (input) => {
        const parts = input.split(",").map((s) => parseInt(s.trim()));
        return parts.length >= 2 && parts.length <= 15 && parts.every((n) => !isNaN(n) && n >= 0);
      },
      parse: (input) => input.split(",").map((s) => parseInt(s.trim())),
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const prices = input as number[];
    const n = prices.length;
    const steps: VizStep[] = [];
    const dp: number[] = new Array(n).fill(0); // profits per day
    let minPrice = prices[0];
    let maxProfit = 0;

    steps.push({
      type: "init",
      state: { i: 0 },
      dependencies: [],
      activeLine: 3,
      explanation: `Prices: [${prices.join(", ")}]. We'll track the minimum price and compute the best profit for each day.`,
      tableSnapshot1D: [...dp],
    });

    steps.push({
      type: "base_case",
      state: { i: 0 },
      dependencies: [],
      result: 0,
      activeLine: 4,
      explanation: `Base case: minPrice = prices[0] = ${prices[0]}, maxProfit = 0. Can't sell on day 0.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 0 }],
    });

    for (let i = 1; i < n; i++) {
      const profit = prices[i] - minPrice;
      const oldMin = minPrice;

      steps.push({
        type: "compare",
        state: { i },
        dependencies: [{ i: i - 1 }],
        candidates: [
          { source: { i }, value: prices[i], label: `Today's price: ${prices[i]}` },
          { source: { i: i - 1 }, value: minPrice, label: `Min price so far: ${minPrice}` },
        ],
        activeLine: 6,
        explanation: `Day ${i}: Price = ${prices[i]}. If we sell today, profit = ${prices[i]} - ${minPrice} = ${profit}.`,
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i: i - 1 }, { i }],
      });

      if (profit > maxProfit) {
        maxProfit = profit;
      }
      if (prices[i] < minPrice) {
        minPrice = prices[i];
      }
      dp[i] = maxProfit;

      steps.push({
        type: "cell_update",
        state: { i },
        dependencies: [{ i: i - 1 }],
        candidates: [
          { source: { i }, value: profit, label: `Profit if sell today: ${profit}` },
          { source: { i: i - 1 }, value: oldMin, label: `Previous min: ${oldMin} → New min: ${minPrice}` },
        ],
        result: maxProfit,
        activeLine: 7,
        explanation: `Day ${i}: ${profit > 0 ? `Profit = ${profit}.` : "No profit."} ${prices[i] < oldMin ? `New min price = ${minPrice}.` : `Min price stays ${minPrice}.`} Max profit so far = ${maxProfit}.`,
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i }],
      });
    }

    steps.push({
      type: "result",
      state: { i: n - 1 },
      dependencies: [],
      result: maxProfit,
      activeLine: 9,
      explanation: `Final result: Maximum profit = ${maxProfit}. ${maxProfit > 0 ? `Buy at ${Math.min(...prices)} and sell at ${maxProfit + Math.min(...prices)}.` : "No profitable transaction possible."}`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: n - 1 }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def maxProfit(prices):",
        "    minPrice = prices[0]",
        "    maxProfit = 0",
        "    for i in range(1, len(prices)):",
        "        profit = prices[i] - minPrice",
        "        maxProfit = max(maxProfit, profit)",
        "        minPrice = min(minPrice, prices[i])",
        "    return maxProfit",
      ];
    }
    if (language === "java") {
      return [
        "public int maxProfit(int[] prices) {",
        "    int minPrice = prices[0];",
        "    int maxProfit = 0;",
        "    for (int i = 1; i < prices.length; i++) {",
        "        int profit = prices[i] - minPrice;",
        "        maxProfit = Math.max(maxProfit, profit);",
        "        minPrice = Math.min(minPrice, prices[i]);",
        "    }",
        "    return maxProfit;",
        "}",
      ];
    }
    return [
      "int maxProfit(vector<int>& prices) {",
      "    int minPrice = prices[0];",
      "    int maxProfit = 0;",
      "    for (int i = 1; i < prices.size(); i++) {",
      "        int profit = prices[i] - minPrice;",
      "        maxProfit = max(maxProfit, profit);",
      "        minPrice = min(minPrice, prices[i]);",
      "    }",
      "    return maxProfit;",
      "}",
    ];
  },
};
