"use client";
import { useState, useEffect } from "react";

export default function AppLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Listen for sidebar collapse state changes
    const handleSidebarToggle = (event) => {
      setIsCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);
    return () =>
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  return (
    <main
      className={`transition-all duration-300 ${
        isCollapsed ? "lg:ml-[80px]" : "lg:ml-[240px]"
      } min-h-screen pt-16 lg:pt-0`}
    >
      <div className="">{children}</div>
    </main>
  );
}
