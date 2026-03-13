"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchSection from "./SearchSection";
import { carouselImages, heroSideImages } from "../PagesWrapper/HomePageWrapper";
import CategoriesGridSection from "./CategoriesGrid";
import SmartMedia from "../SmartMediaLoader";

export default function HeroSection({ activeCategory, theme, categoryData }) {
  const slides = carouselImages[activeCategory] || carouselImages.Events;
  const sideImage = heroSideImages[activeCategory] || heroSideImages.Events;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  const SLIDE_DURATION = 3500;

  const startAutoPlay = useCallback(() => {
    clearInterval(intervalRef.current);
    clearInterval(progressRef.current);

    if (!isPlaying) return;

    setProgress(0);

    // Progress animation (updates every 50ms for smooth animation)
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + (50 / SLIDE_DURATION) * 100;
      });
    }, 50);

    // Slide change
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, SLIDE_DURATION);
  }, [slides.length, isPlaying]);

  const stopAutoPlay = useCallback(() => {
    clearInterval(intervalRef.current);
    clearInterval(progressRef.current);
  }, []);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (isPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, [startAutoPlay, stopAutoPlay, isPlaying, activeCategory]);

  useEffect(() => {
    setCurrentSlide(0);
    setDirection(1);
  }, [activeCategory]);

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setProgress(0);
    if (isPlaying) startAutoPlay();
  };

  const goNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
    if (isPlaying) startAutoPlay();
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    if (isPlaying) startAutoPlay();
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const sectionBottomImage = useMemo(() => {
    switch (activeCategory.toLowerCase()) {
      case "events":
        return "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430385/eventsSectionBottom_wluswz.png";
      case "wedding":
        return "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430390/weddingSectionBottom_ljso1g.png";
      case "anniversary":
        return "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430373/anniversarySectionBottom_vsstyv.png";
      case "birthday":
        return "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430377/birthdaySectionBottom_qaegfj.png";
      default:
        return "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430382/DholSectionBottom_zqsab2.png";
    }
  }, [activeCategory]);

  return (
    <section className="relative max-w-6xl mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-4xl shadow-2xl border border-white/40 dark:border-gray-700/50 mb-6">
      <div className="overflow-hidden rounded-4xl border-1 border-bl-gray-500 mb-0">
        {/* ═══ Main Split Layout ═══ */}
        <div className="flex h-[410px]">
          {/* ──── LEFT: Carousel + Search ──── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Carousel */}
            <div className="relative flex-1 overflow-hidden group z-40">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={`${activeCategory}-${currentSlide}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 260, damping: 30 },
                    opacity: { duration: 0.25 },
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <SmartMedia
                    src={slides[currentSlide]}
                    alt={`${activeCategory} slide`}
                    className="w-full h-full object-cover"
                    priority={currentSlide === 0} // Priority for first slide
                  />
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              <div className="absolute bottom-2 left-5 z-30 flex items-center">
                {/* Previous Button */}
                <motion.button
                  onClick={goPrev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
                >
                  <svg
                    className="w-5 h-5 text-white dark:text-gray-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>

                {/* Play/Pause Button */}
                <motion.button
                  onClick={togglePlayPause}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
                >
                  {isPlaying ? (
                    <svg
                      className="w-9 h-9 text-white dark:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-white dark:text-gray-200 ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </motion.button>

                {/* Next Button */}
                <motion.button
                  onClick={goNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
                >
                  <svg
                    className="w-5 h-5 text-white dark:text-gray-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>

                {/* Slide Counter */}
                {/* <div className="ml-1 px-2.5 py-1 bg-black/40 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-semibold text-white">
                    {currentSlide + 1} / {slides.length}
                  </span>
                </div> */}
              </div>

              {/* Enhanced Progress Indicator */}
              <div className="absolute bottom-4 right-10 z-20 flex items-center gap-2">
                {slides.map((_, idx) => (
                  <button key={idx} onClick={() => goToSlide(idx)} className="relative group">
                    <motion.div
                      className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                        idx === currentSlide ? "w-8 h-2" : "w-2 h-2"
                      }`}
                      initial={false}
                      animate={{
                        width: idx === currentSlide ? 32 : 8,
                        backgroundColor: idx === currentSlide ? "transparent" : "rgba(255,255,255,0.4)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    >
                      {/* Background track */}
                      {idx === currentSlide && <div className="absolute inset-0 bg-white/30 rounded-full" />}

                      {/* Active progress fill */}
                      {idx === currentSlide && (
                        <motion.div
                          className={`absolute inset-y-0 left-0 rounded-full ${theme.dotBg}`}
                          initial={{ width: "0%" }}
                          animate={{
                            width: isPlaying ? `${progress}%` : `${progress}%`,
                          }}
                          transition={{
                            duration: 0.05,
                            ease: "linear",
                          }}
                        />
                      )}

                      {/* Completed indicator for non-active */}
                      {idx !== currentSlide && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          whileHover={{
                            scale: 1.3,
                            backgroundColor: "rgba(255,255,255,0.8)",
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        />
                      )}
                    </motion.div>

                    {/* Hover tooltip */}
                    <motion.span
                      initial={{ opacity: 0, y: 8 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded whitespace-nowrap pointer-events-none"
                    >
                      {idx + 1}
                    </motion.span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Section */}
            <div className="p-4 pt-3 w-[96%] pb-[13px] border-t border-gray-100/50 dark:border-gray-800/50">
              <SearchSection activeCategory={activeCategory} theme={theme} />
            </div>
          </div>

          {/* ──── RIGHT: Smooth Curved Cut Image ──── */}
          {/* <div className="w-[340px] xl:w-[380px] relative hidden lg:block shrink-0"> */}
          <div className="w-[360px] xl:w-[420px] relative hidden lg:block shrink-0 -ml-12 z-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="absolute inset-0"
                style={{
                  clipPath: `polygon(
    0% 0%, 
    100% 0%,
    100% 100%, 
    0% 100%,
    1% 99%,
    2% 97%,
    3% 94%,
    4% 90%,
    5% 85%,
    6% 79%,
    7% 72%,
    7.5% 65%,
    8% 58%,
    8.3% 52%,
    8.5% 50%,
    8.3% 48%,
    8% 42%,
    7.5% 35%,
    7% 28%,
    6% 21%,
    5% 15%,
    4% 10%,
    3% 6%,
    2% 3%,
    1% 1%
  )`,
                }}
              >
                <SmartMedia
                  src={sideImage}
                  alt={`${activeCategory} hero`}
                  className="w-full h-full object-cover"
                  priority={true} // Always priority - it's hero content
                />

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Floating Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute bottom-5 right-5 z-20"
            >
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl px-4 py-2.5 shadow-xl border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${theme.gradientLight} flex items-center justify-center shrink-0`}>
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight">100+ Events</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Successfully planned</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Photo credit style label */}
            {/* <div className="absolute top-4 right-4 z-20">
              <span className="text-[10px] text-white/60 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                PlanWAB
              </span>
            </div> */}
          </div>
        </div>
      </div>
      <CategoriesGridSection />
  <img
  src={sectionBottomImage}
  alt="BaratsectionBottom"
  loading="lazy"
  decoding="async"
  fetchPriority="low"
  className="absolute bottom-0 left-1/2 -translate-x-1/2 -z-10 pointer-events-none opacity-80" 
  style={{height: activeCategory.toLowerCase() !== "events" ? "100px" : "auto",}}
/>
    </section>
  );
}
