export type ProfileMenuItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
};

export type ProfileMenuSection = {
  items: readonly ProfileMenuItem[];
  danger?: boolean;
};
