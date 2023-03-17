import { useEffect, useState } from "react";

export default function useTimer(start: number): number {
  const [secPassed, setSecPassed] = useState(0);

  useEffect(() => {
    const intervalID = setInterval(() => {
      if (start !== 0) {
        const now = Date.now();
        setSecPassed((now - start) / 1000);
      }
    }, 1000);
    return () => {
      setSecPassed(0);
      clearInterval(intervalID);
    };
  }, [start]);

  return secPassed;
}
