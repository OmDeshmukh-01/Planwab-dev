"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { List, RefreshCw, ChevronRight, Home, Building2, Eye } from "lucide-react";
import AllVendorProfiles from "@/components/desktop/admin/vendor-profiles/AllVendorProfiles";
import ViewVendorProfileTab from "@/components/desktop/admin/vendor-profiles/ViewVendorProfileTab";

export default function VendorProfilesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState("all");
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        setRefreshTrigger((prev) => prev + 1);
        setLastRefresh(new Date());
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsRefreshing(false);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === "r") {
                e.preventDefault();
                handleRefresh();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleRefresh]);

    const handleViewProfile = useCallback((profile) => {
        setSelectedProfile(profile);
        setActiveTab("view");
    }, []);

    const handleBackToList = useCallback(() => {
        setActiveTab("all");
        setSelectedProfile(null);
    }, []);

    const handleStatsUpdate = useCallback((newStats) => {
        setStats(newStats);
    }, []);

    const tabs = [
        { id: "all", label: "All Vendor Profiles", icon: List, description: "View all vendor profiles across the platform", badge: stats?.total },
    ];

    if (activeTab === "view" && selectedProfile) {
        tabs.push({
            id: "view",
            label: "View Profile",
            icon: Eye,
            description: "Viewing vendor profile details",
        });
    }

    const getBreadcrumbs = () => {
        return [{ label: "Dashboard", href: "/admin" }, { label: "Vendor Profiles" }];
    };

    const getPageTitle = () => {
        return "Vendor Profiles";
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-[1600px] mx-auto">
                <nav className="flex items-center gap-1 text-sm mb-4 overflow-x-auto">
                    <Home size={14} className="text-gray-400 flex-shrink-0" />
                    {getBreadcrumbs().map((crumb, index) => (
                        <div key={index} className="flex items-center gap-1 flex-shrink-0">
                            <ChevronRight size={14} className="text-gray-400" />
                            {crumb.href ? (
                                <a
                                    href={crumb.href}
                                    className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                                >
                                    {crumb.label}
                                </a>
                            ) : (
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {crumb.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 md:p-4 mb-4 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                                <Building2 size={24} className="text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                                    {getPageTitle()}
                                </h1>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <RefreshCw size={10} />
                                        Last updated: {mounted ? lastRefresh.toLocaleTimeString() : "--:--:--"}
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline">Press Ctrl+R to refresh</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                                title="Refresh (Ctrl+R)"
                            >
                                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                            {tabs.map((tab) => (
                                <TabButton
                                    key={tab.id}
                                    tab={tab}
                                    isActive={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab + (selectedProfile?._id || selectedProfile?.vendorId || "")}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {activeTab === "all" && (
                            <AllVendorProfiles onViewProfile={handleViewProfile} refreshTrigger={refreshTrigger} onStatsUpdate={handleStatsUpdate} />
                        )}

                        {activeTab === "view" && selectedProfile && (
                            <ViewVendorProfileTab profile={selectedProfile} onBack={handleBackToList} />
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
                    <p>
                        Event Management System • Press{" "}
                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+R</kbd> to refresh
                    </p>
                </div>
            </div>
        </div>
    );
}

const TabButton = ({ tab, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`group flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            }`}
    >
        <tab.icon
            size={18}
            className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-indigo-600 dark:text-indigo-400" : ""
                }`}
        />
        <div className="text-left">
            <span className="block">{tab.label}</span>
            <span
                className={`text-xs font-normal hidden md:block ${isActive ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"
                    }`}
            >
                {tab.description}
            </span>
        </div>
        {tab.badge !== undefined && (
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
                }`}>
                {tab.badge}
            </span>
        )}
        {isActive && (
            <motion.div
                layoutId="activeTabIndicator"
                className="ml-auto w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
    </button>
);
