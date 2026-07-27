import { useState } from "react";
import ColorPopover from "../color-popover";
import useWidthHeight from "../../../hooks/useWidthHeight";

export default function LatterFrameFive() {
  const { width, height } = useWidthHeight();
  const [primaryColor, setPrimaryColor] = useState("#1e3a5f");
  const [secondaryColor, setSecondaryColor] = useState("#c9a84c");
  const [showColorPopover, setShowColorPopover] = useState(false);
  const POPOVER_WIDTH = 260;
  const POPOVER_HEIGHT = 220;

  const [popoverPosition, setPopoverPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const { clientX, clientY } = e;

    let x = clientX;
    let y = clientY;

    // Prevent overflow on the right
    if (x + POPOVER_WIDTH > width) {
      x = width - POPOVER_WIDTH - 10;
    }

    // If bottom doesn't have enough space, open above
    if (y + POPOVER_HEIGHT > height) {
      y = clientY - POPOVER_HEIGHT - 10;
    } else {
      y = clientY + 10;
    }

    setPopoverPosition({ x, y });
    setShowColorPopover((prev) => !prev);
  };
  return (
    <div className="absolute inset-0" onClick={() => setShowColorPopover(false)}>
      <div onClick={handleClick}
        className={`absolute top-0 h-12 w-full flex flex-col justify-between`}
        style={{
          backgroundColor: primaryColor,
        }}
      >
        <div
          className={`cursor-pointer h-1.5 w-full`}
          style={{
            backgroundColor: secondaryColor,
          }}
        />
        <div
          className={`cursor-pointer h-1.5 w-[40%]`}
          style={{
            backgroundColor: secondaryColor,
          }}
        />
      </div>
      <div onClick={handleClick}
        className={`absolute bottom-0 h-12 w-full place-items-end flex flex-col-reverse justify-between`}
        style={{
          backgroundColor: primaryColor,
        }}
      >
        <div
          className={`cursor-pointer h-1.5 w-full`}
          style={{
            backgroundColor: secondaryColor,
          }}
        />
        <div
          className={`cursor-pointer h-1.5 w-[40%]`}
          style={{
            backgroundColor: secondaryColor,
          }}
        />
      </div>
      {showColorPopover && (
        <div
          className="fixed z-[9999]"
          style={{
            left: popoverPosition.x,
            top: popoverPosition.y,
            transform: "translate(-10px, 10px)",
          }}
        >
          <ColorPopover
            isOpen={showColorPopover}
            onClose={() => setShowColorPopover(false)}
            colors={[
              {
                label: "Primary",
                value: primaryColor,
                onChange: setPrimaryColor,
              },
              {
                label: "Secondary",
                value: secondaryColor,
                onChange: setSecondaryColor,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
