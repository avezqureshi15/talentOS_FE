// mention.types.ts

export type TriggerType = "@" | "#";

export type User = {
  id: number;
  name: string;
  type: "user";
  email:string;
};

export type Recruitment = {
  id: number;
  title: string;
  type: "recruitment";
  description:string
};

export type MentionItem = User | Recruitment;

export type MentionPopupProps = {
  show: boolean;
  data: MentionItem[];
  activeTrigger: TriggerType | null;
  onSelect: (item: MentionItem) => void;
};