import React, { ReactNode, useRef } from "react";
import useDrag from "../../../hooks/useDrag";

interface DraggableProps {
  id: string;
  children: ReactNode;
  defaultPosition?: {
    x: number;
    y: number;
  };
  className?: string;
}

const Draggable: React.FC<DraggableProps> = ({
  id,
  children,
  defaultPosition = {
    x: 0,
    y: 0,
  },
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { position, handleMouseDown } = useDrag({
    id,
    defaultPosition,
  });

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      className={`
        absolute
        cursor-move
        select-none
        transition-shadow
        duration-150
        border
        border-white
        hover:border
        hover:border-dashed
        hover:border-secondary
        active:cursor-grabbing
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {children}
    </div>
  );
};

export default Draggable;