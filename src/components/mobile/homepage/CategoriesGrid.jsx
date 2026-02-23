import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Sparkles, Shuffle, ArrowRight, MapPin, Users, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SmartMedia from "../SmartMediaLoader";
import Link from "next/link";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50, success: [10, 50, 10] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

// Drawer configuration for each category type
const drawerConfigs = {
  planner: {
    title: "Choose Your Planner",
    key: "planners",
    subtitle: "How would you like to find your perfect planner?",
    cards: [
      {
        id: "marketplace",
        title: "Choose Yourself",
        description: "Browse our marketplace and select your preferred planner",
        icon: ArrowRight,
        color: "bg-blue-500",
        lightColor: "bg-blue-50",
        textColor: "text-blue-600",
        action: "marketplace",
      },
      {
        id: "dynamic",
        title: "We'll Match You",
        description: "Let us find the perfect planner based on your requirements",
        icon: Sparkles,
        color: "bg-purple-500",
        lightColor: "bg-purple-50",
        textColor: "text-purple-600",
        action: "match",
      },
      {
        id: "random",
        title: "Quick Pick",
        description: "Get matched instantly based on availability",
        icon: Shuffle,
        color: "bg-green-500",
        lightColor: "bg-green-50",
        textColor: "text-green-600",
        action: "random",
      },
    ],
  },
  venues: {
    title: "Find Your Venue",
    key: "venues",
    subtitle: "How would you like to discover the perfect venue?",
    cards: [
      {
        id: "marketplace",
        title: "Explore Venues",
        description: "Browse all available venues and choose your favorite",
        icon: MapPin,
        color: "bg-rose-500",
        lightColor: "bg-rose-50",
        textColor: "text-rose-600",
        action: "marketplace",
      },
      {
        id: "dynamic",
        title: "Personalized Match",
        description: "We'll recommend venues tailored to your event needs",
        icon: Sparkles,
        color: "bg-amber-500",
        lightColor: "bg-amber-50",
        textColor: "text-amber-600",
        action: "match",
      },
      {
        id: "random",
        title: "Instant Availability",
        description: "Find venues available for your preferred dates",
        icon: Clock,
        color: "bg-teal-500",
        lightColor: "bg-teal-50",
        textColor: "text-teal-600",
        action: "random",
      },
    ],
  },
  makeup: {
    title: "Makeup Services",
    key: "makeup",
    subtitle: "Select the type of makeup service you need",
    cards: [
      {
        id: "bridal",
        title: "Bridal Makeup",
        description: "Complete bridal makeup package for your special day",
        icon: Sparkles,
        color: "bg-pink-500",
        lightColor: "bg-pink-50",
        textColor: "text-pink-600",
        action: "marketplace",
        filter: "bridal",
      },
      {
        id: "party",
        title: "Party Makeup",
        description: "Glamorous looks for parties and events",
        icon: Sparkles,
        color: "bg-purple-500",
        lightColor: "bg-purple-50",
        textColor: "text-purple-600",
        action: "marketplace",
        filter: "party",
      },
      {
        id: "hair",
        title: "Hair Styling",
        description: "Professional hair styling and treatments",
        icon: Sparkles,
        color: "bg-amber-500",
        lightColor: "bg-amber-50",
        textColor: "text-amber-600",
        action: "marketplace",
        filter: "hair",
      },
      {
        id: "eye",
        title: "Eye Makeup",
        description: "Specialized eye makeup and lash services",
        icon: Sparkles,
        color: "bg-indigo-500",
        lightColor: "bg-indigo-50",
        textColor: "text-indigo-600",
        action: "marketplace",
        filter: "eye",
      },
    ],
  },
  photographer: {
    title: "Photography Services",
    key: "photographers",
    subtitle: "Choose your photography style",
    cards: [
      {
        id: "candid",
        title: "Candid Photography",
        description: "Natural, unposed moments captured beautifully",
        icon: Sparkles,
        color: "bg-cyan-500",
        lightColor: "bg-cyan-50",
        textColor: "text-cyan-600",
        action: "marketplace",
        filter: "candid",
      },
      {
        id: "traditional",
        title: "Traditional Photography",
        description: "Classic posed photographs for all occasions",
        icon: Sparkles,
        color: "bg-orange-500",
        lightColor: "bg-orange-50",
        textColor: "text-orange-600",
        action: "marketplace",
        filter: "traditional",
      },
      {
        id: "cinematic",
        title: "Cinematic Videography",
        description: "Movie-style video coverage of your event",
        icon: Sparkles,
        color: "bg-red-500",
        lightColor: "bg-red-50",
        textColor: "text-red-600",
        action: "marketplace",
        filter: "cinematic",
      },
    ],
  },
  caterers: {
    title: "Catering Services",
    key: "catering",
    subtitle: "Select your preferred cuisine type",
    cards: [
      {
        id: "vegetarian",
        title: "Vegetarian",
        description: "Pure vegetarian menu options",
        icon: Sparkles,
        color: "bg-green-500",
        lightColor: "bg-green-50",
        textColor: "text-green-600",
        action: "marketplace",
        filter: "vegetarian",
      },
      {
        id: "nonveg",
        title: "Non-Vegetarian",
        description: "Mixed menu with non-veg options",
        icon: Sparkles,
        color: "bg-red-500",
        lightColor: "bg-red-50",
        textColor: "text-red-600",
        action: "marketplace",
        filter: "nonveg",
      },
      {
        id: "multicuisine",
        title: "Multi-Cuisine",
        description: "Diverse menu with multiple cuisines",
        icon: Sparkles,
        color: "bg-yellow-500",
        lightColor: "bg-yellow-50",
        textColor: "text-yellow-600",
        action: "marketplace",
        filter: "multicuisine",
      },
    ],
  },
  decor: {
    title: "Decoration Services",
    key: "decor",
    subtitle: "Choose your decoration style",
    cards: [
      {
        id: "floral",
        title: "Floral Decor",
        description: "Beautiful flower arrangements and setups",
        icon: Sparkles,
        color: "bg-pink-500",
        lightColor: "bg-pink-50",
        textColor: "text-pink-600",
        action: "marketplace",
        filter: "floral",
      },
      {
        id: "theme",
        title: "Theme Based",
        description: "Custom themed decorations for your event",
        icon: Sparkles,
        color: "bg-violet-500",
        lightColor: "bg-violet-50",
        textColor: "text-violet-600",
        action: "marketplace",
        filter: "theme",
      },
      {
        id: "minimal",
        title: "Minimal & Elegant",
        description: "Subtle and sophisticated décor setups",
        icon: Sparkles,
        color: "bg-slate-500",
        lightColor: "bg-slate-50",
        textColor: "text-slate-600",
        action: "marketplace",
        filter: "minimal",
      },
    ],
  },
  decorator: {
    title: "Decoration Services",
    key: "decor",
    subtitle: "Choose your decoration style",
    cards: [
      {
        id: "balloon",
        title: "Balloon Decoration",
        description: "Colorful balloon setups and arches",
        icon: Sparkles,
        color: "bg-blue-500",
        lightColor: "bg-blue-50",
        textColor: "text-blue-600",
        action: "marketplace",
        filter: "balloon",
      },
      {
        id: "theme",
        title: "Theme Party",
        description: "Custom themed decorations for birthdays",
        icon: Sparkles,
        color: "bg-purple-500",
        lightColor: "bg-purple-50",
        textColor: "text-purple-600",
        action: "marketplace",
        filter: "theme",
      },
      {
        id: "premium",
        title: "Premium Setup",
        description: "Luxurious and elegant party setups",
        icon: Sparkles,
        color: "bg-amber-500",
        lightColor: "bg-amber-50",
        textColor: "text-amber-600",
        action: "marketplace",
        filter: "premium",
      },
    ],
  },
  djs: {
    title: "DJ & Sound Services",
    key: "djs",
    subtitle: "Select your entertainment package",
    cards: [
      {
        id: "dj",
        title: "DJ Only",
        description: "Professional DJ for your event",
        icon: Sparkles,
        color: "bg-violet-500",
        lightColor: "bg-violet-50",
        textColor: "text-violet-600",
        action: "marketplace",
        filter: "dj",
      },
      {
        id: "sound",
        title: "Sound System",
        description: "High-quality sound system rental",
        icon: Sparkles,
        color: "bg-blue-500",
        lightColor: "bg-blue-50",
        textColor: "text-blue-600",
        action: "marketplace",
        filter: "sound",
      },
      {
        id: "complete",
        title: "Complete Package",
        description: "DJ + Sound + Lighting combo",
        icon: Sparkles,
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
        lightColor: "bg-gradient-to-r from-purple-50 to-pink-50",
        textColor: "text-purple-600",
        action: "marketplace",
        filter: "complete",
      },
    ],
  },
  cake: {
    title: "Cake Services",
    key: "cake",
    subtitle: "Choose your cake type",
    cards: [
      {
        id: "custom",
        title: "Custom Designer Cake",
        description: "Personalized cakes with custom designs",
        icon: Sparkles,
        color: "bg-pink-500",
        lightColor: "bg-pink-50",
        textColor: "text-pink-600",
        action: "marketplace",
        filter: "custom",
      },
      {
        id: "tiered",
        title: "Tiered Cakes",
        description: "Multi-tier celebration cakes",
        icon: Sparkles,
        color: "bg-rose-500",
        lightColor: "bg-rose-50",
        textColor: "text-rose-600",
        action: "marketplace",
        filter: "tiered",
      },
      {
        id: "cupcakes",
        title: "Cupcakes & Desserts",
        description: "Assorted cupcakes and dessert tables",
        icon: Sparkles,
        color: "bg-amber-500",
        lightColor: "bg-amber-50",
        textColor: "text-amber-600",
        action: "marketplace",
        filter: "cupcakes",
      },
    ],
  },
};

// Map category names to drawer config keys
const getCategoryDrawerKey = (categoryName) => {
  const name = categoryName?.toLowerCase();
  if (name.includes("planner")) return "planner";
  if (name.includes("venue")) return "venues";
  if (name.includes("makeup")) return "makeup";
  if (name.includes("photographer")) return "photographer";
  if (name.includes("caterer")) return "caterers";
  if (name.includes("decor")) return "decor";
  if (name.includes("decorator")) return "decorator";
  if (name.includes("dj") || name.includes("sound")) return "djs";
  if (name.includes("cake")) return "cake";
  return null; // No drawer for this category
};

// Drawer Component
const CategoryDrawer = ({ isOpen, onClose, config, categoryName, haptic, currentCategory }) => {
  const handleCardClick = (card) => {
    haptic("medium");
    // Handle the action based on card type
    if (card.action === "marketplace") {
      const baseUrl = `/vendors/marketplace/${config?.key || "planners"}`;
      const url = card.filter ? `${baseUrl}?filter=${card.filter}` : baseUrl;
      window.location.href = url;
    } else if (card.action === "match") {
      const category = currentCategory?.toLowerCase() === "default" ? "wedding" : currentCategory?.toLowerCase();
      const url = `/events/${category}?filter=${categoryName?.toLowerCase()}`;
      window.location.href = url;
      console.log("Opening matching flow for:", categoryName);
    } else if (card.action === "random") {
      const baseUrl = `/vendors/marketplace`;
      const url = card.filter ? `${baseUrl}?filter=${card.filter}` : baseUrl;
      window.location.href = url;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-hidden"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{config?.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{config?.subtitle}</p>
              </div>
              <button
                onClick={() => {
                  haptic("light");
                  onClose();
                }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Cards */}
            <div className="px-5 pb-8 pt-2 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {config?.cards.map((card, index) => {
                  const IconComponent = card.icon;
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCardClick(card)}
                      className={`${card.lightColor} rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 border border-transparent hover:border-gray-200`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
                          <IconComponent size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${card.textColor} text-base`}>{card.title}</h4>
                          <p className="text-gray-600 text-sm mt-0.5">{card.description}</p>
                        </div>
                        <ArrowRight size={20} className={`${card.textColor} opacity-60`} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CategoryGrid = ({ currentCategory }) => {
  const scrollRef = useRef(null);
  const haptic = useHapticFeedback();

  // Initialize with safe defaults (Right is likely scrollable initially)
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { setIsNavbarVisible } = useNavbarVisibilityStore();

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawerConfig, setActiveDrawerConfig] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState("");

  // 1. Memoize Data: Prevents array recreation on every render
  const categories = useMemo(
    () => [
      {
        name: `${currentCategory === "Default" ? "Event" : currentCategory} Planner`,
        key: "planners",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428626/PlannerCat_p16v2m.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: "Photographer",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428623/PhotographerCat_ymq0vh.png",
        key: "photographers",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: "mehendi",
        key: "mehendi",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428620/MehndiCat_hdsxxo.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: "MakeUp",
        key: "makeup",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428617/MakeUpCat_lcp68d.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: `${currentCategory} Venues`,
        key: "venues",
        // Use a smaller, optimized static image if possible instead of a heavy GIF for thumbnails
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771518098/Hydra_Category_Wedding_Season-18-11-25_yrbjzq.webp",
        span: 2,
        widthClass: "w-40",
        pixelWidth: 160,
      },
      {
        name: "DJs & Sound",
        key: "djs",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428615/DJCat_hay9fu.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      { name: "Dhol", key: "dhol", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428613/DholCat_swqr0p.png", span: 1, widthClass: "w-20", pixelWidth: 80 },
      {
        name: "Caterers",
        key: "catering",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428610/CaterorsCat_pch4d5.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
    ],
    [currentCategory]
  );

  const categoriesBirthday = useMemo(
    () => [
      {
        name: `${currentCategory === "Default" ? "Event" : currentCategory} Planner`,
        key: "planners",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428442/PlannerCatB_fknksy.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: "Decorator",
        key: "decor",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428432/DecoratorCatB_t45nbm.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: "DJs & Sound",
        key: "djs",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428436/DJCatB_zpnp70.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: "Photographer",
        key: "photographers",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428440/PhotographerCatB_t77bej.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: `${currentCategory} Venues`,
        key: "venues",
        // Use a smaller, optimized static image if possible instead of a heavy GIF for thumbnails
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771518098/Hydra_Category_Wedding_Season-18-11-25_yrbjzq.webp",
        span: 2,
        widthClass: "w-40",
        pixelWidth: 160,
      },
      {
        name: "Caterers",
        key: "catering",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428432/CaterorsCatB_imq5qx.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: "Cake",
        key: "cake",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428430/CakesCatB_njrf4g.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
      {
        name: "MakeUp",
        key: "makeup",
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428437/MakeUpCatB_xpendj.png",
        span: 1,
        widthClass: "w-20",
        pixelWidth: 80,
      },
    ],
    [currentCategory]
  );

  const activeCategories = currentCategory === "Birthday" ? categoriesBirthday : categories;

  // 2. Optimized Scroll Checker (Anti-Thrashing)
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // Calculate new states
    const newLeft = scrollLeft > 5; // buffer of 5px
    const newRight = scrollLeft < scrollWidth - clientWidth - 5;

    // Only trigger re-render if value DIFFERENT from current state
    if (newLeft !== canScrollLeft) setCanScrollLeft(newLeft);
    if (newRight !== canScrollRight) setCanScrollRight(newRight);
  }, [canScrollLeft, canScrollRight]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);

    // Add passive listener for better scroll performance
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", checkScroll);
      if (ref) {
        ref.removeEventListener("scroll", checkScroll);
      }
    };
  }, [checkScroll]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle category click
  const handleCategoryClick = (e, item) => {
    const drawerKey = getCategoryDrawerKey(item.name);

    if (drawerKey && drawerConfigs[drawerKey]) {
      e.preventDefault(); // Prevent navigation
      haptic("medium");
      setIsNavbarVisible(false);
      setActiveDrawerConfig(drawerConfigs[drawerKey]);
      setActiveCategoryName(item.name);
      setDrawerOpen(true);
    }
    // If no drawer config exists, let the Link handle navigation normally
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setIsNavbarVisible(true);
    setTimeout(() => {
      setActiveDrawerConfig(null);
      setActiveCategoryName("");
    }, 300);
  };

  return (
    <div className="p-4 py-2 pt-4 bg-white rounded-2xl shadow-sm mb-3">
      <div className="flex items-center justify-between mb-4">
        {/* Render text as Priority */}
        <h2 className="text-xl font-semibold text-gray-900 leading-none">What are you looking for?</h2>

        {/* --- CONTROL BUTTONS --- */}
        <div className="flex gap-2">
          <ScrollButton
            onClick={() => {
              scroll("left");
              haptic("light");
            }}
            disabled={!canScrollLeft}
            direction="left"
          />
          <ScrollButton
            onClick={() => {
              scroll("right");
              haptic("light");
            }}
            disabled={!canScrollRight}
            direction="right"
          />
        </div>
      </div>

      {/* --- SCROLL CONTAINER --- */}
      {/* 'will-change-transform' puts this on GPU layer */}
      <div
        ref={scrollRef}
        className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth will-change-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch", // Momentum scrolling for iOS
        }}
      >
        {activeCategories.map((item, index) => (
          <Link
            href={`/vendors/marketplace/${item?.key.toLowerCase()}`}
            key={index} // Keys are stable since list doesn't re-sort
            className={`flex flex-col items-center shrink-0 ${
              item.span === 2 ? "row-span-1 col-span-2" : "col-span-1"
            }`}
            onClick={(e) => handleCategoryClick(e, item)}
          >
            {/* 3. Render Image Container with fixed Aspect Ratio to avoid CLS */}
            <div
              className={`relative rounded-[12px] overflow-hidden bg-gray-100 mb-1.5 shadow-sm transition-transform active:scale-95 hover:scale-[1.02] ${item.widthClass}`}
              style={{ height: "80px" }}
            >
              <SmartMedia
                src={item.image}
                type="image"
                className="w-full h-full object-cover"
                // Important: If SmartMedia supports priority/loading props, use them
                // loading="eager" // for first few items
                width={item.pixelWidth}
                height={80}
                alt={item.name}
              />
            </div>

            <p className="text-xs font-medium font-sans text-center text-gray-800 whitespace-nowrap leading-tight">
              {item.name}
            </p>
          </Link>
        ))}

        {/* View All Item */}
        <Link
          href={`/vendors/explore/${currentCategory?.toLowerCase() || "all"}`}
          className="flex flex-col items-center shrink-0 col-span-1"
          onClick={() => haptic("light")}
        >
          <div
            className="relative rounded-[12px] overflow-hidden bg-gray-200 mb-1.5 shadow-sm transition-transform active:scale-95 hover:scale-[1.02] w-20 flex items-center justify-center"
            style={{ height: "80px" }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              </div>
              <ChevronRight size={14} className="text-gray-600 mt-1" />
            </div>
          </div>

          <p className="text-xs font-medium font-sans text-center text-gray-800 whitespace-nowrap leading-tight">
            View All
          </p>
        </Link>
      </div>

      {/* Category Drawer */}
      <CategoryDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        config={activeDrawerConfig}
        categoryName={activeCategoryName}
        haptic={haptic}
        currentCategory={currentCategory}
      />

      {/* Global Style for scrollbar hiding */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

// Memoize small buttons to prevent re-renders when parent scrolls
const ScrollButton = React.memo(({ onClick, disabled, direction }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded-full transition-all duration-200 ${
      disabled
        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
        : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600 active:scale-90"
    }`}
    aria-label={`Scroll ${direction}`}
  >
    {direction === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
  </button>
));

export default CategoryGrid;
