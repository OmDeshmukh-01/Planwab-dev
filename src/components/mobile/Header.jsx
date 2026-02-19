"use client";

import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  useMemo,
  memo,
  useCallback,
  useTransition,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ChevronDown,
  Search,
  MapPin,
  X,
  Navigation,
  SlidersHorizontal,
  Home,
  Briefcase,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import SmartMedia from "./SmartMediaLoader";
import { toast } from "sonner";
import { useNavbarVisibilityStore } from "../../GlobalState/navbarVisibilityStore";

const POPULAR_CITIES = [
  { id: 1, name: "New Delhi", state: "Delhi", icon: "🏛️" },
  { id: 2, name: "Mumbai", state: "Maharashtra", icon: "🌊" },
  { id: 3, name: "Bangalore", state: "Karnataka", icon: "💻" },
  { id: 4, name: "Gurgaon", state: "Haryana", icon: "🏢" },
  { id: 5, name: "Pune", state: "Maharashtra", icon: "🎓" },
  { id: 6, name: "Hyderabad", state: "Telangana", icon: "🍛" },
];

const SAVED_ADDRESSES = [
  {
    id: "home",
    label: "Home",
    address: "B-204, Ashoka Apartments",
    area: "Sector 18, Rohini",
    city: "New Delhi, Delhi 110085",
    icon: Home,
  },
  {
    id: "work",
    label: "Work",
    address: "Tower B, 5th Floor",
    area: "DLF Cyber Hub",
    city: "Gurgaon, Haryana 122002",
    icon: Briefcase,
  },
];

const TABS_CONFIG = [
  {
    id: "Wedding",
    label: "Wedding",
    styles: "bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430828/WeddingCat_qz1gdd.png",
    src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429996/WeddingHeaderCard_vslgmt.png",
    placeholders: ["Wedding Venues", "Bridal Makeup", "Mehndi Artists"],
  },
  {
    id: "Anniversary",
    label: "Anniversary",
    styles: "bg-gradient-to-r from-gray-900 via-pink-700 to-gray-900",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430833/AnniversaryCat_iyr77x.png",
    src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429999/AnniversaryHeaderCard_garm4n.png",
    placeholders: ["Romantic Dinner", "Flower Bouquets", "Couple Spa"],
  },
  {
    id: "Birthday",
    label: "Birthday",
    styles: "bg-gradient-to-r from-gray-900 via-yellow-600 to-gray-900",
    image: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771430838/BirthdayCat_adjjnh.png",
    src: "https://res.cloudinary.com/dhkkvo36x/image/upload/v1771429994/BirthdayHeaderCard_nat4mj.png",
    placeholders: ["Birthday Cakes", "Party Decor", "Event Planners"],
  },
];

const SORT_OPTIONS = [
  { id: "rating", label: "Top Rated", description: "Highest rated first", icon: "⭐" },
  { id: "price-asc", label: "Budget Friendly", description: "Lowest price first", icon: "💰" },
  { id: "price-desc", label: "Premium", description: "Highest price first", icon: "👑" },
  { id: "bookings", label: "Most Popular", description: "Most booked", icon: "🔥" },
  { id: "newest", label: "Newly Added", description: "Recently listed", icon: "✨" },
];

const SCROLL_DELTA = 8;
const SCROLL_TRIGGER = 200;

function useHapticFeedback() {
  return useCallback((type = "light") => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const patterns = { light: 10, medium: 25, heavy: 50, success: [10, 50, 10] };
      navigator.vibrate(patterns[type] || 10);
    }
  }, []);
}

const SearchPlaceholderTicker = memo(({ placeholders }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

  return (
    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[13px] font-semibold text-white/70 w-full truncate will-change-transform"
        >
          Search &ldquo;{placeholders[index]}&rdquo;...
        </motion.span>
      </AnimatePresence>
    </div>
  );
});
SearchPlaceholderTicker.displayName = "SearchPlaceholderTicker";

const CategoryButton = memo(({ category, imageSrc, active, onClick, styles, src }) => (
  <div
    role="button"
    onClick={onClick}
    className={`
      relative flex-1 h-12 mx-0.5 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer transform-gpu
      ${active ? `flex items-center justify-center space-x-1 px-3 ${styles}` : "bg-gray-100"}
    `}
  >
    {active ? (
      <>
        <div className="relative flex items-center justify-center z-10 shrink-0 pb-2">
          <img
            src={imageSrc}
            alt={category}
            className={`object-contain ${category === "Anniversary" ? "w-7 h-9" : "w-10 h-15"}`}
            loading="eager"
          />
        </div>
        <span className="whitespace-nowrap text-sm font-bold text-white z-10 truncate">
          {category}
        </span>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-white/50 rounded-full w-[70%] z-10" />
      </>
    ) : (
      <div className="absolute inset-0 w-full h-full opacity-80 grayscale-[0.3]">
        <SmartMedia
          src={src}
          type="image"
          alt={category}
          className="w-full h-full object-cover"
          width={100}
          height={50}
        />
      </div>
    )}
  </div>
));
CategoryButton.displayName = "CategoryButton";

const AddressDrawer = memo(({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[80] h-[75vh] flex flex-col shadow-2xl overflow-hidden will-change-transform"
          >
            <div className="px-5 pt-4 pb-2 bg-white sticky top-0 z-10">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Select Location
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="relative mb-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for area, street name..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-8 overscroll-contain">
              <button className="w-full flex items-center gap-4 p-4 mt-2 rounded-2xl bg-blue-50 border border-blue-100 active:scale-[0.98] transition-transform">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Navigation size={20} className="fill-current" />
                </div>
                <div className="text-left">
                  <p className="text-blue-900 font-bold text-sm">Use Current Location</p>
                  <p className="text-xs text-blue-600/80 font-medium">Using GPS</p>
                </div>
              </button>

              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  Saved Addresses
                </p>
                <div className="space-y-3">
                  {SAVED_ADDRESSES.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        onSelect(addr);
                        onClose();
                      }}
                      className="w-full flex items-start gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 text-left transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <addr.icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{addr.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{addr.area}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  Popular Cities
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        onSelect({
                          label: city.name,
                          area: "City Center",
                          city: city.name,
                          id: city.id,
                        });
                        onClose();
                      }}
                      className="flex flex-col items-center gap-2 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 active:scale-95 transition-all"
                    >
                      <span className="text-2xl filter drop-shadow-sm">{city.icon}</span>
                      <span className="text-[11px] font-bold text-gray-700">{city.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
AddressDrawer.displayName = "AddressDrawer";

const FilterModal = memo(({ isOpen, onClose, selectedSort, onSortChange, onApply }) => {
  const haptic = useHapticFeedback();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[80] max-h-[70vh] flex flex-col shadow-2xl will-change-transform"
          >
            <div className="px-5 pt-4 pb-3 border-b border-gray-100">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Sort & Filter</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Choose your preference
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedSort !== "rating" && (
                    <button
                      onClick={() => {
                        haptic("light");
                        onSortChange("rating");
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 active:scale-95 transition-all"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Sort By
              </p>
              <div className="space-y-2">
                {SORT_OPTIONS.map((option) => (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      haptic("light");
                      onSortChange(option.id);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      selectedSort === option.id
                        ? "bg-blue-50 border-blue-500 shadow-sm"
                        : "bg-white border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                        selectedSort === option.id ? "bg-blue-100 scale-110" : "bg-gray-50"
                      }`}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className={`font-bold text-sm ${
                          selectedSort === option.id ? "text-blue-900" : "text-gray-900"
                        }`}
                      >
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {option.description}
                      </p>
                    </div>
                    {selectedSort === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  haptic("success");
                  onApply();
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 active:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
              >
                <span>Apply Filter</span>
                {selectedSort !== "rating" && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {SORT_OPTIONS.find((opt) => opt.id === selectedSort)?.label}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
FilterModal.displayName = "FilterModal";

const HeaderLogic = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const haptic = useHapticFeedback();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const stickyRef = useRef(false);

  const { setIsNavbarVisible } = useNavbarVisibilityStore();

  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(SAVED_ADDRESSES[0]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("rating");

  const activeTabId = searchParams.get("category");
  const currentTab = useMemo(
    () => TABS_CONFIG.find((t) => t.id === activeTabId) || TABS_CONFIG[0],
    [activeTabId]
  );
  const isHomePage = pathname === "/m" || pathname === "/";

  const buildMarketplaceUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", encodeURIComponent(searchQuery.trim()));
    }
    if (selectedSort && selectedSort !== "rating") {
      params.set("sortBy", selectedSort);
    }
    const queryString = params.toString();
    return queryString ? `/vendors/marketplace?${queryString}` : "/vendors/marketplace";
  }, [searchQuery, selectedSort]);

  const handleSearchSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      if (!searchQuery.trim()) {
        toast.error("Search is empty", {
          description: "Please enter something to search",
        });
        return;
      }
      haptic("medium");
      const redirectUrl = buildMarketplaceUrl();
      toast.loading("Searching...", { id: "search-loading" });
      startTransition(() => {
        router.push(redirectUrl);
      });
    },
    [searchQuery, router, haptic, buildMarketplaceUrl, startTransition]
  );

  useEffect(() => {
    if (!isPending) {
      toast.dismiss("search-loading");
    }
  }, [isPending]);

  const handleApplyFilters = useCallback(() => {
    haptic("success");
    setIsFilterModalOpen(false);
    setIsNavbarVisible(true);
    const selectedOption = SORT_OPTIONS.find((opt) => opt.id === selectedSort);
    toast.success("Filter Applied", {
      description: `Sorted by: ${selectedOption?.label || "Default"}`,
      duration: 2000,
    });
  }, [haptic, selectedSort, setIsNavbarVisible]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const delta = latest - previous;
    lastScrollY.current = latest;

    if (latest > SCROLL_TRIGGER && delta > SCROLL_DELTA) {
      if (!stickyRef.current) {
        stickyRef.current = true;
        setIsStickyVisible(true);
      }
    } else if (delta < -SCROLL_DELTA || latest <= SCROLL_TRIGGER) {
      if (stickyRef.current) {
        stickyRef.current = false;
        setIsStickyVisible(false);
      }
    }
  });

  const handleCategoryClick = useCallback(
    (id) => {
      const targetCategory = id === activeTabId ? "Default" : id;
      haptic("medium");
      startTransition(() => {
        router.push(`?category=${targetCategory}`, { scroll: false });
      });
    },
    [activeTabId, router, haptic, startTransition]
  );

  const openAddressDrawer = useCallback(() => {
    setIsAddressDrawerOpen(true);
    haptic("medium");
  }, [haptic]);

  const closeAddressDrawer = useCallback(() => {
    setIsAddressDrawerOpen(false);
  }, []);

  const openFilterModal = useCallback(() => {
    setIsFilterModalOpen(true);
    setIsNavbarVisible(false);
    haptic("medium");
  }, [haptic, setIsNavbarVisible]);

  const closeFilterModal = useCallback(() => {
    setIsFilterModalOpen(false);
    setIsNavbarVisible(true);
  }, [setIsNavbarVisible]);

  const handleAddressSelect = useCallback((addr) => {
    setSelectedAddress(addr);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const onSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-gradient-to-br from-amber-50 via-white to-white flex flex-col items-center justify-center z-[9999]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex items-center justify-center w-full h-full max-w-md max-h-md"
            >
              <video
                src="/Loading/loading1.mp4"
                alt="PlanWAB Loader"
                width={200}
                height={200}
                autoPlay
                muted
                loop
                playsInline
              />
            </motion.div>
            {searchQuery && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-32 text-sm font-bold text-gray-600"
              >
                Searching for &ldquo;{searchQuery.slice(0, 30)}
                {searchQuery.length > 30 ? "..." : ""}&rdquo;
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isHomePage && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full z-50 pointer-events-none"
            animate={{ opacity: isStickyVisible ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pt-1 pb-2 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-auto">
              <div className="px-1 mb-2">
                <div className="flex items-center justify-between bg-white/10 rounded-2xl p-1.5 backdrop-blur-sm border border-white/10">
                  {TABS_CONFIG.map((tab) => (
                    <CategoryButton
                      key={tab.id}
                      category={tab.label}
                      styles={tab.styles}
                      imageSrc={tab.image}
                      src={tab.src}
                      active={activeTabId === tab.id}
                      onClick={() => handleCategoryClick(tab.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="px-3 mb-3">
                <button
                  onClick={openAddressDrawer}
                  className="w-full flex items-center gap-3 bg-white/10 rounded-2xl p-2 pr-4 backdrop-blur-md border border-white/10 active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    <MapPin size={20} fill="white" fillOpacity={0.3} />
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] font-bold text-white truncate max-w-[200px]">
                        {selectedAddress.label}
                      </span>
                      <ChevronDown size={14} className="text-white/80" />
                    </div>
                    <p className="text-[11px] text-white/90 truncate font-medium">
                      {selectedAddress.area}, {selectedAddress.city.split(",")[0]}
                    </p>
                  </div>
                </button>
              </div>

              <div className="px-3 flex items-center gap-3">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex-1 h-12 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center px-4 relative active:scale-[0.99] transition-transform"
                >
                  <Search
                    className="text-white/70 w-5 h-5 mr-3 shrink-0"
                    strokeWidth={2.5}
                  />
                  <div className="relative flex-1 h-full">
                    {!searchQuery && (
                      <SearchPlaceholderTicker placeholders={currentTab.placeholders} />
                    )}
                    <input
                      value={searchQuery}
                      onChange={onSearchChange}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                      className="w-full h-full bg-transparent border-none outline-none text-sm text-white font-semibold relative z-10 placeholder-transparent"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-1 bg-white/20 rounded-full z-10"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  )}
                </form>
                <button
                  type="button"
                  onClick={openFilterModal}
                  className={`relative h-12 w-12 backdrop-blur-xl rounded-2xl flex items-center justify-center border text-white active:scale-95 transition-transform ${
                    selectedSort !== "rating"
                      ? "bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/30"
                      : "bg-white/15 border-white/20"
                  }`}
                >
                  <SlidersHorizontal size={20} strokeWidth={2.5} />
                  {selectedSort !== "rating" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg"
                    >
                      1
                    </motion.span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="fixed top-0 left-0 w-full z-[60] bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 will-change-transform"
            initial={{ y: "-100%" }}
            animate={{ y: isStickyVisible ? "0%" : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="px-2 py-2">
              <div className="mb-2 overflow-x-auto scrollbar-hide no-scrollbar">
                <div className="flex items-center gap-1 min-w-max">
                  {TABS_CONFIG.map((tab) => (
                    <CategoryButton
                      key={tab.id}
                      category={tab.label}
                      styles={tab.styles}
                      imageSrc={tab.image}
                      src={tab.src}
                      active={activeTabId === tab.id}
                      onClick={() => handleCategoryClick(tab.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex-1 h-10 bg-gray-100 rounded-xl flex items-center px-3 relative"
                >
                  <Search className="text-gray-400 w-4 h-4 mr-2" />
                  <input
                    value={searchQuery}
                    onChange={onSearchChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                    placeholder={`Search ${currentTab.label}...`}
                    className="w-full h-full bg-transparent border-none outline-none text-xs text-gray-800 font-medium placeholder-gray-400"
                  />
                </form>
                <button
                  type="button"
                  onClick={openFilterModal}
                  className={`relative h-10 w-10 rounded-xl flex items-center justify-center active:scale-95 transition-all border ${
                    selectedSort !== "rating"
                      ? "bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-500/30"
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}
                >
                  <SlidersHorizontal size={16} />
                  {selectedSort !== "rating" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                    >
                      1
                    </motion.span>
                  )}
                </button>
                <button
                  onClick={openAddressDrawer}
                  className="h-10 px-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <MapPin size={16} className="fill-blue-200" />
                  <span className="text-[10px] font-bold max-w-[80px] truncate">
                    {selectedAddress.label}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      <AddressDrawer
        isOpen={isAddressDrawerOpen}
        onClose={closeAddressDrawer}
        onSelect={handleAddressSelect}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        onApply={handleApplyFilters}
      />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

const MobileHeader = () => (
  <Suspense fallback={<div className="h-20 w-full bg-transparent" />}>
    <HeaderLogic />
  </Suspense>
);

export default MobileHeader;