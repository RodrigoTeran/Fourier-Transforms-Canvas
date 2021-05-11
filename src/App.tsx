import { useState, createContext, Dispatch, SetStateAction } from "react";

// Layout
import Nav from "./components/Layout/Nav/index";

// Canvas
import Canvas from "./components/Canvas/index";

// Hooks
import { useInterval } from "./hooks/canvas/interval";

export const GlobalContext = createContext<Partial<ValueAppProvider>>({});

export type ObjectForCoordenates = {
  real: number;
  imaginary: number;
  time: number;
};

interface ValueAppProvider {
  // Canvas Drawing
  isDrawingFinished: boolean;
  setIsDrawingFinished: Dispatch<SetStateAction<boolean>>;
  isCanvasNeedToClear: boolean;
  setIsCanvasNeedToClear: Dispatch<SetStateAction<boolean>>;

  // Messages
  messagesColor: string;
  setMessagesColor: Dispatch<SetStateAction<string>>;
  messagesText: string;
  setMessagesText: Dispatch<SetStateAction<string>>;

  // Time System
  breakInterval: () => void;
  startInterval: () => void;
  secondsDrawing: number;
  setSecondsDrawing: Dispatch<SetStateAction<number>>;

  // Coordenates
  coordenatesArray: Array<Object>;
  setCoordenatesArray: Dispatch<SetStateAction<Array<ObjectForCoordenates>>>;
  restartCoordenates: boolean;
  setRestartCoordenates: Dispatch<SetStateAction<boolean>>;

  // Is Canvas Animations
  isCanvasAnimations: boolean;
  setIsCanvasAnimations: Dispatch<SetStateAction<boolean>>;
}

const App = () => {
  // To set drawing finished
  const [isDrawingFinished, setIsDrawingFinished] = useState<boolean>(false);

  // To clear canvas
  const [isCanvasNeedToClear, setIsCanvasNeedToClear] = useState<boolean>(
    false
  );

  // Canvas Messages
  const [messagesColor, setMessagesColor] = useState<string>("#000");
  const [messagesText, setMessagesText] = useState<string>("");

  // Time system
  const [secondsDrawing, setSecondsDrawing] = useState<number>(0);
  const [breakInterval, startInterval] = useInterval(
    setSecondsDrawing,
    secondsDrawing,
    10
  );

  // Coordenates
  const [coordenatesArray, setCoordenatesArray] = useState<
    Array<ObjectForCoordenates>
  >([]);
  const [restartCoordenates, setRestartCoordenates] = useState<boolean>(false);

  // Is Canvas Animations
  const [isCanvasAnimations, setIsCanvasAnimations] = useState<boolean>(false);

  return (
    <GlobalContext.Provider
      value={{
        // Canvas Drawing
        isDrawingFinished: isDrawingFinished,
        setIsDrawingFinished: setIsDrawingFinished,
        isCanvasNeedToClear: isCanvasNeedToClear,
        setIsCanvasNeedToClear: setIsCanvasNeedToClear,

        // Messages
        messagesColor: messagesColor,
        setMessagesColor: setMessagesColor,
        messagesText: messagesText,
        setMessagesText: setMessagesText,

        // Time System
        breakInterval: breakInterval,
        startInterval: startInterval,
        setSecondsDrawing: setSecondsDrawing,
        secondsDrawing: secondsDrawing,

        // Coordenates
        coordenatesArray: coordenatesArray,
        setCoordenatesArray: setCoordenatesArray,
        restartCoordenates: restartCoordenates,
        setRestartCoordenates: setRestartCoordenates,

        // Is Canvas Animations
        isCanvasAnimations: isCanvasAnimations,
        setIsCanvasAnimations: setIsCanvasAnimations,
      }}
    >
      <Nav></Nav>
      <Canvas></Canvas>
    </GlobalContext.Provider>
  );
};

export default App;
