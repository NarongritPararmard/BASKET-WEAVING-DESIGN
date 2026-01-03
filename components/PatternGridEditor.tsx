"use client";

import { useRef, useState, useCallback } from "react";
import { useWeavingStore } from "@/lib/store/useWeavingStore";

interface PatternGridEditorProps {
  selectedColor?: string;
  editable?: boolean;
  highlightRow?: number | null; // New prop for highlighting a row
}

export default function PatternGridEditor({
  selectedColor,
  editable = true,
  highlightRow = null,
}: PatternGridEditorProps) {
  const { patternGrid, toggleCell, setCellsInRange } = useWeavingStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ row: number; cell: number } | null>(null);
  const dragRef = useRef<{ row: number; cell: number } | null>(null);

  const handleCellInteraction = useCallback(
    (rowIndex: number, cellIndex: number, isDrag: boolean = false) => {
      if (!editable) return;

      if (isDrag && dragStart) {
        // During drag, set cells in range
        setCellsInRange(rowIndex, dragStart.cell, cellIndex, selectedColor);
      } else {
        // Single click/tap
        toggleCell(rowIndex, cellIndex, selectedColor);
      }
    },
    [editable, selectedColor, toggleCell, setCellsInRange, dragStart]
  );

  // Mouse events
  const handleMouseDown = (rowIndex: number, cellIndex: number) => {
    if (!editable) return;
    setIsDragging(true);
    setDragStart({ row: rowIndex, cell: cellIndex });
    dragRef.current = { row: rowIndex, cell: cellIndex };
    handleCellInteraction(rowIndex, cellIndex, false);
  };

  const handleMouseEnter = (rowIndex: number, cellIndex: number) => {
    if (!editable) return;
    if (isDragging && dragStart) {
      dragRef.current = { row: rowIndex, cell: cellIndex };
      handleCellInteraction(rowIndex, cellIndex, true);
    }
  };

  const handleMouseUp = () => {
    if (!editable) return;
    setIsDragging(false);
    setDragStart(null);
    dragRef.current = null;
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent, rowIndex: number, cellIndex: number) => {
    if (!editable) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ row: rowIndex, cell: cellIndex });
    dragRef.current = { row: rowIndex, cell: cellIndex };
    handleCellInteraction(rowIndex, cellIndex, false);
  };

  const handleTouchMove = (e: React.TouchEvent, rowIndex: number, cellIndex: number) => {
    if (!editable) return;
    if (isDragging && dragStart) {
      e.preventDefault();
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (target) {
        const rowAttr = target.getAttribute("data-row");
        const cellAttr = target.getAttribute("data-cell");
        
        if (rowAttr !== null && cellAttr !== null) {
          const touchRow = parseInt(rowAttr, 10);
          const touchCell = parseInt(cellAttr, 10);
          
          if (dragRef.current?.row !== touchRow || dragRef.current?.cell !== touchCell) {
            dragRef.current = { row: touchRow, cell: touchCell };
            handleCellInteraction(touchRow, touchCell, true);
          }
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (!editable) return;
    setIsDragging(false);
    setDragStart(null);
    dragRef.current = null;
  };

  if (patternGrid.rows.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No pattern initialized. Please configure settings first.
      </div>
    );
  }

  const { axisConfig, rows } = patternGrid;

  return (
    <div className="w-full">
      {/* Column headers (axis numbers) */}
      <div className="flex mb-2">
        <div className="w-12"></div> {/* Row number column */}
        <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${axisConfig.count}, minmax(0, 1fr))` }}>
          {Array(axisConfig.count)
            .fill(null)
            .map((_, index) => (
              <div
                key={`header-${index}`}
                className="text-xs text-center text-gray-500 dark:text-gray-400 font-medium"
              >
                {index === axisConfig.centerAxisIndex ? (
                  <span className="text-blue-600 dark:text-blue-400 font-bold">C{index + 1}</span>
                ) : (
                  index + 1
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-lg">
        <div className="inline-block min-w-full">
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={`flex ${
                highlightRow === rowIndex ? "bg-yellow-100 dark:bg-yellow-950 ring-4 ring-yellow-500" : ""
              }`}
            >
              {/* Row number */}
              <div
                className={`w-12 flex items-center justify-center text-xs font-medium border-r border-gray-300 dark:border-gray-600 ${
                  highlightRow === rowIndex
                    ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-base"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {rowIndex + 1}
              </div>

              {/* Cells */}
              <div
                className="flex-1 grid gap-0"
                style={{ gridTemplateColumns: `repeat(${axisConfig.count}, minmax(0, 1fr))` }}
              >
                {row.cells.map((cell, cellIndex) => (
                  <div
                    key={`cell-${rowIndex}-${cellIndex}`}
                    data-row={rowIndex}
                    data-cell={cellIndex}
                    onMouseDown={editable ? () => handleMouseDown(rowIndex, cellIndex) : undefined}
                    onMouseEnter={editable ? () => handleMouseEnter(rowIndex, cellIndex) : undefined}
                    onMouseUp={editable ? handleMouseUp : undefined}
                    onMouseLeave={editable ? handleMouseUp : undefined}
                    onTouchStart={editable ? (e) => handleTouchStart(e, rowIndex, cellIndex) : undefined}
                    onTouchMove={editable ? (e) => handleTouchMove(e, rowIndex, cellIndex) : undefined}
                    onTouchEnd={editable ? handleTouchEnd : undefined}
                    className={`
                      aspect-square border border-gray-300 dark:border-gray-600 cursor-pointer
                      transition-all duration-100 select-none
                      ${cell.colored 
                        ? "ring-1 ring-gray-400 dark:ring-gray-500" 
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                      ${isDragging && dragStart?.row === rowIndex && dragStart?.cell === cellIndex
                        ? "ring-2 ring-blue-500"
                        : ""
                      }
                      ${(highlightRow === rowIndex && !editable)
                        ? "ring-2 ring-yellow-500"
                        : ""
                      }
                      ${!editable ? "cursor-default opacity-75" : ""}
                    `}
                    style={{
                      backgroundColor: cell.colored ? cell.color : undefined,
                    }}
                    title={`Row ${rowIndex + 1}, Axis ${cellIndex + 1}${cellIndex === axisConfig.centerAxisIndex ? " (Center)" : ""}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      {editable && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>• Click or tap to toggle cell color</p>
          <p>• Click and drag to color multiple cells</p>
          <p>• C = Center axis</p>
        </div>
      )}
    </div>
  );
}

