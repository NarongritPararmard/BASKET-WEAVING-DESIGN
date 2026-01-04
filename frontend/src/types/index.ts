export type RowStatus = 'not-started' | 'in-progress' | 'completed' | 'reworked';

export interface PatternState {
  numAxes: number;
  numRows: number;
  grid: boolean[][]; // [row][column]
  rowStatuses: RowStatus[];
  currentRow: number;
  isWeavingMode: boolean;
  cellColor: string;
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
