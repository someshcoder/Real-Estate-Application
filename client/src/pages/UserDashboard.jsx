import { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import properties from "../components/seller/properties.json";
import {
  LayoutDashboard,
  Bookmark,
  Heart,
  MessageSquare,
  MapPin,
  Trash2,
  Search,
  LogOut,
  Home,
  Sparkles,
  Eye,
  CheckCircle2,
  ShieldAlert,
  Clock,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";

// ---------- Animation Variants ----------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 15 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.25 } },
};

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [savedProperties, setSavedProperties] = useState([]);
  const [likedProperties, setLikedProperties] = useState([]);
  const [responses, setResponses] = useState([]);
  const [activeSection, setActiveSection] = useState("overview"); // overview | saved | liked | messages
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  const isDark = theme === "dark";

  // ---------- Theme-aware class helpers (matches Header.jsx design system) ----------
  const cardClass = isDark
    ? "bg-gray-900 border border-gray-800"
    : "bg-white border border-gray-200 shadow-sm";
  const headingClass = isDark ? "text-white" : "text-gray-900";
  const subTextClass = isDark ? "text-gray-400" : "text-gray-500";
  const searchInputClass = `w-full py-2.5 pl-11 pr-4 rounded-full text-sm font-medium outline-none border-2 transition-all duration-300 ${
    isDark
      ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
      : "bg-gray-100 border-transparent text-gray-800 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
  }`;

  // ---------- Toast helper ----------
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3200);
  };

  // ---------- Load data ----------
  useEffect(() => {
    if (user && user.role === "user") {
      // Load saved and liked properties
      const storedSaved = JSON.parse(localStorage.getItem("favorites")) || [];
      const filteredSaved = properties.filter(
        (property) => property?.id && storedSaved.includes(property.id.toString())
      );
      setSavedProperties(filteredSaved);

      const storedLiked = JSON.parse(localStorage.getItem("likedProperties")) || [];
      const filteredLiked = properties.filter(
        (property) => property?.id && storedLiked.includes(property.id.toString())
      );
      setLikedProperties(filteredLiked);

      // Load seller responses
      const allMessages = JSON.parse(localStorage.getItem("propertyMessages")) || {};
      const userResponses = [];
      Object.values(allMessages).forEach((messagesArray) => {
        messagesArray.forEach((msg) => {
          if (msg.userEmail === user.email && msg.isResponse) {
            userResponses.push(msg);
          }
        });
      });
      setResponses(userResponses);
    }
  }, [user]);

  const removeSavedProperty = (id) => {
    const updatedSaved = savedProperties.filter((property) => property?.id !== id);
    setSavedProperties(updatedSaved);

    const storedSaved = JSON.parse(localStorage.getItem("favorites")) || [];
    const newSaved = storedSaved.filter((propId) => propId !== id?.toString());
    localStorage.setItem("favorites", JSON.stringify(newSaved));
    showToast("success", "Property removed from saved list");
  };

  // ---------- Filtered lists (search sirf saved/liked pe) ----------
  const filterBySearch = (list) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (p) =>
        p?.title?.toLowerCase().includes(q) ||
        p?.location?.toLowerCase().includes(q)
    );
  };

  const filteredSaved = useMemo(
    () => filterBySearch(savedProperties),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [savedProperties, searchQuery]
  );
  const filteredLiked = useMemo(
    () => filterBySearch(likedProperties),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [likedProperties, searchQuery]
  );

  // ---------- Nav items ----------
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "saved", label: "Saved", icon: Bookmark, count: savedProperties.length },
    { id: "liked", label: "Liked", icon: Heart, count: likedProperties.length },
    { id: "messages", label: "Messages", icon: MessageSquare, count: responses.length },
  ];

  const statCards = [
    { label: "Saved Properties", value: savedProperties.length, icon: Bookmark, gradient: "from-blue-600 to-cyan-500", glow: "shadow-blue-500/30", tab: "saved" },
    { label: "Liked Properties", value: likedProperties.length, icon: Heart, gradient: "from-rose-500 to-pink-500", glow: "shadow-rose-500/30", tab: "liked" },
    { label: "Seller Responses", value: responses.length, icon: MessageSquare, gradient: "from-blue-600 to-fuchsia-500", glow: "shadow-fuchsia-500/30", tab: "messages" },
  ];

  // ---------- Reusable property card ----------
  const renderPropertyCard = (property, { removable = false, liked = false } = {}) => (
    <motion.div
      key={property?.id}
      variants={cardVariants}
      layout
      exit="exit"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`group rounded-2xl overflow-hidden transition-all ${cardClass} ${
        isDark
          ? "hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10"
          : "hover:border-blue-300 hover:shadow-xl"
      }`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <motion.img
          src={property?.image}
          alt={property?.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
        {liked && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500/90 backdrop-blur-md flex items-center justify-center text-white"
          >
            <Heart size={14} fill="currentColor" />
          </motion.span>
        )}
        <div className="absolute bottom-3 left-3">
          <p className="text-xl font-extrabold text-white drop-shadow-lg">
            ₹{String(property?.price || "").replace("$", "")}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h4 className={`font-bold text-base mb-1 truncate transition-colors group-hover:text-blue-500 ${headingClass}`}>
          {property?.title}
        </h4>
        <p className={`text-xs flex items-center gap-1 mb-4 truncate ${subTextClass}`}>
          <MapPin size={12} className="shrink-0" />
          {property?.location}
        </p>

        {/* Features */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {[
            { icon: BedDouble, text: `${property?.beds ?? "—"} Beds` },
            { icon: Bath, text: `${property?.baths ?? "—"} Baths` },
            { icon: Ruler, text: `${property?.size ?? "—"} sqft` },
          ].map(({ icon: FIcon, text }) => (
            <span
              key={text}
              className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border ${
                isDark
                  ? "text-gray-300 bg-gray-800 border-gray-700"
                  : "text-gray-600 bg-gray-50 border-gray-200"
              }`}
            >
              <FIcon size={13} className="text-blue-500" />
              {text}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/property/${property?.id}`} className="flex-1">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-colors ${
                isDark
                  ? "bg-blue-500/10 hover:bg-blue-500/25 text-blue-400 border-blue-500/25"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
              }`}
            >
              <Eye size={13} />
              View Details
            </motion.div>
          </Link>
          {removable && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => removeSavedProperty(property?.id)}
              className={`flex items-center justify-center px-3.5 py-2.5 rounded-xl border transition-colors ${
                isDark
                  ? "bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border-rose-500/25"
                  : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200"
              }`}
              title="Remove from saved"
            >
              <Trash2 size={13} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );

  // ---------- Reusable section header with search ----------
  const renderSectionHeader = (title, gradientWord, subtitle) => (
    <motion.div
      variants={itemVariants}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h2 className={`text-3xl font-extrabold tracking-tight ${headingClass}`}>
          {title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
            {gradientWord}
          </span>
        </h2>
        <p className={`mt-1 text-sm ${subTextClass}`}>{subtitle}</p>
      </div>
      <div className="relative sm:w-72 group">
        <Search
          size={16}
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
            isDark
              ? "text-gray-400 group-focus-within:text-blue-400"
              : "text-gray-500 group-focus-within:text-blue-600"
          }`}
        />
        <input
          type="text"
          placeholder="Search by title or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={searchInputClass}
        />
      </div>
    </motion.div>
  );

  // ---------- Reusable empty state ----------
  const renderEmptyState = (Icon, title, subtitle, showBrowse = true) => (
    <motion.div
      variants={itemVariants}
      className={`text-center py-20 rounded-2xl border border-dashed ${
        isDark ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <Icon size={44} className={`mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
      <p className={`font-bold ${headingClass}`}>{title}</p>
      <p className={`text-sm mt-1 mb-6 ${subTextClass}`}>{subtitle}</p>
      {showBrowse && (
        <Link to="/properties">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
          >
            <Search size={16} />
            Browse Properties
          </motion.span>
        </Link>
      )}
    </motion.div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ---------- Ambient background glow ---------- */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] ${
            isDark ? "bg-blue-600/15" : "bg-blue-400/15"
          }`}
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] ${
            isDark ? "bg-cyan-600/10" : "bg-cyan-400/15"
          }`}
          animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ---------- Sidebar (fixed — scroll par apni jagah rahega) ---------- */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        className={`hidden md:flex flex-col w-64 fixed top-0 left-0 h-screen z-30 p-5 border-r transition-colors duration-300 ${
          isDark
            ? "bg-gray-900/90 backdrop-blur-xl border-gray-800"
            : "bg-white/90 backdrop-blur-xl border-gray-200"
        }`}
      >
        {/* Logo — matches Header branding */}
        <Link to="/" className="flex items-center gap-2 mb-8 px-1">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <span className="text-white font-extrabold text-xl">R</span>
          </motion.div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                Real
              </span>
              <span className={headingClass}>Estate</span>
            </h1>
            <p className={`text-[10px] font-bold tracking-widest ${subTextClass}`}>
              MY DASHBOARD
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? "text-white"
                    : isDark
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="userActiveNav"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                <Icon size={18} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
                {item.count > 0 && (
                  <span
                    className={`relative z-10 ml-auto text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isDark
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </motion.button>
            );
          })}

          {/* Back to Home link */}
          <Link to="/">
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Home size={18} />
              Back to Home
            </motion.div>
          </Link>
        </nav>

        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold mb-3 transition-colors ${
            isDark
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {isDark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </motion.button>

        {/* User card */}
        <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white uppercase shrink-0">
              {(user?.username || user?.name || "U").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold truncate ${headingClass}`}>
                {user?.username || user?.name || "User"}
              </p>
              <p className={`text-[11px] truncate ${subTextClass}`}>
                {user?.email || "Buyer"}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.15, color: "#f87171" }}
              whileTap={{ scale: 0.9 }}
              onClick={logout}
              title="Logout"
              className={isDark ? "text-gray-400" : "text-gray-500"}
            >
              <LogOut size={17} />
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* ---------- Main Content ---------- */}
      <main className="relative z-10 md:ml-64 p-4 sm:p-6 lg:p-10">
        {/* Mobile tab bar */}
        <div
          className={`md:hidden flex gap-1.5 mb-6 rounded-2xl p-1.5 border ${
            isDark
              ? "bg-gray-900/90 backdrop-blur-xl border-gray-800"
              : "bg-white/90 backdrop-blur-xl border-gray-200 shadow-sm"
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                    : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ================= OVERVIEW SECTION ================= */}
          {activeSection === "overview" && (
            <motion.div
              key="overview"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            >
              {/* Welcome header */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-2 text-blue-500 text-sm font-bold mb-1">
                  <Sparkles size={15} />
                  Welcome back
                </div>
                <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${headingClass}`}>
                  Hello,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                    {user?.name || user?.username || "User"}!
                  </span>
                </h2>
                <p className={`mt-2 text-sm ${subTextClass}`}>
                  Your saved homes, liked properties and seller conversations — all in one place.
                </p>
              </motion.div>

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {statCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <motion.button
                      key={card.label}
                      variants={itemVariants}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 250, damping: 18 }}
                      onClick={() => setActiveSection(card.tab)}
                      className={`relative rounded-2xl p-5 overflow-hidden group text-left ${cardClass}`}
                    >
                      <div
                        className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-15 blur-2xl group-hover:opacity-30 transition-opacity`}
                      />
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg ${card.glow}`}
                      >
                        <Icon size={20} className="text-white" />
                      </div>
                      <p className={`text-2xl font-extrabold ${headingClass}`}>{card.value}</p>
                      <p className={`text-xs font-medium mt-1 ${subTextClass}`}>{card.label}</p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explore CTA + Recent saved */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <motion.div
                  variants={itemVariants}
                  className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 flex flex-col justify-between shadow-xl shadow-blue-500/25 relative overflow-hidden text-white"
                >
                  <motion.div
                    className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div>
                    <h3 className="text-xl font-extrabold mb-2">Find your dream home</h3>
                    <p className="text-blue-50/90 text-sm mb-6">
                      Explore thousands of verified listings and save the ones you love.
                    </p>
                  </div>
                  <Link to="/properties" className="relative z-10">
                    <motion.span
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="bg-white text-blue-600 font-bold px-5 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Search size={18} />
                      Browse Properties
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className={`lg:col-span-2 rounded-2xl p-6 ${cardClass}`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-bold text-lg ${headingClass}`}>Recently Saved</h3>
                    <button
                      onClick={() => setActiveSection("saved")}
                      className="text-xs text-blue-500 hover:text-blue-400 font-bold transition-colors"
                    >
                      View all →
                    </button>
                  </div>
                  {savedProperties.length === 0 ? (
                    <p className={`text-sm text-center py-8 ${subTextClass}`}>
                      No saved properties yet. Start exploring! 🏡
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {savedProperties.slice(0, 4).map((p, i) => (
                        <motion.div
                          key={p?.id || i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.08 }}
                          whileHover={{ x: 4 }}
                          className={`flex items-center gap-4 p-2.5 rounded-xl transition-colors ${
                            isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                          }`}
                        >
                          <img
                            src={p?.image}
                            alt={p?.title}
                            className={`w-12 h-12 rounded-lg object-cover border shrink-0 ${
                              isDark ? "border-gray-700" : "border-gray-200"
                            }`}
                            onError={(e) => { e.target.style.visibility = "hidden"; }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${headingClass}`}>{p?.title}</p>
                            <p className={`text-xs flex items-center gap-1 truncate ${subTextClass}`}>
                              <MapPin size={11} /> {p?.location}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-blue-500 shrink-0">
                            ₹{String(p?.price || "").replace("$", "")}
                          </span>
                          <Link to={`/property/${p?.id}`}>
                            <motion.span
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-blue-500 flex"
                              title="View"
                            >
                              <Eye size={16} />
                            </motion.span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ================= SAVED SECTION ================= */}
          {activeSection === "saved" && (
            <motion.div
              key="saved"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            >
              {renderSectionHeader(
                "Saved",
                "Properties",
                `${savedProperties.length} propert${savedProperties.length === 1 ? "y" : "ies"} bookmarked for later`
              )}

              {filteredSaved.length === 0 ? (
                renderEmptyState(
                  Bookmark,
                  searchQuery ? "No saved properties match your search" : "You have no saved properties",
                  searchQuery ? "Try a different keyword" : "Bookmark properties to compare them later",
                  !searchQuery
                )
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredSaved.map((property) =>
                      renderPropertyCard(property, { removable: true })
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================= LIKED SECTION ================= */}
          {activeSection === "liked" && (
            <motion.div
              key="liked"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            >
              {renderSectionHeader(
                "Liked",
                "Properties",
                `${likedProperties.length} propert${likedProperties.length === 1 ? "y" : "ies"} you loved`
              )}

              {filteredLiked.length === 0 ? (
                renderEmptyState(
                  Heart,
                  searchQuery ? "No liked properties match your search" : "You have no liked properties",
                  searchQuery ? "Try a different keyword" : "Tap the heart on properties you love",
                  !searchQuery
                )
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredLiked.map((property) =>
                      renderPropertyCard(property, { liked: true })
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================= MESSAGES SECTION ================= */}
          {activeSection === "messages" && (
            <motion.div
              key="messages"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            >
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className={`text-3xl font-extrabold tracking-tight ${headingClass}`}>
                  Seller{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                    Responses
                  </span>
                </h2>
                <p className={`mt-1 text-sm ${subTextClass}`}>
                  {responses.length} response{responses.length !== 1 ? "s" : ""} from sellers
                </p>
              </motion.div>

              {responses.length === 0 ? (
                renderEmptyState(
                  MessageSquare,
                  "No responses from sellers yet",
                  "When a seller replies to your enquiry, it will appear here",
                  false
                )
              ) : (
                <motion.div variants={containerVariants} className="space-y-3 max-w-3xl">
                  {responses.map((response, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -3 }}
                      className={`p-5 rounded-2xl transition-all ${cardClass} ${
                        isDark ? "hover:border-blue-500/40" : "hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0">
                          <MessageSquare size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-relaxed ${headingClass}`}>
                            {response.text}
                          </p>
                          <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <span className={`text-xs flex items-center gap-1.5 ${subTextClass}`}>
                              <Clock size={12} />
                              {new Date(response.timestamp).toLocaleString()}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-500">
                              Seller Response
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ---------- Toast Notification ---------- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-bold ${
              toast.type === "success"
                ? isDark
                  ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
                  : "bg-white border-emerald-300 text-emerald-600"
                : isDark
                ? "bg-rose-950/90 border-rose-500/30 text-rose-300"
                : "bg-white border-rose-300 text-rose-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={17} className="shrink-0" />
            ) : (
              <ShieldAlert size={17} className="shrink-0" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
