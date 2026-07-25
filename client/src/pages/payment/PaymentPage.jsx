import { useState, useContext, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import properties from "../../components/seller/properties.json";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Landmark,
  Lock,
  ShieldCheck,
  MapPin,
  BadgeCheck,
  Loader2,
  AlertCircle,
  Building2,
  Wifi,
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

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState("");

  const isDark = theme === "dark";

  // Find property synchronously (first render pe hi mil jaye)
  const property = useMemo(
    () => properties.find((p) => p.id === parseInt(id)) || null,
    [id]
  );

  const displayPrice = property?.price?.replace(/[$,]/g, "") || "";

  // ---------- Theme-aware class helpers ----------
  const cardClass = isDark
    ? "bg-gray-900 border border-gray-800"
    : "bg-white border border-gray-200 shadow-sm";
  const headingClass = isDark ? "text-white" : "text-gray-900";
  const subTextClass = isDark ? "text-gray-400" : "text-gray-500";
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${
    isDark ? "text-gray-400" : "text-gray-500"
  }`;
  const inputClass = `w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 outline-none border-2 ${
    isDark
      ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
      : "bg-gray-50 border-transparent text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
  }`;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ---------- Input formatters ----------
  const handleCardNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
  };

  const handleExpiryChange = (e) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setExpiryDate(digits);
  };

  const handleCvvChange = (e) => {
    setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
  };

  const paymentMethods = [
    { key: "card", label: "Card", icon: CreditCard },
    { key: "upi", label: "UPI", icon: Smartphone },
    { key: "netbanking", label: "Net Banking", icon: Landmark },
  ];

  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Punjab National Bank"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Method-wise validation
    if (paymentMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
        setError("Please fill in all card details.");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setError("Please enter a valid 16-digit card number.");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        setError("Please enter a valid UPI ID (e.g. name@upi).");
        return;
      }
    } else if (paymentMethod === "netbanking" && !selectedBank) {
      setError("Please select your bank.");
      return;
    }

    setProcessingPayment(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/payment/success", {
        state: {
          property,
          transactionId: Math.random().toString(36).substring(2, 15),
        },
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      setError("Payment processing failed. Please try again.");
      setProcessingPayment(false);
    }
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
        <div className="text-center">
          <h2 className={`text-2xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
            Property Not Found
          </h2>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Please go back and select a property to purchase.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/properties")}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
        >
          <ArrowLeft size={16} />
          Back to Properties
        </motion.button>
      </div>
    );
  }

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
        {/* ---------- Top bar ---------- */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
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
          <div
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full ${
              isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}
          >
            <Lock size={12} />
            100% Secure Payment
          </div>
        </motion.div>

        {/* ---------- Heading ---------- */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${headingClass}`}>
            Complete Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Purchase
            </span>
          </h1>
          <p className={`text-sm mt-2 font-medium ${subTextClass}`}>
            You&apos;re one step away from owning your dream property.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ===== Left — payment form ===== */}
          <div className="lg:col-span-3 space-y-6">
            {/* Payment method selector */}
            <motion.div variants={itemVariants} className={`rounded-2xl p-6 ${cardClass}`}>
              <h2 className={`font-bold text-lg mb-4 ${headingClass}`}>Payment Method</h2>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.key;
                  return (
                    <motion.button
                      key={method.key}
                      type="button"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setPaymentMethod(method.key);
                        setError("");
                      }}
                      className={`relative flex flex-col items-center gap-2 py-4 rounded-2xl border-2 text-xs font-bold transition-all duration-300 ${
                        active
                          ? "border-blue-500 bg-blue-500/10 text-blue-500"
                          : isDark
                          ? "border-gray-800 bg-gray-800/40 text-gray-400 hover:border-gray-700"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {active && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center"
                        >
                          <BadgeCheck size={12} className="text-white" />
                        </motion.span>
                      )}
                      <Icon size={20} />
                      {method.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Payment details form */}
            <motion.div variants={itemVariants} className={`rounded-2xl p-6 ${cardClass}`}>
              <h2 className={`font-bold text-lg mb-5 ${headingClass}`}>Payment Details</h2>

              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-semibold rounded-xl p-3.5 mb-5">
                      <AlertCircle size={16} className="shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* ---- Card form ---- */}
                  {paymentMethod === "card" && (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      {/* Live card preview */}
                      <div className="relative w-full max-w-sm mx-auto aspect-[16/9] rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-5 text-white shadow-xl shadow-blue-500/25 overflow-hidden">
                        <motion.div
                          className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="flex items-start justify-between">
                          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-300 to-amber-500" />
                          <Wifi size={18} className="rotate-90 opacity-80" />
                        </div>
                        <p className="mt-5 text-lg sm:text-xl font-bold tracking-[0.15em] font-mono">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </p>
                        <div className="flex items-end justify-between mt-4">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-blue-100/80">Card Holder</p>
                            <p className="text-xs font-bold uppercase tracking-wide mt-0.5">
                              {nameOnCard || "YOUR NAME"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-blue-100/80">Expires</p>
                            <p className="text-xs font-bold mt-0.5">{expiryDate || "MM/YY"}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Name on Card</label>
                        <input
                          type="text"
                          value={nameOnCard}
                          onChange={(e) => setNameOnCard(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Card Number</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          className={inputClass}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Expiry Date</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={expiryDate}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>CVV</label>
                          <input
                            type="password"
                            inputMode="numeric"
                            value={cvv}
                            onChange={handleCvvChange}
                            placeholder="•••"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ---- UPI form ---- */}
                  {paymentMethod === "upi" && (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-5"
                    >
                      <div
                        className={`rounded-2xl p-5 text-center border border-dashed ${
                          isDark ? "border-gray-700" : "border-gray-300"
                        }`}
                      >
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
                          <Smartphone size={24} className="text-white" />
                        </div>
                        <p className={`text-sm font-bold ${headingClass}`}>Pay via UPI</p>
                        <p className={`text-xs mt-1 ${subTextClass}`}>
                          Enter your UPI ID and confirm the payment on your UPI app.
                        </p>
                      </div>
                      <div>
                        <label className={labelClass}>UPI ID</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className={inputClass}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ---- Net banking form ---- */}
                  {paymentMethod === "netbanking" && (
                    <motion.div
                      key="netbanking"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      <label className={labelClass}>Select Your Bank</label>
                      {banks.map((bank) => (
                        <motion.button
                          key={bank}
                          type="button"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedBank(bank)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                            selectedBank === bank
                              ? "border-blue-500 bg-blue-500/10 text-blue-500"
                              : isDark
                              ? "border-gray-800 bg-gray-800/40 text-gray-300 hover:border-gray-700"
                              : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Landmark size={16} />
                            {bank}
                          </span>
                          {selectedBank === bank && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <BadgeCheck size={17} />
                            </motion.span>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pay button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: processingPayment ? 1 : 1.02 }}
                  whileTap={{ scale: processingPayment ? 1 : 0.98 }}
                  disabled={processingPayment}
                  className={`mt-6 w-full py-4 rounded-full text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all ${
                    processingPayment
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  }`}
                >
                  {processingPayment ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      Pay ₹{displayPrice}
                    </>
                  )}
                </motion.button>

                <p className={`flex items-center justify-center gap-1.5 text-[11px] font-medium mt-4 ${subTextClass}`}>
                  <ShieldCheck size={13} className="text-emerald-500" />
                  Your payment information is encrypted and secure.
                </p>
              </form>
            </motion.div>
          </div>

          {/* ===== Right — order summary ===== */}
          <div className="lg:col-span-2">
            <motion.div variants={itemVariants} className="lg:sticky lg:top-6 space-y-4">
              <div className={`rounded-2xl overflow-hidden ${cardClass}`}>
                {/* Property image */}
                <div className="relative h-44 overflow-hidden">
                  <motion.img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-extrabold text-lg drop-shadow">{property.title}</h3>
                    <p className="flex items-center gap-1 text-gray-200 text-xs font-medium mt-0.5">
                      <MapPin size={12} className="text-cyan-400" />
                      {property.location}
                    </p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="p-5">
                  <h4 className={`font-bold text-sm mb-4 ${headingClass}`}>Order Summary</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${subTextClass}`}>Property Price</span>
                      <span className={`text-xs font-bold ${headingClass}`}>₹{displayPrice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${subTextClass}`}>Processing Fee</span>
                      <span className="text-xs font-bold text-emerald-500">FREE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${subTextClass}`}>Taxes</span>
                      <span className="text-xs font-bold text-emerald-500">Included</span>
                    </div>
                    <div className={`border-t pt-3 mt-3 flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-200"}`}>
                      <span className={`text-sm font-bold ${headingClass}`}>Total Amount</span>
                      <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        ₹{displayPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className={`rounded-2xl p-5 ${cardClass}`}>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { icon: ShieldCheck, label: "Buyer Protection" },
                    { icon: Lock, label: "SSL Encrypted" },
                    { icon: BadgeCheck, label: "Verified Listing" },
                  ].map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div key={badge.label} className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isDark ? "bg-gray-800 text-emerald-400" : "bg-emerald-50 text-emerald-500"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <p className={`text-[10px] font-bold ${subTextClass}`}>{badge.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
