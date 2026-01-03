"use client";

import { useWeavingStore } from "@/lib/store/useWeavingStore";

interface ColorPickerProps {
  onColorSelect?: (color: string) => void;
}

export default function ColorPicker({ onColorSelect }: ColorPickerProps) {
  const { config } = useWeavingStore();

  const handleColorClick = (color: string) => {
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  return (
    <div className="flex gap-2">
      {config.colors.map((color, index) => (
        <button
          key={index}
          onClick={() => handleColorClick(color)}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors"
          style={{ backgroundColor: color }}
          title={`Select color ${index + 1}`}
        />
      ))}
    </div>
  );
}

