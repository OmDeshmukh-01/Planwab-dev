"use client";

import React, { memo, useMemo, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  Clock, 
  Check, 
  Plus, 
  ShoppingCart, 
  Heart,
  MapPin,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/GlobalState/CartDataStore";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

// Haptic feedback utility for desktop (fallback for mobile)
function useHapticFeedback() {
  return React.useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50, success: [10, 50, 10] };
      navigator.vibrate(patterns[type] || patterns.light);
    }
  }, []);
}

const MobileStyleVendorCard = memo(({ vendor, buttonColor }) => {
  const [liked, setLiked] = useState(false);
  const [likingLoading, setLikingLoading] = useState(false);
  const { addToCart, removeFromCart, cartItems, isInCart } = useCartStore();
  const { user } = useUser();
  const haptic = useHapticFeedback();

  if (!vendor || (!vendor.id && !vendor._id)) {
    return null;
  }

  const vendorId = vendor.id || vendor._id;

  // Check if item is in cart
  const inCart = isInCart(vendorId);

  // Check if vendor is liked by user
  useEffect(() => {
    if (!user || !vendorId) return;

    const checkIfLiked = async () => {
      try {
        const response = await fetch(`/api/user/me`);
        if (response.ok) {
          const userData = await response.json();
          setLiked(userData.likedVendors?.includes(vendorId) || false);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkIfLiked();
  }, [user, vendorId]);

  const displayPrice = useMemo(() => {
    if (vendor.perDayPrice?.min) {
      return `₹${vendor.perDayPrice.min.toLocaleString('en-IN')}`;
    }
    if (typeof vendor.price === "number") {
      return `₹${vendor.price.toLocaleString('en-IN')}`;
    }
    if (typeof vendor.price === "string" && vendor.price.trim()) {
      return vendor.price;
    }
    if (vendor.basePrice) {
      return `₹${vendor.basePrice.toLocaleString('en-IN')}`;
    }
    return "Contact";
  }, [vendor.perDayPrice, vendor.price, vendor.basePrice]);

  const handleCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    haptic("medium");

    if (inCart) {
      removeFromCart(vendorId);
      toast.success("Removed from cart");
    } else {
      const cartItem = {
        _id: vendorId,
        id: vendorId,
        name: vendor.name || "Unknown Vendor",
        category: vendor.category || getCategoryDisplay(),
        price: vendor.perDayPrice?.min || 
               (typeof vendor.basePrice === "number" ? vendor.basePrice : 0) ||
               (typeof vendor.price === "number" ? vendor.price : 0),
        image: getImageUrl(),
        quantity: 1,
        address: vendor.address || getLocationDisplay(),
        rating: vendor.rating || 0,
        reviews: vendor.reviewCount || 0,
        verified: vendor.verified || false,
        responseTime: vendor.responseTime || "2 hours",
        bookings: vendor.bookings || 0,
        type: vendor.type || vendor.category,
      };
      addToCart(cartItem);
      toast.success("Added to cart");
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    haptic("light");

    if (!user) {
      toast.error("Please login to like vendors");
      return;
    }

    if (likingLoading) return;

    setLikingLoading(true);
    const prevLiked = liked;
    setLiked(!prevLiked);

    try {
      const res = await fetch("/api/user/toggle-like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: vendorId }),
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      setLiked(prevLiked); // Revert on error
      toast.error("Something went wrong");
      console.error("Like toggle error:", error);
    } finally {
      setLikingLoading(false);
    }
  };

  const getImageUrl = () => {
    return vendor.image || 
           vendor.defaultImage || 
           (vendor.images && vendor.images.length > 0 ? vendor.images[0] : null) ||
           "https://images.unsplash.com/photo-1494790108755-2616b332c913?w=800&q=80";
  };

  const getCategoryDisplay = () => {
    if (vendor.category) {
      return vendor.category.slice(0, 6); // Shorten for mobile style
    }
    return vendor.type || "Service";
  };

  const getLocationDisplay = () => {
    if (vendor.location) return vendor.location;
    if (vendor.address?.city) {
      return vendor.address.city + (vendor.address?.state ? `, ${vendor.address.state}` : '');
    }
    return "Location not specified";
  };

  return (
    <Link href={`/vendor/${getCategoryDisplay().toLowerCase()}/${vendorId}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        className="w-full bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group"
      >
        {/* Image Section */}
        <div className="relative h-48 bg-gray-100 dark:bg-gradient-to-br dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          <img 
            src={getImageUrl()}
            alt={vendor.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              if (!e.target.dataset.fallbackApplied) {
                e.target.dataset.fallbackApplied = "true";
                e.target.src = "https://images.unsplash.com/photo-1494790108755-2616b332c913?w=800&q=80";
              }
            }}
          />

          {/* Popular Badge */}
          {vendor.isFeatured && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full">
              <span className="text-[8px] font-bold">POPULAR</span>
            </div>
          )}

          {/* Heart Icon */}
          <button
            onClick={handleLike}
            disabled={likingLoading}
            className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-1.5 shadow-md transition-all duration-300 hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:shadow-lg dark:hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {likingLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart
                size={14}
                className={`transition-colors duration-300 ${
                  liked 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-400 group-hover:text-red-500'
                }`}
              />
            )}
          </button>

          {/* Rating Badge */}
          <div className="absolute bottom-2 left-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-md dark:shadow-lg dark:shadow-blue-500/10 flex items-center gap-1">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200">
              {vendor.rating || "5.0"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Name and Category */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-white truncate leading-tight mb-1" title={vendor.name}>
                {vendor.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gradient-to-r dark:from-gray-700 dark:to-gray-600 dark:border dark:border-gray-600 px-2 py-1 rounded truncate max-w-[100px]" title={getCategoryDisplay()}>
                  {getCategoryDisplay()}
                </span>
                {vendor.verified && (
                  <CheckCircle size={14} className="text-blue-500 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mb-3 text-gray-400 dark:text-gray-300 min-w-0">
            <MapPin size={12} className="flex-shrink-0" />
            <span className="text-xs truncate" title={getLocationDisplay()}>{getLocationDisplay()}</span>
          </div>

         {/* Statistics section displaying vendor performance metrics */}
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-300 overflow-hidden">
            {vendor.bookings && (
              <span className="flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                <span className="font-semibold">{vendor.bookings}</span>
                <span>booked</span>
              </span>
            )}
            {vendor.responseTime && (
              <span className="flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                <Clock size={10} className="flex-shrink-0" />
                <span>Within {vendor.responseTime}</span>
              </span>
            )}
            {vendor.reviewCount && (
              <span className="flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                <span className="font-semibold">{vendor.reviewCount}</span>
                <span>reviews</span>
              </span>
            )}
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-600 gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-sm font-bold text-gray-900 dark:text-white truncate block" title={displayPrice}>
                {displayPrice}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-300">/event</span>
            </div>
            <button
              onClick={handleCart}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-90 whitespace-nowrap flex-shrink-0 shadow-md hover:shadow-lg ${
                inCart 
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700" 
                  : `${buttonColor || "bg-gradient-to-r from-gray-900 to-gray-800"} text-white hover:from-gray-800 hover:to-gray-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800`
              }`}
            >
              {inCart ? (
                <>
                  <Check size={12} /> Added
                </>
              ) : (
                <>
                  <ShoppingCart size={12} /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

MobileStyleVendorCard.displayName = "MobileStyleVendorCard";

export default MobileStyleVendorCard;
