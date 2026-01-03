"use client";

import { useWeavingStore } from "@/lib/store/useWeavingStore";
import { useState } from "react";

export default function ColorConfigPanel() {
  const { patternGrid, setAvailableColors } = useWeavingStore();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...patternGrid.availableColors];
    newColors[index] = newColor;
    setAvailableColors(newColors);
  };

  const handleAddColor = () => {
    const newColors = [...patternGrid.availableColors, "#000000"];
    setAvailableColors(newColors);
    setSelectedColorIndex(newColors.length - 1);
  };

  const handleRemoveColor = (index: number) => {
    if (patternGrid.availableColors.length > 1) {
      const newColors = patternGrid.availableColors.filter((_, i) => i !== index);
      setAvailableColors(newColors);
      if (selectedColorIndex >= newColors.length) {
        setSelectedColorIndex(newColors.length - 1);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Color Configuration</h2>
      
      <div className="space-y-4">
        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Available Colors
          </label>
          <div className="flex flex-wrap gap-3 mb-4">
            {patternGrid.availableColors.map((color, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                    style={{
                      borderColor: selectedColorIndex === index ? "#3B82F6" : undefined,
                    }}
                    onClick={() => setSelectedColorIndex(index)}
                  />
                  {selectedColorIndex === index && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveColor(index)}
                  disabled={patternGrid.availableColors.length === 1}
                  className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddColor}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
          >
            + Add Color
          </button>
        </div>

        {/* Selected Color Display */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Selected Color:</strong></p>
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: patternGrid.availableColors[selectedColorIndex] }}
              />
              <span className="font-mono">
                {patternGrid.availableColors[selectedColorIndex]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

