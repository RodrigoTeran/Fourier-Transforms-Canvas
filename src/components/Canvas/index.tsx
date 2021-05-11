// Styles
import styles from "../../styles/canvas/canvas.module.scss";

// Hooks
import { useRef, useState, useContext, useEffect } from "react";
import { useDrawing } from "../../hooks/canvas/index";
import { useWidth } from "../../hooks/layout/index";
import { useCoordenates } from "../../hooks/math/index";

// App Context
import { GlobalContext } from "../../App";

const Canvas = () => {
  const { messagesColor, messagesText, isCanvasAnimations } = useContext(
    GlobalContext
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasAnimations = useRef<HTMLCanvasElement | null>(null);
  const [widthCanvas, setWidthCanvas] = useState<number>(750);

  useDrawing(canvasRef.current, "#FFF");
  useWidth(setWidthCanvas, "90%", 750);

  const [comb, renderVectors] = useCoordenates();

  useEffect(() => {
    if (isCanvasAnimations) {
      comb();
      renderVectors(canvasAnimations.current, canvasRef.current);
    }
  }, [isCanvasAnimations]);

  return (
    <div className={styles.canvas__container}>
      <h2>Draw something</h2>
      <span>...in one continuous line...</span>
      <div className={styles.canvas__container__relative}>
        <canvas
          ref={canvasRef}
          width={widthCanvas}
          height="400"
          className={styles.canvas}
        ></canvas>
        {isCanvasAnimations ? (
          <canvas
            ref={canvasAnimations}
            className={styles.canvas__animation}
            width={widthCanvas}
            height="400"
          ></canvas>
        ) : null}
      </div>
      <div
        className={styles.canvas__container__messages}
        style={{
          color: messagesColor,
        }}
      >
        {messagesText}
      </div>
    </div>
  );
};

export default Canvas;
