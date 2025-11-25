"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext"; // Ensure this path is correct
import { useRouter } from "next/navigation";

export default function AllBooksPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State management
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservingId, setReservingId] = useState(null);

  // --- 1. Fetch Books Function ---
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching books from backend...");
      const response = await fetch("http://localhost:8081/api/books");

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw Data received:", data); // Debugging log

      // Ensure data is an array before filtering
      const booksArray = Array.isArray(data) ? data : [];

      // --- ROBUST FILTERING ---
      // This checks for "AVAILABLE", "Available", or "available" safely
      const availableBooks = booksArray.filter(
        (book) => book.status && book.status.toUpperCase() === "AVAILABLE"
      );

      console.log("Filtered Available Books:", availableBooks); // Debugging log
      setBooks(availableBooks);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load books. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Run fetch on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // --- 2. Handle Reservation Action ---
  const handleReserve = async (bookId) => {
    if (!user) {
      alert("Please log in to reserve a book.");
      return;
    }

    const confirmReservation = window.confirm(
      "Are you sure you want to reserve this book?"
    );
    if (!confirmReservation) return;

    setReservingId(bookId); // Start loading state for specific button

    try {
      // Sending request to backend
      const response = await fetch("http://localhost:8081/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: bookId,
          userId: user.id || user.email, // Adjust based on your Auth User object
          reservationDate: new Date().toISOString().split("T")[0],
        }),
      });

      if (response.ok) {
        alert("✅ Book reserved successfully!");
        // Refresh the list to remove the reserved book
        fetchBooks();
      } else {
        const errText = await response.text();
        alert(
          "❌ Failed to reserve: " + (errText || "Book may be unavailable.")
        );
      }
    } catch (error) {
      console.error("Reservation error:", error);
      alert("Error connecting to server.");
    } finally {
      setReservingId(null); // Stop loading state
    }
  };

  // --- 3. Loading & Error States ---
  if (loading && books.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-xl font-bold text-gray-500 animate-pulse">
          Loading Library...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg m-4">
        <h3 className="text-red-600 font-bold text-lg">⚠️ Connection Error</h3>
        <p className="text-gray-700 mt-2">{error}</p>
        <button
          onClick={fetchBooks}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // --- 4. Main Render ---
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Available Books</h1>
        <p className="text-gray-500 mt-1">
          Select a book below to reserve it immediately.
        </p>
      </div>

      {/* Empty State */}
      {books.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-lg font-medium">
            No books are currently available for reservation.
          </p>
          <p className="text-gray-400 text-sm mt-2">Check back later!</p>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden"
            >
              {/* Image Area */}
              <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl">📖</span>
                    <p className="text-xs text-gray-400 mt-2">No Cover</p>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                  AVAILABLE
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                  {book.title}
                </h3>
                <p className="text-sm text-blue-600 font-medium mb-3">
                  {book.author}
                </p>

                <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-3">
                  {book.description || "No description provided for this book."}
                </p>

                {/* Reserve Button */}
                <button
                  onClick={() => handleReserve(book.id)}
                  disabled={reservingId === book.id}
                  className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all shadow-sm flex justify-center items-center
                    ${
                      reservingId === book.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 hover:shadow-md active:scale-95"
                    }`}
                >
                  {reservingId === book.id ? (
                    <span>Processing...</span>
                  ) : (
                    <span>Reserve Now</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
