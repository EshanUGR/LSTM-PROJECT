"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function MyHistoryPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      fetch("http://localhost:8081/api/reservations/history", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setReservations(data);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (loading) return <div>Loading History...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Reservation History
      </h1>

      {reservations.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow text-center text-gray-500">
          <p>You haven't borrowed any books yet.</p>
          <a
            href="/books"
            className="text-teal-600 font-bold hover:underline mt-2 inline-block"
          >
            Browse Library
          </a>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Book Title
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Borrowed Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold text-gray-800">
                    {res.book.title}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(res.reservationDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(res.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`px-2 py-1 font-semibold rounded-full text-xs ${
                        res.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
