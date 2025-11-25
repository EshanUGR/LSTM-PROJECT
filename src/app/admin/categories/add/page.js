"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // To redirect after success
import { useAuth } from "../../../../context/AuthContext"; // Adjust path if needed

const AddCategoryPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    if (!name.trim()) {
      setMessage({ type: "error", text: "Category name cannot be empty." });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Security: Librarian Token
        },
        body: JSON.stringify({ name: name }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Category added successfully!" });

        // Wait 1.5 seconds, then go back to the Category List or Dashboard
        setTimeout(() => {
          router.push("/admin/categories");
        }, 1500);
      } else {
        setMessage({ type: "error", text: "Failed to add category." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Category
        </h1>

        {/* Status Message */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Graphic Novels"
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-bold transition duration-200 ${
                isLoading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isLoading ? "Saving..." : "Create Category"}
            </button>

            <button
              type="button"
              onClick={() => router.back()} // Go back without saving
              className="w-full py-3 px-4 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
