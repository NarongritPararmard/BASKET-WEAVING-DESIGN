"use client";

interface GridCellProps {
    active: boolean;
    highlighted: boolean;
    onClick: () => void;
    onContextMenu?: (e: React.MouseEvent) => void;
    rowLabel?: string;
    color?: string;
}

export default function GridCell({ active, highlighted, onClick, onContextMenu, rowLabel, color = '#6366F1' }: GridCellProps) {
    return (
        <div
            onClick={onClick}
            onContextMenu={onContextMenu}
            className={`
        relative w-10 h-10 border border-slate-700 cursor-pointer transition-all duration-200
        flex items-center justify-center
        ${active ? '' : 'bg-slate-800 hover:bg-slate-700'}
        ${highlighted ? 'ring-2 ring-amber-400 z-10' : ''}
      `}
            style={active ? { 
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}40`
            } : {}}
        >
            {rowLabel && (
                <span className="absolute -left-8 text-xs text-slate-400 font-mono">
                    {rowLabel}
                </span>
            )}
        </div>
    );
}
