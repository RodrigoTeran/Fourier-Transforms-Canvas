import { useContext, useRef } from "react";

import { GlobalContext, ObjectForCoordenates } from "../../App";

import { round } from "../../helpers/index";

type ObjectForCoefficients = {
  real: number;
  imaginary: number;
  frequency: number;
};

interface Coordenates {
  (): [
    () => void,
    (
      canvasAnimationsRef: HTMLCanvasElement | null,
      canvasRef: HTMLCanvasElement | null
    ) => void
  ];
}

export const useCoordenates: Coordenates = () => {
  const { coordenatesArray, setCoordenatesArray } = useContext(GlobalContext);

  const arrayCoefficients = useRef<Array<ObjectForCoefficients>>([]);

  const pushCoordenateInRelationCanvas = (
    real: number,
    imaginary: number,
    canvasRef: HTMLCanvasElement | null
  ) => {
    /*
      you pass a complex number,
      and it transforms those values to x and y coordenates
    */
    // console.log("real: ", real);

    if (canvasRef) {
      var x: number, y: number;
      x = canvasRef.width / 2 + real;
      y = canvasRef.height / 2 - imaginary;
      // console.log("x: ", x);

      return { x, y };
    }
  };

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
  ): void => {
    // coordenatesArray
    if (coordenatesArray) {
      var HOW_MANY_VECTORS: number = 2;
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

        // sum_n_real =
        //   sum_n_real /
        //   arrayCoordenatesUpdated[arrayCoordenatesUpdated.length - 1].time;
        // sum_n_imaginary =
        //   sum_n_imaginary /
        //   arrayCoordenatesUpdated[arrayCoordenatesUpdated.length - 1].time;

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
      console.log(arrayCoefficients.current);
    }
  };

  const renderVectors = (
    canvasAnimationsRef: HTMLCanvasElement | null,
    canvasRef: HTMLCanvasElement | null
  ): void => {
    if (canvasAnimationsRef && canvasRef) {
      var speedInterval: number = 100;
      var timer: number = 0;

      var startPos_real_previous: number = 0;
      var startPos_imaginary_previous: number = 0;

      var ctx = canvasAnimationsRef.getContext("2d");
      var ctx_2 = canvasRef.getContext("2d");

      const interval = setInterval(() => {
        // clearInterval(interval);
        // Clear Canvas
        var startPos_real: number = canvasAnimationsRef.width / 2;
        var startPos_imaginary: number = canvasAnimationsRef.height / 2;
        if (ctx) {
          ctx.clearRect(
            0,
            0,
            canvasAnimationsRef.width,
            canvasAnimationsRef.height
          );
        }

        for (var i = 0; i < arrayCoefficients.current.length; i++) {
          var coefficient_real: number = arrayCoefficients.current[i].real;
          var coefficient_imaginary: number =
            arrayCoefficients.current[i].imaginary;
          var coefficient_frequency: number =
            arrayCoefficients.current[i].frequency;

          var finalPos_real: number =
            coefficient_real *
              Math.cos(2 * coefficient_frequency * Math.PI * timer) -
            coefficient_imaginary *
              Math.sin(2 * coefficient_frequency * Math.PI * timer);

          var finalPos_imaginary: number =
            coefficient_real *
              Math.sin(2 * coefficient_frequency * Math.PI * timer) +
            coefficient_imaginary *
              Math.cos(2 * coefficient_frequency * Math.PI * timer);

          // if (coefficient_frequency === 0) {
          //   console.log(
          //     coefficient_real *
          //       Math.sin(2 * coefficient_frequency * Math.PI * timer)
          //   );
          //   console.log(
          //     coefficient_imaginary *
          //       Math.cos(2 * coefficient_frequency * Math.PI * timer)
          //   );
          //   console.log("finalPos_imaginary: ", finalPos_imaginary);
          //   console.log("coefficient_imaginary: ", coefficient_imaginary);
          // }

          var coordenatesInRelationCanvas = pushCoordenateInRelationCanvas(
            finalPos_real,
            finalPos_imaginary,
            canvasAnimationsRef
          );

          if (ctx && coordenatesInRelationCanvas) {
            // console.log(
            //   "coordenatesInRelationCanvas.x: ",
            //   coordenatesInRelationCanvas.x
            // );

            ctx.beginPath();
            ctx.moveTo(startPos_real, startPos_imaginary);
            ctx.lineTo(
              coordenatesInRelationCanvas.x,
              coordenatesInRelationCanvas.y
            );
            if (coefficient_frequency === 0) {
              ctx.strokeStyle = "#F00";
            } else {
              ctx.strokeStyle = "#FFF";
            }
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();

            startPos_real = coordenatesInRelationCanvas.x;
            startPos_imaginary = coordenatesInRelationCanvas.y;
          }
        }

        if (ctx_2 && coordenatesInRelationCanvas && timer !== 0) {
          ctx_2.beginPath();
          ctx_2.moveTo(startPos_real_previous, startPos_imaginary_previous);
          ctx_2.lineTo(startPos_real, startPos_imaginary);
          ctx_2.strokeStyle = "#0F0";
          ctx_2.lineWidth = 1;
          ctx_2.stroke();
          ctx_2.closePath();

          startPos_real = coordenatesInRelationCanvas.x;
          startPos_imaginary = coordenatesInRelationCanvas.y;
        }

        // Update values
        startPos_real_previous = startPos_real;
        startPos_imaginary_previous = startPos_imaginary;

        timer = round(timer + 0.01);
        // if (timer >= 0.3) {
        //   clearInterval(interval);
        // }
      }, speedInterval);
    }
  };

  return [
    (): void => {
      combValuesOfTime();
    },
    (
      canvasAnimationsRef: HTMLCanvasElement | null,
      canvasRef: HTMLCanvasElement | null
    ): void => {
      renderVectors(canvasAnimationsRef, canvasRef);
    },
  ];
};
