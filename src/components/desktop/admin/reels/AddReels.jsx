"use client";

// ============================================================================
// IMPORTS
// ============================================================================
import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Video,
  FileText,
  Tag,
  Globe,
  Star,
  Layers,
  HelpCircle,
  Trash2,
  Plus,
  X,
  Check,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  Undo2,
  ZoomIn,
  Info,
  Lightbulb,
  Bell,
  Zap,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Rocket,
  MousePointer,
  Layout,
  PenTool,
  Lock,
  EyeOff,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Film,
  Heart,
  Share2,
  Bookmark,
  Music,
  Camera,
  Building2,
  Paintbrush2,
  UserCheck,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Scissors,
  Lamp,
  Drum,
  MicVocal,
  FlameKindling,
  Sparkles,
  Mail,
  Hash,
  Link,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  BarChart3,
  Target,
  Save,
  Settings,
  Play,
  Volume2,
  Maximize,
  Flag,
  Archive,
  MessageCircle,
  AtSign,
  UserCircle,
  Navigation,
  ExternalLink,
  Search,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";

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
                {toast.type === "warning" && <AlertTriangle size={18} />}
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
// AUTO-SAVE CONSTANTS & MANAGER
// ============================================================================
const AUTOSAVE_KEY = "planwab_reel_autosave";
const AUTOSAVE_DEBOUNCE_MS = 2000;

const AutoSaveManager = {
  save: (data, isUserChange = false) => {
    if (!isUserChange) return;
    try {
      const saveData = {
        formData: data.formData,
        timestamp: Date.now(),
        version: "1.0",
        hasUserChanges: true,
      };
      const meaningful = Object.keys(saveData.formData).filter((k) => {
        const v = saveData.formData[k];
        if (v === null || v === undefined || v === "") return false;
        if (Array.isArray(v) && v.length === 0) return false;
        return true;
      });
      if (meaningful.length < 2) return;
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
      console.error("Auto-save failed:", e);
    }
  },
  load: () => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (!saved) return null;
      const data = JSON.parse(saved);
      const age = Date.now() - data.timestamp;
      if (age > 7 * 24 * 60 * 60 * 1000) {
        AutoSaveManager.clear();
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
    } catch {}
  },
  exists: () => !!localStorage.getItem(AUTOSAVE_KEY),
};

// ============================================================================
// MAIN EXPORT
// ============================================================================
export default function AddReel({ onSuccess }) {
  return (
    <ToastProvider>
      <AddReelContent onSuccess={onSuccess} />
    </ToastProvider>
  );
}

// ============================================================================
// ADMIN PASSWORD MODAL
// ============================================================================
const AdminPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      const t = setTimeout(() => {
        setPassword("");
        setError("");
        setShowPassword(false);
        setIsVerifying(false);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the admin password");
      return;
    }
    setIsVerifying(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 300));
      await onSuccess(password);
    } catch (err) {
      setError(err.message || "Verification failed");
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

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
          <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Admin Verification</h2>
                <p className="text-white/80 text-sm mt-0.5">Secure access required</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                <Lock size={12} />
                Authentication Required
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Admin Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
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
                      : "border-gray-200 dark:border-gray-600 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20"
                  }`}
                  disabled={isVerifying}
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
                disabled={isVerifying}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying || !password.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-bold hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Verify & Publish
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Contact your system administrator if you've forgotten the password
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// AUTO-SAVE RECOVERY MODAL
// ============================================================================
const AutoSaveRecoveryModal = ({ isOpen, onRestore, onDiscard, savedData }) => {
  if (!isOpen) return null;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <RefreshCw size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Unsaved Reel Found!</h2>
                <p className="text-white/80 text-sm mt-0.5">We found your previous session data</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="bg-rose-50 dark:bg-rose-900/30 rounded-xl p-4 border border-rose-200 dark:border-rose-700">
              <div className="flex items-start gap-3">
                <Info size={20} className="text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-rose-900 dark:text-rose-100 font-medium mb-1">
                    Auto-saved reel session detected
                  </p>
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    Last saved: {formatDate(savedData?.timestamp)}
                  </p>
                  {savedData?.formData?.title && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                      Reel: <span className="font-semibold">{savedData.formData.title}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Category</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {savedData?.formData?.category || "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Form Fields</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Object.keys(savedData?.formData || {}).filter((k) => savedData?.formData[k]).length} filled
                </span>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-700">
              <p className="text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                <span>
                  Choose "Use Saved Data" to continue where you left off, or "Start Fresh" to begin a new reel.
                </span>
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onDiscard}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Start Fresh
              </button>
              <button
                type="button"
                onClick={onRestore}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-bold hover:from-rose-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25"
              >
                <CheckCircle size={18} />
                Use Saved Data
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Auto-save helps you never lose your work
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// WELCOME SECTION
// ============================================================================
const WelcomeSection = ({ isVisible, onClose }) => {
  const [expandedTip, setExpandedTip] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tips = [
    {
      id: 1,
      icon: FileText,
      title: "Required Fields",
      shortDesc: "Fill in essential reel details",
      fullDesc:
        "Complete all fields marked with a red asterisk (*) including title, vendor link, video URL, category, and thumbnail. These are mandatory for publishing.",
      color: "from-rose-500 to-pink-500",
    },
    {
      id: 2,
      icon: Hash,
      title: "Tags & Hashtags",
      shortDesc: "Improve discoverability",
      fullDesc:
        "Add relevant tags and hashtags to help users find your reel. Type and press Enter to add custom tags. Use trending wedding/event hashtags for maximum reach.",
      color: "from-violet-500 to-purple-500",
    },
    {
      id: 3,
      icon: Film,
      title: "Video Upload",
      shortDesc: "Upload quality video content",
      fullDesc:
        "Upload your reel video file directly or provide a video URL. Supported formats: MP4, MOV, WEBM. Max file size 100MB. Landscape or portrait formats accepted.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: 4,
      icon: Rocket,
      title: "Quick Publish",
      shortDesc: "Publish when ready indicator shows",
      fullDesc:
        "Once all required fields are complete, the 'Ready' badge appears. Admin password is required to publish. You'll be redirected after successful submission.",
      color: "from-emerald-500 to-green-500",
    },
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, height: 0 }}
      className="mb-6 rounded-2xl overflow-hidden border border-rose-200 dark:border-rose-800 shadow-xl"
    >
      <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 relative">
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]" />
        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Film size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome to Reel Upload</h2>
                <p className="text-white/80 mt-1">Share stunning vendor reels in minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
                <X size={20} />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {tips.map((tip) => (
                    <motion.div
                      key={tip.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all border border-white/20 ${
                        expandedTip === tip.id ? "ring-2 ring-white/50" : ""
                      }`}
                      onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${tip.color}`}>
                          <tip.icon size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white text-sm">{tip.title}</h3>
                            <ChevronDown
                              size={14}
                              className={`text-white/60 transition-transform ${
                                expandedTip === tip.id ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <p className="text-white/70 text-xs mt-1">{tip.shortDesc}</p>
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedTip === tip.id && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-white/80 text-xs mt-3 pt-3 border-t border-white/20 leading-relaxed"
                          >
                            {tip.fullDesc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <MousePointer size={14} />
                      <span>Click any tip to expand</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <BookOpen size={14} />
                      <span>5 sections to complete</span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                  >
                    Got it, let's start!
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export const CustomDropdown = ({
  label,
  placeholder,
  options = [],
  value,
  onChange,
  error,
  disabled = false,
  icon: Icon,
  required = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {label && (
  <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-slate-500 dark:text-slate-400">
    {label} <span className="text-red-500">*</span>
  </label>
)}

      {/* Trigger Button */}
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen((prev) => !prev);
            setSearch("");
          }
        }}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={`
          w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border
          text-sm font-medium transition-all duration-200 text-left
          ${
            disabled
              ? `
                  bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed
                  dark:bg-white/3 dark:border-white/5 dark:text-gray-600
                `
              : open
              ? `
                  bg-white border-violet-500 text-slate-900 shadow-lg shadow-violet-500/10
                  dark:bg-white/10 dark:border-purple-500/60 dark:text-white dark:shadow-purple-500/10
                `
              : selected
              ? `
                  bg-white border-slate-300 text-slate-900 hover:border-slate-400
                  dark:bg-white/8 dark:border-white/15 dark:text-white dark:hover:border-white/25
                `
              : `
                  bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50
                  dark:bg-white/5 dark:border-white/10 dark:text-gray-500 dark:hover:border-white/20 dark:hover:bg-white/7
                `
          }
        `}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <Icon
              size={15}
              className={
                disabled
                  ? "text-slate-300 dark:text-gray-600"
                  : "text-violet-500 dark:text-purple-400"
              }
            />
          )}
          {selected ? (
            <span className="truncate text-slate-900 dark:text-white flex items-center gap-1.5">
              {selected.icon && (
                <span className="text-base leading-none">{selected.icon}</span>
              )}
              {selected.label}
            </span>
          ) : (
            <span className="truncate text-slate-400 dark:text-gray-500">
              {placeholder}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown
            size={15}
            className={
              disabled
                ? "text-slate-300 dark:text-gray-600"
                : open
                ? "text-violet-500 dark:text-purple-400"
                : "text-slate-400 dark:text-gray-400"
            }
          />
        </motion.div>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="
              absolute z-50 w-full mt-2 rounded-xl overflow-hidden
              border border-slate-200 bg-white shadow-xl shadow-slate-200/80
              dark:border-white/10 dark:bg-[#1a1a2e] dark:shadow-black/50
            "
          >
            {/* Search */}
            {options.length > 6 && (
              <div className="p-2 border-b border-slate-100 dark:border-white/8">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5">
                  <Search
                    size={13}
                    className="text-slate-400 dark:text-gray-500 shrink-0"
                  />
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="
                      bg-transparent text-sm outline-none w-full
                      text-slate-800 placeholder-slate-400
                      dark:text-white dark:placeholder-gray-600
                    "
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-slate-400 hover:text-slate-700 dark:text-gray-500 dark:hover:text-white transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-52 overflow-y-auto custom-scroll py-1.5">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-400 dark:text-gray-600">
                  No results found
                </div>
              ) : (
                filtered.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.1 }}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`
                        w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-left transition-colors
                        ${
                          isSelected
                            ? `
                                bg-violet-50 text-violet-700
                                dark:bg-purple-500/20 dark:text-purple-300
                              `
                            : `
                                text-slate-700 hover:bg-slate-50 hover:text-slate-900
                                dark:text-gray-300 dark:hover:bg-white/6 dark:hover:text-white
                              `
                        }
                      `}
                    >
                      <span className="flex items-center gap-2.5">
                        {option.icon && (
                          <span className="text-base leading-none">
                            {option.icon}
                          </span>
                        )}
                        <span className="font-medium">{option.label}</span>
                      </span>
                      {isSelected && (
                        <Check
                          size={13}
                          className="text-violet-500 dark:text-purple-400 shrink-0"
                        />
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// CATEGORIES CONFIG
// ============================================================================
const REEL_CATEGORIES = [
  { key: "venues", label: "Venues", icon: Building2 },
  { key: "photographers", label: "Photographers", icon: Camera },
  { key: "makeup", label: "Makeup", icon: Paintbrush2 },
  { key: "planners", label: "Planners", icon: UserCheck },
  { key: "catering", label: "Catering", icon: UtensilsCrossed },
  { key: "clothes", label: "Clothes", icon: Shirt },
  { key: "mehendi", label: "Mehendi", icon: Hand },
  { key: "cakes", label: "Cakes", icon: CakeSlice },
  { key: "jewellery", label: "Jewellery", icon: Gem },
  { key: "invitations", label: "Invitations", icon: Mail },
  { key: "djs", label: "DJs", icon: Music },
  { key: "hairstyling", label: "Hairstyling", icon: Scissors },
  { key: "decor", label: "Decorators", icon: Lamp },
  { key: "dhol", label: "Dhol", icon: Drum },
  { key: "anchor", label: "Anchor", icon: MicVocal },
  { key: "stageEntry", label: "Stage Entry", icon: Sparkles },
  { key: "fireworks", label: "Fireworks", icon: FlameKindling },
  { key: "other", label: "Other", icon: FileText },
];

// ============================================================================
// SECTIONS CONFIG
// ============================================================================
const SECTIONS = [
  {
    id: "basic",
    label: "Basic Info",
    icon: Film,
    required: ["title", "category", "type", "subtype", "nestedType"],
    description: "Core reel identity and vendor association",
  },
  {
    id: "media",
    label: "Media",
    icon: Video,
    required: ["videoUrl", "thumbnailUrl"],
    description: "Video file, thumbnail and preview settings",
  },
  {
    id: "details",
    label: "Details",
    icon: FileText,
    required: ["caption"],
    description: "Description, tags, hashtags and metadata",
  },
  {
    id: "engagement",
    label: "Engagement",
    icon: Heart,
    required: [],
    description: "Likes, shares, stats and visibility settings",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    required: [],
    description: "Publishing options and advanced configuration",
  },
];

export const REEL_TYPES = [
  { value: "wedding", label: "Wedding", icon: "💍" },
  { value: "anniversary", label: "Anniversary", icon: "🥂" },
  { value: "birthday", label: "Birthday", icon: "🎂" },
  { value: "corporate", label: "Corporate", icon: "🏢" },
  { value: "engagement", label: "Engagement", icon: "💒" },
  { value: "babyshower", label: "Baby Shower", icon: "🍼" },
  { value: "graduation", label: "Graduation", icon: "🎓" },
  { value: "festival", label: "Festival", icon: "🎉" },
  { value: "religious", label: "Religious", icon: "🕌" },
  { value: "reception", label: "Reception", icon: "🎊" },
  { value: "naming", label: "Naming Ceremony", icon: "👶" },
  { value: "farewell", label: "Farewell", icon: "👋" },
  { value: "other", label: "Other", icon: "✨" },
];

export const REEL_SUBTYPES = {
  wedding: [
    { value: "baraat", label: "Baraat" },
    { value: "shaligiraah", label: "Shaligiraah" },
    { value: "nikah", label: "Nikah" },
    { value: "mehndi", label: "Mehndi" },
    { value: "haldi", label: "Haldi" },
    { value: "sangeet", label: "Sangeet" },
    { value: "pheras", label: "Pheras / Saat Phere" },
    { value: "vidaai", label: "Vidaai" },
    { value: "reception", label: "Reception" },
    { value: "cocktail", label: "Cocktail Party" },
    { value: "ring_ceremony", label: "Ring Ceremony" },
    { value: "tilak", label: "Tilak Ceremony" },
    { value: "jaimala", label: "Jaimala" },
    { value: "wedding_highlight", label: "Full Wedding Highlight" },
    { value: "pre_wedding", label: "Pre-Wedding Shoot" },
    { value: "wedding_teaser", label: "Wedding Teaser" },
  ],
  anniversary: [
    { value: "1st_anniversary", label: "1st Anniversary" },
    { value: "5th_anniversary", label: "5th Anniversary" },
    { value: "10th_anniversary", label: "10th Anniversary" },
    { value: "25th_anniversary", label: "Silver Jubilee (25th)" },
    { value: "50th_anniversary", label: "Golden Jubilee (50th)" },
    { value: "surprise_anniversary", label: "Surprise Anniversary" },
    { value: "anniversary_party", label: "Anniversary Party" },
    { value: "anniversary_shoot", label: "Anniversary Shoot" },
  ],
  birthday: [
    { value: "baby_birthday", label: "Baby Birthday (0–2 yrs)" },
    { value: "kids_birthday", label: "Kids Birthday (3–12 yrs)" },
    { value: "teen_birthday", label: "Teen Birthday (13–19 yrs)" },
    { value: "18th_birthday", label: "18th Birthday" },
    { value: "21st_birthday", label: "21st Birthday" },
    { value: "30th_birthday", label: "30th Birthday" },
    { value: "50th_birthday", label: "50th Birthday" },
    { value: "surprise_birthday", label: "Surprise Party" },
    { value: "birthday_highlight", label: "Birthday Highlight" },
    { value: "theme_birthday", label: "Theme Birthday Party" },
  ],
  corporate: [
    { value: "product_launch", label: "Product Launch" },
    { value: "award_night", label: "Award Night" },
    { value: "conference", label: "Conference / Summit" },
    { value: "seminar", label: "Seminar / Workshop" },
    { value: "team_outing", label: "Team Outing" },
    { value: "annual_day", label: "Annual Day" },
    { value: "brand_event", label: "Brand Event" },
    { value: "office_party", label: "Office Party" },
    { value: "inauguration", label: "Inauguration" },
    { value: "dealer_meet", label: "Dealer Meet" },
    { value: "csr_event", label: "CSR Event" },
    { value: "corporate_shoot", label: "Corporate Shoot" },
  ],
  engagement: [
    { value: "ring_ceremony", label: "Ring Ceremony" },
    { value: "roka", label: "Roka Ceremony" },
    { value: "sagai", label: "Sagai" },
    { value: "engagement_party", label: "Engagement Party" },
    { value: "engagement_shoot", label: "Engagement Shoot" },
    { value: "surprise_proposal", label: "Surprise Proposal" },
  ],
  babyshower: [
    { value: "godh_bharai", label: "Godh Bharai" },
    { value: "baby_shower_party", label: "Baby Shower Party" },
    { value: "gender_reveal", label: "Gender Reveal" },
    { value: "baby_welcome", label: "Baby Welcome" },
  ],
  graduation: [
    { value: "convocation", label: "Convocation Ceremony" },
    { value: "farewell_grad", label: "Farewell + Graduation" },
    { value: "graduation_party", label: "Graduation Party" },
    { value: "graduation_shoot", label: "Graduation Shoot" },
  ],
  festival: [
    { value: "diwali", label: "Diwali" },
    { value: "holi", label: "Holi" },
    { value: "eid", label: "Eid" },
    { value: "navratri", label: "Navratri / Garba" },
    { value: "durga_puja", label: "Durga Puja" },
    { value: "christmas", label: "Christmas" },
    { value: "new_year", label: "New Year" },
    { value: "lohri", label: "Lohri" },
    { value: "baisakhi", label: "Baisakhi" },
    { value: "ganesh_chaturthi", label: "Ganesh Chaturthi" },
    { value: "raksha_bandhan", label: "Raksha Bandhan" },
    { value: "karwa_chauth", label: "Karwa Chauth" },
  ],
  religious: [
    { value: "puja", label: "Puja / Havan" },
    { value: "mundan", label: "Mundan Ceremony" },
    { value: "upanayana", label: "Upanayana / Janeu" },
    { value: "annaprashan", label: "Annaprashan" },
    { value: "namakaran", label: "Namakaran" },
    { value: "griha_pravesh", label: "Griha Pravesh" },
    { value: "mata_ki_chowki", label: "Mata Ki Chowki" },
    { value: "kirtan", label: "Kirtan / Satsang" },
    { value: "church_event", label: "Church Event" },
    { value: "gurudwara_event", label: "Gurudwara Event" },
  ],
  reception: [
    { value: "wedding_reception", label: "Wedding Reception" },
    { value: "cocktail_reception", label: "Cocktail Reception" },
    { value: "ring_reception", label: "Ring Reception" },
    { value: "welcome_reception", label: "Welcome Reception" },
  ],
  naming: [
    { value: "namakaran_ceremony", label: "Namakaran Ceremony" },
    { value: "baptism", label: "Baptism" },
    { value: "aqiqah", label: "Aqiqah" },
    { value: "naming_party", label: "Naming Party" },
  ],
  farewell: [
    { value: "school_farewell", label: "School Farewell" },
    { value: "college_farewell", label: "College Farewell" },
    { value: "office_farewell", label: "Office Farewell" },
    { value: "retirement", label: "Retirement Party" },
    { value: "going_abroad", label: "Going Abroad Send-off" },
  ],
  other: [
    { value: "maternity_shoot", label: "Maternity Shoot" },
    { value: "family_reunion", label: "Family Reunion" },
    { value: "house_warming", label: "House Warming" },
    { value: "charity_event", label: "Charity Event" },
    { value: "sports_event", label: "Sports Event" },
    { value: "fashion_show", label: "Fashion Show" },
    { value: "concert", label: "Concert / Live Show" },
    { value: "music_video", label: "Music Video" },
    { value: "short_film", label: "Short Film" },
    { value: "documentary", label: "Documentary" },
    { value: "custom", label: "Custom / Other" },
  ],
};

export const REEL_NESTED_TYPES = [
  { value: "cinematic", label: "Cinematic" },
  { value: "traditional", label: "Traditional" },
  { value: "documentary", label: "Documentary Style" },
  { value: "aerial", label: "Aerial / Drone" },
  { value: "highlight", label: "Highlight Reel" },
  { value: "teaser", label: "Short Teaser" },
  { value: "full_film", label: "Full Film" },
  { value: "same_day_edit", label: "Same Day Edit (SDE)" },
  { value: "instagram_reel", label: "Instagram Reel" },
  { value: "youtube_film", label: "YouTube Film" },
  { value: "candid", label: "Candid Style" },
  { value: "montage", label: "Montage" },
  { value: "raw_footage", label: "Raw Footage" },
  { value: "slow_motion", label: "Slow Motion Highlight" },
];

// ============================================================================
// INITIAL FORM DATA
// ============================================================================
const initialFormData = {
  title: "",
  caption: "",
  description: "",
  vendorId: "",
  vendorName: "",
  vendorUsername: "",
  category: "venues",
  subcategory: "",
  type: "",
  subType: "",
  nestedType: "",
  nestedValues: [],
  tags: [],
  hashtags: [],
  videoUrl: "",
  videoFile: null,
  thumbnailUrl: "",
  duration: "",
  aspectRatio: "9:16",
  resolution: "",
  isActive: true,
  isFeatured: false,
  isSponsored: false,
  isPinned: false,
  viewCount: 0,
  likeCount: 0,
  shareCount: 0,
  commentCount: 0,
  saveCount: 0,
  location: "",
  city: "",
  musicTitle: "",
  musicArtist: "",
  ctaText: "",
  ctaLink: "",
  language: "Hindi",
  ageRestriction: false,
  allowComments: true,
  allowSharing: true,
  allowDownload: false,
  publishedAt: "",
  expiresAt: "",
  priority: 0,
  socialLinks: {
    instagram: "",
    youtube: "",
  },
};

// ============================================================================
// MAIN CONTENT COMPONENT
// ============================================================================
function AddReelContent({ onSuccess }) {
  const { addToast } = useToast();
  const formContainerRef = useRef(null);
  const { user } = useUser();

  const [formData, setFormData] = useState(initialFormData);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [dragActiveVideo, setDragActiveVideo] = useState(false);
  const [dragActiveThumbnail, setDragActiveThumbnail] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [hasChanges, setHasChanges] = useState(false);
  const [sectionProgress, setSectionProgress] = useState({});
  const [showWelcome, setShowWelcome] = useState(true);
  const [touchedFields, setTouchedFields] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryData, setRecoveryData] = useState(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const autoSaveTimerRef = useRef(null);
  const isInitialMount = useRef(true);

  const [bunnyConfig, setBunnyConfig] = useState(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [configError, setConfigError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch {}
      }
    };
  }, []);

  useEffect(() => {
    if (!bunnyConfig && !isLoadingConfig && !configError) {
      fetchBunnyConfig();
    }
  }, []);

  const fetchBunnyConfig = async () => {
    setIsLoadingConfig(true);
    setConfigError(false);
    try {
      const response = await fetch("/api/reels/upload-config");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (result.success && result.data) {
        setBunnyConfig(result.data);
      } else {
        throw new Error(result.error || "Invalid config response");
      }
    } catch (error) {
      console.error("Bunny config fetch error:", error);
      setConfigError(true);
      addToast("Failed to initialize upload service. Please refresh.", "error");
    } finally {
      setIsLoadingConfig(false);
    }
  };

  // -----------------------------------------------------------------------
  // SECTION PROGRESS
  // -----------------------------------------------------------------------
  useEffect(() => {
    const progress = {};
    SECTIONS.forEach((section) => {
      let filled = 0;
      let total = 0;

      if (section.id === "basic") {
        total = 4;
        if (formData.title) filled++;
        if (formData.vendorId || formData.vendorName) filled++;
        if (formData.category) filled++;
        if (formData.vendorUsername) filled++;
        if (formData.type) filled++;                     
  if (formData.subtype) filled++;                    
  if (formData.nestedType) filled++;
      } else if (section.id === "media") {
        total = 3;
        if (formData.videoUrl || videoFile) filled++;
        if (formData.thumbnailUrl || thumbnailFile) filled++;
        if (formData.aspectRatio) filled++;
      } else if (section.id === "details") {
        total = 4;
        if (formData.caption) filled++;
        if (formData.tags?.length > 0) filled++;
        if (formData.hashtags?.length > 0) filled++;
        if (formData.description) filled++;
      } else if (section.id === "engagement") {
        total = 3;
        if (formData.location || formData.city) filled++;
        if (formData.ctaText) filled++;
        if (formData.musicTitle) filled++;
      } else if (section.id === "settings") {
        total = 3;
        if (formData.language) filled++;
        if (formData.priority !== undefined) filled++;
        if (formData.publishedAt) filled++;
      }

      progress[section.id] = total > 0 ? Math.round((filled / total) * 100) : 0;
    });
    setSectionProgress(progress);
  }, [formData, videoFile, thumbnailFile]);

  // -----------------------------------------------------------------------
  // HAS CHANGES
  // -----------------------------------------------------------------------
  useEffect(() => {
    const hasData = formData.title || formData.vendorId || formData.videoUrl || videoFile || thumbnailFile;
    setHasChanges(!!hasData && hasUserInteracted);
  }, [formData, videoFile, thumbnailFile, hasUserInteracted]);

  // -----------------------------------------------------------------------
  // AUTO-SAVE LOAD
  // -----------------------------------------------------------------------
  useEffect(() => {
    const saved = AutoSaveManager.load();
    if (saved?.hasUserChanges) {
      const hasTitle = saved.formData?.title?.trim();
      const hasVendor = saved.formData?.vendorId?.trim();
      if (hasTitle || hasVendor) {
        setRecoveryData(saved);
        setShowRecoveryModal(true);
      } else {
        AutoSaveManager.clear();
      }
    }
  }, []);

  // -----------------------------------------------------------------------
  // AUTO-SAVE WRITE
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (showRecoveryModal || isSubmitting) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (hasUserInteracted && hasChanges) {
        AutoSaveManager.save({ formData }, true);
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [formData, hasChanges, showRecoveryModal, isSubmitting, hasUserInteracted]);

  // -----------------------------------------------------------------------
  // PAGE UNLOAD SAVE
  // -----------------------------------------------------------------------
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasChanges && hasUserInteracted && !isSubmitting) {
        AutoSaveManager.save({ formData }, true);
      }
    };
    const handleBeforeUnload = (e) => {
      if (hasChanges && hasUserInteracted && !isSubmitting) {
        AutoSaveManager.save({ formData }, true);
        e.preventDefault();
        e.returnValue = "";
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formData, hasChanges, hasUserInteracted, isSubmitting]);

  // -----------------------------------------------------------------------
  // SCROLL TO TOP
  // -----------------------------------------------------------------------
  const scrollToFormTop = useCallback(() => {
    formContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // -----------------------------------------------------------------------
  // FORM HANDLERS
  // -----------------------------------------------------------------------
  const handleInputChange = useCallback(
    (field, value, isNested = false, nestedField = "") => {
      setHasUserInteracted(true);
      setFormData((prev) => {
        if (isNested) {
          return { ...prev, [field]: { ...(prev[field] || {}), [nestedField]: value } };
        }
        return { ...prev, [field]: value };
      });
      const errorKey = isNested ? `${field}.${nestedField}` : field;
      if (errors[errorKey]) {
        setErrors((prev) => {
          const n = { ...prev };
          delete n[errorKey];
          return n;
        });
      }
    },
    [errors],
  );

  const handleListChange = useCallback((field, updatedList) => {
    setHasUserInteracted(true);
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setVideoFile(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setVideoPreview(null);
    setErrors({});
    setTouchedFields({});
    setHasUserInteracted(false);
    isInitialMount.current = true;
    AutoSaveManager.clear();
    addToast("Form has been reset to default values", "info");
    scrollToFormTop();
  }, [addToast, scrollToFormTop]);

  const resetSection = useCallback(
    (sectionId) => {
      const sectionFields = {
        basic: ["title", "vendorId", "vendorName", "vendorUsername", "category", "subcategory", "type", "subtype", "nestedType", "nestedValues",],
        media: ["videoUrl", "thumbnailUrl", "aspectRatio", "resolution", "duration"],
        details: ["caption", "description", "tags", "hashtags", "language"],
        engagement: [
          "location",
          "city",
          "musicTitle",
          "musicArtist",
          "ctaText",
          "ctaLink",
          "viewCount",
          "likeCount",
          "shareCount",
          "commentCount",
          "saveCount",
        ],
        settings: [
          "isActive",
          "isFeatured",
          "isSponsored",
          "isPinned",
          "allowComments",
          "allowSharing",
          "allowDownload",
          "ageRestriction",
          "publishedAt",
          "expiresAt",
          "priority",
          "socialLinks",
        ],
      };
      const fields = sectionFields[sectionId] || [];
      setFormData((prev) => {
        const updated = { ...prev };
        fields.forEach((f) => {
          updated[f] = JSON.parse(JSON.stringify(initialFormData[f] ?? (Array.isArray(initialFormData[f]) ? [] : "")));
        });
        return updated;
      });
      if (sectionId === "media") {
        setVideoFile(null);
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setVideoPreview(null);
      }
      const name = SECTIONS.find((s) => s.id === sectionId)?.label || "Section";
      addToast(`${name} has been reset`, "info");
    },
    [addToast],
  );

  // -----------------------------------------------------------------------
  // VIDEO UPLOAD
  // -----------------------------------------------------------------------
  const handleVideoUpload = useCallback(
    (files) => {
      setHasUserInteracted(true);
      const file = Array.from(files)[0];
      if (!file) return;
      const validTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];
      if (!validTypes.includes(file.type)) {
        addToast("Invalid video format. Supported: MP4, MOV, WEBM, AVI", "error");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        addToast("Video file exceeds 100MB limit", "error");
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      addToast(`Video "${file.name}" loaded successfully`, "success");
      if (errors.videoUrl)
        setErrors((prev) => {
          const n = { ...prev };
          delete n.videoUrl;
          return n;
        });
    },
    [errors.videoUrl, addToast],
  );

  // -----------------------------------------------------------------------
  // THUMBNAIL UPLOAD
  // -----------------------------------------------------------------------
  const handleThumbnailUpload = useCallback(
    (files) => {
      setHasUserInteracted(true);
      const file = Array.from(files)[0];
      if (!file) return;
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        addToast("Invalid image format. Supported: JPG, PNG, WEBP", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast("Thumbnail exceeds 5MB limit", "error");
        return;
      }
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      addToast("Thumbnail uploaded successfully", "success");
    },
    [addToast],
  );

  // -----------------------------------------------------------------------
  // VALIDATION
  // -----------------------------------------------------------------------
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Reel title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.videoUrl?.trim() && !videoFile) newErrors.videoUrl = "Video URL or uploaded file is required";
    if (!formData.thumbnailUrl?.trim() && !thumbnailFile) newErrors.thumbnailUrl = "Thumbnail URL or uploaded file is required";
    if (!formData.type?.trim()) newErrors.type = "Type is required";
  if (!formData.subtype?.trim()) newErrors.subtype = "Subtype is required";
  if (!formData.nestedType?.trim()) newErrors.nestedType = "Nested type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, videoFile, thumbnailFile]);

  const getErrorsForSection = useCallback(
    (sectionId) => {
      const map = {
        basic: ["title", "category", "type", "subtype", "nestedType"],
        media: ["videoUrl", "thumbnailUrl"],
       details: ["caption"],
      };
      return (map[sectionId] || []).filter((f) => errors[f]);
    },
    [errors],
  );

  // -----------------------------------------------------------------------
  // BUNNY DIRECT UPLOAD
  // -----------------------------------------------------------------------
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const uploadToBunnyDirect = useCallback(
    async (file, path, onProgress, attempt = 1) => {
      if (!bunnyConfig) throw new Error("Upload service not initialized");

      const url = `${bunnyConfig.storageEndpoint}/${path}`;

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        abortControllerRef.current = {
          abort: () => {
            try {
              xhr.abort();
            } catch {}
          },
        };

        let lastProgress = 0;

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && onProgress && mountedRef.current) {
            const progress = Math.floor((e.loaded / e.total) * 100);
            if (progress !== lastProgress) {
              lastProgress = progress;
              onProgress(progress);
            }
          }
        });

        xhr.addEventListener("load", () => {
          if (!mountedRef.current) {
            reject(new Error("Component unmounted"));
            return;
          }
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(`${bunnyConfig.pullZoneUrl}/${path}`);
          } else if (xhr.status >= 500 && attempt < MAX_RETRIES) {
            setTimeout(() => {
              uploadToBunnyDirect(file, path, onProgress, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, RETRY_DELAY * attempt);
          } else {
            reject(new Error(`Upload failed (${xhr.status}): ${xhr.statusText || "Unknown error"}`));
          }
        });

        xhr.addEventListener("error", () => {
          if (!mountedRef.current) {
            reject(new Error("Component unmounted"));
            return;
          }
          if (attempt < MAX_RETRIES) {
            setTimeout(() => {
              uploadToBunnyDirect(file, path, onProgress, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, RETRY_DELAY * attempt);
          } else {
            reject(new Error("Upload failed – check your connection and try again"));
          }
        });

        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

        xhr.addEventListener("timeout", () => {
          if (!mountedRef.current) {
            reject(new Error("Component unmounted"));
            return;
          }
          if (attempt < MAX_RETRIES) {
            setTimeout(() => {
              uploadToBunnyDirect(file, path, onProgress, attempt + 1)
                .then(resolve)
                .catch(reject);
            }, RETRY_DELAY * attempt);
          } else {
            reject(new Error("Upload timed out – try a smaller file or better connection"));
          }
        });

        xhr.timeout = 600000; // 10 minutes

        try {
          xhr.open("PUT", url);
          xhr.setRequestHeader("AccessKey", bunnyConfig.storageZonePassword);
          xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
          xhr.send(file);
        } catch (error) {
          reject(new Error(`Failed to start upload: ${error.message}`));
        }
      });
    },
    [bunnyConfig],
  );

  // -----------------------------------------------------------------------
  // SUBMIT
  // -----------------------------------------------------------------------
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      const errorSections = SECTIONS.filter((s) => getErrorsForSection(s.id).length > 0);
      if (errorSections.length > 0) setActiveSection(errorSections[0].id);
      addToast("Please fix all validation errors before submitting", "error");
      scrollToFormTop();
      return;
    }
    setShowPasswordModal(true);
  };

  const handleConfirmedSubmit = async (adminPassword) => {
    if (!user?.id) {
      addToast("You must be signed in to submit a reel", "error");
      setShowPasswordModal(false);
      throw new Error("User not signed in");
    }
    if (!adminPassword?.trim()) {
      addToast("Admin password is required", "error");
      setShowPasswordModal(false);
      throw new Error("Admin password not provided");
    }
    if (adminPassword !== "AddReelPlanwab") {
      addToast("Incorrect admin password. Please try again.", "error");
      setShowPasswordModal(false);
      throw new Error("Incorrect admin password");
    }
    if (!bunnyConfig) {
      addToast("Upload service not ready. Please wait or refresh.", "error");
      setShowPasswordModal(false);
      throw new Error("Bunny config not loaded");
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setUploadStatus("Preparing...");

    try {
      let finalVideoUrl = formData.videoUrl;
      let finalThumbnailUrl = formData.thumbnailUrl;

      // Sanitize folder name from reel title
      const folderName = (formData.title || "untitled")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 60);

      // ── Upload video file ──────────────────────────────────────────────────
      if (videoFile) {
        const ext = videoFile.name?.split(".").pop()?.toLowerCase() || "mp4";
        const timestamp = Date.now();
        const videoFilename = `${timestamp}_video.${ext}`;
        const videoPath = `CommonReels/${folderName}/${videoFilename}`;

        addToast("Uploading video to Bunny CDN…", "info");
        setUploadStatus("Uploading video...");

        const hasThumbnail = !!thumbnailFile;

        finalVideoUrl = await uploadToBunnyDirect(videoFile, videoPath, (progress) => {
          if (!mountedRef.current) return;
          // Reserve last 10% for thumbnail if we have one
          const adjusted = hasThumbnail ? Math.min(Math.floor(progress * 0.88), 88) : Math.min(progress, 95);
          setUploadProgress(adjusted);

          if (progress < 25) setUploadStatus("Starting upload...");
          else if (progress < 50) setUploadStatus("Uploading video...");
          else if (progress < 75) setUploadStatus("Processing video...");
          else setUploadStatus("Finalizing video...");
        });

        if (!finalVideoUrl) throw new Error("Failed to upload video");
        addToast("Video uploaded successfully!", "success");
      }

      // ── Upload thumbnail file ──────────────────────────────────────────────
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name?.split(".").pop()?.toLowerCase() || "jpg";
        const timestamp = Date.now();
        const thumbFilename = `${timestamp}_thumbnail.${thumbExt}`;
        const thumbPath = `CommonReels/${folderName}/${thumbFilename}`;

        addToast("Uploading thumbnail…", "info");
        setUploadStatus("Uploading thumbnail...");

        try {
          finalThumbnailUrl = await uploadToBunnyDirect(thumbnailFile, thumbPath, (progress) => {
            if (mountedRef.current) {
              setUploadProgress(88 + Math.floor(progress * 0.09));
            }
          });
        } catch (thumbError) {
          console.warn("Thumbnail upload failed:", thumbError.message);
          addToast("Thumbnail upload failed – continuing without it", "warning");
          // Non-fatal: continue without thumbnail
        }
      }

      // ── Save to database ───────────────────────────────────────────────────
      setUploadProgress(98);
      setUploadStatus("Saving to database...");

      const payload = {
        ...formData,
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumbnailUrl,
        addedBy: user.id,
        hashtags: formData.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)),
      };

      const response = await fetch("/api/reels/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to add reel");

      setUploadProgress(100);
      setUploadStatus("Complete!");

      addToast("🎉 Reel published successfully! Redirecting…", "success", 5000);
      AutoSaveManager.clear();
      setHasUserInteracted(false);
      isInitialMount.current = true;
      resetForm();
      setShowPasswordModal(false);

      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Submit error:", error);
      setUploadProgress(0);
      setUploadStatus("");
      addToast(error.message || "Something went wrong. Please try again.", "error");
      setShowPasswordModal(false);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------------------------------------------------
  // NAVIGATION
  // -----------------------------------------------------------------------
  const navigateSection = useCallback(
    (direction) => {
      const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < SECTIONS.length) {
        setActiveSection(SECTIONS[newIndex].id);
        scrollToFormTop();
      }
    },
    [activeSection, scrollToFormTop],
  );

  // -----------------------------------------------------------------------
  // RECOVERY HANDLERS
  // -----------------------------------------------------------------------
  const handleRestoreAutoSave = useCallback(() => {
    if (!recoveryData) return;
    setFormData(recoveryData.formData || initialFormData);
    setHasUserInteracted(true);
    setShowRecoveryModal(false);
    addToast("✅ Your previous reel data has been restored!", "success", 5000);
    scrollToFormTop();
  }, [recoveryData, addToast, scrollToFormTop]);

  const handleDiscardAutoSave = useCallback(() => {
    AutoSaveManager.clear();
    setRecoveryData(null);
    setShowRecoveryModal(false);
    addToast("Started fresh – previous data cleared", "info");
  }, [addToast]);

  // -----------------------------------------------------------------------
  // COMPUTED
  // -----------------------------------------------------------------------
  const currentSectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const overallProgress = Math.round(Object.values(sectionProgress).reduce((a, b) => a + b, 0) / SECTIONS.length);
  const requiredFieldsComplete =
    formData.title &&
    formData.category &&
    (formData.videoUrl || videoFile) &&
    (formData.thumbnailUrl || thumbnailFile) &&
    formData.type &&
    formData.subtype &&
    formData.nestedType;

  // -----------------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-2 sm:px-4 lg:px-6 w-full max-w-full overflow-x-hidden box-border">
      <div className="w-full max-w-7xl mx-auto overflow-hidden">
        {/* WELCOME */}
        <AnimatePresence>
          {showWelcome && <WelcomeSection isVisible={showWelcome} onClose={() => setShowWelcome(false)} />}
        </AnimatePresence>

        {/* MAIN CARD */}
        <div
          ref={formContainerRef}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* ============================================================ */}
          {/* HEADER */}
          {/* ============================================================ */}
          <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 p-4 md:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="text-white min-w-0">
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3 flex-wrap">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Film size={24} />
                  </div>
                  Add New Reel
                  {hasChanges && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full"
                    >
                      Unsaved Changes
                    </motion.span>
                  )}
                </h1>
                <p className="text-white/70 text-sm mt-2">Complete the form below to publish a vendor reel</p>
                {/* Progress */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden max-w-[250px]">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white/90">{overallProgress}% Complete</span>
                  {requiredFieldsComplete && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-3 py-1 bg-green-400 text-green-900 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg"
                    >
                      <CheckCircle size={14} />
                      Ready to Publish
                    </motion.span>
                  )}
                </div>
                {/* Upload progress bar – shown only while submitting */}
                {isSubmitting && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm text-white/90">
                      <span className="font-medium">{uploadStatus}</span>
                      <span className="font-bold">{uploadProgress}%</span>
                    </div>
                    {/* Linear progress bar */}
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                    {/* Circular progress – decorative */}
                    <div className="flex items-center gap-3 mt-1">
                      <div className="relative w-10 h-10">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            stroke="white"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 16}`}
                            strokeDashoffset={`${2 * Math.PI * 16 * (1 - uploadProgress / 100)}`}
                            className="transition-all duration-300 ease-out"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-white text-[9px] font-bold">
                          {uploadProgress}%
                        </span>
                      </div>
                      <p className="text-white/70 text-xs">Please don't close this window while uploading</p>
                      {abortControllerRef.current && (
                        <button
                          type="button"
                          onClick={() => {
                            abortControllerRef.current?.abort();
                            setIsSubmitting(false);
                            setUploadProgress(0);
                            setUploadStatus("");
                            addToast("Upload cancelled", "warning");
                          }}
                          className="ml-auto text-white/70 hover:text-white text-xs underline transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
              {hasChanges && !isSubmitting && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-2 py-1 mt-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-[10px] font-medium rounded-full flex items-center gap-1"
                >
                  <RefreshCw size={10} />
                  Auto-saving
                </motion.span>
              )}
              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowWelcome(true)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all border border-white/20"
                >
                  <HelpCircle size={16} />
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all border border-white/20"
                >
                  <RefreshCw size={16} />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                {/* ── Replace the existing Publish button in the header ── */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !requiredFieldsComplete || isLoadingConfig || configError || !bunnyConfig}
                  className="px-5 py-2.5 bg-white text-rose-600 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="hidden sm:inline">
                        {uploadProgress > 0 ? `${uploadProgress}%` : "Publishing..."}
                      </span>
                    </>
                  ) : isLoadingConfig ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="hidden sm:inline">Loading...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>Publish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION TABS */}
          {/* ============================================================ */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex overflow-x-auto p-2 gap-1.5 no-scrollbar">
              {SECTIONS.map((section, index) => {
                const progress = sectionProgress[section.id] || 0;
                const sectionErrors = getErrorsForSection(section.id);
                const hasError = sectionErrors.length > 0;
                const isActive = activeSection === section.id;
                return (
                  <motion.button
                    key={section.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveSection(section.id);
                      scrollToFormTop();
                    }}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-500/30"
                        : hasError
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <section.icon size={15} />
                    <span className="hidden md:inline">{section.label}</span>
                    <span className="md:hidden">{index + 1}</span>
                    {!isActive && (
                      <div className="flex items-center gap-1">
                        {section.required.length > 0 && <span className="text-[9px] text-red-500 font-bold">*</span>}
                        {progress > 0 && progress < 100 && !hasError && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        )}
                        {progress === 100 && !hasError && <CheckCircle size={12} className="text-green-500" />}
                        {hasError && <AlertCircle size={12} className="text-red-500" />}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION NAVIGATION BAR */}
          {/* ============================================================ */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateSection(-1)}
                disabled={currentSectionIndex === 0}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-sm">
                <span className="text-gray-500 font-medium">
                  Section {currentSectionIndex + 1} of {SECTIONS.length}
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-semibold ml-2">
                  {SECTIONS[currentSectionIndex]?.label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigateSection(1)}
                disabled={currentSectionIndex === SECTIONS.length - 1}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${sectionProgress[activeSection] || 0}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 font-medium">{sectionProgress[activeSection] || 0}%</span>
              </div>
              <button
                type="button"
                onClick={() => resetSection(activeSection)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all font-medium"
              >
                <Undo2 size={12} />
                <span className="hidden sm:inline">Reset Section</span>
              </button>
            </div>
          </div>

          {/* SECTION DESCRIPTION */}
          {SECTIONS[currentSectionIndex]?.description && (
            <div className="px-4 md:px-6 py-3 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-100 dark:border-rose-800">
              <p className="text-sm text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <Info size={15} />
                {SECTIONS[currentSectionIndex].description}
                {SECTIONS[currentSectionIndex].required.length > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full font-medium">
                    Has required fields
                  </span>
                )}
              </p>
            </div>
          )}

          {/* ============================================================ */}
          {/* FORM CONTENT */}
          {/* ============================================================ */}
          {isLoadingConfig && (
            <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex items-center gap-3 text-sm text-blue-700 dark:text-blue-300">
              <RefreshCw size={15} className="animate-spin flex-shrink-0" />
              Initializing upload service…
            </div>
          )}

          {configError && (
            <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800 flex items-center justify-between gap-3 text-sm text-red-700 dark:text-red-300">
              <span className="flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                Upload service unavailable – check your connection
              </span>
              <button
                type="button"
                onClick={() => {
                  setConfigError(false);
                  fetchBunnyConfig();
                }}
                className="px-3 py-1 bg-red-100 dark:bg-red-800 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 font-medium transition-colors flex-shrink-0"
              >
                {" "}
                Retry
              </button>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.type !== "submit" && e.target.tagName !== "BUTTON") e.preventDefault();
            }}
            className="p-4 md:p-6 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {activeSection === "basic" && (
                  <BasicInfoSection
                    data={formData}
                    onChange={handleInputChange}
                    onListChange={handleListChange}
                    errors={errors}
                    categories={REEL_CATEGORIES}
                    addToast={addToast}
                    setHasUserInteracted={setHasUserInteracted}
                  />
                )}
                {activeSection === "media" && (
                  <MediaSection
                    data={formData}
                    onChange={handleInputChange}
                    videoFile={videoFile}
                    videoPreview={videoPreview}
                    thumbnailFile={thumbnailFile}
                    thumbnailPreview={thumbnailPreview}
                    onVideoUpload={handleVideoUpload}
                    onThumbnailUpload={handleThumbnailUpload}
                    onRemoveVideo={() => {
                      setVideoFile(null);
                      setVideoPreview(null);
                      addToast("Video removed", "info");
                    }}
                    onRemoveThumbnail={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                      addToast("Thumbnail removed", "info");
                    }}
                    dragActiveVideo={dragActiveVideo}
                    setDragActiveVideo={setDragActiveVideo}
                    dragActiveThumbnail={dragActiveThumbnail}
                    setDragActiveThumbnail={setDragActiveThumbnail}
                    errors={errors}
                    addToast={addToast}
                  />
                )}
                {activeSection === "details" && (
                  <DetailsSection
                    data={formData}
                    onChange={handleInputChange}
                    onListChange={handleListChange}
                    addToast={addToast}
                  />
                )}
                {activeSection === "engagement" && (
                  <EngagementSection data={formData} onChange={handleInputChange} addToast={addToast} />
                )}
                {activeSection === "settings" && (
                  <SettingsSection
                    data={formData}
                    onChange={handleInputChange}
                    onListChange={handleListChange}
                    addToast={addToast}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </form>

          {/* ============================================================ */}
          {/* FOOTER NAVIGATION */}
          {/* ============================================================ */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <button
              type="button"
              onClick={() => navigateSection(-1)}
              disabled={currentSectionIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {SECTIONS.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setActiveSection(SECTIONS[index].id);
                    scrollToFormTop();
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSectionIndex
                      ? "bg-rose-600 w-6 h-2"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-2 h-2"
                  }`}
                />
              ))}
            </div>
            {currentSectionIndex === SECTIONS.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !requiredFieldsComplete || isLoadingConfig || configError || !bunnyConfig}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/25"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    {uploadProgress > 0 ? `${uploadProgress}%` : "Publishing..."}
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Publish Reel
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigateSection(1)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-lg"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* FLOATING SAVE BAR */}
        {/* ============================================================== */}
        <AnimatePresence>
          {hasChanges && !isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 max-w-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Bell size={18} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">You have unsaved changes</p>
                  {!requiredFieldsComplete && (
                    <p className="text-xs text-red-500">Complete required fields to publish</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm transition-all"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !requiredFieldsComplete || isLoadingConfig || configError || !bunnyConfig}
                  className="px-5 py-2 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2 shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      {uploadProgress > 0 ? `${uploadProgress}%` : "..."}
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Publish
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODALS */}
      <AutoSaveRecoveryModal
        isOpen={showRecoveryModal}
        onRestore={handleRestoreAutoSave}
        onDiscard={handleDiscardAutoSave}
        savedData={recoveryData}
      />
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handleConfirmedSubmit}
      />

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
      `}</style>
    </div>
  );
}

// ============================================================================
// SHARED UI PRIMITIVES
// ============================================================================

const Section = ({ title, icon: Icon, children, description, badge, tip }) => (
  <div className="space-y-4 mb-8">
    <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2.5 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-xl flex-shrink-0">
          <Icon size={20} className="text-rose-600 dark:text-rose-400" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {badge && (
        <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-full flex-shrink-0">
          {badge}
        </span>
      )}
    </div>
    {tip && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-800"
      >
        <Lightbulb size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200">{tip}</p>
      </motion.div>
    )}
    {children}
  </div>
);

const InputField = ({
  label,
  error,
  className = "",
  helperText,
  prefix,
  suffix,
  icon: Icon,
  copyable,
  required,
  onBlur,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopy = () => {
    if (props.value) {
      navigator.clipboard.writeText(props.value);
      setCopied(true);
      addToast("Copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`w-full min-w-0 ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        )}
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          className={`w-full px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm ${
            Icon ? "pl-10" : prefix ? "pl-8" : ""
          } ${suffix || copyable ? "pr-10" : ""} ${
            error
              ? "border-red-400 bg-red-50 dark:bg-red-900/10 focus:ring-red-500/20 focus:border-red-500"
              : "border-gray-200 dark:border-gray-600"
          }`}
          onBlur={onBlur}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
        {copyable && props.value && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600 transition-colors"
          >
            {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        )}
      </div>
      {helperText && !error && <p className="text-xs text-gray-500 mt-1.5">{helperText}</p>}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
        >
          <AlertCircle size={12} />
          {error}
        </motion.p>
      )}
    </div>
  );
};

const TextArea = ({ label, error, className = "", helperText, maxLength, required, ...props }) => (
  <div className={`w-full min-w-0 ${className}`}>
    {label && (
      <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      className={`w-full px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none ${
        error ? "border-red-400 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-600"
      }`}
      maxLength={maxLength}
      {...props}
    />
    <div className="flex justify-between mt-1.5">
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      {maxLength && (
        <p
          className={`text-xs ml-auto ${
            (props.value?.length || 0) > maxLength * 0.9 ? "text-orange-500 font-medium" : "text-gray-400"
          }`}
        >
          {props.value?.length || 0}/{maxLength}
        </p>
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
      >
        <AlertCircle size={12} />
        {error}
      </motion.p>
    )}
  </div>
);

const CheckboxField = ({ label, checked, onChange, description }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div
      className={`w-5 h-5 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
        checked ? "bg-rose-600 border-rose-600" : "border-gray-300 dark:border-gray-600 group-hover:border-rose-400"
      }`}
    >
      {checked && <Check size={12} className="text-white" />}
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <div className="min-w-0">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
  </label>
);

const CustomSelect = ({ label, options, value, onChange, error, required, placeholder = "Select...", allowCustom }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const { addToast } = useToast();
  const isCurrentCustom = value && !options.includes(value) && typeof value === "string";

  return (
    <div className="w-full min-w-0">
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {isCustom || isCurrentCustom ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={isCurrentCustom ? value : customValue}
            onChange={(e) => {
              setCustomValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Enter custom value..."
            className={`flex-1 px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 bg-white dark:bg-gray-800 text-sm ${
              error ? "border-red-400" : "border-gray-200 dark:border-gray-600"
            }`}
          />
          <button
            type="button"
            onClick={() => {
              setIsCustom(false);
              setCustomValue("");
              onChange("");
            }}
            className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`flex-1 px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm ${
              error ? "border-red-400" : "border-gray-200 dark:border-gray-600"
            }`}
          >
            <option value="">{placeholder}</option>
            {options.map((o) => (
              <option key={typeof o === "object" ? o.key : o} value={typeof o === "object" ? o.key : o}>
                {typeof o === "object" ? o.label : o}
              </option>
            ))}
          </select>
          {allowCustom && (
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex items-center gap-1"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
        >
          <AlertCircle size={12} />
          {error}
        </motion.p>
      )}
    </div>
  );
};

const TagInput = ({ label, tags = [], onChange, suggestions = [], placeholder, allowCustom = true, prefix }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { addToast } = useToast();

  const add = (val) => {
    let trimmed = val.trim();
    if (prefix && !trimmed.startsWith(prefix)) trimmed = prefix + trimmed;
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      addToast(`"${trimmed}" added`, "success");
    }
    setInput("");
  };

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s));

  return (
    <div className="w-full min-w-0">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-xs text-gray-500 font-medium">{tags.length} items</span>
      </div>
      <div className="flex flex-wrap gap-2 p-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 min-h-[52px]">
        <AnimatePresence>
          {tags.map((t, i) => (
            <motion.span
              key={`${t}-${i}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 max-w-[180px]"
            >
              <span className="truncate">{t}</span>
              <button
                type="button"
                onClick={() => {
                  onChange(tags.filter((x) => x !== t));
                  addToast(`"${t}" removed`, "info");
                }}
                className="hover:text-red-600 transition-colors flex-shrink-0"
              >
                <X size={12} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <div className="relative flex-1 min-w-[140px]">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (allowCustom || filtered.includes(input)) add(input);
              } else if (e.key === "Backspace" && !input && tags.length > 0) {
                const removed = tags[tags.length - 1];
                onChange(tags.slice(0, -1));
                addToast(`"${removed}" removed`, "info");
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={tags.length === 0 ? placeholder : "Type & Enter..."}
            className="w-full outline-none bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          <AnimatePresence>
            {showSuggestions && input && filtered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-40 overflow-auto z-20"
              >
                {filtered.slice(0, 8).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      add(s);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-3 py-2.5 text-left text-sm hover:bg-rose-50 dark:hover:bg-rose-900/30 text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors"
                  >
                    <Plus size={12} className="text-gray-400" />
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {allowCustom && (
        <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
          <Lightbulb size={11} />
          Type and press Enter to add custom values
        </p>
      )}
    </div>
  );
};

// ============================================================================
// BASIC INFO SECTION
// ============================================================================
const BasicInfoSection = ({ data, onChange, errors, onListChange, categories, addToast, setHasUserInteracted }) => (
  <div className="space-y-8">
    <Section
      title="Reel Identity"
      icon={Film}
      description="Core reel information"
      badge="Required"
      tip="Give your reel a catchy title and link it to the correct vendor. This helps users discover the reel through search."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <InputField
            label="Reel Title"
            value={data.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            required
            error={errors.title}
            placeholder="e.g., Royal Palace Grand Wedding Highlight 2024"
            icon={Film}
          />
        </div>
        <InputField
          label="Vendor ID"
          value={data.vendorId || ""}
          onChange={(e) => onChange("vendorId", e.target.value)}
          error={errors.vendorId}
          placeholder="MongoDB Vendor ObjectId"
          icon={Hash}
          helperText="Link to the vendor's database ID"
          copyable
        />
        <InputField
          label="Vendor Name"
          value={data.vendorName || ""}
          onChange={(e) => onChange("vendorName", e.target.value)}
          placeholder="e.g., Royal Palace Banquets"
          icon={Building2}
          helperText="Display name for the vendor"
        />
        <InputField
          label="Vendor Username"
          value={data.vendorUsername || ""}
          onChange={(e) => {
            const cleaned = e.target.value
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "");
            onChange("vendorUsername", cleaned || "");
          }}
          placeholder="e.g., royal-palace-banquets"
          icon={AtSign}
          helperText="Used for linking to vendor profile"
          copyable
        />
        <InputField
          label="Subcategory"
          value={data.subcategory || ""}
          onChange={(e) => onChange("subcategory", e.target.value)}
          placeholder="e.g., Luxury Venues, Candid Photography"
          icon={Layers}
          helperText="Optional: Refine the category"
        />
     {/* Event Type */}
<CustomDropdown
  label="Event Type"
  placeholder="Select event type"
  options={REEL_TYPES}
  value={data.type}
  onChange={(val) => {
    onChange("type", val);
    onChange("subtype", "");
  }}
  error={errors.type}
  icon={Tag}
  CustomDropdown={true}
/>

{/* Event Subtype */}
<CustomDropdown
  label="Event Subtype"
  placeholder={
    data.type ? "Select subtype" : "Select a type first"
  }
  options={data.type ? REEL_SUBTYPES[data.type] ?? [] : []}
  value={data.subtype}
  onChange={(val) =>
    onChange("subtype", val)
  }
  error={errors.subtype}
  disabled={!data.type}
  icon={Layers}
  CustomDropdown={true}
/>

{/* Reel / Film Style */}
<CustomDropdown
  label="Reel Style"
  placeholder="Select reel style"
  options={REEL_NESTED_TYPES}
  value={data.nestedType}
  onChange={(val) =>
    onChange("nestedType", val)
  }
  error={errors.nestedType}
  icon={Film}
  
/>
<div className="md:col-span-2">
  <TagInput
    label="Nested Values"
    tags={data.nestedValues || []}
    onChange={(v) => { setHasUserInteracted(true); onListChange("nestedValues", v); }}
    placeholder="Add nested values and press Enter…"
  />
</div>
      </div>
    </Section>

    <Section title="Category" icon={Layers} description="Select the category this reel belongs to" badge="Required">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <motion.button
            key={cat.key}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setHasUserInteracted(true);
              onChange("category", cat.key);
              addToast(`Category set to ${cat.label}`, "info");
            }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all min-w-[85px] flex-shrink-0 ${
              data.category === cat.key
                ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 shadow-lg shadow-rose-500/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-rose-300 hover:shadow-md"
            }`}
          >
            <cat.icon className="h-6 w-6 mb-1.5" />
            <span className="text-[11px] font-medium text-center leading-tight">{cat.label}</span>
          </motion.button>
        ))}
      </div>
      {errors.category && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-2 flex items-center gap-1"
        >
          <AlertCircle size={12} />
          {errors.category}
        </motion.p>
      )}
    </Section>
  </div>
);

// ============================================================================
// MEDIA SECTION
// ============================================================================
const MediaSection = ({
  data,
  onChange,
  videoFile,
  videoPreview,
  thumbnailFile,
  thumbnailPreview,
  onVideoUpload,
  onThumbnailUpload,
  onRemoveVideo,
  onRemoveThumbnail,
  dragActiveVideo,
  setDragActiveVideo,
  dragActiveThumbnail,
  setDragActiveThumbnail,
  errors,
  addToast,
}) => (
  <div className="space-y-8">
    {/* VIDEO */}
    <Section
      title="Video Content"
      icon={Video}
      description="Upload your reel video or provide a URL"
      badge="Required"
      tip="For best results upload MP4 in 9:16 portrait ratio. Max 100MB. You can also link a YouTube or other video URL."
    >
      {/* URL Input */}
      <InputField
        label="Video URL (YouTube / Direct Link)"
        value={data.videoUrl || ""}
        onChange={(e) => onChange("videoUrl", e.target.value)}
        error={!videoFile ? errors.videoUrl : undefined}
        placeholder="https://youtube.com/... or direct video link"
        icon={Link}
        helperText="Use this OR upload a file below"
      />

      {/* File Upload */}
      <div
        className={`mt-4 border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActiveVideo
            ? "bg-rose-50 dark:bg-rose-900/30 border-rose-500"
            : errors.videoUrl && !videoFile
              ? "border-red-400 bg-red-50 dark:bg-red-900/10"
              : "border-gray-300 dark:border-gray-600 hover:border-rose-400 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActiveVideo(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActiveVideo(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActiveVideo(false);
          if (e.dataTransfer.files) onVideoUpload(e.dataTransfer.files);
        }}
      >
        {videoFile || videoPreview ? (
          <div className="space-y-4">
            <div className="relative w-full max-w-sm mx-auto aspect-video bg-black rounded-xl overflow-hidden">
              {videoPreview && <video src={videoPreview} controls className="w-full h-full object-contain" />}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={onRemoveVideo}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{videoFile?.name}</p>
              {videoFile?.size && (
                <p className="text-xs text-gray-500 mt-1">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
              )}
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center justify-center gap-1">
                <CheckCircle size={12} /> Video ready
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30">
              <UploadCloud className="w-10 h-10 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">Drag & Drop video here</p>
            <p className="text-gray-500 text-sm mb-4">or click to browse</p>
            <label
              htmlFor="reelVideo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl cursor-pointer hover:from-rose-700 hover:to-pink-700 transition-all font-medium shadow-lg shadow-rose-500/25"
            >
              <Film size={18} />
              Browse Video
            </label>
            <input
              id="reelVideo"
              type="file"
              className="hidden"
              accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
              onChange={(e) => onVideoUpload(e.target.files)}
            />
            <p className="text-xs text-gray-400 mt-4">Supports: MP4, MOV, WEBM, AVI • Max 100MB</p>
          </>
        )}
      </div>
    </Section>

    {/* THUMBNAIL */}
    <Section
      title="Thumbnail"
      icon={ImageIcon}
       badge="Required"
      description="Cover image displayed before the video plays"
      tip="A compelling thumbnail dramatically increases click-through rates. Use a high-quality image in 9:16 or 16:9 ratio."
    >
      <InputField
        label="Thumbnail URL"
        value={data.thumbnailUrl || ""}
        onChange={(e) => onChange("thumbnailUrl", e.target.value)}
        error={!thumbnailFile ? errors.thumbnailUrl : undefined}
        placeholder="https://..."
        icon={Link}

        helperText="Or upload a thumbnail image below"
      />

      <div
        className={`mt-4 border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
          dragActiveThumbnail
            ? "bg-pink-50 dark:bg-pink-900/30 border-pink-500"
            : "border-gray-300 dark:border-gray-600 hover:border-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActiveThumbnail(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActiveThumbnail(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActiveThumbnail(false);
          if (e.dataTransfer.files) onThumbnailUpload(e.dataTransfer.files);
        }}
      >
        {thumbnailPreview || data.thumbnailUrl ? (
          <div className="space-y-3">
            <div className="relative w-48 mx-auto aspect-[9/16] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
              <img src={thumbnailPreview || data.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              {thumbnailFile && (
                <button
                  type="button"
                  onClick={onRemoveThumbnail}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <p className="text-xs text-green-600 font-medium flex items-center justify-center gap-1">
              <CheckCircle size={12} /> Thumbnail set
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30">
              <ImageIcon className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Upload Thumbnail Image</p>
            <label
              htmlFor="reelThumbnail"
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl cursor-pointer hover:bg-pink-700 transition-all text-sm font-medium"
            >
              <ImageIcon size={16} />
              Browse Image
            </label>
            <input
              id="reelThumbnail"
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => onThumbnailUpload(e.target.files)}
            />
            <p className="text-xs text-gray-400 mt-3">Supports: JPG, PNG, WEBP • Max 5MB</p>
          </>
        )}
      </div>
    </Section>

    {/* VIDEO METADATA */}
    <Section title="Video Settings" icon={Settings}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CustomSelect
          label="Aspect Ratio"
          options={["9:16", "16:9", "1:1", "4:5", "4:3"]}
          value={data.aspectRatio || "9:16"}
          onChange={(v) => onChange("aspectRatio", v)}
          allowCustom
        />
        <InputField
          label="Duration"
          value={data.duration || ""}
          onChange={(e) => onChange("duration", e.target.value)}
          placeholder="e.g., 0:45 or 45s"
          icon={Clock}
          helperText="Reel duration (optional)"
        />
        <CustomSelect
          label="Resolution"
          options={["1080x1920", "1920x1080", "720x1280", "1080x1080", "1280x720"]}
          value={data.resolution || ""}
          onChange={(v) => onChange("resolution", v)}
          placeholder="Select resolution..."
          allowCustom
        />
      </div>
    </Section>
  </div>
);

// ============================================================================
// DETAILS SECTION
// ============================================================================
const DetailsSection = ({ data, onChange, onListChange, addToast }) => (
  <div className="space-y-8">
    <Section
      title="Caption & Description"
      icon={FileText}
      description="Compelling copy drives engagement"
      tip="Write a short, punchy caption for feed display and a longer description for the detail page. Use emojis to make it pop!"
    >
      <InputField
        label="Caption"
        value={data.caption || ""}
        onChange={(e) => onChange("caption", e.target.value)}
        placeholder="✨ Dream wedding at Royal Palace Banquets…"
        maxLength={300}
        required
        helperText={`${(data.caption || "").length}/300 characters – shown in feed`}
      />
      <TextArea
        label="Full Description"
        value={data.description || ""}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Detailed description about this reel, venue details, services showcased…"
        rows={5}
        className="mt-4"
        maxLength={2000}
      />
    </Section>

    <Section
      title="Tags"
      icon={Tag}
      description="Improve discoverability with relevant tags"
      tip="Tags help the algorithm surface your reel to interested audiences. Add both broad and specific tags."
    >
      <TagInput
        label="Tags"
        tags={data.tags || []}
        onChange={(v) => onListChange("tags", v)}
        suggestions={[
          "wedding",
          "venue",
          "photography",
          "makeup",
          "decor",
          "catering",
          "bridal",
          "reception",
          "engagement",
          "ceremony",
          "luxury",
          "destination",
          "traditional",
          "candid",
          "portrait",
        ]}
        placeholder="Add tags to improve searchability…"
      />
    </Section>

    <Section title="Hashtags" icon={Hash} description="Social media hashtags">
      <TagInput
        label="Hashtags"
        tags={data.hashtags || []}
        onChange={(v) => onListChange("hashtags", v)}
        prefix="#"
        suggestions={[
          "#wedding",
          "#weddingphotography",
          "#bridetobe",
          "#weddingvenue",
          "#weddingdecor",
          "#weddingday",
          "#indianwedding",
          "#bridalfashion",
          "#weddingcake",
          "#mehendinight",
          "#sangeet",
          "#shaadi",
          "#dulha",
          "#dulhan",
          "#reels",
          "#reelsinstagram",
          "#viralreels",
          "#trending",
        ]}
        placeholder="Add hashtags (# will be added automatically)…"
      />
    </Section>

    <Section title="Language" icon={Globe}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelect
          label="Content Language"
          options={[
            "Hindi",
            "English",
            "Punjabi",
            "Tamil",
            "Telugu",
            "Marathi",
            "Bengali",
            "Gujarati",
            "Kannada",
            "Malayalam",
          ]}
          value={data.language || "Hindi"}
          onChange={(v) => onChange("language", v)}
          allowCustom
        />
      </div>
    </Section>
  </div>
);

// ============================================================================
// ENGAGEMENT SECTION
// ============================================================================
const EngagementSection = ({ data, onChange, addToast }) => (
  <div className="space-y-8">
    <Section
      title="Initial Stats"
      icon={BarChart3}
      description="Seed engagement numbers for new reels"
      tip="You can pre-seed engagement stats. These will be displayed on the reel until organic engagement catches up."
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <InputField
          label="View Count"
          type="number"
          min="0"
          value={data.viewCount || ""}
          onChange={(e) => onChange("viewCount", parseInt(e.target.value) || 0)}
          placeholder="0"
          icon={Eye}
        />
        <InputField
          label="Like Count"
          type="number"
          min="0"
          value={data.likeCount || ""}
          onChange={(e) => onChange("likeCount", parseInt(e.target.value) || 0)}
          placeholder="0"
          icon={Heart}
        />
        <InputField
          label="Share Count"
          type="number"
          min="0"
          value={data.shareCount || ""}
          onChange={(e) => onChange("shareCount", parseInt(e.target.value) || 0)}
          placeholder="0"
          icon={Share2}
        />
        <InputField
          label="Comment Count"
          type="number"
          min="0"
          value={data.commentCount || ""}
          onChange={(e) => onChange("commentCount", parseInt(e.target.value) || 0)}
          placeholder="0"
          icon={MessageCircle}
        />
        <InputField
          label="Save Count"
          type="number"
          min="0"
          value={data.saveCount || ""}
          onChange={(e) => onChange("saveCount", parseInt(e.target.value) || 0)}
          placeholder="0"
          icon={Bookmark}
        />
        <InputField
          label="Priority Score"
          type="number"
          min="0"
          max="100"
          value={data.priority || ""}
          onChange={(e) => onChange("priority", parseInt(e.target.value) || 0)}
          placeholder="0"
          icon={TrendingUp}
          helperText="Higher = shown first (0–100)"
        />
      </div>
    </Section>

    <Section title="Location" icon={Navigation}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Location / Venue"
          value={data.location || ""}
          onChange={(e) => onChange("location", e.target.value)}
          placeholder="Royal Palace Banquets, Mumbai"
          icon={Navigation}
        />
        <CustomSelect
          label="City"
          options={[
            "Mumbai",
            "Delhi NCR",
            "Bangalore",
            "Chennai",
            "Kolkata",
            "Hyderabad",
            "Pune",
            "Jaipur",
            "Ahmedabad",
            "Goa",
            "Udaipur",
            "Lucknow",
            "Chandigarh",
            "Kochi",
            "Indore",
          ]}
          value={data.city || ""}
          onChange={(v) => onChange("city", v)}
          placeholder="Select city…"
          allowCustom
        />
      </div>
    </Section>

    <Section title="Background Music" icon={Music}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Music Title"
          value={data.musicTitle || ""}
          onChange={(e) => onChange("musicTitle", e.target.value)}
          placeholder="e.g., Tum Hi Ho"
          icon={Music}
        />
        <InputField
          label="Music Artist"
          value={data.musicArtist || ""}
          onChange={(e) => onChange("musicArtist", e.target.value)}
          placeholder="e.g., Arijit Singh"
          icon={MicVocal}
        />
      </div>
    </Section>

    <Section title="Call to Action" icon={Target} description="Drive users to take action after watching">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="CTA Button Text"
          value={data.ctaText || ""}
          onChange={(e) => onChange("ctaText", e.target.value)}
          placeholder="e.g., Book Now, View Venue, Get Quote"
          icon={Zap}
        />
        <InputField
          label="CTA Link"
          value={data.ctaLink || ""}
          onChange={(e) => onChange("ctaLink", e.target.value)}
          placeholder="https://..."
          icon={ExternalLink}
        />
      </div>
    </Section>
  </div>
);

// ============================================================================
// SETTINGS SECTION
// ============================================================================
const SettingsSection = ({ data, onChange, onListChange, addToast }) => (
  <div className="space-y-8">
    <Section
      title="Visibility & Status"
      icon={Eye}
      description="Control how and where this reel appears"
      tip="Featured reels appear in premium spots on the home page. Pinned reels stay at the top of vendor profiles."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <CheckboxField
            label="Active"
            checked={data.isActive !== false}
            onChange={(e) => onChange("isActive", e.target.checked)}
            description="Make this reel visible to users"
          />
          <CheckboxField
            label="Featured"
            checked={data.isFeatured || false}
            onChange={(e) => onChange("isFeatured", e.target.checked)}
            description="Show in featured / curated sections"
          />
          <CheckboxField
            label="Sponsored"
            checked={data.isSponsored || false}
            onChange={(e) => onChange("isSponsored", e.target.checked)}
            description="Mark as sponsored content"
          />
          <CheckboxField
            label="Pinned"
            checked={data.isPinned || false}
            onChange={(e) => onChange("isPinned", e.target.checked)}
            description="Pin to top of vendor profile"
          />
        </div>
        <div className="space-y-4">
          <CheckboxField
            label="Allow Comments"
            checked={data.allowComments !== false}
            onChange={(e) => onChange("allowComments", e.target.checked)}
            description="Users can comment on this reel"
          />
          <CheckboxField
            label="Allow Sharing"
            checked={data.allowSharing !== false}
            onChange={(e) => onChange("allowSharing", e.target.checked)}
            description="Users can share this reel"
          />
          <CheckboxField
            label="Allow Download"
            checked={data.allowDownload || false}
            onChange={(e) => onChange("allowDownload", e.target.checked)}
            description="Users can download this reel"
          />
          <CheckboxField
            label="Age Restricted"
            checked={data.ageRestriction || false}
            onChange={(e) => onChange("ageRestriction", e.target.checked)}
            description="Restrict to 18+ users"
          />
        </div>
      </div>
    </Section>

    <Section title="Scheduling" icon={Clock}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Publish Date & Time"
          type="datetime-local"
          value={data.publishedAt || ""}
          onChange={(e) => onChange("publishedAt", e.target.value)}
          icon={Clock}
          helperText="Leave blank to publish immediately"
        />
        <InputField
          label="Expires At"
          type="datetime-local"
          value={data.expiresAt || ""}
          onChange={(e) => onChange("expiresAt", e.target.value)}
          icon={Flag}
          helperText="Optional: auto-deactivate after this date"
        />
      </div>
    </Section>

    <Section title="Social Links" icon={Globe}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Instagram Post URL"
          value={data.socialLinks?.instagram || ""}
          onChange={(e) => onChange("socialLinks", e.target.value, true, "instagram")}
          placeholder="https://instagram.com/p/..."
          icon={Link}
        />
        <InputField
          label="YouTube Video URL"
          value={data.socialLinks?.youtube || ""}
          onChange={(e) => onChange("socialLinks", e.target.value, true, "youtube")}
          placeholder="https://youtube.com/watch?v=..."
          icon={Link}
        />
      </div>
    </Section>
  </div>
);
