"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Changed import
import { Navbar } from "@/components/navbar";
import { HostelDetail } from "@/components/hostel-detail";

// Define the structure of the session object
interface Session {
  username: string;
  role: string;
}

async function getHostel(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dhanu-globehostel-booking-platform.vercel.app/";
  const res = await fetch(`${baseUrl}/api/hostelbyid`, {
    method: "GET",
    headers: {
      "X-Hostel-Id": id,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch hostel");
  }
  return res.json();
}

export default function HostelPage() {
  // Use Next.js useParams hook for App Router
  const params = useParams();
  const id = params.id as string; // Get id from params in App Router

  // Explicitly type session to avoid 'never' error
  const [session, setSession] = useState<Session | null>(null);
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    // Ensure 'id' is available before calling getHostel
    if (id) {
      getHostel(id)
        .then((data) => setHostel(data))
        .catch((error) => console.error("Error fetching hostel:", error));
    }

    // Retrieve session from local storage
    const sessionData = localStorage.getItem("session");
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData);
      setSession(parsedSession);
    }
  }, [id]); // Update when 'id' changes

  if (!hostel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {session ? (
        <Navbar user={{ username: session.username }} role={session.role} />
      ) : (
        <Navbar />
      )}
      <main className="flex-grow p-8">
        <HostelDetail hostel={hostel} />
      </main>
    </div>
  );
}