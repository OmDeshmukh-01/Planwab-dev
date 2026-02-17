"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback, useTransition } from "react";
import { ChevronLeft, ChevronRight, X, Sparkles, Shuffle, ArrowRight, MapPin, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import Link from "next/link";
import SmartMedia from "../SmartMediaLoader";

// Haptic feedback hook
function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50, success: [10, 50, 10] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

// Modal configuration for each category type
const modalConfigs = {
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

// Map category names to modal config keys
const getCategoryModalKey = (categoryName) => {
  const name = categoryName?.toLowerCase();
  if (name.includes("planner")) return "planner";
  if (name.includes("venue")) return "venues";
  if (name.includes("makeup")) return "makeup";
  if (name.includes("photographer")) return "photographer";
  if (name.includes("caterer")) return "caterers";
  if (name.includes("decorator")) return "decorator";
  if (name.includes("dj") || name.includes("sound")) return "djs";
  if (name.includes("cake")) return "cake";
  return null; // No modal for this category
};

// Spring animation variants for modal
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 40,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 28,
      mass: 0.9,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 30,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 35,
      mass: 0.8,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, delay: 0.05 },
  },
};

// Category Modal Component
const CategoryModal = ({ isOpen, onClose, config, categoryName, haptic, currentCategory, isPending, onNavigate }) => {
  const handleCardClick = (card) => {
    haptic("medium");

    let url = "";
    if (card.action === "marketplace") {
      const baseUrl = `/vendors/marketplace/${config?.key || "planners"}`;
      url = card.filter ? `${baseUrl}?filter=${card.filter}` : baseUrl;
    } else if (card.action === "match") {
      const category = currentCategory?.toLowerCase() === "default" ? "wedding" : currentCategory?.toLowerCase();
      url = `/events/${category}?filter=${categoryName?.toLowerCase()}`;
    } else if (card.action === "random") {
      const baseUrl = `/vendors/marketplace/${config?.key || "planners"}`;
      url = card.filter ? `${baseUrl}?filter=${card.filter}` : `${baseUrl}?sort=random`;
    }

    onNavigate(url);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Loading Overlay */}
            <AnimatePresence>
              {isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-8 h-8 text-blue-500" />
                    </motion.div>
                    <p className="text-sm font-medium text-gray-600">Loading...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="relative p-6 pb-3">
              <button
                onClick={() => {
                  haptic("light");
                  onClose();
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>

              <div className="pr-10">
                <h3 className="text-xl font-semibold text-gray-900">{config?.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{config?.subtitle}</p>
              </div>
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
        </div>
      )}
    </AnimatePresence>
  );
};

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
ScrollButton.displayName = "ScrollButton";

export default function CategoryGrid() {
  const scrollRef = useRef(null);
  const router = useRouter();
  const haptic = useHapticFeedback();
  const { activeCategory } = useCategoryStore();

  const [isPending, startTransition] = useTransition();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalConfig, setActiveModalConfig] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState("");

  const currentCategory = activeCategory || "Wedding";
  // Tailwind classes with responsive breakpoints
  const baseWidth = 171; // in px
  const baseHeight = 90;
  const widthClasses = {
    base: "w-[171px]",
    md: "md:w-[137px]",
    lg: "lg:w-[172px]",
  };

  const heightClasses = {
    base: "h-[90px]",
    md: "md:h-[72px]",
    lg: "lg:h-[108px]",
  };

  const cardWidthClass = `${widthClasses.base} ${widthClasses.md} ${widthClasses.lg}`;
  const cardHeightClass = `${heightClasses.base} ${heightClasses.md} ${heightClasses.lg}`;

  // Categories for Wedding/Anniversary/Events
  const activeCategories = useMemo(
    () => [
      {
        name: `${currentCategory === "Default" ? "Event" : currentCategory} Planner`,
        key: "planners",
        image: "/CardsCatPhotos/PlannerCat.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "Photographer",
        image: "/CardsCatPhotos/PhotographerCat.png",
        key: "photographers",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "mehendi",
        key: "mehendi",
        image: "/CardsCatPhotos/MehndiCat.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "MakeUp",
        key: "makeup",
        image: "/CardsCatPhotos/MakeUpCat.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: `${currentCategory} Venues`,
        key: "venues",
        image: "https://cdn.yesmadam.com/images/live/category/Hydra%20Category_Wedding%20Season-18-11-25.gif",
        span: 2,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "DJs & Sound",
        key: "djs",
        image: "/CardsCatPhotos/DJCat.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "Dhol",
        key: "dhol",
        image: "/CardsCatPhotos/DholCat.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "Caterers",
        key: "catering",
        image: "/CardsCatPhotos/CaterorsCat.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "Dhol",
        key: "dhol",
        image: "/CardsCatPhotos/DholCat.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "Caterers",
        key: "catering",
        image: "/CardsCatPhotos/CaterorsCat.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
    ],
    [currentCategory],
  );

  // Categories for Birthday
  const categoriesBirthday = useMemo(
    () => [
      {
        name: `${currentCategory === "Default" ? "Event" : currentCategory} Planner`,
        key: "planners",
        image: "/CardsCatPhotos/PlannerCatB.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "Decorator",
        key: "decor",
        image: "/CardsCatPhotos/DecoratorCatB.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "DJs & Sound",
        key: "djs",
        image: "/CardsCatPhotos/DJCatB.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "Photographer",
        key: "photographers",
        image: "/CardsCatPhotos/PhotographerCatB.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: `${currentCategory} Venues`,
        key: "venues",
        image: "https://cdn.yesmadam.com/images/live/category/Hydra%20Category_Wedding%20Season-18-11-25.gif",
        span: 2,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "Caterers",
        key: "catering",
        image: "/CardsCatPhotos/CaterorsCatB.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "Cake",
        key: "cake",
        image: "/CardsCatPhotos/CakesCatB.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
      {
        name: "MakeUp",
        key: "makeup",
        image: "/CardsCatPhotos/MakeUpCatB.png",
        span: 1,
        widthClass: cardWidthClass,
        heightClass: cardHeightClass,
        pixelWidth: 160,
      },
    ],
    [currentCategory],
  );

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const newLeft = scrollLeft > 5;
    const newRight = scrollLeft < scrollWidth - clientWidth - 5;

    if (newLeft !== canScrollLeft) setCanScrollLeft(newLeft);
    if (newRight !== canScrollRight) setCanScrollRight(newRight);
  }, [canScrollLeft, canScrollRight]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);

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

  const handleNavigate = useCallback(
    (url) => {
      startTransition(() => {
        router.push(url);
      });
    },
    [router],
  );

  const handleCategoryClick = (e, item) => {
    const modalKey = getCategoryModalKey(item.name);

    if (modalKey && modalConfigs[modalKey]) {
      e.preventDefault();
      haptic("medium");
      setActiveModalConfig(modalConfigs[modalKey]);
      setActiveCategoryName(item.name);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => {
      setActiveModalConfig(null);
      setActiveCategoryName("");
    }, 300);
  };

  return (
    <div className="p-4 py-2 pt-4 bg-transparent rounded-2xl mx-auto max-w-5xl z-30 mb-22">
      {/* <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-none">What are you looking for?</h2>

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
      </div> */}

      <div
        ref={scrollRef}
        className="grid grid-rows-2 grid-flow-col gap-x-3 gap-y-5 overflow-x-auto pb-2 no-scrollbar scroll-smooth will-change-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {activeCategories.map((item, index) => (
          <Link
            href={`/vendors/marketplace/${item?.key.toLowerCase()}`}
            key={index}
            className={`flex flex-col items-center shrink-0 col-span-1`}
            onClick={(e) => handleCategoryClick(e, item)}
          >
            <div
              className={`relative rounded-[12px] overflow-hidden bg-gray-100 mb-1.5 shadow-sm transition-transform active:scale-95 hover:scale-[1.02] ${item.widthClass} ${item.heightClass}`}
            >
              <SmartMedia
                src={item.image}
                type="image"
                className="w-full h-full object-cover"
                width={item.pixelWidth}
                height={baseHeight}
                alt={item.name}
              />
            </div>

            <p className="text-xs md:text-sm font-medium font-sans text-center text-gray-800 whitespace-nowrap leading-tight">
              {item.name}
            </p>
          </Link>
        ))}

        {/* View All Item */}
        {/* <Link
          href={`/vendors/explore/${currentCategory?.toLowerCase() || "all"}`}
          className="flex flex-col items-center shrink-0 col-span-1"
          onClick={() => haptic("light")}
        >
          <div
            className="relative rounded-[12px] overflow-hidden bg-gray-200 mb-1.5 shadow-sm transition-transform active:scale-95 hover:scale-[1.02] w-20 md:w-32 lg:w-36 h-20 md:h-32 lg:h-36 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full"></div>
              </div>
              <ChevronRight size={14} className="text-gray-600 mt-1 md:w-5 md:h-5" />
            </div>
          </div>

          <p className="text-xs md:text-sm font-medium font-sans text-center text-gray-800 whitespace-nowrap leading-tight">
            View All
          </p>
        </Link> */}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={closeModal}
        config={activeModalConfig}
        categoryName={activeCategoryName}
        haptic={haptic}
        currentCategory={currentCategory}
        isPending={isPending}
        onNavigate={handleNavigate}
      />

      {/* Global Loading Indicator */}
      <AnimatePresence>
        {isPending && !modalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-xl border border-gray-200">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Loader2 className="w-5 h-5 text-blue-500" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700">Loading...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
