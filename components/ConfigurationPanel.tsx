"use client";

import { useWeavingStore } from "@/lib/store/useWeavingStore";
import { useState } from "react";
import { calculateCenterAxisIndex } from "@/lib/weaving/centerAxis";

export default function ConfigurationPanel() {
  const { patternGrid, setAxisCount, setCenterAxisIndex, setTotalRows } = useWeavingStore();
  const [axisCount, setAxisCountLocal] = useState(patternGrid.axisConfig.count);
  const [totalRows, setTotalRowsLocal] = useState(patternGrid.totalRows);
  const [centerAxisMode, setCenterAxisMode] = useState<"auto" | "manual">("auto");
  const [manualCenterAxis, setManualCenterAxis] = useState(patternGrid.axisConfig.centerAxisIndex);

  const handleAxisCountChange = (value: number) => {
    if (value >= 4 && value <= 100) {
      setAxisCountLocal(value);
      setAxisCount(value);
    }
  };

  const handleTotalRowsChange = (value: number) => {
    if (value >= 1 && value <= 200) {
      setTotalRowsLocal(value);
      setTotalRows(value);
    }
  };

  const handleCenterAxisModeChange = (mode: "auto" | "manual") => {
    setCenterAxisMode(mode);
    if (mode === "auto") {
      const autoCenter = calculateCenterAxisIndex(axisCount);
      setCenterAxisIndex(autoCenter);
    } else {
      setCenterAxisIndex(manualCenterAxis);
    }
  };

  const handleManualCenterAxisChange = (value: number) => {
    if (value >= 0 && value < axisCount) {
      setManualCenterAxis(value);
      setCenterAxisIndex(value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Pattern Configuration</h2>
      
      <div className="space-y-4">
        {/* Number of Vertical Axes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Vertical Axes
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="4"
              max="100"
              value={axisCount}
              onChange={(e) => handleAxisCountChange(parseInt(e.target.value, 10) || 4)}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              (Center axis: {patternGrid.axisConfig.centerAxisIndex + 1})
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Vertical axes are arranged in a circle (shown linearly in the grid)
          </p>
        </div>

        {/* Center Axis Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Center Axis (C) Configuration
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="centerAxisMode"
                  value="auto"
                  checked={centerAxisMode === "auto"}
                  onChange={() => handleCenterAxisModeChange("auto")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Auto (middle: {calculateCenterAxisIndex(axisCount) + 1})</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="centerAxisMode"
                  value="manual"
                  checked={centerAxisMode === "manual"}
                  onChange={() => handleCenterAxisModeChange("manual")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Manual</span>
              </label>
            </div>
            {centerAxisMode === "manual" && (
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  max={axisCount - 1}
                  value={manualCenterAxis}
                  onChange={(e) => handleManualCenterAxisChange(parseInt(e.target.value, 10) || 0)}
                  className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Axis {manualCenterAxis + 1} of {axisCount}
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Center axis is a logical reference for dividing left/right directions and determining strip initialization.
            It is not a physical start or end point.
          </p>
        </div>

        {/* Number of Weaving Rows */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Weaving Rows
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max="200"
              value={totalRows}
              onChange={(e) => handleTotalRowsChange(parseInt(e.target.value, 10) || 1)}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Rows are ordered from bottom to top
            </span>
          </div>
        </div>

        {/* Current Pattern Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Current Pattern:</strong></p>
            <p>• {patternGrid.axisConfig.count} vertical axes</p>
            <p>• {patternGrid.totalRows} weaving rows</p>
            <p>• {patternGrid.rows.filter((r) => r.cells.some((c) => c.colored)).length} rows with colored cells</p>
          </div>
        </div>
      </div>
    </div>
  );
}

