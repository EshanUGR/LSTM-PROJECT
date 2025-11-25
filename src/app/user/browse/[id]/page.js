"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function MakeReservationPage() {
  // Unwrap params
  const params = useParams();
  const id = params.id;

  const { user } = useAuth();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  // Helper to fix image URLs
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== "string") return "/placeholder.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:8081/uploads/${imageUrl}`;
  };

  // Fetch Details
  useEffect(() => {
    if (user?.token && id) {
      fetch(`http://localhost:8081/api/books/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Book not found");
          return res.json();
        })
        .then((data) => {
          setBook(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, user]);

  const handleReserve = async () => {
    if (!confirm(`Confirm reservation for ${days} days?`)) return;

    try {
      const res = await fetch("http://localhost:8081/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          bookId: parseInt(id),
          days: parseInt(days),
        }),
      });

      if (res.ok) {
        alert("Success! Book Reserved.");
        router.push("/user/history"); // Redirect to history
      } else {
        const msg = await res.text();
        alert("Failed: " + msg);
      }
    } catch (err) {
      console.error(err);
      alert("Network Error");
    }
  };

  if (loading) return <div className="p-10">Loading Book Details...</div>;
  if (!book) return <div className="p-10">Book not found.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="md:flex">
        {/* Image Side */}
        <div className="md:w-1/3 bg-gray-200 relative h-64 md:h-auto">
          {/* <Image
            src={getImageUrl(book.imageUrl)}
            alt={book.title}
            fill
            className="object-cover"
          /> */}
        </div>

        {/* Details Side */}
        <div className="p-8 md:w-2/3 flex flex-col">
          <div className="mb-6">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-bold">
              {book.category?.name || "Category"}
            </div>
            <h1 className="block mt-1 text-2xl leading-tight font-bold text-black">
              {book.title}
            </h1>
            <p className="mt-2 text-gray-500">{book.author}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-8 border-t border-b py-4">
            <div>
              <span className="font-bold block">Language:</span>{" "}
              {book.language || "English"}
            </div>
            <div>
              <span className="font-bold block">Genre:</span>{" "}
              {book.genre || "Fiction"}
            </div>
            <div>
              <span className="font-bold block">ISBN:</span> {book.isbn}
            </div>
            <div>
              <span className="font-bold block">Status:</span>
              <span className="text-green-600 font-bold ml-1">
                {book.status}
              </span>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="mt-auto bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Make Reservation
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Duration:
              </label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="21">21 Days</option>
              </select>
            </div>

            <button
              onClick={handleReserve}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition shadow-md"
            >
              Confirm Reservation
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              By clicking confirm, you agree to return the book by the due date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
