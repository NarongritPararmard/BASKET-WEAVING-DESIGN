"use client";

import { useWeavingStore } from "@/lib/store/useWeavingStore";
import {
  formatInstructionSteps,
  formatStripInitializationRule,
} from "@/lib/weaving";

interface WeavingInstructionsProps {
  rowIndex: number;
}

export default function WeavingInstructions({ rowIndex }: WeavingInstructionsProps) {
  const { patternGrid, generateCompleteRowInstructions } = useWeavingStore();

  if (rowIndex < 0 || rowIndex >= patternGrid.rows.length) {
    return <div className="text-gray-500">Invalid row index</div>;
  }

  const instructions = generateCompleteRowInstructions(rowIndex);

  if (!instructions) {
    return <div className="text-gray-500">No instructions available for this row.</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <h3 className="font-bold text-3xl md:text-4xl mb-6 text-center md:text-left">Row {rowIndex + 1} Instructions</h3>
      <div className="space-y-8">
        <div className="bg-blue-50 dark:bg-blue-950 p-5 rounded-lg">
          <p className="font-bold text-xl md:text-2xl text-blue-800 dark:text-blue-200 mb-3">Initialization:</p>
          <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200">{instructions.initialization}</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-950 p-5 rounded-lg">
          <p className="font-bold text-xl md:text-2xl text-green-800 dark:text-green-200 mb-3">Left Direction:</p>
          <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200">
            {formatInstructionSteps(instructions.leftInstruction.steps)}
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-950 p-5 rounded-lg">
          <p className="font-bold text-xl md:text-2xl text-purple-800 dark:text-purple-200 mb-3">Right Direction:</p>
          <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200">
            {formatInstructionSteps(instructions.rightInstruction.steps)}
          </p>
        </div>
      </div>
    </div>
  );
}

