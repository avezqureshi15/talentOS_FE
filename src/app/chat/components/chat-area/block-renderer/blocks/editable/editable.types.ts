export type EditableBlockProps = {
  content: string;
  onSave: (content: string) => void | Promise<void>;
  isEditing?: boolean;
  onEditRequest?: () => void;
  onCancel?: () => void;
  saving?: boolean;
};
