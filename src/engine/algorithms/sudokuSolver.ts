import type { Step, DSSnapshot } from '../Step';

const initialBoard = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const boardSnapshot = (board: number[][]): DSSnapshot => ({
  type: 'matrix',
  data: board.map((row) => [...row]),
  boardType: 'sudoku',
});

const candidatesFor = (board: number[][], row: number, col: number): number[] => {
  const used = new Set<number>();
  for (let index = 0; index < 9; index++) {
    used.add(board[row][index]);
    used.add(board[index][col]);
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++)
    for (let c = boxCol; c < boxCol + 3; c++) used.add(board[r][c]);
  return Array.from({ length: 9 }, (_, index) => index + 1).filter((value) => !used.has(value));
};

const selectMostConstrainedCell = (board: number[][]): { row: number; col: number; candidates: number[] } | null => {
  let best: { row: number; col: number; candidates: number[] } | null = null;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== 0) continue;
      const candidates = candidatesFor(board, row, col);
      if (!best || candidates.length < best.candidates.length) best = { row, col, candidates };
      if (candidates.length <= 1) return best;
    }
  }
  return best;
};

export function* sudokuSolver(): Generator<Step<DSSnapshot>, void, unknown> {
  const board = initialBoard.map((row) => [...row]);
  let placements = 0;
  let backtracks = 0;

  yield { action: 'custom', indices: [], snapshot: boardSnapshot(board), meta: { line: 2, vars: { strategy: 'MRV (most constrained cell first)' } } };

  function* solve(): Generator<Step<DSSnapshot>, boolean, unknown> {
    const choice = selectMostConstrainedCell(board);
    if (!choice) return true;
    const { row, col, candidates } = choice;
    if (candidates.length === 0) return false;

    yield { action: 'visit', indices: [`${row},${col}`], snapshot: boardSnapshot(board), meta: { line: 5, vars: { row, col, candidates: candidates.join(', ') } } };
    for (const value of candidates) {
      yield { action: 'compare', indices: [`${row},${col}`], snapshot: boardSnapshot(board), meta: { line: 7, vars: { row, col, trying: value } } };
      board[row][col] = value;
      placements++;
      yield { action: 'highlight', indices: [`${row},${col}`], snapshot: boardSnapshot(board), meta: { line: 9, vars: { row, col, placed: value, placements } } };
      if (yield* solve()) return true;
      board[row][col] = 0;
      backtracks++;
      yield { action: 'swap', indices: [`${row},${col}`], snapshot: boardSnapshot(board), meta: { line: 12, vars: { row, col, removed: value, backtracks } } };
    }
    return false;
  }

  const solved = yield* solve();
  yield { action: solved ? 'found' : 'swap', indices: solved ? Array.from({ length: 81 }, (_, index) => `${Math.floor(index / 9)},${index % 9}`) : [], snapshot: boardSnapshot(board), meta: { line: 17, vars: { solved, placements, backtracks, result: board } } };
}

export const sudokuSolverCode = `function solveSudoku(board) {
  function solve() {
    const cell = selectMostConstrainedCell(board);
    if (!cell) return true;
    if (cell.candidates.length === 0) return false;
    for (const value of cell.candidates) {
      board[cell.row][cell.col] = value;
      if (solve()) return true;
      board[cell.row][cell.col] = 0;
    }
    return false;
  }
  return solve();
}`;
