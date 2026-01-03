"use client";

import { useRouter } from 'next/navigation';
import { usePatternStore } from '../store/patternStore';
import PatternGrid from '../components/Grid/PatternGrid';
import AxisSelector from '../components/Controls/AxisSelector';
import RowSelector from '../components/Controls/RowSelector';

export default function Home() {
  const { setWeavingMode } = usePatternStore();
  const router = useRouter();

  const handleStartWeaving = () => {
    setWeavingMode(true);
    router.push('/weave');
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          ระบบออกแบบและช่วยสานตะกร้า
        </h1>
        <p className="text-slate-400 text-lg">
          ออกแบบลวดลายตะกร้าของคุณด้านล่าง คลิกที่ช่องเพื่อเปลี่ยนสถานะ
          แกนกลาง (C) จะใช้เป็นจุดอ้างอิงสำหรับการคำนวณลำดับการสาน
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <aside className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">ตั้งค่าโครงสร้าง</h2>
            <AxisSelector />
            <div className="h-4" />
            <RowSelector />
          </div>

          <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
            <h3 className="text-indigo-400 font-bold mb-2">วิธีการใช้งาน</h3>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
              <li>คอลัมน์คือแกนแนวตั้ง (ตอกยืน)</li>
              <li>แถวคือรอบการสานจากล่างขึ้นบน</li>
              <li>ช่องที่ระบายสีหมายถึงเส้นสานจะทับหน้าแกนตั้ง</li>
            </ul>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-8">
          <PatternGrid />

          <div className="flex justify-end">
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
    </main>
  );
}
