"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition, useMemo } from "react";
import {
  Building2, Camera, Paintbrush2, UserCheck, UtensilsCrossed, Shirt,
  Hand, CakeSlice, Gem, Mail, Music, Scissors, Lamp, Drum, MicVocal,
  Sparkles, FlameKindling, FileText, Search, Heart, Star, Briefcase,
  Baby, Users, ArrowRight,
} from "lucide-react";

const vendorCategories = [
  { key: "venues", label: "Venues", icon: Building2, description: "Banquet halls, hotels, resorts" },
  { key: "photographers", label: "Photographers", icon: Camera, description: "Wedding & event photography" },
  { key: "videographers", label: "Videographers", icon: Camera, description: "Wedding & event videography" },
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
  { key: "lighting", label: "Lighting", icon: Lamp, description: "Event lighting & ambience" },
  { key: "transportation", label: "Transportation", icon: Sparkles, description: "Wedding cars & transport" },
  { key: "florists", label: "Florists", icon: Sparkles, description: "Floral arrangements & bouquets" },
  { key: "other", label: "Other", icon: FileText, description: "Other services" },
];

const serviceCategories = [
  { key: "wedding", label: "Wedding Planning", icon: Heart, description: "Full wedding planning services", href: "/events/wedding" },
  { key: "anniversary", label: "Anniversary Planning", icon: Star, description: "Anniversary celebration planning", href: "/events/anniversary" },
  { key: "birthday", label: "Birthday Planning", icon: CakeSlice, description: "Birthday party planning", href: "/events/birthday" },
  { key: "corporate", label: "Corporate Planning", icon: Briefcase, description: "Corporate events & conferences", href: "/events/corporate" },
  { key: "babyshower", label: "Baby Shower Planning", icon: Baby, description: "Baby shower event planning", href: "/events/babyshower" },
  { key: "engagement", label: "Engagement Planning", icon: Gem, description: "Engagement ceremony planning", href: "/events/engagement" },
  { key: "reception", label: "Reception Planning", icon: Users, description: "Wedding reception planning", href: "/events/reception" },
];

// Aliases help fuzzy-match user typos / synonyms
const categoryAliases = {
  venues: ["venue", "hall", "banquet", "hotel", "resort", "farmhouse", "lawn"],
  photographers: ["photo", "photography", "photographer", "pictures", "candid"],
  videographers: ["video", "videography", "videographer", "film", "cinema", "reel"],
  makeup: ["makeup", "makeover", "beauty", "bridal makeup", "cosmetics", "artist"],
  planners: ["planner", "coordinator", "organiser", "organizer", "planning"],
  catering: ["catering", "food", "caterer", "cuisine", "buffet", "chef", "cook"],
  clothes: ["clothes", "dress", "lehenga", "sherwani", "outfit", "attire", "bridal wear", "groom"],
  mehendi: ["mehendi", "mehndi", "henna"],
  cakes: ["cake", "cakes", "bakery", "pastry", "dessert", "sweets"],
  jewellery: ["jewellery", "jewelry", "ornaments", "gold", "diamond", "bridal jewellery"],
  invitations: ["invitation", "card", "invite", "e-invite", "digital card", "wedding card"],
  djs: ["dj", "djs", "music", "disc jockey", "entertainment", "sound"],
  hairstyling: ["hair", "hairstyle", "hairstylist", "hairdresser", "blowout"],
  decor: ["decor", "decoration", "decorator", "floral", "theme", "backdrop"],
  dhol: ["dhol", "drum", "dholi", "dholak", "percussion"],
  anchor: ["anchor", "host", "emcee", "mc", "master of ceremony"],
  stageEntry: ["stage", "entry", "grand entry", "baraat entry", "drone entry"],
  fireworks: ["fireworks", "pyro", "fire", "sparklers", "crackers"],
  barat: ["barat", "baraat", "band", "horse", "procession", "ghodi"],
  lighting: ["light", "lighting", "led", "uplighting", "fairy lights"],
  transportation: ["car", "transport", "vehicle", "limo", "limousine", "vintage car"],
  florists: ["flower", "florist", "bouquet", "floral", "garland"],
  other: ["other", "misc", "miscellaneous"],
};

const serviceAliases = {
  wedding: ["wedding", "marriage", "shaadi", "vivah", "nikah", "shadi"],
  anniversary: ["anniversary", "anni", "celebration"],
  birthday: ["birthday", "bday", "b-day", "party", "bash"],
  corporate: ["corporate", "office", "business", "conference", "seminar", "company"],
  babyshower: ["baby shower", "babyshower", "baby", "shower"],
  engagement: ["engagement", "sagai", "ring ceremony", "propose", "roka"],
  reception: ["reception", "cocktail", "after party"],
};

export function matchItems(query) {
  const q = query.toLowerCase().trim();
  if (!q) return { vendors: [], services: [] };

  const matchedVendors = vendorCategories.filter((cat) => {
    const aliases = categoryAliases[cat.key] || [];
    return (
      cat.label.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      aliases.some((alias) => alias.includes(q) || q.includes(alias))
    );
  });

  const matchedServices = serviceCategories.filter((svc) => {
    const aliases = serviceAliases[svc.key] || [];
    return (
      svc.label.toLowerCase().includes(q) ||
      svc.description.toLowerCase().includes(q) ||
      aliases.some((alias) => alias.includes(q) || q.includes(alias))
    );
  });

  return { vendors: matchedVendors.slice(0, 5), services: matchedServices.slice(0, 4) };
}

/* ─── Shared suggestion list ─── */
export function SuggestionList({ query, onVendorSelect, onServiceSelect, onSearchAll }) {
  const { vendors, services } = useMemo(() => matchItems(query), [query]);
  const hasResults = vendors.length > 0 || services.length > 0;

  if (!query.trim()) {
    // Show popular categories when nothing typed
    return (
      <div className="px-4 pb-4 pt-1">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
          Popular Categories
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {vendorCategories.slice(0, 6).map((cat) => (
            <button
              key={cat.key}
              onClick={() => onVendorSelect(cat)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 flex items-center justify-center shrink-0 transition-colors">
                <cat.icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-sm text-gray-400">No results for &quot;{query}&quot;</p>
        <button
          onClick={() => onSearchAll(query)}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Search all vendors <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="pb-3">
      {services.length > 0 && (
        <div className="px-4 pt-2 pb-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-1">Services</p>
          {services.map((svc) => (
            <button
              key={svc.key}
              onClick={() => onServiceSelect(svc)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150 group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <svc.icon className="w-4 h-4 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate transition-colors">
                  {svc.label}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{svc.description}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 ml-auto shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {vendors.length > 0 && (
        <div className="px-4 pt-2 pb-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-1">Vendors</p>
          {vendors.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onVendorSelect(cat)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 transition-colors">
                <cat.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                  {cat.label}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{cat.description}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 ml-auto shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {query.trim() && (
        <div className="px-4 pt-2">
          <button
            onClick={() => onSearchAll(query)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-150 group"
          >
            <span className="text-[13px] text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Search all vendors for &quot;{query}&quot;
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Modal ─── */
export default function SearchModal({ externalOpen, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (externalOpen) {
      setOpen(true);
      onOpenChange?.(false);
    }
  }, [externalOpen, onOpenChange]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navigate = (href) => {
    startTransition(() => router.push(href));
    setTimeout(() => setOpen(false), 300);
  };

  const handleSearchAll = (q) => navigate(`/vendors/marketplace?search=${encodeURIComponent(q.trim())}`);
  const handleVendorSelect = (cat) => navigate(`/vendors/marketplace/${cat.key}`);
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[14vh] sm:pt-[18vh] bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => !isPending && setOpen(false)}
    >
      <div
        className="w-full max-w-xl mx-3 sm:mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] border border-gray-200/80 dark:border-gray-700/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
          {isPending ? (
            <svg className="w-5 h-5 text-blue-500 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search venues, vendors, services..."
            disabled={isPending}
            className="flex-1 text-[15px] text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none bg-transparent disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
            }}
          />

          <div className="flex items-center gap-2 shrink-0">
            {query.trim() && !isPending && (
              <>
                <button
                  type="button"
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Search
                </button>
              </>
            )}
            {!query.trim() && (
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-medium text-gray-400 bg-gray-100/80 dark:bg-gray-800 dark:text-gray-500 rounded-md border border-gray-200 dark:border-gray-700">
                ESC
              </kbd>
            )}
          </div>
        </div>

        {/* Loading bar */}
        {isPending && (
          <div className="h-0.5 w-full bg-gray-100 overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-pulse origin-left" />
          </div>
        )}

        {/* Suggestions */}
        <div className="max-h-[55vh] overflow-y-auto overscroll-contain">
          <SuggestionList
            query={query}
            onVendorSelect={handleVendorSelect}
            onServiceSelect={handleServiceSelect}
            onSearchAll={handleSearchAll}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-gray-50/80 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 shadow-sm">↵</kbd>
              to search
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 shadow-sm">esc</kbd>
              to close
            </span>
          </div>
          <span className="text-[11px] text-gray-300 dark:text-gray-600 font-medium tracking-wide">PlanWAB</span>
        </div>
      </div>
    </div>
  );
}