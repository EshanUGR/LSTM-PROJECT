"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function CategoriesPage() {
  const { user } = useAuth();

  // State
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Edit Mode State
  const [editingCategory, setEditingCategory] = useState(null);

  // --- 1. FETCH CATEGORIES (READ) ---
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/categories", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchCategories();
  }, [user]);

  // --- 2. ADD CATEGORY (CREATE) ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch("http://localhost:8081/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (res.ok) {
        const addedCategory = await res.json();
        setCategories([...categories, addedCategory]); // Add to list
        setNewCategoryName(""); // Clear input
        setMessage("Category added successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        alert("Failed to add category.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- 3. DELETE CATEGORY (DELETE) ---
  const handleDelete = async (id) => {
    if (
      !confirm("Are you sure? This might affect books linked to this category.")
    )
      return;

    try {
      const res = await fetch(`http://localhost:8081/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
        setMessage("Category deleted successfully.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        alert("Failed to delete category.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- 4. UPDATE CATEGORY (UPDATE) ---
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8081/api/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ name: editingCategory.name }),
        }
      );

      if (res.ok) {
        const updatedCat = await res.json();
        setCategories(
          categories.map((c) => (c.id === updatedCat.id ? updatedCat : c))
        );
        setEditingCategory(null); // Close modal
        setMessage("Category updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10">Loading Categories...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Categories</h1>
        {message && (
          <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded">
            {message}
          </span>
        )}
      </div>

      {/* --- ADD NEW CATEGORY FORM --- */}
      <form
        onSubmit={handleAddCategory}
        className="mb-8 flex gap-4 items-end bg-gray-50 p-4 rounded-lg"
      >
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            New Category Name
          </label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g. Science Fiction"
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition h-[50px]"
        >
          Add
        </button>
      </form>

      {/* --- CATEGORIES TABLE --- */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900">
                  {category.id}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold text-gray-800">
                  {category.name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="px-5 py-5 text-center text-gray-500">
                  No categories found. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- EDIT MODAL --- */}
      {editingCategory && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Edit Category
            </h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
