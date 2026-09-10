import { useEffect, useRef } from "react";

export const useIntersectionObserver = (
  callback: () => void,
  enabled: boolean,
) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;

    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callback();
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [callback, enabled]);

  return sentinelRef;
};
