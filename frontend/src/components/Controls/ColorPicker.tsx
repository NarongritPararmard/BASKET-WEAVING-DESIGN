"use client";

import { usePatternStore } from '../../store/patternStore';

const PRESET_COLORS = [
    '#6366F1', // indigo-500
    '#10B981', // emerald-500  
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#14B8A6', // teal-500
    '#F97316', // orange-500
];

export default function ColorPicker() {
    const { state, setSelectedColor, addToColorHistory } = usePatternStore();

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        addToColorHistory(color);
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <label className="text-sm font-medium text-slate-300">เลือกสีลวดลาย</label>
            
            {/* Recent colors */}
            {state.colorHistory.length > 1 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-xs text-slate-500 w-full mb-1">สีล่าสุด:</span>
                    {state.colorHistory.slice(-5).reverse().map((color) => (
                        <button
                            key={color}
                            onClick={() => handleColorSelect(color)}
                            className={`
                                w-6 h-6 rounded border transition-all duration-200
                                ${state.selectedColor === color 
                                    ? 'border-white scale-110' 
                                    : 'border-slate-600 hover:border-slate-400'
                                }
                            `}
                            style={{ backgroundColor: color }}
                            aria-label={`เลือกสี ${color}`}
                        />
                    ))}
                </div>
            )}

            {/* Preset colors */}
            <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                    <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`
                            w-10 h-10 rounded-lg border-2 transition-all duration-200
                            ${state.selectedColor === color 
                                ? 'border-white scale-110 shadow-lg' 
                                : 'border-slate-600 hover:border-slate-400'
                            }
                        `}
                        style={{ backgroundColor: color }}
                        aria-label={`เลือกสี ${color}`}
                    />
                ))}
            </div>
            
            {/* Custom color picker */}
            <div className="flex items-center gap-2 mt-2">
                <input
                    type="color"
                    value={state.selectedColor}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    className="w-12 h-8 bg-slate-700 border border-slate-600 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-400 font-mono">{state.selectedColor}</span>
            </div>
        </div>
    );
}
