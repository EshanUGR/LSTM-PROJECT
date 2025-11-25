"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Image from "next/image";

export default function ManageBooksPage() {
  const { user } = useAuth();

  // State for data
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]); // <--- 1. New State for Categories
  const [loading, setLoading] = useState(true);

  // State for UI
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState("");

  // --- FETCH DATA ---
  useEffect(() => {
    if (user?.token) {
      Promise.all([fetchBooks(), fetchCategories()]) // Fetch both at start
        .then(() => setLoading(false));
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/books", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) setBooks(await res.json());
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

  // <--- 2. New Function to Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/categories", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  // --- DELETE BOOK ---
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        setMessage("Book deleted successfully.");
        setBooks(books.filter((b) => b.id !== id));
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- UPDATE BOOK ---
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingBook.id,
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre,
        language: editingBook.language,
        isbn: editingBook.isbn,
        status: editingBook.status,
        imageUrl: editingBook.imageUrl || editingBook.image_url,
        category: {
          id: editingBook.category?.id || 1, // Sends the ID nested
        },
      };

      const res = await fetch(
        `http://localhost:8081/api/books/${editingBook.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const updatedBook = await res.json();
        // Update list
        setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
        setEditingBook(null);
        setMessage("Book updated successfully!");
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Input Changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    // Logic: If they pick a category from dropdown, update the nested ID
    if (name === "categoryId") {
      // Find the full category object so we can show the name immediately in the table if we wanted (optional)
      // For now, just updating the ID is enough for the payload
      setEditingBook({
        ...editingBook,
        category: { id: parseInt(value) },
      });
    } else {
      setEditingBook({ ...editingBook, [name]: value });
    }
  };

  if (loading) return <div className="p-10">Loading Inventory...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Inventory</h1>
        {message && (
          <span className="text-green-600 font-medium">{message}</span>
        )}
      </div>

      {/* --- TABLE VIEW --- */}
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Cover
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title / Author
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
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
            {books.map((book) => (
              <tr key={book.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="relative w-12 h-16">
                    <Image
                      src={
                        book.image_url
                          ? `http://localhost:8081/uploads/${book.image_url}`
                          : "/placeholder.png"
                      }
                      alt={book.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 font-bold">{book.title}</p>
                  <p className="text-gray-600">{book.author}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                    {book.category?.name || "Uncategorized"}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    className={`px-2 py-1 font-semibold leading-tight rounded-sm ${
                      book.status === "AVAILABLE"
                        ? "text-green-900 bg-green-200"
                        : "text-red-900 bg-red-200"
                    }`}
                  >
                    {book.status}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingBook(book)}
                      className="text-blue-600 hover:text-blue-900 font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-600 hover:text-red-900 font-bold ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- EDIT MODAL --- */}
      {editingBook && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Book</h2>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingBook.title}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={editingBook.author}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* --- 3. UPDATED CATEGORY DROPDOWN --- */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <select
                  name="categoryId"
                  // Value defaults to the current book's category ID
                  value={editingBook.category?.id || ""}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a Category
                  </option>
                  {/* Map over the fetched categories to show NAMES */}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={editingBook.status}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RESERVED">RESERVED</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
