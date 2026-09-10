import { ROUTES } from "@/constants/routes";

export const routeExact =
  (path: string) =>
  (pathname: string): boolean =>
    pathname === path;

export const routePrefix =
  (path: string) =>
  (pathname: string): boolean =>
    pathname === path || pathname.startsWith(`${path}/`);

export type CommandPaletteRouteMatcher = (pathname: string) => boolean;

export const COMMAND_PALETTE_ROUTES: CommandPaletteRouteMatcher[] = [
  routeExact(ROUTES.HIRING_REQUESTS),
  routeExact(ROUTES.ADMIN_EMPLOYEES),
];

export const isCommandPaletteRoute = (pathname: string): boolean =>
  COMMAND_PALETTE_ROUTES.some((match) => match(pathname));
