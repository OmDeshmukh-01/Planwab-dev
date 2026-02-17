"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// Utility to capitalize first letter for the category
const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || "";

const FeaturedCard = ({ item }) => {
  // Determine background image based on type (mimicking the original CSS classes)
  const bgImage =
    item.backgroundType === "venues"
      ? "https://images.unsplash.com/photo-1595407753234-0882f1e77954?w=600&q=80"
      : item.backgroundType === "vendors"
      ? "/CardsCatPhotos/PlannerCat.png"
      : "https://images.unsplash.com/photo-1595407753234-0882f1e77954?w=600&q=80"; // Fallback/Unsplash

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      // .featured-card-tile mapping:
      // relative w-full h-[180px] md:h-[200px] rounded-lg overflow-hidden shadow
      className="relative w-full h-[180px] md:h-[200px] rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      // The original parent had a background, but the child covers it. 
      // We keep the structure intact.
    >
      {/* .featured-card-tile__background */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* .featured-card-tile__path - absolute left-[25px] top-0 bottom-0 width-[40px] */}
        <div className="absolute left-[25px] top-0 bottom-0 w-[40px]">
          {/* .featured-card-tile__path-desktop - block h-full w-auto */}
          <svg
            className="hidden lg:block h-full w-auto"
            height="300"
            viewBox="0 0 7 30"
          >
            <path d="M 0 0 L 3 0 Q 7 4 7 11 Q 7 20 0 30 Z" fill="white"></path>
          </svg>
          {/* .featured-card-tile__path-mobile - display:none (as per original CSS) */}
          <svg
            className="hidden"
            width="300"
            viewBox="0 0 30 2"
          >
            <path d="M 0 2 L 0 1 Q 4 0 12 0 Q 21 0 30 2 Z" fill="white"></path>
          </svg>
        </div>
      </div>

      {/* .featured-card-tile__content */}
     <div className="absolute top-0 left-0 bottom-0 w-[55%] bg-white p-5 flex flex-col justify-center items-start">
        <h3 className="text-[18px] font-bold text-[#333] m-0 mb-2">
          {item.title}
        </h3>
        <p className="text-[13px] text-[#666] m-0 mb-4 leading-[1.4]">
          {item.description}
        </p>
        <Link
          href={item.linkHref}
          className="px-5 py-2 bg-[#d6536d] text-white text-[13px] font-semibold rounded shadow-sm hover:bg-[#b03d55] transition-colors duration-200"
        >
          {item.linkText}
        </Link>
      </div>
    </motion.div>
  );
};

const SimpleCard = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      // .simple-card-tile mapping
      className="relative w-full h-[148px] md:h-[148px] bg-white rounded-lg p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex flex-col"
    >
      {/* .simple-card-tile__content */}
      <div className="flex-1">
        {/* .simple-card-tile__title */}
        <h3 className="text-[15px] font-bold text-[#333] m-0 mb-2 leading-[1.3]">
          {item.title}
        </h3>
        {/* .simple-card-tile__description */}
        <p className="text-[12px] text-[#666] m-0 mb-3 leading-[1.4]">
          {item.description}
        </p>
        {/* .simple-card-tile__link */}
        <Link
          href={item.linkHref}
          className="text-[12px] font-semibold text-[#d6536d] no-underline hover:underline"
        >
          {item.linkText}
        </Link>
      </div>
      {/* .simple-card-tile__icon */}
      <Image
        className="absolute bottom-4 right-4 opacity-80"
        src={item.icon}
        alt={item.iconAlt}
        width={56}
        height={56}
      />
    </motion.div>
  );
};

export default function WeddingPlanningTools({ heading, description }) {
  const params = useParams();
  
  // Default to "Wedding" if category param is missing, otherwise capitalize the param
  const categoryName = params?.category 
    ? capitalize(decodeURIComponent(params.category)) 
    : "Wedding";

  // Dynamic Data Construction
  const dynamicData = [
    {
      id: 1,
      type: "featured",
      title: `${categoryName} Planners`, // Dynamic title
      description: "Find the top-rated planners near you in every category.",
      linkText: "Start your search",
      linkHref: "/vendors/marketplace/planners",
      backgroundType: "vendors", // Maps to vendors image
    },
    {
      id: 2,
      type: "featured",
      title: "Birthday Celebration",
      description: "Plan the perfect birthday bash with our curated vendors.",
      linkText: "Explore options",
      linkHref: "/events/birthday/birthday-planner",
      backgroundType: "venues", // Using venues image for visual variety
    },
    {
      id: 3,
      type: "simple",
      title: "Venues",
      description: "Photos, reviews, and so much more... get in touch from here!",
      linkText: "Explore venues",
      linkHref: "/vendors/marketplace/venue",
      icon: "https://cdn1.weddingwire.in/assets/svg/original/illustration/websites.svg", // Reusing an icon for demo
      iconAlt: "illustration venues",
    },
    {
      id: 4,
      type: "simple",
      title: "Explore all categories",
      description: "Find vendors in every category with all popular vendors.",
      linkText: "explore here",
      linkHref: "/vendors/explore/events",
      icon: "https://cdn1.weddingwire.in/assets/svg/original/illustration/lightbulb.svg",
      iconAlt: "illustration lightbulb",
    },
    {
      id: 5,
      type: "simple",
      title: "Planning tools",
      description: "Custom planning tools to manage your checklist, budget, guests and vendors.",
      linkText: "Discover our tools",
      linkHref: "/events/events/planning-tools",
      icon: "https://cdn1.weddingwire.in/assets/svg/original/illustration/notebook.svg",
      iconAlt: "illustration notebook",
    },
  ];

  return (
    // .home-tools-section mapping: padding: 40px 0 (mobile) -> 60px 0 (tablet+), bg #f8f8f8
    <section className="py-[40px] pt-0 md:pt-8 md:py-[60px] pb-3 md:pb-3">
      
      {/* Container for cards - max-w-4xl mx-auto (from original HTML) + padding mappings */}
      {/* Original CSS .home-tools-section__cards: px-4 (16px), md:px-10 (40px), lg:px-[60px] */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 lg:px-[60px]">
        
        {/* .home-tools-section__cards-container mapping */}
        {/* Grid setup: 1 col (mobile), 2 cols (tablet), 6 cols (desktop) */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5" 
          role="list"
        >
          {dynamicData.map((item, index) => {
            // Calculate column spans to match original CSS nth-child logic
            
            // First 2 items (Featured) span 3 cols on desktop
            // Next 3 items (Simple) span 2 cols on desktop
            let colSpanClass = "";
            if (index === 0 || index === 1) {
              colSpanClass = "lg:col-span-3";
            } else {
              colSpanClass = "lg:col-span-2";
            }

            return (
              <div 
                key={item.id} 
                className={`w-full ${colSpanClass}`} 
                role="listitem"
              >
                {item.type === "featured" ? (
                  <FeaturedCard item={item} />
                ) : (
                  <SimpleCard item={item} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}