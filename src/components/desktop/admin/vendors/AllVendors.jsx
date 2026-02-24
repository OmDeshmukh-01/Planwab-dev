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
  Filter,
  RefreshCw,
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
  FileText,
  Star,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  ChevronDown,
  X,
  DollarSign,
  Calendar,
  Award,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Shield,
  Eye as EyeIcon,
  Download,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import DeleteVendorModal from "../modals/vendors/DeleteVendorModal";

const VENDORS_PER_PAGE = 10;

const categoryIcons = {
  venues: Building2,
  photographers: Camera,
  makeup: Paintbrush2,
  planners: UserCheck,
  catering: UtensilsCrossed,
  clothes: Shirt,
  mehendi: Hand,
  cakes: CakeSlice,
  jewellery: Gem,
  invitations: Mail,
  djs: Music,
  hairstyling: Scissors,
  other: FileText,
};

const categoryColors = {
  venues: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  photographers: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  makeup: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  planners: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  catering: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  clothes: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  mehendi: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  cakes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  jewellery: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  invitations: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  djs: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  hairstyling: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
};

const availabilityConfig = {
  Available: { color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300", icon: CheckCircle },
  Unavailable: { color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300", icon: XCircle },
  Busy: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300", icon: Clock },
  Closed: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300", icon: XCircle },
};

export default function AllVendors({ onViewVendor, onEditVendor, refreshTrigger }) {
  const [vendors, setVendors] = useState([]);
  const [allVendorsData, setAllVendorsData] = useState([]);
  const [paginationData, setPaginationData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("table");
  const [activeFilter, setActiveFilter] = useState(null); // null | 'active' | 'verified' | 'featured'

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const stats = useMemo(() => {
    if (!allVendorsData || allVendorsData.length === 0) {
      return {
        total: paginationData?.total || 0,
        active: 0,
        inactive: 0,
        verified: 0,
        featured: 0,
        categories: 0,
        thisMonth: 0,
        lastMonth: 0,
        avgRating: 0,
        totalBookings: 0,
        totalRevenue: 0,
        topCategory: "N/A",
        growthRate: 0,
      };
    }

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const active = allVendorsData.filter((v) => v.availabilityStatus === "Available" || v.isActive).length;
    const inactive = allVendorsData.filter(
      (v) => v.availabilityStatus === "Unavailable" || v.availabilityStatus === "Closed"
    ).length;
    const verified = allVendorsData.filter((v) => v.isVerified).length;
    const featured = allVendorsData.filter((v) => v.isFeatured).length;

    const thisMonth = allVendorsData.filter((v) => new Date(v.createdAt) >= thisMonthStart).length;
    const lastMonth = allVendorsData.filter((v) => {
      const date = new Date(v.createdAt);
      return date >= lastMonthStart && date <= lastMonthEnd;
    }).length;

    const categoryCounts = {};
    allVendorsData.forEach((v) => {
      if (v.category) {
        categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
      }
    });
    const categories = Object.keys(categoryCounts).length;
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const ratingsSum = allVendorsData.reduce((sum, v) => sum + (v.rating || 0), 0);
    const avgRating = allVendorsData.length > 0 ? (ratingsSum / allVendorsData.length).toFixed(1) : 0;

    const totalBookings = allVendorsData.reduce((sum, v) => sum + (v.bookings || 0), 0);
    const totalRevenue = allVendorsData.reduce((sum, v) => sum + (v.basePrice || 0), 0);

    const growthRate =
      lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : thisMonth > 0 ? 100 : 0;

    return {
      total: paginationData?.total || allVendorsData.length,
      active,
      inactive,
      verified,
      featured,
      categories,
      thisMonth,
      lastMonth,
      avgRating,
      totalBookings,
      totalRevenue,
      topCategory,
      growthRate,
      categoryCounts,
    };
  }, [allVendorsData, paginationData]);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: VENDORS_PER_PAGE.toString(),
        sortBy,
        sortOrder,
      });

      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (availabilityFilter !== "all") params.append("availability", availabilityFilter);
      if (activeFilter === "featured") params.append("featured", "true");
      if (activeFilter === "verified") params.append("verifiedOnly", "true");
      if (activeFilter === "active") params.append("activeOnly", "true");

      const response = await fetch(`/api/vendor?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch vendors");

      const result = await response.json();
      setVendors(result.data || []);
      setPaginationData(result.pagination);

      if (currentPage === 1 && !searchQuery && categoryFilter === "all" && availabilityFilter === "all" && !activeFilter) {
        const allResponse = await fetch(`/api/vendor?limit=1000`);
        if (allResponse.ok) {
          const allResult = await allResponse.json();
          setAllVendorsData(allResult.data || []);
        }
      }
    } catch (err) {
      setError(err.message);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, availabilityFilter, sortBy, sortOrder, activeFilter]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => fetchVendors(), searchQuery ? 300 : 0);
    return () => clearTimeout(debounceTimer);
  }, [fetchVendors, refreshTrigger]);

  const handleViewClick = useCallback(
    (vendor) => {
      if (!vendor?._id) return;
      onViewVendor?.(vendor);
    },
    [onViewVendor]
  );

  const handleEditClick = useCallback(
    (vendor) => {
      if (!vendor?._id) return;
      onEditVendor?.(vendor);
    },
    [onEditVendor]
  );

  const handleDeleteClick = useCallback((vendor) => {
    if (!vendor?._id) return;
    setSelectedVendor(vendor);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = () => {
    setDeleteModalOpen(false);
    setSelectedVendor(null);
    fetchVendors();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setAvailabilityFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
    setActiveFilter(null);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === vendors.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(vendors.map((v) => v._id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Category", "City", "Rating", "Price", "Status"];
    const rows = vendors.map((v) => [
      v.name,
      v.email,
      v.phoneNo,
      v.category,
      v.address?.city || "",
      v.rating || 0,
      v.basePrice || 0,
      v.availabilityStatus || "Available",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendors-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
    { value: "invitations", label: "Invitations" },
    { value: "djs", label: "DJs" },
    { value: "hairstyling", label: "Hairstyling" },
    { value: "decor", label: "Decorators" },
    { value: "dhol", label: "Dhol" },
    { value: "anchor", label: "Anchor" },
    { value: "stageEntry", label: "Stage Entry" },
    { value: "fireworks", label: "Fireworks" },
    { value: "barat", label: "Barat" },
    { value: "other", label: "Other" },
  ];

  const availabilityOptions = [
    { value: "all", label: "All Status" },
    { value: "Available", label: "Available" },
    { value: "Busy", label: "Busy" },
    { value: "Unavailable", label: "Unavailable" },
    { value: "Closed", label: "Closed" },
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "rating", label: "Rating" },
    { value: "basePrice", label: "Price" },
    { value: "bookings", label: "Bookings" },
  ];

  const hasActiveFilters = !!(searchQuery || categoryFilter !== "all" || availabilityFilter !== "all" || activeFilter);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard
          icon={Users}
          label="Total Vendors"
          value={stats.total}
          color="bg-blue-500"
          lightBg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatsCard
          icon={Building2}
          label={`Total Categories \u00A0 - Top: ${stats.topCategory}`}
          value={stats.categories}
          color="bg-blue-500"
          lightBg="bg-orange-50 dark:bg-orange-900/20"
        />
        <StatsCard
          icon={CheckCircle}
          label="Active"
          value={stats.active}
          trend={stats.growthRate}
          color="bg-green-500"
          lightBg="bg-green-50 dark:bg-green-900/20"
          onClick={() => {
            setActiveFilter(activeFilter === "active" ? null : "active");
            setCurrentPage(1);
          }}
          isActive={activeFilter === "active"}
        />
        <StatsCard
          icon={Shield}
          label="Verified"
          value={stats.verified}
          suffix={`/ ${stats.total}`}
          color="bg-indigo-500"
          lightBg="bg-indigo-50 dark:bg-indigo-900/20"
          onClick={() => {
            setActiveFilter(activeFilter === "verified" ? null : "verified");
            setCurrentPage(1);
          }}
          isActive={activeFilter === "verified"}
        />
        <StatsCard
          icon={Sparkles}
          label="Featured"
          value={stats.featured}
          color="bg-yellow-500"
          lightBg="bg-yellow-50 dark:bg-yellow-900/20"
          onClick={() => {
            setActiveFilter(activeFilter === "featured" ? null : "featured");
            setCurrentPage(1);
          }}
          isActive={activeFilter === "featured"}
        />
        <StatsCard
          icon={Calendar}
          label="This Month"
          value={stats.thisMonth}
          trend={stats.growthRate}
          color="bg-purple-500"
          lightBg="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col gap-4">
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters || hasActiveFilters
                  ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                    {(searchQuery ? 1 : 0) +
                      (categoryFilter !== "all" ? 1 : 0) +
                      (availabilityFilter !== "all" ? 1 : 0) +
                      (activeFilter ? 1 : 0)}
                  </span>
                )}
              </button>

              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 transition-colors ${viewMode === "table"
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  title="Table View"
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${viewMode === "grid"
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
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
                onClick={fetchVendors}
                disabled={loading}
                className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Filter Row */}
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
                    label="Category"
                    options={categoryOptions}
                    value={categoryFilter}
                    onChange={(val) => {
                      setCategoryFilter(val);
                      setCurrentPage(1);
                    }}
                    icon={Building2}
                  />

                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${sortOrder === "desc"
                      ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      }`}
                    title={sortOrder === "asc" ? "Ascending" : "Descending"}
                  >
                    {sortOrder === "asc" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span className="hidden sm:inline">{sortOrder === "asc" ? "Asc" : "Desc"}</span>
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

      {/* Selected Actions Bar */}
      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {selectedRows.length} vendor{selectedRows.length > 1 ? "s" : ""} selected
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

      {/* Content */}
      {viewMode === "table" ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === vendors.length && vendors.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: VENDORS_PER_PAGE }).map((_, i) => <VendorRowSkeleton key={i} />)
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <AlertTriangle size={36} className="text-red-400" />
                        <p className="text-red-500 font-medium">{error}</p>
                        <button
                          onClick={fetchVendors}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : vendors.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users size={36} className="text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No vendors found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          {hasActiveFilters ? "Try adjusting your filters" : "Add your first vendor to get started"}
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  vendors.map((vendor) => (
                    <VendorTableRow
                      key={vendor._id}
                      vendor={vendor}
                      isSelected={selectedRows.includes(vendor._id)}
                      onToggleSelect={() => toggleSelectRow(vendor._id)}
                      onView={() => handleViewClick(vendor)}
                      onEdit={() => handleEditClick(vendor)}
                      onDelete={() => handleDeleteClick(vendor)}
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
            Array.from({ length: 8 }).map((_, i) => <VendorCardSkeleton key={i} />)
          ) : error ? (
            <div className="col-span-full flex flex-col items-center gap-3 py-12">
              <AlertTriangle size={36} className="text-red-400" />
              <p className="text-red-500 font-medium">{error}</p>
              <button
                onClick={fetchVendors}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : vendors.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-3 py-12">
              <Users size={36} className="text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No vendors found</p>
            </div>
          ) : (
            vendors.map((vendor) => (
              <VendorCard
                key={vendor._id}
                vendor={vendor}
                onView={() => handleViewClick(vendor)}
                onEdit={() => handleEditClick(vendor)}
                onDelete={() => handleDeleteClick(vendor)}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {paginationData && paginationData.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginationData.totalPages}
          total={paginationData.total}
          limit={VENDORS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedVendor && (
          <DeleteVendorModal
            vendor={selectedVendor}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const StatsCard = ({ icon: Icon, label, value, trend, suffix, color, lightBg, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`${lightBg} rounded-xl p-4 border ${isActive
      ? "border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20"
      : "border-gray-200 dark:border-gray-700"
      } ${onClick ? "cursor-pointer hover:shadow-md transition-all" : ""}`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color} text-white`}>
        <Icon size={16} />
      </div>
      {trend !== undefined && trend !== 0 && (
        <div
          className={`flex items-center gap-0.5 text-xs font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}
        >
          {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">
      {value}
      {suffix && <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>}
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

const FilterDropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        {Icon && <Icon size={14} className="text-gray-500" />}
        <span className="text-gray-700 dark:text-gray-300">{selectedOption?.label || label}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${value === option.value
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600"
                    : "text-gray-700 dark:text-gray-300"
                    }`}
                >
                  {option.label}
                  {value === option.value && <CheckCircle size={14} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const VendorTableRow = ({ vendor, isSelected, onToggleSelect, onView, onEdit, onDelete }) => {
  const CategoryIcon = categoryIcons[vendor.category] || FileText;
  const availability = availabilityConfig[vendor.availabilityStatus] || availabilityConfig.Available;
  const AvailabilityIcon = availability.icon;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <Image
              className="h-10 w-10 rounded-lg object-cover ring-2 ring-gray-100 dark:ring-gray-700"
              src={vendor.defaultImage || vendor.images?.[0] || "/placeholder-vendor.jpg"}
              alt={vendor.name}
              width={40}
              height={40}
            />
            {vendor.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                <CheckCircle size={10} className="text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
                {vendor.name}
              </span>
              {vendor.isFeatured && <Sparkles size={12} className="text-yellow-500 flex-shrink-0" />}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{vendor.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[vendor.category] || categoryColors.other
            }`}
        >
          <CategoryIcon size={12} />
          <span className="capitalize">{vendor.category}</span>
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
          <MapPin size={14} className="text-gray-400 flex-shrink-0" />
          <span className="truncate max-w-[120px]">{vendor.address?.city || "N/A"}</span>
        </div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {vendor.rating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-xs text-gray-400">({vendor.reviews || 0})</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${availability.color}`}
        >
          <AvailabilityIcon size={12} />
          {vendor.availabilityStatus || "Available"}
        </span>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          ₹{vendor.basePrice?.toLocaleString("en-IN") || "N/A"}
        </div>
        <div className="text-xs text-gray-400">per {vendor.priceUnit || "day"}</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onView}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const VendorRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </td>
    <td className="px-4 py-3 hidden md:table-cell">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-4 py-3 hidden lg:table-cell">
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </td>
    <td className="px-4 py-3 hidden lg:table-cell">
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="flex justify-end gap-1">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </td>
  </tr>
);

const VendorCard = ({ vendor, onView, onEdit, onDelete }) => {
  const CategoryIcon = categoryIcons[vendor.category] || FileText;
  const availability = availabilityConfig[vendor.availabilityStatus] || availabilityConfig.Available;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group"
    >
      <div className="relative h-36">
        <Image
          src={vendor.defaultImage || vendor.images?.[0] || "/placeholder-vendor.jpg"}
          alt={vendor.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 left-2 flex gap-1">
          {vendor.isVerified && (
            <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
              <CheckCircle size={10} /> Verified
            </span>
          )}
          {vendor.isFeatured && (
            <span className="px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-bold rounded-full flex items-center gap-1">
              <Sparkles size={10} /> Featured
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${availability.color}`}>
            {vendor.availabilityStatus || "Available"}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-white font-semibold truncate">{vendor.name}</h3>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span className="flex items-center gap-1">
              <MapPin size={10} />
              {vendor.address?.city || "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Star size={10} className="fill-yellow-500 text-yellow-500" />
              {vendor.rating?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[vendor.category] || categoryColors.other
              }`}
          >
            <CategoryIcon size={10} />
            <span className="capitalize">{vendor.category}</span>
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            ₹{vendor.basePrice?.toLocaleString("en-IN") || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500">{vendor.bookings || 0} bookings</span>
          <div className="flex items-center gap-1">
            <button
              onClick={onView}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VendorCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-36 bg-gray-200 dark:bg-gray-700" />
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex gap-1">
          <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

const Pagination = ({ currentPage, totalPages, total, limit, onPageChange }) => {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span> vendors
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex flex-row p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="First Page"
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
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
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
          title="Last Page"
        >
          <ChevronRight size={16} />
          <ChevronRight size={16} className="-ml-2" />
        </button>
      </div>
    </div>
  );
};
