import { useContext } from "react";
import { CmdPaletteContext } from "../command-palette-provider";

export const useCmdPaletteContext = () => {
  const ctx = useContext(CmdPaletteContext);
  if (!ctx) {
    throw new Error("useCmdPaletteContext must be used within CmdPaletteProvider");
  }
  return ctx;
};
