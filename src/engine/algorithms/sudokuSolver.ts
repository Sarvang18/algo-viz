import type { Step, DSSnapshot } from '../Step';

export function* sudokuSolver(): Generator<Step<DSSnapshot>, void, unknown> {
  // Pre-configured Solvable Puzzle
  const board = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ];

  yield { action: "custom", indices: [], snapshot: { type: 'matrix', data: board.map(r=>[...r]), boardType: 'sudoku' }, meta: { line: 1, vars: { puzzle: "9x9 Seed Loaded" } } };

  function isValid(b: number[][], row: number, col: number, k: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (b[i][col] === k) return false;
      if (b[row][i] === k) return false;
      if (b[3*Math.floor(row/3) + Math.floor(i/3)][3*Math.floor(col/3) + i%3] === k) return false;
    }
    return true;
  }

  function* solve(b: number[][]): Generator<Step<DSSnapshot>, boolean, unknown> {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (b[i][j] === 0) {
          for (let k = 1; k <= 9; k++) {
            yield { action: "highlight", indices: [`${i},${j}`], snapshot: { type: 'matrix', data: b.map(r=>[...r]), boardType: 'sudoku' }, meta: { line: 5, vars: { row: i, col: j, trying_value: k } } };
            
            if (isValid(b, i, j, k)) {
              b[i][j] = k;
              yield { action: "compare", indices: [`${i},${j}`], snapshot: { type: 'matrix', data: b.map(r=>[...r]), boardType: 'sudoku' }, meta: { line: 7, vars: { row: i, col: j, placed_value: k } } };
              
              if (yield* solve(b)) return true;
              
              b[i][j] = 0;
              yield { action: "swap", indices: [`${i},${j}`], snapshot: { type: 'matrix', data: b.map(r=>[...r]), boardType: 'sudoku' }, meta: { line: 9, vars: { row: i, col: j, status: "Revert/Backtrack!" } } };
            }
          }
          return false; 
        }
      }
    }
    return true; 
  }

  yield* solve(board);
  yield { action: "found", indices: [], snapshot: { type: 'matrix', data: board.map(r=>[...r]), boardType: 'sudoku' }, meta: { line: 15, vars: { result: "Solved Sudoku Completely!" } } };
}

export const sudokuSolverCode = `function solveSudoku(board) {
  function isValid(row, col, k) {
    for(let i=0; i<9; i++) {
      if(board[i][col] === k) return false;
      if(board[row][i] === k) return false;
      if(board[3*Math.floor(row/3) + Math.floor(i/3)][3*Math.floor(col/3) + i%3] === k) return false;
    }
    return true;
  }
  
  function solve() {
    for(let i=0; i<9; i++) {
      for(let j=0; j<9; j++) {
        if(board[i][j] === 0) {
          for(let k=1; k<=9; k++) {
            if(isValid(i, j, k)) {
              board[i][j] = k;
              if(solve()) return true;
              board[i][j] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  solve();
}`;
