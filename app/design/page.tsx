"use client";

import { useEffect, useState } from "react";
import { useWeavingStore } from "@/lib/store/useWeavingStore";
import { useRouter } from "next/navigation";
import PatternGridEditor from "@/components/PatternGridEditor";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import ColorConfigPanel from "@/components/ColorConfigPanel";

export default function DesignPage() {
  const router = useRouter();
  const { patternGrid, setMode, initializePattern, confirmPattern } = useWeavingStore();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  useEffect(() => {
    setMode("design");
    if (patternGrid.rows.length === 0) {
      initializePattern();
    }
  }, [initializePattern, patternGrid.rows.length, setMode]);

  const handleConfirm = () => {
    // Check if pattern has at least some colored cells
    const hasColoredCells = patternGrid.rows.some((row) =>
      row.cells.some((cell) => cell.colored)
    );

    if (!hasColoredCells) {
      alert("Please add at least some colored cells to your pattern before confirming.");
      return;
    }

    confirmPattern();
    router.push("/confirm");
  };

  const selectedColor = patternGrid.availableColors[selectedColorIndex];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Design Pattern</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your pattern settings and design the weaving pattern using the grid below.
          </p>
        </div>

        {/* Configuration Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ConfigurationPanel />
          <ColorConfigPanel />
        </div>

        {/* Color Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Color for Drawing
          </label>
          <div className="flex gap-2">
            {patternGrid.availableColors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColorIndex(index)}
                className={`
                  w-12 h-12 rounded-lg border-2 transition-all
                  ${selectedColorIndex === index
                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                  }
                `}
                style={{ backgroundColor: color }}
                title={`Select color ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Pattern Grid Editor */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pattern Grid</h2>
          <PatternGridEditor selectedColor={selectedColor} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Confirm Pattern →
          </button>
        </div>
      </div>
    </div>
  );
}
