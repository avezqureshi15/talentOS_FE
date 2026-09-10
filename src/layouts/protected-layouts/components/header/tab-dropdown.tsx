import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HIRING_TABS } from "@/constants/routes";
import type { TabDropdownProps } from "./tab-dropdown.types";

const TAB_LABELS: Record<string, string> = {
  applications: "Applications",
  "interview-design": "Interview Design",
  proctoring: "Proctoring",
  "email-manager": "Email Templates",
  "team-members": "Team Members",
};

const TabDropdown = ({ totalCount }: TabDropdownProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentTab =
    HIRING_TABS.find((t) => location.pathname.endsWith(`/${t}`)) ??
    (location.pathname.endsWith("/archived") ? "applications" : undefined);
  const currentIndex = currentTab !== undefined ? HIRING_TABS.indexOf(currentTab) : -1;

  // justification: closes the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const navigateTab = (tab: string) => {
    setOpen(false);
    if (!location.pathname.startsWith("/hiring-requests/")) return;
    const id = location.pathname.split("/")[2];
    navigate(`/hiring-requests/${id}/${tab}`);
  };

  if (currentIndex < 0) return null;

  return (
    <div className="jobs-title-group" ref={ref}>
      <div className="jobs-title-dropdown-trigger" onClick={() => setOpen((v) => !v)}>
        <h1 className="jobs-title">{TAB_LABELS[currentTab!]}</h1>
        <i className="bx bx-chevron-down jobs-title-dropdown-arrow" />
      </div>
      {totalCount !== undefined && <span className="jobs-count-pill">{totalCount}</span>}
      {open && (
        <div className="jobs-title-dropdown">
          {HIRING_TABS.map((tab, i) => (
            <div
              key={tab}
              className={`jobs-title-dropdown-item${i === currentIndex ? " jobs-title-dropdown-item--active" : ""}`}
              onClick={() => navigateTab(tab)}
            >
              {TAB_LABELS[tab]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabDropdown;
