import "./user-message.css";
import type { UserMessageProps } from "./user-message.types";



const UserMessage = ({ text }: UserMessageProps) => {
  return (
    <div className={`messageRow messageRowUser cui-fade-right`}>
      <div className={`messageBubble messageUser`}>
        {text}
      </div>
    </div>
  );
};

export default UserMessage;