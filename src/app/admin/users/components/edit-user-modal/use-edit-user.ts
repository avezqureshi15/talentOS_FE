import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  updateUser,
  type AdminUser,
  type UpdateUserPayload,
} from "@/app/admin/users/services/users-admin.service";
import { EDIT_USER_LABELS } from "./edit-user-modal.constants";

type UseEditUserArgs = {
  user: AdminUser;
  tenantId?: number;
  onSuccess: () => void;
};

export function useEditUser({ user, tenantId, onSuccess }: UseEditUserArgs) {
  // UI-only state: form fields + local submit error.
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.is_active);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(user.id, payload),
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : EDIT_USER_LABELS.ERROR_FALLBACK;
      setError(msg);
    },
  });

  const submit = () => {
    setError("");
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(EDIT_USER_LABELS.NAME_REQUIRED);
      return;
    }

    const payload: UpdateUserPayload = {};
    if (trimmedName !== user.name) payload.name = trimmedName;
    if (role !== user.role) payload.role = role;
    if (isActive !== user.is_active) payload.is_active = isActive;
    if (password) payload.password = password;
    if (tenantId) payload.tenant_id = tenantId;

    mutation.mutate(payload);
  };

  return {
    name,
    setName,
    role,
    setRole,
    isActive,
    setIsActive,
    password,
    setPassword,
    error,
    isSubmitting: mutation.isPending,
    submit,
  };
}
