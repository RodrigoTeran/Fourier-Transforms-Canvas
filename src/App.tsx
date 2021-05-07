import { useState, createContext, Dispatch, SetStateAction } from "react";

// Layout
import Nav from "./components/Layout/Nav/index";

// Canvas
import Canvas from "./components/Canvas/index";

export const GlobalContext = createContext<Partial<ValueAppProvider>>({});

interface ValueAppProvider {
  isDrawingFinished: boolean;
  setIsDrawingFinished: Dispatch<SetStateAction<boolean>>;
}

const App = () => {
  const [isDrawingFinished, setIsDrawingFinished] = useState<boolean>(false);
  return (
    <GlobalContext.Provider
      value={{
        isDrawingFinished: isDrawingFinished,
        setIsDrawingFinished: setIsDrawingFinished,
      }}
    >
      <Nav></Nav>
      <Canvas></Canvas>
    </GlobalContext.Provider>
  );
};

export default App;
