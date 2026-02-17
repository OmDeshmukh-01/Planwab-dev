"use client";

import { useEffect, useState } from "react";
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
    gradientLight: "#ede9fe",
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
    gradientLight: "#ffe4e6",
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
    gradientLight: "#fef3c7",
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
    gradientLight: "#e0f2fe",
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
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80",
    tagline: "Every occasion, perfectly planned.",
    description: "Discover top vendors and venues for all your celebrations — corporate, social, or personal.",
  },
  {
    name: "Wedding",
    icon: "💒",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
    tagline: "Moments that Matter, Made Simple.",
    description: "From intimate ceremonies to grand celebrations, find the perfect vendors for your big day.",
  },
  {
    name: "Anniversary",
    icon: "💝",
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80",
    tagline: "Celebrate Love, Year After Year.",
    description: "Create unforgettable anniversary celebrations with curated vendors and venues.",
  },
  {
    name: "Birthday",
    icon: "🎂",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80",
    tagline: "Make Every Birthday Legendary.",
    description: "Throw the ultimate birthday bash with the best planners, decorators, and caterers.",
  },
];

// ── Carousel Images per Category ──
export const carouselImages = {
  Events: [
    "/posters/deskHeroCarousel/events.png",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=900&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80",
  ],
  Wedding: [
    "/posters/deskHeroCarousel/wedding.png",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=80",
  ],
  Anniversary: [
    "/posters/deskHeroCarousel/anniversary.png",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80",
  ],
  Birthday: [
    "/posters/deskHeroCarousel/birthday.png",
    "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=900&q=80",
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=900&q=80",
  ],
};

// ── Right-side Hero Images ──
export const heroSideImages = {
  Events: "/posters/deskHeroCarousel/eventsRight.png",
  Wedding: "/posters/deskHeroCarousel/weddingRight.png",
  Anniversary: "/posters/deskHeroCarousel/anniversaryRight.png",
  Birthday: "/posters/deskHeroCarousel/birthdayRight.png",
};

const CategoryButton = ({ category, imageSrc, active }) => {
  const inactiveImages = {
    Wedding: "/WeddingHeaderCard.png",
    Anniversary: "/AnniversaryHeaderCard.png",
    Birthday: "/BirthdayHeaderCard.png",
    Events: "/EventsHeaderCard.png",
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
  Events: ["#2F4BA2", "#F59E0B"], // Blue & Yellow
  Wedding: ["#2F4BA2", "#F59E0B"], // Same as Events
  Anniversary: ["#EF4444", "#F97316"], // Red & Orange
  Birthday: ["#FCD34D", "#D97706"], // Yellow & Golden
};

export default function DesktopHomePageWrapper() {
  const { activeCategoryDesktop: activeCategory, setActiveCategoryDesktop: setActiveCategory } = useCategoryStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sections, setSections] = useState({
    featured: { data: [], loading: true },
    planners: { data: [], loading: true },
    photographers: { data: [], loading: true },
    venues: { data: [], loading: true },
    makeup: { data: [], loading: true },
    catering: { data: [], loading: true },
    djs: { data: [], loading: true },
    mehendi: { data: [], loading: true },
  });

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

  const fetchSection = async (key, query) => {
    try {
      const res = await fetch(`/api/vendor?${query}&limit=12`);
      const json = await res.json();
      setSections((prev) => ({ ...prev, [key]: { data: json.data || [], loading: false } }));
    } catch (e) {
      setSections((prev) => ({ ...prev, [key]: { data: [], loading: false } }));
    }
  };

  useEffect(() => {
    fetchSection("featured", "featured=true&sortBy=rating");
    fetchSection("planners", "categories=planners&sortBy=rating");
    fetchSection("photographers", "categories=photographers&sortBy=rating");
    fetchSection("makeup", "categories=makeup&sortBy=rating");
    fetchSection("venues", "categories=venues&sortBy=rating");
    fetchSection("catering", "categories=catering&sortBy=rating");
    fetchSection("djs", "categories=djs&sortBy=rating");
    fetchSection("mehendi", "categories=mehendi&sortBy=rating");
  }, []);

  const handleCategoryChange = (categoryName) => {
    setActiveCategory(categoryName);
    router.push(`?category=${categoryName.toLowerCase()}`, { scroll: false });
  };

  const currentTheme = categoryThemes[activeCategory] || categoryThemes.Events;
  const activeCategoryData = categoryCards.find((c) => c.name === activeCategory) || categoryCards[1];

  const cardsData1 = [
    {
      title: `${activeCategory === "Default" ? "Event" : activeCategory} Planner`,
      image: "/CardsCatPhotos/PlannerCat.png",
      link: "/vendors/marketplace/planners",
    },
    {
      title: "Photographer",
      image: "/CardsCatPhotos/PhotographerCat.png",
      link: "/vendors/marketplace/photographers",
    },
    {
      title: "mehendi",
      image: "/CardsCatPhotos/MehndiCat.png",
      link: "/vendors/marketplace/mehendi",
    },
    {
      title: "MakeUp",
      image: "/CardsCatPhotos/MakeUpCat.png",
      link: "/vendors/marketplace/makeup",
    },
    {
      title: `${activeCategory} Venues`,
      image: "https://cdn.yesmadam.com/images/live/category/Hydra%20Category_Wedding%20Season-18-11-25.gif",
      link: "/vendors/marketplace/venues",
    },
    {
      title: "DJs & Sound",
      image: "/CardsCatPhotos/DJCat.png",
      link: "/vendors/marketplace/djs",
    },
    {
      title: "Dhol",
      image: "/CardsCatPhotos/DholCat.png",
      link: "/vendors/marketplace/dhol",
    },
    {
      title: "Caterers",
      image: "/CardsCatPhotos/CaterorsCat.png",
      link: "/vendors/marketplace/catering",
    },
  ];

  return (
    <main className={`relative w-full overflow-x-hidden ${currentTheme?.bgLight} dark:bg-[#0d1117]`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-0"
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
            lineCount={[6, 6, 6]}
            lineDistance={[5, 5, 5]}
            topWavePosition={{ x: 2, y: 0.2, rotate: -0.4 }}
            middleWavePosition={{ x: 2, y: 0.0, rotate: 0.2 }}
            bottomWavePosition={{ x: 2.0, y: -0.7, rotate: -1 }}
            animationSpeed={1}
            interactive={true}
            bendRadius={5.0}
            bendStrength={-0.5}
            mouseDamping={0.05}
            parallax={true}
            parallaxStrength={0.2}
            mixBlendMode="screen"
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
                    const isActive = activeCategory === cat.name;
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
      </motion.div>
      {/* ── Rest of Page ── */}
      <WeddingPlanningTools />
      <CarouselHeader
        title={`${activeCategory} Planners`}
        description={`Find the best ${activeCategory.toLowerCase()} planners that will bring your vision to life and keep things running smoothly.`}
        buttonText={`Explore ${activeCategory} Planners`}
        buttonLink={`/vendors/marketplace?categories=planners`}
        imageSrc="https://www.weddingwire.in/assets/img/listing-sector-banner/28.webp"
      />

      <LandingCarousel
        title="Featured Planners"
        subtitle="Plan with the best in the business"
        items={sections.planners.data}
        isLoading={sections.planners.loading}
        icon={PersonStanding}
        accentColor="#ec4899"
      />
      <CarouselHeader
        title={`${activeCategory} Photographers`}
        description={`Find the best ${activeCategory.toLowerCase()} photographers that will bring your vision to life and keep things running smoothly.`}
        buttonText={`Explore ${activeCategory} Photographers`}
        buttonLink={`/vendors/marketplace?categories=photographers`}
        imageSrc="https://www.weddingwire.in/assets/img/listing-sector-banner/28.webp"
        contentSide="right"
      />
      <LandingCarousel
        title="Top Photographers"
        subtitle="Capture your moments"
        items={sections.photographers.data}
        isLoading={sections.photographers.loading}
        icon={Camera}
        accentColor="#ec4899"
      />
      <CardsWithBanner
        heading="Top Categories For You ..."
        contentSide="right"
        backgroundImage="https://images.jdmagicbox.com/standard/shopfront/8fcf090e6e47722f436205eb7d8eee92.jpg"
        cards={cardsData1}
      />
      <CarouselHeader
        title={`${activeCategory} Venues`}
        description={`Find the best ${activeCategory.toLowerCase()} venues that will bring your vision to life and keep things running smoothly.`}
        buttonText={`Explore ${activeCategory} Venues`}
        buttonLink={`/vendors/marketplace?categories=venues`}
        imageSrc="https://www.weddingwire.in/assets/img/listing-sector-banner/28.webp"
        contentSide="left"
      />
      <LandingCarousel
        title="Top Venues"
        subtitle="Find the perfect setting for your event"
        items={sections.venues.data}
        isLoading={sections.venues.loading}
        icon={MapPin}
        accentColor="#ec4899"
      />
      <CarouselHeader
        title={`${activeCategory} Makeup Artists`}
        description={`Find the best ${activeCategory.toLowerCase()} makeup artists that will bring your vision to life and keep things running smoothly.`}
        buttonText={`Explore ${activeCategory} Makeup Artists`}
        buttonLink={`/vendors/marketplace?categories=makeup`}
        imageSrc="https://www.weddingwire.in/assets/img/listing-sector-banner/28.webp"
        contentSide="right"
      />
      <LandingCarousel
        title="Top Makeup Artists"
        subtitle="Look your best with top makeup artists"
        items={sections.makeup.data}
        isLoading={sections.makeup.loading}
        icon={PersonStanding}
        accentColor="#ec4899"
      />
      <HowItWorksSection />
      <CarouselHeader
        title={`${activeCategory} Featured Vendors.`}
        description={`Find the best ${activeCategory.toLowerCase()} vendors that will bring your vision to life and keep things running smoothly.`}
        buttonText={`Explore ${activeCategory} Vendors`}
        buttonLink={`/vendors/marketplace?featured=true`}
        imageSrc="https://www.weddingwire.in/assets/img/listing-sector-banner/28.webp"
        contentSide="left"
      />
      <LandingCarousel
        title="Featured Vendors"
        subtitle="Look your best with top vendors in every category"
        items={sections.featured.data}
        isLoading={sections.featured.loading}
        icon={PersonStanding}
        accentColor="#ec4899"
      />
      <VendorsCatSection />
      <ServicesBanner />
      <Testimonials />
    </main>
  );
}
