"use client";

import { useEffect } from "react";
import { useWeavingStore } from "@/lib/store/useWeavingStore";
import { useRouter } from "next/navigation";
import PatternGridEditor from "@/components/PatternGridEditor";
import { formatStripInitializationRule } from "@/lib/weaving/stripInitialization";
import { formatInstructionStepsCompact } from "@/lib/weaving/directionInstructions";

export default function ConfirmPage() {
  const router = useRouter();
  const {
    patternGrid,
    setMode,
    setCurrentRow,
    generateStripInitializationRule,
    generateBothDirectionInstructions,
  } = useWeavingStore();

  useEffect(() => {
    setMode("confirm");
  }, [setMode]);

  const handleStartWeaving = () => {
    setCurrentRow(0);
    router.push("/weave");
  };

  const handleBackToDesign = () => {
    router.push("/design");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Confirm Pattern</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Review your pattern settings and preview the weaving instructions before proceeding.
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Number of Axes:</strong> {patternGrid.axisConfig.count}</p>
              <p><strong>Number of Rows:</strong> {patternGrid.totalRows}</p>
              <p><strong>Center Axis:</strong> {patternGrid.axisConfig.centerAxisIndex + 1}</p>
              <p><strong>Available Colors:</strong> {patternGrid.availableColors.length}</p>
            </div>
          </div>
        </div>

        {/* Pattern Preview (Read-only) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pattern Preview</h2>
          <PatternGridEditor editable={false} />
        </div>

        {/* Weaving Instructions Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Weaving Instructions Preview</h2>
          <div className="space-y-4">
            {patternGrid.rows.map((row) => {
              const stripRule = generateStripInitializationRule(row.index);
              const directions = generateBothDirectionInstructions(row.index);

              if (!stripRule || !directions) return null;

              return (
                <div key={row.index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                  <h3 className="font-medium text-lg mb-2">Row {row.index + 1}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Initialization: {formatStripInitializationRule(stripRule)}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Left: {formatInstructionStepsCompact(directions.leftInstruction.steps)}</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Right: {formatInstructionStepsCompact(directions.rightInstruction.steps)}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            onClick={handleBackToDesign}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Design
          </button>
          <button
            onClick={handleStartWeaving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Start Weaving →
          </button>
        </div>
      </div>
    </div>
  );
}
