import { useState } from "react";
import { Outlet } from "react-router-dom";

import "../../app/chat/pages/chat.css";
import { Icon } from "../../components/ui/icons";
import Header from "../../components/ui/header/header";
import Sidebar from "../../components/ui/sidebar/sidebar";

export default function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="chat-root">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        Icon={Icon}
      />

      <main className="chat-main">
        <Header
          mounted={false}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          Icon={Icon}
        />
        <Outlet />
      </main>
    </div>
  );
}