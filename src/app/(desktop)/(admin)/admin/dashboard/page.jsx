"use client";

import DashboardStatsCard from "@/components/desktop/admin/DashboardStatsCard";
import {
  Users, Briefcase, Star, Layers, IdCard,
  ShoppingCart, SendHorizontal, Cake, CalendarCheck, Megaphone
} from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVendors: 0,
    featuredVendors: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalVendorProfiles: 0,
    totalOrders: 0,
    vendorRequests: 0,
    totalBirthdayRequests: 0,
    totalBookingRequests: 0,
    totalLeadsRequests: 0,
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <DashboardStatsCard
          title="Total Vendors"
          value={stats.totalVendors}
          icon={Briefcase}
          loading={loading}
        />
        <DashboardStatsCard
          title="Featured Vendors"
          value={stats.featuredVendors}
          icon={Star}
          loading={loading}
        />
        <DashboardStatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          loading={loading}
        />
        <DashboardStatsCard
          title="Total Categories"
          value={stats.totalCategories}
          icon={Layers}
          loading={loading}
        />
        <DashboardStatsCard
          title="Vendor Profiles"
          value={stats.totalVendorProfiles}
          icon={IdCard}
          loading={loading}
        />
        <DashboardStatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          loading={loading}
        />
        <DashboardStatsCard
          title="Vendor Requests"
          value={stats.vendorRequests}
          icon={SendHorizontal}
          loading={loading}
        />
        <DashboardStatsCard
          title="Birthday Requests"
          value={stats.totalBirthdayRequests}
          icon={Cake}
          loading={loading}
        />
        <DashboardStatsCard
          title="Booking Requests"
          value={stats.totalBookingRequests}
          icon={CalendarCheck}
          loading={loading}
        />
        <DashboardStatsCard
          title="Leads Requests"
          value={stats.totalLeadsRequests}
          icon={Megaphone}
          loading={loading}
        />
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Recent Activity</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Activity feed will be displayed here.</p>
      </div>
    </div>
  );
}
