"use client";

interface GridHeaderProps {
    numAxes: number;
    centerAxis: number;
}

export default function GridHeader({ numAxes, centerAxis }: GridHeaderProps) {
    const getLabel = (index: number) => {
        if (index === centerAxis) return 'C';
        if (index < centerAxis) return (centerAxis - index).toString();
        return (index - centerAxis).toString();
    };

    return (
        <div className="flex gap-0 mb-2 ml-10">
            {Array.from({ length: numAxes }).map((_, i) => (
                <div
                    key={i}
                    className={`
            w-10 text-center text-[10px] font-mono flex flex-col items-center
            ${i === centerAxis ? 'text-amber-400 font-bold' : 'text-slate-500'}
          `}
                >
                    <span>{getLabel(i)}</span>
                    {i !== centerAxis && (
                        <span className="text-[8px] opacity-50">
                            {i < centerAxis ? 'L' : 'R'}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
