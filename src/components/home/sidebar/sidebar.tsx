import { SIDEBAR_NAV_ITEMS, SIDEBAR_NEW_LABEL, SIDEBAR_SIGN_IN } from "@/components/home/home.constants";

export default function Sidebar() {
  return (
    <aside className="home-sidebar">
      <div className="home-sidebar-logo-row">
        <div className="home-sidebar-logo-inner">
          <div className="home-sidebar-logo-box">✦</div>
        </div>
        <button className="home-sidebar-new-btn">
          <span>＋</span> {SIDEBAR_NEW_LABEL}
        </button>
      </div>

      <nav className="home-sidebar-nav">
        {SIDEBAR_NAV_ITEMS.map(({ icon, label }) => (
          <div key={label} className="home-sidebar-nav-item">
            <span className="home-sidebar-nav-icon">{icon}</span>
            {label}
          </div>
        ))}
      </nav>

      <div className="home-sidebar-footer">
        <div className="home-sidebar-user-row">
          <div className="home-sidebar-avatar">👤</div>
          <span className="home-sidebar-user-label">{SIDEBAR_SIGN_IN}</span>
          <span className="home-sidebar-chevron">›</span>
        </div>
      </div>
    </aside>
  );
}
