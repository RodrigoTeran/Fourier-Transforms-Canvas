import { useState, createContext, Dispatch, SetStateAction } from "react";

// Layout
import Nav from "./components/Layout/Nav/index";

// Canvas
import Canvas from "./components/Canvas/index";

export const GlobalContext = createContext<Partial<ValueAppProvider>>({});

interface ValueAppProvider {
  isDrawingFinished: boolean;
  setIsDrawingFinished: Dispatch<SetStateAction<boolean>>;
  isCanvasNeedToClear: boolean;
  setIsCanvasNeedToClear: Dispatch<SetStateAction<boolean>>;
}

const App = () => {
  const [isDrawingFinished, setIsDrawingFinished] = useState<boolean>(false);

  const [isCanvasNeedToClear, setIsCanvasNeedToClear] = useState<boolean>(
    false
  );

  return (
    <GlobalContext.Provider
      value={{
        isDrawingFinished: isDrawingFinished,
        setIsDrawingFinished: setIsDrawingFinished,
        isCanvasNeedToClear: isCanvasNeedToClear,
        setIsCanvasNeedToClear: setIsCanvasNeedToClear,
      }}
    >
      <Nav></Nav>
      <Canvas></Canvas>
    </GlobalContext.Provider>
  );
};

export default App;
