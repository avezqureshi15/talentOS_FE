import { Icon } from "../../../../../../../components/ui/icons";
import "./thinking.css";

type Props = {
  text: string;
};

const ThinkingChip: React.FC<Props> = ({ text }) => {
  return (
    <div className="thinking-chip cui-fade-up">
      <Icon.Thought />
      <span className="thinking-text">{text}</span>
    </div>
  );
};

export default ThinkingChip;
