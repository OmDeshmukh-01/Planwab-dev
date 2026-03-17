"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  Eye,
  TrendingUp,
  BarChart3,
  Film,
  Tag,
  Hash,
  Globe,
  Music,
  Navigation,
  Clock,
  Calendar,
  Building2,
  Camera,
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
  FileText,
  Zap,
  ExternalLink,
  AtSign,
  Layers,
  Info,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Share,
  Download,
  Flag,
  MoreVertical,
  Star,
  Verified,
  Link,
  ArrowLeft,
  ArrowRight,
  Settings,
  Shield,
  Users,
  Activity,
  PieChart,
  Target,
  Award,
  Flame,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react";

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
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        duration
      );
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
                className={`p-1 rounded-full flex-shrink-0 ${
                  toast.type === "success"
                    ? "bg-green-200 dark:bg-green-700"
                    : toast.type === "error"
                    ? "bg-red-200 dark:bg-red-700"
                    : toast.type === "warning"
                    ? "bg-yellow-200 dark:bg-yellow-700"
                    : "bg-blue-200 dark:bg-blue-700"
                }`}
              >
                {toast.type === "success" && <CheckCircle size={16} />}
                {toast.type === "error" && <AlertCircle size={16} />}
                {toast.type === "warning" && <AlertCircle size={16} />}
                {toast.type === "info" && <Info size={16} />}
              </div>
              <p className="flex-1 text-sm font-medium leading-relaxed">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

// ============================================================================
// MAIN EXPORT
// ============================================================================
export default function ViewReelTab({ reelId, reelData: initialReelData, onEdit, onDelete }) {
  return (
    <ToastProvider>
      <ViewReelContent
        reelId={reelId}
        initialReelData={initialReelData}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </ToastProvider>
  );
}

// ============================================================================
// CATEGORY CONFIG
// ============================================================================
const CATEGORY_CONFIG = {
  venues:        { label: "Venues",        icon: Building2,      color: "from-rose-500 to-pink-500" },
  photographers: { label: "Photographers", icon: Camera,         color: "from-purple-500 to-violet-500" },
  makeup:        { label: "Makeup",        icon: Paintbrush2,    color: "from-pink-500 to-fuchsia-500" },
  planners:      { label: "Planners",      icon: UserCheck,      color: "from-blue-500 to-cyan-500" },
  catering:      { label: "Catering",      icon: UtensilsCrossed,color: "from-orange-500 to-amber-500" },
  clothes:       { label: "Clothes",       icon: Shirt,          color: "from-teal-500 to-emerald-500" },
  mehendi:       { label: "Mehendi",       icon: Hand,           color: "from-green-500 to-lime-500" },
  cakes:         { label: "Cakes",         icon: CakeSlice,      color: "from-yellow-500 to-orange-500" },
  jewellery:     { label: "Jewellery",     icon: Gem,            color: "from-amber-500 to-yellow-500" },
  invitations:   { label: "Invitations",   icon: Mail,           color: "from-indigo-500 to-blue-500" },
  djs:           { label: "DJs",           icon: Music,          color: "from-violet-500 to-purple-500" },
  hairstyling:   { label: "Hairstyling",   icon: Scissors,       color: "from-cyan-500 to-blue-500" },
  decor:         { label: "Decorators",    icon: Lamp,           color: "from-fuchsia-500 to-pink-500" },
  dhol:          { label: "Dhol",          icon: Drum,           color: "from-red-500 to-rose-500" },
  anchor:        { label: "Anchor",        icon: MicVocal,       color: "from-sky-500 to-blue-500" },
  stageEntry:    { label: "Stage Entry",   icon: Sparkles,       color: "from-amber-500 to-orange-500" },
  fireworks:     { label: "Fireworks",     icon: FlameKindling,  color: "from-red-500 to-orange-500" },
  other:         { label: "Other",         icon: FileText,       color: "from-gray-500 to-slate-500" },
};

// ============================================================================
// UTILITY HELPERS
// ============================================================================
const formatNumber = (n) => {
  if (!n || isNaN(n)) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const timeSince = (dateStr) => {
  if (!dateStr) return "";
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

const isYouTubeUrl = (url) =>
  url && (url.includes("youtube.com") || url.includes("youtu.be"));

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  let videoId = null;
  try {
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("v=")) {
      videoId = new URL(url).searchParams.get("v");
    } else if (url.includes("/embed/")) {
      videoId = url.split("/embed/")[1]?.split("?")[0];
    }
  } catch {}
  return videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : null;
};

const isCloudinaryUrl = (url) => url && url.includes("cloudinary.com");

// ============================================================================
// VIDEO PLAYER
// ============================================================================
const VideoPlayer = ({ videoUrl, thumbnailUrl, title }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const controlsTimerRef = useRef(null);

  const isYT = isYouTubeUrl(videoUrl);
  const ytEmbedUrl = isYT ? getYouTubeEmbedUrl(videoUrl) : null;

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return;
    setIsStarted(true);
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      try {
        setIsLoading(true);
        await videoRef.current.play();
      } catch (e) {
        console.error("Play error:", e);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
    resetControlsTimer();
  }, [isPlaying, resetControlsTimer]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const handleSeek = useCallback((e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    videoRef.current.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  }, [duration]);

  const handleVolumeChange = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
      setIsMuted(v === 0);
    }
  }, []);

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  // YouTube embed
  if (isYT && ytEmbedUrl) {
    return (
      <div
        ref={containerRef}
        className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl"
        style={{ aspectRatio: "16/9" }}
      >
        <iframe
          src={ytEmbedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
            <Youtube size={12} />
            YouTube
          </span>
        </div>
      </div>
    );
  }

  // Native video player
  if (videoUrl && !isYT) {
    return (
      <div
        ref={containerRef}
        className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl group"
        style={{ aspectRatio: "9/16", maxHeight: "75vh" }}
        onMouseMove={resetControlsTimer}
        onTouchStart={resetControlsTimer}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          className="w-full h-full object-contain"
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={() =>
            setCurrentTime(videoRef.current?.currentTime || 0)
          }
          onDurationChange={() =>
            setDuration(videoRef.current?.duration || 0)
          }
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          onEnded={() => {
            setIsPlaying(false);
            setIsStarted(false);
            setShowControls(true);
          }}
        />

        {/* Thumbnail overlay before play */}
        {!isStarted && thumbnailUrl && (
          <div className="absolute inset-0">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 text-white">
            <AlertCircle size={40} className="text-red-400 mb-3" />
            <p className="font-semibold text-lg">Failed to load video</p>
            <p className="text-sm text-gray-400 mt-1 text-center px-4">
              Check the video URL or try again
            </p>
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-4 py-2 bg-white text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ExternalLink size={14} />
                Open in Browser
              </a>
            )}
          </div>
        )}

        {/* Center Play Button */}
        {!isPlaying && !isLoading && !hasError && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 shadow-2xl">
              <Play size={32} className="text-white ml-1" fill="white" />
            </div>
          </motion.button>
        )}

        {/* Controls Overlay */}
        <AnimatePresence>
          {(showControls || !isPlaying) && !hasError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 pt-12"
            >
              {/* Progress Bar */}
              <div
                className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-3 group/progress"
                onClick={handleSeek}
              >
                <div className="relative h-full">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
                    style={{ left: `calc(${progressPct}% - 6px)` }}
                  />
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                  >
                    {isPlaying ? (
                      <Pause size={20} fill="white" />
                    ) : (
                      <Play size={20} fill="white" />
                    )}
                  </button>

                  {/* Volume */}
                  <div
                    className="relative flex items-center gap-2"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </button>
                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 80 }}
                          exit={{ opacity: 0, width: 0 }}
                          className="overflow-hidden"
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 accent-white cursor-pointer"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Time */}
                  <span className="text-white text-xs font-medium tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  {isFullscreen ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click to play/pause when started */}
        {isStarted && !hasError && (
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={togglePlay}
            style={{ zIndex: 1 }}
          />
        )}
      </div>
    );
  }

  // Fallback: external link
  return (
    <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 dark:border-gray-700 min-h-[280px]">
      <div className="w-20 h-20 mb-4 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
        <Film size={36} className="text-rose-500" />
      </div>
      <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-1">
        No Video Available
      </p>
      <p className="text-gray-500 text-sm text-center mb-4">
        No video URL or file has been associated with this reel
      </p>
    </div>
  );
};

// ============================================================================
// STAT CARD
// ============================================================================
const StatCard = ({ icon: Icon, label, value, color = "rose", trend }) => {
  const colorMap = {
    rose:    "from-rose-500 to-pink-500 text-rose-600 bg-rose-50 dark:bg-rose-900/20",
    violet:  "from-violet-500 to-purple-500 text-violet-600 bg-violet-50 dark:bg-violet-900/20",
    blue:    "from-blue-500 to-cyan-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    green:   "from-green-500 to-emerald-500 text-green-600 bg-green-50 dark:bg-green-900/20",
    amber:   "from-amber-500 to-yellow-500 text-amber-600 bg-amber-50 dark:bg-amber-900/20",
    indigo:  "from-indigo-500 to-blue-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
  };
  const cls = colorMap[color] || colorMap.rose;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`p-2.5 rounded-xl ${cls.split(" ").slice(2).join(" ")}`}>
          <Icon size={20} className={cls.split(" ")[2]} />
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trend > 0
                ? "bg-green-100 text-green-700"
                : trend < 0
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
        {formatNumber(value)}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
        {label}
      </p>
    </motion.div>
  );
};

// ============================================================================
// BADGE
// ============================================================================
const Badge = ({ children, color = "gray", icon: Icon, size = "sm" }) => {
  const colorMap = {
    gray:   "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
    rose:   "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
    green:  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    blue:   "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    amber:  "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    violet: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
    red:    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  };
  const sizeMap = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${colorMap[color] || colorMap.gray} ${sizeMap[size]}`}
    >
      {Icon && <Icon size={size === "xs" ? 10 : size === "sm" ? 12 : 14} />}
      {children}
    </span>
  );
};

// ============================================================================
// SECTION CARD
// ============================================================================
const SectionCard = ({ title, icon: Icon, children, className = "", collapsible = false, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden ${className}`}>
      <div
        className={`flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 ${collapsible ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors" : ""}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-xl">
            <Icon size={18} className="text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h3>
        </div>
        {collapsible && (
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="p-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// INFO ROW
// ============================================================================
const InfoRow = ({ label, value, icon: Icon, copyable }) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(String(value));
      setCopied(true);
      addToast("Copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!value && value !== 0 && value !== false) return null;

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      {Icon && (
        <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 mt-0.5">
          <Icon size={13} className="text-gray-500 dark:text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium">{label}</p>
        <p className="text-sm text-gray-900 dark:text-white font-medium break-all">
          {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
        </p>
      </div>
      {copyable && (
        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
        >
          {copied ? (
            <CheckCircle size={14} className="text-green-500" />
          ) : (
            <Copy size={14} className="text-gray-400" />
          )}
        </button>
      )}
    </div>
  );
};

// ============================================================================
// ENGAGEMENT RING CHART (Pure CSS)
// ============================================================================
const EngagementRing = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {data.map((segment, i) => {
            if (segment.value === 0) return null;
            const pct = total > 0 ? (segment.value / total) * 100 : 0;
            const offset = 100 - cumulative;
            cumulative += pct;
            return (
              <circle
                key={i}
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={segment.color}
                strokeWidth="3.5"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={offset}
                className="transition-all duration-500"
              />
            );
          })}
          {total === 0 && (
            <circle
              cx="18" cy="18" r="15.9"
              fill="none" stroke="#e5e7eb" strokeWidth="3.5"
              strokeDasharray="100 0"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatNumber(total)}
          </span>
          <span className="text-[10px] text-gray-500">Total</span>
        </div>
      </div>
      <div className="flex-1 space-y-2 min-w-[140px]">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{d.label}</span>
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              {formatNumber(d.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SHARE MODAL
// ============================================================================
const ShareModal = ({ isOpen, onClose, reel }) => {
  const { addToast } = useToast();
  const reelUrl = typeof window !== "undefined"
    ? `${window.location.origin}/reels/${reel?._id || reel?.id}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(reelUrl);
    addToast("Link copied to clipboard!", "success");
  };

  const shareOptions = [
    {
      label: "WhatsApp",
      color: "bg-green-500 hover:bg-green-600",
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      href: `https://wa.me/?text=${encodeURIComponent(`${reel?.title} - ${reelUrl}`)}`,
    },
    {
      label: "Twitter / X",
      color: "bg-black hover:bg-gray-900",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(reel?.title)}&url=${encodeURIComponent(reelUrl)}`,
    },
    {
      label: "Facebook",
      color: "bg-blue-600 hover:bg-blue-700",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reelUrl)}`,
    },
    {
      label: "Instagram",
      color: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90",
      icon: Instagram,
      href: `https://www.instagram.com/`,
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Share2 size={18} className="text-rose-500" />
              Share Reel
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-5 space-y-4">
            {/* Reel Info */}
            {reel?.thumbnailUrl && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {reel.title}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {reel.category}
                  </p>
                </div>
              </div>
            )}

            {/* Copy Link */}
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-400 truncate font-mono">
                {reelUrl}
              </div>
              <button
                onClick={copyLink}
                className="px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>

            {/* Social Platforms */}
            <div>
              <p className="text-xs text-gray-500 font-medium mb-3">
                Share on social
              </p>
              <div className="grid grid-cols-2 gap-2">
                {shareOptions.map((opt) => (
                  <a
                    key={opt.label}
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 px-4 py-3 text-white text-sm font-semibold rounded-xl transition-all ${opt.color}`}
                  >
                    {typeof opt.icon === "function" ? (
                      opt.icon()
                    ) : (
                      <opt.icon size={18} />
                    )}
                    {opt.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// MAIN VIEW CONTENT
// ============================================================================
function ViewReelContent({ reelId, initialReelData, onEdit, onDelete }) {
  const { addToast } = useToast();
  const [reel, setReel] = useState(initialReelData || null);
  const [isFetching, setIsFetching] = useState(!initialReelData);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareModal, setShowShareModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);

  // Fetch if not provided
  useEffect(() => {
    if (initialReelData) {
      setReel(initialReelData);
      setLocalLikes(initialReelData.likeCount || 0);
      return;
    }
    if (!reelId) return;

    const fetchReel = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/reels/${reelId}`);
        if (!res.ok) throw new Error("Failed to fetch reel");
        const data = await res.json();
        const r = data.reel || data.data;
        setReel(r);
        setLocalLikes(r.likeCount || 0);
        setIsFetching(false);
      } catch (err) {
        addToast("Failed to load reel: " + err.message, "error");
        setIsFetching(false);
      } finally {
        setIsFetching(false);
      }
      setIsFetching(false);
    };
    fetchReel();
  }, [reelId, initialReelData]);

  const handleLike = useCallback(() => {
    setIsLiked((prev) => {
      const next = !prev;
      setLocalLikes((l) => (next ? l + 1 : Math.max(0, l - 1)));
      addToast(next ? "❤️ Reel liked!" : "Like removed", "info");
      return next;
    });
  }, [addToast]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked((prev) => {
      addToast(!prev ? "🔖 Reel saved!" : "Bookmark removed", "info");
      return !prev;
    });
  }, [addToast]);

  // -----------------------------------------------------------------------
  // LOADING
  // -----------------------------------------------------------------------
  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
            <RefreshCw size={36} className="text-rose-500 animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading reel…
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // NOT FOUND
  // -----------------------------------------------------------------------
  if (!reel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center">
            <Film size={36} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            Reel Not Found
          </h2>
          <p className="text-gray-500 text-sm">
            This reel doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // DERIVED DATA
  // -----------------------------------------------------------------------
  const catConfig = CATEGORY_CONFIG[reel.category] || CATEGORY_CONFIG.other;
  const CatIcon = catConfig.icon;

  const engagementData = [
    { label: "Views",    value: reel.viewCount    || 0, color: "#6366f1" },
    { label: "Likes",    value: localLikes,              color: "#f43f5e" },
    { label: "Shares",   value: reel.shareCount   || 0, color: "#8b5cf6" },
    { label: "Comments", value: reel.commentCount || 0, color: "#f59e0b" },
    { label: "Saves",    value: reel.saveCount    || 0, color: "#10b981" },
  ];

  const engagementRate =
    reel.viewCount > 0
      ? (
          ((localLikes + (reel.shareCount || 0) + (reel.commentCount || 0)) /
            reel.viewCount) *
          100
        ).toFixed(1)
      : "0.0";

  const tabs = [
    { id: "overview",    label: "Overview",    icon: Info },
    { id: "analytics",   label: "Analytics",   icon: BarChart3 },
    { id: "details",     label: "Details",     icon: FileText },
    { id: "settings",    label: "Settings",    icon: Settings },
  ];

  // -----------------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-2 sm:px-4 lg:px-6 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto">

        {/* ================================================================ */}
        {/* HEADER BANNER */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-2xl overflow-hidden mb-6 shadow-xl bg-gradient-to-r ${catConfig.color}`}
        >
          {/* BG Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]" />

          {/* Thumbnail faded bg */}
          {reel.thumbnailUrl && (
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
            />
          )}

          <div className="relative z-10 p-5 md:p-7">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Left: Meta */}
              <div className="flex-1 min-w-0">
                {/* Category badge */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                    <CatIcon size={12} />
                    {catConfig.label}
                  </span>
                  {reel.isActive && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500/30 text-white text-xs font-medium rounded-full border border-green-400/40">
                      <CheckCircle size={10} />
                      Active
                    </span>
                  )}
                  {reel.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/30 text-white text-xs font-medium rounded-full border border-amber-400/40">
                      <Star size={10} />
                      Featured
                    </span>
                  )}
                  {reel.isSponsored && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/30 text-white text-xs font-medium rounded-full border border-blue-400/40">
                      <Shield size={10} />
                      Sponsored
                    </span>
                  )}
                  {reel.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/30 text-white text-xs font-medium rounded-full border border-purple-400/40">
                      <Flag size={10} />
                      Pinned
                    </span>
                  )}
                  {reel.type && (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 text-white text-xs font-medium rounded-full border border-white/25">
    <Layers size={10} />
    {reel.type}
    {reel.subtype ? ` › ${reel.subtype}` : ""}
    {reel.nestedType ? ` › ${reel.nestedType}` : ""}
  </span>
)}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {reel.title}
                </h1>

                {reel.vendorName && (
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-white/80 text-sm">
                      By{" "}
                      <span className="font-semibold text-white">
                        {reel.vendorName}
                      </span>
                    </p>
                    {reel.vendorUsername && (
                      <span className="text-white/60 text-xs">
                        @{reel.vendorUsername}
                      </span>
                    )}
                  </div>
                )}

                {/* Quick Stats Strip */}
                <div className="flex items-center gap-4 mt-4 flex-wrap">
                  {[
                    { icon: Eye,         v: reel.viewCount    || 0 },
                    { icon: Heart,       v: localLikes },
                    { icon: Share2,      v: reel.shareCount   || 0 },
                    { icon: MessageCircle,v: reel.commentCount || 0 },
                    { icon: Bookmark,    v: reel.saveCount    || 0 },
                  ].map(({ icon: Ic, v }, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-white/90">
                      <Ic size={14} />
                      <span className="text-sm font-semibold">{formatNumber(v)}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 text-white/70 text-xs ml-auto">
                    <Clock size={12} />
                    {timeSince(reel.publishedAt || reel.createdAt)}
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap md:flex-col md:items-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isLiked
                      ? "bg-white text-rose-600 shadow-lg"
                      : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                  }`}
                >
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                  {isLiked ? "Liked" : "Like"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/20 text-white border border-white/30 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all"
                >
                  <Share2 size={16} />
                  Share
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isBookmarked
                      ? "bg-white text-amber-600 shadow-lg"
                      : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                  }`}
                >
                  <Bookmark
                    size={16}
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </motion.button>

                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(reel)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all shadow-lg"
                  >
                    <Settings size={16} />
                    Edit
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================================================================ */}
        {/* MAIN LAYOUT */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ============================================================ */}
          {/* LEFT / CENTER: Video + Tabs */}
          {/* ============================================================ */}
          <div className="xl:col-span-2 space-y-6">

            {/* VIDEO PLAYER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <VideoPlayer
                videoUrl={reel.videoUrl}
                thumbnailUrl={reel.thumbnailUrl}
                title={reel.title}
              />
            </motion.div>

            {/* QUICK STAT CARDS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              <StatCard icon={Eye}         label="Total Views"    value={reel.viewCount    || 0} color="indigo" />
              <StatCard icon={Heart}       label="Total Likes"    value={localLikes}              color="rose"   />
              <StatCard icon={Share2}      label="Total Shares"   value={reel.shareCount   || 0} color="violet" />
              <StatCard icon={MessageCircle} label="Comments"     value={reel.commentCount || 0} color="amber"  />
              <StatCard icon={Bookmark}    label="Saves"          value={reel.saveCount    || 0} color="green"  />
              <StatCard icon={TrendingUp}  label="Engagement Rate" value={parseFloat(engagementRate)} color="blue" />
            </motion.div>

            {/* TABS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              {/* Tab Bar */}
              <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-700 p-1.5 gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      activeTab === tab.id
                        ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon size={15} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-5"
                >

                  {/* ---------------------------------------------------- */}
                  {/* OVERVIEW TAB */}
                  {/* ---------------------------------------------------- */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Caption */}
                      {reel.caption && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Caption
                          </h4>
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm">
                            {reel.caption}
                          </p>
                        </div>
                      )}

                      {/* Description */}
                      {reel.description && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Description
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                            {reel.description}
                          </p>
                        </div>
                      )}

                      {/* Hashtags */}
                      {reel.hashtags?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Hash size={12} />
                            Hashtags
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {reel.hashtags.map((h, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg border border-blue-200 dark:border-blue-800"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {reel.tags?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Tag size={12} />
                            Tags
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {reel.tags.map((t, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Location & Music */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(reel.location || reel.city) && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex-shrink-0">
                              <Navigation size={14} className="text-rose-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Location</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {reel.location}
                                {reel.location && reel.city ? ", " : ""}
                                {reel.city}
                              </p>
                            </div>
                          </div>
                        )}
                        {reel.musicTitle && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl">
                            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex-shrink-0">
                              <Music size={14} className="text-violet-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-0.5">Music</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {reel.musicTitle}
                              </p>
                              {reel.musicArtist && (
                                <p className="text-xs text-gray-500">
                                  {reel.musicArtist}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ── ADD: Classification Strip ── */}
{(reel.type || reel.subtype || reel.nestedType) && (
  <div className="flex flex-wrap gap-2">
    {reel.type && (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
        <Layers size={12} className="text-indigo-500" />
        <span className="text-xs text-indigo-500 font-medium">Type:</span>
        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{reel.type}</span>
      </div>
    )}
    {reel.subtype && (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl">
        <Layers size={12} className="text-violet-500" />
        <span className="text-xs text-violet-500 font-medium">Subtype:</span>
        <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">{reel.subtype}</span>
      </div>
    )}
    {reel.nestedType && (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
        <Layers size={12} className="text-purple-500" />
        <span className="text-xs text-purple-500 font-medium">Nested Type:</span>
        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">{reel.nestedType}</span>
      </div>
    )}
  </div>
)}

{/* ── ADD: Nested Values in Overview ── */}
{reel.nestedValues?.length > 0 && (
  <div>
    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
      <Layers size={12} />
      Nested Values
    </h4>
    <div className="flex flex-wrap gap-2">
      {reel.nestedValues.map((v, i) => (
        <span
          key={i}
          className="px-2.5 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-lg border border-violet-200 dark:border-violet-800"
        >
          {v}
        </span>
      ))}
    </div>
  </div>
)}

                      {/* CTA */}
                      {reel.ctaText && reel.ctaLink && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Call to Action
                          </h4>
                          <a
                            href={reel.ctaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl text-sm font-bold hover:from-rose-700 hover:to-pink-700 transition-all shadow-lg shadow-rose-500/25"
                          >
                            <Target size={15} />
                            {reel.ctaText}
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      )}

                      {/* Social Links */}
                      {(reel.socialLinks?.instagram || reel.socialLinks?.youtube) && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Social Links
                          </h4>
                          <div className="flex gap-2 flex-wrap">
                            {reel.socialLinks?.instagram && (
                              <a
                                href={reel.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
                              >
                                <Instagram size={14} />
                                Instagram
                              </a>
                            )}
                            {reel.socialLinks?.youtube && (
                              <a
                                href={reel.socialLinks.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors"
                              >
                                <Youtube size={14} />
                                YouTube
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ---------------------------------------------------- */}
                  {/* ANALYTICS TAB */}
                  {/* ---------------------------------------------------- */}
                  {activeTab === "analytics" && (
                    <div className="space-y-6">
                      {/* Engagement Ring */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Engagement Breakdown
                        </h4>
                        <EngagementRing data={engagementData} />
                      </div>

                      {/* Engagement Rate */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl border border-rose-200 dark:border-rose-800">
                          <p className="text-xs text-rose-600 font-semibold mb-1">
                            Engagement Rate
                          </p>
                          <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                            {engagementRate}%
                          </p>
                          <p className="text-xs text-rose-500 mt-1">
                            interactions / views
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl border border-violet-200 dark:border-violet-800">
                          <p className="text-xs text-violet-600 font-semibold mb-1">
                            Priority Score
                          </p>
                          <p className="text-2xl font-bold text-violet-700 dark:text-violet-300">
                            {reel.priority || 0}
                            <span className="text-sm font-normal text-violet-500">
                              /100
                            </span>
                          </p>
                          <div className="mt-2 h-1.5 bg-violet-200 dark:bg-violet-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-500 rounded-full"
                              style={{ width: `${reel.priority || 0}%` }}
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                          <p className="text-xs text-amber-600 font-semibold mb-1">
                            Save Rate
                          </p>
                          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                            {reel.viewCount > 0
                              ? (
                                  ((reel.saveCount || 0) / reel.viewCount) *
                                  100
                                ).toFixed(1)
                              : "0.0"}
                            %
                          </p>
                          <p className="text-xs text-amber-500 mt-1">
                            saves / views
                          </p>
                        </div>
                      </div>

                      {/* Per-stat bars */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Stat Distribution
                        </h4>
                        <div className="space-y-3">
                          {engagementData.map((d, i) => {
                            const total =
                              engagementData.reduce((s, x) => s + x.value, 0) || 1;
                            const pct = Math.round((d.value / total) * 100);
                            return (
                              <div key={i} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {d.label}
                                  </span>
                                  <span className="font-bold text-gray-900 dark:text-white">
                                    {formatNumber(d.value)}{" "}
                                    <span className="text-gray-400 font-normal">
                                      ({pct}%)
                                    </span>
                                  </span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: d.color }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Flags */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Content Flags
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { label: "Comments",  val: reel.allowComments !== false,  color: "green"  },
                            { label: "Sharing",   val: reel.allowSharing !== false,    color: "blue"   },
                            { label: "Download",  val: reel.allowDownload || false,    color: "violet" },
                            { label: "Age 18+",   val: reel.ageRestriction || false,  color: "red"    },
                          ].map(({ label, val, color }) => (
                            <div
                              key={label}
                              className={`p-3 rounded-xl text-center border ${
                                val
                                  ? color === "red"
                                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                              }`}
                            >
                              <div
                                className={`text-lg font-bold ${
                                  val
                                    ? color === "red"
                                      ? "text-red-600"
                                      : "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {val ? "✓" : "✗"}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">
                                {label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ---------------------------------------------------- */}
                  {/* DETAILS TAB */}
                  {/* ---------------------------------------------------- */}
                  {activeTab === "details" && (
                    <div className="space-y-6">
                      {/* Vendor Info */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Vendor Information
                        </h4>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <InfoRow label="Vendor Name"     value={reel.vendorName}     icon={Building2} />
                          <InfoRow label="Vendor ID"       value={reel.vendorId}       icon={Hash}      copyable />
                          <InfoRow label="Vendor Username" value={reel.vendorUsername} icon={AtSign}    copyable />
                          <InfoRow label="Subcategory"     value={reel.subcategory}    icon={Layers} />
                          <InfoRow label="Type"            value={reel.type}           icon={Layers} />
<InfoRow label="Subtype"         value={reel.subtype}        icon={Layers} />
<InfoRow label="Nested Type"     value={reel.nestedType}     icon={Layers} />
                        </div>
                      </div>

                      {/* ── ADD: Nested Values ── */}
{reel.nestedValues?.length > 0 && (
  <div>
    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
      Nested Values
    </h4>
    <div className="flex flex-wrap gap-2">
      {reel.nestedValues.map((v, i) => (
        <span
          key={i}
          className="px-2.5 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-lg border border-violet-200 dark:border-violet-800"
        >
          {v}
        </span>
      ))}
    </div>
  </div>
)}

                      {/* Video Info */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Video Information
                        </h4>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <InfoRow label="Video URL"    value={reel.videoUrl}    icon={Link}  copyable />
                          <InfoRow label="Thumbnail URL" value={reel.thumbnailUrl} icon={Link} copyable />
                          <InfoRow label="Duration"     value={reel.duration}    icon={Clock} />
                          <InfoRow label="Aspect Ratio" value={reel.aspectRatio} icon={Layers} />
                          <InfoRow label="Resolution"   value={reel.resolution}  icon={Activity} />
                          <InfoRow label="Language"     value={reel.language}    icon={Globe} />
                        </div>
                      </div>

                      {/* CTA & Music */}
                      {(reel.ctaText || reel.musicTitle) && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Additional Info
                          </h4>
                          <div className="divide-y divide-gray-100 dark:divide-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <InfoRow label="CTA Button"  value={reel.ctaText}    icon={Target} />
                            <InfoRow label="CTA Link"    value={reel.ctaLink}    icon={Link}   copyable />
                            <InfoRow label="Music"       value={reel.musicTitle} icon={Music} />
                            <InfoRow label="Artist"      value={reel.musicArtist} icon={MicVocal} />
                            <InfoRow label="Location"    value={reel.location}   icon={Navigation} />
                            <InfoRow label="City"        value={reel.city}       icon={Navigation} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ---------------------------------------------------- */}
                  {/* SETTINGS TAB */}
                  {/* ---------------------------------------------------- */}
                  {activeTab === "settings" && (
                    <div className="space-y-6">
                      {/* Status Flags */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Status & Visibility
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Active",          val: reel.isActive !== false,   color: "green" },
                            { label: "Featured",        val: reel.isFeatured || false,   color: "amber" },
                            { label: "Sponsored",       val: reel.isSponsored || false,  color: "blue"  },
                            { label: "Pinned",          val: reel.isPinned || false,     color: "violet" },
                            { label: "Allow Comments",  val: reel.allowComments !== false, color: "green" },
                            { label: "Allow Sharing",   val: reel.allowSharing !== false,  color: "green" },
                            { label: "Allow Download",  val: reel.allowDownload || false,  color: "green" },
                            { label: "Age Restricted",  val: reel.ageRestriction || false, color: "red"  },
                          ].map(({ label, val, color }) => (
                            <div
                              key={label}
                              className={`flex items-center justify-between p-3 rounded-xl border ${
                                val
                                  ? color === "red"
                                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                    : color === "amber"
                                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                                    : color === "blue"
                                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                                    : color === "violet"
                                    ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800"
                                    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                              }`}
                            >
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {label}
                              </span>
                              <span
                                className={`text-xs font-bold ${
                                  val
                                    ? color === "red"
                                      ? "text-red-600"
                                      : color === "amber"
                                      ? "text-amber-600"
                                      : color === "blue"
                                      ? "text-blue-600"
                                      : color === "violet"
                                      ? "text-violet-600"
                                      : "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {val ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Scheduling */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Scheduling
                        </h4>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <InfoRow label="Published At" value={formatDateTime(reel.publishedAt || reel.createdAt)} icon={Calendar} />
                          <InfoRow label="Expires At"   value={reel.expiresAt ? formatDateTime(reel.expiresAt) : "Never"} icon={Flag} />
                          <InfoRow label="Last Updated" value={formatDateTime(reel.updatedAt)} icon={RefreshCw} />
                          <InfoRow label="Added By"     value={reel.addedBy}  icon={Users}   copyable />
                          <InfoRow label="Updated By"   value={reel.updatedBy} icon={Users}  copyable />
                        </div>
                      </div>

                      {/* Admin Actions */}
                      {(onEdit || onDelete) && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Admin Actions
                          </h4>
                          <div className="flex gap-3 flex-wrap">
                            {onEdit && (
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onEdit(reel)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20"
                              >
                                <Settings size={15} />
                                Edit This Reel
                              </motion.button>
                            )}
                            {onDelete && (
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                  if (window.confirm(`Delete "${reel.title}"? This cannot be undone.`)) {
                                    onDelete(reel._id || reel.id);
                                  }
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                              >
                                <X size={15} />
                                Delete Reel
                              </motion.button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDEBAR */}
          {/* ============================================================ */}
          <div className="space-y-4">

            {/* REEL ID CARD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SectionCard title="Reel Identity" icon={Film}>
                <InfoRow label="Reel ID"   value={reel._id || reel.id}  icon={Hash}      copyable />
                <InfoRow label="Category"  value={catConfig.label}      icon={CatIcon} />
                <InfoRow label="Language"  value={reel.language}        icon={Globe} />
                <InfoRow label="Priority"  value={`${reel.priority || 0} / 100`} icon={TrendingUp} />
                {reel.duration && (
                  <InfoRow label="Duration" value={reel.duration} icon={Clock} />
                )}
                {reel.aspectRatio && (
                  <InfoRow label="Ratio" value={reel.aspectRatio} icon={Layers} />
                )}
                {reel.aspectRatio && (
  <InfoRow label="Ratio" value={reel.aspectRatio} icon={Layers} />
)}
{/* ── ADD ── */}
{reel.type && (
  <InfoRow label="Type"        value={reel.type}       icon={Layers} />
)}
{reel.subtype && (
  <InfoRow label="Subtype"     value={reel.subtype}    icon={Layers} />
)}
{reel.nestedType && (
  <InfoRow label="Nested Type" value={reel.nestedType} icon={Layers} />
)}
              </SectionCard>
            </motion.div>

            {/* VENDOR CARD */}
            {(reel.vendorName || reel.vendorId) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <SectionCard title="Vendor" icon={Building2}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${catConfig.color} flex items-center justify-center flex-shrink-0`}>
                      <CatIcon size={22} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                        {reel.vendorName || "Unknown Vendor"}
                      </p>
                      {reel.vendorUsername && (
                        <p className="text-xs text-gray-500 truncate">
                          @{reel.vendorUsername}
                        </p>
                      )}
                    </div>
                  </div>
                  <InfoRow label="Vendor ID" value={reel.vendorId} icon={Hash} copyable />
                  {reel.city && <InfoRow label="City" value={reel.city} icon={Navigation} />}
                </SectionCard>
              </motion.div>
            )}

            {/* DATES CARD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SectionCard title="Timeline" icon={Calendar}>
                <InfoRow label="Published"   value={formatDate(reel.publishedAt || reel.createdAt)} icon={Calendar} />
                <InfoRow label="Last Updated" value={formatDate(reel.updatedAt)}  icon={RefreshCw} />
                {reel.expiresAt && (
                  <InfoRow label="Expires" value={formatDate(reel.expiresAt)} icon={Flag} />
                )}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500">
                    Published{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {timeSince(reel.publishedAt || reel.createdAt)}
                    </span>
                  </p>
                </div>
              </SectionCard>
            </motion.div>

            {/* BADGES / STATUS CARD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <SectionCard title="Status Badges" icon={Award}>
                <div className="flex flex-wrap gap-2">
                  <Badge color={reel.isActive !== false ? "green" : "gray"} icon={CheckCircle}>
                    {reel.isActive !== false ? "Active" : "Inactive"}
                  </Badge>
                  {reel.isFeatured && <Badge color="amber" icon={Star}>Featured</Badge>}
                  {reel.isSponsored && <Badge color="blue" icon={Shield}>Sponsored</Badge>}
                  {reel.isPinned && <Badge color="violet" icon={Flag}>Pinned</Badge>}
                  {reel.ageRestriction && <Badge color="red">18+</Badge>}
                  {reel.allowComments !== false && <Badge color="green">Comments On</Badge>}
                  {reel.allowSharing !== false && <Badge color="green">Sharing On</Badge>}
                  {reel.allowDownload && <Badge color="indigo">Download On</Badge>}
                </div>
              </SectionCard>
            </motion.div>

            {/* MUSIC & CTA CARD */}
            {(reel.musicTitle || reel.ctaText) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <SectionCard title="Music & CTA" icon={Music}>
                  {reel.musicTitle && (
                    <div className="flex items-center gap-3 mb-3 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                      <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                        <Music size={14} className="text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {reel.musicTitle}
                        </p>
                        {reel.musicArtist && (
                          <p className="text-xs text-gray-500">{reel.musicArtist}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {reel.ctaText && reel.ctaLink && (
                    <a
                      href={reel.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      <Zap size={14} />
                      {reel.ctaText}
                    </a>
                  )}
                </SectionCard>
              </motion.div>
            )}

            {/* SOCIAL LINKS CARD */}
            {(reel.socialLinks?.instagram || reel.socialLinks?.youtube) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <SectionCard title="Social Links" icon={Globe}>
                  <div className="space-y-2">
                    {reel.socialLinks?.instagram && (
                      <a
                        href={reel.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:opacity-90 transition-opacity group"
                      >
                        <Instagram size={18} className="text-pink-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          Instagram Post
                        </span>
                        <ExternalLink size={12} className="text-gray-400 ml-auto flex-shrink-0 group-hover:text-pink-500 transition-colors" />
                      </a>
                    )}
                    {reel.socialLinks?.youtube && (
                      <a
                        href={reel.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 hover:opacity-90 transition-opacity group"
                      >
                        <Youtube size={18} className="text-red-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          YouTube Video
                        </span>
                        <ExternalLink size={12} className="text-gray-400 ml-auto flex-shrink-0 group-hover:text-red-500 transition-colors" />
                      </a>
                    )}
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* TAGS CARD */}
            {(reel.tags?.length > 0 || reel.hashtags?.length > 0) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <SectionCard title="Tags & Hashtags" icon={Tag} collapsible defaultOpen={false}>
                  {reel.tags?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2 font-medium">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {reel.tags.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {reel.hashtags?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-medium">Hashtags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {reel.hashtags.map((h, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-lg border border-blue-200 dark:border-blue-800">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </SectionCard>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* SHARE MODAL */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        reel={reel}
      />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}