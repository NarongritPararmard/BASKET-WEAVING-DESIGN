import type {
  WeavingRow,
  PatternConfig,
  RowInstructions,
  WeavingInstruction,
  InstructionStep,
} from "@/types";

/**
 * Get continuous ranges of colored and uncolored cells
 */
function getRanges(cells: { colored: boolean }[]): Array<{ start: number; end: number; colored: boolean }> {
  const ranges: Array<{ start: number; end: number; colored: boolean }> = [];
  let currentStart = 0;
  let currentColored = cells[0]?.colored ?? false;

  for (let i = 1; i < cells.length; i++) {
    if (cells[i].colored !== currentColored) {
      ranges.push({
        start: currentStart,
        end: i - 1,
        colored: currentColored,
      });
      currentStart = i;
      currentColored = cells[i].colored;
    }
  }

  // Add the last range
  ranges.push({
    start: currentStart,
    end: cells.length - 1,
    colored: currentColored,
  });

  return ranges;
}

/**
 * Check if a range includes the center axis
 */
function rangeIncludesCenter(range: { start: number; end: number }, centerAxis: number): boolean {
  return range.start <= centerAxis && range.end >= centerAxis;
}

/**
 * Generate strip initialization instruction
 */
function generateInitialization(
  ranges: Array<{ start: number; end: number; colored: boolean }>,
  centerAxis: number
): string {
  const coloredRanges = ranges.filter((r) => r.colored);

  if (coloredRanges.length === 0) {
    return "No colored cells in this row";
  }

  // Find the range that includes the center axis
  const centerRange = coloredRanges.find((r) => rangeIncludesCenter(r, centerAxis));

  if (centerRange) {
    // Strip enters before leftmost and exits after rightmost
    return `Insert strip before axis ${centerRange.start + 1}, exit after axis ${centerRange.end + 1}`;
  } else {
    // Strip starts from inside the basket
    const leftmostRange = coloredRanges[0];
    const rightmostRange = coloredRanges[coloredRanges.length - 1];
    return `Start from inside basket. Exit after axis ${leftmostRange.start + 1}, re-enter before axis ${rightmostRange.end + 1}`;
  }
}

/**
 * Generate instructions for one direction (left or right)
 */
function generateDirectionInstructions(
  cells: { colored: boolean }[],
  centerAxis: number,
  direction: "left" | "right"
): WeavingInstruction {
  const steps: InstructionStep[] = [];

  if (direction === "left") {
    // Process from center to left
    let i = centerAxis - 1;
    while (i >= 0) {
      const cell = cells[i];
      if (cell.colored) {
        // Count consecutive colored cells
        let count = 0;
        while (i >= 0 && cells[i].colored) {
          count++;
          i--;
        }
        steps.push({ type: "cover", count });
      } else {
        // Count consecutive uncolored cells
        let count = 0;
        while (i >= 0 && !cells[i].colored) {
          count++;
          i--;
        }
        steps.push({ type: "skip", count });
      }
    }
  } else {
    // Process from center to right
    let i = centerAxis + 1;
    while (i < cells.length) {
      const cell = cells[i];
      if (cell.colored) {
        // Count consecutive colored cells
        let count = 0;
        while (i < cells.length && cells[i].colored) {
          count++;
          i++;
        }
        steps.push({ type: "cover", count });
      } else {
        // Count consecutive uncolored cells
        let count = 0;
        while (i < cells.length && !cells[i].colored) {
          count++;
          i++;
        }
        steps.push({ type: "skip", count });
      }
    }
  }

  return {
    direction,
    steps,
  };
}

/**
 * Generate complete weaving instructions for a row
 */
export function generateRowInstructions(
  row: WeavingRow,
  config: PatternConfig
): RowInstructions {
  const ranges = getRanges(row.cells);
  const initialization = generateInitialization(ranges, config.centerAxis);
  const leftInstructions = generateDirectionInstructions(row.cells, config.centerAxis, "left");
  const rightInstructions = generateDirectionInstructions(row.cells, config.centerAxis, "right");

  return {
    rowIndex: row.index,
    initialization,
    leftInstructions,
    rightInstructions,
  };
}

/**
 * Format instructions as human-readable text
 */
export function formatInstructions(instructions: RowInstructions): string {
  const leftText = instructions.leftInstructions.steps
    .map((step) => `${step.type} ${step.count} axis${step.count > 1 ? "es" : ""}`)
    .join(", then ");

  const rightText = instructions.rightInstructions.steps
    .map((step) => `${step.type} ${step.count} axis${step.count > 1 ? "es" : ""}`)
    .join(", then ");

  return `${instructions.initialization}\n\nLeft: ${leftText || "none"}\nRight: ${rightText || "none"}`;
}

