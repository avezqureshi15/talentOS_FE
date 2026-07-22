import { useEffect } from "react";
import { useHeaderStore } from "@/store/header.store";
import type { HeaderConfig } from "@/store/header.store";

const PageHeader = (props: HeaderConfig) => {
  const setConfig = useHeaderStore((s) => s.setConfig);
  const clearConfig = useHeaderStore((s) => s.clearConfig);

  // justification: registers the page-level header config on mount and cleans up on unmount
  useEffect(() => {
    setConfig(props);
    return () => clearConfig();
  }, [props, setConfig, clearConfig]);

  return null;
};

export default PageHeader;
