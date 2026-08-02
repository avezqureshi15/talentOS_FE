import { useEffect } from "react";

export const DOCUMENT_DEFAULT_TITLE = "TalentOS | AI Hiring Platform";

export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    document.title = title || DOCUMENT_DEFAULT_TITLE;
    return () => {
      document.title = DOCUMENT_DEFAULT_TITLE;
    };
  }, [title]);
};
