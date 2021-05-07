// Styles
import styles from "../../styles/canvas/canvas.module.scss";

// Hooks
import { useRef } from "react";
import { useDrawing } from "../../hooks/canvas/index";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useDrawing(canvasRef.current);

  return <canvas ref={canvasRef} width="500" height="500" className={styles.canvas}></canvas>;
};

export default Canvas;
