import { useContext } from "react";

import { GlobalContext, ObjectForCoordenates } from "../../App";

interface Coordenates {
  (): [() => void];
}

export const useCoordenates: Coordenates = () => {
  const { coordenatesArray, setCoordenatesArray } = useContext(GlobalContext);

  const combValuesOfTime = () => {
    if (coordenatesArray) {
      var newArrayCoordenates: Array<ObjectForCoordenates> = [];
      for (var i = 0; i < coordenatesArray.length; i++) {
        var timeNow: number;
        var oNow: any = coordenatesArray[i];
        if (i === 0) {
          timeNow = oNow.time;
          newArrayCoordenates.push({
            real: oNow.real,
            imaginary: oNow.imaginary,
            time: timeNow,
          });
        } else {
          var oBefore: any = coordenatesArray[i - 1];
          if (oBefore.time !== oNow.time) {
            timeNow = oNow.time;
            newArrayCoordenates.push({
              real: oNow.real,
              imaginary: oNow.imaginary,
              time: timeNow,
            });
          }
        }
      }
      if (setCoordenatesArray) {
        setCoordenatesArray(newArrayCoordenates);
      }
    }
  };

  return [
    (): void => {
      combValuesOfTime();
    },
  ];
};
