import { create } from "zustand";
import { USER_QUERIES } from "../services/ai/constants/scripts.constants";

const SCRIPT_ORDER: (keyof typeof USER_QUERIES)[] = [
  "INITIATE_HIRING",
  "ROLE_SELECTION",
  "CREATE_JD",
  "JD_ADD_EXPERIENCE",
  "JD_ADD_REACT_NATIVE",
  "JD_MAKE_MORE_HUMAN",
  "JD_APPROVED",
];

const SCRIPT = SCRIPT_ORDER.map((key) => USER_QUERIES[key]);

type ScriptState = {
  script: string[];
  index: number;
  running: boolean;

  start: () => void;
  getNext: () => string | null;
};

export const useScriptStore = create<ScriptState>((set, get) => ({
  script: SCRIPT,
  index: 0,
  running: false,

  start: () => set({ running: true, index: 0 }),

  getNext: () => {
    const { script, index } = get();

    if (index >= script.length) return null;

    const value = script[index];

    set({ index: index + 1 });

    return value;
  },
}));