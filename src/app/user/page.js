"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function UserDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.token) {
      // Fetch "My Profile" from the backend
      fetch("http://localhost:8081/api/users/me", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setProfile(data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (!profile) return <div>Loading Profile...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Dashboard</h1>

      {/* Profile Card */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl border-t-4 border-teal-600">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, Member!
            </h2>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase">
              Role
            </label>
            <p className="text-lg font-medium text-gray-800">{profile.role}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase">
              Account Status
            </label>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-bold ${
                profile.isBlacklisted
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {profile.isBlacklisted ? "Restricted" : "Active"}
            </span>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 uppercase">
              Member Since
            </label>
            <p className="text-lg font-medium text-gray-800">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
