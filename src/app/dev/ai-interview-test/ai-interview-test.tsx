import AiInterviewTemplate from "@/app/dashboard/round-details/components/ai-interview-template/ai-interview-template";
import { MOCK_EVALUATION } from "@/app/dashboard/round-details/pages/round-details.constants";
import "@/app/dashboard/round-details/components/ai-interview-template/ai-interview-template.css";
import "@/app/dashboard/round-details/pages/round-details.css";

const AiInterviewTest = () => (
  <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <AiInterviewTemplate data={MOCK_EVALUATION} />
  </div>
);

export default AiInterviewTest;
