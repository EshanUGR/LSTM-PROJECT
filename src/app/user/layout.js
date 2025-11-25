"use client";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function UserLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // --- FIX 1: Clear Text Loading (No blurry spinner) ---
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl font-bold text-black">Loading...</p>
      </div>
    );
  }

  return (
    // --- FIX 2: Added 'antialiased' for sharp text ---
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row antialiased">
      {/* Sidebar: Changed to Dark Gray (Neutral Professional Color) */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 shadow-lg flex-shrink-0">
        <div className="flex justify-between items-center mb-6 md:block">
          <h2 className="text-2xl font-bold text-white">Member Area</h2>
        </div>

        <nav className="space-y-2 md:space-y-4 flex flex-row md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <Link
            href="/user"
            className="block p-3 rounded hover:bg-gray-800 transition whitespace-nowrap font-medium"
          >
            🏠 Dashboard
          </Link>

          {/* --- NEW LINK ADDED HERE --- */}
          <Link
            href="/user/all-books"
            className="block p-3 rounded hover:bg-gray-800 transition whitespace-nowrap font-medium"
          >
            📖 See All Books
          </Link>

          <Link
            href="/user/history"
            className="block p-3 rounded hover:bg-gray-800 transition whitespace-nowrap font-medium"
          >
            📚 My Reservations
          </Link>

          <Link
            href="/user/browse"
            className="block p-3 rounded hover:bg-gray-800 transition whitespace-nowrap font-medium"
          >
            🔍 Browse Library
          </Link>

          <Link
            href="/"
            className="block p-3 mt-0 md:mt-10 bg-red-600 rounded text-center hover:bg-red-700 whitespace-nowrap font-bold"
          >
            &larr; Home
          </Link>
        </nav>
      </aside>

      {/* Main Content: White background for clarity */}
      <main className="flex-1 p-8 overflow-y-auto bg-white text-gray-900">
        {children}
      </main>
    </div>
  );
}
