import { useRef, useContext, useEffect } from "react";

import { GlobalContext } from "../../App";

interface Hook {
  (): [(coordenate: Object) => void, () => void];
}

export const useGetCoordenates: Hook = () => {
  const {
    setCoordenatesArray,
    restartCoordenates,
    setRestartCoordenates,
  } = useContext(GlobalContext);

  const arrayCoordenates = useRef<Array<Object>>([]);

  const pushCoordenates = (coordenate: Object): void => {
    arrayCoordenates.current.push(coordenate);
  };

  const changeGlobal = (): void => {
    if (setCoordenatesArray) {
      setCoordenatesArray(arrayCoordenates.current);
    };
  };

  useEffect(() => {
    if (restartCoordenates && setRestartCoordenates) {
      restart();
      setRestartCoordenates(false);
    }
  }, [restartCoordenates]);

  const restart = (): void => {
    if (setCoordenatesArray) {
      arrayCoordenates.current = [];
      setCoordenatesArray([]);
    }
  };

  return [
    (coordenate: Object) => {
      // push coordenate
      pushCoordenates(coordenate);
    },
    () => {
      // change global
      changeGlobal();
    },
  ];
};
