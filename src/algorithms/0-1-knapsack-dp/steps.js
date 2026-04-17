export function generateKnapsackSteps(capacity = 5, weights = [2, 3, 4], values = [3, 4, 5]) {
  const steps = [];
  const n = weights.length;

  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(null));

  // Pre-fill row 0 and col 0 with 0s for base case visualization
  for (let w = 0; w <= capacity; w++) dp[0][w] = 0;
  for (let i = 0; i <= n; i++) dp[i][0] = 0;

  const getMatrixState = (activeCell = null, deps = []) => {
      // Build row labels explicitly mapping item weights and values
      const rowLabels = ["0 (No Items)"];
      for (let i = 0; i < n; i++) {
        rowLabels.push(`Item ${i + 1} (w:${weights[i]}, v:${values[i]})`);
      }
      const colLabels = Array.from({length: capacity + 1}, (_, i) => i.toString());

      return {
          grid: JSON.parse(JSON.stringify(dp)),
          activeCell,
          dependencyCells: deps,
          rowLabels,
          colLabels
      };
  };

  steps.push({
      action: 'initial',
      matrixState: getMatrixState(),
      explanation: 'Algorithm started. Initializing DP table.',
      subExplanation: 'Base cases (0 items or 0 capacity) are set to 0. We will iteratively compute the max value for each capacity using available items.',
      highlightedLine: 2
  });

  for (let i = 1; i <= n; i++) {
      const w_i = weights[i - 1];
      const v_i = values[i - 1];

      for (let w = 1; w <= capacity; w++) {
          
          steps.push({
             action: 'compute',
             matrixState: getMatrixState([i, w]),
             explanation: `Computing max value for capacity ${w} considering Item ${i}.`,
             subExplanation: `Item ${i} has weight ${w_i} and value ${v_i}.`,
             highlightedLine: 5
          });

          if (w_i <= w) {
              const includeVal = v_i + dp[i - 1][w - w_i];
              const excludeVal = dp[i - 1][w];

              steps.push({
                 action: 'decision',
                 matrixState: getMatrixState([i, w], [[i - 1, w], [i - 1, w - w_i]]),
                 explanation: `Item ${i} can fit! Capacity ${w} >= Weight ${w_i}.`,
                 subExplanation: `Choice 1 (Include): Item Value (${v_i}) + Optimal value for remaining capacity ${w - w_i} (${dp[i-1][w-w_i]}) = ${includeVal}.\\nChoice 2 (Exclude): Optimal value without this item (${excludeVal}).`,
                 highlightedLine: 6
              });

              dp[i][w] = Math.max(includeVal, excludeVal);

              steps.push({
                 action: 'assign',
                 matrixState: getMatrixState([i, w], [[i - 1, w], [i - 1, w - w_i]]),
                 explanation: `Selected maximum value: ${dp[i][w]}`,
                 subExplanation: includeVal > excludeVal ? 'Including the item yields a better total value.' : 'Excluding the item yields a better total value.',
                 highlightedLine: 8
              });

          } else {
              dp[i][w] = dp[i - 1][w];

              steps.push({
                 action: 'assign',
                 matrixState: getMatrixState([i, w], [[i - 1, w]]),
                 explanation: `Item ${i} is too heavy! Weight ${w_i} > Capacity ${w}.`,
                 subExplanation: `We cannot include this item. Copying the optimal value from the previous row (${dp[i-1][w]}).`,
                 highlightedLine: 10
              });
          }
      }
  }

  steps.push({
      action: 'complete',
      matrixState: getMatrixState([n, capacity]),
      explanation: 'DP Table complete!',
      subExplanation: `The optimal value for the full capacity ${capacity} considering all items is ${dp[n][capacity]}.`,
      highlightedLine: 12
  });

  return steps;
}

export const knapsackCode = {
  python: `def knapsack(W, wt, val, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i-1] <= w:
                include_item = val[i-1] + dp[i-1][w-wt[i-1]]
                exclude_item = dp[i-1][w]
                dp[i][w] = max(include_item, exclude_item)
            else:
                dp[i][w] = dp[i-1][w]

    return dp[n][W]`,

  cpp: `int knapsack(int W, int wt[], int val[], int n) {
    int dp[n + 1][W + 1];

    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (i == 0 || w == 0)
                dp[i][w] = 0;
            else if (wt[i - 1] <= w)
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}`
};
