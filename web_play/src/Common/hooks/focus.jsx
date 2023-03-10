import { useRef, useCallback } from "react";

export const useFocus = () => {
  const htmlElRef = useRef(null);

  const setFocus = useCallback(() => {
    htmlElRef.current && htmlElRef.current.focus();
  }, [htmlElRef]);

  return [htmlElRef, setFocus];
};
