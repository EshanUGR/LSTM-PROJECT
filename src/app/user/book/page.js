"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function BookCatalog() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  // --- FETCH BOOKS ---
  useEffect(() => {
    // Note: Allow public access if your backend permits, otherwise require token
    const headers = user?.token
      ? { Authorization: `Bearer ${user.token}` }
      : {};

    fetch("http://localhost:8081/api/books", { headers })
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching books:", err));
  }, [user]);

  // --- FILTER LOGIC ---
  const displayedBooks = showAvailableOnly
    ? books.filter((b) => b.status === "AVAILABLE")
    : books;

  if (loading)
    return <div className="p-10 text-center">Loading Library...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Library Catalog</h1>

        {/* Availability Toggle */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={() => setShowAvailableOnly(!showAvailableOnly)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700 font-medium">Show Available Only</span>
        </label>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
          >
            {/* Cover Image */}
            <div className="relative h-64 w-full bg-gray-200">
              <Image
                src={
                  book.imageUrl
                    ? `http://localhost:8081/uploads/${book.imageUrl}`
                    : "/placeholder.png"
                }
                alt={book.title}
                fill
                className="object-cover"
              />
              {/* Status Badge Overlay */}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    book.status === "AVAILABLE"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {book.status}
                </span>
              </div>
            </div>

            {/* Book Info */}
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">{book.author}</p>

              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                  {book.category?.name || "General"}
                </span>

                <Link
                  href={`/books/${book.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedBooks.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No books found matching your criteria.
        </div>
      )}
    </div>
  );
}
