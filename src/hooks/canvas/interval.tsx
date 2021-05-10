import { useEffect, useRef, Dispatch, SetStateAction, useState } from "react";

interface PropsInterval {
  (
    setSeconds: Dispatch<SetStateAction<number>>,
    seconds: number,
    difference: number
  ): [() => void, () => void];
}

export const useInterval: PropsInterval = (setSeconds, seconds, difference) => {
  const interval = useRef<any>();
  const [isStartingInterval, setIsStartingInterval] = useState<boolean>(false);

  useEffect(() => {
    if (isStartingInterval) {
      interval.current = setInterval(() => {
        setSeconds(parseFloat((seconds + difference / 1000).toFixed(2)));
      }, difference);
    }
    return () => {
      try {
        clearInterval(interval.current);
      } catch {}
    };
  }, [isStartingInterval, seconds]);

  return [
    () => {
      // Break
      clearInterval(interval.current);
      setIsStartingInterval(false);
      interval.current = undefined;
      setSeconds(0);
    },
    () => {
      // Start
      setSeconds(0);
      setIsStartingInterval(true);
    },
  ];
};
