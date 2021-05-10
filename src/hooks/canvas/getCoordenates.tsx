import { useRef, useContext, useEffect } from "react";

import { GlobalContext, ObjectForCoordenates } from "../../App";

interface Hook {
  (): [(coordenate: ObjectForCoordenates) => void, () => void];
}

export const useGetCoordenates: Hook = () => {
  const {
    setCoordenatesArray,
    restartCoordenates,
    setRestartCoordenates,
  } = useContext(GlobalContext);

  const arrayCoordenates = useRef<Array<ObjectForCoordenates>>([]);

  const pushCoordenates = (coordenate: ObjectForCoordenates): void => {
    arrayCoordenates.current.push(coordenate);
  };

  const changeGlobal = (): void => {
    if (setCoordenatesArray) {
      setCoordenatesArray(arrayCoordenates.current);
      // console.log(arrayCoordenates.current);
    }
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
    (coordenate: ObjectForCoordenates) => {
      // push coordenate
      pushCoordenates(coordenate);
    },
    () => {
      // change global
      changeGlobal();
    },
  ];
};
