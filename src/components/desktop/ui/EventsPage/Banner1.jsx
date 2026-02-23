"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const categoryData = {
    wedding: {
        steps: ["Verified Vendors", "Stunning Venues", "Expert Planners"],
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430671/WeddingDesign_zvgfma.png",
        buttonTheme: "bg-rose-900 hover:bg-rose-950 dark:bg-rose-800 dark:hover:bg-rose-700 text-white",
    },
    anniversary: {
        steps: ["Your Love Story", "Our Celebration", "Perfect Anniversaries"],
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430673/AnniversaryDesign_m5cmeq.png",
        buttonTheme: "bg-amber-900 hover:bg-amber-950 dark:bg-amber-800 dark:hover:bg-amber-700 text-white",
    },
    birthday: {
        steps: ["No Stress, Just Fun", "Let Us Plan the Party!", "One Click to Your Perfect Party"],
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430673/BirthdayDesign_onfg26.png",
        buttonTheme: "bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold",
    },
    default: {
        steps: ["Vendor Booking", "Venue Consultation", "Event Planning"],
        image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430673/BirthdayDesign_onfg26.png",
        buttonTheme: "bg-slate-700 hover:bg-slate-800 text-white",
    },
};

export default function Banner1() {
    const params = useParams();
    const categoryKey = params.category || "default";
    const currentCategory = categoryData[categoryKey] || categoryData.default;

    return (
        <>
            <div id="successful_booking_stats_section">
                <div className="relative flex items-center justify-center bg-[linear-gradient(143deg,#9E7C3D_21.68%,#D0AC6C_78.32%)] dark:bg-[linear-gradient(143deg,#422006_21.68%,#664d27_78.32%)] px-4 py-4 text-center text-sm font-semibold text-white dark:text-amber-100 lg:py-6 lg:text-xl">
                    <div className="flex flex-col sm:flex-row items-center sm:divide-x divide-white/40 dark:divide-amber-200/20 gap-2 sm:gap-0">
                        {currentCategory.steps.map((step, index) => (
                            <div key={index} className="px-4">
                                <p>{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <section
                className="relative h-screen w-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${currentCategory.image})` }}
            >
                {/* Bottom Merging Gradient */}
                <div className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-white to-transparent dark:from-slate-900"></div>

                {/* Button Container */}
                <div className="absolute inset-0 flex items-end justify-center w-[61%] pb-12 md:pb-16 lg:pb-20">
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                        <Link href={`/plan-my-event/${categoryKey}`} className={`px-8 py-3 rounded-full text-base font-semibold shadow-xl transition-transform duration-300 hover:scale-105 ${currentCategory.buttonTheme}`}>
                            Book Now
                        </Link>
                        <Link href={`/vendors/marketplace/${categoryKey}`} className={`px-8 py-3 rounded-full text-base font-semibold shadow-xl transition-transform duration-300 hover:scale-105 ${currentCategory.buttonTheme}`}>
                            Explore vendors
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}