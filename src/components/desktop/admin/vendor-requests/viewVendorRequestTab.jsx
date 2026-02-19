"use client";

import { useState, useContext, createContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  Clock,
  Users,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Tag,
  Globe,
  X,
  Copy,
  Sparkles,
  Heart,
  Building2,
  ArrowLeft,
  Info,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  CalendarDays,
  UserCheck,
  UserX,
  MessageCircle,
  Briefcase,
  Star,
  TrendingUp,
  Camera,
  Link,
  Facebook,
  Instagram,
  Linkedin,
  UserCheck2,
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
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-sm flex items-start gap-3 ${
                toast.type === "success"
                  ? "bg-green-50/95 dark:bg-green-900/95 border-green-300 dark:border-green-600 text-green-800 dark:text-green-100"
                  : toast.type === "error"
                    ? "bg-red-50/95 dark:bg-red-900/95 border-red-300 dark:border-red-600 text-red-800 dark:text-red-100"
                    : toast.type === "warning"
                      ? "bg-yellow-50/95 dark:bg-yellow-900/95 border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-100"
                      : "bg-blue-50/95 dark:bg-blue-900/95 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-100"
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  toast.type === "success"
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
// CONFIGURATION
// ============================================================================
const categoryIcons = {
  "Event Planner": Sparkles,
  Venue: Building2,
  Photographer: Camera,
  Decorator: Heart,
  Caterer: Users,
  "Makeup Artist": Sparkles,
  "DJ/Music": Users,
  "Mehendi Artist": Heart,
  Cake: Heart,
  Pandit: User,
};

const categoryColors = {
  "Event Planner": "from-pink-500 to-rose-500",
  Venue: "from-blue-500 to-cyan-500",
  Photographer: "from-purple-500 to-violet-500",
  Decorator: "from-amber-500 to-orange-500",
  Caterer: "from-green-500 to-emerald-500",
  "Makeup Artist": "from-pink-500 to-rose-500",
  "DJ/Music": "from-indigo-500 to-blue-500",
  "Mehendi Artist": "from-orange-500 to-red-500",
  Cake: "from-pink-500 to-purple-500",
  Pandit: "from-yellow-500 to-orange-500",
};

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300", icon: Clock },
  approved: { color: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300", icon: CheckCircle },
  rejected: { color: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300", icon: XCircle },
  under_review: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300", icon: UserCheck2 },
  contacted: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300", icon: MessageCircle },
};

// ============================================================================
// DELETE CONFIRMATION MODAL
// ============================================================================
const DeleteConfirmModal = ({ request, requestType = "vendor", onClose, onConfirm }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (!password) {
      setError("Please enter admin password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let endpoint = `/api/vendor/requests?id=${request._id}&password=${encodeURIComponent(password)}`;

      if (requestType === "birthday") {
        endpoint = `/api/vendor/requests/birthday-routes?id=${request._id}&password=${encodeURIComponent(password)}`;
      } else if (requestType === "booking") {
        endpoint = `/api/vendor/requests/detail-booking?id=${request._id}&password=${encodeURIComponent(password)}`;
      } else if (requestType === "leads") {
        endpoint = `/api/leads?id=${request._id}&password=${encodeURIComponent(password)}`;
      }

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete vendor request");
      }

      addToast("Vendor request deleted successfully", "success");
      onConfirm();
    } catch (err) {
      setError(err.message);
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
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
                <h2 className="text-xl font-bold">Delete Vendor Request</h2>
                <p className="text-white/80 text-sm mt-0.5">This action cannot be undone</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                <ShieldCheck size={12} />
                Admin Verification Required
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              {requestType === "vendor" && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Business:</strong> {request.businessName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Owner:</strong> {request.ownerName}
                  </p>
                </>
              )}
              {requestType === "birthday" && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Name:</strong> {request.userDetails?.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Venue:</strong> {request.venueName}
                  </p>
                </>
              )}
              {requestType === "booking" && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Name:</strong> {request.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Email:</strong> {request.email}
                  </p>
                </>
              )}
              {requestType === "leads" && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Name:</strong> {request.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Contact:</strong> {request.phone}
                  </p>
                </>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>ID:</strong> {request._id?.slice(-8).toUpperCase()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Admin Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter admin password"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border-2 outline-none transition-all bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
                    error
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                      : "border-gray-200 dark:border-gray-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                  }`}
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && password) {
                      handleDelete();
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
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm mt-2 flex items-center gap-1.5"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading || !password.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Request
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ViewVendorRequestTab({ request, requestType = "vendor", onBack, onEdit, onDelete }) {
  return (
    <ToastProvider>
      <ViewVendorRequestContent
        request={request}
        requestType={requestType}
        onBack={onBack}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </ToastProvider>
  );
}

// ============================================================================
// MAIN CONTENT COMPONENT
// ============================================================================
function ViewVendorRequestContent({
  request,
  requestType,
  isEditMode = false,
  onBack,
  onSwitchToEdit,
  onSwitchToView,
  onEditSuccess,
  onDelete,
  onEdit,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const { addToast } = useToast();

  if (!request) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin text-purple-500 mx-auto mb-3" size={32} />
          <p className="text-gray-500 dark:text-gray-400">Loading vendor request data...</p>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[request.category] || Briefcase;
  const statusInfo = statusConfig[request.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;
  const gradientColor = categoryColors[request.category] || "from-indigo-500 to-purple-500";

  // Helper to get display values based on request type
  const getDisplayValues = () => {
    if (requestType === "birthday") {
      return {
        title: request.userDetails?.name || "Birthday Request",
        subtitle: `Booking ID: ${request.bookingId}`,
        category: "Birthday Party",
        icon: CalendarDays,
      };
    }
    if (requestType === "booking") {
      return {
        title: request.name || "Booking Request",
        subtitle: request.email,
        category: request.eventType || "General Booking",
        icon: Calendar,
      };
    }
    if (requestType === "leads") {
      return {
        title: request.name || "Lead",
        subtitle: request.phone,
        category: request.source || "General Lead",
        icon: User,
      };
    }
    if (requestType === "planning-tools") {
      return {
        title: request.name || "Event",
        subtitle: request.venue || "No Venue Selected",
        category: request.category || "Event",
        icon: CalendarDays,
      };
    }
    return {
      title: request.businessName,
      subtitle: `${request.ownerName} • ${request.city}`,
      category: request.category,
      icon: CategoryIcon,
    };
  };

  const { title, subtitle, category: displayCategory, icon: DisplayIcon } = getDisplayValues();

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
      weekday: "long",
    });
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
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                <div className="flex items-end gap-4 min-w-0 flex-1">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-2xl flex items-center justify-center flex-shrink-0">
                    <DisplayIcon size={36} className="text-white" />
                  </div>
                  <div className="flex-1 text-white min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>

                    <div className="mb-3">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color} backdrop-blur-sm border border-white/10`}
                      >
                        <StatusIcon size={14} />
                        {request.status
                          ?.split("_")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ") || "Pending"}
                      </motion.span>
                    </div>

                    <p className="text-white/90 text-lg font-medium mb-3">{subtitle}</p>

                    <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Tag size={15} />
                        ID: {request._id?.slice(-8).toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building2 size={15} />
                        {displayCategory}
                      </span>
                      {requestType === "vendor" && (
                        <span className="flex items-center gap-1.5">
                          <TrendingUp size={15} />
                          {request.experience} years exp
                        </span>
                      )}
                      {requestType !== "vendor" && requestType !== "planning-tools" && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={15} />
                          {formatDate(request.eventDate || request.createdAt)}
                        </span>
                      )}
                      {requestType === "planning-tools" && (
                        <>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={15} />
                            {formatDate(request.date)}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Users size={15} />
                            {request.guestCount || 0} Guests
                          </span>

                          <span className="flex items-center gap-1.5">
                            <DollarSign size={15} />₹{request.budget?.toLocaleString() || 0}
                          </span>
                        </>
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

                  {!isEditMode ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onSwitchToEdit}
                      className="px-4 py-2.5 bg-white text-gray-900 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all shadow-lg"
                    >
                      <Edit size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onSwitchToView}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all border border-white/20 backdrop-blur-sm"
                      >
                        <Eye size={16} />
                        <span className="hidden sm:inline">Cancel</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          // Add save logic here
                          onEditSuccess();
                        }}
                        className="px-4 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg"
                      >
                        <CheckCircle size={16} />
                        <span className="hidden sm:inline">Save</span>
                      </motion.button>
                    </>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-600 transition-all shadow-lg"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* CONTENT SECTIONS */}
          {/* ================================================================ */}
          <div className="p-4 md:p-6 lg:p-8 space-y-8">
            {/* Business/Event Details Section */}
            <Section
              title={requestType === "vendor" ? "Business Details" : "Request Details"}
              icon={Briefcase}
              badge="Primary Info"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {requestType === "vendor" && (
                  <>
                    <InfoCard
                      icon={Building2}
                      label="Business Name"
                      value={request.businessName}
                      className="lg:col-span-2"
                      highlight
                    />
                    <InfoCard icon={User} label="Owner Name" value={request.ownerName} />
                    <InfoCard icon={Tag} label="Category" value={request.category} />
                    <InfoCard icon={TrendingUp} label="Experience" value={`${request.experience} years`} />
                    {request.teamSize && <InfoCard icon={Users} label="Team Size" value={request.teamSize} />}
                    {request.description && (
                      <InfoCard
                        icon={FileText}
                        label="Business Description"
                        value={request.description}
                        className="lg:col-span-full"
                      />
                    )}
                  </>
                )}

                {requestType === "birthday" && (
                  <>
                    <InfoCard icon={User} label="Name" value={request.userDetails?.name} />
                    <InfoCard icon={Phone} label="Phone" value={request.userDetails?.phone} />
                    <InfoCard
                      icon={Calendar}
                      label="Birthday Date"
                      value={formatDate(request.userDetails?.birthdayDate)}
                    />
                    <InfoCard
                      icon={Building2}
                      label="Venue"
                      value={request.venueName}
                      className="lg:col-span-2"
                      highlight
                    />
                    {request.venueLocation && <InfoCard icon={MapPin} label="Location" value={request.venueLocation} />}
                    {request.venuePrice && (
                      <InfoCard icon={DollarSign} label="Venue Price" value={`₹${request.venuePrice}`} />
                    )}
                    <InfoCard
                      icon={Calendar}
                      label="Event Date"
                      value={formatDate(request.bookingDetails?.eventDate || request.createdAt)}
                    />
                    <InfoCard icon={Users} label="Guests" value={request.bookingDetails?.guestCount} />
                    {request.bookingDetails?.budget && (
                      <InfoCard icon={DollarSign} label="Budget" value={`₹${request.bookingDetails.budget}`} />
                    )}
                    <InfoCard icon={Tag} label="Food Type" value={request.bookingDetails?.foodType} />
                    {request.bookingDetails?.timeSlot && (
                      <InfoCard icon={Clock} label="Time Slot" value={request.bookingDetails.timeSlot} />
                    )}
                    {request.bookingDetails?.specialRequests && (
                      <InfoCard
                        icon={MessageCircle}
                        label="Special Requests"
                        value={request.bookingDetails.specialRequests}
                        className="lg:col-span-full"
                      />
                    )}
                  </>
                )}

                {requestType === "booking" && (
                  <>
                    <InfoCard icon={User} label="Name" value={request.name} highlight />
                    <InfoCard icon={Mail} label="Email" value={request.email} />
                    <InfoCard icon={Phone} label="Phone" value={request.phone} />
                    <InfoCard icon={Sparkles} label="Event Type" value={request.eventType} />
                    <InfoCard icon={Calendar} label="Event Date" value={formatDate(request.date)} />
                    {request.guests && <InfoCard icon={Users} label="Guest Count" value={request.guests} />}
                    {request.budget && <InfoCard icon={DollarSign} label="Budget" value={`₹${request.budget}`} />}
                    {request.timeSlot && <InfoCard icon={Clock} label="Time Slot" value={request.timeSlot} />}
                    {request.notes && (
                      <InfoCard icon={FileText} label="Notes" value={request.notes} className="lg:col-span-full" />
                    )}
                  </>
                )}

                {requestType === "leads" && (
                  <>
                    <InfoCard icon={User} label="Name" value={request.name} highlight />
                    <InfoCard icon={Phone} label="Contact" value={request.phone} />
                    <InfoCard icon={Globe} label="Source" value={request.source} />
                    {request.message && (
                      <InfoCard
                        icon={MessageCircle}
                        label="Message"
                        value={request.message}
                        className="lg:col-span-full"
                      />
                    )}
                  </>
                )}

                {requestType === "planning-tools" && (
                  <>
                    <InfoCard icon={Calendar} label="Event Date" value={formatDate(request.date)} />
                    <InfoCard icon={Clock} label="Time" value={request.time} />
                    <InfoCard icon={Building2} label="Venue" value={request.venue} highlight />
                    <InfoCard icon={Users} label="Guest Count" value={request.guestCount} />
                    <InfoCard icon={DollarSign} label="Total Budget" value={`₹${request.budget?.toLocaleString()}`} />
                    <InfoCard icon={Tag} label="Category" value={request.category} />
                    <InfoCard icon={Globe} label="Public Event" value={request.isPublic ? "Yes" : "No"} />
                    <InfoCard icon={KeyRound} label="Share Code" value={request.shareCode} />
                    {request.description && (
                      <InfoCard
                        icon={FileText}
                        label="Description"
                        value={request.description}
                        className="lg:col-span-full"
                      />
                    )}
                  </>
                )}
              </div>
            </Section>

            {/* Contact Information Section - Only for Vendor as others are covered above */}
            {requestType === "vendor" && (
              <Section title="Contact Information" icon={User} badge="Contact Details">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <InfoCard
                    icon={Mail}
                    label="Email"
                    value={request.email}
                    copyable
                    onCopy={copyToClipboard}
                    copied={copiedField}
                  />
                  <InfoCard
                    icon={Phone}
                    label="Phone"
                    value={request.phone}
                    copyable
                    onCopy={copyToClipboard}
                    copied={copiedField}
                  />
                  <InfoCard icon={MapPin} label="City" value={request.city} />
                  {request.state && <InfoCard icon={MapPin} label="State" value={request.state} />}
                  {request.pincode && <InfoCard icon={MapPin} label="Pincode" value={request.pincode} />}
                  {request.address && (
                    <InfoCard
                      icon={MapPin}
                      label="Full Address"
                      value={request.address}
                      className="lg:col-span-2 xl:col-span-3"
                    />
                  )}
                </div>
              </Section>
            )}

            {/* Services & Portfolio - Only for Vendor */}
            {requestType === "vendor" && (request.services?.length > 0 || request.portfolioImages?.length > 0) && (
              <Section title="Services & Portfolio" icon={Star} badge="Business Offerings">
                <div className="space-y-6">
                  {/* Services */}
                  {request.services?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Briefcase size={20} />
                        Services Offered
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {request.services.map((service, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                          >
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{service.name}</h5>
                            <div className="space-y-1">
                              {service.price && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <strong>Price:</strong> ₹{service.price}
                                </p>
                              )}
                              {service.duration && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <strong>Duration:</strong> {service.duration}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Portfolio Images */}
                  {request.portfolioImages?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Camera size={20} />
                        Portfolio Images
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {request.portfolioImages.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden"
                          >
                            <img
                              src={image}
                              alt={`Portfolio ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = "/placeholder-image.jpg";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Social & Legal Information - Only for Vendor */}
            {requestType === "vendor" && (
              <Section title="Social & Legal Information" icon={Globe} badge="External Links">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {request.website && (
                    <InfoCard
                      icon={Link}
                      label="Website"
                      value={request.website}
                      copyable
                      onCopy={copyToClipboard}
                      copied={copiedField}
                    />
                  )}
                  {request.instagram && (
                    <InfoCard
                      icon={Instagram}
                      label="Instagram"
                      value={request.instagram}
                      copyable
                      onCopy={copyToClipboard}
                      copied={copiedField}
                    />
                  )}
                  {request.facebook && (
                    <InfoCard
                      icon={Facebook}
                      label="Facebook"
                      value={request.facebook}
                      copyable
                      onCopy={copyToClipboard}
                      copied={copiedField}
                    />
                  )}
                  {request.linkedin && (
                    <InfoCard
                      icon={Linkedin}
                      label="LinkedIn"
                      value={request.linkedin}
                      copyable
                      onCopy={copyToClipboard}
                      copied={copiedField}
                    />
                  )}
                  {request.gstNumber && (
                    <InfoCard
                      icon={FileText}
                      label="GST Number"
                      value={request.gstNumber}
                      copyable
                      onCopy={copyToClipboard}
                      copied={copiedField}
                    />
                  )}
                  {request.panNumber && (
                    <InfoCard
                      icon={FileText}
                      label="PAN Number"
                      value={request.panNumber}
                      copyable
                      onCopy={copyToClipboard}
                      copied={copiedField}
                    />
                  )}
                </div>
              </Section>
            )}

            {/* Registration/Request Status Details */}
            <Section
              title={
                requestType === "vendor"
                  ? "Registration Details"
                  : requestType === "planning-tools"
                    ? "Event Status"
                    : "Status & History"
              }
              icon={UserCheck}
              badge="Request Info"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {requestType === "vendor" && (
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl text-center border-2 border-green-200 dark:border-green-800 shadow-sm">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <UserCheck className="text-white" size={32} />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {request.registrationType === "quick" ? "Quick" : "Full"}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Registration Type</p>
                  </div>
                )}

                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl text-center border-2 border-blue-200 dark:border-blue-800 shadow-sm">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <StatusIcon className="text-white" size={32} />
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {request.status
                      ?.split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ") || "Pending"}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Current Status</p>
                </div>

                <InfoCard
                  icon={Calendar}
                  label="Submitted"
                  value={formatDate(request.submittedAt || request.createdAt)}
                  className="md:col-span-2"
                />

                {request.reviewedAt && (
                  <InfoCard
                    icon={Calendar}
                    label="Reviewed"
                    value={formatDate(request.reviewedAt)}
                    className="md:col-span-2"
                  />
                )}

                {request.reviewedBy && (
                  <InfoCard icon={User} label="Reviewed By" value={request.reviewedBy} className="md:col-span-2" />
                )}
              </div>
            </Section>

            {/* Admin Notes */}
            {request.adminNotes && (
              <Section title="Admin Notes" icon={FileText} badge="Internal Notes">
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-yellow-200 dark:bg-yellow-600 rounded-lg flex-shrink-0">
                      <FileText size={20} className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {request.adminNotes}
                      </p>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* System Info - Generic */}
            <Section title="System Information" icon={Info} badge="Metadata">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard icon={Calendar} label="Created" value={formatDate(request.createdAt)} />
                <InfoCard icon={Calendar} label="Last Updated" value={formatDate(request.updatedAt)} />
                <InfoCard
                  icon={Tag}
                  label="Request ID"
                  value={request._id?.slice(-8).toUpperCase() || "N/A"}
                  copyable
                  onCopy={copyToClipboard}
                  copied={copiedField}
                />
                {requestType === "vendor" && (
                  <InfoCard
                    icon={Globe}
                    label="Registration Source"
                    value={request.registrationType === "quick" ? "Quick Form" : "Full Form"}
                  />
                )}
              </div>
            </Section>

            {/* Quick Actions */}
            <Section title="Quick Actions" icon={Sparkles} badge="Actions">
              <div className="flex flex-wrap gap-4 p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copyToClipboard(JSON.stringify(request, null, 2), "Request Data")}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all"
                >
                  <Copy size={18} />
                  Copy Request Data
                </motion.button>

                {request.email && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      let subject, body;

                      if (requestType === "vendor") {
                        subject = `Regarding your vendor registration request - ${request.businessName}`;
                        body = `Hello ${request.ownerName},\n\nThank you for your interest in partnering with us through PlanWAB.\n\nBusiness Details:\n- Business Name: ${request.businessName}\n- Category: ${request.category}\n- Location: ${request.city}\n- Experience: ${request.experience} years\n\nWe'll review your application and get back to you soon.\n\nBest regards,\nPlanWAB Partnership Team`;
                      } else {
                        // Generic fallback for other types
                        const name = request.userDetails?.name || request.fullName || request.name || "Customer";
                        const eventType = request.eventType || request.venueName || "Event";
                        subject = `Regarding your request - ${name}`;
                        body = `Hello ${name},\n\nThank you for your interest in PlanWAB.\n\nRequest Details:\n- Type: ${requestType.charAt(0).toUpperCase() + requestType.slice(1)}\n- Reference: ${eventType}\n\nWe'll review your request and get back to you soon.\n\nBest regards,\nPlanWAB Team`;
                      }

                      window.location.href = `mailto:${request.email}?subject=${encodeURIComponent(
                        subject,
                      )}&body=${encodeURIComponent(body)}`;
                    }}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all"
                  >
                    <Mail size={18} />
                    Send Email
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all"
                >
                  <Trash2 size={18} />
                  Delete Request
                </motion.button>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================================================== */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirmModal
            request={request}
            requestType={requestType}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => {
              onDelete(request);
              setShowDeleteConfirm(false);
            }}
          />
        )}
      </AnimatePresence>

      <GlobalStyles />
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
        <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl shadow-sm">
          <Icon size={24} className="text-purple-600 dark:text-purple-400" />
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
          className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-bold rounded-xl border border-purple-200 dark:border-purple-700 flex-shrink-0 shadow-sm"
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
    className={`group p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 ${className} ${
      highlight ? "ring-2 ring-purple-500 ring-opacity-50" : ""
    }`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
          <Icon
            size={18}
            className="text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
          />
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
            {label}
          </span>
        </div>
      </div>
      {copyable && value && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onCopy(value, label)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Copy to clipboard"
        >
          {copied === label ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <CheckCircle size={16} className="text-green-500" />
            </motion.div>
          ) : (
            <Copy size={16} className="text-gray-400 hover:text-purple-500" />
          )}
        </motion.button>
      )}
    </div>
    <p className="text-lg font-bold text-gray-900 dark:text-white break-words leading-relaxed group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors">
      {value || "N/A"}
    </p>
  </motion.div>
);

// ============================================================================
// GLOBAL STYLES
// ============================================================================
const GlobalStyles = () => (
  <style jsx global>{`
    * {
      min-width: 0;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* Custom gradient animations */
    @keyframes gradient-x {
      0%,
      100% {
        background-size: 200% 200%;
        background-position: left center;
      }
      50% {
        background-size: 200% 200%;
        background-position: right center;
      }
    }

    .animate-gradient-x {
      animation: gradient-x 3s ease infinite;
    }

    /* Smooth transitions for dark mode */
    * {
      transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }
  `}</style>
);
