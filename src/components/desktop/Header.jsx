"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
import {
  Globe,
  Menu,
  UserCircle,
  ChevronDown,
  Search,
  MapPin,
  User,
  Settings,
  LogOut,
  CreditCard,
  Heart,
  Star,
  X,
  Sun,
  Moon,
  LogIn,
  UserPlus,
  Home,
  Calendar,
  Phone,
  LucideLayoutDashboard,
  SlidersHorizontal,
  Building2,
  Camera,
  Paintbrush2,
  UserCheck,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Mail,
  Music,
  Scissors,
  Lamp,
  Drum,
  MicVocal,
  Sparkles,
  FlameKindling,
  FileText,
  Images,
  Store,
} from "lucide-react";
import { useCategoryStore } from "@/GlobalState/CategoryStore";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useClerk, UserButton, useUser } from "@clerk/nextjs";
import SearchModal, { matchItems, SuggestionList } from "./SearchModal";

const vendorCategories = [
  { key: "venues", label: "Venues", icon: Building2, description: "Banquet halls, hotels, resorts" },
  { key: "photographers", label: "Photographers", icon: Camera, description: "Wedding & event photography" },
  { key: "makeup", label: "Makeup", icon: Paintbrush2, description: "Bridal & party makeup" },
  { key: "planners", label: "Planners", icon: UserCheck, description: "Wedding & event planning" },
  { key: "catering", label: "Catering", icon: UtensilsCrossed, description: "Food & beverage services" },
  { key: "clothes", label: "Clothes", icon: Shirt, description: "Bridal & groom wear" },
  { key: "mehendi", label: "Mehendi", icon: Hand, description: "Mehendi artists" },
  { key: "cakes", label: "Cakes", icon: CakeSlice, description: "Wedding & celebration cakes" },
  { key: "jewellery", label: "Jewellery", icon: Gem, description: "Bridal & fashion jewellery" },
  { key: "invitations", label: "Invitations", icon: Mail, description: "Wedding cards & invites" },
  { key: "djs", label: "DJs", icon: Music, description: "Music & entertainment" },
  { key: "hairstyling", label: "Hairstyling", icon: Scissors, description: "Hair styling services" },
  { key: "decor", label: "Decorators", icon: Lamp, description: "Event decoration services" },
  { key: "dhol", label: "Dhol", icon: Drum, description: "Traditional drum players" },
  { key: "anchor", label: "Anchor", icon: MicVocal, description: "Event anchors and hosts" },
  { key: "stageEntry", label: "Stage Entry", icon: Sparkles, description: "Grand stage entry & concepts" },
  { key: "fireworks", label: "Fireworks", icon: FlameKindling, description: "Fireworks & pyro displays" },
  { key: "barat", label: "Barat", icon: Music, description: "Bands, horses & Barat processions" },
  { key: "other", label: "Other", icon: FileText, description: "Other services" },
];

const CategoryButton = ({ category, imageSrc, active }) => (
  <div
    role="tab"
    aria-selected={active}
    className={`
        relative flex items-center justify-center space-x-2.5 px-4 py-2 mx-0.5 rounded-xl
        transition-all duration-300 ease-out group
        focus:outline-none
        hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:scale-105 hover:shadow-md cursor-pointer
        ${active
        ? "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 shadow-sm"
        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
      }
    `}
  >
    <div className="relative flex items-center justify-center">
      <img
        src={imageSrc}
        alt={`${category} icon`}
        className={`
            object-contain transition-all duration-300 ease-out
            ${active ? "w-9 h-9" : "w-9 h-8 group-hover:w-7 group-hover:h-7"}
        `}
      />
    </div>
    <span
      className={`
        whitespace-nowrap transition-all duration-300 ease-out
        ${active
          ? "text-base font-bold text-gray-900 dark:text-gray-100"
          : "text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 group-hover:font-semibold"
        }
    `}
    >
      {category}
    </span>
    <div
      className={`
        absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full
        transition-all duration-400 ease-out
        ${active ? "w-[70%] opacity-100" : "w-0 opacity-0 group-hover:w-[50%] group-hover:opacity-50"}
    `}
    ></div>
  </div>
);

const PlannerDropdown = ({ isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-6 px-6 z-50 transform transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-top-2">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Become a Planner</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Join our community of professional event planners and start earning
        </p>
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            Start Application
          </button>
          <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

const LocationDropdown = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const cities = [
    "Mumbai, Maharashtra",
    "Delhi, Delhi",
    "Bangalore, Karnataka",
    "Hyderabad, Telangana",
    "Chennai, Tamil Nadu",
    "Kolkata, West Bengal",
    "Pune, Maharashtra",
    "Ahmedabad, Gujarat",
    "Jaipur, Rajasthan",
    "Lucknow, Uttar Pradesh",
    "Kanpur, Uttar Pradesh",
    "Nagpur, Maharashtra",
    "Indore, Madhya Pradesh",
    "Thane, Maharashtra",
    "Bhopal, Madhya Pradesh",
    "Visakhapatnam, Andhra Pradesh",
    "Vadodara, Gujarat",
    "Firozabad, Uttar Pradesh",
    "Ludhiana, Punjab",
    "Rajkot, Gujarat",
    "Agra, Uttar Pradesh",
    "Siliguri, West Bengal",
    "Nashik, Maharashtra",
    "Faridabad, Haryana",
    "Patiala, Punjab",
    "Meerut, Uttar Pradesh",
    "Kalyan-Dombivali, Maharashtra",
    "Vasai-Virar, Maharashtra",
    "Varanasi, Uttar Pradesh",
    "Srinagar, Jammu and Kashmir",
    "Dhanbad, Jharkhand",
    "Jodhpur, Rajasthan",
    "Amritsar, Punjab",
    "Raipur, Chhattisgarh",
    "Allahabad, Uttar Pradesh",
    "Coimbatore, Tamil Nadu",
    "Jabalpur, Madhya Pradesh",
    "Gwalior, Madhya Pradesh",
    "Vijayawada, Andhra Pradesh",
    "Madurai, Tamil Nadu",
  ];
  const filteredCities = cities.filter((city) => city?.toLowerCase().includes(searchTerm?.toLowerCase()));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCity = localStorage.getItem("activeCity");
      if (savedCity) setCurrentCity(savedCity);
    }
  }, []);

  const handleCitySelect = (city) => {
    setCurrentCity(city);
    if (typeof window !== "undefined") localStorage.setItem("activeCity", city);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-4 z-50 transform transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-top-2">
      <div className="px-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" /> Select Your City
        </h3>
        {currentCity && (
          <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-800/60">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-2" /> Current: {currentCity}
            </p>
          </div>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for your city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {filteredCities.map((city, index) => (
          <button
            key={index}
            onClick={() => handleCitySelect(city)}
            className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center ${currentCity === city
              ? "bg-blue-50 dark:bg-blue-900/40 border-r-2 border-blue-500"
              : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
          >
            <MapPin className={`w-4 h-4 mr-3 ${currentCity === city ? "text-blue-500" : "text-gray-400"}`} />
            <span
              className={`${currentCity === city
                ? "text-blue-700 dark:text-blue-300 font-medium"
                : "text-gray-700 dark:text-gray-300"
                }`}
            >
              {city}
            </span>
          </button>
        ))}
      </div>
      {filteredCities.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p>No cities found</p>
        </div>
      )}
    </div>
  );
};

const ProfileDropdown = ({ isOpen }) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!isOpen) return null;
  const menuItems = [
    { icon: User, label: "Profile", href: "/admin/settings" },
    { icon: Heart, label: "Favorites", href: "/" },
    { icon: CreditCard, label: "Billing", href: "/" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
    { icon: LucideLayoutDashboard, label: "Admin Dashboard", href: "/admin/vendors" },
  ];
  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 !z-50 transform transition-all duration-300 ease-out animate-in fade-in-0 slide-in-from-top-2 px-2">
      <SignedIn>
        <div className="flex items-center space-x-2 p-2">
          <img src={user?.imageUrl} alt={user?.fullName} className="w-10 h-10 rounded-xl" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {user?.username || user?.fullName || "User"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </SignedIn>
      <div className="py-2 border-t border-gray-100 dark:border-gray-700 mt-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="w-full px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 flex items-center space-x-3 group rounded-lg"
          >
            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
            <p className="font-medium text-gray-700 dark:text-gray-200">{item.label}</p>
          </Link>
        ))}
      </div>
      <SignedOut>
        <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-gray-700 pt-2 justify-center items-center">
          <SignInButton>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-[90%] px-4 py-3 flex items-center space-x-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors duration-200 group cursor-pointer justify-center"
            >
              <LogIn className="w-5 h-5 text-amber-500 group-hover:text-amber-600 transition-colors" />
              <span className="font-medium text-amber-700 dark:text-amber-300">Login</span>
            </motion.button>
          </SignInButton>
          <SignUpButton>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-[90%] px-4 py-3 flex items-center space-x-3 rounded-xl bg-green-100 dark:bg-green-700/30 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors duration-200 group cursor-pointer justify-center"
            >
              <UserPlus className="w-5 h-5 text-green-500 group-hover:text-green-600 transition-colors" />
              <span className="font-medium text-green-700 dark:text-green-300">Sign Up</span>
            </motion.button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
          <button
            className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/40 transition-all duration-200 flex items-center space-x-3 group rounded-lg"
            onClick={() => signOut()}
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-600" />
            <span className="font-medium text-red-600 dark:text-red-400">Sign out</span>
          </button>
        </div>
      </SignedIn>
    </div>
  );
};

/* ─── Homepage Search Bar ─── */
const HomeSearchBar = ({ onOpen }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = (href) => {
    startTransition(() => router.push(href));
    setShowSuggestions(false);
    setQuery("");
  };

  const handleSearchAll = (q) =>
    navigate(`/vendors/marketplace?search=${encodeURIComponent(q.trim())}`);
  const handleVendorSelect = (cat) =>
    navigate(`/vendors/marketplace/${cat.key}`);
  const handleServiceSelect = (svc) => navigate(svc.href);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed || isPending) return;
    const { vendors, services } = matchItems(trimmed);
    if (services.length === 1 && vendors.length === 0) {
      navigate(services[0].href);
    } else if (vendors.length === 1 && services.length === 0) {
      navigate(`/vendors/marketplace/${vendors[0].key}`);
    } else {
      handleSearchAll(trimmed);
    }
  };

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative w-full max-w-lg"
    >
      {/* Input */}
      <div className={`relative flex items-center transition-all duration-300 ${isFocused ? "scale-[1.02]" : ""}`}>
        <Search
          className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${
            isFocused ? "text-blue-500" : "text-gray-400 dark:text-gray-500"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search vendors, venues, services..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
            if (e.key === "Escape") { setShowSuggestions(false); inputRef.current?.blur(); }
          }}
          className={`w-full pl-11 pr-16 py-2.5 bg-gray-50/80 dark:bg-gray-800/60 border rounded-2xl
            text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
            transition-all duration-300 focus:outline-none cursor-text
            ${
              isFocused
                ? "border-blue-400/70 dark:border-blue-500/60 ring-[3px] ring-blue-500/10 shadow-lg shadow-blue-500/5"
                : "border-gray-200/70 dark:border-gray-700/50 shadow-sm"
            }`}
        />
        <button
          type="button"
          onClick={() => onOpen?.()}
          className={`absolute right-3 px-2 py-1 rounded-lg text-[11px] font-medium tracking-wide transition-all duration-300 ${
            isFocused
              ? "bg-blue-500 text-white"
              : "bg-gray-200/80 dark:bg-gray-700/80 text-gray-400 dark:text-gray-500"
          }`}
        >
          ⌘K
        </button>
      </div>

      {/* Inline suggestion dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl shadow-xl shadow-black/8 dark:shadow-black/30 z-50 overflow-hidden"
          >
            <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
              <SuggestionList
                query={query}
                onVendorSelect={handleVendorSelect}
                onServiceSelect={handleServiceSelect}
                onSearchAll={handleSearchAll}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Sub-Navigation (Homepage only) ─── */
const SubNavigation = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);

  const open = (name) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const close = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const navBtnClass = (name) =>
    `flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none ${activeDropdown === name
      ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
    }`;

  const galleryLinks = [
    { label: "Vendor Gallery", href: "/gallery/vendors", icon: Images },
    { label: "Profile Media", href: "/gallery/profile-media", icon: Camera },
    { label: "Marketplace", href: "/gallery/marketplace", icon: Store },
  ];

  const planningLinks = [
    { label: "Wedding Planning", href: "/events/wedding", icon: Heart },
    { label: "Anniversary Planning", href: "/events/anniversary", icon: Star },
    { label: "Birthday Planning", href: "/events/birthday", icon: CakeSlice },
  ];

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between pb-1">
        {/* Left group: All */}
        <div className="flex items-center">
          <div onMouseEnter={() => open("all")} onMouseLeave={close} className="relative">
            <button className={navBtnClass("all")}>
              <SlidersHorizontal className="w-4 h-4" />
              <span>All</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "all" ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Right group: Vendors, Gallery, Blogs, Planning */}
        <div className="flex items-center gap-6">
          {/* Vendors */}
          <div onMouseEnter={() => open("vendors")} onMouseLeave={close} className="relative">
            <button className={navBtnClass("vendors")}>
              <span>Vendors</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "vendors" ? "rotate-180" : ""
                  }`}
              />
            </button>
          </div>

          {/* Gallery */}
          <div onMouseEnter={() => open("gallery")} onMouseLeave={close} className="relative">
            <button className={navBtnClass("gallery")}>
              <span>Gallery</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "gallery" ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Gallery dropdown — now INSIDE its trigger */}
            <AnimatePresence>
              {activeDropdown === "gallery" && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onMouseEnter={() => open("gallery")}
                  onMouseLeave={close}
                  className="absolute left-0 top-full mt-1 w-60 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 rounded-xl shadow-xl shadow-black/6 dark:shadow-black/30 z-50 py-2"
                >
                  {galleryLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
                    >
                      <item.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Blogs — no dropdown */}
          <Link
            href="/about/blogs"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setActiveDropdown(null);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
          >
            <span>Blogs</span>
          </Link>

          {/* Planning */}
          <div onMouseEnter={() => open("planning")} onMouseLeave={close} className="relative">
            <button className={navBtnClass("planning")}>
              <span>Planning</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "planning" ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Planning dropdown — now INSIDE its trigger */}
            <AnimatePresence>
              {activeDropdown === "planning" && (
                <motion.div
                  key="planning"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onMouseEnter={() => open("planning")}
                  onMouseLeave={close}
                  className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 rounded-xl shadow-xl shadow-black/6 dark:shadow-black/30 z-50 py-2"
                >
                  {planningLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 flex items-center justify-center transition-colors duration-200">
                        <item.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Mega dropdown for All & Vendors ── */}
      <AnimatePresence>
        {(activeDropdown === "all" || activeDropdown === "vendors") && (
          <motion.div
            key="mega"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseEnter={() => open(activeDropdown)}
            onMouseLeave={close}
            className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/80 rounded-2xl shadow-2xl shadow-black/8 dark:shadow-black/30 z-50 p-5"
          >
            <div className="grid grid-cols-4 gap-2">
              {vendorCategories.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/vendors/marketplace/${cat.key}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 flex items-center justify-center transition-colors duration-200">
                    <cat.icon className="w-[18px] h-[18px] text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors duration-200">
                      {cat.label}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Mobile Sidebar (unchanged) ─── */
const MobileSidebar = ({ categories, pathname, onClose, theme, toggleTheme }) => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const { user } = useUser();
  const { signOut } = useClerk();

  const cities = [
    "Mumbai, Maharashtra",
    "Delhi, Delhi",
    "Bangalore, Karnataka",
    "Hyderabad, Telangana",
    "Chennai, Tamil Nadu",
    "Kolkata, West Bengal",
    "Pune, Maharashtra",
    "Ahmedabad, Gujarat",
    "Jaipur, Rajasthan",
    "Lucknow, Uttar Pradesh",
    "Kanpur, Uttar Pradesh",
    "Nagpur, Maharashtra",
    "Indore, Madhya Pradesh",
    "Thane, Maharashtra",
    "Bhopal, Madhya Pradesh",
    "Visakhapatnam, Andhra Pradesh",
    "Vadodara, Gujarat",
    "Firozabad, Uttar Pradesh",
    "Ludhiana, Punjab",
    "Rajkot, Gujarat",
    "Agra, Uttar Pradesh",
    "Siliguri, West Bengal",
    "Nashik, Maharashtra",
    "Faridabad, Haryana",
    "Patiala, Punjab",
    "Meerut, Uttar Pradesh",
    "Kalyan-Dombivali, Maharashtra",
    "Vasai-Virar, Maharashtra",
    "Varanasi, Uttar Pradesh",
    "Srinagar, Jammu and Kashmir",
    "Dhanbad, Jharkhand",
    "Jodhpur, Rajasthan",
    "Amritsar, Punjab",
    "Raipur, Chhattisgarh",
    "Allahabad, Uttar Pradesh",
    "Coimbatore, Tamil Nadu",
    "Jabalpur, Madhya Pradesh",
    "Gwalior, Madhya Pradesh",
    "Vijayawada, Andhra Pradesh",
    "Madurai, Tamil Nadu",
  ];

  const filteredCities = cities.filter((city) => city?.toLowerCase().includes(searchTerm?.toLowerCase()));

  const menuItems = [
    { icon: User, label: "Profile", href: "/admin/settings" },
    { icon: Heart, label: "Favorites", href: "/" },
    { icon: CreditCard, label: "Billing", href: "/" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Calendar, label: "My Events", href: "/my-events" },
    { icon: Phone, label: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCity = localStorage.getItem("activeCity");
      if (savedCity) setCurrentCity(savedCity);
    }
  }, []);

  const handleCitySelect = (city) => {
    setCurrentCity(city);
    if (typeof window !== "undefined") localStorage.setItem("activeCity", city);
    setOpenAccordion(null);
  };

  const toggleAccordion = (accordionName) => {
    setOpenAccordion(openAccordion === accordionName ? null : accordionName);
  };

  return (
    <div className="lg:hidden fixed inset-0 z-[9999]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-gray-900 z-[10000] shadow-2xl flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <span className="text-xl font-bold tracking-tight text-[#f59e0b]">planWAB</span>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                onClick={onClose}
                className="flex items-center space-x-4 p-3 rounded-xl text-md font-semibold transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <item.icon className="w-6 h-6" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="px-4 py-2">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
          </div>

          <div className="p-4 space-y-1">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Event Categories
              </h3>
            </div>
            {categories.map((cat) => {
              const categoryPath = `/events/${cat?.name?.toLowerCase()}`;
              const isActive = pathname === categoryPath || pathname === `/plan-my-event/${cat?.name?.toLowerCase()}`;
              return (
                <Link href={categoryPath} key={cat.name} onClick={onClose}>
                  <div
                    className={`flex items-center space-x-4 p-3 rounded-xl text-md font-semibold transition-all duration-200 ${isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                  >
                    <img src={cat.image} alt={cat.name} className="w-9 h-9" />
                    <span>{cat.name}</span>
                    {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="px-4 py-2">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
          </div>

          <div className="p-4 space-y-2">
            <AccordionButton
              icon={Star}
              label="Become a Planner"
              name="planner"
              openAccordion={openAccordion}
              toggleAccordion={toggleAccordion}
            />
            <AnimatePresence>
              {openAccordion === "planner" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 text-center mt-2 border border-blue-100 dark:border-gray-600">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Start Planning Events</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Join our community and turn your passion into a profession.
                    </p>
                    <div className="space-y-2.5">
                      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                        Start Application
                      </button>
                      <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-all duration-300">
                        Learn More
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AccordionButton
              icon={Globe}
              label="Change Location"
              name="location"
              openAccordion={openAccordion}
              toggleAccordion={toggleAccordion}
            />
            <AnimatePresence>
              {openAccordion === "location" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 mt-2 border border-green-100 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" /> Select Your City
                    </h3>
                    {currentCity && (
                      <div className="mb-3 p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-800/60">
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-2" /> Current: {currentCity}
                        </p>
                      </div>
                    )}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search for your city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {filteredCities.slice(0, 10).map((city, index) => (
                        <button
                          key={index}
                          onClick={() => handleCitySelect(city)}
                          className={`w-full px-3 py-2 text-left transition-all duration-200 flex items-center rounded-lg ${currentCity === city
                            ? "bg-blue-500 text-white shadow-md"
                            : "hover:bg-gray-100 dark:hover:bg-gray-600"
                            }`}
                        >
                          <MapPin className={`w-4 h-4 mr-3 ${currentCity === city ? "text-white" : "text-gray-400"}`} />
                          <span
                            className={`text-sm ${currentCity === city ? "text-white font-medium" : "text-gray-700 dark:text-gray-300"
                              }`}
                          >
                            {city}
                          </span>
                        </button>
                      ))}
                    </div>
                    {filteredCities.length === 0 && (
                      <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        <p>No cities found</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AccordionButton
              icon={UserCircle}
              label="Account"
              name="account"
              openAccordion={openAccordion}
              toggleAccordion={toggleAccordion}
            />
            <AnimatePresence>
              {openAccordion === "account" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 mt-2 border border-purple-100 dark:border-gray-600">
                    <SignedIn>
                      <div className="flex items-center space-x-3 mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                        <img
                          src={user?.imageUrl}
                          alt={user?.fullName || "User"}
                          className="w-12 h-12 rounded-full border-2 border-blue-200 dark:border-blue-400"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{user?.fullName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {menuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                          >
                            <item.icon className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-200 font-medium">{item.label}</span>
                          </Link>
                        ))}
                        <button
                          onClick={() => {
                            signOut();
                            onClose();
                          }}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/40 w-full transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                        >
                          <LogOut className="w-5 h-5 text-red-500" />
                          <span className="text-red-600 dark:text-red-400 font-medium">Sign Out</span>
                        </button>
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                          <UserCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                            Welcome to planWAB
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                            Join us to plan amazing events
                          </p>
                        </div>
                        <div className="space-y-3">
                          <SignInButton>
                            <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                              <LogIn size={20} />
                              <span>Login</span>
                            </button>
                          </SignInButton>
                          <SignUpButton>
                            <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-md">
                              <UserPlus size={20} />
                              <span>Sign Up</span>
                            </button>
                          </SignUpButton>
                        </div>
                      </div>
                    </SignedOut>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <span className="mr-2">🎨</span>
              Theme
            </span>
            <button
              onClick={toggleTheme}
              className={`relative w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 shadow-inner ${theme === "dark"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-blue-300"
                : "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-yellow-200"
                }`}
            >
              <motion.div
                animate={{ x: theme === "dark" ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                {theme === "dark" ? (
                  <Moon size={14} className="text-blue-600" />
                ) : (
                  <Sun size={14} className="text-orange-500" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AccordionButton = ({ icon: Icon, label, name, openAccordion, toggleAccordion }) => (
  <button
    onClick={() => toggleAccordion(name)}
    className={`flex items-center justify-between w-full p-3 rounded-xl text-md font-semibold transition-all duration-200 ${openAccordion === name
      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
      }`}
  >
    <span className="flex items-center space-x-4">
      <Icon className="w-6 h-6" />
      <span>{label}</span>
    </span>
    <motion.div animate={{ rotate: openAccordion === name ? 180 : 0 }} transition={{ duration: 0.2 }}>
      <ChevronDown className="w-5 h-5" />
    </motion.div>
  </button>
);

const categories = [
  { name: "Wedding", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430828/WeddingCat_qz1gdd.png" },
  { name: "Anniversary", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430833/AnniversaryCat_iyr77x.png" },
  { name: "Birthday", image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430838/BirthdayCat_adjjnh.png" },
];

export default function DesktopHeader() {
  const { setActiveCategory } = useCategoryStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isHomePage = pathname === "/";

  const plannerRef = useRef(null);
  const locationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      e.stopPropagation();
      setSearchOpen((prev) => !prev);
    }
  };
  document.addEventListener("keydown", handleKeyDown, { capture: true });
  return () => document.removeEventListener("keydown", handleKeyDown, { capture: true });
}, []);

  useEffect(() => {
    if (document.body) {
      document.body.tabIndex = -1;
      document.body.focus({ preventScroll: true });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentCategory = categories.find(
      (cat) =>
        pathname.startsWith(`/events/${cat?.name?.toLowerCase()}`) ||
        pathname.startsWith(`/plan-my-event/${cat?.name?.toLowerCase()}`),
    );
    if (currentCategory) {
      setActiveCategory(currentCategory.name);
    }
  }, [pathname, setActiveCategory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        plannerRef.current &&
        !plannerRef.current.contains(event.target) &&
        locationRef.current &&
        !locationRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 !z-[40] transition-all duration-500 ease-out rounded-b-xl ${isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl"
          : `${isHomePage ? "bg-white/40 dark:bg-transparent" : "bg-white dark:bg-gray-800"}`
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Row 1: Logo / Search or Categories / Actions ── */}
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex items-center space-x-2 cursor-pointer group transition-all duration-400 ease-out hover:scale-110"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="relative">
                  <Image
                    src="/planwablogo.png"
                    alt="PlanWAB Logo"
                    width={38}
                    height={38}
                    className={`transition-all duration-400 ease-out mix-blend-multiply dark:mix-blend-normal dark:brightness-110 ${isHovered ? "rotate-12 scale-110" : ""
                      }`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/38x38/FDE2E8/C1284A?text=P";
                    }}
                  />
                </div>
                <span
                  className={`text-2xl font-bold tracking-tight transition-all duration-400 ease-out bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-[#f59e0b] dark:text-transparent ${isHovered ? "scale-105" : ""
                    }`}
                >
                  planWAB
                </span>
              </Link>
            </div>

            {/* Center: Search bar on home, Category tabs otherwise */}
            <div className="hidden lg:flex flex-1 justify-center items-center h-full max-w-lg">
              <AnimatePresence mode="wait">
                {isHomePage ? (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <HomeSearchBar onOpen={() => setSearchOpen(!searchOpen)} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-1.5 shadow-inner border border-gray-200/50 dark:border-gray-700/50">
                      {categories.map((cat) => {
                        const categoryPath = `/events/${cat?.name?.toLowerCase()}`;
                        const isActive =
                          pathname === categoryPath || pathname === `/plan-my-event/${cat?.name?.toLowerCase()}`;
                        return (
                          <Link href={categoryPath} key={cat.name} passHref>
                            <CategoryButton category={cat.name} imageSrc={cat.image} active={isActive} />
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg cursor-pointer"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="relative" ref={plannerRef}>
                <button
                  onClick={() => handleDropdownToggle("planner")}
                  className="flex items-center space-x-1 font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-xl px-4 py-2.5 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
                >
                  <span>Become a Planner</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${openDropdown === "planner" ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <PlannerDropdown isOpen={openDropdown === "planner"} />
              </div>
              <div className="relative" ref={locationRef}>
                <button
                  onClick={() => handleDropdownToggle("location")}
                  className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg hover:rotate-12 cursor-pointer"
                >
                  <Globe size={20} />
                </button>
                <LocationDropdown isOpen={openDropdown === "location"} onClose={() => setOpenDropdown(null)} />
              </div>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => handleDropdownToggle("profile")}
                  className="flex items-center space-x-2.5 border border-gray-300 dark:border-gray-700 rounded-2xl p-1.5 pl-3 pr-2 shadow-lg hover:shadow-xl transition-all duration-400 ease-out hover:scale-105 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-white hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600"
                >
                  <Menu size={16} className="text-gray-700 dark:text-gray-300 cursor-pointer" />
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                    <SignedOut>
                      <UserCircle className="w-5 h-5 text-gray-300" />
                    </SignedOut>
                  </div>
                </button>
                <ProfileDropdown isOpen={openDropdown === "profile"} />
              </div>
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* ── Row 2: Sub-navigation (homepage only, desktop only) ── */}
          <AnimatePresence>
            {isHomePage && (
              <motion.div
                key="subnav"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="hidden lg:block overflow-visible pt-0"
              >
                <SubNavigation />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom gradient line */}
        <div
          className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent transition-all duration-500 ease-out ${isScrolled ? "opacity-100 scale-x-100" : "opacity-0 scale-x-50"
            }`}
        ></div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileSidebar
            categories={categories}
            pathname={pathname}
            onClose={() => setIsMobileMenuOpen(false)}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </AnimatePresence>
      <SearchModal externalOpen={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
