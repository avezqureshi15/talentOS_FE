import { useState } from "react";
import type { MentionItem, TriggerType } from "@/components/shared/mentions/mentions.types";
import { fetchMockRecruitments, fetchMockUsers } from "@/components/shared/mentions/mock-api";

const TRIGGERS = {
  "@": fetchMockUsers,
  "#": fetchMockRecruitments,
};


export const useMentionEngine = () => {
 const [activeTrigger, setActiveTrigger] = useState<TriggerType | null>(null);

  const [data, setData] = useState<MentionItem[]>([]);
  const [show, setShow] = useState(false);

  const handleChange = async (value: string, cursorPos: number) => {
    const textUntilCursor = value.slice(0, cursorPos);
    const match = textUntilCursor.match(/([@#])(\w*)$/);

    if (match) {
      const trigger = match[1] as TriggerType;
      const q = match[2];

      setActiveTrigger(trigger);
      setShow(true);

      const fetcher = TRIGGERS[trigger as "@" | "#"];
      const result = await fetcher(q);
      setData(result as MentionItem[]);
    } else {
      setShow(false);
      setActiveTrigger(null);
    }
  };

  const handleSelect = (
    item: MentionItem,
    value: string,
    setValue: (v: string) => void
  ) => {
    const newText = value.replace(/([@#])(\w*)$/, () => {
      if (activeTrigger === "@" && "name" in item) return `@${item.name} `;
      if (activeTrigger === "#" && "title" in item) return `#${item.title} `;
      return "";
    });

    setValue(newText);
    setShow(false);
  };

  return {
    show,
    data,
    activeTrigger,
    handleChange,
    handleSelect,
  };
};