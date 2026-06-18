import { useEffect, useState } from "react";

export function useTypingMarkdown(text: string, speed = 10) {
  const [output, setOutput] = useState("");

  useEffect(() => {
    let i = 0;
    setOutput("");

    const interval = setInterval(() => {
      i++;
      setOutput(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return output;
}