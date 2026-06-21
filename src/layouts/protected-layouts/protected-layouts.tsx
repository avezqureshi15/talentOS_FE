import { useState } from "react";
import { Outlet } from "react-router-dom";

import { HISTORY_EARLIER, HISTORY_TODAY } from "@/constants/constants";
import { Icon } from "@/components/ui/icons";
import Header from "@/components/ui/header/header";
import Sidebar from "@/components/ui/sidebar/sidebar";
import ErrorBoundary from "@/components/ui/error-boundary/error-boundary";

export default function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="chat-root">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        HISTORY_TODAY={HISTORY_TODAY}
        HISTORY_EARLIER={HISTORY_EARLIER}
        Icon={Icon}
      />

      <main className="chat-main">
        <Header
          mounted={false}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          Icon={Icon}
        />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}