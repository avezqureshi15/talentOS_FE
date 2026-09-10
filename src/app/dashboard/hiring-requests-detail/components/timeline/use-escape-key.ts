import { useEffect, useRef } from "react";

export const useEscapeKey = (callback: () => void) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") savedCallback.current();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);
};
