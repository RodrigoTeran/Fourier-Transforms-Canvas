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
      -> e^(b + ci) = e^b * e^(ci)
      -> e^ci = cos(c) + sin(c)i

      1. sumar todos los valores de 
          sum_n = f(t) e^ (-2 n PI i t ) * delta_t

          0 <= t <= "largest value of t"
      2. luego sacar promedio dividiendo
          c_n = sum_n / "largest value of t"

      3. el c_n debería de estar en la forma
          # + #i
          {
            real: #
            imaginary: #
          }
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
      -> debemos de tener dos canvas
        - este canvas debe estar en posicion absoluta. Esto tambien prevee el drawing del canvas
          drawing

      1. crear un loop infinito
      2. hacer un loop en el array de los coeficientes dentro del loop infinito
      3. multiplicar el coeficiente por:
        c_n = (array[i].real + array[i].imaginary)
        n = array[i].frequency
        t = dentro del loop infinito podemos sacar el contador
        posicionFinalDeLaLinea_n = c_n e ^ (n * 2 PI i t)
        --> convertir a este formato:
                      {
                          real: #
                          imaginary: #
                      }
        if n == 0:
          posicionInicialDeLaLinea_n = {
            real: 0,
            imaginary: 0
          }

          metemos al array Posiciones:
          [
            ...,
            {
              posFinal: posicionFinalDeLaLinea_n,
              posInicial: posicionInicialDeLaLinea_n
            }
          ]
        else:
          # --conceptual-- posicionInicialDeLaLinea_n = posicionFinalDeLaLinea_(n-1)

          metemos al array Posiciones:
          [
            ...,
            {
              posFinal: posicionFinalDeLaLinea_n,
              posInicial: arrayPosiciones[i - 1].posFinal
            }
          ]
      4. borrar el canvas

      5. hacemos loop en el array arrayPosiciones:
        y simple hacemos esto
        ctx.current.beginPath();
        ctx.current.moveTo(
          valueToCoordenateX(arrayPosiciones[i].posInicial.real),
          valueToCoordenateY(arrayPosiciones[i].posInicial.imaginary),
        );
        ctx.current.lineTo(
          valueToCoordenateX(arrayPosiciones[i].posFinal.real),
          valueToCoordenateY(arrayPosiciones[i].posFinal.imaginary),
        );
        ctx.current.strokeStyle = "#00F";  # un azul oscuro
        ctx.current.lineWidth = 1;  -> para que sean más delgadas
        ctx.current.stroke();
        ctx.current.closePath();

        -> OJO con "valueToCoordenateX" y "valueToCoordenateY"...necesitamos los valores en coordenadas
        tipo canvas
      6. se repite pasos (3-5)
    */
  };

  return [
    (): void => {
      combValuesOfTime();
    },
  ];
};
