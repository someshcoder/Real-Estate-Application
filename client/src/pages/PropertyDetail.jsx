import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import properties from "../components/seller/properties.json";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import {
  MapPin,
  Heart,
  Bookmark,
  BedDouble,
  Bath,
  Ruler,
  Star,
  Clock,
  IndianRupee,
  MessageSquare,
  Send,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  User,
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

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  // Find property synchronously so the correct page renders on the very first
  // render (avoids a "not found" flash that breaks entrance animations)
  const property = useMemo(
    () =>
      properties.find(
        (item) =>
          item.id && item.id.toString() === id?.toString() && !item.deleted
      ) || null,
    [id]
  );

  const isDark = theme === "dark";

  // ---------- Theme-aware class helpers (matches project design system) ----------
  const cardClass = isDark
    ? "bg-gray-900 border border-gray-800"
    : "bg-white border border-gray-200 shadow-sm";
  const headingClass = isDark ? "text-white" : "text-gray-900";
  const subTextClass = isDark ? "text-gray-400" : "text-gray-500";

  // ---------- Toast helper ----------
  const showToast = (type, msg) => {
    setToast({ type, message: msg });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!id) return;

    // Fetch messages for this property
    const storedMessages = JSON.parse(localStorage.getItem("propertyMessages")) || {};
    if (storedMessages[id]) {
      setMessages(storedMessages[id]);
    }

    // Check if the property is liked
    const likedProperties = JSON.parse(localStorage.getItem("likedProperties")) || [];
    setLiked(likedProperties.includes(id));

    // Check if the property is saved
    const savedProperties = JSON.parse(localStorage.getItem("favorites")) || [];
    setSaved(savedProperties.includes(id));
  }, [id]);

  const handleSendMessage = () => {
    if (!user || user.role !== "user") {
      showToast("error", "Only users can send messages.");
      return;
    }

    if (!message.trim()) {
      showToast("error", "Please enter a message.");
      return;
    }

    const propertyOwner = property.owner;

    const storedMessages = JSON.parse(localStorage.getItem("propertyMessages")) || {};
    if (!storedMessages[id]) storedMessages[id] = [];
    storedMessages[id].push({
      text: message,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
    });
    localStorage.setItem("propertyMessages", JSON.stringify(storedMessages));

    const storedNotifications = JSON.parse(localStorage.getItem("sellerNotifications")) || {};
    if (!storedNotifications[propertyOwner]) storedNotifications[propertyOwner] = [];

    storedNotifications[propertyOwner].push({
      title: "New Message from User",
      message: `You received a message about "${property.title}".`,
      propertyId: id,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      read: false,
    });

    localStorage.setItem("sellerNotifications", JSON.stringify(storedNotifications));

    showToast("success", "Message sent to the owner!");
    setMessage("");
    setMessages([
      ...messages,
      { text: message, timestamp: new Date().toISOString(), userEmail: user.email },
    ]);
  };

  const handleLikeProperty = () => {
    if (!user || user.role !== "user") {
      showToast("error", "Only users can like properties.");
      return;
    }

    const likedProperties = JSON.parse(localStorage.getItem("likedProperties")) || [];
    if (!likedProperties.includes(id)) {
      likedProperties.push(id);
      localStorage.setItem("likedProperties", JSON.stringify(likedProperties));
      setLiked(true);
      showToast("success", "Added to liked properties ❤️");
    } else {
      const newLiked = likedProperties.filter((propId) => propId !== id.toString());
      localStorage.setItem("likedProperties", JSON.stringify(newLiked));
      setLiked(false);
      showToast("success", "Removed from liked properties");
    }
  };

  const handleSaveProperty = () => {
    if (!user || user.role !== "user") {
      showToast("error", "Only users can save properties.");
      return;
    }

    const savedProperties = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!savedProperties.includes(id)) {
      savedProperties.push(id);
      localStorage.setItem("favorites", JSON.stringify(savedProperties));
      setSaved(true);
      showToast("success", "Property saved!");
    } else {
      const newSaved = savedProperties.filter((propId) => propId !== id.toString());
      localStorage.setItem("favorites", JSON.stringify(newSaved));
      setSaved(false);
      showToast("success", "Property removed from favorites.");
    }
  };

  const scrollToMessage = () => {
    document.getElementById("message-input")?.scrollIntoView({ behavior: "smooth" });
  };

  // ---------- Property not found state ----------
  if (!property) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center gap-5 p-6 transition-colors duration-300 ${
          isDark ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 14 }}
          className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
            isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200 shadow-lg"
          }`}
        >
          <Building2 size={36} className={isDark ? "text-gray-600" : "text-gray-300"} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center"
        >
          <h2 className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
            Property Not Found
          </h2>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            This listing may have been removed or the link is incorrect.
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
        >
          <ArrowLeft size={16} />
          Back to Home
        </motion.button>
      </div>
    );
  }

  const featureChips = [
    { icon: BedDouble, label: "Bedrooms", value: property.beds ?? "—" },
    { icon: Bath, label: "Bathrooms", value: property.baths ?? "—" },
    { icon: Ruler, label: "Area", value: property.size ?? "—" },
    { icon: IndianRupee, label: "Price / Sqft", value: property.pricePerSqft?.replace("$", "₹") ?? "—" },
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-10"
      >
        {/* ---------- Top bar: back button ---------- */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-sm font-bold transition-colors ${
              isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </motion.button>
        </motion.div>

        {/* ---------- Hero image ---------- */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-3xl overflow-hidden group shadow-2xl"
        >
          <motion.img
            src={property.image || "https://via.placeholder.com/600"}
            alt={property.title || "No Image Available"}
            className="w-full h-72 sm:h-96 lg:h-[480px] object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/10 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {property.time && (
              <motion.span
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-gray-950/70 backdrop-blur-md text-white"
              >
                <Clock size={11} />
                {property.time}
              </motion.span>
            )}
          </div>
          {property.rating && (
            <motion.span
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-950/70 backdrop-blur-md text-amber-400"
            >
              <Star size={12} fill="currentColor" />
              {property.rating}
            </motion.span>
          )}

          {/* Title + location overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-lg"
            >
              {property.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-1.5 text-sm text-gray-200 mt-2 font-medium"
            >
              <MapPin size={15} className="text-cyan-400" />
              {property.location}
            </motion.p>
          </div>
        </motion.div>

        {/* ---------- Content grid ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* ===== Left column — details ===== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feature chips */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {featureChips.map((chip, i) => {
                const Icon = chip.icon;
                return (
                  <motion.div
                    key={chip.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.08, type: "spring", stiffness: 130 }}
                    whileHover={{ y: -4 }}
                    className={`rounded-2xl p-4 text-center ${cardClass}`}
                  >
                    <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mb-2 shadow-lg shadow-blue-500/25">
                      <Icon size={16} className="text-white" />
                    </div>
                    <p className={`text-sm font-extrabold ${headingClass}`}>{chip.value}</p>
                    <p className={`text-[11px] font-medium mt-0.5 ${subTextClass}`}>{chip.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* About */}
            <motion.div variants={itemVariants} className={`rounded-2xl p-6 ${cardClass}`}>
              <h3 className={`font-bold text-lg mb-3 flex items-center gap-2 ${headingClass}`}>
                <Sparkles size={17} className="text-blue-500" />
                About this property
              </h3>
              <p className={`text-sm leading-relaxed ${subTextClass}`}>
                {property.description}
              </p>
            </motion.div>

            {/* Messages / conversation */}
            <motion.div variants={itemVariants} className={`rounded-2xl p-6 ${cardClass}`}>
              <h3 className={`font-bold text-lg mb-5 flex items-center gap-2 ${headingClass}`}>
                <MessageSquare size={17} className="text-blue-500" />
                Messages
                {messages.length > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-blue-500/15 text-blue-500">
                    {messages.length}
                  </span>
                )}
              </h3>

              {messages.length === 0 ? (
                <p className={`text-sm text-center py-6 ${subTextClass}`}>
                  No messages yet. Start the conversation below! 💬
                </p>
              ) : (
                <div className="space-y-3 mb-2">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className={`flex items-start gap-3 ${msg.isResponse ? "" : "flex-row-reverse"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                          msg.isResponse
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                            : "bg-gradient-to-br from-blue-600 to-cyan-500"
                        }`}
                      >
                        <User size={14} />
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.isResponse
                            ? isDark
                              ? "bg-gray-800 rounded-tl-sm"
                              : "bg-gray-100 rounded-tl-sm"
                            : "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm"
                        }`}
                      >
                        <p className={`text-sm ${msg.isResponse ? headingClass : "text-white"}`}>
                          {msg.text}
                        </p>
                        <p
                          className={`text-[10px] mt-1.5 font-medium ${
                            msg.isResponse ? subTextClass : "text-blue-100/80"
                          }`}
                        >
                          {msg.isResponse ? "Seller" : "You"} · {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Message input */}
              {user && user.role === "user" && (
                <div id="message-input" className="mt-5">
                  <div
                    className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 ${
                      isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-transparent"
                    }`}
                  >
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Send a message to the owner..."
                      className={`w-full p-4 text-sm font-medium bg-transparent outline-none resize-none ${
                        isDark ? "text-white placeholder-gray-500" : "text-gray-800 placeholder-gray-400"
                      }`}
                      rows="3"
                    />
                    <div className="flex justify-end p-3 pt-0">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
                      >
                        <Send size={14} />
                        Send Message
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sellers/Admins note */}
              {user && user.role !== "user" && (
                <p className={`text-sm italic mt-2 ${subTextClass}`}>
                  Sellers & Admins cannot send messages, like, or save properties.
                </p>
              )}

              {/* Guest note */}
              {!user && (
                <div
                  className={`mt-3 rounded-xl p-4 text-sm text-center border border-dashed ${
                    isDark ? "border-gray-700 text-gray-400" : "border-gray-300 text-gray-500"
                  }`}
                >
                  <Link to="/login" className="text-blue-500 font-bold hover:underline">
                    Sign in
                  </Link>{" "}
                  to contact the owner, like or save this property.
                </div>
              )}
            </motion.div>
          </div>

          {/* ===== Right column — sticky price card ===== */}
          <div className="lg:col-span-1">
            <motion.div variants={itemVariants} className="lg:sticky lg:top-6 space-y-4">
              {/* Price card */}
              <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/25 overflow-hidden">
                <motion.div
                  className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <p className="text-blue-100/90 text-xs font-bold uppercase tracking-widest mb-1">
                  Price
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold drop-shadow">
                  ₹{property.price?.replace(/[$,]/g, "") || "—"}
                </p>
                {property.pricePerSqft && (
                  <p className="text-blue-50/80 text-xs font-medium mt-1.5">
                    {property.pricePerSqft.replace("$", "₹")}
                  </p>
                )}

                {/* Contact CTA */}
                {user && user.role === "user" && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={scrollToMessage}
                    className="relative z-10 mt-5 w-full bg-white text-blue-600 font-bold py-3 rounded-full flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageSquare size={16} />
                    Contact Owner
                  </motion.button>
                )}
              </div>

              {/* Like / Save actions */}
              {user && user.role === "user" && (
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLikeProperty}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                      liked
                        ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30"
                        : isDark
                        ? "bg-gray-900 border-gray-800 text-gray-300 hover:border-rose-500/50 hover:text-rose-400"
                        : "bg-white border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500"
                    }`}
                  >
                    <motion.span
                      key={liked ? "liked" : "unliked"}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 12 }}
                      className="flex"
                    >
                      <Heart size={16} fill={liked ? "currentColor" : "none"} />
                    </motion.span>
                    {liked ? "Liked" : "Like"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProperty}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                      saved
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 border-transparent text-white shadow-lg shadow-blue-500/30"
                        : isDark
                        ? "bg-gray-900 border-gray-800 text-gray-300 hover:border-blue-500/50 hover:text-blue-400"
                        : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-500"
                    }`}
                  >
                    <motion.span
                      key={saved ? "saved" : "unsaved"}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 12 }}
                      className="flex"
                    >
                      <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                    </motion.span>
                    {saved ? "Saved" : "Save"}
                  </motion.button>
                </div>
              )}

              {/* Quick facts card */}
              <div className={`rounded-2xl p-5 ${cardClass}`}>
                <h4 className={`font-bold text-sm mb-4 ${headingClass}`}>Quick Facts</h4>
                <div className="space-y-3">
                  {[
                    { label: "Location", value: property.location },
                    { label: "Size", value: property.size ?? "—" },
                    { label: "Rating", value: property.rating ? `${property.rating} / 5` : "—" },
                    { label: "Listed", value: property.time ?? "—" },
                  ].map((fact) => (
                    <div key={fact.label} className="flex items-center justify-between gap-3">
                      <span className={`text-xs font-medium ${subTextClass}`}>{fact.label}</span>
                      <span className={`text-xs font-bold text-right ${headingClass}`}>
                        {fact.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

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

export default PropertyDetail;
