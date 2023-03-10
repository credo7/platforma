import { useState, useEffect, useCallback } from "react";
import { Dimensions } from "react-native";

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState({
    screen: Dimensions.get("screen"),
    window: Dimensions.get("window"),
  });

  useEffect(() => {
    const handleChange = ({ screen: scr, window: win }) => {
      setDimensions({ screen: scr, window: win });
    };

    const subscription = Dimensions.addEventListener("change", handleChange);
    return () => {
      subscription.remove();
    };
  }, [setDimensions]);

  const mediaQuery = useCallback(
    ({
      type = "screen" || "window",
      minWidth = 0,
      maxWidth = 1920,
      minHeight = 0,
      maxHeight = 1080,
    }) =>
      (minWidth && dimensions[type].width >= minWidth) ||
      (maxWidth && dimensions[type] <= maxWidth) ||
      (minHeight && dimensions[type] >= minHeight) ||
      (maxHeight && dimensions[type] <= maxHeight),
    [dimensions]
  );

  return { dimensions, mediaQuery };
};
