import { FaSearch, FaBell, FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle scroll to add background blur/shadow when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const getDashboardRoute = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "seller") return "/sellerDashboard";
    return "/dashboard";
  };

  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);
  const isDark = theme === "dark";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  /* ────────── Animation Variants ────────── */
  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 120 } },
    hover: { scale: 1.05, transition: { duration: 0.3, type: "spring", stiffness: 300 } },
    tap: { scale: 0.95 },
  };

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: "easeInOut" } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } },
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? isDark 
            ? "bg-gray-900/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-gray-800" 
            : "bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200"
          : isDark 
            ? "bg-gray-900 border-b border-gray-800/50" 
            : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 lg:px-8 h-20">
        
        {/* ── Logo ── */}
        <Link to="/">
          <motion.div
            className="flex items-center gap-2"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-extrabold text-xl">R</span>
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight hidden sm:block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Real</span>
              <span className={isDark ? "text-white" : "text-gray-800"}>Estate</span>
            </h1>
          </motion.div>
        </Link>

        {/* ── Search Bar (Desktop) ── */}
        <motion.form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-8 relative group"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className={`w-4 h-4 ${isDark ? "text-gray-400 group-focus-within:text-blue-400" : "text-gray-500 group-focus-within:text-blue-600"} transition-colors`} />
            </div>
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search properties, locations..."
              className={`w-full py-2.5 pl-11 pr-4 rounded-full text-sm font-medium transition-all duration-300 outline-none border-2 ${
                isDark 
                  ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" 
                  : "bg-gray-100 border-transparent text-gray-800 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              }`}
            />
          </div>
        </motion.form>

        {/* ── Desktop Navigation & Actions ── */}
        <div className="hidden md:flex items-center gap-6">
          
          {/* Nav Links */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.name} to={link.path} className="relative group py-2">
                  <span className={`text-sm font-bold transition-colors ${
                    isActive 
                      ? "text-blue-500" 
                      : isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div layoutId="underline" className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className={`w-px h-6 ${isDark ? "bg-gray-700" : "bg-gray-300"}`}></div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isDark ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
            </motion.button>

            {/* Notification Bell (Seller Only) */}
            {user && user.role === "seller" && (
              <motion.button
                onClick={() => navigate("/notifications")}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBell size={18} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
              </motion.button>
            )}

            {/* User Profile / Login */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={toggleProfileDropdown}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all ${
                    isDark 
                      ? "border-gray-700 hover:border-gray-500 bg-gray-800" 
                      : "border-gray-200 hover:border-gray-300 bg-white shadow-sm"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    {user.username || "Profile"}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border overflow-hidden z-50 ${
                        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
                      }`}
                    >
                      <div className={`p-4 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                        <p className={`text-sm font-bold truncate ${isDark ? "text-white" : "text-gray-900"}`}>{user.username}</p>
                        <p className={`text-xs mt-0.5 truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
                        <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                          {user.role}
                        </span>
                      </div>
                      <div className="p-2">
                        <Link
                          to={getDashboardRoute()}
                          onClick={() => setProfileDropdownOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            isDark ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          <FaCog className={isDark ? "text-gray-400" : "text-gray-400"} />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <FaSignOutAlt />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm px-6 py-2.5 rounded-full hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all"
                >
                  Sign In
                </motion.button>
              </Link>
            )}
          </div>
        </div>

        {/* ── Mobile Menu Toggle ── */}
        <div className="md:hidden flex items-center gap-3">
          <motion.button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isDark ? "bg-gray-800 text-yellow-400" : "bg-gray-100 text-gray-600"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {isDark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
          </motion.button>
          
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Navigation Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`md:hidden overflow-hidden ${
              isDark ? "bg-gray-900 border-b border-gray-800" : "bg-white border-b border-gray-200 shadow-xl"
            }`}
          >
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className={isDark ? "text-gray-400" : "text-gray-500"} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search properties..."
                  className={`w-full py-3 pl-11 pr-4 rounded-xl text-sm font-medium outline-none ${
                    isDark 
                      ? "bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500" 
                      : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
              </form>

              {/* Mobile Links */}
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-bold transition-colors ${
                      location.pathname === link.path
                        ? isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600"
                        : isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className={`h-px w-full ${isDark ? "bg-gray-800" : "bg-gray-100"}`}></div>

              {/* Mobile Auth/Profile */}
              <div className="px-2">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <p className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{user.username}</p>
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={getDashboardRoute()}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors ${
                          isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <FaCog /> Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors ${
                          isDark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"
                        }`}
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <button className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30">
                      Sign In to Your Account
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;