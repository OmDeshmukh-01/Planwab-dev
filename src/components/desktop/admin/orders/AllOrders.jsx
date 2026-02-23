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
    SlidersHorizontal,
    MapPin,
    Sparkles,
    LayoutGrid,
    List as ListIcon,
    Building2,
    XCircle,
    WifiOff,
    EyeOff,
    ShoppingCart,
    Plus
} from "lucide-react";
import { toast } from "sonner";

const ORDERS_PER_PAGE = 10;

const statusConfig = {
    "PLACED": { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", icon: Clock },
    "CONFIRMED": { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300", icon: Calendar },
    "COMPLETED": { color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300", icon: CheckCircle },
    "CANCELLED": { color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300", icon: XCircle },
};

const StatsCard = ({ icon: Icon, label, value, trend, color, lightBg }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${lightBg} ${color.replace("bg-", "text-")}`}>
                <Icon size={20} />
            </div>
            {trend !== undefined && (
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${trend > 0
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : trend < 0
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                >
                    {trend > 0 ? <ArrowUpRight size={12} /> : trend < 0 ? <ArrowDownRight size={12} /> : null}
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{value}</h4>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        </div>
    </div>
);

const OrderRowSkeleton = () => (
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
        <td className="px-4 py-4"><div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" /></td>
        <td className="px-4 py-4 text-right">
            <div className="flex justify-end gap-2">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
        </td>
    </tr>
);

const OrderCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="space-y-3 mb-4">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
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

const OrderTableRow = ({ order, onView, onEdit, onDelete }) => {
    const statusInfo = statusConfig[order.orderStatus] || {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: Clock,
    };
    const StatusIcon = statusInfo.icon;

    const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
            <td className="px-4 py-4">
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center font-bold text-lg">
                            {order.user?.firstName?.charAt(0) || "U"}
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {order.user?.firstName} {order.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.user?.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    {dateStr}
                </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm text-gray-900 dark:text-white">{order.event?.type || "N/A"}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{order.event?.name}</div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{order.pricing?.total?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{order.paymentMethod}</div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 w-max ${statusInfo.color}`}>
                    <StatusIcon size={12} />
                    {order.orderStatus}
                </span>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2 transition-opacity">
                    <button
                        onClick={onView}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Edit Order"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete Order"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

const OrderCard = ({ order, onView, onEdit, onDelete }) => {
    const statusInfo = statusConfig[order.orderStatus] || {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: Clock,
    };
    const StatusIcon = statusInfo.icon;

    const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center overflow-hidden">
                    <div className="h-12 w-12 flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center font-bold text-xl">
                            {order.user?.firstName?.charAt(0) || "U"}
                        </div>
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                            {order.user?.firstName} {order.user?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{order.user?.email}</p>
                    </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 shrink-0 ${statusInfo.color}`}>
                    <StatusIcon size={12} />
                    {order.orderStatus}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar size={14} /> Date
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{dateStr}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <LayoutGrid size={14} /> Event
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">{order.event?.type || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <DollarSign size={14} /> Amount
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{order.pricing?.total?.toLocaleString() || 0}</span>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={onView}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="View Details"
                >
                    <Eye size={18} />
                </button>
                <button
                    onClick={onEdit}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                    title="Edit Order"
                >
                    <Edit size={18} />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete Order"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};


export default function AllOrders({ onViewOrder, onEditOrder, onDeleteSuccess, refreshTrigger }) {
    const [orders, setOrders] = useState([]);
    const [allOrdersData, setAllOrdersData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [viewMode, setViewMode] = useState("table");
    const [showFilters, setShowFilters] = useState(false);
    const [apiStats, setApiStats] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [showDeletePassword, setShowDeletePassword] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/orders");

            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                const ordersArray = result.data || [];
                setOrders(ordersArray);
                setAllOrdersData(ordersArray);
                setApiStats(result.stats);
            } else {
                throw new Error(result.message || "Failed to fetch orders");
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message);
            setOrders([]);
            setAllOrdersData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, refreshTrigger]);

    const filteredOrders = useMemo(() => {
        let filtered = [...allOrdersData];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    order.user?.firstName?.toLowerCase().includes(query) ||
                    order.user?.lastName?.toLowerCase().includes(query) ||
                    order.user?.email?.toLowerCase().includes(query) ||
                    order.event?.type?.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((order) => order.orderStatus === statusFilter);
        }

        if (typeFilter !== "all") {
            filtered = filtered.filter((order) => order.event?.type === typeFilter);
        }

        filtered.sort((a, b) => {
            let aVal, bVal;

            if (sortBy === "createdAt") {
                aVal = new Date(a.createdAt);
                bVal = new Date(b.createdAt);
            } else if (sortBy === "total") {
                aVal = a.pricing?.total || 0;
                bVal = b.pricing?.total || 0;
            } else if (sortBy === "userName") {
                aVal = a.user?.firstName || "";
                bVal = b.user?.firstName || "";
            } else if (sortBy === "eventType") {
                aVal = a.event?.type || "";
                bVal = b.event?.type || "";
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
    }, [allOrdersData, searchQuery, statusFilter, typeFilter, sortBy, sortOrder]);

    const stats = useMemo(() => {
        if (!allOrdersData || allOrdersData.length === 0) {
            return {
                total: 0,
                placed: 0,
                confirmed: 0,
                completed: 0,
                cancelled: 0,
                totalRevenue: 0,
                thisMonth: 0,
                lastMonth: 0,
                growthRate: 0,
            };
        }

        const total = allOrdersData.length;
        const placed = allOrdersData.filter((e) => e.orderStatus === "PLACED").length;
        const confirmed = allOrdersData.filter((e) => e.orderStatus === "CONFIRMED").length;
        const completed = allOrdersData.filter((e) => e.orderStatus === "COMPLETED").length;
        const cancelled = allOrdersData.filter((e) => e.orderStatus === "CANCELLED").length;

        const totalRevenue = allOrdersData.reduce(
            (sum, e) => sum + (e.pricing?.total || 0),
            0
        );

        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const thisMonth = allOrdersData.filter((e) => {
            const orderDate = new Date(e.createdAt);
            return orderDate >= thisMonthStart;
        }).length;

        const lastMonth = allOrdersData.filter((e) => {
            const orderDate = new Date(e.createdAt);
            return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
        }).length;

        const growthRate =
            lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : thisMonth > 0 ? 100 : 0;

        return {
            total,
            placed,
            confirmed,
            completed,
            cancelled,
            totalRevenue,
            thisMonth,
            lastMonth,
            growthRate,
        };
    }, [allOrdersData]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
        const endIndex = startIndex + ORDERS_PER_PAGE;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, currentPage]);

    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleAction = useCallback(
        (action, order) => {
            setSelectedOrder(order);
            if (action === "view") onViewOrder?.(order);
            if (action === "edit") onEditOrder?.(order);
            if (action === "delete") setDeleteModalOpen(true);
        },
        [onViewOrder, onEditOrder]
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
                `/api/orders?id=${selectedOrder._id}&password=${encodeURIComponent(deletePassword)}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete order");
            }

            setDeleteModalOpen(false);
            setSelectedOrder(null);
            setDeletePassword("");
            setDeleteError("");
            toast.success("Order deleted successfully");
            await fetchOrders();
            onDeleteSuccess?.();
        } catch (err) {
            setDeleteError(err.message);
            toast.error(`Error deleting order: ${err.message}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setSelectedOrder(null);
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
        const headers = ["User Name", "Email", "Event", "Date", "Total", "Status", "Payment Method"];
        const rows = filteredOrders.map((e) => [
            `${e.user?.firstName || ""} ${e.user?.lastName || ""}`,
            e.user?.email || "",
            e.event?.type || "",
            new Date(e.createdAt).toLocaleDateString("en-US"),
            e.pricing?.total || 0,
            e.orderStatus || "",
            e.paymentMethod || "",
        ]);

        const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleRefresh = async () => {
        await fetchOrders();
    };

    const hasActiveFilters = searchQuery || statusFilter !== "all" || typeFilter !== "all";

    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "PLACED", label: "Placed" },
        { value: "CONFIRMED", label: "Confirmed" },
        { value: "COMPLETED", label: "Completed" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    const typeOptions = useMemo(() => {
        const uniqueTypes = new Set(allOrdersData.map((e) => e.event?.type).filter(Boolean));
        return [
            { value: "all", label: "All Event Types" },
            ...Array.from(uniqueTypes).map((cat) => ({
                value: cat,
                label: cat.charAt(0).toUpperCase() + cat.slice(1),
            })),
        ];
    }, [allOrdersData]);

    const sortOptions = [
        { value: "createdAt", label: "Date Placed" },
        { value: "userName", label: "User Name" },
        { value: "eventType", label: "Event Type" },
        { value: "total", label: "Total Amount" },
    ];

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatsCard
                    icon={ShoppingCart}
                    label="Total Orders"
                    value={stats.total}
                    color="bg-blue-500"
                    lightBg="bg-blue-50 dark:bg-blue-900/20"
                />
                <StatsCard
                    icon={Clock}
                    label="Placed"
                    value={stats.placed}
                    color="bg-purple-500"
                    lightBg="bg-purple-50 dark:bg-purple-900/20"
                />
                <StatsCard
                    icon={Calendar}
                    label="Confirmed"
                    value={stats.confirmed}
                    color="bg-yellow-500"
                    lightBg="bg-yellow-50 dark:bg-yellow-900/20"
                />
                <StatsCard
                    icon={CheckCircle}
                    label="Completed"
                    value={stats.completed}
                    color="bg-green-500"
                    lightBg="bg-green-50 dark:bg-green-900/20"
                />
                <StatsCard
                    icon={DollarSign}
                    label="Total Revenue"
                    value={stats.totalRevenue > 0 ? `₹${(stats.totalRevenue / 100000).toFixed(1)}L` : "₹0"}
                    color="bg-indigo-500"
                    lightBg="bg-indigo-50 dark:bg-indigo-900/20"
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
                                placeholder="Search users, emails, or events..."
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

                        <div className="flex flex-wrap items-center gap-2">


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
                                        {(searchQuery ? 1 : 0) + (statusFilter !== "all" ? 1 : 0) + (typeFilter !== "all" ? 1 : 0)}
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
                                disabled={filteredOrders.length === 0}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex"
                                title="Export to CSV"
                            >
                                <Download size={16} />
                                <span className="hidden sm:inline">Export</span>
                            </button>

                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50 shrink-0"
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
                                        options={statusOptions}
                                        value={statusFilter}
                                        onChange={(val) => {
                                            setStatusFilter(val);
                                            setCurrentPage(1);
                                        }}
                                        icon={CheckCircle}
                                    />
                                    <FilterDropdown
                                        label="Event Type"
                                        options={typeOptions}
                                        value={typeFilter}
                                        onChange={(val) => {
                                            setTypeFilter(val);
                                            setCurrentPage(1);
                                        }}
                                        icon={LayoutGrid}
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                                        Event
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                                        Total
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
                                    Array.from({ length: ORDERS_PER_PAGE }).map((_, i) => <OrderRowSkeleton key={i} />)
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
                                ) : paginatedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <ShoppingCart size={36} className="text-gray-300 dark:text-gray-600" />
                                                <p className="text-gray-500 dark:text-gray-400 font-medium">No orders found</p>
                                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                                    {hasActiveFilters ? "Try adjusting your filters" : "You have no orders right now."}
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
                                    paginatedOrders.map((order) => (
                                        <OrderTableRow
                                            key={order._id || order.id}
                                            order={order}
                                            onView={() => handleAction("view", order)}
                                            onEdit={() => handleAction("edit", order)}
                                            onDelete={() => handleAction("delete", order)}
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
                        Array.from({ length: 9 }).map((_, i) => <OrderCardSkeleton key={i} />)
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
                    ) : paginatedOrders.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center gap-3 py-12">
                            <ShoppingCart size={36} className="text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No orders found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                {hasActiveFilters ? "Try adjusting your filters" : "You have no orders right now."}
                            </p>
                        </div>
                    ) : (
                        paginatedOrders.map((order) => (
                            <OrderCard
                                key={order._id || order.id}
                                order={order}
                                onView={() => handleAction("view", order)}
                                onEdit={() => handleAction("edit", order)}
                                onDelete={() => handleAction("delete", order)}
                            />
                        ))
                    )}
                </div>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={filteredOrders.length}
                    limit={ORDERS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            )}

            <AnimatePresence>
                {/* Delete Modal */}
                {isDeleteModalOpen && selectedOrder && (
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
                                        <h2 className="text-xl font-bold">Delete Order</h2>
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
                                        <strong>Customer:</strong>{" "}
                                        {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                        <strong>Event:</strong> {selectedOrder.event?.type}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>ID:</strong> {selectedOrder._id?.slice(-8).toUpperCase()}
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
                                                : "border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
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

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={handleDeleteModalClose}
                                        disabled={deleteLoading}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirm}
                                        disabled={deleteLoading || !deletePassword}
                                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {deleteLoading ? (
                                            <>
                                                <RefreshCw size={18} className="animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={18} />
                                                Delete Order
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
