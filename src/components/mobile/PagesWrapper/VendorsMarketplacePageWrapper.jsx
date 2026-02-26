"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  memo,
  Suspense,
  startTransition,
  useReducer,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Users,
  Heart,
  ImageIcon,
  X,
  Search,
  Sparkles,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  SlidersHorizontal,
  LayoutList,
  LayoutGrid,
  ShoppingCart,
  CheckCircle,
  Map as MapIcon,
  ArrowRightLeft,
  Tag,
  Clock,
  Phone,
  Share2,
  Bookmark,
  RefreshCw,
  ChevronDown,
  Zap,
  Calendar,
  Info,
  Eye,
  MessageCircle,
  Navigation,
  Filter,
  Grid3X3,
  ArrowUp,
  Copy,
  Check,
  Percent,
  Gift,
  ThumbsUp,
  Camera,
  Music,
  Utensils,
  Scissors,
  Crown,
  Building,
  Palette,
  MoreHorizontal,
  ExternalLink,
  AlertCircle,
  BarChart3,
  Trophy,
  Flame,
  BadgeCheck,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCartStore } from "../../../GlobalState/CartDataStore";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";
import { useUser } from "@clerk/clerk-react";
import { set } from "mongoose";
import SmartMedia from "../SmartMediaLoader";
import { toast } from "sonner";
import Image from "next/image";
import CompareModal from "../CompareModalMobile";
import LeadCaptureModalMobile from "../LeadCaptureModal";
import { useAppValuesStore } from "../../../GlobalState/AppValuesStore";

// =============================================================================
// CONSTANTS
// =============================================================================
const COLORS = {
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  primaryDark: "#1d4ed8",
  secondary: "#f59e0b",
  secondaryLight: "#fbbf24",
  success: "#10b981",
  successLight: "#34d399",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#06b6d4",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

const SPRING_CONFIG = {
  stiff: { type: "spring", stiffness: 400, damping: 30 },
  gentle: { type: "spring", stiffness: 200, damping: 25 },
  bouncy: { type: "spring", stiffness: 300, damping: 20 },
  smooth: { type: "spring", stiffness: 150, damping: 20 },
};

const TRANSITION = {
  fast: { duration: 0.15 },
  normal: { duration: 0.25 },
  slow: { duration: 0.4 },
  spring: SPRING_CONFIG.gentle,
};

const VENDOR_CATEGORIES = [
  { id: "venues", label: "Venues", icon: Building, emoji: "🏛️", color: "#8b5cf6" },
  { id: "photographers", label: "Photo", icon: Camera, emoji: "📷", color: "#ec4899" },
  { id: "makeup", label: "Makeup", icon: Palette, emoji: "💄", color: "#f43f5e" },
  { id: "planners", label: "Planners", icon: Calendar, emoji: "📋", color: "#06b6d4" },
  { id: "catering", label: "Catering", icon: Utensils, emoji: "🍽️", color: "#f97316" },
  { id: "clothes", label: "Clothes", icon: Crown, emoji: "👗", color: "#a855f7" },
  { id: "mehendi", label: "Mehendi", icon: Scissors, emoji: "🖐️", color: "#84cc16" },
  { id: "djs", label: "DJs", icon: Music, emoji: "🎵", color: "#3b82f6" },
];

const SUBCATEGORIES = {
  venues: [
    { id: "banquet-halls", label: "Banquet Halls" },
    { id: "farmhouses", label: "Farmhouses" },
    { id: "hotels", label: "Hotels" },
    { id: "resorts", label: "Resorts" },
    { id: "lawns", label: "Lawns & Gardens" },
    { id: "destination", label: "Destination Wedding" },
    { id: "beach", label: "Beach Venues" },
    { id: "palace", label: "Palace & Heritage" },
  ],
  photographers: [
    { id: "wedding-photography", label: "Wedding Photography" },
    { id: "pre-wedding", label: "Pre-Wedding Shoot" },
    { id: "candid", label: "Candid Photography" },
    { id: "traditional", label: "Traditional Photography" },
    { id: "videography", label: "Videography" },
    { id: "drone", label: "Drone Photography" },
    { id: "album", label: "Album Design" },
    { id: "photobooth", label: "Photo Booth" },
  ],
  makeup: [
    { id: "bridal-makeup", label: "Bridal Makeup" },
    { id: "party-makeup", label: "Party Makeup" },
    { id: "airbrush", label: "Airbrush Makeup" },
    { id: "hd-makeup", label: "HD Makeup" },
    { id: "engagement", label: "Engagement Look" },
    { id: "reception", label: "Reception Look" },
    { id: "hair-styling", label: "Hair Styling" },
    { id: "draping", label: "Saree Draping" },
  ],
  planners: [
    { id: "full-planning", label: "Full Planning" },
    { id: "partial-planning", label: "Partial Planning" },
    { id: "day-coordination", label: "Day Coordination" },
    { id: "destination-planning", label: "Destination Planning" },
    { id: "budget-planning", label: "Budget Planning" },
    { id: "vendor-management", label: "Vendor Management" },
    { id: "guest-management", label: "Guest Management" },
    { id: "theme-design", label: "Theme Design" },
  ],
  catering: [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "non-vegetarian", label: "Non-Vegetarian" },
    { id: "multi-cuisine", label: "Multi-Cuisine" },
    { id: "south-indian", label: "South Indian" },
    { id: "north-indian", label: "North Indian" },
    { id: "chinese", label: "Chinese & Oriental" },
    { id: "continental", label: "Continental" },
    { id: "live-counters", label: "Live Counters" },
  ],
  clothes: [
    { id: "bridal-lehenga", label: "Bridal Lehenga" },
    { id: "groom-sherwani", label: "Groom Sherwani" },
    { id: "designer-wear", label: "Designer Wear" },
    { id: "rental", label: "Rental Services" },
    { id: "accessories", label: "Accessories" },
    { id: "jewelry", label: "Jewelry" },
    { id: "footwear", label: "Footwear" },
    { id: "trousseau", label: "Trousseau Packing" },
  ],
  mehendi: [
    { id: "bridal-mehendi", label: "Bridal Mehendi" },
    { id: "arabic", label: "Arabic Design" },
    { id: "rajasthani", label: "Rajasthani Design" },
    { id: "portrait", label: "Portrait Mehendi" },
    { id: "minimal", label: "Minimal Design" },
    { id: "glitter", label: "Glitter Mehendi" },
    { id: "white-henna", label: "White Henna" },
    { id: "nail-art", label: "Nail Art" },
  ],
  djs: [
    { id: "wedding-dj", label: "Wedding DJ" },
    { id: "sangeet-dj", label: "Sangeet DJ" },
    { id: "cocktail", label: "Cocktail Party" },
    { id: "live-band", label: "Live Band" },
    { id: "dhol", label: "Dhol Players" },
    { id: "sound-system", label: "Sound System" },
    { id: "lighting", label: "Lighting & Effects" },
    { id: "anchoring", label: "Anchoring & Emcee" },
  ],
};

const SORT_OPTIONS = [
  { id: "rating", label: "Top Rated", icon: Star, description: "Highest rated first" },
  { id: "price-asc", label: "Budget", icon: DollarSign, description: "Lowest price first" },
  { id: "price-desc", label: "Premium", icon: Crown, description: "Highest price first" },
  { id: "bookings", label: "Popular", icon: TrendingUp, description: "Most booked" },
  { id: "newest", label: "New", icon: Zap, description: "Recently added" },
  { id: "reviews", label: "Reviews", icon: MessageCircle, description: "Most reviewed" },
];

const COMPARE_FEATURES = [
  { key: "rating", label: "Rating", icon: Star, format: (v) => `${(v || 0).toFixed(1)}/5`, higher: true },
  { key: "price", label: "Price", icon: DollarSign, format: (v) => `₹${formatPrice(v || 0)}`, higher: false },
  { key: "reviews", label: "Reviews", icon: MessageCircle, format: (v) => v || 0, higher: true },
  { key: "bookings", label: "Bookings", icon: TrendingUp, format: (v) => v || 0, higher: true },
  { key: "capacity", label: "Capacity", icon: Users, format: (v) => (v ? `${v}` : "-"), higher: true },
  { key: "response", label: "Response", icon: Clock, format: (v) => v || "Fast", higher: null },
];

const CITY_COORDS = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Goa: { lat: 15.2993, lng: 74.124 },
};

const DEFAULT_CENTER = CITY_COORDS.Delhi;
const ITEMS_PER_PAGE = 12;
const MAX_COMPARE_ITEMS = 3;
const DEBOUNCE_DELAY = 350;
const MAX_RECENT_SEARCHES = 5;

// =============================================================================
// CUSTOM HOOKS
// =============================================================================
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);
  const isHydratingRef = useRef(false); // 🔥 ADD: Prevent double hydration

  useEffect(() => {
    if (isHydratingRef.current) return;
    isHydratingRef.current = true;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        setStoredValue(parsed);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsHydrated(true);
      isHydratingRef.current = false;
    }
  }, [key]);

  const setValue = useCallback(
    (value) => {
      setStoredValue((prevValue) => {
        const valueToStore = value instanceof Function ? value(prevValue) : value;

        // 🔥 CRITICAL: Only write if hydrated
        if (isHydrated) {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
          }
        }
        return valueToStore;
      });
    },
    [key, isHydrated], // 🔥 ADD: isHydrated dependency
  );

  return [storedValue, setValue, isHydrated];
}

function useInView(options = {}) {
  const ref = useRef(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenInView) setHasBeenInView(true);
      },
      { threshold: 0.1, ...options },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options, hasBeenInView]);

  return { ref, hasBeenInView };
}

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = {
        light: 10,
        medium: 25,
        heavy: 50,
        success: [10, 50, 10],
        error: [50, 30, 50],
      };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const lastScrollY = useRef(0);
  const rafId = useRef(null); // 🔥 ADD: RAF for performance

  useEffect(() => {
    const handleScroll = () => {
      // 🔥 CRITICAL: Use RAF to batch updates
      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setScrollDirection(currentScrollY > lastScrollY.current ? "down" : "up");
        lastScrollY.current = currentScrollY;
        setScrollY(currentScrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current); // 🔥 Cleanup RAF
      lastScrollY.current = 0; // 🔥 Reset ref
    };
  }, []);

  return { scrollY, scrollDirection };
}

function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return isOnline;
}

function useDoubleTap(callback, delay = 300) {
  const lastTap = useRef(0);
  return useCallback(
    (event) => {
      const now = Date.now();
      if (now - lastTap.current < delay) callback(event);
      lastTap.current = now;
    },
    [callback, delay],
  );
}
function usePullToRefresh(onRefresh, threshold = 80) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const isMountedRef = useRef(true); // 🔥 ADD: Mount tracking

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!isPulling.current || isRefreshing) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      if (diff > 0) setPullDistance(Math.min(diff * 0.5, threshold * 1.5));
    },
    [isRefreshing, threshold],
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing && isMountedRef.current) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        if (isMountedRef.current) setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    isPulling.current = false;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    isMountedRef.current = true;

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      isMountedRef.current = false; // 🔥 CRITICAL: Prevent state updates
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);

      // 🔥 CRITICAL: Reset all refs
      startY.current = 0;
      isPulling.current = false;
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { pullDistance, isRefreshing };
}

const vendorDataReducer = (state, action) => {
  switch (action.type) {
    case "SET_VENDORS":
      return {
        ...state,
        vendors: action.payload.vendors,
        pagination: action.payload.pagination,
        cities: action.payload.cities,
        isLoading: false,
        error: null,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, vendors: [], isLoading: false };
    default:
      return state;
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
const formatPrice = (price) => {
  if (isNaN(price) || price === 0) return "N/A";
  if (price >= 100000) return `${(price / 100000).toFixed(1)}L`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
  return price.toLocaleString("en-IN");
};

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

const ScrollProgressBar = () => {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 2 ? 1 : 0 }}
    >
      <motion.div
        className={`h-full bg-gradient-to-r ${"from-blue-600 to-yellow-500"}`}
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};

const formatFullPrice = (price) => {
  if (isNaN(price) || price === 0) return "N/A";
  return price.toLocaleString("en-IN");
};

const getVendorPrice = (vendor) => {
  return (
    vendor.normalizedPrice ||
    vendor.perDayPrice?.min ||
    vendor.basePrice ||
    vendor.price?.min ||
    vendor.startingPrice ||
    0
  );
};

const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text || "";
  return `${text.substring(0, maxLength)}...`;
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const getCompareVal = (v, key) => {
  switch (key) {
    case "rating":
      return v.rating || v.averageRating || 0;
    case "price":
      return getVendorPrice(v);
    case "reviews":
      return v.reviews || v.totalReviews || v.reviewCount || 0;
    case "bookings":
      return v.bookings || v.totalBookings || 0;
    case "capacity":
      return v.seating?.max || v.capacity || null;
    case "response":
      return v.responseTime || null;
    default:
      return null;
  }
};

const getBest = (vendors, key, higher) => {
  const vals = vendors.map((v) => getCompareVal(v, key)).filter((x) => typeof x === "number");
  if (!vals.length) return null;
  return higher ? Math.max(...vals) : Math.min(...vals);
};

// =============================================================================
// LAZY LOADED COMPONENTS
// =============================================================================
const MapView = dynamic(() => import("@/components/mobile/MapContainer"), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
});

// =============================================================================
// SUB-COMPONENTS
// =============================================================================
const OfflineBanner = memo(() => {
  const isOnline = useNetworkStatus();
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <AlertCircle size={16} />
          <span>You&apos;re offline. Some features may be limited.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
OfflineBanner.displayName = "OfflineBanner";

const PullToRefreshUI = memo(({ pullDistance, isRefreshing, threshold = 80 }) => {
  const progress = Math.min(pullDistance / threshold, 1);

  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <motion.div
      style={{ y: pullDistance }}
      className="fixed top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
    >
      <motion.div
        animate={{ scale: isRefreshing ? 1 : 0.8 + progress * 0.2, opacity: Math.min(progress * 2, 1) }}
        className="mt-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : progress * 360 }}
          transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0 }}
        >
          <RefreshCw size={24} style={{ color: COLORS.primary }} className={isRefreshing ? "animate-spin" : ""} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
});
PullToRefreshUI.displayName = "PullToRefreshUI";

const ScrollToTopButton = memo(() => {
  const { scrollY } = useScrollPosition();
  const haptic = useHapticFeedback();
  const isVisible = scrollY > 400;

  const scrollToTop = useCallback(() => {
    haptic("light");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [haptic]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-17 right-4 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
        >
          <ArrowUp size={20} style={{ color: COLORS.primary }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
});
ScrollToTopButton.displayName = "ScrollToTopButton";

const MapLoadingPlaceholder = memo(() => (
  <div className="h-[70vh] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex flex-col items-center justify-center gap-4 border border-blue-200">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
      <MapIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" size={24} />
    </div>
    <div className="text-center">
      <p className="text-blue-600 font-semibold">Loading Map</p>
      <p className="text-blue-400 text-sm">Please wait...</p>
    </div>
  </div>
));
MapLoadingPlaceholder.displayName = "MapLoadingPlaceholder";

const Toast = memo(({ message, type = "success", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const icons = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertCircle };
  const Icon = icons[type];
  const colors = { success: "bg-green-500", error: "bg-red-500", info: "bg-blue-500", warning: "bg-amber-500" };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          className={`fixed bottom-28 left-4 right-4 z-[300] ${colors[type]} text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3`}
        >
          <Icon size={20} />
          <span className="flex-1 font-medium text-sm">{message}</span>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
Toast.displayName = "Toast";

const ActiveFiltersDisplay = memo(
  ({
    searchQuery,
    selectedCategories,
    selectedSubcategory,
    selectedLocations,
    priceRange,
    ratingFilter,
    showFeaturedOnly,
    sortBy,
    sortOrder,
    onClearAll,
    colorPrimary,
  }) => {
    const haptic = useHapticFeedback();
    const filters = [];

    // Search Query
    if (searchQuery) filters.push(`Search: "${searchQuery}"`);

    // Categories
    if (selectedCategories.length > 0) {
      const categoryLabels = selectedCategories.map((id) => VENDOR_CATEGORIES.find((c) => c.id === id)?.label || id);
      filters.push(`Categories: ${categoryLabels.join(", ")}`);
    }

    // Subcategory
    if (selectedSubcategory) {
      const allSubcats = Object.values(SUBCATEGORIES).flat();
      const subLabel = allSubcats.find((s) => s.id === selectedSubcategory)?.label || selectedSubcategory;
      filters.push(`Type: ${subLabel}`);
    }

    // Locations
    if (selectedLocations.length > 0) filters.push(`Cities: ${selectedLocations.join(", ")}`);

    // Price Range
    if (priceRange[0] > 0 || priceRange[1] < 1000000) {
      filters.push(`Budget: ₹${formatPrice(priceRange[0])} - ₹${formatPrice(priceRange[1])}`);
    }

    // Rating Filter
    if (ratingFilter > 0) filters.push(`Rating: ${ratingFilter}+ stars`);

    // Featured Only
    if (showFeaturedOnly) filters.push("Featured Only");

    // Sort By (only if not default)
    if (sortBy && sortBy !== "rating") {
      const sortOption = SORT_OPTIONS.find((opt) => opt.id === sortBy);
      filters.push(`Sort: ${sortOption?.label || sortBy}`);
    }

    // Sort Order (only if not default)
    if (sortOrder && sortOrder !== "desc") {
      filters.push(`Order: ${sortOrder === "asc" ? "Low to High" : "High to Low"}`);
    }

    if (filters.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={14} style={{ color: colorPrimary }} />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Active Filters ({filters.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filters.map((filter, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-blue-200 shadow-sm"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              haptic("light");
              onClearAll();
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
            style={{ color: colorPrimary, backgroundColor: `${colorPrimary}15` }}
          >
            Clear All
          </motion.button>
        </div>
      </motion.div>
    );
  },
);
ActiveFiltersDisplay.displayName = "ActiveFiltersDisplay";

const CartPreview = memo(({ colorPrimary }) => {
  const { cartItems, getCartCount, getCartTotal, removeFromCart, updateQuantity, setOpenCartNavbar } = useCartStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const haptic = useHapticFeedback();
  const cartCount = getCartCount();

  if (cartCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-20 left-3 right-3 z-[65]"
    >
      <motion.div
        layout
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        style={{ boxShadow: "0 -4px 30px rgba(0,0,0,0.15)" }}
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            haptic("light");
            setIsExpanded(!isExpanded);
          }}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center relative"
              style={{ backgroundColor: `${colorPrimary}15` }}
            >
              <ShoppingCart size={20} style={{ color: colorPrimary }} />
              <span
                className="absolute -top-1 -right-1 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.error }}
              >
                {cartCount}
              </span>
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-sm">
                {cartCount} item{cartCount > 1 ? "s" : ""} in cart
              </p>
              <p className="text-xs text-gray-500">Total: ₹{formatFullPrice(getCartTotal())}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={20} className="text-gray-400" />
            </motion.div>
          </div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-100"
            >
              <div className="max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-3 border-b border-gray-50 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.address?.city || "Location"}</p>
                        <p className="text-sm font-bold" style={{ color: colorPrimary }}>
                          ₹{formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              haptic("light");
                              updateQuantity(item._id, item.quantity - 1);
                            }}
                            className="p-1.5 text-gray-600 hover:text-gray-900"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              haptic("light");
                              updateQuantity(item._id, item.quantity + 1);
                            }}
                            className="p-1.5 text-gray-600 hover:text-gray-900"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            haptic("medium");
                            removeFromCart(item._id);
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 flex gap-2">
                <div
                  onClick={() => setOpenCartNavbar("open")}
                  className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm text-center shadow-md"
                  style={{ backgroundColor: colorPrimary }}
                >
                  View Cart
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});
CartPreview.displayName = "CartPreview";

const VendorProfilesCarousel = memo(({ colorPrimary, colorSecondary,selectedCategories = [],
  selectedSubcategory = "",
  selectedLocations = [],
  priceRange = [0, 1000000],
  sortBy = "trust",
  sortOrder = "desc",
  ratingFilter = 0,
  showFeaturedOnly = false, }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useLocalStorage("mp_vendorsExpanded", true);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const haptic = useHapticFeedback();
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVendorProfiles = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ ADD: Build query params with filters
        const queryParams = new URLSearchParams({
          sortBy: sortBy,
          sortOrder: sortOrder,
          page: "1",
          limit: "20",
        });

        // ✅ ADD: Apply marketplace filters
        if (selectedCategories.length > 0) {
          queryParams.set("categories", selectedCategories.join(","));
        }
        if (selectedSubcategory) {
          queryParams.set("subcategory", selectedSubcategory);
        }
        if (selectedLocations.length > 0) {
          queryParams.set("cities", selectedLocations.join(","));
        }
        if (priceRange[0] > 0) {
          queryParams.set("minPrice", priceRange[0].toString());
        }
        if (priceRange[1] < 1000000) {
          queryParams.set("maxPrice", priceRange[1].toString());
        }
        if (ratingFilter > 0) {
          queryParams.set("minRating", ratingFilter.toString());
        }
        if (showFeaturedOnly) {
          queryParams.set("featured", "true");
        }

        const response = await fetch(`/api/vendor/profile/lists?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setVendors(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch vendor profiles");
        }
      } catch (err) {
        console.error("Error fetching vendor profiles:", err);
        setError(err.message || "Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProfiles();
  }, [
    selectedCategories,
    selectedSubcategory,
    selectedLocations,
    priceRange,
    sortBy,
    sortOrder,
    ratingFilter,
    showFeaturedOnly,
  ]);

  const scrollToIndex = useCallback((index) => {
    if (scrollRef.current) {
      const cardWidth = 100 + 16; // 100px width + 16px gap
      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
  }, []);

  const handleScroll = useCallback((e) => {
    const target = e.target;
    const scrollLeft = target.scrollLeft;
    const cardWidth = 100 + 16;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(newIndex, vendors.length - 1));
  }, [vendors.length]);

  const handleVendorClick = useCallback((vendor) => {
    haptic("medium");
   if (vendor?.vendorId) {
      router.push(`/vendor/${vendor.category}/${vendor.vendorId}/profile`);
    } else {
      router.push(`/vendor/${vendor.category}/profile/${vendor.username}`);
    }
  }, [haptic, router]);

  // Auto-scroll effect
  // useEffect(() => {
  //   if (!loading && vendors.length > 0 && isExpanded) {
  //     autoScrollRef.current = setInterval(() => {
  //       const nextIndex = (activeIndex + 1) % Math.min(vendors.length, 10);
  //       scrollToIndex(nextIndex);
  //     }, 4000);
  //   }

  //   return () => {
  //     if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  //   };
  // }, [activeIndex, vendors.length, scrollToIndex, loading, isExpanded]);

  const getTrustBadgeColor = (trust) => {
    if (trust >= 80) return "bg-green-500";
    if (trust >= 60) return "bg-blue-500";
    if (trust >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const formatCategory = (category) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const LoadingSkeleton = () => (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2 min-w-[100px]">
          <div className="w-[100px] h-[100px] rounded-full bg-gray-200 animate-pulse" />
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-2 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <p className="text-sm font-medium text-gray-900 mb-1">Unable to Load Vendors</p>
      <p className="text-xs text-gray-500 text-center mb-4">{error}</p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
        className="px-4 py-2 text-xs font-medium text-white rounded-lg"
        style={{ backgroundColor: colorPrimary }}
      >
        Retry
      </motion.button>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <Users size={32} className="text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-900 mb-1">No Vendors Found</p>
      <p className="text-xs text-gray-500 text-center">Check back later for trusted vendors</p>
    </div>
  );

  return (
    <section className="mb-2" aria-label="Top trusted vendor profiles">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
  <motion.div
    animate={{ scale: [1, 1.1, 1] }}
    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
    className="w-6 h-6 rounded-lg flex items-center justify-center"
    style={{ backgroundColor: `${colorPrimary}15` }}
  >
    <Award size={14} style={{ color: colorPrimary }} />
  </motion.div>
  Most Trusted Vendors
  {!loading && vendors.length > 0 && (
    <span className="text-[10px] font-normal text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">
      {vendors.length}
    </span>
  )}
  {/* ✅ ADD: Show filter indicator */}
  {(selectedCategories.length > 0 || selectedLocations.length > 0 || showFeaturedOnly) && (
    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: colorPrimary }}>
      Filtered
    </span>
  )}
</h2>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            haptic("light");
            setIsExpanded(!isExpanded);
          }}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isExpanded ? "Collapse vendors" : "Expand vendors"}
        >
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
            <ChevronDown size={18} className="text-gray-500" />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.4,
                  ease: [0.4, 0.0, 0.2, 1],
                },
                opacity: {
                  duration: 0.3,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: [0.4, 0.0, 0.2, 1],
                },
                opacity: {
                  duration: 0.2,
                },
              },
            }}
            className="overflow-hidden"
          >
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorState />
            ) : vendors.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: "none" }}
                >
                  {vendors.map((vendor, index) => (
                    <motion.div
                      key={vendor._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleVendorClick(vendor)}
                      className="flex flex-col items-center gap-2 min-w-[100px] snap-start cursor-pointer group"
                    >
                      {/* Profile Picture Container */}
                      <div className="relative">
                        {/* Trust Badge */}
                        <div
                          className={`absolute -top-1 -right-1 w-8 h-8 rounded-full ${getTrustBadgeColor(vendor.trust)} flex items-center justify-center z-10 shadow-lg border-2 border-white`}
                        >
                          <span className="text-[10px] font-bold text-white">{vendor.trust}</span>
                        </div>

                        {/* Profile Image */}
                        <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-3 border-gray-200 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                          {vendor.vendorAvatar ? (
                            <img
                              src={vendor.vendorAvatar}
                              alt={vendor.vendorBusinessName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-avatar.png";
                              }}
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                              style={{ backgroundColor: colorPrimary }}
                            >
                              {vendor.vendorBusinessName?.charAt(0).toUpperCase() || "V"}
                            </div>
                          )}
                        </div>

                        {/* Verified Badge */}
                        {vendor.trust >= 70 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-500 rounded-full p-1 shadow-lg border-2 border-white"
                          >
                            <BadgeCheck size={14} className="text-white" />
                          </motion.div>
                        )}
                      </div>

                      {/* Vendor Info */}
                      <div className="flex flex-col items-center gap-0.5 w-full px-1">
                        <h3 className="text-xs font-semibold text-gray-900 text-center line-clamp-1 w-full group-hover:text-blue-600 transition-colors">
                          {vendor.vendorBusinessName}
                        </h3>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-500 capitalize">
                            {formatCategory(vendor.category)}
                          </span>
                        </div>

                        {vendor.location?.city && (
                          <div className="flex items-center gap-0.5 text-[9px] text-gray-400">
                            <MapPin size={8} />
                            <span className="line-clamp-1">{vendor.location.city}</span>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-2 mt-1">
                          {vendor.likesCount > 0 && (
                            <div className="flex items-center gap-0.5 text-[9px] text-gray-500">
                              <Heart size={9} fill="currentColor" />
                              <span>{vendor.likesCount > 999 ? `${(vendor.likesCount / 1000).toFixed(1)}k` : vendor.likesCount}</span>
                            </div>
                          )}

                          {vendor.postsCount > 0 && (
                            <div className="flex items-center gap-0.5 text-[9px] text-gray-500">
                              <ImageIcon size={9} />
                              <span>{vendor.postsCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Dots */}
                {/* {vendors.length > 5 && (
                  <div className="flex justify-center gap-1.5">
                    {vendors.slice(0, 10).map((_, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => scrollToIndex(idx)}
                        animate={{
                          width: idx === activeIndex ? 16 : 6,
                          backgroundColor: idx === activeIndex ? colorPrimary : COLORS.gray[300],
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-1.5 rounded-full"
                        aria-label={`Go to vendor ${idx + 1}`}
                      />
                    ))}
                  </div>
                )} */}

                {/* View All Button */}
                {/* <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    haptic("medium");
                    router.push("/vendors?sortBy=trust");
                  }}
                  className="w-full mt-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all hover:shadow-md"
                  style={{
                    borderColor: colorPrimary,
                    color: colorPrimary,
                  }}
                >
                  View All Trusted Vendors
                  <ChevronRight size={16} className="inline-block ml-1" />
                </motion.button> */}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

VendorProfilesCarousel.displayName = "VendorProfilesCarousel";

const CategoryChips = memo(({ selectedCategories, onCategoryChange, colorPrimary }) => {
  const haptic = useHapticFeedback();

  return (
    <div className="mb-2">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            haptic("light");
            if (selectedCategories.length > 0) onCategoryChange("__clear__");
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedCategories.length === 0
              ? "text-white border-transparent shadow-md"
              : "bg-white text-gray-600 border-gray-200"
          }`}
          style={selectedCategories.length === 0 ? { backgroundColor: colorPrimary } : {}}
        >
          <Grid3X3 size={14} />
          <span>All</span>
        </motion.button>

        {VENDOR_CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id);
          const IconComponent = cat.icon;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("light");
                onCategoryChange(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected ? "text-white border-transparent shadow-md" : "bg-white text-gray-600 border-gray-200"
              }`}
              style={isSelected ? { backgroundColor: cat.color } : {}}
            >
              <IconComponent size={14} />
              <span>{cat.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});
CategoryChips.displayName = "CategoryChips";

const SubcategoryChips = memo(({ selectedCategory, selectedSubcategory, onSubcategoryChange, colorPrimary }) => {
  const haptic = useHapticFeedback();
  const subcategories = SUBCATEGORIES[selectedCategory] || [];
  const categoryInfo = VENDOR_CATEGORIES.find((c) => c.id === selectedCategory);

  if (subcategories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mb-4 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-2 px-1">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ backgroundColor: `${categoryInfo?.color || colorPrimary}20` }}
        >
          {categoryInfo && <categoryInfo.icon size={12} style={{ color: categoryInfo.color }} />}
        </div>
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{categoryInfo?.label} Types</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            haptic("light");
            onSubcategoryChange("");
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
            selectedSubcategory === ""
              ? "text-white border-transparent shadow-sm"
              : "bg-gray-50 text-gray-600 border-gray-200"
          }`}
          style={selectedSubcategory === "" ? { backgroundColor: categoryInfo?.color || colorPrimary } : {}}
        >
          All {categoryInfo?.label}
        </motion.button>
        {subcategories.map((sub) => {
          const isSelected = selectedSubcategory === sub.id;
          return (
            <motion.button
              key={sub.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("light");
                onSubcategoryChange(sub.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected ? "text-white border-transparent shadow-sm" : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
              style={isSelected ? { backgroundColor: categoryInfo?.color || colorPrimary } : {}}
            >
              {sub.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
});
SubcategoryChips.displayName = "SubcategoryChips";

const RecentSearches = memo(({ searches, onSelect, onClear, colorPrimary }) => {
  const haptic = useHapticFeedback();
  if (!searches || searches.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 pb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500">Recent Searches</span>
        <button
          onClick={() => {
            haptic("light");
            onClear();
          }}
          className="text-xs text-gray-400 active:text-gray-600"
        >
          Clear
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {searches.slice(0, MAX_RECENT_SEARCHES).map((search, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              haptic("light");
              onSelect(search);
            }}
            className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 flex items-center gap-1.5"
          >
            <Clock size={12} className="text-gray-400" />
            {search}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});
RecentSearches.displayName = "RecentSearches";

const CardSkeleton = memo(({ viewMode }) => {
  const isGrid = viewMode === "grid";
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 ${isGrid ? "h-64" : ""}`}>
      <div className={`bg-gray-200 ${isGrid ? "h-32" : "h-48"}`} style={{ animation: "shimmer 1.5s infinite" }} />
      <div className={`p-3 space-y-2 ${isGrid ? "" : "p-4 space-y-3"}`}>
        <div className="flex justify-between">
          <div className="h-4 w-2/3 bg-gray-200 rounded" style={{ animation: "shimmer 1.5s infinite" }} />
          <div className="h-4 w-12 bg-gray-200 rounded" style={{ animation: "shimmer 1.5s infinite" }} />
        </div>
        <div className="h-3 w-1/2 bg-gray-200 rounded" style={{ animation: "shimmer 1.5s infinite" }} />
        {!isGrid && (
          <>
            <div className="flex gap-2 pt-1">
              <div className="h-6 w-20 bg-gray-200 rounded-md" style={{ animation: "shimmer 1.5s infinite" }} />
              <div className="h-6 w-24 bg-gray-200 rounded-md" style={{ animation: "shimmer 1.5s infinite" }} />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-24 bg-gray-200 rounded" style={{ animation: "shimmer 1.5s infinite" }} />
              <div className="h-10 w-24 bg-gray-200 rounded-xl" style={{ animation: "shimmer 1.5s infinite" }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
});
CardSkeleton.displayName = "CardSkeleton";

const ImageCarousel = memo(
  ({ images, vendorName, isGrid, isFavorite, onFavorite, tags, isLiking, colorPrimary, rating }) => {
    const [[page, direction], setPage] = useState([0, 0]);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [showHeart, setShowHeart] = useState(false);
    const imageRefs = useRef(new Map());
    const haptic = useHapticFeedback();

    const imageIndex = ((page % images.length) + images.length) % images.length;
    const hasMultipleImages = images.length > 1;

    useEffect(() => {
      const preloadLinks = [];
      const imageObjects = []; // 🔥 ADD: Track image objects

      images.forEach((src, index) => {
        const img = new window.Image();
        img.decoding = "async";
        imageObjects.push(img); // 🔥 Track for cleanup

        img.onload = () => {
          img
            .decode()
            .then(() => {
              setLoadedImages((prev) => new Set(prev).add(src));
              imageRefs.current.set(src, img);
            })
            .catch(() => {
              setLoadedImages((prev) => new Set(prev).add(src));
            });
        };

        // 🔥 ADD: Error handler
        img.onerror = () => {
          setLoadedImages((prev) => new Set(prev).add(src));
        };

        img.src = src;

        if (index < 3) {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.as = "image";
          link.href = src;
          document.head.appendChild(link);
          preloadLinks.push(link);
        }
      });

      return () => {
        // 🔥 CRITICAL: Clean up everything
        preloadLinks.forEach((link) => link.remove());
        imageObjects.forEach((img) => {
          img.onload = null;
          img.onerror = null;
          img.src = ""; // Release memory
        });
        imageRefs.current.clear();
      };
    }, [images]);

    const paginate = useCallback(
      (newDirection) => {
        if (!hasMultipleImages) return;
        haptic("light");
        setHasInteracted(true);
        setPage([page + newDirection, newDirection]);
      },
      [hasMultipleImages, page, haptic],
    );

    const handleDragEnd = useCallback(
      (_, { offset, velocity }) => {
        const swipe = Math.abs(offset.x) * velocity.x;
        if (swipe < -2500) {
          setHasInteracted(true);
          paginate(1);
        } else if (swipe > 2500) {
          setHasInteracted(true);
          paginate(-1);
        }
      },
      [paginate],
    );

    const handleDoubleTap = useDoubleTap(() => {
      haptic("success");
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
      if (!isFavorite) onFavorite();
    });

    const slideVariants = {
      enter: (d) => ({
        x: d > 0 ? "100%" : "-100%",
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
        zIndex: 1,
      },
      exit: (d) => ({
        x: d < 0 ? "100%" : "-100%",
        opacity: 0,
        zIndex: 0,
      }),
    };

    return (
      <div className={`relative bg-gray-100 overflow-hidden ${isGrid ? "h-32" : "h-48"}`} onClick={handleDoubleTap}>
        <div className="hidden" aria-hidden="true">
          {images.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="eager"
              decoding="async"
              onLoad={() => setLoadedImages((prev) => new Set(prev).add(src))}
            />
          ))}
        </div>

        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 400, damping: 40, mass: 0.8 },
              opacity: { duration: 0.25 },
            }}
            drag={hasMultipleImages ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full"
            style={{
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          >
            <SmartMedia
              src={images[imageIndex]}
              alt={vendorName}
              type="image"
              className="w-full h-full select-none touch-pan-y"
              style={{
                objectPosition: "center center",
                aspectRatio: "16/9",
              }}
              objectFit="cover"
              priority={imageIndex === 0}
              quality={85}
              sizes={isGrid ? "(max-width: 768px) 50vw, 33vw" : "(max-width: 768px) 100vw, 50vw"}
              useSkeleton={!hasInteracted && !loadedImages.has(images[imageIndex])}
              unoptimized={false}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <Heart size={60} className="fill-white text-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
          <div className="flex gap-1.5">
            {tags?.includes("Popular") && (
              <div className="px-2 py-1 bg-amber-400 text-amber-900 text-[9px] font-bold uppercase rounded-md shadow-md flex items-center gap-1">
                <Sparkles size={10} /> Popular
              </div>
            )}
            {tags?.includes("Verified") && (
              <div className="px-2 py-1 bg-blue-400 text-white text-[9px] font-bold uppercase rounded-md shadow-md flex items-center gap-1">
                <CheckCircle size={10} /> Verified
              </div>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLiking) {
                haptic("medium");
                onFavorite();
              }
            }}
            disabled={isLiking}
            className={`p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md ${
              isLiking ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Heart
              size={16}
              className={`transition-colors duration-200 ${
                isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-600"
              }`}
              strokeWidth={2}
            />
          </motion.button>
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center z-10">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-800">{rating?.toFixed(1) || "4.5"}</span>
          </div>

          {hasMultipleImages && !isGrid && (
            <div className="flex gap-1">
              {images.slice(0, 5).map((_, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    width: idx === imageIndex ? 12 : 5,
                    opacity: idx === imageIndex ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="h-1.5 bg-white rounded-full shadow-sm"
                />
              ))}
              {images.length > 5 && <span className="text-white text-[10px] ml-1">+{images.length - 5}</span>}
            </div>
          )}
        </div>

        {!isGrid && hasMultipleImages && (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </motion.button>
          </>
        )}
      </div>
    );
  },
);
ImageCarousel.displayName = "ImageCarousel";

const QuickActionButton = memo(({ icon: Icon, label, onClick, isActive, color }) => {
  const haptic = useHapticFeedback();
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        haptic("light");
        onClick?.();
      }}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
        isActive ? "bg-gray-100" : "active:bg-gray-50"
      }`}
    >
      <Icon size={18} className={isActive ? "" : "text-gray-400"} style={isActive ? { color } : {}} />
      <span className="text-[10px] font-medium text-gray-500">{label}</span>
    </motion.button>
  );
});
QuickActionButton.displayName = "QuickActionButton";

const VendorCard = memo(
  ({
    vendor,
    viewMode,
    isComparing,
    isSelectedForCompare,
    onCompare,
    colorPrimary,
    onShowToast,
    setCompareMode,
    setCompareList, 
    isLeadModalOpen,
    setLeadModalActionType,
    setIsLeadModalOpen
  }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const { user, isLoaded: isAuthLoaded } = useUser();
    const { ref, hasBeenInView } = useInView();
    const haptic = useHapticFeedback();
    const isGrid = viewMode === "grid";
    const [isLiked, setIsLiked] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [likingLoading, setLikingLoading] = useState(false);
    const { allowedAction, canContinue } = useAppValuesStore();

    // ADD this useEffect in VendorCard component:
    useEffect(() => {
      if (!user || !vendor?._id) return;
      setStatusLoading(true);
      const fetchStatus = async () => {
        try {
          const res = await fetch(`/api/user/status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vendorId: vendor._id, userId: user.id }),
          });
          if (res.ok) {
            const data = await res.json();
            setIsLiked(data.isLiked);
            setStatusLoading(false);
          }
        } catch (error) {
          console.error("Error fetching interaction status:", error);
        } finally {
          setStatusLoading(false);
        }
      };

      fetchStatus();
    }, [user, vendor?._id]);

    // ADD this function in VendorCard component:
    const handleToggleLike = async () => {
      if (!user) {
        toast.error("Please login to like vendors");
        return;
      }
      setLikingLoading(true);
      const prevLiked = isLiked;
      setIsLiked(!prevLiked);
      if (navigator.vibrate) navigator.vibrate(10);

      try {
        const res = await fetch("/api/user/toggle-like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId: vendor._id }),
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        toast.success(data.message);
        setLikingLoading(false);
      } catch (error) {
        setIsLiked(prevLiked);
        toast.error("Something went wrong");
      } finally {
        setLikingLoading(false);
      }
    };

    const { addToCart, isInCart, removeFromCart } = useCartStore();
    const inCart = isInCart(vendor._id);

    const displayImages = useMemo(() => {
      const imgs = vendor.normalizedImages || (vendor.images || []).filter(Boolean);
      const validImages = imgs.length > 0 ? imgs : vendor.defaultImage ? [vendor.defaultImage] : ["/placeholder.jpg"];
      return validImages.slice(0, 5);
    }, [vendor.images, vendor.defaultImage, vendor.normalizedImages]);

    const price = useMemo(() => getVendorPrice(vendor), [vendor]);
    const displayPrice = useMemo(() => formatPrice(price), [price]);
    const fullPrice = useMemo(() => formatFullPrice(price), [price]);

    const categoryInfo = useMemo(
      () => VENDOR_CATEGORIES.find((c) => c.id === vendor.category) || VENDOR_CATEGORIES[0],
      [vendor.category],
    );

    const handleCompare = useCallback(
      async (e) => {
        haptic("medium");
        onCompare?.(vendor);
        setCompareMode(!isComparing);
        if (isComparing) setCompareList([]);
      },
      [vendor, haptic, onCompare, isComparing, setCompareMode, setCompareList],
    );

    const handleShare = useCallback(
      async (e) => {
        haptic("light");
        const shareData = {
          title: vendor.name,
          text: `Check out ${vendor.name} - Starting at ₹${fullPrice}`,
          url: `${window.location.origin}/vendor/${vendor.category}/${vendor._id}`,
        };
        if (navigator.share && navigator.canShare?.(shareData)) {
          try {
            await navigator.share(shareData);
            onShowToast?.("Shared successfully!", "success");
          } catch (err) {
            if (err.name !== "AbortError") console.log("Share failed");
          }
        } else {
          await copyToClipboard(shareData.url);
          onShowToast?.("Link copied to clipboard!", "success");
        }
      },
      [vendor, fullPrice, haptic, onShowToast],
    );

    const handleCall = useCallback(
      (e) => {
        haptic("medium");
        if(canContinue){
            if (vendor.phoneNo) window.location.href = `tel:${vendor.phoneNo}`;
            else onShowToast?.("Phone number not available", "info");
        }else {
           setIsLeadModalOpen(true);
           setLeadModalActionType("revealPhone");
        }
      },
      [vendor.phoneNo, haptic, onShowToast],
    );

    const handleAddToCart = useCallback(
      (e) => {
        haptic("medium");
        if (inCart) {
          removeFromCart(vendor._id);
          onShowToast?.("Removed from cart", "info");
        } else {
          addToCart({
            _id: vendor._id,
            name: vendor.name,
            category: vendor.category,
            price: price,
            image: displayImages[0],
            quantity: 1,
            address: vendor.address,
          });
          onShowToast?.("Added to cart!", "success");
        }
      },
      [haptic, inCart, vendor, price, displayImages, addToCart, removeFromCart, onShowToast],
    );

    if (!hasBeenInView) return <div ref={ref} className={isGrid ? "h-64" : "h-80"} />;

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileTap={!isComparing ? { scale: 0.98 } : {}}
        className={`relative group bg-white rounded-2xl overflow-hidden shadow-sm border transition-all ${
          isSelectedForCompare ? "ring-2 ring-offset-2 border-transparent" : "border-gray-100"
        } ${isGrid ? "" : "mb-4"}`}
        style={isSelectedForCompare ? { ringColor: colorPrimary } : {}}
      >
        {isComparing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              haptic("medium");
              onCompare(vendor);
            }}
            className="absolute inset-0 z-40 bg-black/10 backdrop-blur-[1px] flex items-center justify-center cursor-pointer"
          >
            <motion.div
              animate={{ scale: isSelectedForCompare ? 1.1 : 1 }}
              className={`w-12 h-12 rounded-full border-3 border-white flex items-center justify-center shadow-xl ${
                isSelectedForCompare ? "" : "bg-white/50"
              }`}
              style={isSelectedForCompare ? { backgroundColor: colorPrimary } : {}}
            >
              {isSelectedForCompare ? (
                <CheckCircle size={24} className="text-white" />
              ) : (
                <span className="text-2xl">+</span>
              )}
            </motion.div>
          </motion.div>
        )}

        <ImageCarousel
          images={displayImages}
          vendorName={vendor.name}
          isGrid={isGrid}
          isFavorite={isLiked}
          isLiking={likingLoading}
          onFavorite={handleToggleLike}
          tags={vendor.tags}
          colorPrimary={colorPrimary}
          rating={vendor.rating}
        />

        <Link href={`/vendor/${vendor?.category}/${vendor?._id}`} className={`block ${isGrid ? "p-3" : "p-4"}`}>
          <div className="flex justify-between items-center mb-1.5">
            {/* Profile Photo Section - Only in List View and when profile picture exists */}
            {!isGrid && (vendor?.defaultImage || vendor?.images?.[0]) && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/vendor/${vendor.category}/${vendor._id}/profile`;
                }}
                className="mr-3 shrink-0"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-green-500 to-green-800 shadow-sm">
                    <Image
                      src={vendor?.defaultImage || vendor?.images?.[0] || "/placeholder-profile.jpg"}
                      alt={`${vendor.name} Profile Picture`}
                      width={500}
                      height={500}
                      quality={90}
                      priority={false}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
                      className="w-full h-full object-cover rounded-full overflow-hidden"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-profile.jpg";
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-white p-[2px] rounded-full shadow-sm border border-gray-100 text-violet-600">
                    <Eye size={8} />
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0 pr-2">
              <h3 className={`font-bold text-gray-900 leading-tight truncate ${isGrid ? "text-sm" : "text-base"}`}>
                {vendor.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={11} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500 truncate">{vendor.address?.city || "Location"}</span>
                {vendor.distance && <span className="text-xs text-gray-400">• {vendor.distance}</span>}
              </div>
            </div>

            {!isGrid && (
              <div
                className="px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1"
                style={{ backgroundColor: `${categoryInfo.color}15`, color: categoryInfo.color }}
              >
                <categoryInfo.icon size={10} />
                {categoryInfo.label}
              </div>
            )}
          </div>

          {!isGrid && (
            <div className="flex items-center gap-2 my-2.5 overflow-x-auto scrollbar-hide">
              {vendor.seating?.max && (
                <div className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-medium text-gray-600 flex items-center gap-1 shrink-0">
                  <Users size={11} /> {vendor.seating.max} guests
                </div>
              )}
              <div className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-medium text-gray-600 flex items-center gap-1 shrink-0">
                <TrendingUp size={11} /> {vendor.bookings || 0} booked
              </div>
              {vendor.responseTime && (
                <div className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-medium text-gray-600 flex items-center gap-1 shrink-0">
                  <Clock size={11} /> {vendor.responseTime}
                </div>
              )}
              <div className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-medium text-gray-600 flex items-center gap-1 shrink-0">
                <MessageCircle size={11} /> {vendor.reviews || 0} reviews
              </div>
            </div>
          )}

          <div
            className={`flex items-center justify-between ${isGrid ? "mt-2" : "mt-2 pt-3 border-t border-gray-100"}`}
          >
            <div>
              {!isGrid && (
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Starting at</p>
              )}
              <div className="flex items-baseline gap-1">
                <span className={`font-bold ${isGrid ? "text-sm" : "text-xl"}`} style={{ color: colorPrimary }}>
                  ₹{displayPrice}
                </span>
                {!isGrid && vendor.priceUnit && (
                  <span className="text-xs text-gray-400">/{vendor.priceUnit || "day"}</span>
                )}
              </div>
              {!isGrid && vendor.originalPrice && (
                <span className="text-xs text-gray-400 line-through">₹{formatPrice(vendor.originalPrice)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isGrid && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="p-2 bg-gray-50 rounded-xl"
                >
                  <MoreHorizontal size={18} className="text-gray-400" />
                </motion.button>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className={`flex items-center justify-center gap-1.5 font-bold shadow-md transition-all ${
                  isGrid ? "p-2.5 rounded-xl" : "px-5 py-2.5 rounded-xl text-sm"
                } ${inCart ? "bg-green-500 text-white" : isGrid ? "bg-gray-900 text-white" : "text-white"}`}
                style={!inCart && !isGrid ? { backgroundColor: colorPrimary } : {}}
              >
                {inCart ? (
                  <>
                    <Check size={isGrid ? 16 : 18} />
                    {!isGrid && "In Cart"}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={isGrid ? 16 : 18} />
                    {!isGrid && "Add to Cart"}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </Link>

        <AnimatePresence>
          {showActions && !isGrid && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 overflow-hidden"
            >
              <div className="p-3 grid grid-cols-4 gap-2">
                <QuickActionButton icon={Phone} label="Call" onClick={handleCall} color={COLORS.success} />
                <QuickActionButton icon={Share2} label="Share" onClick={handleShare} color={COLORS.secondary} />
                <QuickActionButton
                  icon={ArrowRightLeft}
                  label="Compare"
                  onClick={handleCompare}
                  color={COLORS.primary}
                />
                <QuickActionButton
                  icon={Navigation}
                  label="Directions"
                  onClick={() => {
                    window.open(vendor?.address?.googleMapUrl, "_blank");
                  }}
                  color={COLORS.error}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);
VendorCard.displayName = "VendorCard";

const PaginationControls = memo(({ currentPage, totalPages, onPageChange, colorPrimary, isLoading }) => {
  const haptic = useHapticFeedback();

  const pages = useMemo(() => {
    const result = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-4 py-6 pb-12">
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            haptic("light");
            onPageChange(currentPage - 1);
          }}
          disabled={currentPage === 1 || isLoading}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 disabled:opacity-40"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </motion.button>

        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-sm font-medium text-gray-600 border border-gray-200"
            >
              1
            </button>
            {pages[0] > 2 && <span className="text-gray-400">...</span>}
          </>
        )}

        {pages.map((page) => (
          <motion.button
            key={page}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              haptic("light");
              onPageChange(page);
            }}
            disabled={isLoading}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${
              page === currentPage ? "text-white shadow-md" : "bg-white text-gray-600 border border-gray-200"
            }`}
            style={page === currentPage ? { backgroundColor: colorPrimary } : {}}
          >
            {page}
          </motion.button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="text-gray-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-sm font-medium text-gray-600 border border-gray-200"
            >
              {totalPages}
            </button>
          </>
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            haptic("light");
            onPageChange(currentPage + 1);
          }}
          disabled={currentPage === totalPages || isLoading}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 disabled:opacity-40"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </motion.button>
      </div>
      <p className="text-xs text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
});
PaginationControls.displayName = "PaginationControls";

const EmptyState = memo(({ onClearFilters, colorPrimary, searchQuery }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 text-center px-6"
  >
    <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
      <Search size={40} className="text-gray-300" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h3>
    <p className="text-gray-500 text-sm mb-6 max-w-xs">
      {searchQuery
        ? `We couldn't find vendors matching "${searchQuery}"`
        : "No vendors match your current filters. Try adjusting them."}
    </p>
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClearFilters}
      className="px-6 py-3 text-white font-bold rounded-xl shadow-lg"
      style={{ backgroundColor: colorPrimary }}
    >
      Clear All Filters
    </motion.button>
  </motion.div>
));
EmptyState.displayName = "EmptyState";

const SortSheet = memo(
  ({ isOpen, onClose, currentSort, currentSortOrder, onSortChange, onSortOrderChange, colorPrimary }) => {
    const haptic = useHapticFeedback();

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={SPRING_CONFIG.gentle}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[101] shadow-2xl"
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Sort By</h3>
              </div>
              <div className="p-4 space-y-2 pb-8">
                {SORT_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = currentSort === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        haptic("light");
                        onSortChange(option.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors ${
                        isSelected ? "bg-gray-100" : "active:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-white shadow-sm" : "bg-gray-100"
                        }`}
                      >
                        <Icon size={20} style={{ color: isSelected ? colorPrimary : COLORS.gray[400] }} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-semibold ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                      {isSelected && <CheckCircle size={20} style={{ color: colorPrimary }} />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
            {/* ✅ ADD: Sort Order Toggle */}
            <div className="px-5 py-3 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sort Order</p>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic("light");
                    onSortOrderChange("desc");
                  }}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    currentSortOrder === "desc"
                      ? "text-white border-transparent shadow-sm"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                  style={currentSortOrder === "desc" ? { backgroundColor: colorPrimary } : {}}
                >
                  High to Low
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic("light");
                    onSortOrderChange("asc");
                  }}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    currentSortOrder === "asc"
                      ? "text-white border-transparent shadow-sm"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                  style={currentSortOrder === "asc" ? { backgroundColor: colorPrimary } : {}}
                >
                  Low to High
                </motion.button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  },
);
SortSheet.displayName = "SortSheet";

const FilterContent = memo(
  ({
    showFeaturedOnly,
    setShowFeaturedOnly,
    selectedCategories,
    handleCategoryChange,
    priceRange,
    setPriceRange,
    availableCities,
    selectedLocations,
    handleLocationChange,
    colorPrimary,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setCurrentPage,
    setSortOrder,
  }) => {
    const haptic = useHapticFeedback();

    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${colorPrimary}15` }}
              >
                <Sparkles size={20} style={{ color: colorPrimary }} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Featured Only</p>
                <p className="text-xs text-gray-500">Show top-rated vendors</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("light");
                setShowFeaturedOnly(!showFeaturedOnly);
                setCurrentPage(1);
              }}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${showFeaturedOnly ? "" : "bg-gray-200"}`}
              style={showFeaturedOnly ? { backgroundColor: colorPrimary } : {}}
            >
              <motion.div
                animate={{ x: showFeaturedOnly ? 24 : 0 }}
                transition={SPRING_CONFIG.stiff}
                className="w-6 h-6 bg-white rounded-full shadow-md"
              />
            </motion.button>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Vendor Types</h3>
          <div className="grid grid-cols-2 gap-2">
            {VENDOR_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic("light");
                    handleCategoryChange(cat.id);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isSelected ? "border-transparent shadow-md" : "bg-white border-gray-200"
                  }`}
                  style={isSelected ? { backgroundColor: `${cat.color}15`, borderColor: cat.color } : {}}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: isSelected ? cat.color : COLORS.gray[100] }}
                  >
                    <Icon size={16} className={isSelected ? "text-white" : "text-gray-500"} />
                  </div>
                  <span className={`text-sm font-semibold ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                    {cat.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Sort By</h3>
          <div className="space-y-2">
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = sortBy === option.id;
              return (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    haptic("light");
                    setSortBy(option.id);
                    setCurrentPage(1);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isSelected ? "border-transparent shadow-md" : "bg-white border-gray-200"
                  }`}
                  style={isSelected ? { backgroundColor: `${colorPrimary}15`, borderColor: colorPrimary } : {}}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: isSelected ? colorPrimary : COLORS.gray[100] }}
                  >
                    <Icon size={16} className={isSelected ? "text-white" : "text-gray-500"} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-400">{option.description}</p>
                  </div>
                  {isSelected && <CheckCircle size={18} style={{ color: colorPrimary }} />}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* **NEW: Sort Order Toggle** */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Sort Order</h3>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("light");
                setSortOrder("desc");
                setCurrentPage(1);
              }}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-colors ${
                sortOrder === "desc"
                  ? "text-white border-transparent shadow-md"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
              style={sortOrder === "desc" ? { backgroundColor: colorPrimary } : {}}
            >
              High to Low
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("light");
                setSortOrder("asc");
                setCurrentPage(1);
              }}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-colors ${
                sortOrder === "asc"
                  ? "text-white border-transparent shadow-md"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
              style={sortOrder === "asc" ? { backgroundColor: colorPrimary } : {}}
            >
              Low to High
            </motion.button>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Minimum Rating</h3>
          <div className="flex gap-2">
            {[0, 3, 3.5, 4, 4.5].map((rating) => (
              <motion.button
                key={rating}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  haptic("light");
                  setRatingFilter(rating);
                  setCurrentPage(1);
                }}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-colors ${
                  ratingFilter === rating
                    ? "text-white border-transparent shadow-md"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
                style={ratingFilter === rating ? { backgroundColor: colorPrimary } : {}}
              >
                {rating === 0 ? "Any" : `${rating}+`}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">Budget Range</h3>
          <div className="px-3 mb-4">
            <Slider
              range
              min={0}
              max={1000000}
              step={10000}
              value={priceRange}
              onChange={(val) => {
                setPriceRange(val);
              }}
              onAfterChange={(val) => {
                setCurrentPage(1);
              }}
              trackStyle={[{ backgroundColor: colorPrimary, height: 6 }]}
              handleStyle={[
                {
                  borderColor: colorPrimary,
                  backgroundColor: "white",
                  opacity: 1,
                  height: 24,
                  width: 24,
                  marginTop: -9,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                },
                {
                  borderColor: colorPrimary,
                  backgroundColor: "white",
                  opacity: 1,
                  height: 24,
                  width: 24,
                  marginTop: -9,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                },
              ]}
              railStyle={{ backgroundColor: COLORS.gray[200], height: 6 }}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 bg-white px-4 py-3 rounded-xl border border-gray-200">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Min Price</p>
              <p className="font-bold text-gray-900">₹{formatFullPrice(priceRange[0])}</p>
            </div>
            <div className="flex-1 bg-white px-4 py-3 rounded-xl border border-gray-200 text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Max Price</p>
              <p className="font-bold text-gray-900">₹{formatFullPrice(priceRange[1])}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {[
              { label: "Budget", range: [0, 100000] },
              { label: "Mid-Range", range: [100000, 500000] },
              { label: "Premium", range: [500000, 1000000] },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  haptic("light");
                  setPriceRange(preset.range);
                }}
                className="flex-1 py-2 px-3 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 active:bg-gray-200"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {availableCities.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
              Cities ({selectedLocations.length} selected)
            </h3>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden max-h-60 overflow-y-auto">
              {availableCities.map((city, idx) => {
                const isSelected = selectedLocations.includes(city);
                return (
                  <motion.button
                    key={city}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      haptic("light");
                      handleLocationChange(city);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between p-4 transition-colors ${
                      idx !== availableCities.length - 1 ? "border-b border-gray-100" : ""
                    } ${isSelected ? "bg-blue-50" : "active:bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className={isSelected ? "text-blue-500" : "text-gray-400"} />
                      <span className={`font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}>{city}</span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? "" : "border-2 border-gray-300"
                      }`}
                      style={isSelected ? { backgroundColor: colorPrimary } : {}}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
);
FilterContent.displayName = "FilterContent";

const FilterDrawer = memo(
  ({ isOpen, onClose, children, onClear, colorPrimary, activeFilterCount, totalResults, isNavbarVisible, setIsNavbarVisible, showCompare }) => {
    const haptic = useHapticFeedback();

    useEffect(() => {
      const originalOverflow = document.body.style.overflow;
      const originalNavbarState = isNavbarVisible; // 🔥 CAPTURE: Original state

      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        // 🔥 CRITICAL: Use RAF to ensure smooth transition
        requestAnimationFrame(() => {
          document.body.style.overflow = originalOverflow || "";

          // 🔥 Restore navbar after animation completes
          setTimeout(() => {
            if (!isOpen && !showCompare) {
              setIsNavbarVisible(true);
            }
          }, 350); // Match animation duration + buffer
        });
      }

      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    }, [isOpen]);

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={SPRING_CONFIG.gentle}
              className="fixed bottom-0 left-0 right-0 h-[80vh] bg-gray-50 rounded-t-3xl z-[101] flex flex-col shadow-2xl"
            >
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-transparent">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <p className="text-xs text-gray-500">
                    {activeFilterCount > 0
                      ? `${activeFilterCount} active • ${totalResults} results`
                      : "Refine your search"}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    haptic("light");
                    onClose();
                  }}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <X size={20} className="text-gray-500" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 pb-32">{children}</div>
              <div
                className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 z-50"
                style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic("medium");
                    onClear();
                  }}
                  className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 font-bold text-gray-600 text-sm"
                >
                  Reset All
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic("medium");
                    onClose();
                  }}
                  className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: colorPrimary }}
                >
                  Show {totalResults} Results
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  },
);
FilterDrawer.displayName = "FilterDrawer";

const CompareBar = memo(({ count, vendors, onClear, onView, colorPrimary }) => {
  const haptic = useHapticFeedback();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={SPRING_CONFIG.gentle}
          className="fixed bottom-20 left-3 right-3 z-[90] bg-gray-900 text-white p-4 rounded-2xl shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {vendors.slice(0, 3).map((v, i) => (
                  <motion.div
                    key={v._id}
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-11 h-11 rounded-full border-2 border-gray-900 overflow-hidden bg-gray-700 shadow-lg"
                  >
                    <img
                      src={v.images?.[0] || v.defaultImage || "/placeholder.jpg"}
                      alt={v.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="font-bold text-sm">
                  {count} vendor{count > 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-gray-400">
                  {MAX_COMPARE_ITEMS - count > 0 ? `Add ${MAX_COMPARE_ITEMS - count} more` : "Ready to compare"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic("light");
                  onClear();
                }}
                className="px-3 py-2 text-xs font-medium text-gray-400 active:text-white"
              >
                Clear
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  haptic("medium");
                  onView();
                }}
                className="px-5 py-2 rounded-xl text-sm font-bold shadow-lg"
                style={{ backgroundColor: colorPrimary }}
              >
                Compare
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
CompareBar.displayName = "CompareBar";

const CompareModalOld = memo(({ isOpen, onClose, vendors, colorPrimary }) => {
  const haptic = useHapticFeedback();
  const [tab, setTab] = useState("overview");
  const vendorCount = vendors.length;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const bestVals = useMemo(() => {
    const b = {};
    COMPARE_FEATURES.forEach((f) => {
      if (f.higher !== null) b[f.key] = getBest(vendors, f.key, f.higher);
    });
    return b;
  }, [vendors]);

  const scores = useMemo(
    () =>
      vendors.map((v) => {
        let s = 0;
        const rating = getCompareVal(v, "rating");
        if (rating > 0) s += (rating / 5) * 30;
        const reviews = getCompareVal(v, "reviews");
        if (reviews > 0) s += Math.min(reviews / 100, 1) * 20;
        const bookings = getCompareVal(v, "bookings");
        if (bookings > 0) s += Math.min(bookings / 200, 1) * 25;
        if (v.isVerified || v.tags?.includes("Verified")) s += 15;
        if (v.tags?.includes("Popular")) s += 10;
        return Math.round(s);
      }),
    [vendors],
  );

  const winnerIdx = useMemo(() => {
    const max = Math.max(...scores);
    return scores.indexOf(max);
  }, [scores]);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "details", label: "Details", icon: Info },
    { id: "pricing", label: "Pricing", icon: DollarSign },
  ];

  const colClass = vendorCount === 1 ? "w-full" : vendorCount === 2 ? "w-1/2" : "w-1/3";
  const cardSize = vendorCount === 1 ? "max-w-[200px] mx-auto" : vendorCount === 2 ? "w-full" : "w-full";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SPRING_CONFIG.gentle}
            className="fixed inset-x-0 bottom-0 top-0 bg-gray-50 z-[201] flex flex-col pt-4"
          >
            <div className="bg-white border-b border-gray-100 px-4 pt-8 pb-2 shrink-0">
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Compare</h2>
                  <p className="text-[11px] text-gray-500">
                    {vendorCount} vendor{vendorCount > 1 ? "s" : ""} selected
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    haptic("light");
                    onClose();
                  }}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <X size={20} className="text-gray-600" />
                </motion.button>
              </div>

              <div className="flex gap-1.5">
                {tabs.map((t) => {
                  const Icon = t.icon;
                  const active = tab === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        haptic("light");
                        setTab(t.id);
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        active ? "text-white shadow-sm" : "bg-gray-100 text-gray-600"
                      }`}
                      style={active ? { backgroundColor: colorPrimary } : {}}
                    >
                      <Icon size={14} />
                      {t.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {vendors.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6">
                  <Info size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium text-sm">No vendors selected</p>
                </div>
              ) : (
                <div className="p-3">
                  <div className="flex gap-2 mb-4">
                    {vendors.map((v, i) => {
                      const winner = i === winnerIdx && vendorCount > 1;
                      const score = scores[i];
                      return (
                        <motion.div
                          key={v._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className={`${colClass} ${cardSize} bg-white rounded-xl p-2.5 border-2 shadow-sm relative overflow-hidden ${
                            winner ? "border-amber-400" : "border-gray-100"
                          }`}
                        >
                          {winner && (
                            <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 px-2 py-0.5 rounded-bl-lg text-[8px] font-bold flex items-center gap-0.5">
                              <Trophy size={9} /> BEST
                            </div>
                          )}

                          <div
                            className={`w-full ${
                              vendorCount === 1 ? "h-24" : vendorCount === 2 ? "h-20" : "h-16"
                            } rounded-lg overflow-hidden mb-2 bg-gray-100`}
                          >
                            <img
                              src={v.images?.[0] || v.defaultImage || "/placeholder.jpg"}
                              alt={v.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <h3 className="font-bold text-gray-900 text-xs truncate mb-0.5">
                            {truncateText(v.name, vendorCount === 1 ? 30 : vendorCount === 2 ? 18 : 12)}
                          </h3>
                          <div className="flex items-center gap-0.5 text-[10px] text-gray-500 mb-1.5">
                            <MapPin size={8} />
                            <span className="truncate">{v.address?.city || "N/A"}</span>
                          </div>

                          <div className="flex items-center gap-1 mb-2">
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            <span className="font-bold text-[11px]">{(v.rating || 0).toFixed(1)}</span>
                            <span className="text-[9px] text-gray-400">({v.reviews || 0})</span>
                          </div>

                          <div className="mb-1.5">
                            <div className="flex justify-between text-[9px] mb-0.5">
                              <span className="text-gray-500 font-medium">Score</span>
                              <span className="font-bold" style={{ color: colorPrimary }}>
                                {score}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: colorPrimary }}
                              />
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-gray-100">
                            <p className="text-[8px] text-gray-400 uppercase font-semibold">From</p>
                            <p className="text-sm font-bold" style={{ color: colorPrimary }}>
                              ₹{formatPrice(getVendorPrice(v))}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-0.5 mt-1.5">
                            {(v.isVerified || v.tags?.includes("Verified")) && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[7px] font-bold rounded flex items-center gap-0.5">
                                <BadgeCheck size={7} /> Verified
                              </span>
                            )}
                            {v.tags?.includes("Popular") && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[7px] font-bold rounded flex items-center gap-0.5">
                                <Flame size={7} /> Popular
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {tab === "overview" && (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                          <BarChart3 size={13} style={{ color: colorPrimary }} />
                          Comparison
                        </h4>
                      </div>

                      {COMPARE_FEATURES.map((f, idx) => {
                        const Icon = f.icon;
                        return (
                          <div
                            key={f.key}
                            className={`flex items-stretch ${
                              idx !== COMPARE_FEATURES.length - 1 ? "border-b border-gray-50" : ""
                            }`}
                          >
                            <div className="w-20 shrink-0 px-2.5 py-2 bg-gray-50 border-r border-gray-100 flex items-center gap-1.5">
                              <Icon size={11} className="text-gray-400 shrink-0" />
                              <span className="text-[10px] font-medium text-gray-600 truncate">{f.label}</span>
                            </div>
                            <div className="flex-1 flex">
                              {vendors.map((v) => {
                                const val = getCompareVal(v, f.key);
                                const formatted = f.format(val);
                                const isBest = f.higher !== null && bestVals[f.key] !== null && val === bestVals[f.key];
                                return (
                                  <div
                                    key={v._id}
                                    className={`${colClass} px-2 py-2 text-center border-r border-gray-50 last:border-r-0 flex flex-col justify-center`}
                                  >
                                    <span
                                      className={`text-xs font-semibold ${isBest ? "" : "text-gray-700"}`}
                                      style={isBest ? { color: colorPrimary } : {}}
                                    >
                                      {formatted}
                                    </span>
                                    {isBest && f.higher !== null && (
                                      <span
                                        className="text-[8px] px-1 py-0.5 rounded mt-0.5 font-bold self-center"
                                        style={{ backgroundColor: `${colorPrimary}15`, color: colorPrimary }}
                                      >
                                        Best
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {tab === "details" && (
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                          <h4 className="font-bold text-gray-900 text-xs">About</h4>
                        </div>
                        <div className="flex">
                          {vendors.map((v) => (
                            <div key={v._id} className={`${colClass} p-2.5 border-r border-gray-100 last:border-r-0`}>
                              <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-4">
                                {v.description || "No description available."}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                          <h4 className="font-bold text-gray-900 text-xs">Amenities</h4>
                        </div>
                        <div className="flex">
                          {vendors.map((v) => {
                            const amenities = v.amenities || v.facilities || [];
                            return (
                              <div key={v._id} className={`${colClass} p-2.5 border-r border-gray-100 last:border-r-0`}>
                                {amenities.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {amenities.slice(0, 4).map((a, i) => (
                                      <span
                                        key={i}
                                        className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-medium text-gray-600"
                                      >
                                        {truncateText(a, 10)}
                                      </span>
                                    ))}
                                    {amenities.length > 4 && (
                                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-medium text-gray-500">
                                        +{amenities.length - 4}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-[10px] text-gray-400">None listed</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                          <h4 className="font-bold text-gray-900 text-xs">Contact</h4>
                        </div>
                        <div className="flex">
                          {vendors.map((v) => (
                            <div
                              key={v._id}
                              className={`${colClass} p-2.5 border-r border-gray-100 last:border-r-0 space-y-1`}
                            >
                              {v.phone && (
                                <div className="flex items-center gap-1 text-[10px] text-gray-600">
                                  <Phone size={9} className="text-gray-400" />
                                  <span className="truncate">{v.phone}</span>
                                </div>
                              )}
                              {v.responseTime && (
                                <div className="flex items-center gap-1 text-[10px] text-gray-600">
                                  <Clock size={9} className="text-gray-400" />
                                  <span>{v.responseTime}</span>
                                </div>
                              )}
                              {!v.phone && !v.responseTime && (
                                <p className="text-[10px] text-gray-400">Not available</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === "pricing" && (
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                          <h4 className="font-bold text-gray-900 text-xs">Price Details</h4>
                        </div>
                        <div className="flex">
                          {vendors.map((v) => {
                            const price = getVendorPrice(v);
                            const orig = v.originalPrice;
                            const hasDisc = orig && orig > price;
                            const discPct = hasDisc ? Math.round((1 - price / orig) * 100) : 0;

                            return (
                              <div key={v._id} className={`${colClass} p-2.5 border-r border-gray-100 last:border-r-0`}>
                                <div className="mb-2.5">
                                  <p className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Starting</p>
                                  <div className="flex items-baseline gap-1 flex-wrap">
                                    <span className="text-lg font-black" style={{ color: colorPrimary }}>
                                      ₹{formatPrice(price)}
                                    </span>
                                    {hasDisc && (
                                      <span className="text-[11px] text-gray-400 line-through">
                                        ₹{formatPrice(orig)}
                                      </span>
                                    )}
                                  </div>
                                  {hasDisc && (
                                    <span className="inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded">
                                      <Percent size={8} /> {discPct}% OFF
                                    </span>
                                  )}
                                </div>

                                <div className="space-y-1 pt-2 border-t border-gray-100 text-[10px]">
                                  {v.perDayPrice?.max && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Max/Day</span>
                                      <span className="font-semibold">₹{formatPrice(v.perDayPrice.max)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Terms</span>
                                    <span className="font-semibold">{v.paymentTerms || "Flexible"}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                        <h4 className="font-bold text-green-800 text-xs mb-2 flex items-center gap-1.5">
                          <ThumbsUp size={13} />
                          Value Analysis
                        </h4>
                        <div className="flex gap-2">
                          {vendors.map((v) => {
                            const price = getVendorPrice(v);
                            const rating = v.rating || 0;
                            const valueScore = price > 0 ? Math.round((rating / 5) * 100 - (price / 100000) * 10) : 0;
                            const norm = Math.max(0, Math.min(100, valueScore + 50));

                            return (
                              <div
                                key={v._id}
                                className={`${colClass} bg-white rounded-lg p-2 border border-green-200`}
                              >
                                <p className="text-[9px] text-gray-500 font-medium truncate mb-1">
                                  {truncateText(v.name, 12)}
                                </p>
                                <div className="flex items-center gap-1.5">
                                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${norm}%` }} />
                                  </div>
                                  <span className="text-[10px] font-bold text-green-700">{norm}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              className="bg-white border-t border-gray-100 p-3 shrink-0"
              style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
            >
              <div className="flex gap-2.5">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic("light");
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-600 text-sm"
                >
                  Close
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic("medium");
                    if (vendors[winnerIdx])
                      window.location.href = `/vendor/${vendors[winnerIdx].category}/${vendors[winnerIdx]._id}`;
                  }}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: colorPrimary }}
                >
                  <Trophy size={16} />
                  View Best
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
CompareModalOld.displayName = "CompareModalOld";

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function MarketplacePageWrapper() {
  const params = useParams();
  const pageCategory = params?.category || "";
  const searchInputRef = useRef(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [vendorData, dispatchVendorData] = useReducer(vendorDataReducer, {
    vendors: [],
    pagination: { totalPages: 1, totalVendors: 0 },
    cities: [],
    isLoading: true,
    error: null,
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useLocalStorage("mp_viewMode", "list");
  const [isMapView, setIsMapView] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalActionType, setLeadModalActionType] = useState("general");

  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");

  const [recentSearches, setRecentSearches] = useLocalStorage("mp_recentSearches", []);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const { setIsNavbarVisible, isNavbarVisible } = useNavbarVisibilityStore();

  const [toast, setToast] = useState({ message: "", type: "success", isVisible: false });
  const toastQueueRef = useRef([]);
  const isShowingToastRef = useRef(false);

  const haptic = useHapticFeedback();
  const { scrollY, scrollDirection } = useScrollPosition();
  const isOnline = useNetworkStatus();

  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const debouncedPriceRange = useDebounce(priceRange, DEBOUNCE_DELAY);

  const { setActiveCategory } = useCartStore();

  const handleRefresh = useCallback(async () => {
    setCurrentPage(1);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, []);

  const { pullDistance, isRefreshing } = usePullToRefresh(handleRefresh);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (selectedSubcategory) count++;
    if (showFeaturedOnly) count++;
    if (selectedLocations.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000000) count++;
    if (ratingFilter > 0) count++;
    if (sortBy && sortBy !== "rating") count++; // ✅ ADD: Sort filter
    if (sortOrder && sortOrder !== "desc") count++; // ✅ ADD: Sort order filter
    return count;
  }, [
    selectedCategories,
    selectedSubcategory,
    showFeaturedOnly,
    selectedLocations,
    priceRange,
    ratingFilter,
    sortBy,
    sortOrder,
  ]);

  const currentSortLabel = useMemo(() => SORT_OPTIONS.find((o) => o.id === sortBy)?.label || "Sort", [sortBy]);

  const buildUrlWithParams = useCallback((params) => {
    const url = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined || value === "") continue;

      if (Array.isArray(value)) {
        if (value.length > 0) url.set(key, value.join(","));
      } else {
        url.set(key, value.toString());
      }
    }

    return url.toString();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 🔥 Build complete state object FIRST
    const initialState = {
      categories: [],
      search: "",
      sortBy: "rating",
      sortOrder: "desc",
      subcategory: "",
      rating: 0,
      featured: false,
      page: 1,
      priceRange: [0, 1000000],
      locations: [],
    };

    // Process categories
    if (pageCategory) {
      initialState.categories = [pageCategory];
    } else {
      const urlCats = params.get("categories");
      if (urlCats) {
        initialState.categories = urlCats.split(",").filter((cat) => VENDOR_CATEGORIES.some((c) => c.id === cat));
      }
    }

    // Process other params
    initialState.search = decodeURIComponent(params.get("search") || "");
    initialState.sortBy = params.get("sortBy") || "rating";
    initialState.sortOrder = params.get("sortOrder") || "desc";
    initialState.subcategory = params.get("subcategory") || "";
    initialState.rating = parseFloat(params.get("minRating")) || 0;
    initialState.featured = params.get("featured") === "true";
    initialState.page = parseInt(params.get("page")) || 1;

    const minP = params.get("minPrice");
    const maxP = params.get("maxPrice");
    const minPrice = minP ? Math.max(0, parseInt(minP)) : 0;
    const maxPrice = maxP ? Math.min(1000000, Math.max(minPrice, parseInt(maxP))) : 1000000;
    initialState.priceRange = [minPrice, maxPrice];

    const cities = params.get("cities");
    if (cities) initialState.locations = cities.split(",").filter(Boolean);

    // 🔥 CRITICAL: Use startTransition to batch ALL updates
    startTransition(() => {
      setSelectedCategories(initialState.categories);
      setSearchQuery(initialState.search);
      setSortBy(initialState.sortBy);
      setSortOrder(initialState.sortOrder);
      setSelectedSubcategory(initialState.subcategory);
      setRatingFilter(initialState.rating);
      setShowFeaturedOnly(initialState.featured);
      setCurrentPage(initialState.page);
      setPriceRange(initialState.priceRange);
      setSelectedLocations(initialState.locations);

      if (pageCategory) setActiveCategory(pageCategory);

      // 🔥 Set flag AFTER all state updates are queued
      setIsInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim().length > 2) {
      setRecentSearches((prev) => {
        const trimmed = debouncedSearchQuery.trim();
        const filtered = (prev || []).filter((s) => s && s.trim() && s.trim().toLowerCase() !== trimmed.toLowerCase());
        return [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      });
    }
  }, [debouncedSearchQuery, setRecentSearches]);

  useEffect(() => {
    if (!isInitialized) return;

    // 🔥 CRITICAL: Use debounced values to match fetch effect
    const timeoutId = setTimeout(() => {
      const params = {};

      const isOnlyPath = selectedCategories.length === 1 && selectedCategories[0] === pageCategory;

      if (selectedCategories.length > 0 && !isOnlyPath) {
        params.categories = selectedCategories.join(",");
      }
      if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
        params.search = debouncedSearchQuery.trim();
      }
      if (sortBy !== "rating") params.sortBy = sortBy;
      if (sortOrder !== "desc") params.sortOrder = sortOrder;
      if (selectedSubcategory) params.subcategory = selectedSubcategory;
      if (currentPage > 1) params.page = currentPage;

      // 🔥 CRITICAL: Use DEBOUNCED price range
      if (debouncedPriceRange[0] > 0) params.minPrice = debouncedPriceRange[0];
      if (debouncedPriceRange[1] < 1000000) params.maxPrice = debouncedPriceRange[1];

      if (selectedLocations.length > 0) params.cities = selectedLocations.join(",");
      if (ratingFilter > 0) params.minRating = ratingFilter;
      if (showFeaturedOnly) params.featured = "true";

      const queryString = buildUrlWithParams(params);
      const base = selectedCategories.length === 0 ? "/vendors/marketplace" : window.location.pathname;
      const newUrl = queryString ? `${base}?${queryString}` : base;
      const currentSearch = window.location.search;
      const newSearch = queryString ? `?${queryString}` : "";

      // 🔥 ADD: Prevent unnecessary router updates
      if (currentSearch !== newSearch) {
        router.replace(newUrl, { scroll: false });
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [
    isInitialized,
    selectedCategories,
    debouncedSearchQuery, // Use debounced
    sortBy,
    sortOrder,
    currentPage,
    debouncedPriceRange, // 🔥 CHANGED: Use debounced
    selectedLocations,
    selectedSubcategory,
    ratingFilter,
    showFeaturedOnly,
    pageCategory,
    router,
    buildUrlWithParams,
  ]);

  useEffect(() => {
    // 🔥 CHANGED: Gate URL updates until initialized
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      const params = {};

      const isOnlyPath = selectedCategories.length === 1 && selectedCategories[0] === pageCategory;

      if (selectedCategories.length > 0 && !isOnlyPath) {
        params.categories = selectedCategories.join(",");
      }
      if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
        params.search = debouncedSearchQuery.trim();
      }
      if (sortBy !== "rating") params.sortBy = sortBy;
      if (sortOrder !== "desc") params.sortOrder = sortOrder;
      if (selectedSubcategory) params.subcategory = selectedSubcategory;
      if (currentPage > 1) params.page = currentPage;
      if (priceRange[0] > 0) params.minPrice = priceRange[0];
      if (priceRange[1] < 1000000) params.maxPrice = priceRange[1];
      if (selectedLocations.length > 0) params.cities = selectedLocations.join(",");
      if (ratingFilter > 0) params.minRating = ratingFilter;
      if (showFeaturedOnly) params.featured = "true";

      const queryString = buildUrlWithParams(params);
      const base = selectedCategories.length === 0 ? "/vendors/marketplace" : window.location.pathname;
      const newUrl = queryString ? `${base}?${queryString}` : base;
      const currentSearch = window.location.search;
      const newSearch = queryString ? `?${queryString}` : "";

      if (window.location.search !== newSearch) {
        router.replace(newUrl, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    // 🔥 CHANGED: Removed isInitialLoadDone
    isInitialized,
    selectedCategories,
    debouncedSearchQuery,
    sortBy,
    sortOrder,
    currentPage,
    priceRange,
    selectedLocations,
    selectedSubcategory,
    ratingFilter,
    showFeaturedOnly,
    pageCategory,
    router,
    buildUrlWithParams,
  ]);

  useEffect(() => {
  if (!isInitialized) return;

  const controller = new AbortController();
  let isMounted = true; // 🔥 ADD: Mount tracking

  const fetchVendors = async () => {
    // 🔥 CRITICAL: Don't update state if already loading
    if (!isMounted) return;
    
    dispatchVendorData({ type: 'SET_LOADING', payload: true });

    const queryParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: ITEMS_PER_PAGE.toString(),
      sortBy,
      sortOrder,
    });

    // Add filters (keep existing code)
    if (debouncedSearchQuery) {
      queryParams.set("search", decodeURIComponent(debouncedSearchQuery));
    }
    if (selectedCategories.length > 0) {
      queryParams.set("categories", selectedCategories.join(","));
    }
    if (selectedSubcategory) queryParams.set("subcategory", selectedSubcategory);
    if (showFeaturedOnly) queryParams.set("featured", "true");
    if (selectedLocations.length > 0) queryParams.set("cities", selectedLocations.join(","));
    if (debouncedPriceRange[0] > 0) queryParams.set("minPrice", debouncedPriceRange[0].toString());
    if (debouncedPriceRange[1] < 1000000) queryParams.set("maxPrice", debouncedPriceRange[1].toString());
    if (ratingFilter > 0) queryParams.set("minRating", ratingFilter.toString());

    try {
      const response = await fetch(`/api/vendor?${queryParams.toString()}`, {
        signal: controller.signal,
      });
      
      // 🔥 CRITICAL: Check mount status before parsing
      if (!isMounted) return;
      
      const result = await response.json();

      // 🔥 CRITICAL: Final mount check before state update
      if (!isMounted) return;

      if (result.success) {
        const mappedVendors = result.data.map((v) => {
          let position;
          if (v.location?.coordinates && Array.isArray(v.location.coordinates)) {
            position = {
              lat: v.location.coordinates[1],
              lng: v.location.coordinates[0],
            };
          } else if (v.address?.city && CITY_COORDS[v.address.city]) {
            position = CITY_COORDS[v.address.city];
          } else {
            position = DEFAULT_CENTER;
          }
          return { ...v, position };
        });

        const cities = [...new Set(result.data.map((v) => v.address?.city).filter(Boolean))];

        dispatchVendorData({
          type: 'SET_VENDORS',
          payload: {
            vendors: mappedVendors,
            pagination: {
              totalPages: result.pagination?.totalPages || 1,
              totalVendors: result.pagination?.total || 0,
            },
            cities,
          },
        });
      } else {
        dispatchVendorData({
          type: 'SET_VENDORS',
          payload: {
            vendors: [],
            pagination: { totalPages: 1, totalVendors: 0 },
            cities: [],
          },
        });
      }
    } catch (err) {
      if (err.name !== "AbortError" && isMounted) {
        dispatchVendorData({ type: 'SET_ERROR', payload: "Failed to load vendors." });
      }
    }
  };

  fetchVendors();
  
  return () => {
    isMounted = false; // 🔥 CRITICAL: Prevent state updates after unmount
    controller.abort();
  };
}, [
  isInitialized,
  currentPage,
  sortBy,
  sortOrder,
  debouncedSearchQuery,
  debouncedPriceRange,
  selectedCategories,
  selectedSubcategory,
  showFeaturedOnly,
  selectedLocations,
  ratingFilter,
]);

  const { vendors, pagination: paginationInfo, cities: availableCities, isLoading, error } = vendorData;

  const showToast = useCallback((message, type = "success") => {
    toastQueueRef.current.push({ message, type });

    if (!isShowingToastRef.current) {
      let timeoutId; // 🔥 ADD: Track timeout ID

      const processQueue = () => {
        if (toastQueueRef.current.length === 0) {
          isShowingToastRef.current = false;
          return;
        }

        isShowingToastRef.current = true;
        const nextToast = toastQueueRef.current.shift();
        setToast({ ...nextToast, isVisible: true });

        // 🔥 CRITICAL: Store timeout ID for cleanup
        timeoutId = setTimeout(() => {
          setToast((prev) => ({ ...prev, isVisible: false }));
          setTimeout(processQueue, 300);
        }, 3000);
      };

      processQueue();
    }
  }, []);

  // 🔥 ADD: Cleanup effect
  useEffect(() => {
    return () => {
      // Clear queue and refs on unmount
      toastQueueRef.current = [];
      isShowingToastRef.current = false;
    };
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const handleCategoryChange = useCallback(
    (cat) => {
      haptic("light");
      startTransition(() => {
        // 🔥 ADD: Batch updates
        if (cat === "__clear__") {
          setSelectedCategories([]);
          setSelectedSubcategory("");
          setCurrentPage(1); // ✅ Already present
          if (pageCategory) {
            router.push("/vendors/marketplace");
          }
        } else {
          const isCurrentlySelected = selectedCategories.includes(cat);

          if (isCurrentlySelected) {
            setSelectedCategories([]);
            setSelectedSubcategory("");
          } else {
            const newCategory = [cat];
            const subcategoryBelongsToNew = SUBCATEGORIES[cat]?.some((sub) => sub.id === selectedSubcategory);

            setSelectedCategories(newCategory);
            if (!subcategoryBelongsToNew) {
              setSelectedSubcategory("");
            }
          }
          setCurrentPage(1); // ✅ Already present
        }
      });
    },
    [pageCategory, selectedCategories, selectedSubcategory, router, haptic],
  );

  const handleFilterPanelCategoryChange = useCallback(
    (cat) => {
      haptic("light");
      setSelectedCategories((prev) => {
        const newCategories = prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat];

        // Clear subcategory if no categories match it
        if (!newCategories.includes(cat) && selectedSubcategory) {
          const subcategoryBelongsToSelected = newCategories.some((catId) =>
            SUBCATEGORIES[catId]?.some((sub) => sub.id === selectedSubcategory),
          );
          if (!subcategoryBelongsToSelected) {
            setSelectedSubcategory("");
          }
        }
        return newCategories;
      });
      setCurrentPage(1);
    },
    [selectedSubcategory, haptic],
  );

  const handleSubcategoryChange = useCallback((sub) => {
    setSelectedSubcategory(sub);
    setCurrentPage(1); // ✅ ADD: Reset to page 1
  }, []);

  const handleLocationChange = useCallback((city) => {
    setSelectedLocations((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
    setCurrentPage(1); // ✅ ADD: Reset to page 1
  }, []);

  const handleCompareToggle = useCallback(
    (vendor) => {
      startTransition(() => {
        setCompareList((prev) => {
          // Check if already in list (toggle off)
          const exists = prev.find((v) => v._id === vendor._id);

          if (exists) {
            // Remove vendor from list
            const newList = prev.filter((v) => v._id !== vendor._id);
            if (newList.length === 0) {
              setCompareMode(false);
            }
            return newList;
          }

          // Check max limit
          if (prev.length >= MAX_COMPARE_ITEMS) {
            showToast(`Maximum ${MAX_COMPARE_ITEMS} vendors can be compared`, "warning");
            return prev;
          }

          // ============================================
          // CATEGORY VALIDATION - Only same category vendors
          // ============================================
          if (prev.length > 0) {
            const existingCategory = prev[0].category?.toLowerCase().trim();
            const newCategory = vendor.category?.toLowerCase().trim();

            if (existingCategory && newCategory && existingCategory !== newCategory) {
              // Get category display name
              const existingCatName =
                VENDOR_CATEGORIES.find((c) => c.id === existingCategory)?.label || existingCategory;
              const newCatName = VENDOR_CATEGORIES.find((c) => c.id === newCategory)?.label || newCategory;

              showToast(
                `Cannot add "${vendor.name}" (${newCatName}). You can only compare ${existingCatName} vendors.`,
                "error",
              );
              return prev;
            }
          }

          // Add vendor to list
          const newList = [...prev, vendor];

          if (!compareMode) {
            setCompareMode(true);
          }

          return newList;
        });
      });
    },
    [compareMode, showToast],
  );

  const handlePageChange = useCallback(
    (page) => {
      haptic("light");
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [haptic],
  );

  const clearAllFilters = useCallback(() => {
    haptic("medium");

    startTransition(() => {
      setSelectedCategories([]);
      setSelectedSubcategory("");
      setPriceRange([0, 1000000]);
      setShowFeaturedOnly(false);
      setSelectedLocations([]);
      setSearchQuery("");
      setSortBy("rating");
      setSortOrder("desc");
      setRatingFilter(0);
      setCurrentPage(1);
      // Also clear compare mode if active
      if (compareMode) {
        setCompareMode(false);
        setCompareList([]);
      }
    });

    showToast("All filters cleared", "info");
  }, [haptic, showToast, compareMode]);

  const handleSelectRecentSearch = useCallback((search) => {
    setSearchQuery(search);
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  }, []);

    const handleCategoryMismatch = useCallback((errorMessage, categories) => {
    console.warn("Category mismatch detected:", errorMessage);
    showToast(errorMessage, "error");
    // Optional: You can add additional handling here
    // For example, auto-clearing the compare list or showing a toast
  }, []);

  const clearRecentSearches = useCallback(() => {
    haptic("light");
    setRecentSearches([]);
    showToast("Search history cleared", "info");
  }, [haptic, setRecentSearches, showToast]);

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedSubcategory ||
    selectedLocations.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000000 ||
    ratingFilter > 0 ||
    showFeaturedOnly ||
    (sortBy && sortBy !== "rating") ||
    (sortOrder && sortOrder !== "desc");

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollProgressBar />
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <OfflineBanner />
      <PullToRefreshUI pullDistance={pullDistance} isRefreshing={isRefreshing} />
      <Toast {...toast} onClose={hideToast} />
      <ScrollToTopButton />
      <CartPreview colorPrimary={COLORS.primary} />

      <motion.header
        animate={{ y: scrollDirection === "down" && scrollY > 200 ? -60 : 0 }}
        transition={TRANSITION.fast}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Marketplace</h1>
              <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">
                {isLoading ? "Loading..." : `${paginationInfo?.totalVendors || 0} vendors`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic("light");
                  setCompareMode(!compareMode);
                  if (compareMode) setCompareList([]);
                }}
                className={`p-2.5 rounded-xl transition-all ${
                  compareMode ? "text-white shadow-md" : "bg-gray-100 text-gray-600"
                }`}
                style={compareMode ? { backgroundColor: COLORS.primary } : {}}
              >
                <ArrowRightLeft size={20} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic("light");
                  setViewMode(viewMode === "list" ? "grid" : "list");
                }}
                className="p-2.5 bg-gray-100 rounded-xl text-gray-600"
              >
                {viewMode === "list" ? <LayoutGrid size={20} /> : <LayoutList size={20} />}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic("light");
                  setIsMapView(!isMapView);
                }}
                className={`p-2.5 rounded-xl transition-all ${
                  isMapView ? "text-white shadow-md" : "bg-gray-100 text-gray-600"
                }`}
                style={isMapView ? { backgroundColor: COLORS.primary } : {}}
              >
                <MapIcon size={20} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic("light");
                  setMobileFiltersOpen(true);
                  setIsNavbarVisible(false);
                }}
                className={`relative p-2.5 rounded-xl transition-all ${
                  activeFilterCount > 0 ? "text-white shadow-md" : "bg-gray-100 text-gray-600"
                }`}
                style={activeFilterCount > 0 ? { backgroundColor: COLORS.primary } : {}}
              >
                <SlidersHorizontal size={20} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsSearchFocused(true);
                haptic("light");
              }}
              onBlur={() => {
                // Delay to allow click events on recent searches to fire
                setTimeout(() => setIsSearchFocused(false), 250);
              }}
              placeholder="Search vendors, locations..."
              className="w-full pl-11 pr-10 py-3 bg-gray-100 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-gray-300 rounded-full"
              >
                <X size={12} className="text-gray-600" />
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isSearchFocused && recentSearches.length > 0 && !searchQuery && (
            <RecentSearches
              searches={recentSearches}
              onSelect={handleSelectRecentSearch}
              onClear={clearRecentSearches}
              colorPrimary={COLORS.primary}
            />
          )}
        </AnimatePresence>

        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              haptic("light");
              setSortSheetOpen(true);
              setIsNavbarVisible(false);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl text-xs font-semibold text-gray-700 border border-gray-200 whitespace-nowrap shadow-sm"
          >
            <Filter size={14} />
            {currentSortLabel}
            <ChevronDown size={14} className="text-gray-400" />
          </motion.button>

          {SORT_OPTIONS.slice(0, 4).map((opt) => {
            const Icon = opt.icon;
            const isSelected = sortBy === opt.id;
            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  haptic("light");
                  setSortBy(opt.id); // ✓ This already works
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                  isSelected ? "text-white border-transparent shadow-md" : "bg-white text-gray-600 border-gray-200"
                }`}
                style={isSelected ? { backgroundColor: COLORS.primary } : {}}
              >
                <Icon size={14} />
                {opt.label}
              </motion.button>
            );
          })}
        </div>
      </motion.header>

      <main className="px-4 pt-4">
        <AnimatePresence>
          <ActiveFiltersDisplay
            searchQuery={searchQuery}
            selectedCategories={selectedCategories}
            selectedSubcategory={selectedSubcategory}
            selectedLocations={selectedLocations}
            priceRange={priceRange}
            ratingFilter={ratingFilter}
            showFeaturedOnly={showFeaturedOnly}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onClearAll={clearAllFilters}
            colorPrimary={COLORS.primary}
          />
        </AnimatePresence>

        <VendorProfilesCarousel 
  colorPrimary={COLORS.primary} 
  colorSecondary={COLORS.secondary}
  selectedCategories={selectedCategories}
  selectedSubcategory={selectedSubcategory}
  selectedLocations={selectedLocations}
  priceRange={priceRange}
  sortBy={sortBy}
  sortOrder={sortOrder}
  ratingFilter={ratingFilter}
  showFeaturedOnly={showFeaturedOnly}
/>

        <CategoryChips
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          colorPrimary={COLORS.primary}
        />

        <AnimatePresence>
          {selectedCategories.length === 1 && SUBCATEGORIES[selectedCategories[0]] && (
            <SubcategoryChips
              selectedCategory={selectedCategories[0]}
              selectedSubcategory={selectedSubcategory}
              onSubcategoryChange={handleSubcategoryChange}
              colorPrimary={COLORS.primary}
            />
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3"
          >
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </div>
            {/* 🔥 CHANGED: Use reducer dispatch instead of setError */}
            <button
              onClick={() => dispatchVendorData({ type: "SET_ERROR", payload: null })}
              className="p-1 text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isMapView ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<MapLoadingPlaceholder />}>
                <MapView vendors={vendors} onVendorSelect={() => setIsMapView(false)} center={DEFAULT_CENTER} />
              </Suspense>
            </motion.div>
          ) : !isInitialized || (isLoading && vendors.length === 0) ? (
            /* PHASE 1: Initial Loading - Show skeletons until first fetch completes */
            <motion.div
              key="initial-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} viewMode={viewMode} />
              ))}
            </motion.div>
          ) : (
            /* PHASE 2: Data Loaded State - Now show data or empty state */
            <div key="data-content">
              {isLoading && vendors.length === 0 ? (
                /* Subsequent loading (pagination, filters) - show skeletons */
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} viewMode={viewMode} />
                  ))}
                </div>
              ) : vendors.length > 0 ? (
                /* Sub-Phase A: Results found */
                <>
                  <div className="relative">
                    {isLoading && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse z-10" />}
                    <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
                      {vendors.map((vendor, index) => (
                        <motion.div
                          key={vendor._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.15,
                            delay: index * 0.01,
                          }}
                        >
                          <VendorCard
                            vendor={vendor}
                            viewMode={viewMode}
                            isComparing={compareMode}
                            isSelectedForCompare={!!compareList.find((v) => v._id === vendor._id)}
                            onCompare={handleCompareToggle}
                            colorPrimary={COLORS.primary}
                            onShowToast={showToast}
                            setCompareMode={setCompareMode}
                            setCompareList={setCompareList} 
                            setIsLeadModalOpen={setIsLeadModalOpen}
                            setLeadModalActionType={setLeadModalActionType}
                            isLeadModalOpen={isLeadModalOpen}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={paginationInfo.totalPages}
                    onPageChange={handlePageChange}
                    colorPrimary={COLORS.primary}
                    isLoading={isLoading}
                  />
                </>
              ) : (
                /* Sub-Phase B: No results */
                <EmptyState onClearFilters={clearAllFilters} colorPrimary={COLORS.primary} searchQuery={searchQuery} />
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      <CompareBar
        count={compareList.length}
        vendors={compareList}
        onClear={() => {
          setCompareList([]);
          setCompareMode(false);
          haptic("light");
        }}
        onView={() => {
          if (compareList.length < 2) {
            showToast("Select at least 2 vendors to compare", "info");
            return;
          } else {
            setShowCompare(true);
            setIsNavbarVisible(false);
          }
        }}
        colorPrimary={COLORS.primary}
      />
      <SortSheet
        isOpen={sortSheetOpen}
        onClose={() => {
          setSortSheetOpen(false);
          setIsNavbarVisible(true);
        }}
        currentSort={sortBy}
        onSortChange={setSortBy}
        onSortOrderChange={setSortOrder}
        currentSortOrder={sortOrder}
        colorPrimary={COLORS.primary}
      />
      <FilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => {
          setMobileFiltersOpen(false);
          setIsNavbarVisible(true);
        }}
        onClear={clearAllFilters}
        colorPrimary={COLORS.primary}
        activeFilterCount={activeFilterCount}
        totalResults={paginationInfo.totalVendors}
        setIsNavbarVisible={setIsNavbarVisible} 
        isNavbarVisible={isNavbarVisible} 
        showCompare={showCompare}
      >
        <FilterContent
          showFeaturedOnly={showFeaturedOnly}
          setShowFeaturedOnly={setShowFeaturedOnly}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleFilterPanelCategoryChange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          availableCities={availableCities}
          selectedLocations={selectedLocations}
          handleLocationChange={handleLocationChange}
          colorPrimary={COLORS.primary}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          setCurrentPage={setCurrentPage}
        />
      </FilterDrawer>
        <CompareModal
              isOpen={showCompare}
               onClose={() => {
          setShowCompare(false);
          setIsNavbarVisible(true);
        }}
              vendors={compareList}
              onCategoryMismatch={(errorMsg, categories) => {
                console.warn("Category mismatch in modal:", errorMsg);
                showToast(errorMsg, "error");
              }}
            />
    <LeadCaptureModalMobile
      isOpen={isLeadModalOpen}
      onClose={() => setIsLeadModalOpen(false)}
      actionType={leadModalActionType}
      title="Plan Your Perfect Event"
      subtitle="Get started with India's most affordable event planning marketplace"
    />
    </div>
  );
}
