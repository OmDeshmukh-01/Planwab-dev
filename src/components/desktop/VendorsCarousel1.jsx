// components/ui/LandingCarousel.jsx
"use client";

import React, { memo, useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  MapPin,
  Check,
  Plus,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

const formatPrice = (price) => {
  if (!price) return "0";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);
};

// Card Skeleton
const CardSkeleton = memo(() => (
  <div className="flex-shrink-0 w-72 h-[420px] rounded-3xl overflow-hidden bg-white border border-slate-100">
    <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer" />
    <div className="p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-3 w-1/2 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-8 w-14 bg-slate-100 rounded-lg animate-pulse" />
      </div>
      <div className="h-4 w-2/3 bg-slate-100 rounded-lg animate-pulse" />
      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
        <div className="space-y-1">
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          <div className="h-6 w-24 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-12 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  </div>
));

CardSkeleton.displayName = "CardSkeleton";

// Individual Card
const CarouselCard = memo(({ item, index, onAddToCart, isInCart, user, theme }) => {
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = useState(false);

  const itemId = item._id || item.id;
  const image = item.defaultImage || item.image || item.images?.[0];
  const inCart = isInCart(itemId);

  const [isLiked, setIsLiked] = useState(false);
  const [likingLoading, setLikingLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    if (!user?.id || !itemId) return;
    let cancelled = false;

    const fetchStatus = async () => {
      setStatusLoading(true);
      try {
        const res = await fetch("/api/user/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId: itemId, userId: user.id }),
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        if (!cancelled) {
          setStatusLoading(false);
        }
      }
    };

    fetchStatus();
    return () => {
      cancelled = true;
    };
  }, [user?.id, itemId]);

  const handleToggleLike = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!user?.id) {
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
          body: JSON.stringify({ vendorId: itemId, userId: user.id }),
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
    },
    [user?.id, itemId, isLiked, likingLoading],
  );

  const formatLocation = () => {
    if (!item.address && !item.location) return "Local Service";
    const loc = item.address || item.location;
    if (typeof loc === "object") {
      const city = loc.city || "";
      const state = loc.state || "";
      return `${city}${state ? `, ${state}` : ""}`.replace(/^, /, "") || "Local Service";
    }
    return loc;
  };

  const handleCardClick = () => {
    const category = item.category?.toLowerCase() || "service";
    router.push(`/vendor/${category}/${itemId}`);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(item, inCart);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
      className="flex-shrink-0 w-64 bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group cursor-pointer snap-start min-h-[375px] max-h-[378px]"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer" />
        )}
        <img
          src={image || "/placeholder.jpg"}
          alt={item.name || item.title}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Wishlist */}
        <motion.button
          whileHover={{ scale: likingLoading || statusLoading ? 1 : 1.1 }}
          whileTap={{ scale: likingLoading || statusLoading ? 1 : 0.9 }}
          onClick={handleToggleLike}
          disabled={likingLoading || statusLoading}
          className={`absolute top-4 right-4 p-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ${
            likingLoading || statusLoading ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {likingLoading || statusLoading ? (
            <Loader2 size={18} className="animate-spin text-slate-400" />
          ) : (
            <Heart
              size={18}
              className={`transition-colors ${
                isLiked ? "fill-rose-500 text-rose-500" : "text-slate-400 hover:text-rose-500"
              }`}
            />
          )}
        </motion.button>

        {/* Verified Badge */}
        {item.verified && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-indigo-600/95 backdrop-blur-md text-white flex items-center gap-1.5 shadow-lg"
          >
            <Check size={10} strokeWidth={4} />
            <span className="text-[10px] font-black uppercase tracking-tight">Verified</span>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-slate-900 text-base leading-tight truncate group-hover:text-indigo-600 transition-colors duration-300">
              {item.name || item.title}
            </h3>
            {item.category && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1.5 truncate">
                {item.category}
              </p>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-600 flex-shrink-0"
          >
            <Star size={12} className="fill-amber-500" />
            <span className="text-xs font-black">{item.rating || "4.8"}</span>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
          <MapPin size={14} className="text-slate-300 flex-shrink-0" />
          <span className="truncate">{formatLocation()}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight leading-none mb-1">Starting</p>
            <p className="text-xl font-black text-slate-900">
              ₹{formatPrice(item.perDayPrice?.min || item.price || 0)}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCartClick}
            className={`p-3.5 rounded-2xl transition-all duration-300 shadow-lg ${
              inCart
                ? "bg-emerald-500 text-white shadow-emerald-200"
                : `${theme.gradientLight} text-white shadow-slate-300 hover:bg-indigo-600 hover:shadow-indigo-200`
            }`}
          >
            {inCart ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

CarouselCard.displayName = "CarouselCard";

// Explore More Card
const ExploreMoreCard = memo(({ title, onViewAll }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02, y: -4 }}
    onClick={onViewAll}
    className="flex-shrink-0 w-72 rounded-3xl border-[3px] border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8 group cursor-pointer hover:border-indigo-300 transition-all duration-500 bg-gradient-to-br from-slate-50/50 to-white snap-start min-h-[375px] max-h-[378px]"
  >
    <motion.div
      whileHover={{ scale: 1.15, rotate: 90 }}
      transition={{ type: "spring", stiffness: 400 }}
      className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-indigo-600 transition-all duration-500 text-slate-400 group-hover:text-white"
    >
      <Plus size={32} strokeWidth={2.5} />
    </motion.div>

    <p className="font-black text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">Explore More</p>

    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">100+ More {title}</p>

    <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
      <span>View All</span>
      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </motion.div>
));

ExploreMoreCard.displayName = "ExploreMoreCard";

// Navigation Button
const NavButton = memo(({ direction, onClick, show }) => {
  const isLeft = direction === "left";

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, x: isLeft ? 20 : -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: isLeft ? 20 : -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className={`absolute ${isLeft ? "-left-6" : "-right-6"} top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white shadow-2xl shadow-slate-300/50 border border-slate-100 hover:bg-slate-50 transition-all text-slate-800 group`}
        >
          {isLeft ? (
            <ChevronLeft size={24} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
          ) : (
            <ChevronRight size={24} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
});

NavButton.displayName = "NavButton";

// Main Component
export const LandingCarousel = memo(
  ({
    title = "Featured",
    subtitle = "Discover amazing options",
    items = [],
    isLoading = false,
    icon: Icon = Sparkles,
    theme,
  }) => {
    const scrollRef = useRef(null);
    const router = useRouter();
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const { user } = useUser();

    const checkScroll = useCallback(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeft(scrollLeft > 10);
        setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    }, []);

    useEffect(() => {
      checkScroll();
      window.addEventListener("resize", checkScroll);
      return () => window.removeEventListener("resize", checkScroll);
    }, [checkScroll, items]);

    const scroll = (direction) => {
      if (scrollRef.current) {
        const amount = direction === "left" ? -900 : 900;
        scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
      }
    };

    const handleViewAll = () => {
      router.push(`/vendors/marketplace/${items[0]?.category?.toLowerCase() || "planners"}`);
    };

    const handleAddToCart = (item, isInCart) => {
      const itemId = item._id || item.id;
      if (isInCart) {
        setCartItems(cartItems.filter((id) => id !== itemId));
      } else {
        setCartItems([...cartItems, itemId]);
      }
    };

    const isInCart = (itemId) => cartItems.includes(itemId);

    return (
      <section className="py-8 md:py-12 md:pt-8 pt-6 relative group/section mx-auto w-[100%] px-8">
        {/* Header */}
        {/* <div className="flex items-end justify-between mb-8 px-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${theme.accentBg}15`, boxShadow: `0 8px 24px ${theme.accentBg}20` }}
            >
              <Icon size={26} style={{ color: theme.accentColor }} />
            </motion.div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
              <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] mt-1">{subtitle}</p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewAll}
            className="hidden sm:flex items-center gap-2 text-xs font-black px-5 py-2.5 rounded-xl transition-all uppercase tracking-widest"
            style={{ color: theme.accentColor, backgroundColor: `${theme.accentColor}10` }}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </motion.button>
        </div> */}

        {/* Carousel */}
        <div className="relative">
          <NavButton direction="left" onClick={() => scroll("left")} show={showLeft && !isLoading} />
          <NavButton direction="right" onClick={() => scroll("right")} show={showRight && !isLoading} />

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 gap-x-4 overflow-x-auto no-scrollbar pb-4 px-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading ? (
              [...Array(5)].map((_, i) => <CardSkeleton key={i} />)
            ) : (
              <>
                {items.map((item, index) => (
                  <CarouselCard
                    key={item._id || item.id || index}
                    item={item}
                    index={index}
                    onAddToCart={handleAddToCart}
                    isInCart={isInCart}
                    user={user}
                    theme={theme}
                  />
                ))}
                {items.length > 0 && <ExploreMoreCard title={title} onViewAll={handleViewAll} />}
              </>
            )}
          </div>
        </div>

        {/* Mobile View All */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onClick={handleViewAll}
          className="sm:hidden w-full mt-6 flex items-center justify-center gap-2 text-sm font-black py-4 rounded-2xl"
          style={{ color: theme.accentColor, backgroundColor: `${theme.accentColor}10` }}
        >
          <span>View All {title}</span>
          <ArrowRight size={18} />
        </motion.button>
      </section>
    );
  },
);

LandingCarousel.displayName = "LandingCarousel";

export default LandingCarousel;
