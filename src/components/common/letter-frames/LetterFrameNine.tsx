import { useState } from "react";
import ColorPopover from "../color-popover";
import useWidthHeight from "../../../hooks/useWidthHeight";

export default function LatterFrameNine() {
    const {width, height} = useWidthHeight();
  const [primaryColor, setPrimaryColor] = useState("#f97316");
  const [secondaryColor, setSecondaryColor] = useState("#1a1a1a");
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
  setShowColorPopover(prev => !prev);
};
  return (
    <div className="absolute inset-0" onClick={() => setShowColorPopover(false)}>
      <div onClick={handleClick}
        className={`absolute cursor-pointer bottom-0 h-10 w-full`}
        style={{
          backgroundColor: secondaryColor,
        }}
      />
      <div onClick={handleClick}
        className={`absolute bottom-0 cursor-pointer left-0 h-10 w-[20%]`}
        style={{
          backgroundColor: primaryColor,
          clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
        }}
      />
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
