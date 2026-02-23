"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    RefreshCw,
    Building2,
    X,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    SlidersHorizontal,
    LayoutGrid,
    List as ListIcon,
    WifiOff,
    IdCard,
    Eye
} from "lucide-react";
import { toast } from "sonner";

const PROFILES_PER_PAGE = 10;

// Reusable Subcomponents (Skeleton, Pagination, FilterDropdown)
const ProfileRowSkeleton = () => (
    <tr className="animate-pulse bg-gray-50/50 dark:bg-gray-800/20">
        <td className="px-4 py-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>
        </td>
        <td className="px-4 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" /></td>
        <td className="px-4 py-4 hidden md:table-cell"><div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" /></td>
        <td className="px-4 py-4 hidden lg:table-cell"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" /></td>
        <td className="px-4 py-4 text-right">
            <div className="flex justify-end gap-2">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
        </td>
    </tr>
);

const ProfileCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>
        </div>
        <div className="space-y-3 mb-4">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
    </div>
);

const Pagination = ({ currentPage, totalPages, total, limit, onPageChange }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 relative z-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium text-gray-900 dark:text-white">{((currentPage - 1) * limit) + 1}</span> to{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                    {Math.min(currentPage * limit, total)}
                </span>{" "}
                of <span className="font-medium text-gray-900 dark:text-white">{total}</span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 min-w-[80px] text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => Math.abs(currentPage - page) <= 2 || page === 1 || page === totalPages)
                        .map((page, index, array) => (
                            <div key={`page-${page}`} className="flex items-center">
                                {index > 0 && page - array[index - 1] > 1 && (
                                    <span className="px-2 text-gray-400">...</span>
                                )}
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${currentPage === page
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {page}
                                </button>
                            </div>
                        ))}
                </div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1.5 min-w-[80px] text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const FilterDropdown = ({ label, options, value, onChange, icon: Icon }) => (
    <div className="relative group">
        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shrink-0">
            <Icon size={14} className="text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{label}:</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-900 dark:text-white outline-none cursor-pointer pr-4 appearance-none"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-gray-900 dark:bg-gray-800 dark:text-white">
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

// Profile Row and Card components
const ProfileTableRow = ({ profile, onView }) => {
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group" onClick={onView}>
            <td className="px-4 py-4">
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        {profile.vendorAvatar ? (
                            <img src={(profile.vendorAvatar.startsWith('http') || profile.vendorAvatar.startsWith('/')) ? profile.vendorAvatar : `/${profile.vendorAvatar}`} alt={profile.vendorName} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                {profile.vendorBusinessName?.charAt(0) || "V"}
                            </div>
                        )}

                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {profile.vendorBusinessName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{profile.username}</div>
                    </div>
                </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                    {profile.category}
                </span>
            </td>
            <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm text-gray-900 dark:text-white">{profile.location?.city || "N/A"}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{profile.location?.state || ""}</div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                <div className="text-sm text-gray-900 dark:text-white">{profile.vendorName}</div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onView();
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

const ProfileCard = ({ profile, onView }) => {
    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            onClick={onView}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center overflow-hidden">
                    <div className="h-12 w-12 flex-shrink-0">
                        {profile.vendorAvatar ? (
                            <img src={(profile.vendorAvatar.startsWith('http') || profile.vendorAvatar.startsWith('/')) ? profile.vendorAvatar : `/${profile.vendorAvatar}`} alt={profile.vendorName} className="h-12 w-12 rounded-full object-cover" />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center font-bold text-xl">
                                {profile.vendorBusinessName?.charAt(0) || "V"}
                            </div>
                        )}
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                            {profile.vendorBusinessName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{profile.username}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white"><span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                        {profile.category}
                    </span></span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Location</span>
                    <span className="font-medium text-gray-900 dark:text-white">{profile.location?.city || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Owner</span>
                    <span className="font-medium text-gray-900 dark:text-white">{profile.vendorName || "N/A"}</span>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onView();
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors text-sm font-medium"
                >
                    <Eye size={16} />
                    View Profile
                </button>
            </div>
        </div>
    );
};


export default function AllVendorProfiles({ onViewProfile, refreshTrigger }) {
    const [profiles, setProfiles] = useState([]);
    const [allProfilesData, setAllProfilesData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [viewMode, setViewMode] = useState("table");
    const [showFilters, setShowFilters] = useState(false);

    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/vendor/profile");

            if (!response.ok) {
                throw new Error(`Failed to fetch profiles: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                const profilesArray = result.data || [];
                setProfiles(profilesArray);
                setAllProfilesData(profilesArray);
            } else {
                throw new Error(result.message || "Failed to fetch profiles");
            }
        } catch (err) {
            console.error("Error fetching vendor profiles:", err);
            setError(err.message);
            setProfiles([]);
            setAllProfilesData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const filteredProfiles = useMemo(() => {
        let filtered = [...allProfilesData];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (profile) =>
                    profile.vendorBusinessName?.toLowerCase().includes(query) ||
                    profile.username?.toLowerCase().includes(query) ||
                    profile.location?.city?.toLowerCase().includes(query) ||
                    profile.category?.toLowerCase().includes(query) ||
                    profile.vendorName?.toLowerCase().includes(query)
            );
        }

        if (categoryFilter !== "all") {
            filtered = filtered.filter((profile) => profile.category === categoryFilter);
        }

        filtered.sort((a, b) => {
            let aVal, bVal;

            if (sortBy === "businessName") {
                aVal = a.vendorBusinessName || "";
                bVal = b.vendorBusinessName || "";
            } else if (sortBy === "city") {
                aVal = a.location?.city || "";
                bVal = b.location?.city || "";
            } else if (sortBy === "category") {
                aVal = a.category || "";
                bVal = b.category || "";
            } else {
                aVal = a[sortBy] || "";
                bVal = b[sortBy] || "";
            }

            if (sortOrder === "asc") {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }, [allProfilesData, searchQuery, categoryFilter, sortBy, sortOrder]);


    const paginatedProfiles = useMemo(() => {
        const startIndex = (currentPage - 1) * PROFILES_PER_PAGE;
        const endIndex = startIndex + PROFILES_PER_PAGE;
        return filteredProfiles.slice(startIndex, endIndex);
    }, [filteredProfiles, currentPage]);

    const totalPages = Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const clearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("all");
        setSortBy("createdAt");
        setSortOrder("desc");
        setCurrentPage(1);
    };

    const exportToCSV = () => {
        const headers = ["Business Name", "Username", "Owner Name", "Category", "City", "State", "Trust Score"];
        const rows = filteredProfiles.map((p) => [
            p.vendorBusinessName || "",
            p.username || "",
            p.vendorName || "",
            p.category || "",
            p.location?.city || "",
            p.location?.state || "",
            p.trust || "0",
        ]);

        const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vendor-profiles-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleRefresh = async () => {
        await fetchProfiles();
    };

    const handleView = (profile) => {
        if (onViewProfile) {
            onViewProfile(profile);
        } else {
            // Fallback if prop not provided
            toast.success(`Viewing profile: ${profile.vendorBusinessName}`);
            console.log("View profile data:", profile);
        }
    }

    const hasActiveFilters = searchQuery || categoryFilter !== "all";

    const categoryOptions = useMemo(() => {
        const uniqueCategories = new Set(allProfilesData.map((p) => p.category).filter(Boolean));
        return [
            { value: "all", label: "All Categories" },
            ...Array.from(uniqueCategories).map((cat) => ({
                value: cat,
                label: cat.charAt(0).toUpperCase() + cat.slice(1),
            })),
        ];
    }, [allProfilesData]);

    const sortOptions = [
        { value: "createdAt", label: "Created Date" },
        { value: "businessName", label: "Business Name" },
        { value: "category", label: "Category" },
        { value: "city", label: "City" },
    ];

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search business names, usernames, or cities..."
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
                                        {(searchQuery ? 1 : 0) + (categoryFilter !== "all" ? 1 : 0)}
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
                                    <ListIcon size={16} />
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
                                disabled={filteredProfiles.length === 0}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Export to CSV"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">Export</span>
                            </button>

                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                                title="Refresh"
                            >
                                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
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
                                    <FilterDropdown
                                        label="Sort By"
                                        options={sortOptions}
                                        value={sortBy}
                                        onChange={(val) => {
                                            setSortBy(val);
                                            setCurrentPage(1);
                                        }}
                                        icon={LayoutGrid}
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

            {viewMode === "table" ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Business Profile
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                                        Owner Name
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    Array.from({ length: PROFILES_PER_PAGE }).map((_, i) => <ProfileRowSkeleton key={i} />)
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <WifiOff size={36} className="text-red-400" />
                                                <p className="text-red-500 font-medium">{error}</p>
                                                <button
                                                    onClick={handleRefresh}
                                                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedProfiles.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <IdCard size={36} className="text-gray-300 dark:text-gray-600" />
                                                <p className="text-gray-500 dark:text-gray-400 font-medium">No vendor profiles found</p>
                                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                                    {hasActiveFilters ? "Try adjusting your filters" : "There are currently no vendor profiles."}
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
                                    paginatedProfiles.map((profile) => (
                                        <ProfileTableRow
                                            key={profile._id || profile.id}
                                            profile={profile}
                                            onView={() => handleView(profile)}
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
                        Array.from({ length: 8 }).map((_, i) => <ProfileCardSkeleton key={i} />)
                    ) : error ? (
                        <div className="col-span-full flex flex-col items-center gap-3 py-12">
                            <WifiOff size={36} className="text-red-400" />
                            <p className="text-red-500 font-medium">{error}</p>
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : paginatedProfiles.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center gap-3 py-12">
                            <IdCard size={36} className="text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No vendor profiles found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                {hasActiveFilters ? "Try adjusting your filters" : "There are currently no vendor profiles."}
                            </p>
                        </div>
                    ) : (
                        paginatedProfiles.map((profile) => (
                            <ProfileCard
                                key={profile._id || profile.id}
                                profile={profile}
                                onView={() => handleView(profile)}
                            />
                        ))
                    )}
                </div>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={filteredProfiles.length}
                    limit={PROFILES_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}
