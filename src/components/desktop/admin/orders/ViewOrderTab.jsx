"use client";

import { useState, useContext, createContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    User,
    ArrowLeft,
    Info,
    CheckCircle,
    AlertCircle,
    X,
    Copy,
    Sparkles,
    RefreshCw,
    Mail,
    Phone,
    Calendar,
    Settings,
    Tag,
    IndianRupee,
    ShoppingCart,
    CreditCard,
    FileText,
    ListChecks,
    Users
} from "lucide-react";

// ============================================================================
// TOAST CONTEXT & PROVIDER
// ============================================================================
const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                            className={`pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-sm flex items-start gap-3 ${toast.type === "success"
                                ? "bg-green-50/95 dark:bg-green-900/95 border-green-300 dark:border-green-600 text-green-800 dark:text-green-100"
                                : toast.type === "error"
                                    ? "bg-red-50/95 dark:bg-red-900/95 border-red-300 dark:border-red-600 text-red-800 dark:text-red-100"
                                    : toast.type === "warning"
                                        ? "bg-yellow-50/95 dark:bg-yellow-900/95 border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-100"
                                        : "bg-blue-50/95 dark:bg-blue-900/95 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-100"
                                }`}
                        >
                            <div
                                className={`p-1 rounded-full ${toast.type === "success"
                                    ? "bg-green-200 dark:bg-green-700"
                                    : toast.type === "error"
                                        ? "bg-red-200 dark:bg-red-700"
                                        : toast.type === "warning"
                                            ? "bg-yellow-200 dark:bg-yellow-700"
                                            : "bg-blue-200 dark:bg-blue-700"
                                    }`}
                            >
                                {toast.type === "success" && <CheckCircle size={18} />}
                                {toast.type === "error" && <AlertCircle size={18} />}
                                {toast.type === "warning" && <AlertCircle size={18} />}
                                {toast.type === "info" && <Info size={18} />}
                            </div>
                            <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ViewOrderTab({ order, onBack }) {
    return (
        <ToastProvider>
            <ViewOrderContent order={order} onBack={onBack} />
        </ToastProvider>
    );
}

// ============================================================================
// MAIN CONTENT COMPONENT
// ============================================================================
function ViewOrderContent({ order, onBack }) {
    const [copiedField, setCopiedField] = useState(null);
    const { addToast } = useToast();

    if (!order) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw className="animate-spin text-indigo-500 mx-auto mb-3" size={32} />
                    <p className="text-gray-500 dark:text-gray-400">Loading order data...</p>
                </div>
            </div>
        );
    }

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        addToast(`${field} copied to clipboard`, "success");
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const gradientColor = "from-teal-500 to-indigo-600";

    const getStatusColor = (status) => {
        switch (status) {
            case "COMPLETED": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/50";
            case "CONFIRMED": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50";
            case "PLACED": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/50";
            case "CANCELLED": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50";
            default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-2 sm:px-4 lg:px-6 w-full max-w-full overflow-x-hidden box-border">
            <div className="w-full max-w-6xl mx-auto overflow-hidden">
                {/* ================================================================== */}
                {/* MAIN CARD */}
                {/* ================================================================== */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* ================================================================ */}
                    {/* HEADER SECTION */}
                    {/* ================================================================ */}
                    <div className={`relative h-48 md:h-56 bg-gradient-to-r ${gradientColor} overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                                <div className="flex items-end gap-4 min-w-0 flex-1">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        <ShoppingCart size={36} className="text-white" />
                                    </div>
                                    <div className="flex-1 text-white min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h1 className="text-xl md:text-2xl font-bold truncate">
                                                Order {order._id.slice(-8).toUpperCase()}
                                            </h1>
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border backdrop-blur-sm shadow-sm ${getStatusColor(order.orderStatus)}`}
                                            >
                                                <ListChecks size={14} />
                                                {order.orderStatus}
                                            </motion.span>
                                        </div>
                                        <p className="text-white/90 text-lg font-medium mb-1 truncate">
                                            {order.user?.firstName} {order.user?.lastName}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm mt-2">
                                            <span className="flex items-center gap-1 font-medium bg-black/20 px-2 py-1 rounded-md">
                                                <IndianRupee size={14} />
                                                {(order.pricing?.total || 0).toLocaleString('en-IN')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-shrink-0">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onBack}
                                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all border border-white/20 backdrop-blur-sm"
                                    >
                                        <ArrowLeft size={16} />
                                        <span className="hidden sm:inline">Back</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================================================================ */}
                    {/* CONTENT SECTIONS */}
                    {/* ================================================================ */}
                    <div className="p-4 md:p-6 lg:p-8 space-y-8">

                        {/* Items Section */}
                        <Section title="Order Items" icon={ShoppingCart} badge={`${order.items?.length || 0} Items`}>
                            {order.items && order.items.length > 0 ? (
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={item.id || idx} className="p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-sm flex flex-col md:flex-row gap-4">
                                            {item.image ? (
                                                <img src={item.image.startsWith('/') || item.image.startsWith('http') ? item.image : `/${item.image}`} alt={item.name} className="w-full md:w-32 h-32 object-cover rounded-xl" />
                                            ) : (
                                                <div className="w-full md:w-32 h-32 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center">
                                                    <ShoppingCart className="text-gray-400" size={32} />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-4">{item.name}</h3>
                                                    <div className="text-right">
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-0.5"><IndianRupee size={16} />{item.price?.toLocaleString('en-IN')}</span>
                                                        {item.originalPrice && item.originalPrice > item.price && (
                                                            <span className="text-sm text-gray-500 line-through flex items-center gap-0.5 justify-end"><IndianRupee size={12} />{item.originalPrice?.toLocaleString('en-IN')}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {item.addons && item.addons.length > 0 && (
                                                    <div className="mt-3">
                                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Add-ons</h4>
                                                        <ul className="space-y-1">
                                                            {item.addons.map((addon, aIdx) => (
                                                                <li key={aIdx} className="text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                                                                    <span>+ {addon.name}</span>
                                                                    <span className="font-medium flex items-center gap-0.5"><IndianRupee size={12} />{addon.price?.toLocaleString('en-IN')}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
                                                    <span className="flex items-center gap-1">ID: {item.id}</span>
                                                    {item.vendorId && <span className="flex items-center gap-1">Vendor: {item.vendorId}</span>}
                                                    {item.date && <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(item.date)}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                                    No items found in this order.
                                </div>
                            )}
                        </Section>

                        {/* Customer Info Section */}
                        <Section title="Customer Details" icon={User} badge="Contact & Shipping">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <InfoCard icon={User} label="Customer Name" value={`${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'N/A'} />
                                <InfoCard
                                    icon={Mail}
                                    label="Email Address"
                                    value={order.user?.email || "N/A"}
                                    copyable
                                    onCopy={copyToClipboard}
                                    copied={copiedField}
                                />
                                <InfoCard
                                    icon={Phone}
                                    label="Phone Number"
                                    value={order.user?.phone || "N/A"}
                                    copyable
                                    onCopy={copyToClipboard}
                                    copied={copiedField}
                                />
                                <InfoCard
                                    icon={MapPin}
                                    label="Address"
                                    value={`${order.user?.address || ''}\n${order.user?.city || ''} - ${order.user?.pincode || ''}`.trim() || "N/A"}
                                />
                            </div>
                        </Section>

                        {/* Event Details Section */}
                        {order.event && (
                            <Section title="Event Requirements" icon={Calendar} badge="For Vendor">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <InfoCard icon={Tag} label="Event Name" value={order.event.name || "N/A"} />
                                    <InfoCard icon={Info} label="Event Type" value={order.event.type || "N/A"} />
                                    <InfoCard icon={Calendar} label="Target Date" value={order.event.date ? formatDate(order.event.date) : "N/A"} />
                                    <InfoCard icon={Users} label="Expected Guests" value={order.event.guests || "N/A"} />
                                    {order.event.specialRequests && (
                                        <InfoCard
                                            icon={FileText}
                                            label="Special Requests"
                                            value={order.event.specialRequests}
                                            className="lg:col-span-2"
                                        />
                                    )}
                                </div>
                            </Section>
                        )}

                        {/* Payment & Pricing Stats */}
                        <Section title="Financial Breakdown" icon={CreditCard} badge="Payment">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl text-center border border-indigo-100 dark:border-indigo-800 shadow-sm">
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wider mb-1">Subtotal</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-0.5">
                                        <IndianRupee size={20} />{order.pricing?.subtotal?.toLocaleString('en-IN') || 0}
                                    </p>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-2xl text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Tax & Fees</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-0.5">
                                        <IndianRupee size={16} />{((order.pricing?.tax || 0) + (order.pricing?.platformFee || 0)).toLocaleString('en-IN')}
                                    </p>
                                </div>

                                {order.pricing?.discount > 0 && (
                                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl text-center border border-green-100 dark:border-green-800 shadow-sm">
                                        <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wider mb-1">Discount</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-0.5">
                                            -<IndianRupee size={16} />{order.pricing.discount?.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                )}

                                <div className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-2xl text-center border-2 border-teal-200 dark:border-teal-700 shadow-sm">
                                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium uppercase tracking-wider mb-1">Total Paid</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-0.5">
                                        <IndianRupee size={24} />{order.pricing?.total?.toLocaleString('en-IN') || 0}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                <InfoCard icon={CreditCard} label="Payment Method" value={order.paymentMethod ? order.paymentMethod.toUpperCase() : "N/A"} />
                                <InfoCard icon={Tag} label="Razorpay Order ID" value={order.razorpay?.orderId || "N/A"} copyable onCopy={copyToClipboard} copied={copiedField} />
                                <InfoCard icon={CheckCircle} label="Razorpay Payment ID" value={order.razorpay?.paymentId || "Pending"} copyable onCopy={copyToClipboard} copied={copiedField} />
                            </div>
                        </Section>

                        {/* System Information */}
                        <Section title="System Information" icon={Settings} badge="Metadata">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InfoCard
                                    icon={Info}
                                    label="Order Created"
                                    value={order.createdAt ? formatDate(order.createdAt) : "N/A"}
                                />
                                <InfoCard
                                    icon={Info}
                                    label="Last Updated"
                                    value={order.updatedAt ? formatDate(order.updatedAt) : "N/A"}
                                />
                                <InfoCard
                                    icon={Tag}
                                    label="Internal Order ID"
                                    value={order._id || "N/A"}
                                    copyable
                                    onCopy={copyToClipboard}
                                    copied={copiedField}
                                />
                            </div>
                        </Section>

                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// SECTION COMPONENT
// ============================================================================
const Section = ({ title, icon: Icon, children, badge, tip }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
    >
        <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 bg-gradient-to-br from-teal-100 to-indigo-100 dark:from-teal-900/30 dark:to-indigo-900/30 rounded-xl shadow-sm">
                    <Icon size={24} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div className="min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    {tip && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tip}</p>}
                </div>
            </div>
            {badge && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-sm font-bold rounded-xl border border-teal-200 dark:border-teal-700 flex-shrink-0 shadow-sm"
                >
                    {badge}
                </motion.span>
            )}
        </div>
        {children}
    </motion.div>
);

// ============================================================================
// INFO CARD COMPONENT
// ============================================================================
const InfoCard = ({ icon: Icon, label, value, className = "", copyable, onCopy, copied, highlight = false }) => (
    <motion.div
        whileHover={copyable ? { scale: 1.02, y: -2 } : { y: -1 }}
        className={`group p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full ${className} ${highlight ? "ring-2 ring-teal-500 ring-opacity-50" : ""
            }`}
    >
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 transition-colors">
                    <Icon size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
            </div>
            {copyable && (
                <button
                    onClick={() => onCopy(value, label)}
                    className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title={`Copy ${label}`}
                >
                    {copied === label ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
            )}
        </div>
        <div className="pl-1 flex-1">
            <p className={`text-base font-semibold text-gray-900 dark:text-white whitespace-pre-wrap ${!value ? "italic text-gray-400" : ""}`}>
                {value || "Not specified"}
            </p>
        </div>
    </motion.div>
);
