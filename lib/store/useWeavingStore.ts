import { create } from "zustand";
import type {
  PatternGrid,
  WeavingRow,
  CellState,
  RowStatus,
  AppState,
  VerticalAxisConfig,
  StripInitializationRule,
} from "@/types";
import { cellsToRanges } from "@/lib/utils/rangeUtils";
import { extractRowRanges, extractAllRowRanges, type ExtractedRowRanges } from "@/lib/weaving/rangeExtraction";
import { calculateCenterAxisIndex, getCenterAxisConfig } from "@/lib/weaving/centerAxis";
import {
  generateStripInitializationRule,
  generateStripInitializationRuleFromConfig,
  generateAllStripInitializationRules,
} from "@/lib/weaving/stripInitialization";
import {
  generateLeftDirectionInstruction,
  generateRightDirectionInstruction,
  generateBothDirectionInstructions,
  generateCompleteRowInstructions,
  type WeavingInstruction,
} from "@/lib/weaving/directionInstructions";

interface WeavingStore extends AppState {
  // Actions
  setAxisCount: (count: number) => void;
  setCenterAxisIndex: (index: number) => void;
  setTotalRows: (rows: number) => void;
  setAvailableColors: (colors: string[]) => void;
  initializePattern: () => void;
  toggleCell: (rowIndex: number, cellIndex: number, color?: string) => void;
  setCellColor: (rowIndex: number, cellIndex: number, color: string) => void;
  setCellsInRange: (rowIndex: number, startCell: number, endCell: number, color?: string) => void;
  setMode: (mode: "design" | "confirm" | "weave") => void;
  setCurrentRow: (rowIndex: number | null) => void;
  updateRowStatus: (rowIndex: number, status: RowStatus) => void;
  resetPattern: () => void;
  confirmPattern: () => void;
  // Range extraction actions
  extractRowRanges: (rowIndex: number) => ExtractedRowRanges | null;
  extractAllRowRanges: () => ExtractedRowRanges[];
  // Strip initialization actions
  generateStripInitializationRule: (rowIndex: number) => StripInitializationRule | null;
  generateAllStripInitializationRules: () => Array<{ rowIndex: number; rule: StripInitializationRule }>;
  // Direction instruction actions
  generateLeftDirectionInstruction: (rowIndex: number) => WeavingInstruction | null;
  generateRightDirectionInstruction: (rowIndex: number) => WeavingInstruction | null;
  generateBothDirectionInstructions: (rowIndex: number) => { leftInstruction: WeavingInstruction; rightInstruction: WeavingInstruction } | null;
  generateCompleteRowInstructions: (rowIndex: number) => {
    initialization: string;
    leftInstruction: WeavingInstruction;
    rightInstruction: WeavingInstruction;
    fullText: string;
  } | null;
}

const defaultAxisConfig: VerticalAxisConfig = getCenterAxisConfig(16);

const defaultColors = ["#8B4513", "#D2691E", "#CD853F", "#A0522D"];

const createEmptyRow = (numAxes: number, rowIndex: number): WeavingRow => {
  const cells: CellState[] = Array(numAxes)
    .fill(null)
    .map((_, axisIndex) => ({
      colored: false,
      axisIndex,
      rowIndex,
    }));

  return {
    index: rowIndex,
    cells,
    status: "notStarted",
    ranges: cellsToRanges(cells),
  };
};

const createEmptyPatternGrid = (): PatternGrid => {
  const axisConfig = { ...defaultAxisConfig };
  const totalRows = 10;
  const rows = Array(totalRows)
    .fill(null)
    .map((_, index) => createEmptyRow(axisConfig.count, index));

  return {
    axisConfig,
    totalRows,
    rows,
    availableColors: [...defaultColors],
    isConfirmed: false,
  };
};

export const useWeavingStore = create<WeavingStore>((set) => ({
  // Initial state
  patternGrid: createEmptyPatternGrid(),
  currentRowIndex: null,
  mode: "design",

  // Actions
  setAxisCount: (count) =>
    set((state) => {
      // Auto-calculate center axis when axis count changes
      const newAxisConfig = getCenterAxisConfig(count, state.patternGrid.axisConfig.centerAxisIndex);

      const newRows = state.patternGrid.rows.map((row) => {
        const newCells: CellState[] = Array(count)
          .fill(null)
          .map((_, axisIndex) => {
            // Preserve existing cells if within range
            if (axisIndex < row.cells.length) {
              return { ...row.cells[axisIndex], axisIndex };
            }
            // Create new empty cells
            return {
              colored: false,
              axisIndex,
              rowIndex: row.index,
            };
          });

        return {
          ...row,
          cells: newCells,
          ranges: cellsToRanges(newCells),
        };
      });

      return {
        patternGrid: {
          ...state.patternGrid,
          axisConfig: newAxisConfig,
          rows: newRows,
        },
      };
    }),

  setCenterAxisIndex: (index) =>
    set((state) => {
      const totalAxes = state.patternGrid.axisConfig.count;
      if (index >= 0 && index < totalAxes) {
        const newAxisConfig: VerticalAxisConfig = {
          ...state.patternGrid.axisConfig,
          centerAxisIndex: index,
        };
        return {
          patternGrid: {
            ...state.patternGrid,
            axisConfig: newAxisConfig,
          },
        };
      }
      return state;
    }),

  setTotalRows: (totalRows) =>
    set((state) => {
      const currentRows = state.patternGrid.rows;
      const newRows: WeavingRow[] = [];

      for (let i = 0; i < totalRows; i++) {
        if (i < currentRows.length) {
          // Keep existing row
          newRows.push(currentRows[i]);
        } else {
          // Create new empty row
          newRows.push(createEmptyRow(state.patternGrid.axisConfig.count, i));
        }
      }

      return {
        patternGrid: {
          ...state.patternGrid,
          totalRows,
          rows: newRows,
        },
      };
    }),

  setAvailableColors: (colors) =>
    set((state) => ({
      patternGrid: {
        ...state.patternGrid,
        availableColors: colors,
      },
    })),

  initializePattern: () =>
    set((state) => ({
      patternGrid: createEmptyPatternGrid(),
      currentRowIndex: null,
      mode: "design",
    })),

  toggleCell: (rowIndex, cellIndex, color) =>
    set((state) => {
      const newRows = [...state.patternGrid.rows];
      const row = { ...newRows[rowIndex] };
      const cells = [...row.cells];
      const cell = { ...cells[cellIndex] };

      if (cell.colored) {
        cell.colored = false;
        cell.color = undefined;
      } else {
        cell.colored = true;
        cell.color = color || state.patternGrid.availableColors[0];
      }

      cells[cellIndex] = cell;
      row.cells = cells;
      row.ranges = cellsToRanges(cells);
      newRows[rowIndex] = row;

      return {
        patternGrid: {
          ...state.patternGrid,
          rows: newRows,
        },
      };
    }),

  setCellColor: (rowIndex, cellIndex, color) =>
    set((state) => {
      const newRows = [...state.patternGrid.rows];
      const row = { ...newRows[rowIndex] };
      const cells = [...row.cells];
      const cell = { ...cells[cellIndex] };

      if (cell.colored) {
        cell.color = color;
        cells[cellIndex] = cell;
        row.cells = cells;
        row.ranges = cellsToRanges(cells);
        newRows[rowIndex] = row;
      }

      return {
        patternGrid: {
          ...state.patternGrid,
          rows: newRows,
        },
      };
    }),

  setCellsInRange: (rowIndex, startCell, endCell, color) =>
    set((state) => {
      const newRows = [...state.patternGrid.rows];
      const row = { ...newRows[rowIndex] };
      const cells = [...row.cells];
      const selectedColor = color || state.patternGrid.availableColors[0];

      const start = Math.min(startCell, endCell);
      const end = Math.max(startCell, endCell);

      for (let i = start; i <= end; i++) {
        if (i >= 0 && i < cells.length) {
          const cell = { ...cells[i] };
          if (cell.colored) {
            cell.colored = false;
            cell.color = undefined;
          } else {
            cell.colored = true;
            cell.color = selectedColor;
          }
          cells[i] = cell;
        }
      }

      row.cells = cells;
      row.ranges = cellsToRanges(cells);
      newRows[rowIndex] = row;

      return {
        patternGrid: {
          ...state.patternGrid,
          rows: newRows,
        },
      };
    }),

  setMode: (mode) => set({ mode }),

  setCurrentRow: (rowIndex) => set({ currentRowIndex: rowIndex }),

  updateRowStatus: (rowIndex, status) =>
    set((state) => {
      const newRows = [...state.patternGrid.rows];
      const row = { ...newRows[rowIndex], status };
      newRows[rowIndex] = row;

      return {
        patternGrid: {
          ...state.patternGrid,
          rows: newRows,
        },
      };
    }),

  resetPattern: () =>
    set((state) => {
      const axisConfig = state.patternGrid.axisConfig;
      const totalRows = state.patternGrid.totalRows;
      const availableColors = state.patternGrid.availableColors;

      return {
        patternGrid: {
          axisConfig,
          totalRows,
          rows: Array(totalRows)
            .fill(null)
            .map((_, index) => createEmptyRow(axisConfig.count, index)),
          availableColors,
          isConfirmed: false,
        },
        currentRowIndex: null,
        mode: "design",
      };
    }),

  confirmPattern: () =>
    set((state) => ({
      patternGrid: {
        ...state.patternGrid,
        isConfirmed: true,
      },
    })),

  // Range extraction actions
  extractRowRanges: (rowIndex) => {
    const state = useWeavingStore.getState();
    const row = state.patternGrid.rows[rowIndex];
    if (!row) return null;
    return extractRowRanges(row, state.patternGrid.axisConfig.count);
  },

  extractAllRowRanges: () => {
    const state = useWeavingStore.getState();
    return extractAllRowRanges(state.patternGrid.rows, state.patternGrid.axisConfig.count);
  },

  // Strip initialization actions
  generateStripInitializationRule: (rowIndex) => {
    const state = useWeavingStore.getState();
    const row = state.patternGrid.rows[rowIndex];
    if (!row) return null;

    // Extract colored ranges for this row
    const extracted = extractRowRanges(row, state.patternGrid.axisConfig.count);
    if (!extracted) return null;

    return generateStripInitializationRule(
      extracted.coloredRanges,
      state.patternGrid.axisConfig.centerAxisIndex,
      state.patternGrid.axisConfig.count
    );
  },

  generateAllStripInitializationRules: () => {
    const state = useWeavingStore.getState();
    const extractedRanges = extractAllRowRanges(
      state.patternGrid.rows,
      state.patternGrid.axisConfig.count
    );

    return generateAllStripInitializationRules(
      extractedRanges,
      state.patternGrid.axisConfig.centerAxisIndex,
      state.patternGrid.axisConfig.count
    );
  },

  // Direction instruction actions
  generateLeftDirectionInstruction: (rowIndex) => {
    const state = useWeavingStore.getState();
    const row = state.patternGrid.rows[rowIndex];
    if (!row) return null;

    return generateLeftDirectionInstruction(
      row.cells,
      state.patternGrid.axisConfig.centerAxisIndex
    );
  },

  generateRightDirectionInstruction: (rowIndex) => {
    const state = useWeavingStore.getState();
    const row = state.patternGrid.rows[rowIndex];
    if (!row) return null;

    return generateRightDirectionInstruction(
      row.cells,
      state.patternGrid.axisConfig.centerAxisIndex
    );
  },

  generateBothDirectionInstructions: (rowIndex) => {
    const state = useWeavingStore.getState();
    const row = state.patternGrid.rows[rowIndex];
    if (!row) return null;

    return generateBothDirectionInstructions(
      row.cells,
      state.patternGrid.axisConfig.centerAxisIndex
    );
  },

  generateCompleteRowInstructions: (rowIndex) => {
    const state = useWeavingStore.getState();
    const row = state.patternGrid.rows[rowIndex];
    if (!row) return null;

    // Get strip initialization rule
    const extracted = extractRowRanges(row, state.patternGrid.axisConfig.count);
    if (!extracted) return null;

    const stripRule = generateStripInitializationRule(
      extracted.coloredRanges,
      state.patternGrid.axisConfig.centerAxisIndex,
      state.patternGrid.axisConfig.count
    );

    return generateCompleteRowInstructions(
      row.cells,
      state.patternGrid.axisConfig.centerAxisIndex,
      stripRule
    );
  },
}));
