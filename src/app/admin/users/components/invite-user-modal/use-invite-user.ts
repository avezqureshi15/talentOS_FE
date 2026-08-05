import { useState } from "react";
import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/constants";
import { createInvite } from "@/app/admin/users/services/users-admin.service";
import { fetchUsers } from "@/services/users/users";
import { useDebounce } from "@/hooks/use-debounce";
import {
  INVITE_MODAL_LABELS,
  INVITE_SEARCH_DEBOUNCE_MS,
  INVITE_SEARCH_LIMIT,
} from "./invite-user-modal.constants";
import type { InviteMode, InviteTab, SelectedEmployee } from "./invite-user-modal.types";

type UseInviteUserArgs = {
  mode: InviteMode;
  tenantId?: number;
  onSuccess: () => void;
};

export function useInviteUser({ mode, tenantId, onSuccess }: UseInviteUserArgs) {
  // UI-only state: form fields + tab + selected picker item + async error.
  const [tab, setTab] = useState<InviteTab>(mode === "existing-and-email" ? "existing" : "manual");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("recruiter");
  const [selected, setSelected] = useState<SelectedEmployee | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search, INVITE_SEARCH_DEBOUNCE_MS);

  const employeesQuery = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEES, "invite-picker", debouncedSearch],
    queryFn: () =>
      fetchUsers(debouncedSearch || undefined, 1, INVITE_SEARCH_LIMIT, false).then((r) => r.data),
    enabled: mode === "existing-and-email" && tab === "existing",
    placeholderData: keepPreviousData,
  });

  const inviteMutation = useMutation({
    mutationFn: (payload: { email: string; role: string; tenant_id?: number }) => createInvite(payload),
    onSuccess: () => {
      setError("");
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : INVITE_MODAL_LABELS.ERR_GENERIC;
      setError(msg);
    },
  });

  const resolvedEmail =
    tab === "existing" && selected ? selected.email : email.trim();
  const canSubmit =
    !inviteMutation.isPending &&
    !!resolvedEmail &&
    (tab === "manual" ? true : !!selected);

  const submit = () => {
    setError("");
    if (!resolvedEmail) {
      setError(
        tab === "existing"
          ? INVITE_MODAL_LABELS.ERR_PICK_EMPLOYEE
          : INVITE_MODAL_LABELS.ERR_EMAIL_REQUIRED,
      );
      return;
    }
    inviteMutation.mutate({ email: resolvedEmail, role, tenant_id: tenantId });
  };

  return {
    tab,
    setTab,
    email,
    setEmail,
    role,
    setRole,
    selected,
    setSelected,
    search,
    setSearch,
    error,
    canSubmit,
    isSubmitting: inviteMutation.isPending,
    submit,
    employees: employeesQuery.data ?? [],
    isSearching: employeesQuery.isFetching,
  };
}
