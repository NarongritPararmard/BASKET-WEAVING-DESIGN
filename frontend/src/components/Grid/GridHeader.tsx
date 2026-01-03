"use client";

interface GridHeaderProps {
    numAxes: number;
    centerAxis: number;
}

export default function GridHeader({ numAxes, centerAxis }: GridHeaderProps) {
    return (
        <div className="flex gap-0 mb-2 ml-10">
            {Array.from({ length: numAxes }).map((_, i) => (
                <div
                    key={i}
                    className={`
            w-10 text-center text-[10px] font-mono
            ${i === centerAxis ? 'text-amber-400 font-bold' : 'text-slate-500'}
          `}
                >
                    {i === centerAxis ? 'C' : i + 1}
                </div>
            ))}
        </div>
    );
}
