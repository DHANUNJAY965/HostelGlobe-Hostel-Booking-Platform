"use client";
import { Navbar } from '@/components/navbar'
import { SuperAdminDashboard } from '@/components/super-admin-dashboard'
import { useEffect, useState } from "react";

export default function SuperAdminDashboardPage() {
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    // Retrieve session from local storage
    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession = JSON.parse(session);
      setUsername(parsedSession.username || "Guest");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={{ username }} role="superadmin" />
      <SuperAdminDashboard />
    </div>
  );
}

