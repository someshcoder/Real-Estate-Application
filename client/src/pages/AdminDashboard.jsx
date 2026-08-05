import { useEffect, useState, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  Star,
  Trash2,
  Ban,
  CheckCircle2,
  Search,
  LogOut,
  Home,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Mail,
  UserX,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";
import { API_URL } from "../config";

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

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 130, damping: 17 },
  },
  exit: { opacity: 0, x: 30, transition: { duration: 0.2 } },
};

const AdminDashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // overview | users | properties
  const [isLoading, setIsLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
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

  // ---------- Fetch data ----------
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchUsers(), fetchProperties()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch Properties
  const fetchProperties = async () => {
    try {
      const response = await fetch(`${API_URL}/properties`);
      const data = await response.json();
      setProperties(
        Array.isArray(data) ? data.filter((property) => !property.deleted) : []
      );
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  // Toggle Block User
  const toggleBlockUser = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/block/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status: currentStatus === "Blocked" ? "Active" : "Blocked",
        }),
      });
      if (!response.ok) throw new Error("Failed to update user status");

      setUsers(
        users.map((u) =>
          u._id === id
            ? { ...u, status: currentStatus === "Blocked" ? "Active" : "Blocked" }
            : u
        )
      );
      showToast(
        "success",
        currentStatus === "Blocked" ? "User unblocked successfully" : "User blocked successfully"
      );
    } catch (error) {
      console.error("Error toggling user block status:", error);
      showToast("error", "Failed to update user status");
    }
  };

  // Remove User
  const removeUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) return;
    try {
      await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      showToast("success", "User removed successfully");
    } catch (error) {
      console.error("Error removing user:", error);
      showToast("error", "Failed to remove user");
    }
  };

  // Soft Delete Property
  const deleteProperty = (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    setProperties(properties.filter((property) => (property._id || property.id) !== id));
    showToast("success", "Property deleted successfully");
  };

  // ---------- Stats ----------
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const blockedUsers = users.filter((u) => u.status === "Blocked").length;
    const activeUsers = totalUsers - blockedUsers;
    const totalProperties = properties.length;
    return { totalUsers, activeUsers, blockedUsers, totalProperties };
  }, [users, properties]);

  // ---------- Filtered lists ----------
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const filteredProperties = useMemo(() => {
    if (!propertySearch.trim()) return properties;
    const q = propertySearch.toLowerCase();
    return properties.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
    );
  }, [properties, propertySearch]);

  // ---------- Nav items ----------
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users, count: stats.totalUsers },
    { id: "properties", label: "Properties", icon: Building2, count: stats.totalProperties },
  ];

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, gradient: "from-blue-600 to-cyan-500", glow: "shadow-blue-500/30" },
    { label: "Active Users", value: stats.activeUsers, icon: ShieldCheck, gradient: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/30" },
    { label: "Blocked Users", value: stats.blockedUsers, icon: ShieldAlert, gradient: "from-rose-500 to-orange-500", glow: "shadow-rose-500/30" },
    { label: "Total Properties", value: stats.totalProperties, icon: Building2, gradient: "from-blue-600 to-fuchsia-500", glow: "shadow-fuchsia-500/30" },
  ];

  // ---------- Auth guards (hooks ke baad — React rules follow) ----------
  if (loading) {
    return (
      <div
        className={`flex flex-col gap-4 justify-center items-center min-h-screen ${
          isDark ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <motion.div
          className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <p className={`text-sm font-bold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Loading...
        </p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  // ---------- Reusable status badge ----------
  const renderStatusBadge = (blocked) => (
    <span
      className={`text-[10px] px-2.5 py-1 rounded-full font-bold shrink-0 ${
        blocked ? "bg-rose-500/15 text-rose-500" : "bg-emerald-500/15 text-emerald-500"
      }`}
    >
      {blocked ? "● Blocked" : "● Active"}
    </span>
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
            isDark ? "bg-fuchsia-600/10" : "bg-fuchsia-400/10"
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
              ADMIN PANEL
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
                    layoutId="adminActiveNav"
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

        {/* Admin card */}
        <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white uppercase shrink-0">
              {(user?.username || user?.name || "A").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold truncate ${headingClass}`}>
                {user?.username || user?.name || "Admin"}
              </p>
              <p className={`text-[11px] truncate ${subTextClass}`}>
                {user?.email || "Administrator"}
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
          className={`md:hidden flex gap-2 mb-6 rounded-2xl p-1.5 border ${
            isDark
              ? "bg-gray-900/90 backdrop-blur-xl border-gray-800"
              : "bg-white/90 backdrop-blur-xl border-gray-200 shadow-sm"
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                    : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === "overview" && (
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
                  Welcome back, Admin
                </div>
                <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${headingClass}`}>
                  Admin{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                    Control Center
                  </span>
                </h2>
                <p className={`mt-2 text-sm ${subTextClass}`}>
                  Manage users, monitor properties and keep the platform healthy.
                </p>
              </motion.div>

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.label}
                      variants={itemVariants}
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 250, damping: 18 }}
                      className={`relative rounded-2xl p-5 overflow-hidden group ${cardClass}`}
                    >
                      <div
                        className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-15 blur-2xl group-hover:opacity-30 transition-opacity`}
                      />
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg ${card.glow}`}
                      >
                        <Icon size={20} className="text-white" />
                      </div>
                      <p className={`text-2xl font-extrabold ${headingClass}`}>
                        {isLoading ? "—" : card.value}
                      </p>
                      <p className={`text-xs font-medium mt-1 ${subTextClass}`}>{card.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent users + recent properties */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Recent Users */}
                <motion.div variants={itemVariants} className={`rounded-2xl p-6 ${cardClass}`}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-bold text-lg ${headingClass}`}>Recent Users</h3>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="text-xs text-blue-500 hover:text-blue-400 font-bold transition-colors"
                    >
                      View all →
                    </button>
                  </div>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-12 rounded-xl animate-pulse ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                      ))}
                    </div>
                  ) : users.length === 0 ? (
                    <p className={`text-sm text-center py-8 ${subTextClass}`}>No users found.</p>
                  ) : (
                    <div className="space-y-2">
                      {users.slice(0, 5).map((u, i) => (
                        <motion.div
                          key={u._id || i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.07 }}
                          whileHover={{ x: 4 }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors cursor-default ${
                            isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm uppercase shrink-0">
                            {(u.name || "U").charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${headingClass}`}>{u.name}</p>
                            <p className={`text-xs truncate ${subTextClass}`}>{u.email}</p>
                          </div>
                          {renderStatusBadge(u.status === "Blocked")}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Recent Properties */}
                <motion.div variants={itemVariants} className={`rounded-2xl p-6 ${cardClass}`}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-bold text-lg ${headingClass}`}>Recent Properties</h3>
                    <button
                      onClick={() => setActiveTab("properties")}
                      className="text-xs text-blue-500 hover:text-blue-400 font-bold transition-colors"
                    >
                      View all →
                    </button>
                  </div>
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-12 rounded-xl animate-pulse ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                      ))}
                    </div>
                  ) : properties.length === 0 ? (
                    <p className={`text-sm text-center py-8 ${subTextClass}`}>No properties found.</p>
                  ) : (
                    <div className="space-y-2">
                      {properties.slice(0, 5).map((p, i) => (
                        <motion.div
                          key={p._id || p.id || i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.07 }}
                          whileHover={{ x: 4 }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors cursor-default ${
                            isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                          }`}
                        >
                          <img
                            src={p.image}
                            alt={p.title}
                            className={`w-10 h-10 rounded-lg object-cover border shrink-0 ${
                              isDark ? "border-gray-700" : "border-gray-200"
                            }`}
                            onError={(e) => { e.target.style.visibility = "hidden"; }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${headingClass}`}>{p.title}</p>
                            <p className={`text-xs flex items-center gap-1 truncate ${subTextClass}`}>
                              <MapPin size={11} /> {p.location}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-blue-500 shrink-0">
                            ₹{String(p.price || "").replace("$", "")}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ================= USERS TAB ================= */}
          {activeTab === "users" && (
            <motion.div
              key="users"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            >
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
              >
                <div>
                  <h2 className={`text-3xl font-extrabold tracking-tight ${headingClass}`}>
                    Manage{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                      Users
                    </span>
                  </h2>
                  <p className={`mt-1 text-sm ${subTextClass}`}>
                    {stats.totalUsers} user{stats.totalUsers !== 1 ? "s" : ""} · {stats.activeUsers} active · {stats.blockedUsers} blocked
                  </p>
                </div>
                {/* Search */}
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
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className={searchInputClass}
                  />
                </div>
              </motion.div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`h-20 rounded-2xl animate-pulse ${cardClass}`} />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className={`text-center py-20 rounded-2xl border border-dashed ${
                    isDark ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"
                  }`}
                >
                  <UserX size={44} className={`mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                  <p className={`font-bold ${headingClass}`}>
                    {userSearch ? "No users match your search" : "No users available"}
                  </p>
                  <p className={`text-sm mt-1 ${subTextClass}`}>
                    {userSearch ? "Try a different keyword" : "Registered users will appear here"}
                  </p>
                </motion.div>
              ) : (
                <motion.div variants={containerVariants} className="space-y-3">
                  <AnimatePresence>
                    {filteredUsers.map((u) => (
                      <motion.div
                        key={u._id}
                        variants={rowVariants}
                        layout
                        exit="exit"
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 rounded-2xl transition-all ${cardClass} ${
                          isDark ? "hover:border-blue-500/40" : "hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        {/* Avatar + info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-lg uppercase shrink-0">
                            {(u.name || "U").charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`font-bold truncate ${headingClass}`}>{u.name}</p>
                              {renderStatusBadge(u.status === "Blocked")}
                              {u.role && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-500">
                                  {u.role}
                                </span>
                              )}
                            </div>
                            <p className={`text-xs flex items-center gap-1.5 mt-1 truncate ${subTextClass}`}>
                              <Mail size={12} className="shrink-0" />
                              {u.email}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleBlockUser(u._id, u.status)}
                            className={`flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-colors ${
                              u.status === "Blocked"
                                ? isDark
                                  ? "bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/25"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200"
                                : isDark
                                ? "bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border-amber-500/25"
                                : "bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200"
                            }`}
                          >
                            {u.status === "Blocked" ? (
                              <><CheckCircle2 size={13} /> Unblock</>
                            ) : (
                              <><Ban size={13} /> Block</>
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeUser(u._id)}
                            className={`flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-colors ${
                              isDark
                                ? "bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border-rose-500/25"
                                : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200"
                            }`}
                          >
                            <Trash2 size={13} />
                            Remove
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================= PROPERTIES TAB ================= */}
          {activeTab === "properties" && (
            <motion.div
              key="properties"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            >
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
              >
                <div>
                  <h2 className={`text-3xl font-extrabold tracking-tight ${headingClass}`}>
                    Manage{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                      Properties
                    </span>
                  </h2>
                  <p className={`mt-1 text-sm ${subTextClass}`}>
                    {stats.totalProperties} listing{stats.totalProperties !== 1 ? "s" : ""} on the platform
                  </p>
                </div>
                {/* Search */}
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
                    value={propertySearch}
                    onChange={(e) => setPropertySearch(e.target.value)}
                    className={searchInputClass}
                  />
                </div>
              </motion.div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`rounded-2xl overflow-hidden animate-pulse ${cardClass}`}>
                      <div className={`h-44 ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                      <div className="p-5 space-y-3">
                        <div className={`h-4 rounded w-3/4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                        <div className={`h-3 rounded w-1/2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                        <div className={`h-8 rounded ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProperties.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className={`text-center py-20 rounded-2xl border border-dashed ${
                    isDark ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"
                  }`}
                >
                  <Building2 size={44} className={`mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                  <p className={`font-bold ${headingClass}`}>
                    {propertySearch ? "No properties match your search" : "No properties available"}
                  </p>
                  <p className={`text-sm mt-1 ${subTextClass}`}>
                    {propertySearch ? "Try a different keyword" : "Listed properties will appear here"}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredProperties.map((property) => {
                      const pid = property._id || property.id;
                      return (
                        <motion.div
                          key={pid}
                          variants={rowVariants}
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
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.08 }}
                              transition={{ duration: 0.5 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                            {property.rating && (
                              <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-900/70 backdrop-blur-md text-amber-400">
                                <Star size={11} fill="currentColor" /> {property.rating}
                              </span>
                            )}
                            <div className="absolute bottom-3 left-3">
                              <p className="text-xl font-extrabold text-white drop-shadow-lg">
                                ₹{String(property.price || "").replace("$", "")}
                              </p>
                            </div>
                          </div>

                          {/* Body */}
                          <div className="p-5">
                            <h4 className={`font-bold text-base mb-1 truncate transition-colors group-hover:text-blue-500 ${headingClass}`}>
                              {property.title}
                            </h4>
                            <p className={`text-xs flex items-center gap-1 mb-4 truncate ${subTextClass}`}>
                              <MapPin size={12} className="shrink-0" />
                              {property.location}
                            </p>

                            {/* Features */}
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                              {[
                                { icon: BedDouble, text: `${property.beds ?? "—"} Beds` },
                                { icon: Bath, text: `${property.baths ?? "—"} Baths` },
                                { icon: Ruler, text: `${property.size ?? "—"} sqft` },
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

                            {/* Delete action */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => deleteProperty(pid)}
                              className={`w-full flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-colors ${
                                isDark
                                  ? "bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border-rose-500/25"
                                  : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200"
                              }`}
                            >
                              <Trash2 size={13} />
                              Delete Property
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
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

export default AdminDashboard;
