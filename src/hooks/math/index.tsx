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

  const calculateCoefficients = () => {
    /* 
      -> f(t) = # + #i
      -> delta_t = 0.01
      -> HOW_MANY_VECTORS = 50

      1. sumar todos los valores de 
          sum_n = f(t) e^ (-2 n PI i t ) * delta_t

          0 <= t <= "largest value of t"
      2. luego sacar promedio dividiendo
          c_n = sum_n / "largest value of t"

      3. el c_n debería de estar en la forma
          # + #i
      4. repetir los pasos del (1-3) con los valores de n:
          -HOW_MANY_VECTORS / 2 <= n <= HOW_MANY_VECTORS / 2   # o sea 101 veces

      5. Poner todos los coeficientes ( c_n ) en un array de objetos:
        [ 
          ...,
          {
            frequency: n,
            real: #,
            imaginary: #
          }
        ]

        -> siendo los valores de n asi: 0, 1, -1, 2, -2, 3, -3, ... n, -n
    */
  };

  const renderVectors = () => {
    /* 
    */
  };

  return [
    (): void => {
      combValuesOfTime();
    },
  ];
};
