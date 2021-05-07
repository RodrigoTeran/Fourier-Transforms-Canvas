import { useEffect } from "react";

const WIDTH_MOBILE = 750;

export const useWidth = (
  setWidth: Function,
  mobileWidth: number | string,
  computerWidth: number
) => {
  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const resizeHandler = (): void => {
    var widthMobileReal = mobileWidth;
    if (typeof mobileWidth === "string") {
      widthMobileReal =
        (window.innerWidth *
          parseInt(mobileWidth.slice(0, mobileWidth.length - 1))) /
        100;
    }
    setWidth(window.innerWidth < WIDTH_MOBILE ? widthMobileReal : computerWidth);
  };
};

export const useIsMobile = (setWidth: Function) => {
  useEffect(() => {
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const resizeHandler = (): void => {
    setWidth(window.innerWidth < WIDTH_MOBILE ? true : false);
  };
};
