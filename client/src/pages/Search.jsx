import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useContext, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/seller/ListingItem";
import propertiesData from "../components/seller/properties.json";
import { ThemeContext } from "../context/ThemeContext";
import {
  Search,
  Home,
  ArrowUpDown,
  X,
  SlidersHorizontal,
  BedDouble,
  Bath,
  Tag,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronDown,
  MapPin,
  LayoutGrid,
  List,
  Star,
  CheckCircle,
} from "lucide-react";

/* ─────────── Animation Variants ─────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, type: "spring", stiffness: 260, damping: 22 } },
  exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.38, type: "spring", stiffness: 200, damping: 22 } },
  exit: { opacity: 0, scale: 0.92, y: 30, transition: { duration: 0.25 } },
};

/* ─────────── Filter Pill ─────────── */
function FilterPill({ label, active, onClick, icon: Icon }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
        active
          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30"
          : isDark
          ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-500 hover:text-blue-400"
          : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"
      }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </motion.button>
  );
}

/* ─────────── Main Component ─────────── */
export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [selectedBeds, setSelectedBeds] = useState([]);
  const [selectedBaths, setSelectedBaths] = useState([]);
  const [listings, setListings] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const sortDropdownRef = useRef(null);

  /* ── Filter Logic ── */
  const filterListings = useCallback(
    (search, typeFilter, bedsFilter, bathsFilter, sort = sortOption) => {
      let filtered = propertiesData.filter((p) => {
        return (
          !p.deleted &&
          (search === "" ||
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.location?.toLowerCase().includes(search.toLowerCase())) &&
          (typeFilter.length === 0 || typeFilter.includes(p.status?.toLowerCase())) &&
          (bedsFilter.length === 0 || bedsFilter.includes(p.beds)) &&
          (bathsFilter.length === 0 || bathsFilter.includes(p.baths))
        );
      });
      if (sort === "priceLowToHigh") filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      else if (sort === "priceHighToLow") filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      else if (sort === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setListings(filtered);
    },
    [sortOption]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const term = urlParams.get("searchTerm") || "";
    setSearchTerm(term);
    setInputValue(term);
    const typeFilter = urlParams.get("type") ? urlParams.get("type").split(",") : [];
    const bedsFilter = urlParams.get("beds") ? urlParams.get("beds").split(",").map(Number) : [];
    const bathsFilter = urlParams.get("baths") ? urlParams.get("baths").split(",").map(Number) : [];
    setSelectedType(typeFilter);
    setSelectedBeds(bedsFilter);
    setSelectedBaths(bathsFilter);
    filterListings(term, typeFilter, bedsFilter, bathsFilter);
  }, [location.search, sortOption]);

  /* ── Close sort dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target))
        setShowSortDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(inputValue);
    updateURL(inputValue, selectedType, selectedBeds, selectedBaths);
  };

  const handleFilterChange = (filterType, value) => {
    let uType = selectedType, uBeds = selectedBeds, uBaths = selectedBaths;
    if (filterType === "type") {
      uType = selectedType.includes(value) ? selectedType.filter((t) => t !== value) : [...selectedType, value];
      setSelectedType(uType);
    } else if (filterType === "beds") {
      uBeds = selectedBeds.includes(value) ? selectedBeds.filter((b) => b !== value) : [...selectedBeds, value];
      setSelectedBeds(uBeds);
    } else if (filterType === "baths") {
      uBaths = selectedBaths.includes(value) ? selectedBaths.filter((b) => b !== value) : [...selectedBaths, value];
      setSelectedBaths(uBaths);
    }
    updateURL(inputValue, uType, uBeds, uBaths);
  };

  const updateURL = (term, type, beds, baths) => {
    const urlParams = new URLSearchParams();
    if (term) urlParams.set("searchTerm", term);
    if (type.length > 0) urlParams.set("type", type.join(","));
    if (beds.length > 0) urlParams.set("beds", beds.join(","));
    if (baths.length > 0) urlParams.set("baths", baths.join(","));
    navigate(`/search?${urlParams.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedType([]); setSelectedBeds([]); setSelectedBaths([]);
    setInputValue(""); setSearchTerm("");
    navigate("/search");
  };

  const activeFilterCount = selectedType.length + selectedBeds.length + selectedBaths.length;

  const sortLabels = {
    default: "Default",
    priceLowToHigh: "Price: Low → High",
    priceHighToLow: "Price: High → Low",
    newest: "Newest First",
  };
  const sortIcons = { default: Star, priceLowToHigh: TrendingUp, priceHighToLow: TrendingDown, newest: Clock };
  const SortIcon = sortIcons[sortOption] || Star;

  /* ── Reusable class helpers ── */
  const card = isDark
    ? "bg-gray-800 border border-gray-700 shadow-lg"
    : "bg-white border border-gray-200 shadow-md";

  const subtext = isDark ? "text-gray-400" : "text-gray-500";
  const heading = isDark ? "text-white" : "text-gray-800";
  const inputBg = isDark ? "bg-gray-800 text-white placeholder-gray-500 border-gray-700" : "bg-white text-gray-800 placeholder-gray-400 border-gray-200";
  const panelBg = isDark ? "bg-gray-900" : "bg-gray-50";
  const labelColor = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative overflow-hidden py-14 px-4 ${isDark ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-50 to-white"} border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}
      >
        {/* Animated blobs */}
        <motion.div
          className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)", filter: "blur(50px)" }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-40px] right-[-40px] w-60 h-60 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)", filter: "blur(50px)" }}
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-5"
          >
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">
              Verified Property Listings
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className={`text-4xl md:text-5xl font-extrabold mb-3 tracking-tight ${heading}`}
          >
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
              Dream Home
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className={`text-base md:text-lg max-w-xl mx-auto ${subtext}`}
          >
            Browse thousands of verified properties with smart filters and instant results.
          </motion.p>
        </div>
      </motion.div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-5"
        >
          <form onSubmit={handleSearch}>
            <div
              className={`flex items-center rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-md ${
                isSearchFocused
                  ? "border-blue-500 shadow-blue-500/20 shadow-lg"
                  : isDark ? "border-gray-700" : "border-gray-200"
              } ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center flex-1 px-5 py-3.5 gap-3">
                <motion.div animate={{ scale: isSearchFocused ? 1.15 : 1 }} transition={{ duration: 0.2 }}>
                  <Search className={`w-5 h-5 transition-colors ${isSearchFocused ? "text-blue-500" : subtext}`} />
                </motion.div>
                <input
                  type="text"
                  placeholder="Search by title, location or area..."
                  className={`flex-1 bg-transparent outline-none text-base ${inputBg} border-0`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {inputValue && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setInputValue("")}
                    className={`${subtext} hover:text-red-500 transition-colors`}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="m-2 px-7 py-3 rounded-xl text-white font-bold text-sm transition-all bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25"
              >
                Search
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* ── Controls Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 }}
          className="flex flex-wrap items-center justify-between gap-3 mb-5"
        >
          {/* Left: Filter toggle + quick pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 ${
                showFilters
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/25"
                  : isDark
                  ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 shadow-sm"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-white text-blue-600 text-xs font-extrabold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>

            <FilterPill label="For Sale" icon={Tag} active={selectedType.includes("for sale")} onClick={() => handleFilterChange("type", "for sale")} />
            <FilterPill label="For Rent" icon={Home} active={selectedType.includes("for rent")} onClick={() => handleFilterChange("type", "for rent")} />

            {activeFilterCount > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear all
              </motion.button>
            )}
          </div>

          {/* Right: View mode + sort */}
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className={`flex items-center rounded-xl overflow-hidden border ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : `${subtext} hover:text-blue-500`}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : `${subtext} hover:text-blue-500`}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <motion.button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 shadow-sm ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                <SortIcon className="w-4 h-4 text-blue-500" />
                <span className="hidden sm:inline">{sortLabels[sortOption]}</span>
                <span className="sm:hidden"><ArrowUpDown className="w-4 h-4" /></span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSortDropdown ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`absolute right-0 mt-2 w-52 rounded-2xl border overflow-hidden z-30 shadow-xl ${
                      isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    }`}
                  >
                    {[
                      { key: "default", label: "Default", Icon: Star },
                      { key: "priceLowToHigh", label: "Price: Low → High", Icon: TrendingUp },
                      { key: "priceHighToLow", label: "Price: High → Low", Icon: TrendingDown },
                      { key: "newest", label: "Newest First", Icon: Clock },
                    ].map(({ key, label, Icon }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortOption(key);
                          setShowSortDropdown(false);
                          if (key !== "default") setShowModal(true);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                          sortOption === key
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                            : isDark
                            ? "text-gray-300 hover:bg-gray-700/60 hover:text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                        {sortOption === key && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Advanced Filters Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mb-6"
            >
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 p-5 rounded-2xl border ${
                isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-md"
              }`}>
                {/* Property Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-blue-500" />
                    <h3 className={`font-bold text-sm uppercase tracking-wide ${labelColor}`}>Property Type</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["for sale", "for rent"].map((type) => (
                      <FilterPill
                        key={type}
                        label={type === "for sale" ? "For Sale" : "For Rent"}
                        active={selectedType.includes(type)}
                        onClick={() => handleFilterChange("type", type)}
                      />
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BedDouble className="w-4 h-4 text-blue-500" />
                    <h3 className={`font-bold text-sm uppercase tracking-wide ${labelColor}`}>Bedrooms</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((bed) => (
                      <FilterPill
                        key={bed}
                        label={`${bed}+`}
                        active={selectedBeds.includes(bed)}
                        onClick={() => handleFilterChange("beds", bed)}
                      />
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bath className="w-4 h-4 text-blue-500" />
                    <h3 className={`font-bold text-sm uppercase tracking-wide ${labelColor}`}>Bathrooms</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((bath) => (
                      <FilterPill
                        key={bath}
                        label={`${bath}+`}
                        active={selectedBaths.includes(bath)}
                        onClick={() => handleFilterChange("baths", bath)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results Header ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="flex items-center justify-between mb-5"
        >
          <div className="flex items-center gap-3">
            <h2 className={`text-2xl font-extrabold ${heading}`}>Listing Results</h2>
            <AnimatePresence mode="wait">
              <motion.span
                key={listings.length}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                {listings.length} found
              </motion.span>
            </AnimatePresence>
          </div>

          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-1.5 text-sm ${subtext}`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              Results for &quot;<span className="text-blue-500 font-semibold">{searchTerm}</span>&quot;
            </motion.div>
          )}
        </motion.div>

        {/* ── Listings Grid / List ── */}
        <AnimatePresence mode="wait">
          {listings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-5"
            >
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isDark ? "bg-gray-800 border border-gray-700" : "bg-blue-50 border border-blue-100"}`}
              >
                <Home className="w-10 h-10 text-blue-400" />
              </motion.div>
              <div className="text-center">
                <p className={`text-lg font-bold mb-1 ${heading}`}>No properties found</p>
                <p className={`text-sm ${subtext}`}>Try adjusting your search terms or filters</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25 transition-all"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {listings.map((property, index) => (
                <motion.div
                  key={property.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  custom={index}
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <ListingItem property={property} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Top Properties Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`w-full max-w-5xl max-h-[88vh] overflow-y-auto rounded-3xl border shadow-2xl ${
                isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
              }`}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 flex items-center justify-between px-6 py-5 border-b z-10 ${
                isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center shadow-md shadow-blue-500/25">
                    {sortOption === "priceLowToHigh" ? (
                      <TrendingUp className="w-5 h-5 text-white" />
                    ) : sortOption === "priceHighToLow" ? (
                      <TrendingDown className="w-5 h-5 text-white" />
                    ) : (
                      <Clock className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className={`text-lg font-extrabold leading-none ${heading}`}>Top 3 Properties</h2>
                    <p className={`text-xs mt-0.5 ${subtext}`}>
                      {sortOption === "priceLowToHigh"
                        ? "Most affordable picks"
                        : sortOption === "priceHighToLow"
                        ? "Premium luxury listings"
                        : "Latest arrivals"}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isDark ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <AnimatePresence>
                  {listings.length === 0 ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center py-12 ${subtext}`}>
                      No properties found.
                    </motion.p>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                      {listings.slice(0, 3).map((property, index) => (
                        <motion.div
                          key={property.id}
                          variants={cardVariants}
                          custom={index}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          className="relative"
                        >
                          {/* Rank badge */}
                          <div
                            className={`absolute top-2 left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white shadow-md`}
                            style={{
                              background:
                                index === 0
                                  ? "linear-gradient(135deg,#f59e0b,#d97706)"
                                  : index === 1
                                  ? "linear-gradient(135deg,#9ca3af,#6b7280)"
                                  : "linear-gradient(135deg,#b45309,#92400e)",
                            }}
                          >
                            #{index + 1}
                          </div>
                          <ListingItem property={property} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}