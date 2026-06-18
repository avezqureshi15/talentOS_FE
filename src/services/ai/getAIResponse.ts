import type { AIResponse } from "../../app/chat/pages/chat.type";
import { USER_QUERIES } from "./constants/scripts.constants";
import { candidateStatusResponses } from "./responses/candidateStatus.response";
import { generateJDResponses } from "./responses/generateJD.response";
import { howCanHelpResponses } from "./responses/howcanhelp.response";
import { humanlyResponses } from "./responses/humanly.response";
import { initResponses } from "./responses/init.response";
import { jdAddExpResponses } from "./responses/jd-add-experience";
import { jdAddBonusResponses } from "./responses/jdAddBonus.response";
import { publisingResponses } from "./responses/publishing.response";
import { publishTriggerResponse } from "./responses/publishTrigger.response";
import { cleanMarkdown } from "./util";


type UserQueryKey = keyof typeof USER_QUERIES;


export const resolveUserQuery = (
  input: string
): UserQueryKey | null => {
  const normalized = input.trim().toLowerCase();

  for (const key in USER_QUERIES) {
    const value = USER_QUERIES[key as UserQueryKey];

    if (value.toLowerCase() === normalized) {
      return key as UserQueryKey;
    }
  }

  return null;
};


const getResponseByState = (
  state: UserQueryKey
): AIResponse => {
  switch (state) {
    case "INITIATE_HIRING":
      return initResponses.default();

    case "ROLE_SELECTION":
      return howCanHelpResponses.default();

    case "CREATE_JD":
      return generateJDResponses.default();

    case "JD_ADD_EXPERIENCE":
      return jdAddExpResponses.default();

    case "JD_ADD_REACT_NATIVE":
      return jdAddBonusResponses.default();
      
    case "JD_MAKE_MORE_HUMAN":
      return humanlyResponses.default();
    
    case "JD_APPROVED":
      return publishTriggerResponse.default();
      
    case "PUBLISH_JD":
      return publishTriggerResponse.default();

    case "PUBLISHING":
      return publisingResponses.default();

    case "CHECK_CANDIDATE_STATUS":
      return candidateStatusResponses.default();

    default:
      return initResponses.default();
  }
};

export const getAIResponse = async (
  input: string
): Promise<AIResponse> => {
  const text = cleanMarkdown(input.toLowerCase());

  const state = resolveUserQuery(text);
  console.log(state)
  if (!state) {
    return initResponses.default();
  }

  return getResponseByState(state);
};