"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function UserManagementPage() {
  const { user } = useAuth();

  // State variables
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // --- 1. FETCH USERS (Updated Path) ---
  const fetchUsers = async () => {
    try {
      // CHANGED: Path is now /api/users instead of /api/admin/users
      const res = await fetch("http://localhost:8081/api/users", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchUsers();
  }, [user]);

  // --- 2. TOGGLE BLACKLIST (Updated Path) ---
  const handleToggleBlacklist = async (userId) => {
    try {
      // CHANGED: Path is now /api/users/{id}/blacklist
      const res = await fetch(
        `http://localhost:8081/api/users/${userId}/blacklist`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      if (res.ok) {
        const updatedUser = await res.json();

        // Update the specific user in the list without reloading
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

        const statusText = updatedUser.isBlacklisted
          ? "Blacklisted"
          : "Activated";
        setMessage(`User ${updatedUser.email} has been ${statusText}.`);

        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // --- 3. DELETE USER (Updated Path) ---
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this user?"))
      return;

    try {
      // CHANGED: Path is now /api/users/{id}
      const res = await fetch(`http://localhost:8081/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
        setMessage("User deleted successfully.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading)
    return <div className="p-10 text-gray-700">Loading Users...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        {message && (
          <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded">
            {message}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900">
                  {u.id}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm text-gray-900 font-medium">
                  {u.email}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      u.role === "LIBRARIAN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  {u.isBlacklisted ? (
                    <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-xs font-bold">
                      Blacklisted
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-bold">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  <div className="flex gap-3">
                    {/* Protection: Don't show actions for your own account */}
                    {u.email !== user.email && (
                      <>
                        <button
                          onClick={() => handleToggleBlacklist(u.id)}
                          className={`px-3 py-1 rounded text-white text-xs font-bold transition shadow-sm ${
                            u.isBlacklisted
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-orange-500 hover:bg-orange-600"
                          }`}
                        >
                          {u.isBlacklisted ? "Activate" : "Blacklist"}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-3 py-1 rounded text-white text-xs font-bold bg-red-600 hover:bg-red-700 transition shadow-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {u.email === user.email && (
                      <span className="text-gray-400 text-xs italic">
                        Current User
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
