"use client";

import DashboardStatsCard from "@/components/desktop/admin/DashboardStatsCard";
import {
  Users, Briefcase, Star, Layers, IdCard,
  ShoppingCart, SendHorizontal, Cake, CalendarCheck, Megaphone
} from "lucide-react";
import { useState, useEffect } from "react";
import { VendorCategoriesChart } from "@/components/desktop/ui/Charts/VendorCategoriesChart";
import { OrdersEventsChart } from "@/components/desktop/ui/Charts/OrdersEventsChart";
import { BirthdayBookingChart } from "@/components/desktop/ui/Charts/BirthdayBookingChart";
import { LeadsChart } from "@/components/desktop/ui/Charts/LeadsChart";
import { VendorContactRequestsChart } from "@/components/desktop/ui/Charts/VendorContactRequestsChart";

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
    totalContactRequests: 0,
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
        <DashboardStatsCard
          title="Contact Requests"
          value={stats.totalContactRequests}
          icon={Megaphone}
          loading={loading}
        />
      </div>

      <div className="mt-8 mb-6">
        <OrdersEventsChart />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <VendorCategoriesChart />
        <LeadsChart />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <BirthdayBookingChart />
        <VendorContactRequestsChart />
      </div>
    </div>
  );
}
