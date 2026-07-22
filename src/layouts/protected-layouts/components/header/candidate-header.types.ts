import type { HeaderConfig } from "@/store/header.store";

export type CandidateHeaderProps = {
  title?: string;
  avatarLabel?: string;
  meta?: HeaderConfig["meta"];
  actions?: HeaderConfig["actions"];
};
