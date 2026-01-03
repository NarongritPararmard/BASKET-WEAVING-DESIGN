"use client";

import { useWeavingStore } from "@/lib/store/useWeavingStore";

interface PatternGridProps {
  editable?: boolean;
  highlightRow?: number | null;
}

export default function PatternGrid({ editable = true, highlightRow = null }: PatternGridProps) {
  const { pattern, config, toggleCell, setCellColor } = useWeavingStore();

  if (pattern.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No pattern initialized. Please configure settings first.
      </div>
    );
  }

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    if (editable) {
      toggleCell(rowIndex, cellIndex);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${config.numAxes}, minmax(0, 1fr))` }}>
          {pattern.map((row, rowIndex) =>
            row.cells.map((cell, cellIndex) => (
              <div
                key={`${rowIndex}-${cellIndex}`}
                onClick={() => handleCellClick(rowIndex, cellIndex)}
                className={`
                  aspect-square border border-gray-300 dark:border-gray-600 cursor-pointer
                  transition-all duration-150
                  ${cell.colored ? "bg-opacity-100" : "bg-gray-100 dark:bg-gray-700"}
                  ${highlightRow === rowIndex ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                  ${editable ? "hover:border-blue-500" : ""}
                `}
                style={{
                  backgroundColor: cell.colored ? cell.color || config.colors[0] : undefined,
                }}
                title={`Row ${rowIndex + 1}, Axis ${cellIndex + 1}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

