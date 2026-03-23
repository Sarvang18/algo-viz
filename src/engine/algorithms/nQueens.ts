import type { Step, DSSnapshot } from '../Step';

export function* nQueens(): Generator<Step<DSSnapshot>, void, unknown> {
  const n = 8;
  const board = Array(n).fill(null).map(() => Array(n).fill(''));

  yield { action: "custom", indices: [], snapshot: { type: 'matrix', data: board.map(r=>[...r]), boardType: 'chess' }, meta: { line: 1, vars: { n: 8 } } };

  function isSafe(row: number, col: number) {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
      if (col - (row - i) >= 0 && board[i][col - (row - i)] === 'Q') return false;
      if (col + (row - i) < n && board[i][col + (row - i)] === 'Q') return false;
    }
    return true;
  }

  function* solve(row: number): Generator<Step<DSSnapshot>, boolean, unknown> {
    if (row === n) return true;

    for (let col = 0; col < n; col++) {
      yield { action: "highlight", indices: [`${row},${col}`], snapshot: { type: 'matrix', data: board.map(r=>[...r]), boardType: 'chess' }, meta: { line: 4, vars: { row, col } } };
      
      if (isSafe(row, col)) {
        board[row][col] = 'Q';
        yield { action: "compare", indices: [`${row},${col}`], snapshot: { type: 'matrix', data: board.map(r=>[...r]), boardType: 'chess' }, meta: { line: 6, vars: { row, col, status: "Placing ♛" } } };
        
        if (yield* solve(row + 1)) return true; 
        
        board[row][col] = '';
        yield { action: "swap", indices: [`${row},${col}`], snapshot: { type: 'matrix', data: board.map(r=>[...r]), boardType: 'chess' }, meta: { line: 9, vars: { row, col, status: "Backtracking (Invalid Route)" } } };
      }
    }
    return false;
  }

  yield* solve(0);
  yield { action: "found", indices: [], snapshot: { type: 'matrix', data: board.map(r=>[...r]), boardType: 'chess' }, meta: { line: 14, vars: { result: "Solved N-Queens (1st Safe Configuration)" } } };
}

export const nQueensCode = `function solveNQueens(n) {
  let board = Array(n).fill().map(() => Array(n).fill(''));
  
  function isSafe(row, col) {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
      if (col - (row - i) >= 0 && board[i][col - (row - i)] === 'Q') return false;
      if (col + (row - i) < n && board[i][col + (row - i)] === 'Q') return false;
    }
    return true;
  }

  function solve(row) {
    if (row === n) return true;
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 'Q';
        if (solve(row + 1)) return true;
        board[row][col] = '';
      }
    }
    return false;
  }
  
  solve(0);
  return board;
}`;
