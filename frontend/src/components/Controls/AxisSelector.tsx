"use client";

import { usePatternStore } from '../../store/patternStore';

export default function AxisSelector() {
    const { state, setNumAxes } = usePatternStore();

    return (
        <div className="flex flex-col gap-2 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <label className="text-sm font-medium text-slate-300">จำนวนแกนตั้ง (ซี่เบญจพรรณ)</label>
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min="4"
                    max="48"
                    step="1"
                    value={state.numAxes}
                    onChange={(e) => setNumAxes(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-xl font-bold text-indigo-400 min-w-8">{state.numAxes}</span>
            </div>
        </div>
    );
}
