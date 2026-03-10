"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  useRef,
  useReducer,
  startTransition,
  Suspense,
  useTransition,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  Star,
  MapPin,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Clock,
  Loader2,
  Grid3X3,
  List,
  LayoutGrid,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Award,
  ArrowLeft,
  Download,
  Shield,
  CheckCircle,
  BadgeCheck,
  Flame,
  Crown,
  Zap,
  Gift,
  Percent,
  Eye,
  ArrowUpDown,
  ArrowDown,
  RotateCcw,
  Check,
  Copy,
  ShoppingCart,
  Users,
  Building2,
  Camera,
  Music,
  Utensils,
  Palette,
  Calendar,
  Columns,
  Map as MapIcon,
  Navigation,
  Plus,
  PanelLeftClose,
  ArrowRightLeft,
  ArrowUp,
  Info,
  AlertCircle,
  Filter,
  BarChart3,
  Trophy,
  ThumbsUp,
  DollarSign,
  Scissors,
  RefreshCw,
  MoreHorizontal,
  Minus,
  Trash2,
  Tag,
  IndianRupee,
  SortDesc,
  SortAsc,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  MessageSquare,
  QrCode,
  ImageIcon,
} from "lucide-react";
import { useCartStore } from "../../../GlobalState/CartDataStore";
import { useUser } from "@clerk/clerk-react";
import SmartMedia from "../SmartMediaLoader";
import { useNavigationState } from "../../../hooks/useNavigationState";
import CompareModal from "./../CompareModalDesktop";
import { useAppValuesStore } from "../../../GlobalState/AppValuesStore";
import LeadCaptureModal from "../LeadCaptureModal";
// import CompareModal from "../../mobile/CompareModalMobile";

const COLORS = {
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  primaryDark: "#1d4ed8",
  secondary: "#f59e0b",
  success: "#10b981",
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
};

const VENDOR_CATEGORIES = [
  {
    id: "venues",
    label: "Venues",
    icon: Building2,
    emoji: "🏛️",
    color: "#8b5cf6",
  },
  {
    id: "photographers",
    label: "Photographers",
    icon: Camera,
    emoji: "📸",
    color: "#ec4899",
  },
  {
    id: "catering",
    label: "Caterers",
    icon: Utensils,
    emoji: "🍽️",
    color: "#f59e0b",
  },
  {
    id: "makeup",
    label: "Makeup Artists",
    icon: Palette,
    emoji: "💄",
    color: "#f43f5e",
  },
  {
    id: "mehendi",
    label: "Mehendi Artists",
    icon: Scissors,
    emoji: "✋",
    color: "#84cc16",
  },
  {
    id: "djs",
    label: "DJs & Music",
    icon: Music,
    emoji: "🎵",
    color: "#3b82f6",
  },
  {
    id: "planners",
    label: "Planners",
    icon: Calendar,
    emoji: "📋",
    color: "#06b6d4",
  },
  {
    id: "clothes",
    label: "Clothing",
    icon: Crown,
    emoji: "👗",
    color: "#a855f7",
  },
];

const SUBCATEGORIES = {
  venues: [
    { id: "banquet-halls", label: "Banquet Halls" },
    { id: "farmhouses", label: "Farmhouses" },
    { id: "hotels", label: "Hotels" },
    { id: "resorts", label: "Resorts" },
    { id: "lawns", label: "Lawns & Gardens" },
    { id: "destination", label: "Destination Wedding" },
  ],
  photographers: [
    { id: "wedding-photography", label: "Wedding Photography" },
    { id: "pre-wedding", label: "Pre-Wedding Shoot" },
    { id: "candid", label: "Candid Photography" },
    { id: "videography", label: "Videography" },
    { id: "drone", label: "Drone Photography" },
  ],
  makeup: [
    { id: "bridal-makeup", label: "Bridal Makeup" },
    { id: "party-makeup", label: "Party Makeup" },
    { id: "airbrush", label: "Airbrush Makeup" },
    { id: "hair-styling", label: "Hair Styling" },
  ],
  planners: [
    { id: "full-planning", label: "Full Planning" },
    { id: "partial-planning", label: "Partial Planning" },
    { id: "day-coordination", label: "Day Coordination" },
    { id: "destination-planning", label: "Destination Planning" },
  ],
  catering: [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "non-vegetarian", label: "Non-Vegetarian" },
    { id: "multi-cuisine", label: "Multi-Cuisine" },
    { id: "live-counters", label: "Live Counters" },
  ],
  clothes: [
    { id: "bridal-lehenga", label: "Bridal Lehenga" },
    { id: "groom-sherwani", label: "Groom Sherwani" },
    { id: "designer-wear", label: "Designer Wear" },
    { id: "rental", label: "Rental Services" },
  ],
  mehendi: [
    { id: "bridal-mehendi", label: "Bridal Mehendi" },
    { id: "arabic", label: "Arabic Design" },
    { id: "rajasthani", label: "Rajasthani Design" },
    { id: "minimal", label: "Minimal Design" },
  ],
  djs: [
    { id: "wedding-dj", label: "Wedding DJ" },
    { id: "sangeet-dj", label: "Sangeet DJ" },
    { id: "live-band", label: "Live Band" },
    { id: "dhol", label: "Dhol Players" },
  ],
};

const VIEW_MODES = [
  { id: "grid-3", icon: Grid3X3, label: "Grid" },
  { id: "grid-2", icon: LayoutGrid, label: "Large" },
  { id: "list", icon: List, label: "List" },
];

const SORT_OPTIONS = [
  {
    value: "rating",
    label: "Top Rated",
    icon: Star,
    description: "Highest rated first",
  },
  {
    value: "price-asc",
    label: "Budget",
    icon: DollarSign,
    description: "Lowest price first",
  },
  {
    value: "price-desc",
    label: "Premium",
    icon: Crown,
    description: "Highest price first",
  },
  {
    value: "bookings",
    label: "Popular",
    icon: TrendingUp,
    description: "Most booked",
  },
  { value: "newest", label: "New", icon: Zap, description: "Recently added" },
  {
    value: "reviews",
    label: "Reviews",
    icon: MessageCircle,
    description: "Most reviewed",
  },
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
};

const DEFAULT_CENTER = CITY_COORDS.Delhi;
const ITEMS_PER_PAGE = 12;
const MAX_COMPARE_ITEMS = 4;
const DEBOUNCE_DELAY = 350;
const MAX_RECENT_SEARCHES = 5;

const COMPARE_FEATURES = [
  {
    key: "rating",
    label: "Rating",
    icon: Star,
    format: (v) => `${(v || 0).toFixed(1)}/5`,
    higher: true,
  },
  {
    key: "price",
    label: "Price",
    icon: DollarSign,
    format: (v) => `₹${formatPrice(v || 0)}`,
    higher: false,
  },
  {
    key: "reviews",
    label: "Reviews",
    icon: MessageCircle,
    format: (v) => v || 0,
    higher: true,
  },
  {
    key: "bookings",
    label: "Bookings",
    icon: TrendingUp,
    format: (v) => v || 0,
    higher: true,
  },
  {
    key: "capacity",
    label: "Capacity",
    icon: Users,
    format: (v) => (v ? `${v}` : "-"),
    higher: true,
  },
  {
    key: "response",
    label: "Response",
    icon: Clock,
    format: (v) => v || "Fast",
    higher: null,
  },
];

// Lazy load map component
const MapView = dynamic(() => import("@/components/mobile/MapContainer"), {
  ssr: false,
  loading: () => <MapLoadingPlaceholder />,
});

// Custom Hooks
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

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (error) {
      console.warn(`Error reading localStorage "${key}":`, error);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const val = value instanceof Function ? value(prev) : value;
        if (isHydrated) {
          try {
            window.localStorage.setItem(key, JSON.stringify(val));
          } catch (error) {
            console.warn(`Error writing localStorage "${key}":`, error);
          }
        }
        return val;
      });
    },
    [key, isHydrated],
  );

  return [storedValue, setValue, isHydrated];
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

// Utility Functions
const formatPrice = (price) => {
  if (price == null || isNaN(price)) return "N/A";
  if (price === 0) return "0";
  if (price >= 100000) return `${(price / 100000).toFixed(1)}L`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
  return price.toLocaleString("en-IN");
};

const formatFullPrice = (price) => {
  if (price == null || isNaN(price)) return "N/A";
  if (price === 0) return "0";
  return price.toLocaleString("en-IN");
};

const getVendorPrice = (vendor) => {
  return (
    vendor.normalizedPrice ||
    vendor.perDayPrice?.min ||
    vendor.basePrice ||
    vendor.price?.min ||
    vendor.startingPrice ||
    vendor.price ||
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

// Reducer
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
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

// Sub-components
const ShareModal = ({ isOpen, onClose, shareItem }) => {
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== "undefined")
      setCurrentUrl(`https://${window.location.host}/vendor/${shareItem?.category}/${shareItem?._id}`);
  }, [isOpen]);

  if (!isOpen) return null;

  const shareOptions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      action: () => {
        window.open(`https://wa.me/?text=Check out ${shareItem ? shareItem.name : "vendor"}! ${currentUrl}`);
        onClose();
      },
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`);
        onClose();
      },
    },
    {
      id: "twitter",
      label: "Twitter",
      icon: Twitter,
      color: "bg-sky-500",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=Check out ${shareItem ? shareItem.name : "vendor"}!&url=${encodeURIComponent(currentUrl)}`,
        );
        onClose();
      },
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700",
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`);
        onClose();
      },
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
      action: () => onClose(),
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      color: "bg-gray-600",
      action: () => {
        window.open(
          `mailto:?subject=Check out ${shareItem ? shareItem.name : "vendor"}&body=${encodeURIComponent(currentUrl)}`,
        );
        onClose();
      },
    },
    {
      id: "sms",
      label: "Message",
      icon: MessageSquare,
      color: "bg-green-600",
      action: () => {
        window.open(`sms:?body=Check out ${shareItem ? shareItem.name : "vendor"}! ${currentUrl}`);
        onClose();
      },
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: Copy,
      color: "bg-gray-500",
      action: () => {
        navigator.clipboard.writeText(currentUrl);
        setCopiedFeedback(true);
        setTimeout(() => {
          setCopiedFeedback(false);
          onClose();
        }, 1500);
      },
    },
  ];

  const handleDownloadQR = () => {
    const svg = document.getElementById("share-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${shareItem ? shareItem.name.replace(/\s+/g, "_") : "profile"}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share Profile</h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <AnimatePresence mode="wait">
          {showQR ? (
            <motion.div
              key="qr-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowQR(false)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">QR Code</h3>
                <div className="w-10" />
              </div>
              <div className="flex justify-center py-4">
                <div className="bg-white p-4 rounded-2xl shadow-lg">
                  <QRCodeSVG
                    id="share-qr-code"
                    value={currentUrl}
                    size={200}
                    level="H"
                    includeMargin
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">Scan to visit this profile</p>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 break-all text-center">{currentUrl}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadQR}
                  className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Download size={18} /> Download
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentUrl);
                    setCopiedFeedback(true);
                    setTimeout(() => setCopiedFeedback(false), 2000);
                  }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {copiedFeedback ? <Check size={18} /> : <Copy size={18} />}
                  {copiedFeedback ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="share-options" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button
                onClick={() => setShowQR(true)}
                className="w-full flex items-center gap-4 p-4 mb-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:from-gray-100 hover:to-gray-150 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                  <QrCode size={28} className="text-gray-700 dark:text-gray-300" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">QR Code</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Scan to share instantly</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
              <div className="grid grid-cols-4 gap-5">
                {shareOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={option.action}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${option.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all`}
                    >
                      {option.id === "copy" && copiedFeedback ? (
                        <Check size={24} className="text-white" />
                      ) : (
                        <option.icon size={24} className="text-white" />
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">
                      {option.id === "copy" && copiedFeedback ? "Copied!" : option.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const ScrollProgressBar = memo(() => {
  const progress = useScrollProgress();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 2 ? 1 : 0 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
});
ScrollProgressBar.displayName = "ScrollProgressBar";

const OfflineBanner = memo(() => {
  const isOnline = useNetworkStatus();
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium fixed top-0 left-0 right-0 z-[200]"
        >
          <AlertCircle size={16} />
          <span>You&apos;re offline. Some features may be limited.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
OfflineBanner.displayName = "OfflineBanner";

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

const Toast = memo(({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: "bg-emerald-500", icon: CheckCircle },
    error: { bg: "bg-red-500", icon: AlertCircle },
    info: { bg: "bg-blue-500", icon: Info },
    warning: { bg: "bg-amber-500", icon: AlertCircle },
  }[type] || { bg: "bg-gray-700", icon: Info };

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 right-6 ${config.bg} text-white px-5 py-3 rounded-xl shadow-2xl z-[100] flex items-center gap-3 max-w-sm`}
    >
      <Icon size={18} className="shrink-0" />
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors shrink-0">
        <X size={14} />
      </button>
    </motion.div>
  );
});
Toast.displayName = "Toast";

const ScrollToTopButton = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-40 w-11 h-11 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
    >
      <ArrowUp size={18} className="text-blue-600" />
    </motion.button>
  );
});
ScrollToTopButton.displayName = "ScrollToTopButton";

const PromoCarousel = memo(() => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const autoScrollRef = useRef(null);

  const promos = useMemo(
    () => [
      {
        id: 1,
        badge: "LIMITED",
        title: "20% Off Venues",
        code: "PLANWAB20",
        gradient: "from-blue-500 to-blue-600",
        validUntil: "Dec 31",
      },
      {
        id: 2,
        badge: "EXCLUSIVE",
        title: "Free Pre-Wedding Shoot",
        code: "FREESHOOT",
        gradient: "from-pink-500 to-rose-600",
        validUntil: "Jan 15",
      },
      {
        id: 3,
        badge: "FLASH SALE",
        title: "₹5000 Off Catering",
        code: "FEAST5K",
        gradient: "from-amber-500 to-orange-600",
        validUntil: "Dec 25",
      },
      {
        id: 4,
        badge: "NEW USER",
        title: "10% Cashback",
        code: "WELCOME10",
        gradient: "from-emerald-500 to-green-600",
        validUntil: "Ongoing",
      },
    ],
    [],
  );

  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(autoScrollRef.current);
  }, [promos.length]);

  const handleCopyCode = useCallback(async (code, e) => {
    e.stopPropagation();
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(code);
      toast.success("Code copied!");
      setTimeout(() => setCopiedCode(null), 2000);
    }
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-amber-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Special Offers</h3>
        </div>
        <div className="flex gap-1.5">
          {promos.map((_, idx) => (
            <button key={idx} onClick={() => setActiveIndex(idx)} className="group relative">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? "w-8 bg-blue-600" : "w-1.5 bg-gray-300 dark:bg-gray-600"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Single Promo Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`bg-gradient-to-r ${promos[activeIndex].gradient} rounded-xl p-6 text-white`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-xs font-bold mb-2">
                {promos[activeIndex].badge}
              </span>
              <h4 className="text-2xl font-bold mb-1">{promos[activeIndex].title}</h4>
              <p className="text-white/80 text-sm">Valid until {promos[activeIndex].validUntil}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3">
              <p className="text-xs text-white/70 mb-1">Promo Code</p>
              <p className="font-mono font-bold text-lg tracking-wider">{promos[activeIndex].code}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleCopyCode(promos[activeIndex].code, e)}
              className="px-4 py-3 bg-white text-gray-900 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              {copiedCode === promos[activeIndex].code ? (
                <>
                  <Check size={16} /> Copied
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
PromoCarousel.displayName = "PromoCarousel";

const CartPreview = memo(() => {
  const { cartItems, getCartCount, getCartTotal, removeFromCart, updateQuantity, setOpenCartNavbar } = useCartStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const cartCount = getCartCount();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (cartCount === 0) return null;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-4 left-6 z-[65]"
    >
      <motion.div
        layout
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        style={{ width: isExpanded ? 320 : "auto" }}
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center justify-between gap-3 pb-[10px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center relative">
              <ShoppingCart size={20} className="text-blue-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            {isExpanded && (
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">
                  {cartCount} item{cartCount > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-500">₹{formatFullPrice(getCartTotal())}</p>
              </div>
            )}
          </div>
          {isExpanded && (
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
              <ChevronDown size={20} className="text-gray-400" />
            </motion.div>
          )}
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100"
            >
              <div className="max-h-72 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-3 border-b border-gray-50 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                        <p className="text-sm font-bold text-blue-600">₹{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item._id, item.quantity - 1);
                            }}
                            className="p-1.5 text-gray-600 hover:text-gray-900"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item._id, item.quantity + 1);
                            }}
                            className="p-1.5 text-gray-600 hover:text-gray-900"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item._id);
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50">
                <button
                  onClick={() => setOpenCartNavbar("open")}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm text-center shadow-md hover:bg-blue-700 transition-colors"
                >
                  View Cart
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});
CartPreview.displayName = "CartPreview";

const FilterSidebar = memo(
  ({
    searchQuery,
    setSearchQuery,
    showFeaturedOnly,
    setShowFeaturedOnly,
    selectedCategories,
    handleCategoryChange,
    priceRange,
    setPriceRange,
    availableCities,
    selectedLocations,
    handleLocationChange,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    setCurrentPage,
    onClear,
    isCollapsed,
    onToggleCollapse,
    selectedSubcategory,
    setSelectedSubcategory,
    recentSearches,
    onSelectRecentSearch,
    onClearRecentSearches,
  }) => {
    const [expandedSections, setExpandedSections] = useState({
      search: true,
      categories: true,
      price: true,
      location: false,
      rating: false,
      sort: false,
    });
    const [showAllCities, setShowAllCities] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const toggleSection = (section) => {
      setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const displayedCities = showAllCities ? availableCities : availableCities.slice(0, 5);

    const activeFiltersCount = useMemo(() => {
      let count = 0;
      if (searchQuery) count++;
      if (selectedCategories.length > 0) count += selectedCategories.length;
      if (selectedSubcategory) count++;
      if (priceRange[0] > 0 || priceRange[1] < 1000000) count++;
      if (selectedLocations.length > 0) count += selectedLocations.length;
      if (ratingFilter > 0) count++;
      if (showFeaturedOnly) count++;
      return count;
    }, [
      searchQuery,
      selectedCategories,
      selectedSubcategory,
      priceRange,
      selectedLocations,
      ratingFilter,
      showFeaturedOnly,
    ]);

    // Collapsed state
    if (isCollapsed) {
      const handleSectionClick = (sectionName) => {
        // First expand the sidebar
        onToggleCollapse();

        // Ensure the section is expanded
        if (!expandedSections[sectionName]) {
          toggleSection(sectionName);
        }

        // Wait for animations to complete, then scroll to section
        setTimeout(() => {
          const element = document.querySelector(`[data-section="${sectionName}"]`);
          if (element) {
            // Scroll container into view first
            const sidebar = element.closest(".overflow-y-auto");
            if (sidebar) {
              const elementTop = element.offsetTop;
              sidebar.scrollTo({
                top: elementTop - 20,
                behavior: "smooth",
              });
            }

            // Add a subtle highlight animation
            element.style.transition = "background-color 0.3s ease";
            element.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
            setTimeout(() => {
              element.style.backgroundColor = "";
            }, 600);
          }
        }, 350); // Wait for sidebar expansion animation
      };

      return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-3 flex flex-col items-center gap-3">
          {/* Expand Button */}
          <div className="relative group">
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Expand Filters
            </div>
          </div>

          <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Search Button */}
          <div className="relative group">
            <button
              onClick={() => handleSectionClick("search")}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <Search size={20} className="text-gray-500" />
              {searchQuery && <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />}
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Search Vendors
            </div>
          </div>

          {/* Categories Button */}
          <div className="relative group">
            <button
              onClick={() => handleSectionClick("categories")}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <Tag size={20} className="text-gray-500" />
              {selectedCategories.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
            </div>
          </div>

          {/* Price Button */}
          <div className="relative group">
            <button
              onClick={() => handleSectionClick("price")}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <IndianRupee size={20} className="text-gray-500" />
              {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-600 rounded-full" />
              )}
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Price Range
            </div>
          </div>

          {/* Location Button */}
          <div className="relative group">
            <button
              onClick={() => handleSectionClick("location")}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <MapPin size={20} className="text-gray-500" />
              {selectedLocations.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {selectedLocations.length}
                </span>
              )}
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Locations {selectedLocations.length > 0 && `(${selectedLocations.length})`}
            </div>
          </div>

          {/* Rating Button */}
          <div className="relative group">
            <button
              onClick={() => handleSectionClick("rating")}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <Star size={20} className="text-gray-500" />
              {ratingFilter > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-600 rounded-full" />}
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Rating Filter
            </div>
          </div>

          {/* Sort Button */}
          <div className="relative group">
            <button
              onClick={() => handleSectionClick("sort")}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowUpDown size={20} className="text-gray-500" />
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Sort Options
            </div>
          </div>

          <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Featured Toggle */}
          <div className="relative group">
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`p-2 rounded-xl transition-colors ${showFeaturedOnly ? "bg-amber-100 dark:bg-amber-900/30" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            >
              <Sparkles size={20} className={showFeaturedOnly ? "text-amber-600" : "text-gray-500"} />
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {showFeaturedOnly ? "Show All" : "Featured Only"}
            </div>
          </div>

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <div className="relative group">
              <button
                onClick={onClear}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Clear All Filters
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden relative z-50">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <SlidersHorizontal size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
                {activeFiltersCount > 0 && <p className="text-xs text-gray-500">{activeFiltersCount} active</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <button
                  onClick={onClear}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Collapse"
              >
                <ChevronLeft size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div
          className="p-4 space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent",
          }}
        >
          {/* Search Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("search")}
              data-section="search"
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <span className="flex items-center gap-2">
                <Search size={16} />
                Search
              </span>
              {expandedSections.search ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <AnimatePresence>
              {expandedSections.search && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => {
                        setTimeout(() => setSearchFocused(false), 200);
                      }}
                      placeholder="Search vendors, services..."
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <X size={14} className="text-gray-400" />
                      </button>
                    )}
                  </div>

                  {/* Recent Searches */}
                  {searchFocused && recentSearches && recentSearches.length > 0 && !searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Recent Searches</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClearRecentSearches();
                          }}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 max-w-[265px]">
                        {recentSearches.slice(0, 5).map((search, i) => {
                          if (!search || !search.trim()) return null;
                          return (
                            <button
                              key={`recent-${i}-${search}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSelectRecentSearch(search);
                                setSearchFocused(false);
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-500 transition-all cursor-pointer"
                            >
                              <Clock size={12} />
                              {search}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          {/* Featured Toggle */}
          <label className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
                <Sparkles size={16} className="text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Only</span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => {
                  setShowFeaturedOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer-checked:bg-amber-500 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
            </div>
          </label>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          {/* Categories Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("categories")}
              data-section="categories"
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <span className="flex items-center gap-2">
                <Tag size={16} />
                Categories
                {selectedCategories.length > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
              </span>
              {expandedSections.categories ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <AnimatePresence>
              {expandedSections.categories && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  {VENDOR_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500"
                            : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: isSelected ? `${cat.color}20` : "transparent",
                          }}
                        >
                          <Icon
                            size={16}
                            style={{
                              color: isSelected ? cat.color : "#9ca3af",
                            }}
                          />
                        </div>
                        <span
                          className={`text-sm font-medium flex-1 text-left ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400"}`}
                        >
                          {cat.label}
                        </span>
                        {isSelected && <Check size={16} className="text-blue-600" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          {/* Price Range Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("price")}
              data-section="price"
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <span className="flex items-center gap-2">
                <IndianRupee size={16} />
                Budget Range
                {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                  <span className="px-1.5 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                    Set
                  </span>
                )}
              </span>
              {expandedSections.price ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <AnimatePresence>
              {expandedSections.price && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ₹{formatPrice(priceRange[0])}
                    </span>
                    <span className="text-gray-400">to</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ₹{formatPrice(priceRange[1])}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Minimum</label>
                      <input
                        type="range"
                        min="0"
                        max="1000000"
                        step="10000"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setPriceRange([Math.min(val, priceRange[1] - 10000), priceRange[1]]);
                          setCurrentPage(1);
                        }}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Maximum</label>
                      <input
                        type="range"
                        min="0"
                        max="1000000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setPriceRange([priceRange[0], Math.max(val, priceRange[0] + 10000)]);
                          setCurrentPage(1);
                        }}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                      />
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Under 50K", range: [0, 50000] },
                      { label: "50K - 1L", range: [50000, 100000] },
                      { label: "1L - 3L", range: [100000, 300000] },
                      { label: "3L+", range: [300000, 1000000] },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setPriceRange(preset.range);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                          priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500"
                            : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:bg-gray-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          {/* Location Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("location")}
              data-section="location"
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                Location
                {selectedLocations.length > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                    {selectedLocations.length}
                  </span>
                )}
              </span>
              {expandedSections.location ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <AnimatePresence>
              {expandedSections.location && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  {availableCities.length > 0 ? (
                    <>
                      {displayedCities.map((city) => (
                        <label
                          key={city}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(city)}
                            onChange={() => handleLocationChange(city)}
                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{city}</span>
                        </label>
                      ))}
                      {availableCities.length > 5 && (
                        <button
                          onClick={() => setShowAllCities(!showAllCities)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {showAllCities ? "Show Less" : `+${availableCities.length - 5} more cities`}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No cities available</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          {/* Rating Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("rating")}
              data-section="rating"
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <span className="flex items-center gap-2">
                <Star size={16} />
                Minimum Rating
                {ratingFilter > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
                    {ratingFilter}+
                  </span>
                )}
              </span>
              {expandedSections.rating ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <AnimatePresence>
              {expandedSections.rating && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  {[4.5, 4, 3.5, 3, 0].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        setRatingFilter(rating);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                        ratingFilter === rating
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500"
                          : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {rating > 0 ? `${rating}+ stars` : "All ratings"}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700" />

          {/* Sort Section */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("sort")}
              data-section="sort"
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              <span className="flex items-center gap-2">
                <ArrowUpDown size={16} />
                Sort By
              </span>
              {expandedSections.sort ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <AnimatePresence>
              {expandedSections.sort && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="space-y-2">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                          sortBy === opt.value
                            ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500"
                            : "bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400">{opt.label}</span>
                        {sortBy === opt.value && <Check size={14} className="text-blue-600 ml-auto" />}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Order:</span>
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex-1">
                      <button
                        onClick={() => {
                          setSortOrder("desc");
                          setCurrentPage(1);
                        }}
                        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                          sortOrder === "desc" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-500"
                        }`}
                      >
                        High to Low
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("asc");
                          setCurrentPage(1);
                        }}
                        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                          sortOrder === "asc" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-500"
                        }`}
                      >
                        Low to High
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  },
);
FilterSidebar.displayName = "FilterSidebar";

const CategoryChips = memo(({ selectedCategories, onSelect, showTopProfiles, setShowTopProfiles, topProfilesRef }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    handleScroll();

    // Also check on resize
    const handleResize = () => handleScroll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleScroll]);

  // IMPROVED: Smooth scroll function with better animation
  const scroll = useCallback(
    (direction) => {
      if (scrollRef.current && !isScrolling) {
        setIsScrolling(true);

        const container = scrollRef.current;
        const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of visible width
        const start = container.scrollLeft;
        const target = start + direction * scrollAmount;
        const duration = 400; // milliseconds
        const startTime = performance.now();

        // Easing function for smooth animation
        const easeInOutCubic = (t) => {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const animateScroll = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeInOutCubic(progress);

          container.scrollLeft = start + (target - start) * eased;

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            setIsScrolling(false);
          }
        };

        requestAnimationFrame(animateScroll);
      }
    },
    [isScrolling],
  );

  return (
    <div className="relative">
      {/* Left Arrow */}
      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => scroll(-1)}
            disabled={isScrolling}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scrollable Container - REMOVED scroll-smooth class */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex items-center gap-2 overflow-x-auto px-1 py-1 hide-scrollbar"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        <motion.button
          onClick={() => onSelect(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
            selectedCategories.length === 0
              ? "bg-blue-600 text-white border-transparent shadow-md"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <Sparkles size={15} />
          All Categories
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            const willOpen = !showTopProfiles;
            setShowTopProfiles(willOpen);
            if (willOpen) {
              setTimeout(() => {
                topProfilesRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }, 400);
            }
          }}
          className="flex flex-row min-w-[114px] items-center gap-2 px-3 py-3 rounded-xl text-white font-semibold text-xs transition-all !opacity-100 cursor-pointer"
          style={{
            background: showTopProfiles
              ? "linear-gradient(135deg, #d97706, #b45309)"
              : "linear-gradient(135deg, rgba(245,158,11,0.5), rgba(217,119,6,0.5))",
          }}
          title={showTopProfiles ? "Hide Top Profiles" : "Show Top Profiles"}
        >
          <Star size={15} fill="white" color="white" />
          <span className="w-full z-20 flex">Top Profiles</span>
        </motion.button>

        {VENDOR_CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.id);
          const CatIcon = cat.icon;
          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-blue-600 text-white border-transparent shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <CatIcon size={15} />
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* Right Arrow */}
      <AnimatePresence>
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            onClick={() => scroll(1)}
            disabled={isScrolling}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* CSS to hide scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});
CategoryChips.displayName = "CategoryChips";

const SubcategoryChips = memo(({ selectedCategory, selectedSubcategory, onSubcategoryChange }) => {
  const subcategories = SUBCATEGORIES[selectedCategory] || [];
  const categoryInfo = VENDOR_CATEGORIES.find((c) => c.id === selectedCategory);

  if (subcategories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden mb-1"
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
          {categoryInfo && <categoryInfo.icon size={12} className="text-blue-600" />}
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{categoryInfo?.label} Types</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => onSubcategoryChange("")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${!selectedSubcategory ? "bg-blue-600 text-white border-transparent shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50"}`}
        >
          All {categoryInfo?.label}
        </button>
        {subcategories.map((sub) => {
          const isSelected = selectedSubcategory === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => onSubcategoryChange(sub.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${isSelected ? "bg-blue-600 text-white border-transparent shadow-sm" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50"}`}
            >
              {sub.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
});
SubcategoryChips.displayName = "SubcategoryChips";

const ImageCarousel = memo(
  ({ images, vendorName, vendor, isLiked, onFavorite, tags, isLiking, rating, viewMode, addToRecentlyViewed }) => {
    const [[page, direction], setPage] = useState([0, 0]);
    const [showHeart, setShowHeart] = useState(false);

    const imageIndex = ((page % images.length) + images.length) % images.length;
    const hasMultipleImages = images.length > 1;
    const isListView = viewMode === "list";

    const paginate = useCallback(
      (newDirection) => {
        if (!hasMultipleImages) return;
        setPage([page + newDirection, newDirection]);
      },
      [hasMultipleImages, page],
    );

    const handleDoubleTap = useDoubleTap(() => {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
      if (!isLiked) onFavorite();
    });

    const slideVariants = {
      enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
      center: { x: 0, opacity: 1, zIndex: 1 },
      exit: (d) => ({ x: d < 0 ? "100%" : "-100%", opacity: 0, zIndex: 0 }),
    };

    return (
      <div
        className={`relative bg-gray-100 overflow-hidden group ${isListView ? "w-80 h-full" : "w-full aspect-[16/10]"}`}
        onClick={handleDoubleTap}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 400, damping: 40 },
              opacity: { duration: 0.25 },
            }}
            className="absolute inset-0 w-full h-full"
            onClick={(e) => {
              e.stopPropagation();
              addToRecentlyViewed(vendor);
            }}
          >
            <SmartMedia
              src={images[imageIndex]}
              alt={vendorName}
              type="image"
              className="w-full h-full select-none"
              objectFit="cover"
              priority={imageIndex === 0}
              quality={85}
              sizes={isListView ? "320px" : "(max-width: 768px) 100vw, 33vw"}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <Heart size={60} className="fill-white text-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <div className="flex gap-1.5 flex-wrap">
            {tags?.includes("Popular") && (
              <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase rounded-lg shadow-md flex items-center gap-1">
                <Flame size={11} /> Popular
              </span>
            )}
            {tags?.includes("Verified") && (
              <span className="px-2 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase rounded-lg shadow-md flex items-center gap-1">
                <BadgeCheck size={11} /> Verified
              </span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLiking) onFavorite();
            }}
            disabled={isLiking}
            className={`p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md ${isLiking ? "opacity-50" : ""}`}
          >
            <Heart size={18} className={isLiked ? "fill-rose-500 text-rose-500" : "text-gray-600"} strokeWidth={2} />
          </motion.button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-sm">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-800">{rating?.toFixed(1) || "4.5"}</span>
          </div>

          {hasMultipleImages && (
            <div className="flex gap-1.5">
              {images.slice(0, 5).map((_, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    width: idx === imageIndex ? 16 : 6,
                    opacity: idx === imageIndex ? 1 : 0.5,
                  }}
                  className="h-1.5 bg-white rounded-full shadow-sm"
                />
              ))}
              {images.length > 5 && <span className="text-white text-[10px] ml-1">+{images.length - 5}</span>}
            </div>
          )}
        </div>

        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </button>
          </>
        )}
      </div>
    );
  },
);
ImageCarousel.displayName = "ImageCarousel";

const QuickActionButton = memo(({ icon: Icon, label, onClick, color }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick?.();
    }}
    className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
    <Icon size={18} style={{ color }} />
    <span className="text-[10px] font-medium text-gray-500">{label}</span>
  </motion.button>
));
QuickActionButton.displayName = "QuickActionButton";

const VendorCard = memo(
  ({
    vendor,
    viewMode,
    isComparing,
    isSelectedForCompare,
    onCompare,
    onShowToast,
    addToRecentlyViewed,
    setShowShareModal,
    setShareItem,
    isLeadModalOpen,
    setLeadModalActionType,
    setIsLeadModalOpen,
  }) => {
    const [showActions, setShowActions] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likingLoading, setLikingLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [showProfileTooltip, setShowProfileTooltip] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { user } = useUser();
    const { addToCart, isInCart, removeFromCart } = useCartStore();
    const inCart = isInCart(vendor._id);

    const { getHrefWithState } = useNavigationState();
    const { allowedAction, canContinue } = useAppValuesStore();

    const router = useRouter();

    const isListView = viewMode === "list";
    const isGrid2 = viewMode === "grid-2";

    useEffect(() => {
      if (!user || !vendor?._id) return;
      let cancelled = false;
      const fetchStatus = async () => {
        try {
          const res = await fetch("/api/user/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vendorId: vendor._id, userId: user.id }),
          });
          if (res.ok && !cancelled) {
            const data = await res.json();
            setIsLiked(data.isLiked);
          }
        } catch (error) {
          console.error("Error fetching status:", error);
        }
      };
      fetchStatus();
      return () => {
        cancelled = true;
      };
    }, [user, vendor?._id]);

    const handleToggleLike = useCallback(async () => {
      if (!user) {
        toast.error("Please login to like vendors");
        return;
      }
      if (likingLoading) return;
      setLikingLoading(true);
      const prevLiked = isLiked;
      setIsLiked(!prevLiked);
      try {
        const res = await fetch("/api/user/toggle-like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId: vendor._id }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        toast.success(data.message);
      } catch {
        setIsLiked(prevLiked);
        toast.error("Something went wrong");
      } finally {
        setLikingLoading(false);
      }
    }, [user, vendor._id, isLiked, likingLoading]);

    const images = useMemo(() => {
      const imgs = vendor.normalizedImages || (vendor.images || []).filter(Boolean);
      const validImages = imgs.length > 0 ? imgs : vendor.defaultImage ? [vendor.defaultImage] : ["/placeholder.jpg"];
      return validImages.slice(0, 5);
    }, [vendor.normalizedImages, vendor.images, vendor.defaultImage]);

    const price = useMemo(() => getVendorPrice(vendor), [vendor]);
    const originalPrice = vendor.originalPrice || null;
    const hasDiscount = originalPrice && originalPrice > price && price > 0;
    const discountPercent = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : 0;

    const vendorUrl = getHrefWithState(`/vendor/${vendor.category}/${vendor._id}`);
    const categoryConfig = VENDOR_CATEGORIES.find((c) => c.id === vendor.category);

    const handleAddToCart = useCallback(() => {
      if (inCart) {
        removeFromCart(vendor._id);
        onShowToast("Removed from cart", "info");
      } else {
        addToCart({
          _id: vendor._id,
          name: vendor.name,
          category: vendor.category,
          price: price,
          image: images[0],
          quantity: 1,
          address: vendor.address,
        });
        onShowToast("Added to cart!", "success");
      }
    }, [inCart, vendor, price, images, addToCart, removeFromCart, onShowToast]);

    const handleCompareToggle = useCallback(() => {
      onCompare(vendor);
    }, [vendor, onCompare]);

    const handleShare = useCallback(async () => {
      setShareItem(vendor);
      setShowShareModal(true);
      // const shareData = {
      //   title: vendor.name,
      //   text: `Check out ${vendor.name}`,
      //   url: window.location.origin + vendorUrl,
      // };
      // if (navigator.share && navigator.canShare?.(shareData)) {
      //   try {
      //     await navigator.share(shareData);
      //   } catch {}
      // } else {
      //   try {
      //     await navigator.clipboard.writeText(shareData.url);
      //     onShowToast("Link copied!", "success");
      //   } catch {}
      // }
    }, [vendor.name, vendorUrl, onShowToast]);

    const handleProfileClick = useCallback(
      (vendorId) => {
        const url = getHrefWithState(`/vendor/${vendor.category}/${vendorId}/profile`);
        if (isNavigating || isPending) return;
        startTransition(() => {
          setIsNavigating(true);
          router.push(url);
        });
      },
      [isNavigating, isPending, router, vendor.category],
    );

    const handleCall = useCallback(() => {
      console.log("Allowed Action:", allowedAction, "Can Continue:", canContinue);
      if (canContinue) {
        if (vendor.phoneNo) window.location.href = `tel:${vendor.phoneNo}`;
        else onShowToast?.("Phone number not available", "info");
      } else {
        setIsLeadModalOpen(true);
        setLeadModalActionType("revealPhone");
      }
    }, [vendor.phoneNo, onShowToast]);

    if (isListView) {
      return (
        <motion.div
          onClick={() => {
            // Add to recently viewed when card is clicked
            addToRecentlyViewed(vendor);
          }}
          whileHover={{ y: -2 }}
          className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border transition-all duration-300 overflow-hidden flex h-56 ${isSelectedForCompare ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200 dark:border-gray-700"}`}
        >
          {isComparing && (
            <div
              onClick={handleCompareToggle}
              className="absolute inset-0 z-40 bg-black/10 backdrop-blur-[1px] flex items-center justify-center cursor-pointer"
            >
              <motion.div
                animate={{ scale: isSelectedForCompare ? 1.1 : 1 }}
                className={`w-14 h-14 rounded-full border-3 border-white flex items-center justify-center shadow-xl ${isSelectedForCompare ? "bg-blue-600" : "bg-white/50"}`}
              >
                {isSelectedForCompare ? (
                  <CheckCircle size={28} className="text-white" />
                ) : (
                  <Plus size={28} className="text-gray-600" />
                )}
              </motion.div>
            </div>
          )}

          <ImageCarousel
            images={images}
            vendorName={vendor.name}
            vendor={vendor}
            isLiked={isLiked}
            isLiking={likingLoading}
            onFavorite={handleToggleLike}
            tags={vendor.tags}
            rating={vendor.rating}
            viewMode={viewMode}
            addToRecentlyViewed={addToRecentlyViewed}
          />

          <Link href={vendorUrl} className="flex-1 p-5 flex flex-col min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  {(vendor.defaultImage || vendor.images?.[0]) && (
                    <div
                      className="relative group"
                      onMouseEnter={() => setShowProfileTooltip(true)}
                      onMouseLeave={() => setShowProfileTooltip(false)}
                    >
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          handleProfileClick(vendor._id);
                        }}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 shrink-0 cursor-pointer transition-all duration-300 relative ${
                          isNavigating || isPending
                            ? "border-blue-500 shadow-lg"
                            : "border-gray-100 hover:border-blue-400 hover:shadow-md"
                        }`}
                      >
                        {/* Loading Border Animation */}
                        {(isNavigating || isPending) && (
                          <div className="absolute inset-0 rounded-full">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="100"
                                strokeDashoffset="0"
                                strokeLinecap="round"
                                className="text-blue-500 animate-spin"
                                style={{
                                  animation: "spin 1s linear infinite",
                                  strokeDasharray: "75, 100",
                                }}
                              />
                            </svg>
                          </div>
                        )}
                        <Image
                          src={vendor.defaultImage || vendor.images[0]}
                          alt=""
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* ADD THIS TOOLTIP: */}
                      <AnimatePresence>
                        {showProfileTooltip && !isNavigating && !isPending && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full mb-8 z-50 pointer-events-none"
                          >
                            <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl">
                              <div className="flex items-center gap-1.5">
                                <Eye size={12} />
                                <span>See Profile</span>
                              </div>
                              {/* Tooltip Arrow */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mt-px">
                                <div className="border-4 border-transparent border-b-gray-900" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{vendor.name}</h3>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  {vendor.address?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {vendor.address.city}
                    </span>
                  )}
                  {vendor.responseTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {vendor.responseTime}
                    </span>
                  )}
                </div>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-bold rounded-lg flex items-center gap-1 shrink-0">
                {categoryConfig?.emoji} {categoryConfig?.label}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2 overflow-x-auto scrollbar-hide">
              {vendor.seating?.max && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-medium rounded-lg flex items-center gap-1 shrink-0">
                  <Users size={11} /> {vendor.seating.max} guests
                </span>
              )}
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-medium rounded-lg flex items-center gap-1 shrink-0">
                <TrendingUp size={11} /> {vendor.bookings || 0} booked
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-medium rounded-lg flex items-center gap-1 shrink-0">
                <MessageCircle size={11} /> {vendor.reviews || vendor.reviewCount || 0} reviews
              </span>
            </div>

            <div className="flex items-end justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Starting from</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-blue-600">₹{formatPrice(price)}</span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-gray-400 line-through">₹{formatPrice(originalPrice)}</span>
                      <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCall();
                  }}
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-500 transition-colors"
                >
                  <Phone size={18} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare();
                  }}
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-500 transition-colors"
                >
                  <Share2 size={18} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart();
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${inCart ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                >
                  {inCart ? <Check size={18} /> : <ShoppingCart size={18} />}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md flex items-center gap-1.5 hover:bg-blue-700 transition-colors"
                >
                  <Eye size={16} />
                  View Details
                </motion.button>
              </div>
            </div>
          </Link>
        </motion.div>
      );
    }

    return (
      <motion.div
        whileHover={{ y: -4 }}
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg border transition-all duration-300 overflow-hidden flex flex-col ${isSelectedForCompare ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200 dark:border-gray-700"}`}
      >
        {isComparing && (
          <div
            onClick={handleCompareToggle}
            className="absolute inset-0 z-40 bg-black/10 backdrop-blur-[1px] flex items-center justify-center cursor-pointer"
          >
            <motion.div
              animate={{ scale: isSelectedForCompare ? 1.1 : 1 }}
              className={`w-14 h-14 rounded-full border-3 border-white flex items-center justify-center shadow-xl ${isSelectedForCompare ? "bg-blue-600" : "bg-white/50"}`}
            >
              {isSelectedForCompare ? (
                <CheckCircle size={28} className="text-white" />
              ) : (
                <Plus size={28} className="text-gray-600" />
              )}
            </motion.div>
          </div>
        )}

        <ImageCarousel
          images={images}
          vendorName={vendor.name}
          vendor={vendor}
          isLiked={isLiked}
          isLiking={likingLoading}
          onFavorite={handleToggleLike}
          tags={vendor.tags}
          rating={vendor.rating}
          viewMode={viewMode}
          addToRecentlyViewed={addToRecentlyViewed}
        />

        <Link href={vendorUrl} className="flex-1 flex flex-col p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{vendor.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">{vendor.address?.city || "Location"}</span>
                {vendor.responseTime && (
                  <>
                    <span className="text-gray-300">•</span>
                    <Clock size={12} className="shrink-0" />
                    <span>{vendor.responseTime}</span>
                  </>
                )}
              </div>
            </div>
            <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[10px] font-bold rounded-lg shrink-0">
              {categoryConfig?.emoji}
            </span>
          </div>

          {isGrid2 && (
            <>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                {vendor.description || "Premium vendor for your special occasions."}
              </p>
              <div className="flex items-center gap-1.5 mb-2 overflow-x-auto scrollbar-hide">
                {vendor.seating?.max && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-[10px] font-medium rounded-lg shrink-0 flex items-center gap-0.5">
                    <Users size={10} /> {vendor.seating.max}
                  </span>
                )}
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-[10px] font-medium rounded-lg shrink-0">
                  {vendor.bookings || 0} booked
                </span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Starting at</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-blue-600">₹{formatPrice(price)}</span>
                {hasDiscount && (
                  <span className="text-[10px] text-gray-400 line-through">₹{formatPrice(originalPrice)}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowActions(!showActions);
                }}
                className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <MoreHorizontal size={16} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${inCart ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                {inCart ? <Check size={16} /> : <ShoppingCart size={16} />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm flex items-center gap-1 hover:bg-blue-700 transition-colors"
              >
                <Eye size={14} />
                View
              </motion.button>
            </div>
          </div>
        </Link>

        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-3 grid grid-cols-4 gap-2">
                <QuickActionButton icon={Phone} label="Call" onClick={handleCall} color={COLORS.success} />
                <QuickActionButton icon={Share2} label="Share" onClick={handleShare} color={COLORS.secondary} />
                <QuickActionButton
                  icon={ArrowRightLeft}
                  label="Compare"
                  onClick={handleCompareToggle}
                  color={COLORS.primary}
                />
                <QuickActionButton
                  icon={Navigation}
                  label="Directions"
                  onClick={() => window.open(vendor?.address?.googleMapUrl, "_blank")}
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

const CompareBar = memo(({ count, vendors, onClear, onView }) => {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={SPRING_CONFIG.gentle}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {vendors.slice(0, 4).map((v, i) => (
              <motion.div
                key={v._id}
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="w-12 h-12 rounded-full border-2 border-gray-900 overflow-hidden bg-gray-700 shadow-lg"
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
            <p className="font-bold">
              {count} vendor{count > 1 ? "s" : ""} selected
            </p>
            <p className="text-sm text-gray-400">
              {count === 0 && "Select vendors to compare"}
              {count === 1 &&
                `Add more ${VENDOR_CATEGORIES.find((c) => c.id === vendors[0]?.category)?.label || "vendors"}`}
              {count >= 2 && (
                <>
                  Comparing{" "}
                  <span className="font-medium text-blue-400">
                    {VENDOR_CATEGORIES.find((c) => c.id === vendors[0]?.category)?.label || "vendors"}
                  </span>
                  {MAX_COMPARE_ITEMS - count > 0 && ` • Add ${MAX_COMPARE_ITEMS - count} more`}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onView}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-bold shadow-lg hover:bg-blue-700 transition-colors"
          >
            Compare Now
          </button>
        </div>
      </div>
    </motion.div>
  );
});
CompareBar.displayName = "CompareBar";

const CompareModalOld = memo(({ isOpen, onClose, vendors }) => {
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
    if (scores.length === 0) return 0;
    const max = Math.max(...scores);
    return scores.indexOf(max);
  }, [scores]);

  const colClass = vendorCount <= 2 ? "w-1/2" : vendorCount === 3 ? "w-1/3" : "w-1/4";

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "details", label: "Details", icon: Info },
    { id: "pricing", label: "Pricing", icon: DollarSign },
  ];

  if (!isOpen || vendors.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-8 bg-white dark:bg-gray-800 rounded-3xl z-[201] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Compare Vendors</h2>
                <p className="text-sm text-gray-500">
                  {vendorCount} vendor{vendorCount > 1 ? "s" : ""} selected
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                  {tabs.map((t) => {
                    const Icon = t.icon;
                    const active = tab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${active ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                      >
                        <Icon size={14} />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex gap-4 mb-6">
                {vendors.map((v, i) => {
                  const winner = i === winnerIdx && vendorCount > 1;
                  const score = scores[i];
                  return (
                    <motion.div
                      key={v._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`${colClass} bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 border-2 relative overflow-hidden ${winner ? "border-amber-400" : "border-gray-200 dark:border-gray-600"}`}
                    >
                      {winner && (
                        <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 px-2.5 py-1 rounded-bl-xl text-[10px] font-bold flex items-center gap-1">
                          <Trophy size={11} /> BEST MATCH
                        </div>
                      )}
                      <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-gray-200">
                        <Image
                          src={v.normalizedImages?.[0] || v.images?.[0] || v.defaultImage || "/placeholder.jpg"}
                          alt={v.name}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate mb-1">{v.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <MapPin size={11} />
                        <span>{v.address?.city || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="font-bold text-sm">{(v.rating || 0).toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({v.reviews || 0})</span>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Score</span>
                          <span className="font-bold text-blue-600">{score}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="h-full bg-blue-600 rounded-full"
                          />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">Starting from</p>
                        <p className="text-lg font-black text-blue-600">₹{formatPrice(getVendorPrice(v))}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {tab === "overview" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                      <BarChart3 size={15} className="text-blue-600" /> Feature Comparison
                    </h4>
                  </div>
                  {COMPARE_FEATURES.map((f, idx) => {
                    const Icon = f.icon;
                    return (
                      <div
                        key={f.key}
                        className={`flex items-stretch ${idx !== COMPARE_FEATURES.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""}`}
                      >
                        <div className="w-36 shrink-0 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-r border-gray-200 dark:border-gray-600 flex items-center gap-2">
                          <Icon size={14} className="text-gray-400 shrink-0" />
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{f.label}</span>
                        </div>
                        <div className="flex-1 flex">
                          {vendors.map((v) => {
                            const val = getCompareVal(v, f.key);
                            const formatted = f.format(val);
                            const isBest = f.higher !== null && bestVals[f.key] !== null && val === bestVals[f.key];
                            return (
                              <div
                                key={v._id}
                                className={`${colClass} px-4 py-3 text-center border-r border-gray-100 dark:border-gray-700 last:border-r-0 flex flex-col justify-center`}
                              >
                                <span
                                  className={`text-sm font-semibold ${isBest ? "text-blue-600" : "text-gray-700 dark:text-gray-300"}`}
                                >
                                  {formatted}
                                </span>
                                {isBest && f.higher !== null && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded mt-1 font-bold self-center bg-blue-100 text-blue-600">
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
                <div className="space-y-4">
                  {/* <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">About</h4>
                    </div>
                    <div className="flex">
                      {vendors.map((v) => (
                        <div key={v._id} className={`${colClass} p-4 border-r border-gray-100 dark:border-gray-700 last:border-r-0`}>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-6">{v.description || "No description available."}</p>
                        </div>
                      ))}
                    </div>
                  </div> */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Amenities</h4>
                    </div>
                    <div className="flex">
                      {vendors.map((v) => {
                        const amenities = v.amenities || v.facilities || [];
                        return (
                          <div
                            key={v._id}
                            className={`${colClass} p-4 border-r border-gray-100 dark:border-gray-700 last:border-r-0`}
                          >
                            {amenities.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {amenities.slice(0, 6).map((a, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-[10px] font-medium text-gray-600 dark:text-gray-300"
                                  >
                                    {truncateText(a, 15)}
                                  </span>
                                ))}
                                {amenities.length > 6 && (
                                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-[10px] font-medium text-gray-400">
                                    +{amenities.length - 6}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400">None listed</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {tab === "pricing" && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Price Breakdown</h4>
                    </div>
                    <div className="flex">
                      {vendors.map((v) => {
                        const vPrice = getVendorPrice(v);
                        const orig = v.originalPrice;
                        const hasDisc = orig && orig > vPrice && vPrice > 0;
                        const discPct = hasDisc ? Math.round((1 - vPrice / orig) * 100) : 0;
                        return (
                          <div
                            key={v._id}
                            className={`${colClass} p-4 border-r border-gray-100 dark:border-gray-700 last:border-r-0`}
                          >
                            <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Starting from</p>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-2xl font-black text-blue-600">₹{formatPrice(vPrice)}</span>
                              {hasDisc && (
                                <span className="text-sm text-gray-400 line-through">₹{formatPrice(orig)}</span>
                              )}
                            </div>
                            {hasDisc && (
                              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">
                                <Percent size={10} /> {discPct}% OFF
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-800 dark:text-green-400 text-sm mb-3 flex items-center gap-2">
                      <ThumbsUp size={15} /> Value Analysis
                    </h4>
                    <div className="flex gap-3">
                      {vendors.map((v) => {
                        const vPrice = getVendorPrice(v);
                        const rating = v.rating || 0;
                        const valueScore = vPrice > 0 ? Math.round((rating / 5) * 100 - (vPrice / 100000) * 10) : 0;
                        const norm = Math.max(0, Math.min(100, valueScore + 50));
                        return (
                          <div
                            key={v._id}
                            className={`${colClass} bg-white dark:bg-gray-800 rounded-xl p-3 border border-green-200 dark:border-green-800`}
                          >
                            <p className="text-xs text-gray-500 font-medium truncate mb-2">
                              {truncateText(v.name, 20)}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full transition-all"
                                  style={{ width: `${norm}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-green-700 dark:text-green-400">{norm}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3 shrink-0">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 font-bold text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (vendors[winnerIdx])
                    window.location.href = `/vendor/${vendors[winnerIdx].category}/${vendors[winnerIdx]._id}`;
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Trophy size={16} />
                View Best Match
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
CompareModalOld.displayName = "CompareModalOld";

const Pagination = memo(({ currentPage, totalPages, onPageChange, isLoading }) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-3 mt-8 mb-4">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>

        {getPageNumbers().map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..." || isLoading}
            className={`min-w-[42px] h-[42px] px-3 rounded-xl text-sm font-semibold transition-all ${page === currentPage ? "bg-blue-600 text-white shadow-md" : page === "..." ? "cursor-default text-gray-400" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600"}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>
      <p className="text-xs text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
});
Pagination.displayName = "Pagination";

// ADD THIS NEW HELPER FUNCTION:
const generateFilterBreadcrumb = (
  filters,
  {
    selectedCategories,
    searchQuery,
    selectedSubcategory,
    selectedLocations,
    priceRange,
    ratingFilter,
    showFeaturedOnly,
    totalResults,
  },
) => {
  const breadcrumbs = [{ label: "All Vendors", type: "root", removable: false }];

  // Category level
  if (selectedCategories.length > 0) {
    const categoryNames = selectedCategories
      .map((id) => VENDOR_CATEGORIES.find((c) => c.id === id)?.label)
      .filter(Boolean);

    breadcrumbs.push({
      label: categoryNames.length === 1 ? categoryNames[0] : `${categoryNames.length} Categories`,
      type: "category",
      removable: true,
      action: "clearCategories",
      detail: categoryNames.join(", "),
    });
  }

  // Subcategory level
  if (selectedSubcategory) {
    const allSubs = Object.values(SUBCATEGORIES).flat();
    const sub = allSubs.find((s) => s.id === selectedSubcategory);
    if (sub) {
      breadcrumbs.push({
        label: sub.label,
        type: "subcategory",
        removable: true,
        action: "clearSubcategory",
      });
    }
  }

  // Location level
  if (selectedLocations.length > 0) {
    breadcrumbs.push({
      label: selectedLocations.length === 1 ? selectedLocations[0] : `${selectedLocations.length} Cities`,
      type: "location",
      removable: true,
      action: "clearLocations",
      detail: selectedLocations.join(", "),
    });
  }

  // Filters level
  const activeFilterTypes = [];
  if (priceRange[0] > 0 || priceRange[1] < 1000000) activeFilterTypes.push("Budget");
  if (ratingFilter > 0) activeFilterTypes.push("Rating");
  if (showFeaturedOnly) activeFilterTypes.push("Featured");
  if (searchQuery) activeFilterTypes.push("Search");

  if (activeFilterTypes.length > 0) {
    breadcrumbs.push({
      label: activeFilterTypes.length === 1 ? activeFilterTypes[0] : `${activeFilterTypes.length} Filters`,
      type: "filters",
      removable: true,
      action: "clearFilters",
      detail: activeFilterTypes.join(" • "),
    });
  }

  // Results level
  breadcrumbs.push({
    label: `${totalResults || 0} Results`,
    type: "results",
    removable: false,
    isEnd: true,
  });

  return breadcrumbs;
};

// REPLACE THE ENTIRE ActiveFiltersDisplay COMPONENT WITH FIXES:
const ActiveFiltersDisplay = memo(
  ({
    filters,
    onClearAll,
    selectedCategories,
    searchQuery,
    selectedSubcategory,
    selectedLocations,
    priceRange,
    ratingFilter,
    showFeaturedOnly,
    totalResults,
    onClearCategories,
    onClearSubcategory,
    onClearLocations,
    onClearFilters,
    isBreadcrumbOpen,
    setIsBreadcrumbOpen,
  }) => {
    const [showBreadcrumbTooltip, setShowBreadcrumbTooltip] = useState(null);
    const [hoveredCrumb, setHoveredCrumb] = useState(null);

    if (filters.length === 0) return null;

    const breadcrumbs = generateFilterBreadcrumb(filters, {
      selectedCategories,
      searchQuery,
      selectedSubcategory,
      selectedLocations,
      priceRange,
      ratingFilter,
      showFeaturedOnly,
      totalResults,
    });

    const handleBreadcrumbAction = (action) => {
      switch (action) {
        case "clearCategories":
          onClearCategories();
          break;
        case "clearSubcategory":
          onClearSubcategory();
          break;
        case "clearLocations":
          onClearLocations();
          break;
        case "clearFilters":
          onClearFilters();
          break;
        default:
          break;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 relative overflow-visible"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-start justify-between gap-3 overflow-visible">
          {/* Left: Filter Tags */}
          <div className="flex-1 overflow-visible">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={14} className="text-blue-600" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Active Filters ({filters.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 border border-blue-200 dark:border-blue-700 shadow-sm"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Buttons Column */}
          <div className="flex flex-col gap-2 shrink-0">
            {/* Clear All Button */}
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg text-blue-600 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
            >
              Clear All
            </button>

            {/* Breadcrumb Toggle Button */}
            <motion.button
              onClick={() => setIsBreadcrumbOpen(!isBreadcrumbOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg ${isBreadcrumbOpen ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-800/40 dark:hover:to-blue-800/40 transition-all duration-300 border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md" : "text-blue-600 bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700"} overflow-hidden group`}
            >
              {/* Animated Background Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20"
                animate={{
                  x: isBreadcrumbOpen ? ["-100%", "100%"] : 0,
                }}
                transition={{
                  duration: 1.5,
                  repeat: isBreadcrumbOpen ? Infinity : 0,
                  ease: "linear",
                }}
              />

              {/* Button Content */}
              <span className="relative flex items-center gap-1.5">
                <motion.span
                  animate={{ rotate: isBreadcrumbOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Navigation size={12} />
                </motion.span>

                <span className="hidden sm:inline">Path</span>

                <motion.span
                  animate={{ rotate: isBreadcrumbOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown size={12} />
                </motion.span>
              </span>

              {/* Pulse Effect when closed */}
              <AnimatePresence>
                {!isBreadcrumbOpen && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-lg border-2 border-purple-400 dark:border-purple-500"
                  />
                )}
              </AnimatePresence>

              {/* Active Indicator */}
              {isBreadcrumbOpen && (
                <motion.div
                  layoutId="breadcrumb-active"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                />
              )}
            </motion.button>
          </div>
        </div>

        {/* FIXED: Breadcrumb Section with Proper Overflow */}
        <AnimatePresence mode="wait">
          {isBreadcrumbOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{
                height: "auto",
                opacity: 1,
                y: 0,
                transition: {
                  height: { duration: 0.3, ease: "easeOut" },
                  opacity: { duration: 0.2, delay: 0.1 },
                  y: { duration: 0.3, ease: "easeOut" },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                y: -10,
                transition: {
                  height: { duration: 0.3, ease: "easeIn" },
                  opacity: { duration: 0.15 },
                  y: { duration: 0.3, ease: "easeIn" },
                },
              }}
              className="overflow-visible"
              style={{ zIndex: 20 }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800 overflow-visible"
              >
                <div className="flex items-center justify-between mb-3 overflow-visible">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <Navigation size={12} className="text-blue-600" />
                    <span className="uppercase tracking-wide">Navigation Path:</span>
                  </div>
                </div>

                {/* FIXED: Breadcrumb Navigation with Proper Overflow */}
                <div
                  className="flex items-center gap-1 flex-wrap overflow-visible"
                  style={{ position: "relative", zIndex: 30 }}
                >
                  {breadcrumbs.map((crumb, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-1 overflow-visible"
                      style={{ position: "relative", zIndex: 30 + index }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.05 },
                      }}
                      exit={{
                        opacity: 0,
                        x: -10,
                        transition: { delay: (breadcrumbs.length - index) * 0.03 },
                      }}
                    >
                      {/* FIXED: Breadcrumb Item with Portal-like Z-index */}
                      <div className="relative overflow-visible" style={{ zIndex: 50 + index }}>
                        <motion.button
                          whileHover={crumb.removable ? { scale: 1.05 } : {}}
                          whileTap={crumb.removable ? { scale: 0.95 } : {}}
                          disabled={!crumb.removable}
                          onClick={() => crumb.removable && handleBreadcrumbAction(crumb.action)}
                          onMouseEnter={() => {
                            if (crumb.detail) {
                              setHoveredCrumb(index);
                              setShowBreadcrumbTooltip(index);
                            }
                          }}
                          onMouseLeave={() => {
                            setHoveredCrumb(null);
                            setShowBreadcrumbTooltip(null);
                          }}
                          className={`
                          px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200
                          ${
                            crumb.type === "root"
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                              : crumb.isEnd
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                                : crumb.removable
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 border border-blue-300 dark:border-blue-700 cursor-pointer"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }
                          ${hoveredCrumb === index && crumb.removable ? "shadow-md" : ""}
                        `}
                        >
                          <span className="flex items-center gap-1.5">
                            {crumb.type === "root" && <Sparkles size={10} />}
                            {crumb.type === "category" && <Tag size={10} />}
                            {crumb.type === "subcategory" && <Columns size={10} />}
                            {crumb.type === "location" && <MapPin size={10} />}
                            {crumb.type === "filters" && <SlidersHorizontal size={10} />}
                            {crumb.type === "results" && <BarChart3 size={10} />}

                            <span>{crumb.label}</span>

                            {crumb.removable && hoveredCrumb === index && (
                              <motion.span
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <X size={10} className="ml-0.5" />
                              </motion.span>
                            )}
                          </span>
                        </motion.button>

                        {/* FIXED: Tooltip with Maximum Z-index */}
                        <AnimatePresence>
                          {showBreadcrumbTooltip === index && crumb.detail && (
                            <motion.div
                              initial={{ opacity: 0, y: 5, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.9 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 pointer-events-none"
                              style={{ zIndex: 9999 }}
                            >
                              <div className="bg-gray-900 dark:bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shadow-2xl border border-gray-700 dark:border-gray-600">
                                <div className="text-center">{crumb.detail}</div>
                                {/* Arrow pointing up */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-px">
                                  <div className="border-[5px] border-transparent border-b-gray-900 dark:border-b-gray-800" />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Separator */}
                      {index < breadcrumbs.length - 1 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                            transition: { delay: index * 0.05 + 0.1 },
                          }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          <ChevronRight size={12} className="text-gray-400 dark:text-gray-600" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Progress Indicator */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-3 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full origin-left"
                  style={{
                    width: `${Math.min((breadcrumbs.filter((b) => b.removable && b.action).length / 4) * 100, 100)}%`,
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);
ActiveFiltersDisplay.displayName = "ActiveFiltersDisplay";

const EmptyState = memo(({ onClearFilters, searchQuery }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center px-6"
  >
    <div className="w-28 h-28 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center mb-6">
      <Search size={48} className="text-gray-300 dark:text-gray-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Results Found</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
      {searchQuery
        ? `We couldn't find vendors matching "${searchQuery}"`
        : "No vendors match your current filters. Try adjusting them."}
    </p>
    <button
      onClick={onClearFilters}
      className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
    >
      Clear All Filters
    </button>
  </motion.div>
));
EmptyState.displayName = "EmptyState";

const SkeletonCard = memo(({ viewMode }) => {
  const isListView = viewMode === "list";

  if (isListView) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex h-56 animate-pulse">
        <div className="w-80 h-full bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
          <div className="flex gap-2 mb-3">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
          <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="flex gap-2">
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
});
SkeletonCard.displayName = "SkeletonCard";

const CustomSortDropdown = memo(({ sortBy, sortOrder, onSortChange, onOrderChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === sortBy);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]"
      >
        {currentOption && <currentOption.icon size={14} />}
        <span className="flex-1 text-left">{currentOption?.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2">
              {SORT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isActive = sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onSortChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                    <div className="flex-1">
                      <p
                        className={`text-sm font-semibold ${isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}
                      >
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.description}</p>
                    </div>
                    {isActive && <Check size={16} className="text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
              <button
                onClick={() => {
                  onOrderChange();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Order</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{sortOrder === "desc" ? "High to Low" : "Low to High"}</span>
                  {sortOrder === "desc" ? (
                    <SortDesc size={16} className="text-blue-600" />
                  ) : (
                    <SortAsc size={16} className="text-blue-600" />
                  )}
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
CustomSortDropdown.displayName = "CustomSortDropdown";

// ============================================
// RECENTLY VIEWED COMPONENT - Updated
// ============================================
const RecentlyViewed = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendors = () => {
      try {
        const stored = localStorage.getItem("recentlyViewed");
        if (stored) {
          const parsed = JSON.parse(stored);
          setVendors(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error("Error loading recently viewed:", error);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    loadVendors();

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "recentlyViewed") {
        loadVendors();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading recently viewed...</div>;
  }

  if (vendors.length === 0) {
    return null; // Don't show section if empty
  }

  return (
    <div className="mb-12 mt-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Clock size={24} className="text-blue-600" />
          Recently Viewed
        </h2>
        <button
          onClick={() => {
            localStorage.removeItem("recentlyViewed");
            setVendors([]);
            toast.info("Recently viewed cleared");
          }}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vendors.map((vendor) => (
          <Link key={vendor._id} href={`/vendor/${vendor._id}`} className="group">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Vendor Card Content */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={vendor.images?.[0] || "/placeholder.jpg"}
                  alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{vendor.name}</h3>
                {/* <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span>{vendor.rating || "N/A"}</span>
                  {vendor.reviewCount && <span>({vendor.reviewCount})</span>}
                </div> */}
                {vendor.location && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <MapPin size={14} />
                    <span className="line-clamp-1">{vendor.location}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const TopProfilesCarousel = memo(
  ({
    selectedCategories = [],
    selectedLocations = [],
    selectedSubcategory = "",
    priceRange = [0, 1000000],
    sortBy,
    sortOrder,
    ratingFilter,
    showFeaturedOnly,
  }) => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);
    const router = useRouter();

    // ── Scroll arrow visibility ──────────────────────────────────────────
    const handleScroll = useCallback(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 5);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
      }
    }, []);

    useEffect(() => {
      handleScroll();
      window.addEventListener("resize", handleScroll);
      return () => window.removeEventListener("resize", handleScroll);
    }, [handleScroll]);

    // Re-check arrows after vendors load (content width changes)
    useEffect(() => {
      if (!loading) {
        // Small delay to let DOM paint the new items
        setTimeout(handleScroll, 50);
      }
    }, [loading, handleScroll]);

    // ── Smooth scroll ────────────────────────────────────────────────────
    const scroll = useCallback(
      (direction) => {
        if (scrollRef.current && !isScrolling) {
          setIsScrolling(true);

          const container = scrollRef.current;
          const scrollAmount = container.clientWidth * 0.8;
          const start = container.scrollLeft;
          const target = start + direction * scrollAmount;
          const duration = 400;
          const startTime = performance.now();

          const easeInOutCubic = (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            container.scrollLeft = start + (target - start) * easeInOutCubic(progress);

            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            } else {
              setIsScrolling(false);
            }
          };

          requestAnimationFrame(animateScroll);
        }
      },
      [isScrolling],
    );

    // ── Data fetching ────────────────────────────────────────────────────
    useEffect(() => {
      const fetchVendorProfiles = async () => {
        try {
          setLoading(true);
          setError(null);
          const queryParams = new URLSearchParams({
            sortBy: sortBy || "trust",
            sortOrder: sortOrder || "desc",
            page: "1",
            limit: "20",
          });
          if (selectedCategories?.length > 0)
            queryParams.set("categories", selectedCategories.join(","));
          if (selectedSubcategory)
            queryParams.set("subcategory", selectedSubcategory);
          if (selectedLocations?.length > 0)
            queryParams.set("cities", selectedLocations.join(","));
          if (priceRange[0] > 0)
            queryParams.set("minPrice", priceRange[0].toString());
          if (priceRange[1] < 1000000)
            queryParams.set("maxPrice", priceRange[1].toString());
          if (ratingFilter > 0)
            queryParams.set("minRating", ratingFilter.toString());
          if (showFeaturedOnly)
            queryParams.set("featured", "true");

          const response = await fetch(
            `/api/vendor/profile/lists?${queryParams.toString()}`,
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setVendors(result.data);
          } else {
            throw new Error(result.message || "Failed to fetch vendor profiles");
          }
        } catch (err) {
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

    const handleVendorClick = useCallback(
      (vendor) => {
        const targetId = vendor?.vendorId || vendor?._id;
        if (targetId && vendor?.category) {
          router.push(`/vendor/${vendor.category}/${targetId}/profile?tab=posts`);
        } else if (targetId) {
          router.push(`/vendor/${targetId}`);
        }
      },
      [router],
    );

    const getTrustBadgeColor = (trust) => {
      if (trust >= 80) return "bg-green-500";
      if (trust >= 60) return "bg-blue-500";
      if (trust >= 40) return "bg-yellow-500";
      return "bg-gray-400";
    };

    // ── Loading skeleton ─────────────────────────────────────────────────
    if (loading) {
      return (
        <div className="flex gap-5 overflow-hidden py-4">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-3 min-w-[110px] animate-pulse"
            >
              <div className="w-[110px] h-[110px] rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-2 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      );
    }

    if (error || vendors.length === 0) {
      return (
        <div className="flex items-center justify-center py-8 text-sm text-gray-400 dark:text-gray-500">
          {error ? "Unable to load top profiles" : "No top profiles found"}
        </div>
      );
    }

    // ── Render ───────────────────────────────────────────────────────────
    return (
      <div className="relative">
        {/* Left Arrow */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              onClick={() => scroll(-1)}
              disabled={isScrolling}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto pb-2 px-1 py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              whileHover={{ y: -4, scale: 1.03 }}
              onClick={() => handleVendorClick(vendor)}
              className="flex flex-col items-center gap-2 min-w-[110px] cursor-pointer group"
            >
              <div className="relative">
                <div
                  className={`absolute -top-1 -right-1 w-8 h-8 rounded-full ${getTrustBadgeColor(vendor.trust)} flex items-center justify-center z-10 shadow-md border-2 border-white dark:border-gray-800 text-white text-[10px] font-bold`}
                >
                  {vendor.trust}
                </div>
                <div className="w-[110px] h-[110px] rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-md group-hover:shadow-xl transition-shadow duration-300">
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
                    <div className="w-[110px] h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                      {vendor.vendorBusinessName?.charAt(0).toUpperCase() || "V"}
                    </div>
                  )}
                </div>
                {vendor.trust >= 70 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.04 }}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-500 rounded-full p-1 shadow-md border-2 border-white dark:border-gray-800"
                  >
                    <BadgeCheck size={13} className="text-white" />
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col items-center gap-0.5 w-full px-1">
                <p className="w-[115px] text-xs font-semibold text-gray-900 dark:text-white text-center line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {vendor.vendorBusinessName}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">
                  {vendor.category?.replace(/-/g, " ")}
                </p>
                {vendor.location?.city && (
                  <div className="flex items-center gap-0.5 text-[9px] text-gray-400">
                    <MapPin size={8} />
                    <span className="line-clamp-1">{vendor.location.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  {vendor.likesCount > 0 && (
                    <div className="flex items-center gap-0.5 text-[9px] text-gray-500">
                      <Heart size={9} fill="currentColor" />
                      <span>
                        {vendor.likesCount > 999
                          ? `${(vendor.likesCount / 1000).toFixed(1)}k`
                          : vendor.likesCount}
                      </span>
                    </div>
                  )}
                  {vendor.postsCount > 0 && (
                    <div className="flex items-center gap-0.5 text-[9px] text-gray-400">
                      <ImageIcon size={8} />
                      <span>{vendor.postsCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <AnimatePresence>
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              onClick={() => scroll(1)}
              disabled={isScrolling}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Hide webkit scrollbar */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    );
  },
);
TopProfilesCarousel.displayName = "TopProfilesCarousel";

// Main Component
export default function DesktopVendorMarketplace() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCartStore();
  const pageCategory = params?.category || "";

  const [vendorData, dispatchVendorData] = useReducer(vendorDataReducer, {
    vendors: [],
    pagination: { totalPages: 1, totalVendors: 0 },
    cities: [],
    isLoading: true,
    error: null,
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [viewMode, setViewMode] = useLocalStorage("desktop_viewMode", "list");
  const [isMapView, setIsMapView] = useState(false);
  const [savedSearches, setSavedSearches] = useLocalStorage("desktop_savedSearches", []);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [searchNameInput, setSearchNameInput] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [recentlyViewedVendors, setRecentlyViewedVendors] = useState([]);
  const [isBulkAddToCart, setIsBulkAddToCart] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [isBreadcrumbOpen, setIsBreadcrumbOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage("desktop_sidebarCollapsed", false);

  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalActionType, setLeadModalActionType] = useState("general");

  const [recentSearches, setRecentSearches] = useLocalStorage("desktop_recentSearches", []);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showTopProfiles, setShowTopProfiles] = useState(false);
  const topProfilesRef = useRef(null);
  const vendorListRef = useRef(null);

  const [toastData, setToastData] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);
  const debouncedPriceRange = useDebounce(priceRange, DEBOUNCE_DELAY);

  const { setActiveCategory } = useCartStore();

  const addToRecentlyViewed = useCallback(
    (vendor) => {
      try {
        // Validation: Check if vendor object is valid
        if (!vendor || !vendor._id) {
          console.warn("Invalid vendor object:", vendor);
          return false;
        }

        // Get existing recently viewed from localStorage
        let recentlyViewed = [];
        try {
          const stored = localStorage.getItem("recentlyViewed");
          if (stored) {
            recentlyViewed = JSON.parse(stored);
            // Ensure it's an array
            if (!Array.isArray(recentlyViewed)) {
              recentlyViewed = [];
            }
          }
        } catch (parseError) {
          console.error("Error parsing recently viewed:", parseError);
          recentlyViewed = [];
        }

        // Remove vendor if it already exists (to move it to front)
        recentlyViewed = recentlyViewed.filter((v) => v._id !== vendor._id);

        // Prepare vendor data (only essential fields to save space)
        const vendorData = {
          _id: vendor._id,
          name: vendor.name,
          category: vendor.category,
          rating: vendor.rating,
          reviewCount: vendor.reviewCount,
          location: vendor.location,
          // Normalize images
          images: vendor.normalizedImages || vendor.images || [vendor.defaultImage || "/placeholder.jpg"],
          // Add timestamp
          viewedAt: new Date().toISOString(),
        };

        // Add to beginning of array
        recentlyViewed.unshift(vendorData);

        // Keep only last 10 items
        recentlyViewed = recentlyViewed.slice(0, 10);

        // Save to localStorage with error handling
        try {
          localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
          console.log("✅ Vendor added to recently viewed:", vendor.name);

          // Update state
          setRecentlyViewedVendors(recentlyViewed);

          return true;
        } catch (storageError) {
          // Handle localStorage quota exceeded
          if (storageError.name === "QuotaExceededError") {
            console.warn("LocalStorage quota exceeded, clearing old data");
            // Keep only 5 most recent
            recentlyViewed = recentlyViewed.slice(0, 5);
            localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
          } else {
            console.error("Error saving to localStorage:", storageError);
          }
          return false;
        }
      } catch (error) {
        console.error("Error in addToRecentlyViewed:", error);
        return false;
      }
    },
    [setRecentlyViewedVendors],
  ); // Add dependency

  const handleCategoryMismatch = useCallback((errorMessage, categories) => {
    console.warn("Category mismatch detected:", errorMessage);
    showToast(errorMessage, "error");
    // Optional: You can add additional handling here
    // For example, auto-clearing the compare list or showing a toast
  }, []);

  const getRecentlyViewed = useCallback(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error getting recently viewed:", error);
      return [];
    }
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToastData({ message, type, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToastData((prev) => ({ ...prev, visible: false }));
  }, []);

  // Get category color for radial gradient
  const categoryGradientColor = useMemo(() => {
    if (selectedCategories.length === 1) {
      const cat = VENDOR_CATEGORIES.find((c) => c.id === selectedCategories[0]);
      return cat?.color || "#f59e0b";
    }
    return "#f59e0b";
  }, [selectedCategories]);

  // Initialize from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

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

    // PRIORITY 1: Query params categories (from filters/back navigation)
    const urlCats = params.get("categories");
    if (urlCats) {
      initialState.categories = urlCats.split(",").filter((cat) => VENDOR_CATEGORIES.some((c) => c.id === cat));
    } else if (pageCategory) {
      initialState.categories = [pageCategory];
    }

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

      setIsInitialized(true);
    });
  }, [pageCategory, setActiveCategory]);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim().length > 2) {
      setRecentSearches((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        const trimmed = debouncedSearchQuery.trim();

        if (current[0]?.toLowerCase() === trimmed.toLowerCase()) {
          return current;
        }

        const filtered = current.filter((s) => s && s.trim() && s.trim().toLowerCase() !== trimmed.toLowerCase());

        const newSearches = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
        return newSearches;
      });
    }
  }, [debouncedSearchQuery, setRecentSearches]);

  // Update URL
  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      const urlParams = new URLSearchParams();

      const isOnlyPath = selectedCategories.length === 1 && selectedCategories[0] === pageCategory;

      if (selectedCategories.length > 0) {
        urlParams.set("categories", selectedCategories.join(","));
      }
      if (debouncedSearchQuery?.trim()) urlParams.set("search", debouncedSearchQuery.trim());
      if (sortBy !== "rating") urlParams.set("sortBy", sortBy);
      if (sortOrder !== "desc") urlParams.set("sortOrder", sortOrder);
      if (selectedSubcategory) urlParams.set("subcategory", selectedSubcategory);
      if (currentPage > 1) urlParams.set("page", currentPage.toString());
      if (debouncedPriceRange[0] > 0) urlParams.set("minPrice", debouncedPriceRange[0].toString());
      if (debouncedPriceRange[1] < 1000000) urlParams.set("maxPrice", debouncedPriceRange[1].toString());
      if (selectedLocations.length > 0) urlParams.set("cities", selectedLocations.join(","));
      if (ratingFilter > 0) urlParams.set("minRating", ratingFilter.toString());
      if (showFeaturedOnly) urlParams.set("featured", "true");

      const queryString = urlParams.toString();
      const base = selectedCategories.length === 0 ? "/vendors/marketplace" : window.location.pathname;
      const newUrl = queryString ? `${base}?${queryString}` : base;
      const currentSearch = window.location.search;
      const newSearch = queryString ? `?${queryString}` : "";

      if (currentSearch !== newSearch) {
        router.replace(newUrl, { scroll: false });
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [
    isInitialized,
    selectedCategories,
    debouncedSearchQuery,
    sortBy,
    sortOrder,
    currentPage,
    debouncedPriceRange,
    selectedLocations,
    selectedSubcategory,
    ratingFilter,
    showFeaturedOnly,
    pageCategory,
    router,
  ]);

  // Fetch vendors
  useEffect(() => {
    if (!isInitialized) return;

    const controller = new AbortController();
    let isMounted = true;

    const fetchVendors = async () => {
      if (!isMounted) return;

      dispatchVendorData({ type: "SET_LOADING", payload: true });

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        sortBy,
        sortOrder,
      });

      if (debouncedSearchQuery) queryParams.set("search", decodeURIComponent(debouncedSearchQuery));
      if (selectedCategories.length > 0) queryParams.set("categories", selectedCategories.join(","));
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
        if (!isMounted) return;
        const result = await response.json();
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
            type: "SET_VENDORS",
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
            type: "SET_VENDORS",
            payload: {
              vendors: [],
              pagination: { totalPages: 1, totalVendors: 0 },
              cities: [],
            },
          });
        }
      } catch (err) {
        if (err.name !== "AbortError" && isMounted) {
          dispatchVendorData({
            type: "SET_ERROR",
            payload: "Failed to load vendors.",
          });
        }
      }
    };

    fetchVendors();

    return () => {
      isMounted = false;
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      // ESC to exit compare mode
      if (e.key === "Escape" && compareMode) {
        setCompareMode(false);
        setCompareList([]);
        showToast("Compare mode exited", "info");
      }

      // Ctrl/Cmd + K to toggle compare mode
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCompareMode((prev) => !prev);
        showToast(!compareMode ? "Compare mode activated" : "Compare mode exited", !compareMode ? "success" : "info");
      }

      // Ctrl/Cmd + Shift + C to clear compare list
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C" && compareList.length > 0) {
        e.preventDefault();
        setCompareList([]);
        showToast("Comparison list cleared", "info");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [compareMode, compareList, showToast]);

  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const recent = getRecentlyViewed();
        setRecentlyViewedVendors(recent);
        console.log("📚 Loaded recently viewed vendors:", recent.length);
      } catch (error) {
        console.error("Error loading recently viewed:", error);
      }
    };

    loadRecentlyViewed();
  }, []); // Remove getRecentlyViewed from dependencies since it's now memoized with useCallback

  const { vendors, pagination: paginationInfo, cities: availableCities, isLoading, error } = vendorData;

  const handleCategoryChange = useCallback(
    (catId) => {
      startTransition(() => {
        if (catId === null) {
          setSelectedCategories([]);
          setSelectedSubcategory("");
        } else {
          setSelectedCategories((prev) => {
            if (prev.includes(catId)) {
              const newCats = prev.filter((c) => c !== catId);
              if (newCats.length === 0 || !SUBCATEGORIES[newCats[0]]?.some((s) => s.id === selectedSubcategory)) {
                setSelectedSubcategory("");
              }
              return newCats;
            } else {
              return [catId];
            }
          });
        }
        setCurrentPage(1);
      });
    },
    [selectedSubcategory],
  );

  const handleFilterCategoryChange = useCallback(
    (catId) => {
      startTransition(() => {
        setSelectedCategories((prev) => {
          const newCats = prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId];
          if (!newCats.some((c) => SUBCATEGORIES[c]?.some((s) => s.id === selectedSubcategory))) {
            setSelectedSubcategory("");
          }
          return newCats;
        });
        setCurrentPage(1);
      });
    },
    [selectedSubcategory],
  );

  const handleLocationChange = useCallback((city) => {
    setSelectedLocations((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
    setCurrentPage(1);
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

          // Show success feedback
          showToast(`${vendor.name} added to compare`, "success");

          return newList;
        });
      });
    },
    [compareMode, showToast],
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setTimeout(() => {
      vendorListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const clearAllFilters = useCallback(() => {
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
      if (compareMode) {
        setCompareMode(false);
        setCompareList([]);
      }
    });
    showToast("All filters cleared", "info");
  }, [compareMode, showToast]);

  const prevSearchRef = useRef("");

  useEffect(() => {
    const wasEmpty = !prevSearchRef.current || prevSearchRef.current.trim() === "";
    const isNowFilled = searchQuery && searchQuery.trim() !== "";

    if (wasEmpty && isNowFilled) {
      setSelectedCategories([]);
    }

    prevSearchRef.current = searchQuery;
  }, [searchQuery]);

  const handleSelectRecentSearch = useCallback(
    (search) => {
      console.log("🔍 Recent search clicked:", search); // Debug log
      if (!search || !search.trim()) {
        console.warn("Empty search term");
        return;
      }

      startTransition(() => {
        setSearchQuery(search.trim());
        setSelectedCategories([]);
        setCurrentPage(1);
      });

      showToast(`Applied search: "${search}"`, "info");
    },
    [showToast],
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    showToast("Search history cleared", "info");
  }, [setRecentSearches, showToast]);

  const saveCurrentSearch = useCallback(
    (name) => {
      const searchData = {
        id: Date.now(),
        name: name || `Search ${savedSearches.length + 1}`,
        categories: selectedCategories,
        query: searchQuery,
        subcategory: selectedSubcategory,
        priceRange: priceRange,
        locations: selectedLocations,
        rating: ratingFilter,
        featured: showFeaturedOnly,
        sortBy: sortBy,
        sortOrder: sortOrder,
        timestamp: Date.now(),
        resultsCount: paginationInfo.totalVendors,
      };

      setSavedSearches((prev) => {
        const filtered = prev.filter((s) => s.id !== searchData.id);
        return [searchData, ...filtered].slice(0, 10);
      });

      setShowSaveModal(false);
      setSearchNameInput("");
      showToast("Search saved successfully!", "success");
    },
    [
      selectedCategories,
      searchQuery,
      selectedSubcategory,
      priceRange,
      selectedLocations,
      ratingFilter,
      showFeaturedOnly,
      sortBy,
      sortOrder,
      savedSearches.length,
      setSavedSearches,
      paginationInfo.totalVendors,
      showToast,
    ],
  );

  const loadSavedSearch = useCallback(
    (search) => {
      startTransition(() => {
        setSelectedCategories(search.categories || []);
        setSearchQuery(search.query || "");
        setSelectedSubcategory(search.subcategory || "");
        setPriceRange(search.priceRange || [0, 1000000]);
        setSelectedLocations(search.locations || []);
        setRatingFilter(search.rating || 0);
        setShowFeaturedOnly(search.featured || false);
        setSortBy(search.sortBy || "rating");
        setSortOrder(search.sortOrder || "desc");
        setCurrentPage(1);
      });
      setShowSavedSearches(false);
      showToast(`Loaded "${search.name}"`, "success");
    },
    [showToast],
  );

  const deleteSavedSearch = useCallback(
    (id) => {
      setSavedSearches((prev) => prev.filter((s) => s.id !== id));
      showToast("Search removed", "info");
    },
    [setSavedSearches, showToast],
  );

  // Build active filters for display
  const activeFiltersDisplay = useMemo(() => {
    const filters = [];
    if (searchQuery) filters.push(`Search: "${searchQuery}"`);
    if (selectedCategories.length > 0) {
      const labels = selectedCategories.map((id) => VENDOR_CATEGORIES.find((c) => c.id === id)?.label || id);
      filters.push(`Categories: ${labels.join(", ")}`);
    }
    if (selectedSubcategory) {
      const allSubs = Object.values(SUBCATEGORIES).flat();
      const sub = allSubs.find((s) => s.id === selectedSubcategory);
      filters.push(`Type: ${sub?.label || selectedSubcategory}`);
    }
    if (selectedLocations.length > 0) filters.push(`Cities: ${selectedLocations.join(", ")}`);
    if (priceRange[0] > 0 || priceRange[1] < 1000000) {
      filters.push(`Budget: ₹${formatPrice(priceRange[0])} - ₹${formatPrice(priceRange[1])}`);
    }
    if (ratingFilter > 0) filters.push(`Rating: ${ratingFilter}+ stars`);
    if (showFeaturedOnly) filters.push("Featured Only");
    if (sortBy !== "rating") {
      const opt = SORT_OPTIONS.find((o) => o.value === sortBy);
      filters.push(`Sort: ${opt?.label || sortBy}`);
    }
    if (sortOrder !== "desc") filters.push("Order: Low to High");
    return filters;
  }, [
    searchQuery,
    selectedCategories,
    selectedSubcategory,
    selectedLocations,
    priceRange,
    ratingFilter,
    showFeaturedOnly,
    sortBy,
    sortOrder,
  ]);

  const trackVendorView = useCallback((vendor) => {
    if (!vendor?._id) return;

    const viewData = {
      _id: vendor._id,
      name: vendor.name,
      category: vendor.category,
      image: vendor.normalizedImages?.[0] || vendor.images?.[0] || vendor.defaultImage || "/placeholder.jpg",
      rating: vendor.rating || 0,
      price: getVendorPrice(vendor),
      city: vendor.address?.city || "",
      timestamp: Date.now(),
    };

    try {
      const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const filtered = recent.filter((v) => v._id !== vendor._id);
      const updated = [viewData, ...filtered].slice(0, 8);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving recently viewed:", error);
    }
  }, []);

  const gridClass = useMemo(() => {
    switch (viewMode) {
      case "grid-2":
        return "grid-cols-1 lg:grid-cols-2";
      case "list":
        return "grid-cols-1";
      default:
        return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
    }
  }, [viewMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Subtle gradient overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(ellipse 150% 100% at 50% 0%, ${categoryGradientColor}15 0%, transparent 60%)`,
        }}
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(ellipse 100% 80% at 50% 100%, ${categoryGradientColor}10 0%, transparent 50%)`,
        }}
      />

      <ScrollProgressBar />
      <OfflineBanner />
      <ScrollToTopButton />
      <CartPreview />

      {/* Top Profiles Floating Button - sits above nav icons */}
      {/* <motion.button
        whileHover={{ scale: 1.1, opacity: 1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          const willOpen = !showTopProfiles;
          setShowTopProfiles(willOpen);
          if (willOpen) {
            setTimeout(() => {
              topProfilesRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 400);
          }
        }}
        className="fixed right-1 z-[9998] flex items-center gap-2 px-3 py-2 rounded-xl text-white font-semibold text-xs shadow-xl transition-all opacity-40 hover:opacity-100"
        style={{
          bottom: "295px",
          background: showTopProfiles
            ? "linear-gradient(135deg, #d97706, #b45309)"
            : "linear-gradient(135deg, #f59e0b, #d97706)",
          boxShadow: "0 6px 24px rgba(245, 158, 11, 0.45)",
        }}
        title={showTopProfiles ? "Hide Top Profiles" : "Show Top Profiles"}
      >
        <Star size={15} fill="white" color="white" />
        <span>Top Profiles</span>
      </motion.button> */}

      <AnimatePresence>
        {toastData.visible && <Toast message={toastData.message} type={toastData.type} onClose={hideToast} />}
      </AnimatePresence>
      <div className="relative z-10 max-w-[1920px] mx-auto px-4 lg:px-8 py-6 pt-[3px]">
        {/* Main Two-Column Layout */}
        <div className="flex gap-8 items-start">
          {/* LEFT COLUMN - Filters Sidebar (Fixed Width) */}
          <aside className={`shrink-0 transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-80"} relative z-40`}>
            <div className="fixed top-22" style={{ minWidth: !sidebarCollapsed && "325px" }}>
              <FilterSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showFeaturedOnly={showFeaturedOnly}
                setShowFeaturedOnly={setShowFeaturedOnly}
                selectedCategories={selectedCategories}
                handleCategoryChange={handleFilterCategoryChange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                availableCities={availableCities}
                selectedLocations={selectedLocations}
                handleLocationChange={handleLocationChange}
                ratingFilter={ratingFilter}
                setRatingFilter={setRatingFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                setCurrentPage={setCurrentPage}
                onClear={clearAllFilters}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                selectedSubcategory={selectedSubcategory}
                setSelectedSubcategory={setSelectedSubcategory}
                recentSearches={recentSearches}
                onSelectRecentSearch={handleSelectRecentSearch}
                onClearRecentSearches={clearRecentSearches}
              />
            </div>
          </aside>

          {/* RIGHT COLUMN - Main Content */}
          <main className="flex-1 min-w-0 space-y-3">
            {/* Category Chips */}
            <CategoryChips
              selectedCategories={selectedCategories}
              onSelect={handleCategoryChange}
              showTopProfiles={showTopProfiles}
              setShowTopProfiles={setShowTopProfiles}
              topProfilesRef={topProfilesRef}
            />

            {/* Top Profiles Inline Carousel - shown when button is clicked */}
            <AnimatePresence initial={false}>
              {showTopProfiles && (
                <motion.div
                  ref={topProfilesRef}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: { height: { duration: 0.35 }, opacity: { duration: 0.25, delay: 0.05 } },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: { height: { duration: 0.25 }, opacity: { duration: 0.15 } },
                  }}
                  className="overflow-hidden"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-sm">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Star size={15} fill="#f59e0b" color="#f59e0b" />
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Top Profiles</p>
                        <span className="text-xs text-gray-400">Most trusted vendors on the platform</span>
                      </div>
                      <button
                        onClick={() => setShowTopProfiles(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <X size={15} className="text-gray-400" />
                      </button>
                    </div>
                    <div className="px-5 py-4">
                      <TopProfilesCarousel
                        selectedCategories={selectedCategories}
                        selectedSubcategory={selectedSubcategory}
                        selectedLocations={selectedLocations}
                        priceRange={priceRange}
                        sortBy="rating"
                        sortOrder="desc"
                        ratingFilter={ratingFilter}
                        showFeaturedOnly={showFeaturedOnly}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subcategory Chips - Only when single category selected */}
            {/* <AnimatePresence>
      {selectedCategories.length === 1 && SUBCATEGORIES[selectedCategories[0]] && (
        <SubcategoryChips
          selectedCategory={selectedCategories[0]}
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={(sub) => { setSelectedSubcategory(sub); setCurrentPage(1); }}
        />
      )}
    </AnimatePresence> */}

            <AnimatePresence>
              {activeFiltersDisplay.length > 0 && (
                <ActiveFiltersDisplay
                  filters={activeFiltersDisplay}
                  onClearAll={clearAllFilters}
                  selectedCategories={selectedCategories}
                  searchQuery={searchQuery}
                  selectedSubcategory={selectedSubcategory}
                  selectedLocations={selectedLocations}
                  priceRange={priceRange}
                  ratingFilter={ratingFilter}
                  showFeaturedOnly={showFeaturedOnly}
                  totalResults={paginationInfo.totalVendors}
                  isBreadcrumbOpen={isBreadcrumbOpen}
                  setIsBreadcrumbOpen={setIsBreadcrumbOpen}
                  onClearCategories={() => {
                    setSelectedCategories([]);
                    setSelectedSubcategory("");
                    setCurrentPage(1);
                  }}
                  onClearSubcategory={() => {
                    setSelectedSubcategory("");
                    setCurrentPage(1);
                  }}
                  onClearLocations={() => {
                    setSelectedLocations([]);
                    setCurrentPage(1);
                  }}
                  onClearFilters={() => {
                    setPriceRange([0, 1000000]);
                    setRatingFilter(0);
                    setShowFeaturedOnly(false);
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                />
              )}
            </AnimatePresence>

            {/* Content Header Bar */}
            <div
              ref={vendorListRef}
              className="sticky top-22 z-60 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                {/* Left: Results Count & Info */}
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {selectedCategories.length === 1
                        ? VENDOR_CATEGORIES.find((c) => c.id === selectedCategories[0])?.label || "All Vendors"
                        : "All Vendors"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        `${paginationInfo.totalVendors.toLocaleString()} vendors found`
                      )}
                    </p>
                  </div>

                  {/* Sort Dropdown (Quick Access) */}
                  <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-500">Sort:</span>
                    <CustomSortDropdown
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onSortChange={(newSort) => {
                        setSortBy(newSort);
                        setCurrentPage(1);
                      }}
                      onOrderChange={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                    />
                  </div>

                  {/* Bulk Selection Mode (when enabled) */}
                  {compareMode && compareList.length > 0 && (
                    <div className="flex items-center gap-3 pl-4 border-l mr-2 border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          // Add all to cart
                          compareList.forEach((v) => {
                            const price = getVendorPrice(v);
                            const images = v.normalizedImages || v.images || [v.defaultImage];
                            addToCart({
                              _id: v._id,
                              name: v.name,
                              category: v.category,
                              price: price,
                              image: images[0],
                              quantity: 1,
                              address: v.address,
                            });
                          });
                          setIsBulkAddToCart(true);
                          showToast(`${compareList.length} vendors added to cart`, "success");
                        }}
                        className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        {isBulkAddToCart ? (
                          <Check size={16} className="animate-pulse" />
                        ) : (
                          <>
                            <ShoppingCart size={14} />
                            {`Add (${compareList.length})`}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Save Search - Professional */}
                  <div className="relative">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSavedSearches(!showSavedSearches)}
                      className={`p-2 rounded-xl transition-all relative ${
                        savedSearches.length > 0
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                      title="Saved Searches"
                    >
                      <Heart size={16} className={savedSearches.length > 0 ? "fill-blue-600" : ""} />
                      {savedSearches.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {savedSearches.length}
                        </span>
                      )}
                    </motion.button>

                    {/* Saved Searches Dropdown */}
                    <AnimatePresence>
                      {showSavedSearches && (
                        <motion.div
                          ref={(node) => {
                            if (node) {
                              const handleClickOutside = (e) => {
                                if (!node.contains(e.target)) setShowSavedSearches(false);
                              };
                              document.addEventListener("mousedown", handleClickOutside);
                              return () => document.removeEventListener("mousedown", handleClickOutside);
                            }
                          }}
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                        >
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Heart size={16} className="text-blue-600" />
                                Saved Searches
                              </h4>
                              <button
                                onClick={() => setShowSaveModal(true)}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                              >
                                <Plus size={12} />
                                Save Current
                              </button>
                            </div>
                          </div>

                          {/* Saved Searches List */}
                          <div className="max-h-96 overflow-y-auto">
                            {savedSearches.length > 0 ? (
                              <div className="p-2">
                                {savedSearches.map((search, idx) => (
                                  <motion.div
                                    key={search.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 mb-2 last:mb-0 group"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <button onClick={() => loadSavedSearch(search)} className="flex-1 text-left">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                                            {search.name}
                                          </h5>
                                          {search.resultsCount > 0 && (
                                            <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-bold rounded">
                                              {search.resultsCount} results
                                            </span>
                                          )}
                                        </div>

                                        {/* Search Details */}
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                          {search.categories?.length > 0 && (
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-[10px] font-medium text-gray-600 dark:text-gray-300">
                                              {search.categories.length} categories
                                            </span>
                                          )}
                                          {search.query && (
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-[10px] font-medium text-gray-600 dark:text-gray-300">
                                              "{truncateText(search.query, 20)}"
                                            </span>
                                          )}
                                          {search.locations?.length > 0 && (
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-[10px] font-medium text-gray-600 dark:text-gray-300">
                                              {search.locations.length} cities
                                            </span>
                                          )}
                                          {search.rating > 0 && (
                                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded text-[10px] font-medium text-gray-600 dark:text-gray-300">
                                              {search.rating}+ ⭐
                                            </span>
                                          )}
                                        </div>

                                        <p className="text-[10px] text-gray-400">
                                          Saved {new Date(search.timestamp).toLocaleDateString()} at{" "}
                                          {new Date(search.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </p>
                                      </button>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteSavedSearch(search.id);
                                        }}
                                        className="p-1.5 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Heart size={24} className="text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No saved searches yet</p>
                                <button
                                  onClick={() => {
                                    setShowSavedSearches(false);
                                    setShowSaveModal(true);
                                  }}
                                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Save Your First Search
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          {savedSearches.length > 0 && (
                            <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                              <button
                                onClick={() => {
                                  setSavedSearches([]);
                                  showToast("All saved searches cleared", "info");
                                }}
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                Clear All Saved Searches
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Compare Toggle */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCompareMode(!compareMode);
                      if (compareMode) setCompareList([]);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      compareMode
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <ArrowRightLeft size={16} />
                    <span className="hidden sm:inline">{compareMode ? "Exit Compare" : "Compare"}</span>
                    {compareList.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white/20">{compareList.length}</span>
                    )}
                  </motion.button>

                  {/* Map Toggle */}
                  {!compareMode && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsMapView(!isMapView)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isMapView
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {isMapView ? <List size={16} /> : <MapIcon size={16} />}
                      <span className="hidden sm:inline">{isMapView ? "List" : "Map"}</span>
                    </motion.button>
                  )}

                  {/* View Mode Switcher */}
                  {!isMapView && (
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                      {VIEW_MODES.map((mode) => {
                        const Icon = mode.icon;
                        const isActive = viewMode === mode.id;
                        return (
                          <button
                            key={mode.id}
                            onClick={() => setViewMode(mode.id)}
                            className={`p-2 rounded-lg transition-all ${
                              isActive
                                ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            }`}
                            title={mode.label}
                          >
                            <Icon size={16} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              {/* ============================================
    STICKY COMPARE BAR - Shows when compare mode active
    Location: Below main header, above content
    ============================================ */}
              <AnimatePresence>
                {compareMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`sticky top-0 z-40 rounded-2xl mt-2 shadow-lg overflow-hidden ${compareList.length > 0 ? " bg-gradient-to-r from-blue-600 to-purple-600" : " bg-gradient-to-r from-blue-600/70 to-purple-600/40 "}`}
                  >
                    <div className="container mx-auto px-6 py-3">
                      <div className="flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
                        {/* ========== LEFT SECTION: Compare Mode Info ========== */}
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-xl"
                          >
                            <GitCompare size={20} className="text-white" />
                          </motion.div>

                          <div>
                            <h3 className="text-white font-bold text-sm flex items-center gap-2">
                              Compare Mode Active
                              <span className="px-2 py-0.5 bg-white/30 backdrop-blur-sm rounded-full text-xs font-bold">
                                {compareList.length}/4
                              </span>
                              {/* Show category badge when vendors selected */}
                              {compareList.length > 0 && (
                                <span className="px-2 py-0.5 bg-blue-500/50 backdrop-blur-sm rounded-full text-xs font-bold">
                                  {VENDOR_CATEGORIES.find((c) => c.id === compareList[0]?.category)?.label ||
                                    compareList[0]?.category}
                                </span>
                              )}
                            </h3>
                            <p className="text-white/80 text-xs">
                              {compareList.length === 0 && "Select up to 4 vendors to compare"}
                              {compareList.length === 1 && (
                                <>
                                  Add more{" "}
                                  <span className="font-semibold text-white">
                                    {VENDOR_CATEGORIES.find((c) => c.id === compareList[0]?.category)?.label ||
                                      "vendors"}
                                  </span>{" "}
                                  to compare
                                </>
                              )}
                              {compareList.length >= 2 && compareList.length < 4 && (
                                <>
                                  Comparing{" "}
                                  <span className="font-semibold text-white">
                                    {VENDOR_CATEGORIES.find((c) => c.id === compareList[0]?.category)?.label ||
                                      "vendors"}
                                  </span>
                                  {` • ${4 - compareList.length} more can be added`}
                                </>
                              )}
                              {compareList.length === 4 && (
                                <>
                                  Comparing{" "}
                                  <span className="font-semibold text-white">
                                    {VENDOR_CATEGORIES.find((c) => c.id === compareList[0]?.category)?.label ||
                                      "vendors"}
                                  </span>
                                  {" • Maximum reached"}
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* ========== CENTER SECTION: Selected Vendors Preview (Desktop Only) ========== */}
                        {compareList.length > 0 && (
                          <div className="hidden md:flex items-center gap-2 flex-1 justify-center max-w-xl">
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                              {compareList.map((vendor, index) => (
                                <motion.div
                                  key={vendor._id}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="relative group flex-shrink-0"
                                >
                                  {/* Vendor Image */}
                                  <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/50 bg-white/10 backdrop-blur-sm">
                                    <img
                                      src={
                                        vendor.normalizedImages?.[0] ||
                                        vendor.images?.[0] ||
                                        vendor.defaultImage ||
                                        "/placeholder.jpg"
                                      }
                                      alt={vendor.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = "/placeholder.jpg";
                                      }}
                                    />
                                  </div>

                                  {/* Remove Button (Appears on Hover) */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCompareToggle(vendor);
                                    }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs font-bold shadow-lg hover:scale-110"
                                  >
                                    ×
                                  </button>

                                  {/* Tooltip with Vendor Name */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    {vendor.name.length > 20 ? vendor.name.substring(0, 20) + "..." : vendor.name}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                                  </div>
                                </motion.div>
                              ))}

                              {/* Empty Slots Indicator */}
                              {[...Array(4 - compareList.length)].map((_, i) => (
                                <div
                                  key={`empty-${i}`}
                                  className="w-10 h-10 rounded-lg border-2 border-dashed border-white/30 bg-white/5 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
                                >
                                  <Plus size={16} className="text-white/40" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ========== RIGHT SECTION: Action Buttons ========== */}
                        <div className="flex items-center gap-2">
                          {/* Compare Button */}
                          <motion.button
                            whileHover={{ scale: compareList.length >= 2 ? 1.05 : 1 }}
                            whileTap={{ scale: compareList.length >= 2 ? 0.95 : 1 }}
                            animate={
                              compareList.length >= 2
                                ? {
                                    boxShadow: [
                                      "0 0 0 0 rgba(255, 255, 255, 0.7)",
                                      "0 0 0 10px rgba(255, 255, 255, 0)",
                                    ],
                                  }
                                : {}
                            }
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatType: "loop",
                            }}
                            onClick={() => {
                              if (compareList.length >= 2) {
                                setShowCompare(true);
                              }
                            }}
                            disabled={compareList.length < 2}
                            className={`px-4 py-2 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${
                              compareList.length >= 2
                                ? "bg-white text-blue-600 hover:bg-gray-50 cursor-pointer"
                                : "bg-white/20 text-white/40 cursor-not-allowed"
                            }`}
                          >
                            <GitCompare size={16} />
                            <span className="hidden sm:inline">Compare</span>
                            {compareList.length > 0 && (
                              <span
                                className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                                  compareList.length >= 2 ? "bg-blue-600 text-white" : "bg-white/30 text-white/60"
                                }`}
                              >
                                {compareList.length}
                              </span>
                            )}
                          </motion.button>

                          {/* Clear All Button */}
                          {compareList.length > 0 && (
                            <motion.button
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setCompareList([]);
                                showToast("Comparison cleared", "info");
                              }}
                              className="p-2 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
                              title="Clear all selections"
                            >
                              <X size={16} />
                            </motion.button>
                          )}

                          {/* Exit Compare Mode Button */}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCompareMode(!compareMode);
                              if (compareMode) {
                                setCompareList([]);
                                showToast("Compare mode exited", "info");
                              } else {
                                showToast("Compare mode activated - Select vendors to compare", "success");
                              }
                            }}
                            className={`p-2.5 rounded-xl transition-all relative ${
                              compareMode
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                            title={compareMode ? "Exit compare mode" : "Enter compare mode"}
                          >
                            <GitCompare size={18} />

                            {/* Badge showing count */}
                            {compareList.length > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg"
                              >
                                {compareList.length}
                              </motion.span>
                            )}
                          </motion.button>
                        </div>
                      </div>

                      {/* ========== MOBILE SECTION: Compact View ========== */}
                      <div className="md:hidden mt-3 pt-3 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          {/* Selected Vendors Mini Preview */}
                          {compareList.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              {compareList.slice(0, 3).map((vendor) => (
                                <div
                                  key={vendor._id}
                                  className="w-8 h-8 rounded-lg overflow-hidden border border-white/50 bg-white/10"
                                >
                                  <img
                                    src={vendor.normalizedImages?.[0] || vendor.images?.[0] || "/placeholder.jpg"}
                                    alt={vendor.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = "/placeholder.jpg";
                                    }}
                                  />
                                </div>
                              ))}
                              {compareList.length > 3 && (
                                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center text-white text-xs font-bold">
                                  +{compareList.length - 3}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Status Text */}
                          {/* Status Text */}
                          <p className="text-white/80 text-xs font-medium">
                            {compareList.length === 0 && "Tap vendors to add"}
                            {compareList.length === 1 && (
                              <>
                                Add 1 more{" "}
                                <span className="text-white font-semibold">
                                  {VENDOR_CATEGORIES.find((c) => c.id === compareList[0]?.category)?.label || ""}
                                </span>
                              </>
                            )}
                            {compareList.length >= 2 && (
                              <>
                                Comparing{" "}
                                <span className="text-white font-semibold">
                                  {VENDOR_CATEGORIES.find((c) => c.id === compareList[0]?.category)?.label || "vendors"}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ========== PROGRESS BAR ========== */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: compareList.length / 4 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="h-1 bg-white/40 origin-left"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-red-700 dark:text-red-400 font-medium text-sm flex-1">{error}</p>
                <button
                  onClick={() => dispatchVendorData({ type: "SET_ERROR", payload: null })}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}

            {/* Vendors Grid / Map / Loading / Empty */}
            <AnimatePresence mode="wait">
              {isMapView ? (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
                  style={{ height: "calc(100vh - 300px)", minHeight: "500px" }}
                >
                  <Suspense fallback={<MapLoadingPlaceholder />}>
                    <MapView vendors={vendors} onVendorSelect={() => setIsMapView(false)} center={DEFAULT_CENTER} />
                  </Suspense>
                </motion.div>
              ) : !isInitialized || (isLoading && vendors.length === 0) ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid gap-5 ${gridClass}`}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} viewMode={viewMode} />
                  ))}
                </motion.div>
              ) : vendors.length > 0 ? (
                <motion.div key="vendors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="relative">
                    {isLoading && (
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse z-10 rounded-full" />
                    )}
                    <div className={`grid gap-5 transition-all ${gridClass} ${isLoading ? "pointer-events-none opacity-50 pt-5" : ""}`}>
                      {vendors.map((vendor, index) => (
                        <motion.div
                          key={vendor._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.02 }}
                        >
                          <VendorCard
                            vendor={vendor}
                            viewMode={viewMode}
                            isComparing={compareMode}
                            isSelectedForCompare={!!compareList.find((v) => v._id === vendor._id)}
                            onCompare={handleCompareToggle}
                            onShowToast={showToast}
                            addToRecentlyViewed={addToRecentlyViewed}
                            setShowShareModal={setShowShareModal}
                            setShareItem={setShareItem}
                            setIsLeadModalOpen={setIsLeadModalOpen}
                            setLeadModalActionType={setLeadModalActionType}
                            isLeadModalOpen={isLeadModalOpen}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <EmptyState onClearFilters={clearAllFilters} searchQuery={searchQuery} />
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!isMapView && vendors.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}

            {/* Quick Filter Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-xs font-semibold text-gray-500 shrink-0">Quick:</span>
              {[
                { label: "Trending", icon: TrendingUp, filters: { sortBy: "bookings", featured: true } },
                { label: "Budget Friendly", icon: DollarSign, filters: { priceRange: [0, 50000] } },
                { label: "Top Rated", icon: Star, filters: { rating: 4.5, sortBy: "rating" } },
                { label: "Verified Only", icon: BadgeCheck, filters: { featured: true } },
                { label: "This Week", icon: Calendar, filters: { sortBy: "newest" } },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    // Apply preset filters
                    if (preset.filters.sortBy) setSortBy(preset.filters.sortBy);
                    if (preset.filters.featured !== undefined) setShowFeaturedOnly(preset.filters.featured);
                    if (preset.filters.priceRange) setPriceRange(preset.filters.priceRange);
                    if (preset.filters.rating) setRatingFilter(preset.filters.rating);
                    setCurrentPage(1);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap"
                >
                  <preset.icon size={14} />
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Promo Carousel - At Bottom */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Special Offers & Promotions</h3>
              <PromoCarousel />
              <RecentlyViewed />
            </div>
          </main>
        </div>
      </div>

      {/* Compare Bar */}
      <AnimatePresence>
        <CompareBar
          count={compareList.length}
          vendors={compareList}
          onClear={() => {
            setCompareList([]);
            setCompareMode(false);
          }}
          onView={() => {
            if (compareList.length < 2) {
              showToast("Select at least 2 vendors to compare", "info");
              return;
            }
            setShowCompare(true);
          }}
        />
      </AnimatePresence>

      {/* Save Search Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              onClick={() => setShowSaveModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl z-[201] p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Heart size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Save Search</h3>
                  <p className="text-sm text-gray-500">Name this search for quick access</p>
                </div>
              </div>

              {/* Search Preview */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-xs font-semibold text-gray-500 mb-2">Search Details:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategories.length > 0 && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-medium rounded">
                      {selectedCategories.length} categories
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-medium rounded">
                      "{truncateText(searchQuery, 30)}"
                    </span>
                  )}
                  {selectedLocations.length > 0 && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-medium rounded">
                      {selectedLocations.length} cities
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-medium rounded">
                      ₹{formatPrice(priceRange[0])}-{formatPrice(priceRange[1])}
                    </span>
                  )}
                  {ratingFilter > 0 && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-medium rounded">
                      {ratingFilter}+ ⭐
                    </span>
                  )}
                  {paginationInfo.totalVendors > 0 && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-bold rounded">
                      {paginationInfo.totalVendors} results
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Search Name</label>
                <input
                  type="text"
                  value={searchNameInput}
                  onChange={(e) => setSearchNameInput(e.target.value)}
                  placeholder="e.g., Wedding Venues in Mumbai"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && searchNameInput.trim()) {
                      saveCurrentSearch(searchNameInput.trim());
                    }
                  }}
                />
                <p className="text-xs text-gray-400 mt-1">Leave empty for auto-generated name</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setSearchNameInput("");
                  }}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 font-semibold text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveCurrentSearch(searchNameInput.trim())}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-700 transition-colors"
                >
                  Save Search
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        vendors={compareList}
        onCategoryMismatch={(errorMsg, categories) => {
          console.warn("Category mismatch in modal:", errorMsg);
          showToast(errorMsg, "error");
        }}
      />

      <AnimatePresence>
        {showShareModal && (
          <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} shareItem={shareItem} />
        )}
      </AnimatePresence>

      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        actionType={leadModalActionType}
        title="Plan Your Perfect Event"
        subtitle="Get started with India's most affordable event planning marketplace"
      />

      {/* ========== CUSTOM STYLES FOR COMPARE BAR ========== */}
      <style jsx>{`
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Smooth transitions */
        .compare-bar-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Breadcrumb smooth transitions */
        .breadcrumb-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Breadcrumb hover effects */
        .breadcrumb-item:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        /* Breadcrumb progress animation */
        @keyframes breadcrumbProgress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        /* Breadcrumb separator animation */
        @keyframes fadeInSeparator {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Responsive breadcrumb */
        @media (max-width: 768px) {
          .breadcrumb-container {
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .breadcrumb-container::-webkit-scrollbar {
            display: none;
          }
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .compare-vendor-preview {
            max-width: 100%;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}
