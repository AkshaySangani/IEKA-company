import { useCallback, useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface UseDragProps {
  id: string;
  defaultPosition?: Position;
}

const positions = new Map<string, Position>();

const useDrag = ({
  id,
  defaultPosition = { x: 0, y: 0 },
}: UseDragProps) => {
  const [position, setPosition] = useState<Position>(
    positions.get(id) || defaultPosition
  );

  const dragging = useRef(false);

  const pointerOffset = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    positions.set(id, position);
  }, [id, position]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;

    setPosition({
      x: e.clientX - pointerOffset.current.x,
      y: e.clientY - pointerOffset.current.y,
    });
  }, []);

  const stopDragging = useCallback(() => {
    dragging.current = false;

    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", stopDragging);
  }, [handlePointerMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();

      dragging.current = true;

      pointerOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };

      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", stopDragging);
    },
    [position, handlePointerMove, stopDragging]
  );

  useEffect(() => {
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", stopDragging);
    };
  }, [handlePointerMove, stopDragging]);

  return {
    position,
    setPosition,
    handleMouseDown,
  };
};

export default useDrag;