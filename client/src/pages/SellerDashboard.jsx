import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { API_URL } from "../config";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import {
  LayoutDashboard,
  PlusCircle,
  Building2,
  BedDouble,
  Bath,
  Ruler,
  MapPin,
  IndianRupee,
  Star,
  Clock,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Ban,
  CheckCircle2,
  Search,
  LogOut,
  TrendingUp,
  Home,
  ShieldAlert,
  X,
  Sparkles,
  FileText,
} from "lucide-react";

// ---------- Animation Variants ----------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

const emptyProperty = {
  title: "",
  image: "",
  location: "",
  description: "",
  price: "",
  beds: "",
  baths: "",
  size: "",
  pricePerSqft: "",
  rating: "",
  time: "",
};

const SellerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState(emptyProperty);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview | add | properties
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const token = localStorage.getItem("token");

  // ---------- Theme-aware class helpers (matches Header.jsx design system) ----------
  const cardClass = isDark
    ? "bg-gray-900 border border-gray-800"
    : "bg-white border border-gray-200 shadow-sm";
  const inputClass = `w-full p-3 rounded-xl text-sm font-medium outline-none border-2 transition-all duration-300 ${
    isDark
      ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
      : "bg-gray-100 border-transparent text-gray-800 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
  }`;
  const labelClass = `flex items-center gap-1.5 text-xs font-bold mb-2 ${
    isDark ? "text-gray-300" : "text-gray-600"
  }`;
  const headingClass = isDark ? "text-white" : "text-gray-900";
  const subTextClass = isDark ? "text-gray-400" : "text-gray-500";

  // ---------- Toast helper ----------
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3200);
  };

  // ---------- Fetch properties ----------
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/properties`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const activeProperties = Array.isArray(data)
          ? data.filter((prop) => !prop.deleted)
          : [];
        setProperties(activeProperties);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error fetching properties:", err);
      });
  }, [token]);

  // ---------- Stats ----------
  const stats = useMemo(() => {
    const total = properties.length;
    const blocked = properties.filter((p) => p.isBlocked).length;
    const active = total - blocked;
    const totalValue = properties.reduce((sum, p) => {
      const price = parseFloat(String(p.price || "0").replace(/[^0-9.]/g, ""));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    return { total, active, blocked, totalValue };
  }, [properties]);

  const formatValue = (num) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  // ---------- Handlers ----------
  const handleAddProperty = (e) => {
    e.preventDefault();
    setSubmitting(true);

    fetch(`${API_URL}/properties/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newProperty),
    })
      .then((res) => res.json())
      .then((data) => {
        showToast("success", data.message || "Property added successfully!");
        setProperties([...properties, data.property]);
        setNewProperty(emptyProperty);
        setSubmitting(false);
        setActiveTab("properties");
      })
      .catch((err) => {
        showToast("error", "Failed to add property");
        setSubmitting(false);
        console.error(err);
      });
  };

  const handleBlockUnblock = (propertyId) => {
    fetch(`${API_URL}/properties/block/${propertyId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        showToast("success", "Property status updated");
        setProperties(data.properties);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (propertyId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      fetch(`${API_URL}/properties/delete/${propertyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            showToast("success", data.message);
            setProperties(
              properties.filter((property) => property.id !== propertyId)
            );
          } else {
            showToast("error", "Failed to delete property");
          }
        })
        .catch((err) => {
          console.error("Error deleting property:", err);
          showToast("error", "An error occurred while deleting the property");
        });
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowEditModal(true);
  };

  const submitEdit = () => {
    fetch(`${API_URL}/properties/edit/${editingProperty.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingProperty),
    })
      .then((res) => res.json())
      .then((data) => {
        showToast("success", data.message || "Property updated!");
        setProperties(
          properties.map((p) =>
            p.id === editingProperty.id ? editingProperty : p
          )
        );
        setShowEditModal(false);
      })
      .catch((err) => console.error(err));
  };

  // ---------- Filtered list ----------
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;
    const q = searchQuery.toLowerCase();
    return properties.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
    );
  }, [properties, searchQuery]);

  // ---------- Nav items ----------
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "add", label: "Add Property", icon: PlusCircle },
    { id: "properties", label: "My Properties", icon: Building2 },
  ];

  // ---------- Form fields config ----------
  const formFields = [
    { key: "title", label: "Property Title", placeholder: "e.g. Luxury 3BHK Apartment", icon: Home, required: true, full: true },
    { key: "location", label: "Location", placeholder: "e.g. Bandra West, Mumbai", icon: MapPin, required: true, full: true },
    { key: "price", label: "Price (₹)", placeholder: "e.g. 8500000", icon: IndianRupee, required: true, stripDollar: true },
    { key: "pricePerSqft", label: "Price / Sqft (₹)", placeholder: "e.g. 6500", icon: TrendingUp, stripDollar: true },
    { key: "beds", label: "Bedrooms", placeholder: "e.g. 3", icon: BedDouble, required: true },
    { key: "baths", label: "Bathrooms", placeholder: "e.g. 2", icon: Bath, required: true },
    { key: "size", label: "Size (sqft)", placeholder: "e.g. 1250", icon: Ruler, required: true },
    { key: "rating", label: "Rating", placeholder: "e.g. 4.5", icon: Star },
    { key: "time", label: "Listing Tag", placeholder: "e.g. Recently added", icon: Clock },
    { key: "image", label: "Image URL", placeholder: "https://...", icon: ImageIcon, full: true },
    { key: "description", label: "Description", placeholder: "Describe the property highlights...", icon: FileText, required: true, full: true, textarea: true },
  ];

  const statCards = [
    { label: "Total Properties", value: stats.total, icon: Building2, gradient: "from-blue-600 to-cyan-500", glow: "shadow-blue-500/30" },
    { label: "Active Listings", value: stats.active, icon: CheckCircle2, gradient: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/30" },
    { label: "Blocked", value: stats.blocked, icon: ShieldAlert, gradient: "from-rose-500 to-orange-500", glow: "shadow-rose-500/30" },
    { label: "Portfolio Value", value: formatValue(stats.totalValue), icon: TrendingUp, gradient: "from-blue-600 to-fuchsia-500", glow: "shadow-fuchsia-500/30" },
  ];

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

      {/* ---------- Sidebar (fixed — scroll hone par apni jagah rahega) ---------- */}
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
              SELLER DASHBOARD
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
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                <Icon size={18} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
                {item.id === "properties" && stats.total > 0 && (
                  <span
                    className={`relative z-10 ml-auto text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : isDark
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {stats.total}
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
              {(user?.username || user?.name || "S").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold truncate ${headingClass}`}>
                {user?.username || user?.name || "Seller"}
              </p>
              <p className={`text-[11px] truncate ${subTextClass}`}>
                {user?.email || "Property Seller"}
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

      {/* ---------- Main Content (sidebar ki width jitna left margin) ---------- */}
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
                  Welcome back
                </div>
                <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${headingClass}`}>
                  {user?.username || user?.name || "Seller"}'s{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                    Dashboard
                  </span>
                </h2>
                <p className={`mt-2 text-sm ${subTextClass}`}>
                  Track, manage and grow your property portfolio — all in one place.
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
                      <p className={`text-2xl font-extrabold ${headingClass}`}>{card.value}</p>
                      <p className={`text-xs font-medium mt-1 ${subTextClass}`}>{card.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick actions + recent */}
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
                    <h3 className="text-xl font-extrabold mb-2">List a new property</h3>
                    <p className="text-blue-50/90 text-sm mb-6">
                      Reach thousands of buyers by adding your property in under 2 minutes.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveTab("add")}
                    className="relative z-10 bg-white text-blue-600 font-bold px-5 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg"
                  >
                    <PlusCircle size={18} />
                    Add Property
                  </motion.button>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className={`lg:col-span-2 rounded-2xl p-6 ${cardClass}`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className={`font-bold text-lg ${headingClass}`}>Recent Listings</h3>
                    <button
                      onClick={() => setActiveTab("properties")}
                      className="text-xs text-blue-500 hover:text-blue-400 font-bold transition-colors"
                    >
                      View all →
                    </button>
                  </div>
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-14 rounded-xl animate-pulse ${
                            isDark ? "bg-gray-800" : "bg-gray-100"
                          }`}
                        />
                      ))}
                    </div>
                  ) : properties.length === 0 ? (
                    <p className={`text-sm text-center py-8 ${subTextClass}`}>
                      No properties yet. Add your first listing! 🏡
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {properties.slice(0, 4).map((p, i) => (
                        <motion.div
                          key={p.id || i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.08 }}
                          whileHover={{ x: 4 }}
                          className={`flex items-center gap-4 p-2.5 rounded-xl transition-colors cursor-default ${
                            isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                          }`}
                        >
                          <img
                            src={p.image}
                            alt={p.title}
                            className={`w-12 h-12 rounded-lg object-cover border ${
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
                          <span
                            className={`text-[10px] px-2 py-1 rounded-full font-bold shrink-0 ${
                              p.isBlocked
                                ? "bg-rose-500/15 text-rose-500"
                                : "bg-emerald-500/15 text-emerald-500"
                            }`}
                          >
                            {p.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ================= ADD PROPERTY TAB ================= */}
          {activeTab === "add" && (
            <motion.div
              key="add"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              className="max-w-3xl mx-auto"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className={`text-3xl font-extrabold tracking-tight ${headingClass}`}>
                  Add New{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                    Property
                  </span>
                </h2>
                <p className={`mt-2 text-sm ${subTextClass}`}>
                  Fill in the details below to publish your listing.
                </p>
              </motion.div>

              <motion.form
                variants={itemVariants}
                onSubmit={handleAddProperty}
                className={`rounded-2xl p-6 sm:p-8 ${cardClass}`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {formFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div
                        key={field.key}
                        className={field.full ? "sm:col-span-2" : ""}
                      >
                        <label className={labelClass}>
                          <Icon size={13} className="text-blue-500" />
                          {field.label}
                          {field.required && <span className="text-rose-500">*</span>}
                        </label>
                        {field.textarea ? (
                          <textarea
                            rows={3}
                            placeholder={field.placeholder}
                            value={newProperty[field.key]}
                            onChange={(e) =>
                              setNewProperty({
                                ...newProperty,
                                [field.key]: field.stripDollar
                                  ? e.target.value.replace("$", "")
                                  : e.target.value,
                              })
                            }
                            required={field.required}
                            className={`${inputClass} resize-none`}
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={newProperty[field.key]}
                            onChange={(e) =>
                              setNewProperty({
                                ...newProperty,
                                [field.key]: field.stripDollar
                                  ? e.target.value.replace("$", "")
                                  : e.target.value,
                              })
                            }
                            required={field.required}
                            className={inputClass}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Live image preview */}
                <AnimatePresence>
                  {newProperty.image && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-5"
                    >
                      <p className={`text-xs mb-2 ${subTextClass}`}>Image preview</p>
                      <img
                        src={newProperty.image}
                        alt="Preview"
                        className={`w-full h-48 object-cover rounded-xl border ${
                          isDark ? "border-gray-700" : "border-gray-200"
                        }`}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="mt-7 w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
                >
                  {submitting ? (
                    <>
                      <motion.span
                        className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      Publish Property
                    </>
                  )}
                </motion.button>
              </motion.form>
            </motion.div>
          )}

          {/* ================= MY PROPERTIES TAB ================= */}
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
                    My{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                      Properties
                    </span>
                  </h2>
                  <p className={`mt-1 text-sm ${subTextClass}`}>
                    {stats.total} listing{stats.total !== 1 ? "s" : ""} · {stats.active} active
                  </p>
                </div>
                {/* Search — matches Header search style */}
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
                    className={`w-full py-2.5 pl-11 pr-4 rounded-full text-sm font-medium outline-none border-2 transition-all duration-300 ${
                      isDark
                        ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                        : "bg-gray-100 border-transparent text-gray-800 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                    }`}
                  />
                </div>
              </motion.div>

              {loading ? (
                /* Skeleton loading */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl overflow-hidden animate-pulse ${cardClass}`}
                    >
                      <div className={`h-48 ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                      <div className="p-5 space-y-3">
                        <div className={`h-4 rounded w-3/4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                        <div className={`h-3 rounded w-1/2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                        <div className={`h-3 rounded w-full ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                        <div className={`h-8 rounded ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProperties.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className={`text-center py-20 rounded-2xl border border-dashed ${
                    isDark
                      ? "bg-gray-900/50 border-gray-700"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Building2 size={44} className={`mx-auto mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                  <p className={`font-bold ${headingClass}`}>
                    {searchQuery ? "No properties match your search" : "No properties listed yet"}
                  </p>
                  <p className={`text-sm mt-1 mb-6 ${subTextClass}`}>
                    {searchQuery
                      ? "Try a different keyword"
                      : "Start building your portfolio today"}
                  </p>
                  {!searchQuery && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab("add")}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
                    >
                      <PlusCircle size={17} />
                      Add Your First Property
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence>
                    {filteredProperties.map((property) => (
                      <motion.div
                        key={property.id}
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
                        <div className="relative h-48 overflow-hidden">
                          <motion.img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                          {/* Status badge */}
                          <span
                            className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md text-white ${
                              property.isBlocked ? "bg-rose-500/90" : "bg-emerald-500/90"
                            }`}
                          >
                            {property.isBlocked ? "● Blocked" : "● Active"}
                          </span>
                          {property.rating && (
                            <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-900/70 backdrop-blur-md text-amber-400">
                              <Star size={11} fill="currentColor" /> {property.rating}
                            </span>
                          )}
                          {/* Price */}
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
                          <div className="flex items-center gap-2 mb-4">
                            {[
                              { icon: BedDouble, text: `${property.beds} Beds` },
                              { icon: Bath, text: `${property.baths} Baths` },
                              { icon: Ruler, text: `${property.size} sqft` },
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

                          <p className={`text-xs line-clamp-2 mb-5 min-h-[32px] ${subTextClass}`}>
                            {property.description}
                          </p>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEdit(property)}
                              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl border transition-colors ${
                                isDark
                                  ? "bg-blue-500/10 hover:bg-blue-500/25 text-blue-400 border-blue-500/25"
                                  : "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                              }`}
                            >
                              <Pencil size={13} />
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleBlockUnblock(property.id)}
                              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl border transition-colors ${
                                property.isBlocked
                                  ? isDark
                                    ? "bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border-emerald-500/25"
                                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200"
                                  : isDark
                                  ? "bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border-amber-500/25"
                                  : "bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200"
                              }`}
                            >
                              {property.isBlocked ? (
                                <><CheckCircle2 size={13} /> Unblock</>
                              ) : (
                                <><Ban size={13} /> Block</>
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(property.id)}
                              className={`flex items-center justify-center px-3 py-2.5 rounded-xl border transition-colors ${
                                isDark
                                  ? "bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border-rose-500/25"
                                  : "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200"
                              }`}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ---------- Edit Modal ---------- */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl p-6 sm:p-7 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto border ${
                isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-extrabold flex items-center gap-2 ${headingClass}`}>
                  <Pencil size={18} className="text-blue-500" />
                  Edit Property
                </h3>
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                  className={`transition-colors ${
                    isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="space-y-4">
                {[
                  { key: "title", label: "Title", icon: Home },
                  { key: "location", label: "Location", icon: MapPin },
                  { key: "price", label: "Price (₹)", icon: IndianRupee, stripDollar: true },
                  { key: "beds", label: "Bedrooms", icon: BedDouble },
                  { key: "baths", label: "Bathrooms", icon: Bath },
                  { key: "size", label: "Size (sqft)", icon: Ruler },
                  { key: "image", label: "Image URL", icon: ImageIcon },
                ].map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key}>
                      <label className={labelClass}>
                        <Icon size={13} className="text-blue-500" />
                        {field.label}
                      </label>
                      <input
                        type="text"
                        placeholder={field.label}
                        value={editingProperty?.[field.key] || ""}
                        onChange={(e) =>
                          setEditingProperty({
                            ...editingProperty,
                            [field.key]: field.stripDollar
                              ? e.target.value.replace("$", "")
                              : e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  );
                })}
                <div>
                  <label className={labelClass}>
                    <FileText size={13} className="text-blue-500" />
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Description"
                    value={editingProperty?.description || ""}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        description: e.target.value,
                      })
                    }
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-7">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowEditModal(false)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-colors ${
                    isDark
                      ? "text-gray-300 bg-gray-800 hover:bg-gray-700 border-gray-700"
                      : "text-gray-600 bg-gray-100 hover:bg-gray-200 border-gray-200"
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={submitEdit}
                  className="px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all"
                >
                  <CheckCircle2 size={15} />
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default SellerDashboard;
