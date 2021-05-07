// Styles
import styles from "../../styles/canvas/canvas.module.scss";

// Hooks
import { useRef, useState, useContext } from "react";
import { useDrawing } from "../../hooks/canvas/index";
import { useWidth } from "../../hooks/layout/index";

// App Context
import { GlobalContext } from "../../App";

const Canvas = () => {
  const { messagesColor, messagesText } = useContext(GlobalContext);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [widthCanvas, setWidthCanvas] = useState<number>(750);

  useDrawing(canvasRef.current, "#FFF");
  useWidth(setWidthCanvas, "90%", 750);

  return (
    <div className={styles.canvas__container}>
      <h2>Draw something</h2>
      <span>
        ...in one continuous line...
      </span>
      <canvas
        ref={canvasRef}
        width={widthCanvas}
        height="400"
        className={styles.canvas}
      ></canvas>
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
