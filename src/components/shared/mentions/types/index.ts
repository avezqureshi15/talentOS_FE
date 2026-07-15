export type CommandItem = {
  id: string;
  label: string;
  description?: string;
  relationalId?: string;
  meta?: Record<string, string>;
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
  hasMore?: boolean;
  loadMore?: () => Promise<CommandItem[]>;
};

export type MenuLevel = {
  title: string;
  entries: CommandEntry[];
};

export type TokenType = "action" | "applicant" | "interviewer" | "slot" | "entity" | "ask-slots" | "send-mail" | "hiring-request" | "interview" | "alert";

export type Token = {
  type: TokenType;
  label: string;
  id: string;
  relationalId?: string;
};

export type WizardStage = 0 | 1 | 2 | 3 | 4 | 5;

export type WizardStageConfig = {
  stage: WizardStage;
  header: string;
  fetcher: (query: string) => Promise<CommandItem[]>;
  tokenType: TokenType;
  isFinal: boolean;
  isMultiSelect?: boolean;
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
  isLoading?: boolean;
  loadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
};

export type WizardExecutionPayload = {
  message_type: "COMMAND_EXECUTION";
  intent: string;
  payload: Record<string, string>;
};

export type WizardExecutionSummary = {
  hiringRequestName?: string;
  applicantName: string;
  interviewerName: string;
  slotLabel: string;
  rawText: string;
  selectedEmployeeCount?: number;
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

export type MenuSelection = { action: "insert"; text: string } | { action: "navigate"; entry: CommandEntry } | { action: "wizard"; stage: WizardStage };
