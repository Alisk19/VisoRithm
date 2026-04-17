// src/algorithms/dp-advanced/steps.js
// Fibonacci DP, LCS, Job Assignment (Hungarian), Warshall, Floyd

const mkStep = (overrides) => ({
  action: 'idle', explanation: '', subExplanation: '', highlightedLine: -1,
  array: [], indices: [], sortedIndices: [], pointers: [], inactiveIndices: [],
  board: null, treeState: { nodes: [], edges: [] }, logs: [], matrixState: null, graphState: null,
  ...overrides,
});

// ── FIBONACCI DP ────────────────────────────────────────────────────────────
export function generateFibonacciDpSteps(n = 9) {
  const steps = [];
  const dp = Array(n + 1).fill(null);
  const makeMatrix = () => [dp.map(v => (v === null ? null : v))];
  const colLabels = Array.from({ length: n + 1 }, (_, i) => `n=${i}`);

  steps.push(mkStep({ action: 'init', matrixState: { grid: makeMatrix(), activeCell: null, dependencyCells: [], rowLabels: ['F(n)'], colLabels }, explanation: `Building Fibonacci DP table up to F(${n}).`, subExplanation: 'F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).', highlightedLine: 1 }));

  dp[0] = 0;
  steps.push(mkStep({ action: 'base', matrixState: { grid: makeMatrix(), activeCell: [0, 0], dependencyCells: [], rowLabels: ['F(n)'], colLabels }, explanation: 'Base case: F(0) = 0.', subExplanation: 'By definition.', highlightedLine: 2 }));

  dp[1] = 1;
  steps.push(mkStep({ action: 'base', matrixState: { grid: makeMatrix(), activeCell: [0, 1], dependencyCells: [], rowLabels: ['F(n)'], colLabels }, explanation: 'Base case: F(1) = 1.', subExplanation: 'By definition.', highlightedLine: 3 }));

  for (let i = 2; i <= n; i++) {
    steps.push(mkStep({ action: 'compute', matrixState: { grid: makeMatrix(), activeCell: [0, i], dependencyCells: [[0, i - 1], [0, i - 2]], rowLabels: ['F(n)'], colLabels }, explanation: `Computing F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]}.`, subExplanation: `Depends on two previous values (highlighted).`, highlightedLine: 5 }));
    dp[i] = dp[i - 1] + dp[i - 2];
    steps.push(mkStep({ action: 'filled', matrixState: { grid: makeMatrix(), activeCell: [0, i], dependencyCells: [], rowLabels: ['F(n)'], colLabels }, explanation: `F(${i}) = ${dp[i]}.`, subExplanation: '', highlightedLine: 5 }));
  }

  steps.push(mkStep({ action: 'final', matrixState: { grid: makeMatrix(), activeCell: null, dependencyCells: [], rowLabels: ['F(n)'], colLabels }, explanation: `Fibonacci DP complete! F(${n}) = ${dp[n]}.`, subExplanation: 'All sub-problems solved bottom-up.', highlightedLine: 7 }));
  return steps;
}

export const fibonacciDpCode = {
  python: `def fib_dp(n):                  # 1
    dp = [0] * (n + 1)             # 2
    dp[1] = 1                      # 3
    for i in range(2, n+1):        # 4
        dp[i] = dp[i-1] + dp[i-2] # 5
    return dp[n]                   # 6`,
  cpp: `int fib_dp(int n){
    vector<int> dp(n+1, 0);
    dp[1]=1;
    for(int i=2;i<=n;i++)
        dp[i]=dp[i-1]+dp[i-2];
    return dp[n];
}`,
};

// ── LCS ─────────────────────────────────────────────────────────────────────
export function generateLcsSteps(s1 = 'ABCD', s2 = 'ACBD') {
  const steps = [];
  const m = s1.length, nCols = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(nCols + 1).fill(null));
  const rowLabels = ['', ...s1.split('')];
  const colLabels = ['', ...s2.split('')];

  const makeMatrix = () => dp.map(r => [...r]);

  steps.push(mkStep({ action: 'init', matrixState: { grid: makeMatrix(), activeCell: null, dependencyCells: [], rowLabels, colLabels }, explanation: `Starting LCS for "${s1}" and "${s2}".`, subExplanation: 'Build a 2D DP table. dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1].', highlightedLine: 1 }));

  // Fill base cases
  for (let i = 0; i <= m; i++) dp[i][0] = 0;
  for (let j = 0; j <= nCols; j++) dp[0][j] = 0;

  steps.push(mkStep({ action: 'base', matrixState: { grid: makeMatrix(), activeCell: [0, 0], dependencyCells: [], rowLabels, colLabels }, explanation: 'Base case: LCS of empty string = 0 for all.', subExplanation: 'First row and column filled with 0.', highlightedLine: 3 }));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= nCols; j++) {
      const match = s1[i - 1] === s2[j - 1];
      steps.push(mkStep({ action: 'compare', matrixState: { grid: makeMatrix(), activeCell: [i, j], dependencyCells: match ? [[i - 1, j - 1]] : [[i - 1, j], [i, j - 1]], rowLabels, colLabels }, explanation: `Comparing "${s1[i - 1]}" (s1[${i - 1}]) with "${s2[j - 1]}" (s2[${j - 1}]).`, subExplanation: match ? `Match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1.` : `No match. dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]).`, highlightedLine: match ? 5 : 7 }));
      dp[i][j] = match ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
      steps.push(mkStep({ action: 'fill', matrixState: { grid: makeMatrix(), activeCell: [i, j], dependencyCells: [], rowLabels, colLabels }, explanation: `dp[${i}][${j}] = ${dp[i][j]}.`, subExplanation: '', highlightedLine: match ? 5 : 7 }));
    }
  }

  steps.push(mkStep({ action: 'final', matrixState: { grid: makeMatrix(), activeCell: [m, nCols], dependencyCells: [], rowLabels, colLabels }, explanation: `LCS length = ${dp[m][nCols]}.`, subExplanation: `Found at dp[${m}][${nCols}]. Backtrack to find the actual sequence.`, highlightedLine: 9 }));
  return steps;
}

export const lcsCode = {
  python: `def lcs(s1, s2):                # 1
    m, n = len(s1), len(s2)        # 2
    dp = [[0]*(n+1) for _ in range(m+1)] # 3
    for i in range(1, m+1):        # 4
        for j in range(1, n+1):    # 5
            if s1[i-1]==s2[j-1]:   # 6 — match
                dp[i][j]=dp[i-1][j-1]+1  # 7
            else:
                dp[i][j]=max(dp[i-1][j],dp[i][j-1]) # 8
    return dp[m][n]                # 9`,
  cpp: `int lcs(string s1, string s2){
    int m=s1.size(), n=s2.size();
    vector<vector<int>> dp(m+1,vector<int>(n+1,0));
    for(int i=1;i<=m;i++)
        for(int j=1;j<=n;j++)
            if(s1[i-1]==s2[j-1]) dp[i][j]=dp[i-1][j-1]+1;
            else dp[i][j]=max(dp[i-1][j],dp[i][j-1]);
    return dp[m][n];
}`,
};

// ── 0/1 KNAPSACK BRANCH & BOUND ─────────────────────────────────────────────
// Visualised as DP table (same visual, different decision framing)
export function generateKnapsackBbSteps(capacity = 10, weights = [2, 3, 4, 5], values = [3, 4, 5, 8]) {
  // Use DP table filled row-by-row; explain each cell via B&B framing
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(null));
  const rowLabels = ['No items', ...weights.map((w, i) => `Item ${i + 1} (w:${w},v:${values[i]})`)];
  const colLabels = Array.from({ length: capacity + 1 }, (_, i) => `${i}`);
  const steps = [];

  for (let i = 0; i <= n; i++) dp[i][0] = 0;
  for (let j = 0; j <= capacity; j++) dp[0][j] = 0;

  steps.push(mkStep({ action: 'init', matrixState: { grid: dp.map(r => [...r]), activeCell: null, dependencyCells: [], rowLabels, colLabels }, explanation: '0/1 Knapsack via Branch & Bound.', subExplanation: `Capacity=${capacity}, Items=${n}. We bound each subproblem with DP.`, highlightedLine: 1 }));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= capacity; j++) {
      const canInclude = j >= weights[i - 1];
      const include = canInclude ? dp[i - 1][j - weights[i - 1]] + values[i - 1] : -1;
      const exclude = dp[i - 1][j];
      const deps = canInclude ? [[i - 1, j], [i - 1, j - weights[i - 1]]] : [[i - 1, j]];

      steps.push(mkStep({ action: 'branch', matrixState: { grid: dp.map(r => [...r]), activeCell: [i, j], dependencyCells: deps, rowLabels, colLabels }, explanation: `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}) with capacity ${j}.`, subExplanation: canInclude ? `Include → ${include}. Exclude → ${exclude}. Best = ${Math.max(include, exclude)}.` : `Cannot include (weight ${weights[i - 1]} > capacity ${j}). Exclude only → ${exclude}.`, highlightedLine: canInclude ? 5 : 7 }));

      dp[i][j] = canInclude ? Math.max(include, exclude) : exclude;
    }
  }

  steps.push(mkStep({ action: 'final', matrixState: { grid: dp.map(r => [...r]), activeCell: [n, capacity], dependencyCells: [], rowLabels, colLabels }, explanation: `Maximum value = ${dp[n][capacity]}.`, subExplanation: `Optimal solution found at dp[${n}][${capacity}].`, highlightedLine: 9 }));
  return steps;
}

export const knapsackBbCode = {
  python: `def knapsack(W, wt, val, n):
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(1, W+1):
            if wt[i-1] <= w:         # can include
                dp[i][w] = max(
                    val[i-1]+dp[i-1][w-wt[i-1]],  # include
                    dp[i-1][w])                     # exclude
            else:
                dp[i][w] = dp[i-1][w]              # exclude
    return dp[n][W]`,
  cpp: `int knapsack(int W,int wt[],int val[],int n){
    int dp[n+1][W+1];
    for(int i=0;i<=n;i++)
        for(int w=0;w<=W;w++)
            if(i==0||w==0) dp[i][w]=0;
            else if(wt[i-1]<=w)
                dp[i][w]=max(val[i-1]+dp[i-1][w-wt[i-1]],dp[i-1][w]);
            else dp[i][w]=dp[i-1][w];
    return dp[n][W];
}`,
};

// ── JOB ASSIGNMENT ───────────────────────────────────────────────────────────
export function generateJobAssignmentSteps() {
  // Use n=4 cost matrix — brute-force assignment for clarity
  const cost = [[9, 2, 7, 8], [6, 4, 3, 7], [5, 8, 1, 8], [7, 6, 9, 4]];
  const n = 4;
  const steps = [];
  const colLabels = ['Job 1', 'Job 2', 'Job 3', 'Job 4'];
  const rowLabels = ['Worker 1', 'Worker 2', 'Worker 3', 'Worker 4'];

  steps.push(mkStep({ action: 'init', matrixState: { grid: cost.map(r => [...r]), activeCell: null, dependencyCells: [], rowLabels, colLabels }, explanation: 'Job Assignment Problem (Branch & Bound).', subExplanation: 'Assign each worker to exactly one job to minimise total cost.', highlightedLine: 1 }));

  // Show cost matrix exploration
  let bestCost = Infinity;
  let bestAssign = [];
  const assigned = [];
  const jobTaken = Array(n).fill(false);

  function solve(worker, current, assignment) {
    if (worker === n) {
      if (current < bestCost) { bestCost = current; bestAssign = [...assignment]; }
      return;
    }
    for (let job = 0; job < n; job++) {
      if (!jobTaken[job]) {
        jobTaken[job] = true;
        const deps = [[worker, job]];
        steps.push(mkStep({ action: 'assign', matrixState: { grid: cost.map(r => [...r]), activeCell: [worker, job], dependencyCells: deps, rowLabels, colLabels }, explanation: `Trying: Worker ${worker + 1} → Job ${job + 1} (cost ${cost[worker][job]}).`, subExplanation: `Running total: ${current + cost[worker][job]}. Best so far: ${bestCost === Infinity ? '∞' : bestCost}.`, highlightedLine: 4 }));
        assignment.push(job);
        solve(worker + 1, current + cost[worker][job], assignment);
        assignment.pop();
        jobTaken[job] = false;
      }
    }
  }

  solve(0, 0, []);

  // Show optimal
  const optDeps = bestAssign.map((j, i) => [i, j]);
  steps.push(mkStep({ action: 'final', matrixState: { grid: cost.map(r => [...r]), activeCell: null, dependencyCells: optDeps, rowLabels, colLabels }, explanation: `Optimal assignment found! Total cost = ${bestCost}.`, subExplanation: `Assignment: ${bestAssign.map((j, i) => `W${i + 1}→J${j + 1}`).join(', ')}.`, highlightedLine: 9 }));
  return steps;
}

export const jobAssignmentCode = {
  python: `INF = float('inf')
def solve(cost, n):
    job_taken = [False]*n
    best = [INF]
    def bt(w, total, assign):
        if w == n:
            if total < best[0]:
                best[0] = total
            return
        for j in range(n):
            if not job_taken[j]:
                job_taken[j] = True
                bt(w+1, total+cost[w][j], assign+[j])
                job_taken[j] = False
    bt(0, 0, [])
    return best[0]`,
  cpp: `int n, best=INT_MAX;
bool taken[100];
void solve(int cost[][4],int w,int total){
    if(w==n){best=min(best,total);return;}
    for(int j=0;j<n;j++)
        if(!taken[j]){
            taken[j]=true;
            solve(cost,w+1,total+cost[w][j]);
            taken[j]=false;
        }
}`,
};

// ── WARSHALL'S (Transitive Closure) ────────────────────────────────────────
export function generateWarshallSteps(customMatrix = null) {
  let reach = customMatrix
    ? customMatrix.map(row => row.map(v => v ? 1 : 0))
    : [[1,0,0,0],[0,1,1,0],[1,0,1,1],[0,0,0,1]];
  const n = reach.length;
  const rowLabels = Array.from({length:n}, (_,i) => `${i+1}`);
  const colLabels = Array.from({length:n}, (_,i) => `${i+1}`);
  const steps = [];

  steps.push(mkStep({ action: 'init', matrixState: { grid: reach.map(r=>[...r]), activeCell: null, dependencyCells: [], rowLabels, colLabels }, explanation: "Starting Warshall's Algorithm (Transitive Closure).", subExplanation: 'reach[i][j]=1 if there is a path from i to j.', highlightedLine: 1 }));

  for (let k = 0; k < n; k++) {
    steps.push(mkStep({ action: 'pivot', matrixState: { grid: reach.map(r=>[...r]), activeCell: null, dependencyCells: [], rowLabels, colLabels }, explanation: `Iteration k=${k+1}: using vertex ${k+1} as intermediate.`, subExplanation: `For all pairs (i,j): reach[i][j] = reach[i][j] OR (reach[i][${k+1}] AND reach[${k+1}][j]).`, highlightedLine: 3 }));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const newVal = reach[i][j] || (reach[i][k] && reach[k][j]) ? 1 : 0;
        if (newVal !== reach[i][j]) {
          steps.push(mkStep({ action: 'update', matrixState: { grid: reach.map(r=>[...r]), activeCell: [i, j], dependencyCells: [[i, k], [k, j]], rowLabels, colLabels }, explanation: `reach[${i+1}][${j+1}]: ${reach[i][j]} → 1 (via vertex ${k+1}).`, subExplanation: `Indirect path ${i+1}→${k+1}→${j+1} found.`, highlightedLine: 5 }));
          reach[i][j] = 1;
        }
      }
    }
  }

  steps.push(mkStep({ action: 'final', matrixState: { grid: reach.map(r=>[...r]), activeCell: null, dependencyCells: [], rowLabels, colLabels }, explanation: "Warshall's Algorithm complete!", subExplanation: 'Matrix shows transitive closure — reachability between all pairs.', highlightedLine: 7 }));
  return steps;
}

export const warshallCode = {
  python: `def warshall(R, n):              # 1
    for k in range(n):             # 2
        for i in range(n):         # 3
            for j in range(n):     # 4
                R[i][j] = R[i][j] or (R[i][k] and R[k][j]) # 5
    return R`,
  cpp: `void warshall(int R[][4], int n){
    for(int k=0;k<n;k++)
        for(int i=0;i<n;i++)
            for(int j=0;j<n;j++)
                R[i][j]=R[i][j]||(R[i][k]&&R[k][j]);
}`,
};

// ── FLOYD-WARSHALL (All-Pairs Shortest Path) ────────────────────────────────
export function generateFloydSteps(customMatrix = null) {
  const INF = 999;
  let dist;
  if (customMatrix) {
    dist = customMatrix.map(row => row.map(v => (v === 0 || v === 999 || v >= 999) ? INF : v));
    // Set diagonal to 0
    dist.forEach((row, i) => { row[i] = 0; });
  } else {
    dist = [
      [0, 3, INF, 7],
      [8, 0, 2, INF],
      [5, INF, 0, 1],
      [2, INF, INF, 0],
    ];
  }
  const n = dist.length;
  const rowLabels = Array.from({length:n},(_,i)=>`${i+1}`);
  const colLabels = Array.from({length:n},(_,i)=>`${i+1}`);
  const steps = [];

  steps.push(mkStep({ action: 'init', matrixState: { grid: dist.map(r=>r.map(v=>v===INF?'∞':v)), activeCell: null, dependencyCells: [], rowLabels, colLabels }, explanation: "Starting Floyd-Warshall Algorithm.", subExplanation: 'Find shortest paths between all pairs. dist[i][j] = min path from i to j.', highlightedLine: 1 }));

  for (let k = 0; k < n; k++) {
    steps.push(mkStep({ action: 'pivot', matrixState: { grid: dist.map(r=>r.map(v=>v===INF?'∞':v)), activeCell: null, dependencyCells: [], rowLabels, colLabels }, explanation: `k=${k+1}: Trying vertex ${k+1} as intermediate for all pairs.`, subExplanation: `dist[i][j] = min(dist[i][j], dist[i][${k+1}] + dist[${k+1}][j]).`, highlightedLine: 3 }));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          steps.push(mkStep({ action: 'relax', matrixState: { grid: dist.map(r=>r.map(v=>v===INF?'∞':v)), activeCell: [i, j], dependencyCells: [[i, k], [k, j]], rowLabels, colLabels }, explanation: `Shorter path ${i+1}→${k+1}→${j+1} found: ${dist[i][k]}+${dist[k][j]}=${dist[i][k]+dist[k][j]} < ${dist[i][j]}.`, subExplanation: `Updating dist[${i+1}][${j+1}].`, highlightedLine: 5 }));
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  steps.push(mkStep({ action: 'final', matrixState: { grid: dist.map(r=>r.map(v=>v===INF?'∞':v)), activeCell: null, dependencyCells: [], rowLabels, colLabels }, explanation: 'Floyd-Warshall complete!', subExplanation: 'All-pairs shortest path matrix computed.', highlightedLine: 7 }));
  return steps;
}

export const floydCode = {
  python: `def floyd(dist, n):              # 1
    for k in range(n):             # 2
        for i in range(n):         # 3
            for j in range(n):     # 4
                if dist[i][k]+dist[k][j] < dist[i][j]: # 5
                    dist[i][j]=dist[i][k]+dist[k][j]   # 6
    return dist`,
  cpp: `void floyd(int d[][4], int n){
    for(int k=0;k<n;k++)
        for(int i=0;i<n;i++)
            for(int j=0;j<n;j++)
                if(d[i][k]+d[k][j]<d[i][j])
                    d[i][j]=d[i][k]+d[k][j];
}`,
};
