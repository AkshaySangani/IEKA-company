import { useEffect, useState } from "react";

export const useIsPWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean })
          .standalone === true
      );
    };

    setIsPWA(checkPWA());
  }, []);

  return isPWA;
};