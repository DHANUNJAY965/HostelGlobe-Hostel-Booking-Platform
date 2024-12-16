"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminDashboardPage() {
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    
    const session = localStorage.getItem("session");
    if (session) {
      const parsedSession = JSON.parse(session);
      setUsername(parsedSession.username || "Guest");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
    <Navbar user={{ username }} role="admin" />
    <AdminDashboard />
  </div>
  
  );
}
