"use client";

import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SmartMedia from "../SmartMediaLoader";
import Link from "next/link";

// --- 1. DATA ---
const QUICK_LINKS = [
  { label: "Venues", key: "venues", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429853/venueQS_jopgvy.png` },
  { label: "Makeup", key: "makeup", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429875/makeupQS_ndqqgp.png` },
  { label: "Photo", key: "photographers", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429887/photographerQS_gum5la.png` },
  { label: "Mehndi", key: "mehendi", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429879/mehndiQS_xymdoq.png` },
  { label: "Decor", key: "decor", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429865/decorQS_dm66uo.png` },
  { label: "Catering", key: "catering", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429861/caterorQS_kf3up5.png` },
  { label: "DJ & Music", key: "djs", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429872/djQS_jpgyjf.png` },
  { label: "Cakes", key: "cake", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429857/cakesQS_nmqtvp.png` },
  { label: "Pandit", key: "pandit", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429883/panditQS_zyo3xh.png` },
  { label: "Dhol", key: "dhol", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429868/dholQS_o7jy79.png` },
  { label: "Planner", key: "planners", src: `https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429850/plannerQS_ghzthx.png` },
];

// --- 2. HELPER HOOKS ---
function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50 };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

// --- 3. SUB-COMPONENTS ---
const ScrollButton = memo(({ onClick, disabled, direction }) => (
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

// --- 4. MAIN COMPONENT ---
const QuickServices = ({ category }) => {
  const scrollRef = useRef(null);
  const haptic = useHapticFeedback();

  // Scroll State
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Scroll Checker Logic
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // Only update state if it actually changed to prevent re-renders
    const newLeft = scrollLeft > 5;
    const newRight = scrollLeft < scrollWidth - clientWidth - 5;

    if (newLeft !== canScrollLeft) setCanScrollLeft(newLeft);
    if (newRight !== canScrollRight) setCanScrollRight(newRight);
  }, [canScrollLeft, canScrollRight]);

  // Event Listeners for Scroll
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    const ref = scrollRef.current;
    if (ref) ref.addEventListener("scroll", checkScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkScroll);
      if (ref) ref.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll]);

  // Smooth Scroll Action
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const BASE_URL = "https://www.theweddingcompany.com";

  return (
    <section className="relative px-4 py-4 pt-1 mt-2 mb-4 bg-transparent rounded-2xl">
      {/* Background Pattern Left - Decorative */}
      <div className="absolute left-0 top-0 z-0 w-[200px] -translate-x-1/2 md:w-[400px] pointer-events-none">
        <SmartMedia
          src={`${BASE_URL}/images/HomePage/new/big-mandala.webp`}
          type="image"
          alt="" // Empty alt for decorative images
          className="aspect-square w-full h-full opacity-50"
          width={400}
          useSkeleton={false}
          height={400}
          loading="lazy"
        />
      </div>

      {/* Background Pattern Right - Decorative */}
      <div className="absolute right-0 top-0 z-0 w-[200px] translate-x-1/2 md:w-[400px] pointer-events-none">
        <SmartMedia
          src={`${BASE_URL}/images/HomePage/new/big-mandala.webp`}
          type="image"
          alt=""
          className="aspect-square w-full h-full opacity-50"
          width={400}
          useSkeleton={false}
          height={400}
          loading="lazy"
        />
      </div>

      {/* Header & Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-5 bg-yellow-400 rounded-full" />
          Quick Services
        </h3>

        {/* Scroll Buttons */}
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

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 no-scrollbar touch-pan-x touch-pan-y will-change-scroll"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch", // Momentum scrolling
        }}
      >
        {QUICK_LINKS.map((item, idx) => (
          <Link
            href={`/vendors/marketplace/${item.key.toLowerCase()}`}
            key={idx}
            onClick={() => haptic("light")}
            className="flex flex-col items-center gap-[16px] min-w-[90px] cursor-pointer group active:scale-95 transition-transform duration-200"
          >
            <div className="w-28 h-28 rounded-2xl overflow-hidden flex items-center justify-center group-hover:bg-blue-100 transition-colors p-1">
              <SmartMedia
                src={`${item.src}`}
                type="image"
                alt={item.label}
                className="w-full h-full object-cove rounded-xl"
                width={112}
                height={112}
                loading="lazy"
              />
            </div>
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap group-hover:text-blue-700 transition-colors text-center">
              {item.label}
            </span>
          </Link>
        ))}

        {/* View All Item */}
        <Link
          href={`/vendors/explore/${category?.toLowerCase() || "all"}`}
          onClick={() => haptic("light")}
          className="flex flex-col items-center gap-[16px] min-w-[90px] cursor-pointer group active:scale-95 transition-transform duration-200"
        >
          <div className="w-28 h-28 rounded-2xl bg-gray-200 flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-200 shadow-lg">
            <div className="flex flex-col items-center gap-1">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full opacity-80"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full opacity-40"></div>
              </div>
              <ChevronRight size={16} className="text-gray-600 opacity-90 mt-1" />
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap group-hover:text-blue-700 transition-colors text-center">
            View All
          </span>
        </Link>

        {/* Spacer for right padding */}
        <div className="w-2 flex-shrink-0" />
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .will-change-scroll {
          will-change: transform;
        }
      `}</style>
    </section>
  );
};

export default memo(QuickServices);
