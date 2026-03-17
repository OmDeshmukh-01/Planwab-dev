"use client";

// ============================================================================
// IMPORTS
// ============================================================================
import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  FileText,
  Tag,
  Globe,
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
  Info,
  Lightbulb,
  Bell,
  Zap,
  ChevronDown,
  ChevronUp,
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
  Flag,
  MessageCircle,
  AtSign,
  Navigation,
  ExternalLink,
  Layers,
  AlertTriangle,
  Lock,
  EyeOff,
  KeyRound,
  ShieldCheck,
  PenTool,
  UploadCloud,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { CustomDropdown, REEL_NESTED_TYPES, REEL_SUBTYPES, REEL_TYPES } from "./AddReels";

// ============================================================================
// TOAST CONTEXT
// ============================================================================
const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
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
// MAIN EXPORT
// ============================================================================
export default function EditReelTab({ reelId, reelData: initialReelData, onSuccess }) {
  return (
    <ToastProvider>
      <EditReelContent reelId={reelId} initialReelData={initialReelData} onSuccess={onSuccess} />
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
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
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
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Admin Verification</h2>
                <p className="text-white/80 text-sm mt-0.5">Confirm changes</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                <Lock size={12} />
                Authentication Required to Save
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
                      : "border-gray-200 dark:border-gray-600 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
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
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} /> Confirm & Save
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
    required: ["title", "type", "subtype", "nestedType"],
    description: "Core reel identity and vendor association",
  },
  { id: "media", label: "Media", icon: Video, required: [], description: "Video URL, thumbnail and display settings" },
  {
    id: "details",
    label: "Details",
    icon: FileText,
    required: [],
    description: "Caption, tags, hashtags and metadata",
  },
  {
    id: "engagement",
    label: "Engagement",
    icon: Heart,
    required: [],
    description: "Stats, location and call to action",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    required: [],
    description: "Visibility, scheduling and advanced options",
  },
];

// ============================================================================
// MAIN EDIT CONTENT
// ============================================================================
function EditReelContent({ reelId, initialReelData, onSuccess }) {
  const { addToast } = useToast();
  const formContainerRef = useRef(null);
  const { user } = useUser();

  const [formData, setFormData] = useState(initialReelData || {});
  const [originalData, setOriginalData] = useState(null);
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);
  const [newThumbnailPreview, setNewThumbnailPreview] = useState(null);
  const [dragActiveThumbnail, setDragActiveThumbnail] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(!initialReelData);
  const [activeSection, setActiveSection] = useState("basic");
  const [hasChanges, setHasChanges] = useState(false);
  const [sectionProgress, setSectionProgress] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [changeLog, setChangeLog] = useState([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [bunnyConfig, setBunnyConfig] = useState(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ── ADD: fetch Bunny CDN credentials on mount ──
  const fetchBunnyConfig = useCallback(async () => {
    setIsLoadingConfig(true);
    setConfigError(false);
    try {
      const res = await fetch("/api/reels/upload-config");
      if (!res.ok) throw new Error(`Config fetch failed: ${res.status}`);
      const cfg = await res.json();
      if (!mountedRef.current) return;
      setBunnyConfig({
        storageEndpoint: cfg.storageEndpoint,
        storageZonePassword: cfg.storageZonePassword,
        pullZoneUrl: cfg.pullZoneUrl,
      });
    } catch (err) {
      if (!mountedRef.current) return;
      console.error("Bunny config error:", err);
      setConfigError(true);
      addToast("Failed to load upload config. Please retry.", "error");
    } finally {
      if (mountedRef.current) setIsLoadingConfig(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchBunnyConfig();
  }, [fetchBunnyConfig]);

  // ── ADD: Bunny.net direct XHR uploader (mirrors AddReel) ──
  const RETRY_DELAY = 1500;
  const MAX_RETRIES = 3;

  const uploadToBunnyDirect = useCallback(
    async (file, remotePath, onProgress) => {
      if (!bunnyConfig) throw new Error("Bunny config not loaded");

      const { storageEndpoint, storageZonePassword } = bunnyConfig;
      const uploadUrl = `${storageEndpoint}/${remotePath}`;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", uploadUrl, true);
            xhr.setRequestHeader("AccessKey", storageZonePassword);
            xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
            xhr.timeout = 10 * 60 * 1000; // 10 minutes

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable && onProgress) {
                onProgress(Math.round((event.loaded / event.total) * 100));
              }
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
              } else {
                reject(new Error(`Upload failed (HTTP ${xhr.status}): ${xhr.responseText}`));
              }
            };

            xhr.onerror = () => reject(new Error("Network error during upload"));
            xhr.ontimeout = () => reject(new Error("Upload timed out"));

            xhr.send(file);
          });

          return; // success — exit retry loop
        } catch (err) {
          const isLast = attempt === MAX_RETRIES;
          if (isLast) throw err;
          console.warn(`Upload attempt ${attempt} failed, retrying in ${RETRY_DELAY * attempt}ms…`, err.message);
          await new Promise((r) => setTimeout(r, RETRY_DELAY * attempt));
        }
      }
    },
    [bunnyConfig],
  );

  // ── ADD: sanitize title → CDN-safe folder name ──
  const sanitizeFolderName = useCallback((title = "") => {
    return (
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60) || "untitled-reel"
    );
  }, []);

  // -----------------------------------------------------------------------
  // FETCH REEL DATA (if not provided)
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (initialReelData) {
      setFormData(initialReelData);
      setOriginalData(JSON.parse(JSON.stringify(initialReelData)));
      return;
    }
    if (!reelId) return;

    const fetchReel = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/reels/${reelId}`);
        if (!res.ok) throw new Error("Failed to fetch reel");
        const data = await res.json();
        setFormData(data.reel || data.data);
        setOriginalData(JSON.parse(JSON.stringify(data.reel || data.data)));
      } catch (err) {
        addToast("Failed to load reel data: " + err.message, "error");
      } finally {
        setIsFetching(false);
      }
    };
    fetchReel();
  }, [reelId, initialReelData]);

  // -----------------------------------------------------------------------
  // DETECT CHANGES
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!originalData) return;
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData) || !!newThumbnailFile;
    setHasChanges(changed);

    // Build change log
    if (originalData) {
      const log = [];
      const compareObjects = (orig, curr, prefix = "") => {
        Object.keys(curr || {}).forEach((key) => {
          const path = prefix ? `${prefix}.${key}` : key;
          const origVal = orig?.[key];
          const currVal = curr?.[key];
          if (typeof currVal === "object" && currVal !== null && !Array.isArray(currVal)) {
            compareObjects(origVal, currVal, path);
          } else if (JSON.stringify(origVal) !== JSON.stringify(currVal)) {
            log.push({
              field: path,
              from: origVal,
              to: currVal,
            });
          }
        });
      };
      compareObjects(originalData, formData);
      if (newThumbnailFile) log.push({ field: "thumbnail", from: "Previous image", to: newThumbnailFile.name });
      setChangeLog(log);
    }
  }, [formData, newThumbnailFile, originalData]);

  // -----------------------------------------------------------------------
  // SECTION PROGRESS
  // -----------------------------------------------------------------------
  useEffect(() => {
    const progress = {};
    SECTIONS.forEach((section) => {
      let filled = 0,
        total = 0;
      if (section.id === "basic") {
        total = 4;
        if (formData.title) filled++;
        if (formData.vendorId || formData.vendorName) filled++;
        if (formData.category) filled++;
        if (formData.vendorUsername) filled++;
        if (formData.type) filled++;                        // ADD
  if (formData.subtype) filled++;                     // ADD
  if (formData.nestedType) filled++;
      } else if (section.id === "media") {
        total = 2;
        if (formData.videoUrl) filled++;
        if (formData.thumbnailUrl || newThumbnailFile) filled++;
      } else if (section.id === "details") {
        total = 3;
        if (formData.caption) filled++;
        if (formData.tags?.length > 0) filled++;
        if (formData.hashtags?.length > 0) filled++;
      } else if (section.id === "engagement") {
        total = 2;
        if (formData.location || formData.city) filled++;
        if (formData.ctaText) filled++;
      } else if (section.id === "settings") {
        total = 2;
        if (formData.language) filled++;
        if (formData.publishedAt) filled++;
      }
      progress[section.id] = total > 0 ? Math.round((filled / total) * 100) : 0;
    });
    setSectionProgress(progress);
  }, [formData, newThumbnailFile]);

  // -----------------------------------------------------------------------
  // SCROLL
  // -----------------------------------------------------------------------
  const scrollToFormTop = useCallback(() => {
    formContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // -----------------------------------------------------------------------
  // HANDLERS
  // -----------------------------------------------------------------------
  const handleInputChange = useCallback(
    (field, value, isNested = false, nestedField = "") => {
      setFormData((prev) => {
        if (isNested) return { ...prev, [field]: { ...(prev[field] || {}), [nestedField]: value } };
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
    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  }, []);

  // Reset subtype whenever type changes
useEffect(() => {
  if (!originalData) return;
  if (formData.type !== originalData.type) {
    setFormData((prev) => ({ ...prev, subtype: "" }));
  }
}, [formData.type]);

  const handleDiscardChanges = useCallback(() => {
    if (!originalData) return;
    setFormData(JSON.parse(JSON.stringify(originalData)));
    setNewThumbnailFile(null);
    setNewThumbnailPreview(null);
    setErrors({});
    addToast("Changes discarded — reverted to saved data", "info");
    scrollToFormTop();
  }, [originalData, addToast, scrollToFormTop]);

  const resetSection = useCallback(
    (sectionId) => {
      if (!originalData) return;
      const sectionFields = {
        basic: ["title", "vendorId", "vendorName", "vendorUsername", "category", "subcategory", "type", "subtype", "nestedType", "nestedValues"],
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
          if (originalData[f] !== undefined) {
            updated[f] = JSON.parse(JSON.stringify(originalData[f]));
          }
        });
        return updated;
      });
      if (sectionId === "media") {
        setNewThumbnailFile(null);
        setNewThumbnailPreview(null);
      }
      addToast(`${SECTIONS.find((s) => s.id === sectionId)?.label || "Section"} reverted to saved`, "info");
    },
    [originalData, addToast],
  );

  // -----------------------------------------------------------------------
  // THUMBNAIL UPLOAD
  // -----------------------------------------------------------------------
  const handleThumbnailUpload = useCallback(
    (files) => {
      const file = Array.from(files)[0];
      if (!file) return;
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        addToast("Invalid format. Supported: JPG, PNG, WEBP", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast("Thumbnail exceeds 5MB limit", "error");
        return;
      }
      setNewThumbnailFile(file);
      setNewThumbnailPreview(URL.createObjectURL(file));
      addToast("New thumbnail selected", "success");
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
    setErrors(newErrors);
    if (!formData.type?.trim()) newErrors.type = "Type is required";
  if (!formData.subtype?.trim()) newErrors.subtype = "Subtype is required";
  if (!formData.nestedType?.trim()) newErrors.nestedType = "Nested type is required";
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const getErrorsForSection = useCallback(
    (sectionId) => {
      const map = { basic: ["title", "category", "type", "subtype", "nestedType"] };
      return (map[sectionId] || []).filter((f) => errors[f]);
    },
    [errors],
  );

  // -----------------------------------------------------------------------
  // SUBMIT
  // -----------------------------------------------------------------------
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      const errorSections = SECTIONS.filter((s) => getErrorsForSection(s.id).length > 0);
      if (errorSections.length > 0) setActiveSection(errorSections[0].id);
      addToast("Please fix all validation errors before saving", "error");
      scrollToFormTop();
      return;
    }
    setShowPasswordModal(true);
  };

  // ── REPLACE handleConfirmedSubmit entirely ──
  const handleConfirmedSubmit = async (adminPassword) => {
    if (!user?.id) {
      addToast("You must be signed in to edit a reel", "error");
      setShowPasswordModal(false);
      throw new Error("User not signed in");
    }
    if (!adminPassword?.trim()) {
      addToast("Admin password is required", "error");
      setShowPasswordModal(false);
      throw new Error("No password provided");
    }
    if (adminPassword !== "EditReelPlanwab") {
      addToast("Incorrect admin password. Please try again.", "error");
      setShowPasswordModal(false);
      throw new Error("Incorrect admin password");
    }
    if (!bunnyConfig) {
      addToast("Upload config not ready. Please wait and retry.", "error");
      setShowPasswordModal(false);
      throw new Error("Bunny config not loaded");
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let finalThumbnailUrl = formData.thumbnailUrl;

      // ── Upload new thumbnail to Bunny if one was selected ──
      if (newThumbnailFile) {
        addToast("Uploading new thumbnail…", "info");

        const folderName = sanitizeFolderName(formData.title);
        const timestamp = Date.now();
        const thumbExt = newThumbnailFile.name.split(".").pop() || "jpg";
        const thumbPath = `reels/${folderName}/${timestamp}_thumbnail.${thumbExt}`;

        try {
          await uploadToBunnyDirect(newThumbnailFile, thumbPath, (pct) => {
            // thumbnail upload → 0–95% of the progress bar
            if (mountedRef.current) setUploadProgress(Math.round(pct * 0.95));
          });

          finalThumbnailUrl = `${bunnyConfig.pullZoneUrl}/${thumbPath}`;
          if (mountedRef.current) setUploadProgress(95);
          addToast("Thumbnail uploaded!", "success");
        } catch (thumbErr) {
          console.warn("Thumbnail upload failed (non-fatal):", thumbErr.message);
          addToast("Thumbnail upload failed — keeping existing thumbnail.", "warning");
          // keep whatever thumbnailUrl was before
        }
      }

      // ── DB save → 98–100% ──
      if (mountedRef.current) setUploadProgress(98);

      const payload = {
        ...formData,
        thumbnailUrl: finalThumbnailUrl,
        hashtags: (formData.hashtags || []).map((h) => (h.startsWith("#") ? h : `#${h}`)),
        updatedBy: user.id,
        updatedAt: new Date().toISOString(),
      };

      const targetId = reelId || formData._id;
      const response = await fetch(`/api/reels/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update reel");

      if (mountedRef.current) setUploadProgress(100);
      addToast("✅ Reel updated successfully!", "success", 5000);

      if (mountedRef.current) {
        setOriginalData(JSON.parse(JSON.stringify(payload)));
        setNewThumbnailFile(null);
        setNewThumbnailPreview(null);
        setHasChanges(false);
        setChangeLog([]);
        setShowPasswordModal(false);
        setUploadProgress(0);
      }

      if (onSuccess) setTimeout(() => onSuccess(), 1500);
    } catch (error) {
      console.error("Edit error:", error);
      if (mountedRef.current) setUploadProgress(0);
      addToast(error.message || "Something went wrong. Please try again.", "error");
      setShowPasswordModal(false);
      throw error;
    } finally {
      if (mountedRef.current) setIsSubmitting(false);
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
  // COMPUTED
  // -----------------------------------------------------------------------
  const currentSectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const overallProgress = Math.round(Object.values(sectionProgress).reduce((a, b) => a + b, 0) / SECTIONS.length);

  // -----------------------------------------------------------------------
  // LOADING STATE
  // -----------------------------------------------------------------------
  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
            <RefreshCw size={36} className="text-violet-600 dark:text-violet-400 animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading reel data…</p>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-2 sm:px-4 lg:px-6 w-full max-w-full overflow-x-hidden box-border">
      <div className="w-full max-w-7xl mx-auto overflow-hidden">
        {/* ── ADD: Bunny config error banner ── */}
        {configError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <p className="flex-1 text-sm text-red-700 dark:text-red-300 font-medium">
              Failed to load upload configuration. Thumbnail uploads won't work.
            </p>
            <button
              type="button"
              onClick={fetchBunnyConfig}
              className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}
        {/* CHANGE LOG BANNER */}
        <AnimatePresence>
          {hasChanges && changeLog.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex-shrink-0">
                  <PenTool size={18} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">
                    {changeLog.length} unsaved change{changeLog.length > 1 ? "s" : ""}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {changeLog.slice(0, 5).map((change, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs rounded-lg font-medium"
                      >
                        {change.field}
                      </span>
                    ))}
                    {changeLog.length > 5 && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg">
                        +{changeLog.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDiscardChanges}
                  className="text-xs text-gray-500 hover:text-red-500 font-medium flex items-center gap-1 flex-shrink-0"
                >
                  <Undo2 size={12} />
                  Revert All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CARD */}
        <div
          ref={formContainerRef}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* ============================================================ */}
          {/* HEADER */}
          {/* ============================================================ */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-4 md:p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="text-white min-w-0">
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3 flex-wrap">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <PenTool size={24} />
                  </div>
                  Edit Reel
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
                <p className="text-white/70 text-sm mt-1 truncate">
                  Editing: <span className="font-semibold text-white">{formData.title || "Untitled Reel"}</span>
                </p>
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
                </div>
                {/* ── ADD: upload progress bar (visible only while submitting) ── */}
                {isSubmitting && uploadProgress > 0 && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden max-w-[250px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white/90">
                      {uploadProgress < 95
                        ? `Uploading… ${uploadProgress}%`
                        : uploadProgress < 100
                          ? "Saving…"
                          : "Done!"}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {hasChanges && (
                  <button
                    type="button"
                    onClick={handleDiscardChanges}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all border border-white/20"
                  >
                    <Undo2 size={16} />
                    <span className="hidden sm:inline">Discard</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !hasChanges || isLoadingConfig || configError || !bunnyConfig}
                  className="px-5 py-2.5 bg-white text-violet-600 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="hidden sm:inline">
                        {uploadProgress > 0 ? `${uploadProgress}%` : "Saving..."}
                      </span>
                    </>
                  ) : isLoadingConfig ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="hidden sm:inline">Loading...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* REEL META BAR */}
          <div className="px-4 md:px-6 py-3 bg-violet-50 dark:bg-violet-900/10 border-b border-violet-100 dark:border-violet-900/30 flex flex-wrap items-center gap-4 text-xs">
            {formData._id && (
              <span className="flex items-center gap-1 text-gray-500">
                <Hash size={12} />
                ID: <span className="font-mono font-medium">{formData._id}</span>
              </span>
            )}
            {formData.category && (
              <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-full font-medium capitalize">
                {formData.category}
              </span>
            )}
            {formData.isActive ? (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle size={12} /> Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-gray-400 font-medium">
                <EyeOff size={12} /> Inactive
              </span>
            )}
            {formData.isFeatured && (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <Zap size={12} /> Featured
              </span>
            )}
            {formData.updatedAt && (
              <span className="text-gray-400 ml-auto">
                Last saved: {new Date(formData.updatedAt).toLocaleDateString()}
              </span>
            )}
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
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
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

          {/* SECTION NAV BAR */}
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
                    className="h-full bg-violet-500 rounded-full transition-all duration-300"
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
                <span className="hidden sm:inline">Revert Section</span>
              </button>
            </div>
          </div>

          {/* SECTION DESC */}
          {SECTIONS[currentSectionIndex]?.description && (
            <div className="px-4 md:px-6 py-3 bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-800">
              <p className="text-sm text-violet-700 dark:text-violet-300 flex items-center gap-2">
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
                  <EditBasicInfoSection
                    data={formData}
                    onChange={handleInputChange}
                    onListChange={handleListChange}
                    errors={errors}
                    categories={REEL_CATEGORIES}
                  />
                )}
                {activeSection === "media" && (
                  <EditMediaSection
                    data={formData}
                    onChange={handleInputChange}
                    newThumbnailFile={newThumbnailFile}
                    newThumbnailPreview={newThumbnailPreview}
                    onThumbnailUpload={handleThumbnailUpload}
                    onRemoveThumbnail={() => {
                      setNewThumbnailFile(null);
                      setNewThumbnailPreview(null);
                    }}
                    dragActiveThumbnail={dragActiveThumbnail}
                    setDragActiveThumbnail={setDragActiveThumbnail}
                    addToast={addToast}
                  />
                )}
                {activeSection === "details" && (
                  <EditDetailsSection
                    data={formData}
                    onChange={handleInputChange}
                    onListChange={handleListChange}
                    addToast={addToast}
                  />
                )}
                {activeSection === "engagement" && (
                  <EditEngagementSection data={formData} onChange={handleInputChange} />
                )}
                {activeSection === "settings" && (
                  <EditSettingsSection
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
          {/* FOOTER */}
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
                      ? "bg-violet-600 w-6 h-2"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 w-2 h-2"
                  }`}
                />
              ))}
            </div>

            {currentSectionIndex === SECTIONS.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !hasChanges || isLoadingConfig || configError || !bunnyConfig}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    {uploadProgress > 0 ? `${uploadProgress}%` : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigateSection(1)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all shadow-lg"
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* FLOATING SAVE BAR */}
        <AnimatePresence>
          {hasChanges && !isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 max-w-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                  <Bell size={18} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {changeLog.length} unsaved change{changeLog.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-gray-500">Save now to preserve your edits</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDiscardChanges}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm transition-all"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || isLoadingConfig || configError || !bunnyConfig}
                  className="px-5 py-2 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2 shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      {uploadProgress > 0 ? `${uploadProgress}%` : "..."}
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL */}
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
// SHARED PRIMITIVES (same design as AddReel but violet accent)
// ============================================================================

const Section = ({ title, icon: Icon, children, description, badge, tip }) => (
  <div className="space-y-4 mb-8">
    <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2.5 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex-shrink-0">
          <Icon size={20} className="text-violet-600 dark:text-violet-400" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {badge && (
        <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-semibold rounded-full flex-shrink-0">
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
      addToast("Copied!", "success");
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
          className={`w-full px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm ${Icon ? "pl-10" : prefix ? "pl-8" : ""} ${suffix || copyable ? "pr-10" : ""} ${
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 transition-colors"
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
      className={`w-full px-3 py-2.5 rounded-xl border-2 outline-none transition-all focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none ${
        error ? "border-red-400 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-600"
      }`}
      maxLength={maxLength}
      {...props}
    />
    <div className="flex justify-between mt-1.5">
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      {maxLength && (
        <p
          className={`text-xs ml-auto ${(props.value?.length || 0) > maxLength * 0.9 ? "text-orange-500 font-medium" : "text-gray-400"}`}
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
        checked
          ? "bg-violet-600 border-violet-600"
          : "border-gray-300 dark:border-gray-600 group-hover:border-violet-400"
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
            className={`flex-1 px-3 py-2.5 rounded-xl border-2 outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 bg-white dark:bg-gray-800 text-sm transition-all ${error ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}
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
            className={`flex-1 px-3 py-2.5 rounded-xl border-2 outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm transition-all ${error ? "border-red-400" : "border-gray-200 dark:border-gray-600"}`}
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
              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 max-w-[180px]"
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
                    className="w-full px-3 py-2.5 text-left text-sm hover:bg-violet-50 dark:hover:bg-violet-900/30 text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors"
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
// EDIT SECTION COMPONENTS
// ============================================================================

const EditBasicInfoSection = ({ data, onChange, errors, onListChange, categories }) => (
  <div className="space-y-8">
    <Section
      title="Reel Identity"
      icon={Film}
      description="Edit core reel information"
      badge="Required"
      tip="Updating the title and vendor association affects how this reel is displayed across the platform."
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
          copyable
        />
        <InputField
          label="Subcategory"
          value={data.subcategory || ""}
          onChange={(e) => onChange("subcategory", e.target.value)}
          placeholder="e.g., Luxury Venues"
          icon={Layers}
        />
       {/* Event Type */}
<CustomDropdown
  label="Event Type"
  placeholder="Select event type"
  options={REEL_TYPES}
  value={data.type}
  onChange={(val) =>
    setFormData((prev) => ({ ...prev, type: val, subtype: "" }))
  }
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
    setFormData((prev) => ({ ...prev, subtype: val }))
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
    setFormData((prev) => ({ ...prev, nestedType: val }))
  }
  error={errors.nestedType}
  icon={Film}
/>
<div className="md:col-span-2">
  <TagInput
    label="Nested Values"
    tags={data.nestedValues || []}
    onChange={(v) => onListChange("nestedValues", v)}
    placeholder="Add nested values and press Enter…"
  />
</div>
      </div>
    </Section>

    <Section title="Category" icon={Layers} badge="Required">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <motion.button
            key={cat.key}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange("category", cat.key)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all min-w-[85px] flex-shrink-0 ${
              data.category === cat.key
                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 shadow-lg shadow-violet-500/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-violet-300 hover:shadow-md"
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

const EditMediaSection = ({
  data,
  onChange,
  newThumbnailFile,
  newThumbnailPreview,
  onThumbnailUpload,
  onRemoveThumbnail,
  dragActiveThumbnail,
  setDragActiveThumbnail,
  addToast,
}) => (
  <div className="space-y-8">
    <Section
      title="Video URL"
      icon={Video}
      description="Update the video link for this reel"
      tip="Note: You can only update the video URL here. To replace the actual video file, delete this reel and create a new one."
    >
      <InputField
        label="Video URL"
        value={data.videoUrl || ""}
        onChange={(e) => onChange("videoUrl", e.target.value)}
        placeholder="https://youtube.com/... or direct video link"
        icon={Link}
        helperText="YouTube, Cloudinary, or any direct video URL"
      />

      {data.videoUrl && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 mb-2 font-medium flex items-center gap-1">
            <Eye size={12} /> Current Video Preview
          </p>
          <a
            href={data.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-2 font-medium"
          >
            <ExternalLink size={14} />
            {data.videoUrl.length > 60 ? data.videoUrl.substring(0, 60) + "…" : data.videoUrl}
          </a>
        </div>
      )}
    </Section>

    <Section title="Thumbnail" icon={ImageIcon} description="Update the reel thumbnail image">
      {/* Existing Thumbnail */}
      {data.thumbnailUrl && !newThumbnailPreview && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Thumbnail</p>
          <div className="relative w-40 aspect-[9/16] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
            <img src={data.thumbnailUrl} alt="Current Thumbnail" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 p-2">
              <p className="text-white text-[10px] text-center font-medium">Current</p>
            </div>
          </div>
        </div>
      )}

      {/* New Thumbnail Preview */}
      {newThumbnailPreview && (
        <div className="mb-4">
          <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2 flex items-center gap-1">
            <CheckCircle size={14} /> New Thumbnail (not saved yet)
          </p>
          <div className="relative w-40 aspect-[9/16] rounded-xl overflow-hidden border-2 border-green-400">
            <img src={newThumbnailPreview} alt="New Thumbnail" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onRemoveThumbnail}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Upload New */}
      <div
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
          dragActiveThumbnail
            ? "bg-violet-50 dark:bg-violet-900/30 border-violet-500"
            : "border-gray-300 dark:border-gray-600 hover:border-violet-400 hover:bg-gray-50 dark:hover:bg-gray-800"
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
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
          <UploadCloud className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {data.thumbnailUrl ? "Replace Thumbnail" : "Upload Thumbnail"}
        </p>
        <label
          htmlFor="editThumbnail"
          className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-violet-600 text-white rounded-xl cursor-pointer hover:bg-violet-700 transition-all text-sm font-medium"
        >
          <ImageIcon size={16} />
          Browse Image
        </label>
        <input
          id="editThumbnail"
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => onThumbnailUpload(e.target.files)}
        />
        <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP • Max 5MB</p>
      </div>

      {/* Thumbnail URL override */}
      <InputField
        label="Or paste Thumbnail URL directly"
        value={data.thumbnailUrl || ""}
        onChange={(e) => onChange("thumbnailUrl", e.target.value)}
        placeholder="https://..."
        icon={Link}
        className="mt-4"
        helperText="Overrides uploaded file if both provided"
      />
    </Section>

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
          placeholder="e.g., 0:45"
          icon={Clock}
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

const EditDetailsSection = ({ data, onChange, onListChange, addToast }) => (
  <div className="space-y-8">
    <Section title="Caption & Description" icon={FileText}>
      <InputField
        label="Caption"
        value={data.caption || ""}
        onChange={(e) => onChange("caption", e.target.value)}
        placeholder="✨ Dream wedding at Royal Palace Banquets…"
        maxLength={300}
        helperText={`${(data.caption || "").length}/300 characters`}
      />
      <TextArea
        label="Full Description"
        value={data.description || ""}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Detailed description…"
        rows={5}
        className="mt-4"
        maxLength={2000}
      />
    </Section>

    <Section title="Tags" icon={Tag}>
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
          "luxury",
        ]}
        placeholder="Add tags…"
      />
    </Section>

    <Section title="Hashtags" icon={Hash}>
      <TagInput
        label="Hashtags"
        tags={data.hashtags || []}
        onChange={(v) => onListChange("hashtags", v)}
        prefix="#"
        suggestions={[
          "#wedding",
          "#weddingphotography",
          "#indianwedding",
          "#reels",
          "#trending",
          "#bridetobe",
          "#weddingvenue",
        ]}
        placeholder="Add hashtags…"
      />
    </Section>

    <Section title="Language" icon={Globe}>
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
    </Section>
  </div>
);

const EditEngagementSection = ({ data, onChange }) => (
  <div className="space-y-8">
    <Section
      title="Engagement Stats"
      icon={BarChart3}
      description="Update engagement metrics"
      tip="These stats are displayed on the reel. They reflect current engagement levels."
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
          helperText="0–100"
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

    <Section title="Call to Action" icon={Target}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="CTA Button Text"
          value={data.ctaText || ""}
          onChange={(e) => onChange("ctaText", e.target.value)}
          placeholder="e.g., Book Now, View Venue"
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

const EditSettingsSection = ({ data, onChange, onListChange, addToast }) => (
  <div className="space-y-8">
    <Section
      title="Visibility & Status"
      icon={Eye}
      tip="Toggling Active off will immediately hide this reel from all users."
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
          value={data.publishedAt ? data.publishedAt.slice(0, 16) : ""}
          onChange={(e) => onChange("publishedAt", e.target.value)}
          icon={Clock}
        />
        <InputField
          label="Expires At"
          type="datetime-local"
          value={data.expiresAt ? data.expiresAt.slice(0, 16) : ""}
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
