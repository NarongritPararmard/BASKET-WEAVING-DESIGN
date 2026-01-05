"use client";

import { useRouter } from 'next/navigation';
import { usePatternStore } from '../../store/patternStore';
import PatternGrid from '../../components/Grid/PatternGrid';
import AxisSelector from '../../components/Controls/AxisSelector';
import RowSelector from '../../components/Controls/RowSelector';
import BasketScene from '../../components/Visualizer/BasketScene';
import { useState } from 'react';
import Link from 'next/link';

export default function DesignPage() {
    const { setWeavingMode, resetGrid } = usePatternStore();
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleStartWeaving = () => {
        setShowConfirm(true);
    };

    const confirmWeaving = () => {
        setWeavingMode(true);
        router.push('/weave');
    };

    const handleReset = () => {
        if (confirm('คุณต้องการลบลวดลายทั้งหมดใช่หรือไม่?')) {
            resetGrid();
        }
    };

    return (
        <main className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto flex flex-col gap-6 md:gap-10">
            <style jsx global>{`
                /* Override heights for responsive view */
                .visual-section-3d > div {
                    height: 300px !important;
                    min-height: 300px !important;
                }
                .visual-section-2d > div {
                    max-height: 300px !important;
                }
                @media (min-width: 1024px) {
                    .visual-section-3d > div {
                        height: 480px !important;
                        min-height: 480px !important;
                    }
                    .visual-section-2d > div {
                        max-height: 450px !important;
                    }
                }
            `}</style>

            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-2">
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 text-sm font-bold transition-colors mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        กลับหน้าหลัก
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                        ออกแบบลวดลาย
                    </h1>
                    <p className="text-slate-500 text-xs md:text-base max-w-xl font-medium">
                        คลิกที่ช่องเพื่อกำหนดจุดขัดตอก ระบบจะคำนวณรูปทรง 3D ให้ทันที
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleReset}
                        className="flex-1 sm:flex-none py-3 px-5 bg-red-500/5 hover:bg-red-500/10 text-red-500/70 hover:text-red-500 border border-red-500/10 hover:border-red-500/20 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        ล้างทั้งหมด
                    </button>
                    <div className="hidden sm:block h-10 w-px bg-slate-800 mx-2" />
                    <button
                        onClick={handleStartWeaving}
                        className="hidden sm:flex py-3 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/20 items-center gap-2"
                    >
                        เริ่มสานจริง
                        <span>→</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 items-start flex-1">
                {/* Settings Sidebar */}
                <aside className="w-full lg:w-[320px] shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className="p-5 md:p-6 bg-slate-900/50 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                        <h2 className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">โครงสร้างตะกร้า</h2>
                        <AxisSelector />
                        <RowSelector />
                    </div>

                    <div className="p-5 md:p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 flex flex-col justify-center">
                        <h3 className="text-indigo-400 text-xs md:text-sm font-bold mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            เคล็ดลับการออกแบบ
                        </h3>
                        <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed font-medium">
                            การสลับลวดลายที่เป็นระเบียบจะช่วยให้ตะกร้ามีความแข็งแรงสูงสุด ควรตรวจสอบรูปทรง 3D สม่ำเสมอ
                        </p>
                    </div>
                </aside>

                {/* Design Area */}
                <section className="flex-1 min-w-0 space-y-8 w-full">
                    <div className="flex flex-col xl:flex-row gap-8 items-start">
                        <div className="flex flex-col gap-3 flex-1 min-w-0 visual-section-2d w-full">
                            <h2 className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">ผังลวดลาย (2D View)</h2>
                            <PatternGrid />
                        </div>

                        <div className="flex flex-col gap-3 w-full xl:w-[450px] shrink-0 visual-section-3d">
                            <h2 className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">ตัวอย่างรูปทรง (3D Preview)</h2>
                            <BasketScene />
                        </div>
                    </div>

                    {/* Mobile Only Action Button */}
                    <div className="sm:hidden pt-4 pb-10">
                        <button
                            onClick={handleStartWeaving}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-3 text-lg active:scale-95 transition-transform"
                        >
                            เริ่มกระบวนการสานจริง
                            <span className="text-2xl">→</span>
                        </button>
                    </div>
                </section>
            </div>


            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center">
                        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">พร้อมที่จะสานหรือยัง?</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            ระบบจะพาคุณเข้าสู่โหมดการสานทีละขั้นตอน เพื่อช่วยให้คุณสานตะกร้าตามที่ออกแบบไว้ได้อย่างถูกต้องแม่นยำ
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all order-2 sm:order-1"
                            >
                                ตรวจทานอีกครั้ง
                            </button>
                            <button
                                onClick={confirmWeaving}
                                className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] order-1 sm:order-2"
                            >
                                ลุยเลย!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
