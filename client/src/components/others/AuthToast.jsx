import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, LogOut } from "lucide-react";

// Global auth notification — "Login Successful" / "Logout Successful"
// Renders at the top-center of the screen on every page
const AuthToast = () => {
  const { authToast } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const isLogin = authToast?.type === "login";

  return (
    <AnimatePresence>
      {authToast && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 pl-3.5 pr-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-bold ${
            isLogin
              ? isDark
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10"
                : "bg-white/95 border-emerald-300 text-emerald-600 shadow-emerald-500/20"
              : isDark
              ? "bg-blue-950/90 border-blue-500/30 text-blue-300 shadow-blue-500/10"
              : "bg-white/95 border-blue-300 text-blue-600 shadow-blue-500/20"
          }`}
        >
          {/* Icon with pop-in animation */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${
              isLogin
                ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/40"
                : "bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/40"
            }`}
          >
            {isLogin ? <CheckCircle2 size={16} /> : <LogOut size={15} />}
          </motion.div>
          {authToast.message}

          {/* Auto-hide progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3, ease: "linear" }}
            className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full origin-left ${
              isLogin ? "bg-emerald-500/50" : "bg-blue-500/50"
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthToast;
