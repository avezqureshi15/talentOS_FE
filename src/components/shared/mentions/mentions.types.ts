export type CommandItem = {
  id: string;
  label: string;
  description?: string;
  relationalId?: string;
};

export type CommandEntry = {
  id: string;
  label: string;
  icon?: string;
  children?: CommandEntry[];
  searchPlaceholder?: string;
  fetcher?: (query: string) => Promise<CommandItem[]>;
  getInsertText?: (item?: CommandItem) => string;
  isWizardAction?: boolean;
};

export type MenuLevel = {
  title: string;
  entries: CommandEntry[];
};

export type TokenType = "action" | "applicant" | "interviewer" | "slot" | "entity";

export type Token = {
  type: TokenType;
  label: string;
  id: string;
  relationalId?: string;
};

export type WizardStage = 0 | 1 | 2 | 3;

export type WizardStageConfig = {
  stage: WizardStage;
  header: string;
  fetcher: (query: string) => Promise<CommandItem[]>;
  tokenType: TokenType;
  isFinal: boolean;
};

export type WizardActionConfig = {
  id: string;
  label: string;
  icon: string;
  stages: WizardStageConfig[];
  totalTokens: number;
  executionCue: string;
};

export type MenuController = {
  currentLevel: MenuLevel;
  search: string;
  setSearch: (v: string) => void;
  filteredEntries: CommandEntry[];
  listItems: CommandItem[];
  isListView: boolean;
  activeEntry: CommandEntry | null;
  canGoBack: boolean;
  selectedIndex: number;
  setSelectedIndex: (v: number) => void;
  navigateTo: (entry: CommandEntry) => void;
  goBack: () => void;
  moveUp: () => void;
  moveDown: () => void;
  selectCurrentItem: () => (CommandEntry | CommandItem) | null;
};

export type WizardExecutionPayload = {
  message_type: "COMMAND_EXECUTION";
  intent: string;
  payload: Record<string, string>;
};

export type WizardExecutionSummary = {
  applicantName: string;
  interviewerName: string;
  slotLabel: string;
  rawText: string;
};

export type HybridQuestionPayload = {
  message_type: "HYBRID_QUESTION";
  intent: "INQUIRE_HR_REQUEST" | "INQUIRE_APPLICANT" | "INQUIRE_EMPLOYEE";
  payload: {
    id_field: string;
    name_field: string;
    raw_text_context: string;
  };
};
