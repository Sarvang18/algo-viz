import type { Step, DSSnapshot } from '../Step';

export function* dpGrids(): Generator<Step<DSSnapshot>, void, unknown> {
  const grid = [
    [1, 3, 1, 2, 5],
    [4, 2, 1, 3, 1],
    [5, 6, 2, 1, 4],
    [2, 1, 3, 5, 2],
    [3, 2, 4, 1, 1],
  ];
  const rows = grid.length;
  const cols = grid[0].length;

  const dp: number[][] = grid.map(r => [...r]);
  const display: (string | number | null)[][] = grid.map(r => [...r]);

  yield {
    action: "custom", indices: [],
    snapshot: { type: 'matrix', data: display.map(r => [...r]), boardType: 'grid' },
    meta: { line: 1, vars: { rows, cols, problem: 'Min Cost Path (top-left → bottom-right)' } }
  };

  // Fill first row
  for (let j = 1; j < cols; j++) {
    dp[0][j] += dp[0][j - 1];
    display[0][j] = dp[0][j];
    yield {
      action: "highlight", indices: [`0,${j}`],
      snapshot: { type: 'matrix', data: display.map(r => [...r]), boardType: 'grid' },
      meta: { line: 3, vars: { row: 0, col: j, 'dp[0][j]': dp[0][j] } }
    };
  }

  // Fill first column
  for (let i = 1; i < rows; i++) {
    dp[i][0] += dp[i - 1][0];
    display[i][0] = dp[i][0];
    yield {
      action: "highlight", indices: [`${i},0`],
      snapshot: { type: 'matrix', data: display.map(r => [...r]), boardType: 'grid' },
      meta: { line: 5, vars: { row: i, col: 0, 'dp[i][0]': dp[i][0] } }
    };
  }

  // Fill rest of the grid
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      yield {
        action: "compare", indices: [`${i - 1},${j}`, `${i},${j - 1}`],
        snapshot: { type: 'matrix', data: display.map(r => [...r]), boardType: 'grid' },
        meta: { line: 8, vars: { row: i, col: j, fromTop: dp[i - 1][j], fromLeft: dp[i][j - 1] } }
      };

      dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
      display[i][j] = dp[i][j];

      yield {
        action: "found", indices: [`${i},${j}`],
        snapshot: { type: 'matrix', data: display.map(r => [...r]), boardType: 'grid' },
        meta: { line: 9, vars: { row: i, col: j, 'dp[i][j]': dp[i][j], cellCost: grid[i][j] } }
      };
    }
  }

  // Backtrack the optimal path
  const path: string[] = [];
  let r = rows - 1, c = cols - 1;
  path.push(`${r},${c}`);
  while (r > 0 || c > 0) {
    if (r === 0) { c--; }
    else if (c === 0) { r--; }
    else if (dp[r - 1][c] < dp[r][c - 1]) { r--; }
    else { c--; }
    path.push(`${r},${c}`);
  }

  yield {
    action: "found", indices: path,
    snapshot: { type: 'matrix', data: display.map(r => [...r]), boardType: 'grid' },
    meta: { line: 14, vars: { minCost: dp[rows - 1][cols - 1], path: 'Optimal path highlighted' } }
  };
}

export const dpGridsCode = `function minCostPath(grid) {
  const rows = grid.length, cols = grid[0].length;
  let dp = grid.map(r => [...r]);
  for (let j = 1; j < cols; j++) dp[0][j] += dp[0][j - 1];
  for (let i = 1; i < rows; i++) dp[i][0] += dp[i - 1][0];
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] = grid[i][j] + Math.min(
        dp[i - 1][j],
        dp[i][j - 1]
      );
    }
  }
  return dp[rows - 1][cols - 1];
}`;
