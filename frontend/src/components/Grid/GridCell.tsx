"use client";

interface GridCellProps {
    active: boolean;
    highlighted: boolean;
    onClick: () => void;
    rowLabel?: string;
}

export default function GridCell({ active, highlighted, onClick, rowLabel }: GridCellProps) {
    return (
        <div
            onClick={onClick}
            // w-10 h-10 คือขนาด 40px x 40px
            // หากต้องการให้ช่องเล็กลง ลองเปลี่ยนเป็น w-8 h-8 (32px) หรือ w-6 h-6 (24px)
            className={`
        relative w-8 h-8 border border-slate-700 cursor-pointer transition-all duration-200
        flex items-center justify-center
        ${active ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800 hover:bg-slate-700'}
        ${highlighted ? 'ring-2 ring-amber-400 z-10' : ''}
      `}
        >
            {rowLabel && (
                <span className="absolute -left-8 text-xs text-slate-400 font-mono">
                    {rowLabel}
                </span>
            )}
        </div>
    );
}
