/**
 * PHASE 4 - RANGE EXTRACTION ENGINE (CRITICAL)
 * 
 * Converts grid rows into weaving ranges with support for:
 * - Continuous colored range detection
 * - Wrap-around logic for circular axes
 * - Normalized output structure
 * 
 * IMPORTANT: No single-cell logic. All ranges must be continuous.
 */

import type { CellState, ColoredRange, WeavingRow } from "@/types";

/**
 * Normalized data structure per row after range extraction
 */
export interface ExtractedRowRanges {
  /** Index of the row (0-based) */
  rowIndex: number;
  
  /** Array of continuous colored ranges only */
  coloredRanges: ColoredRange[];
}

/**
 * Extract continuous colored ranges from cells with wrap-around support
 * 
 * This function handles circular axes where the last axis (index N-1) connects 
 * to the first axis (index 0). If colored cells wrap around, they are merged 
 * into a single continuous range.
 * 
 * Algorithm:
 * 1. First pass: collect all colored cells
 * 2. Group adjacent colored cells with same color into ranges
 * 3. Check if first and last ranges should be merged (wrap-around)
 * 4. Return normalized ColoredRange[] structure
 * 
 * @param cells Array of cell states
 * @param totalAxes Total number of axes (for wrap-around calculation)
 * @returns Array of continuous colored ranges (only colored, not uncolored)
 */
export function extractColoredRanges(
  cells: CellState[],
  totalAxes: number
): ColoredRange[] {
  if (cells.length === 0 || totalAxes === 0) {
    return [];
  }

  // Step 1: Collect all colored cells with their indices and colors
  const coloredIndices: Array<{ index: number; color: string }> = [];
  
  for (let i = 0; i < cells.length && i < totalAxes; i++) {
    if (cells[i].colored && cells[i].color) {
      coloredIndices.push({
        index: i,
        color: cells[i].color!,
      });
    }
  }

  if (coloredIndices.length === 0) {
    return [];
  }

  // Step 2: Group into continuous ranges
  const ranges: Array<{ startAxis: number; endAxis: number; color: string }> = [];
  
  if (coloredIndices.length === 1) {
    // Single colored cell - still a valid range
    const cell = coloredIndices[0];
    ranges.push({
      startAxis: cell.index,
      endAxis: cell.index,
      color: cell.color,
    });
  } else {
    // Multiple colored cells - group into ranges
    let currentRange: { startAxis: number; endAxis: number; color: string } | null = null;

    for (let i = 0; i < coloredIndices.length; i++) {
      const cell = coloredIndices[i];
      const nextCell = coloredIndices[(i + 1) % coloredIndices.length];

      if (!currentRange) {
        // Start a new range
        currentRange = {
          startAxis: cell.index,
          endAxis: cell.index,
          color: cell.color,
        };
      } else {
        // Check if this cell extends the current range
        const isAdjacent = 
          cell.index === (currentRange.endAxis + 1) % totalAxes ||
          (currentRange.endAxis === totalAxes - 1 && cell.index === 0);
        const sameColor = cell.color === currentRange.color;

        if (isAdjacent && sameColor) {
          // Extend the range
          currentRange.endAxis = cell.index;
        } else {
          // Save current range and start a new one
          ranges.push(currentRange);
          currentRange = {
            startAxis: cell.index,
            endAxis: cell.index,
            color: cell.color,
          };
        }
      }
    }

    // Add the last range
    if (currentRange) {
      ranges.push(currentRange);
    }

    // Step 3: Check for wrap-around merge
    // If first and last ranges have same color and wrap around, merge them
    if (ranges.length >= 2) {
      const firstRange = ranges[0];
      const lastRange = ranges[ranges.length - 1];

      // Check if they wrap around (last axis connects to first axis)
      const wrapsAround =
        (lastRange.endAxis === totalAxes - 1 && firstRange.startAxis === 0) ||
        (lastRange.endAxis + 1 === firstRange.startAxis);

      if (wrapsAround && firstRange.color === lastRange.color) {
        // Merge: extend first range to include last range
        firstRange.endAxis = lastRange.endAxis;
        ranges.pop(); // Remove the last range
      }
    }
  }

  // Step 4: Convert to ColoredRange format
  const coloredRanges: ColoredRange[] = ranges.map((range) => {
    // Handle wrap-around ranges (where start > end)
    if (range.startAxis > range.endAxis) {
      // This means the range wraps around
      // For now, we'll represent it as a single range with start > end
      // The length calculation accounts for wrap-around
      const length = (totalAxes - range.startAxis) + (range.endAxis + 1);
      
      return {
        startIndex: range.startAxis,
        endIndex: range.endAxis,
        isColored: true,
        color: range.color,
        length,
      };
    } else {
      // Normal range (no wrap-around)
      return {
        startIndex: range.startAxis,
        endIndex: range.endAxis,
        isColored: true,
        color: range.color,
        length: range.endAxis - range.startAxis + 1,
      };
    }
  });

  // Sort ranges by startIndex for consistency
  coloredRanges.sort((a, b) => {
    // Handle wrap-around: ranges that start near the end should be considered
    if (a.startIndex > totalAxes / 2 && b.startIndex < totalAxes / 2) {
      return 1; // a comes after b
    }
    if (a.startIndex < totalAxes / 2 && b.startIndex > totalAxes / 2) {
      return -1; // a comes before b
    }
    return a.startIndex - b.startIndex;
  });

  return coloredRanges;
}

/**
 * Extract colored ranges from a single row
 * 
 * @param row Weaving row to extract ranges from
 * @param totalAxes Total number of axes (for wrap-around calculation)
 * @returns Extracted row ranges in normalized format
 */
export function extractRowRanges(
  row: WeavingRow,
  totalAxes: number
): ExtractedRowRanges {
  const coloredRanges = extractColoredRanges(row.cells, totalAxes);

  return {
    rowIndex: row.index,
    coloredRanges,
  };
}

/**
 * Extract colored ranges from all rows in a pattern
 * 
 * @param rows Array of weaving rows
 * @param totalAxes Total number of axes (for wrap-around calculation)
 * @returns Array of extracted row ranges
 */
export function extractAllRowRanges(
  rows: WeavingRow[],
  totalAxes: number
): ExtractedRowRanges[] {
  return rows.map((row) => extractRowRanges(row, totalAxes));
}

/**
 * Simplified range extraction without wrap-around (for linear processing)
 * 
 * This is a simpler version that doesn't handle circular wrap-around.
 * Use this when you need linear range extraction or for testing.
 * 
 * @param cells Array of cell states
 * @returns Array of continuous colored ranges
 */
export function extractColoredRangesLinear(cells: CellState[]): ColoredRange[] {
  if (cells.length === 0) {
    return [];
  }

  const coloredRanges: ColoredRange[] = [];
  let currentStart: number | null = null;
  let currentColor: string | null = null;

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];

    if (cell.colored && cell.color) {
      if (currentStart === null) {
        // Start a new range
        currentStart = i;
        currentColor = cell.color;
      } else if (cell.color !== currentColor) {
        // Different color: save current range and start new one
        coloredRanges.push({
          startIndex: currentStart,
          endIndex: i - 1,
          isColored: true,
          color: currentColor!,
          length: i - currentStart,
        });
        currentStart = i;
        currentColor = cell.color;
      }
      // Same color: continue current range (do nothing)
    } else {
      // Uncolored cell: end current range if exists
      if (currentStart !== null && currentColor) {
        coloredRanges.push({
          startIndex: currentStart,
          endIndex: i - 1,
          isColored: true,
          color: currentColor,
          length: i - currentStart,
        });
        currentStart = null;
        currentColor = null;
      }
    }
  }

  // Add the last range if exists
  if (currentStart !== null && currentColor !== null) {
    coloredRanges.push({
      startIndex: currentStart,
      endIndex: cells.length - 1,
      isColored: true,
      color: currentColor,
      length: cells.length - currentStart,
    });
  }

  return coloredRanges;
}
