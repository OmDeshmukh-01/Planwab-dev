"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import ReactDOM from "react-dom/client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, LayoutGroup } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  ChefHat,
  Languages,
  HelpCircle,
  Settings,
  MoreVertical,
  Download,
  Pencil,
  Lock,
  Trash2,
  Loader2,
  EyeOff,
  KeyRound,
  MapPin,
  MoreHorizontal,
  Star,
  Home,
  Layers,
  Heart,
  Film,
  CheckCircle,
  Phone,
  MessageCircle,
  Pause,
  Calendar,
  Mail,
  ExternalLink,
  Instagram,
  Facebook,
  Globe,
  Play,
  Grid3X3,
  LayoutGrid,
  Briefcase,
  Users,
  Shield,
  Camera,
  Crown,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Flag,
  UserMinus,
  Bookmark,
  BookmarkCheck,
  Clock,
  Send,
  Linkedin,
  Twitter,
  Volume2,
  VolumeX,
  Package,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  BadgeCheck,
  ChevronUp,
  ChevronDown,
  Link2,
  QrCode,
  Bell,
  BellOff,
  Info,
  Check,
  AlertCircle,
  Plus,
  Image,
  Video,
  Upload,
  Type,
  Hash,
  AtSign,
  ImageIcon,
  ZoomIn,
  Gift,
  FileText,
  BarChart2,
  Award,
  Building2,
  Paintbrush2,
  UserCircle,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Scissors,
  Music,
  Wind,
  Car,
  Wifi,
  Utensils,
  Zap,
  Tv,
  Projector,
  Armchair,
  DoorOpen,
  Accessibility,
  Baby,
  PawPrint,
  Cigarette,
  GlassWater,
  Coffee,
  Flower2,
  Mic2,
  ThermometerSun,
  Flame,
  Sun,
  Building,
  Leaf,
  HeartIcon,
  IndianRupee,
  BadgeIndianRupee,
  Percent,
  Palette,
  Youtube,
  DollarSign,
  Trophy,
  HandCoins,
  Timer,
  Medal,
  TrendingUp,
  Route,
  Smartphone,
  MapIcon,
  Navigation,
  RotateCcw,
  MessageSquareQuote,
  Store,
  Eye,
  Edit3,
  Edit2Icon,
  ShieldCheck,
  InfoIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import ReviewSection from "../ReviewSection";
import VendorProfileOnboarding from "../VendorProfileCreate";
import DOMPurify from "dompurify";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { QRCodeSVG } from "qrcode.react";

const POST_CONFIGS = {
  1: {
    title: "Work Details",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
  },
  2: {
    title: "All Service Breakdown",
    icon: Package,
    color: "from-purple-500 to-pink-500",
  },
  3: {
    title: "Pricing and Packages",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
  },
  4: {
    title: "Trust & Real Events",
    icon: Shield,
    color: "from-amber-500 to-orange-500",
  },
};
import UpdateProfileDrawer from "../UpdateProfileDrawer";
import SmartMedia from "@/components/mobile/SmartMediaLoader";
import { useNavigationState } from "../../../hooks/useNavigationState";

const SWIPE_THRESHOLD = 60;
const VELOCITY_THRESHOLD = 400;
const TRANSITION_DURATION = 0.4;
const instantSpring = {
  type: "spring",
  stiffness: 400,
  damping: 35,
  mass: 0.5,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const TABS = [
  { id: "posts", label: "Posts", icon: Image },
  { id: "reels", label: "Reels", icon: Play },
  { id: "portfolio", label: "Portfolio", icon: MessageSquareQuote },
  { id: "services", label: "Services", icon: Briefcase },
];

const CATEGORY_CONFIG = {
  venues: { label: "Venues", icon: Building2, color: "blue" },
  photographers: { label: "Photography", icon: Camera, color: "purple" },
  makeup: { label: "Makeup", icon: Paintbrush2, color: "pink" },
  planners: { label: "Planning", icon: UserCircle, color: "indigo" },
  catering: { label: "Catering", icon: UtensilsCrossed, color: "orange" },
  clothes: { label: "Fashion", icon: Shirt, color: "rose" },
  mehendi: { label: "Mehendi", icon: Hand, color: "amber" },
  cakes: { label: "Cakes", icon: CakeSlice, color: "pink" },
  jewellery: { label: "Jewellery", icon: Gem, color: "yellow" },
  invitations: { label: "Invitations", icon: Mail, color: "teal" },
  djs: { label: "DJs", icon: Music, color: "violet" },
  hairstyling: { label: "Hairstyling", icon: Scissors, color: "fuchsia" },
  other: { label: "Services", icon: FileText, color: "gray" },
};

const AMENITY_ICONS = {
  "Air Conditioning": Wind,
  Parking: Car,
  "Sound System": Music,
  "Wi-Fi": Wifi,
  "Catering Service": Utensils,
  Security: Shield,
  "Photography Area": Camera,
  "Bridal Room": Crown,
  "Valet Parking": Car,
  "Generator Backup": Zap,
  "Decoration Service": Gift,
  "DJ Services": Music,
  "Stage Setup": Layers,
  "Green Room": Home,
  "LED Screens": Tv,
  "Live Streaming": Video,
  Projector: Projector,
  "Waiting Lounge": Armchair,
  "Multiple Entry Points": DoorOpen,
  "Wheelchair Accessible": Accessibility,
  "Kids Play Area": Baby,
  "Pet Friendly": PawPrint,
  "Smoking Area": Cigarette,
  "Bar Service": GlassWater,
  "Coffee Station": Coffee,
  "Floral Decoration": Flower2,
  "Dressing Room": Shirt,
  "Kitchen Access": UtensilsCrossed,
  Microphone: Mic2,
  "Climate Control": ThermometerSun,
  Heating: Flame,
  "Outdoor Space": Sun,
  "Indoor Venue": Building,
  CCTV: Shield,
  "Changing Room": Shirt,
  "Open Catering": Utensils,
  "Home Service (Doorstep Delivery)": Home,
  "Studio Consultations:": Building2,
  "Organic Henna Preparation": Leaf,
  "After-Care Support": HeartIcon,
  "Home Services / Doorstep Visits": Home,
  "Organic / Herbal Henna": Leaf,
  "Destination Wedding Travel": MapPin,
  "Training & Workshops": Users,
};

const slideVariants = {
  enter: (direction) => ({
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      y: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
      opacity: { duration: 0.2, ease: "easeOut" },
      scale: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  exit: (direction) => ({
    y: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
    transition: {
      y: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
      opacity: { duration: 0.15, ease: "easeIn" },
      scale: { duration: 0.2, ease: "easeIn" },
    },
  }),
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const collapseVariants = {
  collapsed: { height: 0, opacity: 0, marginTop: 0 },
  expanded: { height: "auto", opacity: 1, marginTop: 8 },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const smoothSpring = { type: "spring", stiffness: 300, damping: 30, mass: 0.8 };
const smoothEase = [0.25, 0.46, 0.45, 0.94];

const modalTransition = { type: "spring", damping: 30, stiffness: 400, mass: 0.8 };
const backdropTransition = { duration: 0.3, ease: smoothEase };

const CATEGORY_GRADIENTS = {
  planners: { from: "#3b82f6", to: "#06b6d4" },
  decor: { from: "#a855f7", to: "#ec4899" },
  djs: { from: "#f59e0b", to: "#ef4444" },
  photographers: { from: "#6366f1", to: "#8b5cf6" },
  venues: { from: "#f59e0b", to: "#eab308" },
  catering: { from: "#fb923c", to: "#f43f5e" },
  cake: { from: "#ec4899", to: "#d946ef" },
  makeup: { from: "#f43f5e", to: "#ec4899" },
  mehendi: { from: "#10b981", to: "#059669" },
};

const MOCK_HIGHLIGHTS = [
  {
    id: 1,
    title: "Events",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=200&h=200&fit=crop",
    count: 12,
    items: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop`,
      caption: `Event highlight ${i + 1}`,
    })),
  },
  {
    id: 2,
    title: "Reviews",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&h=200&fit=crop",
    count: 45,
    items: Array.from({ length: 8 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=800&fit=crop`,
      caption: `Review ${i + 1}`,
    })),
  },
  {
    id: 3,
    title: "Behind",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=200&h=200&fit=crop",
    count: 8,
    items: Array.from({ length: 4 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=800&fit=crop`,
      caption: `Behind the scenes ${i + 1}`,
    })),
  },
  {
    id: 4,
    title: "Awards",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop",
    count: 6,
    items: Array.from({ length: 3 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=800&fit=crop`,
      caption: `Award ${i + 1}`,
    })),
  },
  {
    id: 5,
    title: "Team",
    image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=200&h=200&fit=crop",
    count: 15,
    items: Array.from({ length: 6 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=800&fit=crop`,
      caption: `Team member ${i + 1}`,
    })),
  },
  {
    id: 6,
    title: "Venues",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200&h=200&fit=crop",
    count: 20,
    items: Array.from({ length: 7 }, (_, i) => ({
      id: i,
      image: `https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=800&fit=crop`,
      caption: `Venue ${i + 1}`,
    })),
  },
];

const MOCK_SERVICES = [
  {
    id: 1,
    name: "Wedding Photography",
    price: "₹50,000",
    duration: "Full Day",
    description: "Complete wedding coverage with 500+ edited photos",
    popular: true,
    rating: 4.9,
    bookings: 120,
  },
  {
    id: 2,
    name: "Pre-Wedding Shoot",
    price: "₹25,000",
    duration: "4-5 Hours",
    description: "Creative pre-wedding photoshoot at location of choice",
    popular: true,
    rating: 4.8,
    bookings: 85,
  },
  {
    id: 3,
    name: "Corporate Event",
    price: "₹35,000",
    duration: "Half Day",
    description: "Professional coverage for corporate events",
    popular: false,
    rating: 4.7,
    bookings: 45,
  },
  {
    id: 4,
    name: "Birthday Party",
    price: "₹15,000",
    duration: "3-4 Hours",
    description: "Candid and posed photography for birthday celebrations",
    popular: false,
    rating: 4.9,
    bookings: 200,
  },
  {
    id: 5,
    name: "Product Photography",
    price: "₹5,000",
    duration: "Per Product",
    description: "High-quality product shots for e-commerce",
    popular: true,
    rating: 4.8,
    bookings: 150,
  },
  {
    id: 6,
    name: "Portrait Session",
    price: "₹8,000",
    duration: "2 Hours",
    description: "Professional portrait photography session",
    popular: false,
    rating: 4.9,
    bookings: 95,
  },
];

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    date: "2 weeks ago",
    comment: "Absolutely amazing work! The photos from our wedding are breathtaking.",
    helpful: 24,
    service: "Wedding Photography",
  },
  {
    id: 2,
    name: "Rahul Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    date: "1 month ago",
    comment: "Professional, punctual, and incredibly talented.",
    helpful: 18,
    service: "Corporate Event",
  },
  {
    id: 3,
    name: "Anita Desai",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 4,
    date: "2 months ago",
    comment: "Great experience overall. Beautiful candid shots.",
    helpful: 12,
    service: "Birthday Party",
  },
  {
    id: 4,
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5,
    date: "3 months ago",
    comment: "The pre-wedding shoot was magical!",
    helpful: 31,
    service: "Pre-Wedding Shoot",
  },
];

const AVAILABILITY_SLOTS = [
  { date: "Today", slots: ["10:00 AM", "2:00 PM", "4:00 PM"], fullDate: new Date().toLocaleDateString() },
  {
    date: "Tomorrow",
    slots: ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"],
    fullDate: new Date(Date.now() + 86400000).toLocaleDateString(),
  },
  { date: "Jan 12", slots: ["10:00 AM", "1:00 PM"], fullDate: "01/12/2026" },
  { date: "Jan 13", slots: ["9:00 AM", "12:00 PM", "3:00 PM"], fullDate: "01/13/2026" },
];

const ShimmerEffect = ({ className }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
  </div>
);

const formatPrice = (price) => {
  if (!price) return "N/A";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

const GLOBAL_THUMB_CACHE = new Map();
// Simple queue to process one video at a time (prevents memory spikes)
let isProcessingQueue = false;
const thumbQueue = [];

const processQueue = async () => {
  if (isProcessingQueue || thumbQueue.length === 0) return;
  isProcessingQueue = true;
  const { videoSource, resolve, reject, options } = thumbQueue.shift();

  try {
    const result = await performCapture(videoSource, options);
    resolve(result);
  } catch (err) {
    reject(err);
  } finally {
    isProcessingQueue = false;
    processQueue(); // Process next in line
  }
};

const performCapture = (videoSource, { seekTime, quality, maxWidth, maxHeight, timeout }) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    // CRITICAL: Robust attribute setting
    video.setAttribute("crossOrigin", "anonymous");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.style.display = "none";

    const timeoutId = setTimeout(() => cleanup(new Error("Timeout")), timeout);

    const cleanup = (err) => {
      clearTimeout(timeoutId);
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.remove();
      if (err) reject(err);
    };

    video.onloadedmetadata = () => {
      // Seek to 1 second or 10% of video (whichever is smaller) to avoid black frames
      video.currentTime = Math.min(seekTime, video.duration * 0.1);
    };

    video.onseeked = () => {
      try {
        let w = video.videoWidth;
        let h = video.videoHeight;

        // Proper scaling logic
        const ratio = Math.min(maxWidth / w, maxHeight / h);
        canvas.width = w * ratio;
        canvas.height = h * ratio;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Verify capture isn't a blank frame
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (dataUrl.length < 1000) throw new Error("Blank frame captured");

        cleanup();
        resolve(dataUrl);
      } catch (err) {
        cleanup(err);
      }
    };

    video.onerror = () => cleanup(new Error("Video load error"));
    video.src = videoSource;
    video.load();
  });
};

export const getBulletproofThumbnail = (videoSource, options = {}) => {
  if (GLOBAL_THUMB_CACHE.has(videoSource)) return Promise.resolve(GLOBAL_THUMB_CACHE.get(videoSource));

  return new Promise((resolve, reject) => {
    thumbQueue.push({
      videoSource,
      resolve: (res) => {
        GLOBAL_THUMB_CACHE.set(videoSource, res);
        resolve(res);
      },
      reject,
      options: { seekTime: 1, quality: 0.7, maxWidth: 480, maxHeight: 480, timeout: 15000, ...options },
    });
    processQueue();
  });
};

const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      const openModals = document.querySelectorAll(".fixed.inset-0.z-\\[100\\]");
      if (openModals.length <= 1) {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }
    };
  }, [isLocked]);
};

const FloatingConfirmation = ({ show, icon: Icon, message, type = "success" }) => {
  const bgColors = {
    success: "from-green-500 to-emerald-600",
    error: "from-red-500 to-rose-600",
    info: "from-blue-500 to-indigo-600",
    warning: "from-amber-500 to-orange-600",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200]"
        >
          <div
            className={`flex items-center gap-2 px-5 py-3 bg-gradient-to-r ${bgColors[type]} rounded-full shadow-2xl`}
          >
            <Icon size={20} className="text-white" />
            <span className="text-white font-semibold text-sm">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ThumbsUpAnimation = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0, y: -100 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.5, 1.2],
              rotate: [0, -15, 15, 0],
            }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/50">
              <ThumbsUp size={64} className="text-white fill-white" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0 rounded-full border-4 border-green-400"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 2, 0] }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute inset-0 rounded-full border-2 border-green-300"
            />
          </motion.div>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 8) * 150,
                y: Math.sin((i * Math.PI * 2) / 8) * 150,
              }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
              className="absolute w-4 h-4 rounded-full bg-green-400"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PasswordVerificationModal = ({ isOpen, onClose, onSuccess, vendorId, vendorName }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError("");
      setShake(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (!password.trim()) {
      setError("Please enter your password");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch(`/api/vendor/${vendor?.username}/profile/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        onClose();
        setTimeout(() => onSuccess(), 150);
      } else {
        setError(result.error || "Invalid password");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setPassword("");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Network error. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isVerifying) {
      handleVerify();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="password-verification-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            key="password-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            key="password-modal-content"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden ${shake ? "animate-shake" : ""}`}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <X size={18} />
              </motion.button>

              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
                >
                  <Shield size={32} className="text-white" />
                </motion.div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-1">
                Verify Authorization
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Enter your profile password to upload content
              </p>
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Profile Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <KeyRound size={18} />
                  </div>
                  <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your password"
                    disabled={isVerifying}
                    className={`w-full pl-12 pr-12 py-4 bg-slate-100 dark:bg-slate-800 border-2 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${error ? "border-red-500 focus:border-red-500" : "border-transparent focus:border-blue-500"
                      } ${isVerifying ? "opacity-60 cursor-not-allowed" : ""}`}
                  />
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="password-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 mt-2 text-red-500 text-sm"
                    >
                      <AlertCircle size={14} />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mb-5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                <div className="flex items-start gap-2">
                  <Lock size={14} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    This password was set during profile creation. Only authorized vendors can upload content.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  disabled={isVerifying}
                  className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: isVerifying ? 1 : 0.95 }}
                  onClick={handleVerify}
                  disabled={isVerifying || !password.trim()}
                  className="flex-[2] py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Verify & Continue
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            <div className="h-safe-area-inset-bottom bg-white dark:bg-slate-900" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProfilePictureModal = ({ isOpen, onClose, image, name }) => {
  useBodyScrollLock(isOpen);

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.velocity.y) > 500 || Math.abs(info.offset.y) > 100) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 bg-white/10 backdrop-blur-xl rounded-full"
      >
        <X size={24} className="text-white" />
      </motion.button>
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-72 h-72 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl cursor-grab active:cursor-grabbing"
      >
        <SmartMedia src={image} type="image" className="w-full h-full object-cover" loaderImage="/GlowLoadingGif.gif" />
      </motion.div>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-24 text-white font-bold text-xl"
      >
        {name}
      </motion.p>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-16 text-white/60 text-sm"
      >
        Swipe down to close
      </motion.p>
    </motion.div>
  );
};

const StoryViewer = ({ highlight, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [message, setMessage] = useState("");
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const progressIntervalRef = useRef(null);
  useBodyScrollLock(true);

  useEffect(() => {
    if (isPaused || showShareDrawer) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < highlight.items.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
            setTimeout(() => onClose(), 100);
            return 100;
          }
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentIndex, isPaused, showShareDrawer, highlight.items.length, onClose]);

  const goNext = useCallback(() => {
    if (currentIndex < highlight.items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, highlight.items.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  const handleDragEnd = useCallback(
    (_, info) => {
      if (info.velocity.x < -500 || info.offset.x < -100) goNext();
      else if (info.velocity.x > 500 || info.offset.x > 100) goPrev();
      if (Math.abs(info.velocity.y) > 500 || info.offset.y > 150) onClose();
    },
    [goNext, goPrev, onClose],
  );

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      setMessageSent(true);
      setMessage("");
      setTimeout(() => setMessageSent(false), 2000);
    }
  }, [message]);

  const handleShareClick = useCallback(() => {
    setShowShareDrawer(true);
  }, []);

  // Generate unique image for each story item based on index
  const getStoryImage = useCallback(
    (itemIndex) => {
      const baseImages = [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1200&fit=crop",
      ];
      return baseImages[(highlight.id + itemIndex) % baseImages.length];
    },
    [highlight.id],
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black"
      >
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 p-3 pt-4 flex gap-1 bg-gradient-to-b from-black/60 to-transparent">
          {highlight.items.map((_, idx) => (
            <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={false}
                animate={{
                  width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%",
                }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-12 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/50">
              <SmartMedia
                src={highlight.image}
                type="image"
                className="w-full h-full object-cover"
                loaderImage="/GlowLoadingGif.gif"
              />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{highlight.title}</p>
              <p className="text-white/60 text-xs">
                {currentIndex + 1} of {highlight.items.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShareClick}
              className="p-2 bg-white/10 backdrop-blur-xl rounded-full"
            >
              <Share2 size={20} className="text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 bg-white/10 backdrop-blur-xl rounded-full"
            >
              <X size={24} className="text-white" />
            </motion.button>
          </div>
        </div>

        {/* Story content with smooth animation */}
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full z-10 cursor-pointer" onClick={goPrev} />
            <div className="w-1/3 h-full z-10" />
            <div className="w-1/3 h-full z-10 cursor-pointer" onClick={goNext} />
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8,
              }}
              className="absolute inset-0"
            >
              <SmartMedia
                src={getStoryImage(currentIndex)}
                type="image"
                className="w-full h-full object-cover"
                loaderImage="/GlowLoadingGif.gif"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Bottom section */}
        <div className="absolute bottom-8 left-4 right-4 z-20">
          <p className="text-white text-sm mb-4 px-2">{highlight.items[currentIndex]?.caption}</p>

          {messageSent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-3 text-center"
            >
              <span className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full">Message sent!</span>
            </motion.div>
          )}

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-4 py-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSendMessage}
              className={message.trim() ? "text-white" : "text-white/50"}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showShareDrawer && (
          <StoryShareDrawer isOpen={showShareDrawer} onClose={() => setShowShareDrawer(false)} highlight={highlight} />
        )}
      </AnimatePresence>
    </>
  );
};

// --- NEW COMPONENT: Individual Comment Item with User Fetching ---
const CommentItem = memo(({ review, currentUserId, onDelete, isPreview = false }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      if (!review.userId) return;
      try {
        // Assuming your API accepts a query param like ?clerkId= or ?id=
        // Adjust the query param name based on your specific backend route
        const res = await fetch(`/api/user?userId=${review.userId}`);
        const data = await res.json();
        if (isMounted && data) {
          // Handle both array response or single object response
          const user = Array.isArray(data) ? data[0] : data;
          setUserData(user);
        }
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [review.userId]);

  const isOwner = currentUserId && review.userId === currentUserId;
  const avatar = userData?.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop";
  const username = userData?.username || userData?.firstName || "User";

  return (
    <div className={`flex items-start gap-3 ${isPreview ? "mb-2" : "mb-4"}`}>
      <div className={`${isPreview ? "w-6 h-6" : "w-8 h-8"} rounded-full overflow-hidden flex-shrink-0 bg-gray-200`}>
        {loading ? (
          <div className="w-full h-full animate-pulse bg-gray-300" />
        ) : (
          <SmartMedia src={avatar} type="image" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
          <p className="text-sm">
            <span className="font-bold text-white mr-2">{username}</span>
            <span className="text-white/80 font-light">{review.comment}</span>
          </p>
          {isOwner && !isPreview && (
            <button onClick={() => onDelete(review._id || review.id)} className="text-xs text-red-400 ml-2">
              <Trash2 size={12} />
            </button>
          )}
        </div>
        {!isPreview && (
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-gray-500">
              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Just now"}
            </span>
            {/* Optional: Add Reply button here later */}
          </div>
        )}
      </div>
    </div>
  );
});
CommentItem.displayName = "CommentItem";

// --- NEW COMPONENT: Instagram-style Comments Drawer ---
const CommentsDrawer = ({ isOpen, onClose, reviews, onAddComment, onDeleteComment, submitting, currentUserId }) => {
  const [newComment, setNewComment] = useState("");
  useBodyScrollLock(isOpen); // Lock background scrolling

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[121] bg-[#121212] w-full lg:w-[40%] flex flex-col border-l border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-bold text-white text-lg lg:text-xl">Comments</span>
              <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white">
                <X size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4">
              {reviews.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pb-12">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner"
                  >
                    <MessageCircle size={32} className="text-white/40" />
                  </motion.div>
                  <div className="space-y-1">
                    <p className="text-white font-semibold text-lg">No comments yet</p>
                    <p className="text-white/40 text-sm max-w-[200px] mx-auto leading-relaxed">
                      Start the conversation by leaving a comment below.
                    </p>
                  </div>
                </div>
              ) : (
                reviews.map((review, idx) => (
                  <CommentItem
                    key={review._id || idx}
                    review={review}
                    currentUserId={currentUserId}
                    onDelete={onDeleteComment}
                  />
                ))
              )}
            </div>

            {/* Input Section */}
            <div className="p-4 border-t border-white/10 bg-[#121212]">
              <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
                {/* Assuming current user avatar is available, else generic */}
                <div className="w-7 h-7 rounded-full bg-gray-500 overflow-hidden">
                  {/* Placeholder for current user avatar */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500" />
                </div>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 outline-none"
                  onKeyDown={(e) => e.key === "Enter" && newComment.trim() && onAddComment(newComment, setNewComment)}
                />
                <button
                  disabled={!newComment.trim() || submitting}
                  onClick={() => onAddComment(newComment, setNewComment)}
                  className={`text-sm font-semibold ${newComment.trim() ? "text-blue-500" : "text-blue-500/50"}`}
                >
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const NoDataFallback = ({ postNumber, onUpdateClick }) => {
  const config = POST_CONFIGS[postNumber];
  if (!config) return null;
  const IconComponent = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-gray-50 border border-gray-200 border-dashed rounded-xl">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center mb-4 opacity-80`}>
        <IconComponent size={24} className="text-white" />
      </div>
      <h3 className="text-gray-800 font-medium mb-1">{config.title}</h3>
      <p className="text-gray-500 text-xs mb-4 max-w-[200px]">
        No details added for this post category yet.
      </p>
      {onUpdateClick && (
        <button
          onClick={onUpdateClick}
          className={`px-4 py-2 bg-gradient-to-r ${config.color} rounded-lg text-white text-xs font-semibold hover:shadow-lg transition-transform active:scale-95`}
        >
          Add Details
        </button>
      )}
    </div>
  );
};


// Validation function
const validateField = (field, value) => {
  if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
    return `${field.label} is required`;
  }
  if (field.type === "number") {
    const num = parseFloat(value);
    if (isNaN(num)) return `${field.label} must be a number`;
    if (field.min !== undefined && num < field.min) return `${field.label} must be at least ${field.min}`;
    if (field.max !== undefined && num > field.max) return `${field.label} must be at most ${field.max}`;
  }
  if (field.key === "googleRating") {
    const rating = parseFloat(value);
    if (rating < 0 || rating > 5) return "Rating must be between 0 and 5";
  }
  if (field.type === "cta" && Array.isArray(value) && value.length !== 3) {
    return "Exactly 3 call-to-action items required";
  }
  return null;
};

// Content Form Component
const PostContentForm = ({ postNumber, initialData, onSubmit, onCancel, isSubmitting }) => {
  const config = POST_CONFIGS[postNumber];
  const [formData, setFormData] = useState(() => {
    const initial = {};
    config.fields.forEach((field) => {
      if (field.type === "array" || field.type === "cta") {
        initial[field.key] = initialData?.[field.key] || [];
      } else if (field.type === "packages") {
        initial[field.key] = initialData?.[field.key] || [];
      } else {
        initial[field.key] = initialData?.[field.key] || "";
      }
    });
    return initial;
  });
  const [errors, setErrors] = useState({});
  const [arrayInput, setArrayInput] = useState({});

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleArrayAdd = (key, maxItems) => {
    const inputValue = arrayInput[key]?.trim();
    if (!inputValue) return;
    if (maxItems && formData[key].length >= maxItems) {
      setErrors((prev) => ({ ...prev, [key]: `Maximum ${maxItems} items allowed` }));
      return;
    }
    setFormData((prev) => ({ ...prev, [key]: [...prev[key], inputValue] }));
    setArrayInput((prev) => ({ ...prev, [key]: "" }));
  };

  const handleArrayRemove = (key, index) => {
    setFormData((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  const handlePackageAdd = () => {
    setFormData((prev) => ({
      ...prev,
      packages: [...prev.packages, { title: "", priceMin: "", priceMax: "" }],
    }));
  };

  const handlePackageChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg)),
    }));
  };

  const handlePackageRemove = (index) => {
    setFormData((prev) => ({ ...prev, packages: prev.packages.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    config.fields.forEach((field) => {
      const error = validateField(field, formData[field.key]);
      if (error) newErrors[field.key] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl max-h-[80vh] flex flex-col"
    >
      <div className={`bg-gradient-to-r ${config.color} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <IconComponent size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{config.title}</h3>
            <p className="text-white/70 text-[10px] uppercase tracking-wider">Post {postNumber} of 4</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X size={14} className="text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {config.fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "textarea" && (
              <textarea
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className={`w-full px-3 py-2 bg-gray-50 border text-gray-900 rounded-xl text-sm resize-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all ${errors[field.key] ? "border-red-400" : "border-gray-200"}`}
                rows={3}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}

            {field.type === "text" && (
              <input
                type="text"
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className={`w-full px-3 py-2 bg-gray-50 border text-gray-900 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all ${errors[field.key] ? "border-red-400" : "border-gray-200"}`}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                min={field.min}
                max={field.max}
                step={field.step || 1}
                className={`w-full px-3 py-2 bg-gray-50 border text-gray-900 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all ${errors[field.key] ? "border-red-400" : "border-gray-200"}`}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}

            {(field.type === "array" || field.type === "cta") && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={arrayInput[field.key] || ""}
                    onChange={(e) => setArrayInput((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleArrayAdd(field.key, field.maxItems);
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Add ${field.label.toLowerCase()}...`}
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayAdd(field.key, field.maxItems)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors border border-gray-200"
                  >
                    <Plus size={16} className="text-gray-500" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData[field.key].map((item, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-600"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove(field.key, index)}
                        className="w-4 h-4 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </motion.span>
                  ))}
                </div>
                {field.maxItems && (
                  <p className="text-xs text-gray-400">
                    {formData[field.key].length} / {field.maxItems} items
                  </p>
                )}
              </div>
            )}

            {field.type === "packages" && (
              <div className="space-y-3">
                {formData.packages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Package {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handlePackageRemove(index)}
                        className="w-5 h-5 rounded-full hover:bg-red-500/10 flex items-center justify-center transition-colors group"
                      >
                        <Trash2 size={12} className="text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={pkg.title}
                      onChange={(e) => handlePackageChange(index, "title", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Package title..."
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={pkg.priceMin}
                        onChange={(e) => handlePackageChange(index, "priceMin", e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Min price"
                        min={0}
                      />
                      <input
                        type="number"
                        value={pkg.priceMax}
                        onChange={(e) => handlePackageChange(index, "priceMax", e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Max price"
                        min={0}
                      />
                    </div>
                  </motion.div>
                ))}
                <button
                  type="button"
                  onClick={handlePackageAdd}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={14} />
                  Add Package
                </button>
              </div>
            )}

            {errors[field.key] && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 flex items-center gap-1 mt-1"
              >
                <AlertCircle size={10} />
                {errors[field.key]}
              </motion.p>
            )}
          </div>
        ))}
      </form>

      <div className="p-4 border-t border-gray-100 bg-white flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex-1 py-2 bg-gradient-to-r ${config.color} rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-all ${isSubmitting ? "opacity-70" : "hover:brightness-110"}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check size={14} />
              Save Details
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};


const WorkDetailsContent = ({ data }) => (
  <div className="space-y-4">
    {data.caption && <p className="text-gray-600 text-sm leading-relaxed">{data.caption}</p>}
    <div className="grid grid-cols-2 gap-3">
      {data.googleRating !== undefined && (
        <div className="bg-amber-50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <span className="text-xs text-amber-600 font-medium">Google Rating</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">{data.googleRating}</p>
        </div>
      )}
      {data.teamSize && (
        <div className="bg-blue-50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">Team Size</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{data.teamSize}</p>
        </div>
      )}
      {data.servicesDone !== undefined && (
        <div className="bg-green-50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={16} className="text-green-500" />
            <span className="text-xs text-green-600 font-medium">Services Done</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{data.servicesDone?.toLocaleString()}</p>
        </div>
      )}
      {data.yearsOfExperience !== undefined && (
        <div className="bg-purple-50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={16} className="text-purple-500" />
            <span className="text-xs text-purple-600 font-medium">Experience</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">{data.yearsOfExperience} yrs</p>
        </div>
      )}
    </div>

    {data.location && (
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100 mt-2">
        <MapPin size={18} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-600">{data.location}</span>
      </div>
    )}
  </div>
);

const ServiceBreakdownContent = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="space-y-4">
      {data.caption && <p className="text-gray-600 text-sm leading-relaxed">{data.caption}</p>}
      {data.eventIncludes?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Package size={16} className="text-purple-500" />
            Event Includes
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.eventIncludes.map((item, index) => (
              <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
      {data.subCategories?.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-800">Sub Categories</span>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={18} className="text-gray-500" />
            </motion.div>
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-2">
                  {data.subCategories.map((item, index) => (
                    <span key={index} className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const PricingContent = ({ data }) => (
  <div className="space-y-4">
    {(data.basePriceMin || data.basePriceMax) && (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={18} className="text-green-500" />
          <span className="text-sm font-medium text-green-700">Base Price Range</span>
        </div>
        <p className="text-2xl font-bold text-green-800">
          ₹{data.basePriceMin?.toLocaleString()} - ₹{data.basePriceMax?.toLocaleString()}
        </p>
      </div>
    )}
    {data.packages?.length > 0 && (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Package size={16} className="text-green-500" />
          Packages
        </h4>
        {data.packages.map((pkg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
          >
            <h5 className="font-semibold text-gray-800 mb-1">{pkg.title}</h5>
            <p className="text-green-600 font-bold">
              ₹{pkg.priceMin?.toLocaleString()} - ₹{pkg.priceMax?.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

const TrustContent = ({ data }) => (
  <div className="space-y-4">
    {data.usp?.length > 0 && (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Unique Selling Points
        </h4>
        <div className="space-y-2">
          {data.usp.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl"
            >
              <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={14} className="text-amber-700" />
              </div>
              <span className="text-sm text-amber-800">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    )}
    {data.callToAction?.length > 0 && (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Phone size={16} className="text-orange-500" />
          Call to Action
        </h4>
        <div className="grid gap-2">
          {data.callToAction.map((item, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              {item}
            </motion.button>
          ))}
        </div>
      </div>
    )}
  </div>
);


const PostDetailModal = ({
  post,
  posts = [],
  initialIndex = 0,
  onClose,
  vendorName,
  vendorImage,
  onDelete,
  onEdit,
  onArchive,
  vendorId: desktopVendorId,
  vendorUsername,
  allInteractions = {},
  isVerified = false,
  profileId,
}) => {
  const { user, isSignedIn } = useUser();

  // Navigation state
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (posts.length > 0) {
      const idx = posts.findIndex((p) => p._id === post?._id);
      return idx >= 0 ? idx : initialIndex;
    }
    return 0;
  });
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Current post
  const currentPost = posts.length > 0 ? posts[currentIndex] : post;

  // Interaction states
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [isLoadingInteractions, setIsLoadingInteractions] = useState(true);

  // Content Category Detail States
  const isOwner = user?.id === desktopVendorId;
  const postNumber = (currentIndex % 4) + 1;
  const [contentData, setContentData] = useState(currentPost?.content || null);
  const [showContentForm, setShowContentForm] = useState(false);
  const [isContentSubmitting, setIsContentSubmitting] = useState(false);
  const [contentSubmitError, setContentSubmitError] = useState(null);

  // Media states
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Sound ON by default
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPlayPauseIndicator, setShowPlayPauseIndicator] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreview, setSeekPreview] = useState(null);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const playPauseTimeoutRef = useRef(null);
  const isSeekingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });
  const tapTimeoutRef = useRef(null);
  const wasPlayingRef = useRef(true);
  const wasDragPlayingRef = useRef(false);

  useBodyScrollLock(true);

  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  useEffect(() => {
    return () => {
      if (playPauseTimeoutRef.current) {
        clearTimeout(playPauseTimeoutRef.current);
      }
    };
  }, []);

  const isVideo = currentPost?.mediaType === "video";
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Reset states when post changes - instant reset
  useEffect(() => {
    setIsBuffering(true);
    setHasError(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    // Reset Content State
    setContentData(currentPost?.content || null);
    setShowContentForm(false);
    setContentSubmitError(null);
  }, [currentIndex, currentPost]);

  // Fetch interaction status
  useEffect(() => {
    const fetchInteractionStatus = async () => {
      if (!currentPost?._id) return;

      // CHECK PRELOADED DATA FIRST
      const preloadedData = allInteractions[currentPost._id];

      if (preloadedData) {
        // Use preloaded data
        setLikes(preloadedData.likesCount || 0);
        setIsLiked(preloadedData.isLiked || false);
        setIsSaved(preloadedData.isSaved || false);
        setReviews(preloadedData.reviews || []);
        setIsLoadingInteractions(false);
        return; // EXIT: Do not make API call
      }

      // Fallback: If no preloaded data, fetch from API
      try {
        if (!vendorUsername) {
          setIsLoadingInteractions(false);
          return;
        }

        const params = new URLSearchParams({
          postId: currentPost._id,
          ...(user?.id && { userId: user.id }),
        });

        const res = await fetch(`/api/vendor/${vendorUsername}/profile/posts/interactions?${params}`);
        const data = await res.json();

        if (data.success) {
          setLikes(data.data.likesCount || 0);
          setIsLiked(data.data.isLiked || false);
          setIsSaved(data.data.isSaved || false);
          setReviews(data.data.reviews || []);
        }
      } catch (error) {
        console.error("Failed to fetch interaction status:", error);
      } finally {
        setIsLoadingInteractions(false);
      }
    };

    fetchInteractionStatus();
  }, [currentPost?._id, user?.id, vendorUsername, allInteractions]);

  // ===== CONTENT FORM SUBMIT =====
  const handleContentFormSubmit = useCallback(
    async (formData) => {
      setIsContentSubmitting(true);
      setContentSubmitError(null);

      const previousData = contentData;
      setContentData(formData);
      setShowContentForm(false);

      try {
        const response = await fetch(`/api/vendor/profile/post-content`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: profileId,
            postId: currentPost?._id,
            postNumber,
            content: formData,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to update");
        }

        if (result.data?.content) {
          setContentData(result.data.content);
        }
      } catch (error) {
        setContentData(previousData);
        setContentSubmitError(error.message);
        setShowContentForm(true);
        console.error(error);
      } finally {
        setIsContentSubmitting(false);
      }
    },
    [contentData, profileId, currentPost?._id, postNumber],
  );

  // ===== RENDER POST CONTENT =====
  const renderPostContent = useCallback(() => {
    const hasContent = contentData && Object.values(contentData).some(val =>
      Array.isArray(val) ? val.length > 0 : (val !== undefined && val !== null && val !== "")
    );
    if (!hasContent) {
      return <NoDataFallback postNumber={postNumber} onUpdateClick={isVerified ? (() => setShowContentForm(true)) : null} />;
    }

    switch (postNumber) {
      case 1:
        return <WorkDetailsContent data={contentData} />;
      case 2:
        return <ServiceBreakdownContent data={contentData} />;
      case 3:
        return <PricingContent data={contentData} />;
      case 4:
        return <TrustContent data={contentData} />;
      default:
        return null;
    }
  }, [contentData, postNumber, isVerified]);

  // Video event handlers with optimized updates
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;
    let animationFrameId;

    const updateProgress = () => {
      if (video.duration && !isSeekingRef.current) {
        const newProgress = (video.currentTime / video.duration) * 100;
        setProgress(newProgress);
        setCurrentTime(video.currentTime);
      }
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsBuffering(false);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
      if (isPlaying) {
        video.play().catch(() => setIsPlaying(false));
      }
    };

    const handleWaiting = () => setIsBuffering(true);

    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => { });
    };

    const handleError = () => {
      setHasError(true);
      setIsBuffering(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handlePlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    animationFrameId = requestAnimationFrame(updateProgress);

    // Auto-play on mount
    video.play().catch(() => setIsPlaying(false));

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentIndex]);

  // Navigation handlers - instant response
  const goToPost = useCallback(
    (newDirection) => {
      if (posts.length === 0) return;

      const canGoNext = newDirection > 0 && currentIndex < posts.length - 1;
      const canGoPrev = newDirection < 0 && currentIndex > 0;

      if (canGoNext || canGoPrev) {
        setDirection(newDirection);
        setCurrentIndex((prev) => prev + newDirection);
      }
    },
    [currentIndex, posts.length],
  );

  const handleDragStart = () => {
    setIsDragging(true);
    if (videoRef.current && isVideo) {
      wasDragPlayingRef.current = !videoRef.current.paused;
      videoRef.current.pause();
    }
  };

  const handleDrag = (_, info) => {
    setDragOffset(info.offset.y);
  };

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    setDragOffset(0);

    const shouldGoNext = info.offset.y < -SWIPE_THRESHOLD || info.velocity.y < -VELOCITY_THRESHOLD;
    const shouldGoPrev = info.offset.y > SWIPE_THRESHOLD || info.velocity.y > VELOCITY_THRESHOLD;

    if (shouldGoNext && currentIndex < posts.length - 1) {
      goToPost(1);
    } else if (shouldGoPrev && currentIndex > 0) {
      goToPost(-1);
    } else {
      // Resume video only if it was playing before drag started
      if (videoRef.current && isVideo && wasDragPlayingRef.current) {
        videoRef.current.play().catch(() => { });
      }
    }

    // Horizontal swipe to close
    if (info.velocity.x > 400 || info.offset.x > 120) {
      onClose();
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress bar seeking - works on touch and click
  const handleProgressSeekStart = useCallback(
    (e) => {
      e.stopPropagation(); // Stop event bubbling
      setIsSeeking(true);
      isSeekingRef.current = true;

      // Track if video was playing so we can resume later
      wasPlayingRef.current = isPlaying;

      if (videoRef.current) {
        videoRef.current.pause(); // Pause immediately for smooth scrubbing
      }

      // Calculate immediate position
      const rect = progressBarRef.current?.getBoundingClientRect();
      if (!rect || !duration) return;

      // Support both mouse and touch
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newTime = percentage * duration;

      setProgress(percentage * 100);
      setCurrentTime(newTime);
      setSeekPreview(formatTime(newTime));

      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }
    },
    [duration, isPlaying],
  );

  const handleProgressSeek = useCallback(
    (e) => {
      if (!isSeekingRef.current) return;

      // Prevent default interactions (like scroll) while scrubbing
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      const rect = progressBarRef.current?.getBoundingClientRect();
      if (!rect || !duration) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newTime = percentage * duration;

      setProgress(percentage * 100);
      setCurrentTime(newTime);
      setSeekPreview(formatTime(newTime));

      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }
    },
    [duration],
  );

  const handleProgressSeekEnd = useCallback((e) => {
    if (e) e.stopPropagation();
    // Guard: only act if we were actually seeking
    if (!isSeekingRef.current) return;

    setIsSeeking(false);
    isSeekingRef.current = false;
    setSeekPreview(null);

    if (wasPlayingRef.current && videoRef.current) {
      videoRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    if (!isSeeking) return;

    const onMove = (e) => {
      if (e.cancelable) e.preventDefault();
      const rect = progressBarRef.current?.getBoundingClientRect();
      if (!rect || !duration) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newTime = pct * duration;
      setProgress(pct * 100);
      setCurrentTime(newTime);
      setSeekPreview(formatTime(newTime));
      if (videoRef.current) videoRef.current.currentTime = newTime;
    };

    const onEnd = () => {
      if (!isSeekingRef.current) return;
      setIsSeeking(false);
      isSeekingRef.current = false;
      setSeekPreview(null);
      if (wasPlayingRef.current && videoRef.current) {
        videoRef.current.play().catch(() => setIsPlaying(false));
        setIsPlaying(true);
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
  }, [isSeeking, duration]);

  // Play/Pause with visual indicator
  const togglePlayPause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        // Always clear timeout first
        if (playPauseTimeoutRef.current) clearTimeout(playPauseTimeoutRef.current);
        setShowPlayPauseIndicator(true);

        // The robust way to handle the play promise
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } else {
        video.pause();
        setIsPlaying(false);
        setShowPlayPauseIndicator(true);
      }
    } catch (error) {
      console.warn("Playback interaction interrupted");
    } finally {
      playPauseTimeoutRef.current = setTimeout(() => setShowPlayPauseIndicator(false), 800);
    }
  }, [isPlaying]);

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  // Interaction handlers
  const handleLike = async () => {
    if (!isSignedIn || !user?.id) {
      alert("Please sign in to like posts");
      return;
    }

    if (isInteracting) return;

    const newLikedState = !isLiked;
    const previousLikes = likes;
    const previousLiked = isLiked;

    setIsLiked(newLikedState);
    setLikes((prev) => (newLikedState ? prev + 1 : Math.max(0, prev - 1)));

    if (newLikedState && !showLikeAnimation) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 800);
    }

    setIsInteracting(true);

    try {
      const res = await fetch(`/api/vendor/${vendorUsername}/profile/posts/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: currentPost._id,
          action: "like",
          userId: user.id,
          value: newLikedState,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setIsLiked(previousLiked);
        setLikes(previousLikes);
      } else {
        setLikes(data.data.likesCount);
      }
    } catch (error) {
      setIsLiked(previousLiked);
      setLikes(previousLikes);
    } finally {
      setIsInteracting(false);
    }
  };

  const handleTap = useCallback(
    (event, info) => {
      // Double tap detection
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = null;
        // Double tap → like
        if (!isLiked) handleLike();
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 800);
      } else {
        // Single tap → wait to confirm it's not a double tap
        tapTimeoutRef.current = setTimeout(() => {
          tapTimeoutRef.current = null;
          if (isVideo) {
            togglePlayPause();
          }
        }, 250);
      }
    },
    [isVideo, isLiked, handleLike, togglePlayPause],
  );

  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  const handleSave = async () => {
    if (!isSignedIn || !user?.id) {
      alert("Please sign in to save posts");
      return;
    }

    if (isInteracting) return;

    const newSavedState = !isSaved;
    const previousSaved = isSaved;

    setIsSaved(newSavedState);
    setIsInteracting(true);

    try {
      const res = await fetch(`/api/vendor/${vendorUsername}/profile/posts/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: currentPost._id,
          action: "save",
          userId: user.id,
          value: newSavedState,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setIsSaved(previousSaved);
      }
    } catch (error) {
      setIsSaved(previousSaved);
    } finally {
      setIsInteracting(false);
    }
  };

  const handleAddComment = async (text, clearInputFn) => {
    if (!isSignedIn || !user?.id) {
      alert("Please sign in to comment");
      return;
    }

    const tempId = Date.now();
    const tempComment = {
      _id: tempId,
      userId: user.id,
      comment: text,
      createdAt: new Date().toISOString(),
      rating: 5,
    };

    setReviews((prev) => [...prev, tempComment]);
    clearInputFn("");
    setReviewSubmitting(true);

    try {
      const res = await fetch(`/api/vendor/${vendorUsername}/profile/posts/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: currentPost._id,
          action: "addReview",
          userId: user.id,
          reviewData: { rating: 5, comment: text },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.map((r) => (r._id === tempId ? data.data.review : r)));
      } else {
        setReviews((prev) => prev.filter((r) => r._id !== tempId));
      }
    } catch (error) {
      setReviews((prev) => prev.filter((r) => r._id !== tempId));
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteComment = async (reviewId) => {
    if (!confirm("Delete this comment?")) return;

    setReviews((prev) => prev.filter((r) => (r._id || r.id) !== reviewId));

    try {
      await fetch(`/api/vendor/${vendorUsername}/profile/posts/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: currentPost._id,
          action: "deleteReview",
          userId: user.id,
          reviewId,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Loading skeleton
  const ActionsSkeleton = () => (
    <div className="flex flex-col items-center gap-5 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-white/20" />
          <div className="w-6 h-2.5 bg-white/20 rounded" />
        </div>
      ))}
    </div>
  );

  if (!currentPost) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] bg-black lg:bg-black/90 lg:backdrop-blur-sm overflow-hidden lg:flex lg:items-center lg:justify-center"
      >
        {/* Desktop: Centered modal container */}
        <div className="relative w-full h-full lg:w-[92vw] lg:max-w-[1400px] lg:h-[88vh] lg:rounded-2xl lg:overflow-hidden lg:shadow-2xl lg:flex lg:bg-black">
          {/* ===== LEFT: Media Panel ===== */}
          <div className="absolute inset-0 lg:relative lg:flex-[1.6] lg:h-full">
            {/* Seekable Progress Bar at Top */}
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 right-0 z-40 h-1 bg-white/20 cursor-pointer group lg:rounded-tl-2xl"
              onMouseDown={handleProgressSeekStart}
              onMouseUp={handleProgressSeekEnd}
              onTouchStart={handleProgressSeekStart}
              onTouchEnd={handleProgressSeekEnd}
            >
              <motion.div
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
                transition={{ duration: isSeeking ? 0 : 0.1 }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 6px)` }}
                animate={{ scale: isSeeking ? 1.5 : 1 }}
              />
              <div className="absolute -top-2 -bottom-2 left-0 right-0" />
              <AnimatePresence>
                {seekPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-4 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-mono"
                    style={{
                      left: `${progress}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {seekPreview}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Time Display */}
            {isVideo && duration > 0 && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
                <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>
            )}

            {/* Header - Mobile + Desktop close/options */}
            <div className="absolute top-6 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between lg:top-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 hover:bg-black/60 transition-colors"
              >
                <ArrowLeft size={22} className="text-white" />
              </motion.button>

              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 lg:hidden">
                <span className="text-white font-semibold text-sm">{vendorName}</span>
                <span className="text-white/50 text-xs">•</span>
                <span className="text-white/70 text-xs">Works</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOptionsDrawer(true)}
                className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 hover:bg-black/60 transition-colors"
              >
                <MoreVertical size={22} className="text-white" />
              </motion.button>
            </div>

            {/* Main Content Area with Swipe */}
            <motion.div
              ref={containerRef}
              drag={posts.length > 1 ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.15}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onTap={handleTap}
              className="absolute inset-0 touch-pan-y"
              style={{
                cursor: isDragging ? "grabbing" : posts.length > 1 ? "grab" : "default",
              }}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentPost._id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  {/* Blurred Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <motion.img
                      src={currentPost.thumbnailUrl || currentPost.mediaUrl}
                      alt=""
                      className="w-full h-full object-cover blur-3xl scale-150"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-black/30" />
                  </div>

                  {/* Media Content */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    {isVideo ? (
                      <video
                        ref={videoRef}
                        key={currentPost._id}
                        src={currentPost.mediaUrl}
                        poster={currentPost.thumbnailUrl}
                        className="w-full h-full object-contain pointer-events-none"
                        loop
                        muted={isMuted}
                        playsInline
                        autoPlay
                        preload="auto"
                      />
                    ) : (
                      <SmartMedia
                        src={currentPost.mediaUrl}
                        type="image"
                        className="w-full h-full object-contain"
                        loaderImage="/GlowLoadingGif.gif"
                      />
                    )}
                  </div>

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent lg:h-24" />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Buffering Indicator */}
              <AnimatePresence>
                {isBuffering && !hasError && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                  >
                    <div className="w-14 h-14 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error State */}
              <AnimatePresence>
                {hasError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
                  >
                    <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
                        <X size={32} className="text-red-400" />
                      </div>
                      <p className="text-white text-lg font-semibold">Content unavailable</p>
                      <p className="text-white/60 text-sm mt-1">Swipe for more</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Play/Pause Indicator */}
              <AnimatePresence>
                {showPlayPauseIndicator && isVideo && !isBuffering && !hasError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                  >
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                      {isPlaying ? (
                        <Pause size={32} className="text-white fill-white" />
                      ) : (
                        <Play size={32} className="text-white fill-white ml-1" />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Persistent Paused State */}
              <AnimatePresence>
                {!isPlaying && isVideo && !isBuffering && !hasError && !showPlayPauseIndicator && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                  >
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <Play size={32} className="text-white fill-white ml-1" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Like Animation */}
              <AnimatePresence>
                {showLikeAnimation && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 20,
                      exit: { duration: 0.3 },
                    }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
                  >
                    <Heart size={100} className="text-white fill-white drop-shadow-2xl" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Drag Indicator Overlays */}
              {isDragging && posts.length > 1 && (
                <>
                  {dragOffset < -20 && currentIndex < posts.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: Math.min(1, Math.abs(dragOffset) / 100),
                      }}
                      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30"
                    >
                      <ChevronDown size={32} className="text-white animate-bounce" />
                    </motion.div>
                  )}
                  {dragOffset > 20 && currentIndex > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: Math.min(1, Math.abs(dragOffset) / 100),
                      }}
                      className="absolute top-24 left-1/2 -translate-x-1/2 z-30"
                    >
                      <ChevronUp size={32} className="text-white animate-bounce" />
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>

            {/* Mobile-only: Right Side Actions (hidden on desktop) */}
            <div className="absolute right-3 bottom-36 flex flex-col items-center gap-4 z-30 lg:hidden">
              {isLoadingInteractions ? (
                <ActionsSkeleton />
              ) : (
                <>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike();
                    }}
                    className="flex flex-col items-center gap-0.5"
                    disabled={isInteracting}
                  >
                    <motion.div
                      animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10"
                    >
                      <Heart size={24} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
                    </motion.div>
                    <span className="text-white text-[10px] font-semibold">{likes.toLocaleString()}</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCommentsDrawer(true);
                    }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10">
                      <MessageCircle size={24} className="text-white" />
                    </div>
                    <span className="text-white text-[10px] font-semibold">{reviews.length}</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShareModal(true);
                    }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10">
                      <Send size={22} className="text-white" />
                    </div>
                    <span className="text-white text-[10px] font-semibold">Share</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    className="flex flex-col items-center gap-0.5"
                    disabled={isInteracting}
                  >
                    <motion.div
                      animate={isSaved ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10"
                    >
                      {isSaved ? (
                        <BookmarkCheck size={22} className="text-white fill-white" />
                      ) : (
                        <Bookmark size={22} className="text-white" />
                      )}
                    </motion.div>
                    <span className="text-white text-[10px] font-semibold">Save</span>
                  </motion.button>
                  {isVideo && (
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={toggleMute}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/10">
                        {isMuted ? (
                          <VolumeX size={22} className="text-white" />
                        ) : (
                          <Volume2 size={22} className="text-white" />
                        )}
                      </div>
                    </motion.button>
                  )}
                </>
              )}
            </div>

            {/* Mobile-only: Bottom Content Info (hidden on desktop) */}
            <div className="absolute left-4 right-16 bottom-8 z-30 space-y-2.5 lg:hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/30">
                  <SmartMedia
                    src={vendorImage}
                    type="image"
                    className="w-full h-full object-cover"
                    loaderImage="/GlowLoadingGif.gif"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white font-bold text-sm">{vendorName}</span>
                  {currentPost.date && <p className="text-white/50 text-xs">{currentPost.date}</p>}
                </div>
              </div>
              {(currentPost.caption || currentPost.description) && (
                <p className="text-white text-sm line-clamp-2 leading-relaxed">
                  {currentPost.caption || currentPost.description}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {currentPost.location && (
                  <span className="text-blue-400 text-xs flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    <MapPin size={10} />
                    {currentPost.location}
                  </span>
                )}
                {currentPost.tags?.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white/10 rounded-full text-white/80 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              {isVideo && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
                    <span className="text-[8px]">🎵</span>
                  </div>
                  <p className="text-white/70 text-xs">Original Audio</p>
                </div>
              )}
            </div>

            {/* Post Counter - Mobile */}
            {posts.length > 1 && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 lg:hidden">
                <div className="bg-black/40 backdrop-blur-sm px-2 py-3 rounded-full">
                  <p
                    className="text-white/70 text-[10px] font-mono"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    {currentIndex + 1} / {posts.length}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Hint - Mobile */}
            {posts.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 lg:hidden"
              >
                <p className="text-white/30 text-[10px]">Swipe up/down • Double tap to like</p>
              </motion.div>
            )}
          </div>

          <div className="hidden lg:flex lg:flex-col lg:w-[420px] lg:min-w-[380px] bg-white border-l border-gray-100">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
                  <SmartMedia
                    src={vendorImage}
                    type="image"
                    className="w-full h-full object-cover"
                    loaderImage="/GlowLoadingGif.gif"
                  />
                </div>
                <div>
                  <span className="text-gray-900 font-serif font-bold text-[15px] block tracking-tight">{vendorName}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-xs font-semibold bg-gradient-to-r ${POST_CONFIGS[postNumber]?.color || "from-gray-500 to-gray-600"} bg-clip-text text-transparent`}>
                      {POST_CONFIGS[postNumber]?.title || "Details"}
                    </span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-gray-500 text-xs">Post {postNumber}/4</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isVerified && (
                  <button
                    onClick={() => setShowContentForm(!showContentForm)}
                    className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border border-gray-200"
                  >
                    <Pencil size={16} />
                  </button>
                )}
                {posts.length > 1 && (
                  <span className="text-gray-500 text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-full">
                    {currentIndex + 1} / {posts.length}
                  </span>
                )}
              </div>
            </div>

            <AnimatePresence>
              {showContentForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 py-4 border-b border-gray-100 bg-gray-50"
                >
                  <PostContentForm
                    postNumber={postNumber}
                    initialData={contentData}
                    onSubmit={handleContentFormSubmit}
                    onCancel={() => setShowContentForm(false)}
                    isSubmitting={isContentSubmitting}
                  />
                  {contentSubmitError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2"
                    >
                      <AlertCircle size={16} />
                      {contentSubmitError}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 no-scrollbar">
              {!showContentForm && (
                <div className="mb-6">
                  {renderPostContent()}
                </div>
              )}
              {currentPost.date && <p className="text-gray-500 text-xs">{currentPost.date}</p>}

              {(currentPost.caption || currentPost.description) && (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {currentPost.caption || currentPost.description}
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {currentPost.location && (
                  <span className="text-blue-600 text-xs flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full">
                    <MapPin size={10} />
                    {currentPost.location}
                  </span>
                )}
                {currentPost.tags?.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-gray-600 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 font-semibold text-white text-sm rounded-xl transition-colors shadow-sm active:scale-[0.98]">
                  Call Now
                </button>
                <button className="flex-1 py-2.5 bg-[#00BA61] hover:bg-[#00a857] font-semibold text-white text-sm rounded-xl transition-colors shadow-sm active:scale-[0.98]">
                  Request Price Quote
                </button>
              </div>

              {isVideo && (
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center">
                    <span className="text-[9px]">🎵</span>
                  </div>
                  <p className="text-gray-500 text-xs">Original Audio</p>
                </div>
              )}

              {posts.length > 1 && (
                <div className="pt-2">
                  <p className="text-gray-400 text-[11px]">
                    Swipe up/down or use arrow keys to navigate • Double click to like
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {isLoadingInteractions ? (
                    <ActionsSkeleton />
                  ) : (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike();
                        }}
                        className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                        disabled={isInteracting}
                      >
                        <motion.div animate={isLiked ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }} className="flex items-center gap-1.5">
                          <Heart size={24} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-700"} />
                          {likes > 0 && (
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{likes}</span>
                          )}
                        </motion.div>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCommentsDrawer(true);
                        }}
                        className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <MessageCircle size={24} className="text-gray-700" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowShareModal(true);
                        }}
                        className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <Send size={22} className="text-gray-700" />
                      </motion.button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {!isLoadingInteractions && (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave();
                        }}
                        className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                        disabled={isInteracting}
                      >
                        <motion.div animate={isSaved ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
                          {isSaved ? (
                            <BookmarkCheck size={22} className="text-gray-700 fill-gray-700" />
                          ) : (
                            <Bookmark size={22} className="text-gray-700" />
                          )}
                        </motion.div>
                      </motion.button>
                      {isVideo && (
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={toggleMute}
                          className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX size={22} className="text-gray-700" />
                          ) : (
                            <Volume2 size={22} className="text-gray-700" />
                          )}
                        </motion.button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {posts.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentIndex > 0) {
                        handleDragEnd(null, { offset: { y: 200 }, velocity: { y: 0 } });
                      }
                    }}
                    disabled={currentIndex === 0}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${currentIndex === 0
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                      }`}
                  >
                    <ChevronUp size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (currentIndex < posts.length - 1) {
                        handleDragEnd(null, { offset: { y: -200 }, velocity: { y: 0 } });
                      }
                    }}
                    disabled={currentIndex >= posts.length - 1}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${currentIndex >= posts.length - 1
                      ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                      }`}
                  >
                    Next
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop close button - outside modal */}
        <button
          onClick={onClose}
          className="hidden lg:flex fixed top-4 right-4 z-[110] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl items-center justify-center border border-white/10 transition-all cursor-pointer"
        >
          <X size={20} className="text-white" />
        </button>
      </motion.div>

      {/* Options Drawer */}
      <AnimatePresence>
        {showOptionsDrawer && (
          <PostOptionsDrawer
            isOpen={showOptionsDrawer}
            onClose={() => setShowOptionsDrawer(false)}
            post={currentPost}
            onDelete={() => {
              onDelete?.();
              setShowOptionsDrawer(false);
            }}
            onShare={() => {
              setShowShareModal(true);
              setShowOptionsDrawer(false);
            }}
            onEdit={async (newCaption) => {
              await onEdit?.(newCaption);
            }}
            onArchive={() => {
              onArchive?.();
              setShowOptionsDrawer(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} vendorName={vendorName} />
        )}
      </AnimatePresence>

      {/* Comments Drawer */}
      <CommentsDrawer
        isOpen={showCommentsDrawer}
        onClose={() => setShowCommentsDrawer(false)}
        reviews={reviews}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        submitting={reviewSubmitting}
        currentUserId={user?.id}
      />
    </>
  );
};

const ReelsViewer = ({
  reels,
  initialIndex,
  onClose,
  vendorName,
  vendorImage,
  onDeleteReel,
  onEditReel,
  vendorId: reelsVendorId,
  allInteractions = {},
}) => {
  const { user, isSignedIn } = useUser();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedReels, setLikedReels] = useState(new Set());
  const [savedReels, setSavedReels] = useState(new Set());
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState(null);
  const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reelLikeCounts, setReelLikeCounts] = useState({});
  const [reelViewCounts, setReelViewCounts] = useState({});
  const [isInteracting, setIsInteracting] = useState(false);
  const [viewTracked, setViewTracked] = useState(new Set());
  const [isLoadingInteractions, setIsLoadingInteractions] = useState(true);

  const videoRef = useRef(null);
  const progressInterval = useRef(null);

  useBodyScrollLock(true);

  const currentReel = reels[currentIndex];

  const getVendorId = () => {
    return reelsVendorId;
  };

  useEffect(() => {
    // Reset loading state when changing reels
    setIsLoadingInteractions(true);
  }, [currentIndex]);

  useEffect(() => {
    if (Object.keys(allInteractions).length > 0) {
      const newLikeCounts = {};
      const newViewCounts = {};
      const newLikedSet = new Set(likedReels);
      const newSavedSet = new Set(savedReels);

      Object.entries(allInteractions).forEach(([id, data]) => {
        newLikeCounts[id] = data.likesCount || 0;
        newViewCounts[id] = data.views || 0;
        if (data.isLiked) newLikedSet.add(id);
        if (data.isSaved) newSavedSet.add(id);
      });

      setReelLikeCounts((prev) => ({ ...prev, ...newLikeCounts }));
      setReelViewCounts((prev) => ({ ...prev, ...newViewCounts }));
      setLikedReels(newLikedSet);
      setSavedReels(newSavedSet);
    }
  }, [allInteractions]);

  // Fetch interaction status for current reel
  useEffect(() => {
    const fetchReelStatus = async () => {
      if (!currentReel?._id) return;

      const reelId = currentReel._id;

      // Check if we already have data for this specific reel from the hydration above
      // or if it exists in allInteractions
      if (allInteractions[reelId] || reelLikeCounts[reelId] !== undefined) {
        setIsLoadingInteractions(false);
        return; // SKIP API CALL
      }

      setIsLoadingInteractions(true);

      try {
        const vendorUsername = vendor?.username;
        if (!vendorUsername) {
          setIsLoadingInteractions(false);
          return;
        }

        const params = new URLSearchParams({
          reelId,
          ...(user?.id && { userId: user.id }),
        });

        const res = await fetch(`/api/vendor/${vendorUsername}/profile/reels/interactions?${params}`);
        const data = await res.json();

        if (data.success) {
          setReelLikeCounts((prev) => ({ ...prev, [reelId]: data.data.likesCount || 0 }));
          setReelViewCounts((prev) => ({ ...prev, [reelId]: data.data.views || 0 }));

          if (data.data.isLiked) {
            setLikedReels((prev) => new Set([...prev, reelId]));
          }
          if (data.data.isSaved) {
            setSavedReels((prev) => new Set([...prev, reelId]));
          }
        }
      } catch (error) {
        console.error("Failed to fetch reel status:", error);
      } finally {
        setIsLoadingInteractions(false);
      }
    };

    fetchReelStatus();
  }, [currentReel?._id, user?.id, allInteractions]);

  // Track view count
  useEffect(() => {
    const trackView = async () => {
      if (!currentReel?._id) return;

      const reelId = currentReel._id;

      // Only track once per reel per session
      if (viewTracked.has(reelId)) return;

      try {
        const vendorUsername = vendor?.username;
        if (!vendorUsername) return;

        const res = await fetch(`/api/vendor/${vendorUsername}/profile/reels/interactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reelId,
            action: "view",
          }),
        });

        const data = await res.json();

        if (data.success) {
          setViewTracked((prev) => new Set([...prev, reelId]));
          setReelViewCounts((prev) => ({ ...prev, [reelId]: data.data.views }));
        }
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    };

    // Track view after 2 seconds of watching
    const timer = setTimeout(trackView, 2000);

    return () => clearTimeout(timer);
  }, [currentIndex, currentReel?._id]);

  // Cleanup progress interval
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // Handle video source change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setProgress(0);
    setIsBuffering(true);
    setHasError(false);
    setIsPlaying(true);

    video.load();

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch((error) => {
          console.log("Autoplay prevented:", error);
          setIsPlaying(false);
          setIsBuffering(false);
        });
    }
  }, [currentIndex, currentReel?.videoUrl]);

  // Handle mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Progress bar update
  useEffect(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        const video = videoRef.current;
        if (video && video.duration) {
          const percent = (video.currentTime / video.duration) * 100;
          setProgress(percent || 0);
        }
      }, 100);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Play failed:", err));
    }
  }, [isPlaying]);

  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => { });
    }
  };

  const handleVideoError = (e) => {
    console.error("Video error:", e);
    setHasError(true);
    setIsBuffering(false);
  };

  const handleLoadStart = () => {
    setIsBuffering(true);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsBuffering(false);
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsBuffering(false);
    setIsPlaying(true);
  };

  const handleLike = async () => {
    if (!isSignedIn || !user?.id) {
      alert("Please sign in to like reels");
      return;
    }

    if (isInteracting) return;

    const reelId = currentReel._id;
    const isCurrentlyLiked = likedReels.has(reelId);
    const newLikedState = !isCurrentlyLiked;

    console.log(currentReel._id, reelId, currentReel);

    // Optimistic update
    const newLiked = new Set(likedReels);
    if (newLikedState) {
      newLiked.add(reelId);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
    } else {
      newLiked.delete(reelId);
    }
    setLikedReels(newLiked);

    setReelLikeCounts((prev) => ({
      ...prev,
      [reelId]: newLikedState ? (prev[reelId] || 0) + 1 : Math.max(0, (prev[reelId] || 0) - 1),
    }));

    setIsInteracting(true);

    try {
      const vendorUsername = vendor?.username;

      const res = await fetch(`/api/vendor/${vendorUsername}/profile/reels/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelId,
          action: "like",
          userId: user.id,
          value: newLikedState,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        // Revert on failure
        const revertedLiked = new Set(likedReels);
        if (isCurrentlyLiked) {
          revertedLiked.add(reelId);
        } else {
          revertedLiked.delete(reelId);
        }
        setLikedReels(revertedLiked);
        console.error("Like failed:", data.error);
      } else {
        setReelLikeCounts((prev) => ({ ...prev, [reelId]: data.data.likesCount }));
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setIsInteracting(false);
    }
  };

  const handleSave = async () => {
    if (!isSignedIn || !user?.id) {
      alert("Please sign in to save reels");
      return;
    }

    if (isInteracting) return;

    const reelId = currentReel._id;
    const isCurrentlySaved = savedReels.has(reelId);
    const newSavedState = !isCurrentlySaved;

    // Optimistic update
    const newSaved = new Set(savedReels);
    if (newSavedState) {
      newSaved.add(reelId);
    } else {
      newSaved.delete(reelId);
    }
    setSavedReels(newSaved);

    setIsInteracting(true);

    try {
      const vendorUsername = vendor?.username;

      const res = await fetch(`/api/vendor/${vendorUsername}/profile/reels/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelId,
          action: "save",
          userId: user.id,
          value: newSavedState,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        // Revert on failure
        const revertedSaved = new Set(savedReels);
        if (isCurrentlySaved) {
          revertedSaved.add(reelId);
        } else {
          revertedSaved.delete(reelId);
        }
        setSavedReels(revertedSaved);
        console.error("Save failed:", data.error);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsInteracting(false);
    }
  };

  const goToReel = useCallback(
    (direction) => {
      const params = new URLSearchParams(window.location.search);

      if (direction === "up" && currentIndex < reels.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setDragDirection("up");
        params.set("reel", currentIndex + 1);
      } else if (direction === "down" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setDragDirection("down");
        params.set("reel", currentIndex - 1);
      }

      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

      setTimeout(() => setDragDirection(null), 300);
    },
    [currentIndex, reels.length],
  );

  const handleDragStart = () => {
    setIsDragging(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    const threshold = 50;
    const velocity = 300;

    const shouldGoUp = info.offset.y < -threshold || info.velocity.y < -velocity;
    const shouldGoDown = info.offset.y > threshold || info.velocity.y > velocity;

    if (shouldGoUp) {
      goToReel("up");
    } else if (shouldGoDown) {
      goToReel("down");
    } else {
      if (videoRef.current && isPlaying) {
        videoRef.current.play().catch(() => { });
      }
    }

    if (info.velocity.x > 500 || info.offset.x > 150) {
      onClose();
    }
  };

  const handleDoubleTap = () => {
    const reelId = currentReel?._id;
    if (!likedReels.has(reelId)) {
      handleLike();
    }
  };

  const handleSingleTap = (e) => {
    if (e.target === e.currentTarget || e.target.tagName === "VIDEO") {
      handlePlayPause();
    }
  };

  const handleDeleteReel = () => {
    onDeleteReel?.(currentReel._id);
    if (reels.length <= 1) {
      onClose();
    } else if (currentIndex >= reels.length - 1) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleEditReel = async (newCaption, newTitle) => {
    try {
      const vendorUsername = vendor?.username;
      const reelId = currentReel._id;

      const formData = new FormData();
      if (newCaption !== undefined) formData.append("caption", newCaption);
      if (newTitle !== undefined) formData.append("title", newTitle);

      const res = await fetch(`/api/vendor/${vendorUsername}/profile/reels?reelId=${reelId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Update local state
        currentReel.caption = newCaption ?? currentReel.caption;
        currentReel.title = newTitle ?? currentReel.title;
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Edit reel error:", error);
      return { success: false, error: error.message };
    }
  };

  const ReelActionsSkeleton = () => (
    <div className="flex flex-col items-center gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/20" />
          <div className="w-8 h-3 bg-white/20 rounded" />
        </div>
      ))}
    </div>
  );

  if (!currentReel) return null;

  const reelId = currentReel._id;
  const isLiked = likedReels.has(reelId);
  const isSaved = savedReels.has(reelId);
  const likesCount = reelLikeCounts[reelId] ?? currentReel?.likes?.length ?? 0;
  const viewsCount = reelViewCounts[reelId] ?? currentReel?.views ?? 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-black overflow-hidden lg:bg-black/90 lg:backdrop-blur-sm lg:flex lg:items-center lg:justify-center"
      >
        {/* Desktop: Centered container */}
        <div className="relative w-full h-full lg:w-[90vw] lg:max-w-[1300px] lg:h-[90vh] lg:rounded-2xl lg:overflow-hidden lg:shadow-2xl lg:flex lg:bg-black">
          {/* ===== LEFT/CENTER: Video Panel ===== */}
          <div className="absolute inset-0 lg:relative lg:flex-[1.4] lg:h-full">
            {/* Progress Bar at Top */}
            <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-white/20 lg:rounded-tl-2xl">
              <motion.div
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Header */}
            <div className="absolute top-1 left-0 right-0 z-20 px-4 py-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors"
              >
                <ArrowLeft size={24} className="text-white" />
              </motion.button>
              <span className="text-white font-bold lg:hidden">Reels</span>
              <span className="text-white font-bold hidden lg:block">Reels</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOptionsDrawer(true)}
                className="p-2 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors"
              >
                <MoreVertical size={24} className="text-white" />
              </motion.button>
            </div>

            {/* Main Video Area */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.1}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDoubleClick={handleDoubleTap}
              onClick={handleSingleTap}
              className="absolute inset-0 touch-pan-y bg-black"
              style={{
                cursor: isDragging ? "grabbing" : "grab",
              }}
            >
              {/* Blurred Background */}
              <div className="absolute inset-0 z-0">
                <img
                  src={currentReel?.thumbnail}
                  alt="blur-bg"
                  className="w-full h-full object-cover blur-2xl opacity-50 scale-110"
                />
              </div>

              {/* Video */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <video
                  ref={videoRef}
                  key={reelId}
                  src={currentReel?.videoUrl}
                  poster={currentReel?.thumbnail}
                  className="w-full h-full max-h-full object-contain"
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                  preload="auto"
                  onLoadStart={handleLoadStart}
                  onCanPlay={handleCanPlay}
                  onCanPlayThrough={handleCanPlay}
                  onWaiting={handleWaiting}
                  onPlaying={handlePlaying}
                  onEnded={handleVideoEnd}
                  onError={handleVideoError}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

              {/* Transition Animation Overlay */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`overlay-${reelId}`}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black pointer-events-none"
                />
              </AnimatePresence>

              {/* Buffering Indicator */}
              {isBuffering && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {/* Error State */}
              {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                  <div className="text-white text-center">
                    <p className="text-lg font-semibold">Video unavailable</p>
                    <p className="text-sm text-white/60 mt-2">Swipe to next reel</p>
                  </div>
                </div>
              )}

              {/* Play/Pause Indicator */}
              <AnimatePresence>
                {!isPlaying && !isBuffering && !hasError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  >
                    <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center">
                      <Play size={40} className="text-white ml-1" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Like Animation */}
              <AnimatePresence>
                {showLikeAnimation && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  >
                    <Heart size={120} className="text-white fill-white drop-shadow-2xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mobile-only: Right Side Actions */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-20 lg:hidden">
              {isLoadingInteractions ? (
                <ReelActionsSkeleton />
              ) : (
                <>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={handleLike}
                    className="flex flex-col items-center gap-1"
                    disabled={isInteracting}
                  >
                    <motion.div
                      animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                      className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center"
                    >
                      <Heart size={26} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
                    </motion.div>
                    <span className="text-white text-xs font-bold">{likesCount.toLocaleString()}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={handleSave}
                    className="flex flex-col items-center gap-1"
                    disabled={isInteracting}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
                      {isSaved ? (
                        <BookmarkCheck size={26} className="text-white fill-white" />
                      ) : (
                        <Bookmark size={26} className="text-white" />
                      )}
                    </div>
                    <span className="text-white text-xs font-bold">Save</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setShowShareModal(true)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
                      <Send size={26} className="text-white" />
                    </div>
                    <span className="text-white text-xs font-bold">Share</span>
                  </motion.button>
                </>
              )}

              <motion.button whileTap={{ scale: 0.8 }} onClick={() => setIsMuted(!isMuted)}>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
                  {isMuted ? (
                    <VolumeX size={26} className="text-white" />
                  ) : (
                    <Volume2 size={26} className="text-white" />
                  )}
                </div>
              </motion.button>
            </div>

            {/* Mobile-only: Bottom Info */}
            <div className="absolute left-4 right-20 bottom-10 space-y-3 z-20 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/50">
                  <img src={vendorImage} alt={vendorName} className="w-full h-full object-cover" />
                </div>
                <span className="text-white font-bold text-sm">{vendorName}</span>
                {/* <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-lg border border-white/30"
              >
                <span className="text-white text-xs font-bold">Follow</span>
              </motion.button> */}
              </div>
              <p className="text-white text-sm line-clamp-2">{currentReel?.caption}</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
                  <span className="text-[8px]">🎵</span>
                </div>
                <p className="text-white/80 text-xs">Original Audio • {viewsCount.toLocaleString()} views</p>
              </div>
            </div>

            {/* Reel Counter - Mobile */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 lg:hidden">
              <p
                className="text-white/60 text-xs"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                {currentIndex + 1} / {reels.length}
              </p>
            </div>

            {/* Hint Text - Mobile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 lg:hidden">
              <p className="text-white/40 text-xs">Swipe up/down • Tap to pause</p>
            </div>
          </div>

          {/* ===== RIGHT: Desktop Sidebar ===== */}
          <div className="hidden lg:flex lg:flex-col lg:w-[400px] lg:min-w-[360px] bg-gray-950 border-l border-gray-800/50">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-700">
                  <img src={vendorImage} alt={vendorName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-white font-bold text-sm block">{vendorName}</span>
                  <span className="text-gray-400 text-xs">Reels</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <span className="text-white text-xs font-bold">Follow</span>
                </motion.button>
                <span className="text-gray-400 text-xs font-mono bg-gray-800 px-3 py-1.5 rounded-full">
                  {currentIndex + 1} / {reels.length}
                </span>
              </div>
            </div>

            {/* Caption & Details */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 no-scrollbar">
              {/* Caption */}
              {currentReel?.caption && <p className="text-gray-200 text-sm leading-relaxed">{currentReel.caption}</p>}

              {/* Audio & Views */}
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-gray-800 flex items-center justify-center">
                  <span className="text-[9px]">🎵</span>
                </div>
                <p className="text-gray-400 text-xs">Original Audio</p>
                <span className="text-gray-600">•</span>
                <p className="text-gray-400 text-xs">{viewsCount.toLocaleString()} views</p>
              </div>

              {/* Engagement Stats */}
              <div className="border-t border-gray-800/50 pt-4">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Engagement</p>
                <div className="flex items-center gap-6">
                  <span className="text-gray-300 text-sm flex items-center gap-1.5">
                    <Heart size={14} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-400"} />
                    {likesCount.toLocaleString()} likes
                  </span>
                  <span className="text-gray-300 text-sm flex items-center gap-1.5">
                    <Eye size={14} className="text-gray-400" />
                    {viewsCount.toLocaleString()} views
                  </span>
                </div>
              </div>

              {/* Navigation Hint */}
              <div className="pt-2">
                <p className="text-gray-600 text-[11px]">
                  Swipe up/down or use buttons below to navigate • Double click to like • Click to pause/play
                </p>
              </div>
            </div>

            {/* Sidebar Action Bar */}
            <div className="px-6 py-4 border-t border-gray-800/50 space-y-3">
              {/* Action Buttons Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {isLoadingInteractions ? (
                    <ReelActionsSkeleton />
                  ) : (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={handleLike}
                        className="p-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                        disabled={isInteracting}
                      >
                        <motion.div animate={isLiked ? { scale: [1, 1.3, 1] } : {}}>
                          <Heart size={24} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
                        </motion.div>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setShowShareModal(true)}
                        className="p-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        <Send size={22} className="text-white" />
                      </motion.button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {!isLoadingInteractions && (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={handleSave}
                        className="p-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                        disabled={isInteracting}
                      >
                        {isSaved ? (
                          <BookmarkCheck size={22} className="text-white fill-white" />
                        ) : (
                          <Bookmark size={22} className="text-white" />
                        )}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX size={22} className="text-white" />
                        ) : (
                          <Volume2 size={22} className="text-white" />
                        )}
                      </motion.button>
                    </>
                  )}
                </div>
              </div>

              {/* Desktop Prev/Next Navigation */}
              {reels.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentIndex > 0) {
                        handleDragEnd(null, {
                          offset: { y: 200 },
                          velocity: { y: 0 },
                        });
                      }
                    }}
                    disabled={currentIndex === 0}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${currentIndex === 0
                      ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
                      }`}
                  >
                    <ChevronUp size={16} />
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (currentIndex < reels.length - 1) {
                        handleDragEnd(null, {
                          offset: { y: -200 },
                          velocity: { y: 0 },
                        });
                      }
                    }}
                    disabled={currentIndex >= reels.length - 1}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${currentIndex >= reels.length - 1
                      ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
                      }`}
                  >
                    Next
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop close button outside modal */}
        <button
          onClick={onClose}
          className="hidden lg:flex fixed top-4 right-4 z-[110] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl items-center justify-center border border-white/10 transition-all cursor-pointer"
        >
          <X size={20} className="text-white" />
        </button>
      </motion.div>

      {/* Options Drawer */}
      <AnimatePresence>
        {showOptionsDrawer && (
          <ReelOptionsDrawer
            isOpen={showOptionsDrawer}
            onClose={() => setShowOptionsDrawer(false)}
            reel={reels[currentIndex]}
            onDelete={() => {
              onDeleteReel(reels[currentIndex].id);
              setShowOptionsDrawer(false);
            }}
            onShare={() => {
              setShowShareModal(true);
              setShowOptionsDrawer(false);
            }}
            onEdit={async (newCaption, newTitle) => {
              const result = await onEditReel(reels[currentIndex]._id, newCaption, newTitle);
              return result;
            }}
          />
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} vendorName={vendorName} />
        )}
      </AnimatePresence>
    </>
  );
};

const PortfolioViewer = ({ portfolio, onClose, onBookService }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  useBodyScrollLock(true);

  const handleDragEnd = (_, info) => {
    if (info.velocity.x < -500 || info.offset.x < -100) {
      if (currentIndex < portfolio.images.length - 1) setCurrentIndex(currentIndex + 1);
    } else if (info.velocity.x > 500 || info.offset.x > 100) {
      if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    }
    if (info.velocity.y > 500 || info.offset.y > 150) onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-white/10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="p-1">
          <X size={24} className="text-white" />
        </motion.button>
        <div className="text-center">
          <span className="text-white font-bold text-sm block">{portfolio.title}</span>
          <span className="text-white/60 text-xs">
            {currentIndex + 1} of {portfolio.images.length}
          </span>
        </div>
        <motion.button whileTap={{ scale: 0.9 }}>
          <Share2 size={24} className="text-white" />
        </motion.button>
      </div>

      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="flex-1 flex items-center justify-center p-4"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full flex items-center justify-center"
          >
            <SmartMedia
              src={portfolio.images[currentIndex]}
              type="image"
              className="max-w-full max-h-[70vh] object-contain rounded-2xl"
              loaderImage="/GlowLoadingGif.gif"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="px-4 pb-8 space-y-4">
        <div className="flex gap-2 justify-center">
          {portfolio.images.map((_, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-6" : "bg-white/30"}`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onClose();
              onBookService?.();
            }}
            className="flex-1 py-3.5 bg-white rounded-2xl font-bold text-sm text-black flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            Book This Style
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSaved(!isSaved)}
            className={`py-3.5 px-5 rounded-2xl border transition-all ${isSaved ? "bg-red-500/20 border-red-500/50" : "bg-white/10 backdrop-blur-xl border-white/20"
              }`}
          >
            <Heart size={20} className={isSaved ? "text-red-500 fill-red-500" : "text-white"} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const UploadModal = ({ isOpen, onClose, onUploadPost, onUploadReel, postsCount, reelsCount, vendorId: uploadVendorId }) => {
  const [uploadType, setUploadType] = useState(null);
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileRaw, setSelectedFileRaw] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [locationMode, setLocationMode] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [bunnyConfig, setBunnyConfig] = useState(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [configError, setConfigError] = useState(false);

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);
  const objectUrlsRef = useRef([]);
  const uploadInProgressRef = useRef(false);

  useBodyScrollLock(isOpen);

  const MAX_POSTS = 6;
  const MAX_REELS = 12;
  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const isPostsFull = postsCount >= MAX_POSTS;
  const isReelsFull = reelsCount >= MAX_REELS;

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      // Cleanup object URLs
      objectUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // Ignore errors
        }
      });
      objectUrlsRef.current = [];
      // Abort any ongoing upload
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (e) {
          // Ignore errors
        }
      }
    };
  }, []);

  // Fetch Bunny config on mount (with caching)
  useEffect(() => {
    if (isOpen && !bunnyConfig && !isLoadingConfig && !configError) {
      fetchBunnyConfig();
    }
  }, [isOpen, bunnyConfig, isLoadingConfig, configError]);

  // Safe state update helper
  const safeSetState = useCallback((setter, value) => {
    if (mountedRef.current) {
      setter(value);
    }
  }, []);

  const fetchBunnyConfig = async () => {
    if (isLoadingConfig) return;

    setIsLoadingConfig(true);
    setConfigError(false);

    try {
      const response = await fetch(`/api/vendor/${vendor?.username}/profile/upload-config`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        safeSetState(setBunnyConfig, result.data);
      } else {
        throw new Error(result.error || "Invalid config response");
      }
    } catch (error) {
      console.error("Config fetch error:", error);
      safeSetState(setConfigError, true);
      safeSetState(setUploadError, "Failed to initialize upload service. Please refresh and try again.");
    } finally {
      safeSetState(setIsLoadingConfig, false);
    }
  };

  const handleFileSelect = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleThumbnailSelect = () => {
    if (!isUploading) {
      thumbnailInputRef.current?.click();
    }
  };

  const generateUniqueFilename = useCallback((originalName) => {
    const ext = originalName?.split(".")?.pop()?.toLowerCase() || "bin";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}_${random}.${ext}`;
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  const validateFile = useCallback(
    (file, type) => {
      if (!file) return "No file selected";

      const isVideo = file.type?.startsWith("video/");
      const isImage = file.type?.startsWith("image/");

      if (type === "reel" && !isVideo) {
        return "Please select a video file for reels";
      }

      if (type === "post" && !isVideo && !isImage) {
        return "Please select an image or video file";
      }

      const maxSize = isVideo ? MAX_FILE_SIZE : MAX_IMAGE_SIZE;
      if (file.size > maxSize) {
        return `File size (${formatFileSize(file.size)}) exceeds limit of ${formatFileSize(maxSize)}`;
      }

      return null;
    },
    [formatFileSize],
  );

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadError("");

      // Validate file
      const validationError = validateFile(file, uploadType);
      if (validationError) {
        setUploadError(validationError);
        e.target.value = "";
        return;
      }

      setSelectedFileRaw(file);

      // Create object URL and track it for cleanup
      const objectUrl = URL.createObjectURL(file);
      objectUrlsRef.current.push(objectUrl);
      setSelectedFile(objectUrl);

      // Reset input for re-selection
      e.target.value = "";
    },
    [uploadType, validateFile],
  );

  const handleThumbnailChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setUploadError("Thumbnail must be an image file");
        e.target.value = "";
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setUploadError(`Thumbnail size exceeds ${formatFileSize(MAX_IMAGE_SIZE)}`);
        e.target.value = "";
        return;
      }

      setThumbnailFile(file);

      const objectUrl = URL.createObjectURL(file);
      objectUrlsRef.current.push(objectUrl);
      setThumbnailPreview(objectUrl);

      e.target.value = "";
    },
    [formatFileSize],
  );

  // Upload file directly to Bunny CDN with retry support
  const uploadToBunnyDirect = useCallback(
    async (file, path, onProgress, attempt = 1) => {
      const url = `${bunnyConfig.storageEndpoint}/${path}`;

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Store abort function
        abortControllerRef.current = {
          abort: () => {
            try {
              xhr.abort();
            } catch (e) {
              // Ignore
            }
          },
        };

        let lastProgress = 0;

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && onProgress && mountedRef.current) {
            // Calculate progress as integer (0-100)
            const progress = Math.floor((e.loaded / e.total) * 100);
            // Only update if progress changed (prevents excessive re-renders)
            if (progress !== lastProgress) {
              lastProgress = progress;
              onProgress(progress);
            }
          }
        });

        xhr.addEventListener("load", () => {
          if (!mountedRef.current) {
            reject(new Error("Component unmounted"));
            return;
          }

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(`${bunnyConfig.pullZoneUrl}/${path}`);
          } else if (xhr.status === 0) {
            // Network error - might be worth retrying
            reject(new Error("Network error - please check your connection"));
          } else if (xhr.status >= 500 && attempt < MAX_RETRIES) {
            // Server error - retry
            console.log(`Upload failed with ${xhr.status}, retrying (${attempt}/${MAX_RETRIES})...`);
            setTimeout(() => {
              uploadToBunnyDirect(file, path, onProgress, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, RETRY_DELAY * attempt);
          } else {
            reject(new Error(`Upload failed (${xhr.status}): ${xhr.statusText || "Unknown error"}`));
          }
        });

        xhr.addEventListener("error", () => {
          if (!mountedRef.current) {
            reject(new Error("Component unmounted"));
            return;
          }

          if (attempt < MAX_RETRIES) {
            console.log(`Upload error, retrying (${attempt}/${MAX_RETRIES})...`);
            setTimeout(() => {
              uploadToBunnyDirect(file, path, onProgress, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, RETRY_DELAY * attempt);
          } else {
            reject(new Error("Upload failed - please check your connection and try again"));
          }
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"));
        });

        xhr.addEventListener("timeout", () => {
          if (!mountedRef.current) {
            reject(new Error("Component unmounted"));
            return;
          }

          if (attempt < MAX_RETRIES) {
            console.log(`Upload timeout, retrying (${attempt}/${MAX_RETRIES})...`);
            setTimeout(() => {
              uploadToBunnyDirect(file, path, onProgress, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, RETRY_DELAY * attempt);
          } else {
            reject(new Error("Upload timed out - please try again with a smaller file or better connection"));
          }
        });

        // 10 minute timeout for large files
        xhr.timeout = 600000;

        try {
          xhr.open("PUT", url);
          xhr.setRequestHeader("AccessKey", bunnyConfig.storageZonePassword);
          xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
          xhr.send(file);
        } catch (error) {
          reject(new Error(`Failed to start upload: ${error.message}`));
        }
      });
    },
    [bunnyConfig],
  );

  const handleUpload = async () => {
    // Prevent double uploads
    if (!selectedFileRaw || !bunnyConfig || uploadInProgressRef.current) return;

    uploadInProgressRef.current = true;
    safeSetState(setIsUploading, true);
    safeSetState(setUploadProgress, 0);
    safeSetState(setUploadError, "");
    safeSetState(setUploadStatus, "Preparing...");

    const isVideo = selectedFileRaw.type?.startsWith("video/");

    try {
      let mediaUrl, storagePath, thumbnailUrl, thumbnailPath;

      const filename = generateUniqueFilename(selectedFileRaw.name);

      if (uploadType === "post") {
        storagePath = `posts/${vendor?.username}/${filename}`;
        safeSetState(setUploadStatus, "Uploading...");

        mediaUrl = await uploadToBunnyDirect(selectedFileRaw, storagePath, (progress) => {
          if (!mountedRef.current) return;

          // Ensure progress is an integer
          const safeProgress = Math.min(Math.floor(progress), 95);
          setUploadProgress(safeProgress);

          if (progress < 30) setUploadStatus("Uploading...");
          else if (progress < 60) setUploadStatus("Processing...");
          else if (progress < 90) setUploadStatus("Almost done...");
          else setUploadStatus("Finalizing...");
        });

        if (!mountedRef.current) return;

        safeSetState(setUploadProgress, 98);
        safeSetState(setUploadStatus, "Saving...");

        // Save metadata to backend
        const response = await fetch(`/api/vendor/${vendor?.username}/profile/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaUrl,
            mediaType: isVideo ? "video" : "image",
            storagePath,
            description: `${caption} ${hashtags}`.trim(),
            location,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error (${response.status})`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to save post");
        }

        if (!mountedRef.current) return;

        safeSetState(setUploadProgress, 100);
        safeSetState(setUploadStatus, "Complete!");

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (mountedRef.current) {
          onUploadPost?.(result.data);
          safeSetState(setUploadSuccess, true);
        }
      } else {
        // Reel upload
        storagePath = `reels/${vendor?.username}/${filename}`;
        safeSetState(setUploadStatus, "Uploading video...");

        const hasThumbnail = !!thumbnailFile;

        mediaUrl = await uploadToBunnyDirect(selectedFileRaw, storagePath, (progress) => {
          if (!mountedRef.current) return;

          // Reserve 10% for thumbnail if exists
          const adjustedProgress = hasThumbnail
            ? Math.min(Math.floor(progress * 0.9), 85)
            : Math.min(Math.floor(progress), 95);

          setUploadProgress(adjustedProgress);

          if (progress < 20) setUploadStatus("Starting upload...");
          else if (progress < 40) setUploadStatus("Uploading video...");
          else if (progress < 60) setUploadStatus("Processing...");
          else if (progress < 80) setUploadStatus("Optimizing...");
          else setUploadStatus("Finalizing video...");
        });

        if (!mountedRef.current) return;

        // Upload thumbnail if provided
        if (thumbnailFile) {
          safeSetState(setUploadStatus, "Uploading thumbnail...");
          const thumbFilename = `thumb_${generateUniqueFilename(thumbnailFile.name)}`;
          thumbnailPath = `reels/${vendor?.username}/thumbnails/${thumbFilename}`;

          try {
            thumbnailUrl = await uploadToBunnyDirect(thumbnailFile, thumbnailPath, (progress) => {
              if (mountedRef.current) {
                setUploadProgress(85 + Math.floor(progress * 0.1));
              }
            });
          } catch (thumbError) {
            console.warn("Thumbnail upload failed:", thumbError.message);
            // Continue without thumbnail - not critical
          }
        }

        if (!mountedRef.current) return;

        safeSetState(setUploadProgress, 98);
        safeSetState(setUploadStatus, "Saving...");

        // Save metadata to backend
        const response = await fetch(`/api/vendor/${vendor?.username}/profile/reels`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoUrl: mediaUrl,
            thumbnail: thumbnailUrl || null,
            storagePath,
            thumbnailPath: thumbnailPath || null,
            title: title.trim() || "Untitled Reel",
            caption: `${caption} ${hashtags}`.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error (${response.status})`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to save reel");
        }

        if (!mountedRef.current) return;

        safeSetState(setUploadProgress, 100);
        safeSetState(setUploadStatus, "Complete!");

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (mountedRef.current) {
          onUploadReel?.(result.data);
          safeSetState(setUploadSuccess, true);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);

      if (mountedRef.current && error.message !== "Upload cancelled" && error.message !== "Component unmounted") {
        safeSetState(setUploadError, error.message || "Upload failed. Please try again.");
      }
    } finally {
      uploadInProgressRef.current = false;
      if (mountedRef.current) {
        safeSetState(setIsUploading, false);
        if (!uploadSuccess) {
          safeSetState(setUploadStatus, "");
        }
      }
    }
  };

  const handleCancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    uploadInProgressRef.current = false;
    safeSetState(setIsUploading, false);
    safeSetState(setUploadStatus, "");
    safeSetState(setUploadProgress, 0);
    safeSetState(setUploadError, "Upload cancelled");
  }, [safeSetState]);

  const resetForm = useCallback(() => {
    setUploadType(null);
    setCaption("");
    setTitle("");
    setHashtags("");
    setLocation("");
    setSelectedFile(null);
    setSelectedFileRaw(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setUploadSuccess(false);
    setUploadProgress(0);
    setUploadStatus("");
    setUploadError("");
    setLocationMode(null);
    setLocationError("");
    setIsDetectingLocation(false);
  }, []);

  const resetAndClose = useCallback(() => {
    if (isUploading) {
      handleCancelUpload();
    }

    onClose();

    // Delay reset to allow animation to complete
    setTimeout(resetForm, 300);
  }, [isUploading, handleCancelUpload, onClose, resetForm]);

  const handleBack = useCallback(() => {
    setUploadType(null);
    setSelectedFile(null);
    setSelectedFileRaw(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setUploadError("");
    setCaption("");
    setTitle("");
    setHashtags("");
    setLocation("");
    setLocationMode(null);
    setLocationError("");
  }, []);

  const retryConfig = useCallback(() => {
    setConfigError(false);
    setUploadError("");
    fetchBunnyConfig();
  }, []);

  const detectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsDetectingLocation(false);
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Location request timed out"));
        }, 15000);

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timeoutId);
            resolve(pos);
          },
          (error) => {
            clearTimeout(timeoutId);
            reject(error);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
          },
        );
      });

      const { latitude, longitude } = position.coords;
      let locationData = null;

      try {
        const osmResponse = await Promise.race([
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`,
            { headers: { "User-Agent": "VendorProfileApp/1.0" } },
          ),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000)),
        ]);

        if (osmResponse.ok) {
          locationData = await osmResponse.json();
        }
      } catch (e) {
        console.warn("OpenStreetMap failed:", e);
      }

      if (!locationData) {
        try {
          const bdcResponse = await Promise.race([
            fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            ),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000)),
          ]);

          if (bdcResponse.ok) {
            const bdcData = await bdcResponse.json();
            locationData = {
              address: {
                neighbourhood: bdcData.locality,
                city: bdcData.city,
                state: bdcData.principalSubdivision,
                country: bdcData.countryName,
              },
            };
          }
        } catch (e) {
          console.warn("BigDataCloud failed:", e);
        }
      }

      if (locationData?.address) {
        const {
          neighbourhood,
          suburb,
          residential,
          locality,
          city,
          town,
          village,
          municipality,
          state,
          state_district,
          country,
        } = locationData.address;
        const parts = [
          neighbourhood || suburb || residential || locality,
          city || town || village || municipality,
          state || state_district,
          country,
        ]
          .filter(Boolean)
          .slice(0, 3);

        if (parts.length > 0) {
          setLocation(parts.join(", "));
          setLocationMode("detect");
          return;
        }
      }

      setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      setLocationMode("detect");
      setLocationError("Location detected (coordinates only)");
    } catch (error) {
      console.error("Location error:", error);
      if (error.code === 1) {
        setLocationError("Location access denied. Please enable permissions.");
      } else if (error.code === 2) {
        setLocationError("Location unavailable. Check device settings.");
      } else if (error.code === 3 || error.message?.includes("timeout")) {
        setLocationError("Location request timed out. Try again.");
      } else {
        setLocationError("Unable to detect location. Enter manually.");
      }
    } finally {
      setIsDetectingLocation(false);
    }
  };

  if (!isOpen) return null;

  const isVideo = selectedFileRaw?.type?.startsWith("video/");
  const canUpload = selectedFile && bunnyConfig && !isUploading && !isLoadingConfig;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={resetAndClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end lg:items-center lg:justify-center lg:p-6"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag={isUploading ? false : "y"}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100 && !isUploading) resetAndClose();
        }}
        className="w-full lg:max-w-3xl bg-white dark:bg-gray-900 rounded-t-[32px] lg:rounded-2xl max-h-[92vh] lg:max-h-[88vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-5 lg:px-8 pt-3 pb-4 border-b border-gray-100 dark:border-gray-800 z-10">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 lg:hidden" />
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {uploadSuccess
                ? "Upload Complete!"
                : uploadType
                  ? `New ${uploadType === "post" ? "Post" : "Reel"}`
                  : "Create"}
            </h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={resetAndClose}
              disabled={isUploading}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full disabled:opacity-50 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              <X size={20} className="text-gray-500" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-80px)] lg:max-h-[calc(88vh-80px)] p-5 lg:p-8">
          <AnimatePresence mode="wait">
            {/* Loading Config State */}
            {isLoadingConfig && !bunnyConfig && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 lg:py-20"
              >
                <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Initializing upload service...</p>
              </motion.div>
            )}

            {/* Config Error State */}
            {configError && !bunnyConfig && (
              <motion.div
                key="config-error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12 lg:py-20 lg:max-w-sm lg:mx-auto"
              >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Connection Error</h4>
                <p className="text-gray-500 mb-6 text-sm">Unable to connect to upload service</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={retryConfig}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Retry Connection
                </motion.button>
              </motion.div>
            )}

            {/* Success State */}
            {uploadSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 lg:py-16 lg:max-w-sm lg:mx-auto"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    delay: 0.2,
                  }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30"
                >
                  <Check size={48} className="text-white" />
                </motion.div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Successfully Uploaded!</h4>
                <p className="text-gray-500 mb-8">Your {uploadType} is now live on your profile</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={resetAndClose}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-bold text-white shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Done
                </motion.button>
              </motion.div>
            )}

            {/* Type Selection */}
            {!uploadType && !uploadSuccess && bunnyConfig && !isLoadingConfig && (
              <motion.div
                key="select-type"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:max-w-xl lg:mx-auto"
              >
                <p className="text-gray-500 text-sm text-center mb-6">What would you like to create?</p>

                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
                  {/* Post Button */}
                  <motion.button
                    whileTap={{ scale: isPostsFull ? 1 : 0.98 }}
                    onClick={() => !isPostsFull && setUploadType("post")}
                    disabled={isPostsFull}
                    className={`w-full p-6 rounded-2xl border flex items-center lg:flex-col lg:items-start lg:text-left gap-4 transition-all cursor-pointer ${isPostsFull
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
                      : "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10"
                      }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${isPostsFull ? "bg-gray-400" : "bg-gradient-to-br from-blue-500 to-purple-600"
                        }`}
                    >
                      <Image size={28} className="text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">New Post</h4>
                      <p className="text-sm text-gray-500">
                        {isPostsFull ? `Maximum ${MAX_POSTS} posts reached` : "Share a photo or video"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {postsCount}/{MAX_POSTS} posts
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 lg:hidden" />
                  </motion.button>

                  {/* Reel Button */}
                  <motion.button
                    whileTap={{ scale: isReelsFull ? 1 : 0.98 }}
                    onClick={() => !isReelsFull && setUploadType("reel")}
                    disabled={isReelsFull}
                    className={`w-full p-6 rounded-2xl border flex items-center lg:flex-col lg:items-start lg:text-left gap-4 transition-all cursor-pointer ${isReelsFull
                      ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed"
                      : "bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 border-pink-100 dark:border-pink-800 hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-lg hover:shadow-pink-500/10"
                      }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${isReelsFull ? "bg-gray-400" : "bg-gradient-to-br from-pink-500 to-orange-500"
                        }`}
                    >
                      <Video size={28} className="text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">New Reel</h4>
                      <p className="text-sm text-gray-500">
                        {isReelsFull ? `Maximum ${MAX_REELS} reels reached` : "Upload a video"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {reelsCount}/{MAX_REELS} reels
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 lg:hidden" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Upload Form */}
            {uploadType && !uploadSuccess && bunnyConfig && (
              <motion.div
                key="upload-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Hidden file inputs */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={
                    uploadType === "reel"
                      ? "video/mp4,video/quicktime,video/webm,video/x-m4v"
                      : "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm,video/x-m4v"
                  }
                  className="hidden"
                />
                {uploadType === "reel" && (
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    onChange={handleThumbnailChange}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                  />
                )}

                {/* Two-column layout for desktop */}
                <div className="flex flex-col lg:flex-row lg:gap-8">
                  {/* Left Column: File Preview */}
                  <div className="lg:w-[340px] xl:w-[380px] lg:flex-shrink-0">
                    <motion.button
                      whileTap={{ scale: isUploading ? 1 : 0.98 }}
                      onClick={handleFileSelect}
                      disabled={isUploading}
                      className={`w-full ${uploadType === "reel" ? "aspect-[9/16] lg:aspect-[9/14]" : "aspect-square"} rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 overflow-hidden ${selectedFile
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                        } ${isUploading ? "pointer-events-none cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {selectedFile ? (
                        <div className="relative w-full h-full">
                          {isVideo ? (
                            <video src={selectedFile} className="w-full h-full object-cover" muted playsInline />
                          ) : (
                            <img src={selectedFile} alt="Preview" className="w-full h-full object-cover" />
                          )}

                          {/* File info badge */}
                          {selectedFileRaw && !isUploading && (
                            <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
                              {formatFileSize(selectedFileRaw.size)}
                            </div>
                          )}

                          {/* Change file badge — desktop */}
                          {!isUploading && (
                            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg backdrop-blur-sm hidden lg:flex items-center gap-1.5">
                              <Upload size={12} />
                              Change
                            </div>
                          )}

                          {/* Upload overlay */}
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                              <div className="text-center px-6">
                                <div className="relative w-28 h-28 mx-auto mb-4">
                                  <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                      cx="56"
                                      cy="56"
                                      r="50"
                                      stroke="rgba(255,255,255,0.2)"
                                      strokeWidth="8"
                                      fill="none"
                                    />
                                    <circle
                                      cx="56"
                                      cy="56"
                                      r="50"
                                      stroke="url(#progressGradient)"
                                      strokeWidth="8"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeDasharray={`${2 * Math.PI * 50}`}
                                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - uploadProgress / 100)}`}
                                      className="transition-all duration-300 ease-out"
                                    />
                                    <defs>
                                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3B82F6" />
                                        <stop offset="50%" stopColor="#8B5CF6" />
                                        <stop offset="100%" stopColor="#EC4899" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">{uploadProgress}%</span>
                                  </div>
                                </div>
                                <p className="text-white font-semibold text-lg">{uploadStatus}</p>
                                <p className="text-white/60 text-sm mt-1">Please don't close this window</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {uploadType === "reel" ? (
                              <Video size={32} className="text-gray-400" />
                            ) : (
                              <Upload size={32} className="text-gray-400" />
                            )}
                          </div>
                          <div className="text-center px-4">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {uploadType === "reel" ? "Tap to select video" : "Tap to select photo or video"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {uploadType === "reel" ? "MP4, MOV, WebM" : "JPG, PNG, WebP, GIF, MP4, MOV"}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Max {uploadType === "reel" || isVideo ? "500MB" : "50MB"}
                            </p>
                          </div>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Right Column: Form Fields & Status */}
                  <div className="flex-1 min-w-0 mt-5 lg:mt-0 space-y-4">
                    {/* Progress Bar (outside preview) */}
                    {isUploading && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">{uploadStatus}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${uploadProgress}%`,
                            }}
                            transition={{
                              duration: 0.3,
                              ease: "easeOut",
                            }}
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                          />
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancelUpload}
                          className="text-sm text-red-500 font-medium hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Cancel Upload
                        </motion.button>
                      </motion.div>
                    )}

                    {/* Error Message */}
                    {uploadError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
                      >
                        <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{uploadError}</p>
                        </div>
                        <button
                          onClick={() => setUploadError("")}
                          className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    )}

                    {/* Offline Warning */}
                    {!isOnline && (
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        You're offline. Upload will resume when connected.
                      </div>
                    )}

                    {/* Thumbnail for reels */}
                    {uploadType === "reel" && selectedFile && !isUploading && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Thumbnail (Optional)
                        </label>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={handleThumbnailSelect}
                          className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center gap-4 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer"
                        >
                          {thumbnailPreview ? (
                            <img src={thumbnailPreview} alt="Thumbnail" className="w-16 h-16 rounded-lg object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <Image size={24} className="text-gray-400" />
                            </div>
                          )}
                          <div className="text-left flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {thumbnailPreview ? "Change thumbnail" : "Add custom thumbnail"}
                            </p>
                            <p className="text-xs text-gray-500">JPG, PNG, WebP • Max 50MB</p>
                          </div>
                          {thumbnailPreview && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setThumbnailFile(null);
                                setThumbnailPreview(null);
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </motion.button>
                      </div>
                    )}

                    {/* Form Fields */}
                    {!isUploading && (
                      <div className="space-y-4">
                        {/* Title (for reels) */}
                        {uploadType === "reel" && (
                          <div className="relative">
                            <Type size={18} className="absolute left-4 top-4 text-gray-400" />
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Reel title..."
                              maxLength={100}
                              className="w-full pl-12 pr-16 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-shadow"
                            />
                            <span className="absolute right-4 top-4 text-xs text-gray-400">{title.length}/100</span>
                          </div>
                        )}

                        {/* Caption */}
                        <div className="relative">
                          <Type size={18} className="absolute left-4 top-4 text-gray-400" />
                          <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write a caption..."
                            maxLength={2200}
                            className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 text-sm outline-none resize-none min-h-[100px] lg:min-h-[120px] focus:ring-2 focus:ring-blue-500/30 transition-shadow"
                          />
                          <span className="absolute bottom-3 right-4 text-xs text-gray-400">{caption.length}/2200</span>
                        </div>

                        {/* Hashtags */}
                        <div className="relative">
                          <Hash size={18} className="absolute left-4 top-4 text-gray-400" />
                          <input
                            type="text"
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                            placeholder="Add hashtags (e.g., #wedding #photography)"
                            className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-shadow"
                          />
                        </div>

                        {/* Location (only for posts) */}
                        {uploadType === "post" && (
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</p>

                            {!locationMode ? (
                              <div className="flex gap-3">
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setLocationMode("manual")}
                                  disabled={isUploading}
                                  className="flex-1 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center gap-2 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                >
                                  <Type size={20} className="text-gray-600 dark:text-gray-400" />
                                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Enter Manually
                                  </span>
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={detectLocation}
                                  disabled={isDetectingLocation || isUploading}
                                  className="flex-1 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 flex flex-col items-center gap-2 disabled:opacity-50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
                                >
                                  {isDetectingLocation ? (
                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <MapPin size={20} className="text-blue-600" />
                                  )}
                                  <span className="text-xs font-medium text-blue-600">
                                    {isDetectingLocation ? "Detecting..." : "Detect Location"}
                                  </span>
                                </motion.button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="relative">
                                  <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
                                  <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter location"
                                    disabled={isUploading}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 text-sm outline-none disabled:opacity-50 focus:ring-2 focus:ring-blue-500/30 transition-shadow"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      setLocationMode(null);
                                      setLocation("");
                                      setLocationError("");
                                    }}
                                    disabled={isUploading}
                                    className="text-xs text-blue-600 font-medium disabled:opacity-50 hover:text-blue-700 transition-colors cursor-pointer"
                                  >
                                    Change method
                                  </motion.button>
                                  {locationMode === "manual" && (
                                    <motion.button
                                      whileTap={{ scale: 0.95 }}
                                      onClick={detectLocation}
                                      disabled={isDetectingLocation || isUploading}
                                      className="text-xs text-blue-600 font-medium flex items-center gap-1 disabled:opacity-50 hover:text-blue-700 transition-colors cursor-pointer"
                                    >
                                      {isDetectingLocation ? (
                                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <MapPin size={12} />
                                      )}
                                      Auto-detect
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            )}

                            {locationError && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl"
                              >
                                <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                                <p className="text-xs text-amber-600 dark:text-amber-400">{locationError}</p>
                              </motion.div>
                            )}

                            {location && locationMode === "detect" && !locationError && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"
                              >
                                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                <p className="text-xs text-green-600 dark:text-green-400">
                                  Location detected successfully
                                </p>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {!isUploading && (
                  <div className="flex gap-3 pt-4 lg:pt-6 border-t border-gray-100 dark:border-gray-800 lg:border-t">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBack}
                      className="px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: canUpload ? 0.95 : 1 }}
                      onClick={handleUpload}
                      disabled={!canUpload}
                      className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Upload size={18} />
                      Upload {uploadType === "post" ? "Post" : "Reel"}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InfoChip = memo(({ icon: Icon, label, value, color = "blue", size = "normal" }) => (
  <div
    className={`flex items-center gap-2 p-2.5 bg-${color}-50 dark:bg-${color}-900/20 rounded-xl ${size === "small" ? "p-2" : ""
      }`}
  >
    <div
      className={`w-8 h-8 rounded-lg bg-${color}-100 dark:bg-${color}-800/30 flex items-center justify-center ${size === "small" ? "w-7 h-7" : ""
        }`}
    >
      <Icon size={size === "small" ? 14 : 16} className={`text-${color}-600 dark:text-${color}-400`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wide">{label}</p>
      <p className={`font-bold text-gray-900 dark:text-white truncate ${size === "small" ? "text-[11px]" : "text-xs"}`}>
        {value}
      </p>
    </div>
  </div>
));
InfoChip.displayName = "InfoChip";

const QuickStatCard = memo(({ icon: Icon, label, value, subtext, color = "blue", gradient }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`relative overflow-hidden p-3 rounded-2xl ${gradient ||
      `bg-gradient-to-br from-${color}-50 to-${color}-100/50 dark:from-${color}-900/30 dark:to-${color}-800/20`
      } border border-${color}-100 dark:border-${color}-800/30`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide mb-0.5">{label}</p>
        <p className="text-lg font-black text-gray-900 dark:text-white">{value}</p>
        {subtext && <p className="text-[9px] text-gray-500 mt-0.5">{subtext}</p>}
      </div>
      <div
        className={`w-10 h-10 rounded-xl bg-${color}-500/10 dark:bg-${color}-400/10 flex items-center justify-center`}
      >
        <Icon size={20} className={`text-${color}-600 dark:text-${color}-400`} />
      </div>
    </div>
  </motion.div>
));
QuickStatCard.displayName = "QuickStatCard";

const PackageCard = memo(({ pkg, isSelected, onSelect }) => (
  <motion.div
    layout
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(pkg.id || pkg._id)}
    className={`bg-white dark:bg-gray-900 p-4 rounded-2xl border-2 transition-all shadow-sm ${isSelected ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-gray-100 dark:border-gray-800"
      } ${pkg.isPopular ? "ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-black" : ""}`}
  >
    {pkg.isPopular && (
      <div className="flex justify-center -mt-7 mb-3">
        <span className="px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black rounded-full flex items-center gap-1.5 shadow-lg">
          <Sparkles size={12} />
          Most Popular
        </span>
      </div>
    )}
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1 pr-3">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{pkg.name}</h4>
        {pkg.duration && (
          <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
            <Clock size={10} />
            {pkg.duration}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        {pkg.originalPrice && (
          <p className="text-[10px] text-gray-400 line-through">₹{Number(pkg.originalPrice).toLocaleString("en-IN")}</p>
        )}
        <p className="text-xl font-black text-blue-600 dark:text-blue-400">
          ₹{Number(pkg.price).toLocaleString("en-IN")}
        </p>
        {pkg.savingsPercentage > 0 && (
          <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-[9px] font-bold rounded-full mt-1">
            Save {pkg.savingsPercentage}%
          </span>
        )}
      </div>
    </div>
    {pkg.features?.length > 0 && (
      <div className="space-y-1.5 mb-3 py-3 border-t border-gray-100 dark:border-gray-800">
        {pkg.features.slice(0, 4).map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <CheckCircle size={12} className="text-green-500 shrink-0 mt-0.5" />
            <span className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">{feature}</span>
          </div>
        ))}
        {pkg.features.length > 4 && (
          <p className="text-[10px] text-blue-500 font-semibold pl-5">+{pkg.features.length - 4} more included</p>
        )}
      </div>
    )}
    {pkg.notIncluded?.length > 0 && (
      <div className="mb-3">
        {pkg.notIncluded.slice(0, 2).map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 opacity-60">
            <X size={11} className="text-gray-400 shrink-0" />
            <span className="text-[10px] text-gray-400 line-through">{feature}</span>
          </div>
        ))}
      </div>
    )}
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${isSelected
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
    >
      {isSelected ? "✓ Selected" : "Select Package"}
    </motion.button>
  </motion.div>
));
PackageCard.displayName = "PackageCard";

const CategorySpecificSection = memo(({ vendor, formatPrice }) => {
  const category = vendor.category;
  if (!category) return null;

  const renderContent = () => {
    switch (category) {
      case "venues":
        return (
          <div className="space-y-4">
            {(vendor.seating?.min || vendor.seating?.max || vendor.floating?.min || vendor.floating?.max) && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users size={16} className="text-blue-500" />
                  Capacity Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {(vendor.seating?.min || vendor.seating?.max) && (
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Seating Capacity</p>
                      <p className="text-lg font-black text-blue-700 dark:text-blue-400">
                        {vendor.seating?.min || 0} - {vendor.seating?.max || 0}
                      </p>
                      <p className="text-[9px] text-gray-500">guests</p>
                    </div>
                  )}
                  {(vendor.floating?.min || vendor.floating?.max) && (
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Floating Capacity</p>
                      <p className="text-lg font-black text-purple-700 dark:text-purple-400">
                        {vendor.floating?.min || 0} - {vendor.floating?.max || 0}
                      </p>
                      <p className="text-[9px] text-gray-500">guests</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {(vendor.halls || vendor.rooms?.count || vendor.parking?.capacity) && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Building2 size={16} className="text-green-500" />
                  Venue Facilities
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {vendor.halls && <QuickStatCard icon={Building2} label="Halls" value={vendor.halls} color="green" />}
                  {vendor.rooms?.count && (
                    <QuickStatCard icon={Building} label="Rooms" value={vendor.rooms.count} color="blue" />
                  )}
                  {vendor.parking?.capacity && (
                    <QuickStatCard
                      icon={Car}
                      label="Parking"
                      value={vendor.parking.capacity}
                      subtext={vendor.parking.valet ? "Valet Available" : ""}
                      color="orange"
                    />
                  )}
                </div>
              </div>
            )}
            {vendor.areas?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-orange-500" />
                  Available Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.areas.map((area, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-[11px] font-semibold"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.foodPolicy && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <UtensilsCrossed size={18} className="text-amber-600" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Food Policy</p>
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{vendor.foodPolicy}</p>
                </div>
              </div>
            )}
          </div>
        );

      case "mehendi":
        return (
          <div className="space-y-4">
            {vendor.designs?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Palette size={16} className="text-amber-500" />
                  Design Styles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.designs
                    .filter((d) => !d.includes(",") && !d.includes("₹"))
                    .map((design, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-300 rounded-full text-[11px] font-semibold border border-amber-200 dark:border-amber-800"
                      >
                        {design}
                      </span>
                    ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-green-500" />
                Pricing Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {vendor.pricePerHand && (
                  <QuickStatCard icon={Hand} label="Per Hand" value={formatPrice(vendor.pricePerHand)} color="green" />
                )}
                {vendor.bridalPackagePrice && (
                  <QuickStatCard
                    icon={Crown}
                    label="Bridal Package"
                    value={formatPrice(vendor.bridalPackagePrice)}
                    color="pink"
                  />
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-blue-500" />
                Service Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {vendor.teamSize && (
                  <InfoChip icon={Users} label="Team Size" value={`${vendor.teamSize}+ Artists`} color="blue" />
                )}
                {vendor.dryingTime && (
                  <InfoChip icon={Clock} label="Drying Time" value={vendor.dryingTime} color="purple" />
                )}
              </div>
              <div className="mt-3 space-y-2">
                {vendor.organic && (
                  <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Leaf size={14} className="text-green-500" />
                    <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">100% Organic Henna</span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
                {vendor.travelToVenue && (
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <MapPin size={14} className="text-blue-500" />
                    <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                      Travel to Venue Available
                    </span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
                {vendor.colorGuarantee && (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <Droplets size={14} className="text-amber-500" />
                    <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                      {vendor.colorGuarantee}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "photographers":
        return (
          <div className="space-y-4">
            {vendor.services?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Camera size={16} className="text-purple-500" />
                  Photography Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-[11px] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.deliverables?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Package size={16} className="text-blue-500" />
                  Deliverables
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.deliverables.map((d, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-[11px] font-semibold"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-gray-500" />
                Service Info
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {vendor.deliveryTime && (
                  <QuickStatCard icon={Clock} label="Delivery" value={`${vendor.deliveryTime} weeks`} color="blue" />
                )}
                {vendor.teamSize && <QuickStatCard icon={Users} label="Team" value={vendor.teamSize} color="purple" />}
                {vendor.travelCost && (
                  <QuickStatCard icon={MapPin} label="Travel" value={vendor.travelCost} color="green" />
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {vendor.videographyIncluded && (
                  <div className="flex items-center gap-2 p-2.5 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                    <Video size={14} className="text-pink-500" />
                    <span className="text-[11px] font-medium">Videography</span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
                {vendor.droneAvailable && (
                  <div className="flex items-center gap-2 p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <Camera size={14} className="text-indigo-500" />
                    <span className="text-[11px] font-medium">Drone</span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "planners":
        return (
          <div className="space-y-4">
            {vendor.specializations?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Star size={16} className="text-indigo-500" />
                  Specializations
                </h4>
                <div className="space-y-2">
                  {vendor.specializations.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl"
                    >
                      <CheckCircle size={14} className="text-indigo-500" />
                      <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {vendor.eventsManaged?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-green-500" />
                  Events Managed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.eventsManaged.map((e, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-[11px] font-semibold"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                Team & Network
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {vendor.teamSize && <QuickStatCard icon={Users} label="Team" value={vendor.teamSize} color="blue" />}
                {vendor.vendorNetwork && (
                  <QuickStatCard icon={Globe} label="Network" value={`${vendor.vendorNetwork}+`} color="purple" />
                )}
                {vendor.feeStructure && (
                  <QuickStatCard icon={DollarSign} label="Fee" value={vendor.feeStructure} color="green" />
                )}
              </div>
            </div>
            {vendor.budgetRange && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <DollarSign size={16} className="text-green-500" />
                  Budget Range
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">From</p>
                    <p className="text-lg font-black text-green-700 dark:text-green-400">
                      {formatPrice(vendor.budgetRange.min)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Up To</p>
                    <p className="text-lg font-black text-blue-700 dark:text-blue-400">
                      {formatPrice(vendor.budgetRange.max)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {vendor.destinationWeddings !== undefined && (
              <div
                className={`p-3 rounded-xl flex items-center gap-3 ${vendor.destinationWeddings
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-gray-50 dark:bg-gray-800"
                  }`}
              >
                {vendor.destinationWeddings ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <X size={18} className="text-gray-400" />
                )}
                <div>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white">Destination Weddings</p>
                  <p className="text-[9px] text-gray-500">
                    {vendor.destinationWeddings ? "Available" : "Not Available"}
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case "makeup":
        return (
          <div className="space-y-4">
            {vendor.services?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Paintbrush2 size={16} className="text-pink-500" />
                  Makeup Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-[11px] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.brandsUsed?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Award size={16} className="text-purple-500" />
                  Premium Brands
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.brandsUsed.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-[11px] font-semibold"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.trialPolicy && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  Trial Policy
                </h4>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      size={16}
                      className={vendor.trialPolicy.available ? "text-green-500" : "text-gray-400"}
                    />
                    <span className="text-[11px] font-medium">
                      {vendor.trialPolicy.available ? "Trial Available" : "No Trial"}
                    </span>
                  </div>
                  {vendor.trialPolicy.available && vendor.trialPolicy.paid && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold">
                      ₹{vendor.trialPolicy.price}
                    </span>
                  )}
                  {vendor.trialPolicy.available && !vendor.trialPolicy.paid && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold">Free</span>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "catering":
        return (
          <div className="space-y-4">
            {vendor.cuisines?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <UtensilsCrossed size={16} className="text-orange-500" />
                  Cuisines
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.cuisines.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-[11px] font-semibold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.menuTypes?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-green-500" />
                  Menu Types
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.menuTypes.map((m, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-[11px] font-semibold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                Capacity & Pricing
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {(vendor.minCapacity || vendor.maxCapacity) && (
                  <QuickStatCard
                    icon={Users}
                    label="Capacity"
                    value={`${vendor.minCapacity || 50}-${vendor.maxCapacity || 1000}`}
                    color="blue"
                  />
                )}
                {vendor.liveCounters && (
                  <QuickStatCard icon={Flame} label="Live Counters" value="Available" color="red" />
                )}
              </div>
              {vendor.pricePerPlate && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {vendor.pricePerPlate.veg && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                      <p className="text-[9px] text-gray-500 uppercase font-bold">Veg Plate</p>
                      <p className="text-lg font-black text-green-700">₹{vendor.pricePerPlate.veg}</p>
                    </div>
                  )}
                  {vendor.pricePerPlate.nonVeg && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
                      <p className="text-[9px] text-gray-500 uppercase font-bold">Non-Veg Plate</p>
                      <p className="text-lg font-black text-red-700">₹{vendor.pricePerPlate.nonVeg}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "djs":
        return (
          <div className="space-y-4">
            {vendor.genres?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Music size={16} className="text-purple-500" />
                  Music Genres
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.genres.map((g, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-[11px] font-semibold"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-blue-500" />
                Performance Details
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {vendor.performanceDuration && (
                  <QuickStatCard icon={Clock} label="Duration" value={vendor.performanceDuration} color="blue" />
                )}
                {vendor.soundSystemPower && (
                  <QuickStatCard icon={Zap} label="Sound" value={vendor.soundSystemPower} color="orange" />
                )}
                {vendor.setupTime && (
                  <QuickStatCard icon={Timer} label="Setup" value={vendor.setupTime} color="green" />
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {vendor.equipmentProvided && (
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Mic2 size={14} className="text-blue-500" />
                    <span className="text-[11px] font-medium">Equipment Provided</span>
                  </div>
                )}
                {vendor.lightingIncluded && (
                  <div className="flex items-center gap-2 p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                    <Zap size={14} className="text-yellow-500" />
                    <span className="text-[11px] font-medium">Lighting Included</span>
                  </div>
                )}
                {vendor.backupAvailable && (
                  <div className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Shield size={14} className="text-green-500" />
                    <span className="text-[11px] font-medium">Backup Available</span>
                  </div>
                )}
                {vendor.emceeServices && (
                  <div className="flex items-center gap-2 p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Mic2 size={14} className="text-purple-500" />
                    <span className="text-[11px] font-medium">Emcee Services</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  const categoryConfig = CATEGORY_CONFIG[category] || { label: category, icon: FileText, color: "gray" };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-9 h-9 rounded-xl bg-${categoryConfig.color}-100 dark:bg-${categoryConfig.color}-900/30 flex items-center justify-center`}
        >
          <categoryConfig.icon
            size={18}
            className={`text-${categoryConfig.color}-600 dark:text-${categoryConfig.color}-400`}
          />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{categoryConfig.label} Details</h3>
          <p className="text-[10px] text-gray-500">Category-specific information</p>
        </div>
      </div>
      {content}
    </div>
  );
});
CategorySpecificSection.displayName = "CategorySpecificSection";

const CollapsibleSection = memo(
  ({ title, icon: Icon, iconColor, iconBg, children, defaultOpen = true, badge, badgeColor = "blue" }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <motion.div
        layout
        className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-left active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors"
          whileTap={{ scale: 0.995 }}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg || "bg-blue-50 dark:bg-blue-900/20"
                  }`}
              >
                <Icon className={iconColor || "text-blue-500"} size={18} />
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
              {badge && (
                <span className={`text-[9px] font-semibold text-${badgeColor}-600 dark:text-${badgeColor}-400`}>
                  {badge}
                </span>
              )}
            </div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: "easeInOut" }}>
            <ChevronDown size={18} className="text-gray-400" />
          </motion.div>
        </motion.button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={collapseVariants}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <div className="px-4 pb-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
);
CollapsibleSection.displayName = "CollapsibleSection";

const CategoryHighlights = memo(({ vendor }) => {
  const category = vendor.category;
  if (!category) return null;

  const renderHighlights = () => {
    switch (category) {
      case "mehendi":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.designs?.length > 0 && (
              <InfoChip
                icon={Palette}
                label="Styles"
                value={`${vendor.designs.filter((d) => !d.includes(",") && !d.includes("₹")).length}+ Designs`}
                color="amber"
              />
            )}
            {vendor.teamSize && (
              <InfoChip icon={Users} label="Team Size" value={`${vendor.teamSize}+ Artists`} color="blue" />
            )}
            {vendor.pricePerHand && (
              <InfoChip icon={Hand} label="Price/Hand" value={formatPrice(vendor.pricePerHand)} color="green" />
            )}
            {vendor.bridalPackagePrice && (
              <InfoChip
                icon={Crown}
                label="Bridal Package"
                value={formatPrice(vendor.bridalPackagePrice)}
                color="pink"
              />
            )}
            {vendor.organic && (
              <div className="col-span-2 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                  <Leaf size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700 dark:text-green-400">100% Organic Henna</p>
                  <p className="text-[9px] text-green-600/70">Natural, chemical-free & skin-safe</p>
                </div>
                <CheckCircle size={16} className="text-green-500 ml-auto" />
              </div>
            )}
            {/* {vendor.travelToVenue && (
              <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <MapPin size={14} className="text-blue-500" />
                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Travel to Venue</span>
                <CheckCircle size={12} className="text-green-500 ml-auto" />
              </div>
            )} */}
          </div>
        );
      case "venues":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.seating && (
              <InfoChip
                icon={Users}
                label="Seating"
                value={`${vendor.seating.min || 0}-${vendor.seating.max || 0}`}
                color="blue"
              />
            )}
            {vendor.floating && (
              <InfoChip
                icon={Users}
                label="Floating"
                value={`${vendor.floating.min || 0}-${vendor.floating.max || 0}`}
                color="purple"
              />
            )}
            {vendor.halls && <InfoChip icon={Building2} label="Halls" value={vendor.halls} color="green" />}
            {vendor.parking?.capacity && (
              <InfoChip icon={Car} label="Parking" value={`${vendor.parking.capacity} spots`} color="orange" />
            )}
          </div>
        );
      case "photographers":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.teamSize && (
              <InfoChip icon={Users} label="Team" value={`${vendor.teamSize} members`} color="purple" />
            )}
            {vendor.deliveryTime && (
              <InfoChip icon={Clock} label="Delivery" value={`${vendor.deliveryTime} weeks`} color="blue" />
            )}
            {vendor.videographyIncluded && <InfoChip icon={Video} label="Video" value="Included" color="pink" />}
            {vendor.droneAvailable && <InfoChip icon={Camera} label="Drone" value="Available" color="green" />}
          </div>
        );
      case "catering":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.cuisines?.length > 0 && (
              <InfoChip
                icon={UtensilsCrossed}
                label="Cuisines"
                value={`${vendor.cuisines.length}+ types`}
                color="orange"
              />
            )}
            {(vendor.minCapacity || vendor.maxCapacity) && (
              <InfoChip
                icon={Users}
                label="Capacity"
                value={`${vendor.minCapacity || 50}-${vendor.maxCapacity || 1000}`}
                color="blue"
              />
            )}
            {vendor.pricePerPlate?.veg && (
              <InfoChip icon={Utensils} label="Veg Plate" value={formatPrice(vendor.pricePerPlate.veg)} color="green" />
            )}
            {vendor.liveCounters && <InfoChip icon={Flame} label="Live Counters" value="Available" color="red" />}
          </div>
        );
      case "djs":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.genres?.length > 0 && (
              <InfoChip icon={Music} label="Genres" value={`${vendor.genres.length}+ styles`} color="purple" />
            )}
            {vendor.performanceDuration && (
              <InfoChip icon={Clock} label="Duration" value={vendor.performanceDuration} color="blue" />
            )}
            {vendor.soundSystemPower && (
              <InfoChip icon={Mic2} label="Sound" value={vendor.soundSystemPower} color="orange" />
            )}
            {vendor.lightingIncluded && <InfoChip icon={Zap} label="Lighting" value="Included" color="yellow" />}
          </div>
        );
      case "makeup":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.services?.length > 0 && (
              <InfoChip icon={Paintbrush2} label="Services" value={`${vendor.services.length}+ types`} color="pink" />
            )}
            {vendor.brandsUsed?.length > 0 && (
              <InfoChip icon={Award} label="Brands" value={`${vendor.brandsUsed.length}+ premium`} color="purple" />
            )}
            {vendor.travelToVenue && <InfoChip icon={MapPin} label="Travel" value="Available" color="blue" />}
            {vendor.trialPolicy?.available && (
              <InfoChip
                icon={Calendar}
                label="Trial"
                value={vendor.trialPolicy.paid ? `₹${vendor.trialPolicy.price}` : "Free"}
                color="green"
              />
            )}
          </div>
        );
      case "planners":
        return (
          <div className="grid grid-cols-2 gap-2">
            {vendor.teamSize && (
              <InfoChip icon={Users} label="Team" value={`${vendor.teamSize} members`} color="indigo" />
            )}
            {vendor.vendorNetwork && (
              <InfoChip icon={Globe} label="Network" value={`${vendor.vendorNetwork}+ vendors`} color="purple" />
            )}
            {vendor.feeStructure && (
              <InfoChip icon={DollarSign} label="Fee Type" value={vendor.feeStructure} color="green" />
            )}
            {vendor.destinationWeddings && (
              <InfoChip icon={MapPin} label="Destination" value="Available" color="blue" />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const content = renderHighlights();
  if (!content) return null;

  const categoryConfig = CATEGORY_CONFIG[category] || { label: category, icon: FileText, color: "gray" };

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-8 h-8 rounded-lg bg-${categoryConfig.color}-100 dark:bg-${categoryConfig.color}-900/30 flex items-center justify-center`}
        >
          <categoryConfig.icon
            size={16}
            className={`text-${categoryConfig.color}-600 dark:text-${categoryConfig.color}-400`}
          />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{categoryConfig.label} Highlights</h3>
      </div>
      {content}
    </motion.div>
  );
});
CategoryHighlights.displayName = "CategoryHighlights";

const SocialLinksSection = memo(({ socialLinks }) => {
  if (!socialLinks || !Object.values(socialLinks).some(Boolean)) return null;

  const links = [
    { key: "website", icon: Globe, label: "Website", color: "gray", bg: "bg-gray-100 dark:bg-gray-800" },
    {
      key: "instagram",
      icon: Instagram,
      label: "Instagram",
      color: "pink",
      bg: "bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30",
    },
    { key: "facebook", icon: Facebook, label: "Facebook", color: "blue", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { key: "youtube", icon: Youtube, label: "YouTube", color: "red", bg: "bg-red-100 dark:bg-red-900/30" },
    { key: "twitter", icon: Twitter, label: "Twitter", color: "sky", bg: "bg-sky-100 dark:bg-sky-900/30" },
    { key: "linkedin", icon: Linkedin, label: "LinkedIn", color: "blue", bg: "bg-blue-100 dark:bg-blue-900/30" },
  ].filter((l) => socialLinks[l.key]);

  if (links.length === 0) return null;

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Globe size={16} className="text-indigo-600" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Connect With Us</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <motion.a
            key={link.key}
            href={socialLinks[link.key]}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 ${link.bg} rounded-xl flex items-center gap-2 transition-shadow hover:shadow-md`}
          >
            <link.icon size={18} className={`text-${link.color}-600`} />
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{link.label}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
});
SocialLinksSection.displayName = "SocialLinksSection";

const BookingDrawer = ({ isOpen, onClose, services, vendorName, onBookingConfirmed }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [step, setStep] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  useBodyScrollLock(isOpen);

  const handleBook = async () => {
    if (selectedService && selectedDate && selectedSlot) {
      setIsBooking(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsBooking(false);
      setBookingSuccess(true);
      onBookingConfirmed?.({
        service: selectedService,
        date: selectedDate,
        slot: selectedSlot,
      });
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedService(null);
      setSelectedDate("");
      setSelectedSlot("");
      setBookingSuccess(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={resetAndClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end lg:items-center lg:justify-center lg:p-6"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) resetAndClose();
        }}
        className="w-full lg:max-w-2xl bg-white dark:bg-gray-900 rounded-t-[32px] lg:rounded-2xl max-h-[92vh] lg:max-h-[85vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-5 lg:px-8 pt-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          {/* Drag handle — mobile only */}
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 lg:hidden" />

          {bookingSuccess ? (
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Confirmed!</h3>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Book {vendorName}</h3>
                  <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={resetAndClose}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <X size={20} className="text-gray-500" />
                </motion.button>
              </div>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    animate={{ scaleX: s <= step ? 1 : 0.5 }}
                    className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(92vh-200px)] lg:max-h-[calc(85vh-200px)] p-5 lg:p-8">
          <AnimatePresence mode="wait">
            {bookingSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    delay: 0.2,
                  }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30"
                >
                  <Check size={48} className="text-white" />
                </motion.div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're All Set!</h4>
                <p className="text-gray-500 mb-6">Your booking has been confirmed</p>
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-left space-y-3 mb-6 lg:max-w-md lg:mx-auto">
                  {[
                    { label: "Service", value: selectedService?.name },
                    { label: "Date", value: selectedDate },
                    { label: "Time", value: selectedSlot },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={resetAndClose}
                  className="w-full lg:max-w-md lg:mx-auto py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl font-bold text-white hover:opacity-90 transition-opacity cursor-pointer block"
                >
                  Done
                </motion.button>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Select a Service</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <motion.button
                      key={service.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedService(service)}
                      className={`w-full p-5 rounded-2xl border-2 transition-all text-left cursor-pointer ${selectedService?.id === service.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white">{service.name}</span>
                          {service.popular && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[9px] font-bold rounded-full flex items-center gap-1">
                              <Sparkles size={8} />
                              POPULAR
                            </span>
                          )}
                        </div>
                        <span className="font-black text-blue-600 text-lg">{service.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{service.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {service.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          {service.rating}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : step === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Select Date & Time</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {AVAILABILITY_SLOTS.map((day) => (
                    <div key={day.date} className="space-y-3">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{day.date}</p>
                      <div className="flex flex-wrap gap-2">
                        {day.slots.map((slot) => (
                          <motion.button
                            key={`${day.date}-${slot}`}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedDate(day.date);
                              setSelectedSlot(slot);
                            }}
                            className={`px-5 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${selectedDate === day.date && selectedSlot === slot
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                          >
                            {slot}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 lg:max-w-lg lg:mx-auto"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Confirm Booking</h4>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800 space-y-4">
                  {[
                    { label: "Service", value: selectedService?.name },
                    { label: "Date", value: selectedDate },
                    { label: "Time", value: selectedSlot },
                    {
                      label: "Duration",
                      value: selectedService?.duration,
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-blue-200 dark:border-blue-700 flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-black text-2xl text-blue-600">{selectedService?.price}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Free cancellation up to 24 hours before the appointment
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {!bookingSuccess && (
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-5 lg:px-8 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
            {step > 1 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step - 1)}
                className="px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Back
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (step < 3) setStep(step + 1);
                else handleBook();
              }}
              disabled={(step === 1 && !selectedService) || (step === 2 && !selectedSlot) || isBooking}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-white disabled:opacity-50 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
            >
              {isBooking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : step === 3 ? (
                "Confirm Booking"
              ) : (
                "Continue"
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ReviewsDrawer = ({ isOpen, onClose, reviewsData }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  // Extract data from the new structure
  const reviews = reviewsData || reviewsData?.data || [];
  const stats = reviewsData?.data?.stats || {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  // Calculate percentage for rating bars
  const getPercentage = (rating) => {
    if (stats.totalReviews === 0) return 0;
    return ((stats.distribution[rating] || 0) / stats.totalReviews) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end lg:items-center lg:justify-center lg:p-6"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="w-full lg:max-w-2xl bg-white dark:bg-gray-900 rounded-t-[32px] lg:rounded-2xl max-h-[88vh] lg:max-h-[85vh] overflow-hidden lg:shadow-2xl"
      >
        {/* Header with Stats */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 px-5 lg:px-8 pt-3 pb-4 border-b border-gray-100 dark:border-gray-800 z-10">
          {/* Drag handle — mobile only */}
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4 lg:hidden" />

          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reviews</h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <X size={20} className="text-gray-500" />
            </motion.button>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-4 lg:gap-6 mt-4 p-4 lg:p-5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl">
            <div className="text-center">
              <span className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
                {stats.averageRating.toFixed(1)}
              </span>
              <div className="flex mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= Math.round(stats.averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{rating}</span>
                  <div className="flex-1 h-1.5 lg:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                      style={{ width: `${getPercentage(rating)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{stats.distribution[rating] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="overflow-y-auto max-h-[calc(88vh-220px)] lg:max-h-[calc(85vh-240px)] p-5 lg:p-8">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 space-y-3"
                >
                  {/* User Info and Rating */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 flex-shrink-0">
                        <SmartMedia
                          src={review.userAvatar}
                          type="image"
                          className="w-full h-full object-cover"
                          loaderImage="/GlowLoadingGif.gif"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">
                          {review.userName || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={
                            star <= review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300 dark:text-gray-600"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{review.title}</h4>
                  )}

                  {/* Review Text */}
                  {review.text && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{review.text}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const MoreOptionsDrawer = ({
  isOpen,
  onClose,
  onReport,
  onBlock,
  isSaved,
  onSave,
  isNotifying,
  onNotify,
  onShare,
  onShowQR,
  onShowAbout,
  onCopyLink,
  setShowUpdateProfileDrawer,
  onVerifyIdentity, // Add this new prop
  isVerified,
}) => {
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  useBodyScrollLock(isOpen);

  const handleReport = () => {
    setShowReportConfirm(false);
    onReport();
    onClose();
  };

  const handleBlock = () => {
    setShowBlockConfirm(false);
    onBlock();
    onClose();
  };

  if (!isOpen) return null;

  const options = [
    {
      id: "save",
      label: isSaved ? "Remove from Saved" : "Save Profile",
      icon: isSaved ? BookmarkCheck : Bookmark,
      action: () => {
        onSave();
      },
    },
    {
      id: "verify",
      label: isVerified ? "Identity Verified" : "Verify Identity",
      icon: isVerified ? ShieldCheck : Shield,
      action: () => {
        if (!isVerified) {
          onVerifyIdentity?.();
          onClose();
        }
      },
      verified: isVerified,
    },
    ...(isVerified
      ? [
        {
          id: "updateProfile",
          label: "Update Profile",
          icon: Edit3,
          action: () => {
            setShowUpdateProfileDrawer(true);
            onClose();
          },
        },
      ]
      : []),
    {
      id: "notify",
      label: isNotifying ? "Turn Off Notifications" : "Turn On Notifications",
      icon: isNotifying ? BellOff : Bell,
      action: () => {
        onNotify();
      },
    },
    {
      id: "share",
      label: "Share Profile",
      icon: Share2,
      action: () => {
        onShare?.();
        onClose();
      },
    },
    {
      id: "copy",
      label: "Copy Profile Link",
      icon: Link2,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        onCopyLink?.();
        onClose();
      },
    },
    {
      id: "qr",
      label: "Show QR Code",
      icon: QrCode,
      action: () => {
        onShowQR?.();
        onClose();
      },
    },
    {
      id: "about",
      label: "About This Account",
      icon: Info,
      action: () => {
        onShowAbout?.();
        onClose();
      },
    },
    { id: "report", label: "Report Profile", icon: Flag, action: () => setShowReportConfirm(true), danger: true },
    { id: "block", label: "Block Profile", icon: UserMinus, action: () => setShowBlockConfirm(true), danger: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end lg:items-center lg:justify-center lg:p-6"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="w-full lg:max-w-md bg-white dark:bg-gray-900 rounded-t-[32px] lg:rounded-2xl p-5 pb-8 lg:pb-6 lg:shadow-2xl lg:max-h-[85vh] lg:overflow-y-auto"
      >
        {/* Drag handle — mobile only */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5 lg:hidden" />

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">More Options</h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showReportConfirm ? (
            <motion.div
              key="report-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Report Profile?</h3>
                <p className="text-sm text-gray-500">This will submit the profile for review by our team.</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReportConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReport}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-semibold text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Report
                </motion.button>
              </div>
            </motion.div>
          ) : showBlockConfirm ? (
            <motion.div
              key="block-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <UserMinus size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Block Profile?</h3>
                <p className="text-sm text-gray-500">You won't see this profile anymore.</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBlockConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBlock}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-semibold text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Block
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {options.map((option, idx) => (
                <React.Fragment key={option.id}>
                  {idx === 6 && <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={option.action}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors cursor-pointer ${option.danger
                      ? "text-red-500 active:bg-red-50 dark:active:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : option.verified
                        ? "text-green-600 dark:text-green-400 active:bg-green-50 dark:active:bg-green-900/20 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-default"
                        : "text-gray-900 dark:text-white active:bg-gray-50 dark:active:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                  >
                    <option.icon size={22} />
                    <span className="font-medium">{option.label}</span>
                  </motion.button>
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const ShareModal = ({ isOpen, onClose, vendorName }) => {
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const shareOptions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      action: () => {
        window.open(`https://wa.me/?text=Check out ${vendorName}! ${currentUrl}`);
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
          `https://twitter.com/intent/tweet?text=Check out ${vendorName}!&url=${encodeURIComponent(currentUrl)}`,
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
      action: () => {
        onClose();
      },
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      color: "bg-gray-600",
      action: () => {
        window.open(`mailto:?subject=Check out ${vendorName}&body=${encodeURIComponent(currentUrl)}`);
        onClose();
      },
    },
    {
      id: "sms",
      label: "Message",
      icon: MessageSquare,
      color: "bg-green-600",
      action: () => {
        window.open(`sms:?body=Check out ${vendorName}! ${currentUrl}`);
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
      downloadLink.download = `${vendorName?.replace(/\s+/g, "_") || "profile"}_QR.png`;
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
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end lg:items-center lg:justify-center lg:p-6"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="w-full lg:max-w-lg bg-white dark:bg-gray-900 rounded-t-[32px] lg:rounded-2xl p-5 pb-8 lg:pb-6 lg:shadow-2xl"
      >
        {/* Drag handle — mobile only */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5 lg:hidden" />

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between mb-5">
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
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowQR(false)}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={18} className="text-gray-600 dark:text-gray-400" />
                </motion.button>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">QR Code</h3>
                <div className="w-10" />
              </div>

              {/* QR Code */}
              <div className="flex justify-center py-4">
                <div className="bg-white p-4 rounded-2xl shadow-lg">
                  <QRCodeSVG
                    id="share-qr-code"
                    value={currentUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              </div>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400">Scan to visit this profile</p>

              {/* URL display */}
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 break-all text-center">{currentUrl}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadQR}
                  className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <Download size={18} />
                  Download
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(currentUrl);
                    setCopiedFeedback(true);
                    setTimeout(() => setCopiedFeedback(false), 2000);
                  }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {copiedFeedback ? <Check size={18} /> : <Copy size={18} />}
                  {copiedFeedback ? "Copied!" : "Copy Link"}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="share-options" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Mobile title */}
              <h3 className="text-lg font-bold text-center mb-6 text-gray-900 dark:text-white lg:hidden">
                Share Profile
              </h3>

              {/* QR Code Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowQR(true)}
                className="w-full flex items-center gap-4 p-4 mb-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:from-gray-100 hover:to-gray-150 dark:hover:from-gray-750 dark:hover:to-gray-800 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                  <QrCode size={28} className="text-gray-700 dark:text-gray-300" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">QR Code</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Scan to share instantly</p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </motion.button>

              {/* Share Options Grid */}
              <div className="grid grid-cols-4 gap-5 lg:gap-4">
                {shareOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={option.action}
                    className="flex flex-col items-center gap-2 relative cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${option.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
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
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const QRCodeModal = ({ isOpen, onClose, vendorName }) => {
  const [copied, setCopied] = useState(false);
  useBodyScrollLock(isOpen);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-modal-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "profile_QR.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 w-full max-w-sm lg:max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Scan QR Code</h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </motion.button>
        </div>

        {/* Real QR Code */}
        <div className="bg-white p-4 lg:p-6 rounded-2xl mb-4 flex items-center justify-center shadow-inner">
          <QRCodeSVG
            id="qr-modal-code"
            value={currentUrl}
            size={192}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>

        <p className="text-center text-sm text-gray-500 mb-4 break-all px-2">{`${vendorName}'s Profile Page`}</p>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy Link"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadQR}
            className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Download size={18} />
            Download
          </motion.button>
        </div>

        {/* Share button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({ url: currentUrl });
            }
          }}
          className="w-full mt-3 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <Share2 size={18} />
          Share
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const AboutAccountModal = ({ isOpen, onClose, vendor }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const accountDetails = [
    { label: "Account Type", value: vendor?.isPremium ? "Professional" : "Business" },
    { label: "Category", value: vendor?.category || "Photography" },
    { label: "Joined", value: "March 2022" },
    { label: "Location", value: vendor?.address?.city || "Mumbai, India" },
    { label: "Posts", value: "6" },
    { label: "Reels", value: "12" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white dark:bg-gray-900 rounded-t-[32px] p-5 pb-8"
      >
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />
        <h3 className="text-lg font-bold text-center mb-6 text-gray-900 dark:text-white">About This Account</h3>

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-gray-200 dark:ring-gray-700">
            <SmartMedia
              src={
                vendor?.vendorProfile?.profilePicture ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
              }
              type="image"
              className="w-full h-full object-cover"
              loaderImage="/GlowLoadingGif.gif"
            />
          </div>
          <h4 className="font-bold text-gray-900 dark:text-white">{vendor?.name}</h4>
          <p className="text-sm text-gray-500">
            @{vendor?.username || vendor?.name?.toLowerCase().replace(/\s+/g, "_")}
          </p>
        </div>

        <div className="space-y-3">
          {accountDetails.map((detail, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800"
            >
              <span className="text-gray-500 text-sm">{detail.label}</span>
              <span className="font-semibold text-gray-900 dark:text-white text-sm">{detail.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This account is verified and managed by a registered event vendor on our platform.
            </p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full mt-6 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300"
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const PostPreviewModal = ({ post, onClose }) => {
  useBodyScrollLock(!!post);

  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
      onTouchEnd={onClose}
      onMouseUp={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-2xl"
      >
        <SmartMedia
          src={post.mediaUrl || post.thumbnail}
          type="image"
          className="w-full h-full object-cover"
          loaderImage="/GlowLoadingGif.gif"
        />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute bottom-10 flex items-center gap-4 text-white text-sm"
      >
        <span className="flex items-center gap-1">
          <Heart size={16} className="fill-white" />
          {post.likes}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={16} />
          {post.comments}
        </span>
      </motion.div>
    </motion.div>
  );
};

const PostOptionsDrawer = ({ isOpen, onClose, post, onDelete, onShare, onEdit, onArchive }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post?.caption || post?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useBodyScrollLock(isOpen);

  // Reset caption when post changes
  useEffect(() => {
    if (post) {
      setEditedCaption(post.caption || post.description || "");
    }
  }, [post]);

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
    onClose();
  };

  const handleEdit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (onEdit) {
        await onEdit(editedCaption);
      }
      setShowEditModal(false);
      onClose();
    } catch (error) {
      console.error("Edit error:", error);
      alert("Failed to update caption");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = () => {
    onArchive?.();
    onClose();
  };

  const handleDownload = async () => {
    if (!post?.mediaUrl) return;

    try {
      const response = await fetch(post.mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const extension = post.mediaType === "video" ? "mp4" : "jpg";
      a.download = `post_${post._id || Date.now()}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      onClose();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download");
    }
  };

  if (!isOpen) return null;

  const options = [
    {
      id: "share",
      label: "Share",
      icon: Share2,
      action: () => {
        onShare();
        onClose();
      },
    },
    {
      id: "download",
      label: "Download",
      icon: Download,
      action: handleDownload,
    },
    {
      id: "edit",
      label: "Edit Caption",
      icon: Type,
      action: () => setShowEditModal(true),
    },
    // {
    //   id: "archive",
    //   label: "Archive",
    //   icon: Bookmark,
    //   action: handleArchive,
    // },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      action: () => setShowDeleteConfirm(true),
      danger: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end lg:items-center lg:justify-center lg:p-6"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full lg:max-w-md bg-white dark:bg-gray-900 rounded-t-[32px] lg:rounded-2xl p-5 pb-8 lg:pb-6 lg:shadow-2xl"
      >
        {/* Drag handle — mobile only */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5 lg:hidden" />

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Post Options</h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showEditModal ? (
            <motion.div
              key="edit-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center mb-4 lg:hidden">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Caption</h3>
              </div>
              {/* Desktop title replaces header */}
              <div className="hidden lg:block">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Edit Caption</h3>
                <p className="text-sm text-gray-500">Update your post description</p>
              </div>
              <textarea
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-blue-500 lg:min-h-[120px]"
                rows={4}
                placeholder="Write a caption..."
              />
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditedCaption(post?.caption || post?.description || "");
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-500 rounded-xl font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : showDeleteConfirm ? (
            <motion.div
              key="delete-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Post?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-semibold text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {options.map((option) => (
                <React.Fragment key={option.id}>
                  {option.danger && <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={option.action}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors cursor-pointer ${option.danger
                      ? "text-red-500 active:bg-red-50 dark:active:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-gray-900 dark:text-white active:bg-gray-50 dark:active:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                  >
                    <option.icon size={22} />
                    <span className="font-medium">{option.label}</span>
                  </motion.button>
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const ReelOptionsDrawer = ({ isOpen, onClose, reel, onDelete, onShare, onEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(reel?.title || "");
  const [editCaption, setEditCaption] = useState(reel?.caption || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useBodyScrollLock(isOpen);

  // Reset edit fields when reel changes
  useEffect(() => {
    if (reel) {
      setEditTitle(reel.title || "");
      setEditCaption(reel.caption || "");
    }
  }, [reel]);

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
    onClose();
  };

  const handleSaveEdit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (onEdit) {
        const result = await onEdit(editCaption, editTitle);
        if (result?.success !== false) {
          setShowEditModal(false);
          onClose();
        } else {
          alert(result?.error || "Failed to update reel");
        }
      } else {
        setShowEditModal(false);
        onClose();
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert("Failed to update reel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!reel?.videoUrl) return;

    try {
      const response = await fetch(reel.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reel_${reel._id || Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      onClose();
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download video");
    }
  };

  if (!isOpen) return null;

  const options = [
    {
      id: "share",
      label: "Share Reel",
      icon: Share2,
      action: () => {
        onShare();
        onClose();
      },
    },
    {
      id: "download",
      label: "Download",
      icon: Download,
      action: handleDownload,
    },
    {
      id: "edit",
      label: "Edit Reel",
      icon: Type,
      action: () => setShowEditModal(true),
    },
    {
      id: "delete",
      label: "Delete Reel",
      icon: Trash2,
      action: () => setShowDeleteConfirm(true),
      danger: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end lg:items-center lg:justify-center lg:p-6"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full lg:max-w-md bg-white dark:bg-gray-900 rounded-t-[32px] lg:rounded-2xl p-5 pb-8 lg:pb-6 lg:shadow-2xl"
      >
        {/* Drag handle — mobile only */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5 lg:hidden" />

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reel Options</h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showEditModal ? (
            <motion.div
              key="edit-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center mb-4 lg:hidden">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Reel</h3>
              </div>
              <div className="hidden lg:block">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Edit Reel</h3>
                <p className="text-sm text-gray-500">Update the title and caption</p>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title..."
                />
              </div>

              {/* Caption Input */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Caption</label>
                <textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-blue-500 lg:min-h-[120px]"
                  rows={4}
                  placeholder="Write a caption..."
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditTitle(reel?.title || "");
                    setEditCaption(reel?.caption || "");
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveEdit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-500 rounded-xl font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : showDeleteConfirm ? (
            <motion.div
              key="delete-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Reel?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-500 rounded-xl font-semibold text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {options.map((option) => (
                <React.Fragment key={option.id}>
                  {option.danger && <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={option.action}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors cursor-pointer ${option.danger
                      ? "text-red-500 active:bg-red-50 dark:active:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-gray-900 dark:text-white active:bg-gray-50 dark:active:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                  >
                    <option.icon size={22} />
                    <span className="font-medium">{option.label}</span>
                  </motion.button>
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const StoryShareDrawer = ({ isOpen, onClose, highlight }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const shareOptions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      action: () => {
        window.open(`https://wa.me/?text=Check out this story!`);
        onClose();
      },
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      action: () => {
        onClose();
      },
    },
    {
      id: "twitter",
      label: "Twitter",
      icon: Twitter,
      color: "bg-sky-500",
      action: () => {
        onClose();
      },
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: Copy,
      color: "bg-gray-500",
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        onClose();
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-gray-900 rounded-t-[32px] p-5 pb-8"
      >
        <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />
        <h3 className="text-lg font-bold text-center mb-6 text-white">Share Story</h3>
        <div className="grid grid-cols-4 gap-5">
          {shareOptions.map((option) => (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.9 }}
              onClick={option.action}
              className="flex flex-col items-center gap-2"
            >
              <div className={`w-14 h-14 rounded-2xl ${option.color} flex items-center justify-center shadow-lg`}>
                <option.icon size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-semibold text-gray-400">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ContactDrawer = ({ isOpen, onClose, vendor }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end lg:items-center lg:justify-center lg:p-6"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className="w-full lg:max-w-md bg-white dark:bg-gray-900 rounded-t-[32px] lg:rounded-2xl p-5 pb-8 lg:pb-6 lg:shadow-2xl"
      >
        {/* Drag handle — mobile only */}
        <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5 lg:hidden" />

        {/* Desktop header */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact Options</h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Mobile title */}
        <h3 className="text-lg font-bold text-center mb-6 text-gray-900 dark:text-white lg:hidden">Contact Options</h3>

        <div className="space-y-3">
          <motion.a
            href={`tel:${vendor?.phoneNo || "+919876543210"}`}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Phone size={24} />
            </div>
            <div>
              <p className="font-bold">Call Now</p>
              <p className="text-sm opacity-80">{vendor?.phoneNo || "+91 98765 43210"}</p>
            </div>
            <ChevronRight size={20} className="ml-auto opacity-60" />
          </motion.a>

          <motion.a
            href={`https://wa.me/${vendor?.whatsappNo || vendor?.phoneNo || "919876543210"}`}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30 transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <div>
              <p className="font-bold">WhatsApp</p>
              <p className="text-sm opacity-80">Chat on WhatsApp</p>
            </div>
            <ChevronRight size={20} className="ml-auto opacity-60" />
          </motion.a>

          <motion.a
            href={`mailto:${vendor?.email || "contact@vendor.com"}`}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-shadow cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Mail size={24} />
            </div>
            <div>
              <p className="font-bold">Email</p>
              <p className="text-sm opacity-80">{vendor?.email || "contact@vendor.com"}</p>
            </div>
            <ChevronRight size={20} className="ml-auto opacity-60" />
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

const formatBio = (bio) => {
  if (!bio) return null;

  const lines = bio.split(/[.!?]\s+|[\n]/);
  return lines.map((line, idx) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return null;
    return (
      <React.Fragment key={idx}>
        {trimmedLine}
        {idx < lines.length - 1 && trimmedLine && <br />}
      </React.Fragment>
    );
  });
};

const SUGGESTED_CATEGORIES = [
  { id: 1, name: "Photography", count: 234, icon: Camera, color: "from-purple-500 to-violet-600" },
  { id: 2, name: "Videography", count: 156, icon: Video, color: "from-pink-500 to-rose-600" },
  { id: 3, name: "Catering", count: 189, icon: ChefHat, color: "from-orange-500 to-amber-600" },
  { id: 4, name: "Decoration", count: 98, icon: Sparkles, color: "from-emerald-500 to-teal-600" },
  { id: 5, name: "Venue", count: 67, icon: Building2, color: "from-blue-500 to-indigo-600" },
];

// Right Sidebar Component
const RightSidebar = ({
  categoryColor,
  router,
  vendorProfileId,
  setShowQRModal,
  setShowBookingDrawer,
  setShowUpdateProfileDrawer,
  setShowUploadModal,
  setShowMoreOptions,
  isVerified,
}) => {
  const { user, isSignedIn } = useUser();
  const [similarProfiles, setSimilarProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trustingStates, setTrustingStates] = useState({});
  const [similarLimit, setSimilarLimit] = useState(5);
  const [similarCategories, setSimilarCategories] = useState([]);
  const [error, setError] = useState(null);
  const [similarCategoriesLoading, setSimilarCategoriesLoading] = useState(false);

  const QUICK_SETTINGS = [
    { id: 1, label: "Account Settings", icon: Settings, action: "settings" },
    { id: 4, label: "Manage Bookings", icon: Calendar, action: "booking" },
    { id: 5, label: "Show QR", icon: HelpCircle, action: "show-qr" },
    { id: 6, label: "Copy Link", icon: Languages, action: "copy-link" },
  ];

  useEffect(() => {
    if (isSignedIn && isVerified) {
      QUICK_SETTINGS.push({ id: 2, label: "Update Profile", icon: Pencil, action: "update" });
      QUICK_SETTINGS.push({ id: 3, label: "Upload Media", icon: Upload, action: "upload" });
    }
  }, [isSignedIn, isVerified]);

  useEffect(() => {
    if (vendorProfileId) {
      fetchSimilarProfiles();
      fetchSimilarCategories();
    }
  }, [vendorProfileId, similarLimit]);

  const fetchSimilarProfiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/vendor/profile/similar?vendorProfileId=${vendorProfileId}&limit=${similarLimit}`,
      );
      const data = await response.json();
      if (data.success) {
        setSimilarProfiles(data.data);
      }
    } catch (error) {
      console.error("Error fetching similar profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarCategories = async () => {
    try {
      setSimilarCategoriesLoading(true);
      setError(null);

      const response = await fetch("/api/vendor/profile/similar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorProfileId,
          limit: 5,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSimilarCategories(result.data.similarCategories);
      } else {
        setError(result.error);
      }
      setSimilarCategoriesLoading(false);
    } catch (err) {
      console.error("Error fetching similar categories:", err);
      setError("Failed to load categories");
    } finally {
      setSimilarCategoriesLoading(false);
    }
  };

  const handleSimilarprofileClick = (profile) => {
    if (profile?.username) {
      router.push(`/vendor/${profile.category}/${profile.username}/profile`);
    } else {
      router.push(`/vendor/${profile.category}/profile/${profile.username}`);
    }
  };

  const handleQuickSettingClick = (action) => {
    switch (action) {
      case "settings":
        setShowMoreOptions(true);
        break;
      case "update":
        setShowUpdateProfileDrawer(true);
        break;
      case "upload":
        setShowUploadModal(true);
        break;
      case "show-qr":
        setShowQRModal(true);
        break;
      case "booking":
        setShowBookingDrawer(true);
        break;
      case "copy-link":
        navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied to clipboard!");
        break;
      default:
        console.warn("Unknown quick setting action:", action);
    }
  };

  const ProfileSkeleton = () => (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="flex-1 min-w-0">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded-full" />
    </div>
  );

  return (
    <div className="sticky top-[100px] space-y-4">
      {/* Similar Profiles Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">Similar profiles for you</h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <>
              <ProfileSkeleton />
              <ProfileSkeleton />
              <ProfileSkeleton />
              <ProfileSkeleton />
              <ProfileSkeleton />
            </>
          ) : similarProfiles.length > 0 ? (
            similarProfiles.map((profile, index) => {
              const hasTrusted = profile.trustedBy?.includes(user?.id);
              const isTrusting = trustingStates[profile._id];

              return (
                <motion.div
                  key={profile._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 cursor-pointer ring-2 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-700 transition-all"
                    onClick={() => handleSimilarprofileClick(profile)}
                  >
                    <img
                      src={
                        profile.vendorAvatar ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                      }
                      alt={profile.vendorName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleSimilarprofileClick(profile)}
                  >
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-semibold text-[13px] text-slate-900 dark:text-white truncate">
                        {profile.vendorName}
                      </h4>
                      {profile.trust >= 5 && (
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                          <Check size={10} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate capitalize">
                      {profile.category?.replace(/-/g, " ")} • {profile.postsCount + profile.reelsCount} posts
                    </p>
                    {profile.location?.city && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {profile.location.city}
                        {profile.location.state ? `, ${profile.location.state}` : ""}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-[13px]">
              No similar profiles found
            </div>
          )}
        </div>

        {/* View More */}
        {similarProfiles.length > 0 && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setSimilarLimit((prev) => prev + 5)}
              className="w-full text-center text-[13px] font-semibold transition-colors cursor-pointer hover:opacity-80"
              style={{ color: categoryColor.primary }}
            >
              View more suggestions
            </button>
          </div>
        )}
      </motion.div>

      {/* Explore Categories Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Explore Categories</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Discover vendors by category</p>
        </div>
        <div className="p-3 space-y-2">
          {similarCategoriesLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
          ) : similarCategories?.length > 0 ? (
            similarCategories.map((category, index) => (
              <motion.button
                key={category._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/vendors/marketplace/${category.category.toLowerCase()}`)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-sm`}
                >
                  {category.icon}
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.displayName}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                    {category.vendorCount} vendors
                  </span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </motion.button>
            ))
          ) : (
            SUGGESTED_CATEGORIES?.map((category, index) => (
              <motion.button
                key={category._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/vendors/marketplace/${category.name.toLowerCase()}`)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-sm`}
                >
                  <category.icon size={16} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Quick Settings Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Quick Settings</h3>
        </div>
        <div className="p-2">
          {QUICK_SETTINGS.map((setting, index) => (
            <motion.button
              key={setting.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              onClick={() => handleQuickSettingClick(setting.action)}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                <setting.icon size={15} className="text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                {setting.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-3 py-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-slate-400 dark:text-slate-500">
          <a href="/about" className="hover:text-slate-600 dark:hover:text-slate-300 hover:underline">
            About
          </a>
          <a href="/pricing" className="hover:text-slate-600 dark:hover:text-slate-300 hover:underline">
            pricing
          </a>
          <a href="/about/contact" className="hover:text-slate-600 dark:hover:text-slate-300 hover:underline">
            contact us
          </a>
          <a href="/vendor/onboarding" className="hover:text-slate-600 dark:hover:text-slate-300 hover:underline">
            join the profile hub
          </a>
          <a href="/about/blogs" className="hover:text-slate-600 dark:hover:text-slate-300 hover:underline">
            blogs
          </a>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3">© 2025 VendorHub Corporation</p>
      </div>
    </div>
  );
};

const VendorProfileNewPageWrapper = ({ initialProfile, initialVendor = {}, initialReviews = [], vendorId: initialVendorId }) => {
  const { id: routeId, category, username } = useParams();
  const id = routeId || initialVendorId || initialVendor?._id || initialProfile?.vendorId;
  const router = useRouter();
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { backUrl, canGoBack } = useNavigationState();

  const [vendor, setVendor] = useState(() => {
    const baseVendor = initialVendor || {};
    const baseProfile = initialProfile || {};
    return {
      ...baseVendor,
      name: baseVendor.name || baseProfile.vendorBusinessName || baseProfile.vendorName,
      category: baseVendor.category || baseProfile.category,
      address: {
        ...baseVendor.address,
        city: baseVendor.address?.city || baseProfile.location?.city,
        state: baseVendor.address?.state || baseProfile.location?.state || baseProfile.location?.country
      },
      username: baseVendor.username || baseProfile.username,
      isPremium: baseVendor.isPremium || baseProfile.isPremium,
      isVerified: baseVendor.isVerified || baseProfile.isVerified
    };
  });
  const [profile, setProfile] = useState(initialProfile || {});
  const [reviews, setReviews] = useState();
  const [vendorLoading, setVendorLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [openOnboardingDrawer, setOpenOnboardingDrawer] = useState(false);
  const [showUpdateProfileDrawer, setShowUpdateProfileDrawer] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [coverImageLoaded, setCoverImageLoaded] = useState(false);
  const [cardBounce, setCardBounce] = useState(false);
  const [isScrolledHeader, setIsScrolledHeader] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const [isCoverExpanded, setIsCoverExpanded] = useState(false);
  const [isHighlightsExpanded, setIsHighlightsExpanded] = useState(true);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["posts", "reels", "portfolio", "services"].includes(tab)) {
        return tab;
      }
    }
    return "posts";
  });

  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRefs = useRef({});

  const [showShareModal, setShowShareModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [showReviewsDrawer, setShowReviewsDrawer] = useState(false);
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedReelIndex, setSelectedReelIndex] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  const [trustCount, setTrustCount] = useState(initialProfile?.trust || 0);
  const [hasTrusted, setHasTrusted] = useState(false);
  const [likesCount, setLikesCount] = useState(initialProfile?.likes?.length || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [userStateReady, setUserStateReady] = useState(false);
  const [interactionsLoading, setInteractionsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  const [showThumbsUpAnimation, setShowThumbsUpAnimation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState({ show: false, message: "", type: "success", icon: Check });
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [signInPromptMessage, setSignInPromptMessage] = useState("Please sign in to continue");

  const [showQRModal, setShowQRModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(true);
  const [activeDetailsTab, setActiveDetailsTab] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const detailsTab = params.get("details");
      if (detailsTab) {
        return detailsTab;
      }
    }
    return "overview";
  });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [showHeaderTabs, setShowHeaderTabs] = useState(false);

  const [postsInteractionsData, setPostsInteractionsData] = useState({});
  const [reelsInteractionsData, setReelsInteractionsData] = useState({});
  const [isLoadingAllInteractions, setIsLoadingAllInteractions] = useState(false);

  const longPressTimerRef = useRef(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const [posts, setPosts] = useState(initialProfile?.posts || []);
  const [reels, setReels] = useState(initialProfile?.reels || []);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  const highlightsContainerRef = useRef(null);
  const urlParamsProcessedRef = useRef(false);
  const initialFetchDoneRef = useRef(false);
  const onboardingHandledRef = useRef(false);
  const stickyTabsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledHeader(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowHeaderTabs(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "-80px 0px 0px 0px",
      },
    );

    if (stickyTabsRef.current) {
      observer.observe(stickyTabsRef.current);
    }

    return () => {
      if (stickyTabsRef.current) {
        observer.unobserve(stickyTabsRef.current);
      }
    };
  }, []);

  // NEW: Preload all posts and reels interactions
  const preloadAllInteractions = useCallback(async () => {
    if (!id || profileLoading) return;

    setIsLoadingAllInteractions(true);

    try {
      // Fetch all posts interactions in parallel
      if (posts.length > 0) {
        const postsData = {};
        const postsPromises = posts.map(async (post) => {
          try {
            const params = new URLSearchParams({
              postId: post._id,
              ...(user?.id && { userId: user.id }),
            });

            const res = await fetch(`/api/vendor/${id}/profile/posts/interactions?${params}`);
            const data = await res.json();

            if (data.success) {
              postsData[post._id] = {
                likesCount: data.data.likesCount || 0,
                isLiked: data.data.isLiked || false,
                isSaved: data.data.isSaved || false,
                reviews: data.data.reviews || [],
              };
            }
          } catch (error) {
            console.error(`Failed to fetch interactions for post ${post._id}:`, error);
            // Set default values on error
            postsData[post._id] = {
              likesCount: 0,
              isLiked: false,
              isSaved: false,
              reviews: [],
            };
          }
        });

        await Promise.all(postsPromises);
        setPostsInteractionsData(postsData);
      }

      // Fetch all reels interactions in parallel
      if (reels.length > 0) {
        const reelsData = {};
        const reelsPromises = reels.map(async (reel) => {
          try {
            const params = new URLSearchParams({
              reelId: reel._id,
              ...(user?.id && { userId: user.id }),
            });

            const res = await fetch(`/api/vendor/${id}/profile/reels/interactions?${params}`);
            const data = await res.json();

            if (data.success) {
              reelsData[reel._id] = {
                likesCount: data.data.likesCount || 0,
                views: data.data.views || 0,
                isLiked: data.data.isLiked || false,
                isSaved: data.data.isSaved || false,
              };
            }
          } catch (error) {
            console.error(`Failed to fetch interactions for reel ${reel._id}:`, error);
            // Set default values on error
            reelsData[reel._id] = {
              likesCount: 0,
              views: 0,
              isLiked: false,
              isSaved: false,
            };
          }
        });

        await Promise.all(reelsPromises);
        setReelsInteractionsData(reelsData);
      }
    } catch (error) {
      console.error("Failed to preload interactions:", error);
    } finally {
      setIsLoadingAllInteractions(false);
    }
  }, [posts, reels, user?.id, id, profileLoading]);

  useEffect(() => {
    if (!initialProfile) {
      setLikesCount(0);
      return;
    }
    const totalPostLikes = initialProfile.posts?.reduce(
      (total, post) => total + (post.likes?.length || 0),
      0
    ) || 0;
    const totalReelLikes = initialProfile.reels?.reduce(
      (total, reel) => total + (reel.likes?.length || 0),
      0
    ) || 0;
    setLikesCount(totalPostLikes + totalReelLikes);
  }, [initialProfile]);

  useEffect(() => {
    if (profileLoading) return;
    if (!isUserLoaded) return;

    if (posts.length > 0 || reels.length > 0) {
      preloadAllInteractions();
    }
  }, [profileLoading, isUserLoaded, posts.length, reels.length, preloadAllInteractions]);

  const getCategoryColor = useCallback((category) => {
    const colorMap = {
      Photography: {
        primary: "#a855f7",
        secondary: "#ec4899",
        gradient: "from-purple-500 to-violet-600",
        rgb: "168, 85, 247",
      },
      Videography: {
        primary: "#ec4899",
        secondary: "#f43f5e",
        gradient: "from-pink-500 to-rose-600",
        rgb: "236, 72, 153",
      },
      Catering: {
        primary: "#f97316",
        secondary: "#eab308",
        gradient: "from-orange-500 to-amber-600",
        rgb: "249, 115, 22",
      },
      Venue: { primary: "#0ea5e9", secondary: "#3b82f6", gradient: "from-sky-500 to-blue-600", rgb: "14, 165, 233" },
      Decoration: {
        primary: "#a855f7",
        secondary: "#d946ef",
        gradient: "from-purple-500 to-fuchsia-600",
        rgb: "168, 85, 247",
      },
      Entertainment: {
        primary: "#ef4444",
        secondary: "#f43f5e",
        gradient: "from-red-500 to-rose-600",
        rgb: "239, 68, 68",
      },
      "Makeup Artist": {
        primary: "#ec4899",
        secondary: "#a855f7",
        gradient: "from-pink-500 to-purple-600",
        rgb: "236, 72, 153",
      },
      "Wedding Planner": {
        primary: "#22c55e",
        secondary: "#10b981",
        gradient: "from-green-500 to-emerald-600",
        rgb: "34, 197, 94",
      },
      DJ: { primary: "#8b5cf6", secondary: "#a855f7", gradient: "from-violet-500 to-purple-600", rgb: "139, 92, 246" },
      Florist: { primary: "#f43f5e", secondary: "#ec4899", gradient: "from-rose-500 to-pink-600", rgb: "244, 63, 94" },
      default: {
        primary: "#6366f1",
        secondary: "#3b82f6",
        gradient: "from-indigo-500 to-blue-600",
        rgb: "99, 102, 241",
      },
    };
    return colorMap[category] || colorMap.default;
  }, []);

  const categoryColor = useMemo(() => getCategoryColor(profile?.category || vendor?.category), [profile?.category, vendor?.category, getCategoryColor]);

  const cardBounceVariants = {
    initial: { y: 0 },
    bounce: {
      y: [0, -12, -8, -10, -6, -8, 0],
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
      },
    },
  };

  const coverImageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const gradientAnimation = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  const handleVerifyIdentity = () => {
    setShowVerifyModal(true);
  };

  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (!hasScrolledRef.current) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      hasScrolledRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!isUserLoaded || !isSignedIn || !user?.id || !profile || Object.keys(profile).length === 0) {
      return;
    }

    const liked = Array.isArray(profile.likes) && profile.likes.includes(user.id);
    const trusted = Array.isArray(profile.trustedBy) && profile.trustedBy.includes(user.id);

    setHasLiked(liked);
    setHasTrusted(trusted);
    setUserStateReady(true);
  }, [isUserLoaded, isSignedIn, user?.id, profile]);

  useEffect(() => {
    // Reset URL-related refs when vendor ID changes
    urlParamsProcessedRef.current = false;
    initialFetchDoneRef.current = false;
    onboardingHandledRef.current = false;
  }, [id]);

  // ============ URL PARAMS - READ ON MOUNT ============
  useEffect(() => {
    if (urlParamsProcessedRef.current) return;
    if (profileLoading) return;

    const params = new URLSearchParams(window.location.search);
    const postId = params.get("post");
    const reelIndex = params.get("reel");

    if (posts.length === 0 && reels.length === 0) return;

    if (postId && posts.length > 0) {
      const post = posts.find((p) => p._id === postId);
      if (post) setSelectedPost(post);
    }

    if (reelIndex !== null && reels.length > 0) {
      const index = parseInt(reelIndex, 10);
      if (!isNaN(index) && index >= 0 && index < reels.length) {
        setSelectedReelIndex(index);
      }
    }

    urlParamsProcessedRef.current = true;
  }, [profileLoading]);

  // ============ URL PARAMS - WRITE UPDATES (DEBOUNCED) ============
  const updateURLParamsDebounced = useCallback(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);

    // Tab param
    url.searchParams.set("tab", activeTab);

    // Details tab (only for services)
    if (activeTab === "services") {
      url.searchParams.set("details", activeDetailsTab);
    } else {
      url.searchParams.delete("details");
    }

    // Post param
    if (selectedPost) {
      url.searchParams.set("post", selectedPost._id);
    } else {
      url.searchParams.delete("post");
    }

    // Reel param
    if (selectedReelIndex !== null) {
      url.searchParams.set("reel", selectedReelIndex.toString());
    } else {
      url.searchParams.delete("reel");
    }

    window.history.replaceState({}, "", url.toString());
  }, [activeTab, activeDetailsTab, selectedPost, selectedReelIndex]);

  const initialUrlReadRef = useRef(false);

  useEffect(() => {
    // Skip the first run to avoid updating URL on mount
    if (!initialUrlReadRef.current) {
      initialUrlReadRef.current = true;
      return;
    }

    const timer = setTimeout(updateURLParamsDebounced, 100);
    return () => clearTimeout(timer);
  }, [updateURLParamsDebounced]);

  const requireSignIn = useCallback((message = "Please sign in to continue") => {
    setSignInPromptMessage(message);
    setShowSignInPrompt(true);
  }, []);

  const updateURLParams = useCallback((updates) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
    window.history.replaceState({}, "", url.toString());
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["posts", "reels", "portfolio", "services"].includes(tab)) {
        setActiveTab(tab);
      }
      const detailsTab = params.get("details");
      if (detailsTab) {
        setActiveDetailsTab(detailsTab);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isSignedIn && !isVerified) {
      return;
    }
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    const uploadParam = params.get("upload");
    const updateParam = params.get("update");

    if (uploadParam === "true") {
      setShowUploadModal(true);
    }

    if (updateParam === "true") {
      setShowUpdateProfileDrawer(true);
    }
  }, []);

  useEffect(() => {
    // Guard conditions
    if (onboardingHandledRef.current) return;
    if (profileLoading) return;
    if (!isUserLoaded) return;
    if (openOnboardingDrawer) return; // Already open
    if (!showOnboarding) return; // Onboarding not needed

    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const onboardingParam = params?.get("onboarding");

    if (onboardingParam === "true") {
      onboardingHandledRef.current = true;
      if (!isSignedIn) {
        requireSignIn("Please sign in to proceed");
      }
      setOpenOnboardingDrawer(true);
    }
  }, [profileLoading, isUserLoaded, isSignedIn, showOnboarding, openOnboardingDrawer, requireSignIn]);

  const showUIConfirmation = useCallback((message, type = "success", icon = Check) => {
    setShowConfirmation({ show: true, message, type, icon });
    setTimeout(() => setShowConfirmation({ show: false, message: "", type: "success", icon: Check }), 2000);
  }, []);

  useEffect(() => {
    if (showSignInPrompt) {
      const timer = setTimeout(() => setShowSignInPrompt(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSignInPrompt]);

  useEffect(() => {
    if (!posts.length) return;

    const generate = async () => {
      // Only target videos that don't have a thumbnail in cache or state
      const targetVideos = posts.filter((p) => p.mediaType === "video" && !p.thumbnailUrl && !videoThumbnails[p._id]);

      for (const post of targetVideos) {
        try {
          const thumb = await getBulletproofThumbnail(post.mediaUrl);
          setVideoThumbnails((prev) => ({ ...prev, [post._id]: thumb }));
        } catch (error) {
          console.warn(`Thumb failed for ${post._id}, using video fallback.`);
          // Mark as "failed" so we don't keep retrying
          setVideoThumbnails((prev) => ({ ...prev, [post._id]: "FALLBACK" }));
        }
      }
    };

    const timer = setTimeout(generate, 300); // Small delay to let UI settle
    return () => clearTimeout(timer);
  }, [posts]);

  // Add cleanup for video refs when component unmounts or posts change
  useEffect(() => {
    return () => {
      // Cleanup video refs on unmount
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
          video.src = "";
          video.load();
        }
      });
      videoRefs.current = {};
    };
  }, []);

  // Also cleanup when posts change significantly
  useEffect(() => {
    const currentPostIds = new Set(posts.map((p) => p._id));

    // Remove refs for posts that no longer exist
    Object.keys(videoRefs.current).forEach((id) => {
      if (!currentPostIds.has(id)) {
        const video = videoRefs.current[id];
        if (video) {
          video.pause();
          video.src = "";
        }
        delete videoRefs.current[id];
      }
    });
  }, [posts]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const handleBack = useCallback(() => {
    if (typeof window === "undefined") return;

    if (canGoBack) {
      router.push(backUrl);
      return;
    }

    if (category || id) {
      router.push(`/vendor/${category || "all"}/${id}`);
    } else {
      router.push("/");
    }
  }, [router, category, id]);

  const handleShare = useCallback(() => {
    // if (navigator.share) {
    //   navigator
    //     .share({ title: vendor?.name, text: `Check out ${vendor?.name}!`, url: window.location.href })
    //     .catch(() => setShowShareModal(true));
    // } else {
    setShowShareModal(true);
    // }
  }, [vendor]);

  const handleProfileCreated = useCallback(
    (newProfile) => {
      setProfile(newProfile);
      setShowOnboarding(false);
      setVendor((prev) => ({ ...prev, vendorProfile: newProfile }));
      showUIConfirmation("Profile created successfully!", "success", CheckCircle);
      // window.location.reload();
    },
    [showUIConfirmation],
  );

  const handleTrust = useCallback(async () => {
    if (!isSignedIn || !user?.id) {
      requireSignIn("Please sign in to trust vendors");
      return;
    }
    if (interactionsLoading) return;

    const newTrustState = !hasTrusted;
    const previousTrustState = hasTrusted;
    const previousTrustCount = trustCount;
    const trustChange = newTrustState ? 10 : -10;
    const newTrustCount = Math.max(0, previousTrustCount + trustChange);

    setHasTrusted(newTrustState);
    setTrustCount(newTrustCount);

    if (newTrustState) {
      setShowThumbsUpAnimation(true);
      setTimeout(() => setShowThumbsUpAnimation(false), 1200);
    }

    setInteractionsLoading(true);

    try {
      const response = await fetch(`/api/vendor/${id}/profile/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "trust", value: newTrustState, userId: user.id }),
      });
      const result = await response.json();

      if (!result.success) {
        setHasTrusted(previousTrustState);
        setTrustCount(previousTrustCount);
        showUIConfirmation(result.error || "Failed to update trust", "error", AlertCircle);
        return;
      }

      const serverTrustCount = Math.max(0, result.data?.trust ?? newTrustCount);
      setTrustCount(serverTrustCount);

      if (newTrustState) {
        showUIConfirmation("Vendor trusted! +10", "success", Shield);
      } else {
        showUIConfirmation("Trust removed", "info", Shield);
      }
    } catch (error) {
      console.error("Trust update error:", error);
      setHasTrusted(previousTrustState);
      setTrustCount(previousTrustCount);
      showUIConfirmation("Network error. Please try again.", "error", AlertCircle);
    } finally {
      setInteractionsLoading(false);
    }
  }, [hasTrusted, trustCount, id, interactionsLoading, showUIConfirmation, isSignedIn, user?.id, requireSignIn]);

  const handleLike = useCallback(async () => {
    if (!isSignedIn || !user?.id) {
      requireSignIn("Please sign in to Like/dislike vendors");
      return;
    }
    if (interactionsLoading) return;

    const newLikeState = !hasLiked;
    const previousLikeState = hasLiked;
    const previousLikesCount = likesCount;
    const newLikesCount = newLikeState ? previousLikesCount + 1 : Math.max(0, previousLikesCount - 1);

    setHasLiked(newLikeState);
    setLikesCount(newLikesCount);
    setInteractionsLoading(true);

    try {
      const response = await fetch(`/api/vendor/${id}/profile/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", value: newLikeState, userId: user.id }),
      });
      const result = await response.json();

      if (!result.success) {
        setHasLiked(previousLikeState);
        setLikesCount(previousLikesCount);
        showUIConfirmation(result.error || "Failed to update like", "error", AlertCircle);
        return;
      }

      const serverLikesCount = Math.max(0, result.data?.likesCount ?? newLikesCount);
      setLikesCount(serverLikesCount);

      if (newLikeState) {
        showUIConfirmation("Vendor liked!", "success", Heart);
      } else {
        showUIConfirmation("Like removed", "info", Heart);
      }
    } catch (error) {
      console.error("Like update error:", error);
      setHasLiked(previousLikeState);
      setLikesCount(previousLikesCount);
      showUIConfirmation("Network error. Please try again.", "error", AlertCircle);
    } finally {
      setInteractionsLoading(false);
    }
  }, [hasLiked, likesCount, id, interactionsLoading, showUIConfirmation, isSignedIn, user?.id, requireSignIn]);

  const handleTrustWithBounce = useCallback(async () => {
    setCardBounce(true);
    await handleTrust();
    setTimeout(() => setCardBounce(false), 800);
  }, [handleTrust]);

  const handleLikeWithBounce = useCallback(async () => {
    setCardBounce(true);
    await handleLike();
    setTimeout(() => setCardBounce(false), 800);
  }, [handleLike]);

  const handleHighlightPrev = useCallback(() => {
    if (currentHighlightIndex > 0) {
      setCurrentHighlightIndex((prev) => prev - 1);
      if (highlightsContainerRef.current) {
        const cardWidth = (window.innerWidth - 72) / 4.5; // Calculate card width
        const gap = 14; // 3.5 * 4 = 14px gap
        const scrollAmount = cardWidth + gap;
        highlightsContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
    }
  }, [currentHighlightIndex]);

  const handleHighlightNext = useCallback(() => {
    if (currentHighlightIndex < MOCK_HIGHLIGHTS.length - 1) {
      setCurrentHighlightIndex((prev) => prev + 1);
      if (highlightsContainerRef.current) {
        const cardWidth = (window.innerWidth - 72) / 4.5;
        const gap = 14;
        const scrollAmount = cardWidth + gap;
        highlightsContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  }, [currentHighlightIndex]);

  const handleHighlightsClose = useCallback(() => {
    setIsHighlightsExpanded(false);
    setCurrentHighlightIndex(0);
    if (highlightsContainerRef.current) {
      highlightsContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const container = highlightsContainerRef.current;
    if (!container || !isHighlightsExpanded) return;

    const handleScroll = () => {
      const cardWidth = (window.innerWidth - 72) / 4.5;
      const gap = 14;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));

      if (newIndex !== currentHighlightIndex && newIndex >= 0 && newIndex < MOCK_HIGHLIGHTS.length) {
        setCurrentHighlightIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isHighlightsExpanded, currentHighlightIndex]);

  const handleSaveProfile = useCallback(() => {
    setIsSaved((prev) => !prev);
    showUIConfirmation(isSaved ? "Removed from saved" : "Profile saved!", "success", Bookmark);
  }, [isSaved, showUIConfirmation]);

  const handleNotify = useCallback(() => {
    setIsNotifying((prev) => !prev);
    showUIConfirmation(isNotifying ? "Notifications off" : "Notifications on", "success", Bell);
  }, [isNotifying, showUIConfirmation]);

  const handleReport = useCallback(() => {
    showUIConfirmation("Report submitted", "success", Flag);
    setShowMoreOptions(false);
  }, [showUIConfirmation]);

  const handleBlock = useCallback(() => {
    showUIConfirmation("Profile blocked", "success", UserMinus);
    setShowMoreOptions(false);
    setTimeout(() => router.back(), 1500);
  }, [router, showUIConfirmation]);

  const handleBookingConfirmed = useCallback(() => {
    showUIConfirmation("Booking confirmed!", "success", Calendar);
  }, [showUIConfirmation]);

  const handleDeletePost = useCallback(
    async (postId) => {
      try {
        const response = await fetch(`/api/vendor/${id}/profile/posts?postId=${postId}`, { method: "DELETE" });
        const result = await response.json();
        if (!result.success) throw new Error(result.error || "Delete failed");
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setSelectedPost(null);
        showUIConfirmation("Post deleted", "success", Check);
      } catch (error) {
        console.error("Delete post error:", error);
        showUIConfirmation(error.message || "Failed to delete post", "error", AlertCircle);
      }
    },
    [id, showUIConfirmation],
  );

  const handleEditPost = useCallback(
    async (postId, newCaption) => {
      try {
        const response = await fetch(`/api/vendor/${id}/profile/posts?postId=${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: newCaption }),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.error || "Update failed");
        setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, caption: newCaption } : p)));
        showUIConfirmation("Caption updated", "success", Check);
      } catch (error) {
        console.error("Edit post error:", error);
        showUIConfirmation(error.message || "Failed to update post", "error", AlertCircle);
      }
    },
    [id, showUIConfirmation],
  );

  const handleArchivePost = useCallback(
    (postId) => {
      const postToArchive = posts.find((p) => p.id === postId);
      if (postToArchive) {
        setArchivedPosts((prev) => [...prev, { ...postToArchive, archivedAt: new Date().toISOString() }]);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setSelectedPost(null);
        showUIConfirmation("Post archived", "success", Bookmark);
      }
    },
    [posts, showUIConfirmation],
  );

  const handleDeleteReel = useCallback(
    async (reelId) => {
      try {
        const response = await fetch(`/api/vendor/${id}/profile/reels?reelId=${reelId}`, { method: "DELETE" });
        const result = await response.json();
        if (!result.success) throw new Error(result.error || "Delete failed");
        setReels((prev) => prev.filter((r) => r.id !== reelId));
        setSelectedReelIndex(null);
        showUIConfirmation("Reel deleted", "success", Check);
      } catch (error) {
        console.error("Delete reel error:", error);
        showUIConfirmation(error.message || "Failed to delete reel", "error", AlertCircle);
      }
    },
    [id, showUIConfirmation],
  );

  const handleUploadPost = useCallback((newPost) => {
    if (!newPost || !newPost.mediaUrl) {
      console.error("Invalid post data received:", newPost);
      return;
    }
    const transformedPost = {
      id: newPost._id?.toString() || newPost._id || Date.now().toString(),
      thumbnail: newPost.mediaUrl,
      mediaUrl: newPost.mediaUrl,
      mediaType: newPost.mediaType || "image",
      storagePath: newPost.storagePath || null,
      caption: newPost.description || "",
      likes: 0,
      comments: 0,
      date: new Date().toLocaleDateString(),
      location: newPost.location || "",
      isLiked: false,
      isSaved: false,
    };
    setPosts((prev) => [transformedPost, ...prev].slice(0, 6));
  }, []);

  const handleUploadReel = useCallback((newReel) => {
    if (!newReel || !newReel.videoUrl) {
      console.error("Invalid reel data received");
      return;
    }
    const transformedReel = {
      id: newReel._id?.toString() || newReel._id || Date.now().toString(),
      thumbnail: newReel.thumbnail || newReel.videoUrl,
      videoUrl: newReel.videoUrl,
      storagePath: newReel.storagePath,
      thumbnailPath: newReel.thumbnailPath,
      title: newReel.title || "Untitled",
      caption: newReel.caption || "",
      views: 0,
      likes: 0,
      duration: "0:30",
      date: new Date().toLocaleDateString(),
      isLiked: false,
      isSaved: false,
    };
    setReels((prev) => [transformedReel, ...prev].slice(0, 12));
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href);
    showUIConfirmation("Link copied!", "success", Copy);
  }, [showUIConfirmation]);

  const openImageModal = useCallback((index) => {
    // Reset zoom when opening new image
    setImageZoom(1);
    setModalImageIndex(index);
    setShowImageModal(true);
  }, []);

  const images = useMemo(() => vendor?.images || [], [vendor]);

  useEffect(() => {
    if (images.length === 0) return;
    const preloadLinks = [];
    images.forEach((src, index) => {
      const img = new window.Image();
      img.decoding = "async";
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
    return () => preloadLinks.forEach((link) => link.remove());
  }, [images]);

  const handleEditReel = useCallback(
    async (reelId, newCaption, newTitle = null) => {
      try {
        const formData = new FormData();
        if (newCaption !== null && newCaption !== undefined) formData.append("caption", newCaption);
        if (newTitle !== null && newTitle !== undefined) formData.append("title", newTitle);
        const response = await fetch(`/api/vendor/${id}/profile/reels?reelId=${reelId}`, {
          method: "PUT",
          body: formData,
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.error || "Update failed");
        setReels((prev) =>
          prev.map((r) =>
            r.id === reelId ? { ...r, caption: newCaption ?? r.caption, title: newTitle ?? r.title } : r,
          ),
        );
        showUIConfirmation("Reel updated", "success", Check);
        return { success: true };
      } catch (error) {
        console.error("Edit reel error:", error);
        showUIConfirmation(error.message || "Failed to update reel", "error", AlertCircle);
        return { success: false, error: error.message };
      }
    },
    [id, showUIConfirmation],
  );

  const handleRestorePost = useCallback(
    (postId) => {
      const postToRestore = archivedPosts.find((p) => p.id === postId);
      if (!postToRestore) {
        showUIConfirmation("Archived post not found", "error", AlertCircle);
        return;
      }
      if (posts.length >= 6) {
        showUIConfirmation("Maximum posts limit reached", "error", AlertCircle);
        return;
      }
      const { archivedAt, ...restoredPost } = postToRestore;
      setPosts((prev) => [restoredPost, ...prev]);
      setArchivedPosts((prev) => prev.filter((p) => p.id !== postId));
      showUIConfirmation("Post restored", "success", Check);
    },
    [posts, archivedPosts, showUIConfirmation],
  );

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    dragStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  }, []);

  // Add this callback function (with other handlers)
  const handleProfileUpdated = useCallback(
    (updatedProfile) => {
      setProfile(updatedProfile);
      showUIConfirmation("Profile updated successfully!", "success", CheckCircle);
    },
    [showUIConfirmation],
  );

  const handleTrustRef = useRef(handleTrust);
  const handleLikeRef = useRef(handleLike);

  // Keep refs updated
  useEffect(() => {
    handleTrustRef.current = handleTrust;
  }, [handleTrust]);

  useEffect(() => {
    handleLikeRef.current = handleLike;
  }, [handleLike]);

  const stats = useMemo(
    () => [
      {
        label: "Reviews",
        value: reviews?.length?.toString() || "0",
        action: () => setShowReviewsDrawer(true),
        active: false,
        loading: false,
        showSkeleton: false,
      },
      {
        label: "Trust",
        value: trustCount >= 1000 ? `${(trustCount / 1000).toFixed(1)}K` : trustCount?.toString(),
        action: () => handleTrustRef.current?.(),
        active: hasTrusted && isSignedIn,
        loading: interactionsLoading,
        showSkeleton: profileLoading,
      },
      {
        label: "Likes",
        value: likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount?.toString(),
        action: () => handleLikeRef.current?.(),
        active: hasLiked && isSignedIn,
        loading: interactionsLoading,
        showSkeleton: profileLoading,
      },
    ],
    [trustCount, hasTrusted, likesCount, hasLiked, reviews?.length, interactionsLoading, isSignedIn, profileLoading],
  );

  const TAB_CONFIG = useMemo(() => {
    const tabs = [
      { id: "overview", label: "Overview", icon: Home },
      {
        id: "category",
        label: CATEGORY_CONFIG[vendor?.category]?.label || "Details",
        icon: CATEGORY_CONFIG[vendor?.category]?.icon || Layers,
        show: !!vendor?.category,
      },
      {
        id: "services",
        label: "Services & Awards",
        icon: Award,
        show: vendor?.amenities?.length > 0 || vendor?.facilities?.length > 0 || vendor?.awards?.length > 0,
      },
      { id: "packages", label: "Packages", icon: Gift, show: vendor?.packages?.length > 0 },
      {
        id: "insights",
        label: "Insights",
        icon: BarChart2,
        show: vendor?.highlights?.length > 0 || vendor?.stats?.length > 0,
      },
      { id: "faqs", label: "FAQs", icon: FileText, show: vendor?.faqs?.length > 0 },
      { id: "policies", label: "Policies", icon: Shield, show: vendor?.policies?.length > 0 },
      { id: "location", label: "Location", icon: MapPin },
    ];
    return tabs.filter((tab) => tab.show !== false);
  }, [vendor]);

  const StatSkeleton = () => (
    <div className="flex flex-col items-center gap-0.5 px-4 py-2">
      <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="w-10 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
    </div>
  );

  const BioSkeleton = () => (
    <div className="mb-4 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
    </div>
  );

  const HighlightsSkeleton = () => (
    <div className="flex gap-3 py-1">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="flex flex-col items-center gap-3" style={{ width: "calc((100vw - 64px) / 4)" }}>
          <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  const EmptyPostsState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="relative mb-6">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20"
        />
        <motion.div
          animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.2, 0.05, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
        />
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shadow-xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 flex items-center justify-center">
            <Camera size={36} className="text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 text-center">No Posts Yet</h3>
      {/* <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs mb-6 leading-relaxed">
        Share your best moments with your audience. Upload photos and videos to showcase your work.
      </p> */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {[
          { icon: Image, label: "Photos" },
          { icon: Video, label: "Videos" },
          { icon: MapPin, label: "Locations" },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full"
          >
            <item.icon size={12} className="text-slate-500 dark:text-slate-400" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const EmptyReelsState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="relative mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-32 h-32 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(236,72,153,0.2), rgba(168,85,247,0.2), rgba(59,130,246,0.2), rgba(236,72,153,0.2))",
          }}
        />
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shadow-xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="w-16 h-24 rounded-xl bg-gradient-to-br from-pink-500/10 to-orange-500/10 dark:from-pink-500/20 dark:to-orange-500/20 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
            <Film size={28} className="text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 text-center">No Reels Yet</h3>
      {/* <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs mb-6 leading-relaxed">
        Create engaging short-form videos to captivate your audience and boost engagement.
      </p> */}
      {/* <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 max-w-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
            <Smartphone size={16} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Reel Specifications</span>
        </div>
      </div> */}
    </motion.div>
  );

  const PostsLoadingSkeleton = () => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-[3px] mx-[15px]">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="aspect-square rounded-[10px] overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-5 mx-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="space-y-2">
                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="w-16 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  const ReelsLoadingSkeleton = () => (
    <div className="grid grid-cols-3 gap-[3px] mx-[15px]">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="aspect-[9/16] rounded-[10px] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <div className="w-8 h-4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
            </div>
            <div className="absolute top-2 right-2">
              <div className="w-8 h-4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SignInPrompt = ({ message, onClose }) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed bottom-32 left-4 right-4 z-[60] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
          <AlertCircle size={24} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{message}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Sign in to interact with this vendor</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </motion.button>
          <SignInButton mode="modal">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25"
            >
              Sign In
            </motion.button>
          </SignInButton>
        </div>
      </div>
    </motion.div>
  );

  const PortfolioEmptyState = () => (
    <div className="flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-full bg-gray-100 dark:bg-gray-800">
          <svg
            className="w-7 h-7 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4-4a3 3 0 014 0l4 4m-2-2l1-1a3 3 0 014 0l1 1M4 20h16"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Portfolio Yet</h3>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          This vendor hasn’t uploaded any portfolio content yet. Check back later or contact them directly for samples
          of their work.
        </p>
      </div>
    </div>
  );

  const ReviewsEmptyState = () => (
    <div className="mt-10 flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">No Reviews Yet</h4>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          This vendor hasn’t received any reviews yet. Be the first to share your experience.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="flex flex-col gap-4">
            {profileLoading ? (
              <PostsLoadingSkeleton />
            ) : posts.length === 0 ? (
              <EmptyPostsState />
            ) : (
              <>
                <div className="grid grid-cols-3 gap-[15px] mx-[15px]">
                  {posts.map((post, index) => {
                    const posterUrl = post.thumbnailUrl || videoThumbnails[post._id] || null;
                    const thumb = videoThumbnails[post._id];
                    const postNum = (index % 4) + 1;
                    const config = POST_CONFIGS[postNum];
                    const HeadingIcon = config?.icon;
                    return (
                      <motion.div
                        key={post?._id || `post-${index}`}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (playingVideoId) {
                            const video = videoRefs.current[playingVideoId];
                            if (video) {
                              video.pause();
                              video.currentTime = 0;
                            }
                            setPlayingVideoId(null);
                          }
                          setSelectedPost(post);
                        }}
                        onTouchStart={() => {
                          longPressTimerRef.current = setTimeout(() => {
                            if (post.mediaType === "video") {
                              const video = videoRefs.current[post._id];
                              if (video) {
                                video.play();
                                setPlayingVideoId(post._id);
                              }
                            } else {
                              setPreviewPost(post);
                            }
                            setIsLongPressing(true);
                          }, 500);
                        }}
                        onTouchEnd={() => {
                          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                          if (isLongPressing) {
                            if (post.mediaType === "video" && playingVideoId === post._id) {
                              const video = videoRefs.current[post._id];
                              if (video) {
                                video.pause();
                                video.currentTime = 0;
                              }
                              setPlayingVideoId(null);
                            }
                            setPreviewPost(null);
                            setIsLongPressing(false);
                          }
                        }}
                        onTouchMove={() => {
                          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                        }}
                        onMouseDown={() => {
                          longPressTimerRef.current = setTimeout(() => {
                            if (post.mediaType === "video") {
                              const video = videoRefs.current[post._id];
                              if (video) {
                                video.play();
                                setPlayingVideoId(post._id);
                              }
                            } else {
                              setPreviewPost(post);
                            }
                            setIsLongPressing(true);
                          }, 500);
                        }}
                        onMouseUp={() => {
                          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                          if (isLongPressing) {
                            if (post.mediaType === "video" && playingVideoId === post._id) {
                              const video = videoRefs.current[post._id];
                              if (video) {
                                video.pause();
                                video.currentTime = 0;
                              }
                              setPlayingVideoId(null);
                            }
                            setPreviewPost(null);
                            setIsLongPressing(false);
                          }
                        }}
                        onMouseLeave={() => {
                          if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                          if (isLongPressing) {
                            if (post.mediaType === "video" && playingVideoId === post._id) {
                              const video = videoRefs.current[post._id];
                              if (video) {
                                video.pause();
                                video.currentTime = 0;
                              }
                              setPlayingVideoId(null);
                            }
                            setPreviewPost(null);
                            setIsLongPressing(false);
                          }
                        }}
                        className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden cursor-pointer select-none shadow-sm border border-gray-100 dark:border-slate-800 group"
                      >
                        {/* Post Category Heading */}
                        {config && (
                          <div className="px-2 pt-2 pb-3">
                            <div className="flex items-center justify-center gap-2 py-2 bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-700/50 rounded-xl">
                              {HeadingIcon && (
                                <HeadingIcon size={16} className="text-slate-600 dark:text-slate-400 flex-shrink-0" />
                              )}
                              <span className="text-sm  font-bold text-slate-800 dark:text-slate-200 truncate">
                                {config.title}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Media */}
                        <div className="aspect-[1/1.05] bg-gray-100 dark:bg-gray-800 overflow-hidden relative rounded-xl mx-2 mb-2">
                          {post.mediaType === "video" ? (
                            <div className="relative w-full h-full">
                              {thumb && thumb !== "FALLBACK" ? (
                                <img src={thumb} className="w-full h-full object-cover" />
                              ) : (
                                <video
                                  ref={(el) => {
                                    if (el) videoRefs.current[post._id] = el;
                                  }}
                                  src={post.mediaUrl}
                                  poster={posterUrl || undefined}
                                  className="w-full h-full object-cover"
                                  muted
                                  playsInline
                                  loop
                                  preload="metadata"
                                />
                              )}
                              <AnimatePresence>
                                {playingVideoId !== post._id && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                                  >
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                                      <Play size={12} className="text-white fill-white" />
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <AnimatePresence>
                                {playingVideoId === post._id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                  >
                                    <div className="absolute inset-0 bg-black/10" />
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                                    >
                                      <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                                        <Pause size={16} className="text-gray-900" />
                                      </div>
                                    </motion.div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <SmartMedia
                              key={`media-${post._id}`}
                              src={post?.mediaUrl}
                              type="image"
                              className="w-full h-full object-cover"
                              loaderImage="/GlowLoadingGif.gif"
                            />
                          )}
                          {(post?.mediaType !== "video" || playingVideoId !== post._id) && (
                            <div className="absolute inset-0 bg-black/0 group-active:bg-black/40 transition-colors flex items-center justify-center gap-3 text-white text-xs font-bold opacity-0 group-active:opacity-100">
                              <span className="flex items-center gap-1">
                                <Heart size={14} className="fill-white" />
                                {post?.likes?.length}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle size={14} className="fill-white" />
                                {post?.reviews?.length}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
            <div className="space-y-5 mx-4 relative isolate">
              {vendor?.images?.length > 0 ? (
                <>
                  {/* HEADER CONTAINER */}
                  <div className="relative w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors overflow-hidden group">
                    {/* VISUAL LAYER (Passive - just looks good) */}
                    <div className="p-4 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center">
                          <ImageIcon size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Photo Gallery</h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {vendor?.images?.length} photos available
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: isGalleryExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <ChevronDown size={18} className="text-slate-600 dark:text-slate-400" />
                        </motion.div>
                      </div>
                    </div>

                    {/* INTERACTION LAYER (The "Force Click" Overlay) */}
                    {/* This transparent button covers the entire header area absolutely. */}
                    {/* z-10 ensures it sits on top of everything. */}
                    <button
                      type="button"
                      className="absolute inset-0 w-full h-full z-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      onClickCapture={(e) => {
                        // Using Capture ensures this fires before any bubble-cancellation
                        e.preventDefault();
                        console.log("Gallery Toggle Clicked"); // Debug check
                        setIsGalleryExpanded((prev) => !prev);
                      }}
                      aria-label="Toggle Gallery"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {isGalleryExpanded && (
                      <motion.div
                        key="gallery-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
                          opacity: { duration: 0.3 },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-3 gap-3 pt-4 pb-2">
                          {vendor?.images.map((img, idx) => (
                            <motion.div
                              key={`gallery-img-${idx}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.02 }}
                              whileTap={{ scale: 0.96 }}
                              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer group shadow-sm z-0"
                              // Image clicks are separate from the header logic
                              onClick={(e) => {
                                e.stopPropagation();
                                openImageModal(idx);
                              }}
                            >
                              <SmartMedia
                                src={img}
                                type="image"
                                className="w-full h-full object-cover pointer-events-none"
                                loaderImage="/GlowLoadingGif.gif"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <ZoomIn size={20} className="text-white" />
                              </div>
                              {idx === 0 && (
                                <div className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 pointer-events-none">
                                  <Star size={10} className="fill-white" />
                                  Featured
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mx-auto mb-5">
                    <ImageIcon size={36} className="text-slate-400" />
                  </div>
                  <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-2">No images available</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    The vendor hasn't uploaded any gallery images yet
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "reels":
        return (
          <div className="min-h-[50vh]">
            {profileLoading ? (
              <ReelsLoadingSkeleton />
            ) : reels.length === 0 ? (
              <EmptyReelsState />
            ) : (
              <div className="grid grid-cols-3 gap-[3px] mx-[15px]">
                {reels.map((reel, index) => (
                  <motion.div
                    key={reel?.id || reel?._id || `reel-${index}`}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedReelIndex(index)}
                    className="aspect-[9/16] bg-gray-100 dark:bg-gray-800 overflow-hidden relative cursor-pointer rounded-[10px]"
                  >
                    <SmartMedia
                      src={reel.thumbnail}
                      type="image"
                      className="w-full h-full object-cover"
                      loaderImage="/GlowLoadingGif.gif"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold">
                      <Play size={12} className="fill-white" />
                      {reel.views}
                    </div>
                    <div className="absolute top-2 right-2 text-white text-[9px] font-bold bg-black/60 px-1.5 py-0.5 rounded">
                      {reel.duration}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case "portfolio":
        return (
          <div className="flex flex-col space-y-4">
            {profileLoading && (
              <div className="p-4">
                <div className="grid grid-cols-3 gap-[3px] gap-y-[6px]">
                  {[...Array(3)].map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-[9/10] rounded-[10px] bg-gray-200 dark:bg-gray-700 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            )}

            {!reels || reels.length === 0 ? (
              <PortfolioEmptyState />
            ) : (
              <>
                <div className="grid grid-cols-3 gap-[3px] gap-y-[6px] mx-[15px]">
                  {reels?.slice(0, 3)?.map((reel, index) => (
                    <motion.div
                      key={reel?.id || reel?._id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedReelIndex(index)}
                      className="aspect-[9/10] bg-gray-100 dark:bg-gray-800 overflow-hidden relative cursor-pointer rounded-[10px]"
                    >
                      <SmartMedia
                        src={reel.thumbnail}
                        type="image"
                        className="w-full h-full object-cover"
                        loaderImage="/GlowLoadingGif.gif"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold">
                        <Play size={12} className="fill-white" />
                        {reel.views}
                      </div>
                      <div className="absolute top-2 right-2 text-white text-[9px] font-bold bg-black/60 px-1.5 py-0.5 rounded">
                        {reel.duration}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div>
                  {vendor?.username ? (
                    <ReviewSection vendorId={vendor?.username} vendorName={profile?.vendorName} />
                  ) : (
                    <ReviewsEmptyState />
                  )}
                </div>
              </>
            )}
          </div>
        );

      case "services":
        if (!vendor?.username) {
          return (
            <div className="flex items-center justify-center px-6 py-16">
              <div className="w-full max-w-md text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800">
                  <svg
                    className="w-8 h-8 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Services Not Available Yet</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  The vendor hasn’t uploaded service details yet. Please contact them directly for more information or
                  check back later.
                </p>
                <button className="w-full py-2.5 px-4 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-90 transition">
                  Contact Vendor
                </button>
              </div>
            </div>
          );
        }
        if (vendorLoading) {
          return (
            <div className="p-4 space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          );
        }
        return (
          <div className="p-4 space-y-4 pt-1">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-y border-gray-200 dark:border-gray-800 mb-0"
              >
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-3 py-2">
                  {TAB_CONFIG.map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => {
                        setActiveDetailsTab(tab.id);
                        const url = new URL(window.location.href);
                        url.searchParams.set("tab", "services");
                        url.searchParams.set("details", tab.id);
                        window.history.pushState({}, "", url.toString());
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${activeDetailsTab === tab.id ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
                    >
                      <tab.icon size={12} />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 px-4 py-6 pt-[10px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDetailsTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="space-y-5"
                >
                  {activeDetailsTab === "overview" && (
                    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
                      {vendor.shortDescription && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-slate-900/50 px-4 py-3 rounded-3xl shadow-sm border border-indigo-100/50 dark:border-indigo-900/30"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center shrink-0 ring-1 ring-indigo-200/50 dark:ring-indigo-800/50">
                              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1 pt-1.5">
                              <p className="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
                                "{vendor.shortDescription}"
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {(vendor.basePrice || vendor.perDayPrice?.min) && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 flex items-center justify-center shadow-inner">
                              <IndianRupee size={20} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Pricing
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                Transparent pricing options
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {vendor.basePrice && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/10 rounded-xl border border-emerald-200/60 dark:border-emerald-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-600">
                                    <BadgeIndianRupee size={18} className="text-emerald-600 dark:text-emerald-400" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-[12px] text-slate-600 dark:text-slate-400 block">
                                      Base Price
                                    </span>
                                    <span className="font-medium text-[11px] text-slate-500 dark:text-slate-500">
                                      per {" " + vendor.priceUnit || "day"}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-[18px] text-emerald-600 dark:text-emerald-400">
                                    ₹{vendor.basePrice.toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </motion.div>
                            )}
                            {vendor.perDayPrice?.min && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.02 }}
                                className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-xl border border-blue-200/60 dark:border-blue-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-blue-200 dark:border-blue-600">
                                    <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-[12px] text-slate-600 dark:text-slate-400 block">
                                      Per {vendor.priceUnit} Rate
                                    </span>
                                    <span className="font-medium text-[11px] text-slate-500 dark:text-slate-500">
                                      {vendor.perDayPrice.max ? "Price range" : "Starting from"}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {vendor.perDayPrice.max ? (
                                    <div className="flex items-center gap-1">
                                      <span className="font-black text-[16px] text-blue-600 dark:text-blue-400">
                                        ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
                                      </span>
                                      <span className="font-bold text-[13px] text-slate-400 dark:text-slate-500">
                                        -
                                      </span>
                                      <span className="font-black text-[16px] text-blue-600 dark:text-blue-400">
                                        ₹{vendor.perDayPrice.max.toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="font-black text-[18px] text-blue-600 dark:text-blue-400">
                                      ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                      <CategoryHighlights vendor={vendor} />
                      {vendor.eventTypes?.length > 0 && (
                        <CollapsibleSection
                          title="Event Types We Serve"
                          icon={Calendar}
                          iconColor="text-emerald-600 dark:text-emerald-400"
                          iconBg="bg-gradient-to-br from-emerald-100 to-teal-100"
                          defaultOpen={true}
                          badge={`${vendor.eventTypes?.length} specialized categories`}
                          badgeColor="gray"
                        >
                          <div className="flex flex-wrap gap-2.5">
                            {vendor.eventTypes.map((type, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="px-4 py-2.5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-xl text-[12px] font-semibold flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                {type}
                              </motion.span>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}
                      {vendor.operatingHours && (
                        <CollapsibleSection
                          title="Operating Hours"
                          icon={Clock}
                          iconColor="text-blue-600 dark:text-blue-400"
                          iconBg="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
                          defaultOpen={false}
                          badge={`${vendor.operatingHours.length} schedules`}
                          badgeColor="blue"
                        >
                          <div className="space-y-2.5 mt-2">
                            {vendor?.operatingHours?.length > 0 ? (
                              vendor.operatingHours.length === 1 ? (
                                <div className="flex justify-between items-center py-3.5 px-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                  <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                                    {vendor.operatingHours[0].day}
                                  </span>
                                  <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700/50 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
                                    {vendor.operatingHours[0].hours}
                                  </span>
                                </div>
                              ) : (
                                vendor.operatingHours.map((schedule, i) => (
                                  <div
                                    key={i}
                                    className="flex justify-between items-center py-3.5 px-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                                  >
                                    <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                                      {schedule.day}
                                    </span>
                                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700/50 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
                                      {schedule.hours}
                                    </span>
                                  </div>
                                ))
                              )
                            ) : (
                              <div className="py-3.5 px-4 text-[12px] text-slate-500 dark:text-slate-400 italic">
                                Operating hours not available
                              </div>
                            )}
                          </div>
                        </CollapsibleSection>
                      )}
                      {vendor.amenities?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 flex items-center justify-center shadow-inner">
                              <Check size={20} className="text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Amenities & Services
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {vendor.amenities.length} premium facilities
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {vendor.amenities.map((item, idx) => {
                              const Icon = AMENITY_ICONS[item] || Check;
                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.02 }}
                                  className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                                >
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">
                                    <Icon size={16} className="text-slate-600 dark:text-slate-400" />
                                  </div>
                                  <span className="font-medium text-[11.5px] text-slate-700 dark:text-slate-300 leading-tight">
                                    {item}
                                  </span>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                      {vendor.highlightPoints?.length > 0 && (
                        <CollapsibleSection
                          title="Why Choose Us"
                          icon={BadgeCheck}
                          iconColor="text-amber-600 dark:text-amber-400"
                          iconBg="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40"
                          defaultOpen={true}
                          badge={`${vendor.highlightPoints?.length} unique advantages`}
                          badgeColor="gray"
                        >
                          <div className="space-y-3">
                            {vendor.highlightPoints.map((point, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-3.5 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border-l-2 border-amber-400 dark:border-amber-500/50 shadow-sm"
                              >
                                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                  <Sparkles size={14} className="text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="text-[12.5px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                                  {point}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}
                      {vendor.specialOffers?.length > 0 && (
                        <CollapsibleSection
                          title="Special Offers"
                          icon={Percent}
                          iconColor="text-rose-600 dark:text-rose-400"
                          iconBg="bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40"
                          defaultOpen={false}
                          badge={`${vendor.specialOffers.length} active deals`}
                          badgeColor="rose"
                        >
                          <div className="space-y-3.5 mt-2">
                            {vendor.specialOffers.map((offer, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/10 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-2xl" />
                                <div className="relative">
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2.5">
                                      <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-black rounded-xl shadow-md">
                                        {offer.discount}
                                      </span>
                                      <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                                        {offer.title}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                    {offer.description}
                                  </p>
                                  {offer.validTill && (
                                    <div className="flex items-center gap-2 text-[10.5px] text-slate-500 dark:text-slate-500 bg-white/70 dark:bg-slate-800/50 px-3 py-2 rounded-xl w-fit shadow-sm border border-slate-200 dark:border-slate-700">
                                      <Clock size={12} />
                                      <span className="font-semibold">Valid till: {offer.validTill}</span>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}
                      {vendor.description && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-inner">
                              <Info size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                About {vendor.name}
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                Our story and mission
                              </p>
                            </div>
                          </div>
                          <div
                            className={`relative overflow-hidden transition-all duration-500 ease-out ${showFullDescription ? "max-h-[2000px]" : "max-h-[150px]"}`}
                          >
                            <p className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {vendor.description}
                            </p>
                            {!showFullDescription && (
                              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent " />
                            )}
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="mt-5 text-slate-700 dark:text-slate-300 font-semibold text-[12px] flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 px-5 py-3 rounded-xl hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700/50 transition-all duration-200 shadow-sm border border-slate-200 dark:border-slate-700"
                          >
                            {showFullDescription ? "Show Less" : "Read Full Story"}
                            <motion.div
                              animate={{ rotate: showFullDescription ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={15} />
                            </motion.div>
                          </motion.button>
                        </motion.div>
                      )}
                      <SocialLinksSection socialLinks={vendor.socialLinks} />
                    </motion.div>
                  )}
                  {activeDetailsTab === "category" && (
                    <CategorySpecificSection vendor={vendor} formatPrice={formatPrice} />
                  )}
                  {activeDetailsTab === "services" && (
                    <div className="space-y-5">
                      {vendor.facilities?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 flex items-center justify-center shadow-inner">
                              <Star size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Premium Facilities
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {vendor.facilities.length} exclusive features
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {vendor.facilities.map((facility, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                              >
                                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                  <Star size={14} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300">
                                  {facility}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {vendor.awards?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 flex items-center justify-center shadow-inner">
                              <Trophy size={20} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Awards & Recognition
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {vendor.awards.length} prestigious honors
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3.5">
                            {vendor?.awards.map((award, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-4 p-4.5 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/20 dark:via-yellow-950/10 dark:to-orange-950/5 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 shadow-sm"
                              >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 flex items-center justify-center shrink-0 shadow-md">
                                  <Trophy size={22} className="text-white" />
                                </div>
                                <div className="flex-1 pt-1">
                                  <p className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100 leading-relaxed mb-1">
                                    {award.title}
                                  </p>
                                  {award.year && (
                                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                                      {award.year}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      {vendor.amenities?.length > 0 && (
                        <CollapsibleSection
                          title="Complete Amenities List"
                          icon={Check}
                          iconColor="text-blue-600 dark:text-blue-400"
                          iconBg="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
                        >
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            {vendor.amenities.map((item, idx) => {
                              const Icon = AMENITY_ICONS[item] || Check;
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2.5 p-3 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                                >
                                  <Icon size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                                  <span className="font-medium text-[11px] text-slate-700 dark:text-slate-300">
                                    {item}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </CollapsibleSection>
                      )}
                    </div>
                  )}
                  {activeDetailsTab === "packages" && (
                    <div className="space-y-5">
                      {vendor.packages?.length > 0 ? (
                        vendor.packages.map((pkg, i) => (
                          <motion.div
                            key={pkg._id || i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <PackageCard
                              pkg={pkg}
                              isSelected={selectedPackage === (pkg.id || pkg._id)}
                              onSelect={setSelectedPackage}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <Gift size={36} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                            No packages listed yet
                          </p>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Contact the vendor directly for customized pricing and package options
                          </p>
                        </div>
                      )}
                      {vendor.paymentMethods?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shadow-inner">
                              <HandCoins size={20} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Payment Options
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {vendor.paymentMethods.length} secure methods
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2.5">
                            {vendor.paymentMethods.map((method, i) => (
                              <span
                                key={i}
                                className="px-4 py-2.5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/60 rounded-xl text-[12px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                {method}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                  {activeDetailsTab === "insights" && (
                    <div className="space-y-3.5">
                      {vendor.highlights?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shadow-inner">
                              <Sparkles size={20} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Key Highlights
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {vendor.highlights.length} standout features
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {vendor.highlights.map((highlight, idx) => {
                              const ICON_MAP = {
                                trophy: Trophy,
                                users: Users,
                                timer: Timer,
                                medal: Medal,
                                star: Star,
                                award: Award,
                                zap: Zap,
                                heart: Heart,
                                thumbsup: ThumbsUp,
                                trendingup: TrendingUp,
                              };
                              const key = highlight?.icon?.toLowerCase()?.replace(/\s+/g, "").replace(/_/g, "-");
                              const IconComponent = ICON_MAP[key] || Star;
                              const colorClass = highlight.color || "text-slate-600 dark:text-slate-400";
                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.02 }}
                                  className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">
                                      <IconComponent size={18} className={colorClass} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="font-semibold text-[12px] text-slate-700 dark:text-slate-300 block truncate">
                                        {highlight.label}
                                      </span>
                                      {highlight.value && (
                                        <span className="font-medium text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                                          {highlight.value}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                      {vendor.stats?.length > 0 && (
                        <motion.div
                          variants={fadeInUp}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-inner">
                              <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Performance Stats
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                Real-time metrics & growth
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {vendor.stats.map((stat, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                className="p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-[12px] text-slate-600 dark:text-slate-400">
                                    {stat.label}
                                  </span>
                                  {stat.trend && (
                                    <div
                                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${stat.positive ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"}`}
                                    >
                                      {stat.positive ? (
                                        <TrendingUp size={11} className="shrink-0" />
                                      ) : (
                                        <TrendingDown size={11} className="shrink-0" />
                                      )}
                                      <span>{stat.trend}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-baseline gap-2">
                                  <span className="font-black text-[24px] text-slate-800 dark:text-slate-100">
                                    {stat.value}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                  {activeDetailsTab === "faqs" && (
                    <div className="space-y-3.5">
                      {vendor.faqs?.length > 0 ? (
                        vendor.faqs.map((faq, idx) => (
                          <motion.div
                            key={`faq-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 relative"
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedFaq((prev) => (prev === idx ? null : idx))}
                              className="w-full p-5 flex items-start justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-200 cursor-pointer relative z-10"
                            >
                              <div className="flex items-start gap-4 flex-1 pr-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                  <span className="text-blue-600 dark:text-blue-400 font-bold text-[13px]">Q</span>
                                </div>
                                <span className="font-bold text-[13px] text-slate-800 dark:text-slate-100 leading-relaxed pt-1.5">
                                  {faq.question}
                                </span>
                              </div>
                              <div className="shrink-0">
                                <ChevronDown
                                  size={20}
                                  className={`text-slate-400 dark:text-slate-500 mt-1.5 transition-transform duration-200 ${expandedFaq === idx ? "rotate-180" : "rotate-0"}`}
                                />
                              </div>
                            </button>
                            <AnimatePresence initial={false}>
                              {expandedFaq === idx && (
                                <motion.div
                                  key={`answer-${idx}`}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                >
                                  <div className="px-5 pb-5 pt-0">
                                    <div className="flex items-start gap-4 p-4.5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[13px]">
                                          A
                                        </span>
                                      </div>
                                      <p className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed pt-1.5">
                                        {faq.answer}
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))
                      ) : (
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <FileText size={36} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                            No FAQs available yet
                          </p>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Have questions? Feel free to contact the vendor directly for any inquiries
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {activeDetailsTab === "policies" && (
                    <div className="space-y-5">
                      {vendor.policies?.length > 0 ? (
                        vendor.policies.map((policy, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                          >
                            <div className="flex items-start gap-4 mb-5">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                <Shield size={22} className="text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="flex-1 pt-1">
                                <h4 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 mb-2 tracking-tight">
                                  {policy.title}
                                </h4>
                                <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {policy.content}
                                </p>
                              </div>
                            </div>
                            {policy.details?.length > 0 && (
                              <div className="space-y-2.5 ml-16">
                                {policy.details.map((detail, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                                  >
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                      <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-[11.5px] text-slate-700 dark:text-slate-300 font-medium">
                                      {detail}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))
                      ) : (
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <Shield size={36} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                            No policies listed yet
                          </p>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Contact the vendor directly for detailed terms, conditions, and policies
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {activeDetailsTab === "location" && (
                    <div className="space-y-5">
                      <motion.div
                        variants={fadeInUp}
                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                      >
                        <div className="flex gap-4 mb-6">
                          <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-sm">
                            <MapPin size={26} />
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 mb-2.5 tracking-tight">
                              Complete Address
                            </h4>
                            <p className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                              {vendor.address?.street}
                            </p>
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
                              {vendor.address?.city}, {vendor.address?.state} {vendor.address?.postalCode}
                            </p>
                            {vendor.address?.country && (
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                {vendor.address.country}
                              </p>
                            )}
                          </div>
                        </div>
                        {vendor.address?.googleMapUrl && (
                          <motion.a
                            href={vendor.address.googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Navigation size={19} />
                            Open in Google Maps
                            <ExternalLink size={16} />
                          </motion.a>
                        )}
                      </motion.div>
                      {vendor.landmarks?.length > 0 && (
                        <CollapsibleSection
                          title="Nearby Landmarks"
                          icon={Compass}
                          iconColor="text-blue-600 dark:text-blue-400"
                          iconBg="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
                        >
                          <div className="space-y-3 mt-2">
                            {vendor.landmarks.map((landmark, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center shadow-sm">
                                    <MapPin size={15} className="text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                  <span className="text-[12px] text-slate-700 dark:text-slate-300 font-semibold">
                                    {landmark.name}
                                  </span>
                                </div>
                                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-3.5 py-2 rounded-xl shadow-sm">
                                  {landmark.distance}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}
                      {vendor.directions?.length > 0 && (
                        <CollapsibleSection
                          title="How to Reach"
                          icon={Route}
                          iconColor="text-emerald-600 dark:text-emerald-400"
                          iconBg="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40"
                        >
                          <div className="space-y-3.5 mt-2">
                            {vendor.directions.map((dir, i) => (
                              <div
                                key={i}
                                className="p-5 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-800/30 dark:via-slate-800/20 dark:to-slate-800/10 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                              >
                                <div className="flex items-center gap-3.5 mb-3">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shadow-sm">
                                    {dir.type?.includes("Metro") ? (
                                      <MapIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                      <Car size={18} className="text-emerald-600 dark:text-emerald-400" />
                                    )}
                                  </div>
                                  <p className="text-[12px] font-bold text-slate-800 dark:text-slate-100">{dir.type}</p>
                                </div>
                                <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed ml-12">
                                  {dir.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CollapsibleSection>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getPlainTextLength = (html) => {
    if (!html) return 0;
    // Replaces all HTML tags with an empty string to get raw text length
    return html.replace(/<[^>]*>/g, "").trim().length;
  };

  const sanitizeHtml = (html) => {
    if (typeof window !== "undefined") {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "u", "s", "h1", "h2", "h3", "ul", "ol", "li", "a", "span"],
        ALLOWED_ATTR: ["href", "target", "rel", "class", "style"],
      });
    }
    return html;
  };

  const vendorProfile = Array.isArray(vendor?.vendorProfile) ? vendor.vendorProfile[0] : vendor?.vendorProfile;
  const vendorImage =
    profile?.vendorAvatar ||
    vendorProfile?.profilePicture ||
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop";

  const defaultBio = `📸 Professional Event Photographer
🎬 Capturing moments that last forever
🏆 Award-winning coverage
📍 Available for bookings worldwide
💼 5+ years of experience`;

  // Default UI (First UI - Enhanced and Fixed)
  return (
    <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 overflow-x-hidden">
      {/* Onboarding Drawer */}
      <VendorProfileOnboarding
        vendor={vendor}
        id={id}
        onProfileCreated={handleProfileCreated}
        isOpen={openOnboardingDrawer}
        onClose={() => {
          setOpenOnboardingDrawer(false);
          updateURLParams({ onboarding: null });
        }}
      />

      <ThumbsUpAnimation show={showThumbsUpAnimation} />
      <FloatingConfirmation
        show={showConfirmation.show}
        icon={showConfirmation.icon}
        message={showConfirmation.message}
        type={showConfirmation.type}
      />

      {/* ============ FIXED HEADER ============ */}
      <div
        className={`fixed top-[82px] max-w-[800px] mx-auto left-0 right-0 z-[40] transition-all duration-500 ease-out rounded-xl ${isScrolledHeader
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-800/50"
          : "bg-transparent"
          }`}
      >
        <div className="px-4 lg:px-6">
          {/* Row 1: Navigation Controls */}
          <div
            className="hidden items-center justify-between py-3 pb-0"
            style={{ paddingBottom: showHeaderTabs ? 0 : "8px", display: isScrolledHeader ? "flex" : "none" }}
          >
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleBack}
              className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-lg transition-all duration-500 ease-out ${isScrolledHeader
                ? "border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800"
                : "border-white/10 shadow-black/20 bg-black/20 backdrop-blur-sm"
                }`}
            >
              <ArrowLeft
                size={20}
                className={`transition-colors duration-500 ease-out ${isScrolledHeader ? "text-slate-700 dark:text-slate-200" : "text-white"
                  }`}
              />
            </motion.button>

            {profile.username && isScrolledHeader && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2 flex-1 min-w-0 ml-3"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-800">
                  <SmartMedia
                    src={
                      profile?.vendorAvatar ||
                      (Array.isArray(vendor?.vendorProfile)
                        ? vendor.vendorProfile[0]?.profilePicture
                        : vendor?.vendorProfile?.profilePicture) ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                    }
                    type="image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-bold truncate text-slate-900 dark:text-white">{profile?.vendorBusinessName || profile?.vendorName || vendor?.name}</span>
                {(profile?.isVerified || vendor?.isVerified) && (
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </motion.div>
            )}

            {/* Right: Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleShare}
                className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-lg transition-all duration-500 ease-out ${isScrolledHeader
                  ? "border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800"
                  : "border-white/10 shadow-black/20 bg-black/20 backdrop-blur-sm"
                  }`}
              >
                <Share2
                  size={18}
                  className={`transition-colors duration-500 ease-out ${isScrolledHeader ? "text-slate-700 dark:text-slate-200" : "text-white"
                    }`}
                />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowMoreOptions(true)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-lg transition-all duration-500 ease-out ${isScrolledHeader
                  ? "border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800"
                  : "border-white/10 shadow-black/20 bg-black/20 backdrop-blur-sm"
                  }`}
              >
                <MoreVertical
                  size={18}
                  className={`transition-colors duration-500 ease-out ${isScrolledHeader ? "text-slate-700 dark:text-slate-200" : "text-white"
                    }`}
                />
              </motion.button>
            </motion.div>
          </div>

          {/* Row 2: Tab Navigation (appears on scroll) */}
          <AnimatePresence mode="wait">
            {showHeaderTabs && !isCoverExpanded && isScrolledHeader && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transition: {
                    height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.3, delay: 0.1 },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: { height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } },
                }}
                className="overflow-hidden border-t border-slate-200/50 dark:border-slate-800/50"
              >
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                    className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 mt-2 transition-all duration-500 ease-out rounded-t-xl"
                  >
                    <LayoutGroup id="header-tabs">
                      <div className="flex overflow-x-auto no-scrollbar">
                        {TABS.map((tab, index) => (
                          <motion.button
                            key={tab.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: { delay: 0.2 + index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                            }}
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            onClick={() => {
                              setActiveTab(tab.id);
                              const url = new URL(window.location.href);
                              url.searchParams.set("tab", tab.id);
                              if (tab.id !== "services") url.searchParams.delete("details");
                              window.history.pushState({}, "", url.toString());
                            }}
                            className="flex-1 min-w-[82px] py-4 flex items-center justify-center gap-2 text-[12px] font-bold capitalize relative cursor-pointer"
                            style={{
                              color: activeTab === tab.id ? categoryColor.primary : "rgb(107, 114, 128)",
                              transition: "color 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                          >
                            <motion.div
                              animate={{
                                scale: activeTab === tab.id ? 1 : 1,
                                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                              }}
                            >
                              <tab.icon size={19} />
                            </motion.div>
                            {activeTab === tab.id && (
                              <motion.div
                                layoutId="header-tab-indicator"
                                className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full"
                                style={{
                                  background: `linear-gradient(90deg, ${categoryColor.primary}, ${categoryColor.secondary})`,
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.8 }}
                              />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </LayoutGroup>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <main className="pb-10 !pt-[100px] lg:pt-24 max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left Column - Main Content */}
          <div className="min-w-0">
            {/* ============ LINKEDIN-STYLE HERO CARD ============ */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              {/* Cover Image */}
              <motion.div
                layout
                initial={false}
                animate={{ height: isCoverExpanded ? "20rem" : "12rem" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => setIsCoverExpanded(!isCoverExpanded)}
                className="relative overflow-hidden cursor-pointer group"
              >
                {vendorLoading ? (
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </div>
                ) : profile?.vendorCoverImage ? (
                  <SmartMedia
                    src={profile.vendorCoverImage}
                    type="image"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loaderImage="/GlowLoadingGif.gif"
                    onLoad={() => setCoverImageLoaded(true)}
                  />
                ) : vendor?.images?.[0] ? (
                  <SmartMedia
                    src={vendor.images[4] || vendor.images[0]}
                    type="image"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loaderImage="/GlowLoadingGif.gif"
                    onLoad={() => setCoverImageLoaded(true)}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${categoryColor.gradient}`} />
                )}

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Expand hint */}
                <motion.div
                  animate={{ opacity: isCoverExpanded ? 0 : 1 }}
                  className="absolute bottom-3 right-3 text-white/70 text-[10px] bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  {isCoverExpanded ? "Click to collapse" : "Click to expand"}
                </motion.div>
              </motion.div>

              {/* Profile Section */}
              <div className="relative px-6 pb-6">
                {/* Profile Picture - LinkedIn Style Overlap */}
                <div className="flex items-end justify-between" style={{ marginTop: "-105px" }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: smoothEase }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowProfilePicture(true)}
                    className="relative cursor-pointer group z-10"
                  >
                    {vendorLoading ? (
                      <div className="w-[180px] h-[180px] rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse ring-4 ring-white dark:ring-slate-900" />
                    ) : (
                      <div
                        className="w-[180px] h-[180px] rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-900 transition-all duration-300 group-hover:ring-offset-2 group-hover:ring-offset-white dark:group-hover:ring-offset-slate-900"
                        style={{ boxShadow: `0 8px 32px -8px rgba(${categoryColor.rgb}, 0.3)` }}
                      >
                        <SmartMedia
                          src={
                            profile?.vendorAvatar ||
                            (Array.isArray(vendor?.vendorProfile)
                              ? vendor.vendorProfile[0]?.profilePicture
                              : vendor?.vendorProfile?.profilePicture) ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                          }
                          type="image"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loaderImage="/GlowLoadingGif.gif"
                        />
                      </div>
                    )}
                    {vendor?.isVerified && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 500, damping: 20 }}
                        className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ring-3 ring-white dark:ring-slate-900 shadow-lg"
                      >
                        <BadgeCheck size={18} className="text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Action Buttons - Top Right */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setShowContactDrawer(true)}
                      className="px-5 py-2.5 rounded-full font-semibold text-[13px] text-white flex items-center gap-2 transition-all duration-300 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${categoryColor.primary}, ${categoryColor.secondary})`,
                        boxShadow: `0 4px 16px -4px rgba(${categoryColor.rgb}, 0.4)`,
                      }}
                    >
                      <MessageCircle size={16} />
                      Contact
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setShowMoreOptions(true)}
                      className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <MoreHorizontal size={18} className="text-slate-600 dark:text-slate-400" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Profile Info */}
                <div className="mt-4">
                  {vendorLoading ? (
                    <div className="space-y-3">
                      <div className="h-7 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                      <div className="h-5 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                      <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                    >
                      {/* Name & Premium Badge */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-[24px] lg:text-[28px] font-serif font-bold text-slate-900 dark:text-white leading-tight">
                          {vendor?.name || profile?.vendorBusinessName || profile?.vendorName}
                        </h1>
                        {(profile?.isPremium || vendor?.isPremium) && (
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-md shadow-amber-500/30">
                            <Crown size={12} />
                            PREMIUM
                          </span>
                        )}
                      </div>

                      {/* Title/Category */}
                      <p className="text-[15px] lg:text-[17px] text-slate-700 dark:text-slate-300 mt-1.5 font-medium">
                        {profile?.category || vendor?.category || "Photography"} Professional
                      </p>

                      {/* Company Info Row */}
                      <div className="flex items-center gap-2 mt-2 text-[13px] text-slate-500 dark:text-slate-400">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center"
                          style={{ backgroundColor: `rgba(${categoryColor.rgb}, 0.1)` }}
                        >
                          <Building2 size={12} style={{ color: categoryColor.primary }} />
                        </div>
                        <span className="font-medium" style={{ color: categoryColor.primary }}>
                          {profile?.category || vendor?.category || "Photography"} Services
                        </span>
                      </div>

                      {/* Location & Contact */}
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-[13px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {profile?.location?.city || vendor?.address?.city || "Mumbai"}, {profile?.location?.state || profile?.location?.country || vendor?.address?.state || "India"}
                        </span>
                        <span
                          className="flex items-center gap-1.5 hover:text-blue-600 hover:underline cursor-pointer"
                          onClick={() => setShowContactDrawer(true)}
                        >
                          Contact info
                        </span>
                      </div>

                      {/* Stats Row */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5, ease: smoothEase }}
                        className="flex items-center justify-around lg:justify-center lg:gap-12 py-1.5 lg:py-3 border-y border-gray-100 dark:border-gray-800/80 mx-1 mt-2 lg:mt-4"
                      >
                        {stats.map((stat, idx) => (
                          <React.Fragment key={idx}>
                            {stat.showSkeleton ? (
                              <StatSkeleton />
                            ) : (
                              <motion.button
                                whileTap={{ scale: stat.loading ? 1 : 0.94 }}
                                transition={smoothSpring}
                                onClick={
                                  stat.label === "Trust"
                                    ? handleTrustWithBounce
                                    : stat.label === "Likes"
                                      ? handleLikeWithBounce
                                      : stat.action
                                }
                                disabled={stat.loading}
                                className="flex flex-col items-center px-5 lg:px-8 py-2 rounded-2xl transition-all duration-300 cursor-pointer"
                                style={{
                                  backgroundColor: stat.active ? `rgba(${categoryColor.rgb}, 0.1)` : "transparent",
                                }}
                              >
                                <motion.span
                                  animate={stat.loading ? { opacity: [1, 0.4, 1] } : {}}
                                  transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                  className="text-[18px] lg:text-[22px] font-black transition-colors duration-300"
                                  style={{
                                    color: stat.active ? categoryColor.primary : undefined,
                                  }}
                                >
                                  {stat.value}
                                </motion.span>
                                <span className="text-[10px] lg:text-[12px] text-gray-500 dark:text-gray-400 font-semibold tracking-wide">
                                  {stat.label}
                                </span>
                              </motion.button>
                            )}
                            {idx < stats.length - 1 && <div className="w-px h-9 bg-gray-200 dark:bg-gray-700/80" />}
                          </React.Fragment>
                        ))}
                      </motion.div>

                      {/* Connection Count */}
                      {/* <div className="flex items-center gap-3 mt-3">
                          <span className="text-[13px] font-semibold" style={{ color: categoryColor.primary }}>
                            {vendor?.trustedBy?.length || 0}+ connections
                          </span>
                          {reviews?.length > 0 && (
                            <>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <span className="flex items-center gap-1 text-[13px] text-slate-600 dark:text-slate-400">
                                <Star size={14} className="text-amber-500 fill-amber-500" />
                                <span className="font-semibold">
                                  {(reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)}
                                </span>
                                <span>({reviews.length} reviews)</span>
                              </span>
                            </>
                          )}
                        </div> */}

                      {/* Mutual Connections Preview */}
                      {/* <div className="flex items-center gap-2 mt-3">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 ring-2 ring-white dark:ring-slate-900 overflow-hidden"
                              >
                                <img
                                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          <span className="text-[12px] text-slate-500 dark:text-slate-400">
                            <span className="font-medium text-slate-700 dark:text-slate-300">12 mutual connections</span>
                          </span>
                        </div> */}
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons Row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="flex items-center justify-end gap-2 mt-5 flex-wrap min-w-full"
                >
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={handleTrustWithBounce}
                    className="px-16 py-3 rounded-full font-semibold text-[13px] flex items-center gap-2 transition-all duration-300 cursor-pointer"
                    style={{
                      background: hasTrusted
                        ? "linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
                        : `linear-gradient(135deg, ${categoryColor.primary}, ${categoryColor.secondary})`,
                      color: "white",
                      boxShadow: hasTrusted
                        ? "0 4px 16px -4px rgba(34, 197, 94, 0.4)"
                        : `0 4px 16px -4px rgba(${categoryColor.rgb}, 0.4)`,
                    }}
                  >
                    <motion.div
                      animate={hasTrusted ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.15, 1.1, 1.05, 1] } : {}}
                      transition={{ duration: 0.5, ease: smoothEase }}
                    >
                      <ThumbsUp size={16} className={hasTrusted ? "fill-white" : ""} />
                    </motion.div>
                    {hasTrusted ? "Trusted" : "Trust"}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowBookingDrawer(true)}
                    className="px-6 py-2.5 rounded-full font-semibold text-[13px] border-2 flex items-center gap-2 transition-all duration-300 cursor-pointer"
                    style={{
                      borderColor: categoryColor.primary,
                      color: categoryColor.primary,
                    }}
                  >
                    <Calendar size={16} />
                    Book Now
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.05)" }}
                    onClick={handleSaveProfile}
                    className="px-5 py-2.5 rounded-full font-semibold text-[13px] border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-all duration-300 cursor-pointer"
                  >
                    <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
                    {isSaved ? "Saved" : "Save"}
                  </motion.button>
                </motion.div>
              </div>
            </motion.section>

            {/* ============ BIO & ABOUT SECTION ============ */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: smoothEase }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-4 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-[18px] font-bold text-slate-900 dark:text-white mb-4">About</h2>

                {profileLoading ? (
                  <BioSkeleton />
                ) : (
                  <>
                    <motion.div
                      initial={false}
                      animate={{ height: isBioExpanded ? "auto" : "4.5rem" }}
                      transition={{ duration: 0.5, ease: smoothEase }}
                      className="relative overflow-hidden"
                    >
                      <div
                        className="text-[14px] lg:text-[15px] text-slate-600 dark:text-slate-300 leading-[1.7]"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(profile?.bio || defaultBio) }}
                      />
                      {!isBioExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
                      )}
                    </motion.div>

                    {getPlainTextLength(profile?.bio || defaultBio) > 120 && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setIsBioExpanded(!isBioExpanded)}
                        className="text-[13px] font-semibold mt-3 transition-colors duration-300 flex items-center gap-1 cursor-pointer"
                        style={{ color: categoryColor.primary }}
                      >
                        {isBioExpanded ? "Show less" : "...see more"}
                      </motion.button>
                    )}
                  </>
                )}

                {/* Links Section */}
                <AnimatePresence>
                  {(profile?.website || profile?.socialLinks?.instagram) && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="flex items-center gap-2 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar"
                    >
                      {profile.website && (
                        <motion.a
                          whileTap={{ scale: 0.96 }}
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-[12px] font-semibold flex-shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                          <Globe size={14} />
                          Website
                          <ExternalLink size={10} />
                        </motion.a>
                      )}
                      {profile.socialLinks?.instagram && (
                        <motion.a
                          whileTap={{ scale: 0.96 }}
                          href={profile.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-semibold flex-shrink-0 transition-all"
                          style={{ backgroundColor: `rgba(${categoryColor.rgb}, 0.1)`, color: categoryColor.primary }}
                        >
                          <Instagram size={14} />
                          Instagram
                        </motion.a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* ============ HIGHLIGHTS SECTION ============ */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: smoothEase }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-4 min-w-full flex items-center justify-center overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[18px] font-bold text-slate-900 dark:text-white">Highlights</h2>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleHighlightPrev}
                      disabled={currentHighlightIndex === 0}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${currentHighlightIndex === 0
                        ? "border-slate-200 dark:border-slate-700 opacity-40 cursor-not-allowed"
                        : "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        }`}
                    >
                      <ChevronLeft size={16} className="text-slate-600 dark:text-slate-400" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleHighlightNext}
                      disabled={currentHighlightIndex >= MOCK_HIGHLIGHTS.length - 1}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${currentHighlightIndex >= MOCK_HIGHLIGHTS.length - 1
                        ? "border-slate-200 dark:border-slate-700 opacity-40 cursor-not-allowed"
                        : "border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        }`}
                    >
                      <ChevronRight size={16} className="text-slate-600 dark:text-slate-400" />
                    </motion.button>
                  </div>
                </div>

                <div ref={highlightsContainerRef} className="overflow-x-auto no-scrollbar">
                  {profileLoading ? (
                    <HighlightsSkeleton />
                  ) : (
                    <motion.div className="flex gap-4 pb-2" style={{ minWidth: "max-content" }}>
                      {MOCK_HIGHLIGHTS.map((highlight, index) => (
                        <motion.button
                          key={highlight.id}
                          initial={{ opacity: 0, y: 15, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.1 + index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setSelectedHighlight(highlight)}
                          className="flex flex-col items-center gap-2.5 shrink-0 group cursor-pointer"
                        >
                          <div
                            className="w-[72px] h-[72px] lg:w-[80px] lg:h-[80px] rounded-full overflow-hidden p-[3px] transition-transform duration-300 group-hover:scale-105"
                            style={{
                              background: `linear-gradient(135deg, ${categoryColor.primary}, ${categoryColor.secondary})`,
                            }}
                          >
                            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-900 p-[2px]">
                              <SmartMedia
                                src={highlight.image}
                                type="image"
                                className="w-full h-full object-cover rounded-full"
                                loaderImage="/GlowLoadingGif.gif"
                              />
                            </div>
                          </div>
                          <span className="text-[11px] lg:text-[12px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-[80px]">
                            {highlight.title}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.section>

            {/* ============ TAB NAVIGATION ============ */}
            <motion.div
              ref={stickyTabsRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: smoothEase }}
              className="bg-white dark:bg-slate-900 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 mt-4 transition-all duration-300 sticky top-[56px] lg:top-[60px] z-[35] rounded-xl shadow-sm min-w-full flex items-center justify-center"
            >
              <LayoutGroup id="sticky-tabs">
                <div className="flex overflow-x-auto no-scrollbar">
                  {TABS.map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setActiveTab(tab.id);
                        const url = new URL(window.location.href);
                        url.searchParams.set("tab", tab.id);
                        if (tab.id !== "services") url.searchParams.delete("details");
                        window.history.pushState({}, "", url.toString());
                      }}
                      className="flex-1 min-w-[82px] lg:min-w-[120px] lg:flex-none lg:px-8 py-4 flex items-center justify-center gap-2 text-[12px] lg:text-[14px] font-bold capitalize transition-all duration-300 relative cursor-pointer"
                      style={{ color: activeTab === tab.id ? categoryColor.primary : "rgb(107, 114, 128)" }}
                    >
                      <tab.icon size={19} />
                      <span className="hidden md:inline">{tab.id}</span>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="sticky-tab-indicator"
                          className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${categoryColor.primary}, ${categoryColor.secondary})`,
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.8 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </LayoutGroup>
            </motion.div>

            {/* ============ TAB CONTENT ============ */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: smoothEase }}
                className="bg-white dark:bg-slate-900 min-h-[50vh] relative z-[1] rounded-xl border border-slate-200 dark:border-slate-800 mt-4 shadow-sm overflow-hidden"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* End Left Column */}

          {/* Right Column - Sidebar */}
          {/* Right Column - Sidebar */}
          <div className="hidden lg:block">
            <RightSidebar
              categoryColor={categoryColor}
              router={router}
              vendorProfileId={profile?._id}
              setShowBookingDrawer={setShowBookingDrawer}
              setShowUpdateProfileDrawer={setShowUpdateProfileDrawer}
              setShowUploadModal={setShowUploadModal}
              setShowMoreOptions={setShowMoreOptions}
              setShowQRModal={setShowQRModal}
              isVerified={isVerified}
            />
          </div>
        </div>
      </main>

      {/* ============ FLOATING ACTION BUTTONS ============ */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: smoothEase }}
        className="fixed bottom-7 right-4 lg:right-6 xl:right-8 flex flex-col gap-3 z-[45]"
      >
        {/* Edit Profile Button */}
        {isVerified && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
            onClick={() => {
              if (!isSignedIn) {
                requireSignIn("Please sign in to edit profile");
                return;
              }
              setShowUpdateProfileDrawer(true);
              updateURLParams({ update: "true" });
            }}
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full shadow-xl flex items-center justify-center cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${categoryColor.primary}, ${categoryColor.secondary})`,
              boxShadow: `0 8px 24px -4px rgba(${categoryColor.rgb}, 0.5)`,
            }}
          >
            <Edit2Icon size={21} className="text-white" />
          </motion.button>
        )}

        {/* Upload Content Button */}
        {isVerified && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
            onClick={() => {
              if (!isSignedIn) {
                requireSignIn("Please sign in to upload content");
                return;
              }
              setShowUploadModal(true);
              updateURLParams({ upload: "true" });
            }}
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full text-white shadow-xl flex items-center justify-center cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${categoryColor.primary}, ${categoryColor.secondary})`,
              boxShadow: `0 8px 24px -4px rgba(${categoryColor.rgb}, 0.5)`,
            }}
          >
            <Plus size={24} strokeWidth={2.5} />
          </motion.button>
        )}
      </motion.div>

      {/* ============ ALL MODALS & DRAWERS ============ */}
      <AnimatePresence>
        {showProfilePicture && (
          <ProfilePictureModal
            isOpen={showProfilePicture}
            onClose={() => setShowProfilePicture(false)}
            image={
              profile?.vendorAvatar ||
              (Array.isArray(vendor?.vendorProfile)
                ? vendor.vendorProfile[0]?.profilePicture
                : vendor?.vendorProfile?.profilePicture) ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
            }
            name={vendor?.name}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedHighlight && <StoryViewer highlight={selectedHighlight} onClose={() => setSelectedHighlight(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            posts={posts}
            initialIndex={posts.findIndex((p) => p._id === selectedPost._id)}
            onClose={() => setSelectedPost(null)}
            vendorName={vendor?.name || profile?.vendorBusinessName || profile?.vendorName}
            vendorImage={
              profile?.vendorAvatar ||
              (Array.isArray(vendor?.vendorProfile)
                ? vendor.vendorProfile[0]?.profilePicture
                : vendor?.vendorProfile?.profilePicture) ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
            }
            onDelete={() => handleDeletePost(selectedPost._id)}
            onEdit={(newCaption) => handleEditPost(selectedPost._id, newCaption)}
            onArchive={() => handleArchivePost(selectedPost._id)}
            vendorId={vendor?.username}
            vendorUsername={profile?.username || vendor?.username}
            allInteractions={postsInteractionsData}
            isVerified={isVerified}
            profileId={profile?._id}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedReelIndex !== null && (
          <ReelsViewer
            reels={reels}
            initialIndex={selectedReelIndex}
            onClose={() => setSelectedReelIndex(null)}
            vendorName={vendor?.name}
            vendorImage={
              profile?.vendorAvatar ||
              (Array.isArray(vendor?.vendorProfile)
                ? vendor.vendorProfile[0]?.profilePicture
                : vendor?.vendorProfile?.profilePicture) ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
            }
            onDeleteReel={() => handleDeleteReel(reels[selectedReelIndex]._id)}
            onEditReel={(newCaption) => handleEditReel(reels[selectedReelIndex]._id, newCaption)}
            vendorId={vendor?.username}
            allInteractions={reelsInteractionsData}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPortfolio && (
          <PortfolioViewer
            portfolio={selectedPortfolio}
            onClose={() => setSelectedPortfolio(null)}
            onBookService={() => setShowBookingDrawer(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUploadModal && (
          <UploadModal
            isOpen={showUploadModal}
            onClose={() => {
              setShowUploadModal(false);
              updateURLParams({ upload: null });
            }}
            onUploadPost={handleUploadPost}
            onUploadReel={handleUploadReel}
            postsCount={posts.length}
            reelsCount={reels.length}
            vendorId={vendor?.username}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBookingDrawer && (
          <BookingDrawer
            isOpen={showBookingDrawer}
            onClose={() => setShowBookingDrawer(false)}
            services={MOCK_SERVICES}
            vendorName={vendor?.name}
            onBookingConfirmed={handleBookingConfirmed}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviewsDrawer && (
          <ReviewsDrawer
            isOpen={showReviewsDrawer}
            onClose={() => setShowReviewsDrawer(false)}
            reviewsData={reviews}
            vendorId={vendor?.username}
            vendorName={vendor?.name}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContactDrawer && (
          <ContactDrawer isOpen={showContactDrawer} onClose={() => setShowContactDrawer(false)} vendor={vendor} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMoreOptions && (
          <MoreOptionsDrawer
            isOpen={showMoreOptions}
            onClose={() => setShowMoreOptions(false)}
            onReport={handleReport}
            onBlock={handleBlock}
            isSaved={isSaved}
            onSave={handleSaveProfile}
            isNotifying={isNotifying}
            onNotify={handleNotify}
            onShare={handleShare}
            onShowQR={() => setShowQRModal(true)}
            onShowAbout={() => setShowAboutModal(true)}
            onCopyLink={handleCopyLink}
            setShowUpdateProfileDrawer={setShowUpdateProfileDrawer}
            onVerifyIdentity={handleVerifyIdentity}
            isVerified={isVerified}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShareModal && (
          <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} vendorName={vendor?.name} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQRModal && (
          <QRCodeModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} vendorName={vendor?.name} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAboutModal && (
          <AboutAccountModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} vendor={vendor} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewPost && <PostPreviewModal post={previewPost} onClose={() => setPreviewPost(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showSignInPrompt && <SignInPrompt message={signInPromptMessage} onClose={() => setShowSignInPrompt(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showVerifyModal && (
          <PasswordVerificationModal
            isOpen={showVerifyModal}
            onClose={() => {
              setShowVerifyModal(false);
              updateURLParams({ upload: null });
            }}
            onSuccess={() => setIsVerified(true)}
            vendorId={vendor?.username}
            vendorName={vendor?.name}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUpdateProfileDrawer && (
          <UpdateProfileDrawer
            vendor={vendor}
            profile={profile}
            id={id}
            onProfileUpdated={handleProfileUpdated}
            isOpen={showUpdateProfileDrawer}
            onClose={() => {
              setShowUpdateProfileDrawer(false);
              updateURLParams({ update: null });
            }}
          />
        )}
      </AnimatePresence>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: smoothEase }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex justify-between items-center p-4 lg:px-8 relative z-20"
            >
              <span className="text-white/90 font-mono text-[11px] lg:text-sm bg-white/10 px-3.5 py-2 rounded-full backdrop-blur-xl border border-white/10">
                {modalImageIndex + 1} / {images.length}
              </span>
              <div className="flex gap-2.5">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setImageZoom((z) => Math.min(z + 0.5, 3))}
                  className="p-2.5 text-white/80 bg-white/10 rounded-full backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-white/20 cursor-pointer"
                >
                  <ZoomIn size={18} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setImageZoom(1)}
                  className="p-2.5 text-white/80 bg-white/10 rounded-full backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-white/20 cursor-pointer"
                >
                  <RotateCcw size={18} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowImageModal(false)}
                  className="p-2.5 text-white/80 bg-white/10 rounded-full backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-white/20 cursor-pointer"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </motion.div>

            {/* Main Image */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              <button
                onClick={() => {
                  setSlideDirection(-1);
                  setModalImageIndex((i) => (i - 1 + images.length) % images.length);
                }}
                className="hidden lg:flex absolute left-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl items-center justify-center border border-white/10 transition-all cursor-pointer"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setSlideDirection(1);
                  setModalImageIndex((i) => (i + 1) % images.length);
                }}
                className="hidden lg:flex absolute right-4 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl items-center justify-center border border-white/10 transition-all cursor-pointer"
              >
                <ChevronRight size={24} className="text-white" />
              </button>

              <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                <motion.div
                  key={modalImageIndex}
                  custom={slideDirection}
                  initial={{ opacity: 0, x: slideDirection * 100, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: slideDirection * -100, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: smoothEase }}
                  className="absolute w-full h-full flex items-center justify-center p-4 lg:px-20"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={(e) => {
                    if (!isDragging.current) return;
                    const diff = dragStartX.current - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 50) {
                      if (diff > 0) {
                        setSlideDirection(1);
                        setModalImageIndex((i) => (i + 1) % images.length);
                      } else {
                        setSlideDirection(-1);
                        setModalImageIndex((i) => (i - 1 + images.length) % images.length);
                      }
                    }
                    isDragging.current = false;
                  }}
                >
                  <motion.img
                    src={images[modalImageIndex]}
                    alt="Gallery image"
                    className="max-w-full max-h-full object-contain rounded-lg lg:rounded-2xl"
                    animate={{ scale: imageZoom }}
                    transition={smoothSpring}
                    loading="eager"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="h-24 flex items-center justify-center gap-2.5 lg:gap-3 overflow-x-auto px-4 pb-6 pt-2 no-scrollbar"
            >
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setSlideDirection(i > modalImageIndex ? 1 : -1);
                    setModalImageIndex(i);
                  }}
                  className="relative flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
                  style={{
                    border: i === modalImageIndex ? `2px solid ${categoryColor.primary}` : "2px solid transparent",
                    opacity: i === modalImageIndex ? 1 : 0.5,
                    transform: i === modalImageIndex ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} loading="lazy" />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles */}
      <style jsx global>{`
          .bio-content p {
            margin-bottom: 0.5rem;
          }
          .bio-content p:last-child {
            margin-bottom: 0;
          }
          * {
            -webkit-tap-highlight-color: transparent;
          }
        `}</style>
    </div>
  );
};

export default VendorProfileNewPageWrapper;
