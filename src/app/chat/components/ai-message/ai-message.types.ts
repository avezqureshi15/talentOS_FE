type ActionBtn = {
  Icon: React.ComponentType;
  label: string;
  onClick?: () => void;
};

export type AIResponseBlockProps = {
  message: string;
  thought?: string;
  actions?: ActionBtn[];
};