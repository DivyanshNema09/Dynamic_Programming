import type { Algorithm, VizStep, Language } from "@/types";

export const coinChange: Algorithm = {
  metadata: {
    id: "coin-change",
    title: "Coin Change",
    leetcode: 322,
    difficulty: "Medium",
    pattern: "unbounded-knapsack",
    dataStructure: "Array",
    companies: ["Amazon", "Microsoft", "Google", "Bloomberg"],
    tableType: "1D",
    description: "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount. If no combination exists, return -1. You may use each coin unlimited times.",
    stateDefinition: {
      notation: "dp[i]",
      description: "The minimum number of coins needed to make amount i.",
    },
    transition: {
      notation: "dp[i] = min(dp[i], dp[i - coin] + 1) for each coin",
      description: "For each amount i, try every coin. If we use a coin, add 1 to the best solution for the remaining amount.",
    },
    baseCases: [
      { notation: "dp[0] = 0", description: "Zero coins needed to make amount 0." },
    ],
    complexity: {
      time: "O(n * m)",
      space: "O(n)",
      optimizationNote: "n = amount, m = number of coins. Space is O(n) for the DP array.",
    },
    whyDP: [
      "The minimum coins for amount i depends on the minimum coins for smaller amounts.",
      "Subproblems overlap: the same sub-amounts are reused across different coin choices.",
      "Optimal substructure: the best solution for amount i uses the best solution for some amount i - coin.",
      "This is an unbounded knapsack because each coin can be used unlimited times.",
    ],
    commonMistakes: [
      "Initializing dp with 0 instead of infinity (or amount+1) for non-zero amounts.",
      "Forgetting to check if dp[amount] is still infinity (meaning no solution exists).",
      "Mixing up minimum coins (this problem) with number of combinations (Coin Change II).",
    ],
    input: {
      type: "array",
      default: "coins=[1,5,12], amount=11",
      placeholder: "coins=[1,5,12], amount=11",
      validate: (input) => {
        const match = input.match(/coins=\[([\d,\s]+)\],\s*amount=(\d+)/);
        if (!match) return false;
        const coins = match[1].split(",").map((s) => parseInt(s.trim()));
        const amount = parseInt(match[2].trim());
        return coins.length > 0 && coins.every((c) => c > 0) && amount >= 0 && amount <= 1000;
      },
      parse: (input) => {
        const match = input.match(/coins=\[([\d,\s]+)\],\s*amount=(\d+)/);
        if (!match) return { coins: [], amount: 0 };
        const coins = match[1].split(",").map((s) => parseInt(s.trim()));
        const amount = parseInt(match[2].trim());
        return { coins, amount };
      },
    },
  },
  generateSteps: (input: unknown): VizStep[] => {
    const { coins, amount } = input as { coins: number[]; amount: number };
    const steps: VizStep[] = [];
    const INF = amount + 1;
    const dp: number[] = new Array(amount + 1).fill(INF);

    steps.push({
      type: "init",
      state: { i: 0 },
      dependencies: [],
      activeLine: 4,
      explanation: `Coins: [${coins.join(", ")}], Amount: ${amount}. We'll compute the minimum coins for every amount from 0 to ${amount}.`,
      tableSnapshot1D: [...dp],
    });

    dp[0] = 0;
    steps.push({
      type: "base_case",
      state: { i: 0 },
      dependencies: [],
      result: 0,
      activeLine: 5,
      explanation: "Base case: dp[0] = 0. Zero coins needed to make amount 0.",
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: 0 }],
    });

    for (let i = 1; i <= amount; i++) {
      const candidates: { source: { i: number }; value: number; label: string }[] = [];
      let bestVal = INF;
      let bestCoin = -1;

      for (const coin of coins) {
        if (coin <= i && dp[i - coin] + 1 < bestVal) {
          bestVal = dp[i - coin] + 1;
          bestCoin = coin;
        }
        if (coin <= i) {
          candidates.push({
            source: { i: i - coin },
            value: dp[i - coin] + 1,
            label: `coin ${coin}: dp[${i - coin}] + 1 = ${dp[i - coin]} + 1 = ${dp[i - coin] + 1}`,
          });
        }
      }

      const deps = candidates.map((c) => c.source);

      steps.push({
        type: "compare",
        state: { i },
        dependencies: deps,
        candidates: candidates.length > 0 ? candidates : [{ source: { i }, value: INF, label: "No coin fits" }],
        activeLine: 7,
        explanation: `Amount ${i}: Try each coin. ${candidates.length > 0 ? `Best so far: coin ${bestCoin} gives ${bestVal}.` : "No coin can make this amount."}`,
        tableSnapshot1D: [...dp],
        highlightedCells: [...deps, { i }],
      });

      dp[i] = bestVal;
      steps.push({
        type: "cell_update",
        state: { i },
        dependencies: deps,
        candidates: candidates.length > 0 ? candidates : [{ source: { i }, value: INF, label: "No coin fits" }],
        result: bestVal >= INF ? -1 : bestVal,
        activeLine: 7,
        explanation: bestVal >= INF
          ? `dp[${i}] = INF (no solution).`
          : `dp[${i}] = ${bestVal}. Best coin: ${bestCoin} (dp[${i - bestCoin}] + 1 = ${dp[i - bestCoin]} + 1).`,
        tableSnapshot1D: [...dp],
        highlightedCells: [{ i }],
      });
    }

    const answer = dp[amount] >= INF ? -1 : dp[amount];
    steps.push({
      type: "result",
      state: { i: amount },
      dependencies: [],
      result: answer,
      activeLine: 9,
      explanation: answer === -1
        ? `Final result: No combination of coins can make amount ${amount}.`
        : `Final result: Minimum ${answer} coins needed to make amount ${amount}.`,
      tableSnapshot1D: [...dp],
      highlightedCells: [{ i: amount }],
    });

    return steps;
  },
  getCode: (language: Language): string[] => {
    if (language === "python") {
      return [
        "def coinChange(coins, amount):",
        "    INF = amount + 1",
        "    dp = [INF] * (amount + 1)",
        "    dp[0] = 0",
        "    for i in range(1, amount + 1):",
        "        for coin in coins:",
        "            if coin <= i:",
        "                dp[i] = min(dp[i], dp[i - coin] + 1)",
        "    return dp[amount] if dp[amount] != INF else -1",
      ];
    }
    if (language === "java") {
      return [
        "public int coinChange(int[] coins, int amount) {",
        "    int INF = amount + 1;",
        "    int[] dp = new int[amount + 1];",
        "    Arrays.fill(dp, INF);",
        "    dp[0] = 0;",
        "    for (int i = 1; i <= amount; i++) {",
        "        for (int coin : coins) {",
        "            if (coin <= i)",
        "                dp[i] = Math.min(dp[i], dp[i - coin] + 1);",
        "        }",
        "    }",
        "    return dp[amount] == INF ? -1 : dp[amount];",
        "}",
      ];
    }
    return [
      "int coinChange(vector<int>& coins, int amount) {",
      "    int INF = amount + 1;",
      "    vector<int> dp(amount + 1, INF);",
      "    dp[0] = 0;",
      "    for (int i = 1; i <= amount; i++) {",
      "        for (int coin : coins) {",
      "            if (coin <= i)",
      "                dp[i] = min(dp[i], dp[i - coin] + 1);",
      "        }",
      "    }",
      "    return dp[amount] == INF ? -1 : dp[amount];",
      "}",
    ];
  },
};
