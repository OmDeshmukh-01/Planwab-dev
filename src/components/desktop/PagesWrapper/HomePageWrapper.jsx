"use client";

import { memo, useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import HeroSection from "../HomePage/HeroSection";
import ServicesBanner from "../HomePage/ServicesBanner";
import HowItWorksSection from "../HomePage/HowItWorks";
import Testimonials from "../HomePage/TestimonialsSection";
import VendorsCatSection from "../HomePage/VendorsSection";
import FloatingLines from "../ui/FloatingLinesUiEffect";
import CategoriesGridSection from "../HomePage/CategoriesGrid";
import WeddingPlanningTools from "../HomePage/PlanningTools";
import LandingCarousel from "../VendorsCarousel1";
import { Camera, MapPin, PersonStanding } from "lucide-react";
import CarouselHeader from "../CarouselHeader";
import CardsWithBanner from "../HomePage/CardsWithBanner";

// ── Theme Definitions ──
export const categoryThemes = {
  Events: {
    glow: "bg-violet-500/10 dark:bg-violet-500/20",
    accent: "text-violet-600 dark:text-violet-400",
    accentBg: "bg-violet-500",
    gradientLight: "bg-[#1b1365]",
    gradientDark: "#2e1065",
    cardActiveBorder: "border-violet-500",
    cardActiveGlow: "shadow-violet-500/20",
    searchAccent: "ring-violet-400",
    buttonBg: "bg-violet-600 hover:bg-violet-700",
    buttonGlow: "shadow-violet-500/30",
    dotBg: "bg-violet-500",
    bgLight: "bg-gradient-to-bl from-[#ffe4e6] to-[#ccfbf1] dark:bg-[#0d1117]",
  },
  Wedding: {
    glow: "bg-rose-500/10 dark:bg-rose-500/20",
    accent: "text-rose-600 dark:text-rose-400",
    accentBg: "bg-rose-500",
    gradientLight: "bg-[#09566f]",
    gradientDark: "#4c0519",
    cardActiveBorder: "border-rose-500",
    cardActiveGlow: "shadow-rose-500/20",
    searchAccent: "ring-rose-400",
    buttonBg: "bg-rose-600 hover:bg-rose-700",
    buttonGlow: "shadow-rose-500/30",
    dotBg: "bg-rose-500",
    bgLight: "bg-gradient-to-bl from-[#fef3c7] to-[#d1fae5]",
  },
  Anniversary: {
    glow: "bg-amber-500/10 dark:bg-amber-500/20",
    accent: "text-amber-600 dark:text-amber-400",
    accentBg: "bg-amber-500",
    gradientLight: "bg-[#74001d]",
    gradientDark: "#451a03",
    cardActiveBorder: "border-amber-500",
    cardActiveGlow: "shadow-amber-500/20",
    searchAccent: "ring-amber-400",
    buttonBg: "bg-amber-600 hover:bg-amber-700",
    buttonGlow: "shadow-amber-500/30",
    dotBg: "bg-amber-500",
    bgLight: "bg-gradient-to-bl from-[#fbcfe8] to-[#a7f3d0]",
  },
  Birthday: {
    glow: "bg-sky-500/10 dark:bg-sky-500/20",
    accent: "text-sky-600 dark:text-sky-400",
    accentBg: "bg-sky-500",
    gradientLight: "bg-[#96730e]",
    gradientDark: "#0c4a6e",
    cardActiveBorder: "border-sky-500",
    cardActiveGlow: "shadow-sky-500/20",
    searchAccent: "ring-sky-400",
    buttonBg: "bg-sky-600 hover:bg-sky-700",
    buttonGlow: "shadow-sky-500/30",
    dotBg: "bg-sky-500",
    bgLight: "bg-gradient-to-bl from-[#fff1f2] to-[#ccfbf1]",
  },
};

// ── Category Cards Data ──
export const categoryCards = [
  {
    name: "Events",
    icon: "🎉",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602239/ActiveEventsHeaderCard_jo4yxd.png",
    tagline: "Every occasion, perfectly planned.",
    description: "Discover top vendors and venues for all your celebrations — corporate, social, or personal.",
  },
  {
    name: "Wedding",
    icon: "💒",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602240/ActiveWeddingHeaderCard_kvd3z2.png",
    tagline: "Moments that Matter, Made Simple.",
    description: "From intimate ceremonies to grand celebrations, find the perfect vendors for your big day.",
  },
  {
    name: "Anniversary",
    icon: "💝",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602236/ActiveAnniversaryHeaderCard_stf6mh.png",
    tagline: "Celebrate Love, Year After Year.",
    description: "Create unforgettable anniversary celebrations with curated vendors and venues.",
  },
  {
    name: "Birthday",
    icon: "🎂",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602237/ActiveBirthdayHeaderCard_stxmry.png",
    tagline: "Make Every Birthday Legendary.",
    description: "Throw the ultimate birthday bash with the best planners, decorators, and caterers.",
  },
];

// ── Carousel Images per Category ──
export const carouselImages = {
  Events: [
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429490/events_osoyqb.png",
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602596/2-events_itxlqr.png",
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602725/3-events_x8v1qz.png",
  ],
  Wedding: [
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429494/wedding_fplcb3.png",
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602598/2-wedding_gsecdb.png",
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602727/3-wedding_wdk5wh.png",
  ],
  Anniversary: [
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429483/anniversary_eqkzag.png",
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602594/2-anniversary_l9kstj.png",
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602720/3-anniversary_djd9fh.png",
  ],
  Birthday: [
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429487/birthday_e4yhtd.png",
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602595/2-birthday_bqgm3o.png",
    "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771602722/3-birthday_gahoir.png",
  ],
};

// ── Right-side Hero Images ──
export const heroSideImages = {
  Events: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429708/eventsRight_y1ay0u.jpg",
  Wedding: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429711/weddingRight_e2atzb.jpg",
  Anniversary: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429705/anniversaryRight_oxguwo.jpg",
  Birthday: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429701/birthdayRight_tox6wr.jpg",
};

const CategoryButton = ({ category, imageSrc, active }) => {
  const inactiveImages = {
    Wedding: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429996/WeddingHeaderCard_vslgmt.png",
    Anniversary: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429999/AnniversaryHeaderCard_garm4n.png",
    Birthday: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429994/BirthdayHeaderCard_nat4mj.png",
    Events: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429994/EventsHeaderCard_ppcemp.png",
  };

  const backgroundImage = active ? imageSrc : inactiveImages[category] || "/sample-image.png";

  return (
    <div
      role="tab"
      aria-selected={active}
      className={`
        relative flex w-full min-h-[75px] items-center justify-center space-x-2.5 px-4 py-2 mx-0.5 rounded-xl
        transition-all duration-300 ease-out group
        focus:outline-none
        hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:scale-105 hover:shadow-md cursor-pointer
        ${active ? "text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-600 dark:text-gray-300"}
      `}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay (only for active) */}
      {active && (
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-xl pointer-events-none"></div>
      )}

      {/* Bottom Center Text (only for active) */}
      {active && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
          <span className="text-white text-base font-bold whitespace-nowrap">{category}</span>
        </div>
      )}

      {/* Bottom Indicator (unchanged) */}
      <div
        className={`
          absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full
          transition-all duration-400 ease-out
          ${active ? "w-[70%] opacity-100" : "w-0 opacity-0 group-hover:w-[50%] group-hover:opacity-50"}
        `}
      ></div>
    </div>
  );
};

const categoryGradients = {
  Events: ["#2F4BA2", "#F59E0B"],
  Wedding: ["#2F4BA2", "#F59E0B"],
  Anniversary: ["#EF4444", "#F97316"],
  Birthday: ["#FCD34D", "#D97706"],
};

// ── Category-Specific API Configuration ──
const CATEGORY_SECTIONS_CONFIG = {
  Events: {
    featured: {
      query: "featured=true&sortBy=rating&limit=12&sortOrder=desc&page=1",
      title: "Featured Event Vendors",
      subtitle: "Top-rated vendors for all your events",
    },
    planners: {
      query: "categories=planners&sortBy=rating&limit=12&sortOrder=desc&page=1",
      title: "Event Planners",
      subtitle: "Professional planners for seamless events",
    },
    photographers: {
      query: "categories=photographers&sortBy=rating&limit=12&sortOrder=desc&page=1",
      title: "Event Photographers",
      subtitle: "Capture every moment perfectly",
    },
    venues: {
      query: "categories=venues&sortBy=rating&limit=12&sortOrder=desc&page=1",
      title: "Event Venues",
      subtitle: "Perfect spaces for your gatherings",
    },
    catering: {
      query: "categories=catering&sortBy=rating&limit=12&sortOrder=desc&page=1",
      title: "Caterers",
      subtitle: "Delicious food for your guests",
    },
    djs: {
      query: "categories=djs&sortBy=rating&limit=12&sortOrder=desc&page=1",
      title: "DJs & Entertainment",
      subtitle: "Keep your guests entertained",
    },
    // decorators: {
    //   query: "categories=decorators&sortBy=rating&limit=12&sortOrder=desc&page=1",
    //   title: "Event Decorators",
    //   subtitle: "Transform your venue beautifully",
    // },
  },

  Wedding: {
    featured: {
      query: "featured=true&sortBy=rating&limit=12&sortOrder=desc&page=2",
      title: "Featured Wedding Vendors",
      subtitle: "Top-rated vendors for your special day",
    },
    planners: {
      query: "categories=planners&sortBy=rating&limit=12&sortOrder=desc&page=2",
      title: "Wedding Planners",
      subtitle: "Plan with the best in the business",
    },
    photographers: {
      query: "categories=photographers&sortBy=rating&limit=12&sortOrder=desc&page=2",
      title: "Wedding Photographers",
      subtitle: "Capture your love story",
    },
    venues: {
      query: "categories=venues&sortBy=rating&limit=12&sortOrder=desc&page=2",
      title: "Wedding Venues",
      subtitle: "Find the perfect setting for your big day",
    },
    invitations: {
      query: "categories=invitations&sortBy=rating&limit=12&sortOrder=desc&page=2",
      title: "Wedding Invitations",
      subtitle: "Beautiful invitations for your special day",
    },
    makeup: {
      query: "categories=makeup&sortBy=rating&limit=12&sortOrder=desc&page=2",
      title: "Bridal Makeup Artists",
      subtitle: "Look stunning on your special day",
    },
    mehendi: {
      query: "categories=mehendi&sortBy=rating&limit=12&sortOrder=desc&page=2",
      title: "Mehendi Artists",
      subtitle: "Beautiful henna designs for your celebration",
    },
    catering: {
      query: "categories=catering&sortBy=rating&limit=12&sortOrder=desc&page=2",
      title: "Wedding Caterers",
      subtitle: "Exquisite dining experiences",
    },
    djs: {
      query: "categories=djs&sortBy=rating&limit=12&sortOrder=desc&page=2",
      title: "Wedding DJs",
      subtitle: "Music that makes memories",
    },
  },

  Anniversary: {
    featured: {
      query: "featured=true&sortBy=rating&limit=12&sortOrder=desc&page=3",
      title: "Featured Anniversary Vendors",
      subtitle: "Celebrate your love with the best",
    },
    planners: {
      query: "categories=planners&sortBy=rating&limit=12&sortOrder=desc&page=3",
      title: "Anniversary Planners",
      subtitle: "Make your milestone unforgettable",
    },
    photographers: {
      query: "categories=photographers&sortBy=rating&limit=12&sortOrder=desc&page=3",
      title: "Anniversary Photographers",
      subtitle: "Capture your continued journey",
    },
    dhol: {
      query: "categories=dhol&sortBy=rating&limit=12&sortOrder=desc&page=3",
      title: "Dhol Players",
      subtitle: "Add traditional beats to your celebration",
    },
    venues: {
      query: "categories=venues&sortBy=rating&limit=12&sortOrder=desc&page=3",
      title: "Anniversary Venues",
      subtitle: "Intimate spaces for your celebration",
    },
    makeup: {
      query: "categories=makeup&sortBy=rating&limit=12&sortOrder=desc&page=3",
      title: "Makeup Artists",
      subtitle: "Look radiant for your special day",
    },
    catering: {
      query: "categories=catering&sortBy=rating&limit=12&sortOrder=desc&page=3",
      title: "Anniversary Caterers",
      subtitle: "Fine dining for your celebration",
    },
    // decorators: {
    //   query: "categories=decorators&sortBy=rating&limit=12&sortOrder=desc&page=3",
    //   title: "Decorators",
    //   subtitle: "Romantic ambiance for your day",
    // },
    // florists: {
    //   query: "categories=florists&sortBy=rating&limit=12&sortOrder=desc&page=3",
    //   title: "Florists",
    //   subtitle: "Beautiful flowers for your anniversary",
    // },
  },

  Birthday: {
    featured: {
      query: "featured=true&sortBy=rating&limit=12&sortOrder=desc&page=4",
      title: "Featured Birthday Vendors",
      subtitle: "Make birthdays legendary",
    },
    planners: {
      query: "categories=planners&sortBy=rating&limit=12&sortOrder=desc&page=4",
      title: "Birthday Party Planners",
      subtitle: "Experts in birthday celebrations",
    },
    photographers: {
      query: "categories=photographers&sortBy=rating&limit=12&sortOrder=desc&page=4",
      title: "Birthday Photographers",
      subtitle: "Capture the joy and excitement",
    },
    venues: {
      query: "categories=venues&sortBy=rating&limit=12&sortOrder=desc&page=4",
      title: "Birthday Party Venues",
      subtitle: "Fun spaces for every age",
    },
    // cakes: {
    //   query: "categories=cakes&sortBy=rating&limit=12&sortOrder=desc&page=4",
    //   title: "Cake Designers",
    //   subtitle: "Custom cakes that wow",
    // },
    // decorators: {
    //   query: "categories=decors&sortBy=rating&limit=12&sortOrder=desc&page=4",
    //   title: "Birthday Decorators",
    //   subtitle: "Themed decorations that delight",
    // },
    catering: {
      query: "categories=catering&sortBy=rating&limit=12&sortOrder=desc&page=4",
      title: "Party Caterers",
      subtitle: "Delicious food for all ages",
    },
  },
};

export default function DesktopHomePageWrapper() {
  const { activeCategoryDesktop: activeCategory, setActiveCategoryDesktop: setActiveCategory } = useCategoryStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sections, setSections] = useState(() => {
    const initialCategory = activeCategory || "Wedding";
    const config = CATEGORY_SECTIONS_CONFIG[initialCategory] || CATEGORY_SECTIONS_CONFIG.Wedding;

    return Object.keys(config).reduce((acc, key) => {
      acc[key] = { data: [], loading: true, error: null };
      return acc;
    }, {});
  });

  // Get current category configuration
  const currentCategoryConfig = useMemo(() => {
    const config = CATEGORY_SECTIONS_CONFIG[activeCategory];
    if (!config) {
      console.warn(`Configuration not found for category: ${activeCategory}, using Wedding`);
      return CATEGORY_SECTIONS_CONFIG.Wedding;
    }
    return config;
  }, [activeCategory]);

  // Get section keys for current category
  const currentSectionKeys = useMemo(() => {
    return Object.keys(currentCategoryConfig);
  }, [currentCategoryConfig]);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    const paramCategory = searchParams.get("category");
    if (paramCategory) {
      const formatted = paramCategory.charAt(0).toUpperCase() + paramCategory.slice(1).toLowerCase();
      if (categoryThemes[formatted]) {
        setActiveCategory(formatted);
      }
    }
  }, [searchParams, setActiveCategory]);

  const fetchSection = useCallback(async (key, query, signal) => {
    if (!key || !query) {
      console.error(`Invalid parameters for fetchSection: key=${key}, query=${query}`);
      return;
    }

    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], loading: true, error: null },
    }));

    try {
      const res = await fetch(`/api/vendor?${query}`, { signal });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (!signal?.aborted) {
        setSections((prev) => ({
          ...prev,
          [key]: {
            data: Array.isArray(json?.data) ? json.data : [],
            loading: false,
            error: null,
          },
        }));
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log(`Fetch aborted for ${key}`);
        return;
      }

      console.error(`Error fetching ${key}:`, error);

      if (!signal?.aborted) {
        setSections((prev) => ({
          ...prev,
          [key]: {
            data: [],
            loading: false,
            error: error.message || "Failed to fetch data",
          },
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (!activeCategory || !CATEGORY_SECTIONS_CONFIG[activeCategory]) {
      console.warn(`Invalid category: ${activeCategory}, using default Wedding`);
      return;
    }

    const abortController = new AbortController();
    const categoryConfig = CATEGORY_SECTIONS_CONFIG[activeCategory];

    setSections(
      Object.keys(categoryConfig).reduce((acc, key) => {
        acc[key] = { data: [], loading: true, error: null };
        return acc;
      }, {}),
    );

    const fetchPromises = Object.entries(categoryConfig).map(([key, config]) => {
      if (config?.query) {
        return fetchSection(key, config.query, abortController.signal);
      } else {
        console.warn(`Invalid config for section ${key}:`, config);
        return Promise.resolve();
      }
    });

    Promise.allSettled(fetchPromises).then((results) => {
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const sectionKey = Object.keys(categoryConfig)[index];
          console.error(`Failed to fetch section ${sectionKey}:`, result.reason);
        }
      });
    });

    return () => {
      abortController.abort();
    };
  }, [activeCategory, fetchSection]);

  const handleCategoryChange = (categoryName) => {
    setActiveCategory(categoryName);
    router.push(`?category=${categoryName.toLowerCase()}`, { scroll: false });
  };

  const currentTheme = useMemo(() => {
    const theme = categoryThemes[activeCategory];
    if (!theme) {
      console.warn(`Theme not found for category: ${activeCategory}, using Events theme`);
      return categoryThemes.Events;
    }
    return theme;
  }, [activeCategory]);
  const activeCategoryData = useMemo(() => {
    const data = categoryCards.find((c) => c.name === activeCategory);
    if (!data) {
      console.warn(`Category data not found for: ${activeCategory}, using default`);
      return categoryCards[0];
    }
    return data;
  }, [activeCategory]);

  const cardsData1 = [
    {
      title: `${activeCategory === "Default" ? "Event" : activeCategory} Planner`,
      image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428626/PlannerCat_p16v2m.png",
      link: "/vendors/marketplace/planners",
    },
    {
      title: "Photographer",
      image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428623/PhotographerCat_ymq0vh.png",
      link: "/vendors/marketplace/photographers",
    },
    {
      title: "mehendi",
      image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428620/MehndiCat_hdsxxo.png",
      link: "/vendors/marketplace/mehendi",
    },
    {
      title: "MakeUp",
      image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428617/MakeUpCat_lcp68d.png",
      link: "/vendors/marketplace/makeup",
    },
    {
      title: `${activeCategory} Venues`,
      image:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771518098/Hydra_Category_Wedding_Season-18-11-25_yrbjzq.webp",
      link: "/vendors/marketplace/venues",
    },
    {
      title: "DJs & Sound",
      image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428615/DJCat_hay9fu.png",
      link: "/vendors/marketplace/djs",
    },
    {
      title: "Dhol",
      image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428613/DholCat_swqr0p.png",
      link: "/vendors/marketplace/dhol",
    },
    {
      title: "Caterers",
      image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771428610/CaterorsCat_pch4d5.png",
      link: "/vendors/marketplace/catering",
    },
  ];

  const CarouselHeaderImages = {
    events: {
      featured:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771594539/FeaturedVendorsEventsDesktopCarHeaderCard_efnzy5.avif",
      planners:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771594691/PlannersEventsDesktopCarHeaderCard_g7uva8.png",
      photographers:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771594540/PhotoGrapherEventsDesktopCarHeaderCard_dhs5tk.avif",
      venues:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771594540/VenuesEventsDesktopCarHeaderCard_itlslv.webp",
      makeup:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771594540/MakeUpEventsDesktopCarHeaderCard_z8xdef.avif",
      catering:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772105015/CateringVendorsEventsDesktopCarHeaderCard_wdqf9t.avif",
      djs: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772105012/DjsEventsDesktopCarHeaderCard_oyj1cv.avif",
      decorators:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772105013/DecorsEventsDesktopCarHeaderCard_oek0kn.webp",

      cardsWithBanner1: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771597012/EventsCWB_femplz.webp",
    },
    wedding: {
      featured:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771591300/FeaturedVendorsWeddingDesktopCarHeaderCard_ycnu2l.avif",
      planners:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771517863/plannerWeddingDesktopCarHeaderCard_p38nbw.png",
      photographers:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771591300/PhotoGrapherWeddingDesktopCarHeaderCard_vqbl4p.avif",
      venues:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771591300/VenuesWeddingDesktopCarHeaderCard_n3iamk.webp",
      makeup:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771591300/MakeUpWeddingDesktopCarHeaderCard_bmnfxf.avif",
      catering:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772104867/CateringVendorsWeddingDesktopCarHeaderCard_cvi6cd.avif",
      decorators:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772104866/DecorsWeddingDesktopCarHeaderCard_odfjpx.webp",
      florists:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772104865/floristsWeddingDesktopCarHeaderCard_jfx1fu.avif",
      invitations:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772105152/InvitationsWeddingDesktopCarHeaderCard_cxalqt.avif",
      mehendi: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772105477/MehendiWeddingDesktopCarHeaderCard_doklaf.avif",  

      cardsWithBanner1: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771597043/WeddingCWB_g5s05q.webp",
    },
    anniversary: {
      featured:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771595640/FeaturedVendorsAnniversaryDesktopCarHeaderCard_ah2nd6.avif",
      planners:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771595655/PlannersAnniversaryDesktopCarHeaderCard_hasn0v.png",
      photographers:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771595642/PhotoGrapherAnniversaryDesktopCarHeaderCard_pvczsj.avif",
      venues:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771595641/VenuesAnniversaryDesktopCarHeaderCard_r5eci4.webp",
      makeup:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771595640/MakeUpAnniversaryDesktopCarHeaderCard_ei91ro.avif",
      catering:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772104702/CateringVendorsAnniversaryDesktopCarHeaderCard_k5kwjl.avif",
      decorators:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772104711/DecorsAnniversaryDesktopCarHeaderCard_jgi3d7.webp",
      florists:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772104741/floristsAnniversaryDesktopCarHeaderCard_n5i10s.avif",

      cardsWithBanner1: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771597071/AnniversaryCWB_h9zf4i.webp",
    },
    birthday: {
      featured:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771595843/FeaturedVendorsBirthdayDesktopCarHeaderCard_txxlmq.avif",
      planners:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771595857/PlannersBirthdayDesktopCarHeaderCard_aw3owa.png",
      photographers:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771595846/PhotoGrapherBirthdayDesktopCarHeaderCard_pyxcu6.avif",
      venues:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771595844/VenuesBirthdayDesktopCarHeaderCard_y7mr16.webp",
      makeup:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771595844/MakeUpBirthdayDesktopCarHeaderCard_yqp2u4.avif",
      cakes:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772104510/CakesBirthdayDesktopCarHeaderCard_xcyw37.avif",
      decorators:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772104510/DecorsBirthdayDesktopCarHeaderCard_f7hvtq.webp",
      entertainment:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772104511/EntertainmentGrapherBirthdayDesktopCarHeaderCard_zjvbai.avif",
      catering:
        "https://res.cloudinary.com/dhkkvo36x/image/upload/v1772104510/CateringVendorsBirthdayDesktopCarHeaderCard_xlu8w4.avif",

      cardsWithBanner1: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771597110/BirthdayCWB_xzl9iq.webp",
    },
  };

  const carouselHeaderImagesCategoryWise = useMemo(() => {
    return CarouselHeaderImages[activeCategory.toLowerCase()] || CarouselHeaderImages.wedding;
  }, [activeCategory]);

  // Helper to safely render carousel with category-specific data
  const renderCarouselSection = useCallback(
    (sectionKey, icon, accentColor = "#ec4899") => {
      const sectionData = sections[sectionKey];
      const sectionConfig = currentCategoryConfig[sectionKey];

      if (!sectionData || !sectionConfig) {
        console.warn(`Section ${sectionKey} not configured for category ${activeCategory}`);
        return null;
      }

      return (
        <LandingCarousel
          key={`${activeCategory}-${sectionKey}`}
          title={sectionConfig.title}
          subtitle={sectionConfig.subtitle}
          items={sectionData.data || []}
          isLoading={sectionData.loading}
          error={sectionData.error}
          icon={icon}
          theme={currentTheme}
        />
      );
    },
    [sections, currentCategoryConfig, activeCategory, currentTheme],
  );

  // Helper to render carousel header
  const renderCarouselHeader = useCallback(
    (sectionKey, contentSide = "left") => {
      const sectionConfig = currentCategoryConfig[sectionKey];

      if (!sectionConfig) return null;

      const categoryLower = activeCategory.toLowerCase();
      const headerImages = CarouselHeaderImages[categoryLower] || CarouselHeaderImages.wedding;
      const imageSrc = headerImages[sectionKey] || headerImages.featured;

      return (
        <CarouselHeader
          key={`header-${activeCategory}-${sectionKey}`}
          title={sectionConfig.title}
          description={sectionConfig.subtitle}
          buttonText={`Explore ${sectionConfig.title}`}
          buttonLink={`/vendors/marketplace?${sectionConfig.query.split("&")[0]}`}
          buttonColor={currentTheme?.gradientLight || "#ec4899"}
          imageSrc={imageSrc}
          contentSide={contentSide}
        />
      );
    },
    [currentCategoryConfig, activeCategory, currentTheme],
  );

  return (
    <main className={`relative w-full overflow-x-hidden dark:bg-[#0d1117]`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative z-0 pb-10 ${currentTheme?.bgLight}`}
      >
        {/* <div
          className="absolute inset-0 -z-10 dark:hidden"
          style={{ background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #f59e0b 100%)" }}
        />
        <div
          className="absolute inset-0 -z-10 hidden dark:block"
          style={{ background: "radial-gradient(125% 125% at 50% 90%, #0d1117 40%, #451a03 100%)" }}
        /> */}
        <div className="hidden absolute inset-0 -z-10 dark:block">
          <FloatingLines
            linesGradient={categoryGradients[activeCategory] || categoryGradients.Wedding}
            enabledWaves={["top", "middle", "bottom"]}
          />
        </div>
        {/* ── Hero with overlapping cards ── */}
        <div className="relative z-50 max-w-7xl mx-auto px-4 pt-34">
          {/* Category Cards — 70% width, centered, overlapping main card */}
          <div className="relative z-40 flex justify-center mb-[-44px]">
            <div className="flex items-stretch gap-2 w-[72%] h-[90px]">
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                className="min-w-full min-h-full"
              >
                <div className="flex min-w-full min-h-full gap-2 items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-1.5 shadow-inner border border-gray-200/50 dark:border-gray-700/50">
                  {categoryCards.map((cat) => {
                    const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase();
                    return (
                      <div key={cat.name} onClick={() => handleCategoryChange(cat.name)} className="w-full">
                        <CategoryButton category={cat.name} imageSrc={cat.image} active={isActive} />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Main Content Card ── */}
          <HeroSection activeCategory={activeCategory} theme={currentTheme} categoryData={activeCategoryData} />
        </div>
        <WeddingPlanningTools activeCategory={activeCategory} buttonColor={currentTheme?.gradientLight || "#ec4899"} />
        {/* White merging effect — light mode only */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-22 dark:hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>
      </motion.div>
      {/* ── Rest of Page ── */}

      {/* Dynamic Category-Based Carousels */}
      {currentSectionKeys.includes("planners") && (
        <>
          {renderCarouselHeader("planners", "left")}
          {renderCarouselSection("planners", PersonStanding, "#ec4899")}
        </>
      )}

      {currentSectionKeys.includes("photographers") && (
        <>
          {renderCarouselHeader("photographers", "right")}
          {renderCarouselSection("photographers", Camera, "#ec4899")}
        </>
      )}

      {/* Cards With Banner - Only for certain categories */}
      {(activeCategory === "Events" || activeCategory === "Wedding") && (
        <CardsWithBanner
          heading="Top Categories For You ..."
          contentSide="right"
          backgroundImage={carouselHeaderImagesCategoryWise.cardsWithBanner1}
          cards={cardsData1}
        />
      )}

      {currentSectionKeys.includes("venues") && (
        <>
          {renderCarouselHeader("venues", "left")}
          {renderCarouselSection("venues", MapPin, "#ec4899")}
        </>
      )}

      {currentSectionKeys.includes("makeup") && (
        <>
          {renderCarouselHeader("makeup", "right")}
          {renderCarouselSection("makeup", PersonStanding, "#ec4899")}
        </>
      )}

      {/* Birthday-specific sections */}
      {currentSectionKeys.includes("cakes") && (
        <>
          {renderCarouselHeader("cakes", "left")}
          {renderCarouselSection("cakes", PersonStanding, "#ec4899")}
        </>
      )}

      {currentSectionKeys.includes("decorators") && (
        <>
          {renderCarouselHeader("decorators", "right")}
          {renderCarouselSection("decorators", PersonStanding, "#ec4899")}
        </>
      )}

      {currentSectionKeys.includes("entertainment") && (
        <>
          {renderCarouselHeader("entertainment", "left")}
          {renderCarouselSection("entertainment", PersonStanding, "#ec4899")}
        </>
      )}

      {/* Anniversary-specific sections */}
      {currentSectionKeys.includes("florists") && (
        <>
          {renderCarouselHeader("florists", "right")}
          {renderCarouselSection("florists", PersonStanding, "#ec4899")}
        </>
      )}

      {currentSectionKeys.includes("mehendi") && (
        <>
          {renderCarouselHeader("mehendi", "left")}
          {renderCarouselSection("mehendi", PersonStanding, "#ec4899")}
        </>
      )}

      {currentSectionKeys.includes("dhol") && (
        <>
          {renderCarouselHeader("dhol", "right")}
          {renderCarouselSection("dhol", PersonStanding, "#ec4899")}
        </>
      )}

      {currentSectionKeys.includes("catering") && (
        <>
          {renderCarouselHeader("catering", "right")}
          {renderCarouselSection("catering", PersonStanding, "#ec4899")}
        </>
      )}

      {currentSectionKeys.includes("djs") && (
        <>
          {renderCarouselHeader("djs", "left")}
          {renderCarouselSection("djs", PersonStanding, "#ec4899")}
        </>
      )}

      {currentSectionKeys.includes("invitations") && (
        <>
          {renderCarouselHeader("invitations", "right")}
          {renderCarouselSection("invitations", PersonStanding, "#ec4899")}
        </>
      )}

      {currentSectionKeys.includes("dhol") && (
        <>
          {renderCarouselHeader("dhol", "left")}
          {renderCarouselSection("dhol", PersonStanding, "#ec4899")}
        </>
      )}

      <HowItWorksSection buttonColor={currentTheme?.gradientLight || "#ec4899"} />

      {/* Featured Section - Available in all categories */}
      {currentSectionKeys.includes("featured") && (
        <>
          {renderCarouselHeader("featured", "left")}
          {renderCarouselSection("featured", PersonStanding, "#ec4899")}
        </>
      )}

      <VendorsCatSection buttonColor={currentTheme?.gradientLight || "#ec4899"} />
      <ServicesBanner />
      <Testimonials />
    </main>
  );
}
