export type SkillChip = {
  key: string;
  label: string;
};

export type SkillChipsProps = {
  title: string;
  chips: SkillChip[];
  selected: string[];
  onToggle: (key: string) => void;
};
