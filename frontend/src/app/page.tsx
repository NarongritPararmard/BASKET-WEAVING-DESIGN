"use client";

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="fixed inset-0 bg-slate-950 text-white overflow-hidden touch-none selection:bg-indigo-500/30 flex flex-col items-center justify-center p-6 overscroll-none">
      <style jsx global>{`
                html, body {
                    overflow: hidden !important;
                    height: 100% !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    position: fixed;
                    overscroll-behavior: none;
                    touch-action: none;
                    -webkit-overflow-scrolling: none;
                }
            `}</style>
      {/* Animated Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl w-full flex flex-col items-center flex-1 justify-center px-4">
        {/* Hero Content Group */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <div className="inline-block px-4 py-1.5 mb-6 md:mb-8 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase animate-fade-in">
            The Modern Way to Weave
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tighter animate-slide-up">
            สานต่อภูมิปัญญา <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ด้วยดิจิทัลคอนสตรัค
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-xl lg:text-2xl max-w-2xl mb-8 md:mb-10 leading-relaxed animate-fade-in-delayed">
            เปิดสัมผัสใหม่แห่งการเรียนรู้หัตถกรรมไทย ออกแบบลวดลายตะกร้าในรูปแบบ 3D
            และให้ระบบดิจิทัลนำทางคุณสานจริงทีละขั้นตอน
          </p>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto animate-fade-in-delayed-more">
            <Link
              href="/design"
              className="group relative px-10 py-4 md:py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 text-sm md:text-base whitespace-nowrap"
            >
              เริ่มออกแบบลวดลาย
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/help"
              className="group px-10 py-4 md:py-5 bg-slate-900 text-white font-bold rounded-2xl border border-slate-800 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base whitespace-nowrap"
            >
              ดูวิธีการใช้งาน
              <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Sub-visual teaser */}
        <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl relative animate-float">
          <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] -z-10" />
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-3 rounded-[2rem] shadow-2xl overflow-hidden aspect-[21/9] flex items-center justify-center group">
            <div className="text-center group-hover:scale-110 transition-transform duration-700">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <svg className="w-4 h-4 md:w-6 md:h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <p className="text-slate-500 font-mono text-[7px] md:text-[9px] lg:text-[10px] tracking-[0.3em] uppercase opacity-70">Interactive Digital Craftsmanship</p>
            </div>
          </div>
        </div>

        {/* Credit - Always pinned to bottom through layout */}
        <div className="mt-8 md:mt-12 text-slate-700 text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase opacity-60">
          Innovative Learning for Modern Thai Heritage
        </div>
      </div>


      <style jsx>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-slide-up { animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fade-in 1.2s ease-out forwards; }
                .animate-fade-in-delayed { animation: fade-in 1.2s ease-out 0.2s both; }
                .animate-fade-in-delayed-more { animation: fade-in 1.2s ease-out 0.4s both; }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
    </main>
  );
}
