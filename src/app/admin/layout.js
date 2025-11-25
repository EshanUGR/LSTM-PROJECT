"use client";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Protect Route: Redirect if not Librarian
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "LIBRARIAN") {
        router.push("/login"); // Redirect unauthorized users
      }
    }
  }, [user, loading, router]);

  if (loading || !user)
    return <div className="p-10">Checking Admin Privileges...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 text-blue-400">Admin Panel</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block p-2 hover:bg-gray-800 rounded">
            Dashboard Overview
          </Link>
          <Link
            href="/admin/books"
            className="block p-2 hover:bg-gray-800 rounded"
          >
            Manage Books
          </Link>
          <Link
            href="/admin/users"
            className="block p-2 hover:bg-gray-800 rounded"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/categories"
            className="block p-2 hover:bg-gray-800 rounded"
          >
            Categories
          </Link>
          <Link
            href="/"
            className="block p-2 mt-10 hover:bg-red-700 bg-red-600 rounded text-center"
          >
            Exit to Home
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
