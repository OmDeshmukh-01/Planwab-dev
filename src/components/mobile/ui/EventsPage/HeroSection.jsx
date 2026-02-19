"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import SmartMedia from "@/components/mobile/SmartMediaLoader";
import { useParams } from "next/navigation";

const HeroSection = () => {
  const { category } = useParams();
  const heroRef = useRef(null);

  // Video Sources (kept from your original)
  const videoSources = {
    wedding: "https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/assets/goa-new-ph-potrait.mp4",
    anniversary: "https://res.cloudinary.com/dhkkvo36x/video/upload/v1771515806/AnniversaryCatVid_jkx4rz.mp4",
    birthday: "https://res.cloudinary.com/dhkkvo36x/video/upload/v1771515772/BirthdayCatVid_yrqzrd.mp4",
  };

  const categoryKey = category === "Default" ? "wedding" : category?.toLowerCase() || "wedding";
  const currentVideo = videoSources[categoryKey] || videoSources.wedding;
  const displayCategory = category === "Default" ? "Wedding" : category || "Wedding";

  const dynamicLeft =
    categoryKey === "wedding" ? "left-[229px]" : categoryKey === "anniversary" ? "left-[303px]" : "left-[220px]";
  const dynamicLeftSmall =
    categoryKey === "wedding" ? "left-[217px]" : categoryKey === "anniversary" ? "left-[290px]" : "left-[208px]";

  const poster1Url = useMemo(() => {
      switch (categoryKey?.toLowerCase()) {
          case "wedding":
              return "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429802/wedding-poster_gotvxf.jpg";
          case "anniversary":
              return "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429795/anniversary-poster_drhzkh.jpg";
          case "birthday":
              return "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429798/birthday-poster_dmnevd.jpg";
          default:
              return "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429802/wedding-poster_gotvxf.jpg";
      }
  }, [categoryKey]);  

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden" ref={heroRef}>
      {/* 1. Background Video via SmartMedia */}
      <div className="absolute inset-0 z-0">
        <SmartMedia
          type="video"
          src={currentVideo}
          className="w-full h-full"
          objectFit="cover"
          autoPlay={true}
          priority={true}
          poster={poster1Url}
        />
        {/* Original Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* 2. Content Overlay */}
      <div className="absolute bottom-0 left-0 w-full pb-24 px-6 z-10">
        <div className="flex flex-col gap-6">
          {/* Typography */}
          <div className="font-playfair relative flex flex-col gap-2 text-white">
            <span className="text-4xl sm:text-5xl font-light">Crafting Memorable</span>
            <div className="relative inline-block">
              <span className="text-5xl sm:text-6xl font-bold">{displayCategory}</span>

              {/* Original Decorative SVGs */}
              <span className={`absolute -top-1 right-auto ${dynamicLeft} h-6 w-6`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className={`absolute ${dynamicLeftSmall} top-4 h-4 w-4`}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Stats Grid - Mobile Optimized */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md border-t border-white/20 pt-6">
            <div className="text-left">
              <div className="font-moisette font-semibold text-2xl text-white">1k+</div>
              <div className="text-[10px] text-white/80 font-plus-jakarata-sans uppercase tracking-wider">
                Events done
              </div>
            </div>
            <div className="text-left">
              <div className="font-moisette font-semibold text-2xl text-white">4.8/5</div>
              <div className="text-[10px] text-white/80 font-plus-jakarata-sans uppercase tracking-wider">Rating</div>
            </div>
            <div className="text-left">
              <div className="font-moisette font-semibold text-2xl text-white">28k+</div>
              <div className="text-[10px] text-white/80 font-plus-jakarata-sans uppercase tracking-wider">Partners</div>
            </div>
          </div>

          {/* Specific Gradient Button */}
          <Link
            href={`/plan-my-event/${categoryKey}`}
            className="w-full bg-[linear-gradient(to_right,#9A2157,#A1285E,#BC2D6D,#A1285E,#9A2157)] font-plus-jakarata-sans text-lg font-semibold text-white transition-all duration-200 hover:bg-[#7D2049] rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Start {displayCategory} Planning</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </Link>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-2 animate-bounce">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 13L12 18L17 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 6L12 11L17 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
