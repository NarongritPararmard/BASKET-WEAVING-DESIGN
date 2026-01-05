"use client";

import Link from 'next/link';

export default function HelpPage() {
    const steps = [
        {
            title: "1. ออกแบบลวดลาย (Design)",
            description: "ใช้ระบบผัง 2D ในการกำหนดจุดที่เส้นสานจะทับหน้าแกนตั้ง (ตอกยืน) โดยระบบจะจำลองรูปทรง 3D ให้ดูแบบเรียลไทม์",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            color: "bg-blue-500/20 text-blue-400 border-blue-500/20"
        },
        {
            title: "2. เตรียมอุปกรณ์ (Preparation)",
            description: "เตรียมตอกไม้ไผ่หรือหวายสำหรับทำแกนตั้งและเส้นสาน กำหนดแกนกลางให้ชัดเจนตามที่ออกแบบไว้ (แกน C)",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            color: "bg-amber-500/20 text-amber-400 border-amber-500/20"
        },
        {
            title: "3. เริ่มกระบวนการสาน (Weaving)",
            description: "เข้าสู่โหมดการสานจริง ระบบจะแสดงลำดับการขัดตอกทีละรอบ คุณเพียงแค่ทำตามขั้นตอนที่ปรากฏบนหน้าจอ",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20"
        }
    ];

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-16">
                    <Link href="/" className="text-slate-500 hover:text-white flex items-center gap-2 mb-8 transition-colors group">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        กลับหน้าหลัก
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        คู่มือการใช้งาน <span className="text-indigo-500">Basket Master</span>
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed">
                        เปลี่ยนการออกแบบงานฝีมือไทยดั้งเดิมให้เป็นเรื่องง่ายและทันสมัย ด้วยระบบช่วยสานดิจิทัล
                    </p>
                </header>

                <div className="space-y-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className={`p-8 rounded-3xl border ${step.color} bg-slate-900/40 backdrop-blur-sm flex flex-col md:flex-row gap-8 items-start hover:scale-[1.02] transition-transform duration-300`}>
                            <div className={`p-4 rounded-2xl ${step.color.split(' ')[0]} border shrink-0`}>
                                {step.icon}
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                                <p className="text-slate-400 leading-relaxed text-lg">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-12 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center overflow-hidden relative group">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-6">พร้อมที่จะเริ่มสร้างสรรค์หรือยัง?</h2>
                        <Link
                            href="/design"
                            className="inline-block py-5 px-12 bg-white text-indigo-600 font-black rounded-2xl hover:bg-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                        >
                            เริ่มออกแบบตอนนี้เลย
                        </Link>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                    <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                </div>

                <footer className="mt-20 text-center pb-12 border-t border-slate-900 pt-12">
                    <p className="text-slate-600">
                        © 2026 Basket Master - นวัตกรรมเพื่อการเรียนรู้ศิลปหัตถกรรมไทย
                    </p>
                </footer>
            </div>
        </main>
    );
}
