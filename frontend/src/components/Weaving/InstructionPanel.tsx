"use client";

import { usePatternStore } from '../../store/patternStore';
import { generateRowInstructions } from '../../logic/instruction';

export default function InstructionPanel() {
    const { state } = usePatternStore();
    const currentRowData = state.grid[state.currentRow];

    if (!currentRowData) return null;

    const instructions = generateRowInstructions(currentRowData);

    return (
        <div className="flex flex-col gap-6 p-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Round {state.currentRow + 1} Instructions
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${state.rowStatuses[state.currentRow] === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        state.rowStatuses[state.currentRow] === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-slate-700 text-slate-400'
                    }`}>
                    {state.rowStatuses[state.currentRow]}
                </span>
            </div>

            <div className="space-y-6">
                {/* Initialization Section */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        Strip Initialization
                    </h3>
                    <p className="text-slate-200 text-lg leading-relaxed">
                        {instructions.initialization}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Side Section */}
                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Left Direction</h3>
                        <div className="space-y-3">
                            {instructions.leftSide.length > 0 ? instructions.leftSide.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className={`w-2 h-10 rounded-full ${step.action === 'cover' ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                                    <div>
                                        <span className={`text-lg font-bold ${step.action === 'cover' ? 'text-indigo-400' : 'text-slate-400'}`}>
                                            {step.action.toUpperCase()}
                                        </span>
                                        <p className="text-slate-300">
                                            {step.count} {step.count === 1 ? 'axis' : 'axes'}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500 text-sm italic">Continuous weaving until the back.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Side Section */}
                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Right Direction</h3>
                        <div className="space-y-3">
                            {instructions.rightSide.length > 0 ? instructions.rightSide.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className={`w-2 h-10 rounded-full ${step.action === 'cover' ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                                    <div>
                                        <span className={`text-lg font-bold ${step.action === 'cover' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                            {step.action.toUpperCase()}
                                        </span>
                                        <p className="text-slate-300">
                                            {step.count} {step.count === 1 ? 'axis' : 'axes'}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500 text-sm italic">Continuous weaving until the back.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500 flex items-center justify-between">
                <span>Follow steps from top to bottom for each side independently.</span>
                <span>Sides meet at the back of the basket.</span>
            </div>
        </div>
    );
}
