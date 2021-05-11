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

  const [isDrawingFinishedLocal, setIsDrawingFinishedLocal] = useState<boolean>(
    false
  );

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
      if (secondsDrawing !== undefined && !isDrawingFinishedLocal) {
        var time: number | string = secondsDrawing.toFixed();
        time = parseInt(time);
        time = MAX_TIME - time;
        if (secondsDrawing === 0) {
          setMessagesColor("#000");
          setMessagesText(`Draw something :)`);
        } else {
          setMessagesColor("#000");
          setMessagesText(`Time remaining to draw: ${time}`);
        }
      }
    }
  };

  const mouseMove = (e: MouseEvent): void => {
    if (!isDrawingFinished && !isDrawingFinishedLocal) {
      findxy("move", e);
    }
  };
  const mouseDown = (e: MouseEvent): void => {
    if (!isDrawingFinished && !isDrawingFinishedLocal) {
      if (startInterval) {
        updateTime();
        startInterval();
      }
      findxy("down", e);
    }
  };
  const mouseUp = (e: MouseEvent): void => {
    if (!isDrawingFinished && !isDrawingFinishedLocal) {
      findxy("up", e);
    }
  };
  const mouseOut = (e: MouseEvent): void => {
    if (!isDrawingFinished && !isDrawingFinishedLocal) {
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
          if (secondsDrawing !== undefined) {
            pushCoordenateInRelationCenter(
              currX.current,
              currY.current,
              secondsDrawing
            );
          }
        }
      }
    }
  };

  const pushCoordenateInRelationCenter = (
    x: number,
    y: number,
    time: number
  ) => {
    /*
      you pass a normal x and y from canvas...
      and it transforms those values to real and imaginary numbers
    */
    if (canvasRef) {
      // x
      var real_2: number, imaginary_2: number;
      if (canvasRef.width / 2 <= x) {
        real_2 = x - canvasRef.width / 2;
      } else {
        real_2 = (canvasRef.width / 2 - x) * -1;
      }

      if (canvasRef.height / 2 <= y) {
        imaginary_2 = (y - canvasRef.height / 2) * -1;
      } else {
        imaginary_2 = canvasRef.height / 2 - y;
      }

      pushCoordenate({
        real: real_2,
        imaginary: imaginary_2,
        time,
      });
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
      setIsDrawingFinishedLocal(true);
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
          setIsDrawingFinished(true);
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
          if (secondsDrawing !== undefined) {
            pushCoordenateInRelationCenter(
              currX.current,
              currY.current,
              round(secondsDrawing + iteration)
            );
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
        setIsDrawingFinishedLocal(false);
        setIsDrawingFinished(false);
        setIsCanvasNeedToClear(false);
      }
    }
  };
};
