"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatternStore } from '../../store/patternStore';
import PatternGrid from '../../components/Grid/PatternGrid';
import InstructionPanel from '../../components/Weaving/InstructionPanel';
import RowNavigator from '../../components/Weaving/RowNavigator';

export default function WeavePage() {
    const { state } = usePatternStore();
    const router = useRouter();

    useEffect(() => {
        if (!state.isWeavingMode) {
            router.push('/');
        }
    }, [state.isWeavingMode, router]);

    if (!state.isWeavingMode) return null;

    return (
        <main className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col gap-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-1">
                        ระบบช่วยสาน (โหมดการสานจริง)
                    </h1>
                    <p className="text-slate-500 font-medium">ทำตามขั้นตอนการสานในแต่ละรอบอย่างระมัดระวัง</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="block text-xs font-bold text-slate-600 uppercase tracking-widest">รอบที่กำลังดำเนินการ</span>
                        <span className="text-3xl font-black text-indigo-500">{state.currentRow + 1}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center">
                        <div
                            className="w-10 h-10 rounded-full bg-indigo-500/20 border-2 border-indigo-500/40 animate-pulse"
                            style={{ clipPath: `inset(${100 - ((state.currentRow + 1) / state.numRows) * 100}% 0 0 0)` }}
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1">
                {/* Left Side: Grid Preview */}
                <div className="xl:col-span-5 space-y-6">
                    <div className="sticky top-8">
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">สถานะลวดลาย</h2>
                        <div className="scale-90 origin-top-left overflow-visible">
                            <PatternGrid />
                        </div>
                        <div className="mt-4 p-4 bg-slate-900/30 rounded-xl border border-slate-800 text-xs text-slate-500">
                            <p>แถวที่เน้นสีเหลืองคือรอบที่คุณอยู่ตอนนี้ คุณสามารถคลิกเลือกแถวอื่นเพื่อข้ามไปยังรอบที่ต้องการได้</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Instructions */}
                <div className="xl:col-span-7 flex flex-col">
                    <InstructionPanel />
                    <RowNavigator />

                    <div className="mt-8 flex gap-4">
                        <div className="flex-1 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                            <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                คำแนะนำ
                            </h3>
                            <p className="text-sm text-slate-400">
                                ตรวจสอบความยาวของตอกสานให้เพียงพอก่อนเริ่มรอบใหม่ ควรแบ่งจุดศูนย์กลางให้สมดุลทั้งด้านซ้ายและขวา
                            </p>
                        </div>
                        <div className="flex-1 p-6 bg-slate-800/20 rounded-2xl border border-slate-700/30">
                            <h3 className="text-slate-400 font-bold mb-2 flex items-center gap-2">
                                การแก้ไขข้อผิดพลาด
                            </h3>
                            <p className="text-sm text-slate-500">
                                หากสารผิดพลาด? สามารถกด "ย้อนกลับ" หรือคลิกแถวในตารางเพื่อเปลี่ยนตำแหน่งการสานให้ถูกต้อง
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
