import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  ArrowLeft,
  MoreVertical,
  X,
  Play,
  Pause,
  MapPin,
  Star,
  Users,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Package,
  Shield,
  Sparkles,
  Edit3,
  Check,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Phone,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

// Post type configurations
const POST_CONFIGS = {
  1: {
    title: "Work Details",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    fields: [
      { key: "caption", label: "Caption", type: "textarea", required: true },
      { key: "googleRating", label: "Google Rating", type: "number", min: 0, max: 5, step: 0.1, required: true },
      { key: "teamSize", label: "Team Size", type: "number", min: 1, required: true },
      { key: "servicesDone", label: "Services Completed", type: "number", min: 0, required: true },
      { key: "yearsOfExperience", label: "Years of Experience", type: "number", min: 0, required: true },
      { key: "location", label: "Location", type: "text", required: true },
    ],
  },
  2: {
    title: "All Service Breakdown",
    icon: Package,
    color: "from-purple-500 to-pink-500",
    fields: [
      { key: "caption", label: "Caption", type: "textarea", required: true },
      { key: "eventIncludes", label: "Event Includes (Categories)", type: "array", required: true },
      { key: "subCategories", label: "Sub Categories", type: "array", required: false },
    ],
  },
  3: {
    title: "Pricing and Packages",
    icon: DollarSign,
    color: "from-green-500 to-emerald-500",
    fields: [
      { key: "basePriceMin", label: "Base Price (Min)", type: "number", min: 0, required: true },
      { key: "basePriceMax", label: "Base Price (Max)", type: "number", min: 0, required: true },
      { key: "packages", label: "Packages", type: "packages", required: false },
    ],
  },
  4: {
    title: "Trust & Real Events",
    icon: Shield,
    color: "from-amber-500 to-orange-500",
    fields: [
      { key: "usp", label: "Unique Selling Points", type: "array", required: true },
      { key: "callToAction", label: "Call to Action (3 items)", type: "cta", maxItems: 3, required: true },
    ],
  },
};

// Validation functions
const validateField = (field, value) => {
  if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
    return `${field.label} is required`;
  }

  if (field.type === "number") {
    const num = parseFloat(value);
    if (isNaN(num)) return `${field.label} must be a number`;
    if (field.min !== undefined && num < field.min) return `${field.label} must be at least ${field.min}`;
    if (field.max !== undefined && num > field.max) return `${field.label} must be at most ${field.max}`;
  }

  if (field.key === "googleRating") {
    const rating = parseFloat(value);
    if (rating < 0 || rating > 5) return "Rating must be between 0 and 5";
  }

  if (field.type === "cta" && Array.isArray(value)) {
    if (value.length !== 3) return "Exactly 3 call-to-action items required";
  }

  return null;
};

// Content Form Component
const PostContentForm = ({ postNumber, initialData, onSubmit, onCancel, isSubmitting }) => {
  const config = POST_CONFIGS[postNumber];
  const [formData, setFormData] = useState(() => {
    const initial = {};
    config.fields.forEach((field) => {
      if (field.type === "array" || field.type === "cta") {
        initial[field.key] = initialData?.[field.key] || [];
      } else if (field.type === "packages") {
        initial[field.key] = initialData?.[field.key] || [];
      } else {
        initial[field.key] = initialData?.[field.key] || "";
      }
    });
    return initial;
  });
  const [errors, setErrors] = useState({});
  const [arrayInput, setArrayInput] = useState({});

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleArrayAdd = (key, maxItems) => {
    const inputValue = arrayInput[key]?.trim();
    if (!inputValue) return;

    if (maxItems && formData[key].length >= maxItems) {
      setErrors((prev) => ({ ...prev, [key]: `Maximum ${maxItems} items allowed` }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], inputValue],
    }));
    setArrayInput((prev) => ({ ...prev, [key]: "" }));
  };

  const handleArrayRemove = (key, index) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const handlePackageAdd = () => {
    setFormData((prev) => ({
      ...prev,
      packages: [...prev.packages, { title: "", priceMin: "", priceMax: "" }],
    }));
  };

  const handlePackageChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg)),
    }));
  };

  const handlePackageRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    config.fields.forEach((field) => {
      const error = validateField(field, formData[field.key]);
      if (error) newErrors[field.key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-2xl overflow-hidden shadow-xl max-h-[80vh] flex flex-col"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <IconComponent size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{config.title}</h3>
            <p className="text-white/70 text-xs">Post {postNumber} of 4</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        {config.fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "textarea" && (
              <textarea
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors[field.key] ? "border-red-500" : "border-gray-200"
                }`}
                rows={3}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}

            {field.type === "text" && (
              <input
                type="text"
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors[field.key] ? "border-red-500" : "border-gray-200"
                }`}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={formData[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                min={field.min}
                max={field.max}
                step={field.step || 1}
                className={`w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors[field.key] ? "border-red-500" : "border-gray-200"
                }`}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}

            {(field.type === "array" || field.type === "cta") && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={arrayInput[field.key] || ""}
                    onChange={(e) => setArrayInput((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleArrayAdd(field.key, field.maxItems);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Add ${field.label.toLowerCase()}...`}
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayAdd(field.key, field.maxItems)}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    <Plus size={18} className="text-gray-600" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData[field.key].map((item, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove(field.key, index)}
                        className="w-4 h-4 rounded-full bg-gray-300 hover:bg-red-400 flex items-center justify-center transition-colors"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </motion.span>
                  ))}
                </div>
                {field.maxItems && (
                  <p className="text-xs text-gray-500">
                    {formData[field.key].length} / {field.maxItems} items
                  </p>
                )}
              </div>
            )}

            {field.type === "packages" && (
              <div className="space-y-3">
                {formData.packages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gray-50 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">Package {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handlePackageRemove(index)}
                        className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={pkg.title}
                      onChange={(e) => handlePackageChange(index, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Package title..."
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={pkg.priceMin}
                        onChange={(e) => handlePackageChange(index, "priceMin", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        placeholder="Min price"
                        min={0}
                      />
                      <input
                        type="number"
                        value={pkg.priceMax}
                        onChange={(e) => handlePackageChange(index, "priceMax", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        placeholder="Max price"
                        min={0}
                      />
                    </div>
                  </motion.div>
                ))}
                <button
                  type="button"
                  onClick={handlePackageAdd}
                  className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Package
                </button>
              </div>
            )}

            {errors[field.key] && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                <AlertCircle size={12} />
                {errors[field.key]}
              </motion.p>
            )}
          </div>
        ))}
      </form>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex-1 py-2.5 bg-gradient-to-r ${config.color} rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-all ${
            isSubmitting ? "opacity-70" : "hover:shadow-lg"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check size={16} />
              Save Details
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// Content Display Components for each post type
const WorkDetailsContent = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.caption && <p className="text-gray-600 text-sm leading-relaxed">{data.caption}</p>}

      <div className="grid grid-cols-2 gap-3">
        {data.googleRating !== undefined && (
          <div className="bg-amber-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              <span className="text-xs text-amber-600 font-medium">Google Rating</span>
            </div>
            <p className="text-2xl font-bold text-amber-700">{data.googleRating}</p>
          </div>
        )}

        {data.teamSize && (
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">Team Size</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{data.teamSize}</p>
          </div>
        )}

        {data.servicesDone !== undefined && (
          <div className="bg-green-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase size={16} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">Services Done</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{data.servicesDone?.toLocaleString()}</p>
          </div>
        )}

        {data.yearsOfExperience !== undefined && (
          <div className="bg-purple-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} className="text-purple-500" />
              <span className="text-xs text-purple-600 font-medium">Experience</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">{data.yearsOfExperience} yrs</p>
          </div>
        )}
      </div>

      {data.location && (
        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 rounded-xl p-3">
          <MapPin size={18} className="text-gray-400" />
          <span className="text-sm">{data.location}</span>
        </div>
      )}
    </div>
  );
};

const ServiceBreakdownContent = ({ data }) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (index) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-4">
      {data.caption && <p className="text-gray-600 text-sm leading-relaxed">{data.caption}</p>}

      {data.eventIncludes && data.eventIncludes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Package size={16} className="text-purple-500" />
            Event Includes
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.eventIncludes.map((item, index) => (
              <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.subCategories && data.subCategories.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => toggleCategory("sub")}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-800">Sub Categories</span>
            <motion.div animate={{ rotate: expandedCategories["sub"] ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={18} className="text-gray-500" />
            </motion.div>
          </button>
          <AnimatePresence>
            {expandedCategories["sub"] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-2">
                  {data.subCategories.map((item, index) => (
                    <span key={index} className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const PricingContent = ({ data }) => {
  return (
    <div className="space-y-4">
      {(data.basePriceMin || data.basePriceMax) && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-green-500" />
            <span className="text-sm font-medium text-green-700">Base Price Range</span>
          </div>
          <p className="text-3xl font-bold text-green-800">
            ₹{data.basePriceMin?.toLocaleString()} - ₹{data.basePriceMax?.toLocaleString()}
          </p>
        </div>
      )}

      {data.packages && data.packages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Package size={16} className="text-green-500" />
            Packages
          </h4>
          {data.packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
            >
              <h5 className="font-semibold text-gray-800 mb-1">{pkg.title}</h5>
              <p className="text-green-600 font-bold">
                ₹{pkg.priceMin?.toLocaleString()} - ₹{pkg.priceMax?.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const TrustContent = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.usp && data.usp.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            Unique Selling Points
          </h4>
          <div className="space-y-2">
            {data.usp.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl"
              >
                <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-amber-700" />
                </div>
                <span className="text-sm text-amber-800">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {data.callToAction && data.callToAction.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Phone size={16} className="text-orange-500" />
            Call to Action
          </h4>
          <div className="grid gap-2">
            {data.callToAction.map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                {item}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// No Data Fallback Component
const NoDataFallback = ({ postNumber, onUpdateClick }) => {
  const config = POST_CONFIGS[postNumber];
  const IconComponent = config?.icon || Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-8 px-4"
    >
      <div
        className={`w-16 h-16 bg-gradient-to-r ${config?.color || "from-gray-400 to-gray-500"} rounded-2xl flex items-center justify-center mb-4 opacity-50`}
      >
        <IconComponent size={28} className="text-white" />
      </div>
      <h4 className="text-gray-400 font-medium mb-1">No Data Available</h4>
      <p className="text-gray-400 text-sm text-center mb-4">Add details to showcase your {config?.title || "work"}</p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onUpdateClick}
        className={`px-6 py-2.5 bg-gradient-to-r ${config?.color || "from-blue-500 to-cyan-500"} text-white font-medium rounded-xl flex items-center gap-2`}
      >
        <Edit3 size={16} />
        Update Details
      </motion.button>
    </motion.div>
  );
};

// Main Component
const PostDetailModal = ({
  post,
  posts = [],
  initialIndex = 0,
  onClose,
  vendorName,
  vendorImage,
  vendorId,
  profileId,
}) => {
  const { user } = useUser();

  // Determine current post index (1-4)
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (posts.length > 0) {
      const idx = posts.findIndex((p) => p._id === post?._id);
      return idx >= 0 ? idx : initialIndex;
    }
    return 0;
  });

  const currentPost = posts.length > 0 ? posts[currentIndex] : post;
  const postNumber = (currentIndex % 4) + 1; // 1-4

  // States
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayPauseIndicator, setShowPlayPauseIndicator] = useState(false);

  // Content states
  const [contentData, setContentData] = useState(currentPost?.content || null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Refs
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const playPauseTimeoutRef = useRef(null);

  // Parallax scroll
  const scrollY = useMotionValue(0);
  const springScrollY = useSpring(scrollY, { stiffness: 300, damping: 30 });

  // Check if content has data
  const hasContentData = useCallback(() => {
    if (!contentData) return false;

    const config = POST_CONFIGS[postNumber];
    if (!config) return false;

    return config.fields.some((field) => {
      const value = contentData[field.key];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    });
  }, [contentData, postNumber]);

  const hasData = hasContentData();

  // Dynamic heights
  const videoHeight = hasData ? "50%" : "70%";
  const contentHeight = hasData ? "50%" : "30%";

  const isVideo = currentPost?.mediaType === "video";

  // Video handlers
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const video = videoRef.current;
    let animationFrameId;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsBuffering(false);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
      if (isPlaying) {
        video.play().catch(() => setIsPlaying(false));
      }
    };

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    const handleError = () => {
      setHasError(true);
      setIsBuffering(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    animationFrameId = requestAnimationFrame(updateProgress);
    video.play().catch(() => setIsPlaying(false));

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentIndex, isVideo]);

  // Sync muted state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Reset states on post change
  useEffect(() => {
    setIsBuffering(true);
    setHasError(false);
    setProgress(0);
    setDuration(0);
    setIsPlaying(true);
    setContentData(currentPost?.content || null);
    setShowForm(false);
    setSubmitError(null);
  }, [currentIndex, currentPost]);

  const togglePlayPause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (playPauseTimeoutRef.current) clearTimeout(playPauseTimeoutRef.current);
    setShowPlayPauseIndicator(true);

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.warn("Playback interaction failed");
    }

    playPauseTimeoutRef.current = setTimeout(() => setShowPlayPauseIndicator(false), 800);
  }, []);

  // Parallax scroll handler
  const handleScroll = (e) => {
    scrollY.set(e.target.scrollTop);
  };

  // Form submission
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Optimistic update
    const previousData = contentData;
    setContentData(formData);
    setShowForm(false);

    try {
      const response = await fetch(`/api/vendor/profile/${profileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: currentPost._id,
          postNumber,
          content: formData,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update");
      }

      // Update with server response if available
      if (result.data?.content) {
        setContentData(result.data.content);
      }
    } catch (error) {
      // Rollback on error
      setContentData(previousData);
      setSubmitError(error.message);
      setShowForm(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render content based on post number
  const renderContent = () => {
    if (!hasData) {
      return <NoDataFallback postNumber={postNumber} onUpdateClick={() => setShowForm(true)} />;
    }

    switch (postNumber) {
      case 1:
        return <WorkDetailsContent data={contentData} />;
      case 2:
        return <ServiceBreakdownContent data={contentData} />;
      case 3:
        return <PricingContent data={contentData} />;
      case 4:
        return <TrustContent data={contentData} />;
      default:
        return null;
    }
  };

  const config = POST_CONFIGS[postNumber];
  const IconComponent = config?.icon || Briefcase;

  if (!currentPost) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
      >
        {/* Video Section - Fixed */}
        <motion.div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ height: videoHeight }}
          animate={{ height: videoHeight }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 z-40 h-1 bg-white/20">
            <motion.div className="h-full bg-white" style={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
          </div>

          {/* Header Controls */}
          <div className="absolute top-3 left-0 right-0 z-30 px-4 flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10"
            >
              <ArrowLeft size={22} className="text-white" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10"
            >
              <MoreVertical size={22} className="text-white" />
            </motion.button>
          </div>

          {/* Video/Image Content */}
          <div className="absolute inset-0" onClick={isVideo ? togglePlayPause : undefined}>
            {/* Blurred Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={currentPost.thumbnailUrl || currentPost.mediaUrl}
                alt=""
                className="w-full h-full object-cover blur-3xl scale-150 opacity-40"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Media */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              {isVideo ? (
                <video
                  ref={videoRef}
                  key={currentPost._id}
                  src={currentPost.mediaUrl}
                  poster={currentPost.thumbnailUrl}
                  className="w-full h-full object-contain"
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                  preload="auto"
                />
              ) : (
                <img src={currentPost.mediaUrl} alt="" className="w-full h-full object-contain" />
              )}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          {/* Buffering */}
          <AnimatePresence>
            {isBuffering && !hasError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
              >
                <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Play/Pause Indicator */}
          <AnimatePresence>
            {showPlayPauseIndicator && isVideo && !isBuffering && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
              >
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  {isPlaying ? (
                    <Pause size={32} className="text-white fill-white" />
                  ) : (
                    <Play size={32} className="text-white fill-white ml-1" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Paused State */}
          <AnimatePresence>
            {!isPlaying && isVideo && !isBuffering && !showPlayPauseIndicator && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
              >
                <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <Play size={28} className="text-white fill-white ml-1" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 text-center">
                <X size={32} className="text-red-400 mx-auto mb-2" />
                <p className="text-white font-medium">Content unavailable</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Content Section - Scrollable with Parallax */}
        <motion.div
          className="relative flex-1 bg-white rounded-t-3xl overflow-hidden"
          style={{ minHeight: contentHeight }}
          animate={{ minHeight: contentHeight }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          initial={{ y: 20 }}
        >
          {/* Parallax wrapper */}
          <motion.div
            className="absolute inset-0"
            style={{
              y: useTransform(springScrollY, [0, 100], [0, -30]),
            }}
          >
            {/* Pull indicator */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Scrollable content */}
            <div ref={contentRef} className="h-full overflow-y-auto pb-8" onScroll={handleScroll}>
              {/* Header */}
              <div className="px-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
                    <img
                      src={vendorImage || "/placeholder-avatar.png"}
                      alt={vendorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{vendorName}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium bg-gradient-to-r ${config?.color || "from-gray-400 to-gray-500"} bg-clip-text text-transparent`}
                      >
                        {config?.title || "Post Details"}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">Post {postNumber}/4</span>
                    </div>
                  </div>
                  {hasData && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowForm(true)}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Edit3 size={16} className="text-gray-600" />
                    </motion.button>
                  )}
                </div>

                {/* Post type indicator */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${config?.color || "from-gray-100 to-gray-200"} rounded-full`}
                >
                  <IconComponent size={14} className="text-white" />
                  <span className="text-white text-xs font-medium">{config?.title}</span>
                </div>
              </div>

              {/* Content Area */}
              <div className="px-4 pt-4">{renderContent()}</div>

              {/* Submit Error */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mx-4 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2"
                  >
                    <AlertCircle size={18} className="text-red-500" />
                    <span className="text-sm text-red-700">{submitError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation dots */}
              {posts.length > 1 && (
                <div className="flex justify-center gap-2 mt-6 pt-4 border-t border-gray-100 mx-4">
                  {posts.slice(0, 4).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentIndex ? "w-6 bg-gray-800" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <PostContentForm
                postNumber={postNumber}
                initialData={contentData}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostDetailModal;