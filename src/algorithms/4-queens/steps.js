export function generate4QueensSteps(n = 4) {
  const steps = [];
  const board = Array(n).fill().map(() => Array(n).fill(0));
  const MAX_STEPS = 3000; // prevent runaway for large n

  // Track logic stream events
  const logicLog = [];

  // For large boards, skip tree (it becomes unreadably large)
  const buildTree = n <= 5;
  let treeNodes = buildTree ? [{ id: 'root', label: 'Start', dx: 0.5, dy: 0, status: 'active' }] : [];
  let treeEdges = [];
  let nodeIdCounter = 1;

  const pushStep = (action, row, col, explanation, subExplanation, hLine, nodeStatus = null, currentNodeId = null) => {
    if (steps.length >= MAX_STEPS) return; // hard cap
    // Update Node Status if provided
    if (buildTree && nodeStatus && currentNodeId) {
        const node = treeNodes.find(n => n.id === currentNodeId);
        if (node) node.status = nodeStatus;
    }

    steps.push({
      action: action,
      boardState: JSON.parse(JSON.stringify(board)),
      board: JSON.parse(JSON.stringify(board)),
      conflictCell: [row, col],
      explanation: explanation,
      subExplanation: subExplanation,
      highlightedLine: hLine,
      logs: [...logicLog].slice(-5),
      treeState: buildTree
        ? { nodes: JSON.parse(JSON.stringify(treeNodes)), edges: JSON.parse(JSON.stringify(treeEdges)) }
        : { nodes: [], edges: [] },
    });
  };

  const addLog = (msg) => {
      logicLog.push(msg);
      if (logicLog.length > 50) logicLog.shift();
  };

  addLog('Initialization: Starting N-Queens constraint solver.');
  pushStep('initial', -1, -1, 'Algorithm started.', `Attempting to place ${n} queens on a ${n}x${n} board.`, 0);

  function isSafe(board, row, col) {
    for (let i = 0; i < row; i++) if (board[i][col] === 1) return false;
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j] === 1) return false;
    for (let i = row, j = col; i >= 0 && j < n; i--, j++) if (board[i][j] === 1) return false;
    return true;
  }

  function solve(row, parentNodeId, minX, maxX) {
    if (steps.length >= MAX_STEPS) return false; // early exit if cap reached
    if (row >= n) {
      addLog('Success: Absolute solution achieved mapping N non-threatening placements.');
      pushStep('complete', -1, -1, 'All queens placed successfully.', 'A valid absolute solution has been found.', 2, 'success', parentNodeId);
      return true;
    }

    const stepWidth = (maxX - minX) / n;

    for (let col = 0; col < n; col++) {
      if (steps.length >= MAX_STEPS) return false;
      let currentNodeId = parentNodeId;
      if (buildTree) {
        currentNodeId = `node-${nodeIdCounter++}`;
        const curX = minX + (col * stepWidth) + (stepWidth / 2);
        treeNodes.push({ id: currentNodeId, label: `(${row+1},${col+1})`, dx: curX, dy: row + 1, status: 'active' });
        treeEdges.push({ source: parentNodeId, target: currentNodeId });
      }

      addLog(`Search: Evaluating domain validity at [Row ${row+1}, Col ${col+1}].`);
      pushStep('attempt', row, col, `Attempting to place queen at Row ${row+1}, Col ${col+1}.`, `Running is_safe check constraint.`, 5);

      if (isSafe(board, row, col)) {
        board[row][col] = 1;
        addLog(`Placed: Constraints satisfied. Setting Q at [${row+1},${col+1}].`);
        pushStep('place', row, col, `Queen placed safely at Row ${row+1}, Col ${col+1}.`, `Moving depth-first to the next row (Row ${row+2}).`, 6);

        if (solve(row + 1, currentNodeId, minX + col * stepWidth, minX + (col + 1) * stepWidth)) return true;

        board[row][col] = 0;
        addLog(`Backtrack: Dead end reached. Pruning placement at [${row+1},${col+1}].`);
        pushStep('backtrack', row, col, `Backtracking from Row ${row+1}, Col ${col+1}.`, `No valid placement exists in subsequent rows. Removing queen.`, 10, 'failed', currentNodeId);
      } else {
        addLog(`Conflict: Threat collision detected at [${row+1},${col+1}]. Abandoning branch.`);
        pushStep('conflict', row, col, `Conflict at Row ${row+1}, Col ${col+1}.`, `Queen cannot be placed here due to collision.`, 5, 'failed', currentNodeId);
      }
    }

    // Mark parent as failed since no children worked
    if (buildTree && parentNodeId !== 'root') {
        const p = treeNodes.find(x => x.id === parentNodeId);
        if (p) p.status = 'failed';
    }
    return false;
  }

  solve(0, 'root', 0, 1);

  if (steps[steps.length - 1].action !== 'complete') {
      addLog('Terminated: Exhaustive search complete. No configuration found.');
      pushStep('complete', -1, -1, 'Search exhausted.', 'No valid configuration exists.', 13);
  }

  return steps;
}

export const queensCode = {
  python: `def solve_n_queens(board, row, n):
    if row >= n:
        return True # Solution found
        
    for col in range(n):
        if is_safe(board, row, col):
            board[row][col] = 1 # Place queen
            
            if solve_n_queens(board, row + 1, n):
                return True
                
            board[row][col] = 0 # Backtrack
            
    return False`,
  
  cpp: `bool solveNQueens(int board[][N], int row, int n) {
    if (row >= n) {
        return true; // Solution found
    }
    
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row][col] = 1; // Place queen
            
            if (solveNQueens(board, row + 1, n)) {
                return true;
            }
            
            board[row][col] = 0; // Backtrack
        }
    }
    return false;
}`
};
