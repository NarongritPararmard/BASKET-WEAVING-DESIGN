"use client";

import { usePatternStore } from '../../store/patternStore';
import { getCenterAxis } from '../../logic/weaving';
import GridCell from './GridCell';
import GridHeader from './GridHeader';

export default function PatternGrid() {
    const { state, toggleCell, setCurrentRow } = usePatternStore();
    const centerAxis = getCenterAxis(state.numAxes);

    const containerWidth = state.numAxes * 32 + 80; // เปลี่ยน 40 เป็น 32 หากใช้ w-8

    return (
        <div
            className="h-fit flex flex-col items-start overflow-auto p-4 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl transition-all duration-300"
            style={{
                maxHeight: `${Math.max(400, state.numRows * 45 + 100)}px`,
                width: `${Math.min(1200, containerWidth)}px`,
                maxWidth: '100%'
            }}
        >



            <GridHeader numAxes={state.numAxes} centerAxis={centerAxis} />

            <div className="flex flex-col-reverse gap-0 ml-10">
                {state.grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-0 group">
                        <span className="w-8 -ml-10 flex items-center justify-end pr-2 text-xs text-slate-500 font-mono">
                            R{rowIndex + 1}
                        </span>
                        {row.map((active, colIndex) => (
                            <GridCell
                                key={colIndex}
                                active={active}
                                highlighted={state.isWeavingMode && state.currentRow === rowIndex}
                                onClick={() => {
                                    if (state.isWeavingMode) {
                                        setCurrentRow(rowIndex);
                                    } else {
                                        toggleCell(rowIndex, colIndex);
                                    }
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
