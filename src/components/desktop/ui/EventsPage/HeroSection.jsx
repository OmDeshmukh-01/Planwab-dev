"use client";

import { useCategoryStore } from "@/GlobalState/CategoryStore";
import React, { useEffect, useRef } from "react";
import Link from "next/link";

const HeroSection = () => {
  const { activeCategory } = useCategoryStore();
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animatedElements = entry.target.querySelectorAll(".animate-on-scroll");
            animatedElements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("opacity-100", "translate-y-0");
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  const videoSources = {
    wedding: {
      desktop: "https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/assets/goa-new-ph.mp4",
      mobile: "https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/assets/goa-new-ph-potrait.mp4",
    },
    anniversary: {
      desktop: "https://res.cloudinary.com/dhkkvo36x/video/upload/v1771429264/AnniversaryCatVid_rpfzch.mp4",
      mobile: "https://res.cloudinary.com/dhkkvo36x/video/upload/v1771515806/AnniversaryCatVid_jkx4rz.mp4",
    },
    birthday: {
      desktop: "https://res.cloudinary.com/dhkkvo36x/video/upload/v1771429266/BirthdayCatVid_ieco0n.mp4",
      mobile: "https://res.cloudinary.com/dhkkvo36x/video/upload/v1771515772/BirthdayCatVid_yrqzrd.mp4",
    },
  };

  const categoryKey = activeCategory?.toLowerCase();
  const currentVideos = videoSources[categoryKey] || videoSources.wedding;

  return (
    <div className="relative h-screen w-full overflow-hidden" ref={heroRef}>
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover dark:opacity-50"
            key={currentVideos.desktop}
          >
            <source src={currentVideos.desktop} type="video/mp4" media="(min-width: 769px)" />
            <source src={currentVideos.mobile} type="video/mp4" media="(max-width: 768px)" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        </div>
      </div>
      <div className="block sm:hidden absolute top-[65%] w-full pt-4 lg:px-48 -translate-y-[65%] lg:transform-none">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-24 px-8">
          <div className="font-playfair relative flex max-w-[600px] flex-col gap-3 text-4xl sm:text-5xl text-white lg:text-[5rem] text-center lg:text-left">
            <span className="inline whitespace-nowrap">Crafting Memorable</span>
            <span className="md:relative md:inline-block">
              Events
              <span className="absolute top-[42px] right-[67px] h-6 w-6">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className="absolute right-[87px] top-[59px] h-4 w-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white"
                  />
                </svg>
              </span>
            </span>
          </div>
          <div className="flex w-full max-w-[400px] lg:min-w-[400px] flex-col items-center gap-6">
            <div className="grid grid-cols-3 gap-8 w-full">
              <div className="text-center">
                <div className="font-moisette font-semibold mb-1 md:mb-2 text-white text-xl md:text-[28px]">1,043+</div>
                <div className="text-xs md:text-sm text-white font-plus-jakarata-sans tracking-wide">Events done</div>
              </div>
              <div className="text-center">
                <div className="font-moisette font-semibold mb-1 md:mb-2 text-white text-xl md:text-[28px]">4.8/5</div>
                <div className="text-xs md:text-sm text-white font-plus-jakarata-sans tracking-wide">google rating</div>
              </div>
              <div className="text-center">
                <div className="font-moisette font-semibold mb-1 md:mb-2 text-white text-xl md:text-[28px]">
                  28,363+
                </div>
                <div className="text-xs md:text-sm text-white font-plus-jakarata-sans tracking-wide">
                  venue partners
                </div>
              </div>
            </div>
            <a
              className="z-10 w-full bg-[linear-gradient(to_right,#9A2157,#A1285E,#BC2D6D,#A1285E,#9A2157)] font-plus-jakarata-sans text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#7D2049] rounded-2xl py-4"
              id="desktop-go-to-planning-section"
              href={`/plan-my-event/${activeCategory?.toLowerCase()}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Start my {activeCategory} planning</span>
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
                  className="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div className="hidden lg:flex w-full justify-center mt-8">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13L12 18L17 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 6L12 11L17 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="hidden sm:block absolute top-[65%] w-full pt-4 lg:px-48">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="relative flex items-start justify-center gap-24 px-8">
          <div className="font-playfair relative flex max-w-[600px] flex-col gap-3 text-5xl text-white lg:text-[5rem]">
            <span className="inline whitespace-nowrap md:text-4xl lg:text-5xl">Crafting Memorable</span>
            <span className="md:relative md:inline-block">
              Events
              <span className="absolute -top-0 right-[1.9em] h-6 w-6">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className="absolute right-[2.1em] top-5 h-4 w-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white"
                  />
                </svg>
              </span>
            </span>
          </div>
          <div className="flex min-w-[400px] flex-col items-center gap-6">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center md:text-start">
                <div className="font-moisette font-semibold md:mb-2 text-white text-xl md:text-[28px]">1,043+</div>
                <div className="text-xs md:text-sm text-white font-plus-jakarata-sans tracking-wide">Events done</div>
              </div>
              <div className="text-center md:text-start">
                <div className="font-moisette font-semibold md:mb-2 text-white text-xl md:text-[28px]">4.8/5</div>
                <div className="text-xs md:text-sm text-white font-plus-jakarata-sans tracking-wide">google rating</div>
              </div>
              <div className="text-center md:text-start">
                <div className="font-moisette font-semibold md:mb-2 text-white text-xl md:text-[28px]">28,363+</div>
                <div className="text-xs md:text-sm text-white font-plus-jakarata-sans tracking-wide">
                  venue partners
                </div>
              </div>
            </div>
            <a
              className="z-10 w-full bg-[linear-gradient(to_right,#9A2157,#A1285E,#BC2D6D,#A1285E,#9A2157)] font-plus-jakarata-sans text-lg font-semibold text-white transition-colors duration-200 hover:bg-[#7D2049] rounded-2xl py-4"
              id="desktop-go-to-planning-section"
              href={`/plan-my-event/${activeCategory?.toLowerCase()}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>Start my {activeCategory} planning</span>
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
                  className="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div className="flex sm:hidden w-full justify-center mt-8">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13L12 18L17 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 6L12 11L17 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
