"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../lib/api"; // <--- 1. Import the service
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  // State for form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "USER", // Default role
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // --- OLD CODE (DELETED) ---
      // const res = await fetch("http://localhost:8081/api/auth/signup", ...);

      // --- NEW CODE (CLEANER) ---
      // 2. Call the service.
      // It automatically handles the URL, Headers, and JSON conversion.
      await authService.signup(formData);

      // If code reaches here, it means success (API Service throws error if failed)
      setSuccess("Account created successfully! Redirecting to login...");

      // Wait 2 seconds then go to login page
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      // 3. Catch errors thrown by api.js
      // err.message contains the text sent from Spring Boot (e.g., "Email already exists")
      console.error(err);
      setError("Signup Failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (The rest of your JSX remains EXACTLY the same) ...
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-green-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-green-100 mt-2">Join Akila Library today</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
              <p className="font-bold">Success!</p>
              <p>{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-900 bg-white"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-900 bg-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a...
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 bg-white"
              >
                <option value="USER">Member (User)</option>
                <option value="LIBRARIAN">Librarian (Admin)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                ${
                  isLoading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } 
                transition-colors duration-200`}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-green-600 hover:text-green-500 hover:underline"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
