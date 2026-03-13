"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Heart,
  Filter,
  Sparkles,
  ArrowLeft,
  Play,
  Crown,
  Music,
  Camera,
  Palette,
  Utensils,
  PartyPopper,
  Gem,
  Flower2,
  Shirt,
  Car,
  Lightbulb,
  Gift,
  Users,
  Building2,
  GraduationCap,
  Baby,
  Cake,
  HeartHandshake,
  Megaphone,
  Trophy,
  Flame,
  Drum,
  HandMetal,
  Bookmark,
  BookmarkCheck,
  BadgeCheck,
  Clock,
  ChevronDown,
  Search,
  TrendingUp,
  Zap,
  Send,
} from "lucide-react";
import { useNavbarVisibilityStore } from "../../../GlobalState/navbarVisibilityStore";

// ─── DATA ────────────────────────────────────────────────────────

const WEDDING_THUMBNAILS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&h=710&auto=format&fit=crop",
];
const BIRTHDAY_THUMBNAILS = [
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?q=80&w=400&h=710&auto=format&fit=crop",
];
const CORPORATE_THUMBNAILS = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587825140708-dfaf18c4bfa3?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&h=710&auto=format&fit=crop",
];
const ANNIVERSARY_THUMBNAILS = [
  "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=400&h=710&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&h=710&auto=format&fit=crop",
];

const makeCarouselItems = (names, thumbnails) =>
  names.map((name, i) => ({
    id: `item-${name.toLowerCase().replace(/\s/g, "-")}-${i}`,
    title: name,
    thumbnail: thumbnails[i % thumbnails.length],
    vendor: ["Royal Events", "Dream Makers", "Elite Planners", "Grand Celebrations", "Majestic Moments", "Star Productions"][i % 6],
    rating: +(4.2 + Math.random() * 0.7).toFixed(1),
    reviews: 50 + Math.floor(Math.random() * 400),
    price: `₹${(10 + Math.floor(Math.random() * 90)) * 1000}`,
    location: ["Delhi", "Mumbai", "Jaipur", "Bangalore", "Hyderabad", "Goa"][i % 6],
    tags: i % 3 === 0 ? ["Top Rated"] : i % 3 === 1 ? ["Trending"] : [],
    caption: `Premium ${name} service for your special occasion. Unforgettable memories guaranteed!`,
  }));

const EVENT_CONFIGS = {
  wedding: {
    subtypes: [
      { id: "baraat", label: "Baraat", icon: <Drum size={20} />, gradient: "from-orange-400 to-rose-500", nestedTypes: [{ id: "dj-baraat", label: "DJ Baraat" }, { id: "royal-baraat", label: "Royal Baraat" }, { id: "horse-baraat", label: "Horse Baraat" }, { id: "vintage-baraat", label: "Vintage Car Baraat" }] },
      { id: "mehendi", label: "Mehendi", icon: <Flower2 size={20} />, gradient: "from-green-400 to-emerald-500" },
      { id: "sangeet", label: "Sangeet", icon: <Music size={20} />, gradient: "from-purple-400 to-violet-500" },
      { id: "haldi", label: "Haldi", icon: <Flame size={20} />, gradient: "from-yellow-400 to-amber-500" },
      { id: "planner", label: "Planner", icon: <Lightbulb size={20} />, gradient: "from-sky-400 to-blue-500", nestedTypes: [{ id: "full-planner", label: "Full Service" }, { id: "day-planner", label: "Day-of Coordinator" }, { id: "budget-planner", label: "Budget Planner" }] },
      { id: "photographer", label: "Photo", icon: <Camera size={20} />, gradient: "from-pink-400 to-rose-500" },
      { id: "dj", label: "DJ & Music", icon: <HandMetal size={20} />, gradient: "from-indigo-400 to-purple-500" },
      { id: "decor", label: "Decor", icon: <Palette size={20} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "catering", label: "Catering", icon: <Utensils size={20} />, gradient: "from-red-400 to-orange-500" },
      { id: "venue", label: "Venue", icon: <Building2 size={20} />, gradient: "from-slate-400 to-gray-500" },
      { id: "makeup", label: "Makeup", icon: <Gem size={20} />, gradient: "from-fuchsia-400 to-pink-500" },
      { id: "outfit", label: "Outfits", icon: <Shirt size={20} />, gradient: "from-violet-400 to-indigo-500" },
      { id: "invitation", label: "Invites", icon: <Gift size={20} />, gradient: "from-amber-400 to-yellow-500" },
      { id: "transport", label: "Transport", icon: <Car size={20} />, gradient: "from-blue-400 to-sky-500" },
    ],
    carousels: [
      { id: "w-planners", title: "Wedding Planners", items: makeCarouselItems(["Grand Heritage Planners", "Royal Wedding Co", "Dream Day Planners", "Eternal Celebrations", "Shaadi Squad", "Wedding Wire Pros", "Bliss Events", "Knot Tied"], WEDDING_THUMBNAILS) },
      { id: "w-photographers", title: "Wedding Photographers", items: makeCarouselItems(["Lens Magic Studio", "Candid Clicks", "The Wedding Filmer", "Picture Perfect", "Shutterbugs Pro", "Memories Forever", "Golden Frame", "Reel Stories"], WEDDING_THUMBNAILS) },
      { id: "w-mehendi", title: "Mehendi Artists", items: makeCarouselItems(["Henna Queens", "Bridal Mehendi Co", "Artistic Henna", "Rajasthani Mehendi", "Modern Mehendi Art", "Traditional Touch"], WEDDING_THUMBNAILS) },
      { id: "w-decor", title: "Wedding Decorators", items: makeCarouselItems(["Floral Fantasy", "Royal Decor House", "Elegant Events Decor", "Mandap Kings", "Dreamy Setups", "Stage Craft Pro", "Bloom & Vine", "Luxe Decor"], WEDDING_THUMBNAILS) },
      { id: "w-catering", title: "Wedding Caterers", items: makeCarouselItems(["Royal Feast Caterers", "Shahi Dawat", "Flavours Kitchen", "Grand Buffet Co", "Taste Masters", "Annapurna Caterers"], WEDDING_THUMBNAILS) },
      { id: "w-venues", title: "Wedding Venues", items: makeCarouselItems(["The Grand Palace", "Heritage Haveli", "Lakeside Resort", "Royal Banquet Hall", "Garden of Dreams", "Sky Lounge Venue", "Fort Wedding Venue", "Beach Resort"], WEDDING_THUMBNAILS) },
    ],
    getCarouselsForSubtype: (subtypeId, nestedId) => {
      const s = {
        baraat: [
          { id: "b-dj", title: "Baraat DJs", items: makeCarouselItems(["DJ Baraat King", "Dhol & DJ Combo", "Baraat Blast", "Party on Wheels", "Royal Baraat DJ", "Street Beat DJ"], WEDDING_THUMBNAILS) },
          { id: "b-dhol", title: "Dhol Players", items: makeCarouselItems(["Punjabi Dhol Group", "Royal Dhol Walas", "Beats of Punjab", "Nagada Masters", "Dhol Tasha Band", "Classic Dhol"], WEDDING_THUMBNAILS) },
        ],
        mehendi: [
          { id: "m-artists", title: "Top Mehendi Artists", items: makeCarouselItems(["Henna Queens", "Bridal Mehendi Co", "Rajasthani Henna", "Arabic Style Mehendi", "Marwari Mehendi Art", "Modern Henna Studio"], WEDDING_THUMBNAILS) },
        ],
        sangeet: [
          { id: "s-choreo", title: "Choreographers", items: makeCarouselItems(["Dance Dhamaka", "Bollywood Steps", "Sangeet Choreography Co", "Star Moves", "Rhythm Dance Academy", "Groove Factory"], WEDDING_THUMBNAILS) },
        ],
        photographer: [
          { id: "p-candid", title: "Candid Photographers", items: makeCarouselItems(["Candid Clicks", "Story Tellers", "Moment Catchers", "Raw Emotions Studio", "Unposed Photography", "Natural Light Studio"], WEDDING_THUMBNAILS) },
        ],
      };
      const n = {
        "dj-baraat": [{ id: "djb-top", title: "Top DJ Baraat Artists", items: makeCarouselItems(["DJ Storm Baraat", "Bass Drop Baraat", "Electric Baraat Co", "Bollywood Baraat DJ", "Club Baraat", "Open Air DJ"], WEDDING_THUMBNAILS) }],
        "royal-baraat": [{ id: "rb-top", title: "Royal Baraat Packages", items: makeCarouselItems(["Royal Horse & Chariot", "Elephant Baraat", "Palace Entry Package", "Maharaja Baraat Co", "Crown Baraat", "Heritage Royal Walk"], WEDDING_THUMBNAILS) }],
      };
      if (nestedId && n[nestedId]) return n[nestedId];
      if (s[subtypeId]) return s[subtypeId];
      return [];
    },
  },
  birthday: {
    subtypes: [
      { id: "kids", label: "Kids Party", icon: <Baby size={20} />, gradient: "from-pink-400 to-rose-500" },
      { id: "theme", label: "Theme Party", icon: <PartyPopper size={20} />, gradient: "from-violet-400 to-purple-500", nestedTypes: [{ id: "bollywood-theme", label: "Bollywood Night" }, { id: "retro-theme", label: "Retro Theme" }, { id: "pool-theme", label: "Pool Party" }, { id: "neon-theme", label: "Neon Party" }] },
      { id: "cake", label: "Cakes", icon: <Cake size={20} />, gradient: "from-amber-400 to-orange-500" },
      { id: "b-decor", label: "Decor", icon: <Palette size={20} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "b-venue", label: "Venues", icon: <Building2 size={20} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "b-photo", label: "Photo", icon: <Camera size={20} />, gradient: "from-rose-400 to-pink-500" },
      { id: "b-dj", label: "DJ & Music", icon: <Music size={20} />, gradient: "from-purple-400 to-violet-500" },
      { id: "b-catering", label: "Catering", icon: <Utensils size={20} />, gradient: "from-red-400 to-orange-500" },
      { id: "entertainer", label: "Acts", icon: <Crown size={20} />, gradient: "from-yellow-400 to-amber-500" },
      { id: "b-gift", label: "Gifts", icon: <Gift size={20} />, gradient: "from-green-400 to-emerald-500" },
    ],
    carousels: [
      { id: "bd-decor", title: "Birthday Decorators", items: makeCarouselItems(["Balloon Fiesta", "Party Poppers Decor", "Theme Kings", "Colorful Celebrations", "Surprise Setups", "Balloon Art Co"], BIRTHDAY_THUMBNAILS) },
      { id: "bd-cakes", title: "Custom Cakes", items: makeCarouselItems(["Cake Studio", "Sweet Layers", "Fondant Fantasy", "The Cake Bar", "Sugar Rush Co", "Bake My Day"], BIRTHDAY_THUMBNAILS) },
      { id: "bd-venues", title: "Party Venues", items: makeCarouselItems(["Fun City Arena", "Rooftop Bash", "Garden Party House", "The Play Zone", "Club Lounge Party", "Farm House Venue"], BIRTHDAY_THUMBNAILS) },
    ],
    getCarouselsForSubtype: (subtypeId) => {
      const m = {
        kids: [{ id: "k-themes", title: "Kids Party Themes", items: makeCarouselItems(["Superhero Party", "Princess Party", "Dinosaur Theme", "Space Theme", "Cartoon Theme", "Fairy Tale Party"], BIRTHDAY_THUMBNAILS) }],
        theme: [{ id: "t-popular", title: "Popular Themes", items: makeCarouselItems(["Bollywood Night", "Retro Theme", "Neon Glow Party", "Black & White", "Hawaiian Luau", "Masquerade Ball"], BIRTHDAY_THUMBNAILS) }],
        cake: [{ id: "c-custom", title: "Custom Designer Cakes", items: makeCarouselItems(["Fondant Art Cake", "Photo Cake Pro", "Tier Cake Studio", "Vegan Cakes", "Eggless Delights", "Theme Cake Co"], BIRTHDAY_THUMBNAILS) }],
      };
      return m[subtypeId] || [];
    },
  },
  anniversary: {
    subtypes: [
      { id: "surprise", label: "Surprise", icon: <Gift size={20} />, gradient: "from-pink-400 to-fuchsia-500" },
      { id: "dinner", label: "Dinner", icon: <Utensils size={20} />, gradient: "from-red-400 to-rose-500" },
      { id: "a-decor", label: "Decor", icon: <Palette size={20} />, gradient: "from-teal-400 to-cyan-500" },
      { id: "a-photo", label: "Photo", icon: <Camera size={20} />, gradient: "from-violet-400 to-purple-500" },
      { id: "a-venue", label: "Venues", icon: <Building2 size={20} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "a-music", label: "Music", icon: <Music size={20} />, gradient: "from-orange-400 to-amber-500" },
      { id: "a-cake", label: "Cakes", icon: <Cake size={20} />, gradient: "from-amber-400 to-yellow-500" },
      { id: "a-gift", label: "Gifts", icon: <Gift size={20} />, gradient: "from-green-400 to-emerald-500" },
    ],
    carousels: [
      { id: "an-surprise", title: "Surprise Planners", items: makeCarouselItems(["Surprise Squad", "Midnight Surprise Co", "Wow Factor Events", "Secret Celebration", "Surprise Box Co", "Plan My Surprise"], ANNIVERSARY_THUMBNAILS) },
      { id: "an-dinner", title: "Romantic Dinner Setups", items: makeCarouselItems(["Candlelight Co", "Rooftop Dinner Setup", "Private Chef Experience", "Yacht Dinner", "Garden Dinner Setup", "Poolside Romance"], ANNIVERSARY_THUMBNAILS) },
      { id: "an-decor", title: "Anniversary Decorators", items: makeCarouselItems(["Rose Petal Decor", "Balloon Bouquet Co", "Golden Theme Setup", "Silver Jubilee Decor", "Elegant Floral Setup", "Memory Lane Decor"], ANNIVERSARY_THUMBNAILS) },
    ],
    getCarouselsForSubtype: (subtypeId) => {
      const m = {
        surprise: [{ id: "sp-midnight", title: "Midnight Surprises", items: makeCarouselItems(["12AM Surprise Co", "Night Owl Events", "Midnight Magic", "Dark Surprise Studio", "Secret Agent Events", "Stealth Celebrations"], ANNIVERSARY_THUMBNAILS) }],
        dinner: [{ id: "dn-private", title: "Private Dining", items: makeCarouselItems(["Chef's Table Co", "Home Chef Experience", "Luxury Dining Setup", "5-Star Private Dinner", "Outdoor Feast Co", "Gourmet Night In"], ANNIVERSARY_THUMBNAILS) }],
      };
      return m[subtypeId] || [];
    },
  },
  corporate: {
    subtypes: [
      { id: "conference", label: "Conference", icon: <Users size={20} />, gradient: "from-blue-400 to-indigo-500" },
      { id: "team-building", label: "Team Build", icon: <Trophy size={20} />, gradient: "from-amber-400 to-orange-500" },
      { id: "launch", label: "Launch", icon: <Megaphone size={20} />, gradient: "from-red-400 to-rose-500" },
      { id: "c-venue", label: "Venues", icon: <Building2 size={20} />, gradient: "from-slate-400 to-gray-500" },
      { id: "c-catering", label: "Catering", icon: <Utensils size={20} />, gradient: "from-green-400 to-emerald-500" },
      { id: "c-av", label: "AV & Tech", icon: <Lightbulb size={20} />, gradient: "from-violet-400 to-purple-500" },
      { id: "c-photo", label: "Photo", icon: <Camera size={20} />, gradient: "from-pink-400 to-rose-500" },
      { id: "seminar", label: "Seminars", icon: <GraduationCap size={20} />, gradient: "from-cyan-400 to-teal-500" },
    ],
    carousels: [
      { id: "co-venues", title: "Corporate Venues", items: makeCarouselItems(["Tech Park Convention", "5-Star Ballroom", "Co-Working Events Space", "Rooftop Corporate Lounge", "Heritage Conference Hall", "Modern Meeting Hub"], CORPORATE_THUMBNAILS) },
      { id: "co-catering", title: "Corporate Caterers", items: makeCarouselItems(["Business Lunch Co", "Executive Catering", "Working Lunch Pro", "Premium Buffet Co", "Tea & Snacks Service", "Gala Dinner Caterers"], CORPORATE_THUMBNAILS) },
      { id: "co-av", title: "AV & Production", items: makeCarouselItems(["Sound System Pro", "LED Screen Rentals", "Live Stream Co", "Stage & Lighting Co", "Projection Mapping", "Event Tech Solutions"], CORPORATE_THUMBNAILS) },
    ],
    getCarouselsForSubtype: (subtypeId) => {
      const m = {
        conference: [{ id: "conf-plan", title: "Conference Planners", items: makeCarouselItems(["EventBrite Partners", "Summit Organizers", "Conference Pro Co", "Global Events Management", "Peak Conferences", "Conclave Experts"], CORPORATE_THUMBNAILS) }],
        "team-building": [{ id: "tb-outdoor", title: "Outdoor Activities", items: makeCarouselItems(["Adventure Team Co", "Camp Corporate", "Sports Day Organizers", "Nature Retreat Co", "Paintball Events", "Rafting Adventures"], CORPORATE_THUMBNAILS) }],
        launch: [{ id: "la-stage", title: "Launch Stage Designers", items: makeCarouselItems(["Grand Reveal Co", "Tech Launch Pro", "Product Showcase Design", "Immersive Launch Studio", "Brand Experience Co", "Launch Day Events"], CORPORATE_THUMBNAILS) }],
      };
      return m[subtypeId] || [];
    },
  },
};

const OTHER_EVENT_TYPES = [
  { id: "engagement", label: "Engagement" }, { id: "baby-shower", label: "Baby Shower" },
  { id: "housewarming", label: "Housewarming" }, { id: "retirement", label: "Retirement Party" },
  { id: "graduation", label: "Graduation" }, { id: "puja", label: "Puja / Religious" },
  { id: "kitty-party", label: "Kitty Party" }, { id: "farewell", label: "Farewell Party" },
  { id: "reunion", label: "Reunion" }, { id: "charity-gala", label: "Charity Gala" },
];

const getDefaultConfigForOther = (eventId) => ({
  subtypes: [
    { id: "o-planner", label: "Planner", icon: <Lightbulb size={20} />, gradient: "from-sky-400 to-blue-500" },
    { id: "o-decor", label: "Decor", icon: <Palette size={20} />, gradient: "from-teal-400 to-cyan-500" },
    { id: "o-photo", label: "Photo", icon: <Camera size={20} />, gradient: "from-pink-400 to-rose-500" },
    { id: "o-catering", label: "Catering", icon: <Utensils size={20} />, gradient: "from-red-400 to-orange-500" },
    { id: "o-venue", label: "Venues", icon: <Building2 size={20} />, gradient: "from-slate-400 to-gray-500" },
    { id: "o-music", label: "Music", icon: <Music size={20} />, gradient: "from-purple-400 to-violet-500" },
  ],
  carousels: [
    { id: "ot-plan", title: `${eventId.charAt(0).toUpperCase() + eventId.slice(1).replace("-", " ")} Planners`, items: makeCarouselItems(["All Events Co", "Celebration Station", "Party People", "Event Masters", "Joy Makers", "Happy Times Co"], ANNIVERSARY_THUMBNAILS) },
    { id: "ot-decor", title: `${eventId.charAt(0).toUpperCase() + eventId.slice(1).replace("-", " ")} Decorators`, items: makeCarouselItems(["Decor Delight", "Theme World", "Color Pop Events", "Balloon Galaxy", "Floral Touch", "Setup Studio"], BIRTHDAY_THUMBNAILS) },
  ],
  getCarouselsForSubtype: () => [],
});

const generateVendors = (item) =>
  Array.from({ length: 8 }, (_, i) => ({
    id: `vendor-${item.id}-${i}`,
    name: `${item.vendor} ${["Studio", "Pro", "Co", "Group", "Agency", "House"][i % 6]}`,
    image: item.thumbnail,
    rating: +(4 + Math.random() * 0.9).toFixed(1),
    reviews: 20 + Math.floor(Math.random() * 300),
    price: `₹${(10 + Math.floor(Math.random() * 90)) * 1000}`,
    location: ["Delhi NCR", "Mumbai", "Jaipur", "Bangalore", "Hyderabad", "Kolkata", "Goa", "Chennai"][i % 8],
    phone: `+91 ${90000 + Math.floor(Math.random() * 9999)} ${10000 + Math.floor(Math.random() * 89999)}`,
    badges: i % 2 === 0 ? ["Verified", "Top Rated"] : i % 3 === 0 ? ["Premium"] : ["Trusted"],
    availability: i % 3 === 0 ? "Available this week" : i % 2 === 0 ? "Book 2 weeks ahead" : "Limited slots",
  }));

// ─── TWO-ROW SUBTYPE GRID CAROUSEL ──────────────────────────────

const SubtypeGridCarousel = ({ subtypes, activeSubtype, onSubtypeClick }) => {
  const constraintRef = useRef(null);

  return (
    <div ref={constraintRef} className="overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={constraintRef}
        dragElastic={0.12}
        dragTransition={{ bounceStiffness: 120, bounceDamping: 20 }}
        className="grid grid-rows-2 grid-flow-col auto-cols-max gap-2 px-4 py-3 cursor-grab active:cursor-grabbing"
      >
        {subtypes.map((subtype, idx) => {
          const isActive = activeSubtype === subtype.id;
          return (
            <motion.button
              key={subtype.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.025, type: "spring", stiffness: 260, damping: 22 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSubtypeClick(subtype.id)}
              className={`relative flex flex-col items-center justify-center gap-1.5 w-[82px] h-[82px] rounded-2xl border-2 transition-all select-none ${
                isActive
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-950/40 shadow-lg shadow-violet-500/20"
                  : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? `bg-gradient-to-br ${subtype.gradient} text-white shadow-md`
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {subtype.icon}
              </div>
              <span
                className={`text-[10px] font-bold leading-tight text-center transition-colors ${
                  isActive ? "text-violet-700 dark:text-violet-300" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {subtype.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="subtypeIndicator"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-1 bg-violet-500 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {subtype.nestedTypes && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

// ─── NESTED CHIPS ────────────────────────────────────────────────

const NestedChips = ({ nestedTypes, activeNested, onNestedClick }) => {
  const constraintRef = useRef(null);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
    >
      <div ref={constraintRef} className="overflow-hidden bg-gray-50/80 dark:bg-gray-900/80">
        <motion.div
          drag="x"
          dragConstraints={constraintRef}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 150, bounceDamping: 20 }}
          className="flex gap-2.5 px-4 py-3 cursor-grab active:cursor-grabbing"
          style={{ width: "max-content" }}
        >
          {nestedTypes.map((nested, idx) => {
            const isActive = activeNested === nested.id;
            return (
              <motion.button
                key={nested.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => onNestedClick(nested.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border-2 transition-all select-none ${
                  isActive
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                }`}
              >
                {nested.label}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─── SPRING REEL CAROUSEL ────────────────────────────────────────

const SpringCarousel = ({ section, onItemClick }) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [xOffset, setXOffset] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const cW = containerRef.current.offsetWidth;
    const tW = trackRef.current.scrollWidth;
    const max = -(tW - cW);
    setShowLeft(xOffset < -10);
    setShowRight(xOffset > max + 10);
  }, [xOffset]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  useEffect(() => { setXOffset(0); }, [section.id]);

  const scroll = useCallback((dir) => {
    if (!containerRef.current || !trackRef.current) return;
    const cW = containerRef.current.offsetWidth;
    const tW = trackRef.current.scrollWidth;
    const max = -(tW - cW);
    const amount = 168 * 2;
    setXOffset(dir === "left" ? Math.min(0, xOffset + amount) : Math.max(max, xOffset - amount));
  }, [xOffset]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">{section.title}</h3>
        <div className="flex gap-1.5">
          <AnimatePresence>
            {showLeft && (
              <motion.button
                key="left"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-300"
              >
                <ChevronLeft size={15} />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showRight && (
              <motion.button
                key="right"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-300"
              >
                <ChevronRight size={15} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div ref={containerRef} className="overflow-hidden px-4">
        <motion.div
          ref={trackRef}
          animate={{ x: xOffset }}
          transition={{ type: "spring", stiffness: 110, damping: 22, mass: 0.85 }}
          className="flex gap-3 pb-2"
          style={{ width: "max-content" }}
        >
          {section.items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, type: "spring", stiffness: 280, damping: 24 }}
              onClick={() => onItemClick(item, section.items, idx)}
              className="w-[150px] shrink-0 cursor-pointer group"
            >
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-800 ring-1 ring-black/5">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-active:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                {item.tags[0] && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-violet-600/90 backdrop-blur-sm rounded-md text-[9px] font-bold text-white uppercase tracking-wide flex items-center gap-1">
                    {item.tags[0] === "Top Rated" && <Star size={8} className="fill-yellow-400 text-yellow-400" />}
                    {item.tags[0] === "Trending" && <TrendingUp size={8} />}
                    {item.tags[0]}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-white font-bold text-xs leading-tight line-clamp-2 mb-1">{item.title}</p>
                  <div className="flex items-center gap-1 text-white/80 text-[10px]">
                    <Star size={9} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-white">{item.rating}</span>
                    <span>({item.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] font-bold text-emerald-400">{item.price}</span>
                    <span className="text-[9px] text-white/60 flex items-center gap-0.5"><MapPin size={7} />{item.location}</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-6 h-6 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play size={10} className="text-white fill-white ml-0.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// ─── REELS VIEWER ────────────────────────────────────────────────

const ReelsViewerModal = ({ reels, initialIndex, onClose, onSeeVendors }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    setIsLiked(false);
    setIsSaved(false);
  }, [currentIndex]);

  const goToReel = useCallback((direction) => {
    if (direction === "up" && currentIndex < reels.length - 1) setCurrentIndex((p) => p + 1);
    else if (direction === "down" && currentIndex > 0) setCurrentIndex((p) => p - 1);
  }, [currentIndex, reels.length]);

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    if (info.offset.y < -50 || info.velocity.y < -300) goToReel("up");
    else if (info.offset.y > 50 || info.velocity.y > 300) goToReel("down");
    if (info.velocity.x > 500 || info.offset.x > 150) onClose();
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
    }
  };

  if (!currentReel) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 py-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="p-2.5 bg-white/10 backdrop-blur-xl rounded-full">
          <ArrowLeft size={20} className="text-white" />
        </motion.button>
        <span className="text-white font-bold text-sm">Ideas Reels</span>
        <div className="w-10" />
      </div>

      {/* Draggable area */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onDoubleClick={handleDoubleTap}
        className="absolute inset-0 touch-pan-y"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div className="absolute inset-0 z-0">
          <img src={currentReel.thumbnail} alt="" className="w-full h-full object-cover blur-3xl opacity-40 scale-125" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReel.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <img src={currentReel.thumbnail} alt={currentReel.title} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none" />
        <AnimatePresence>
          {showLikeAnimation && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <Heart size={100} className="text-white fill-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right actions */}
      <div className="absolute right-4 bottom-60 flex flex-col items-center gap-5 z-30">
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => { setIsLiked(!isLiked); if (!isLiked) { setShowLikeAnimation(true); setTimeout(() => setShowLikeAnimation(false), 600); } }} className="flex flex-col items-center gap-1">
          <motion.div animate={isLiked ? { scale: [1, 1.3, 1] } : {}} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <Heart size={24} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
          </motion.div>
          <span className="text-white text-[10px] font-bold">{currentReel.reviews}</span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setIsSaved(!isSaved)} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            {isSaved ? <BookmarkCheck size={24} className="text-white fill-white" /> : <Bookmark size={24} className="text-white" />}
          </div>
          <span className="text-white text-[10px] font-bold">Save</span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.8 }} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <Send size={20} className="text-white" />
          </div>
          <span className="text-white text-[10px] font-bold">Share</span>
        </motion.button>
      </div>

      {/* Bottom info + CTAs */}
      <div className="absolute left-0 right-0 bottom-0 z-30 px-4 pb-8 pt-4">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/40 bg-gray-600 shrink-0">
              <img src={currentReel.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-white font-bold text-sm truncate block">{currentReel.vendor}</span>
              <span className="text-white/50 text-[10px] flex items-center gap-1"><MapPin size={8} /> {currentReel.location}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-lg shrink-0">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-bold">{currentReel.rating}</span>
            </div>
          </div>
          <p className="text-white font-semibold text-sm leading-snug line-clamp-2">{currentReel.title}</p>
          <p className="text-white/45 text-xs mt-1 line-clamp-1">{currentReel.caption}</p>
          <p className="text-emerald-400 font-bold text-base mt-1.5">{currentReel.price}</p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSeeVendors(currentReel)}
            className="flex-1 py-3.5 bg-white rounded-2xl flex items-center justify-center gap-2 shadow-lg active:bg-gray-100"
          >
            <Users size={16} className="text-gray-900" />
            <span className="text-sm font-bold text-gray-900">See Vendors</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3.5 bg-violet-600 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30 active:bg-violet-700"
          >
            <MessageSquare size={16} className="text-white" />
            <span className="text-sm font-bold text-white">Get Quote</span>
          </motion.button>
        </div>
      </div>

      {/* Counter */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30">
        <p className="text-white/30 text-[10px] font-bold" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          {currentIndex + 1} / {reels.length}
        </p>
      </div>

      {/* Hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30">
        <p className="text-white/25 text-[9px]">Swipe up/down • Double tap to like</p>
      </div>
    </motion.div>
  );
};

// ─── VENDOR DRAWER (opens on top of reels) ───────────────────────

const VendorDrawer = ({ item, onClose }) => {
  const vendors = useMemo(() => generateVendors(item), [item]);
  const [saved, setSaved] = useState(new Set());
  const toggle = (id) => setSaved((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed bottom-0 left-0 right-0 h-[88vh] bg-white dark:bg-gray-900 rounded-t-[1.75rem] z-[120] overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="px-5 pt-1 pb-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h2>
            <p className="text-xs text-gray-500">{vendors.length} vendors available</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {vendors.map((v, idx) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="flex gap-3 p-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate pr-2">{v.name}</h4>
                      <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggle(v.id)} className="shrink-0">
                        {saved.has(v.id) ? <BookmarkCheck size={16} className="text-violet-600 fill-violet-600" /> : <Bookmark size={16} className="text-gray-400" />}
                      </motion.button>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex items-center gap-0.5 text-xs">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-900 dark:text-white">{v.rating}</span>
                        <span className="text-gray-400">({v.reviews})</span>
                      </div>
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><MapPin size={8} />{v.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {v.badges.map((b) => (
                        <span key={b} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center gap-0.5">
                          {b === "Verified" && <BadgeCheck size={8} />}{b}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{v.price}</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5"><Clock size={8} />{v.availability}</span>
                    </div>
                  </div>
                </div>
                <div className="flex border-t border-gray-100 dark:border-gray-700 divide-x divide-gray-100 dark:divide-gray-700">
                  <button onClick={() => window.open(`tel:${v.phone}`)} className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 active:bg-gray-50"><Phone size={12} />Call</button>
                  <button className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 active:bg-gray-50"><MessageSquare size={12} />Chat</button>
                  <button className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 active:bg-violet-50"><Zap size={12} />Book Now</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ─── EVENT SELECTION MODAL ───────────────────────────────────────

const EventSelectionModal = ({ onSelect }) => {
  const [showOthers, setShowOthers] = useState(false);
  const [searchOther, setSearchOther] = useState("");
  const mainEvents = [
    { id: "wedding", label: "Wedding", icon: <HeartHandshake size={28} />, gradient: "from-rose-500 to-pink-600" },
    { id: "anniversary", label: "Anniversary", icon: <Heart size={28} />, gradient: "from-red-500 to-rose-600" },
    { id: "birthday", label: "Birthday", icon: <Cake size={28} />, gradient: "from-amber-500 to-orange-600" },
    { id: "corporate", label: "Corporate", icon: <Building2 size={28} />, gradient: "from-blue-500 to-indigo-600" },
  ];
  const filteredOthers = OTHER_EVENT_TYPES.filter((e) => e.label.toLowerCase().includes(searchOther.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-end justify-center">
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 250 }} className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-[2rem] overflow-hidden shadow-2xl">
        <div className="w-full flex justify-center pt-3"><div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" /></div>
        <div className="p-6 pt-4">
          <div className="text-center mb-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="w-16 h-16 bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-violet-600 dark:text-violet-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What are you planning?</h2>
            <p className="text-sm text-gray-500 mt-1">Choose your event type to explore ideas</p>
          </div>
          {!showOthers ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {mainEvents.map((event, idx) => (
                  <motion.button key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.07 }} whileTap={{ scale: 0.95 }} onClick={() => onSelect(event.id, event.label)} className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 active:border-violet-300 transition-all">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${event.gradient} flex items-center justify-center text-white shadow-lg`}>{event.icon}</div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{event.label}</span>
                  </motion.button>
                ))}
              </div>
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} whileTap={{ scale: 0.97 }} onClick={() => setShowOthers(true)} className="w-full py-3.5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm flex items-center justify-center gap-2">
                <PartyPopper size={16} />Other Event Types<ChevronDown size={14} />
              </motion.button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={() => setShowOthers(false)} className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 mb-4"><ArrowLeft size={14} />Back to main</button>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search event type..." value={searchOther} onChange={(e) => setSearchOther(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {filteredOthers.map((event, idx) => (
                  <motion.button key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} whileTap={{ scale: 0.97 }} onClick={() => onSelect(event.id, event.label)} className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 active:border-violet-300">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{event.label}</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </motion.button>
                ))}
                {filteredOthers.length === 0 && <p className="text-center py-6 text-sm text-gray-400">No matching event types</p>}
              </div>
            </motion.div>
          )}
        </div>
        <div className="h-8" />
      </motion.div>
    </motion.div>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────

export default function IdeasPageWrapper() {
  const { setIsNavbarVisible } = useNavbarVisibilityStore();

  const [eventType, setEventType] = useState(null);
  const [eventLabel, setEventLabel] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [activeSubtype, setActiveSubtype] = useState(null);
  const [activeNested, setActiveNested] = useState(null);
  const [reelsData, setReelsData] = useState(null);
  const [drawerItem, setDrawerItem] = useState(null);

  const config = useMemo(() => {
    if (!eventType) return null;
    return EVENT_CONFIGS[eventType] || getDefaultConfigForOther(eventType);
  }, [eventType]);

  const activeSubtypeData = useMemo(() => {
    if (!config || !activeSubtype) return null;
    return config.subtypes.find((s) => s.id === activeSubtype) || null;
  }, [config, activeSubtype]);

  const displayCarousels = useMemo(() => {
    if (!config) return [];
    if (activeSubtype) {
      const sc = config.getCarouselsForSubtype(activeSubtype, activeNested || undefined);
      if (sc.length > 0) return sc;
    }
    return config.carousels;
  }, [config, activeSubtype, activeNested]);

  // Navbar visibility: hide on modal, reels, or drawer
  useEffect(() => {
    const shouldHide = showModal || !!reelsData || !!drawerItem;
    setIsNavbarVisible(!shouldHide);
    return () => setIsNavbarVisible(true);
  }, [showModal, reelsData, drawerItem, setIsNavbarVisible]);

  const handleEventSelect = (type, label) => {
    setEventType(type);
    setEventLabel(label);
    setShowModal(false);
    setActiveSubtype(null);
    setActiveNested(null);
  };

  const handleSubtypeClick = (subtypeId) => {
    if (activeSubtype === subtypeId) {
      setActiveSubtype(null);
      setActiveNested(null);
    } else {
      setActiveSubtype(subtypeId);
      setActiveNested(null);
    }
  };

  const handleNestedClick = (nestedId) => {
    setActiveNested(activeNested === nestedId ? null : nestedId);
  };

  const handleItemClick = (item, allItems, index) => {
    setReelsData({ reels: allItems, initialIndex: index });
  };

  // Vendor drawer opens ON TOP of reels — reels stays open
  const handleSeeVendors = (item) => {
    setDrawerItem(item);
  };

  const handleCloseReels = () => {
    setReelsData(null);
  };

  const handleCloseDrawer = () => {
    setDrawerItem(null);
  };

  if (showModal || !eventType || !config) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <AnimatePresence>
          <EventSelectionModal onSelect={handleEventSelect} />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        {/* Title bar */}
        <div className="px-4 py-3 flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { setShowModal(true); setEventType(null); setActiveSubtype(null); setActiveNested(null); }}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">{eventLabel} Ideas</h1>
            <p className="text-[11px] text-gray-500 font-medium">
              {activeSubtype
                ? `${activeSubtypeData?.label || ""} ${activeNested ? `› ${activeSubtypeData?.nestedTypes?.find((n) => n.id === activeNested)?.label || ""}` : ""}`
                : "Explore all categories"}
            </p>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300">
            <Filter size={16} />
          </motion.button>
        </div>

        {/* Two-row subtype grid */}
        <SubtypeGridCarousel
          subtypes={config.subtypes}
          activeSubtype={activeSubtype}
          onSubtypeClick={handleSubtypeClick}
        />

        {/* Nested chips */}
        <AnimatePresence>
          {activeSubtypeData?.nestedTypes && activeSubtypeData.nestedTypes.length > 0 && (
            <NestedChips
              key={activeSubtype}
              nestedTypes={activeSubtypeData.nestedTypes}
              activeNested={activeNested}
              onNestedClick={handleNestedClick}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Carousels */}
      <div className="pt-6 space-y-2">
        {displayCarousels.length > 0 ? (
          displayCarousels.map((section) => (
            <SpringCarousel key={section.id} section={section} onItemClick={handleItemClick} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <Search size={28} className="text-gray-400" />
            </div>
            <p className="text-base font-bold text-gray-900 dark:text-white mb-1">No ideas yet</p>
            <p className="text-sm text-gray-500">Try selecting a different category above</p>
          </div>
        )}

        {displayCarousels.length > 0 && (
          <div className="px-4 pt-2 pb-4">
            <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shrink-0">
                <Sparkles size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white">Trending in {eventLabel}</h4>
                <p className="text-xs text-white/70 mt-0.5">See what others are booking this season</p>
              </div>
              <ChevronRight size={18} className="text-white/60 shrink-0" />
            </div>
          </div>
        )}
      </div>

      {/* Reels viewer — stays open even when drawer opens */}
      <AnimatePresence>
        {reelsData && (
          <ReelsViewerModal
            reels={reelsData.reels}
            initialIndex={reelsData.initialIndex}
            onClose={handleCloseReels}
            onSeeVendors={handleSeeVendors}
          />
        )}
      </AnimatePresence>

      {/* Vendor drawer — renders on top of everything including reels */}
      <AnimatePresence>
        {drawerItem && (
          <VendorDrawer item={drawerItem} onClose={handleCloseDrawer} />
        )}
      </AnimatePresence>
    </div>
  );
}