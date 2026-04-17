// src/algorithms/backtracking-extras/steps.js
// Rat in a Maze, Subset Sum, Permutations, N-Queens Optimized

const mkStep = (overrides) => ({
  action: 'idle', explanation: '', subExplanation: '', highlightedLine: -1,
  array: [], indices: [], sortedIndices: [], pointers: [], inactiveIndices: [],
  board: null, treeState: { nodes: [], edges: [] }, logs: [], matrixState: null, graphState: null,
  ...overrides,
});

// ── RAT IN A MAZE ───────────────────────────────────────────────────────────
// 0 = blocked, 1 = open, 2 = current path, 3 = backtracked
export function generateRatInMazeSteps(size = 4) {
  const steps = [];
  const MAZE = [
    [1, 0, 0, 1],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [0, 1, 1, 1],
  ];
  const n = 4;
  const board = MAZE.map(r => [...r]);
  const logs = [];

  const addLog = (type, msg) => {
    logs.push({ type, message: msg, time: Date.now() });
    if (logs.length > 8) logs.shift();
  };

  const snap = (action, r, c, explanation, sub, line) => {
    steps.push(mkStep({ action, board: board.map(row => [...row]), indices: r >= 0 ? [r * n + c] : [], explanation, subExplanation: sub, highlightedLine: line, logs: [...logs] }));
  };

  snap('init', -1, -1, 'Starting Rat in a Maze.', 'Find a path from (0,0) to (3,3). 1=open, 0=blocked.', 1);

  function solve(r, c) {
    if (r === n - 1 && c === n - 1) {
      board[r][c] = 2;
      addLog('success', `Reached destination (${r},${c})!`);
      snap('success', r, c, `Reached destination (${r},${c})!`, 'Path found!', 8);
      return true;
    }
    if (r < 0 || r >= n || c < 0 || c >= n || board[r][c] !== 1) return false;

    board[r][c] = 2; // mark as part of path
    addLog('place', `Moved to (${r},${c}).`);
    snap('move', r, c, `Rat moves to (${r},${c}).`, 'Mark as part of current path.', 4);

    const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const dNames = ['Down', 'Right', 'Up', 'Left'];
    for (let d = 0; d < 4; d++) {
      const [dr, dc] = dirs[d];
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && board[nr][nc] === 1) {
        snap('try', r, c, `Trying to move ${dNames[d]} → (${nr},${nc}).`, board[nr][nc] === 1 ? 'Cell is open.' : 'Cell is blocked.', 5);
        if (solve(nr, nc)) return true;
      }
    }

    board[r][c] = 3; // backtrack
    addLog('backtrack', `Backtracking from (${r},${c}).`);
    snap('backtrack', r, c, `Backtracking from (${r},${c}) — no forward path.`, 'Mark cell as backtracked.', 6);
    board[r][c] = 1; // restore
    return false;
  }

  const found = solve(0, 0);
  if (!found) snap('fail', -1, -1, 'No path found!', 'Maze has no solution.', 9);
  return steps;
}

export const ratInMazeCode = {
  python: `def solve_maze(maze, x, y, n, path):
    if x==n-1 and y==n-1:         # 1 — reached!
        path.append((x,y))
        return True
    if 0<=x<n and 0<=y<n and maze[x][y]==1: # 2
        maze[x][y] = 2            # 3 — mark path
        path.append((x,y))
        dirs = [(1,0),(0,1),(-1,0),(0,-1)]
        for dx,dy in dirs:         # 4 — try all
            if solve_maze(maze,x+dx,y+dy,n,path):
                return True
        maze[x][y] = 1            # 5 — backtrack
        path.pop()
    return False`,
  cpp: `bool solveMaze(int maze[][4],int x,int y,int n){
    if(x==n-1&&y==n-1) return true;
    if(x<0||x>=n||y<0||y>=n||maze[x][y]!=1) return false;
    maze[x][y]=2;
    int dr[]={1,0,-1,0}, dc[]={0,1,0,-1};
    for(int d=0;d<4;d++)
        if(solveMaze(maze,x+dr[d],y+dc[d],n)) return true;
    maze[x][y]=1; return false;
}`,
};

// ── SUBSET SUM ──────────────────────────────────────────────────────────────
export function generateSubsetSumSteps(arr = [3, 1, 4, 2, 2], target = 6) {
  const steps = [];
  const n = arr.length;
  let nodeId = 0;
  const nodes = [];
  const edges = [];
  const logs = [];

  const addLog = (type, msg) => {
    logs.push({ type, message: msg, time: Date.now() });
    if (logs.length > 6) logs.shift();
  };

  // Place node at normalized position
  let solution = null;

  function snap(action, active, array, explanation, sub, line) {
    nodes.forEach(n => { n.status = 'default'; });
    if (active !== null) {
      const nd = nodes.find(n => n.id === `n${active}`);
      if (nd) nd.status = 'active';
    }
    steps.push(mkStep({ action, treeState: { nodes: nodes.map(n => ({ ...n })), edges: [...edges] }, array: [...array], logs: [...logs], explanation, subExplanation: sub, highlightedLine: line }));
  }

  snap('init', null, arr, `Finding subset of [${arr.join(', ')}] that sums to ${target}.`, 'Explore include/exclude tree.', 1);

  function bt(idx, current, sum, depth, parentId, dx) {
    const myId = nodeId++;
    const label = idx < n ? `${arr[idx]}` : `✓`;
    nodes.push({ id: `n${myId}`, label, status: 'active', dx, dy: depth, depth });
    if (parentId !== null) edges.push({ source: `n${parentId}`, target: `n${myId}` });

    if (sum === target) {
      solution = [...current];
      nodes[nodes.length - 1].status = 'success';
      addLog('success', `Found! Subset: [${current.join(',')}] = ${target}`);
      snap('success', null, arr, `Subset found: [${current.join(', ')}] = ${target}!`, 'Solution exists.', 7);
      return true;
    }
    if (idx >= n || sum > target) {
      nodes[nodes.length - 1].status = 'failed';
      addLog('prune', `Pruned at sum=${sum}, need=${target}.`);
      snap('fail', null, arr, sum > target ? `Sum ${sum} exceeds target ${target}. Prune.` : `Index out of bounds. Dead end.`, 'Backtracking.', 5);
      return false;
    }

    addLog('explore', `At index ${idx}, sum=${sum}. Trying include ${arr[idx]}.`);
    snap('explore', myId, arr, `At index ${idx}, current sum=${sum}. Include ${arr[idx]}?`, `Include: sum=${sum + arr[idx]}. Exclude: sum=${sum}.`, 3);

    // Include
    current.push(arr[idx]);
    if (bt(idx + 1, current, sum + arr[idx], depth + 1, myId, Math.max(0, dx - 0.06))) return true;
    current.pop();

    // Exclude
    addLog('exclude', `Excluding ${arr[idx]}, sum stays ${sum}.`);
    if (bt(idx + 1, current, sum, depth + 1, myId, dx + 0.06)) return true;

    return false;
  }

  bt(0, [], 0, 0, null, 0.5);
  if (!solution) snap('fail', null, arr, `No subset sums to ${target}.`, 'Full tree explored.', 8);
  return steps;
}

export const subsetSumCode = {
  python: `def subset_sum(arr, target, idx=0, cur=[], s=0):
    if s == target:               # 1 — found!
        return [*cur]
    if idx >= len(arr) or s > target: # 2 — prune
        return None
    # Include arr[idx]
    cur.append(arr[idx])          # 3
    r = subset_sum(arr, target, idx+1, cur, s+arr[idx])
    if r: return r
    cur.pop()                     # 4 — backtrack
    # Exclude arr[idx]
    return subset_sum(arr, target, idx+1, cur, s)`,
  cpp: `bool subsetSum(int arr[],int n,int tgt,int idx,int sum){
    if(sum==tgt) return true;
    if(idx>=n||sum>tgt) return false;
    return subsetSum(arr,n,tgt,idx+1,sum+arr[idx])   // include
        || subsetSum(arr,n,tgt,idx+1,sum);             // exclude
}`,
};

// ── PERMUTATIONS ─────────────────────────────────────────────────────────────
export function generatePermutationsSteps(arr = [1, 2, 3]) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  const logs = [];
  let nodeId = 0;
  const nodes = [];
  const edges = [];
  const results = [];

  const addLog = (type, msg) => {
    logs.push({ type, message: msg, time: Date.now() });
    if (logs.length > 6) logs.shift();
  };

  function snap(action, arrayState, explanation, sub, line) {
    steps.push(mkStep({ action, array: [...arrayState], treeState: { nodes: nodes.map(n => ({ ...n })), edges: [...edges] }, logs: [...logs], explanation, subExplanation: sub, highlightedLine: line }));
  }

  snap('init', a, `Generating all permutations of [${a.join(', ')}].`, `Expected ${n === 3 ? 6 : '...'}! permutations via backtracking.`, 1);

  function bt(start, depth, parentId, dx) {
    if (start === n) {
      results.push([...a]);
      const myId = nodeId++;
      nodes.push({ id: `n${myId}`, label: a.join(''), status: 'success', dx, dy: depth });
      if (parentId !== null) edges.push({ source: `n${parentId}`, target: `n${myId}` });
      addLog('success', `Found: [${a.join(',')}]`);
      snap('result', a, `Permutation found: [${a.join(', ')}].`, `Total so far: ${results.length}.`, 3);
      return;
    }

    const myId = nodeId++;
    nodes.push({ id: `n${myId}`, label: a.slice(start).join(''), status: 'active', dx, dy: depth });
    if (parentId !== null) edges.push({ source: `n${parentId}`, target: `n${myId}` });

    const step = 1 / (n + 1);
    for (let i = start; i < n; i++) {
      if (i !== start) {
        [a[start], a[i]] = [a[i], a[start]];
        addLog('swap', `Swap index ${start} and ${i}: [${a.join(',')}]`);
        snap('swap', a, `Swapping index ${start} and ${i} → [${a.join(', ')}].`, `Fix position ${start} = ${a[start]}.`, 5);
      }
      bt(start + 1, depth + 1, myId, dx + (i - start) * step - step * (n - start - 1) / 2);
      if (i !== start) {
        [a[start], a[i]] = [a[i], a[start]];
        addLog('backtrack', `Backtracking: restore [${a.join(',')}]`);
        snap('backtrack', a, `Backtracking: restore [${a.join(', ')}].`, `Remove fix at position ${start}.`, 7);
      }
    }
  }

  bt(0, 0, null, 0.5);
  snap('final', a, `All ${results.length} permutations generated!`, `Permutations: ${results.map(p => '[' + p.join(',') + ']').join(' ')}.`, 8);
  return steps;
}

export const permutationsCode = {
  python: `def permutations(arr, start=0):
    if start == len(arr)-1:       # 1
        print(arr)                # 2 — record
        return
    for i in range(start, len(arr)): # 3
        arr[start], arr[i] = arr[i], arr[start]  # 4 — swap
        permutations(arr, start+1)   # 5 — recurse
        arr[start], arr[i] = arr[i], arr[start]  # 6 — backtrack`,
  cpp: `void permute(int arr[], int start, int n){
    if(start==n-1){ /* print arr */; return; }
    for(int i=start;i<n;i++){
        swap(arr[start],arr[i]);   // fix position
        permute(arr,start+1,n);
        swap(arr[start],arr[i]);   // restore
    }
}`,
};

// ── N-QUEENS OPTIMIZED ──────────────────────────────────────────────────────
// Uses bitmask optimization (same visual as standard N-Queens)
export { generate4QueensSteps as generateNQueensOptimizedSteps, queensCode as nQueensOptimizedCode } from '../4-queens/steps';
