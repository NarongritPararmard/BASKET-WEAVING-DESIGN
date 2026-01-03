/**
 * PHASE 6 - STRIP INITIALIZATION ENGINE (CRITICAL)
 * 
 * Determines strip start/end behavior per row based on colored ranges
 * and their relationship to the center axis.
 * 
 * RULES:
 * 
 * IF colored range includes center axis:
 *   - Insert strip before leftmost colored axis
 *   - Exit strip after rightmost colored axis
 * 
 * IF colored range does NOT include center axis:
 *   - Strip starts from inside basket
 *   - Exit after left colored axis
 *   - Re-enter before right colored axis
 */

import type {
  ColoredRange,
  StripInitializationRule,
  VerticalAxisConfig,
} from "@/types";
import {
  findCenterColoredRange,
  coloredRangesIncludeCenter,
  getLeftmostColoredRange,
  getRightmostColoredRange,
} from "./centerAxis";

/**
 * Generate strip initialization rule for a row
 * 
 * @param coloredRanges Array of colored ranges for the row
 * @param centerAxisIndex Center axis index (0-based)
 * @param totalAxes Total number of axes (for validation)
 * @returns StripInitializationRule for the row
 */
export function generateStripInitializationRule(
  coloredRanges: ColoredRange[],
  centerAxisIndex: number,
  totalAxes: number
): StripInitializationRule {
  // Handle edge case: no colored ranges
  if (coloredRanges.length === 0) {
    return {
      type: "excludesCenter",
      insertIndex: 0,
      exitIndex: 0,
      description: "No colored cells in this row. No strip initialization needed.",
    };
  }

  // Check if any colored range includes the center axis
  const includesCenter = coloredRangesIncludeCenter(
    coloredRanges,
    centerAxisIndex,
    totalAxes
  );

  if (includesCenter) {
    return generateIncludesCenterRule(coloredRanges, centerAxisIndex, totalAxes);
  } else {
    return generateExcludesCenterRule(coloredRanges, centerAxisIndex, totalAxes);
  }
}

/**
 * Generate strip initialization rule when colored range INCLUDES center axis
 * 
 * Rule: Insert strip before leftmost colored axis, exit after rightmost colored axis
 * 
 * @param coloredRanges Array of colored ranges
 * @param centerAxisIndex Center axis index (0-based)
 * @param totalAxes Total number of axes
 * @returns StripInitializationRule for includesCenter type
 */
function generateIncludesCenterRule(
  coloredRanges: ColoredRange[],
  centerAxisIndex: number,
  totalAxes: number
): StripInitializationRule {
  // Find the range that includes the center axis
  const centerRange = findCenterColoredRange(
    coloredRanges,
    centerAxisIndex,
    totalAxes
  );

  if (!centerRange) {
    // Fallback: shouldn't happen if includesCenter is true, but handle it
    return generateExcludesCenterRule(coloredRanges, centerAxisIndex, totalAxes);
  }

  // Insert before leftmost colored axis of the center range
  // The leftmost axis is the startIndex of the range
  const insertIndex = centerRange.startIndex;

  // Exit after rightmost colored axis of the center range
  // The rightmost axis is the endIndex of the range
  const exitIndex = centerRange.endIndex;

  return {
    type: "includesCenter",
    insertIndex,
    exitIndex,
    description: `Insert strip before axis ${insertIndex + 1}, exit after axis ${exitIndex + 1}`,
  };
}

/**
 * Generate strip initialization rule when colored range does NOT include center axis
 * 
 * Rule: Strip starts from inside basket, exits after left colored axis,
 *       re-enters before right colored axis
 * 
 * IMPORTANT: "Left" and "right" here refer to ranges that are on the left/right
 * side of the center axis, not necessarily the leftmost/rightmost in the array.
 * 
 * @param coloredRanges Array of colored ranges
 * @param centerAxisIndex Center axis index (0-based)
 * @param totalAxes Total number of axes
 * @returns StripInitializationRule for excludesCenter type
 */
function generateExcludesCenterRule(
  coloredRanges: ColoredRange[],
  centerAxisIndex: number,
  totalAxes: number
): StripInitializationRule {
  // Separate ranges into left and right of center
  const leftRanges = coloredRanges.filter((range) => {
    // Range is on the left if its endIndex is less than centerAxisIndex
    // (or if it wraps around, we need to check differently)
    if (range.startIndex <= range.endIndex) {
      // Normal range
      return range.endIndex < centerAxisIndex;
    } else {
      // Wrap-around range: check if it's on the left side
      // For simplicity, if startIndex > centerAxisIndex, it's on the right
      return range.endIndex < centerAxisIndex;
    }
  });

  const rightRanges = coloredRanges.filter((range) => {
    // Range is on the right if its startIndex is greater than centerAxisIndex
    if (range.startIndex <= range.endIndex) {
      // Normal range
      return range.startIndex > centerAxisIndex;
    } else {
      // Wrap-around range: if startIndex > centerAxisIndex, it's on the right
      return range.startIndex > centerAxisIndex;
    }
  });

  // Find the leftmost range on the left side (closest to center, going left)
  const leftRange = leftRanges.length > 0
    ? leftRanges.reduce((leftmost, range) => {
        // The leftmost is the one with the highest endIndex (closest to center)
        return range.endIndex > leftmost.endIndex ? range : leftmost;
      })
    : null;

  // Find the rightmost range on the right side (closest to center, going right)
  const rightRange = rightRanges.length > 0
    ? rightRanges.reduce((rightmost, range) => {
        // The rightmost is the one with the lowest startIndex (closest to center)
        return range.startIndex < rightmost.startIndex ? range : rightmost;
      })
    : null;

  // Fallback: if we can't determine left/right, use the general leftmost/rightmost
  if (!leftRange || !rightRange) {
    const leftmostRange = getLeftmostColoredRange(coloredRanges);
    const rightmostRange = getRightmostColoredRange(coloredRanges);

    if (!leftmostRange || !rightmostRange) {
      return {
        type: "excludesCenter",
        insertIndex: 0,
        exitIndex: 0,
        description: "Unable to determine strip initialization (no valid ranges).",
      };
    }

    // Exit after left colored axis (endIndex of leftmost range)
    const exitIndex = leftmostRange.endIndex;
    // Re-enter before right colored axis (startIndex of rightmost range)
    const reEnterIndex = rightmostRange.startIndex;

    return {
      type: "excludesCenter",
      insertIndex: exitIndex,
      exitIndex,
      reEnterIndex,
      description: `Start from inside basket. Exit after axis ${exitIndex + 1}, re-enter before axis ${reEnterIndex + 1}`,
    };
  }

  // Exit after left colored axis (endIndex of the left range)
  const exitIndex = leftRange.endIndex;

  // Re-enter before right colored axis (startIndex of the right range)
  const reEnterIndex = rightRange.startIndex;

  return {
    type: "excludesCenter",
    insertIndex: exitIndex,
    exitIndex,
    reEnterIndex,
    description: `Start from inside basket. Exit after axis ${exitIndex + 1}, re-enter before axis ${reEnterIndex + 1}`,
  };
}

/**
 * Generate strip initialization rules for all rows
 * 
 * @param rowsExtractedRanges Array of extracted row ranges (from Phase 4)
 * @param centerAxisIndex Center axis index (0-based)
 * @param totalAxes Total number of axes
 * @returns Array of StripInitializationRule, one per row
 */
export function generateAllStripInitializationRules(
  rowsExtractedRanges: Array<{ rowIndex: number; coloredRanges: ColoredRange[] }>,
  centerAxisIndex: number,
  totalAxes: number
): Array<{ rowIndex: number; rule: StripInitializationRule }> {
  return rowsExtractedRanges.map((rowData) => ({
    rowIndex: rowData.rowIndex,
    rule: generateStripInitializationRule(
      rowData.coloredRanges,
      centerAxisIndex,
      totalAxes
    ),
  }));
}

/**
 * Generate strip initialization rule from axis config
 * 
 * Convenience function that uses VerticalAxisConfig
 * 
 * @param coloredRanges Array of colored ranges
 * @param axisConfig Vertical axis configuration
 * @returns StripInitializationRule for the row
 */
export function generateStripInitializationRuleFromConfig(
  coloredRanges: ColoredRange[],
  axisConfig: VerticalAxisConfig
): StripInitializationRule {
  return generateStripInitializationRule(
    coloredRanges,
    axisConfig.centerAxisIndex,
    axisConfig.count
  );
}

/**
 * Format strip initialization rule as human-readable text
 * 
 * @param rule StripInitializationRule to format
 * @returns Formatted description string
 */
export function formatStripInitializationRule(
  rule: StripInitializationRule
): string {
  if (rule.type === "includesCenter") {
    return `Type: Includes Center\nInsert before axis ${rule.insertIndex + 1}\nExit after axis ${rule.exitIndex + 1}`;
  } else {
    return `Type: Excludes Center (Starts from inside)\nExit after axis ${rule.exitIndex + 1}\nRe-enter before axis ${rule.reEnterIndex! + 1}`;
  }
}

/**
 * Validate strip initialization rule
 * 
 * @param rule StripInitializationRule to validate
 * @param totalAxes Total number of axes
 * @returns Whether the rule is valid
 */
export function isValidStripInitializationRule(
  rule: StripInitializationRule,
  totalAxes: number
): boolean {
  // Check basic indices
  if (
    rule.insertIndex < 0 ||
    rule.insertIndex >= totalAxes ||
    rule.exitIndex < 0 ||
    rule.exitIndex >= totalAxes
  ) {
    return false;
  }

  // Check reEnterIndex for excludesCenter type
  if (rule.type === "excludesCenter") {
    if (rule.reEnterIndex === undefined) {
      return false;
    }
    if (rule.reEnterIndex < 0 || rule.reEnterIndex >= totalAxes) {
      return false;
    }
  }

  return true;
}

