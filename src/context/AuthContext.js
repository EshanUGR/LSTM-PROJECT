"use client"; // Context must be client-side

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Correct named import

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores: { email, role, token }
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 3. Check for existing token on Page Load (Persistence)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({
            token: storedToken,
            email: decoded.sub, // 'sub' is standard for username/email in JWT
            role: decoded.role || "USER", // Adjust based on your JWT payload structure
          });
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  // 4. Login Function
  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);

    setUser({
      token: token,
      email: decoded.sub,
      role: decoded.role || decoded.authorities, // Depends on how Spring Security names it
    });

    router.push("/"); // Redirect to home after login
  };

  // 5. Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  // 6. Expose the data
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 7. Custom Hook for easy usage
export const useAuth = () => useContext(AuthContext);
