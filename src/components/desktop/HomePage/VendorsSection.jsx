"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Camera,
  Brush,
  UserCheck,
  ArrowRight,
  Sparkles,
  Music,
  Drum,
  Mic,
  Sparkles as Fireworks,
  Users2,
  Palette,
  Utensils,
  Shirt,
  HandHeart,
  Cake,
  Gem,
  MailOpen,
  Disc,
  Scissors,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import MobileStyleVendorCard from "./../ui/vendor/VendorCard";

const categoryMap = {
  All: null,
  Venues: "venues",
  Photographers: "photographers",
  Decorators: "decorators",
  Planners: "planners",
  Makeup: "makeup",
  Catering: "catering",
  Clothes: "clothes",
  Mehendi: "mehendi",
  Cakes: "cakes",
  Jewellery: "jewellery",
  Invitations: "invitations",
  DJs: "djs",
  Hairstyling: "hairstyling",
  Dhol: "dhol",
  Anchor: "anchor",
  "Stage Entry": "stage-entry",
  Fireworks: "fireworks",
  Barat: "barat",
};

const filters = [
  { label: "All", icon: <Sparkles size={18} />, gradient: "from-amber-500 to-orange-500" },
  { label: "Venues", icon: <MapPin size={18} />, gradient: "from-emerald-500 to-teal-600" },
  { label: "Photographers", icon: <Camera size={18} />, gradient: "from-blue-500 to-indigo-600" },
  { label: "Decorators", icon: <Brush size={18} />, gradient: "from-rose-500 to-pink-600" },
  { label: "Planners", icon: <UserCheck size={18} />, gradient: "from-amber-500 to-orange-600" },
  { label: "Makeup", icon: <Palette size={18} />, gradient: "from-pink-500 to-rose-600" },
  { label: "Catering", icon: <Utensils size={18} />, gradient: "from-orange-500 to-amber-600" },
  { label: "Clothes", icon: <Shirt size={18} />, gradient: "from-purple-500 to-indigo-600" },
  { label: "Mehendi", icon: <HandHeart size={18} />, gradient: "from-red-500 to-pink-600" },
  { label: "Cakes", icon: <Cake size={18} />, gradient: "from-yellow-500 to-orange-600" },
  { label: "Jewellery", icon: <Gem size={18} />, gradient: "from-emerald-500 to-teal-600" },
  { label: "Invitations", icon: <MailOpen size={18} />, gradient: "from-blue-500 to-cyan-600" },
  { label: "DJs", icon: <Disc size={18} />, gradient: "from-violet-500 to-purple-600" },
  { label: "Hairstyling", icon: <Scissors size={18} />, gradient: "from-teal-500 to-green-600" },
  { label: "Dhol", icon: <Drum size={18} />, gradient: "from-purple-500 to-violet-600" },
  { label: "Anchor", icon: <Mic size={18} />, gradient: "from-cyan-500 to-blue-600" },
  { label: "Stage Entry", icon: <Music size={18} />, gradient: "from-pink-500 to-rose-600" },
  { label: "Fireworks", icon: <Fireworks size={18} />, gradient: "from-orange-500 to-red-600" },
  { label: "Barat", icon: <Users2 size={18} />, gradient: "from-indigo-500 to-purple-600" },
];

const CollapsibleFilters = ({ activeFilter, setActiveFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleCount = 8;
  const visibleFilters = isExpanded ? filters : filters.slice(0, visibleCount);
  const hasMore = filters.length > visibleCount;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {visibleFilters.map((filter, index) => (
            <motion.button
              key={filter.label}
              onClick={() => setActiveFilter(filter.label)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                activeFilter === filter.label
                  ? "text-white shadow-lg scale-105"
                  : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50"
              }`}
              whileHover={{ scale: activeFilter === filter.label ? 1.05 : 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              {activeFilter === filter.label && (
                <motion.div
                  layoutId="activeFilterBg"
                  className={`absolute inset-0 bg-gradient-to-r ${filter.gradient} rounded-xl`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {filter.icon}
                {filter.label}
              </span>
            </motion.button>
          ))}

          {hasMore && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: visibleCount * 0.03 }}
            >
              <span className="flex items-center gap-2">
                {isExpanded ? "Show Less" : `+${filters.length - visibleCount} More`}
                <ChevronDown size={16} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
    <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-20" />
      </div>
    </div>
  </div>
);

const EmptyState = ({ message, description }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="col-span-full flex flex-col items-center justify-center py-20"
  >
    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
      <AlertCircle size={40} className="text-gray-400 dark:text-gray-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{message}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">{description}</p>
  </motion.div>
);

const ViewAllCard = () => (
  <Link href="/vendors/marketplace">
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer group transition-all duration-300"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <ArrowRight size={32} className="text-white group-hover:translate-x-1 transition-transform" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">View All Vendors</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Discover more amazing professionals
      </p>
    </motion.div>
  </Link>
);

export default function VendorsCatSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [vendorsData, setVendorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError(null);

        const category = categoryMap[activeFilter];
        const queryParams = new URLSearchParams();
        queryParams.set("landing", "true");
        queryParams.set("limit", "11");

        if (category) queryParams.set("categories", category);

        const response = await fetch(`/api/vendor?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }

        const result = await response.json();

        if (result.success) {
          setVendorsData(result.data || []);
        } else {
          throw new Error(result.message || "Failed to fetch vendors");
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError(err.message);
        setVendorsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [activeFilter]);

  const displayVendors = vendorsData.slice(0, 11);

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden !pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-5 py-2 rounded-full text-sm font-bold mb-6"
          >
            <Sparkles size={16} />
            Premium Event Partners
          </motion.span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            Discover Elite
            <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Event Professionals
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Connect with our carefully curated network of top-tier vendors who will bring your dream event to life
          </p>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <CollapsibleFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </motion.div>
          ) : error ? (
            <EmptyState
              message="Unable to Load Vendors"
              description="Something went wrong while fetching vendors. Please try again later."
            />
          ) : displayVendors.length === 0 ? (
            <EmptyState
              message="No Vendors Found"
              description="Try adjusting your filters or check back later for new vendors in this category."
            />
          ) : (
            <motion.div
              key="vendors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {displayVendors.map((vendor, index) => (
                <motion.div
                  key={vendor._id || vendor.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <MobileStyleVendorCard vendor={vendor} />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: displayVendors.length * 0.05 }}
              >
                <ViewAllCard />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link href="/vendors/marketplace">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Sparkles size={20} />
              Explore All Premium Vendors
              <ArrowRight size={20} />
            </motion.button>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
            Join 10,000+ satisfied customers who found their perfect vendors
          </p>
        </motion.div>
      </div>
    </section>
  );
}