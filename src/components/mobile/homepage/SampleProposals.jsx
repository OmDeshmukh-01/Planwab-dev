"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import SmartMedia from "../SmartMediaLoader";

const SampleProposal = ({ category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // Pause on hover/touch
  const timerRef = useRef(null);

  const proposals = [
    {
      id: 1,
      title: `Rahul And Priya's ${category?.toLowerCase() || "Wedding"} Celebration`,
      location: "Enjoyable Moments",
      image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771427948/sampleProposal1_wyzddm.png",
      theme: "Traditional Gold",
    },
    {
      id: 2,
      title: "Our Simple Process for Customers",
      location: "Simplied and Easy Steps",
      image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771427950/sampleProposal2_qhp3vm.png",
      theme: "Floral Pastel",
    },
    {
      id: 3,
      title: "Budget Estimation Process",
      location: "Planned Budget Tracker",
      image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771427952/sampleProposal3_b4pys1.png",
      theme: "Modern Chic",
    },
  ];

  // 1. Professional Strategy: Preload the NEXT image
  // This ensures the image is in the browser cache before the slide happens.
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % proposals.length;
    const img = new Image();
    img.src = proposals[nextIndex].image;
  }, [currentIndex]);

  const paginate = useCallback((newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + proposals.length) % proposals.length);
  }, []);

  const nextSlide = useCallback(() => paginate(1), [paginate]);
  const prevSlide = useCallback(() => paginate(-1), [paginate]);

  // 2. Optimized Auto-Play (Pauses on Interaction)
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, isPaused, nextSlide]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95, // Subtle scale effect for performance perception
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div
      className="py-12 pb-0 pt-2 bg-gradient-to-b from-transparent via-[#FFEFF4]/70 to-[#FFEFF4]/70 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="px-4 lg:px-10 mb-4">
        <h2 className="font-serif text-3xl font-medium text-gray-900 mb-1">Sample Proposals</h2>
        <p className="text-sm text-gray-500">Explore our curated wedding experiences.</p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full px-4 lg:px-10 bg-gradient-to-b from-transparent via-[#FFEFF4]/70 to-[#FFEFF4]/70">
        <div className="relative w-full aspect-[4/2.3] lg:aspect-[21/9] overflow-hidden rounded-xl bg-transparent shadow-sm transform-gpu">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 400, damping: 40 }, // Snappier spring
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7} // Reduced elasticity for faster feel
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -5000) nextSlide();
                else if (swipe > 5000) prevSlide();
              }}
              className="absolute inset-0 w-full h-full"
            >
              {/* 3. Single Source of Truth for Image */}
              <SmartMedia
                src={proposals[currentIndex].image}
                type="image"
                className="w-full h-full object-contain" // Changed to cover for better aesthetic
                loaderImage="/GlowLoadingGif.gif"
                alt={proposals[currentIndex].title}
                priority={true} // Prioritize loading the active slide
              />

              {/* Gradient Overlay for Text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons (Optimized placement) */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
            <NavButton onClick={prevSlide} icon={<ChevronLeft size={20} />} />
            <NavButton onClick={nextSlide} icon={<ChevronRight size={20} />} />
          </div>
        </div>

        {/* Info Section (Stable Height) */}
        <div className="mt-4 min-h-[100px]">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#FAE8B3] text-[#8B5E34] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={10} /> {proposals[currentIndex].theme}
              </span>
            </div>
            <h3 className="text-xl font-serif font-medium text-gray-900 leading-tight mb-1">
              {proposals[currentIndex].title}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
              <span>{proposals[currentIndex].location}</span>
            </div>
          </motion.div>

          {/* Indicators */}
          <div className="flex gap-1.5 mt-4">
            {proposals.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-6 bg-[#C33765]" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoized Button Component to prevent re-renders
const NavButton = React.memo(({ onClick, icon }) => (
  <button
    onClick={(e) => {
      e.stopPropagation(); // Prevent drag interference
      onClick();
    }}
    className="pointer-events-auto bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/40 active:scale-95 transition-all text-white shadow-sm border border-white/10"
  >
    {icon}
  </button>
));

export default SampleProposal;
