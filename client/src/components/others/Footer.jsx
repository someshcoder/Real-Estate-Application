import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const SOCIAL_LINKS = [
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/bhatnagarsomesh/",
    label: "Instagram",
    gradient: "from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    glow: "rgba(238,42,123,0.6)",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/somesh-bhatnagar-18b388328/",
    label: "LinkedIn",
    gradient: "from-[#0077b5] to-[#00a0dc]",
    glow: "rgba(0,119,181,0.6)",
  },
  {
    icon: FaGithub,
    href: "https://github.com/someshcoder",
    label: "GitHub",
    gradient: "from-[#6e5494] to-[#24292e]",
    glow: "rgba(110,84,148,0.6)",
  },
];

const FloatingParticle = ({ delay, x, size }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      bottom: 0,
      background: "radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)",
    }}
    animate={{
      y: [0, -120, -200],
      opacity: [0, 0.8, 0],
      scale: [0.5, 1, 0.3],
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const SocialIcon = ({ icon: Icon, href, label, gradient, glow }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, scale: 1.15 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="relative flex items-center justify-center"
      style={{ width: 52, height: 52 }}
    >
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={hovered ? { opacity: 1, scale: 1.3 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      {/* Icon container */}
      <div
        className={`relative z-10 flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br ${gradient}`}
        style={{
          boxShadow: hovered
            ? `0 0 20px ${glow}, 0 4px 20px rgba(0,0,0,0.4)`
            : "0 2px 10px rgba(0,0,0,0.3)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <Icon className="text-white" size={22} />
      </div>

      {/* Tooltip */}
      <motion.span
        className="absolute -top-9 left-1/2 -translate-x-1/2 text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
        style={{
          background: "rgba(212,175,55,0.15)",
          border: "1px solid rgba(212,175,55,0.3)",
          color: "#D4AF37",
          backdropFilter: "blur(8px)",
          fontFamily: "'Cormorant Garamond', serif",
          letterSpacing: "0.05em",
        }}
        animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </motion.a>
  );
};

const GoldDivider = () => (
  <div className="flex items-center gap-4 w-full max-w-xl mx-auto my-3">
    <motion.div
      className="flex-1 h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6))" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    />
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ color: "#D4AF37", fontSize: 16 }}
    >
      ◆
    </motion.div>
    <motion.div
      className="flex-1 h-px"
      style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.6), transparent)" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    />
  </div>
);

const Footer = ({ companyName }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const particles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.4,
    x: (i / 12) * 100 + Math.random() * 8,
    size: 4 + Math.random() * 6,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');
      `}</style>

      <footer
        ref={ref}
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0a0a0f 0%, #111118 40%, #0d0d15 100%)",
          borderTop: "1px solid rgba(212,175,55,0.2)",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {/* Ambient background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "150px",
            mixBlendMode: "overlay",
          }}
        />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        {/* Top shimmer line */}
        <motion.div
          className="absolute top-0 left-0 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.8) 30%, #D4AF37 50%, rgba(212,175,55,0.8) 70%, transparent 100%)",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-8 py-6 flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Logo / Brand mark */}
          <motion.div variants={itemVariants} className="mb-2">
            <motion.div
              className="text-4xl font-bold tracking-[0.3em] uppercase"
              style={{
                fontFamily: "'Cinzel', serif",
                background: "linear-gradient(135deg, #C9A84C 0%, #F5D78E 40%, #D4AF37 60%, #9A7B2C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                filter: "drop-shadow(0 0 20px rgba(212,175,55,0.3))",
              }}
              animate={{ filter: ["drop-shadow(0 0 10px rgba(212,175,55,0.2))", "drop-shadow(0 0 25px rgba(212,175,55,0.5))", "drop-shadow(0 0 10px rgba(212,175,55,0.2))"] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              REALTY
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-xs tracking-[0.5em] uppercase mb-2"
            style={{ color: "rgba(212,175,55,0.5)", fontFamily: "'Cinzel', serif" }}
          >
            Luxury Estates & Premium Spaces
          </motion.p>

          <GoldDivider />

          {/* Social icons */}
          <motion.div variants={itemVariants} className="flex gap-6 mb-4">
            {SOCIAL_LINKS.map((s) => (
              <SocialIcon key={s.label} {...s} />
            ))}
          </motion.div>

          {/* College / institution tag */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-4 px-6 py-2 rounded-full"
            style={{
              background: "rgba(212,175,55,0.05)",
              border: "1px solid rgba(212,175,55,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ color: "rgba(212,175,55,0.4)", fontSize: 10, letterSpacing: "0.15em" }}>✦</span>
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "rgba(212,175,55,0.55)", fontFamily: "'Cinzel', serif" }}
            >
              An Original Creation by Somesh Bhatnagar
            </span>
            <span style={{ color: "rgba(212,175,55,0.4)", fontSize: 10, letterSpacing: "0.15em" }}>✦</span>
          </motion.div>

          {/* Built by line */}
          <motion.p
            variants={itemVariants}
            className="text-sm italic mb-2 text-center"
            style={{ color: "rgba(200,180,120,0.5)", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.05em" }}
          >
            Crafted with passion by{" "}
            <motion.span
              style={{ color: "rgba(212,175,55,0.8)" }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {companyName || "Somesh & Team"}
            </motion.span>
          </motion.p>

          {/* Copyright */}
          <motion.p
            variants={itemVariants}
            className="text-xs tracking-widest"
            style={{ color: "rgba(212,175,55,0.25)", fontFamily: "'Cinzel', serif", letterSpacing: "0.2em" }}
          >
            © {new Date().getFullYear()} &nbsp;·&nbsp; ALL RIGHTS RESERVED
          </motion.p>
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.1), transparent)" }}
        />
      </footer>
    </>
  );
};

export default Footer;