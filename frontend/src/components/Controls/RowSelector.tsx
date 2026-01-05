"use client";

import { usePatternStore } from '../../store/patternStore';

export default function RowSelector() {
    const { state, setNumRows } = usePatternStore();

    return (
        <div className="flex flex-col gap-2 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <label className="text-sm font-medium text-slate-300">จำนวนรอบการสาน (แถว)</label>
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min="1"
                    max="32"
                    value={state.numRows}
                    onChange={(e) => setNumRows(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-xl font-bold text-emerald-400 min-w-8">{state.numRows}</span>
            </div>
        </div>
    );
}
