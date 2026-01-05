"use client";

import { usePatternStore } from '../../store/patternStore';
import { useRouter } from 'next/navigation';

export default function RowNavigator() {
    const { state, setCurrentRow, setRowStatus, setWeavingMode } = usePatternStore();
    const router = useRouter();

    const handleNext = () => {
        setRowStatus(state.currentRow, 'completed');
        if (state.currentRow < state.numRows - 1) {
            setCurrentRow(state.currentRow + 1);
        }
    };

    const handleBack = () => {
        if (state.currentRow > 0) {
            setCurrentRow(state.currentRow - 1);
        }
    };

    const handleFinish = () => {
        setRowStatus(state.currentRow, 'completed');
        setWeavingMode(false);
        router.push('/');
    };

    const isCurrentLastRow = state.currentRow === state.numRows - 1;

    return (
        <div className="flex items-center justify-between gap-4 p-4 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700 mt-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <button
                onClick={handleBack}
                disabled={state.currentRow === 0}
                className="px-6 py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-slate-700 hover:bg-slate-600 text-slate-200"
            >
                ← ย้อนกลับ
            </button>

            <div className="flex flex-col items-center">
                <span className="text-xs text-slate-500 uppercase tracking-tighter">ความคืบหน้า</span>
                <span className="text-lg font-mono font-bold text-slate-300">
                    รอบที่ {state.currentRow + 1} / {state.numRows}
                </span>
            </div>

            {isCurrentLastRow ? (
                <button
                    onClick={handleFinish}
                    className="px-8 py-3 rounded-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-105 active:scale-95 transition-all text-white shadow-lg shadow-orange-500/20"
                >
                    เสร็จสิ้นการสาน 🎉
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-lg font-bold bg-gradient-to-r from-indigo-500 to-violet-500 hover:scale-105 active:scale-95 transition-all text-white shadow-lg shadow-indigo-500/20"
                >
                    ขั้นตอนถัดไป →
                </button>
            )}
        </div>
    );
}
