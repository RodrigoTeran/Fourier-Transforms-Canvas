import { useState, useContext } from "react";

// Styles
import styles from "../../../styles/layout/nav.module.scss";

// Hooks
import { useIsMobile } from "../../../hooks/layout/index";

// App Context
import { GlobalContext } from "../../../App";

const Nav = () => {
  const {
    isDrawingFinished,
    setIsCanvasNeedToClear,
    setMessagesColor,
    setMessagesText,
    setSecondsDrawing,
    breakInterval,
    setCoordenatesArray,
    setRestartCoordenates,
    setIsCanvasAnimations,
  } = useContext(GlobalContext);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useIsMobile(setIsMobile);

  return (
    <nav className={styles.nav}>
      {isMobile ? (
        <h1>{process.env.REACT_APP_APP_NAME_SHORT}</h1>
      ) : (
        <h1>{process.env.REACT_APP_APP_NAME}</h1>
      )}
      <div className={styles.nav__right}>
        {isDrawingFinished && (
          <button
            onClick={() => {
              if (
                setIsCanvasNeedToClear &&
                setSecondsDrawing &&
                breakInterval &&
                setCoordenatesArray &&
                setRestartCoordenates &&
                setIsCanvasAnimations
              ) {
                setIsCanvasAnimations(false);
                setIsCanvasNeedToClear(true);
                breakInterval();
                setRestartCoordenates(true);
                setSecondsDrawing(0);
              }
            }}
          >
            {isMobile ? "Clear" : "Clear Canvas"}
          </button>
        )}
        <button
          onClick={() => {
            if (setMessagesText && setMessagesColor && !isDrawingFinished) {
              setMessagesColor("#F00");
              setMessagesText("First you need to draw something in the canvas");
            } else {
              if (setIsCanvasAnimations) {
                setIsCanvasAnimations(true);
              }
            }
          }}
        >
          Compute
        </button>
      </div>
    </nav>
  );
};

export default Nav;
