import { useState, useCallback } from "react";

export const useHeaderShare = () => {
  // justification: copied indicates whether the share link has been copied to clipboard
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async (): Promise<boolean> => {
    const text = window.location.href;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.appendChild(el);
        el.focus();
        el.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(el);
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        return ok;
      } catch {
        return false;
      }
    }
  }, []);

  return { copied, handleShare };
};
