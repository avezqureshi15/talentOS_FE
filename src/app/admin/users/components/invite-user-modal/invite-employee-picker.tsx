import { PersonAvatar } from "@/components/shared/person-avatar/person-avatar";
import { INVITE_MODAL_LABELS } from "./invite-user-modal.constants";
import type { SelectedEmployee } from "./invite-user-modal.types";
import type { UserItem } from "@/services/users/users";
import "./invite-employee-picker.css";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  employees: UserItem[];
  isSearching: boolean;
  selected: SelectedEmployee | null;
  onSelect: (employee: SelectedEmployee) => void;
  onClear: () => void;
};

const toSelected = (u: UserItem): SelectedEmployee => ({
  id: u.id,
  email: u.email,
  name: u.name,
  designation: u.designation,
  emp_id: u.emp_id,
});

const InviteEmployeePicker = ({
  search,
  onSearchChange,
  employees,
  isSearching,
  selected,
  onSelect,
  onClear,
}: Props) => {
  if (selected) {
    return (
      <div className="iep-selected" role="group" aria-label="Selected employee">
        <PersonAvatar
          className="iep-selected-avatar"
          person={{ name: selected.name, email: selected.email, designation: selected.designation || undefined }}
        />
        <div className="iep-selected-info">
          <span className="iep-selected-name">{selected.name}</span>
          <span className="iep-selected-meta">
            {selected.email}
            {selected.designation ? ` · ${selected.designation}` : ""}
          </span>
        </div>
        <button
          type="button"
          className="iep-selected-clear"
          onClick={onClear}
          aria-label={INVITE_MODAL_LABELS.CLEAR_SELECTION}
          title={INVITE_MODAL_LABELS.CLEAR_SELECTION}
        >
          <i className="bx bx-x" />
        </button>
      </div>
    );
  }

  return (
    <div className="iep">
      <div className="iep-search-wrap">
        <i className="bx bx-search iep-search-icon" />
        <input
          type="text"
          className="iep-search"
          placeholder={INVITE_MODAL_LABELS.SEARCH_PLACEHOLDER}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          autoFocus
        />
      </div>

      <div className="iep-list" role="listbox">
        {isSearching && employees.length === 0 ? (
          <div className="iep-empty">
            <i className="bx bx-loader-alt bx-spin" />
          </div>
        ) : employees.length === 0 ? (
          <div className="iep-empty">
            {search ? INVITE_MODAL_LABELS.NO_RESULTS : INVITE_MODAL_LABELS.SEARCH_HINT}
          </div>
        ) : (
          employees.map((u) => (
            <button
              key={u.id}
              type="button"
              className="iep-item"
              role="option"
              onClick={() => onSelect(toSelected(u))}
            >
              <PersonAvatar
                className="iep-item-avatar"
                person={{ name: u.name, email: u.email, designation: u.designation }}
              />
              <div className="iep-item-info">
                <span className="iep-item-name">{u.name}</span>
                <span className="iep-item-meta">
                  {u.email}
                  {u.designation ? ` · ${u.designation}` : ""}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default InviteEmployeePicker;
