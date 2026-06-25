import { STORAGE_KEYS } from "@/constants/constants";

export const getVisitorId = (): string => {
  let id = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, id);
  }
  return id;
};
