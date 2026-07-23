import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import propertiesData from "../properties.json";
import ListingItem from "../ListingItem";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  Grid,
  List,
  Building2,
  Sparkles,
  MapPin,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Building,
  Home,
  RefreshCw,
  Star
} from "lucide-react";

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const location = useLocation();

  // Read initial search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchTerm(query);
  }, [location.search]);

  // Categories list
  const categories = ["All", "Apartment", "Villa", "Condo", "Luxury", "House"];
  
  // Property Types list
  const propertyTypes = ["All", "For Sale", "For Rent"];

  // Helper to parse numeric price from string e.g. "$3,500,000" -> 3500000
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const cleaned = priceStr.toString().replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // Filter and Sort properties
  const filteredAndSortedProperties = useMemo(() => {
    if (!propertiesData || propertiesData.length === 0) return [];

    // Filter out deleted and blocked properties
    let list = propertiesData.filter((p) => !p.deleted && !p.blocked);

    // 1. Search Query Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          (p?.title?.toLowerCase() || "").includes(q) ||
          (p?.location?.toLowerCase() || "").includes(q) ||
          (p?.description?.toLowerCase() || "").includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      list = list.filter((p) =>
        (p?.title?.toLowerCase() || "").includes(selectedCategory.toLowerCase())
      );
    }

    // 3. Property Type Filter
    if (selectedType !== "All") {
      list = list.filter((p) => {
        const typeStr = (p?.time || "").toLowerCase() + (p?.description || "").toLowerCase();
        if (selectedType === "For Rent") {
          return typeStr.includes("rent") || typeStr.includes("lease");
        }
        return !typeStr.includes("rent") && !typeStr.includes("lease");
      });
    }

    // 4. Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === "price-asc") {
        return parsePrice(a.price) - parsePrice(b.price);
      }
      if (sortBy === "price-desc") {
        return parsePrice(b.price) - parsePrice(a.price);
      }
      if (sortBy === "rating-desc") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "beds-desc") {
        return (b.beds || 0) - (a.beds || 0);
      }
      return 0;
    });

    return list;
  }, [searchTerm, selectedCategory, selectedType, sortBy]);

  // Reset all active filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedType("All");
    setSortBy("default");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "All" ||
    selectedType !== "All" ||
    sortBy !== "default";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans pb-20">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glowing background orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Verified Real Estate Listings</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Explore Featured Properties & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
                Luxury Estates
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Discover verified apartments, beachfront villas, and luxury penthouses with complete legal clarity.
            </p>
          </motion.div>

          {/* Interactive Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto relative"
          >
            <div className="relative flex items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-white/20 dark:border-slate-800">
              <Search className="w-6 h-6 text-slate-400 ml-4 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search by title, location (e.g. Miami, LA, NY)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-2 text-slate-800 dark:text-white bg-transparent focus:outline-none placeholder-slate-400 font-medium text-base sm:text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-2 mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Controls Card (Category Chips + Sort + Layout Toggle) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-200/80 dark:border-slate-800 mb-8"
        >
          {/* Top Bar: Category Chips */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Bar: Sorting & Status Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs sm:text-sm">
            {/* Type Filter */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-blue-500" />
                <span>Type:</span>
              </span>
              <div className="flex gap-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      selectedType === type
                        ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown & Reset */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="beds-desc">Most Bedrooms</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Counter & Badge */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">
              {filteredAndSortedProperties.length}{" "}
              {filteredAndSortedProperties.length === 1 ? "Property" : "Properties"} Available
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-4 h-4" />
            <span>100% Legal Clearance Verified</span>
          </div>
        </div>

        {/* Property Listings Container */}
        {filteredAndSortedProperties.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg my-8"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No Properties Found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
              We couldn't find any properties matching "{searchTerm || selectedCategory}". Try adjusting your filters or clear all parameters.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>
          </motion.div>
        ) : (
          /* Property Items Grid / List */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={
              viewMode === "grid"
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
                : "flex flex-col gap-6"
            }
          >
            {filteredAndSortedProperties.map((property) => (
              <motion.div key={property?.id} variants={itemVariants} className="h-full flex justify-center">
                <ListingItem property={property} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
