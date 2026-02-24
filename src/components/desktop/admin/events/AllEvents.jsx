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
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,

  MapPin,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  Building2,
  XCircle,
  WifiOff,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

const EVENTS_PER_PAGE = 10;

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300", icon: Clock },
  confirmed: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", icon: CheckCircle },
  "in-progress": { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300", icon: Sparkles },
  completed: { color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300", icon: XCircle },
};

export default function AllEvents({ onViewEvent, onEditEvent, onDeleteSuccess, refreshTrigger, onStatsUpdate }) {
  const [events, setEvents] = useState([]);
  const [allEventsData, setAllEventsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("table");

  const [apiStats, setApiStats] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/plannedevent");

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        const eventsArray = result.data || [];
        setEvents(eventsArray);
        setAllEventsData(eventsArray);
        setApiStats(result.stats);
      } else {
        throw new Error(result.message || "Failed to fetch events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
      setEvents([]);
      setAllEventsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, refreshTrigger]);

  // Notify parent of total count for tab badge
  useEffect(() => {
    if (onStatsUpdate) {
      onStatsUpdate({ total: allEventsData.length });
    }
  }, [allEventsData.length, onStatsUpdate]);

  const filteredEvents = useMemo(() => {
    let filtered = [...allEventsData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.contactName?.toLowerCase().includes(query) ||
          event.username?.toLowerCase().includes(query) ||
          event.city?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query) ||
          event.contactEmail?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => (event.status || "pending") === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((event) => event.category === typeFilter);
    }

    filtered.sort((a, b) => {
      let aVal, bVal;

      if (sortBy === "date" || sortBy === "eventDate") {
        const dateA = a.eventDetails?.selectedDate || `${a.eventDetails?.year}-${a.eventDetails?.month || "01"}-01`;
        const dateB = b.eventDetails?.selectedDate || `${b.eventDetails?.year}-${b.eventDetails?.month || "01"}-01`;
        const timeA = new Date(dateA).getTime();
        const timeB = new Date(dateB).getTime();
        aVal = isNaN(timeA) ? 0 : timeA;
        bVal = isNaN(timeB) ? 0 : timeB;
      } else if (sortBy === "createdAt") {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        aVal = isNaN(timeA) ? 0 : timeA;
        bVal = isNaN(timeB) ? 0 : timeB;
      } else if (sortBy === "budget") {
        aVal = parseFloat(a.budgetDetails?.valueRaw) || 0;
        bVal = parseFloat(b.budgetDetails?.valueRaw) || 0;
      } else if (sortBy === "contactName") {
        aVal = (a.contactName || a.username || "").toLowerCase();
        bVal = (b.contactName || b.username || "").toLowerCase();
      } else if (sortBy === "category") {
        aVal = a.category || "";
        bVal = b.category || "";
      } else {
        aVal = a[sortBy] || "";
        bVal = b[sortBy] || "";
      }

      if (aVal === bVal) return 0;
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [allEventsData, searchQuery, statusFilter, typeFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    if (!allEventsData || allEventsData.length === 0) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        "in-progress": 0,
        completed: 0,
        cancelled: 0,
        totalBudget: 0,
        avgBudget: 0,
        thisMonth: 0,
        lastMonth: 0,
        growthRate: 0,
        eventTypes: {},
        topType: "N/A",
      };
    }

    const total = allEventsData.length;
    const pending = allEventsData.filter((e) => !e.status || e.status === "pending").length;
    const confirmed = allEventsData.filter((e) => e.status === "confirmed").length;
    const inProgress = allEventsData.filter((e) => e.status === "in-progress").length;
    const completed = allEventsData.filter((e) => e.status === "completed").length;
    const cancelled = allEventsData.filter((e) => e.status === "cancelled").length;

    const totalBudget = allEventsData.reduce(
      (sum, e) => sum + (parseFloat(e.budgetDetails?.valueRaw) * 100000 || 0),
      0
    );
    const avgBudget = total > 0 ? Math.round(totalBudget / total) : 0;

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const thisMonth = allEventsData.filter((e) => {
      const eventDate = new Date(e.createdAt);
      return eventDate >= thisMonthStart;
    }).length;

    const lastMonth = allEventsData.filter((e) => {
      const eventDate = new Date(e.createdAt);
      return eventDate >= lastMonthStart && eventDate <= lastMonthEnd;
    }).length;

    const growthRate =
      lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : thisMonth > 0 ? 100 : 0;

    const eventTypes = {};
    allEventsData.forEach((e) => {
      if (e.category) {
        eventTypes[e.category] = (eventTypes[e.category] || 0) + 1;
      }
    });

    const topType = Object.entries(eventTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return {
      total,
      pending,
      confirmed,
      "in-progress": inProgress,
      completed,
      cancelled,
      totalBudget,
      avgBudget,
      thisMonth,
      lastMonth,
      growthRate,
      eventTypes,
      topType,
    };
  }, [allEventsData]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    const endIndex = startIndex + EVENTS_PER_PAGE;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, currentPage]);

  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleAction = useCallback(
    (action, event) => {
      setSelectedEvent(event);
      if (action === "view") onViewEvent?.(event);
      if (action === "edit") onEditEvent?.(event);
      if (action === "delete") setDeleteModalOpen(true);
    },
    [onViewEvent, onEditEvent]
  );

  const handleDeleteConfirm = async () => {
    if (!deletePassword.trim()) {
      setDeleteError("Please enter admin password");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/plannedevent?id=${selectedEvent._id}&password=${encodeURIComponent(deletePassword)}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete event");
      }

      // Success
      setDeleteModalOpen(false);
      setSelectedEvent(null);
      setDeletePassword("");
      setDeleteError("");
      toast.success("Event deleted successfully");
      await fetchEvents();
      onDeleteSuccess?.();
    } catch (err) {
      setDeleteError(err.message);
      toast.error(`Error deleting event: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedEvent(null);
    setDeletePassword("");
    setDeleteError("");
    setShowDeletePassword(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = ["Contact Name", "Username", "Category", "City", "Date", "Budget", "Status", "Email", "Phone"];
    const rows = filteredEvents.map((e) => [
      e.contactName || "",
      e.username || "",
      e.category || "",
      e.city || "",
      e.eventDetails?.selectedDate || `${e.eventDetails?.year}-${e.eventDetails?.month}`,
      e.budgetDetails?.valueFormatted || "N/A",
      e.status || "pending",
      e.contactEmail || "",
      e.contactPhone || "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `events-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    await fetchEvents();
  };

  const hasActiveFilters = !!(searchQuery || statusFilter !== "all");

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const typeOptions = useMemo(() => {
    const uniqueCategories = new Set(allEventsData.map((e) => e.category).filter(Boolean));
    return [
      ...Array.from(uniqueCategories).map((cat) => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ];
  }, [allEventsData]);

  const sortOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "date", label: "Event Date" },
    { value: "contactName", label: "Event / Client Name" },
    { value: "category", label: "Category" },
    { value: "budget", label: "Budget" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard
          icon={Calendar}
          label="Total Events"
          value={stats.total}
          color="bg-blue-500"
          lightBg="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatsCard
          icon={Clock}
          label="Pending"
          value={stats.pending}
          color="bg-yellow-500"
          lightBg="bg-yellow-50 dark:bg-yellow-900/20"
          onClick={() => {
            setStatusFilter(statusFilter === "pending" ? "all" : "pending");
            setCurrentPage(1);
          }}
          isActive={statusFilter === "pending"}
        />
        <StatsCard
          icon={CheckCircle}
          label="Confirmed"
          value={stats.confirmed}
          color="bg-blue-500"
          lightBg="bg-blue-50 dark:bg-blue-900/20"
          onClick={() => {
            setStatusFilter(statusFilter === "confirmed" ? "all" : "confirmed");
            setCurrentPage(1);
          }}
          isActive={statusFilter === "confirmed"}
        />
        <StatsCard
          icon={Sparkles}
          label="In Progress"
          value={stats["in-progress"]}
          color="bg-purple-500"
          lightBg="bg-purple-50 dark:bg-purple-900/20"
          onClick={() => {
            setStatusFilter(statusFilter === "in-progress" ? "all" : "in-progress");
            setCurrentPage(1);
          }}
          isActive={statusFilter === "in-progress"}
        />
        <StatsCard
          icon={DollarSign}
          label="Avg Budget"
          value={stats.avgBudget > 0 ? `₹${(stats.avgBudget / 100000).toFixed(1)}L` : "₹0"}
          color="bg-green-500"
          lightBg="bg-green-50 dark:bg-green-900/20"
        />
        <StatsCard
          icon={TrendingUp}
          label="This Month"
          value={stats.thisMonth}
          trend={stats.growthRate}
          color="bg-orange-500"
          lightBg="bg-orange-50 dark:bg-orange-900/20"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, clients, or cities..."
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
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${sortOrder === "desc"
                  ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                title={sortOrder === "asc" ? "Ascending" : "Descending"}
              >
                {sortOrder === "asc" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span className="hidden sm:inline">{sortOrder === "asc" ? "Asc" : "Desc"}</span>
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
                disabled={filteredEvents.length === 0}
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
        </div>

      </div>

      {viewMode === "table" ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    onClick={() => {
                      if (sortBy === "contactName") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("contactName");
                        setSortOrder("asc");
                      }
                      setCurrentPage(1);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      Event / Client
                      <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortBy === "contactName" ? (
                          sortOrder === "asc" ? <ArrowUpRight size={14} className="text-indigo-500" /> : <ArrowDownRight size={14} className="text-indigo-500" />
                        ) : (
                          <ArrowUpRight size={14} />
                        )}
                      </span>
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    onClick={() => {
                      if (sortBy === "createdAt" || sortBy === "date") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("createdAt");
                        setSortOrder("desc");
                      }
                      setCurrentPage(1);
                    }}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(sortBy === "createdAt" || sortBy === "date") ? (
                          sortOrder === "asc" ? <ArrowUpRight size={14} className="text-indigo-500" /> : <ArrowDownRight size={14} className="text-indigo-500" />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Budget
                  </th>
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
                  Array.from({ length: EVENTS_PER_PAGE }).map((_, i) => <EventRowSkeleton key={i} />)
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
                ) : paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Calendar size={36} className="text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No events found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          {hasActiveFilters ? "Try adjusting your filters" : "Add your first event to get started"}
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
                  paginatedEvents.map((event) => (
                    <EventTableRow
                      key={event._id || event.id}
                      event={event}
                      onView={() => handleAction("view", event)}
                      onEdit={() => handleAction("edit", event)}
                      onDelete={() => handleAction("delete", event)}
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
            Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
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
          ) : paginatedEvents.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-3 py-12">
              <Calendar size={36} className="text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No events found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {hasActiveFilters ? "Try adjusting your filters" : "Add your first event to get started"}
              </p>
            </div>
          ) : (
            paginatedEvents.map((event) => (
              <EventCard
                key={event._id || event.id}
                event={event}
                onView={() => handleAction("view", event)}
                onEdit={() => handleAction("edit", event)}
                onDelete={() => handleAction("delete", event)}
              />
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={filteredEvents.length}
          limit={EVENTS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      <AnimatePresence>
        {/* Delete Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={handleDeleteModalClose}
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
                <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Trash2 size={28} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Delete Event</h2>
                      <p className="text-white/80 text-sm mt-0.5">This action cannot be undone</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                      <AlertTriangle size={12} />
                      Admin Verification Required
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <strong>Event:</strong>{" "}
                      {selectedEvent.category?.charAt(0).toUpperCase() + selectedEvent.category?.slice(1)} Event
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <strong>Contact:</strong> {selectedEvent.contactName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>ID:</strong> {selectedEvent._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Admin Password
                    </label>
                    <div className="relative">
                      <input
                        type={showDeletePassword ? "text" : "password"}
                        value={deletePassword}
                        onChange={(e) => {
                          setDeletePassword(e.target.value);
                          setDeleteError("");
                        }}
                        placeholder="Enter admin password"
                        className={`w-full pl-4 pr-12 py-3 rounded-xl border-2 outline-none transition-all bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${deleteError
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                          : "border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                          }`}
                        disabled={deleteLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && deletePassword) {
                            handleDeleteConfirm();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showDeletePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {deleteError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-sm mt-2 flex items-center gap-1.5"
                        >
                          <AlertTriangle size={14} />
                          {deleteError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleDeleteModalClose}
                      disabled={deleteLoading}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteConfirm}
                      disabled={deleteLoading || !deletePassword.trim()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
                    >
                      {deleteLoading ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={18} />
                          Delete Event
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}

const StatsCard = ({ icon: Icon, label, value, trend, color, lightBg, onClick, isActive }) => (
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

const EventTableRow = ({ event, onView, onEdit, onDelete }) => {
  const statusInfo = statusConfig[event?.status] || statusConfig.pending;
  const StatusIcon = statusInfo?.icon || Clock;

  const eventName = event.category
    ? event.category.charAt(0).toUpperCase() + event.category.slice(1) + " Event"
    : "Event";
  const clientName = event.contactName || event.username || "N/A";
  const eventDate = event.eventDetails?.selectedDate || null;
  const venue = event.city || "N/A";
  const budgetFormatted = event.budgetDetails?.valueFormatted || "N/A";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {eventName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
              {eventName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{clientName}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
          <Calendar size={14} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">
            {eventDate
              ? new Date(eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
              : event.eventDetails?.year && event.eventDetails?.month
                ? `${event.eventDetails.month} ${event.eventDetails.year}`
                : "N/A"}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <MapPin size={14} className="text-gray-400 flex-shrink-0" />
          <span className="truncate max-w-[150px]">{venue}</span>
        </div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{budgetFormatted}</div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo?.color}`}
        >
          <StatusIcon size={12} />
          {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1).replace("-", " ") : "Pending"}
        </span>
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

const EventRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
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

const EventCard = ({ event, onView, onEdit, onDelete }) => {
  const statusInfo = statusConfig[event.status] || statusConfig.pending;
  const StatusIcon = statusInfo?.icon || Clock;

  const eventName = event.category
    ? event.category.charAt(0).toUpperCase() + event.category.slice(1) + " Event"
    : "Event";
  const clientName = event.contactName || event.username || "N/A";
  const eventDate = event.eventDetails?.selectedDate || null;
  const venue = event.city || "N/A";
  const budgetFormatted = event.budgetDetails?.valueFormatted || "N/A";
  const eventType = event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : "Event";
  const guestCount = event.guestDetails?.count || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group"
    >
      <div className="relative h-36 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center p-4">
          <h3 className="text-lg font-bold truncate max-w-[200px] mb-1">{eventName}</h3>
          <p className="text-white/80 text-sm truncate">{clientName}</p>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.color}`}>
            {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1).replace("-", " ") : "Pending"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={14} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {eventDate
                ? new Date(eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                : event.eventDetails?.year && event.eventDetails?.month
                  ? `${event.eventDetails.month} ${event.eventDetails.year}`
                  : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <DollarSign size={14} className="text-gray-400 flex-shrink-0" />
            {budgetFormatted}
          </div>
          {event.eventDetails?.timeSlot && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={14} className="text-gray-400 flex-shrink-0" />
              {event.eventDetails.timeSlot}
            </div>
          )}
          {guestCount && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Users size={14} className="text-gray-400 flex-shrink-0" />
              {guestCount} Guests
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 capitalize truncate max-w-[120px]">{eventType}</span>
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

const EventCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-36 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
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
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span> events
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
