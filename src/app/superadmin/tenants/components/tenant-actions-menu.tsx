import { useEffect, useRef, useState } from "react";
import type { TenantAction, TenantActionsMenuProps } from "./tenant-actions-menu.types";
import "./tenant-actions-menu.css";

const ACTION_META: Record<
  TenantAction,
  { label: string; icon: string }
> = {
  approve: { label: "Approve", icon: "bx-check-circle" },
  reject: { label: "Reject", icon: "bx-x-circle" },
  edit: { label: "Edit", icon: "bx-pencil" },
  suspend: { label: "Suspend", icon: "bx-pause-circle" },
  reactivate: { label: "Reactivate", icon: "bx-play-circle" },
};

const TenantActionsMenu = ({
  tenant,
  busy,
  onApprove,
  onReject,
  onEdit,
  onSuspend,
  onReactivate,
}: TenantActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const items: TenantAction[] = [
    ...(tenant.verification_status === "pending"
      ? (["approve", "reject"] as TenantAction[])
      : []),
    "edit",
    ...(tenant.is_active ? (["suspend"] as TenantAction[]) : (["reactivate"] as TenantAction[])),
  ];

  const handleSelect = (key: TenantAction) => {
    setOpen(false);
    const handler: Record<TenantAction, (a: TenantAction) => void> = {
      approve: onApprove,
      reject: onReject,
      edit: onEdit,
      suspend: onSuspend,
      reactivate: onReactivate,
    };
    handler[key](key);
  };

  return (
    <div className="tam" ref={ref}>
      <button
        type="button"
        className="tam-trigger"
        title="Actions"
        aria-label="Tenant actions"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        disabled={busy}
      >
        {busy ? (
          <i className="bx bx-loader-alt bx-spin" />
        ) : (
          <i className="bx bx-dots-vertical-rounded" />
        )}
      </button>

      {open && (
        <div className="tam-menu">
          {items.map((key) => (
            <button
              key={key}
              type="button"
              className={`tam-item${
                key === "reject" ? " tam-item--danger" : key === "suspend" ? " tam-item--danger" : ""
              }`}
              onClick={() => handleSelect(key)}
            >
              <i className={`bx ${ACTION_META[key].icon}`} />
              <span>{ACTION_META[key].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantActionsMenu;