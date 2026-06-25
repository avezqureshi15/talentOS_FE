import { Icon } from "@/components/ui/icons";
import "./thinking.css";
import type { Props } from "./thinking.types";

const ThinkingChip: React.FC<Props> = ({ text }) => {
    return (
        <div className="cui-fade-up thinking-chip">
            <Icon.Thought />
            <span>{text}</span>
        </div>
    );
};

export default ThinkingChip;