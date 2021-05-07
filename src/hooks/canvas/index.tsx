import { useLayoutEffect, useRef, useState } from "react";

export const useDrawing = (canvasRef: HTMLCanvasElement | null, pencilColor : string): void => {
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [rerender, setRerender] = useState<boolean>(false);

  const isDrawing = useRef<boolean>(false);
  const prevX = useRef<number>(0);
  const prevY = useRef<number>(0);
  const currX = useRef<number>(0);
  const currY = useRef<number>(0);

  const firstX = useRef<number>(0);
  const firstY = useRef<number>(0);
  const lineWidth = useRef<number>(2);

  useLayoutEffect(() => {
    if (!rerender) {
      setRerender(true);
    }
    if (canvasRef) {
      // Change ctx
      ctx.current = canvasRef.getContext("2d");

      // Add Event Listeners
      canvasRef.addEventListener("mousemove", mouseMove);
      canvasRef.addEventListener("mousedown", mouseDown);
      canvasRef.addEventListener("mouseup", mouseUp);
      canvasRef.addEventListener("mouseout", mouseOut);

      return () => {
        // Remove Event Listeners
        canvasRef.removeEventListener("mousemove", mouseMove);
        canvasRef.removeEventListener("mousedown", mouseDown);
        canvasRef.removeEventListener("mouseup", mouseUp);
        canvasRef.removeEventListener("mouseout", mouseOut);
      };
    }
  }, [rerender]);

  const mouseMove = (e: MouseEvent): void => {
    findxy("move", e);
  };
  const mouseDown = (e: MouseEvent): void => {
    findxy("down", e);
  };
  const mouseUp = (e: MouseEvent): void => {
    findxy("up", e);
  };
  const mouseOut = (e: MouseEvent): void => {
    findxy("out", e);
  };

  const findxy = (res: String, e: MouseEvent): void => {
    if (canvasRef && ctx.current) {
      if (res === "down") {
        prevX.current = currX.current;
        prevY.current = currY.current;
        currX.current = e.clientX - canvasRef.getBoundingClientRect().left;
        currY.current = e.clientY - canvasRef.getBoundingClientRect().top;

        firstX.current = currX.current;
        firstY.current = currY.current;
        isDrawing.current = true;
      }
      if (res === "up" || res === "out") {
        prevX.current = firstX.current;
        prevY.current = firstY.current;
        isDrawing.current = false;
        draw();
      }
      if (res === "move") {
        if (isDrawing.current) {
          prevX.current = currX.current;
          prevY.current = currY.current;
          currX.current = e.clientX - canvasRef.getBoundingClientRect().left;
          currY.current = e.clientY - canvasRef.getBoundingClientRect().top;
          draw();
        }
      }
    }
  };

  const draw = (): void => {
    if (canvasRef && ctx.current) {
      ctx.current.beginPath();
      ctx.current.moveTo(prevX.current, prevY.current);
      ctx.current.lineTo(currX.current, currY.current);
      ctx.current.strokeStyle = pencilColor;
      ctx.current.lineWidth = lineWidth.current;
      ctx.current.stroke();
      ctx.current.closePath();
    }
  };
};
