"use client";

import React, { useState, useEffect, useRef, useMemo, useTransition, memo, useCallback } from "react";
import {
  Home,
  ChartBarStacked,
  Calendar,
  User,
  ShoppingBag,
  Plus,
  X,
  Star,
  Trash2,
  ArrowRight,
  Loader2,
  Search,
  Filter,
  Heart,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Minus,
  Tag,
  Percent,
  Shield,
  Sparkles,
  ChevronRight,
  ChevronDown,
  BadgeCheck,
  Gift,
  Info,
  Phone,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Users,
  Camera,
  Building,
  Utensils,
  Music,
  Palette,
  Scissors,
  Crown,
  Flower2,
  RefreshCw,
  Copy,
  Check,
  Lock,
  CreditCard,
  Wallet,
  Calendar as CalendarIcon,
  ImageIcon,
  MoreHorizontal,
  SlidersHorizontal,
  Grid3X3,
  List,
  Zap,
  Award,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "../../GlobalState/CartDataStore";
import { set } from "mongoose";
import { act } from "react";
import { useNavbarVisibilityStore } from "../../GlobalState/navbarVisibilityStore";

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
  gold: "#E5B80B",
};

const SPRING_CONFIG = {
  stiff: { type: "spring", stiffness: 400, damping: 30 },
  gentle: { type: "spring", stiffness: 200, damping: 25 },
  bouncy: { type: "spring", stiffness: 300, damping: 20 },
};

// --- MOCK DATA (Moved Outside) ---
const DRAWER_CATEGORIES = [
  { id: "all", label: "All", icon: Grid3X3, color: "#6b7280" },
  { id: "venues", label: "Venues", icon: Building, color: "#8b5cf6" },
  { id: "catering", label: "Catering", icon: Utensils, color: "#f97316" },
  { id: "photographers", label: "Photo", icon: Camera, color: "#ec4899" },
  { id: "makeup", label: "Makeup", icon: Palette, color: "#f43f5e" },
  { id: "decor", label: "Decor", icon: Flower2, color: "#14b8a6" },
  { id: "djs", label: "Music", icon: Music, color: "#3b82f6" },
];

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

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const formatPrice = (price) => {
  if (isNaN(price) || price === 0) return "0";
  if (price >= 100000) return `${(price / 100000).toFixed(1)}L`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
  return price.toLocaleString("en-IN");
};

const formatFullPrice = (price) => {
  if (isNaN(price) || price === 0) return "0";
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

const getVendorImage = (vendor) => {
  const imgs = vendor.normalizedImages || (vendor.images || []).filter(Boolean);
  if (imgs.length > 0) return imgs[0];
  if (vendor.defaultImage) return vendor.defaultImage;
  return "/placeholder.jpg";
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// =============================================================================
// CUSTOM HOOKS
// =============================================================================

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50, success: [10, 50, 10] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

// -----------------------------------------------------------------------------
// Toast Component
// -----------------------------------------------------------------------------
const Toast = memo(({ message, type = "success", isNavbarVisible, onClose }) => {
  useEffect(() => {
    if (isNavbarVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isNavbarVisible, onClose]);

  const icons = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertCircle };
  const Icon = icons[type];
  const colors = { success: "bg-green-500", error: "bg-red-500", info: "bg-blue-500", warning: "bg-amber-500" };

  return (
    <AnimatePresence>
      {isNavbarVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-4 left-4 right-4 z-[200] ${colors[type]} text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3`}
        >
          <Icon size={20} />
          <span className="flex-1 font-medium text-sm">{message}</span>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
Toast.displayName = "Toast";

// -----------------------------------------------------------------------------
// Vendor Card for Explore Drawer
// -----------------------------------------------------------------------------
const VendorCard = memo(({ item, onAdd, isInCart, onToggleFavorite, isFavorite }) => {
  const haptic = useHapticFeedback();
  const price = getVendorPrice(item);
  const originalPrice = item.originalPrice || price;
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const img = getVendorImage(item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
    >
      {/* Image Section */}
      <div className="relative h-36">
        <img src={img} className="w-full h-full object-cover" alt={item.name} loading="lazy" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div className="flex gap-1.5">
            {item.tags?.includes("Popular") && (
              <div className="px-2 py-1 bg-amber-400 text-amber-900 text-[9px] font-bold uppercase rounded-md shadow-md flex items-center gap-1">
                <Sparkles size={10} /> Popular
              </div>
            )}
            {(item.isVerified || item.tags?.includes("Verified")) && (
              <div className="px-2 py-1 bg-blue-500 text-white text-[9px] font-bold uppercase rounded-md shadow-md flex items-center gap-1">
                <BadgeCheck size={10} /> Verified
              </div>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              haptic("medium");
              onToggleFavorite(item._id);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
          >
            <Heart size={16} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-600"} />
          </motion.button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-800">{item.rating?.toFixed(1) || "4.5"}</span>
            <span className="text-[10px] text-gray-500">({item.reviews || item.totalReviews || 0})</span>
          </div>
          {discount > 0 && (
            <div className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-md">{discount}% OFF</div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={11} className="text-gray-400 shrink-0" />
              <span className="text-xs text-gray-500 truncate">
                {item.address?.city || item.location || "Location"}
              </span>
              {(item.seating?.max || item.capacity) && (
                <>
                  <span className="text-gray-300">•</span>
                  <Users size={11} className="text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-500">{item.seating?.max || item.capacity} guests</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-1 mt-2 overflow-x-auto scrollbar-hide">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-md whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-blue-600">₹{formatFullPrice(price)}</span>
              {item.priceUnit && <span className="text-[10px] text-gray-400">/{item.priceUnit}</span>}
            </div>
            {originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">₹{formatFullPrice(originalPrice)}</span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              haptic("medium");
              onAdd(item);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 ${
              isInCart ? "bg-green-100 text-green-700 border border-green-200" : "bg-yellow-400 text-blue-900"
            }`}
          >
            {isInCart ? (
              <>
                <CheckCircle size={14} /> Added
              </>
            ) : (
              <>
                <Plus size={14} /> Add
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
VendorCard.displayName = "VendorCard";

// -----------------------------------------------------------------------------
// Cart Item Card
// -----------------------------------------------------------------------------
const CartItemCard = memo(({ item, onRemove, onUpdateQuantity }) => {
  const haptic = useHapticFeedback();
  const price = item.price || getVendorPrice(item);
  const originalPrice = item.originalPrice || price;
  const discount = originalPrice > price ? originalPrice - price : 0;
  const img = item.image || getVendorImage(item);

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
        {/* Image */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
          <img src={img} alt={item.name} className="w-full h-full object-cover" />
          {(item.isVerified || item.tags?.includes("Verified")) && (
            <div className="absolute top-1 left-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <BadgeCheck size={12} className="text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-semibold text-gray-700">{item.rating?.toFixed(1) || "4.5"}</span>
                  <span className="text-[10px] text-gray-400">({item.reviews || item.totalReviews || 0})</span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic("medium");
                  onRemove(item);
                }}
                className="p-2 bg-red-50 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
              </motion.button>
            </div>

            {/* Location & Category */}
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600 capitalize">
                {item.category}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <MapPin size={10} />
                {item.address?.city || item.location || "Location"}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between mt-2">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-blue-600">₹{formatFullPrice(price)}</span>
                {item.priceUnit && <span className="text-[10px] text-gray-400">/{item.priceUnit}</span>}
              </div>
              {discount > 0 && (
                <span className="text-[10px] font-medium text-green-600">Save ₹{formatFullPrice(discount)}</span>
              )}
            </div>

            {/* Quantity Control (if applicable) */}
            {item.priceUnit && (
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onUpdateQuantity(item._id, (item.quantity || 1) - 1)}
                  disabled={(item.quantity || 1) <= 1}
                  className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm disabled:opacity-50"
                >
                  <Minus size={14} className="text-gray-600" />
                </motion.button>
                <span className="text-sm font-bold text-gray-900 w-6 text-center">{item.quantity || 1}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onUpdateQuantity(item._id, (item.quantity || 1) + 1)}
                  className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm"
                >
                  <Plus size={14} className="text-gray-600" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
CartItemCard.displayName = "CartItemCard";

// -----------------------------------------------------------------------------
// Coupon Section
// -----------------------------------------------------------------------------
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

    // Simulate API call
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

// -----------------------------------------------------------------------------
// Price Breakdown
// -----------------------------------------------------------------------------
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

// =============================================================================
// ENHANCED EXPLORE DRAWER - NOW WITH DYNAMIC API DATA
// =============================================================================
const ExploreDrawer = memo(({ onClose, onAdd, cartItems, showToast, setActiveDrawer }) => {
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const haptic = useHapticFeedback();
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        limit: "20",
        sortBy:
          sortBy === "popular"
            ? "bookings"
            : sortBy === "rating"
            ? "rating"
            : sortBy === "price-low"
            ? "price-asc"
            : sortBy === "price-high"
            ? "price-desc"
            : "rating",
      });

      if (debouncedSearch) {
        queryParams.set("search", debouncedSearch);
      }

      if (activeCat !== "all") {
        queryParams.set("categories", activeCat);
      }

      try {
        const response = await fetch(`/api/vendor?${queryParams.toString()}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();

        if (result.success !== false && result.data && Array.isArray(result.data)) {
          const processedVendors = result.data.map((v) => ({
            ...v,
            // Normalize price for consistency
            price: getVendorPrice(v),
            originalPrice: v.originalPrice || getVendorPrice(v),
          }));
          setVendors(processedVendors);
        } else {
          setVendors([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load vendors. Please try again.");
        setVendors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [activeCat, debouncedSearch, sortBy]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]));
  }, []);

  const cartItemIds = useMemo(() => cartItems.map((item) => item._id), [cartItems]);

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0),
    [cartItems]
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
        className="fixed bottom-0 left-0 right-0 h-[80vh] bg-gray-50 z-[70] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-white px-4 pt-3 pb-3 shadow-sm z-10 sticky top-0 border-b border-gray-100">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-3" />

          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-xl font-black text-gray-900">Explore Vendors</h2>
              <p className="text-xs text-gray-500 font-medium">
                {isLoading ? "Loading..." : `${vendors.length} vendors found`}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendors, locations..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-300 rounded-full"
              >
                <X size={12} className="text-gray-600" />
              </motion.button>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {DRAWER_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCat === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic("light");
                    setActiveCat(cat.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive ? "text-white shadow-md" : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                  style={isActive ? { backgroundColor: cat.color } : {}}
                >
                  <Icon size={14} />
                  {cat.label}
                </motion.button>
              );
            })}
          </div>

          {/* Sort & Filter Row */}
          <div className="flex gap-2 mt-3">
            <div className="flex-1 relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  haptic("light");
                  setSortBy(e.target.value);
                }}
                className="w-full px-3 py-2 bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 appearance-none outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                haptic("light");
                setShowFilters(!showFilters);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                showFilters ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <SlidersHorizontal size={14} />
              Filters
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
              <p className="text-sm text-gray-500">Loading vendors...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle size={40} className="text-red-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Error</h3>
              <p className="text-sm text-gray-500">{error}</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCat(activeCat)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm"
              >
                Try Again
              </motion.button>
            </div>
          ) : vendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No vendors found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {vendors.map((item) => (
                  <VendorCard
                    key={item._id}
                    item={item}
                    onAdd={onAdd}
                    isInCart={cartItemIds.includes(item._id)}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.includes(item._id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
          <div className="h-24" />
        </div>

        {/* Cart Summary Footer */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{cartItems.length} items in cart</p>
                <p className="text-lg font-black text-blue-600">₹{formatFullPrice(cartTotal)}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDrawer("cart")}
                className="px-6 py-3 bg-yellow-400 text-blue-900 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                View Cart
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
});
ExploreDrawer.displayName = "ExploreDrawer";

// =============================================================================
// ENHANCED CART DRAWER - NOW SYNCED WITH GLOBAL STATE
// =============================================================================
const CartDrawer = memo(({ onClose, items, onRemove, onUpdateQuantity, onExplore, showToast }) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const haptic = useHapticFeedback();

  // Price calculations
  const priceDetails = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
    const originalTotal = items.reduce(
      (acc, item) => acc + (item.originalPrice || item.price || 0) * (item.quantity || 1),
      0
    );
    const vendorDiscount = originalTotal - subtotal;

    let couponDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === "percent") {
        couponDiscount = Math.min(
          Math.round((subtotal * appliedCoupon.discount) / 100),
          appliedCoupon.maxDiscount || Infinity
        );
      } else {
        couponDiscount = appliedCoupon.discount;
      }
    }

    const afterDiscount = subtotal - couponDiscount;
    const platformFee = Math.round(subtotal * 0.02);
    const taxes = Math.round(afterDiscount * 0.18);
    const grandTotal = afterDiscount + taxes + platformFee;

    return {
      subtotal,
      vendorDiscount,
      couponDiscount,
      platformFee,
      taxes,
      total: grandTotal,
    };
  }, [items, appliedCoupon]);

  const handleRemoveItem = useCallback(
    (item) => {
      haptic("medium");
      onRemove(item._id);
      showToast("Item removed from cart", "info");
    },
    [onRemove, haptic, showToast]
  );

  const handleApplyCoupon = useCallback((coupon) => {
    setAppliedCoupon(coupon);
  }, []);

  const handleRemoveCoupon = useCallback(() => {
    haptic("light");
    setAppliedCoupon(null);
    showToast("Coupon removed", "info");
  }, [haptic, showToast]);

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
        {/* Header */}
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onExplore}
              className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-xl flex items-center gap-1.5"
            >
              <Plus size={14} /> Add More
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
                <ShoppingBag size={40} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mb-4">Add vendors to start planning your event</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onExplore}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg"
              >
                Explore Vendors
              </motion.button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="mb-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemCard
                      key={item._id}
                      item={item}
                      onRemove={handleRemoveItem}
                      onUpdateQuantity={onUpdateQuantity}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Coupon Section */}
              <div className="mb-4">
                <CouponSection
                  appliedCoupon={appliedCoupon}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  subtotal={priceDetails.subtotal}
                  showToast={showToast}
                />
              </div>

              {/* Price Breakdown */}
              <PriceBreakdown
                subtotal={priceDetails.subtotal}
                vendorDiscount={priceDetails.vendorDiscount}
                couponDiscount={priceDetails.couponDiscount}
                taxes={priceDetails.taxes}
                platformFee={priceDetails.platformFee}
                total={priceDetails.total}
              />

              {/* Trust Badges */}
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

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-white p-4 pb-2 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Grand Total</p>
                <p className="text-2xl font-black text-blue-600">₹{formatFullPrice(priceDetails.total)}</p>
              </div>
              {(priceDetails.vendorDiscount > 0 || priceDetails.couponDiscount > 0) && (
                <div className="px-3 py-1.5 bg-green-100 rounded-xl">
                  <p className="text-xs font-bold text-green-700">
                    Save ₹{formatFullPrice(priceDetails.vendorDiscount + priceDetails.couponDiscount)}
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

// =============================================================================
// MAIN NAVBAR COMPONENT
// =============================================================================
const MobileNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // --- OPTIMIZATION 1: useTransition for Instant Feedback ---
  const [isPending, startTransition] = useTransition();
  const [pendingRoute, setPendingRoute] = useState(null);
  const { setIsNavbarVisible, isNavbarVisible } = useNavbarVisibilityStore();
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success", isNavbarVisible: false });

  const haptic = useHapticFeedback();

  // --- GLOBAL CART STATE ---
  const { cartItems, addToCart, removeFromCart, updateQuantity, getCartCount, openCartNavbar, setOpenCartNavbar } =
    useCartStore();
  const cartCount = getCartCount();

  // --- Toast Handlers ---
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, isNavbarVisible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isNavbarVisible: false }));
  }, []);

  // --- OPTIMIZATION 2: Throttled Scroll ---
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    if (Math.abs(diff) > 10) {
      if (diff > 0 && latest > 100) setIsNavbarVisible(false);
      else if (diff < 0) setIsNavbarVisible(true);
      lastScrollY.current = latest;
    }
  });

  useEffect(() => {
    if (activeDrawer === "cart" || activeDrawer === "explore") {
      setIsNavbarVisible(false);
    }
  }, [isNavbarVisible, activeDrawer]);

  const navItems = useMemo(
    () => [
      { id: "home", label: "Home", icon: Home, route: "/" },
      { id: "marketplace", label: "Marketplace", icon: ChartBarStacked, route: "/vendors/marketplace" },
      { id: "center_fab", type: "center" },
      { id: "ideas", label: "Ideas", icon: Lightbulb, route: "/ideas" },
      { id: "profile", label: "Profile", icon: User, route: "/user/profile" },
    ],
    []
  );

  useEffect(() => {
    if (openCartNavbar === "open") {
      setActiveDrawer("cart");
    }
  }, [openCartNavbar]);

  const isTabActive = (route) => {
    if (route === "/") return pathname === "/";
    return pathname?.startsWith(route);
  };

  // --- OPTIMIZATION 3: Instant Handler ---
  const handleTabChange = useCallback(
    (item) => {
      if (item.type === "center") {
        haptic("medium");
        setActiveDrawer(cartItems.length === 0 ? "explore" : "cart");
        return;
      }

      if (pathname === item.route) return;

      haptic("light");
      setPendingRoute(item.route);

      startTransition(() => {
        router.push(item.route);
      });
    },
    [pathname, cartItems.length, router, haptic]
  );

  // Reset pending state when path changes
  useEffect(() => {
    setPendingRoute(null);
  }, [pathname]);

  // --- CART HANDLERS USING GLOBAL STATE ---
  const handleAddToCart = useCallback(
    (item) => {
      const cartItem = {
        _id: item._id,
        name: item.name,
        category: item.category,
        price: item.price || getVendorPrice(item),
        image: getVendorImage(item),
        quantity: 1,
        address: item.address,
        rating: item.rating,
        reviews: item.reviews || item.totalReviews,
        tags: item.tags,
        isVerified: item.isVerified,
        originalPrice: item.originalPrice,
        priceUnit: item.priceUnit,
        location: item.address?.city || item.location,
      };

      const isAlreadyInCart = cartItems.some((i) => i._id === item._id);

      if (isAlreadyInCart) {
        removeFromCart(item._id);
        showToast(`${item.name} removed from cart`, "info");
      } else {
        addToCart(cartItem);
        showToast(`${item.name} added to cart`, "success");
      }
    },
    [cartItems, addToCart, removeFromCart, showToast]
  );

  const handleUpdateQuantity = useCallback(
    (id, quantity) => {
      updateQuantity(id, quantity);
    },
    [updateQuantity]
  );

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = activeDrawer ? "hidden" : "unset";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "unset";
      }
    };
  }, [activeDrawer]);

  return (
    <>
      {/* Toast Notification */}
      <Toast {...toast} onClose={hideToast} />

      {/* Main Navbar */}
      <motion.div
        animate={{ y: isNavbarVisible ? 0 : 120 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-blue-100/50 pb-[calc(env(safe-area-inset-bottom))] pt-0 px-0 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-2xl will-change-transform"
      >
        <div className="flex items-end justify-between max-w-md mx-auto pb-1 relative">
          {navItems.map((item) => {
            if (item.type === "center") {
              const hasItems = cartCount > 0;
              return (
                <div key={item.id} className="relative -top-1 flex justify-center w-full pointer-events-none z-50">
                  <motion.button
                    onClick={() => handleTabChange(item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="pointer-events-auto flex items-center justify-center focus:outline-none relative"
                  >
                    <motion.div
                      className="flex justify-center items-center w-16 h-14 rounded-full bg-white border-[4px] border-white shadow-[0_12px_24px_rgba(30,58,138,0.2)]"
                      animate={{
                        boxShadow: hasItems ? "0_12px_24px_rgba(229,184,11,0.3)" : "0_12px_24px_rgba(30,58,138,0.2)",
                      }}
                    >
                      <ShoppingBag
                        size={28}
                        className={`transition-colors duration-300 ${hasItems ? "text-blue-900" : "text-slate-400"}`}
                        strokeWidth={2.5}
                      />
                      <AnimatePresence>
                        {hasItems ? (
                          <motion.div
                            key="badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#E5B80B] flex items-center justify-center border-2 border-white shadow-sm"
                          >
                            <span className="text-[11px] font-black text-blue-900">{cartCount}</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="plus"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-sm"
                          >
                            <Plus size={14} strokeWidth={4} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.button>
                </div>
              );
            }

            const isActive = isTabActive(item.route);
            const isLoading = isPending && pendingRoute === item.route;

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item)}
                className="relative flex flex-col items-center justify-center w-full py-2 group focus:outline-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-bg"
                    className="absolute inset-0 bg-blue-50/80 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="relative p-1.3">
                  <motion.div animate={isActive ? { y: -3, scale: 1.1 } : { y: 0, scale: 1 }}>
                    {isLoading ? (
                      <Loader2 size={24} className="text-blue-600 animate-spin" />
                    ) : (
                      <item.icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={`transition-colors duration-300 ${isActive ? "text-blue-700" : "text-slate-400"}`}
                      />
                    )}
                  </motion.div>
                  {isActive && !isLoading && (
                    <motion.div
                      layoutId="active-dot"
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full ring-2 ring-white shadow-sm"
                    />
                  )}
                </div>

                <motion.span
                  animate={isActive ? { y: 0, opacity: 1, color: "#1d4ed8" } : { y: 2, opacity: 0.8, color: "#94a3b8" }}
                  className="text-[10px] font-bold tracking-wide"
                >
                  {item.label}
                </motion.span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Drawers */}
      <AnimatePresence>
        {activeDrawer === "explore" && (
          <ExploreDrawer
            onClose={() => {
              setActiveDrawer(null);
              setIsNavbarVisible(true);
            }}
            onAdd={handleAddToCart}
            cartItems={cartItems}
            showToast={showToast}
            setActiveDrawer={setActiveDrawer}
          />
        )}
        {activeDrawer === "cart" && (
          <CartDrawer
            onClose={() => {
              setActiveDrawer(null);
              setOpenCartNavbar("close");
              setIsNavbarVisible(true);
            }}
            items={cartItems}
            onRemove={removeFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onExplore={() => setActiveDrawer("explore")}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
};

export default MobileNavbar;
