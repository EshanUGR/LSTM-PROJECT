"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function UserBrowsePage() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to fix image URLs
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== "string") return "/placeholder.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:8081/uploads/${imageUrl}`;
  };

  useEffect(() => {
    if (user?.token) {
      fetch("http://localhost:8081/api/books", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          // Show ONLY Available books
          const available = Array.isArray(data)
            ? data.filter((b) => b.status === "AVAILABLE")
            : [];
          setBooks(available);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-lg font-semibold text-gray-500">
          Loading Catalog...
        </p>
      </div>
    );

  return (
    <div>
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Explore Books</h1>
        <p className="text-gray-600 mt-1">
          Select an available book to make a reservation instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="group overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl border border-gray-100 flex flex-col"
          >
            <div className="relative h-56 w-full bg-gray-200">
              {/* <Image
                src={getImageUrl(book.imageUrl)}
                alt={book.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              /> */}
              <div className="absolute top-2 right-2">
                <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white shadow-sm">
                  AVAILABLE
                </span>
              </div>
            </div>

            <div className="flex flex-grow flex-col p-5">
              <div className="mb-4">
                <span className="mb-2 inline-block rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                  {book.category?.name || "General"}
                </span>
                <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
                  {book.title}
                </h3>
                <p className="line-clamp-1 text-sm text-gray-500">
                  by {book.author}
                </p>
              </div>

              <div className="mt-auto">
                {/* LINK TO THE INTERNAL RESERVATION PAGE */}
                <Link
                  href={`/user/browse/${book.id}`}
                  className="block w-full rounded-lg bg-blue-600 py-2 text-center text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Select Book &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
