"use client";

import DashboardStatsCard from "@/components/desktop/admin/DashboardStatsCard";
import { Calendar, Briefcase, Users, PieChart } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeVendors: 0,
    newUsers: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatsCard
          title="Total Events"
          value={loading ? "..." : stats.totalEvents}
          description="Upcoming & Past Events"
          icon={Calendar}
        />
        <DashboardStatsCard
          title="Active Vendors"
          value={loading ? "..." : stats.activeVendors}
          description="Verified Marketplace Vendors"
          icon={Briefcase}
        />
        <DashboardStatsCard
          title="New Users This Month"
          value={loading ? "..." : stats.newUsers.toLocaleString()}
          description="+15% from last month"
          icon={Users}
        />
        {/* <DashboardStatsCard
          title="Revenue (This Month)"
          value={loading ? "..." : `$${stats.revenue.toLocaleString()}`}
          description="From Vendor Subscriptions"
          icon={PieChart}
        /> */}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Recent Activity</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Activity feed will be displayed here.</p>
      </div>
    </div>
  );
}
