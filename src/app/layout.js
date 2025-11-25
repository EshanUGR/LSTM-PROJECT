import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext"; // Import the provider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Library Management System",
  description: "Built with Next.js and Spring Boot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap all children with AuthProvider */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
