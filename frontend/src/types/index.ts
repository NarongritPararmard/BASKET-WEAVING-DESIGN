export type RowStatus = 'not-started' | 'in-progress' | 'completed' | 'reworked';

export interface PatternState {
  numAxes: number;
  numRows: number;
  grid: (string | null)[][]; // [row][column] - null for empty, string for color
  rowStatuses: RowStatus[];
  currentRow: number;
  isWeavingMode: boolean;
  selectedColor: string;
  colorHistory: string[];
}

export interface WeavingInstruction {
  side: 'left' | 'right';
  steps: WeavingStep[];
}

export interface WeavingStep {
  type: 'cover' | 'skip' | 'init-center' | 'init-inside';
  count: number;
  axisIndices?: number[];
}
