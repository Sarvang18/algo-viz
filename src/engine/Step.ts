export type StepAction = "compare" | "swap" | "visit" | "highlight" | "found" | "custom" | "pointer";
export type DSType = 'array' | 'tree' | 'hanoi' | 'matrix';

export interface DSNode {
  id: string;
  value: number | string;
  left?: string;       // For Tree
  right?: string;      // For Tree
  x?: number;          // Visual Layout (optional)
  y?: number;
}

export type DSSnapshot = 
  | { type: 'array', data: (number | string)[] }
  | { type: 'tree', root: string | null, nodes: Record<string, DSNode> }
  | { type: 'hanoi', pegs: number[][] }
  | { type: 'matrix', data: (string|number|null)[][], boardType: 'chess' | 'sudoku' | 'grid' };

export interface Step<T = DSSnapshot> {
  action: StepAction;
  indices: (number | string)[]; // Array indices OR Node IDs
  snapshot: T;
  meta: {
    line: number;
    vars: Record<string, any>;
  };
}
