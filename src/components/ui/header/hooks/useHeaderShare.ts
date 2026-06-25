import { useState, useCallback } from "react";

export const useHeaderShare = () => {
  // justification: copied indicates whether the share link has been copied to clipboard
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Clipboard not available:", err);
    }
  }, []);

  return { copied, handleShare };
};
