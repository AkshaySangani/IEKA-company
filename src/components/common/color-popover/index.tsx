import React from "react";
import Button from "../button/Button";

interface ColorField {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

interface ColorPopoverProps {
  isOpen: boolean;
  title?: string;
  colors: ColorField[];
  onClose: () => void;
}

const ColorPopover: React.FC<ColorPopoverProps> = ({
  isOpen,
  title = "ASSET COLORS",
  colors,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 z-50 mt-2 w-48 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
      <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h3>

      <div className="space-y-2">
        {colors.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{item.label}</span>

            <label className="relative h-8 w-10 cursor-pointer overflow-hidden border border-gray-300">
              <input
                type="color"
                value={item.value}
                onChange={(e) => item.onChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />

              <div
                className="h-full w-full"
                style={{ backgroundColor: item.value }}
              />
            </label>
          </div>
        ))}
      </div>

      <div className="mt-1 flex justify-center">
        <Button
          name="Close"
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      </div>
    </div>
  );
};

export default ColorPopover;
