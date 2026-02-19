"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Users,
  Plus,
  Minus,
  Building2,
  Gift,
  Cake,
  PartyPopper,
  Briefcase,
  Camera,
  Paintbrush2,
  UtensilsCrossed,
  Gem,
  Mail,
  Music,
  UserCheck,
  Shirt,
  Scissors,
  Hand,
  CakeSlice,
} from "lucide-react";
import Link from "next/link";

const allLocations = [
  { name: "Goa", state: "Goa" },
  { name: "Udaipur", state: "Rajasthan" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Delhi NCR", state: "Delhi" },
  { name: "Bangalore", state: "Karnataka" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Lonavla", state: "Maharashtra" },
];
const eventTypeSuggestions = [
  { name: "Wedding", icon: <Users size={20} className="text-rose-500" /> },
  { name: "Anniversary", icon: <Gift size={20} className="text-amber-500" /> },
  { name: "Birthday", icon: <Cake size={20} className="text-blue-500" /> },
  {
    name: "Engagement",
    icon: <PartyPopper size={20} className="text-teal-500" />,
  },
  {
    name: "Corporate Event",
    icon: <Briefcase size={20} className="text-slate-500" />,
  },
];
const vendorCategories = [
  { name: "Venues", icon: <Building2 size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430231/Cat1_vg9cfq.png" },
  { name: "Photographers", icon: <Camera size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430235/Cat2_uchjde.png" },
  { name: "Makeup", icon: <Paintbrush2 size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430239/Cat3_byrnbv.png" },
  { name: "Planners", icon: <UserCheck size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430243/Cat4_unmtrb.png" },
  { name: "Catering", icon: <UtensilsCrossed size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430247/Cat5_dbfwem.png" },
  { name: "Clothes Wear", icon: <Shirt size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430251/Cat6_bver4r.png" },
  { name: "Mehendi", icon: <Hand size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430255/Cat7_zdjl72.png" },
  { name: "Cakes", icon: <CakeSlice size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430259/Cat8_ysvpxa.png" },
  { name: "Jewellery", icon: <Gem size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430264/Cat9_hwvkqb.png" },
  { name: "Invitations", icon: <Mail size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430267/Cat10_vnhyxd.png" },
  { name: "DJs", icon: <Music size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430271/Cat11_vmmhpf.png" },
  { name: "Hairstyling", icon: <Scissors size={20} />, src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430275/Cat12_qumbwk.png" },
];

export default function HeroSection() {
  const { activeCategory, setActiveCategory } = useCategoryStore();
  const [activeField, setActiveField] = useState(null);
  const [eventTypeInput, setEventTypeInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [guestCount, setGuestCount] = useState({ adults: 2, children: 0 });
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setEventTypeInput(activeCategory);
  }, [activeCategory]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldClick = (field) => {
    setActiveField((prev) => (prev === field ? null : field));
    if (field === "event" || field === "location") {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    }
  };
  const totalGuests = guestCount.adults + guestCount.children;
  const handleGuestChange = (type, amount) => {
    setGuestCount((prev) => ({
      ...prev,
      [type]: Math.max(type === "adults" ? 1 : 0, prev[type] + amount),
    }));
  };
  const handleSearch = () => {
    console.log("Searching for:", {
      category: eventTypeInput,
      location: locationInput,
      guests: totalGuests,
    });
  };
  const filteredEventTypes = eventTypeInput
    ? eventTypeSuggestions.filter((type) => type?.name?.toLowerCase()?.includes(eventTypeInput?.toLowerCase()))
    : eventTypeSuggestions;
  const filteredLocations = locationInput
    ? allLocations.filter((loc) => loc?.name?.toLowerCase()?.includes(locationInput?.toLowerCase()))
    : allLocations;
  const dropdownClasses = `absolute w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50 max-h-80 overflow-y-auto bottom-full mb-2`;

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // ADD THIS: After useEffects (around line 110)
  useEffect(() => {
    // Preload category images to prevent loading delay on hover
    vendorCategories.forEach((vendor) => {
      if (vendor.src) {
        const img = new Image();
        img.src = vendor.src;
      }
    });
  }, []); // Run once on mount

  const renderDropdown = () => {
    switch (activeField) {
      case "event":
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={dropdownClasses}
          >
            {filteredEventTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => {
                  setActiveCategory(type.name);
                  setEventTypeInput(type.name);
                  setActiveField(null);
                }}
                className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-3 text-gray-800 dark:text-gray-200"
              >
                {type.icon}
                <span>{type.name}</span>
              </button>
            ))}
          </motion.div>
        );
      case "location":
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={dropdownClasses}
          >
            {filteredLocations.map((loc) => (
              <button
                key={loc.name}
                onClick={() => {
                  setLocationInput(loc.name);
                  setActiveField(null);
                }}
                className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-3 transition-colors"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <Building2 size={18} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{loc.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{loc.state}</p>
                </div>
              </button>
            ))}
          </motion.div>
        );
      case "guests":
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`${dropdownClasses} sm:w-80 sm:right-0`}
          >
            <div className="p-3 space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Adults</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGuestChange("adults", -1)}
                    disabled={guestCount.adults <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-gray-800 dark:text-gray-200"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium text-gray-800 dark:text-gray-200">
                    {guestCount.adults}
                  </span>
                  <button
                    onClick={() => handleGuestChange("adults", 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-gray-800 dark:text-gray-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Children</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGuestChange("children", -1)}
                    disabled={guestCount.children <= 0}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-gray-800 dark:text-gray-200"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium text-gray-800 dark:text-gray-200">
                    {guestCount.children}
                  </span>
                  <button
                    onClick={() => handleGuestChange("children", 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-gray-800 dark:text-gray-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setActiveField(null)}
                className="w-full bg-rose-500 text-white font-semibold py-2 rounded-lg mt-2 hover:bg-rose-600 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 py-12 w-full pt-32">
      <div
        className="absolute inset-0 -z-20 dark:hidden"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #f59e0b 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-20 hidden dark:block"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #0d1117 40%, #451a03 100%)",
        }}
      />
      <motion.div className="relative" variants={heroVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
            Moments that Matter, <span className="text-rose-500 dark:text-rose-400">Made Simple.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400">
            From intimate anniversaries to grand weddings, planWAB is your trusted partner in crafting unforgettable
            celebrations.
          </p>
        </motion.div>

        <motion.div ref={searchRef} variants={itemVariants} className="relative w-full max-w-4xl">
          <div
            className={`bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg p-4 rounded-3xl shadow-xl border border-white/30 dark:border-gray-700/50 transition-all duration-300 ${
              activeField ? "shadow-2xl" : ""
            }`}
          >
            <div className="bg-white/50 dark:bg-gray-800/50 p-2 sm:rounded-full rounded-[26px] flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
              <div className="w-full sm:w-auto flex-1 relative">
                <div
                  onClick={() => handleFieldClick("event")}
                  className="w-full h-16 flex items-center text-left px-6 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-300">Event</p>
                    <input
                      ref={activeField === "event" ? inputRef : null}
                      type="text"
                      placeholder="What are you planning?"
                      className="text-base text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none w-full placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      value={eventTypeInput}
                      onChange={(e) => setEventTypeInput(e.target.value)}
                    />
                  </div>
                </div>
                <AnimatePresence>{activeField === "event" && renderDropdown()}</AnimatePresence>
              </div>
              <div className="hidden sm:block h-8 w-px bg-gray-200/50 dark:bg-gray-700/50"></div>
              <div className="w-full sm:w-auto flex-1 relative">
                <div
                  onClick={() => handleFieldClick("location")}
                  className="w-full h-16 flex items-center text-left px-6 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <MapPin className="text-rose-500 dark:text-rose-400 mr-3 hidden lg:block" size={20} />
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-300">Location</p>
                    <input
                      ref={activeField === "location" ? inputRef : null}
                      type="text"
                      placeholder="Search destinations"
                      className="text-base text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none w-full placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                    />
                  </div>
                </div>
                <AnimatePresence>{activeField === "location" && renderDropdown()}</AnimatePresence>
              </div>
              <div className="hidden sm:block h-8 w-px bg-gray-200/50 dark:bg-gray-700/50"></div>
              <div className="w-full sm:w-auto flex-1 relative">
                <button
                  onClick={() => handleFieldClick("guests")}
                  className="w-full h-16 flex items-center text-left px-6 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Users className="text-rose-500 dark:text-rose-400 mr-3 hidden lg:block" size={20} />
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-300">Guests</p>
                    <p className="text-base text-gray-600 dark:text-gray-300">
                      {totalGuests} guest{totalGuests !== 1 && "s"}
                    </p>
                  </div>
                </button>
                <AnimatePresence>{activeField === "guests" && renderDropdown()}</AnimatePresence>
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center p-3 sm:p-0 sm:w-14 sm:h-14 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                <Search size={24} />
                <span className="sm:hidden ml-2">Search</span>
              </button>
            </div>
            <div className="border-t border-white/30 dark:border-gray-700/50 mx-6 my-4"></div>
            <div className="px-2 pb-1">
              <div className="flex justify-center items-center flex-wrap gap-x-2 sm:gap-x-3 gap-y-2">
                {vendorCategories.map((vendor, index) => (
                  <Link
                    key={index}
                    className="relative group"
                    href={`/vendors/marketplace/${vendor?.name?.toLowerCase()}`}
                  >
                    <div
                      key={vendor.id}
                      className="w-12 h-12 flex items-center justify-center bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-full shadow-sm text-gray-600 dark:text-gray-300 cursor-pointer transition-all duration-300 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:text-rose-500 dark:group-hover:text-rose-400 overflow-hidden"
                      onMouseEnter={() => setHoveredId(vendor.name)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {vendor.src && hoveredId !== vendor.name ? (
                        vendor.icon
                      ) : (
                        <img
                          src={vendor.src}
                          alt={vendor.name}
                          loading="lazy" // ADD THIS
                          decoding="async" // ADD THIS
                          // ADD THIS: Preload on mount to prevent load delay
                          onLoad={(e) => {
                            e.target.dataset.loaded = "true";
                          }}
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      )}
                    </div>
                    <span className="absolute top-full mt-2 w-max left-1/2 -translate-x-1/2 text-xs font-semibold bg-amber-300/70 dark:bg-amber-400/80 text-black dark:text-gray-900 px-2 py-1 rounded-md shadow-lg opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none">
                      {vendor.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
