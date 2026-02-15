"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import { useCartStore } from "@/GlobalState/CartDataStore";
import ReviewSection from "../ReviewSection";
import {
  MapPin,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Share2,
  Check,
  Wifi,
  Car,
  Music,
  Wind,
  Camera,
  User,
  Shield,
  Award,
  Zap,
  Building2,
  Home,
  Utensils,
  Crown,
  MessageCircle,
  Copy,
  Facebook,
  Twitter,
  X,
  ChevronUp,
  ChevronDown,
  Grid,
  List,
  Eye,
  ThumbsUp,
  ArrowLeft,
  ExternalLink,
  Layers,
  BarChart2,
  Gift,
  FileText,
  Paintbrush2,
  UserCircle,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Music as MusicIcon,
  Scissors,
  Leaf,
  Users,
  Sparkles,
  IndianRupee,
  BadgeIndianRupee,
  BadgeCheck,
  Percent,
  Clock,
  Palette,
  Info,
  Package,
  Video,
  Globe,
  Timer,
  Flame,
  Mic2,
  Droplets,
  CheckCircle,
  Instagram,
  Youtube,
  Tv,
  Armchair,
  DoorOpen,
  Accessibility,
  Baby,
  PawPrint,
  Cigarette,
  GlassWater,
  Coffee,
  Flower2,
  ThermometerSun,
  Sun,
  Building,
  Projector,
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Navigation,
  Compass,
  Route,
  CreditCard,
  Smartphone,
  Wallet,
  ShoppingCart,
  Bookmark,
  Play,
  Pause,
  ZoomIn,
  RotateCcw,
  ImageIcon,
  Send,
  Headphones,
  ArrowRight,
  Keyboard,
  Command,
  LayoutGrid,
  HandCoins,
  MapIcon,
  Tag,
  BarChart3,
  Heart as HeartIcon,
} from "lucide-react";
import DetailsPageSkeleton from "../ui/skeletons/DetailsPageSkeleton";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Download, QrCode, Linkedin, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useNavigationState } from "../../../hooks/useNavigationState";
import { useAppValuesStore } from "../../../GlobalState/AppValuesStore";
import LeadCaptureModal from "../LeadCaptureModal";

const AUTOPLAY_DELAY = 5000;

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
  "Studio Consultations:": Building,
  "Organic Henna Preparation": Leaf,
  "After-Care Support": HeartIcon,
  "Home Services / Doorstep Visits": Home,
  "Organic / Herbal Henna": Leaf,
  "Destination Wedding Travel": MapPin,
  "Training & Workshops": Users,
};

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
  djs: { label: "DJs", icon: MusicIcon, color: "violet" },
  hairstyling: { label: "Hairstyling", icon: Scissors, color: "fuchsia" },
  other: { label: "Services", icon: FileText, color: "gray" },
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
    scale: 1.05,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 600 : -600,
    opacity: 0,
    scale: 0.95,
  }),
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const formatPrice = (price) => {
  if (!price) return "N/A";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};

const QuickStatCard = ({ icon: Icon, label, value, color = "blue", subtext }) => (
  <div
    className={`p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-xl text-center hover:shadow-md transition-all duration-200`}
  >
    <Icon size={18} className={`text-${color}-500 mx-auto mb-1.5`} />
    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">{label}</p>
    <p className={`text-lg font-black text-${color}-700 dark:text-${color}-400`}>{value}</p>
    {subtext && <p className="text-[10px] text-gray-500 mt-0.5">{subtext}</p>}
  </div>
);

const InfoChip = ({ icon: Icon, label, value, color = "blue" }) => (
  <div
    className={`p-3 bg-${color}-50 dark:bg-${color}-900/20 rounded-xl flex items-center gap-3 hover:shadow-md transition-all duration-200`}
  >
    <div className={`w-9 h-9 rounded-lg bg-${color}-100 dark:bg-${color}-800/30 flex items-center justify-center`}>
      <Icon size={16} className={`text-${color}-500`} />
    </div>
    <div>
      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">{label}</p>
      <p className={`text-sm font-bold text-${color}-700 dark:text-${color}-400`}>{value}</p>
    </div>
  </div>
);

const PackageCard = memo(({ pkg, isSelected, onSelect }) => (
  <motion.div
    layout
    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
    whileTap={{ scale: 0.99 }}
    onClick={() => onSelect(pkg.id || pkg._id)}
    className={`bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 transition-all shadow-sm cursor-pointer ${
      isSelected
        ? "border-blue-500 shadow-lg shadow-blue-500/20"
        : "border-gray-100 dark:border-gray-800 hover:border-gray-200"
    } ${pkg.isPopular ? "ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-black" : ""}`}
  >
    <div className="flex gap-6">
      <div className="flex-1">
        {pkg.isPopular && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black rounded-full mb-3">
            <Sparkles size={12} /> Most Popular
          </div>
        )}
        <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">{pkg.name}</h4>
        {pkg.duration && (
          <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <Clock size={14} /> {pkg.duration}
          </p>
        )}
        {pkg.features?.length > 0 && (
          <div className="space-y-2 mb-4">
            {pkg.features.slice(0, 5).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{feature}</span>
              </div>
            ))}
            {pkg.features.length > 5 && (
              <p className="text-sm text-blue-500 font-semibold pl-5">+{pkg.features.length - 5} more</p>
            )}
          </div>
        )}
        {pkg.notIncluded?.length > 0 && (
          <div className="mb-3">
            {pkg.notIncluded.slice(0, 2).map((f, idx) => (
              <div key={idx} className="flex items-center gap-2 opacity-60">
                <X size={11} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-400 line-through">{f}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-48 flex flex-col items-end justify-between">
        <div className="text-right mb-4">
          {pkg.originalPrice && (
            <p className="text-sm text-gray-400 line-through">₹{Number(pkg.originalPrice).toLocaleString("en-IN")}</p>
          )}
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
            ₹{Number(pkg.price).toLocaleString("en-IN")}
          </p>
          {pkg.savingsPercentage > 0 && (
            <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-bold rounded-full mt-2">
              Save {pkg.savingsPercentage}%
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all ${
            isSelected
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
          }`}
        >
          {isSelected ? "✓ Selected" : "Select Package"}
        </motion.button>
      </div>
    </div>
  </motion.div>
));
PackageCard.displayName = "PackageCard";

const CollapsibleSection = memo(
  ({
    title,
    icon: Icon,
    iconColor,
    iconBg,
    children,
    defaultOpen = true,
    badge,
    badgeColor = "blue",
    onToggle,
    isOpen,
  }) => {
    const [localOpen, setLocalOpen] = useState(defaultOpen);
    const open = isOpen !== undefined ? isOpen : localOpen;
    const toggle = onToggle || (() => setLocalOpen((p) => !p));

    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
        <button
          onClick={toggle}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg || "bg-blue-50 dark:bg-blue-900/20"}`}
              >
                <Icon className={iconColor || "text-blue-500"} size={20} />
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
              {badge && (
                <span className={`text-[10px] font-semibold text-${badgeColor}-600 dark:text-${badgeColor}-400`}>
                  {badge}
                </span>
              )}
            </div>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown size={20} className="text-gray-400" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <div className="px-5 pb-5">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
CollapsibleSection.displayName = "CollapsibleSection";

const ShareModal = ({ isOpen, onClose, vendorName }) => {
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
    if (typeof window !== "undefined") setCurrentUrl(window.location.href);
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
      action: () => onClose(),
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

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const groups = [
    {
      title: "Navigation",
      shortcuts: [
        { key: "←", desc: "Previous image" },
        { key: "→", desc: "Next image" },
        { key: "1-9", desc: "Switch tabs" },
        { key: "Esc", desc: "Close modals" },
      ],
    },
    {
      title: "Actions",
      shortcuts: [
        { key: "L", desc: "Like / Unlike" },
        { key: "S", desc: "Share vendor" },
        { key: "B", desc: "Bookmark" },
        { key: "C", desc: "Toggle cart" },
      ],
    },
    {
      title: "Media",
      shortcuts: [
        { key: "G", desc: "Open gallery" },
        { key: "Space", desc: "Play / Pause" },
        { key: "+", desc: "Zoom in" },
        { key: "-", desc: "Zoom out" },
      ],
    },
    {
      title: "General",
      shortcuts: [
        { key: "?", desc: "This dialog" },
        { key: "T", desc: "Scroll to top" },
        { key: "F", desc: "Fullscreen" },
        { key: "D", desc: "Toggle dark" },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <Keyboard size={20} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
              <p className="text-xs text-gray-500">Navigate faster with your keyboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto p-5 flex-1">
          <div className="grid grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group.title}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50"
              >
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {group.title}
                </h4>
                <div className="space-y-2">
                  {group.shortcuts.map((s) => (
                    <div key={s.key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{s.desc}</span>
                      <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded-lg text-xs font-mono font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm min-w-[32px] text-center">
                        {s.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center shrink-0">
          <p className="text-xs text-gray-400">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono font-bold">
              Esc
            </kbd>{" "}
            to close
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PortfolioAlbumSection = memo(({ images, onImageClick, vendorName }) => {
  if (!images || images.length === 0) return null;
  const thumbnails = images.slice(0, 6);
  const remainingCount = images.length - 6;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <LayoutGrid size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Portfolio</h3>
              <p className="text-xs text-gray-500">{images.length} photos</p>
            </div>
          </div>
          <button
            onClick={() => onImageClick(0)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          {thumbnails.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onImageClick(idx)}
              className={`relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer group ${idx === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
            >
              <img
                src={img}
                alt={`${vendorName} ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {idx === 5 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+{remainingCount}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
PortfolioAlbumSection.displayName = "PortfolioAlbumSection";

const SocialLinksSection = memo(({ vendor }) => {
  const socialLinks = vendor.socialLinks || {};
  const links = [
    {
      key: "website",
      alt: vendor.website || vendor.websiteUrl,
      icon: Globe,
      label: "Website",
      color: "blue",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      key: "instagram",
      alt: vendor.instagram,
      icon: Instagram,
      label: "Instagram",
      color: "pink",
      bg: "bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20",
    },
    {
      key: "facebook",
      alt: vendor.facebook,
      icon: Facebook,
      label: "Facebook",
      color: "blue",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      key: "youtube",
      alt: vendor.youtube,
      icon: Youtube,
      label: "YouTube",
      color: "red",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      key: "twitter",
      icon: Twitter,
      label: "Twitter",
      color: "sky",
      bg: "bg-sky-50 dark:bg-sky-900/20",
    },
    {
      key: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      color: "blue",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
  ].filter((l) => socialLinks[l.key] || l.alt);
  if (links.length === 0) return null;
  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <Globe size={18} className="text-indigo-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Connect With Us</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.key}
            href={socialLinks[link.key] || link.alt}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 ${link.bg} rounded-xl flex items-center gap-2 transition-all hover:shadow-md hover:scale-105 duration-200`}
          >
            <link.icon size={18} className={`text-${link.color}-600`} />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
});
SocialLinksSection.displayName = "SocialLinksSection";

const CategorySpecificSection = memo(({ vendor }) => {
  const category = vendor.category;
  if (!category) return null;

  const renderContent = () => {
    switch (category) {
      case "venues":
        return (
          <div className="space-y-5">
            {(vendor.seating?.min || vendor.seating?.max || vendor.floating?.min || vendor.floating?.max) && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users size={16} className="text-blue-500" /> Capacity Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {(vendor.seating?.min || vendor.seating?.max) && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Seating</p>
                      <p className="text-xl font-black text-blue-700 dark:text-blue-400">
                        {vendor.seating?.min || 0} - {vendor.seating?.max || 0}
                      </p>
                      <p className="text-[10px] text-gray-500">guests</p>
                    </div>
                  )}
                  {(vendor.floating?.min || vendor.floating?.max) && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Floating</p>
                      <p className="text-xl font-black text-purple-700 dark:text-purple-400">
                        {vendor.floating?.min || 0} - {vendor.floating?.max || 0}
                      </p>
                      <p className="text-[10px] text-gray-500">guests</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {(vendor.halls || vendor.rooms?.count || vendor.parking?.capacity) && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-green-500" /> Facilities
                </h4>
                <div className="grid grid-cols-3 gap-3">
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
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-orange-500" /> Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.areas.map((area, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.foodPolicy && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
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
          <div className="space-y-5">
            {vendor.designs?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Palette size={16} className="text-amber-500" /> Design Styles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.designs
                    .filter((d) => !d.includes(",") && !d.includes("₹"))
                    .map((design, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold border border-amber-200 dark:border-amber-800"
                      >
                        {design}
                      </span>
                    ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-green-500" /> Pricing
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {vendor.pricePerHand && (
                  <QuickStatCard icon={Hand} label="Per Hand" value={formatPrice(vendor.pricePerHand)} color="green" />
                )}
                {vendor.bridalPackagePrice && (
                  <QuickStatCard
                    icon={Crown}
                    label="Bridal"
                    value={formatPrice(vendor.bridalPackagePrice)}
                    color="pink"
                  />
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-blue-500" /> Service Details
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
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <Leaf size={14} className="text-green-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">100% Organic Henna</span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
                {vendor.travelToVenue && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <MapPin size={14} className="text-blue-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Travel to Venue</span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
                {vendor.colorGuarantee && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <Droplets size={14} className="text-amber-500" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
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
          <div className="space-y-5">
            {vendor.services?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Camera size={16} className="text-purple-500" /> Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.deliverables?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Package size={16} className="text-blue-500" /> Deliverables
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.deliverables.map((d, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Info size={16} className="text-gray-500" /> Info
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {vendor.deliveryTime && (
                  <QuickStatCard icon={Clock} label="Delivery" value={`${vendor.deliveryTime} wks`} color="blue" />
                )}
                {vendor.teamSize && <QuickStatCard icon={Users} label="Team" value={vendor.teamSize} color="purple" />}
                {vendor.travelCost && (
                  <QuickStatCard icon={MapPin} label="Travel" value={vendor.travelCost} color="green" />
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {vendor.videographyIncluded && (
                  <div className="flex items-center gap-2 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                    <Video size={14} className="text-pink-500" />
                    <span className="text-xs font-medium">Videography</span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
                {vendor.droneAvailable && (
                  <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <Camera size={14} className="text-indigo-500" />
                    <span className="text-xs font-medium">Drone</span>
                    <CheckCircle size={12} className="text-green-500 ml-auto" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "planners":
        return (
          <div className="space-y-5">
            {vendor.specializations?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Star size={16} className="text-indigo-500" /> Specializations
                </h4>
                <div className="space-y-2">
                  {vendor.specializations.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                      <CheckCircle size={14} className="text-indigo-500" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {vendor.eventsManaged?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-green-500" /> Events Managed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.eventsManaged.map((e, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users size={16} className="text-blue-500" /> Team & Network
              </h4>
              <div className="grid grid-cols-3 gap-3">
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
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <DollarSign size={16} className="text-green-500" /> Budget Range
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">From</p>
                    <p className="text-xl font-black text-green-700 dark:text-green-400">
                      {formatPrice(vendor.budgetRange.min)}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Up To</p>
                    <p className="text-xl font-black text-blue-700 dark:text-blue-400">
                      {formatPrice(vendor.budgetRange.max)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "makeup":
        return (
          <div className="space-y-5">
            {vendor.services?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Paintbrush2 size={16} className="text-pink-500" /> Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-xs font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.brandsUsed?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Award size={16} className="text-purple-500" /> Brands
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.brandsUsed.map((b, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.trialPolicy && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" /> Trial Policy
                </h4>
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      size={16}
                      className={vendor.trialPolicy.available ? "text-green-500" : "text-gray-400"}
                    />
                    <span className="text-sm font-medium">
                      {vendor.trialPolicy.available ? "Trial Available" : "No Trial"}
                    </span>
                  </div>
                  {vendor.trialPolicy.available && vendor.trialPolicy.paid && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                      ₹{vendor.trialPolicy.price}
                    </span>
                  )}
                  {vendor.trialPolicy.available && !vendor.trialPolicy.paid && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Free</span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case "catering":
        return (
          <div className="space-y-5">
            {vendor.cuisines?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <UtensilsCrossed size={16} className="text-orange-500" /> Cuisines
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.cuisines.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {vendor.menuTypes?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-green-500" /> Menu Types
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.menuTypes.map((m, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users size={16} className="text-blue-500" /> Capacity & Pricing
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
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {vendor.pricePerPlate.veg && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Veg Plate</p>
                      <p className="text-xl font-black text-green-700">₹{vendor.pricePerPlate.veg}</p>
                    </div>
                  )}
                  {vendor.pricePerPlate.nonVeg && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Non-Veg</p>
                      <p className="text-xl font-black text-red-700">₹{vendor.pricePerPlate.nonVeg}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case "djs":
        return (
          <div className="space-y-5">
            {vendor.genres?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Music size={16} className="text-purple-500" /> Music Genres
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.genres.map((g, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(vendor.performanceDuration || vendor.soundSystemPower || vendor.setupTime) && (
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Info size={16} className="text-blue-500" /> Performance Details
                </h4>
                <div className="grid grid-cols-3 gap-3">
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
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <Mic2 size={14} className="text-blue-500" />
                      <span className="text-xs font-medium">Equipment Provided</span>
                    </div>
                  )}
                  {vendor.lightingIncluded && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                      <Zap size={14} className="text-yellow-500" />
                      <span className="text-xs font-medium">Lighting Included</span>
                    </div>
                  )}
                  {vendor.backupAvailable && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <Shield size={14} className="text-green-500" />
                      <span className="text-xs font-medium">Backup Available</span>
                    </div>
                  )}
                  {vendor.emceeServices && (
                    <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <Mic2 size={14} className="text-purple-500" />
                      <span className="text-xs font-medium">Emcee Services</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return renderContent();
});
CategorySpecificSection.displayName = "CategorySpecificSection";

const VendorDetailsPageWrapper = ({ 
  initialVendor, 
  initialSimilar = [], 
  initialRecommended = [] 
}) => {
  const { id } = useParams();
  const { user } = useUser();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { backUrl, canGoBack, getHrefWithState } = useNavigationState();
  const { allowedAction, canContinue } = useAppValuesStore();

  const [vendor, setVendor] = useState(initialVendor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [similarVendors, setSimilarVendors] = useState(initialSimilar);
  const [recommendedVendors, setRecommendedVendors] = useState(initialRecommended);
  const [listsLoading, setListsLoading] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likingLoading, setLikingLoading] = useState(false);
  const [bookmarkingLoading, setBookmarkingLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const [activeTab, setActiveTab] = useState("overview");
  const [showHeaderTabs, setShowHeaderTabs] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalActionType, setLeadModalActionType] = useState("general");

  const [showShareModal, setShowShareModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(1);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [likedVendors, setLikedVendors] = useState(new Set());
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    phone: "",
    date: "",
    eventType: "",
    message: "",
  });
  const tabContainerRef = useRef(null);
  const [tabScrollState, setTabScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: true,
  });

  const updateTabScrollState = useCallback(() => {
    const el = tabContainerRef.current;
    if (!el) return;
    setTabScrollState({
      canScrollLeft: el.scrollLeft > 5,
      canScrollRight: el.scrollLeft < el.scrollWidth - el.clientWidth - 5,
    });
  }, []);

  const autoplayTimerRef = useRef(null);
  const lastScrollY = useRef(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const tabsRef = useRef(null);
  const contentSectionRef = useRef(null);
  const rightSidebarRef = useRef(null);

  const [expandedSections, setExpandedSections] = useState({
    eventTypes: true,
    operatingHours: false,
    whyChooseUs: true,
    specialOffers: false,
    amenities: true,
  });
  const toggleSection = (section) => setExpandedSections((p) => ({ ...p, [section]: !p[section] }));

  const timerControls = useAnimation();

  const vendorProfileUrl = getHrefWithState(`/vendor/${vendor.category}/${vendor?._id || id}/profile`);

  useEffect(() => {
    updateTabScrollState();
    const el = tabContainerRef.current;
    if (el) {
      const ro = new ResizeObserver(updateTabScrollState);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [updateTabScrollState, activeTab]);

  useEffect(() => {
    if (!user || !vendor?._id) return;
    let isMounted = true;
    setStatusLoading(true);
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/user/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId: vendor._id, userId: user.id }),
        });
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setIsLiked(data.isLiked);
          setIsBookmarked(data.isBookmarked);
        }
      } catch {
      } finally {
        if (isMounted) setStatusLoading(false);
      }
    };
    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, [user, vendor?._id]);

  const handleToggleLike = async () => {
    if (!user || likingLoading || statusLoading) return;
    if (!user) {
      toast.error("Please login to like vendors");
      return;
    }
    setLikingLoading(true);
    const prev = isLiked;
    setIsLiked(!prev);
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
      setIsLiked(prev);
      toast.error("Something went wrong");
    } finally {
      setLikingLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user || bookmarkingLoading || statusLoading) return;
    if (!user) {
      toast.error("Please login to bookmark vendors");
      return;
    }
    setBookmarkingLoading(true);
    const prev = isBookmarked;
    setIsBookmarked(!prev);
    try {
      const res = await fetch("/api/user/toggle-watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: vendor._id }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      toast.success(data.message);
    } catch {
      setIsBookmarked(prev);
      toast.error("Something went wrong");
    } finally {
      setBookmarkingLoading(false);
    }
  };

  const images = useMemo(() => vendor?.images || [], [vendor]);

  const goToImage = useCallback(
    (index, direction = null) => {
      if (images.length <= 1) return;
      setSlideDirection(direction !== null ? direction : index > currentImageIndex ? 1 : -1);
      setCurrentImageIndex(index);
    },
    [images.length, currentImageIndex],
  );

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    goToImage((currentImageIndex + 1) % images.length, 1);
  }, [currentImageIndex, images.length, goToImage]);
  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    goToImage((currentImageIndex - 1 + images.length) % images.length, -1);
  }, [currentImageIndex, images.length, goToImage]);

  useEffect(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    if (isPaused || images.length <= 1) return;
    autoplayTimerRef.current = setTimeout(() => {
      if (!isPaused && images.length > 1) nextImage();
    }, AUTOPLAY_DELAY);
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [currentImageIndex, isPaused, images.length, nextImage]);

  useEffect(() => {
    if (isPaused) {
      timerControls.stop();
    } else {
      timerControls.set({ width: "0%" });
      timerControls.start({
        width: "100%",
        transition: { duration: AUTOPLAY_DELAY / 1000, ease: "linear" },
      });
    }
  }, [currentImageIndex, isPaused, timerControls]);

  const handleTouchStart = useCallback((e) => {
    if (e.touches?.length !== 1) return;
    dragStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  }, []);
  const handleTouchEnd = useCallback(
    (e) => {
      if (!isDragging.current) return;
      const diff = dragStartX.current - (e.changedTouches?.[0]?.clientX || 0);
      if (Math.abs(diff) > 50 && images.length > 1) {
        diff > 0 ? nextImage() : prevImage();
      }
      isDragging.current = false;
    },
    [nextImage, prevImage, images.length],
  );

  useEffect(() => {
    let rafId = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY > 500 && !showHeaderTabs) setShowHeaderTabs(true);
        else if (scrollY <= 500 && showHeaderTabs) setShowHeaderTabs(false);
        lastScrollY.current = scrollY;
        rafId = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [showHeaderTabs]);

  {
    /* NEW */
  }
  useEffect(() => {
    let rafId = null;
    let prevScrollY = window.scrollY;
    let wasScrolledDown = window.scrollY > 100;

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const isNearTop = currentY <= 80;
        const scrollingUp = currentY < prevScrollY;

        if (isNearTop && wasScrolledDown && scrollingUp) {
          const sidebar = rightSidebarRef.current;
          if (sidebar && sidebar.scrollTop > 0) {
            const start = sidebar.scrollTop;
            const startTime = performance.now();
            const duration = 500;
            const ease = (t) => 1 - Math.pow(1 - t, 4);
            const animate = (now) => {
              const p = Math.min((now - startTime) / duration, 1);
              sidebar.scrollTop = start * (1 - ease(p));
              if (p < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        }

        wasScrolledDown = currentY > 100;
        prevScrollY = currentY;
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (showImageModal) {
            setModalImageIndex((p) => (p - 1 + images.length) % images.length);
            setSlideDirection(-1);
          } else prevImage();
          break;
        case "ArrowRight":
          e.preventDefault();
          if (showImageModal) {
            setModalImageIndex((p) => (p + 1) % images.length);
            setSlideDirection(1);
          } else nextImage();
          break;
        case " ":
          e.preventDefault();
          setIsPaused((p) => !p);
          break;
        case "Escape":
          if (showImageModal) setShowImageModal(false);
          else if (showShareModal) setShowShareModal(false);
          else if (showKeyboardShortcuts) setShowKeyboardShortcuts(false);
          break;
        case "l":
        case "L":
          handleToggleLike();
          break;
        case "s":
        case "S":
          if (!e.ctrlKey && !e.metaKey) setShowShareModal(true);
          break;
        case "b":
        case "B":
          handleToggleBookmark();
          break;
        case "g":
        case "G":
          setActiveTab("gallery");
          break;
        case "?":
          setShowKeyboardShortcuts((p) => !p);
          break;
        /* ========== CHANGE for keyboard shortcuts T, F, D ========== */
        case "t":
        case "T":
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          if (rightSidebarRef.current) {
            const sidebar = rightSidebarRef.current;
            const start = sidebar.scrollTop;
            const startTime = performance.now();
            const duration = 500;
            const ease = (t) => 1 - Math.pow(1 - t, 4);
            const animate = (now) => {
              const p = Math.min((now - startTime) / duration, 1);
              sidebar.scrollTop = start * (1 - ease(p));
              if (p < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
          break;
        case "f":
        case "F":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            if (document.fullscreenElement) document.exitFullscreen();
            else document.documentElement.requestFullscreen?.();
          }
          break;
        case "d":
        case "D":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            document.documentElement.classList.toggle("dark");
          }
          break;
        case "c":
        case "C":
          if (vendor) {
            if (isInCart(vendor._id)) removeFromCart(vendor._id);
            else
              addToCart({
                _id: vendor._id,
                name: vendor.name,
                category: vendor.category,
                price: vendor.perDayPrice?.min || vendor.basePrice || 0,
                image: vendor.defaultImage || vendor.images?.[0] || "",
                quantity: 1,
                address: vendor.address,
                rating: vendor.rating || 0,
                reviews: vendor.reviews || 0,
                isVerified: vendor.isVerified || false,
              });
          }
          break;
        default:
          if (e.key >= "1" && e.key <= "9") {
            const idx = parseInt(e.key) - 1;
            if (idx < TAB_CONFIG.length) setActiveTab(TAB_CONFIG[idx].id);
          }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showImageModal,
    showShareModal,
    showKeyboardShortcuts,
    images.length,
    vendor,
    isInCart,
    removeFromCart,
    addToCart,
  ]);

  const openImageModal = useCallback((index) => {
    setModalImageIndex(index);
    setShowImageModal(true);
    setImageZoom(1);
  }, []);

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
      {
        id: "gallery",
        label: "Gallery",
        icon: Camera,
        show: images.length > 0,
      },
      {
        id: "packages",
        label: "Packages",
        icon: Gift,
        show: vendor?.packages?.length > 0,
      },
      { id: "reviews", label: "Reviews", icon: MessageCircle },
      {
        id: "insights",
        label: "Insights",
        icon: BarChart2,
        show: vendor?.highlights?.length > 0 || vendor?.stats?.length > 0,
      },
      {
        id: "faqs",
        label: "FAQs",
        icon: FileText,
        show: vendor?.faqs?.length > 0,
      },
      {
        id: "policies",
        label: "Policies",
        icon: Shield,
        show: vendor?.policies?.length > 0,
      },
      { id: "location", label: "Location", icon: MapPin },
    ];
    return tabs.filter((tab) => tab.show !== false);
  }, [vendor, images]);

  const highlights = useMemo(
    () => [
      {
        icon: Trophy,
        label: "Rating",
        value: vendor?.rating?.toFixed(1) || "0.0",
        color: "text-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
      },
      {
        icon: Calendar,
        label: "Bookings",
        value: vendor?.bookings ? `${vendor.bookings}+` : "0",
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
      },
      {
        icon: Timer,
        label: "Response",
        value: vendor?.responseTime || "N/A",
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-900/20",
      },
      {
        icon: Medal,
        label: "Experience",
        value: vendor?.yearsExperience ? `${vendor.yearsExperience}+ yrs` : "N/A",
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/20",
      },
    ],
    [vendor],
  );

  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (contentSectionRef.current) {
          const top = contentSectionRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: top - 150, behavior: "smooth" });
        }
      });
    });
  }, []);

  const scrollTabIntoViewAndSetActive = useCallback((tabId) => {
    setActiveTab(tabId);
    // scroll the tab container so the active tab is visible
    requestAnimationFrame(() => {
      const container = tabContainerRef.current;
      if (!container) return;
      const activeBtn = container.querySelector(`[data-tab-id="${tabId}"]`);
      if (activeBtn) {
        const containerRect = container.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        if (btnRect.left < containerRect.left) {
          container.scrollBy({
            left: btnRect.left - containerRect.left - 16,
            behavior: "smooth",
          });
        } else if (btnRect.right > containerRect.right) {
          container.scrollBy({
            left: btnRect.right - containerRect.right + 16,
            behavior: "smooth",
          });
        }
      }
      // scroll content section into view
      if (contentSectionRef.current) {
        const top = contentSectionRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 150, behavior: "smooth" });
      }
    });
  }, []);

  if (loading) return <DetailsPageSkeleton />;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  if (!vendor) return <div className="flex items-center justify-center h-screen">Vendor not found.</div>;

  const displayPrice =
    vendor.perDayPrice?.min?.toLocaleString("en-IN") || vendor.basePrice?.toLocaleString("en-IN") || "N/A";
  const categoryInfo = CATEGORY_CONFIG[vendor.category] || {
    label: vendor.category,
    icon: FileText,
    color: "gray",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-10">
      {/* HEADER */}
      <div className="fixed top-18 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Link href={backUrl || "/vendors/marketplace"} className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
                </motion.button>
              </Link>
              <nav className="flex items-center gap-2 text-sm">
                <Link
                  href="/"
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1"
                >
                  <Home size={14} /> Home
                </Link>
                <ChevronRight size={14} className="text-gray-400" />
                <Link
                  href={`/vendors/marketplace/${vendor.category?.toLowerCase()}`}
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors capitalize"
                >
                  {vendor.category}
                </Link>
                <ChevronRight size={14} className="text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-[200px]">
                  {vendor.name}
                </span>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowKeyboardShortcuts(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                title="Keyboard shortcuts (?)"
              >
                <Keyboard size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleBookmark}
                disabled={statusLoading || bookmarkingLoading}
                className={`p-2 rounded-full transition-all ${isBookmarked ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
              >
                {statusLoading || bookmarkingLoading ? (
                  <div className="w-[18px] h-[18px] border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleLike}
                disabled={statusLoading || likingLoading}
                className={`p-2 rounded-full transition-all ${isLiked ? "bg-rose-50 dark:bg-rose-900/30 text-rose-500" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
              >
                {statusLoading || likingLoading ? (
                  <div className="w-[18px] h-[18px] border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart size={18} className={isLiked ? "fill-current" : ""} />
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <Share2 size={18} />
              </motion.button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {showHeaderTabs && (
             <motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.15, ease: "easeOut" }} 
  className="overflow-hidden border-t border-gray-100 dark:border-gray-800/50"
>
                <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
                  {TAB_CONFIG.map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                    >
                      <tab.icon size={14} /> {tab.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="pt-16" />

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* LEFT: CAROUSEL + TABS + CONTENT */}
          <div className="col-span-2 space-y-6">
            {/* CAROUSEL */}
            <div
              className="relative group rounded-3xl overflow-hidden shadow-2xl bg-gray-900"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative h-[480px]" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial={currentImageIndex === 0 && slideDirection === 0 ? false : "enter"}
                    animate="center"
                    exit="exit"
                    transition={{
                      x: {
                        type: "spring",
                        stiffness: 250,
                        damping: 30,
                        mass: 0.8,
                      },
                      opacity: { duration: 0.3, ease: "easeOut" },
                      scale: { duration: 0.3, ease: "easeOut" },
                    }}
                    className="absolute inset-0"
                  >
                    <img src={images[currentImageIndex]} alt={vendor.name} className="w-full h-full object-cover" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Tags */}
                <div className="absolute top-5 left-5 flex flex-wrap gap-2 z-10">
                  {vendor.isVerified && (
                    <span className="px-3 py-1 bg-green-500/90 backdrop-blur-xl rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                      <BadgeCheck size={12} /> Verified
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-xl rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Sparkles size={12} /> Featured
                  </span>
                </div>
                {/* Play/Pause */}
                <div className="absolute top-5 right-5 z-10">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPaused((p) => !p);
                    }}
                    className="p-2.5 rounded-full text-white shadow-lg backdrop-blur-md border border-white/10 bg-black/40 hover:bg-black/60 transition-colors"
                  >
                    {isPaused ? <Play size={18} /> : <Pause size={18} />}
                  </motion.button>
                </div>
                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      <ChevronRight size={24} className="text-white" />
                    </button>
                  </>
                )}
                {/* Progress dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToImage(idx)}
                      className={`relative h-2 rounded-full overflow-hidden transition-all duration-500 ${idx === currentImageIndex ? "w-10 bg-white/40" : "w-2 bg-white/40 hover:bg-white/60"}`}
                    >
                      {idx === currentImageIndex && (
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-white rounded-full"
                          animate={timerControls}
                        />
                      )}
                    </button>
                  ))}
                </div>
                {/* View all */}
                <button
                  onClick={() => openImageModal(0)}
                  className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-white font-medium hover:bg-black/60 transition-all flex items-center gap-2 text-sm z-10"
                >
                  <ImageIcon size={16} /> {images.length} Photos
                </button>
              </div>
            </div>

            {/* TABS */}
            <AnimatePresence mode="wait">
              {!showHeaderTabs && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl"
                  id="tab-section-top"
                >
                  <div className="relative">
                    {/* Left scroll arrow with overlay */}
                    {/* NEW */}
                    {tabScrollState.canScrollLeft && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => {
                          const el = tabContainerRef.current;
                          if (!el) return;

                          const start = el.scrollLeft;
                          const target = Math.max(0, start - 220);
                          const distance = target - start;
                          const startTime = Date.now();
                          const duration = 300;

                          const easeInOutCubic = (t) => {
                            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                          };

                          const animateScroll = () => {
                            const elapsed = Date.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = easeInOutCubic(progress);

                            el.scrollLeft = start + distance * eased;

                            if (progress < 1) {
                              requestAnimationFrame(animateScroll);
                            } else {
                              updateTabScrollState();
                            }
                          };

                          requestAnimationFrame(animateScroll);
                        }}
                        className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1.5 pr-8 bg-gradient-to-r from-white via-white/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 dark:to-transparent rounded-l-2xl"
                      >
                        <motion.div
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.88 }}
                          transition={{
                            type: "spring",
                            stiffness: 800,
                            damping: 20,
                            mass: 0.4,
                          }}
                          className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                        >
                          <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
                        </motion.div>
                      </motion.button>
                    )}

                    <div
                      ref={tabContainerRef}
                      onScroll={updateTabScrollState}
                      className="flex gap-1 overflow-x-auto no-scrollbar px-2 py-2"
                    >
                      {TAB_CONFIG.map((tab) => (
                        <button
                          key={tab.id}
                          data-tab-id={tab.id}
                          onClick={() => scrollTabIntoViewAndSetActive(tab.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap relative shrink-0 ${activeTab === tab.id ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
                        >
                          <tab.icon size={14} /> {tab.label}
                          {activeTab === tab.id && (
                            <motion.div
                              layoutId="activeDesktopTab"
                              className="absolute bottom-0 left-2 right-2 h-0.5 bg-purple-600 rounded-full"
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Right scroll arrow with overlay */}
                    {/* NEW */}
                    {tabScrollState.canScrollRight && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => {
                          const el = tabContainerRef.current;
                          if (!el) return;

                          const start = el.scrollLeft;
                          const maxScroll = el.scrollWidth - el.clientWidth;
                          const target = Math.min(maxScroll, start + 220);
                          const distance = target - start;
                          const startTime = Date.now();
                          const duration = 300;

                          const easeInOutCubic = (t) => {
                            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                          };

                          const animateScroll = () => {
                            const elapsed = Date.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = easeInOutCubic(progress);

                            el.scrollLeft = start + distance * eased;

                            if (progress < 1) {
                              requestAnimationFrame(animateScroll);
                            } else {
                              updateTabScrollState();
                            }
                          };

                          requestAnimationFrame(animateScroll);
                        }}
                        className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-1.5 pl-8 bg-gradient-to-l from-white via-white/95 to-transparent dark:from-gray-900 dark:via-gray-900/95 dark:to-transparent rounded-r-2xl"
                      >
                        <motion.div
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.88 }}
                          transition={{
                            type: "spring",
                            stiffness: 800,
                            damping: 20,
                            mass: 0.4,
                          }}
                          className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                        >
                          <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
                        </motion.div>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB CONTENT */}
            <div
              ref={contentSectionRef}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 min-h-[400px]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  {/* === CATEGORY-SPECIFIC TAB CONTENT === */}

                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      {/* Vendor's short description */}

                      {vendor.shortDescription && (
                        <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-slate-900/50 px-6 py-4 rounded-3xl shadow-sm border border-indigo-100/50 dark:border-indigo-900/30">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center shrink-0 ring-1 ring-indigo-200/50 dark:ring-indigo-800/50">
                              <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1 pt-2">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic text-lg">
                                "{vendor.shortDescription}"
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. Pricing Details */}
                      {(vendor.basePrice || vendor.perDayPrice?.min) && (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 flex items-center justify-center shadow-inner">
                              <IndianRupee size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Pricing
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                Transparent pricing options
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Base Price */}
                            {vendor.basePrice && (
                              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/10 rounded-xl border border-emerald-200/60 dark:border-emerald-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 overflow-hidden">
                                {/* Icon Header */}
                                <div className="flex items-center gap-3 p-4 border-b border-emerald-200/30 dark:border-emerald-700/30">
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-600">
                                    <BadgeIndianRupee size={18} className="text-emerald-600 dark:text-emerald-400" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="font-semibold text-sm text-slate-600 dark:text-slate-400 block">
                                      Base Price
                                    </span>
                                    <span className="font-medium text-xs text-slate-500 dark:text-slate-500">
                                      per {" " + vendor.priceUnit || "day"}
                                    </span>
                                  </div>
                                </div>
                                {/* Price Display */}
                                <div className="p-4 text-center bg-white/50 dark:bg-slate-700/30">
                                  <span className="font-black text-2xl text-emerald-600 dark:text-emerald-400">
                                    ₹{vendor.basePrice.toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Per Day Price Range */}
                            {vendor.perDayPrice?.min && (
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-xl border border-blue-200/60 dark:border-blue-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 overflow-hidden">
                                {/* Icon Header */}
                                <div className="flex items-center gap-3 p-4 border-b border-blue-200/30 dark:border-blue-700/30">
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm border border-blue-200 dark:border-blue-600">
                                    <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="font-semibold text-sm text-slate-600 dark:text-slate-400 block">
                                      Per {vendor.priceUnit} Rate
                                    </span>
                                    <span className="font-medium text-xs text-slate-500 dark:text-slate-500">
                                      {vendor.perDayPrice.max ? "Price range" : "Starting from"}
                                    </span>
                                  </div>
                                </div>
                                {/* Price Display */}
                                <div className="p-4 text-center bg-white/50 dark:bg-slate-700/30">
                                  {vendor.perDayPrice.max ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <span className="font-black text-xl text-blue-600 dark:text-blue-400">
                                        ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
                                      </span>
                                      <span className="font-bold text-sm text-slate-400 dark:text-slate-500">-</span>
                                      <span className="font-black text-xl text-blue-600 dark:text-blue-400">
                                        ₹{vendor.perDayPrice.max.toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="font-black text-2xl text-blue-600 dark:text-blue-400">
                                      ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 3. Category Highlights */}
                      {(() => {
                        const category = vendor.category;
                        if (!category) return null;

                        const getHighlights = () => {
                          switch (category) {
                            case "mehendi":
                              return [
                                vendor.designs?.length > 0 && {
                                  icon: Palette,
                                  label: "STYLES",
                                  value: `${vendor.designs.filter((d) => !d.includes(",") && !d.includes("₹")).length}+ Designs`,
                                  color: "amber",
                                },
                                vendor.teamSize && {
                                  icon: Users,
                                  label: "TEAM SIZE",
                                  value: `${vendor.teamSize}+ Artists`,
                                  color: "blue",
                                },
                                vendor.pricePerHand && {
                                  icon: Hand,
                                  label: "PRICE/HAND",
                                  value: `₹${vendor.pricePerHand.toLocaleString("en-IN")}`,
                                  color: "emerald",
                                },
                                vendor.bridalPackagePrice && {
                                  icon: Crown,
                                  label: "BRIDAL PACKAGE",
                                  value: `₹${vendor.bridalPackagePrice.toLocaleString("en-IN")}`,
                                  color: "rose",
                                },
                                vendor.organic && {
                                  icon: Leaf,
                                  label: "100% ORGANIC HENNA",
                                  value: "Natural, chemical-free & skin-safe",
                                  color: "green",
                                  fullWidth: true,
                                  hasCheck: true,
                                },
                              ].filter(Boolean);

                            case "venues":
                              return [
                                vendor.seating && {
                                  icon: Users,
                                  label: "CAPACITY",
                                  value: `${vendor.seating.min || 0}-${vendor.seating.max || 0} Guests`,
                                  color: "purple",
                                },
                                vendor.halls && {
                                  icon: Building2,
                                  label: "HALLS",
                                  value: `${vendor.halls}+ Spaces`,
                                  color: "blue",
                                },
                                vendor.parking?.capacity && {
                                  icon: Car,
                                  label: "PARKING",
                                  value: `${vendor.parking.capacity}+ Cars`,
                                  color: "emerald",
                                },
                                vendor.wifi && {
                                  icon: Wifi,
                                  label: "WIFI",
                                  value: vendor.wifiType || "Available",
                                  color: "amber",
                                },
                                vendor.security && {
                                  icon: Shield,
                                  label: "SECURITY",
                                  value: vendor.securityType || "Available",
                                  color: "rose",
                                  fullWidth: true,
                                  hasCheck: true,
                                },
                              ].filter(Boolean);

                            case "photographers":
                              return [
                                vendor.teamSize && {
                                  icon: Users,
                                  label: "TEAM SIZE",
                                  value: `${vendor.teamSize}+ Photographers`,
                                  color: "blue",
                                },
                                vendor.deliveryTime && {
                                  icon: Clock,
                                  label: "DELIVERY",
                                  value: `${vendor.deliveryTime} Days`,
                                  color: "emerald",
                                },
                                vendor.packages?.[0]?.price && {
                                  icon: Gift,
                                  label: "PACKAGES",
                                  value: `Starting ₹${vendor.packages[0].price.toLocaleString("en-IN")}`,
                                  color: "amber",
                                },
                                vendor.experience && {
                                  icon: Award,
                                  label: "EXPERIENCE",
                                  value: `${vendor.experience}+ Years`,
                                  color: "rose",
                                  fullWidth: true,
                                  hasCheck: true,
                                },
                              ].filter(Boolean);

                            case "makeup":
                              return [
                                vendor.services?.length > 0 && {
                                  icon: Paintbrush2,
                                  label: "STYLES",
                                  value: `${vendor.services.length}+ Looks`,
                                  color: "purple",
                                },
                                vendor.teamSize && {
                                  icon: Users,
                                  label: "ARTISTS",
                                  value: `${vendor.teamSize}+ Professionals`,
                                  color: "blue",
                                },
                                vendor.duration && {
                                  icon: Clock,
                                  label: "DURATION",
                                  value: vendor.duration,
                                  color: "emerald",
                                },
                                vendor.bridalPackagePrice && {
                                  icon: Crown,
                                  label: "BRIDAL",
                                  value: `Starting ₹${vendor.bridalPackagePrice.toLocaleString("en-IN")}`,
                                  color: "rose",
                                },
                                vendor.brandsUsed?.length > 0 && {
                                  icon: Shield,
                                  label: "PRODUCTS",
                                  value:
                                    vendor.brandsUsed.length > 0
                                      ? `${vendor.brandsUsed.length}+ Brands`
                                      : "Quality Products",
                                  color: "amber",
                                  fullWidth: true,
                                  hasCheck: true,
                                },
                              ].filter(Boolean);

                            case "catering":
                              return [
                                vendor.cuisines?.length > 0 && {
                                  icon: UtensilsCrossed,
                                  label: "CUISINES",
                                  value: `${vendor.cuisines.length}+ Types`,
                                  color: "purple",
                                },
                                vendor.maxCapacity && {
                                  icon: Users,
                                  label: "GUESTS",
                                  value: `Up to ${vendor.maxCapacity}`,
                                  color: "blue",
                                },
                                vendor.experience && {
                                  icon: Calendar,
                                  label: "EXPERIENCE",
                                  value: `${vendor.experience}+ Years`,
                                  color: "emerald",
                                },
                                vendor.pricePerPlate?.veg && {
                                  icon: Gift,
                                  label: "PLATES",
                                  value: `Starting ₹${vendor.pricePerPlate.veg.toLocaleString("en-IN")}`,
                                  color: "amber",
                                },
                                vendor.certifications?.length > 0 && {
                                  icon: Shield,
                                  label: "QUALITY",
                                  value: vendor.certifications.join(", ") || "Certified",
                                  color: "rose",
                                  fullWidth: true,
                                  hasCheck: true,
                                },
                              ].filter(Boolean);

                            case "djs":
                              return [
                                vendor.genres?.length > 0 && {
                                  icon: MusicIcon,
                                  label: "GENRES",
                                  value: `${vendor.genres.length}+ Types`,
                                  color: "purple",
                                },
                                vendor.teamSize && {
                                  icon: Users,
                                  label: "DJS",
                                  value: `${vendor.teamSize}+ Artists`,
                                  color: "blue",
                                },
                                vendor.performanceDuration && {
                                  icon: Clock,
                                  label: "HOURS",
                                  value: vendor.performanceDuration,
                                  color: "emerald",
                                },
                                vendor.packages?.[0]?.price && {
                                  icon: Gift,
                                  label: "PACKAGES",
                                  value: `Starting ₹${vendor.packages[0].price.toLocaleString("en-IN")}`,
                                  color: "amber",
                                },
                                vendor.equipment && {
                                  icon: Award,
                                  label: "EQUIPMENT",
                                  value: vendor.equipmentType || "Professional Equipment",
                                  color: "rose",
                                  fullWidth: true,
                                  hasCheck: true,
                                },
                              ].filter(Boolean);

                            default:
                              return [];
                          }
                        };

                        const highlights = getHighlights();
                        if (highlights.length === 0) return null;

                        const colorConfig = {
                          amber: {
                            bgColor: "from-amber-50 to-orange-50",
                            darkBgColor: "dark:from-amber-900/20 dark:to-orange-900/10",
                            borderColor: "border-amber-200/60 dark:border-amber-700/60",
                            labelColor: "text-amber-700 dark:text-amber-300",
                            valueColor: "text-amber-600 dark:text-amber-400",
                          },
                          blue: {
                            bgColor: "from-blue-50 to-indigo-50",
                            darkBgColor: "dark:from-blue-900/20 dark:to-indigo-900/10",
                            borderColor: "border-blue-200/60 dark:border-blue-700/60",
                            labelColor: "text-blue-700 dark:text-blue-300",
                            valueColor: "text-blue-600 dark:text-blue-400",
                          },
                          emerald: {
                            bgColor: "from-emerald-50 to-teal-50",
                            darkBgColor: "dark:from-emerald-900/20 dark:to-teal-900/10",
                            borderColor: "border-emerald-200/60 dark:border-emerald-700/60",
                            labelColor: "text-emerald-700 dark:text-emerald-300",
                            valueColor: "text-emerald-600 dark:text-emerald-400",
                          },
                          rose: {
                            bgColor: "from-rose-50 to-pink-50",
                            darkBgColor: "dark:from-rose-900/20 dark:to-pink-900/10",
                            borderColor: "border-rose-200/60 dark:border-rose-700/60",
                            labelColor: "text-rose-700 dark:text-rose-300",
                            valueColor: "text-rose-600 dark:text-rose-400",
                          },
                          purple: {
                            bgColor: "from-purple-50 to-violet-50",
                            darkBgColor: "dark:from-purple-900/20 dark:to-violet-900/10",
                            borderColor: "border-purple-200/60 dark:border-purple-700/60",
                            labelColor: "text-purple-700 dark:text-purple-300",
                            valueColor: "text-purple-600 dark:text-purple-400",
                          },
                          green: {
                            bgColor: "from-green-50 to-emerald-50",
                            darkBgColor: "dark:from-green-900/20 dark:to-emerald-900/10",
                            borderColor: "border-green-200/60 dark:border-green-700/60",
                            labelColor: "text-green-700 dark:text-green-300",
                            valueColor: "text-green-600 dark:text-green-400",
                          },
                        };

                        return (
                          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800/80">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shadow-inner">
                                <Sparkles size={24} className="text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  {CATEGORY_CONFIG[vendor.category]?.label || "Service"} Highlights
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  Premium {CATEGORY_CONFIG[vendor.category]?.label?.toLowerCase() || "service"} features
                                  & specifications
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {highlights.map((highlight, index) => {
                                const config = colorConfig[highlight.color] || colorConfig.amber;
                                const Icon = highlight.icon;

                                if (highlight.fullWidth) {
                                  return (
                                    <div
                                      key={index}
                                      className={`md:col-span-2 bg-gradient-to-br ${config.bgColor} ${config.darkBgColor} rounded-xl border ${config.borderColor} shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 p-2`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm">
                                            <Icon size={18} className={config.valueColor} />
                                          </div>
                                          <div>
                                            <span className={`font-bold ${config.labelColor} text-xs block`}>
                                              {highlight.label}
                                            </span>
                                            <div className={`text-sm font-semibold ${config.valueColor} mt-0.5`}>
                                              {highlight.value}
                                            </div>
                                          </div>
                                        </div>
                                        {highlight.hasCheck && (
                                          <div className="p-2 bg-white/50 dark:bg-slate-700/50 rounded-full">
                                            <Check size={20} className={config.valueColor} />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div
                                    key={index}
                                    className={`bg-gradient-to-br ${config.bgColor} ${config.darkBgColor} rounded-xl border ${config.borderColor} shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 p-2`}
                                  >
                                    <div className="flex items-center gap-1 mb-1">
                                      <div className="p-2 bg-white dark:bg-slate-700/50 rounded-lg shadow-sm">
                                        <Icon size={18} className={config.valueColor} />
                                      </div>
                                      <span className={`font-bold ${config.labelColor} text-xs`}>
                                        {highlight.label}
                                      </span>
                                    </div>
                                    <div className={`text-lg font-black ${config.valueColor}`}>{highlight.value}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* 4. Event Types Supported */}
                      {vendor.eventTypes?.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <button
                            onClick={() => toggleSection("eventTypes")}
                            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-t-3xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shadow-inner">
                                <Calendar size={24} className="text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  Event Types We Serve
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  {vendor.eventTypes?.length} specialized categories
                                </p>
                              </div>
                            </div>
                            <ChevronUp
                              size={20}
                              className={`text-slate-400 transition-transform duration-300 ${
                                expandedSections.eventTypes ? "" : "rotate-180"
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {expandedSections.eventTypes && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6">
                                  <div className="flex flex-wrap gap-3">
                                    {vendor.eventTypes.map((type, i) => (
                                      <div
                                        key={i}
                                        className="px-5 py-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                                      >
                                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                                        {type}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* 4. Operating Hours */}
                      {vendor.operatingHours && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <button
                            onClick={() => toggleSection("operatingHours")}
                            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-t-3xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-inner">
                                <Clock size={24} className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  Operating Hours
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  {vendor.operatingHours.length} schedules
                                </p>
                              </div>
                            </div>
                            <ChevronUp
                              size={20}
                              className={`text-slate-400 transition-transform duration-300 ${
                                expandedSections.operatingHours ? "" : "rotate-180"
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {expandedSections.operatingHours && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6">
                                  <div className="space-y-3">
                                    {vendor?.operatingHours?.length > 0 ? (
                                      vendor.operatingHours.map((schedule, i) => (
                                        <div
                                          key={i}
                                          className="flex justify-between items-center py-4 px-5 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                                        >
                                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {schedule.day}
                                          </span>
                                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700/50 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
                                            {schedule.hours}
                                          </span>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="py-4 px-5 text-sm text-slate-500 dark:text-slate-400 italic">
                                        Operating hours not available
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* 5. Amenities */}
                      {vendor.amenities?.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 flex items-center justify-center shadow-inner">
                              <Check size={24} className="text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Amenities & Services
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                {vendor.amenities.length} premium facilities
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {vendor.amenities.map((item, idx) => {
                              const Icon = AMENITY_ICONS[item] || Check;
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                                >
                                  <div className="p-2 bg-white dark:bg-slate-700/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">
                                    <Icon size={18} className="text-slate-600 dark:text-slate-400" />
                                  </div>
                                  <span className="font-medium text-sm text-slate-700 dark:text-slate-300 leading-tight">
                                    {item}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 6. Why Choose Us */}
                      {vendor.highlightPoints?.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <button
                            onClick={() => toggleSection("whyChooseUs")}
                            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-t-3xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shadow-inner">
                                <BadgeCheck size={24} className="text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  Why Choose Us
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  {vendor.highlightPoints?.length} unique advantages
                                </p>
                              </div>
                            </div>
                            <ChevronUp
                              size={20}
                              className={`text-slate-400 transition-transform duration-300 ${
                                expandedSections.whyChooseUs ? "" : "rotate-180"
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {expandedSections.whyChooseUs && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6">
                                  <div className="space-y-4">
                                    {vendor.highlightPoints.map((point, i) => (
                                      <div
                                        key={i}
                                        className="flex items-start gap-4 p-5 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border-l-4 border-amber-400 dark:border-amber-500/50 shadow-sm"
                                      >
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shrink-0 shadow-sm">
                                          <Sparkles size={16} className="text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-1">
                                          {point}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* 8. Special Offers */}
                      {vendor.specialOffers?.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <button
                            onClick={() => toggleSection("specialOffers")}
                            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-t-3xl"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 flex items-center justify-center shadow-inner">
                                <Percent size={24} className="text-rose-600 dark:text-rose-400" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  Special Offers
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  {vendor.specialOffers.length} active deals
                                </p>
                              </div>
                            </div>
                            <ChevronUp
                              size={20}
                              className={`text-slate-400 transition-transform duration-300 ${
                                expandedSections.specialOffers ? "" : "rotate-180"
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {expandedSections.specialOffers && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6">
                                  <div className="space-y-4">
                                    {vendor.specialOffers.map((offer, i) => (
                                      <div
                                        key={i}
                                        className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/10 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm relative overflow-hidden"
                                      >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-2xl" />
                                        <div className="relative">
                                          <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                              <span className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-black rounded-xl shadow-md">
                                                {offer.discount}
                                              </span>
                                              <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                                                  {offer.title}
                                                </h4>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                                  {offer.description}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                              Valid until: {offer.validUntil}
                                            </span>
                                            <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all duration-200">
                                              Claim Offer
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* 9. About Vendor */}
                      {(vendor.about || vendor.description || vendor.story) && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 flex items-center justify-center shadow-lg">
                                <Info size={24} className="text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  About {vendor.name || "Vendor"}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  Our story and mission
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {/* Main Description with Read More functionality */}
                              <div>
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key={showFullDescription ? "full" : "collapsed"}
                                    initial={{
                                      opacity: 0,
                                      scale: 0.98,
                                      filter: "blur(4px)",
                                      height: showFullDescription ? 0 : "auto",
                                    }}
                                    animate={{
                                      opacity: 1,
                                      scale: 1,
                                      filter: "blur(0px)",
                                      height: "auto",
                                    }}
                                    exit={{
                                      opacity: 0,
                                      scale: 0.98,
                                      filter: "blur(4px)",
                                      height: showFullDescription ? 0 : "auto",
                                    }}
                                    transition={{
                                      duration: 0.6,
                                      ease: [0.23, 1, 0.32, 1],
                                      scale: { duration: 0.4 },
                                      filter: { duration: 0.3 },
                                      height: { duration: 0.4 },
                                    }}
                                    className="overflow-hidden origin-top"
                                  >
                                    <div
                                      className={`text-slate-600 dark:text-slate-300 leading-relaxed transition-all duration-500 ${
                                        !showFullDescription ? "max-h-20 overflow-hidden" : ""
                                      }`}
                                    >
                                      <motion.p
                                        className="transition-all duration-500"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          delay: 0.1,
                                          duration: 0.4,
                                        }}
                                      >
                                        {vendor.about ||
                                          vendor.description ||
                                          vendor.story ||
                                          `${vendor.name} is a professional ${vendor.category} service provider with years of experience in the industry. We are committed to delivering exceptional quality and service to make your special occasions memorable.`}
                                      </motion.p>
                                    </div>
                                  </motion.div>
                                </AnimatePresence>

                                {/* Read More/Less button for main description */}
                                {!(vendor.fullStory || vendor.detailedDescription) && (
                                  <motion.div
                                    className="mt-4 overflow-hidden"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                  >
                                    <motion.button
                                      onClick={() => setShowFullDescription(!showFullDescription)}
                                      className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                                      whileHover={{ scale: 1.05, y: -2 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                      <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          delay: 0.3,
                                          duration: 0.3,
                                        }}
                                        className="relative z-10"
                                      >
                                        {showFullDescription ? "Show Less" : "Read More"}
                                      </motion.span>
                                      <motion.div
                                        animate={{
                                          rotate: showFullDescription ? 180 : 0,
                                        }}
                                        transition={{
                                          duration: 0.5,
                                          ease: "easeInOut",
                                        }}
                                        className="relative z-10"
                                      >
                                        <ChevronDown size={16} className="text-white" />
                                      </motion.div>
                                    </motion.button>
                                  </motion.div>
                                )}
                              </div>

                              {/* Collapsible Full Story Section */}
                              <AnimatePresence>
                                {showFullDescription && (vendor.fullStory || vendor.detailedDescription) && (
                                  <motion.div
                                    initial={{
                                      height: 0,
                                      opacity: 0,
                                      scale: 0.95,
                                    }}
                                    animate={{
                                      height: "auto",
                                      opacity: 1,
                                      scale: 1,
                                    }}
                                    exit={{
                                      height: 0,
                                      opacity: 0,
                                      scale: 0.95,
                                    }}
                                    transition={{
                                      duration: 0.5,
                                      ease: [0.23, 1, 0.32, 1],
                                      height: { duration: 0.4 },
                                      opacity: { duration: 0.3 },
                                      scale: { duration: 0.4 },
                                    }}
                                    className="overflow-hidden origin-top"
                                  >
                                    <motion.div
                                      className="pt-6 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-transparent dark:from-indigo-950/20 dark:via-purple-950/10 rounded-2xl p-6"
                                      initial={{ opacity: 0, y: 30 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{
                                        delay: 0.1,
                                        duration: 0.5,
                                      }}
                                    >
                                      <motion.p
                                        className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          delay: 0.2,
                                          duration: 0.4,
                                        }}
                                      >
                                        {vendor.fullStory || vendor.detailedDescription}
                                      </motion.p>
                                    </motion.div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Additional vendor details if available */}
                              {vendor.experience && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                  <Clock size={16} />
                                  <span>{vendor.experience} years of experience</span>
                                </div>
                              )}

                              {vendor.founded && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                  <Calendar size={16} />
                                  <span>Established in {vendor.founded}</span>
                                </div>
                              )}

                              {(vendor.fullStory || vendor.detailedDescription) && (
                                <motion.div
                                  className="mt-6 overflow-hidden"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  transition={{ delay: 0.3, duration: 0.4 }}
                                >
                                  <motion.button
                                    onClick={() => setShowFullStory(!showFullStory)}
                                    className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-400 overflow-hidden"
                                    whileHover={{ scale: 1.03, y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                                    <motion.span
                                      className="relative z-10 text-lg"
                                      initial={{ opacity: 0, x: -15 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.4, duration: 0.4 }}
                                    >
                                      {showFullDescription ? "Show Less" : "Read Full Story"}
                                    </motion.span>
                                    <motion.div
                                      animate={{
                                        rotate: showFullDescription ? 180 : 0,
                                      }}
                                      transition={{
                                        duration: 0.6,
                                        ease: "easeInOut",
                                      }}
                                      className="relative z-10"
                                    >
                                      <ChevronDown size={18} className="text-white" />
                                    </motion.div>
                                  </motion.button>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 10. Connect With Us */}
                      {(vendor.website ||
                        vendor.socialLinks?.instagram ||
                        vendor.socialLinks?.facebook ||
                        vendor.socialLinks?.youtube ||
                        vendor.instagram ||
                        vendor.facebook ||
                        vendor.youtube) && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                          <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 flex items-center justify-center shadow-lg">
                                <Globe size={24} className="text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                  Connect With Us
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                  Follow us on social media
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {/* Website Link */}
                              {(vendor.website || vendor.websiteUrl) && (
                                <a
                                  href={vendor.website || vendor.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-row items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-full border border-blue-200/60 dark:border-blue-800/40 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-950/40 dark:hover:to-blue-900/30 transition-all duration-200 group"
                                >
                                  <Globe size={16} className="text-blue-600 dark:text-blue-400" />
                                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Website</p>
                                </a>
                              )}

                              {/* Instagram Link */}
                              {(vendor.socialLinks?.instagram || vendor.instagram) && (
                                <a
                                  href={vendor.socialLinks?.instagram || vendor.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-row items-center gap-2 px-4 py-2 bg-gradient-to-br from-pink-50 to-purple-100 dark:from-pink-950/30 dark:to-purple-900/20 rounded-full border border-pink-200/60 dark:border-pink-800/40 hover:from-pink-100 hover:to-purple-200 dark:hover:from-pink-950/40 dark:hover:to-purple-900/30 transition-all duration-200 group"
                                >
                                  <Instagram size={16} className="text-pink-600 dark:text-pink-400" />
                                  <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Instagram</p>
                                </a>
                              )}

                              {/* Facebook Link */}
                              {(vendor.socialLinks?.facebook || vendor.facebook) && (
                                <a
                                  href={vendor.socialLinks?.facebook || vendor.facebook}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-row items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-900/20 rounded-full border border-blue-200/60 dark:border-blue-800/40 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-blue-950/40 dark:hover:to-indigo-900/30 transition-all duration-200 group"
                                >
                                  <Facebook size={16} className="text-blue-600 dark:text-blue-400" />
                                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Facebook</p>
                                </a>
                              )}

                              {/* YouTube Link */}
                              {(vendor.socialLinks?.youtube || vendor.youtube) && (
                                <a
                                  href={vendor.socialLinks?.youtube || vendor.youtube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-row items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950/30 dark:to-orange-900/20 rounded-full border border-red-200/60 dark:border-red-800/40 hover:from-red-100 hover:to-orange-200 dark:hover:from-red-950/40 dark:hover:to-orange-900/30 transition-all duration-200 group"
                                >
                                  <Youtube size={16} className="text-red-600 dark:text-red-400" />
                                  <p className="text-sm font-medium text-red-600 dark:text-red-400">YouTube</p>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === "amenities" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                          Available Amenities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {vendor.amenities?.map((amenity, index) => {
                            const IconComponent = AMENITY_ICONS[amenity] || Check;
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50"
                              >
                                <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                                  <IconComponent size={20} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{amenity}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                          Special Facilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {vendor.facilities?.map((facility, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/50"
                            >
                              <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                                <Building2 size={20} className="text-green-600 dark:text-green-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">{facility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "gallery" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Photo Gallery</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-colors ${
                              viewMode === "grid"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <Grid size={18} />
                          </button>
                          <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-colors ${
                              viewMode === "list"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <List size={18} />
                          </button>
                        </div>
                      </div>
                      <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-6" : "space-y-4"}>
                        {vendor.images?.map((image, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative group cursor-pointer ${
                              viewMode === "list" ? "flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl" : ""
                            }`}
                            onClick={() => openImageModal(idx)}
                          >
                            <div className="relative overflow-hidden rounded-2xl shadow-lg">
                              <img
                                src={image}
                                alt={`${vendor.name} ${idx + 1}`}
                                className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                                  viewMode === "list" ? "w-24 h-24" : "w-full h-48"
                                }`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                  <Eye size={20} className="text-white" />
                                </div>
                              </div>
                            </div>
                            {viewMode === "list" && (
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Photo {idx + 1}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  High resolution venue photograph
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-300 text-xs rounded-full">
                                    HD Quality
                                  </span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "location" && (
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                      >
                        <div className="flex gap-4 mb-6">
                          <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-sm">
                            <MapPin size={26} />
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2.5 tracking-tight">
                              Complete Address
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                              {vendor.address?.street}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                              {vendor.address?.city}, {vendor.address?.state} {vendor.address?.postalCode}
                            </p>
                            {vendor.address?.country && (
                              <p className="text-gray-500 dark:text-gray-500 mt-1">{vendor.address.country}</p>
                            )}
                          </div>
                        </div>
                        {vendor.address?.googleMapUrl && (
                          <motion.a
                            href={vendor.address.googleMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Navigation size={19} />
                            Open in Google Maps
                            <ExternalLink size={16} />
                          </motion.a>
                        )}
                      </motion.div>

                      {vendor.landmarks?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="p-6 border-b border-slate-200/60 dark:border-slate-800/60">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl flex items-center justify-center shadow-sm">
                                <Compass size={20} className="text-blue-600 dark:text-blue-400" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Nearby Landmarks
                              </h4>
                            </div>
                          </div>
                          <div className="p-6 space-y-3">
                            {vendor.landmarks.map((landmark, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 flex items-center justify-center shadow-sm">
                                    <MapPin size={15} className="text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                    {landmark.name}
                                  </span>
                                </div>
                                <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-3.5 py-2 rounded-xl shadow-sm font-bold text-sm">
                                  {landmark.distance}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {vendor.directions?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <div className="p-6 border-b border-slate-200/60 dark:border-slate-800/60">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-xl flex items-center justify-center shadow-sm">
                                <Route size={20} className="text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">How to Reach</h4>
                            </div>
                          </div>
                          <div className="p-6 space-y-4">
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
                                  <p className="text-gray-800 dark:text-gray-100 font-semibold">{dir.type}</p>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed ml-13">
                                  {dir.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {vendor.availableAreas?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                        >
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Available Areas
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {vendor.availableAreas.map((area, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 bg-purple-100 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* REVIEWS TAB */}
                  {activeTab === "reviews" && <ReviewSection vendorId={id} vendorName={vendor.name} />}

                  {/* === CATEGORY-SPECIFIC TAB === */}

                  {activeTab === "category" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                          {CATEGORY_CONFIG[vendor?.category]?.label || "Details"}
                        </h3>
                        <CategorySpecificSection
                          vendor={vendor}
                          formatPrice={(price) => `₹${price?.toLocaleString("en-IN") || "0"}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* SERVICES & AWARDS TAB */}
                  {activeTab === "services" && (
                    <div className="space-y-8 p-6">
                      {/* Premium Facilities Section */}
                      {vendor.facilities?.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800 shadow-sm">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                Premium Facilities
                              </h3>
                              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mt-1">
                                {vendor.facilities.length} exclusive features available
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vendor.facilities.map((facility, i) => (
                              <div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-purple-100 dark:border-purple-700 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 group"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                                    <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
                                      {facility}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Awards & Recognition Section */}
                      {vendor.awards?.length > 0 && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800 shadow-sm">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                Awards & Recognition
                              </h3>
                              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mt-1">
                                {vendor.awards.length} prestigious honors earned
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vendor.awards.map((award, i) => (
                              <div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-amber-100 dark:border-amber-700 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 group relative overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-start gap-4">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
                                    <Award className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1 leading-snug">
                                      {award.title}
                                    </h4>
                                    {award.year && (
                                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                                        <Calendar className="w-3 h-3" />
                                        {award.year}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Amenities Section */}
                      {vendor.amenities?.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800 shadow-sm">
                          <button
                            onClick={() => toggleSection("amenities")}
                            className="w-full flex items-center justify-between mb-6 text-left group"
                          >
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                                <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                Available Amenities
                              </h3>
                              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                Everything you need for a perfect experience
                              </p>
                            </div>
                            <ChevronUp
                              size={20}
                              className={`text-blue-400 dark:text-blue-500 transition-transform duration-300 ${
                                expandedSections.amenities ? "" : "rotate-180"
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {expandedSections.amenities && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                  {vendor.amenities.map((item, idx) => {
                                    const Icon = AMENITY_ICONS[item] || Check;
                                    return (
                                      <div
                                        key={idx}
                                        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-blue-100 dark:border-blue-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 hover:scale-105 transition-all duration-300 group"
                                      >
                                        <div className="flex flex-col items-center text-center gap-3">
                                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                                            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                          </div>
                                          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                                            {item}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Empty State */}
                      {!vendor.facilities?.length && !vendor.awards?.length && !vendor.amenities?.length && (
                        <div className="text-center py-16">
                          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                            <Info className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Services Information Available
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Details about facilities, awards, and amenities will appear here.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PACKAGES TAB */}
                  {activeTab === "packages" && (
                    <div className="space-y-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Packages & Pricing
                      </h3>
                      {vendor.packages?.length > 0 ? (
                        <div className="space-y-4">
                          {vendor.packages.map((pkg, i) => (
                            <motion.div
                              key={pkg._id || i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <PackageCard
                                pkg={pkg}
                                isSelected={selectedPackage === (pkg.id || pkg._id)}
                                onSelect={setSelectedPackage}
                              />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                              <Gift size={36} className="text-gray-400 dark:text-gray-500" />
                            </div>
                          </div>
                          <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">
                            No packages listed yet
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
                            Contact the vendor directly for customized pricing and package options tailored to your
                            needs
                          </p>
                          <div className="flex justify-center gap-4 mt-8">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                              <Phone size={18} />
                              Call Vendor
                            </button>
                            <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium flex items-center gap-2">
                              <Mail size={18} />
                              Send Inquiry
                            </button>
                          </div>
                        </div>
                      )}

                      {/* PAYMENT OPTIONS SECTION */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                      >
                        <div className="flex items-center gap-3.5 mb-6">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 flex items-center justify-center shadow-inner">
                            <CreditCard size={20} className="text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                              Payment Options
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                              5 secure methods available
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {[
                            { name: "Cash", icon: IndianRupee, color: "green" },
                            { name: "UPI", icon: Smartphone, color: "blue" },
                            {
                              name: "Bank Transfer",
                              icon: Building2,
                              color: "purple",
                            },
                            { name: "PhonePe", icon: Phone, color: "indigo" },
                            { name: "PayTM", icon: Wallet, color: "cyan" },
                          ].map((method, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + idx * 0.1 }}
                              className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                            >
                              <div className="relative">
                                <div
                                  className={`w-12 h-12 rounded-full bg-${method.color}-100 dark:bg-${method.color}-900/20 flex items-center justify-center`}
                                >
                                  <method.icon
                                    size={20}
                                    className={`text-${method.color}-600 dark:text-${method.color}-400`}
                                  />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                                {method.name}
                              </span>
                            </motion.div>
                          ))}
                        </div>

                        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                            <div>
                              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                                Secure & Protected Payments
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
                                All transactions are encrypted and secure. Your payment information is always protected.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* INSIGHTS TAB */}
                  {activeTab === "insights" && (
                    <div className="space-y-6">
                      {/* 3. Highlights & Pros */}
                      {vendor.highlights?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center shadow-inner">
                              <Sparkles size={20} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                                Key Highlights
                              </h3>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                                {vendor.highlights.length} standout features
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                              const colorClass = highlight.color || "text-gray-600 dark:text-gray-400";

                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.02 }}
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-800/10 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="p-2 bg-white dark:bg-gray-700/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                                      <IconComponent size={18} className={colorClass} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="font-semibold text-[12px] text-gray-700 dark:text-gray-300 block truncate">
                                        {highlight.label ||
                                          (typeof highlight === "string" ? highlight : highlight.value || "Highlight")}
                                      </span>
                                      {highlight.value && typeof highlight === "object" && (
                                        <span className="font-medium text-[11px] text-gray-500 dark:text-gray-400 block truncate">
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

                      {/* 4. Performance Stats */}
                      {vendor.stats?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                        >
                          <div className="flex items-center gap-3.5 mb-5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shadow-inner">
                              <BarChart2 size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                                Performance Stats
                              </h3>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                                Real-time metrics & growth
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vendor.stats.map((stat, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-800/10 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-[12px] text-gray-600 dark:text-gray-400">
                                    {stat.label || "Statistic"}
                                  </span>
                                  {stat.trend && (
                                    <div
                                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        stat.positive
                                          ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                          : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                                      }`}
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
                                  <span className="font-black text-[24px] text-gray-800 dark:text-gray-100">
                                    {typeof stat === "string" ? stat : stat.value || "N/A"}
                                  </span>
                                  {stat.unit && (
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                                      {stat.unit}
                                    </span>
                                  )}
                                </div>

                                {/* Progress visualization */}
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-3">
                                  <motion.div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${Math.min(parseInt(typeof stat === "string" ? stat : stat.value) || 75, 100)}%`,
                                    }}
                                    transition={{
                                      duration: 1,
                                      delay: 0.5 + idx * 0.1,
                                    }}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Additional vendor metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {vendor.rating && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 flex items-center justify-center">
                                <Star size={20} className="text-yellow-600 dark:text-yellow-400" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                  Customer Rating
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Based on {vendor.reviews || 0} reviews
                                </p>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-4xl font-black text-yellow-600 dark:text-yellow-400 mb-2">
                                {vendor.rating}
                              </div>
                              <div className="flex justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={
                                      i < Math.floor(vendor.rating)
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {vendor.experience && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 flex items-center justify-center">
                                <Timer size={20} className="text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Experience</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Years in business</p>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">
                                {vendor.experience}+
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Established Expertise</div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Empty State */}
                      {!vendor.highlights?.length && !vendor.stats?.length && !vendor.rating && !vendor.experience && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white dark:bg-gray-900 p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center"
                        >
                          <BarChart2 size={48} className="text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 font-medium">No insights available</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            Insights will appear once vendor data is available
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* FAQs TAB */}
                  {activeTab === "faqs" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                        Frequently Asked Questions
                      </h3>
                      {vendor.faqs?.length > 0 ? (
                        <div className="space-y-4">
                          {vendor.faqs.map((faq, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                            >
                              <motion.button
                                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                className="w-full p-5 flex items-start justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-200"
                                whileTap={{ scale: 0.995 }}
                              >
                                <div className="flex items-start gap-4 flex-1">
                                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center shrink-0">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">Q</span>
                                  </div>
                                  <span className="font-semibold text-gray-800 dark:text-gray-100 leading-relaxed pt-1.5">
                                    {faq.question}
                                  </span>
                                </div>
                                <motion.div
                                  animate={{
                                    rotate: expandedFaq === idx ? 180 : 0,
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className="shrink-0"
                                >
                                  <ChevronDown size={20} className="text-gray-400" />
                                </motion.div>
                              </motion.button>
                              <AnimatePresence>
                                {expandedFaq === idx && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      ease: [0.04, 0.62, 0.23, 0.98],
                                    }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-5 pb-5">
                                      <div className="ml-12 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-start gap-3 pt-3">
                                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center shrink-0">
                                            <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                                              A
                                            </span>
                                          </div>
                                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1.5">
                                            {faq.answer}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <FileText size={36} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No FAQs available yet
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
                            Have questions? Feel free to contact the vendor directly for any inquiries
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* POLICIES TAB */}
                  {activeTab === "policies" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Policies & Terms</h3>
                      {vendor.policies?.length > 0 ? (
                        <div className="space-y-6">
                          {vendor.policies.map((policy, idx) => (
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
                                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 tracking-tight">
                                    {policy.title}
                                  </h4>
                                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {policy.content || policy.description}
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
                                      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                        {detail}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <Shield size={36} className="text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No policies listed yet
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
                            Contact the vendor directly for detailed terms, conditions, and policies
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* PRICING OUTSIDE OVERVIEW */}
            {activeTab !== "overview" && (vendor.basePrice || vendor.perDayPrice?.min) && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <IndianRupee size={20} className="text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Pricing</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {vendor.basePrice && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/60 dark:border-emerald-700/60 overflow-hidden">
                      <div className="flex items-center gap-3 p-3 border-b border-emerald-200/30">
                        <div className="p-1.5 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-600">
                          <BadgeIndianRupee size={16} className="text-emerald-600" />
                        </div>
                        <span className="font-semibold text-xs text-gray-600 dark:text-gray-400">Base Price</span>
                      </div>
                      <div className="p-3 text-center">
                        <span className="font-black text-xl text-emerald-600">
                          ₹{vendor.basePrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  )}
                  {vendor.perDayPrice?.min && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/60 dark:border-blue-700/60 overflow-hidden">
                      <div className="flex items-center gap-3 p-3 border-b border-blue-200/30">
                        <div className="p-1.5 bg-white dark:bg-gray-700/50 rounded-lg shadow-sm border border-blue-200 dark:border-blue-600">
                          <Calendar size={16} className="text-blue-600" />
                        </div>
                        <span className="font-semibold text-xs text-gray-600 dark:text-gray-400">
                          Per {vendor.priceUnit || "day"}
                        </span>
                      </div>
                      <div className="p-3 text-center">
                        {vendor.perDayPrice.max ? (
                          <span className="font-black text-lg text-blue-600">
                            ₹{vendor.perDayPrice.min.toLocaleString("en-IN")} - ₹
                            {vendor.perDayPrice.max.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="font-black text-xl text-blue-600">
                            ₹{vendor.perDayPrice.min.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SIMILAR VENDORS */}
            {similarVendors.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Similar Vendors</h2>
                    <p className="text-xs text-gray-500 mt-0.5">You might also like</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {similarVendors.slice(0, 6).map((item, index) => {
                    const isItemLiked = likedVendors.has(item._id);
                    const url = getHrefWithState(`/vendor/${item.category}/${item._id}`);
                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <div className="group block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 relative">
                          <Link href={url}>
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={item.images?.[0] || item.defaultImage}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-black/80 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm">
                                <Star size={11} className="fill-yellow-500 text-yellow-500" /> {item.rating || 0}
                              </div>
                              {item.isVerified && (
                                <div className="absolute top-2.5 left-2.5 bg-green-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-[9px] font-bold flex items-center gap-0.5">
                                  <BadgeCheck size={10} /> Verified
                                </div>
                              )}
                            </div>
                          </Link>
                          {/* Like button on card */}
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!user) {
                                toast.error("Please login to like vendors");
                                return;
                              }
                              const prev = new Set(likedVendors);
                              if (isItemLiked) {
                                prev.delete(item._id);
                              } else {
                                prev.add(item._id);
                              }
                              setLikedVendors(prev);
                              try {
                                const res = await fetch("/api/user/toggle-like", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    vendorId: item._id,
                                  }),
                                });
                                if (!res.ok) throw new Error("Failed");
                                const data = await res.json();
                                toast.success(data.message);
                              } catch {
                                // revert
                                const reverted = new Set(likedVendors);
                                if (isItemLiked) {
                                  reverted.add(item._id);
                                } else {
                                  reverted.delete(item._id);
                                }
                                setLikedVendors(reverted);
                                toast.error("Something went wrong");
                              }
                            }}
                            className="absolute top-[148px] right-3 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-all"
                          >
                            <Heart
                              size={14}
                              className={isItemLiked ? "fill-rose-500 text-rose-500" : "text-gray-400"}
                            />
                          </button>
                          <Link href={`/vendor/${item.category}/${item._id}`}>
                            <div className="p-4">
                              <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate mb-1">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                <MapPin size={11} /> {item.address?.city}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-blue-600 dark:text-blue-400 font-black text-base">
                                  ₹
                                  {item.perDayPrice?.min?.toLocaleString("en-IN") ||
                                    item.basePrice?.toLocaleString("en-IN") ||
                                    "N/A"}
                                </p>
                                <span className="text-[10px] text-gray-400 font-bold uppercase bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                  /{item.priceUnit || "day"}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RECOMMENDED VENDORS */}
            {recommendedVendors.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recommended For You</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Based on your preferences</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {recommendedVendors.slice(0, 4).map((item, index) => {
                    const isItemLiked = likedVendors.has(item._id);
                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >
                        <div className="flex gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700 transition-all group relative">
                          <Link
                            href={`/vendor/${item.category}/${item._id}`}
                            className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative"
                          >
                            <img
                              src={item.images?.[0] || item.defaultImage}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          </Link>
                          <Link href={`/vendor/${item.category}/${item._id}`} className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{item.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Star size={11} className="fill-yellow-500 text-yellow-500" />
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {item.rating || 0}
                              </span>
                              <span className="text-xs text-gray-400">({item.reviews || 0})</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin size={11} className="text-gray-400" />
                              <span className="text-xs text-gray-500 truncate">{item.address?.city}</span>
                            </div>
                            <span className="text-blue-600 font-black text-sm mt-1 block">
                              ₹
                              {item.perDayPrice?.min?.toLocaleString("en-IN") ||
                                item.basePrice?.toLocaleString("en-IN") ||
                                "N/A"}
                            </span>
                          </Link>
                          <div className="flex flex-col items-center gap-2 shrink-0">
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!user) {
                                  toast.error("Please login to like vendors");
                                  return;
                                }
                                const prev = new Set(likedVendors);
                                if (isItemLiked) {
                                  prev.delete(item._id);
                                } else {
                                  prev.add(item._id);
                                }
                                setLikedVendors(prev);
                                try {
                                  const res = await fetch("/api/user/toggle-like", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      vendorId: item._id,
                                    }),
                                  });
                                  if (!res.ok) throw new Error("Failed");
                                  const data = await res.json();
                                  toast.success(data.message);
                                } catch {
                                  const reverted = new Set(likedVendors);
                                  if (isItemLiked) {
                                    reverted.add(item._id);
                                  } else {
                                    reverted.delete(item._id);
                                  }
                                  setLikedVendors(reverted);
                                  toast.error("Something went wrong");
                                }
                              }}
                              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-110 transition-all"
                            >
                              <Heart
                                size={14}
                                className={isItemLiked ? "fill-rose-500 text-rose-500" : "text-gray-400"}
                              />
                            </button>
                            <ExternalLink
                              size={14}
                              className="text-gray-400 group-hover:text-blue-500 transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========== CHANGE 6: INQUIRY FORM SECTION ========== */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Send size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Send Inquiry to {vendor.name}</h2>
                  <p className="text-xs text-gray-500">Get a personalized quote for your event</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={inquiryForm.date}
                    onChange={(e) => setInquiryForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                    Event Type
                  </label>
                  <select
                    value={inquiryForm.eventType}
                    onChange={(e) =>
                      setInquiryForm((p) => ({
                        ...p,
                        eventType: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select event type</option>
                    {(
                      vendor.eventTypes || [
                        "Wedding",
                        "Engagement",
                        "Reception",
                        "Birthday",
                        "Corporate Event",
                        "Other",
                      ]
                    ).map((type, i) => (
                      <option key={i} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5 block">
                  Message
                </label>
                <textarea
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder={`Hi ${vendor.name}, I'm interested in your services for my upcoming event...`}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <button
                onClick={() => {
                  if (!inquiryForm.name || !inquiryForm.phone) {
                    toast.error("Please fill in your name and phone number");
                    return;
                  }
                  const ph = vendor.whatsappNo || vendor.phoneNo;
                  const msg = encodeURIComponent(
                    `Hi ${vendor.name}!\n\nName: ${inquiryForm.name}\nPhone: ${inquiryForm.phone}${inquiryForm.date ? `\nEvent Date: ${inquiryForm.date}` : ""}${inquiryForm.eventType ? `\nEvent Type: ${inquiryForm.eventType}` : ""}${inquiryForm.message ? `\n\nMessage: ${inquiryForm.message}` : ""}\n\nSent via WedPlan`,
                  );
                  window.open(`https://wa.me/${ph?.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
                  toast.success("Inquiry sent via WhatsApp!");
                }}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Send size={18} /> Send Inquiry via WhatsApp
              </button>
            </div>

            {/* ========== CHANGE 6: VENDOR TAGS & CATEGORIES SECTION ========== */}
            {(vendor.tags?.length > 0 || vendor.eventTypes?.length > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Tag size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tags & Categories</h2>
                    <p className="text-xs text-gray-500">Find related vendors and services</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vendor.tags?.map((tag, i) => (
                    <span
                      key={`tag-${i}`}
                      className="px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-xl text-sm font-semibold hover:shadow-md hover:scale-105 transition-all cursor-default flex items-center gap-2"
                    >
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                  {vendor.eventTypes?.map((type, i) => (
                    <span
                      key={`event-${i}`}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-semibold hover:shadow-md hover:scale-105 transition-all cursor-default flex items-center gap-2"
                    >
                      <Calendar size={12} /> {type}
                    </span>
                  ))}
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <categoryInfo.icon size={12} /> {categoryInfo.label}
                  </span>
                  {vendor.address?.city && (
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-semibold flex items-center gap-2">
                      <MapPin size={12} /> {vendor.address.city}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ========== CHANGE 6: VENDOR COMPARISON / AT A GLANCE ========== */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <BarChart3 size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{vendor.name} at a Glance</h2>
                  <p className="text-xs text-gray-500">Quick summary of key details</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <Star size={18} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Customer Rating</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">
                        {vendor.rating?.toFixed(1) || "0.0"}/5
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                      style={{ width: `${((vendor.rating || 0) / 5) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Calendar size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Total Bookings</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">{vendor.bookings || 0}+</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Events successfully completed</p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Timer size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Avg Response</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">
                        {vendor.responseTime || "< 1hr"}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Usually responds quickly</p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Medal size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Experience</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">
                        {vendor.yearsExperience || "N/A"} yrs
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">In the wedding industry</p>
                </div>
              </div>
              {vendor.isVerified && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                    <BadgeCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-green-800 dark:text-green-300">Verified & Trusted Vendor</p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      This vendor has been verified by our team for quality and authenticity.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ========== CHANGE 6: LAST UPDATED / FRESHNESS INDICATOR ========== */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Clock size={16} className="text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Profile last updated:{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {vendor.updatedAt
                      ? new Date(vendor.updatedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>
                </p>
              </div>
              <p className="text-xs text-gray-400">Vendor ID: {vendor._id}</p>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-span-1 space-y-6">
            <div
              ref={rightSidebarRef}
              className="fixed space-y-5 overflow-y-auto transition-all ease-in-out duration-300 w-[calc((min(1400px,100vw-48px))/3-16px)]"
              style={{
                maxHeight: showHeaderTabs ? "calc(100vh - 190px)" : "calc(100vh - 145px)",
                top: showHeaderTabs ? "164px" : "136px",
              }}
            >
              {/* VENDOR INFO CARD */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-4 mb-5">
                  <Link href={vendorProfileUrl || `/vendor/${vendor.category}/${vendor._id}/profile`} className="relative group shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-3 ring-blue-500 dark:ring-purple-500 shadow-lg group-hover:ring-blue-600 transition-all">
                      <img
                        src={vendor.defaultImage || vendor.images?.[0] || "/placeholder-profile.jpg"}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 shadow-md">
                      <Eye size={12} className="text-white" />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h1 className="text-xl font-black text-gray-900 dark:text-white truncate">{vendor.name}</h1>
                      {vendor.isVerified && <BadgeCheck size={18} className="text-blue-500 fill-blue-500 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
                        <Star size={12} className="fill-yellow-500 text-yellow-500" />
                        <span className="font-bold text-yellow-700 dark:text-yellow-400 text-xs">
                          {vendor.rating || 0}
                        </span>
                        <span className="text-yellow-600/70 text-[10px]">({vendor.reviews || 0})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <MapPin size={12} />
                        <span>{vendor.address?.city || "India"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-0.5 bg-${categoryInfo.color}-50 dark:bg-${categoryInfo.color}-900/20 text-${categoryInfo.color}-600 text-[10px] font-bold rounded-full capitalize flex items-center gap-0.5`}
                      >
                        <categoryInfo.icon size={10} /> {categoryInfo.label}
                      </span>
                      {vendor.availabilityStatus && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${vendor.availabilityStatus === "Available" ? "bg-green-100 text-green-700" : vendor.availabilityStatus === "Busy" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                        >
                          {vendor.availabilityStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-4 gap-2 py-4 border-t border-b border-gray-100 dark:border-gray-800">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="text-center">
                      <div className={`w-8 h-8 mx-auto mb-1 ${item.bg} rounded-lg flex items-center justify-center`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <p className="font-bold text-xs text-gray-900 dark:text-white">{item.value}</p>
                      <p className="text-[8px] text-gray-500 uppercase font-bold">{item.label}</p>
                    </div>
                  ))}
                </div>

                {(vendor.repeatCustomerRate || vendor.responseRate) && (
                  <div className="grid grid-cols-2 gap-2 py-3 border-b border-gray-100 dark:border-gray-800">
                    {vendor.repeatCustomerRate && (
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-[10px] text-gray-500">Repeat Customers</p>
                        <p className="font-bold text-sm text-green-700 dark:text-green-400">
                          {vendor.repeatCustomerRate}
                        </p>
                      </div>
                    )}
                    {vendor.responseRate && (
                      <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-[10px] text-gray-500">Response Rate</p>
                        <p className="font-bold text-sm text-blue-700 dark:text-blue-400">{vendor.responseRate}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Pricing */}
                <div className="flex justify-between w-[80%] mx-auto items-center h-full text-center py-4 pb-0 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-500 mb-1">Starting from</p>
                  <div>
                    <p className="text-3xl font-black text-blue-600 dark:text-blue-400">₹{displayPrice}</p>
                    <p className="text-xs text-gray-500">per {vendor.priceUnit || "day"}</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-4">
                  <button
                    onClick={() => {
                      if (isInCart(vendor._id)) removeFromCart(vendor._id);
                      else
                        addToCart({
                          _id: vendor._id,
                          name: vendor.name,
                          category: vendor.category,
                          price: vendor.perDayPrice?.min || vendor.basePrice || 0,
                          image: vendor.defaultImage || vendor.images?.[0] || "",
                          quantity: 1,
                          address: vendor.address,
                          rating: vendor.rating || 0,
                          reviews: vendor.reviews || 0,
                          isVerified: vendor.isVerified || false,
                        });
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-bold text-sm ${isInCart(vendor._id) ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  >
                    {isInCart(vendor._id) ? (
                      <>
                        <Check size={18} /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} /> Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if(canContinue){
                        const ph = vendor.whatsappNo || vendor.phoneNo;
                      const msg = encodeURIComponent(`Hi ${vendor.name}! I'm interested in your services.`);
                      window.open(`https://wa.me/${ph?.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
                      }else{
                        setIsLeadModalOpen(true);
           setLeadModalActionType("revealWhatsapp");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-bold text-sm"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        if(canContinue){
                          window.open(`tel:${vendor.phoneNo}`, "_self");
                        }else{
                          setIsLeadModalOpen(true);
                          setLeadModalActionType("revealPhone");
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all font-medium text-sm"
                    >
                      <Phone size={16} /> Call
                    </button>
                    <button
                      onClick={() => {
                        if(canContinue){
                          window.open(`mailto:${vendor.email}`, "_self");
                        }else{
                          setIsLeadModalOpen(true);
                          setLeadModalActionType("revealEmail");
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-all font-medium text-sm"
                    >
                      <Mail size={16} /> Email
                    </button>
                  </div>
                </div>

                {/* Category Quick Info */}
                {vendor.category && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2">Quick Info</h4>
                    {vendor.category === "venues" && (
                      <>
                        {(vendor.seating?.min || vendor.seating?.max) && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Capacity</span>
                            <span className="font-semibold">
                              {vendor.seating?.min || 0} - {vendor.seating?.max || 0}
                            </span>
                          </div>
                        )}
                        {vendor.parking?.capacity && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Parking</span>
                            <span className="font-semibold">{vendor.parking.capacity} slots</span>
                          </div>
                        )}
                        {vendor.halls && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Halls</span>
                            <span className="font-semibold">{vendor.halls}</span>
                          </div>
                        )}
                      </>
                    )}
                    {vendor.category === "photographers" && (
                      <>
                        {vendor.teamSize && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Team</span>
                            <span className="font-semibold">{vendor.teamSize} members</span>
                          </div>
                        )}
                        {vendor.deliveryTime && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Delivery</span>
                            <span className="font-semibold">{vendor.deliveryTime} weeks</span>
                          </div>
                        )}
                      </>
                    )}
                    {vendor.category === "makeup" && (
                      <>
                        {vendor.services?.length > 0 && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Services</span>
                            <span className="font-semibold">{vendor.services.length}+ types</span>
                          </div>
                        )}
                        {vendor.brandsUsed?.length > 0 && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Brands</span>
                            <span className="font-semibold">{vendor.brandsUsed.length}+ premium</span>
                          </div>
                        )}
                      </>
                    )}
                    {vendor.category === "mehendi" && (
                      <>
                        {vendor.teamSize && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Team</span>
                            <span className="font-semibold">{vendor.teamSize}+ artists</span>
                          </div>
                        )}
                        {vendor.pricePerHand && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Per Hand</span>
                            <span className="font-semibold">₹{vendor.pricePerHand}</span>
                          </div>
                        )}
                      </>
                    )}
                    {vendor.category === "catering" && (
                      <>
                        {vendor.cuisines?.length > 0 && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Cuisines</span>
                            <span className="font-semibold">{vendor.cuisines.length}+ types</span>
                          </div>
                        )}
                        {vendor.pricePerPlate?.veg && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Veg Plate</span>
                            <span className="font-semibold">₹{vendor.pricePerPlate.veg}</span>
                          </div>
                        )}
                      </>
                    )}
                    {vendor.category === "djs" && (
                      <>
                        {vendor.genres?.length > 0 && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Genres</span>
                            <span className="font-semibold">{vendor.genres.length}+ styles</span>
                          </div>
                        )}
                        {vendor.performanceDuration && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Duration</span>
                            <span className="font-semibold">{vendor.performanceDuration}</span>
                          </div>
                        )}
                      </>
                    )}
                    {vendor.category === "planners" && (
                      <>
                        {vendor.teamSize && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Team</span>
                            <span className="font-semibold">{vendor.teamSize} members</span>
                          </div>
                        )}
                        {vendor.vendorNetwork && (
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Network</span>
                            <span className="font-semibold">{vendor.vendorNetwork}+ vendors</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* TRUST & SAFETY */}
              {(vendor.isVerified || vendor.tags?.includes("Premium")) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3">Safety & Trust</h3>
                  <div className="space-y-2.5">
                    {vendor.isVerified && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <Shield size={18} className="text-green-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Verified Vendor</span>
                        <CheckCircle size={14} className="text-green-500 ml-auto" />
                      </div>
                    )}
                    {vendor.tags?.includes("Premium") && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <Award size={18} className="text-blue-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Premium Member</span>
                        <CheckCircle size={14} className="text-blue-500 ml-auto" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VENDOR PROFILE LINK */}
              <Link
                href={`/vendor/${vendor.category}/${vendor._id}/profile`}
                className="group block bg-gradient-to-br from-indigo-500/80 via-purple-500/80 to-blue-600/70 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 px-5 py-4 rounded-2xl border border-gray-200/60 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/30 group-hover:ring-white/60 transition-all shrink-0">
                      <img
                        src={vendor.defaultImage || vendor.images?.[0] || "/placeholder-profile.jpg"}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">View Profile</p>
                      <p className="text-[11px] text-white/70 truncate">Bio, social stats & featured work</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-white group-hover:translate-x-1 transition-transform shrink-0"
                  />
                </div>
              </Link>

              {/* QUICK CONTACT */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3">Quick Contact</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if(canContinue){
                        window.open(`tel:${vendor.phoneNo}`, "_self");
                      }else{
                        setIsLeadModalOpen(true);
                        setLeadModalActionType("revealPhone");
                      }
                    }}
                    className="flex w-full items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                  >
                    <Phone size={18} className="text-green-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Phone</p>
                    {canContinue && <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{vendor.phoneNo}</p>}
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                  {vendor.whatsappNo && (
                    <button
                      onClick={() => {
                        if(canContinue){
                          window.open(`https://wa.me/${vendor.whatsappNo}`, "_blank");
                        }else{
                          setIsLeadModalOpen(true);
                          setLeadModalActionType("revealWhatsapp");
                        }
                      }}
                      className="flex w-full items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                    >
                      <MessageCircle size={18} className="text-emerald-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">WhatsApp</p>
                        {canContinue && <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{vendor.whatsappNo}</p>}
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  )}
                  <button
                     onClick={() => {
                      if(canContinue){
                        window.open(`mailto:${vendor.email}`, "_self");
                      }else{
                        setIsLeadModalOpen(true);
                        setLeadModalActionType("revealEmail");
                      }
                    }}
                    className="flex w-full items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    <Mail size={18} className="text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Email</p>
                      {canContinue && <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{vendor.email}</p>}
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                  {vendor.contactPerson?.firstName && (
                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <User size={18} className="text-purple-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Contact Person</p>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">
                          {vendor.contactPerson.firstName} {vendor.contactPerson.lastName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* KEYBOARD SHORTCUT HINT */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200/60 dark:border-gray-700/60">
                <button
                  onClick={() => setShowKeyboardShortcuts(true)}
                  className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <Keyboard size={14} /> Press{" "}
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-[10px] font-mono font-bold shadow-sm">
                    ?
                  </kbd>{" "}
                  for keyboard shortcuts
                </button>
              </div>

              {/* HELP FOOTER */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 text-center border border-gray-200/60 dark:border-gray-700/60">
                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl shadow mx-auto mb-2 flex items-center justify-center">
                  <Headphones size={22} className="text-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mb-1">Need help?</p>
                <p className="font-black text-base text-gray-900 dark:text-white">+91 6267430959</p>
                <p className="text-[10px] text-gray-400 mt-0.5">18/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE GALLERY MODAL */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="flex justify-between items-center p-4 z-20">
              <span className="text-white font-mono text-sm bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {modalImageIndex + 1} / {images.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setImageZoom((z) => Math.min(z + 0.5, 3))}
                  className="p-2.5 text-white/70 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={() => setImageZoom(1)}
                  className="p-2.5 text-white/70 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-2.5 text-white/70 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              <button
                onClick={() => {
                  setModalImageIndex((p) => (p - 1 + images.length) % images.length);
                  setSlideDirection(-1);
                }}
                className="absolute left-4 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                <motion.div
                  key={modalImageIndex}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute w-full h-full flex items-center justify-center p-4"
                >
                  <img
                    src={images[modalImageIndex]}
                    alt="Full view"
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    style={{ transform: `scale(${imageZoom})` }}
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>
              <button
                onClick={() => {
                  setModalImageIndex((p) => (p + 1) % images.length);
                  setSlideDirection(1);
                }}
                className="absolute right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="h-20 flex items-center justify-center gap-2 overflow-x-auto px-4 pb-4 no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setModalImageIndex(i);
                    setSlideDirection(i > modalImageIndex ? 1 : -1);
                  }}
                  className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === modalImageIndex ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-75"}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" loading="lazy" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {showShareModal && (
          <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} vendorName={vendor.name} />
        )}
      </AnimatePresence>

      {/* KEYBOARD SHORTCUTS MODAL */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <KeyboardShortcutsModal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />
        )}
      </AnimatePresence>

        <LeadCaptureModal
                  isOpen={isLeadModalOpen}
                  onClose={() => setIsLeadModalOpen(false)}
                  actionType={leadModalActionType}
                  title="Plan Your Perfect Event"
                  subtitle="Get started with India's most affordable event planning marketplace"
                />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default VendorDetailsPageWrapper;
