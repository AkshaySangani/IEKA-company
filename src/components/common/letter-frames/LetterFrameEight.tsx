import { useState } from "react";
import ColorPopover from "../color-popover";
import useWidthHeight from "../../../hooks/useWidthHeight";

export default function LatterFrameEight() {
  const { width, height } = useWidthHeight();
  const [primaryColor, setPrimaryColor] = useState("#0891b2");
  const [secondaryColor, setSecondaryColor] = useState("#164e63");
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
        className="absolute top-0 left-0 cursor-pointer w-full overflow-hidden"
        style={{ height: 40 }}
      >
        {/* Dark */}
        <div
          className="absolute top-1 left-0 w-full"
          style={{
            height: "35px",
            background: secondaryColor,
            borderRadius: "0 0 80% 50%",
            
          }}
        />

        {/* Primary */}
        <div
          className="absolute top-0 left-0 w-full"
          style={{
            height: "20px",
            background: primaryColor,
            borderRadius: "0 0 100% 50%",
          }}
        />
      </div>
      <div onClick={handleClick}
        className="absolute bottom-0 cursor-pointer left-0 w-full overflow-hidden"
        style={{ height: 40 }}
      >
        {/* Dark */}
        <div
          className="absolute bottom-0 right-0 w-[85%]"
          style={{
            height: 30,
            background: secondaryColor,
            borderTopLeftRadius: "50% 100%",
            borderTopRightRadius: "50% 30%",
          }}
        />

        {/* Primary */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{
            height: 22,
            background: primaryColor,
            borderTopLeftRadius: "50% 100%",
            borderTopRightRadius: "50% 100%",
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
