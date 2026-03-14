import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const handleSubscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
    setEmail("");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes float-up {
          0% { transform: translateY(0px) scale(0.8); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-80px) scale(0.3); opacity: 0; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #C9A84C 0%, #F5D78E 30%, #fff8e1 50%, #F5D78E 70%, #C9A84C 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%);
          animation: float-up linear infinite;
          pointer-events: none;
        }
      `}</style>

      <div ref={ref} className="relative w-full flex justify-center px-4 my-10">

        {/* Outer glow halo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)",
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative w-full max-w-2xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0e0e16 0%, #13131f 60%, #0a0a12 100%)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: 20,
            boxShadow: "0 0 60px rgba(212,175,55,0.06), 0 20px 60px rgba(0,0,0,0.5)",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {/* Particles */}
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                width: 4 + (i % 3) * 3,
                height: 4 + (i % 3) * 3,
                left: `${10 + i * 11}%`,
                bottom: 0,
                animationDuration: `${3 + i * 0.6}s`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}

          {/* Top shimmer border */}
          <motion.div
            className="absolute top-0 left-0 w-full h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.9), #D4AF37, rgba(212,175,55,0.9), transparent)",
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Corner decorations */}
          {[
            { top: 16, left: 16, rotate: 0 },
            { top: 16, right: 16, rotate: 90 },
            { bottom: 16, right: 16, rotate: 180 },
            { bottom: 16, left: 16, rotate: 270 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{ ...pos, width: 16, height: 16, opacity: 0.4 }}
            >
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ transform: `rotate(${pos.rotate}deg)`, width: "100%", height: "100%" }}>
                <path d="M1 15V1H15" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          ))}

          <div className="relative z-10 px-8 py-10 flex flex-col items-center text-center">

            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-4">
              <span
                className="text-xs tracking-[0.35em] uppercase px-4 py-1.5 rounded-full"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  color: "rgba(212,175,55,0.7)",
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.3em",
                }}
              >
                ✦ Exclusive Access ✦
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={itemVariants}
              className="shimmer-text text-3xl font-bold mb-1"
              style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}
            >
              Find Your Dream Home
            </motion.h2>

            {/* Sub heading */}
            <motion.p
              variants={itemVariants}
              className="text-sm mb-1"
              style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Cinzel', serif", letterSpacing: "0.2em" }}
            >
              — HOMYZ REALTY —
            </motion.p>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base italic mb-7"
              style={{ color: "rgba(200,185,140,0.55)", maxWidth: 420, lineHeight: 1.7 }}
            >
              Subscribe to receive exclusive property listings, premium price quotes, and curated residences handpicked just for you.
            </motion.p>

            {/* Input row */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
            >
              {/* Email input */}
              <div className="relative flex-1">
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  animate={focused ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    boxShadow: "0 0 0 1px rgba(212,175,55,0.5), 0 0 20px rgba(212,175,55,0.1)",
                    borderRadius: 8,
                  }}
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  className="w-full px-4 py-3 text-sm outline-none rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    color: "rgba(245,215,142,0.9)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 15,
                    letterSpacing: "0.03em",
                    transition: "border-color 0.3s",
                    borderColor: focused ? "rgba(212,175,55,0.5)" : "rgba(212,175,55,0.2)",
                  }}
                />
              </div>

              {/* Submit button */}
              <motion.button
                onClick={handleSubscribe}
                disabled={status === "loading" || status === "success"}
                whileHover={status === "idle" || status === "error" ? { scale: 1.04 } : {}}
                whileTap={status === "idle" || status === "error" ? { scale: 0.97 } : {}}
                className="relative px-6 py-3 rounded-lg text-sm font-semibold overflow-hidden"
                style={{
                  background: status === "success"
                    ? "linear-gradient(135deg, #2d6a4f, #40916c)"
                    : "linear-gradient(135deg, #C9A84C 0%, #D4AF37 50%, #9A7B2C 100%)",
                  color: status === "success" ? "#d8f3dc" : "#0a0a12",
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.1em",
                  border: "none",
                  cursor: status === "loading" || status === "success" ? "default" : "pointer",
                  minWidth: 130,
                  transition: "background 0.4s ease",
                  boxShadow: status === "success"
                    ? "0 0 20px rgba(64,145,108,0.4)"
                    : "0 0 20px rgba(212,175,55,0.25), 0 4px 15px rgba(0,0,0,0.3)",
                }}
              >
                {/* Button shimmer sweep */}
                {(status === "idle" || status === "error") && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                      backgroundSize: "200% 100%",
                    }}
                    animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                )}

                <AnimatePresence mode="wait">
                  {status === "loading" && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-current"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                        />
                      ))}
                    </motion.div>
                  )}
                  {status === "success" && (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    >
                      ✓ Subscribed
                    </motion.span>
                  )}
                  {(status === "idle" || status === "error") && (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Get Started
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* Status messages */}
            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 text-xs"
                  style={{ color: "rgba(255,100,100,0.8)", fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}
                >
                  ✕ Please enter a valid email address
                </motion.p>
              )}
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 text-xs"
                  style={{ color: "rgba(100,220,130,0.8)", fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}
                >
                  ✓ Welcome aboard! Check your inbox for exclusive listings.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Privacy note */}
            <motion.p
              variants={itemVariants}
              className="mt-5 text-xs"
              style={{ color: "rgba(212,175,55,0.2)", letterSpacing: "0.08em" }}
            >
              No spam. Unsubscribe anytime. Your privacy is sacred.
            </motion.p>
          </div>

          {/* Bottom shimmer */}
          <div
            className="absolute bottom-0 left-0 w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" }}
          />
        </motion.div>
      </div>
    </>
  );
};

export default SubscribeSection;