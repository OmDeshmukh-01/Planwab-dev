"use client";

import { useState, useEffect, useCallback, useMemo, useRef, memo, useReducer } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  ClipboardList,
  Camera,
  Music,
  Utensils,
  Building,
  Palette,
  Scissors,
  Crown,
  Flower2,
  Gift,
  Star,
  Heart,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Clock,
  Edit2,
  Edit3,
  Bell,
  Share2,
  X,
  Bookmark,
  Quote,
  HelpCircle,
  MessageCircle,
  Phone,
  Sparkles,
  ArrowRight,
  ArrowUp,
  PieChart,
  AlertCircle,
  CalendarDays,
  PartyPopper,
  Cake,
  BadgeCheck,
  Send,
  Search,
  Grid3X3,
  List,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Info,
  DollarSign,
  TrendingUp,
  Mail,
  Loader2,
  RefreshCw,
  ExternalLink,
  Copy,
  Settings,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Download,
  Upload,
  Zap,
  Target,
  Award,
  Trophy,
  Briefcase,
  GraduationCap,
  Home,
  Car,
  Plane,
  Ship,
  Train,
  Bus,
  Bike,
  Footprints,
  Mountain,
  Trees,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  Thermometer,
  Umbrella,
  Coffee,
  Wine,
  Beer,
  Pizza,
  IceCream,
  Cookie,
  Apple,
  Banana,
  Cherry,
  Grape,
  Lemon,
  Orange,
  Carrot,
  Salad,
  Soup,
  Sandwich,
  Popcorn,
  Candy,
  Donut,
  CupSoda,
  Milk,
  Egg,
  Fish,
  Drumstick,
  Beef,
  Croissant,
  BaggageClaim,
  Loader,
  RotateCcw,
  Save,
  FileText,
  Printer,
  Link,
  Link2,
  Unlink,
  Globe,
  Lock,
  Unlock,
  Key,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Users2,
  UsersRound,
  Contact,
  Contact2,
  AtSign,
  Hash,
  Percent,
  IndianRupee,
  Euro,
  PoundSterling,
  Yen,
  Coins,
  Banknote,
  CreditCard,
  Receipt,
  ShoppingCart,
  ShoppingBag,
  Package,
  PackageCheck,
  PackageX,
  PackageSearch,
  PackagePlus,
  PackageMinus,
  PackageOpen,
  Box,
  Boxes,
  Archive,
  ArchiveRestore,
  ArchiveX,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderCheck,
  FolderX,
  FolderSearch,
  FolderInput,
  FolderOutput,
  FolderSync,
  FolderCog,
  FolderHeart,
  FolderKey,
  FolderLock,
  FolderSymlink,
  FolderTree,
  FolderUp,
  FolderDown,
  FolderArchive,
  FolderClock,
  FolderDot,
  FolderGit,
  FolderGit2,
  FolderKanban,
  FolderRoot,
  Workflow,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  GitPullRequestClosed,
  GitPullRequestDraft,
  Terminal,
  Code,
  Code2,
  Braces,
  Brackets,
  Bug,
  Cpu,
  HardDrive,
  Server,
  Database,
  Cloud as CloudIcon,
  CloudCog,
  CloudDownload,
  CloudUpload,
  CloudOff,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  BluetoothConnected,
  BluetoothSearching,
  Cast,
  Airplay,
  Monitor,
  MonitorOff,
  MonitorSmartphone,
  Laptop,
  Laptop2,
  Tablet,
  TabletSmartphone,
  Smartphone,
  Watch,
  Tv,
  Tv2,
  Radio,
  Headphones,
  Speaker,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Mic2,
  Video,
  VideoOff,
  Film,
  Clapperboard,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Pentagon,
  Hexagon,
  Octagon,
  Diamond,
  Gem,
  Crown as CrownIcon,
  Flame,
  Droplet,
  Droplets,
  Waves,
  Anchor,
  Compass,
  Navigation,
  Navigation2,
  Locate,
  LocateFixed,
  LocateOff,
  Map,
  MapPinned,
  MapPinOff,
  Route,
  Signpost,
  SignpostBig,
  Milestone,
  Flag,
  FlagOff,
  FlagTriangleLeft,
  FlagTriangleRight,
  Bookmark as BookmarkIcon,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkCheck,
  BookmarkX,
  Tag,
  Tags,
  Ticket,
  TicketCheck,
  TicketMinus,
  TicketPercent,
  TicketPlus,
  TicketSlash,
  TicketX,
  QrCode,
  Barcode,
  ScanLine,
  ScanFace,
  Fingerprint,
  Eye as EyeIcon,
  EyeClosed,
  Glasses,
  SunMedium,
  Sunrise,
  Sunset,
  MoonStar,
  Stars,
  Sparkle,
  PartyPopper as PartyPopperIcon,
  Confetti,
  Fireworks,
  HeartHandshake,
  Handshake,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MessageSquarePlus,
  MessageSquareDashed,
  MessageSquareText,
  MessageSquareWarning,
  MessageSquareX,
  MessageSquareMore,
  MessageSquareQuote,
  MessageSquareShare,
  MessageSquareCode,
  MessageSquareDiff,
  MessageSquareHeart,
  MessageSquareReply,
  MessageSquareOff,
  MessagesSquare,
  Megaphone,
  Siren,
  BellRing,
  BellOff,
  BellPlus,
  BellMinus,
  BellDot,
  AlarmClock,
  AlarmClockOff,
  AlarmClockCheck,
  AlarmClockMinus,
  AlarmClockPlus,
  Timer,
  TimerOff,
  TimerReset,
  Hourglass,
  History,
  CalendarCheck,
  CalendarCheck2,
  CalendarClock,
  CalendarHeart,
  CalendarMinus,
  CalendarOff,
  CalendarPlus,
  CalendarRange,
  CalendarSearch,
  CalendarX,
  CalendarX2,
  CalendarFold,
  CalendarArrowDown,
  CalendarArrowUp,
  CalendarCog,
  CalendarMinus2,
  CalendarPlus2,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";

// ============================================
// CONSTANTS AND CONFIGURATIONS
// ============================================

const SPRING_CONFIGS = {
  snappy: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  gentle: { type: "spring", stiffness: 120, damping: 20, mass: 1 },
  bouncy: { type: "spring", stiffness: 500, damping: 25, mass: 0.5 },
  smooth: { type: "spring", stiffness: 200, damping: 25, mass: 1 },
  modal: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
  ultraSmooth: { type: "spring", stiffness: 150, damping: 20, mass: 1.2 },
};

const EASE_CONFIGS = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  smoothOut: [0.22, 1, 0.36, 1],
  smoothIn: [0.4, 0, 0.2, 1],
  elastic: [0.68, -0.55, 0.265, 1.55],
};

const MODAL_VARIANTS = {
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  content: {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: SPRING_CONFIGS.modal,
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: { duration: 0.2 },
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: SPRING_CONFIGS.smooth,
    },
    exit: {
      opacity: 0,
      y: "100%",
      transition: { duration: 0.3 },
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: SPRING_CONFIGS.smooth,
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: { duration: 0.3 },
    },
  },
};

const EVENT_THEMES = {
  wedding: {
    name: "Wedding",
    emoji: "💒",
    icon: Heart,
    primary: "#ec4899",
    primaryLight: "#f472b6",
    primaryDark: "#db2777",
    secondary: "#fce7f3",
    gradient: "from-pink-500 to-rose-500",
    gradientLight: "from-pink-50 to-rose-50",
    bgClass: "bg-pink-50",
    textClass: "text-pink-600",
    borderClass: "border-pink-200",
    patterns: ["💐", "💍", "🥂", "💒", "👰", "🤵"],
  },
  birthday: {
    name: "Birthday",
    emoji: "🎂",
    icon: Cake,
    primary: "#a855f7",
    primaryLight: "#c084fc",
    primaryDark: "#9333ea",
    secondary: "#f3e8ff",
    gradient: "from-purple-500 to-pink-500",
    gradientLight: "from-purple-50 to-pink-50",
    bgClass: "bg-purple-50",
    textClass: "text-purple-600",
    borderClass: "border-purple-200",
    patterns: ["🎂", "🎈", "🎉", "🎁", "🎊", "⭐"],
  },
  conference: {
    name: "Conference",
    emoji: "🎤",
    icon: Briefcase,
    primary: "#3b82f6",
    primaryLight: "#60a5fa",
    primaryDark: "#2563eb",
    secondary: "#dbeafe",
    gradient: "from-blue-500 to-indigo-500",
    gradientLight: "from-blue-50 to-indigo-50",
    bgClass: "bg-blue-50",
    textClass: "text-blue-600",
    borderClass: "border-blue-200",
    patterns: ["🎤", "💼", "📊", "🎯", "💡", "🏆"],
  },
  corporate: {
    name: "Corporate",
    emoji: "💼",
    icon: Building,
    primary: "#6366f1",
    primaryLight: "#818cf8",
    primaryDark: "#4f46e5",
    secondary: "#e0e7ff",
    gradient: "from-indigo-500 to-purple-500",
    gradientLight: "from-indigo-50 to-purple-50",
    bgClass: "bg-indigo-50",
    textClass: "text-indigo-600",
    borderClass: "border-indigo-200",
    patterns: ["💼", "🏢", "📈", "🤝", "🎯", "⚡"],
  },
  party: {
    name: "Party",
    emoji: "🎉",
    icon: PartyPopper,
    primary: "#f59e0b",
    primaryLight: "#fbbf24",
    primaryDark: "#d97706",
    secondary: "#fef3c7",
    gradient: "from-amber-500 to-orange-500",
    gradientLight: "from-amber-50 to-orange-50",
    bgClass: "bg-amber-50",
    textClass: "text-amber-600",
    borderClass: "border-amber-200",
    patterns: ["🎉", "🥳", "🎊", "🍾", "🎈", "✨"],
  },
  anniversary: {
    name: "Anniversary",
    emoji: "💝",
    icon: Heart,
    primary: "#ef4444",
    primaryLight: "#f87171",
    primaryDark: "#dc2626",
    secondary: "#fee2e2",
    gradient: "from-red-500 to-pink-500",
    gradientLight: "from-red-50 to-pink-50",
    bgClass: "bg-red-50",
    textClass: "text-red-600",
    borderClass: "border-red-200",
    patterns: ["💝", "🥂", "🌹", "💑", "🎁", "✨"],
  },
  other: {
    name: "Event",
    emoji: "✨",
    icon: Sparkles,
    primary: "#14b8a6",
    primaryLight: "#2dd4bf",
    primaryDark: "#0d9488",
    secondary: "#ccfbf1",
    gradient: "from-teal-500 to-cyan-500",
    gradientLight: "from-teal-50 to-cyan-50",
    bgClass: "bg-teal-50",
    textClass: "text-teal-600",
    borderClass: "border-teal-200",
    patterns: ["✨", "🎊", "🎁", "⭐", "💫", "🌟"],
  },
};

const VENDOR_CATEGORIES = [
  { id: "venues", label: "Venues", icon: Building, color: "#7c3aed" },
  { id: "photographers", label: "Photography", icon: Camera, color: "#db2777" },
  { id: "catering", label: "Catering", icon: Utensils, color: "#ea580c" },
  { id: "makeup", label: "Makeup", icon: Palette, color: "#e11d48" },
  { id: "djs", label: "Music & DJ", icon: Music, color: "#2563eb" },
  { id: "mehendi", label: "Mehendi", icon: Scissors, color: "#65a30d" },
  { id: "decor", label: "Decor", icon: Flower2, color: "#0d9488" },
  { id: "clothes", label: "Attire", icon: Crown, color: "#9333ea" },
  { id: "gifts", label: "Gifts", icon: Gift, color: "#c026d3" },
];

const DEFAULT_EVENT_IMAGES = {
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
  birthday: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
  conference: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  corporate: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
  party: "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=800&h=600&fit=crop",
  anniversary: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=600&fit=crop",
  other: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
};

const ITEMS_PER_PAGE = 12;

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "₹0";
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatPrice = (price) => {
  if (!price || price === 0) return "Contact";
  return formatCurrency(price);
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatShortDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDaysUntil = (dateString) => {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const getUserId = () => {
  if (typeof window === "undefined") return "guest";
  let userId = localStorage.getItem("planwab_user_id");
  if (!userId) {
    userId = `user_${generateId()}`;
    localStorage.setItem("planwab_user_id", userId);
  }
  return userId;
};

// ============================================
// CUSTOM HOOKS
// ============================================

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

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function useToast() {
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ isVisible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return { toast, showToast, hideToast };
}

// Replace the existing useEventsAPI hook with this:

const useEventsAPI = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const fetchEvents = useCallback(async () => {
    // Don't fetch if user is not available
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const userId = user.id;
      console.log("Fetching events for userId:", userId);
      const res = await fetch(`/api/planned-events?userId=${userId}`);
      const data = await res.json();

      if (data.success) {
        setEvents(data.data || []);
      } else {
        setError(data.error || "Failed to fetch events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // Add user.id as dependency

  // Only fetch when user is available
  useEffect(() => {
    if (user?.id) {
      fetchEvents();
    } else {
      setLoading(false); // Stop loading if no user
    }
  }, [user?.id, fetchEvents]); // Depend on user.id

  const createEvent = useCallback(async (eventData) => {
    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const userId = user.id;
      localStorage.setItem("eventPlannerUserId", userId);

      const res = await fetch("/api/planned-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...eventData, userId }),
      });
      const data = await res.json();

      if (data.success) {
        setEvents((prev) => [data.data, ...prev]);
        return { success: true, data: data.data };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error("Error creating event:", err);
      return { success: false, error: "Failed to create event" };
    }
  }, [user?.id]);

  const updateEvent = useCallback(async (eventId, updateData) => {
    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const res = await fetch(`/api/planned-events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();

      if (data.success) {
        setEvents((prev) => prev.map((e) => (e._id === eventId ? data.data : e)));
        return { success: true, data: data.data };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error("Error updating event:", err);
      return { success: false, error: "Failed to update event" };
    }
  }, [user?.id]);

  const patchEvent = useCallback(async (eventId, action, payload) => {
    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const res = await fetch(`/api/planned-events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();

      if (data.success) {
        setEvents((prev) => prev.map((e) => (e._id === eventId ? data.data : e)));
        return { success: true, data: data.data };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error("Error patching event:", err);
      return { success: false, error: "Failed to update event" };
    }
  }, [user?.id]);

  const deleteEvent = useCallback(async (eventId) => {
    if (!user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      const res = await fetch(`/api/planned-events/${eventId}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setEvents((prev) => prev.filter((e) => e._id !== eventId));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error("Error deleting event:", err);
      return { success: false, error: "Failed to delete event" };
    }
  }, [user?.id]);

  return { 
    events, 
    loading, 
    error, 
    fetchEvents, 
    createEvent, 
    updateEvent, 
    patchEvent, 
    deleteEvent,
    isAuthenticated: !!user?.id // Helper to check if user is loaded
  };
};

// Vendors API Hook
const vendorReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_VENDORS":
      return {
        ...state,
        vendors: action.payload.vendors,
        totalPages: action.payload.pagination.totalPages,
        totalVendors: action.payload.pagination.totalVendors,
        cities: action.payload.cities,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// Replace the existing useVendorsAPI hook with this:

const useVendorsAPI = (filters = {}) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVendors, setTotalVendors] = useState(0);
  
  // Stringify filters to use as dependency - prevents infinite loops
  const filtersKey = JSON.stringify(filters);

  const fetchVendors = useCallback(async () => {
    if (!filters || Object.keys(filters).length === 0) {
    setLoading(false);
    return;
  }
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit || 12);
      if (filters.search) params.append("search", filters.search);
      if (filters.categories?.length) params.append("category", filters.categories.join(","));
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

      const res = await fetch(`/api/vendor?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setVendors(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalVendors(data.pagination?.total || data.data?.length || 0);
      } else {
        setError(data.error || "Failed to fetch vendors");
      }
    } catch (err) {
      setError("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return { vendors, loading, error, totalPages, totalVendors, refetch: fetchVendors };
};

// ============================================
// REUSABLE COMPONENTS
// ============================================

const Toast = memo(({ message, type = "success", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const config = {
    success: { icon: CheckCircle, bg: "bg-green-50", border: "border-green-200", text: "text-green-700", iconColor: "text-green-500" },
    error: { icon: XCircle, bg: "bg-red-50", border: "border-red-200", text: "text-red-700", iconColor: "text-red-500" },
    info: { icon: Info, bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", iconColor: "text-blue-500" },
    warning: { icon: AlertCircle, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", iconColor: "text-amber-500" },
  };

  const { icon: Icon, bg, border, text, iconColor } = config[type] || config.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={SPRING_CONFIGS.snappy}
          className={`fixed top-24 left-1/2 -translate-x-1/2 z-[500] px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-3 ${bg} ${border}`}
        >
          <Icon size={22} className={iconColor} />
          <span className={`font-medium ${text}`}>{message}</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="p-1.5 hover:bg-black/5 rounded-full ml-2">
            <X size={16} className="text-gray-500" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Toast.displayName = "Toast";

const LoadingSpinner = memo(({ size = 24, className = "" }) => (
  <motion.div className="flex w-full h-full items-center justify-center">
    <Loader2 size={size} className={`text-gray-400 ${className} animate-spin`} />
  </motion.div>
));

LoadingSpinner.displayName = "LoadingSpinner";

const EmptyState = memo(({ icon: Icon, title, description, action, actionLabel }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
      <Icon size={40} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
    {action && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={action}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg"
      >
        {actionLabel}
      </motion.button>
    )}
  </motion.div>
));

EmptyState.displayName = "EmptyState";

// ============================================
// MODAL COMPONENTS
// ============================================

const ModalOverlay = memo(({ isOpen, onClose, children, title, subtitle, size = "lg", variant = "center" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw]",
  };

  const variantConfig = {
    center: MODAL_VARIANTS.content,
    slideUp: MODAL_VARIANTS.slideUp,
    slideRight: MODAL_VARIANTS.slideRight,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={MODAL_VARIANTS.overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={variantConfig[variant]}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`w-full ${sizeClasses[size]} bg-white rounded-3xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || subtitle) && (
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-gray-50 to-white">
                <div>
                  {title && <h3 className="text-2xl font-bold text-gray-900">{title}</h3>}
                  {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </motion.button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ModalOverlay.displayName = "ModalOverlay";

// Create Event Modal
const CreateEventModal = memo(({ isOpen, onClose, onCreate, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    category: "wedding",
    date: "",
    time: "",
    venue: "",
    guestCount: "",
    budget: "",
    image: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      category: "wedding",
      date: "",
      time: "",
      venue: "",
      guestCount: "",
      budget: "",
      image: "",
      description: "",
    });
    setErrors({});
    setStep(1);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const validateStep = useCallback(() => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Event name is required";
      if (!formData.category) newErrors.category = "Category is required";
    } else if (step === 2) {
      if (!formData.date) newErrors.date = "Date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, formData]);

  const handleNext = useCallback(() => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, 3));
    }
  }, [validateStep]);

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;

    const eventData = {
      ...formData,
      guestCount: parseInt(formData.guestCount) || 0,
      budget: parseFloat(formData.budget) || 0,
      image: formData.image || DEFAULT_EVENT_IMAGES[formData.category],
    };

    const result = await onCreate(eventData);
    if (result?.success) {
      onClose();
    }
  }, [formData, onCreate, onClose, validateStep]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const theme = EVENT_THEMES[formData.category] || EVENT_THEMES.other;

  const stepContent = {
    1: (
      <motion.div
        key="step1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Event Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-5 py-4 bg-gray-50 rounded-2xl text-lg outline-none focus:ring-2 transition-all border ${
              errors.name ? "border-red-300 ring-red-200" : "border-transparent focus:ring-purple-200"
            }`}
            placeholder="e.g., Sarah & John's Wedding"
          />
          {errors.name && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2">
              {errors.name}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Event Type *</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(EVENT_THEMES).map(([key, value]) => (
              <motion.button
                key={key}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData((prev) => ({ ...prev, category: key }))}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  formData.category === key
                    ? `border-transparent bg-gradient-to-r ${value.gradient} text-white shadow-lg`
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-2xl mb-2 block">{value.emoji}</span>
                <span className="font-semibold text-sm">{value.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    ),
    2: (
      <motion.div
        key="step2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Event Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 transition-all border ${
                errors.date ? "border-red-300 ring-red-200" : "border-transparent focus:ring-purple-200"
              }`}
            />
            {errors.date && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2">
                {errors.date}
              </motion.p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Event Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            placeholder="e.g., Grand Plaza Hotel, Mumbai"
          />
        </div>

        {formData.date && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl bg-gradient-to-r ${theme.gradientLight} flex items-center gap-4`}
          >
            <CalendarDays size={28} style={{ color: theme.primary }} />
            <div>
              <p className="font-bold text-gray-900">{formatDate(formData.date)}</p>
              <p className="text-sm text-gray-600">{getDaysUntil(formData.date)} days from now</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    ),
    3: (
      <motion.div
        key="step3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Expected Guests</label>
            <input
              type="number"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleChange}
              min="1"
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 transition-all"
              placeholder="150"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Budget (₹)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 transition-all"
              placeholder="500000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 transition-all resize-none"
            placeholder="Add any additional details about your event..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Cover Image URL (Optional)</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 transition-all"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className={`p-6 rounded-2xl bg-gradient-to-r ${theme.gradientLight}`}>
          <h4 className="font-bold text-gray-900 mb-4">Event Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <p className="font-semibold text-gray-900">{formData.name || "-"}</p>
            </div>
            <div>
              <span className="text-gray-500">Type:</span>
              <p className="font-semibold text-gray-900">{theme.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>
              <p className="font-semibold text-gray-900">{formData.date ? formatShortDate(formData.date) : "-"}</p>
            </div>
            <div>
              <span className="text-gray-500">Venue:</span>
              <p className="font-semibold text-gray-900">{formData.venue || "-"}</p>
            </div>
            <div>
              <span className="text-gray-500">Guests:</span>
              <p className="font-semibold text-gray-900">{formData.guestCount || "-"}</p>
            </div>
            <div>
              <span className="text-gray-500">Budget:</span>
              <p className="font-semibold text-gray-900">{formData.budget ? formatCurrency(parseFloat(formData.budget)) : "-"}</p>
            </div>
          </div>
        </div>
      </motion.div>
    ),
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} title="Create New Event" subtitle={`Step ${step} of 3`} size="lg">
      <div className="p-8">
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <motion.div
                className="h-2 rounded-full overflow-hidden bg-gray-200"
                initial={false}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r ${theme.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: step >= s ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <p className={`text-xs mt-2 font-medium ${step >= s ? theme.textClass : "text-gray-400"}`}>
                {s === 1 ? "Basics" : s === 2 ? "Date & Venue" : "Details"}
              </p>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">{stepContent[step]}</AnimatePresence>
      </div>

      <div className="px-8 pb-8 pt-4 flex gap-4 border-t border-gray-100">
        {step > 1 && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            className="flex-1 py-4 rounded-2xl border-2 border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back
          </motion.button>
        )}
        {step < 3 ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className={`flex-1 py-4 rounded-2xl text-white font-bold shadow-lg bg-gradient-to-r ${theme.gradient}`}
          >
            Continue
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 py-4 rounded-2xl text-white font-bold shadow-lg bg-gradient-to-r ${theme.gradient} flex items-center justify-center gap-2 disabled:opacity-70`}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size={20} className="text-white" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Create Event
              </>
            )}
          </motion.button>
        )}
      </div>
    </ModalOverlay>
  );
});

CreateEventModal.displayName = "CreateEventModal";

// Guest List Modal
const GuestListModal = memo(({ isOpen, onClose, event, onUpdate, theme }) => {
  const [guests, setGuests] = useState([]);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (event?.guests) {
      setGuests(event.guests);
    }
  }, [event]);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch =
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone?.includes(searchQuery) ||
        guest.email?.toLowerCase().includes(searchQuery.toLowerCase());
      if (filterStatus === "all") return matchesSearch;
      return matchesSearch && guest.status === filterStatus;
    });
  }, [guests, searchQuery, filterStatus]);

  const stats = useMemo(() => {
    const confirmed = guests.filter((g) => g.status === "confirmed").length;
    const declined = guests.filter((g) => g.status === "declined").length;
    const pending = guests.filter((g) => g.status === "pending").length;
    return { total: guests.length, confirmed, declined, pending };
  }, [guests]);

  const addGuest = useCallback(async () => {
    if (!newGuestName.trim()) {
      showToast("Please enter guest name", "error");
      return;
    }

    setIsAdding(true);
    const newGuest = {
      id: generateId(),
      name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
      email: newGuestEmail.trim(),
      status: "pending",
      addedAt: new Date().toISOString(),
    };

    const result = await onUpdate(event._id, "addGuest", newGuest);
    setIsAdding(false);

    if (result?.success) {
      setGuests(result.data.guests);
      setNewGuestName("");
      setNewGuestPhone("");
      setNewGuestEmail("");
      showToast("Guest added successfully!", "success");
    } else {
      showToast("Failed to add guest", "error");
    }
  }, [newGuestName, newGuestPhone, newGuestEmail, event?._id, onUpdate, showToast]);

  const updateGuestStatus = useCallback(
    async (guestId, status) => {
      const guest = guests.find((g) => g.id === guestId);
      if (!guest) return;

      const updatedGuest = { ...guest, status };
      const result = await onUpdate(event._id, "updateGuest", updatedGuest);

      if (result?.success) {
        setGuests(result.data.guests);
        showToast(`Guest marked as ${status}`, "success");
      }
    },
    [guests, event?._id, onUpdate, showToast]
  );

  const deleteGuest = useCallback(
    async (guestId) => {
      const result = await onUpdate(event._id, "removeGuest", { id: guestId });
      if (result?.success) {
        setGuests(result.data.guests);
        showToast("Guest removed", "info");
      }
    },
    [event?._id, onUpdate, showToast]
  );

  const statusConfig = {
    confirmed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Confirmed" },
    declined: { bg: "bg-red-100", text: "text-red-700", icon: XCircle, label: "Declined" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock, label: "Pending" },
  };

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay isOpen={isOpen} onClose={onClose} title="Guest List" subtitle={`${stats.total} guests total`} size="lg">
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Confirmed", count: stats.confirmed, color: "green" },
              { label: "Pending", count: stats.pending, color: "amber" },
              { label: "Declined", count: stats.declined, color: "red" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.02 }}
                className={`p-5 bg-${stat.color}-50 rounded-2xl text-center border border-${stat.color}-100`}
              >
                <p className={`text-3xl font-black text-${stat.color}-700`}>{stat.count}</p>
                <p className={`text-sm font-medium text-${stat.color}-600`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search guests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3.5 bg-gray-50 rounded-xl text-sm outline-none font-medium cursor-pointer"
            >
              <option value="all">All ({stats.total})</option>
              <option value="confirmed">Confirmed ({stats.confirmed})</option>
              <option value="pending">Pending ({stats.pending})</option>
              <option value="declined">Declined ({stats.declined})</option>
            </select>
          </div>

          {/* Add Guest Form */}
          <motion.div layout className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus size={18} style={{ color: theme.primary }} />
              Add New Guest
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Guest Name *"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                className="w-full px-4 py-3.5 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  className="px-4 py-3.5 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newGuestEmail}
                  onChange={(e) => setNewGuestEmail(e.target.value)}
                  className="px-4 py-3.5 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={addGuest}
                disabled={isAdding}
                className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                style={{ backgroundColor: theme.primary }}
              >
                {isAdding ? <LoadingSpinner size={18} className="text-white" /> : <Plus size={18} />}
                {isAdding ? "Adding..." : "Add Guest"}
              </motion.button>
            </div>
          </motion.div>

          {/* Guest List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            <AnimatePresence mode="popLayout">
              {filteredGuests.length === 0 ? (
                <EmptyState icon={Users} title="No guests found" description="Add guests to your event or adjust your search filters" />
              ) : (
                filteredGuests.map((guest, idx) => {
                  const status = statusConfig[guest.status] || statusConfig.pending;
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={guest.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: idx * 0.02, ...SPRING_CONFIGS.snappy }}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${theme.primary}15` }}
                      >
                        <span className="text-lg font-bold" style={{ color: theme.primary }}>
                          {guest.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{guest.name}</p>
                        <p className="text-sm text-gray-500 truncate">{guest.phone || guest.email || "No contact info"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${status.bg}`}>
                          <StatusIcon size={14} className={status.text} />
                          <span className={`text-xs font-medium ${status.text}`}>{status.label}</span>
                        </div>
                        <div className="flex">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateGuestStatus(guest.id, "confirmed")}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle size={16} className="text-green-500" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateGuestStatus(guest.id, "declined")}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Decline"
                          >
                            <XCircle size={16} className="text-red-500" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteGuest(guest.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-gray-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
});

GuestListModal.displayName = "GuestListModal";

// Budget Modal
const BudgetModal = memo(({ isOpen, onClose, event, onUpdate, theme }) => {
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryAmount, setNewCategoryAmount] = useState("");
  const [editingTotal, setEditingTotal] = useState(false);
  const [tempTotal, setTempTotal] = useState("");
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (event) {
      setBudgetCategories(event.budgetCategories || []);
      setTotalBudget(event.budget || 0);
    }
  }, [event]);

  const totalSpent = useMemo(() => budgetCategories.reduce((sum, cat) => sum + (cat.spent || 0), 0), [budgetCategories]);
  const totalAllocated = useMemo(() => budgetCategories.reduce((sum, cat) => sum + (cat.allocated || 0), 0), [budgetCategories]);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const updateCategorySpent = useCallback(
    async (categoryName, newSpent) => {
      const spent = parseFloat(newSpent) || 0;
      const result = await onUpdate(event._id, "updateBudgetSpent", { name: categoryName, spent });
      if (result?.success) {
        setBudgetCategories(result.data.budgetCategories);
      }
    },
    [event?._id, onUpdate]
  );

  const updateCategoryAllocated = useCallback(
    async (categoryName, newAllocated) => {
      const allocated = parseFloat(newAllocated) || 0;
      const result = await onUpdate(event._id, "updateBudgetAllocated", { name: categoryName, allocated });
      if (result?.success) {
        setBudgetCategories(result.data.budgetCategories);
      }
    },
    [event?._id, onUpdate]
  );

  const addCategory = useCallback(async () => {
    if (!newCategoryName.trim() || !newCategoryAmount) {
      showToast("Please fill all fields", "error");
      return;
    }

    const colors = ["#7c3aed", "#db2777", "#ea580c", "#0d9488", "#2563eb", "#059669", "#d97706", "#c026d3"];
    const newCat = {
      name: newCategoryName.trim(),
      allocated: parseFloat(newCategoryAmount),
      spent: 0,
      color: colors[budgetCategories.length % colors.length],
    };

    const result = await onUpdate(event._id, "addBudgetCategory", newCat);
    if (result?.success) {
      setBudgetCategories(result.data.budgetCategories);
      setNewCategoryName("");
      setNewCategoryAmount("");
      setIsAddingCategory(false);
      showToast("Category added!", "success");
    }
  }, [newCategoryName, newCategoryAmount, event?._id, onUpdate, budgetCategories.length, showToast]);

  const deleteCategory = useCallback(
    async (categoryName) => {
      const result = await onUpdate(event._id, "removeBudgetCategory", { name: categoryName });
      if (result?.success) {
        setBudgetCategories(result.data.budgetCategories);
        showToast("Category removed", "info");
      }
    },
    [event?._id, onUpdate, showToast]
  );

  const updateTotalBudget = useCallback(async () => {
    const newTotal = parseFloat(tempTotal) || totalBudget;
    const result = await onUpdate(event._id, "budget", newTotal);
    if (result?.success) {
      setTotalBudget(newTotal);
      setEditingTotal(false);
      showToast("Budget updated!", "success");
    }
  }, [tempTotal, totalBudget, event?._id, onUpdate, showToast]);

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay isOpen={isOpen} onClose={onClose} title="Budget Planner" subtitle="Track your expenses" size="lg">
        <div className="p-8">
          {/* Total Budget Header */}
          <motion.div layout className="mb-8 p-6 rounded-2xl" style={{ backgroundColor: `${theme.primary}08` }}>
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-gray-600">Total Budget</span>
              {editingTotal ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      value={tempTotal}
                      onChange={(e) => setTempTotal(e.target.value)}
                      placeholder={totalBudget.toString()}
                      className="w-48 pl-8 pr-4 py-3 text-right text-xl font-bold bg-white rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200"
                      autoFocus
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={updateTotalBudget}
                    className="p-3 bg-green-500 text-white rounded-xl"
                  >
                    <Check size={18} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingTotal(false)}
                    className="p-3 bg-gray-200 rounded-xl"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black" style={{ color: theme.primary }}>
                    {formatCurrency(totalBudget)}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setTempTotal(totalBudget.toString());
                      setEditingTotal(true);
                    }}
                    className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Edit3 size={16} className="text-gray-500" />
                  </motion.button>
                </div>
              )}
            </div>

            <div className="h-4 bg-white rounded-full overflow-hidden mb-4 shadow-inner">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: remaining < 0 ? "#dc2626" : theme.primary }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
                transition={{ duration: 0.8, ease: EASE_CONFIGS.smoothOut }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <span className="text-gray-500">Spent: </span>
                <span className={`font-bold ${remaining < 0 ? "text-red-600" : "text-gray-900"}`}>{formatCurrency(totalSpent)}</span>
              </div>
              <div>
                <span className="text-gray-500">Remaining: </span>
                <span className={`font-bold ${remaining < 0 ? "text-red-600" : "text-green-600"}`}>
                  {remaining < 0 ? "-" : ""}
                  {formatCurrency(Math.abs(remaining))}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Budget Categories */}
          <div className="grid grid-cols-2 gap-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
            <AnimatePresence mode="popLayout">
              {budgetCategories.map((cat, idx) => {
                const catPercent = cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0;
                const isOver = cat.spent > cat.allocated;

                return (
                  <motion.div
                    key={`${cat.name}-${idx}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.03, ...SPRING_CONFIGS.snappy }}
                    className="p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-bold text-gray-900">{cat.name}</span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteCategory(cat.name)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                      </motion.button>
                    </div>

                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: isOver ? "#dc2626" : cat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(catPercent, 100)}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16 shrink-0">Spent:</span>
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                          <input
                            type="number"
                            value={cat.spent || ""}
                            onChange={(e) => updateCategorySpent(cat.name, e.target.value)}
                            placeholder="0"
                            className="w-full pl-7 pr-3 py-2 text-sm font-medium bg-gray-50 rounded-lg outline-none focus:ring-2"
                            style={{ "--tw-ring-color": cat.color }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16 shrink-0">Budget:</span>
                        <div className="flex-1 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                          <input
                            type="number"
                            value={cat.allocated || ""}
                            onChange={(e) => updateCategoryAllocated(cat.name, e.target.value)}
                            placeholder="0"
                            className="w-full pl-7 pr-3 py-2 text-sm font-medium bg-gray-50 rounded-lg outline-none focus:ring-2"
                            style={{ "--tw-ring-color": cat.color }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Add Category */}
          <AnimatePresence mode="wait">
            {isAddingCategory ? (
              <motion.div
                key="add-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 bg-gray-50 rounded-2xl"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="px-4 py-3.5 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
                    autoFocus
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      placeholder="Allocated Amount"
                      value={newCategoryAmount}
                      onChange={(e) => setNewCategoryAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3.5 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={addCategory}
                    className="flex-1 py-3.5 rounded-xl text-white font-semibold"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Add Category
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName("");
                      setNewCategoryAmount("");
                    }}
                    className="px-6 py-3.5 rounded-xl bg-gray-200 font-semibold text-gray-600"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="add-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddingCategory(true)}
                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium flex items-center justify-center gap-2 hover:border-gray-300 hover:text-gray-500 transition-colors"
              >
                <Plus size={18} /> Add Budget Category
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </ModalOverlay>
    </>
  );
});

BudgetModal.displayName = "BudgetModal";

// Checklist Modal
const ChecklistModal = memo(({ isOpen, onClose, event, onUpdate, theme }) => {
  const [checklist, setChecklist] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (event?.checklist) {
      setChecklist(event.checklist);
    }
  }, [event]);

  const filteredChecklist = useMemo(() => {
    return checklist.filter((task) => {
      if (!showCompleted && task.completed) return false;
      if (filterPriority === "all") return true;
      return task.priority === filterPriority;
    });
  }, [checklist, filterPriority, showCompleted]);

  const stats = useMemo(() => {
    const completed = checklist.filter((t) => t.completed).length;
    const total = checklist.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, progress };
  }, [checklist]);

  const toggleTask = useCallback(
    async (taskId) => {
      const result = await onUpdate(event._id, "toggleChecklistItem", { id: taskId });
      if (result?.success) {
        setChecklist(result.data.checklist);
      }
    },
    [event?._id, onUpdate]
  );

  const addTask = useCallback(async () => {
    if (!newTask.trim()) {
      showToast("Please enter a task", "error");
      return;
    }

    const newItem = {
      id: generateId(),
      text: newTask.trim(),
      completed: false,
      priority: newTaskPriority,
      category: "custom",
      addedAt: new Date().toISOString(),
    };

    const result = await onUpdate(event._id, "addChecklistItem", newItem);
    if (result?.success) {
      setChecklist(result.data.checklist);
      setNewTask("");
      setIsAddingTask(false);
      showToast("Task added!", "success");
    }
  }, [newTask, newTaskPriority, event?._id, onUpdate, showToast]);

  const deleteTask = useCallback(
    async (taskId) => {
      const result = await onUpdate(event._id, "removeChecklistItem", { id: taskId });
      if (result?.success) {
        setChecklist(result.data.checklist);
        showToast("Task removed", "info");
      }
    },
    [event?._id, onUpdate, showToast]
  );

  const saveEdit = useCallback(async () => {
    if (!editingText.trim()) return;
    const task = checklist.find((t) => t.id === editingTaskId);
    if (!task) return;

    const updatedTask = { ...task, text: editingText.trim() };
    const result = await onUpdate(event._id, "updateChecklistItem", updatedTask);
    if (result?.success) {
      setChecklist(result.data.checklist);
      setEditingTaskId(null);
      setEditingText("");
      showToast("Task updated!", "success");
    }
  }, [editingText, editingTaskId, checklist, event?._id, onUpdate, showToast]);

  const priorityColors = {
    high: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
    medium: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    low: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  };

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay isOpen={isOpen} onClose={onClose} title="Planning Checklist" subtitle={`${stats.completed}/${stats.total} completed`} size="lg">
        <div className="p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-lg font-black" style={{ color: theme.primary }}>
                {Math.round(stats.progress)}%
              </span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: theme.primary }}
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress}%` }}
                transition={{ duration: 0.8, ease: EASE_CONFIGS.smoothOut }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterPriority("all")}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                filterPriority === "all" ? "text-white shadow-lg" : "bg-gray-100 text-gray-600"
              }`}
              style={filterPriority === "all" ? { backgroundColor: theme.primary } : {}}
            >
              All ({stats.total})
            </motion.button>
            {["high", "medium", "low"].map((priority) => {
              const count = checklist.filter((t) => t.priority === priority).length;
              return (
                <motion.button
                  key={priority}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterPriority(priority)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                    filterPriority === priority ? priorityColors[priority].bg + " " + priorityColors[priority].text : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {priority} ({count})
                </motion.button>
              );
            })}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCompleted(!showCompleted)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                showCompleted ? "bg-gray-100 text-gray-600" : "bg-gray-800 text-white"
              }`}
            >
              {showCompleted ? <Eye size={14} /> : <EyeOff size={14} />}
              {showCompleted ? "Hide Done" : "Show Done"}
            </motion.button>
          </div>

          {/* Task List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 mb-6">
            <AnimatePresence mode="popLayout">
              {filteredChecklist.length === 0 ? (
                <EmptyState icon={ClipboardList} title="No tasks found" description="Add tasks to stay organized" />
              ) : (
                filteredChecklist.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50, height: 0 }}
                    transition={{ delay: idx * 0.02, ...SPRING_CONFIGS.snappy }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      task.completed ? "bg-gray-50" : "bg-white border border-gray-100 hover:shadow-md"
                    }`}
                  >
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => toggleTask(task.id)}
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                        task.completed ? "border-transparent" : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={task.completed ? { backgroundColor: theme.primary } : {}}
                    >
                      <AnimatePresence>
                        {task.completed && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={SPRING_CONFIGS.bouncy}>
                            <Check size={14} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <div className="flex-1 min-w-0">
                      {editingTaskId === task.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                            className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-purple-200"
                            autoFocus
                          />
                          <motion.button whileTap={{ scale: 0.9 }} onClick={saveEdit} className="p-2 text-green-600 bg-green-50 rounded-lg">
                            <Check size={16} />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingTaskId(null);
                              setEditingText("");
                            }}
                            className="p-2 text-gray-400 bg-gray-100 rounded-lg"
                          >
                            <X size={16} />
                          </motion.button>
                        </div>
                      ) : (
                        <>
                          <p className={`text-sm font-medium transition-colors ${task.completed ? "text-gray-400 line-through" : "text-gray-900"}`}>
                            {task.text}
                          </p>
                          {task.dueIn && !task.completed && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <Clock size={10} /> Due in {task.dueIn}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {!editingTaskId && (
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${priorityColors[task.priority]?.dot || "bg-gray-400"}`} />
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setEditingText(task.text);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 size={14} />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Add Task */}
          <AnimatePresence mode="wait">
            {isAddingTask ? (
              <motion.div
                key="add-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 bg-gray-50 rounded-2xl"
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Task description..."
                    maxLength={100}
                    className="w-full px-4 py-3.5 bg-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                    autoFocus
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {["high", "medium", "low"].map((priority) => (
                      <motion.button
                        key={priority}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNewTaskPriority(priority)}
                        className={`py-3 rounded-xl text-sm font-semibold capitalize transition-all ${
                          newTaskPriority === priority
                            ? priorityColors[priority].bg + " " + priorityColors[priority].text
                            : "bg-white text-gray-500 border border-gray-200"
                        }`}
                      >
                        {priority}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={addTask}
                      className="flex-1 py-3.5 rounded-xl text-white font-semibold"
                      style={{ backgroundColor: theme.primary }}
                    >
                      Add Task
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsAddingTask(false);
                        setNewTask("");
                      }}
                      className="px-6 py-3.5 rounded-xl bg-gray-200 font-semibold text-gray-600"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="add-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddingTask(true)}
                                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium flex items-center justify-center gap-2 hover:border-gray-300 hover:text-gray-500 transition-colors"
              >
                <Plus size={18} /> Add Task
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </ModalOverlay>
    </>
  );
});

ChecklistModal.displayName = "ChecklistModal";

// Vendor Browser Modal
const VendorBrowserModal = memo(({ isOpen, onClose, event, onUpdate, theme }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { toast, showToast, hideToast } = useToast();
  
  // Debounce search to prevent rapid API calls
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Only create filters when modal is open
  const vendorFilters = useMemo(() => {
    if (!isOpen) return null;
    return {
      page: currentPage,
      search: debouncedSearch,
      categories: selectedCategory ? [selectedCategory] : [],
      sortBy,
      sortOrder,
    };
  }, [isOpen, currentPage, debouncedSearch, selectedCategory, sortBy, sortOrder]);

  const { vendors, loading, error, totalPages, totalVendors } = useVendorsAPI(
    vendorFilters || { page: 1 } // Pass minimal object when closed
  );

  useEffect(() => {
    if (event?.savedVendors) {
      setFavorites(event.savedVendors);
    }
  }, [event]);

  const toggleFavorite = useCallback(
    async (vendorId, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const isFavorite = favorites.includes(vendorId);
      const action = isFavorite ? "unsaveVendor" : "saveVendor";

      const result = await onUpdate(event._id, action, { vendorId });
      if (result?.success) {
        setFavorites(result.data.savedVendors);
        showToast(isFavorite ? "Removed from favorites" : "Added to favorites!", isFavorite ? "info" : "success");
      }
    },
    [favorites, event?._id, onUpdate, showToast]
  );

  const handleBookVendor = useCallback(
    async (vendor) => {
      const bookingData = {
        vendorId: vendor._id,
        vendorName: vendor.businessName || vendor.name,
        category: vendor.category,
        price: vendor.price || 0,
        status: "pending",
        bookedDate: new Date().toISOString(),
      };

      const result = await onUpdate(event._id, "bookVendor", bookingData);
      if (result?.success) {
        showToast(`Booking request sent to ${vendor.businessName || vendor.name}!`, "success");
        setSelectedVendor(null);
      }
    },
    [event?._id, onUpdate, showToast]
  );

  const handleContactVendor = useCallback(
    (vendor) => {
      showToast(`Opening contact for ${vendor.businessName || vendor.name}...`, "info");
      // In a real app, this would open a contact modal or redirect
    },
    [showToast]
  );

  const VendorCard = useCallback(
    ({ vendor, index }) => {
      const isFavorite = favorites.includes(vendor._id);
      const vendorImage = vendor.images?.[0] || vendor.profileImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400";

      return (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ delay: index * 0.03, ...SPRING_CONFIGS.snappy }}
          onClick={() => setSelectedVendor(vendor)}
          className={`bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 ${
            viewMode === "list" ? "flex" : ""
          }`}
        >
          <div className={`relative ${viewMode === "list" ? "w-48 h-36 shrink-0" : "h-44"}`}>
            <img src={vendorImage} alt={vendor.businessName || vendor.name} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => toggleFavorite(vendor._id, e)}
              className="absolute top-3 right-3 p-2.5 bg-white/95 rounded-full shadow-lg"
            >
              <Heart size={16} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-500"} />
            </motion.button>
            {vendor.isVerified && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <BadgeCheck size={12} /> Verified
              </div>
            )}
          </div>
          <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
            <h4 className="font-bold text-gray-900 truncate mb-1">{vendor.businessName || vendor.name}</h4>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-gray-700">{vendor.rating?.toFixed(1) || "N/A"}</span>
              </div>
              <span className="text-xs text-gray-400">({vendor.reviewCount || 0} reviews)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold" style={{ color: theme.primary }}>
                {formatPrice(vendor.price || vendor.startingPrice)}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin size={12} />
                {vendor.address?.city || "India"}
              </span>
            </div>
          </div>
        </motion.div>
      );
    },
    [favorites, viewMode, theme.primary, toggleFavorite]
  );

  const VendorDetail = useCallback(
    ({ vendor }) => {
      const vendorImage = vendor.images?.[0] || vendor.profileImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600";
      const isFavorite = favorites.includes(vendor._id);

      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
          <div className="relative h-72 rounded-3xl overflow-hidden mb-6">
            <img src={vendorImage} alt={vendor.businessName || vendor.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => toggleFavorite(vendor._id, e)}
                className="p-3 bg-white/95 rounded-full shadow-lg"
              >
                <Heart size={20} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-600"} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} className="p-3 bg-white/95 rounded-full shadow-lg">
                <Share2 size={20} className="text-gray-600" />
              </motion.button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-2">
                {vendor.isVerified && (
                  <span className="px-3 py-1.5 bg-blue-500 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                    <BadgeCheck size={14} /> Verified
                  </span>
                )}
                {vendor.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/90 text-sm font-semibold rounded-full text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">{vendor.businessName || vendor.name}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Star size={18} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-800">{vendor.rating?.toFixed(1) || "N/A"}</span>
                    <span className="text-sm text-gray-500">({vendor.reviewCount || 0} reviews)</span>
                  </div>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500 capitalize">{vendor.category}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black" style={{ color: theme.primary }}>
                  {formatPrice(vendor.price || vendor.startingPrice)}
                </p>
                <p className="text-sm text-gray-500">starting price</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <MapPin size={18} className="shrink-0" />
              <span>{vendor.address?.fullAddress || `${vendor.address?.city || "India"}`}</span>
            </div>

            {vendor.description && (
              <div className="p-5 bg-gray-50 rounded-2xl">
                <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                <p className="text-gray-600 leading-relaxed">{vendor.description}</p>
              </div>
            )}

            {vendor.services && vendor.services.length > 0 && (
              <div className="p-5 bg-gray-50 rounded-2xl">
                <h4 className="font-semibold text-gray-900 mb-3">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((service, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white rounded-lg text-sm text-gray-700 border border-gray-200">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleContactVendor(vendor)}
                className="py-4 rounded-2xl border-2 font-bold flex items-center justify-center gap-2"
                style={{ borderColor: theme.primary, color: theme.primary }}
              >
                <Phone size={20} />
                Contact
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBookVendor(vendor)}
                className="py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg"
                style={{ backgroundColor: theme.primary }}
              >
                <Calendar size={20} />
                Book Now
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedVendor(null)}
              className="w-full py-3.5 text-gray-500 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <ChevronLeft size={18} />
              Back to vendors
            </motion.button>
          </div>
        </motion.div>
      );
    },
    [favorites, theme.primary, toggleFavorite, handleContactVendor, handleBookVendor]
  );

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay
        isOpen={isOpen}
        onClose={() => {
          setSelectedVendor(null);
          setSelectedCategory(null);
          setSearchQuery("");
          onClose();
        }}
        title={selectedVendor ? selectedVendor.businessName || selectedVendor.name : "Browse Vendors"}
        subtitle={selectedVendor ? selectedVendor.category : `${totalVendors} vendors available`}
        size="xl"
      >
        <AnimatePresence mode="wait">
          {selectedVendor ? (
            <VendorDetail key="detail" vendor={selectedVendor} />
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8">
              {/* Search */}
              <div className="relative mb-6">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendors by name or location..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    !selectedCategory ? "text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={!selectedCategory ? { backgroundColor: theme.primary } : {}}
                >
                  All Categories
                </motion.button>
                {VENDOR_CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                      selectedCategory === cat.id ? "text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
                  >
                    <cat.icon size={16} />
                    {cat.label}
                  </motion.button>
                ))}
              </div>

              {/* Sort & View Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-gray-100 rounded-xl outline-none font-medium cursor-pointer"
                  >
                    <option value="rating">Top Rated</option>
                    <option value="price">Price</option>
                    <option value="reviewCount">Most Reviews</option>
                    <option value="createdAt">Newest</option>
                  </select>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
                    className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    {sortOrder === "desc" ? <SortDesc size={18} /> : <SortAsc size={18} />}
                  </motion.button>
                </div>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                  >
                    <Grid3X3 size={18} className={viewMode === "grid" ? "text-gray-900" : "text-gray-400"} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                  >
                    <List size={18} className={viewMode === "list" ? "text-gray-900" : "text-gray-400"} />
                  </motion.button>
                </div>
              </div>

              {/* Vendor Grid/List */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <LoadingSpinner size={40} />
                    <p className="text-gray-500 mt-4">Loading vendors...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
                  <p className="text-red-600 font-medium">{error}</p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(1)}
                    className="mt-4 px-6 py-3 bg-gray-100 rounded-xl font-medium"
                  >
                    Try Again
                  </motion.button>
                </div>
              ) : vendors.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No vendors found"
                  description="Try adjusting your search or filters to find vendors"
                  action={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  actionLabel="Clear Filters"
                />
              ) : (
                <>
                  <div className={`${viewMode === "grid" ? "grid grid-cols-3 gap-5" : "space-y-4"} max-h-[500px] overflow-y-auto pr-2`}>
                    <AnimatePresence mode="popLayout">
                      {vendors.map((vendor, idx) => (
                        <VendorCard key={vendor._id} vendor={vendor} index={idx} />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-100">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-100 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </motion.button>
                      <span className="px-4 py-2 text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-100 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </motion.button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ModalOverlay>
    </>
  );
});

VendorBrowserModal.displayName = "VendorBrowserModal";

// Contact/Support Modal
const ContactModal = memo(({ isOpen, onClose, theme, contactType = "chat" }) => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello! 👋 How can I help you with your event planning today?", time: "Just now" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(() => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponses = [
        "That's a great question! Let me help you with that. 🎯",
        "I understand completely. Here's what I recommend for your event... ✨",
        "Perfect! Our team will get back to you shortly with more details. 📧",
        "Thanks for reaching out! We have some excellent options for you. 💫",
        "I'd be happy to help! Let me connect you with the right resources. 🤝",
      ];
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
  }, [message]);

  const submitContactForm = useCallback(() => {
    if (!name.trim() || !email.trim()) {
      showToast("Please fill in required fields", "error");
      return;
    }

    showToast("Message sent successfully! We'll contact you soon.", "success");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");

    setTimeout(onClose, 2000);
  }, [name, email, showToast, onClose]);

  const scheduleCall = useCallback(() => {
    if (!name.trim() || !phone.trim()) {
      showToast("Please fill in your name and phone number", "error");
      return;
    }
    showToast("Call scheduled! You'll receive a confirmation shortly.", "success");
    setTimeout(onClose, 2000);
  }, [name, phone, showToast, onClose]);

  const renderChat = () => (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={SPRING_CONFIGS.snappy}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-5 py-3.5 rounded-2xl ${
                  msg.sender === "user" ? "rounded-br-md text-white" : "rounded-bl-md bg-gray-100 text-gray-800"
                }`}
                style={msg.sender === "user" ? { backgroundColor: theme.primary } : {}}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-2 ${msg.sender === "user" ? "text-white/70" : "text-gray-400"}`}>{msg.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-gray-100 px-5 py-3.5 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-gray-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-5 py-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            className="p-4 rounded-2xl text-white shadow-lg"
            style={{ backgroundColor: theme.primary }}
          >
            <Send size={22} />
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderCallScheduler = () => (
    <div className="p-8 space-y-6">
      <div className="text-center p-8 rounded-3xl" style={{ backgroundColor: `${theme.primary}08` }}>
        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.primary}15` }}>
          <Phone size={36} style={{ color: theme.primary }} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Consultation Call</h3>
        <p className="text-gray-500">Speak with our event planning experts and get personalized advice</p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
        />
        <input
          type="tel"
          placeholder="Phone Number *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
        />
        <select className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none font-medium border border-gray-200 cursor-pointer">
          <option value="">Select preferred time</option>
          <option value="morning">Morning (9 AM - 12 PM)</option>
          <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
          <option value="evening">Evening (5 PM - 8 PM)</option>
        </select>
        <textarea
          placeholder="Tell us about your event (optional)..."
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 resize-none border border-gray-200"
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={scheduleCall}
        className="w-full py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-xl"
        style={{ backgroundColor: theme.primary }}
      >
        <Phone size={20} />
        Schedule Call
      </motion.button>

      <p className="text-center text-sm text-gray-400">We'll call you at your preferred time slot</p>
    </div>
  );

  const renderQuoteForm = () => (
    <div className="p-8 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
        />
      </div>
      <input
        type="email"
        placeholder="Email Address *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
      />
      <select className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none font-medium border border-gray-200 cursor-pointer">
        <option value="">Select Event Type</option>
        <option value="wedding">Wedding</option>
        <option value="corporate">Corporate Event</option>
        <option value="birthday">Birthday Party</option>
        <option value="conference">Conference</option>
        <option value="other">Other</option>
      </select>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          className="px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
        />
        <input
          type="number"
          placeholder="Expected Guests"
          className="px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
        />
      </div>
      <textarea
        placeholder="Event Details & Special Requirements..."
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 resize-none border border-gray-200"
      />
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={submitContactForm}
        className="w-full py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-xl"
        style={{ backgroundColor: theme.primary }}
      >
        <Mail size={20} />
        Get Custom Quote
      </motion.button>
    </div>
  );

  const contentMap = {
    chat: renderChat,
    call: renderCallScheduler,
    quote: renderQuoteForm,
  };

  const titleMap = {
    chat: "Chat Support",
    call: "Schedule a Call",
    quote: "Get a Quote",
  };

  const subtitleMap = {
    chat: "We're here to help you 24/7",
    call: "Book a free consultation",
    quote: "Get personalized pricing for your event",
  };

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay isOpen={isOpen} onClose={onClose} title={titleMap[contactType]} subtitle={subtitleMap[contactType]} size="md">
        {contentMap[contactType]?.()}
      </ModalOverlay>
    </>
  );
});

ContactModal.displayName = "ContactModal";

// Share Event Modal
const ShareEventModal = memo(({ isOpen, onClose, event, theme }) => {
  const { toast, showToast, hideToast } = useToast();
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/shared-event/${event?.shareCode}` : "";

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    showToast("Link copied to clipboard!", "success");
  }, [shareUrl, showToast]);

  const shareOptions = [
    { name: "WhatsApp", icon: "📱", color: "#25D366", action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my event: ${event?.name}\n${shareUrl}`)}`, "_blank") },
    { name: "Email", icon: "📧", color: "#EA4335", action: () => window.open(`mailto:?subject=${encodeURIComponent(event?.name)}&body=${encodeURIComponent(`Check out my event:\n${shareUrl}`)}`, "_blank") },
    { name: "Twitter", icon: "🐦", color: "#1DA1F2", action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my event: ${event?.name}`)}&url=${encodeURIComponent(shareUrl)}`, "_blank") },
    { name: "Facebook", icon: "📘", color: "#4267B2", action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank") },
  ];

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay isOpen={isOpen} onClose={onClose} title="Share Event" subtitle="Invite others to view your event" size="sm">
        <div className="p-8 space-y-6">
          <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: `${theme.primary}08` }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${theme.primary}15` }}>
              <Share2 size={28} style={{ color: theme.primary }} />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">{event?.name}</h4>
            <p className="text-sm text-gray-500">{formatShortDate(event?.date)}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3.5 bg-gray-50 rounded-xl text-sm text-gray-600 outline-none border border-gray-200"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className="px-5 py-3.5 rounded-xl text-white font-semibold"
                style={{ backgroundColor: theme.primary }}
              >
                <Copy size={18} />
              </motion.button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">Share via</label>
            <div className="grid grid-cols-4 gap-3">
              {shareOptions.map((option) => (
                <motion.button
                  key={option.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={option.action}
                  className="p-4 rounded-xl flex flex-col items-center gap-2 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-xs font-medium text-gray-600">{option.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
});

ShareEventModal.displayName = "ShareEventModal";

// Edit Event Modal
const EditEventModal = memo(({ isOpen, onClose, event, onUpdate, theme }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    venue: "",
    guestCount: "",
    budget: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || "",
        date: event.date || "",
        time: event.time || "",
        venue: event.venue || "",
        guestCount: event.guestCount?.toString() || "",
        budget: event.budget?.toString() || "",
        description: event.description || "",
      });
    }
  }, [event]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.name.trim() || !formData.date) {
      showToast("Name and date are required", "error");
      return;
    }

    setIsLoading(true);
    const updateData = {
      ...formData,
      guestCount: parseInt(formData.guestCount) || 0,
      budget: parseFloat(formData.budget) || 0,
    };

    const result = await onUpdate(event._id, updateData);
    setIsLoading(false);

    if (result?.success) {
      showToast("Event updated successfully!", "success");
      onClose();
    } else {
      showToast("Failed to update event", "error");
    }
  }, [formData, event?._id, onUpdate, onClose, showToast]);

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ModalOverlay isOpen={isOpen} onClose={onClose} title="Edit Event" subtitle="Update your event details" size="md">
        <div className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Venue</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
              placeholder="e.g., Grand Plaza Hotel"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Guests</label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget (₹)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 border border-gray-200"
                placeholder="500000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-200 resize-none border border-gray-200"
              placeholder="Additional details about your event..."
            />
          </div>
        </div>

        <div className="px-8 pb-8 pt-2 flex gap-4 border-t border-gray-100">
          <motion.button whileTap={{ scale: 0.98 }} onClick={onClose} className="flex-1 py-4 rounded-2xl border-2 border-gray-200 font-bold text-gray-600">
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-4 rounded-2xl text-white font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ backgroundColor: theme.primary }}
          >
            {isLoading ? <LoadingSpinner size={20} className="text-white" /> : <Save size={20} />}
            {isLoading ? "" : "Save Changes"}
          </motion.button>
        </div>
      </ModalOverlay>
    </>
  );
});

EditEventModal.displayName = "EditEventModal";

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function PlanningToolsPageWrapper() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
   const { events, loading, error, isAuthenticated, createEvent, updateEvent, patchEvent, deleteEvent, fetchEvents } = useEventsAPI({user});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isCreating, setIsCreating] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Auto-select first event
  useEffect(() => {
    if (events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    } else if (selectedEvent) {
      // Update selected event if it was updated
      const updated = events.find((e) => e._id === selectedEvent._id);
      if (updated) {
        setSelectedEvent(updated);
      }
    }
  }, [events, selectedEvent]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) || event.venue?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((event) => event.category === filterCategory);
    }

    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "budget") {
      filtered.sort((a, b) => (b.budget || 0) - (a.budget || 0));
    }

    return filtered;
  }, [events, searchQuery, filterCategory, sortBy]);

  // Handlers
  const handleCreateEvent = useCallback(
    async (eventData) => {
      setIsCreating(true);
      const result = await createEvent(eventData);
      setIsCreating(false);

      if (result?.success) {
        setSelectedEvent(result.data);
        setIsCreateModalOpen(false);
        showToast("Event created successfully! 🎉", "success");
        return { success: true };
      } else {
        showToast(result?.error || "Failed to create event", "error");
        return { success: false };
      }
    },
    [createEvent, showToast]
  );

  const handleUpdateEvent = useCallback(
    async (eventId, updatedData) => {
      const result = await updateEvent(eventId, updatedData);
      if (result?.success) {
        setSelectedEvent(result.data);
        return { success: true, data: result.data };
      }
      return { success: false };
    },
    [updateEvent]
  );

  const handlePatchEvent = useCallback(
    async (eventId, action, data) => {
      const result = await patchEvent(eventId, action, data);
      if (result?.success) {
        setSelectedEvent(result.data);
        return { success: true, data: result.data };
      }
      return { success: false };
    },
    [patchEvent]
  );

  const handleDeleteEvent = useCallback(
    async (eventId) => {
      if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

      const result = await deleteEvent(eventId);
      if (result?.success) {
        if (selectedEvent?._id === eventId) {
          const remaining = events.filter((e) => e._id !== eventId);
          setSelectedEvent(remaining.length > 0 ? remaining[0] : null);
        }
        showToast("Event deleted successfully", "info");
      } else {
        showToast("Failed to delete event", "error");
      }
    },
    [deleteEvent, selectedEvent, events, showToast]
  );

  const openModal = useCallback((modalType) => {
    setActiveModal(modalType);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Get theme for selected event
  const theme = selectedEvent ? EVENT_THEMES[selectedEvent.category] || EVENT_THEMES.other : EVENT_THEMES.other;

  // Quick actions config
  const quickActions = useMemo(
    () => [
      { icon: Users, label: "Guest List", desc: "Manage invitations", modal: "guests", color: "#8b5cf6" },
      { icon: Wallet, label: "Budget", desc: "Track expenses", modal: "budget", color: "#10b981" },
      { icon: ClipboardList, label: "Checklist", desc: "Stay organized", modal: "checklist", color: "#f59e0b" },
      { icon: Building, label: "Vendors", desc: "Find services", modal: "vendors", color: "#ec4899" },
      { icon: Share2, label: "Share", desc: "Invite collaborators", modal: "share", color: "#06b6d4" },
      { icon: Edit3, label: "Edit", desc: "Update details", modal: "edit", color: "#6366f1" },
    ],
    []
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast */}
      <Toast {...toast} onClose={hideToast} />

      {/* Modals */}
      <CreateEventModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateEvent} isLoading={isCreating} />

      {selectedEvent && (
        <>
          <GuestListModal isOpen={activeModal === "guests"} onClose={closeModal} event={selectedEvent} onUpdate={handlePatchEvent} theme={theme} />
          <BudgetModal isOpen={activeModal === "budget"} onClose={closeModal} event={selectedEvent} onUpdate={handlePatchEvent} theme={theme} />
          <ChecklistModal isOpen={activeModal === "checklist"} onClose={closeModal} event={selectedEvent} onUpdate={handlePatchEvent} theme={theme} />
          <VendorBrowserModal isOpen={activeModal === "vendors"} onClose={closeModal} event={selectedEvent} onUpdate={handlePatchEvent} theme={theme} />
          <ShareEventModal isOpen={activeModal === "share"} onClose={closeModal} event={selectedEvent} theme={theme} />
          <EditEventModal isOpen={activeModal === "edit"} onClose={closeModal} event={selectedEvent} onUpdate={handleUpdateEvent} theme={theme} />
          <ContactModal isOpen={activeModal?.startsWith("contact")} onClose={closeModal} theme={theme} contactType={activeModal?.split("-")[1] || "chat"} />
        </>
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header Spacing */}
        <div className="h-20" />

        <div className="max-w-[1800px] mx-auto px-6 py-8">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Planning Tools</h1>
              <p className="text-lg text-gray-500">Create and manage all your special events in one place</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
            >
              <Plus size={22} />
              <span className="hidden sm:inline">Create Event</span>
            </motion.button>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar - Event List */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="col-span-12 lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-28">
                {/* Search */}
                <div className="relative mb-5">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-200 transition-all text-sm"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterCategory("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                      filterCategory === "all" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </motion.button>
                  {Object.entries(EVENT_THEMES).slice(0, 5).map(([key, value]) => (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilterCategory(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        filterCategory === key ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      style={filterCategory === key ? { backgroundColor: value.primary } : {}}
                    >
                      <span>{value.emoji}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium mb-5 text-sm cursor-pointer"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="budget">Sort by Budget</option>
                </select>

                {/* Event List */}
                <div className="space-y-3 max-h-[calc(100vh-420px)] overflow-y-auto pr-1 scrollbar-thin">
                  {loading ? (
                    <div className="text-center py-12">
                      <LoadingSpinner size={32} />
                      <p className="text-sm text-gray-500 mt-3">Loading events...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <AlertCircle size={32} className="mx-auto mb-3 text-red-400" />
                      <p className="text-sm text-red-600 mb-4">{error}</p>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchEvents}
                        className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium flex items-center gap-2 mx-auto"
                      >
                        <RefreshCw size={14} /> Retry
                      </motion.button>
                    </div>
                  ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500 mb-4">{searchQuery || filterCategory !== "all" ? "No events found" : "No events yet"}</p>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold"
                      >
                        Create Event
                      </motion.button>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filteredEvents.map((event, idx) => {
                        const eventTheme = EVENT_THEMES[event.category] || EVENT_THEMES.other;
                        const isSelected = selectedEvent?._id === event._id;
                        const daysLeft = getDaysUntil(event.date);

                        return (
                          <motion.div
                            key={event._id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: idx * 0.03, ...SPRING_CONFIGS.smooth }}
                            onClick={() => setSelectedEvent(event)}
                            whileHover={{ x: 4 }}
                            className={`p-4 rounded-2xl cursor-pointer transition-all ${
                              isSelected ? "shadow-lg scale-[1.02]" : "hover:bg-gray-50"
                            }`}
                            style={
                              isSelected
                                ? {
                                    background: `linear-gradient(135deg, ${eventTheme.primary}10, ${eventTheme.primary}05)`,
                                    borderLeft: `4px solid ${eventTheme.primary}`,
                                  }
                                : { borderLeft: "4px solid transparent" }
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
                                style={{ backgroundColor: `${eventTheme.primary}15` }}
                              >
                                {eventTheme.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 truncate text-sm">{event.name}</h4>
                                <p className="text-xs text-gray-500 truncate">{formatShortDate(event.date)}</p>
                              </div>
                              <div className="text-right shrink-0">
                                {daysLeft > 0 ? (
                                  <p className="text-xs font-semibold" style={{ color: eventTheme.primary }}>
                                    {daysLeft}d
                                  </p>
                                ) : daysLeft === 0 ? (
                                  <p className="text-xs font-semibold text-green-600">Today!</p>
                                ) : (
                                  <p className="text-xs font-semibold text-gray-400">Past</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="col-span-12 lg:col-span-8 xl:col-span-9">
              {selectedEvent ? (
                <div className="space-y-6">
                  {/* Event Hero */}
                  <motion.div
                    layout
                    className="relative h-72 md:h-80 rounded-3xl overflow-hidden shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
                    }}
                  >
                    {selectedEvent.image && (
                      <img
                        src={selectedEvent.image}
                        alt={selectedEvent.name}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                      {/* Top Section */}
                      <div className="flex items-start justify-between">
                        <div>
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl mb-4"
                          >
                            <span className="text-lg">{theme.emoji}</span>
                            <span className="text-white font-semibold capitalize">{selectedEvent.category}</span>
                          </motion.div>
                          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{selectedEvent.name}</h2>
                          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              <span className="font-medium">{formatShortDate(selectedEvent.date)}</span>
                            </div>
                            {selectedEvent.time && (
                              <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span className="font-medium">{selectedEvent.time}</span>
                              </div>
                            )}
                            {selectedEvent.venue && (
                              <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span className="font-medium truncate max-w-[200px]">{selectedEvent.venue}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openModal("edit")}
                            className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-colors"
                          >
                            <Edit3 size={18} />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteEvent(selectedEvent._id)}
                            className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {[
                          { label: "Guests", value: selectedEvent.confirmedGuests || selectedEvent.guests?.length || 0, icon: Users },
                          { label: "Budget", value: formatCurrency(selectedEvent.budget || 0), icon: Wallet },
                          {
                            label: "Days Left",
                            value: Math.max(0, getDaysUntil(selectedEvent.date)),
                            icon: Clock,
                          },
                          {
                            label: "Progress",
                            value: `${Math.round(((selectedEvent.tasksCompleted || 0) / Math.max(selectedEvent.totalTasks || 1, 1)) * 100)}%`,
                            icon: TrendingUp,
                          },
                        ].map((stat, idx) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl"
                          >
                            <stat.icon size={18} className="text-white/70 mb-1 md:mb-2" />
                            <p className="text-xs text-white/70 mb-0.5">{stat.label}</p>
                            <p className="text-lg md:text-xl font-black text-white">{stat.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {quickActions.map((action, idx) => (
                      <motion.button
                        key={action.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openModal(action.modal)}
                        className="p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left"
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                          style={{ backgroundColor: `${action.color}15` }}
                        >
                          <action.icon size={22} style={{ color: action.color }} />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mb-0.5">{action.label}</h4>
                        <p className="text-xs text-gray-500">{action.desc}</p>
                      </motion.button>
                    ))}
                  </div>

                  {/* Progress & Stats Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Checklist Progress */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Checklist Progress</h3>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal("checklist")}
                          className="text-sm font-semibold flex items-center gap-1"
                          style={{ color: theme.primary }}
                        >
                          View All <ChevronRight size={16} />
                        </motion.button>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            {selectedEvent.tasksCompleted || 0} of {selectedEvent.totalTasks || 0} tasks completed
                          </span>
                          <span className="text-sm font-bold" style={{ color: theme.primary }}>
                            {Math.round(((selectedEvent.tasksCompleted || 0) / Math.max(selectedEvent.totalTasks || 1, 1)) * 100)}%
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: theme.primary }}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.round(((selectedEvent.tasksCompleted || 0) / Math.max(selectedEvent.totalTasks || 1, 1)) * 100)}%`,
                            }}
                            transition={{ duration: 1, ease: EASE_CONFIGS.smoothOut }}
                          />
                        </div>
                      </div>
                      {selectedEvent.checklist?.slice(0, 3).map((task, idx) => (
                        <div key={task.id || idx} className="flex items-center gap-3 py-2">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center ${
                              task.completed ? "bg-green-500" : "border-2 border-gray-300"
                            }`}
                          >
                            {task.completed && <Check size={12} className="text-white" />}
                          </div>
                          <span className={`text-sm ${task.completed ? "text-gray-400 line-through" : "text-gray-700"}`}>{task.text}</span>
                        </div>
                      ))}
                    </motion.div>

                    {/* Budget Overview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white rounded-2xl p-6 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Budget Overview</h3>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal("budget")}
                          className="text-sm font-semibold flex items-center gap-1"
                          style={{ color: theme.primary }}
                        >
                          Manage <ChevronRight size={16} />
                        </motion.button>
                      </div>
                      <div className="text-center mb-4">
                        <p className="text-3xl font-black" style={{ color: theme.primary }}>
                          {formatCurrency(selectedEvent.budget || 0)}
                        </p>
                        <p className="text-sm text-gray-500">Total Budget</p>
                      </div>
                      <div className="space-y-3">
                        {selectedEvent.budgetCategories?.slice(0, 4).map((cat, idx) => {
                          const percent = cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0;
                          return (
                            <div key={cat.name || idx}>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">{cat.name}</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(cat.spent || 0)}</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(percent, 100)}%` }}
                                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </div>

                  {/* Contact/Support Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                  >
                    <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { icon: MessageCircle, label: "Chat Support", desc: "Get instant help", type: "chat", color: "#8b5cf6" },
                        { icon: Phone, label: "Schedule Call", desc: "Talk to an expert", type: "call", color: "#3b82f6" },
                        { icon: Mail, label: "Get Quote", desc: "Custom pricing", type: "quote", color: "#10b981" },
                      ].map((item) => (
                        <motion.button
                          key={item.type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openModal(`contact-${item.type}`)}
                          className="p-5 border-2 border-gray-100 rounded-2xl hover:border-gray-200 transition-all text-left flex items-center gap-4"
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                            <item.icon size={22} style={{ color: item.color }} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[600px] flex items-center justify-center bg-white rounded-3xl shadow-lg"
                >
                  <div className="text-center p-12">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      <Calendar size={56} className="text-purple-400" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      {events.length === 0 ? "Welcome to Planning Tools!" : "Select an Event"}
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      {events.length === 0
                        ? "Create your first event to start planning your special occasion with our powerful tools."
                        : "Choose an event from the list to view details and manage it"}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl inline-flex items-center gap-2"
                    >
                      <Plus size={22} />
                      Create Your First Event
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}