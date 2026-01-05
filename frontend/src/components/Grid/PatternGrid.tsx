"use client";

import { usePatternStore } from '../../store/patternStore';
import { getCenterAxis } from '../../logic/weaving';
import GridCell from './GridCell';
import GridHeader from './GridHeader';

export default function PatternGrid() {
    const { state, toggleCell, setCurrentRow, setGridZoom, resetGrid } = usePatternStore();
    const centerAxis = getCenterAxis(state.numAxes);

    const baseSize = 32;
    const cellSize = baseSize * state.gridZoom;
    const containerWidth = state.numAxes * cellSize + (cellSize * 3);

    const handleZoomIn = (e: React.MouseEvent) => {
        e.preventDefault();
        setGridZoom(Math.min(2.5, state.gridZoom + 0.15));
    };
    const handleZoomOut = (e: React.MouseEvent) => {
        e.preventDefault();
        setGridZoom(Math.max(0.3, state.gridZoom - 0.15));
    };

    const handleClearGrid = (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm('คุณต้องการลบลวดลายทั้งหมดใช่หรือไม่?')) {
            resetGrid();
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Zoom Controls & Action Bar */}
            <div
                className="flex items-center justify-between gap-2"
                style={{ width: `${Math.min(1200, containerWidth)}px`, maxWidth: '100%' }}
            >
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleZoomOut}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Zoom Out"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
                    </button>
                    <span className="text-xs font-mono text-slate-500 min-w-[3rem] text-center">
                        {Math.round(state.gridZoom * 100)}%
                    </span>
                    <button
                        type="button"
                        onClick={handleZoomIn}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Zoom In"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => setGridZoom(1.0)}
                        className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-all ml-2"
                    >
                        Reset Zoom
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleClearGrid}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all"
                    title="ล้างลวดลายทั้งหมด"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div
                className="h-fit flex flex-col items-start overflow-auto p-4 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl transition-all duration-300"
                style={{
                    maxHeight: `${Math.max(300, state.numRows * (cellSize * 1.2) + 100)}px`,
                    width: `${Math.min(1200, containerWidth)}px`,
                    maxWidth: '100%'
                }}
            >
                <GridHeader numAxes={state.numAxes} centerAxis={centerAxis} size={cellSize} />

                <div className="flex flex-col-reverse gap-0" style={{ marginLeft: `${cellSize}px` }}>
                    {state.grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-0 group">
                            {row.map((active, colIndex) => (
                                <GridCell
                                    key={colIndex}
                                    active={active}
                                    size={cellSize}
                                    rowLabel={colIndex === 0 ? `R${rowIndex + 1}` : undefined}
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
        </div>
    );
}
