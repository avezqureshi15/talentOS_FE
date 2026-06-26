import type { CommandItem } from "./mentions.types";

const MOCK_USERS: CommandItem[] = [
  { id: "1", label: "Avez", description: "avez@webknot.in" },
  { id: "2", label: "Avinash", description: "avinash@webknot.in" },
  { id: "3", label: "Rahul", description: "rahul@webknot.in" },
];

const MOCK_RECRUITMENTS: CommandItem[] = [
  { id: "1", label: "Frontend Engineer", description: "Frontend Engineer Recruitment being performed" },
  { id: "2", label: "Backend Engineer", description: "Backend Engineer Recruitment being performed" },
  { id: "3", label: "Fullstack Developer", description: "Fullstack Engineer Recruitment being performed" },
];

const MOCK_SLOTS: CommandItem[] = [
  { id: "1", label: "Monday 10:00 AM - 11:00 AM", description: "Available" },
  { id: "2", label: "Monday 2:00 PM - 3:00 PM", description: "Available" },
  { id: "3", label: "Tuesday 10:00 AM - 11:00 AM", description: "Available" },
];

export const fetchMockUsers = async (query: string): Promise<CommandItem[]> => {
  return MOCK_USERS.filter((u) =>
    u.label.toLowerCase().includes(query.toLowerCase()),
  );
};

export const fetchMockRecruitments = async (query: string): Promise<CommandItem[]> => {
  return MOCK_RECRUITMENTS.filter((j) =>
    j.label.toLowerCase().includes(query.toLowerCase()),
  );
};

export const fetchMockSlots = async (query: string): Promise<CommandItem[]> => {
  return MOCK_SLOTS.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase()),
  );
};
