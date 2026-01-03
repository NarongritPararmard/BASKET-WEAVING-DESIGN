"use client";

import { usePatternStore } from '../../store/patternStore';
import { generateRowInstructions } from '../../logic/instruction';

export default function InstructionPanel() {
    const { state } = usePatternStore();
    const currentRowData = state.grid[state.currentRow];

    if (!currentRowData) return null;

    const instructions = generateRowInstructions(currentRowData);

    const getStatusThai = (status: string) => {
        switch (status) {
            case 'completed': return 'สานเสร็จแล้ว';
            case 'in-progress': return 'กำลังสาน';
            case 'not-started': return 'ยังไม่เริ่ม';
            case 'reworked': return 'แก้ไขใหม่';
            default: return status;
        }
    };

    if (instructions.isEmpty) {
        return (
            <div className="flex flex-col gap-6 p-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-xl min-h-[400px] items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-slate-400 mb-2">รอบที่ {state.currentRow + 1} ไม่มีการสาน</h2>
                <p className="text-slate-500 max-w-sm">
                    คุณไม่ได้กำหนดลวดลาย (ไม่ได้ระบายสี) สำหรับรอบนี้ หากนี่เป็นความตั้งใจ คุณสามารถเลื่อนผ่านไปยังรอบถัดไปได้ทันที
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    คำแนะนำการสานรอบที่ {state.currentRow + 1}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${state.rowStatuses[state.currentRow] === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    state.rowStatuses[state.currentRow] === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-700 text-slate-400'
                    }`}>
                    {getStatusThai(state.rowStatuses[state.currentRow])}
                </span>
            </div>

            <div className="space-y-6">
                {/* Initialization Section */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                    <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        การเริ่มต้นเส้นสาน (Step 1)
                    </h3>
                    <p className="text-slate-200 text-lg leading-relaxed font-medium">
                        {instructions.initialization}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Side Section */}
                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">ทิศทางการสานทางซ้าย</h3>
                        <div className="space-y-3">
                            {instructions.leftSide.length > 0 ? instructions.leftSide.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className={`w-2 h-10 rounded-full ${step.action === 'cover' ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                                    <div>
                                        <span className={`text-lg font-bold ${step.action === 'cover' ? 'text-indigo-400' : 'text-slate-400'}`}>
                                            {step.action === 'cover' ? 'ทับหน้า' : 'ข้ามหลัง'}
                                        </span>
                                        <p className="text-slate-300">
                                            {step.count} แกนตั้ง
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500 text-sm italic">สานต่อเนื่องจนถึงด้านหลังตะกร้า</p>
                            )}
                        </div>
                    </div>

                    {/* Right Side Section */}
                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">ทิศทางการสานทางขวา</h3>
                        <div className="space-y-3">
                            {instructions.rightSide.length > 0 ? instructions.rightSide.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className={`w-2 h-10 rounded-full ${step.action === 'cover' ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                                    <div>
                                        <span className={`text-lg font-bold ${step.action === 'cover' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                            {step.action === 'cover' ? 'ทับหน้า' : 'ข้ามหลัง'}
                                        </span>
                                        <p className="text-slate-300">
                                            {step.count} แกนตั้ง
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500 text-sm italic">สานต่อเนื่องจนถึงด้านหลังตะกร้า</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500 flex items-center justify-between">
                <span>ทำตามขั้นตอนจากบนลงล่างแยกซ้ายขวาอิสระ</span>
                <span>เส้นสานจะมาบรรจบกันที่ด้านหลังตะกร้า</span>
            </div>
        </div>
    );
}
