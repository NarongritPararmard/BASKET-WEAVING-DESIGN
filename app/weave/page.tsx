"use client";

import PatternGridEditor from "@/components/PatternGridEditor";
import WeavingInstructions from "@/components/WeavingInstructions";
import { useWeavingStore } from "@/lib/store/useWeavingStore";
import { RowStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WeavePage() {
  const router = useRouter();
  const { patternGrid, currentRowIndex, setMode, setCurrentRow, updateRowStatus } = useWeavingStore();

  useEffect(() => {
    setMode("weave");
    if (currentRowIndex === null && patternGrid.rows.length > 0) {
      setCurrentRow(0);
    }
  }, [setMode, currentRowIndex, patternGrid.rows.length, setCurrentRow]);

  const handlePreviousRow = () => {
    if (currentRowIndex !== null && currentRowIndex > 0) {
      setCurrentRow(currentRowIndex - 1);
    }
  };

  const handleNextRow = () => {
    if (currentRowIndex !== null && currentRowIndex < patternGrid.rows.length - 1) {
      setCurrentRow(currentRowIndex + 1);
    }
  };

  const handleCompleteRow = () => {
    if (currentRowIndex !== null) {
      updateRowStatus(currentRowIndex, "completed");
      if (currentRowIndex < patternGrid.rows.length - 1) {
        setCurrentRow(currentRowIndex + 1);
      }
    }
  };

  const handleReworkRow = () => {
    if (currentRowIndex !== null) {
      updateRowStatus(currentRowIndex, "reworked");
    }
  };

  if (patternGrid.rows.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 dark:text-gray-400">
            No pattern found. Please design a pattern first.
          </p>
          <button
            onClick={() => router.push("/design")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Design
          </button>
        </div>
      </div>
    );
  }

  const currentRow = currentRowIndex !== null ? patternGrid.rows[currentRowIndex] : null;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Weaving Mode</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Pattern Grid Preview (Highlight current row) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-center md:text-left">Pattern Progress</h2>
            <div className="mt-4">
              <PatternGridEditor editable={false} highlightRow={currentRowIndex} />
            </div>
          </div>

          {/* Weaving Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 lg:p-8">
            {currentRow && (
              <>
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-3">
                    Row {currentRow.index + 1} of {patternGrid.totalRows}
                  </h2>
                  <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-4">
                    Status: <span className="font-semibold capitalize">{currentRow.status}</span>
                  </p>
                  {/* Row Status Controls */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <label htmlFor="row-status" className="text-xl lg:text-2xl font-medium">Set Status:</label>
                    <select
                      id="row-status"
                      value={currentRow.status}
                      onChange={(e) => updateRowStatus(currentRow.index, e.target.value as RowStatus)}
                      className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xl lg:text-2xl capitalize cursor-pointer"
                    >
                      <option value="notStarted">Not Started</option>
                      <option value="inProgress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="reworked">Reworked</option>
                    </select>
                  </div>
                  {/* Jump to any row */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label htmlFor="jump-to-row" className="text-xl lg:text-2xl font-medium">Jump to Row:</label>
                    <select
                      id="jump-to-row"
                      value={currentRowIndex !== null ? currentRowIndex + 1 : ""}
                      onChange={(e) => setCurrentRow(parseInt(e.target.value, 10) - 1)}
                      className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xl lg:text-2xl cursor-pointer"
                    >
                      {Array.from({ length: patternGrid.totalRows }, (_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-10">
                  <WeavingInstructions rowIndex={currentRow.index} />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-6">
                  <button
                    onClick={handlePreviousRow}
                    disabled={currentRowIndex === 0}
                    className="flex-1 px-8 py-5 text-2xl bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous Row
                  </button>
                  <button
                    onClick={handleNextRow}
                    disabled={currentRowIndex === patternGrid.rows.length - 1}
                    className="flex-1 px-8 py-5 text-2xl bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Row →
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button
                    onClick={handleCompleteRow}
                    className="flex-1 px-8 py-5 text-2xl bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={handleReworkRow}
                    className="flex-1 px-8 py-5 text-2xl bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Mark as Reworked
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
