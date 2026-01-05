"use client";

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    // Handle initial mount and theme detection
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('light', savedTheme === 'light');
        } else {
            // Default to dark
            document.documentElement.classList.remove('light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('light', newTheme === 'light');
    };

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-[9999] p-3 md:p-4 bg-white dark:bg-slate-900 light:bg-indigo-600 text-indigo-600 light:text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group border border-slate-200 light:border-transparent"
            style={{
                backgroundColor: theme === 'dark' ? 'white' : '#4f46e5',
                color: theme === 'dark' ? '#4f46e5' : 'white',
                boxShadow: theme === 'dark' ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(79, 70, 229, 0.4)'
            }}
            aria-label="Toggle Light/Dark Mode"
        >
            {theme === 'dark' ? (
                /* Sun Icon */
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
            ) : (
                /* Moon Icon */
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
            <span className="absolute right-full mr-4 px-3 py-1.5 bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                {theme === 'dark' ? 'โหมดกลางวัน' : 'โหมดกลางคืน'}
            </span>
        </button>
    );
}
