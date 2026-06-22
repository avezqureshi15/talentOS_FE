const VISITOR_KEY = "talentos_visitor_id";

export const getVisitorId = (): string => {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
};
