/**
 * Utility functions for working with ColoredRange
 */

import type { ColoredRange, CellState } from "@/types";
import { extractColoredRanges } from "@/lib/weaving/rangeExtraction";

/**
 * Convert an array of cells to continuous ranges (includes both colored and uncolored)
 * 
 * This is a general-purpose function that extracts all ranges.
 * For colored-only ranges with wrap-around support, use extractColoredRanges from rangeExtraction.
 * 
 * @param cells Array of cell states
 * @returns Array of continuous colored/uncolored ranges
 */
export function cellsToRanges(cells: CellState[]): ColoredRange[] {
  if (cells.length === 0) {
    return [];
  }

  const ranges: ColoredRange[] = [];
  let currentStart = 0;
  let currentColored = cells[0].colored;
  let currentColor = cells[0].color;

  for (let i = 1; i < cells.length; i++) {
    const cell = cells[i];
    
    // Check if we need to start a new range
    if (cell.colored !== currentColored || (cell.colored && cell.color !== currentColor)) {
      // Save the current range
      ranges.push({
        startIndex: currentStart,
        endIndex: i - 1,
        isColored: currentColored,
        color: currentColored ? currentColor : undefined,
        length: i - currentStart,
      });

      // Start a new range
      currentStart = i;
      currentColored = cell.colored;
      currentColor = cell.color;
    }
  }

  // Add the last range
  ranges.push({
    startIndex: currentStart,
    endIndex: cells.length - 1,
    isColored: currentColored,
    color: currentColored ? currentColor : undefined,
    length: cells.length - currentStart,
  });

  return ranges;
}

/**
 * Convert cells to ranges with wrap-around support for circular axes
 * 
 * @param cells Array of cell states
 * @param totalAxes Total number of axes (for wrap-around calculation)
 * @returns Array of continuous colored ranges (colored only, with wrap-around support)
 */
export function cellsToColoredRangesWithWrapAround(
  cells: CellState[],
  totalAxes: number
): ColoredRange[] {
  return extractColoredRanges(cells, totalAxes);
}

/**
 * Check if a range includes a specific axis index
 */
export function rangeIncludesIndex(
  range: ColoredRange,
  index: number
): boolean {
  // Handle wrap-around ranges (where start > end)
  if (range.startIndex > range.endIndex) {
    // Range wraps around: index is included if it's >= start OR <= end
    return index >= range.startIndex || index <= range.endIndex;
  }
  // Normal range
  return range.startIndex <= index && range.endIndex >= index;
}

/**
 * Check if a range includes the center axis
 */
export function rangeIncludesCenter(
  range: ColoredRange,
  centerAxisIndex: number
): boolean {
  return rangeIncludesIndex(range, centerAxisIndex);
}

/**
 * Get all colored ranges from an array of ranges
 */
export function getColoredRanges(ranges: ColoredRange[]): ColoredRange[] {
  return ranges.filter((range) => range.isColored);
}

/**
 * Get all uncolored ranges from an array of ranges
 */
export function getUncoloredRanges(ranges: ColoredRange[]): ColoredRange[] {
  return ranges.filter((range) => !range.isColored);
}

/**
 * Find the range that includes a specific axis index
 */
export function findRangeForIndex(
  ranges: ColoredRange[],
  index: number
): ColoredRange | undefined {
  return ranges.find((range) => rangeIncludesIndex(range, index));
}

/**
 * Find the colored range that includes the center axis
 */
export function findCenterColoredRange(
  ranges: ColoredRange[],
  centerAxisIndex: number
): ColoredRange | undefined {
  const coloredRanges = getColoredRanges(ranges);
  return coloredRanges.find((range) => rangeIncludesCenter(range, centerAxisIndex));
}

/**
 * Check if two ranges overlap
 */
export function rangesOverlap(range1: ColoredRange, range2: ColoredRange): boolean {
  // Check if either range includes any index from the other range
  for (let i = range1.startIndex; i <= range1.endIndex; i++) {
    if (rangeIncludesIndex(range2, i)) {
      return true;
    }
  }
  
  // Handle wrap-around for range1
  if (range1.startIndex > range1.endIndex) {
    // Check indices from startIndex to end of array
    for (let i = range1.startIndex; i < 1000; i++) { // Use large number as placeholder
      if (rangeIncludesIndex(range2, i)) {
        return true;
      }
    }
    // Check indices from 0 to endIndex
    for (let i = 0; i <= range1.endIndex; i++) {
      if (rangeIncludesIndex(range2, i)) {
        return true;
      }
    }
  }
  
  return false;
}
