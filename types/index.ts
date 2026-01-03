/**
 * PHASE 2 - CORE DATA MODELS
 * 
 * Core domain models for basket weaving pattern design and execution.
 * 
 * Key Concepts:
 * - Columns = vertical axes (circular in reality, linear in UI)
 * - Rows = weaving rounds (bottom → top)
 * - Pattern is defined by continuous ranges, not single cells
 */

// ============================================================================
// ROW STATUS
// ============================================================================

/**
 * Status of a weaving row during execution
 */
export type RowStatus = "notStarted" | "inProgress" | "completed" | "reworked";

// ============================================================================
// VERTICAL AXIS CONFIGURATION
// ============================================================================

/**
 * Configuration for vertical axes (stakes)
 * 
 * Vertical axes are:
 * - Fixed in number
 * - Evenly spaced
 * - Arranged in a circular shape (represented linearly in UI)
 */
export interface VerticalAxisConfig {
  /** Total number of vertical axes */
  count: number;
  
  /** Index of the center axis (0-based) */
  centerAxisIndex: number;
  
  /** Whether axes are evenly spaced (always true for this application) */
  evenlySpaced: boolean;
}

// ============================================================================
// COLORED RANGE
// ============================================================================

/**
 * Represents a continuous range of colored or uncolored vertical axes
 * 
 * Pattern is defined by continuous ranges, not individual cells.
 * A group of adjacent colored cells means the weaving strip must cover
 * the entire range in a single insertion.
 */
export interface ColoredRange {
  /** Start index of the range (0-based, inclusive) */
  startIndex: number;
  
  /** End index of the range (0-based, inclusive) */
  endIndex: number;
  
  /** Whether this range is colored (covered by strip) or uncolored (strip passes behind) */
  isColored: boolean;
  
  /** Color value if the range is colored */
  color?: string;
  
  /** Number of axes in this range */
  length: number;
}

// ============================================================================
// STRIP INITIALIZATION RULE
// ============================================================================

/**
 * Rule that determines how the weaving strip enters and exits before continuing
 * 
 * Critical rules:
 * - If colored range includes center axis: strip inserted before leftmost colored axis,
 *   exits after rightmost colored axis
 * - If colored range does not include center axis: strip starts from inside basket,
 *   exits after left colored axis, re-enters before right colored axis
 */
export interface StripInitializationRule {
  /** Type of initialization based on center axis relationship */
  type: "includesCenter" | "excludesCenter";
  
  /** Index where strip is inserted/enters (0-based) */
  insertIndex: number;
  
  /** Index where strip exits (0-based) */
  exitIndex: number;
  
  /** Index where strip re-enters (only for excludesCenter type) */
  reEnterIndex?: number;
  
  /** Human-readable description of the initialization */
  description: string;
}

// ============================================================================
// WEAVING INSTRUCTION
// ============================================================================

/**
 * Step in a weaving instruction sequence
 */
export interface InstructionStep {
  /** Type of action: cover (strip over axis) or skip (strip behind axis) */
  type: "cover" | "skip";
  
  /** Number of consecutive axes for this step */
  count: number;
}

/**
 * Weaving instruction for one direction (left or right)
 * 
 * After strip initialization, weaving proceeds in two independent directions:
 * - Left: processed continuously from center toward left end
 * - Right: processed continuously from center toward right end
 * 
 * Each side is processed independently without alternating.
 */
export interface WeavingInstruction {
  /** Direction: left (from center to left) or right (from center to right) */
  direction: "left" | "right";
  
  /** Sequence of cover/skip steps */
  steps: InstructionStep[];
  
  /** Human-readable formatted instruction */
  formattedText?: string;
}

/**
 * Complete weaving instructions for a single row
 */
export interface RowWeavingInstructions {
  /** Index of the row (0-based) */
  rowIndex: number;
  
  /** Strip initialization rule for this row */
  initialization: StripInitializationRule;
  
  /** Instructions for left direction (from center to left) */
  leftInstruction: WeavingInstruction;
  
  /** Instructions for right direction (from center to right) */
  rightInstruction: WeavingInstruction;
  
  /** Complete human-readable instruction text */
  fullInstructionText: string;
}

// ============================================================================
// WEAVING ROW
// ============================================================================

/**
 * A single weaving row (round) in the pattern
 * 
 * Represents one complete weaving round around the basket.
 * Rows are ordered from bottom to top.
 */
export interface WeavingRow {
  /** Index of the row (0-based, 0 = bottom row) */
  index: number;
  
  /** Array of cell states (one per vertical axis) */
  cells: CellState[];
  
  /** Status of this row during weaving execution */
  status: RowStatus;
  
  /** Continuous colored/uncolored ranges derived from cells */
  ranges: ColoredRange[];
  
  /** Weaving instructions for this row (generated after pattern confirmation) */
  instructions?: RowWeavingInstructions;
}

/**
 * State of a single cell in the pattern grid
 */
export interface CellState {
  /** Whether this cell is colored (strip covers axis) */
  colored: boolean;
  
  /** Color value if colored */
  color?: string;
  
  /** Index of the vertical axis (0-based) */
  axisIndex: number;
  
  /** Index of the row (0-based) */
  rowIndex: number;
}

// ============================================================================
// PATTERN GRID
// ============================================================================

/**
 * Complete pattern grid representing the entire basket weaving pattern
 * 
 * The grid is an Excel-like representation where:
 * - Columns = vertical axes (circular in reality, linear in UI)
 * - Rows = weaving rounds from bottom to top
 */
export interface PatternGrid {
  /** Configuration of vertical axes */
  axisConfig: VerticalAxisConfig;
  
  /** Total number of weaving rows (rounds) */
  totalRows: number;
  
  /** Array of all weaving rows (ordered bottom to top) */
  rows: WeavingRow[];
  
  /** Available colors for the pattern */
  availableColors: string[];
  
  /** Whether the pattern has been confirmed and is ready for weaving */
  isConfirmed: boolean;
}

// ============================================================================
// APPLICATION STATE (for backward compatibility)
// ============================================================================

/**
 * Application state for the entire application
 */
export interface AppState {
  /** Pattern grid configuration and data */
  patternGrid: PatternGrid;
  
  /** Currently selected row index (null if none selected) */
  currentRowIndex: number | null;
  
  /** Current application mode */
  mode: "design" | "confirm" | "weave";
}

// ============================================================================
// LEGACY TYPES (for backward compatibility during migration)
// ============================================================================

/**
 * @deprecated Use PatternGrid instead
 */
export type PatternConfig = {
  numAxes: number;
  numRows: number;
  colors: string[];
  centerAxis: number;
};

/**
 * @deprecated Use RowWeavingInstructions instead
 */
export type RowInstructions = {
  rowIndex: number;
  initialization: string;
  leftInstructions: WeavingInstruction;
  rightInstructions: WeavingInstruction;
};
