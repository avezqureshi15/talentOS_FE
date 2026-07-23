export type MarkdownRendererProps = {
  content: string;
  ui?: string;
  isEditing?: boolean;
  onSave?: (content: string) => void;
  onEditRequest?: () => void;
};
