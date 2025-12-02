"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">Ravindu Library</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Discover a world of knowledge. Reserve your favorite books, manage
          your borrowing history, and explore our vast collection.
        </p>

        <div className="space-x-4">
          {user ? (
            // --- LOGGED IN VIEW ---
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg font-medium text-gray-800">
                Welcome back, {user.email}!
              </p>

              <div className="flex gap-4 flex-wrap justify-center">
                {/* A. Admin Only Link */}
                {user.role === "LIBRARIAN" && (
                  <Link
                    href="/admin"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* B. Browse Books (Everyone) */}
                <Link
                  href="/user" // <-- Create this page next
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  User Dashboard
                </Link>

                {/* D. Logout */}
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            // --- LOGGED OUT VIEW ---
            <>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                Login to Start
              </Link>
              <Link
                href="/signup"
                className="bg-white text-blue-600 px-8 py-3 border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition ml-4"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; 2025 Ravindu Library. All rights reserved.</p>
      </footer>
    </div>
  );
}
