"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";

export default function AddBookPage() {
  const { user } = useAuth();
  const router = useRouter();

  // 1. State for Form Data
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    language: "",
    isbn: "",
    categoryId: "",
  });

  // 2. State for File and UI
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 3. Fetch Categories on Load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/categories", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    if (user?.token) fetchCategories();
  }, [user]);

  // 4. Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 6. MAIN SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      let uploadedFileName = "";

      // Step A: Upload Image (if selected)
      if (file) {
        const imageFormData = new FormData();
        imageFormData.append("file", file);

        const uploadRes = await fetch(
          "http://localhost:8081/api/books/upload-cover",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${user.token}` },
            body: imageFormData,
          }
        );

        if (!uploadRes.ok) throw new Error("Image upload failed");
        uploadedFileName = await uploadRes.text();
      }

      // Step B: Prepare Book JSON Payload
      const bookPayload = {
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        language: formData.language,
        isbn: formData.isbn,
        imageUrl: uploadedFileName, // Matches backend field 'imageUrl'
        category: {
          id: parseInt(formData.categoryId), // Nested object for relation
        },
      };

      // Step C: Send Book Data
      const res = await fetch("http://localhost:8081/api/books/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(bookPayload),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Book added successfully!" });
        setTimeout(() => router.push("/admin/books"), 2000); // Redirect to manage page
      } else {
        setMessage({ type: "error", text: "Failed to save book details." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "An error occurred. Check console." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Book</h1>

        {message.text && (
          <div
            className={`p-4 mb-4 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                onChange={handleChange}
                // FIXED: Added text-gray-900 bg-white
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                name="author"
                required
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Genre & Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <input
                type="text"
                name="genre"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <input
                type="text"
                name="language"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* ISBN & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                required
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="">Select a Category</option>
                {/* Dynamically list categories */}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepts JPG, PNG (Max 2MB)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-bold transition duration-200 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Uploading & Saving..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
