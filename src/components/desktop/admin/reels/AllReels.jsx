// components/desktop/admin/reels/AllReels.jsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Search,
  RefreshCw,
  FileText,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  ChevronDown,
  X,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Download,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Video,
  Play,
  Heart,
  Bookmark,
  Share2,
  Eye as EyeIcon,
  TrendingUp,
  Film,
  Tag,
  BarChart3,
  MessageCircle,
  ShoppingBag,
  Zap,
  Globe,
  Archive,
  Flag,
  Layers,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const REELS_PER_PAGE = 12;

const typeColors = {
  wedding:
    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  engagement:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  reception:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  mehendi:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  sangeet:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  haldi:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  babyShower:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  birthday:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  corporate:
    "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
  anniversary:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  other:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
};

const statusConfig = {
  published: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    icon: CheckCircle,
    label: "Published",
  },
  draft: {
    color:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
    icon: Clock,
    label: "Draft",
  },
  archived: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    icon: Archive,
    label: "Archived",
  },
  flagged: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    icon: Flag,
    label: "Flagged",
  },
};

const formatCount = (num) => {
  if (!num) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

const formatDuration = (duration) => {
  if (!duration) return "0:00";

  // ✅ If already formatted string like "0:36"
  if (typeof duration === "string") {
    if (duration.includes(":")) return duration;
    duration = parseFloat(duration);
  }

  // ✅ Convert seconds → mm:ss
  const m = Math.floor(duration / 60);
  const s = Math.floor(duration % 60);

  return `${m}:${s.toString().padStart(2, "0")}`;
};


export default function AllReels({
  onViewReel,
  onEditReel,
  refreshTrigger,
  onStatsUpdate,
}) {
  const [reels, setReels] = useState([]);
  const [allReelsData, setAllReelsData] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, settypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("table");
  const [activeFilter, setActiveFilter] = useState(null);

  const [selectedReel, setSelectedReel] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [previewReel, setPreviewReel] = useState(null);

  // ── Stats ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!allReelsData || allReelsData.length === 0) {
      return {
        total: paginationData?.total || 0,
        published: 0,
        draft: 0,
        archived: 0,
        flagged: 0,
        featured: 0,
        totalViews: 0,
        totalLikes: 0,
        totalShares: 0,
        thisMonth: 0,
        lastMonth: 0,
        growthRate: 0,
        avgEngagement: 0,
        toptype: "N/A",
        typedReels: 0,
      };
    }

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const published = allReelsData.filter(
      (r) => r.status === "published"
    ).length;
    const draft = allReelsData.filter((r) => r.status === "draft").length;
    const archived = allReelsData.filter(
      (r) => r.status === "archived"
    ).length;
    const flagged = allReelsData.filter(
      (r) => r.status === "flagged"
    ).length;
    const featured = allReelsData.filter((r) => r.isFeatured).length;

    const totalViews = allReelsData.reduce(
      (sum, r) => sum + (r.views || 0),
      0
    );
    const totalLikes = allReelsData.reduce(
      (sum, r) => sum + (r.likedBy?.length || 0),
      0
    );
    const totalShares = allReelsData.reduce(
      (sum, r) => sum + (r.shareCount || 0),
      0
    );

    const thisMonth = allReelsData.filter(
      (r) => new Date(r.createdAt) >= thisMonthStart
    ).length;
    const lastMonth = allReelsData.filter((r) => {
      const d = new Date(r.createdAt);
      return d >= lastMonthStart && d <= lastMonthEnd;
    }).length;

    const growthRate =
      lastMonth > 0
        ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
        : thisMonth > 0
        ? 100
        : 0;

    const typedReels = allReelsData.filter((r) => r.type).length;    

    const eventCounts = {};
    allReelsData.forEach((r) => {
      if (r.type)
        eventCounts[r.type] = (eventCounts[r.type] || 0) + 1;
    });
    const toptype =
      Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A";

    const avgEngagement =
      totalViews > 0
        ? parseFloat(
            (((totalLikes + totalShares) / totalViews) * 100).toFixed(1)
          )
        : 0;

    return {
      total: paginationData?.total || allReelsData.length,
      published,
      draft,
      archived,
      flagged,
      featured,
      totalViews,
      totalLikes,
      totalShares,
      thisMonth,
      lastMonth,
      growthRate,
      avgEngagement,
      toptype,
      typedReels,
    };
  }, [allReelsData, paginationData]);

  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchReels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: REELS_PER_PAGE.toString(),
        sortBy,
        sortOrder,
      });

      if (searchQuery) params.append("search", searchQuery);
      if (typeFilter !== "all")
        params.append("type", typeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all")
        params.append("category", categoryFilter);
      if (activeFilter === "featured") params.append("featured", "true");
      if (activeFilter === "published")
        params.append("status", "published");

      const response = await fetch(`/api/reels?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch reels");

      const result = await response.json();
      setReels(result.data || []);
      setPaginationData(result.pagination);

      // fetch all for stats only on first unfiltered load
      if (
        currentPage === 1 &&
        !searchQuery &&
        typeFilter === "all" &&
        statusFilter === "all" &&
        categoryFilter === "all" &&
        !activeFilter
      ) {
        const allRes = await fetch(`/api/reels?limit=1000`);
        if (allRes.ok) {
          const allResult = await allRes.json();
          setAllReelsData(allResult.data || []);
        }
      }
    } catch (err) {
      setError(err.message);
      setReels([]);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchQuery,
    typeFilter,
    statusFilter,
    categoryFilter,
    sortBy,
    sortOrder,
    activeFilter,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => fetchReels(), searchQuery ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchReels, refreshTrigger]);

  useEffect(() => {
    if (onStatsUpdate) onStatsUpdate({ total: stats.total });
  }, [stats.total, onStatsUpdate]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleViewClick = useCallback(
    (reel) => {
      if (!reel?._id) return;
      onViewReel?.(reel);
    },
    [onViewReel]
  );

  const handleEditClick = useCallback(
    (reel) => {
      if (!reel?._id) return;
      onEditReel?.(reel);
    },
    [onEditReel]
  );

  const handleDeleteClick = useCallback((reel) => {
    if (!reel?._id) return;
    setSelectedReel(reel);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    setSelectedReel(null);
    fetchReels();
  };

  const clearFilters = () => {
    setSearchQuery("");
    settypeFilter("all");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
    setActiveFilter(null);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === reels.length) setSelectedRows([]);
    else setSelectedRows(reels.map((r) => r._id));
  };

  const toggleSelectRow = (id) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  const exportToCSV = () => {
    const headers = [
      "Title",
      "Event Type",
      "Category",
      "Status",
      "Type",          // ── ADD ──
  "Subtype",       // ── ADD ──
  "Nested Type",   // ── ADD ──
  "Nested Values",
      "Views",
      "Likes",
      "Shares",
      "Duration",
      "Featured",
      "Created At",
    ];
    const rows = reels.map((r) => [
      r.title,
      r.type,
      r.category,
      r.status,
      r.type || "",           // ── ADD ──
  r.subtype || "",        // ── ADD ──
  r.nestedType || "",     // ── ADD ──
  (r.nestedValues || []).join("; "),
      r.views || 0,
      r.likedBy?.length || 0,
      r.shareCount || 0,
      formatDuration(r.duration),
      r.isFeatured ? "Yes" : "No",
      new Date(r.createdAt).toLocaleDateString(),
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reels-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = !!(
    searchQuery ||
    typeFilter !== "all" ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    activeFilter
  );

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (typeFilter !== "all" ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0) +
    (activeFilter ? 1 : 0);

  // ── Dropdown Options ───────────────────────────────────────────────────
  const typeOptions = [
    { value: "all", label: "All Events" },
    { value: "wedding", label: "Wedding" },
    { value: "engagement", label: "Engagement" },
    { value: "reception", label: "Reception" },
    { value: "mehendi", label: "Mehendi" },
    { value: "sangeet", label: "Sangeet" },
    { value: "haldi", label: "Haldi" },
    { value: "babyShower", label: "Baby Shower" },
    { value: "birthday", label: "Birthday" },
    { value: "corporate", label: "Corporate" },
    { value: "anniversary", label: "Anniversary" },
    { value: "other", label: "Other" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
    { value: "flagged", label: "Flagged" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "venues", label: "Venues" },
    { value: "photographers", label: "Photographers" },
    { value: "makeup", label: "Makeup" },
    { value: "planners", label: "Planners" },
    { value: "catering", label: "Catering" },
    { value: "clothes", label: "Clothes" },
    { value: "mehendi", label: "Mehendi" },
    { value: "cakes", label: "Cakes" },
    { value: "jewellery", label: "Jewellery" },
    { value: "djs", label: "DJs" },
    { value: "hairstyling", label: "Hairstyling" },
    { value: "decor", label: "Decor" },
    { value: "other", label: "Other" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Date Added" },
    { value: "views", label: "Views" },
    { value: "likesCount", label: "Likes" },
    { value: "shareCount", label: "Shares" },
    { value: "title", label: "Title" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard
          icon={Film}
          label="Total Reels"
          value={formatCount(stats.total)}
          color="bg-rose-500"
          lightBg="bg-rose-50 dark:bg-rose-900/20"
        />
        <StatsCard
          icon={EyeIcon}
          label="Total Views"
          value={formatCount(stats.totalViews)}
          color="bg-blue-500"
          lightBg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatsCard
          icon={Heart}
          label="Total Likes"
          value={formatCount(stats.totalLikes)}
          color="bg-pink-500"
          lightBg="bg-pink-50 dark:bg-pink-900/20"
          onClick={() => {
            setActiveFilter(
              activeFilter === "published" ? null : "published"
            );
            setCurrentPage(1);
          }}
          isActive={activeFilter === "published"}
        />
        <StatsCard
          icon={Sparkles}
          label="Featured"
          value={stats.featured}
          color="bg-yellow-500"
          lightBg="bg-yellow-50 dark:bg-yellow-900/20"
          onClick={() => {
            setActiveFilter(
              activeFilter === "featured" ? null : "featured"
            );
            setCurrentPage(1);
          }}
          isActive={activeFilter === "featured"}
        />
        <StatsCard
          icon={BarChart3}
          label={`Engagement • Top: ${stats.toptype}`}
          value={`${stats.avgEngagement}%`}
          color="bg-purple-500"
          lightBg="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatsCard
          icon={Calendar}
          label="This Month"
          value={stats.thisMonth}
          trend={stats.growthRate}
          color="bg-green-500"
          lightBg="bg-green-50 dark:bg-green-900/20"
        />
        <StatsCard
  icon={Layers}
  label="Typed Reels"
  value={formatCount(stats.typedReels)}
  color="bg-indigo-500"
  lightBg="bg-indigo-50 dark:bg-indigo-900/20"
/>
      </div>

      {/* ── Filters & Search ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col gap-4">
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by title, caption, or tags..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  showFilters || hasActiveFilters
                    ? "bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="hidden sm:block px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-rose-500 outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    Sort: {o.label}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "table"
                      ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title="Table View"
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Export to CSV"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={fetchReels}
                disabled={loading}
                className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <FilterDropdown
                    label="Event Type"
                    options={typeOptions}
                    value={typeFilter}
                    onChange={(val) => {
                      settypeFilter(val);
                      setCurrentPage(1);
                    }}
                    icon={Film}
                  />
                  <FilterDropdown
                    label="Status"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(val) => {
                      setStatusFilter(val);
                      setCurrentPage(1);
                    }}
                    icon={Globe}
                  />
                  <FilterDropdown
                    label="Category"
                    options={categoryOptions}
                    value={categoryFilter}
                    onChange={(val) => {
                      setCategoryFilter(val);
                      setCurrentPage(1);
                    }}
                    icon={Tag}
                  />

                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                      sortOrder === "desc"
                        ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {sortOrder === "asc" ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    <span className="hidden sm:inline">
                      {sortOrder === "asc" ? "Asc" : "Desc"}
                    </span>
                  </button>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X size={14} />
                      Clear All
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Selected Actions Bar ── */}
      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl p-3 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-rose-700 dark:text-rose-300">
              {selectedRows.length} reel
              {selectedRows.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRows([])}
                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      {viewMode === "table" ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === reels.length &&
                        reels.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                  </th>
                  {[
                    "Reel",
                    "Event",
                    "Status",
                    "Type",
                    "Views",
                    "Engagement",
                    "Duration",
                    "Actions",
                  ].map((h, i) => (
                    <th
    key={h}
    className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
      i >= 4 ? "hidden lg:table-cell" : ""   // shift hidden breakpoints by 1
    } ${i === 2 ? "hidden md:table-cell" : ""} ${
      i === 3 ? "hidden lg:table-cell" : ""  // ADD: hide Type on small
    } ${i === 7 ? "text-right" : ""}`}       // shift Actions index to 7
  >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: REELS_PER_PAGE }).map((_, i) => (
                    <ReelRowSkeleton key={i} />
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <ErrorState
                        message={error}
                        onRetry={fetchReels}
                      />
                    </td>
                  </tr>
                ) : reels.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <EmptyState
                        hasFilters={hasActiveFilters}
                        onClear={clearFilters}
                      />
                    </td>
                  </tr>
                ) : (
                  reels.map((reel) => (
                    <ReelTableRow
                      key={reel._id}
                      reel={reel}
                      isSelected={selectedRows.includes(reel._id)}
                      onToggleSelect={() => toggleSelectRow(reel._id)}
                      onView={() => handleViewClick(reel)}
                      onEdit={() => handleEditClick(reel)}
                      onDelete={() => handleDeleteClick(reel)}
                      onPreview={() => setPreviewReel(reel)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ReelCardSkeleton key={i} />
            ))
          ) : error ? (
            <div className="col-span-full py-12">
              <ErrorState message={error} onRetry={fetchReels} />
            </div>
          ) : reels.length === 0 ? (
            <div className="col-span-full py-12">
              <EmptyState
                hasFilters={hasActiveFilters}
                onClear={clearFilters}
              />
            </div>
          ) : (
            reels.map((reel) => (
              <ReelCard
                key={reel._id}
                reel={reel}
                onView={() => handleViewClick(reel)}
                onEdit={() => handleEditClick(reel)}
                onDelete={() => handleDeleteClick(reel)}
                onPreview={() => setPreviewReel(reel)}
              />
            ))
          )}
        </div>
      )}

      {/* ── Pagination ── */}
      {paginationData && paginationData.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginationData.totalPages}
          total={paginationData.total}
          limit={REELS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* ── Delete Modal ── */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedReel && (
          <DeleteReelModal
            reel={selectedReel}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </AnimatePresence>

      {/* ── Video Preview Modal ── */}
      <AnimatePresence>
        {previewReel && (
          <VideoPreviewModal
            reel={previewReel}
            onClose={() => setPreviewReel(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-Components ─────────────────────────────────────────────────────────────

const StatsCard = ({
  icon: Icon,
  label,
  value,
  trend,
  suffix,
  color,
  lightBg,
  onClick,
  isActive,
}) => (
  <div
    onClick={onClick}
    className={`${lightBg} rounded-xl p-4 border ${
      isActive
        ? "border-rose-500 dark:border-rose-400 ring-2 ring-rose-500/20"
        : "border-gray-200 dark:border-gray-700"
    } ${onClick ? "cursor-pointer hover:shadow-md transition-all" : ""}`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color} text-white`}>
        <Icon size={16} />
      </div>
      {trend !== undefined && trend !== 0 && (
        <div
          className={`flex items-center gap-0.5 text-xs font-medium ${
            trend > 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend > 0 ? (
            <ArrowUpRight size={12} />
          ) : (
            <ArrowDownRight size={12} />
          )}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">
      {value}
      {suffix && (
        <span className="text-sm font-normal text-gray-500 ml-1">
          {suffix}
        </span>
      )}
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

const FilterDropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        {Icon && <Icon size={14} className="text-gray-500" />}
        <span className="text-gray-700 dark:text-gray-300">
          {selected?.label || label}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${
                    value === opt.value
                      ? "bg-rose-50 dark:bg-rose-900/30 text-rose-600"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {opt.label}
                  {value === opt.value && <CheckCircle size={14} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReelTableRow = ({
  reel,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const status = statusConfig[reel.status] || statusConfig.published;
  const StatusIcon = status.icon;
  const likes = reel.likedBy?.length || 0;
  const saves = reel.savedBy?.length || 0;
  const engagementRate =
    reel.views > 0
      ? (((likes + saves + (reel.shareCount || 0)) / reel.views) * 100).toFixed(1)
      : "0.0";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
        />
      </td>

      {/* Reel */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="relative flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer group/thumb"
            onClick={onPreview}
          >
            {reel.thumbnailUrl ? (
              <Image
                src={reel.thumbnailUrl}
                alt={reel.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Video size={16} className="text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
              <Play size={14} className="text-white fill-white" />
            </div>
            {reel.duration && (
              <span className="absolute bottom-0.5 right-0.5 text-[9px] bg-black/70 text-white px-1 rounded">
                {formatDuration(reel.duration) || reel.duration}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
                {reel.title}
              </span>
              {reel.isFeatured && (
                <Sparkles size={12} className="text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
              {reel.caption || "No caption"}
            </div>
          </div>
        </div>
      </td>

      {/* Event */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
            typeColors[reel.type] || typeColors.other
          }`}
        >
          {reel.type || "other"}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3 hidden md:table-cell">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
        >
          <StatusIcon size={11} />
          {status.label}
        </span>
      </td>

      <td className="px-4 py-3 hidden lg:table-cell">
  <div className="space-y-0.5">
    {reel.type && (
      <div className="flex items-center gap-1 text-xs">
        <Layers size={11} className="text-gray-400 flex-shrink-0" />
        <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[100px]">
          {reel.type}
        </span>
      </div>
    )}
    {reel.subtype && (
      <div className="text-xs text-gray-400 pl-4 truncate max-w-[100px]">
        {reel.subtype}
      </div>
    )}
    {reel.nestedType && (
      <div className="text-xs text-gray-400 pl-4 truncate max-w-[100px]">
        {reel.nestedType}
      </div>
    )}
    {reel.nestedValues?.length > 0 && (
  <div className="flex flex-wrap gap-0.5 mt-1 pl-4">
    {reel.nestedValues.slice(0, 2).map((v, i) => (
      <span
        key={i}
        className="px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[9px] font-medium rounded"
      >
        {v}
      </span>
    ))}
    {reel.nestedValues.length > 2 && (
      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-400 text-[9px] rounded">
        +{reel.nestedValues.length - 2}
      </span>
    )}
  </div>
)}
    {!reel.type && (
      <span className="text-xs text-gray-400">—</span>
    )}
  </div>
</td>

      {/* Views */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
          <EyeIcon size={14} className="text-gray-400" />
          {formatCount(reel.views)}
        </div>
      </td>

      {/* Engagement */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Heart size={11} className="text-pink-500" />
              {formatCount(likes)}
            </span>
            <span className="flex items-center gap-1">
              <Share2 size={11} className="text-blue-500" />
              {formatCount(reel.shareCount)}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark size={11} className="text-purple-500" />
              {formatCount(saves)}
            </span>
          </div>
          <div className="text-xs text-gray-400">{engagementRate}% eng.</div>
        </div>
      </td>

      {/* Duration */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">
          {formatDuration(reel.duration)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onPreview}
            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
            title="Preview"
          >
            <Play size={15} />
          </button>
          <button
            onClick={onView}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ReelRowSkeleton = () => (
  <tr className="animate-pulse">
    {[10, 200, 80, 80, 60, 80, 50, 100].map((w, i) => (
      <td key={i} className="px-4 py-3">
        <div
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded`}
          style={{ width: w }}
        />
      </td>
    ))}
  </tr>
);

const ReelCard = ({ reel, onView, onEdit, onDelete, onPreview }) => {
  const status = statusConfig[reel.status] || statusConfig.published;
  const likes = reel.likedBy?.length || 0;
  const saves = reel.savedBy?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group"
    >
      {/* thumbnailUrl */}
      <div
        className="relative h-48 cursor-pointer"
        onClick={onPreview}
      >
        {reel.thumbnailUrl ? (
          <Image
            src={reel.thumbnailUrl}
            alt={reel.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <Video size={40} className="text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Play size={20} className="text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {reel.isFeatured && (
            <span className="px-1.5 py-0.5 bg-yellow-500 text-black text-[10px] font-bold rounded-full flex items-center gap-1">
              <Sparkles size={9} /> Featured
            </span>
          )}
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${status.color}`}
          >
            {status.label}
          </span>
        </div>

        {/* Duration */}
        {reel.duration && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-mono rounded">
            {formatDuration(reel.duration)}
          </span>
        )}

        {/* Bottom Info */}
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-white font-semibold text-sm truncate">
            {reel.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                typeColors[reel.type] || typeColors.other
              }`}
            >
              {reel.type || "other"}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3">
        {/* Engagement Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <EyeIcon size={12} className="text-gray-400" />
              {formatCount(reel.views)}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={12} className="text-pink-500" />
              {formatCount(likes)}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark size={12} className="text-purple-500" />
              {formatCount(saves)}
            </span>
            <span className="flex items-center gap-1">
              <Share2 size={12} className="text-blue-500" />
              {formatCount(reel.shareCount)}
            </span>
          </div>
        </div>

        {/* ── ADD: Type / Subtype / NestedType badges ── */}
{(reel.type || reel.subtype || reel.nestedType) && (
  <div className="flex flex-wrap gap-1 mb-2">
    {reel.type && (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-medium rounded-md border border-indigo-200 dark:border-indigo-800">
        <Layers size={9} />
        {reel.type}
      </span>
    )}
    {reel.subtype && (
      <span className="px-2 py-0.5 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-[10px] font-medium rounded-md border border-violet-200 dark:border-violet-800">
        {reel.subtype}
      </span>
    )}
    {reel.nestedType && (
      <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-medium rounded-md border border-purple-200 dark:border-purple-800">
        {reel.nestedType}
      </span>
    )}
  </div>
)}

        {/* Tags */}
        {reel.tags && reel.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {reel.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] rounded-md"
              >
                #{tag}
              </span>
            ))}
            {reel.tags.length > 3 && (
              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-400 text-[10px] rounded-md">
                +{reel.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-400">
            {new Date(reel.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onPreview}
              className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
              title="Preview"
            >
              <Play size={13} />
            </button>
            <button
              onClick={onView}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="View"
            >
              <Eye size={13} />
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit size={13} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ReelCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-3">
        {[40, 32, 32, 32].map((w, i) => (
          <div
            key={i}
            className="h-3 bg-gray-200 dark:bg-gray-700 rounded"
            style={{ width: w }}
          />
        ))}
      </div>
      <div className="flex gap-1">
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded-md" />
        <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-3">
    <AlertTriangle size={36} className="text-red-400" />
    <p className="text-red-500 font-medium">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
    >
      Try Again
    </button>
  </div>
);

const EmptyState = ({ hasFilters, onClear }) => (
  <div className="flex flex-col items-center gap-3">
    <Film size={36} className="text-gray-300 dark:text-gray-600" />
    <p className="text-gray-500 dark:text-gray-400 font-medium">
      No reels found
    </p>
    <p className="text-sm text-gray-400 dark:text-gray-500">
      {hasFilters
        ? "Try adjusting your filters"
        : "Upload your first reel to get started"}
    </p>
    {hasFilters && (
      <button
        onClick={onClear}
        className="px-4 py-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium"
      >
        Clear Filters
      </button>
    )}
  </div>
);

const Pagination = ({ currentPage, totalPages, total, limit, onPageChange }) => {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {total}
        </span>{" "}
        reels
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex flex-row p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          <ChevronLeft size={16} className="-ml-2" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-500/25"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex flex-row p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
          <ChevronRight size={16} className="-ml-2" />
        </button>
      </div>
    </div>
  );
};

// ── Delete Modal ───────────────────────────────────────────────────────────────
const DeleteReelModal = ({ reel, onClose, onConfirm }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
          <Trash2 size={22} className="text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Delete Reel
          </h3>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          &ldquo;{reel.title}&rdquo;
        </span>
        ? The video and all associated data will be permanently removed.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              await fetch(`/api/reels/${reel._id}`, { method: "DELETE" });
              onConfirm();
            } catch (e) {
              console.error(e);
            }
          }}
          className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Delete Reel
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// ── Video Preview Modal ────────────────────────────────────────────────────────
const VideoPreviewModal = ({ reel, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-sm bg-black rounded-2xl overflow-hidden shadow-2xl"
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <X size={16} />
      </button>
      <div className="aspect-[9/16] relative">
        {reel.videoUrl ? (
          <video
            src={reel.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain bg-black"
            poster={reel.thumbnailUrl}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center text-gray-400">
              <Video size={40} className="mx-auto mb-2" />
              <p className="text-sm">No video URL</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-900 text-white">
        <h3 className="font-semibold truncate">{reel.title}</h3>
        {reel.caption && (
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {reel.caption}
          </p>
        )}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <EyeIcon size={12} /> {formatCount(reel.views)}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={12} /> {formatCount(reel.likedBy?.length)}
          </span>
          <span className="flex items-center gap-1">
            <Share2 size={12} /> {formatCount(reel.shareCount)}
          </span>
        </div>
        {(reel.type || reel.subtype || reel.nestedType) && (
  <div className="flex flex-wrap gap-1 mt-2">
    {reel.type && (
      <span className="px-1.5 py-0.5 bg-indigo-900/40 text-indigo-300 text-[10px] rounded-md border border-indigo-700">
        {reel.type}
      </span>
    )}
    {reel.subtype && (
      <span className="px-1.5 py-0.5 bg-violet-900/40 text-violet-300 text-[10px] rounded-md border border-violet-700">
        {reel.subtype}
      </span>
    )}
    {reel.nestedType && (
      <span className="px-1.5 py-0.5 bg-purple-900/40 text-purple-300 text-[10px] rounded-md border border-purple-700">
        {reel.nestedType}
      </span>
    )}
  </div>
)}
      </div>
    </motion.div>
  </motion.div>
);