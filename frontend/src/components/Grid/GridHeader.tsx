"use client";

interface GridHeaderProps {
    numAxes: number;
    centerAxis: number;
    size: number;
}

export default function GridHeader({ numAxes, centerAxis, size }: GridHeaderProps) {
    const getLabel = (index: number) => {
        if (index === centerAxis) return 'C';
        if (index < centerAxis) return (centerAxis - index).toString();
        return (index - centerAxis).toString();
    };

    // Calculate dynamic font size based on cell size
    const fontSize = Math.max(8, Math.min(11, size * 0.45));
    const showSubLabel = size > 16;

    return (
        <div className="flex gap-0 mb-2" style={{ marginLeft: `${size}px` }}>
            {Array.from({ length: numAxes }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        width: `${size}px`,
                        fontSize: `${fontSize}px`
                    }}
                    className={`
            text-center font-mono flex flex-col items-center leading-tight
            ${i === centerAxis ? 'text-amber-400 font-bold' : 'text-slate-500'}
          `}
                >
                    <span>{getLabel(i)}</span>
                    {i !== centerAxis && showSubLabel && (
                        <span style={{ fontSize: `${fontSize * 0.8}px` }} className="opacity-50">
                            {i < centerAxis ? 'L' : 'R'}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
