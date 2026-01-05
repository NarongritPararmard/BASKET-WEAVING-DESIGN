"use client";

interface GridCellProps {
    active: boolean;
    highlighted: boolean;
    onClick: () => void;
    rowLabel?: string;
    size: number;
}

export default function GridCell({ active, highlighted, onClick, rowLabel, size }: GridCellProps) {
    const fontSize = Math.max(8, Math.min(12, size * 0.45));
    const showLabel = size > 10;
    const labelWidth = Math.max(28, size * 2);

    return (
        <div
            onClick={onClick}
            style={{ width: `${size}px`, height: `${size}px` }}
            className={`
        relative border border-slate-700 cursor-pointer transition-all duration-200
        flex items-center justify-center
        ${active ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800 hover:bg-slate-700'}
        ${highlighted ? 'ring-2 ring-amber-400 z-10' : ''}
      `}
        >
            {rowLabel && showLabel && (
                <span
                    className="absolute text-slate-400 font-mono pr-2"
                    style={{
                        left: `-${labelWidth}px`,
                        width: `${labelWidth}px`,
                        fontSize: `${fontSize}px`,
                        textAlign: 'right'
                    }}
                >
                    {rowLabel}
                </span>
            )}
        </div>
    );
}
