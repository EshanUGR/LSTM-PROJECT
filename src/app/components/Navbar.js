"use client";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <div className="font-bold">Akila Library</div>
      <div>
        {user ? (
          // IF USER IS LOGGED IN
          <div className="flex gap-4">
            <span>
              Welcome, {user.email} ({user.role})
            </span>
            <button onClick={logout} className="text-red-400">
              Logout
            </button>
          </div>
        ) : (
          // IF USER IS NOT LOGGED IN
          <div className="flex gap-4">
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
