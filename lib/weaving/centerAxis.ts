/**
 * PHASE 5 - CENTER AXIS LOGIC
 * 
 * The center axis (C) is a logical reference used to:
 * - Divide left and right directions
 * - Determine strip initialization rules
 * 
 * IMPORTANT: The center axis is NOT a physical start or end of the weaving strip.
 * It is purely a conceptual reference point.
 */

import type { ColoredRange, VerticalAxisConfig } from "@/types";

/**
 * Calculate center axis index automatically
 * 
 * Default: middle of the axes (floor of count / 2)
 * 
 * @param totalAxes Total number of vertical axes
 * @returns Center axis index (0-based)
 */
export function calculateCenterAxisIndex(totalAxes: number): number {
  if (totalAxes <= 0) {
    return 0;
  }
  return Math.floor(totalAxes / 2);
}

/**
 * Validate center axis index
 * 
 * @param centerAxisIndex Proposed center axis index
 * @param totalAxes Total number of vertical axes
 * @returns Whether the center axis index is valid
 */
export function isValidCenterAxisIndex(
  centerAxisIndex: number,
  totalAxes: number
): boolean {
  return centerAxisIndex >= 0 && centerAxisIndex < totalAxes;
}

/**
 * Get center axis configuration with auto-calculation
 * 
 * @param totalAxes Total number of vertical axes
 * @param centerAxisIndex Optional center axis index (if not provided, auto-calculated)
 * @returns VerticalAxisConfig with center axis
 */
export function getCenterAxisConfig(
  totalAxes: number,
  centerAxisIndex?: number
): VerticalAxisConfig {
  const calculatedIndex =
    centerAxisIndex !== undefined && isValidCenterAxisIndex(centerAxisIndex, totalAxes)
      ? centerAxisIndex
      : calculateCenterAxisIndex(totalAxes);

  return {
    count: totalAxes,
    centerAxisIndex: calculatedIndex,
    evenlySpaced: true,
  };
}

/**
 * Check if a range includes the center axis
 * 
 * Handles both normal ranges and wrap-around ranges.
 * 
 * @param range Colored range to check
 * @param centerAxisIndex Center axis index (0-based)
 * @param totalAxes Total number of axes (for wrap-around calculation)
 * @returns Whether the range includes the center axis
 */
export function rangeIncludesCenterAxis(
  range: ColoredRange,
  centerAxisIndex: number,
  totalAxes: number
): boolean {
  // Normal range (no wrap-around)
  if (range.startIndex <= range.endIndex) {
    return range.startIndex <= centerAxisIndex && centerAxisIndex <= range.endIndex;
  }

  // Wrap-around range (start > end)
  // Range wraps from startIndex to end of array, then from 0 to endIndex
  return (
    centerAxisIndex >= range.startIndex || centerAxisIndex <= range.endIndex
  );
}

/**
 * Find the colored range that includes the center axis
 * 
 * @param coloredRanges Array of colored ranges
 * @param centerAxisIndex Center axis index (0-based)
 * @param totalAxes Total number of axes (for wrap-around calculation)
 * @returns The range that includes center axis, or undefined if none
 */
export function findCenterColoredRange(
  coloredRanges: ColoredRange[],
  centerAxisIndex: number,
  totalAxes: number
): ColoredRange | undefined {
  return coloredRanges.find((range) =>
    rangeIncludesCenterAxis(range, centerAxisIndex, totalAxes)
  );
}

/**
 * Split axes into left and right directions based on center axis
 * 
 * Left: from center toward left end (indices < centerAxisIndex)
 * Right: from center toward right end (indices > centerAxisIndex)
 * 
 * Note: The center axis itself is not included in either direction.
 * 
 * @param centerAxisIndex Center axis index (0-based)
 * @param totalAxes Total number of axes
 * @returns Object with left and right axis indices
 */
export function splitLeftRightDirections(
  centerAxisIndex: number,
  totalAxes: number
): {
  leftIndices: number[];
  rightIndices: number[];
  centerIndex: number;
} {
  const leftIndices: number[] = [];
  const rightIndices: number[] = [];

  for (let i = 0; i < totalAxes; i++) {
    if (i < centerAxisIndex) {
      leftIndices.push(i);
    } else if (i > centerAxisIndex) {
      rightIndices.push(i);
    }
    // i === centerAxisIndex is not included in either direction
  }

  // Reverse left indices so they go from center toward left (descending)
  leftIndices.reverse();

  return {
    leftIndices,
    rightIndices,
    centerIndex: centerAxisIndex,
  };
}

/**
 * Get left direction cells (from center toward left)
 * 
 * @param cells Array of all cells
 * @param centerAxisIndex Center axis index (0-based)
 * @returns Left direction cells (ordered from center to left)
 */
export function getLeftDirectionCells<T>(
  cells: T[],
  centerAxisIndex: number
): T[] {
  const leftCells: T[] = [];
  
  // Process from center-1 down to 0
  for (let i = centerAxisIndex - 1; i >= 0; i--) {
    if (cells[i] !== undefined) {
      leftCells.push(cells[i]);
    }
  }
  
  return leftCells;
}

/**
 * Get right direction cells (from center toward right)
 * 
 * @param cells Array of all cells
 * @param centerAxisIndex Center axis index (0-based)
 * @returns Right direction cells (ordered from center to right)
 */
export function getRightDirectionCells<T>(
  cells: T[],
  centerAxisIndex: number
): T[] {
  const rightCells: T[] = [];
  
  // Process from center+1 to end
  for (let i = centerAxisIndex + 1; i < cells.length; i++) {
    if (cells[i] !== undefined) {
      rightCells.push(cells[i]);
    }
  }
  
  return rightCells;
}

/**
 * Determine if colored ranges include the center axis
 * 
 * This is used for strip initialization rules:
 * - If includes center: strip inserted before leftmost, exits after rightmost
 * - If excludes center: strip starts from inside, exits after left, re-enters before right
 * 
 * @param coloredRanges Array of colored ranges
 * @param centerAxisIndex Center axis index (0-based)
 * @param totalAxes Total number of axes (for wrap-around calculation)
 * @returns Whether any colored range includes the center axis
 */
export function coloredRangesIncludeCenter(
  coloredRanges: ColoredRange[],
  centerAxisIndex: number,
  totalAxes: number
): boolean {
  return coloredRanges.some((range) =>
    rangeIncludesCenterAxis(range, centerAxisIndex, totalAxes)
  );
}

/**
 * Get the leftmost colored range
 * 
 * @param coloredRanges Array of colored ranges
 * @returns Leftmost range (lowest startIndex), or undefined if empty
 */
export function getLeftmostColoredRange(
  coloredRanges: ColoredRange[]
): ColoredRange | undefined {
  if (coloredRanges.length === 0) {
    return undefined;
  }

  return coloredRanges.reduce((leftmost, range) => {
    // Handle wrap-around: ranges with high startIndex might actually be leftmost
    // For simplicity, we'll use the range with the lowest startIndex
    return range.startIndex < leftmost.startIndex ? range : leftmost;
  });
}

/**
 * Get the rightmost colored range
 * 
 * @param coloredRanges Array of colored ranges
 * @returns Rightmost range (highest endIndex), or undefined if empty
 */
export function getRightmostColoredRange(
  coloredRanges: ColoredRange[]
): ColoredRange | undefined {
  if (coloredRanges.length === 0) {
    return undefined;
  }

  return coloredRanges.reduce((rightmost, range) => {
    // Handle wrap-around: ranges with low endIndex might actually be rightmost
    // For simplicity, we'll use the range with the highest endIndex
    return range.endIndex > rightmost.endIndex ? range : rightmost;
  });
}

/**
 * Get axis position relative to center
 * 
 * @param axisIndex Axis index to check
 * @param centerAxisIndex Center axis index (0-based)
 * @returns "left", "right", or "center"
 */
export function getAxisPositionRelativeToCenter(
  axisIndex: number,
  centerAxisIndex: number
): "left" | "right" | "center" {
  if (axisIndex < centerAxisIndex) {
    return "left";
  } else if (axisIndex > centerAxisIndex) {
    return "right";
  } else {
    return "center";
  }
}

