// app/admin/reels/page.jsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  PlusCircle,
  Eye,
  Edit,
  ArrowLeft,
  Video,
  RefreshCw,
  ChevronRight,
  Home,
} from "lucide-react";
import AllReels from "../../../../../components/desktop/admin/reels/AllReels";
import ViewReelTab from "../../../../../components/desktop/admin/reels/ViewReelTab";
import EditReelTab from "../../../../../components/desktop/admin/reels/EditReelTab";
import AddReel from "../../../../../components/desktop/admin/reels/AddReels";

export default function ReelsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "all"
  );
  const [selectedReel, setSelectedReel] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const reelId = searchParams.get("reelId");

    if (tab && ["all", "add", "view", "edit"].includes(tab)) {
      setActiveTab(tab);
    }

    if (reelId && (tab === "view" || tab === "edit")) {
      fetchReelById(reelId);
    }
  }, [searchParams]);

  const fetchReelById = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/reels/${id}`);
      if (!response.ok) throw new Error("Reel not found");
      const result = await response.json();
      setSelectedReel(result.data || result);
      console.log("Fetched reel for ID:", id, result);
    } catch (error) {
      console.error("Error fetching reel:", error);
      updateURL("all");
      setSelectedReel(null);
    }
  }, []);

  const updateURL = useCallback(
    (tab, reelId = null) => {
      const params = new URLSearchParams();
      params.set("tab", tab);
      if (reelId) params.set("reelId", reelId);
      if (tab === "view" || tab === "edit") {
        params.set("title", selectedReel?.title || "reel");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, selectedReel]
  );

  const handleViewReel = useCallback(
    (reel) => {
      if (!reel || !reel._id) return;
      setSelectedReel(reel);
      setActiveTab("view");
      updateURL("view", reel._id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateURL]
  );

  const handleEditReel = useCallback(
    (reel) => {
      if (!reel || !reel._id) return;
      setSelectedReel(reel);
      setActiveTab("edit");
      updateURL("edit", reel._id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateURL]
  );

  const handleBackToList = useCallback(() => {
    setActiveTab("all");
    setSelectedReel(null);
    updateURL("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL]);

  const handleEditSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    setActiveTab("all");
    setSelectedReel(null);
    updateURL("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL]);

  const handleDeleteSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    setActiveTab("all");
    setSelectedReel(null);
    updateURL("all");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL]);

  const handleSwitchToEdit = useCallback(() => {
    setActiveTab("edit");
    updateURL("edit", selectedReel?._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [updateURL, selectedReel]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsRefreshing(false);
  }, []);

  const handleAddSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setLastRefresh(new Date());
    setActiveTab("all");
    updateURL("all");
  }, [updateURL]);

  const handleStatsUpdate = useCallback((newStats) => {
    setStats(newStats);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Escape" &&
        (activeTab === "view" || activeTab === "edit")
      ) {
        handleBackToList();
      }
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        handleRefresh();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, handleBackToList, handleRefresh]);

  const tabs = [
    {
      id: "all",
      label: "All Reels",
      icon: List,
      description: "View and manage all reels",
      badge: stats?.total,
    },
    {
      id: "add",
      label: "Add Reel",
      icon: PlusCircle,
      description: "Upload a new reel",
    },
  ];

  const getBreadcrumbs = () => {
    const crumbs = [
      { label: "Dashboard", href: "/admin" },
      { label: "Reels" },
    ];
    if (activeTab === "view" && selectedReel) {
      crumbs.push({ label: selectedReel.title, isActive: true });
    } else if (activeTab === "edit" && selectedReel) {
      crumbs.push({
        label: selectedReel.title,
        onClick: () => setActiveTab("view"),
      });
      crumbs.push({ label: "Edit", isActive: true });
    } else if (activeTab === "add") {
      crumbs.push({ label: "Add New", isActive: true });
    }
    return crumbs;
  };

  const getPageTitle = () => {
    if (activeTab === "view" && selectedReel)
      return `Viewing: ${selectedReel.title}`;
    if (activeTab === "edit" && selectedReel)
      return `Editing: ${selectedReel.title}`;
        if (activeTab === "add") return "Add New Reel";
    return "Manage Reels";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto">
        <div className="">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm mb-4 overflow-x-auto">
            <Home size={14} className="text-gray-400 flex-shrink-0" />
            {getBreadcrumbs().map((crumb, index) => (
              <div key={index} className="flex items-center gap-1 flex-shrink-0">
                <ChevronRight size={14} className="text-gray-400" />
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    className="text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span
                    className={
                      crumb.isActive
                        ? "text-gray-900 dark:text-white font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 md:p-4 mb-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg flex-shrink-0">
                  <Video size={24} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                    {getPageTitle()}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <RefreshCw size={10} />
                      Last updated:{" "}
                      {mounted ? lastRefresh.toLocaleTimeString() : "--:--:--"}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">Press Ctrl+R to refresh</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {(activeTab === "view" || activeTab === "edit") && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleBackToList}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Back to List</span>
                    <span className="sm:hidden">Back</span>
                  </motion.button>
                )}

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                  title="Refresh (Ctrl+R)"
                >
                  <RefreshCw
                    size={18}
                    className={isRefreshing ? "animate-spin" : ""}
                  />
                </button>

                {activeTab === "all" && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => {
                      setActiveTab("add");
                      updateURL("add");
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl transition-all text-sm font-semibold shadow-lg shadow-rose-500/25"
                  >
                    <PlusCircle size={16} />
                    <span className="hidden sm:inline">Add Reel</span>
                    <span className="sm:hidden">Add</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            {!selectedReel && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  {tabs.map((tab) => (
                    <TabButton
                      key={tab.id}
                      tab={tab}
                      isActive={activeTab === tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        updateURL(tab.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reel Navigation when viewing/editing */}
            {selectedReel && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 relative">
                    {selectedReel.thumbnail ? (
                      <img
                        src={selectedReel.thumbnail}
                        alt={selectedReel.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video size={18} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {selectedReel.title}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {selectedReel.eventType} •{" "}
                      {selectedReel.category || "Uncategorized"}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setActiveTab("view")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeTab === "view"
                          ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Eye size={14} />
                      <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("edit")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeTab === "edit"
                          ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Edit size={14} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedReel?._id || "")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {activeTab === "all" && (
                <AllReels
                  onViewReel={handleViewReel}
                  onEditReel={handleEditReel}
                  refreshTrigger={refreshTrigger}
                  onStatsUpdate={handleStatsUpdate}
                />
              )}

              {activeTab === "add" && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <AddReel onSuccess={handleAddSuccess} />
                </div>
              )}

              {activeTab === "view" && selectedReel && (
                <ViewReelTab
                  reelId={selectedReel?._id}
                  initialReelData={selectedReel}
                  onEdit={handleSwitchToEdit}
                  onDelete={handleDeleteSuccess}
                />
              )}

              {activeTab === "edit" && selectedReel && (
                <EditReelTab
                  reelId={selectedReel?._id}
                  initialReelData={selectedReel}
                  onSuccess={handleEditSuccess}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Info */}
          <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
            <p>
              Reels Management System • Press{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                Esc
              </kbd>{" "}
              to go back •{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                Ctrl+R
              </kbd>{" "}
              to refresh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TabButton = ({ tab, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 shadow-sm"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
    }`}
  >
    <tab.icon
      size={18}
      className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
        isActive ? "text-rose-600 dark:text-rose-400" : ""
      }`}
    />
    <div className="text-left">
      <span className="block">{tab.label}</span>
      <span
        className={`text-xs font-normal hidden md:block ${
          isActive
            ? "text-rose-500 dark:text-rose-400"
            : "text-gray-400 dark:text-gray-500"
        }`}
      >
        {tab.description}
      </span>
    </div>
    {tab.badge !== undefined && (
      <span
        className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          isActive
            ? "bg-rose-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
        }`}
      >
        {tab.badge}
      </span>
    )}
    {isActive && (
      <motion.div
        layoutId="activeReelTabIndicator"
        className="ml-auto w-2 h-2 rounded-full bg-rose-600 dark:bg-rose-400"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </button>
);