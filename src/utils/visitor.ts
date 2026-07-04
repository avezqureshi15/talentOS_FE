import { STORAGE_KEYS } from "@/constants/constants";
import { storage } from "@/utils/storage";

export const getVisitorId = (): string => {
  let id = storage.get(STORAGE_KEYS.VISITOR_ID);
  if (!id) {
    id = crypto.randomUUID();
    storage.set(STORAGE_KEYS.VISITOR_ID, id);
  }
  return id;
};
