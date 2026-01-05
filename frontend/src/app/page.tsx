"use client";

import { useRouter } from 'next/navigation';
import { usePatternStore } from '../store/patternStore';
import PatternGrid from '../components/Grid/PatternGrid';
import AxisSelector from '../components/Controls/AxisSelector';
import RowSelector from '../components/Controls/RowSelector';
import BasketScene from '../components/Visualizer/BasketScene';
import { useState } from 'react';


export default function Home() {
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
    <main className="min-h-screen p-8 max-w-[1600px] mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          ระบบออกแบบและช่วยสานตะกร้า
        </h1>
        <p className="text-slate-400 text-lg">
          ออกแบบลวดลายตะกร้าของคุณด้านล่าง คลิกที่ช่องเพื่อเปลี่ยนสถานะ
          แกนกลาง (C) จะใช้เป็นจุดอ้างอิงสำหรับการคำนวณลำดับการสาน
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
          <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 shadow-xl">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">ตั้งค่าโครงสร้าง</h2>
            <AxisSelector />
            <div className="h-4" />
            <RowSelector />
          </div>

          <div className="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
            <h3 className="text-indigo-400 font-bold mb-2">วิธีการใช้งาน</h3>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
              <li>คอลัมน์คือแกนแนวตั้ง (ตอกยืน)</li>
              <li>แถวคือรอบการสานจากล่างขึ้นบน</li>
              <li>ช่องที่ระบายสีหมายถึงเส้นสานจะทับหน้าแกนตั้ง</li>
              <li className="text-indigo-400 font-semibold">แนะนำ: เริ่มสานจากแกนกลาง (C) ออกไปข้างๆ เพื่อความสมดุล</li>
            </ul>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-4 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            ลบลวดลายทั้งหมด
          </button>
        </aside>

        {/* Design Area */}
        <section className="flex-1 min-w-0 space-y-8">
          <div className="flex flex-col xl:flex-row gap-8 items-start">
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">ผังลวดลาย (2D)</h2>
              <PatternGrid />
            </div>

            <div className="flex flex-col gap-4 w-full xl:w-[450px] shrink-0">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">ตัวอย่างรูปทรง (3D)</h2>
              <BasketScene />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleStartWeaving}
              className="group relative px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 text-xl">
                ยืนยันลวดลายและเริ่มการสาน
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </section>
      </div>

      <footer className="mt-20 py-8 border-t border-slate-900 text-center text-slate-600 text-sm">
        <p>เครื่องมือช่วยเรียนรู้ศิลปหัตถกรรมไทย สำหรับระดับชั้นมัธยมศึกษาปีที่ 5</p>
      </footer>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">ยืนยันการสร้างลวดลาย?</h3>
            <p className="text-slate-400 mb-8">
              เมื่อยืนยันแล้ว ระบบจะสลับไปยังโหมดช่วยสานจริง ซึ่งจะแสดงขั้นตอนการขัดตอกในแต่ละรอบ
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={confirmWeaving}
                className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                ยืนยันและเริ่มสาน
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
