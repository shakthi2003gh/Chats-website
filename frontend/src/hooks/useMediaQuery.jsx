import { useEffect, useState } from "react";

function useMediaQuery(width) {
  const [isReached, setIsReached] = useState(false);

  const checkInnerWidth = () => {
    if (window.innerWidth >= width && !isReached) setIsReached(true);
    if (window.innerWidth < width && isReached) setIsReached(false);
  };

  useEffect(() => {
    checkInnerWidth();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", checkInnerWidth);

    return () => window.removeEventListener("resize", checkInnerWidth);
  }, [checkInnerWidth]);

  return isReached;
}

export default useMediaQuery;
