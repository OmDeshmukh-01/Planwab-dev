"use client";

import { useState, useContext, createContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    User,
    Heart,
    Building,
    ArrowLeft,
    Info,
    ShieldCheck,
    CheckCircle,
    AlertCircle,
    X,
    Copy,
    Sparkles,
    RefreshCw,
    PartyPopper,
    Image as ImageIcon,
    Video,
    ThumbsUp,
    Tag
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
export default function ViewVendorProfileTab({ profile, onBack }) {
    return (
        <ToastProvider>
            <ViewVendorProfileContent profile={profile} onBack={onBack} />
        </ToastProvider>
    );
}

// ============================================================================
// MAIN CONTENT COMPONENT
// ============================================================================
function ViewVendorProfileContent({ profile, onBack }) {
    const [copiedField, setCopiedField] = useState(null);
    const { addToast } = useToast();

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw className="animate-spin text-indigo-500 mx-auto mb-3" size={32} />
                    <p className="text-gray-500 dark:text-gray-400">Loading profile data...</p>
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

    const gradientColor = "from-indigo-500 to-purple-600";

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
                        {profile.vendorCoverImage && (
                            <div
                                className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-50"
                                style={{ backgroundImage: `url(${profile.vendorCoverImage.startsWith('http') || profile.vendorCoverImage.startsWith('/') ? profile.vendorCoverImage : '/' + profile.vendorCoverImage})` }}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                                <div className="flex items-end gap-4 min-w-0 flex-1">
                                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {profile.vendorAvatar ? (
                                            <img
                                                src={(profile.vendorAvatar.startsWith('http') || profile.vendorAvatar.startsWith('/')) ? profile.vendorAvatar : `/${profile.vendorAvatar}`}
                                                alt={profile.vendorBusinessName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Building size={36} className="text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-white min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h1 className="text-2xl md:text-3xl font-bold truncate">
                                                {profile.vendorBusinessName}
                                            </h1>
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 bg-indigo-500/30 border border-indigo-300/30 backdrop-blur-sm"
                                            >
                                                <Tag size={14} />
                                                {profile.category}
                                            </motion.span>
                                        </div>
                                        <p className="text-white/90 text-lg font-medium mb-1 truncate">
                                            @{profile.username}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm mt-3">
                                            {profile.location?.city && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    {profile.location.city}{profile.location.state ? `, ${profile.location.state}` : ''}
                                                </span>
                                            )}
                                            {(profile.trust !== undefined && profile.trust !== 0) && (
                                                <span className="flex items-center gap-1 text-green-300">
                                                    <ShieldCheck size={14} />
                                                    Trust Score: {profile.trust}
                                                </span>
                                            )}
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

                        {/* Bio Section */}
                        {profile.bio && (
                            <Section title="About Business" icon={Info} badge="Bio">
                                <div
                                    className="p-5 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-gray-800 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/30 shadow-sm leading-relaxed text-gray-700 dark:text-gray-300 prose prose-sm max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: profile.bio }}
                                />
                            </Section>
                        )}

                        {/* Profile Details Section */}
                        <Section title="Profile Details" icon={User} badge="Primary Info">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <InfoCard icon={User} label="Owner Name" value={profile.vendorName || "N/A"} />
                                <InfoCard
                                    icon={Tag}
                                    label="Username"
                                    value={profile.username}
                                    copyable
                                    onCopy={copyToClipboard}
                                    copied={copiedField}
                                />
                                <InfoCard
                                    icon={MapPin}
                                    label="City"
                                    value={profile.location?.city || "N/A"}
                                />
                                {profile.location?.address && (
                                    <InfoCard
                                        icon={Building}
                                        label="Full Address"
                                        value={`${profile.location.address}${profile.location.zipCode ? ` - ${profile.location.zipCode}` : ''}`}
                                        className="lg:col-span-3"
                                    />
                                )}
                            </div>
                        </Section>

                        {/* Engagement & Content Stats */}
                        <Section title="Engagement & Content" icon={Sparkles} badge="Stats">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl text-center border border-pink-100 dark:border-pink-800 shadow-sm">
                                    <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                                        <Heart className="text-white" size={24} />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {profile.likes?.length || 0}
                                    </p>
                                    <p className="text-xs text-pink-600 dark:text-pink-400 font-medium uppercase tracking-wider">Total Likes</p>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl text-center border border-blue-100 dark:border-blue-800 shadow-sm">
                                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                                        <ImageIcon className="text-white" size={24} />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {profile.posts?.length || 0}
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">Posts</p>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl text-center border border-purple-100 dark:border-purple-800 shadow-sm">
                                    <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                                        <Video className="text-white" size={24} />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {profile.reels?.length || 0}
                                    </p>
                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wider">Reels</p>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl text-center border border-emerald-100 dark:border-emerald-800 shadow-sm">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                                        <ThumbsUp className="text-white" size={24} />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {profile.trustedBy?.length || 0}
                                    </p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Trusted By</p>
                                </div>
                            </div>
                        </Section>

                        {/* System Information */}
                        <Section title="System Information" icon={Info} badge="Metadata">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <InfoCard
                                    icon={Info}
                                    label="Profile Created"
                                    value={profile.createdAt ? formatDate(profile.createdAt) : "N/A"}
                                />
                                <InfoCard
                                    icon={Info}
                                    label="Last Updated"
                                    value={profile.updatedAt ? formatDate(profile.updatedAt) : "N/A"}
                                />
                                <InfoCard
                                    icon={Tag}
                                    label="Vendor ID"
                                    value={profile.vendorId || profile._id?.slice(-8).toUpperCase() || "N/A"}
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
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl shadow-sm">
                    <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
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
                    className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-xl border border-indigo-200 dark:border-indigo-700 flex-shrink-0 shadow-sm"
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
        className={`group p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 ${className} ${highlight ? "ring-2 ring-indigo-500 ring-opacity-50" : ""
            }`}
    >
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                    <Icon size={18} className="text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
            </div>
            {copyable && (
                <button
                    onClick={() => onCopy(value, label)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title={`Copy ${label}`}
                >
                    {copied === label ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
            )}
        </div>
        <div className="pl-1">
            <p className={`text-base font-semibold text-gray-900 dark:text-white ${!value ? "italic text-gray-400" : ""}`}>
                {value || "Not specified"}
            </p>
        </div>
    </motion.div>
);
