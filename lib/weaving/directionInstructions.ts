/**
 * PHASE 7 - LEFT & RIGHT WEAVING GENERATION
 * 
 * Generate weaving instructions for left and right directions.
 * 
 * RULES:
 * - Split weaving into left and right from center
 * - Process each side independently
 * - Never alternate directions
 * - Instructions are sequences of: cover N axes, skip N axes
 * 
 * OUTPUT:
 * Human-readable instructions such as: "Cover 3, skip 2, cover 4"
 */

import type {
  CellState,
  InstructionStep,
  WeavingInstruction,
  VerticalAxisConfig,
} from "@/types";
import { getLeftDirectionCells, getRightDirectionCells } from "./centerAxis";

/**
 * Generate weaving instruction for left direction
 * 
 * Processes cells from center toward left end, generating cover/skip sequences.
 * 
 * @param cells Array of all cells in the row
 * @param centerAxisIndex Center axis index (0-based)
 * @returns WeavingInstruction for left direction
 */
export function generateLeftDirectionInstruction(
  cells: CellState[],
  centerAxisIndex: number
): WeavingInstruction {
  const steps: InstructionStep[] = [];
  
  // Get left direction cells (from center-1 down to 0)
  // Process from center toward left end
  let i = centerAxisIndex - 1;
  
  while (i >= 0) {
    const cell = cells[i];
    
    if (cell.colored) {
      // Count consecutive colored cells (cover)
      let count = 0;
      while (i >= 0 && cells[i].colored) {
        count++;
        i--;
      }
      steps.push({ type: "cover", count });
    } else {
      // Count consecutive uncolored cells (skip)
      let count = 0;
      while (i >= 0 && !cells[i].colored) {
        count++;
        i--;
      }
      steps.push({ type: "skip", count });
    }
  }
  
  return {
    direction: "left",
    steps,
    formattedText: formatInstructionSteps(steps),
  };
}

/**
 * Generate weaving instruction for right direction
 * 
 * Processes cells from center toward right end, generating cover/skip sequences.
 * 
 * @param cells Array of all cells in the row
 * @param centerAxisIndex Center axis index (0-based)
 * @returns WeavingInstruction for right direction
 */
export function generateRightDirectionInstruction(
  cells: CellState[],
  centerAxisIndex: number
): WeavingInstruction {
  const steps: InstructionStep[] = [];
  
  // Process from center+1 to end
  let i = centerAxisIndex + 1;
  
  while (i < cells.length) {
    const cell = cells[i];
    
    if (cell.colored) {
      // Count consecutive colored cells (cover)
      let count = 0;
      while (i < cells.length && cells[i].colored) {
        count++;
        i++;
      }
      steps.push({ type: "cover", count });
    } else {
      // Count consecutive uncolored cells (skip)
      let count = 0;
      while (i < cells.length && !cells[i].colored) {
        count++;
        i++;
      }
      steps.push({ type: "skip", count });
    }
  }
  
  return {
    direction: "right",
    steps,
    formattedText: formatInstructionSteps(steps),
  };
}

/**
 * Generate both left and right direction instructions
 * 
 * @param cells Array of all cells in the row
 * @param centerAxisIndex Center axis index (0-based)
 * @returns Object with left and right instructions
 */
export function generateBothDirectionInstructions(
  cells: CellState[],
  centerAxisIndex: number
): {
  leftInstruction: WeavingInstruction;
  rightInstruction: WeavingInstruction;
} {
  return {
    leftInstruction: generateLeftDirectionInstruction(cells, centerAxisIndex),
    rightInstruction: generateRightDirectionInstruction(cells, centerAxisIndex),
  };
}

/**
 * Format instruction steps as human-readable text
 * 
 * Examples:
 * - "Cover 3, skip 2, cover 4"
 * - "Skip 1, cover 5"
 * - "Cover 2"
 * 
 * @param steps Array of instruction steps
 * @returns Human-readable formatted string
 */
export function formatInstructionSteps(steps: InstructionStep[]): string {
  if (steps.length === 0) {
    return "none";
  }
  
  return steps
    .map((step) => {
      const action = step.type === "cover" ? "Cover" : "Skip";
      const axisText = step.count === 1 ? "axis" : "axes";
      return `${action} ${step.count} ${axisText}`;
    })
    .join(", ");
}

/**
 * Format instruction steps in compact form
 * 
 * Examples:
 * - "Cover 3, skip 2, cover 4"
 * - "Skip 1, cover 5"
 * 
 * @param steps Array of instruction steps
 * @returns Compact formatted string
 */
export function formatInstructionStepsCompact(steps: InstructionStep[]): string {
  if (steps.length === 0) {
    return "none";
  }
  
  return steps
    .map((step) => {
      const action = step.type === "cover" ? "Cover" : "Skip";
      return `${action} ${step.count}`;
    })
    .join(", ");
}

/**
 * Generate complete weaving instructions for a row
 * 
 * This combines strip initialization with left/right direction instructions.
 * 
 * @param cells Array of all cells in the row
 * @param centerAxisIndex Center axis index (0-based)
 * @param stripInitializationRule Strip initialization rule (from Phase 6)
 * @returns Complete weaving instructions
 */
export function generateCompleteRowInstructions(
  cells: CellState[],
  centerAxisIndex: number,
  stripInitializationRule: { type: string; description: string }
): {
  initialization: string;
  leftInstruction: WeavingInstruction;
  rightInstruction: WeavingInstruction;
  fullText: string;
} {
  const { leftInstruction, rightInstruction } = generateBothDirectionInstructions(
    cells,
    centerAxisIndex
  );
  
  const fullText = [
    `Initialization: ${stripInitializationRule.description}`,
    `Left: ${leftInstruction.formattedText || formatInstructionSteps(leftInstruction.steps)}`,
    `Right: ${rightInstruction.formattedText || formatInstructionSteps(rightInstruction.steps)}`,
  ].join("\n");
  
  return {
    initialization: stripInitializationRule.description,
    leftInstruction,
    rightInstruction,
    fullText,
  };
}

/**
 * Generate instructions from axis config
 * 
 * Convenience function that uses VerticalAxisConfig
 * 
 * @param cells Array of all cells in the row
 * @param axisConfig Vertical axis configuration
 * @param stripInitializationRule Strip initialization rule
 * @returns Complete weaving instructions
 */
export function generateRowInstructionsFromConfig(
  cells: CellState[],
  axisConfig: VerticalAxisConfig,
  stripInitializationRule: { type: string; description: string }
) {
  return generateCompleteRowInstructions(
    cells,
    axisConfig.centerAxisIndex,
    stripInitializationRule
  );
}

/**
 * Validate instruction steps
 * 
 * @param steps Array of instruction steps
 * @returns Whether the steps are valid
 */
export function isValidInstructionSteps(steps: InstructionStep[]): boolean {
  return steps.every(
    (step) =>
      (step.type === "cover" || step.type === "skip") &&
      step.count > 0 &&
      Number.isInteger(step.count)
  );
}

/**
 * Count total axes covered in instructions
 * 
 * @param instruction Weaving instruction
 * @returns Total number of axes covered
 */
export function countCoveredAxes(instruction: WeavingInstruction): number {
  return instruction.steps
    .filter((step) => step.type === "cover")
    .reduce((sum, step) => sum + step.count, 0);
}

/**
 * Count total axes skipped in instructions
 * 
 * @param instruction Weaving instruction
 * @returns Total number of axes skipped
 */
export function countSkippedAxes(instruction: WeavingInstruction): number {
  return instruction.steps
    .filter((step) => step.type === "skip")
    .reduce((sum, step) => sum + step.count, 0);
}

/**
 * Get total length of instruction (covered + skipped)
 * 
 * @param instruction Weaving instruction
 * @returns Total number of axes processed
 */
export function getInstructionLength(instruction: WeavingInstruction): number {
  return instruction.steps.reduce((sum, step) => sum + step.count, 0);
}

