import { useEffect, useState } from "react";
import "./organization-logo-avatar.css";

export type OrganizationLogoAvatarProps = {
  src: string | null | undefined;
  name: string;
  size?: "md" | "lg";
};

function getOrgInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function OrganizationLogoAvatar({
  src,
  name,
  size = "lg",
}: OrganizationLogoAvatarProps) {
  const trimmed = src?.trim() ?? "";
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [trimmed]);

  const showImage = trimmed !== "" && !failed;
  const initials = getOrgInitials(name);

  return (
    <div
      className={`org-logo-avatar org-logo-avatar--${size}`}
      role="img"
      aria-label={showImage ? `${name} logo` : `${name} initials`}
    >
      {showImage ? (
        <img
          className="org-logo-avatar__img"
          src={trimmed}
          alt=""
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="org-logo-avatar__initials" aria-hidden>
          {initials}
        </span>
      )}
    </div>
  );
}
