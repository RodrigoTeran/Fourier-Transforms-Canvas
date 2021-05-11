import { useContext, useRef } from "react";

import { GlobalContext, ObjectForCoordenates } from "../../App";

import { round } from "../../helpers/index";

interface Coordenates {
  (): [() => void];
}

export const useCoordenates: Coordenates = () => {
  const { coordenatesArray, setCoordenatesArray } = useContext(GlobalContext);

  const arrayCoefficients = useRef<Array<Object>>([]);

  const combValuesOfTime = () => {
    if (coordenatesArray) {
      var newArrayCoordenates: Array<ObjectForCoordenates> = [];
      var timeNow: number = 0;
      for (var i = 0; i < coordenatesArray.length; i++) {
        var oNow: any = coordenatesArray[i];
        newArrayCoordenates.push({
          real: oNow.real,
          imaginary: oNow.imaginary,
          time: timeNow,
        });
        timeNow = round(timeNow + 0.01);
      }
      if (setCoordenatesArray) {
        setCoordenatesArray(newArrayCoordenates);

        // Calcular coeficientes
        calculateCoefficients(newArrayCoordenates);
      }
    }
  };

  const calculateCoefficients = (
    arrayCoordenatesUpdated: Array<ObjectForCoordenates>
  ) => {
    // coordenatesArray
    if (coordenatesArray) {
      var HOW_MANY_VECTORS: number = 50;
      var delta_t: number = 0.01;

      for (var n = -HOW_MANY_VECTORS / 2; n <= HOW_MANY_VECTORS / 2; n++) {
        // -HOW_MANY_VECTORS / 2 <= n <= HOW_MANY_VECTORS / 2
        var sum_n_real: number = 0;
        var sum_n_imaginary: number = 0;
        for (var i = 0; i < arrayCoordenatesUpdated.length; i++) {
          // 0 <= t <= "largest value of t"
          var real: number = arrayCoordenatesUpdated[i].real;
          var imaginary: number = arrayCoordenatesUpdated[i].imaginary;
          var time: number = arrayCoordenatesUpdated[i].time;

          sum_n_real =
            sum_n_real +
            (delta_t * real * Math.cos(-2 * n * Math.PI * time) -
              delta_t * imaginary * Math.sin(-2 * n * Math.PI * time));

          sum_n_imaginary =
            sum_n_imaginary +
            (delta_t * real * Math.sin(-2 * n * Math.PI * time) +
              delta_t * imaginary * Math.cos(-2 * n * Math.PI * time));
        }

        // Dividir: c_n = sum_n / "largest value of t"
        sum_n_real =
          sum_n_real /
          arrayCoordenatesUpdated[arrayCoordenatesUpdated.length - 1].time;
        sum_n_imaginary =
          sum_n_imaginary /
          arrayCoordenatesUpdated[arrayCoordenatesUpdated.length - 1].time;

        /* 
          -> siendo los valores de n asi: 0, 1, -1, 2, -2, 3, -3, ... n, -n
        */
        if (n <= 0) {
          arrayCoefficients.current = [
            {
              real: sum_n_real,
              imaginary: sum_n_imaginary,
              frequency: n,
            },
            ...arrayCoefficients.current,
          ];
        } else {
          arrayCoefficients.current.splice(n * 2 - 1, 0, {
            real: sum_n_real,
            imaginary: sum_n_imaginary,
            frequency: n,
          });
        }
      }
    }
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
