"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SmartMedia from "@/components/mobile/SmartMediaLoader";

const categoryData = {
  wedding: {
    steps: ["Verified Vendors", "Stunning Venues", "Expert Planners"],
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430671/WeddingDesign_zvgfma.png",
    buttonTheme: "bg-rose-900 hover:bg-rose-950 text-white",
  },
  anniversary: {
    steps: ["Your Love Story", "Our Celebration", "Perfect Anniversaries"],
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430673/AnniversaryDesign_m5cmeq.png",
    buttonTheme: "bg-amber-900 hover:bg-amber-950 text-white",
  },
  birthday: {
    steps: ["No Stress", "Just Fun", "One Click Party"],
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430673/BirthdayDesign_onfg26.png",
    buttonTheme: "bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold",
  },
  default: {
    steps: ["Vendor Booking", "Venue Consultation", "Event Planning"],
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430673/BirthdayDesign_onfg26.png",
    buttonTheme: "bg-slate-700 hover:bg-slate-800 text-white",
  },
};

export default function Banner2({ theme }) {
  const params = useParams();
  const categoryKey = params?.category || "default";
  const currentCategory = categoryData[categoryKey] || categoryData.default;

  return (
    <section className="w-full">
      {/* 1. Gold Gradient Bar (Preserved) */}
      <div id="successful_booking_stats_section">
        <div className="relative flex items-center justify-center bg-[linear-gradient(143deg,#9E7C3D_21.68%,#D0AC6C_78.32%)] dark:bg-[linear-gradient(143deg,#422006_21.68%,#664d27_78.32%)] px-4 py-4 text-center text-sm font-semibold text-white dark:text-amber-100 rounded-xl shadow-md shadow-black/20 ">
          <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-1 divide-x divide-white/40 dark:divide-amber-200/20">
            {currentCategory.steps.map((step, index) => (
              <div key={index} className="pl-4 first:pl-0">
                <p className="whitespace-nowrap">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Visual Banner */}
      {/* Changed h-screen to a rectangular aspect ratio for mobile friendliness */}
      <div className="relative w-full aspect-[3/2.2] bg-gray-100 dark:bg-gray-800">
        <SmartMedia
          src={currentCategory.image}
          type="image"
          alt="Event Banner"
          className="w-full h-full"
          objectFit="cover"
        />

        {/* Bottom Merging Gradient */}
        <div className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-white via-white/80 to-transparent dark:from-black dark:via-black/80"></div>
      </div>
    </section>
  );
}
