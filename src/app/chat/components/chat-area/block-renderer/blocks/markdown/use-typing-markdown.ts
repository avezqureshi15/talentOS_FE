import { useEffect, useRef, useState } from "react";

export function useTypingMarkdown(text: string, speed = 10) {
  const [output, setOutput] = useState("");
  const indexRef = useRef(0);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;

    if (text.length < indexRef.current) {
      indexRef.current = 0;
    }

    if (indexRef.current >= text.length) {
      setOutput(text);
      return;
    }

    const interval = setInterval(() => {
      indexRef.current += 1;
      const next = textRef.current.slice(0, indexRef.current);
      setOutput(next);

      if (indexRef.current >= textRef.current.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return output;
}
