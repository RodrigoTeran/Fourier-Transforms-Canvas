import { useContext, useRef } from "react";

import { GlobalContext, ObjectForCoordenates } from "../../App";

import { round } from "../../helpers/index";

// Math.js
import { Complex, pow, add, multiply, complex, divide } from "mathjs";

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

    if (canvasRef) {
      var x: number, y: number;
      x = canvasRef.width / 2 + real;
      y = canvasRef.height / 2 - imaginary;
      return { x, y };
    }
  };

  const pushCoordenateInRelationCenter = (
    x: number,
    y: number,
    canvasRef: HTMLCanvasElement | null
  ) => {
    /*
      you pass a normal x and y from canvas...
      and it transforms those values to real and imaginary numbers
    */
    if (canvasRef) {
      // x
      var real: number, imaginary: number;
      if (canvasRef.width / 2 <= x) {
        real = x - canvasRef.width / 2;
      } else {
        real = (canvasRef.width / 2 - x) * -1;
      }

      if (canvasRef.height / 2 <= y) {
        imaginary = (y - canvasRef.height / 2) * -1;
      } else {
        imaginary = canvasRef.height / 2 - y;
      }

      return { real, imaginary };
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
    if (coordenatesArray) {
      var HOW_MANY_VECTORS: number = 60;
      var delta_t: number = 0.01;

      for (var n = -HOW_MANY_VECTORS / 2; n <= HOW_MANY_VECTORS / 2; n++) {
        // -HOW_MANY_VECTORS / 2 <= n <= HOW_MANY_VECTORS / 2
        var sum_n: any = complex(0, 0);
        for (var i = 0; i < arrayCoordenatesUpdated.length; i++) {
          // 0 <= t <= "largest value of t"
          var time: number = arrayCoordenatesUpdated[i].time;

          // f(time)
          var complexNumber: Complex = complex(
            arrayCoordenatesUpdated[i].real,
            arrayCoordenatesUpdated[i].imaginary
          );

          var exponent: any = complex(0, -2 * n * Math.PI * time);
          var elevation: any = pow(Math.E, exponent);
          sum_n = add(
            sum_n,
            multiply(complexNumber, multiply(delta_t, elevation))
          );
        }
        sum_n = divide(
          sum_n,
          arrayCoordenatesUpdated[arrayCoordenatesUpdated.length - 1].time
        );

        /* 
          -> siendo los valores de n asi: 0, 1, -1, 2, -2, 3, -3, ... n, -n
        */
        if (n <= 0) {
          arrayCoefficients.current = [
            {
              real: sum_n.re,
              imaginary: sum_n.im,
              frequency: n,
            },
            ...arrayCoefficients.current,
          ];
        } else {
          arrayCoefficients.current.splice(n * 2 - 1, 0, {
            real: sum_n.re,
            imaginary: sum_n.im,
            frequency: n,
          });
        }
      }
    }
  };

  const renderVectors = (
    canvasAnimationsRef: HTMLCanvasElement | null,
    canvasRef: HTMLCanvasElement | null
  ): void => {
    // var exponent_1: any = complex(0, Math.PI * 0.5);
    // var elevation_1: any = pow(Math.E, exponent_1);

    // var exponent_2: any = complex(0, Math.PI * 0.25);
    // var elevation_2: any = pow(Math.E, exponent_2);
    // arrayCoefficients.current = [
    //   {
    //     real: multiply(100, elevation_1),
    //     imaginary: 0,
    //     frequency: -1,
    //   },
    //   {
    //     real: multiply(50, elevation_2),
    //     imaginary: 0,
    //     frequency: 1,
    //   },
    //   {
    //     real: multiply(25, elevation_1),
    //     imaginary: 0,
    //     frequency: -.5,
    //   },
    // ];
    if (canvasAnimationsRef && canvasRef) {
      var speedInterval: number = 50;
      var timer: number = 0;

      var startPos_previous: any = complex(0, 0);

      var ctx = canvasAnimationsRef.getContext("2d"); // Canvas of Vectors
      var ctx_2 = canvasRef.getContext("2d"); // Canvas of green line

      const interval = setInterval(() => {
        // clearInterval(interval);
        if (ctx) {
          // Clear canvas of vectors
          ctx.clearRect(
            0,
            0,
            canvasAnimationsRef.width,
            canvasAnimationsRef.height
          );
        }

        // ----------------------> Render Vectors
        var startPos: any = {
          re: canvasAnimationsRef.width / 2,
          im: canvasAnimationsRef.height / 2,
        };

        for (var i = 0; i < arrayCoefficients.current.length; i++) {
          var coefficient = complex(
            arrayCoefficients.current[i].real,
            arrayCoefficients.current[i].imaginary
          );

          var n: number = arrayCoefficients.current[i].frequency;

          var exponent: any = complex(0, 2 * n * Math.PI * timer);
          var elevation: any = pow(Math.E, exponent);
          var finalPos: any = multiply(coefficient, elevation);

          // var exponent: any = complex(0, 2 * -1 * Math.PI * timer);
          // var elevation: any = pow(Math.E, exponent);

          // var finalPos: any = multiply(coefficient, elevation);

          var coordenatesInRelationCanvas = pushCoordenateInRelationCanvas(
            finalPos.re,
            finalPos.im,
            canvasAnimationsRef
          );

          var coordenatesForSum = pushCoordenateInRelationCenter(
            startPos.re,
            startPos.im,
            canvasAnimationsRef
          );

          if (ctx && coordenatesInRelationCanvas && coordenatesForSum) {
            ctx.beginPath();
            ctx.moveTo(startPos.re, startPos.im);
            ctx.lineTo(
              coordenatesInRelationCanvas.x + coordenatesForSum.real,
              coordenatesInRelationCanvas.y - coordenatesForSum.imaginary
            );
            if (n === 0) {
              ctx.strokeStyle = "#F00";
            } else {
              ctx.strokeStyle = "#FFF";
            }
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();

            startPos.re =
              coordenatesInRelationCanvas.x + coordenatesForSum.real;
            startPos.im =
              coordenatesInRelationCanvas.y - coordenatesForSum.imaginary;
          }
        }

        if (ctx_2 && coordenatesInRelationCanvas && timer !== 0) {
          ctx_2.beginPath();
          ctx_2.moveTo(startPos_previous.re, startPos_previous.im);
          ctx_2.lineTo(startPos.re, startPos.im);
          ctx_2.strokeStyle = "#0F0";
          ctx_2.lineWidth = 1;
          ctx_2.stroke();
          ctx_2.closePath();
        }

        // Update values
        startPos_previous.re = startPos.re;
        startPos_previous.im = startPos.im;

        timer = round(timer + 0.01);
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
