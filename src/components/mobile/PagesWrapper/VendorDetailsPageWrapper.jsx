"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  MapPin,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Share2,
  Tag,
  RefreshCw,
  Check,
  ShoppingBag,
  Map as MapIcon,
  Wifi,
  Car,
  Music,
  BarChart2,
  Wind,
  Camera,
  User,
  Shield,
  Utensils,
  Crown,
  Home,
  ArrowLeft,
  ShoppingCart,
  UserPlus,
  X,
  Facebook,
  Twitter,
  Copy,
  Clock,
  Info,
  Users,
  MessageCircle,
  ImageIcon,
  Award,
  Sparkles,
  ThumbsUp,
  Bookmark,
  Navigation,
  ExternalLink,
  Verified,
  TrendingUp,
  Zap,
  Gift,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  Instagram,
  Linkedin,
  Send,
  Building,
  Layers,
  RotateCcw,
  ZoomIn,
  Play,
  Pause,
  Trash2,
  Tv,
  Coffee,
  Flower2,
  Shirt,
  UtensilsCrossed,
  BadgeCheck,
  Percent,
  Timer,
  Route,
  HandCoins,
  Medal,
  Trophy,
  Gem,
  GlassWater,
  Mic2,
  Video,
  Projector,
  Armchair,
  DoorOpen,
  Accessibility,
  Baby,
  PawPrint,
  Cigarette,
  ThermometerSun,
  Flame,
  Sun,
  Compass,
  Headphones,
  ArrowRight,
  Lock,
  Globe,
  Youtube,
  Building2,
  Target,
  DollarSign,
  Paintbrush2,
  Hand,
  CakeSlice,
  Scissors,
  Package,
  UserCircle,
  ChevronDown,
  Leaf,
  Palette,
  Brush,
  Droplets,
  Heart as HeartIcon,
  Grid3X3,
  LayoutGrid,
  IndianRupee,
  BadgeIndianRupee,
  Eye,
  TrendingDown,
  CalendarCheck,
} from "lucide-react";
import DetailsPageSkeleton from "../ui/skeletons/DetailsPageSkeleton";
import Link from "next/link";
import ReviewSection from "../ReviewSection";
import { useCartStore } from "../../../GlobalState/CartDataStore";
import { useRedirectWithReturn } from "../../../hooks/useNavigationWithReturn";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Image from "next/image";
import SmartMedia from "@/components/mobile/SmartMediaLoader";
import { useAppValuesStore } from "../../../GlobalState/AppValuesStore";
import LeadCaptureModalMobile from "../LeadCaptureModal";

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
  djs: { label: "DJs", icon: Music, color: "violet" },
  hairstyling: { label: "Hairstyling", icon: Scissors, color: "fuchsia" },
  other: { label: "Services", icon: FileText, color: "gray" },
};

const SPRING_CONFIG = {
  stiff: { type: "spring", stiffness: 400, damping: 30 },
  gentle: { type: "spring", stiffness: 200, damping: 25 },
  bouncy: { type: "spring", stiffness: 300, damping: 20 },
  smooth: { type: "spring", stiffness: 150, damping: 20 },
};

const MOCK_COUPONS = [
  {
    code: "FIRST20",
    discount: 20,
    type: "percent",
    maxDiscount: 25000,
    minOrder: 100000,
    description: "20% off on first booking",
  },
  {
    code: "WEDDING10",
    discount: 10,
    type: "percent",
    maxDiscount: 15000,
    minOrder: 50000,
    description: "10% off on wedding bookings",
  },
  { code: "FLAT5K", discount: 5000, type: "flat", minOrder: 75000, description: "Flat ₹5,000 off" },
];

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? "100%" : "-100%", opacity: 0 }),
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

const modalTransition = { type: "spring", damping: 30, stiffness: 400, mass: 0.8 };
const backdropTransition = { duration: 0.2, ease: "easeOut" };

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50, success: [10, 50, 10] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

const formatFullPrice = (price) => {
  if (isNaN(price) || price === 0) return "0";
  return price.toLocaleString("en-IN");
};

const formatPrice = (price) => {
  if (!price) return "N/A";
  return `₹${Number(price).toLocaleString("en-IN")}`;
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

const ScrollProgressBar = memo(() => {
  const progress = useScrollProgress();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: progress > 2 ? 1 : 0 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-amber-500"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
});
ScrollProgressBar.displayName = "ScrollProgressBar";

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
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  iconBg || "bg-blue-50 dark:bg-blue-900/20"
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

const ProgressIndicator = memo(({ total, currentIndex, duration, isPaused, onSelect }) => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const pausedProgressRef = useRef(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    startTimeRef.current = null;
    pausedProgressRef.current = 0;
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      pausedProgressRef.current = progress;
      return;
    }
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp - (pausedProgressRef.current / 100) * duration;
      const elapsed = timestamp - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      if (newProgress < 100) animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPaused, duration, currentIndex, progress]);

  const remainingSeconds = Math.ceil(((100 - progress) / 100) * (duration / 1000));

  return (
    <div className="absolute bottom-19 left-0 right-0 z-30 pointer-events-none">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative pt-16 pb-6 px-3">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/10 shadow-xl pointer-events-auto">
              <span className="text-white font-bold text-xs">{currentIndex + 1}</span>
              <div className="w-px h-3 bg-white/30" />
              <span className="text-white/60 text-xs">{total}</span>
              {isPaused && (
                <>
                  <div className="w-px h-3 bg-white/30" />
                  <Pause size={10} className="text-white/60" />
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center gap-1.5 px-2 max-w-sm mx-auto pointer-events-auto">
            {Array.from({ length: total }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(idx)}
                className="relative h-1 flex-1 max-w-[40px] rounded-full overflow-hidden group transition-all duration-200"
              >
                <div className="absolute inset-0 bg-white/25 group-hover:bg-white/35 transition-colors rounded-full" />
                {idx < currentIndex && <div className="absolute inset-0 bg-white rounded-full" />}
                {idx === currentIndex && (
                  <div
                    className="absolute inset-0 bg-white rounded-full origin-left"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-2 pointer-events-auto">
            <div className="flex items-center gap-1 text-white/50 text-[10px] bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Timer size={9} />
              <span className="font-medium">{remainingSeconds}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
ProgressIndicator.displayName = "ProgressIndicator";

const InfoChip = memo(({ icon: Icon, label, value, color = "blue", size = "normal" }) => (
  <div
    className={`flex items-center gap-2 p-2.5 bg-${color}-50 dark:bg-${color}-900/20 rounded-xl ${
      size === "small" ? "p-2" : ""
    }`}
  >
    <div
      className={`w-8 h-8 rounded-lg bg-${color}-100 dark:bg-${color}-800/30 flex items-center justify-center ${
        size === "small" ? "w-7 h-7" : ""
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
    className={`relative overflow-hidden p-3 rounded-2xl ${
      gradient ||
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

const PortfolioAlbumSection = memo(({ images, onImageClick, vendorName }) => {
  if (!images || images.length === 0) return null;

  const coverImage = images[0];
  const thumbnails = images.slice(1, 7);
  const remainingCount = images.length - 7;

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
    >
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <LayoutGrid size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Portfolio</h3>
              <p className="text-[10px] text-gray-500">{images.length} photos</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onImageClick(0)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1"
          >
            View All <ArrowRight size={10} />
          </motion.button>
        </div>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-3 gap-1.5">
          {thumbnails.map((img, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={() => onImageClick(idx)}
              className={`relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ${
                idx === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
            >
              <SmartMedia
                src={img}
                type="image"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center center" }}
                loaderImage="/GlowLoadingGif.gif"
              />
              {idx === 5 && remainingCount > 0 && (
                <div
                  className="absolute inset-0 bg-black/60 flex items-center justify-center"
                  onClick={() => onImageClick(6)}
                >
                  <span className="text-white font-bold">+{remainingCount}</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
PortfolioAlbumSection.displayName = "PortfolioAlbumSection";

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

const VendorCard = memo(({ item, type = "horizontal" }) => {
  if (type === "horizontal") {
    return (
      <Link href={`/vendor/${item.category}/${item._id}`} className="min-w-[200px] snap-start">
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="h-28 relative">
            <SmartMedia
              src={item.images?.[0] || item.defaultImage}
              type="image"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center center" }}
              loaderImage="/GlowLoadingGif.gif"
            />
            <div className="absolute top-2 right-2 bg-white/95 dark:bg-black/80 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <Star size={10} className="fill-yellow-500 text-yellow-500" /> {item.rating || 0}
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-bold text-xs text-gray-900 dark:text-white truncate">{item.name}</h3>
            <p className="text-[10px] text-gray-500 mt-0.5 truncate flex items-center gap-1">
              <MapPin size={10} /> {item.address?.city}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-blue-600 dark:text-blue-400 font-black text-sm">
                ₹{(item.perDayPrice?.min ?? item.basePrice)?.toLocaleString("en-IN") || "N/A"}
              </p>
              <span className="text-[9px] text-gray-400 font-bold uppercase bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                /{item.priceUnit || "day"}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }
  return (
    <Link href={`/vendor/${item.category}/${item._id}`}>
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="flex gap-3 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
          <SmartMedia
            src={item.images?.[0] || item.defaultImage}
            type="image"
            className="w-full h-full object-cover"
            loaderImage="/GlowLoadingGif.gif"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{item.name}</h4>
          <div className="flex items-center gap-1 mt-1">
            <Star size={10} className="fill-yellow-500 text-yellow-500" />
            <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">{item.rating || 0}</span>
            <span className="text-[10px] text-gray-400">({item.reviews || 0})</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={10} className="text-gray-400" />
            <span className="text-[10px] text-gray-500 truncate">{item.address?.city}</span>
          </div>
          <span className="text-blue-600 font-black text-sm">
            ₹{item.perDayPrice?.min?.toLocaleString() || item.basePrice?.toLocaleString() || "N/A"}
          </span>
        </div>
      </motion.div>
    </Link>
  );
});
VendorCard.displayName = "VendorCard";

const PackageCard = memo(({ pkg, isSelected, onSelect }) => (
  <motion.div
    layout
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(pkg.id || pkg._id)}
    className={`bg-white dark:bg-gray-900 p-4 rounded-2xl border-2 transition-all shadow-sm ${
      isSelected ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-gray-100 dark:border-gray-800"
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
      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
        isSelected
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {isSelected ? "✓ Selected" : "Select Package"}
    </motion.button>
  </motion.div>
));
PackageCard.displayName = "PackageCard";

const CartItemCard = memo(({ item, onRemove }) => {
  const haptic = useHapticFeedback();
  const price = item.price || item.basePrice || item.perDayPrice?.min || 0;
  const img = item.image || item.defaultImage || item.images?.[0];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, height: 0, marginBottom: 0 }}
      transition={SPRING_CONFIG.gentle}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-3"
    >
      <div className="p-3 flex gap-3">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
          <img src={img} alt={item.name} className="w-full h-full object-cover" />
          {item.isVerified && (
            <div className="absolute top-1 left-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <BadgeCheck size={12} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-semibold text-gray-700">{item.rating?.toFixed(1) || "4.5"}</span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic("medium");
                  onRemove(item);
                }}
                className="p-2 bg-red-50 rounded-lg text-red-500"
              >
                <Trash2 size={14} />
              </motion.button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600 capitalize">
                {item.category}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <MapPin size={10} />
                {item.address?.city || "Location"}
              </div>
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-base font-bold text-blue-600">₹{formatFullPrice(price)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
CartItemCard.displayName = "CartItemCard";

const CouponSection = memo(({ appliedCoupon, onApplyCoupon, onRemoveCoupon, subtotal, showToast }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const haptic = useHapticFeedback();

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }
    haptic("light");
    setIsLoading(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const coupon = MOCK_COUPONS.find((c) => c?.code?.toLowerCase() === couponCode?.trim()?.toLowerCase());
    if (!coupon) {
      setError("Invalid coupon code");
      setIsLoading(false);
      return;
    }
    if (subtotal < coupon.minOrder) {
      setError(`Minimum order of ₹${formatFullPrice(coupon.minOrder)} required`);
      setIsLoading(false);
      return;
    }
    haptic("success");
    onApplyCoupon(coupon);
    setCouponCode("");
    setIsExpanded(false);
    setIsLoading(false);
    showToast("Coupon applied successfully!", "success");
  }, [couponCode, subtotal, onApplyCoupon, haptic, showToast]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {appliedCoupon ? (
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Tag size={18} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-green-600 text-sm">{appliedCoupon.code}</p>
                <p className="text-[10px] text-gray-500">{appliedCoupon.description}</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                haptic("light");
                onRemoveCoupon();
              }}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <X size={16} />
            </motion.button>
          </div>
        </div>
      ) : (
        <>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              haptic("light");
              setIsExpanded(!isExpanded);
            }}
            className="w-full p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Percent size={18} className="text-orange-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Apply Coupon</p>
                <p className="text-[10px] text-gray-500">{MOCK_COUPONS.length} coupons available</p>
              </div>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
              <ChevronDown size={18} className="text-gray-400" />
            </motion.div>
          </motion.button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={SPRING_CONFIG.gentle}
                className="border-t border-gray-100 overflow-hidden"
              >
                <div className="p-3 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setError("");
                      }}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleApplyCoupon}
                      disabled={isLoading}
                      className="px-4 py-2.5 rounded-xl text-white font-bold text-sm bg-blue-600 disabled:opacity-60"
                    >
                      {isLoading ? <RefreshCw size={16} className="animate-spin" /> : "Apply"}
                    </motion.button>
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 font-medium flex items-center gap-1"
                    >
                      <AlertCircle size={12} /> {error}
                    </motion.p>
                  )}
                  <div className="space-y-2">
                    {MOCK_COUPONS.map((coupon) => (
                      <motion.button
                        key={coupon.code}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setCouponCode(coupon.code);
                          setError("");
                        }}
                        className="w-full p-2.5 bg-gray-50 rounded-xl flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Tag size={14} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{coupon.code}</p>
                            <p className="text-[10px] text-gray-500">{coupon.description}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
});
CouponSection.displayName = "CouponSection";

const PriceBreakdown = memo(({ subtotal, vendorDiscount, couponDiscount, taxes, platformFee, total }) => {
  const [showDetails, setShowDetails] = useState(false);
  const haptic = useHapticFeedback();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-sm">Price Details</h3>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            haptic("light");
            setShowDetails(!showDetails);
          }}
          className="text-[10px] font-semibold text-blue-600 flex items-center gap-1"
        >
          {showDetails ? "Hide" : "View"} breakdown
          <motion.div animate={{ rotate: showDetails ? 180 : 0 }}>
            <ChevronDown size={12} />
          </motion.div>
        </motion.button>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-900">₹{formatFullPrice(subtotal)}</span>
        </div>
        {vendorDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Vendor Discount</span>
            <span className="font-medium text-green-600">-₹{formatFullPrice(vendorDiscount)}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Coupon Discount</span>
            <span className="font-medium text-green-600">-₹{formatFullPrice(couponDiscount)}</span>
          </div>
        )}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 pt-2 border-t border-dashed border-gray-200 overflow-hidden"
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Platform Fee</span>
                <span className="font-medium text-gray-600">₹{formatFullPrice(platformFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">GST (18%)</span>
                <span className="font-medium text-gray-600">₹{formatFullPrice(taxes)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="font-bold text-gray-900">Total</span>
          <span className="text-xl font-black text-blue-600">₹{formatFullPrice(total)}</span>
        </div>
        {(vendorDiscount > 0 || couponDiscount > 0) && (
          <div className="mt-2 p-2.5 bg-green-50 rounded-xl">
            <p className="text-xs font-bold text-green-700 flex items-center gap-1.5">
              <Sparkles size={14} />
              You save ₹{formatFullPrice(vendorDiscount + couponDiscount)} on this order!
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
PriceBreakdown.displayName = "PriceBreakdown";

const CartDrawer = memo(({ onClose, items, onRemove, onUpdateQuantity, showToast }) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const haptic = useHapticFeedback();

  useEffect(() => {
    if (items.length === 0) {
      // Only close after a small delay to avoid jarring UX when removing last item
      const timer = setTimeout(() => {
        setAppliedCoupon(null);
        onClose();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [items.length, onClose]);

  const priceDetails = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + (item.price || item.basePrice || item.perDayPrice?.min || 0) * (item.quantity || 1),
      0,
    );
    let couponDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === "percent")
        couponDiscount = Math.min(
          Math.round((subtotal * appliedCoupon.discount) / 100),
          appliedCoupon.maxDiscount || Infinity,
        );
      else couponDiscount = appliedCoupon.discount;
    }
    const afterDiscount = subtotal - couponDiscount;
    const platformFee = Math.round(subtotal * 0.02);
    const taxes = Math.round(afterDiscount * 0.18);
    return {
      subtotal,
      vendorDiscount: 0,
      couponDiscount,
      platformFee,
      taxes,
      total: afterDiscount + taxes + platformFee,
    };
  }, [items, appliedCoupon]);

  const handleRemoveItem = useCallback(
    (item) => {
      haptic("medium");
      onRemove(item._id);
      showToast("Item removed from cart", "info");
    },
    [onRemove, haptic, showToast],
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={SPRING_CONFIG.gentle}
        className="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-gray-50 z-[70] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="bg-white px-4 pt-3 pb-3 border-b border-gray-100 sticky top-0 z-10">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-3" />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Your Cart</h2>
                <p className="text-xs text-gray-500">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length > 0 && (
            <>
              <div className="mb-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemCard key={item._id} item={item} onRemove={handleRemoveItem} />
                  ))}
                </AnimatePresence>
              </div>
              <div className="mb-4">
                <CouponSection
                  appliedCoupon={appliedCoupon}
                  onApplyCoupon={setAppliedCoupon}
                  onRemoveCoupon={() => {
                    haptic("light");
                    setAppliedCoupon(null);
                    showToast("Coupon removed", "info");
                  }}
                  subtotal={priceDetails.subtotal}
                  showToast={showToast}
                />
              </div>
              <PriceBreakdown {...priceDetails} />
              <div className="mt-4 p-3 bg-white rounded-2xl border border-gray-100">
                <div className="flex items-center justify-around">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Shield size={14} className="text-green-500" />
                    <span className="text-[10px] font-medium">Secure</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200" />
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <BadgeCheck size={14} className="text-blue-500" />
                    <span className="text-[10px] font-medium">Verified</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200" />
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock size={14} className="text-amber-500" />
                    <span className="text-[10px] font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>
              <div className="h-32" />
            </>
          )}
        </div>
        {items.length > 0 && (
          <div className="bg-white p-4 pb-2 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Grand Total</p>
                <p className="text-2xl font-black text-blue-600">₹{formatFullPrice(priceDetails.total)}</p>
              </div>
              {priceDetails.couponDiscount > 0 && (
                <div className="px-3 py-1.5 bg-green-100 rounded-xl">
                  <p className="text-xs font-bold text-green-700">
                    Save ₹{formatFullPrice(priceDetails.couponDiscount)}
                  </p>
                </div>
              )}
            </div>
            <Link
              href="/user/checkout"
              onClick={() => {
                haptic("medium");
                onClose();
              }}
              className="w-full bg-[#E5B80B] text-blue-900 py-4 rounded-2xl font-bold text-base shadow-lg shadow-yellow-200/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Lock size={18} />
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>
            <p className="text-center text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1">
              <Lock size={10} /> Secured by 256-bit SSL encryption
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
});
CartDrawer.displayName = "CartDrawer";

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
                className={`p-3 rounded-xl flex items-center gap-3 ${
                  vendor.destinationWeddings
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

const VendorDetailsPageWrapper = ({ initialVendor, initialSimilar, initialRecommended }) => {
  const { id } = useParams();
  const redirectWithReturn = useRedirectWithReturn();
  const router = useRouter();
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCartStore();
  const { allowedAction, canContinue } = useAppValuesStore();

  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const similarRef = useRef(null);
  const recommendedRef = useRef(null);
  const tabsRef = useRef(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const autoplayTimerRef = useRef(null);
  const contentSectionRef = useRef(null);

  const [showHeaderTabs, setShowHeaderTabs] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const { scrollY } = useScroll();
  const carouselY = useTransform(scrollY, [0, 500], [0, 150]);
  const carouselScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const carouselOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  const [vendor, setVendor] = useState(initialVendor);
  const [similarVendors, setSimilarVendors] = useState(initialSimilar || []);
  const [recommendedVendors, setRecommendedVendors] = useState(initialRecommended || []);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalActionType, setLeadModalActionType] = useState("general");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [showContactSheet, setShowContactSheet] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [imageZoom, setImageZoom] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState("all");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { user, isLoaded: isAuthLoaded } = useUser();
  const [statusLoading, setStatusLoading] = useState(false);
  const [likingLoading, setLikingLoading] = useState(false);
  const [bookmarkingLoading, setBookmarkingLoading] = useState(false);

  const handleUpdateQuantity = useCallback(
    (id, quantity) => {
      updateQuantity(id, quantity);
    },
    [updateQuantity],
  );
  const showToast = useCallback((message, type = "success") => {
    toast[type](message);
  }, []);

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
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching interaction status:", error);
        }
      } finally {
        if (isMounted) {
          setStatusLoading(false);
        }
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [user, vendor?._id]);

  const handleToggleLike = async () => {
    // Prevent multiple clicks
    if (!isAuthLoaded || likingLoading || statusLoading) return;

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
    } catch (error) {
      // Revert on error
      setIsLiked(prevLiked);
      toast.error("Something went wrong");
    } finally {
      setLikingLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    // Prevent multiple clicks
    if (!isAuthLoaded || bookmarkingLoading || statusLoading) return;

    if (!user) {
      toast.error("Please login to bookmark vendors");
      return;
    }

    setBookmarkingLoading(true);
    const prevBookmarked = isBookmarked;
    setIsBookmarked(!prevBookmarked);

    if (navigator.vibrate) navigator.vibrate(10);

    try {
      const res = await fetch("/api/user/toggle-watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: vendor._id }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      // Revert on error
      setIsBookmarked(prevBookmarked);
      toast.error("Something went wrong");
    } finally {
      setBookmarkingLoading(false);
    }
  };

  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    eventType: "",
    budget: "",
    timeSlot: "",
    notes: "",
  });

  const isInCart = useMemo(
    () => (vendor ? cartItems.some((item) => item._id === vendor._id) : false),
    [cartItems, vendor],
  );

  const handleCartToggle = useCallback(() => {
    if (!vendor) return;
    if (navigator.vibrate) navigator.vibrate(10);
    if (isInCart) {
      setActiveDrawer("cart");
      return;
    }
    addToCart({
      ...vendor,
      price: vendor.perDayPrice?.min || vendor.basePrice || 0,
      image: vendor.images?.[0] || vendor.defaultImage || "",
      quantity: 1,
    });
  }, [vendor, isInCart, addToCart]);

  const handleInviteTeam = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(10);
    redirectWithReturn("/plan-my-event/event");
  }, [redirectWithReturn]);

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const threshold = 750;

        if (scrollY > threshold && !showHeaderTabs) {
          setShowHeaderTabs(true);
        } else if (scrollY <= threshold && showHeaderTabs) {
          setShowHeaderTabs(false);
        }

        lastScrollY.current = scrollY;
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [showHeaderTabs]);

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
    return () => {
      preloadLinks.forEach((link) => link.remove());
    };
  }, [images]);

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
      { id: "gallery", label: "Gallery", icon: Camera, show: images.length > 0 },
      { id: "packages", label: "Packages", icon: Gift, show: vendor?.packages?.length > 0 },
      { id: "reviews", label: "Reviews", icon: MessageCircle },
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

  const goToImage = useCallback(
    (index, direction = null) => {
      if (images.length <= 1) return;
      const newDirection = direction !== null ? direction : index > currentImageIndex ? 1 : -1;
      setSlideDirection(newDirection);
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
    // Clear any existing timer
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    // Don't autoplay if paused or only one image
    if (isPaused || images.length <= 1) return;

    // Set new timer
    autoplayTimerRef.current = setTimeout(() => {
      // Double-check conditions before advancing
      if (!isPaused && images.length > 1) {
        nextImage();
      }
    }, AUTOPLAY_DELAY);

    // Cleanup
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [currentImageIndex, isPaused, images.length, nextImage]);

  const togglePlayPause = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPaused((prev) => !prev);
  }, []);
  const handleIndicatorSelect = useCallback(
    (index) => {
      goToImage(index);
    },
    [goToImage],
  );

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    dragStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!isDragging.current) return;
      if (e.changedTouches.length !== 1) {
        isDragging.current = false;
        return;
      }

      const diff = dragStartX.current - e.changedTouches[0].clientX;
      const threshold = 50;

      if (Math.abs(diff) > threshold && images.length > 1) {
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }

      isDragging.current = false;
      dragStartX.current = 0;
    },
    [nextImage, prevImage, images.length],
  );

  const scrollContainer = useCallback((ref, direction) => {
    if (ref.current)
      ref.current.scrollBy({
        left: direction === "left" ? -window.innerWidth * 0.7 : window.innerWidth * 0.7,
        behavior: "smooth",
      });
  }, []);

  const handleShare = useCallback(
    (platform) => {
      const url = window.location.href;
      const text = `Check out ${vendor?.name} on PlanWAB!`;
      const shareUrls = {
        copy: () => navigator.clipboard.writeText(url),
        facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`),
        twitter: () =>
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          ),
        whatsapp: () => window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`),
      };
      shareUrls[platform]?.();
      setShowShareModal(false);
      if (platform === "copy") toast.success("Link copied to clipboard!");
    },
    [vendor?.name],
  );

  const handleBookingSubmit = useCallback(async () => {
    // Validation
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.date || !bookingForm.guests) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(bookingForm.phone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    // Validate email if provided
    if (bookingForm.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingForm.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    // Validate date is in the future
    const selectedDate = new Date(bookingForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Event date must be in the future");
      return;
    }

    // Validate guests
    if (bookingForm.guests < 1) {
      toast.error("Number of guests must be at least 1");
      return;
    }

    try {
      setIsSubmittingBooking(true);

      const response = await fetch("/api/vendor/requests/detail-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId: vendor._id,
          name: bookingForm.name,
          phone: bookingForm.phone,
          email: bookingForm.email || null,
          date: bookingForm.date,
          guests: parseInt(bookingForm.guests),
          eventType: bookingForm.eventType || null,
          budget: bookingForm.budget || null,
          timeSlot: bookingForm.timeSlot || null,
          notes: bookingForm.notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send booking request");
      }

      toast.success(data.message || "Booking request sent successfully!");

      // Reset form and close sheet
      setBookingForm({
        name: "",
        phone: "",
        email: "",
        date: "",
        guests: "",
        eventType: "",
        budget: "",
        timeSlot: "",
        notes: "",
      });

      setShowBookingSheet(false);
    } catch (error) {
      console.error("Booking request error:", error);
      toast.error(error.message || "Failed to send booking request. Please try again.");
    } finally {
      setIsSubmittingBooking(false);
    }
  }, [bookingForm, vendor._id]);

  const handleReviewSubmit = async () => {
    if (!isAuthLoaded) return;
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write your experience");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/vendor/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          text: reviewText,
          title: "Vendor Review",
          eventType: bookingForm.eventType || "Other",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post review");
      toast.success("Review posted successfully!");
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewText("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const openImageModal = useCallback((index) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  }, []);

  const handleTabClick = useCallback(
    (tabId) => {
      setActiveTab(tabId);

      // Use double RAF for smooth render-then-scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const headerHeight = 49;
          const buffer = 10;

          if (showHeaderTabs) {
            // When header tabs are visible, scroll to content section
            if (contentSectionRef.current) {
              const contentTop = contentSectionRef.current.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: contentTop - headerHeight - buffer,
                behavior: "smooth",
              });
            }
          } else {
            // When main tabs are visible, scroll to them
            if (tabsRef.current) {
              const tabsTop = tabsRef.current.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: tabsTop - headerHeight - buffer,
                behavior: "smooth",
              });
            }
          }
        });
      });
    },
    [showHeaderTabs],
  );

  // Only show skeleton if vendor is somehow null (fallback)
  if (!vendor) return <DetailsPageSkeleton />;
  if (error || !vendor)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-500 gap-3 px-4">
        <Info size={40} className="text-gray-300" />
        <p className="text-center text-sm">Vendor not found or error loading data.</p>
        <button
          onClick={() => router.back()}
          className="px-5 py-2 bg-blue-600 text-white rounded-full font-bold text-sm"
        >
          Go Back
        </button>
      </div>
    );

  const displayPrice =
    vendor.perDayPrice?.min?.toLocaleString("en-IN") || vendor.basePrice?.toLocaleString("en-IN") || "N/A";
  const categoryInfo = CATEGORY_CONFIG[vendor.category] || { label: vendor.category, icon: FileText, color: "gray" };

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-white dark:bg-black font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden pb-0"
    >
      <ScrollProgressBar />

      {/* STICKY HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 rounded-b-2xl transition-all duration-300">
        <div className="flex items-center justify-between px-3 py-1">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              className="p-1.5 -ml-1 rounded-full active:bg-gray-100 dark:active:bg-gray-800 flex-shrink-0"
            >
              <ArrowLeft size={22} className="text-gray-700 dark:text-gray-200" />
            </motion.button>

            {/* Compact Vendor Name - Shows only when tabs are in header */}
            <AnimatePresence mode="wait">
              {showHeaderTabs && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{vendor.name}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-1 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleToggleBookmark}
              disabled={statusLoading || bookmarkingLoading}
              className={`p-1.5 rounded-full transition-all relative ${
                isBookmarked
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-500"
                  : "active:bg-gray-100 dark:active:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {statusLoading || bookmarkingLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Bookmark size={20} className={isBookmarked ? "fill-current" : ""} />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleToggleLike}
              disabled={statusLoading || likingLoading}
              className={`p-1.5 rounded-full transition-all relative ${
                isLiked
                  ? "bg-rose-50 dark:bg-rose-900/30 text-rose-500"
                  : "active:bg-gray-100 dark:active:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {statusLoading || likingLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart size={20} className={isLiked ? "fill-current" : ""} />
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowShareModal(true)}
              className="p-1.5 rounded-full active:bg-gray-100 dark:active:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              <Share2 size={20} />
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation in Header - Shows on scroll */}
        <AnimatePresence mode="wait">
          {showHeaderTabs && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
                height: { duration: 0.3 },
                opacity: { duration: 0.2 },
              }}
              className="overflow-hidden border-t border-gray-100 dark:border-gray-800/50"
            >
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-3 py-2 scroll-smooth">
                {TAB_CONFIG.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: index * 0.03,
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    onClick={() => handleTabClick(tab.id)}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon size={11} />
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Progress Indicator */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-0.5 bg-gradient-to-r from-blue-600 via-purple-500 to-amber-500 origin-left"
                style={{
                  width: `${((TAB_CONFIG.findIndex((t) => t.id === activeTab) + 1) / TAB_CONFIG.length) * 100}%`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PARALLAX IMAGE CAROUSEL */}
      <motion.div
        ref={carouselRef}
        className="fixed top-0 left-0 right-0 w-full h-[60vh] bg-white z-0"
        style={{
          y: carouselY,
          scale: carouselScale,
          opacity: carouselOpacity,
        }}
      >
        <div className="relative w-full h-full" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none -z-10">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" loading="eager" decoding="async" />
            ))}
          </div>
          <AnimatePresence initial={false} custom={slideDirection} mode="wait">
            <motion.div
              key={currentImageIndex}
              custom={slideDirection}
              variants={slideVariants}
              initial={currentImageIndex === 0 && slideDirection === 0 ? false : "enter"}
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 35 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-black"
            >
              <SmartMedia
                src={images[currentImageIndex]}
                type="image"
                priority={currentImageIndex === 0}
                sizes="100vw"
                quality={100}
                useSkeleton={currentImageIndex !== 0}
                unoptimized={true}
                preload="eager"
                fetchPriority="high"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center center" }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Top Tags */}
          <div className="absolute top-14 left-3 flex flex-wrap gap-1.5 z-10">
            {vendor.isVerified && (
              <span className="px-2 py-1 bg-green-500/90 backdrop-blur-xl rounded-full text-white text-[10px] font-bold flex items-center gap-0.5 shadow-lg">
                <Verified size={10} />
                Verified
              </span>
            )}
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-xl rounded-full text-white text-[10px] font-bold flex items-center gap-0.5 shadow-lg">
              <Sparkles size={10} />
              Featured
            </span>
          </div>

          {/* Play/Pause Button */}
          <div className="absolute top-14 right-3 z-10">
            <motion.button
              whileTap={{ scale: 0.85 }}
              animate={{
                backgroundColor: isPaused ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)",
                borderColor: isPaused ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)",
              }}
              transition={{ duration: 0.15 }}
              onClick={togglePlayPause}
              className="p-2.5 rounded-full text-white shadow-lg backdrop-blur-md border"
            >
              <motion.div
                key={isPaused ? "play" : "pause"}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
              </motion.div>
            </motion.button>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full text-white z-20 bg-black/30 backdrop-blur-md active:bg-black/50 border border-white/10 shadow-xl"
              >
                <ChevronLeft size={22} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full text-white z-20 bg-black/30 backdrop-blur-md active:bg-black/50 border border-white/10 shadow-xl"
              >
                <ChevronRight size={22} />
              </motion.button>
            </>
          )}

          {/* Progress Indicator */}
          {images.length > 1 && (
            <ProgressIndicator
              total={images.length}
              currentIndex={currentImageIndex}
              duration={AUTOPLAY_DELAY}
              isPaused={isPaused}
              onSelect={handleIndicatorSelect}
            />
          )}

          {/* View All Photos Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setModalImageIndex(0);
              setShowImageModal(true);
            }}
            className="absolute bottom-45 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-xl rounded-full text-white text-[10px] font-bold flex items-center gap-1.5 border border-white/20 z-20 shadow-xl"
          >
            <ImageIcon size={12} />
            {images.length} Photos
          </motion.button>
        </div>
      </motion.div>

      <div className="h-[50vh]" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 bg-white dark:bg-black min-h-screen rounded-t-4xl">
        {/* VENDOR INFO CARD */}
        <div className="bg-white dark:bg-gray-900 rounded-t-[2rem] px-4 pt-5 pb-4 shadow-2xl -mt-6 relative">
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
          <div className="flex justify-center gap-3 mb-2 items-stretch">
            <Link
              href={`/vendor/${vendor.category}/${vendor._id}/profile`}
              className="group block relative rounded-full border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-green-500 to-green-800 shadow-md">
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
                <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md border border-gray-100 dark:border-gray-700 text-violet-600">
                  <Eye size={10} />
                </div>
              </div>
            </Link>
            <div className="flex flex-col items-start justify-center flex-1 min-h-full min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h1 className="text-lg font-black text-gray-900 dark:text-white leading-tight w-[68vw]">
                  {vendor.name}
                </h1>
                {vendor.isVerified && <Verified size={16} className="text-blue-500 fill-blue-500 shrink-0" />}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-0.5 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-full">
                  <Star size={11} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-yellow-700 dark:text-yellow-400 text-[11px]">
                    {vendor.rating || 0}
                  </span>
                  <span className="text-yellow-600/70 text-[10px]">({vendor.reviews || 0})</span>
                </div>
                <div className="flex items-center gap-0.5 text-gray-500 text-[11px]">
                  <MapPin size={11} />
                  <span className="font-medium">{vendor.address?.city || "India"}</span>
                </div>
                <span
                  className={`px-1.5 py-0.5 bg-${categoryInfo.color}-50 dark:bg-${categoryInfo.color}-900/20 text-${categoryInfo.color}-600 dark:text-${categoryInfo.color}-400 text-[10px] font-bold rounded-full capitalize flex items-center gap-0.5`}
                >
                  <categoryInfo.icon size={10} />
                  {categoryInfo.label}
                </span>
                {vendor.availabilityStatus && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      vendor.availabilityStatus === "Available"
                        ? "bg-green-100 text-green-700"
                        : vendor.availabilityStatus === "Busy"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vendor.availabilityStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 py-3 border-t border-b border-gray-100 dark:border-gray-800">
            {highlights.map((item, idx) => (
              <motion.div key={idx} whileHover={{ y: -2 }} className="text-center">
                <div className={`w-9 h-9 mx-auto mb-0.5 ${item.bg} rounded-xl flex items-center justify-center`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <p className="font-bold text-[11px] text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-[8px] text-gray-500 uppercase font-bold">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {(vendor.repeatCustomerRate || vendor.responseRate) && (
            <div className="grid grid-cols-2 gap-2 py-3 border-b border-gray-100 dark:border-gray-800">
              {vendor.repeatCustomerRate && (
                <div className="text-center p-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                  <p className="text-[10px] text-gray-500">Repeat Customers</p>
                  <p className="font-bold text-sm text-green-700 dark:text-green-400">{vendor.repeatCustomerRate}</p>
                </div>
              )}
              {vendor.responseRate && (
                <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                  <p className="text-[10px] text-gray-500">Response Rate</p>
                  <p className="font-bold text-sm text-blue-700 dark:text-blue-400">{vendor.responseRate}</p>
                </div>
              )}
            </div>
          )}

          {/* CTA BUTTONS */}
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (canContinue) {
                  window.open(`tel:${vendor.phoneNo}`);
                } else {
                  setIsLeadModalOpen(true);
                  setLeadModalActionType("revealPhone");
                }
              }}
              className="py-2.5 bg-green-500 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 text-white shadow-lg shadow-green-500/20"
            >
              <Phone size={16} />
              <span className="text-[9px]">Call</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (canContinue) {
                  window.open(`https://wa.me/${vendor.whatsappNo || vendor.phoneNo}`);
                } else {
                  setIsLeadModalOpen(true);
                  setLeadModalActionType("revealWhatsapp");
                }
              }}
              className="py-2.5 bg-emerald-500 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 text-white shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle size={16} />
              <span className="text-[9px]">WhatsApp</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowContactSheet(true)}
              className="py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5"
            >
              <Mail size={16} />
              <span className="text-[9px]">Contact</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBookingSheet(true)}
              className="py-2.5 bg-blue-600 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-blue-500/30"
            >
              <Calendar size={16} />
              <span className="text-[9px]">Book</span>
            </motion.button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <AnimatePresence mode="wait">
          {!showHeaderTabs && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="sticky top-[49px] z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-y border-gray-200 dark:border-gray-800"
            >
              <div ref={tabsRef} className="flex gap-1.5 overflow-x-auto no-scrollbar px-3 py-2">
                {TAB_CONFIG.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB CONTENT */}
        <div
          ref={contentSectionRef}
          className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 px-4 py-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-5"
            >
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-5">
                  {/* 1. Short Description */}
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

                  {/* 2. Pricing Details */}
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
                        {/* Base Price */}
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

                        {/* Per Day Price Range */}
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
                                  <span className="font-bold text-[13px] text-slate-400 dark:text-slate-500">-</span>
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

                  {/* 3. Category Specific Highlights */}
                  <CategoryHighlights vendor={vendor} />

                  {/* 4. Event Types Supported */}
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

                  {/* 5. Operating Hours - Collapsed */}
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

                  {/* 6. Amenities */}
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

                  {/* 7. Why Choose Us */}
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

                  {/* 8. Special Offers - Collapsed */}
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

                  {/* 9. About Vendor - Full Description */}
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
                        className={`relative overflow-hidden transition-all duration-500 ease-out ${
                          showFullDescription ? "max-h-[2000px]" : "max-h-[150px]"
                        }`}
                      >
                        <p className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {vendor.description}
                        </p>
                        {!showFullDescription && (
                          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent pointer-events-none" />
                        )}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="mt-5 text-slate-700 dark:text-slate-300 font-semibold text-[12px] flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 px-5 py-3 rounded-xl hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700/50 transition-all duration-200 shadow-sm border border-slate-200 dark:border-slate-700"
                      >
                        {showFullDescription ? "Show Less" : "Read Full Story"}
                        <motion.div animate={{ rotate: showFullDescription ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={15} />
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* 10. Portfolio Album Section */}
                  {images.length > 0 && (
                    <PortfolioAlbumSection images={images} onImageClick={openImageModal} vendorName={vendor.name} />
                  )}

                  {/* 11. Social Links */}
                  <SocialLinksSection socialLinks={vendor.socialLinks} />

                  {/* 12. Vendor Profile Link */}
                  <motion.div variants={fadeInUp}>
                    <Link
                      href={`/vendor/${vendor.category}/${vendor._id}/profile`}
                      className="group block relative bg-gradient-to-br from-indigo-500/80 via-purple-500/80 to-blue-600/70 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:border-indigo-300/50 dark:hover:border-indigo-500/30 transition-all duration-300 hover:scale-[1.01] overflow-hidden"
                    >
                      {/* Subtle gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300 rounded-2xl" />

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Profile Picture or Fallback Icon */}
                          <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-indigo-400 dark:group-hover:ring-indigo-500 transition-all duration-300">
                              <SmartMedia
                                src={vendor?.defaultImage || vendor?.images?.[0] || "/placeholder-profile.jpg"}
                                type="image"
                                alt={`${vendor.name} Profile Picture`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Status indicator dot */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                          </div>

                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[15px] text-white dark:text-slate-100 mb-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                              View Vendor Profile
                            </p>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium truncate">
                              {vendor?.vendorProfile?.tagline ||
                                (Array.isArray(vendor.vendorProfile) ? vendor?.vendorProfile[0]?.tagline : "") ||
                                "Bio, social stats & featured work"}
                            </p>
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <ArrowRight
                          size={20}
                          className="flex-shrink-0 text-white dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300"
                        />
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              )}

              {/* CATEGORY-SPECIFIC TAB */}
              {activeTab === "category" && <CategorySpecificSection vendor={vendor} formatPrice={formatPrice} />}

              {/* SERVICES & AWARDS TAB */}
              {activeTab === "services" && (
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
                        {vendor.awards.map((award, i) => (
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
                              <span className="font-medium text-[11px] text-slate-700 dark:text-slate-300">{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CollapsibleSection>
                  )}
                </div>
              )}

              {/* GALLERY TAB */}
              {activeTab === "gallery" && (
                <div className="space-y-5">
                  {images.length > 0 ? (
                    <>
                      {/* Image Count Header */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center">
                              <ImageIcon size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100">
                                Photo Gallery
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {images.length} photos available
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {images.map((img, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.03, duration: 0.3 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => openImageModal(idx)}
                            className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
                          >
                            <SmartMedia
                              src={img}
                              type="image"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              style={{ objectPosition: "center center" }}
                              loaderImage="/GlowLoadingGif.gif"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <span className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                                  Photo {idx + 1}
                                </span>
                                <div className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                  <ZoomIn size={16} className="text-slate-800" />
                                </div>
                              </div>
                            </div>

                            {/* Top Badge for first image */}
                            {idx === 0 && (
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                                <Star size={10} className="fill-white" />
                                Featured
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                        <ImageIcon size={36} className="text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                        No images available
                      </p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                        The vendor hasn't uploaded any gallery images yet
                      </p>
                    </div>
                  )}

                  {/* Video Section */}
                  {vendor.videoUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                    >
                      <div className="flex items-center gap-3.5 mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 flex items-center justify-center shadow-inner">
                          <Video size={20} className="text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            Video Showcase
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                            Watch our work in action
                          </p>
                        </div>
                      </div>
                      <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
                        <iframe
                          src={vendor.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                          className="w-full h-full"
                          allowFullScreen
                          title="Vendor Video"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* PACKAGES TAB */}
              {activeTab === "packages" && (
                <div className="space-y-5">
                  {vendor.packages?.length > 0 ? (
                    <>
                      {vendor.packages.map((pkg, i) => (
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
                      ))}
                    </>
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

              {/* REVIEWS TAB */}
              {activeTab === "reviews" && <ReviewSection vendorId={id} vendorName={vendor.name} />}

              {/* Insights TAB */}
              {activeTab === "insights" && (
                <div className="space-y-3.5">
                  {/* 3. Highlights & Pros */}
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

                  {/* 4. Performance Stats */}
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

              {/* FAQS TAB */}
              {activeTab === "faqs" && (
                <div className="space-y-3.5">
                  {vendor.faqs?.length > 0 ? (
                    vendor.faqs.map((faq, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 dark:border-slate-800/60"
                      >
                        <motion.button
                          onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                          className="w-full p-5 flex items-start justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-200"
                          whileTap={{ scale: 0.995 }}
                        >
                          <div className="flex items-start gap-4 flex-1 pr-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center shrink-0 shadow-sm">
                              <span className="text-blue-600 dark:text-blue-400 font-bold text-[13px]">Q</span>
                            </div>
                            <span className="font-bold text-[13px] text-slate-800 dark:text-slate-100 leading-relaxed pt-1.5">
                              {faq.question}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedFaq === idx ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0"
                          >
                            <ChevronDown size={20} className="text-slate-400 dark:text-slate-500 mt-1.5" />
                          </motion.div>
                        </motion.button>
                        <AnimatePresence>
                          {expandedFaq === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="overflow-hidden"
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

              {/* POLICIES TAB */}
              {activeTab === "policies" && (
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

              {/* LOCATION TAB */}
              {activeTab === "location" && (
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
                            <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed ml-13">
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

        {/* 2. Pricing Details */}
        {(vendor.basePrice || vendor.perDayPrice?.min) && activeTab !== "overview" && (
          <motion.div
            variants={fadeInUp}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 mx-4 mb-3"
          >
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 flex items-center justify-center shadow-inner">
                <IndianRupee size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">Pricing</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Transparent pricing options
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Base Price */}
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
                        per {vendor.priceUnit || "day"}
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

              {/* Per Day Price Range */}
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
                        <span className="font-bold text-[13px] text-slate-400 dark:text-slate-500">-</span>
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

        {/* 9. Portfolio Album Section */}
        {images.length > 0 && activeTab !== "overview" && activeTab !== "gallery" && (
          <PortfolioAlbumSection images={images} onImageClick={openImageModal} vendorName={vendor.name} />
        )}

        {/* Vendor Profile Link */}
        {activeTab !== "overview" && (
          <motion.div variants={fadeInUp}>
            <Link
              href={`/vendor/${vendor.category}/${vendor._id}/profile`}
              className="group block relative bg-gradient-to-br from-indigo-500/80 via-purple-500/80 to-blue-600/70 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:border-indigo-300/50 dark:hover:border-indigo-500/30 transition-all duration-300 hover:scale-[1.01] overflow-hidden mt-2 mb-3 mx-2"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300 rounded-2xl" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Profile Picture or Fallback Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-indigo-400 dark:group-hover:ring-indigo-500 transition-all duration-300">
                      <SmartMedia
                        src={vendor?.defaultImage || vendor?.images?.[0] || "/placeholder-profile.jpg"}
                        type="image"
                        alt={`${vendor.name} Profile Picture`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Status indicator dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-white dark:text-slate-100 mb-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      View Vendor Profile
                    </p>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium truncate">
                      {vendor?.vendorProfile?.tagline ||
                        (Array.isArray(vendor.vendorProfile) ? vendor?.vendorProfile[0]?.tagline : "") ||
                        "Bio, social stats & featured work"}
                    </p>
                  </div>
                </div>

                {/* Arrow Icon */}
                <ArrowRight
                  size={20}
                  className="flex-shrink-0 text-white dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
            </Link>
          </motion.div>
        )}

        {/* SIMILAR VENDORS */}
        {similarVendors.length > 0 && (
          <div className="bg-white dark:bg-gray-900 px-3 py-5 mt-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Similar Vendors</h2>
                <p className="text-[10px] text-gray-500">You might also like</p>
              </div>
              <div className="flex gap-1.5">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scrollContainer(similarRef, "left")}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
                >
                  <ChevronLeft size={16} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scrollContainer(similarRef, "right")}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
                >
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
            <div ref={similarRef} className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-2">
              {similarVendors.map((item) => (
                <VendorCard key={item._id} item={item} type="horizontal" />
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED VENDORS */}
        {recommendedVendors.length > 0 && (
          <div className="bg-gray-50 dark:bg-black px-3 py-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recommended For You</h2>
                <p className="text-[10px] text-gray-500">Based on your preferences</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                disable={true || recommendedVendors.length <= 4}
                className="text-blue-600 text-[11px] font-bold flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg disabled:opacity-20"
              >
                View All
                <ArrowRight size={12} />
              </motion.button>
            </div>
            <div className="flex flex-col gap-3">
              {recommendedVendors.slice(0, 4).map((item) => (
                <VendorCard key={item._id} item={item} type="vertical" />
              ))}
            </div>
          </div>
        )}

        {/* QUICK CONTACT */}
        <div className="bg-white dark:bg-gray-900 px-3 py-5">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Quick Contact</h2>
          <div className="grid grid-cols-3 gap-3">
            <motion.a
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              href={`tel:${vendor.phoneNo}`}
              className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 p-4 rounded-2xl text-center border border-green-200 dark:border-green-800"
            >
              <Phone size={24} className="text-green-600 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-green-700 dark:text-green-300">Call Now</p>
            </motion.a>
            <motion.a
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/${vendor.whatsappNo || vendor.phoneNo}`}
              className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/20 p-4 rounded-2xl text-center border border-emerald-200 dark:border-emerald-800"
            >
              <MessageCircle size={24} className="text-emerald-600 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">WhatsApp</p>
            </motion.a>
            <motion.a
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${vendor.email}`}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/20 p-4 rounded-2xl text-center border border-blue-200 dark:border-blue-800"
            >
              <Mail size={24} className="text-blue-600 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300">Email</p>
            </motion.a>
          </div>
        </div>

        {/* HELP FOOTER */}
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black px-3 py-8 text-center">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mx-auto mb-3 flex items-center justify-center">
            <Headphones size={28} className="text-blue-500" />
          </div>
          <p className="text-[11px] text-gray-500 mb-1">Need help with your booking?</p>
          <p className="font-black text-xl text-gray-900 dark:text-white">+91 6267430959</p>
          <p className="text-[10px] text-gray-400 mt-1">18/7 Toll Free Support</p>
        </div>
      </div>

      {/* IMAGE GALLERY MODAL */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="flex justify-between items-center p-3 z-20">
              <span className="text-white font-mono text-[11px] bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {modalImageIndex + 1} / {images.length}
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setImageZoom((z) => Math.min(z + 0.5, 3))}
                  className="p-2 text-white/70 bg-white/10 rounded-full backdrop-blur-sm"
                >
                  <ZoomIn size={18} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setImageZoom(1)}
                  className="p-2 text-white/70 bg-white/10 rounded-full backdrop-blur-sm"
                >
                  <RotateCcw size={18} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowImageModal(false)}
                  className="p-2 text-white/70 bg-white/10 rounded-full backdrop-blur-sm"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                <motion.div
                  key={modalImageIndex}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="absolute w-full h-full flex items-center justify-center p-2"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={(e) => {
                    if (!isDragging.current) return;
                    const diff = dragStartX.current - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 50) {
                      if (diff > 0) {
                        setModalImageIndex((i) => (i + 1) % images.length);
                        setSlideDirection(1);
                      } else {
                        setModalImageIndex((i) => (i - 1 + images.length) % images.length);
                        setSlideDirection(-1);
                      }
                    }
                    isDragging.current = false;
                  }}
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
            </div>
            <div className="h-20 flex items-center justify-center gap-2 overflow-x-auto px-3 pb-4 no-scrollbar">
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setModalImageIndex(i);
                    setSlideDirection(i > modalImageIndex ? 1 : -1);
                  }}
                  className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    i === modalImageIndex ? "border-white scale-110" : "border-transparent opacity-50"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" loading="lazy" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={modalTransition}
              className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />
              <h3 className="text-base font-bold text-center mb-5 dark:text-white">Share {vendor.name}</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    id: "whatsapp",
                    label: "WhatsApp",
                    icon: Send,
                    color: "text-green-500",
                    bg: "bg-green-50 dark:bg-green-900/30",
                  },
                  {
                    id: "facebook",
                    label: "Facebook",
                    icon: Facebook,
                    color: "text-blue-600",
                    bg: "bg-blue-50 dark:bg-blue-900/30",
                  },
                  {
                    id: "twitter",
                    label: "Twitter",
                    icon: Twitter,
                    color: "text-sky-500",
                    bg: "bg-sky-50 dark:bg-sky-900/30",
                  },
                  {
                    id: "copy",
                    label: "Copy Link",
                    icon: Copy,
                    color: "text-gray-600",
                    bg: "bg-gray-100 dark:bg-gray-800",
                  },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare(item.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg} ${item.color} shadow-sm`}
                    >
                      <item.icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTACT SHEET */}
      <AnimatePresence>
        {showContactSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowContactSheet(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={modalTransition}
              className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />
              <h3 className="text-base font-bold mb-5 dark:text-white">Contact Information</h3>
              <div className="space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (canContinue) {
                      window.open(`tel:${vendor.phoneNo}`);
                    } else {
                      setIsLeadModalOpen(true);
                      setLeadModalActionType("revealPhone");
                    }
                  }}
                  className="flex w-full items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                    <Phone size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 uppercase" style={{ fontWeight: canContinue ? 500 : 900 }}>
                      Phone
                    </p>
                    {canContinue && (
                      <p className="font-bold text-[13px] text-gray-900 dark:text-white">{vendor.phoneNo}</p>
                    )}
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </motion.button>
                {vendor.whatsappNo && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (canContinue) {
                        window.open(`https://wa.me/${vendor.whatsappNo}`);
                      } else {
                        setIsLeadModalOpen(true);
                        setLeadModalActionType("revealWhatsapp");
                      }
                    }}
                    className="flex w-full items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl"
                  >
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                      <MessageCircle size={22} />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-[10px] text-gray-500 uppercase"
                        style={{ fontWeight: canContinue ? 500 : 900 }}
                      >
                        WhatsApp
                      </p>
                      {canContinue && (
                        <p className="font-bold text-[13px] text-gray-900 dark:text-white">{vendor.whatsappNo}</p>
                      )}
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (canContinue) {
                      window.open(`mailto:${vendor.email}`);
                    } else {
                      setIsLeadModalOpen(true);
                      setLeadModalActionType("revealEmail");
                    }
                  }}
                  className="flex w-full items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                    <Mail size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-500 uppercase" style={{ fontWeight: canContinue ? 500 : 900 }}>
                      Email
                    </p>
                    {canContinue && (
                      <p className="font-bold text-[13px] text-gray-900 dark:text-white truncate">{vendor.email}</p>
                    )}
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </motion.button>
                {vendor.contactPerson?.firstName && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                      <User size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Contact Person</p>
                      <p className="font-bold text-[13px] text-gray-900 dark:text-white">
                        {vendor.contactPerson.firstName} {vendor.contactPerson.lastName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOOKING SHEET */}
      <AnimatePresence>
        {showBookingSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => !isSubmittingBooking && setShowBookingSheet(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={modalTransition}
              className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Loading Overlay */}
              {isSubmittingBooking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-t-3xl z-10 flex flex-col items-center justify-center"
                >
                  <div className="relative">
                    {/* Spinning Circle */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full"
                    />
                    {/* Inner Pulse */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 m-auto w-8 h-8 bg-blue-500 rounded-full"
                    />
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Sending booking request...
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Please wait
                  </motion.p>
                </motion.div>
              )}

              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />
              <h3 className="text-lg font-bold mb-1 dark:text-white">Request Booking</h3>
              <p className="text-[11px] text-gray-500 mb-5">We'll respond within 2 hours</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="Your name"
                    disabled={isSubmittingBooking}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[12px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      placeholder="Phone number"
                      disabled={isSubmittingBooking}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[12px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      placeholder="Email"
                      disabled={isSubmittingBooking}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[12px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      disabled={isSubmittingBooking}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[12px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Guests *
                    </label>
                    <input
                      type="number"
                      value={bookingForm.guests}
                      onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
                      placeholder="Number"
                      disabled={isSubmittingBooking}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[12px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Event Type
                  </label>
                  <select
                    value={bookingForm.eventType}
                    onChange={(e) => setBookingForm({ ...bookingForm, eventType: e.target.value })}
                    disabled={isSubmittingBooking}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[12px] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select type</option>
                    {(vendor.eventTypes?.length > 0
                      ? vendor.eventTypes
                      : ["Wedding", "Corporate", "Birthday", "Other"]
                    ).map((type, i) => (
                      <option key={i} value={type.toLowerCase()}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Any specific requirements..."
                    disabled={isSubmittingBooking}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[12px] text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <motion.button
                  whileTap={!isSubmittingBooking ? { scale: 0.98 } : {}}
                  onClick={handleBookingSubmit}
                  disabled={isSubmittingBooking}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-[13px] shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmittingBooking ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Booking Request
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={modalTransition}
              className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />
              <h3 className="text-base font-bold mb-4 dark:text-white text-center">Write a Review</h3>
              <div className="mb-5">
                <p className="text-[11px] text-gray-500 mb-3 text-center">How was your experience?</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        size={36}
                        className={`transition-all ${
                          star <= reviewRating
                            ? "fill-yellow-500 text-yellow-500 drop-shadow-lg"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with others..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[12px] text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleReviewSubmit}
                disabled={reviewRating === 0 || isSubmittingReview}
                className={`w-full py-4 rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2 ${
                  reviewRating > 0 && !isSubmittingReview
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmittingReview ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Review
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIXED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-100/50 dark:border-gray-800/50 pb-[calc(env(safe-area-inset-bottom))] pt-0 px-0 shadow-[0_-4px_30px_rgba(0,0,0,0.1)] rounded-t-3xl will-change-transform">
        <div className="px-4 py-3 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleInviteTeam}
            className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus size={18} className="text-blue-600 dark:text-blue-400" />
            Invite Team
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCartToggle}
            className={`flex-[1.5] py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all duration-300 ${
              isInCart
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/30"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isInCart ? (
                <motion.div
                  key="added"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  <span>View Cart</span>
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {activeDrawer === "cart" && (
        <CartDrawer
          onClose={() => setActiveDrawer(null)}
          items={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          showToast={showToast}
        />
      )}

      <LeadCaptureModalMobile
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
    </main>
  );
};

export default VendorDetailsPageWrapper;
