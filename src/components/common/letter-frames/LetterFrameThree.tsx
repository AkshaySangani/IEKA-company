import { useState } from "react";
import ColorPopover from "../color-popover";
import useWidthHeight from "../../../hooks/useWidthHeight";

export default function LatterFrameThree() {
  const { width, height } = useWidthHeight();
  const [primaryColor, setPrimaryColor] = useState("#e8001d");
  const [secondaryColor, setSecondaryColor] = useState("#6b0010");
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
    <div
      className="absolute inset-0"
      onClick={() => setShowColorPopover(false)}
    >
      <div
        className={`absolute cursor-pointer bottom-0 h-5 w-full grid grid-cols-5 gap-2`}
      >
        <div
          className={`h-5`}
          style={{
            backgroundColor: primaryColor,
          }}
          onClick={handleClick}
        />
        <div
          className={`h-5`}
          style={{
            backgroundColor: primaryColor,
          }}
          onClick={handleClick}
        />
        <div
          className={`h-5 `}
          style={{
            backgroundColor: secondaryColor,
          }}
          onClick={handleClick}
        />
        <div
          className={`h-5`}
          style={{
            backgroundColor: secondaryColor,
          }}
          onClick={handleClick}
        />
        <div
          className={`h-5`}
          style={{
            backgroundColor: secondaryColor,
          }}
          onClick={handleClick}
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
