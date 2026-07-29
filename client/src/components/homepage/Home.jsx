import { motion, AnimatePresence } from "framer-motion";
import AdminDashboard from "../../pages/AdminDashboard";
import SearchFilter from "../../pages/Search";
import SellerDashboard from "../../pages/SellerDashboard";
import UserDashboard from "../../pages/UserDashboard";
import Footer from "../others/Footer";
import SubscribeSection from "../others/SubscribeSection";
import Value from "../others/Value";
import PropertyList from "../seller/propertyList";
import Header from "./Header";
import HeroSection from "./HeroSection";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import Animated from "../others/Animated";
import propertiesData from "../seller/properties.json";
import {
  CheckCircle,
  Home,
  Star,
  Flame,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  Sparkles,
  X,
  ShieldCheck
} from "lucide-react";

const TrendingProperties = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const containerRef = useRef(null);

  // Active trending properties (exclude deleted and blocked)
  const trendingProperties = useMemo(() => {
    return propertiesData
      .filter((property) => !property.deleted && !property.blocked)
      .slice(0, 8)
      .map((property, index) => ({
        id: property.id ?? `prop-${index}`,
        _listKey: `trending-${index}-${property.id ?? index}`,  // unique render key
        title: property.title || "Modern Apartment",
        image:
          property.image ||
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070",
        location: property.location || "Prime Metropolitan Hub",
        price: property.price || "$1,500,000",
        beds: property.beds || 3,
        baths: property.baths || 2,
        size: property.size || "1,800 sqft",
        rating: property.rating || 4.8,
        description:
          property.description ||
          "A stunning property with modern architectural amenities, verified legal status, and premier location.",
      }));
  }, []);

  const scrollSlider = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 350;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const cleanPrice = (priceStr) => {
    if (!priceStr) return "N/A";
    return priceStr.toString().replace("$", "").replace(",", "");
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/60 transition-colors duration-300 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 fill-orange-500 animate-bounce" />
              <span>High Demand Real Estate</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trending Properties
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">
              Hand-picked luxury homes and high-yield properties trending this week.
            </p>
          </div>

          {/* Slider Left / Right Buttons */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => scrollSlider("left")}
              aria-label="Previous Property"
              className="p-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-200 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollSlider("right")}
              aria-label="Next Property"
              className="p-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-200 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Slider Container */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 no-scrollbar"
        >
          {trendingProperties.map((property, index) => (
            <motion.div
              key={property._listKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="min-w-[300px] sm:min-w-[340px] max-w-[340px] shrink-0 snap-start bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700 overflow-hidden cursor-pointer flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl"
              onClick={() => setSelectedProperty(property)}
            >
              <div>
                {/* Image Showcase */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
                      <Flame className="w-3 h-3 fill-white" />
                      TRENDING
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-white/20">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {property.rating}
                    </span>
                  </div>

                  {/* Location Pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-semibold bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span className="truncate max-w-[200px]">{property.location}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {property.title}
                  </h3>

                  {/* Features Quick Specs */}
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 my-3">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-slate-400" />
                      {property.beds} Beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-slate-400" />
                      {property.baths} Baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-slate-400" />
                      {property.size}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Price & CTA */}
              <div className="p-5 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Price</span>
                  <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                    ₹{cleanPrice(property.price)}
                  </span>
                </div>

                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Details →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Property Details Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProperty(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                onClick={() => setSelectedProperty(null)}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative rounded-2xl overflow-hidden mb-4 h-60">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  TRENDING ESTATE
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedProperty.title}
                </h3>
                <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  ₹{cleanPrice(selectedProperty.price)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{selectedProperty.location}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 mb-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bedrooms</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{selectedProperty.beds} Beds</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bathrooms</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{selectedProperty.baths} Baths</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Area</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{selectedProperty.size}</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {selectedProperty.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={`/property/${selectedProperty.id}`}
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-center font-bold shadow-lg shadow-blue-500/25 transition-all text-sm"
                >
                  View Full Details
                </Link>
                <Link
                  to={`/payment/${selectedProperty.id}`}
                  className="py-3 px-4 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-center font-bold transition-all text-sm"
                >
                  Buy Now
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // Get theme state

  useEffect(() => {
    // Filter out deleted properties to ensure they don't show up anywhere
    const activeProperties = propertiesData.filter((property) => !property.deleted);
    // No state update needed since TrendingProperties uses propertiesData directly
  }, []);

  // Animation variants for why choose us cards
  const benefitVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.7,
        type: "spring",
        stiffness: 120,
      },
    }),
  };

  // Data for Why Choose Us section
  const benefits = [
    {
      id: 1,
      title: "Trusted Expertise",
      description: "Our team of experienced agents ensures you find the perfect property with confidence.",
      icon: <CheckCircle className="w-12 h-12 text-blue-600" />,
    },
    {
      id: 2,
      title: "Exclusive Properties",
      description: "Access a curated selection of premium homes you won’t find anywhere else.",
      icon: <Home className="w-12 h-12 text-blue-600" />,
    },
    {
      id: 3,
      title: "Seamless Experience",
      description: "From search to closing, enjoy a smooth and hassle-free home-buying journey.",
      icon: <Star className="w-12 h-12 text-blue-600" />,
    },
  ];

  return (
    <div
      className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen`}
    >
      {/* Header */}
      <Header />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <HeroSection />
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 px-4 bg-gradient-to-br from-blue-50 to-gray-100"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-blue-600 text-center mb-4"
          >
            Your Dream Home Awaits
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10"
          >
            Why Choose Us
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.id}
                custom={index}
                variants={benefitVariants}
                initial="hidden"
                whileInView="visible"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.2)",
                  borderColor: "#2563eb",
                  transition: { duration: 0.3 },
                }}
                viewport={{ once: true }}
                className="bg-white text-gray-800 rounded-xl shadow-lg p-6 text-center border border-transparent"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-4"
                >
                  {benefit.icon}
                </motion.div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
                <Link
                  to="/about"
                  className="mt-4 inline-block text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                >
                  Learn More
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <TrendingProperties />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Value />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <SubscribeSection />
      </motion.div>

      <Footer companyName="Somesh and It Team Real Estate Project" />
    </div>
  );
};

export default HomePage;