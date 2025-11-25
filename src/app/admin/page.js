"use client";

import Link from "next/link"; // <--- 1. Import Link here

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500">Total Books</h3>
          <p className="text-3xl font-bold">120</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500">Active Members</h3>
          <p className="text-3xl font-bold">45</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-gray-500">Overdue Returns</h3>
          <p className="text-3xl font-bold">3</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          {/* 2. Link to Add Book Page */}
          <Link
            href="/admin/books/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add New Book
          </Link>

          {/* 3. Link to Categories Page */}
          <Link
            href="/admin/categories/add"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
           + Add NEW Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
