"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Search,
  RefreshCw,
  Calendar,
  Users,
  TrendingUp,
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  Building2,
  XCircle,
  WifiOff,
  EyeOff,
  Mail,
  Phone,
  UserCheck,
  UserX,
  UserCheck2,
  MessageCircle,
  Save,
  KeyRound,
  Briefcase,
  Globe,
  FileText,
  Link,
  Instagram,
  Facebook,
  Linkedin,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

const REQUESTS_PER_PAGE = 10;

const statusConfig = {
  RECEIVED: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", icon: Mail },
  PROCESSING: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300", icon: SlidersHorizontal },
  PENDING: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300", icon: Clock },
  COMPLETED: { color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300", icon: CheckCircle },
  FAILED: { color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300", icon: XCircle },
};

const categoryOptions = [
  "Event Planner",
  "Venue",
  "Photographer",
  "Decorator",
  "Caterer",
  "Makeup Artist",
  "DJ/Music",
  "Mehendi Artist",
  "Cake",
  "Pandit",
];

const experienceOptions = ["0-1", "1-3", "3-5", "5-10", "10+"];
const teamSizeOptions = ["1", "2-5", "6-10", "11-20", "20+"];
const statusOptions = ["RECEIVED", "PROCESSING", "PENDING", "COMPLETED", "FAILED"];

export default function AllVendorRequests({ requestType = "vendor", onViewRequest, onEditRequest, onDeleteSuccess, refreshTrigger, onStatsUpdate }) {
  const [requests, setRequests] = useState([]);
  const [allRequestsData, setAllRequestsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [registrationTypeFilter, setRegistrationTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("table");
  const [showFilters, setShowFilters] = useState(false);
  const [apiStats, setApiStats] = useState(null);

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Form states
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user } = useUser();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = "/api/vendor/requests";

      // Select API endpoint based on the request category
      if (requestType === "birthday") {
        endpoint = "/api/vendor/requests/birthday-routes?limit=10000";
      } else if (requestType === "booking") {
        endpoint = "/api/vendor/requests/detail-booking?all=true";
      } else if (requestType === "leads") {
        endpoint = "/api/leads";
      } else if (requestType === "planning") {
        endpoint = user ? `/api/plannedevent?userId=${user.id}&limit=1000` : "";
      } else if (requestType === "planning-tools") {
        endpoint = "/api/planned-events/get-all?page=1&limit=10";
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch requests: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        let requestsArray = [];

        if (requestType === "birthday") {
          requestsArray = result.data?.bookings || result.data || [];
        } else if (requestType === "booking") {
          requestsArray = result.data || [];
        } else if (requestType === "leads") {
          requestsArray = result.leads || result.data || [];
        } else if (requestType === "planning") {
          requestsArray = result.data || [];
        } else {
          requestsArray = result.data?.requests || [];
          setApiStats(result.data?.statusStats);
        }

        setRequests(requestsArray);
        setAllRequestsData(requestsArray);
      } else {
        throw new Error(result.error || "Failed to fetch requests");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err.message);
      setRequests([]);
      setAllRequestsData([]);
    } finally {
      setLoading(false);
    }
  }, [requestType]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, refreshTrigger]);

  const filteredRequests = useMemo(() => {
    let filtered = [...allRequestsData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((request) => {
        if (requestType === "birthday") {
          return (
            request.bookingId?.toLowerCase().includes(query) ||
            request.userDetails?.name?.toLowerCase().includes(query) ||
            request.userDetails?.phone?.toLowerCase().includes(query) ||
            request.venueName?.toLowerCase().includes(query)
          );
        }
        if (requestType === "booking") {
          return (
            request.fullName?.toLowerCase().includes(query) ||
            request.email?.toLowerCase().includes(query) ||
            request.phone?.toLowerCase().includes(query) ||
            request.eventType?.toLowerCase().includes(query)
          );
        }
        if (requestType === "leads") {
          return (
            request.name?.toLowerCase().includes(query) ||
            request.phone?.toLowerCase().includes(query) ||
            request.source?.toLowerCase().includes(query)
          );
        }
        if (requestType === "planning") {
          return (
            request.eventName?.toLowerCase().includes(query) ||
            request.eventType?.toLowerCase().includes(query)
          );
        }
        return (
          request.businessName?.toLowerCase().includes(query) ||
          request.ownerName?.toLowerCase().includes(query) ||
          request.email?.toLowerCase().includes(query) ||
          request.phone?.toLowerCase().includes(query) ||
          request.category?.toLowerCase().includes(query) ||
          request.city?.toLowerCase().includes(query)
        );
      });
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((request) => request.category === categoryFilter);
    }

    if (cityFilter !== "all") {
      filtered = filtered.filter((request) => request.city === cityFilter);
    }

    if (registrationTypeFilter !== "all") {
      filtered = filtered.filter((request) => request.registrationType === registrationTypeFilter);
    }

    filtered.sort((a, b) => {
      let aVal, bVal;

      if (sortBy === "submittedAt" || sortBy === "createdAt") {
        aVal = new Date(a.submittedAt || a.createdAt);
        bVal = new Date(b.submittedAt || b.createdAt);
      } else if (sortBy === "businessName") {
        const getBusinessName = (r) => {
          if (requestType === "birthday") return r.userDetails?.name;
          if (requestType === "booking") return r.fullName;
          if (requestType === "leads") return r.name;
          return r.businessName;
        };
        aVal = getBusinessName(a) || "";
        bVal = getBusinessName(b) || "";
      } else if (sortBy === "ownerName") {
        const getOwnerName = (r) => {
          if (requestType === "booking") return r.email;
          if (requestType === "leads") return r.phone;
          return r.ownerName;
        }
        aVal = getOwnerName(a) || "";
        bVal = getOwnerName(b) || "";
      } else if (sortBy === "category") {
        const getCategory = (r) => {
          if (requestType === "booking") return r.eventType;
          if (requestType === "leads") return r.source;
          if (requestType === "planning") return r.category;
          return r.category;
        }
        aVal = getCategory(a) || "";
        bVal = getCategory(b) || "";
      } else if (requestType === "planning" && sortBy === "eventName") {
        aVal = a.eventName || "";
        bVal = b.eventName || "";
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
  }, [
    allRequestsData,
    searchQuery,
    statusFilter,
    categoryFilter,
    cityFilter,
    registrationTypeFilter,
    sortBy,
    sortOrder,
    requestType,
  ]);

  // Dynamic stats calculation
  const stats = useMemo(() => {
    if (!allRequestsData || allRequestsData.length === 0) {
      return { total: 0 };
    }

    return {
      total: allRequestsData.length,
    };
  }, [allRequestsData]);


  // Report stats to parent when they change
  useEffect(() => {
    if (onStatsUpdate) {
      onStatsUpdate(stats);
    }
  }, [stats, onStatsUpdate]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * REQUESTS_PER_PAGE;
    const endIndex = startIndex + REQUESTS_PER_PAGE;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage]);

  const totalPages = Math.ceil(filteredRequests.length / REQUESTS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleAction = useCallback(
    (action, request) => {
      setSelectedRequest(request);
      if (action === "view") onViewRequest?.(request);
      if (action === "edit") {
        setEditFormData({
          ...request,
          services: request.services || [],
          portfolioImages: request.portfolioImages || [],
          serviceAreas: request.serviceAreas || [],
        });
        setEditModalOpen(true);
      }
      if (action === "delete") setDeleteModalOpen(true);
    },
    [onViewRequest]
  );

  const handlePasswordVerification = async (action) => {
    if (!user && !user?.id) {
      toast.info("You must be signed in to submit an event", "error");
      return;
    }
    if (!adminPassword.trim()) {
      setPasswordError("Please enter admin password");
      return;
    }

    try {
      let endpoint = `/api/vendor/requests?id=${selectedRequest._id}&adminPassword=${encodeURIComponent(adminPassword)}`;

      // Select API endpoint based on the request category
      if (requestType === "birthday") {
        endpoint = `/api/vendor/requests/birthday-routes?id=${selectedRequest._id}&adminPassword=${encodeURIComponent(adminPassword)}`;
      } else if (requestType === "booking") {
        endpoint = `/api/vendor/requests/detail-booking?id=${selectedRequest._id}&adminPassword=${encodeURIComponent(adminPassword)}`;
      } else if (requestType === "leads") {
        endpoint = `/api/leads?id=${selectedRequest._id}&adminPassword=${encodeURIComponent(adminPassword)}`;
      } else if (requestType === "planning") {
        endpoint = `/api/plannedevent?id=${selectedRequest._id}&adminPassword=${encodeURIComponent(adminPassword)}`;
      }

      if (action === "delete") {
        setDeleteLoading(true);
        const response = await fetch(endpoint, {
          method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to delete request");
        }

        // Success
        closeAllModals();
        toast.success("Request deleted successfully");
        await fetchRequests();
        onDeleteSuccess?.();

      } else if (action === "edit") {
        setEditLoading(true);

        let body = {};

        if (requestType === "vendor") {
          // For vendor, send everything + reviewedBy
          body = { ...editFormData, reviewedBy: "Admin" };
        } else {
          // For Birthday, Booking, Leads - Update only status to prevent data overwrite
          body = { status: editFormData.status };
        }

        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to update request");
        }

        // Success
        closeAllModals();
        toast.success("Request updated successfully");
        await fetchRequests();
      }

    } catch (err) {
      setPasswordError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setDeleteLoading(false);
      setEditLoading(false);
    }
  };

  const closeAllModals = () => {
    setDeleteModalOpen(false);
    setEditModalOpen(false);
    setPasswordModalOpen(false);
    setSelectedRequest(null);
    setEditFormData({});
    setAdminPassword("");
    setPasswordError("");
    setShowPassword(false);
    setPendingAction(null);
  };

  const handleEditSubmit = () => {
    setPendingAction("edit");
    setEditModalOpen(false);
    setPasswordModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setPendingAction("delete");
    setDeleteModalOpen(false);
    setPasswordModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setCityFilter("all");
    setRegistrationTypeFilter("all");
    setSortBy("submittedAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    let headers = [];
    let rows = [];

    if (requestType === "birthday") {
      headers = ["Booking ID", "Name", "Phone", "Venue", "Date", "Guest Count", "Budget", "Status"];
      rows = filteredRequests.map((r) => [
        r.bookingId || "",
        r.userDetails?.name || "",
        r.userDetails?.phone || "",
        r.venueName || "",
        r.eventDate ? new Date(r.eventDate).toLocaleDateString() : "",
        r.bookingDetails?.guestCount || "",
        r.bookingDetails?.budget || "",
        r.status || "pending",
      ]);
    } else if (requestType === "booking") {
      headers = ["Name", "Email", "Phone", "Event Type", "Date", "Guest Count", "Status"];
      rows = filteredRequests.map((r) => [
        r.fullName || "",
        r.email || "",
        r.phone || "",
        r.eventType || "",
        r.eventDate ? new Date(r.eventDate).toLocaleDateString() : "",
        r.guestCount || "",
        r.status || "pending",
      ]);
    } else if (requestType === "leads") {
      headers = ["Name", "Phone", "Source", "Status", "Date"];
      rows = filteredRequests.map((r) => [
        r.name || "",
        r.phone || "",
        r.source || "",
        r.status || "pending",
        r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
      ]);
    } else {
      headers = [
        "Business Name",
        "Owner Name",
        "Email",
        "Phone",
        "Category",
        "City",
        "Experience",
        "Status",
        "Registration Type",
        "Submitted At",
      ];
      rows = filteredRequests.map((r) => [
        r.businessName || "",
        r.ownerName || "",
        r.email || "",
        r.phone || "",
        r.category || "",
        r.city || "",
        r.experience || "",
        r.status || "pending",
        r.registrationType || "full",
        r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : "",
      ]);
    }

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${requestType}-requests-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    await fetchRequests();
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    cityFilter !== "all" ||
    registrationTypeFilter !== "all";



  const categoryFilterOptions = useMemo(() => {
    const uniqueCategories = new Set(allRequestsData.map((r) => r.category).filter(Boolean));
    return [
      { value: "all", label: "All Categories" },
      ...Array.from(uniqueCategories).map((cat) => ({
        value: cat,
        label: cat,
      })),
    ];
  }, [allRequestsData]);

  const statusFilterOptions = useMemo(() => {
    return [
      { value: "all", label: "All Status" },
      ...statusOptions.map((status) => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, " "),
      })),
    ];
  }, []);

  const registrationTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "full", label: "Full Registration" },
    { value: "quick", label: "Quick Registration" },
  ];

  const sortOptions = [
    { value: "submittedAt", label: "Submitted Date" },
    { value: "businessName", label: "Business Name" },
    { value: "ownerName", label: "Owner Name" },
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
                placeholder="Search requests, business names, or emails..."
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
                      (statusFilter !== "all" ? 1 : 0) +
                      (categoryFilter !== "all" ? 1 : 0) +
                      (cityFilter !== "all" ? 1 : 0) +
                      (registrationTypeFilter !== "all" ? 1 : 0)}
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
                disabled={filteredRequests.length === 0}
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
                    label="Status"
                    options={statusFilterOptions}
                    value={statusFilter}
                    onChange={(val) => {
                      setStatusFilter(val);
                      setCurrentPage(1);
                    }}
                    icon={CheckCircle}
                  />
                  <FilterDropdown
                    label="Category"
                    options={categoryFilterOptions}
                    value={categoryFilter}
                    onChange={(val) => {
                      setCategoryFilter(val);
                      setCurrentPage(1);
                    }}
                    icon={Building2}
                  />
                  <FilterDropdown
                    label="City"
                    options={cityOptions}
                    value={cityFilter}
                    onChange={(val) => {
                      setCityFilter(val);
                      setCurrentPage(1);
                    }}
                    icon={MapPin}
                  />
                  <FilterDropdown
                    label="Type"
                    options={registrationTypeOptions}
                    value={registrationTypeFilter}
                    onChange={(val) => {
                      setRegistrationTypeFilter(val);
                      setCurrentPage(1);
                    }}
                    icon={Users}
                  />
                  <FilterDropdown
                    label="Sort By"
                    options={sortOptions}
                    value={sortBy}
                    onChange={(val) => {
                      setSortBy(val);
                      setCurrentPage(1);
                    }}
                    icon={TrendingUp}
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
                  {requestType === "vendor" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Business / Owner</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Experience</th>
                    </>
                  )}
                  {requestType === "birthday" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name / Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Venue</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Details</th>
                    </>
                  )}
                  {requestType === "booking" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name / Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    </>
                  )}
                  {requestType === "leads" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Source</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    </>
                  )}
                  {requestType === "planning" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event / Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Progress</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Budget / Guests</th>
                    </>
                  )}
                  {requestType === "planning-tools" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Event
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User ID
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                        Category
                      </th>

                      {/* NEW FIELD 1 */}
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                        Guests
                      </th>

                      {/* NEW FIELD 2 */}
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                        Venue
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                        Budget
                      </th>
                    </>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: REQUESTS_PER_PAGE }).map((_, i) => <RequestRowSkeleton key={i} />)
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
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
                ) : paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <UserCheck size={36} className="text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No vendor requests found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          {hasActiveFilters ? "Try adjusting your filters" : "Vendor requests will appear here"}
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
                  paginatedRequests.map((request) => (
                    <RequestTableRow
                      key={request._id}
                      request={request}
                      requestType={requestType}
                      onAction={handleAction}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <RequestCardSkeleton key={i} />)
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
          ) : paginatedRequests.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-3 py-12">
              <UserCheck size={36} className="text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No vendor requests found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {hasActiveFilters ? "Try adjusting your filters" : "Vendor requests will appear here"}
              </p>
            </div>
          ) : (
            paginatedRequests.map((request) => (
              <RequestCard
                key={request._id || request.id}
                request={request}
                type={requestType}
                onView={() => handleAction("view", request)}
                onEdit={() => handleAction("edit", request)}
                onDelete={() => handleAction("delete", request)}
              />
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={filteredRequests.length}
          limit={REQUESTS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Trash2 size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Delete Vendor Request</h2>
                    <p className="text-white/80 text-sm mt-0.5">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                    <AlertTriangle size={12} />
                    Permanent Action
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Name:</strong> {selectedRequest.businessName || selectedRequest.userDetails?.name || selectedRequest.fullName || selectedRequest.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Contact:</strong> {selectedRequest.ownerName || selectedRequest.email || selectedRequest.phone || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Email:</strong> {selectedRequest.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>ID:</strong> {selectedRequest._id?.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">
                        Warning: This will permanently delete
                      </p>
                      <ul className="text-yellow-700 dark:text-yellow-300 text-xs mt-1 space-y-1">
                        <li>• All vendor request data</li>
                        <li>• Contact information and documents</li>
                        <li>• Portfolio images and services</li>
                        <li>• All associated records</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeAllModals}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
                  >
                    <Trash2 size={18} />
                    Delete Request
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Edit size={28} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Edit {requestType === 'vendor' ? 'Vendor' : 'Request'} Details</h2>
                      <p className="text-white/80 text-sm mt-0.5">{selectedRequest.businessName || selectedRequest.userDetails?.name || selectedRequest.fullName || selectedRequest.name || "Request"}</p>
                    </div>
                  </div>
                  <button onClick={closeAllModals} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {requestType === "vendor" && (
                    <>
                      {/* Basic Information */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Briefcase size={20} />
                          Basic Information
                        </h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Business Name *
                        </label>
                        <input
                          type="text"
                          value={editFormData.businessName || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, businessName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Owner Name *
                        </label>
                        <input
                          type="text"
                          value={editFormData.ownerName || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, ownerName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                        <input
                          type="email"
                          value={editFormData.email || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
                        <input
                          type="tel"
                          value={editFormData.phone || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Category *
                        </label>
                        <select
                          value={editFormData.category || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select Category</option>
                          {categoryOptions.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Experience *
                        </label>
                        <select
                          value={editFormData.experience || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, experience: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select Experience</option>
                          {experienceOptions.map((exp) => (
                            <option key={exp} value={exp}>
                              {exp} years
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Size</label>
                        <select
                          value={editFormData.teamSize || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, teamSize: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="">Select Team Size</option>
                          {teamSizeOptions.map((size) => (
                            <option key={size} value={size}>
                              {size} members
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                      value={editFormData.status || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  {requestType === "vendor" && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Business Description
                        </label>
                        <textarea
                          value={editFormData.description || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      {/* Location Information */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 mt-6">
                          <MapPin size={20} />
                          Location Information
                        </h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City *</label>
                        <input
                          type="text"
                          value={editFormData.city || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                        <input
                          type="text"
                          value={editFormData.state || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pincode</label>
                        <input
                          type="text"
                          value={editFormData.pincode || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Address
                        </label>
                        <textarea
                          value={editFormData.address || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      {/* Social & Legal */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 mt-6">
                          <Globe size={20} />
                          Social & Legal Information
                        </h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                        <input
                          type="url"
                          value={editFormData.website || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instagram</label>
                        <input
                          type="text"
                          value={editFormData.instagram || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, instagram: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          GST Number
                        </label>
                        <input
                          type="text"
                          value={editFormData.gstNumber || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, gstNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          value={editFormData.panNumber || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, panNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      {/* Admin Notes */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 mt-6">
                          <FileText size={20} />
                          Admin Notes
                        </h3>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Internal Notes
                        </label>
                        <textarea
                          value={editFormData.adminNotes || ""}
                          onChange={(e) => setEditFormData({ ...editFormData, adminNotes: e.target.value })}
                          rows={3}
                          placeholder="Add internal notes about this vendor request..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated:{" "}
                    {selectedRequest.updatedAt ? new Date(selectedRequest.updatedAt).toLocaleDateString() : "N/A"}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={closeAllModals}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSubmit}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Password Verification Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Admin Verification</h2>
                    <p className="text-white/80 text-sm mt-0.5">
                      {pendingAction === "delete" ? "Confirm deletion" : "Confirm changes"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    <KeyRound size={12} />
                    Security Verification Required
                  </div>
                </div>

                {selectedRequest && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <strong>Action:</strong> {pendingAction === "delete" ? "Delete" : "Update"} vendor request
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <strong>Business:</strong> {selectedRequest.businessName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>ID:</strong> {selectedRequest._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Admin Password
                  </label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setPasswordError("");
                      }}
                      placeholder="Enter admin password"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 outline-none transition-all bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${passwordError
                        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                        : "border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                        }`}
                      disabled={editLoading || deleteLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && adminPassword) {
                          handlePasswordVerification(pendingAction);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {passwordError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1.5"
                      >
                        <AlertTriangle size={14} />
                        {passwordError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    disabled={editLoading || deleteLoading}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePasswordVerification(pendingAction)}
                    disabled={editLoading || deleteLoading || !adminPassword.trim()}
                    className={`flex-1 px-4 py-3 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg ${pendingAction === "delete"
                      ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-red-500/25"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25"
                      }`}
                  >
                    {editLoading || deleteLoading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        {pendingAction === "delete" ? "Deleting..." : "Updating..."}
                      </>
                    ) : (
                      <>
                        {pendingAction === "delete" ? (
                          <>
                            <Trash2 size={18} />
                            Confirm Delete
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Confirm Update
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}

const StatsCard = ({ icon: Icon, label, value, trend, color, lightBg }) => (
  <div className={`${lightBg} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}>
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
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{label}</p>
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
        <span className="text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
          {selectedOption?.label || label}
        </span>
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
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <CheckCircle size={14} className="flex-shrink-0" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const RequestTableRow = ({ request, requestType, onAction }) => {
  const status = statusConfig[request.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  if (requestType === "birthday") {
    return (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {request.userDetails?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {request.userDetails?.name || "Unknown"}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Phone size={12} />
                {request.userDetails?.phone || "N/A"}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-gray-400" />
            {request.venueName || "N/A"}
          </div>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar size={14} className="text-gray-400" />
            {request.bookingDetails?.eventDate ? new Date(request.bookingDetails.eventDate).toLocaleDateString() : (request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A")}
          </div>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
            <span>Guests: {request.bookingDetails?.guestCount || "N/A"}</span>
            {request.bookingDetails?.budget && <span>Budget: {request.bookingDetails.budget}</span>}
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            <StatusIcon size={12} />
            <span className="capitalize">{request.status?.replace("_", " ")}</span>
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2 transition-opacity">
            <button
              onClick={() => onAction("view", request)}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onAction("edit", request)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Edit Request"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onAction("delete", request)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete Request"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  if (requestType === "booking") {
    return (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {request.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {request.name || "Unknown"}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Mail size={12} />
                {request.email || "N/A"}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-gray-400" />
            {request.eventType || "N/A"}
          </div>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone size={14} className="text-gray-400" />
            {request.phone || "N/A"}
          </div>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar size={14} className="text-gray-400" />
            {request.date ? new Date(request.date).toLocaleDateString() : "N/A"}
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            <StatusIcon size={12} />
            <span className="capitalize">{request.status?.replace("_", " ")}</span>
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2 transition-opacity">
            <button
              onClick={() => onAction("view", request)}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onAction("edit", request)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Edit Request"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onAction("delete", request)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete Request"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  if (requestType === "leads") {
    return (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {request.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {request.name || "Unknown"}
              </h3>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" />
            {request.phone || "N/A"}
          </div>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Globe size={14} className="text-gray-400" />
            {request.source || "N/A"}
          </div>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar size={14} className="text-gray-400" />
            {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A"}
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
            <StatusIcon size={12} />
            <span className="capitalize">{request.status?.replace("_", " ")}</span>
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2 transition-opacity">
            <button
              onClick={() => onAction("view", request)}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onAction("edit", request)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Edit Request"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onAction("delete", request)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete Request"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  if (requestType === "planning") {
    return (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {request.eventName?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {request.eventName || "Untitled Event"}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Sparkles size={12} />
                {request.eventType || "N/A"}
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            {request.eventDate ? new Date(request.eventDate).toLocaleDateString() : "N/A"}
          </div>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{Math.round((request.tasksCompleted / (request.totalTasks || 1)) * 100)}%</span>
            </div>
            <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${Math.round((request.tasksCompleted / (request.totalTasks || 1)) * 100)}%` }}
              />
            </div>
          </div>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <DollarSign size={12} className="text-gray-400" />
              <span>{request.totalBudgetSpent} / {request.totalBudgetAllocated}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} className="text-gray-400" />
              <span>{request.confirmedGuests} confirmed</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${request.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}>
            <span className="capitalize">{request.status || "ongoing"}</span>
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          {/* Actions for planning could be added here if needed */}
        </td>
      </tr>
    )
  }

  if (requestType === "planning-tools") {
    return (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">

        {/* Event Name */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {request.name || "Unnamed Event"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {request.venue || "No Venue"}
              </p>
            </div>
          </div>
        </td>

        {/* User ID */}
        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
          {request.userId}
        </td>

        {/* Category */}
        <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600 dark:text-gray-300 capitalize">
          {request.category || "N/A"}
        </td>
        <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600 dark:text-gray-300">
          {request.guestCount || 0}
        </td>

        {/* Venue */}
        <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600 dark:text-gray-300">
          {request.venue || "N/A"}
        </td>

        {/* Date */}
        <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600 dark:text-gray-300">
          {request.date
            ? new Date(request.date).toLocaleDateString()
            : "N/A"}
        </td>

        {/* Budget */}
        <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600 dark:text-gray-300">
          ₹{request.budget?.toLocaleString() || 0}
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 capitalize">
            {request.status || "unknown"}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onAction("view", request)}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              title="View Event"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={() => onAction("edit", request)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Edit Event"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => onAction("delete", request)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete Event"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Default: Vendor
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
            {request.portfolioImages?.[0] ? (
              <img
                src={request.portfolioImages[0]}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Briefcase size={18} className="text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {request.businessName || "Untitled Business"}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Users size={12} />
                {request.ownerName || "Unknown Owner"}
              </span>
              <span>•</span>
              <span>{request.email}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {request.category || "Uncategorized"}
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-gray-400" />
          {request.city || "N/A"}
        </div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-gray-400" />
          {request.experience || "0"} years
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}
        >
          <StatusIcon size={12} />
          <span className="capitalize">{request.status?.replace("_", " ")}</span>
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2 transition-opacity">
          <button
            onClick={() => onAction("view", request)}
            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onAction("edit", request)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            title="Edit Request"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onAction("delete", request)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete Request"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const RequestRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-4 py-3 hidden md:table-cell">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-4 py-3 hidden lg:table-cell">
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
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

const RequestCard = ({ request, type, onView, onEdit, onDelete }) => {
  const statusInfo = statusConfig[request.status] || statusConfig.PENDING;
  const StatusIcon = statusInfo?.icon || Clock;

  // Helper to get display data based on type
  const getDisplayData = () => {
    switch (type) {
      case "birthday":
        return {
          title: request.userDetails?.name || "Unknown User",
          subtitle: request.venueName || "No Venue Selected",
          badge: request.bookingDetails?.guestCount ? `${request.bookingDetails.guestCount} Guests` : null,
          details: [
            { icon: Calendar, text: request.bookingDetails?.eventDate ? new Date(request.bookingDetails.eventDate).toLocaleDateString() : (request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A") },
            { icon: Phone, text: request.userDetails?.phone || "N/A" },
            ...(request.bookingDetails?.budget ? [{ icon: DollarSign, text: `₹${request.bookingDetails.budget}` }] : []),
          ]
        };
      case "booking":
        return {
          title: request.name || "Unknown User",
          subtitle: request.eventType || "Event",
          badge: request.guests ? `${request.guests} Guests` : null,
          details: [
            { icon: Calendar, text: request.date ? new Date(request.date).toLocaleDateString() : "N/A" },
            { icon: Phone, text: request.phone || "N/A" },
            { icon: Mail, text: request.email || "N/A" },
          ]
        };
      case "planning":
        return {
          title: request.eventName || "Untitled Event",
          subtitle: request.eventType || "Event",
          badge: `${Math.round((request.tasksCompleted / (request.totalTasks || 1)) * 100)}% Done`,
          details: [
            { icon: Calendar, text: request.eventDate ? new Date(request.eventDate).toLocaleDateString() : "N/A" },
            { icon: Users, text: `${request.confirmedGuests || 0} Guests` },
            { icon: DollarSign, text: `₹${request.totalBudgetSpent || 0} / ₹${request.totalBudgetAllocated || 0}` }
          ]
        };
      case "leads":
        return {
          title: request.name || "Unknown Lead",
          subtitle: request.source || "Unknown Source",
          badge: "Lead",
          details: [
            { icon: Phone, text: request.phone || "N/A" },
            { icon: Calendar, text: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A" },
            ...(request.message ? [{ icon: MessageCircle, text: request.message }] : []),
          ]
        };
      case "vendor":
      default:
        return {
          title: request.businessName || "N/A",
          subtitle: request.ownerName || "N/A",
          badge: request.registrationType === "quick" ? "Quick" : "Full",
          details: [
            { icon: Building2, text: request.category || "N/A" },
            { icon: MapPin, text: request.city || "N/A" },
            { icon: TrendingUp, text: `${request.experience || 0} years experience` },
            { icon: Calendar, text: request.submittedAt ? new Date(request.submittedAt).toLocaleDateString() : (request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A") },
            ...(request.email ? [{ icon: Mail, text: request.email }] : []),
            ...(request.phone ? [{ icon: Phone, text: request.phone }] : []),
          ]
        };
    }
  };

  const { title, subtitle, badge, details } = getDisplayData();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full"
    >
      <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
        <div className="text-white text-center p-4 w-full">
          <h3 className="text-lg font-bold truncate mb-1 px-2">{title}</h3>
          <p className="text-white/80 text-sm truncate px-2">{subtitle}</p>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.color}`}>
            {request.status
              ? request.status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
              : "Pending"}
          </span>
        </div>
        {badge && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-medium text-white shadow-sm">
              {badge}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="space-y-2.5 mb-4 flex-grow">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
              <detail.icon size={15} className="text-gray-400 shrink-0" />
              <span className="truncate">{detail.text}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <span className="text-xs text-gray-500 capitalize truncate max-w-[120px]">
            {type === "vendor" ? request.category : type}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onView}
              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
              title="Edit Request"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
              title="Delete Request"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RequestCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-36 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
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
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span> requests
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
