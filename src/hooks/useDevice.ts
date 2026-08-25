import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

const getDevice = () => {
  const width = window.innerWidth;

  return {
    isMobile: width < MOBILE_BREAKPOINT,
    isTablet: width >= MOBILE_BREAKPOINT && width < DESKTOP_BREAKPOINT,
    isDesktop: width >= DESKTOP_BREAKPOINT,
  };
};

const useDevice = () => {
  const [device, setDevice] = useState(getDevice);

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDevice());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return device;
};

export default useDevice;
