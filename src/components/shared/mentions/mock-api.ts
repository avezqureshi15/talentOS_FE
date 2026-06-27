import type { CommandItem } from "./mentions.types";

export const MOCK_USERS: CommandItem[] = [
  { id: "1", label: "Avez", description: "avez@webknot.in", relationalId: "usr_a1b2c3d4" },
  { id: "2", label: "Avinash", description: "avinash@webknot.in", relationalId: "usr_e5f6g7h8" },
  { id: "3", label: "Rahul", description: "rahul@webknot.in", relationalId: "usr_i9j0k1l2" },
];

export const MOCK_INTERVIEWERS: CommandItem[] = [
  { id: "int-1", label: "Neel Mehta", description: "Senior Frontend Engineer", relationalId: "int_m3n4o5p6" },
  { id: "int-2", label: "Priya Sharma", description: "Engineering Manager", relationalId: "int_q7r8s9t0" },
  { id: "int-3", label: "Arun Kumar", description: "Tech Lead", relationalId: "int_u1v2w3x4" },
  { id: "int-4", label: "Sneha Patel", description: "Senior Backend Engineer", relationalId: "int_y5z6a7b8" },
  { id: "int-5", label: "Rahul Verma", description: "Product Manager", relationalId: "int_c9d0e1f2" },
  { id: "int-6", label: "Ananya Gupta", description: "UX Designer", relationalId: "int_g3h4i5j6" },
  { id: "int-7", label: "Vikram Singh", description: "Data Scientist", relationalId: "int_k7l8m9n0" },
  { id: "int-8", label: "Kavita Nair", description: "DevOps Engineer", relationalId: "int_o1p2q3r4" },
];

export const MOCK_SLOTS: CommandItem[] = [
  { id: "slot-1", label: "10:00 AM - 11:00 AM", description: "Today", relationalId: "slt_s4t5u6v7" },
  { id: "slot-2", label: "2:00 PM - 3:00 PM", description: "Today", relationalId: "slt_w8x9y0z1" },
  { id: "slot-3", label: "4:00 PM - 5:00 PM", description: "Today", relationalId: "slt_a2b3c4d5" },
  { id: "slot-4", label: "9:00 AM - 10:00 AM", description: "Tomorrow", relationalId: "slt_e6f7g8h9" },
  { id: "slot-5", label: "11:00 AM - 12:00 PM", description: "Tomorrow", relationalId: "slt_i0j1k2l3" },
  { id: "slot-6", label: "3:00 PM - 4:00 PM", description: "Tomorrow", relationalId: "slt_m4n5o6p7" },
  { id: "slot-7", label: "10:00 AM - 11:00 AM", description: "Mon, Jun 30", relationalId: "slt_q8r9s0t1" },
  { id: "slot-8", label: "1:00 PM - 2:00 PM", description: "Mon, Jun 30", relationalId: "slt_u2v3w4x5" },
  { id: "slot-9", label: "10:00 AM - 11:00 AM", description: "Tue, Jul 1", relationalId: "slt_y6z7a8b9" },
  { id: "slot-10", label: "2:00 PM - 3:00 PM", description: "Tue, Jul 1", relationalId: "slt_c0d1e2f3" },
];

const MOCK_RECRUITMENTS: CommandItem[] = [
  { id: "1", label: "Frontend Engineer", description: "Frontend Engineer Recruitment being performed" },
  { id: "2", label: "Backend Engineer", description: "Backend Engineer Recruitment being performed" },
  { id: "3", label: "Fullstack Developer", description: "Fullstack Engineer Recruitment being performed" },
];

export const fetchMockUsers = async (query: string): Promise<CommandItem[]> => {
  return MOCK_USERS.filter((u) =>
    u.label.toLowerCase().includes(query.toLowerCase()),
  );
};

export const fetchMockInterviewers = async (query: string): Promise<CommandItem[]> => {
  return MOCK_INTERVIEWERS.filter((iv) =>
    iv.label.toLowerCase().includes(query.toLowerCase()),
  );
};

export const fetchMockRecruitments = async (query: string): Promise<CommandItem[]> => {
  return MOCK_RECRUITMENTS.filter((j) =>
    j.label.toLowerCase().includes(query.toLowerCase()),
  );
};

export const fetchMockSlots = async (query: string): Promise<CommandItem[]> => {
  return MOCK_SLOTS.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase()) ||
    s.description?.toLowerCase().includes(query.toLowerCase()),
  );
};
