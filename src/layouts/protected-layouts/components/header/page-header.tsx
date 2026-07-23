import { useLayoutEffect } from "react";
import { useHeaderStore } from "@/store/header.store";
import type { HeaderConfig } from "@/store/header.store";

const PageHeader = (props: HeaderConfig) => {
  const setConfig = useHeaderStore((s) => s.setConfig);

  useLayoutEffect(() => {
    setConfig(props);
  });

  return null;
};

export default PageHeader;
