// Styles
import styles from "../../styles/canvas/canvas.module.scss";

// Hooks
import {
  useRef,
  useState,
  // useContext
} from "react";
import { useDrawing } from "../../hooks/canvas/index";
import { useWidth } from "../../hooks/layout/index";

// App Context
// import { GlobalContext } from "../../App";

const Canvas = () => {
  // const { isDrawingFinished, setIsDrawingFinished } = useContext(GlobalContext);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [widthCanvas, setWidthCanvas] = useState<number>(750);

  useDrawing(canvasRef.current, "#FFF");
  useWidth(setWidthCanvas, "90%", 750);

  return (
    <div className={styles.canvas__container}>
      <h2>Draw something</h2>
      <span>...in one continuous line...</span>
      <canvas
        ref={canvasRef}
        width={widthCanvas}
        height="400"
        className={styles.canvas}
      ></canvas>
    </div>
  );
};

export default Canvas;
