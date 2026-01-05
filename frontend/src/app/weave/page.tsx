"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatternStore } from '../../store/patternStore';
import PatternGrid from '../../components/Grid/PatternGrid';
import InstructionPanel from '../../components/Weaving/InstructionPanel';
import RowNavigator from '../../components/Weaving/RowNavigator';
import BasketScene from '../../components/Visualizer/BasketScene';


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
        <main className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto flex flex-col gap-6 md:gap-8">
            <style jsx global>{`
                /* Override heights for responsive view */
                .visual-section-3d > div {
                    height: 320px !important;
                    min-height: 320px !important;
                }
                .visual-section-2d > div {
                    max-height: 280px !important;
                }
                @media (min-width: 1024px) {
                    .visual-section-3d > div {
                        height: 450px !important;
                        min-height: 450px !important;
                    }
                    .visual-section-2d > div {
                        max-height: 400px !important;
                    }
                }
            `}</style>

            <header className="flex flex-row items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight text-white mb-0 md:mb-1 truncate">
                        ระบบช่วยสาน
                    </h1>
                    <p className="text-[10px] md:text-sm text-slate-500 font-medium truncate">โหมดการสานจริง • ทำตามขั้นตอน</p>
                </div>

                <div className="flex items-center gap-3 md:gap-6 shrink-0">
                    <div className="text-right">
                        <span className="block text-[8px] md:text-xs font-bold text-slate-600 uppercase tracking-widest">รอบที่</span>
                        <span className="text-xl md:text-3xl font-black text-indigo-500">{state.currentRow + 1}</span>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-slate-800 flex items-center justify-center">
                        <div
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-500/20 border-2 border-indigo-500/40 animate-pulse"
                            style={{ clipPath: `inset(${100 - ((state.currentRow + 1) / state.numRows) * 100}% 0 0 0)` }}
                        />
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start flex-1">
                {/* Visual Section (3D & 2D) */}
                <div className="flex flex-col gap-6 md:gap-8 w-full lg:flex-1 min-w-0">
                    <div className="visual-section-3d">
                        <h2 className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 md:mb-4">หุ่นจำลองเสมือนจริง (3D)</h2>
                        <BasketScene />
                    </div>

                    <div className="visual-section-2d">
                        <h2 className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 md:mb-4">ความคืบหน้าบนแผนผัง (2D)</h2>
                        <PatternGrid />
                    </div>

                    <div className="p-3 md:p-4 bg-slate-900/30 rounded-xl border border-slate-800 text-[10px] md:text-xs text-slate-500">
                        <p>แถวที่เน้นสีเหลืองคือรอบที่คุณอยู่ตอนนี้ คุณสามารถคลิกเลือกแถวอื่นเพื่อข้ามไปยังรอบที่ต้องการได้</p>
                    </div>
                </div>

                {/* Instruction Section */}
                <div className="w-full lg:w-[400px] xl:w-[480px] shrink-0 flex flex-col lg:sticky lg:top-8 gap-4">
                    <InstructionPanel />
                    <RowNavigator />

                    <div className="hidden md:flex flex-col gap-4">
                        <div className="p-4 md:p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                            <h3 className="text-xs md:text-sm text-emerald-400 font-bold mb-1 md:mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                คำแนะนำ
                            </h3>
                            <p className="text-[10px] md:text-sm text-slate-400">
                                ตรวจสอบความยาวของตอกสานให้เพียงพอก่อนเริ่มรอบใหม่ ควรแบ่งจุดศูนย์กลางให้สมดุลทั้งด้านซ้ายและขวา
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
