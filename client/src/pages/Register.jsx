import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import { User, Mail, Lock, Shield, ArrowRight, Loader2, Home } from "lucide-react";
import { API_URL } from "../config";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  
  const isDark = theme === "dark";

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ────────── Animation Variants ────────── */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  // Input field classes generator
  const getInputClasses = () => `w-full py-3.5 pl-12 pr-4 rounded-xl text-sm font-medium transition-all duration-300 outline-none border-2 ${
    isDark 
      ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" 
      : "bg-gray-50 border-transparent text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
  }`;

  const getIconClasses = () => `w-5 h-5 transition-colors ${
    isDark ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-blue-600"
  }`;

  return (
    <div className={`relative min-h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-500 ${isDark ? "bg-gray-950" : "bg-blue-50/50"}`}>
      
      {/* ── Background Animated Elements ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-30 mix-blend-multiply filter blur-[100px]"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20 mix-blend-multiply filter blur-[100px]"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
          animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {isDark && (
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        )}
      </div>

      {/* ── Back to Home Link ── */}
      <Link to="/" className="absolute top-6 left-6 z-20">
        <motion.div 
          whileHover={{ x: -4 }}
          className={`flex items-center gap-2 text-sm font-bold transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
        >
          <Home className="w-4 h-4" />
          Back to Home
        </motion.div>
      </Link>

      {/* ── Main Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className={`relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl border ${
          isDark 
            ? "bg-gray-900/80 border-gray-800 shadow-blue-900/20" 
            : "bg-white/90 border-white/40 shadow-blue-900/5"
        }`}
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <span className="text-white font-extrabold text-3xl">R</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Create Account
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`mt-2 text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Join Real Estate Prime today.
          </motion.p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, mb: 0 }}
              animate={{ opacity: 1, height: "auto", mb: 20 }}
              exit={{ opacity: 0, height: 0, mb: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 overflow-hidden"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleRegister} 
          className="space-y-5"
        >
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className={getIconClasses()} />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={getInputClasses()}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={getIconClasses()} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={getInputClasses()}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={getIconClasses()} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={getInputClasses()}
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Shield className={`w-5 h-5 transition-colors ${
                isDark ? "text-gray-500 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-blue-600"
              }`} />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className={`w-full py-3.5 pl-12 pr-4 rounded-xl text-sm font-medium transition-all duration-300 outline-none border-2 appearance-none cursor-pointer ${
                isDark 
                  ? "bg-gray-800/50 border-gray-700 text-white focus:bg-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20" 
                  : "bg-gray-50 border-transparent text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              }`}
            >
              <option value="user">User Account</option>
              <option value="seller">Seller Account</option>
              <option value="admin">Admin Account</option>
            </select>
            {/* Custom chevron for select */}
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full flex justify-center py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30 overflow-hidden transition-all"
            disabled={loading}
          >
            {/* Shine effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            
            <div className="flex items-center gap-2 relative z-10">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </motion.button>
        </motion.form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`text-center text-sm mt-8 font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 hover:underline transition-all">
            Sign In here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;
