import type { FC } from "react";

export type IconComponent = FC<{ className?: string }>;

export type IconRegistry = Record<string, IconComponent>;
