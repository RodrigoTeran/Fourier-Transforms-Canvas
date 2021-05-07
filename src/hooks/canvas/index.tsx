import { useLayoutEffect, useRef, useState, useContext } from "react";

// App Context
import { GlobalContext } from "../../App";

interface PropsDrawingHook {
  (canvasRef: HTMLCanvasElement | null, pencilColor: string): void;
}

export const useDrawing: PropsDrawingHook = (canvasRef, pencilColor) => {
  const {
    isDrawingFinished,
    setIsDrawingFinished,
    isCanvasNeedToClear,
    setIsCanvasNeedToClear,
  } = useContext(GlobalContext);

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

      // Clear Canvas
      if (isCanvasNeedToClear) {
        clearCanvas();
      }

      return () => {
        // Remove Event Listeners
        canvasRef.removeEventListener("mousemove", mouseMove);
        canvasRef.removeEventListener("mousedown", mouseDown);
        canvasRef.removeEventListener("mouseup", mouseUp);
        canvasRef.removeEventListener("mouseout", mouseOut);
      };
    }
  }, [rerender, isDrawingFinished, isCanvasNeedToClear]);

  const mouseMove = (e: MouseEvent): void => {
    if (!isDrawingFinished) {
      findxy("move", e);
    }
  };
  const mouseDown = (e: MouseEvent): void => {
    if (!isDrawingFinished) {
      findxy("down", e);
    }
  };
  const mouseUp = (e: MouseEvent): void => {
    if (!isDrawingFinished) {
      findxy("up", e);
    }
  };
  const mouseOut = (e: MouseEvent): void => {
    if (!isDrawingFinished) {
      findxy("out", e);
    }
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
        if (setIsDrawingFinished && isDrawing.current) {
          prevX.current = firstX.current;
          prevY.current = firstY.current;
          draw();
          setIsDrawingFinished(true);
        }
        isDrawing.current = false;
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

  const clearCanvas = (): void => {
    if (canvasRef && ctx.current) {
      ctx.current.clearRect(0, 0, canvasRef.width, canvasRef.height);
      if (setIsCanvasNeedToClear && setIsDrawingFinished) {
        setIsCanvasNeedToClear(false);
        setIsDrawingFinished(false);
      }
    }
  };
};
