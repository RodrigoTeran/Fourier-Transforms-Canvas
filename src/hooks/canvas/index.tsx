import { useLayoutEffect, useRef, useState, useContext } from "react";

// App Context
import { GlobalContext } from "../../App";

import { useGetCoordenates } from "./getCoordenates";
// Helpers
import { round, findSlope } from "../../helpers/index";

interface PropsDrawingHook {
  (canvasRef: HTMLCanvasElement | null, pencilColor: string): void;
}

const MAX_TIME: number = 5;

export const useDrawing: PropsDrawingHook = (canvasRef, pencilColor) => {
  const {
    isDrawingFinished,
    setIsDrawingFinished,
    isCanvasNeedToClear,
    setIsCanvasNeedToClear,
    setMessagesColor,
    setMessagesText,
    startInterval,
    secondsDrawing,
    breakInterval,
  } = useContext(GlobalContext);

  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [rerender, setRerender] = useState<boolean>(false);

  const [pushCoordenate, changeGlobalCoordenates] = useGetCoordenates();

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

      // Update Time
      updateTime();

      return () => {
        // Remove Event Listeners
        canvasRef.removeEventListener("mousemove", mouseMove);
        canvasRef.removeEventListener("mousedown", mouseDown);
        canvasRef.removeEventListener("mouseup", mouseUp);
        canvasRef.removeEventListener("mouseout", mouseOut);
      };
    }
  }, [rerender, isDrawingFinished, isCanvasNeedToClear, secondsDrawing]);

  const updateTime = (): void => {
    if (setMessagesColor && setMessagesText) {
      if (secondsDrawing && secondsDrawing >= MAX_TIME) {
        finishMovement();
      }
      setMessagesColor("#000");
      if (secondsDrawing !== undefined && !isDrawingFinished) {
        var time: number | string = secondsDrawing.toFixed();
        time = parseInt(time);
        time = MAX_TIME - time;
        if (secondsDrawing === 0) {
          setMessagesText(`Draw something :)`);
        } else {
          setMessagesText(`Time remaining to draw: ${time}`);
        }
      }
    }
  };

  const mouseMove = (e: MouseEvent): void => {
    if (!isDrawingFinished) {
      findxy("move", e);
    }
  };
  const mouseDown = (e: MouseEvent): void => {
    if (!isDrawingFinished) {
      if (startInterval) {
        updateTime();
        startInterval();
      }
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
        finishMovement();
      }
      if (res === "move") {
        if (isDrawing.current) {
          prevX.current = currX.current;
          prevY.current = currY.current;
          currX.current = e.clientX - canvasRef.getBoundingClientRect().left;
          currY.current = e.clientY - canvasRef.getBoundingClientRect().top;
          draw();

          // push cooordenates
          pushCoordenate({
            x: currX.current,
            y: currY.current,
            t: secondsDrawing,
          });
        }
      }
    }
  };

  const finishMovement = (): void => {
    if (setIsDrawingFinished && isDrawing.current) {
      const diiferenceIterations = 0.01;
      const speedInterval = 1;

      // y = -> [m] x + b
      // (y2 - y1) / (x2 - x1)
      var slope = 0;
      slope = findSlope(
        firstX.current,
        firstY.current,
        currX.current,
        currY.current
      );
      // y = mx + -> [b]
      const b = firstY.current - slope * firstX.current;
      // sum iteration or restate ?
      const isSum = firstX.current >= currX.current ? true : false;

      // y = m -> [x] + b
      var iteration = 0;
      isDrawing.current = false;
      setIsDrawingFinished(true);
      const itervalLastMove = setInterval(() => {
        if (
          (isSum && firstX.current <= currX.current) ||
          (!isSum && firstX.current >= currX.current)
        ) {
          clearInterval(itervalLastMove);
          if (breakInterval) {
            breakInterval();
          }
          // end coordenates
          changeGlobalCoordenates();
        } else {
          iteration = iteration + diiferenceIterations;
          prevX.current = currX.current;
          prevY.current = currY.current;

          currX.current = isSum
            ? currX.current + iteration
            : currX.current - iteration;
          currY.current = currX.current * slope + b;
          draw();

          // push cooordenates
          if (secondsDrawing) {
            pushCoordenate({
              x: currX.current,
              y: currY.current,
              t: round(secondsDrawing + iteration),
            });
          }
        }
      }, speedInterval);
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
