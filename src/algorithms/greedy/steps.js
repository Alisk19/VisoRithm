// src/algorithms/greedy/steps.js
// Activity Selection, Fractional Knapsack

const mkStep = (overrides) => ({
  action: 'idle', explanation: '', subExplanation: '', highlightedLine: -1,
  array: [], indices: [], sortedIndices: [], pointers: [], inactiveIndices: [],
  board: null, treeState: { nodes: [], edges: [] }, logs: [], matrixState: null, graphState: null,
  ...overrides,
});

// ── ACTIVITY SELECTION ──────────────────────────────────────────────────────
// Activities represented as array elements with height proportional to duration
export function generateActivitySelectionSteps() {
  const activities = [
    { name: 'A1', start: 1,  finish: 4  },
    { name: 'A2', start: 3,  finish: 5  },
    { name: 'A3', start: 0,  finish: 6  },
    { name: 'A4', start: 5,  finish: 7  },
    { name: 'A5', start: 3,  finish: 9  },
    { name: 'A6', start: 6,  finish: 10 },
    { name: 'A7', start: 8,  finish: 11 },
    { name: 'A8', start: 8,  finish: 12 },
  ];

  const sorted = [...activities].sort((a, b) => a.finish - b.finish);
  const n = sorted.length;
  // Use finish time as bar height (normalized)
  const finishTimes = sorted.map(a => a.finish);
  const maxVal = Math.max(...finishTimes);
  const steps = [];
  const selected = [];
  const rejected = [];

  steps.push(mkStep({ action: 'init', array: finishTimes, indices: [], sortedIndices: [], explanation: 'Starting Activity Selection (Greedy).', subExplanation: `${n} activities sorted by finish time: ${sorted.map(a => a.name).join(', ')}.`, highlightedLine: 1 }));

  // Always select first activity
  selected.push(0);
  let lastFinish = sorted[0].finish;
  steps.push(mkStep({ action: 'select', array: finishTimes, indices: [0], sortedIndices: [...selected], explanation: `Select ${sorted[0].name} (start=${sorted[0].start}, finish=${sorted[0].finish}).`, subExplanation: 'First activity always selected (earliest finish).', highlightedLine: 3 }));

  for (let i = 1; i < n; i++) {
    const compatible = sorted[i].start >= lastFinish;
    steps.push(mkStep({ action: 'check', array: finishTimes, indices: [i, selected[selected.length - 1]], sortedIndices: [...selected], explanation: `Checking ${sorted[i].name}: start=${sorted[i].start}, finish=${sorted[i].finish}.`, subExplanation: compatible ? `start(${sorted[i].start}) ≥ lastFinish(${lastFinish}) ✓ — compatible!` : `start(${sorted[i].start}) < lastFinish(${lastFinish}) ✗ — overlaps, skip.`, highlightedLine: 5 }));

    if (compatible) {
      selected.push(i);
      lastFinish = sorted[i].finish;
      steps.push(mkStep({ action: 'select', array: finishTimes, indices: [i], sortedIndices: [...selected], explanation: `Selected ${sorted[i].name}! New lastFinish = ${lastFinish}.`, subExplanation: `Selected so far: ${selected.map(x => sorted[x].name).join(', ')}.`, highlightedLine: 6 }));
    } else {
      rejected.push(i);
      steps.push(mkStep({ action: 'reject', array: finishTimes, indices: [i], sortedIndices: [...selected], inactiveIndices: [...rejected], explanation: `Skipped ${sorted[i].name} — overlaps with last selected activity.`, subExplanation: `Greedy: never need to revisit this choice.`, highlightedLine: 8 }));
    }
  }

  steps.push(mkStep({ action: 'final', array: finishTimes, indices: [], sortedIndices: [...selected], inactiveIndices: [...rejected], explanation: `Optimal solution: ${selected.length} activities selected.`, subExplanation: `${selected.map(x => sorted[x].name).join(', ')} — maximum non-overlapping set.`, highlightedLine: 10 }));
  return steps;
}

export const activitySelectionCode = {
  python: `def activity_selection(acts):   # acts sorted by finish
    selected = [acts[0]]           # 1 — always pick first
    last = acts[0]['finish']       # 2
    for a in acts[1:]:             # 3
        if a['start'] >= last:     # 4 — compatible?
            selected.append(a)     # 5 — greedy pick
            last = a['finish']     # 6 — update last
    return selected`,
  cpp: `vector<int> actSelect(vector<pair<int,int>>& acts){
    // acts = [(start,finish)] sorted by finish
    vector<int> sel = {0};
    int last = acts[0].second;
    for(int i=1;i<(int)acts.size();i++)
        if(acts[i].first >= last){
            sel.push_back(i);
            last=acts[i].second;
        }
    return sel;
}`,
};

// ── FRACTIONAL KNAPSACK ─────────────────────────────────────────────────────
export function generateFractionalKnapsackSteps(capacity = 50) {
  const items = [
    { name: 'I1', weight: 10, value: 60 },
    { name: 'I2', weight: 20, value: 100 },
    { name: 'I3', weight: 30, value: 120 },
  ];
  const steps = [];
  const ratios = items.map(it => it.value / it.weight);
  const sorted = items.map((it, i) => ({ ...it, ratio: ratios[i], idx: i })).sort((a, b) => b.ratio - a.ratio);
  const weights = sorted.map(it => it.weight);
  let remaining = capacity;
  let totalValue = 0;
  const selected = [];
  const partial = [];

  steps.push(mkStep({ action: 'init', array: weights, explanation: 'Starting Fractional Knapsack (Greedy).', subExplanation: `Capacity=${capacity}. Items sorted by value/weight ratio: ${sorted.map(it => `${it.name}(${it.ratio.toFixed(1)})`).join(', ')}.`, highlightedLine: 1 }));

  for (let i = 0; i < sorted.length; i++) {
    const it = sorted[i];
    steps.push(mkStep({ action: 'examine', array: weights, indices: [i], sortedIndices: [...selected], inactiveIndices: [...partial], explanation: `Examining ${it.name}: weight=${it.weight}, value=${it.value}, ratio=${it.ratio.toFixed(1)}.`, subExplanation: `Remaining capacity: ${remaining}.`, highlightedLine: 3 }));

    if (remaining <= 0) break;

    if (it.weight <= remaining) {
      selected.push(i);
      remaining -= it.weight;
      totalValue += it.value;
      steps.push(mkStep({ action: 'take-full', array: weights, indices: [i], sortedIndices: [...selected], explanation: `Take ALL of ${it.name} (weight=${it.weight}).`, subExplanation: `Value gained: ${it.value}. Remaining capacity: ${remaining}. Total: ${totalValue.toFixed(1)}.`, highlightedLine: 5 }));
    } else {
      const fraction = remaining / it.weight;
      totalValue += fraction * it.value;
      partial.push(i);
      steps.push(mkStep({ action: 'take-partial', array: weights, indices: [i], sortedIndices: [...selected], inactiveIndices: [...partial], explanation: `Take ${(fraction * 100).toFixed(0)}% of ${it.name} (take ${remaining}/${it.weight}).`, subExplanation: `Fractional value: ${(fraction * it.value).toFixed(1)}. Total: ${totalValue.toFixed(1)}. Knapsack full!`, highlightedLine: 7 }));
      remaining = 0;
    }
  }

  steps.push(mkStep({ action: 'final', array: weights, sortedIndices: [...selected], inactiveIndices: [...partial], explanation: `Fractional Knapsack complete! Max value = ${totalValue.toFixed(2)}.`, subExplanation: 'Greedy gives optimal solution for fractional knapsack.', highlightedLine: 8 }));
  return steps;
}

export const fractionalKnapsackCode = {
  python: `def frac_knapsack(capacity, items): # items=[(w,v)]
    items.sort(key=lambda x: x[1]/x[0], reverse=True) # 1 sort by ratio
    total = 0
    for w, v in items:             # 2
        if capacity >= w:          # 3 — take all
            total += v             # 4
            capacity -= w          # 5
        else:                      # 6 — take fraction
            total += v*(capacity/w)# 7
            break
    return total`,
  cpp: `double fracKnapsack(int cap, vector<pair<int,int>>& items){
    // items = [(weight, value)]
    sort(items.begin(),items.end(),[](auto&a,auto&b){return (double)b.second/b.first>(double)a.second/a.first;});
    double total=0;
    for(auto&[w,v]:items){
        if(cap>=w){ total+=v; cap-=w; }
        else{ total+=v*(double)cap/w; break; }
    }
    return total;
}`,
};

// ── RECURSION BASICS ─────────────────────────────────────────────────────────
export function generateRecursionBasicsSteps() {
  // Visualise factorial(4) call stack as a decision tree
  const steps = [];
  let nodeId = 0;
  const nodes = [];
  const edges = [];
  const logs = [];

  const addLog = (type, msg) => { logs.push({ type, message: msg, time: Date.now() }); if (logs.length > 8) logs.shift(); };

  function snapTree(action, explanation, sub, line) {
    steps.push(mkStep({ action, treeState: { nodes: nodes.map(n => ({ ...n })), edges: [...edges] }, logs: [...logs], explanation, subExplanation: sub, highlightedLine: line }));
  }

  function fact(n, depth, parentId, dx) {
    const myId = nodeId++;
    const label = `f(${n})`;
    nodes.push({ id: `n${myId}`, label, status: 'active', dx, dy: depth });
    if (parentId !== null) edges.push({ source: `n${parentId}`, target: `n${myId}` });

    addLog('call', `Calling factorial(${n})`);
    snapTree('call', `factorial(${n}) called.`, depth > 0 ? `Recursive call: factorial(${n}) = ${n} × factorial(${n - 1}).` : 'Entry point.', 2);

    if (n <= 1) {
      nodes[nodes.length - 1].status = 'success';
      addLog('base', `Base case: factorial(${n}) = 1`);
      snapTree('base', `Base case reached: factorial(${n}) = 1.`, 'Recursion stops here. Start returning.', 3);
      return 1;
    }

    const sub = fact(n - 1, depth + 1, myId, dx + 0.05 * (n - 2));
    const result = n * sub;
    nodes.find(nd => nd.id === `n${myId}`).label = `${result}`;
    nodes.find(nd => nd.id === `n${myId}`).status = 'success';
    addLog('return', `Returning factorial(${n}) = ${n} × ${sub} = ${result}`);
    snapTree('return', `factorial(${n}) returns ${n} × ${sub} = ${result}.`, 'Call frame resolved. Returning to caller.', 4);
    return result;
  }

  snapTree('init', 'Recursion Basics — Visualising factorial(5).', 'Each call spawns a sub-problem until the base case.', 1);
  fact(5, 0, null, 0.5);
  snapTree('final', 'factorial(5) = 120. All call frames resolved.', 'Call stack fully unwound.', 5);
  return steps;
}

export const recursionBasicsCode = {
  python: `def factorial(n):          # 1
    if n <= 1:               # 2 — base case
        return 1             # 3
    return n * factorial(n-1)# 4 — recursive case`,
  cpp: `int factorial(int n){
    if(n<=1) return 1;       // base case
    return n*factorial(n-1); // recurse
}`,
};

// ── RECURSION TREES ──────────────────────────────────────────────────────────
export function generateRecursionTreesSteps() {
  // Visualise fib(4) tree to show overlapping subproblems
  const steps = [];
  let nodeId = 0;
  const nodes = [];
  const edges = [];
  const logs = [];
  const cache = {};

  const addLog = (type, msg) => { logs.push({ type, message: msg, time: Date.now() }); if (logs.length > 8) logs.shift(); };

  function snapTree(action, explanation, sub, line) {
    steps.push(mkStep({ action, treeState: { nodes: nodes.map(n => ({ ...n })), edges: [...edges] }, logs: [...logs], explanation, subExplanation: sub, highlightedLine: line }));
  }

  function fib(n, depth, parentId, dx) {
    const myId = nodeId++;
    nodes.push({ id: `n${myId}`, label: `F(${n})`, status: 'active', dx, dy: depth });
    if (parentId !== null) edges.push({ source: `n${parentId}`, target: `n${myId}` });

    addLog('call', `fib(${n}) called ${cache[n] !== undefined ? '(duplicate!)' : ''}`);
    snapTree('call', `fib(${n}) called at depth ${depth}.`, cache[n] !== undefined ? `Already computed! fib(${n})=${cache[n]}. Overlapping subproblem.` : `New call. Split into fib(${n - 1}) + fib(${n - 2}).`, 2);

    if (n <= 1) {
      cache[n] = n;
      nodes[nodes.length - 1].status = 'success';
      snapTree('base', `Base case: fib(${n}) = ${n}.`, '', 3);
      return n;
    }

    const left = fib(n - 1, depth + 1, myId, dx - 0.1 / (depth + 1));
    const right = fib(n - 2, depth + 1, myId, dx + 0.1 / (depth + 1));
    const result = left + right;
    cache[n] = result;
    nodes.find(nd => nd.id === `n${myId}`).label = `${result}`;
    nodes.find(nd => nd.id === `n${myId}`).status = 'success';
    snapTree('return', `fib(${n}) = ${left} + ${right} = ${result}.`, 'Merge sub-results.', 4);
    return result;
  }

  snapTree('init', 'Recursion Trees — Visualising fib(5).', 'Observe how sub-problems overlap. This motivates Dynamic Programming!', 1);
  fib(5, 0, null, 0.5);
  snapTree('final', 'fib(5) = 5. Observe the repeated sub-calls — DP eliminates this redundancy.', 'Memoisation would cut computation from O(2^n) to O(n).', 6);
  return steps;
}

export const recursionTreesCode = {
  python: `def fib(n):               # 1
    if n <= 1: return n      # 2 — base case
    left  = fib(n-1)         # 3 — left subtree
    right = fib(n-2)         # 4 — right subtree
    return left + right      # 5 — combine`,
  cpp: `int fib(int n){
    if(n<=1) return n;
    return fib(n-1)+fib(n-2);
}`,
};
