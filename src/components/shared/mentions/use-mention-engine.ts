import { useState } from "react";

export const useMentionEngine = () => {
  const [show, setShow] = useState(false);

  const handleChange = (value: string, cursorPos: number) => {
    const textUntilCursor = value.slice(0, cursorPos);
    const match = textUntilCursor.match(/@(\w*)$/);
    setShow(!!match);
  };

  const insert = (text: string, value: string, setValue: (v: string) => void) => {
    const newText = value.replace(/@(\w*)$/, () => `@${text} `);
    setValue(newText);
    setShow(false);
  };

  return { show, handleChange, insert };
};
