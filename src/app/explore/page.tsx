"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { HostelCard } from "@/components/hostel-card";

type Session = {
  username: string;
  role: string;
};

async function getHostels() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://dhanu-globehostel-booking-platform.vercel.app/"; // Default to localhost for dev
  const res = await fetch(`${baseUrl}/api/allhostels`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch hostels");
  }
  return res.json();
}

export default function ExplorePage() {
  const [hostels, setHostels] = useState([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Fetch hostels data
    getHostels()
      .then((data) => setHostels(data))
      .catch((error) => console.error("Error fetching hostels:", error));

    // Retrieve session from local storage
    const sessionData = localStorage.getItem("session");
    if (sessionData) {
      const parsedSession: Session = JSON.parse(sessionData);
      setSession(parsedSession);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {session ? (
        // If session exists, pass session data as props to Navbar
        <Navbar user={{ username: session.username }} role={session.role} />
      ) : (
        // If no session, render Navbar without any props
        <Navbar />
      )}

      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold mb-8">Explore Hostels</h1>
        {hostels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hostels.map((hostel) => (
                            // @ts-expect-error: Temporarily ignoring the type error due to known issue with the data structure
              <HostelCard key={hostel._id} hostel={hostel} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-2xl mb-4">No hostels are currently available.</p>
            <p>Please check back later or contact an administrator.</p>
          </div>
        )}
      </main>
    </div>
  );
}
