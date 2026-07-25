import { createContext, useState, useEffect, useRef } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authToast, setAuthToast] = useState(null); // { type: 'login' | 'logout', message }
  const toastTimerRef = useRef(null);

  // Show a global auth notification (auto-hides after 2 seconds)
  const showAuthToast = (type, message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setAuthToast({ type, message });
    toastTimerRef.current = setTimeout(() => setAuthToast(null), 2000);
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }

        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear localStorage in case of corruption
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    showAuthToast("login", "Login Successful");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("favorites");
    setUser(null);
    setFavorites([]); // Clear favorites on logout
    showAuthToast("logout", "Logout Successful");
  };

  const addToFavorites = (property) => {
    const updatedFavorites = [...favorites, property];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, favorites, addToFavorites, loading, authToast }}>
      {children}
    </AuthContext.Provider>
  );
};
