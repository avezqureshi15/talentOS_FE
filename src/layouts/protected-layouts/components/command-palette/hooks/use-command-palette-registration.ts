import { useContext, useEffect } from "react";
import { CmdPaletteContext } from "../command-palette-provider";
import type { CommandPaletteConfig } from "../command-palette.types";

export const useCmdPaletteRegistration = (config: CommandPaletteConfig) => {
  const ctx = useContext(CmdPaletteContext);
  if (!ctx) {
    throw new Error("useCmdPaletteRegistration must be used within CmdPaletteProvider");
  }

  useEffect(() => {
    ctx.registerConfig(config);
    return () => {
      ctx.unregisterConfig();
    };
  }, [config, ctx.registerConfig, ctx.unregisterConfig]);
};
