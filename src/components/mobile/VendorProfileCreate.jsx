// components/VendorProfileOnboarding.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { X, ChevronRight, CheckCircle, Store, MapPin, Tag, Lock, Sparkles } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

// Keep modules as they are
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }], // This is correct
    [{ color: [] }, { background: [] }],
    ["link"],
    ["clean"],
  ],
};

// Update formats to remove "bullet"
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list", // This handles both bullet and ordered
  "color",
  "background",
  "link",
];

const VendorProfileOnboarding = ({ vendor, id, onProfileCreated, isOpen, onClose }) => {
  // REMOVED: const [isOpen, setIsOpen] = useState(false); // This was causing conflict
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [bio, setBio] = useState("");

  const [formData, setFormData] = useState({
    vendorBusinessName: "",
    username: "",
    vendorName: "",
    category: "",
    bio: "",
    profilePicture: "",
    coverImage: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    password: "",
    confirmPassword: "",
  });

  // Update form data when vendor changes
  useEffect(() => {
    if (vendor) {
      setFormData((prev) => ({
        ...prev,
        vendorBusinessName: vendor?.name || "",
        vendorName: vendor?.name || "",
        category: vendor?.category || "",
      }));
    }
  }, [vendor]);

  // Reset step when drawer opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setError("");
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Upload single image to ImageKit
  const uploadImageToImageKit = async (file, folder = "/profiles") => {
    const authRes = await fetch("/api/imagekit/auth");
    const authData = await authRes.json();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
    formData.append("signature", authData.signature);
    formData.append("expire", authData.expire);
    formData.append("token", authData.token);
    formData.append("fileName", `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${file.name.split(".").pop()}`);
    formData.append("folder", folder);
    const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.url;
  };

  // Handle profile picture selection and upload
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploadingProfile(true);
    setError("");

    try {
      const url = await uploadImageToImageKit(file, "/profiles/avatars");
      setProfilePicture(url);
      setFormData((prev) => ({ ...prev, profilePicture: url }));
    } catch (err) {
      setError("Failed to upload profile picture. Please try again.");
      setProfilePicturePreview(null);
    } finally {
      setUploadingProfile(false);
    }
  };

  // Handle cover image selection and upload
  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploadingCover(true);
    setError("");

    try {
      const url = await uploadImageToImageKit(file, "/profiles/covers");
      setCoverImage(url);
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch (err) {
      setError("Failed to upload cover image. Please try again.");
      setCoverImagePreview(null);
    } finally {
      setUploadingCover(false);
    }
  };

  // Remove profile picture
  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    setFormData((prev) => ({ ...prev, profilePicture: "" }));
  };

  // Remove cover image
  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    setFormData((prev) => ({ ...prev, coverImage: "" }));
  };

  const validateStep = () => {
    if (currentStep === 2) {
      if (!formData.vendorBusinessName || !formData.vendorName || !formData.category) {
        setError("Please fill all required fields");
        return false;
      }
      if (!profilePicture) {
        setError("Profile picture is required");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === 2) {
        // Show password confirmation modal instead of submitting directly
        setShowPasswordModal(true);
        setAdminPassword("");
        setPasswordError("");
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePasswordVerification = () => {
    if (!adminPassword) {
      setPasswordError("Password is required");
      return;
    }

    setVerifying(true);
    setPasswordError("");

    const ADMIN_PASSWORD = "vendorProfile@add@planwab@8086"; // Change this to your desired password

    setTimeout(() => {
      if (adminPassword === ADMIN_PASSWORD) {
        setShowPasswordModal(false);
        setAdminPassword("");
        setVerifying(false);
        handleSubmit();
      } else {
        // Incorrect password
        setPasswordError("Incorrect password");
        setTimeout(() => {
          setShowPasswordModal(false);
          setAdminPassword("");
          setPasswordError("");
          setError("Authorization failed - Profile creation cancelled");
          setVerifying(false);
        }, 1500);
      }
    }, 800); // 800ms delay for verification animation
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        vendorId: id,
        vendorBusinessName: formData.vendorBusinessName,
        username: formData.username,
        vendorName: formData.vendorName,
        category: formData.category,
        bio: formData.bio || "",
        vendorAvatar: profilePicture,
        vendorCoverImage: coverImage || "",
        location: formData.location,
        password: formData.password,
      };

      const response = await fetch(`/api/vendor/${id}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create profile");
      }

      if (data.token) {
        localStorage.setItem("vendorToken", data.token);
      }

      setCurrentStep(3);

      setTimeout(() => {
        if (onClose) onClose();
        if (onProfileCreated) onProfileCreated(data.data);
      }, 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const steps = [
    { number: 1, title: "Welcome", icon: Sparkles },
    { number: 2, title: "Basic Details", icon: Store },
    { number: 3, title: "Success", icon: CheckCircle },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => currentStep === 3 && handleClose()}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Vendor Profile</h2>
                {(currentStep === 3 || currentStep === 1) && (
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X size={20} className="text-slate-600 dark:text-slate-400" />
                  </button>
                )}
              </div>

              {/* Progress Steps - Modern & Polished */}
              <div className="relative pt-2">
                {/* Background Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-[2px] bg-gradient-to-r from-slate-200 via-slate-200 to-slate-200 dark:from-slate-700 dark:via-slate-700 dark:to-slate-700">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{
                      width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
                    }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-full shadow-sm"
                  />
                </div>

                {/* Steps Container */}
                <div className="relative flex items-start justify-between">
                  {steps.map((step, idx) => {
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;

                    return (
                      <div
                        key={step.number}
                        className="flex flex-col items-center"
                        style={{ flex: idx === 1 ? "0 0 auto" : "1 1 0" }}
                      >
                        {/* Step Circle */}
                        <motion.div
                          animate={{
                            scale: isActive ? 1 : 0.95,
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="relative z-10"
                        >
                          <motion.div
                            animate={{
                              backgroundColor: isCompleted || isActive ? "rgb(59, 130, 246)" : "rgb(241, 245, 249)",
                              boxShadow: isActive
                                ? "0 0 0 4px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(59, 130, 246, 0.3)"
                                : isCompleted
                                  ? "0 2px 8px rgba(59, 130, 246, 0.2)"
                                  : "0 2px 4px rgba(0, 0, 0, 0.05)",
                            }}
                            transition={{ duration: 0.3 }}
                            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 backdrop-blur-sm"
                          >
                            <AnimatePresence mode="wait">
                              {isCompleted ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                                >
                                  <CheckCircle size={20} className="text-white" strokeWidth={2.5} />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="icon"
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  exit={{ scale: 0, rotate: 180 }}
                                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                                >
                                  <step.icon
                                    size={18}
                                    className={isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}
                                    strokeWidth={2}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>

                          {/* Active Pulse Ring */}
                          {isActive && (
                            <motion.div
                              initial={{ scale: 1, opacity: 0 }}
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="absolute inset-0 rounded-full border-2 border-blue-500"
                            />
                          )}
                        </motion.div>

                        {/* Step Label */}
                        <motion.span
                          animate={{
                            color: isCompleted || isActive ? "rgb(59, 130, 246)" : "rgb(148, 163, 184)",
                            fontWeight: isActive ? 700 : 600,
                          }}
                          transition={{ duration: 0.2 }}
                          className="mt-2.5 text-[11px] tracking-wide text-center leading-tight max-w-[70px]"
                        >
                          {step.title}
                        </motion.span>

                        {/* Step Number Badge (optional) */}
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 rounded-full"
                          >
                            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
                              Step {step.number}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Onboarding */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                      >
                        <Store size={48} className="text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        Welcome to Your Vendor Journey!
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                        Let's set up your vendor profile to showcase your business and connect with customers
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { icon: Store, title: "Business Identity", desc: "Set up your business name and category" },
                        { icon: MapPin, title: "Location Details", desc: "Add your business location" },
                        { icon: Lock, title: "Secure Access", desc: "Create a secure password" },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                            <item.icon size={20} className="text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Basic Details Form */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                      >
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </motion.div>
                    )}

                    {/* Business Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Store size={16} />
                        Business Name *
                      </label>
                      <input
                        type="text"
                        name="vendorBusinessName"
                        value={formData.vendorBusinessName}
                        onChange={handleInputChange}
                        placeholder="Enter your business name"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Username Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300"> UserName *</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter contact person name"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Vendor Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Name *</label>
                      <input
                        type="text"
                        name="vendorName"
                        value={formData.vendorName}
                        onChange={handleInputChange}
                        placeholder="Enter contact person name"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Profile Picture Upload (Required) */}
                    <div className="space-y-3 p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800/50">
                      <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Store size={16} className="text-purple-600 dark:text-purple-400" />
                        Profile Picture *<span className="text-xs font-normal text-slate-500">(Required)</span>
                      </label>

                      {profilePicturePreview ? (
                        <div className="relative">
                          <div className="relative w-full aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                            <img
                              src={profilePicturePreview}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                            {uploadingProfile && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                                  <p className="text-white text-xs font-semibold">Uploading...</p>
                                </div>
                              </div>
                            )}
                          </div>
                          {!uploadingProfile && (
                            <div className="flex gap-2 mt-3">
                              <label className="flex-1 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProfilePictureChange}
                                  className="hidden"
                                />
                                <ChevronRight size={14} />
                                Change
                              </label>
                              <button
                                type="button"
                                onClick={removeProfilePicture}
                                className="flex-1 py-2.5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-semibold text-xs hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center gap-2"
                              >
                                <X size={14} />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <label className="relative block w-full aspect-square max-w-[200px] mx-auto rounded-2xl border-3 border-dashed border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all cursor-pointer group overflow-hidden">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            disabled={uploadingProfile}
                            className="hidden"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <Store size={32} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Upload Profile Picture
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                              Click to browse
                              <br />
                              (Max 5MB)
                            </p>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Cover Image Upload (Optional) */}
                    <div className="space-y-3 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800/50">
                      <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600 dark:text-blue-400" />
                        Cover Image
                        <span className="text-xs font-normal text-slate-500">(Optional)</span>
                      </label>

                      {coverImagePreview ? (
                        <div className="relative">
                          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                            <img src={coverImagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                            {uploadingCover && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                                  <p className="text-white text-xs font-semibold">Uploading...</p>
                                </div>
                              </div>
                            )}
                          </div>
                          {!uploadingCover && (
                            <div className="flex gap-2 mt-3">
                              <label className="flex-1 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleCoverImageChange}
                                  className="hidden"
                                />
                                <ChevronRight size={14} />
                                Change
                              </label>
                              <button
                                type="button"
                                onClick={removeCoverImage}
                                className="flex-1 py-2.5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-semibold text-xs hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center gap-2"
                              >
                                <X size={14} />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <label className="relative block w-full aspect-[16/9] rounded-2xl border-3 border-dashed border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group overflow-hidden">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            disabled={uploadingCover}
                            className="hidden"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <MapPin size={32} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Upload Cover Image
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                              Click to browse
                              <br />
                              (Max 5MB)
                            </p>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Bio Field - Rich Text Editor */}
                    <div className="space-y-3 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800/50">
                      <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                        Bio
                        <span className="text-xs font-normal text-slate-500">(Optional)</span>
                      </label>

                      <div className="relative">
                        {/* Rich Text Editor */}
                        <div className="rich-text-editor-wrapper rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                          <ReactQuill
                            theme="snow"
                            value={formData.bio}
                            onChange={(content, delta, source, editor) => {
                              const plainText = editor.getText().trim();
                              // Limit to 1000 characters (plain text)
                              if (plainText.length <= 1000) {
                                setFormData((prev) => ({ ...prev, bio: content }));
                                setBio(content);
                              }
                            }}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="✨ Tell us about your business... Format your text, add lists, and make it stand out!"
                            className="custom-quill-editor"
                          />
                        </div>

                        {/* Character Counter */}
                        <div className="flex justify-between items-center mt-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                              📝 Formatting supported
                            </span>
                            <div className="flex gap-1">
                              <span className="px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                B
                              </span>
                              <span className="px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-[10px] font-bold italic text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                I
                              </span>
                              <span className="px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                🔗
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Max 1000 chars</span>
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg ${formData.bio?.replace(/<[^>]*>/g, "").trim().length > 900
                                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                }`}
                            >
                              {formData.bio?.replace(/<[^>]*>/g, "").trim().length || 0}/1000
                            </span>
                          </div>
                        </div>

                        {/* Helper Text */}
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                            💡 <strong>Pro tip:</strong> Use formatting to make your bio stand out! Add bullet points
                            for services, bold your specialties, and include relevant emojis.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Tag size={16} />
                        Category *
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g., Photography, Catering, Venue"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <MapPin size={16} />
                        Location
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="location.city"
                          value={formData.location.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          name="location.state"
                          value={formData.location.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          name="location.country"
                          value={formData.location.country}
                          onChange={handleInputChange}
                          placeholder="Country"
                          className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          name="location.zipCode"
                          value={formData.location.zipCode}
                          onChange={handleInputChange}
                          placeholder="Zip Code"
                          className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Lock size={16} />
                        Secure Your Profile *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create password (min. 6 characters)"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm"
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm password"
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Success */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                      <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      Profile Created Successfully!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                      Your vendor profile is now live. You can start adding highlights, posts, and reels to showcase
                      your work.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {currentStep !== 3 && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                    >
                      Back
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {currentStep === 2 ? "Create Profile" : "Continue"}
                        <ChevronRight size={18} />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
          {/* Admin Password Confirmation Modal */}
          <AnimatePresence>
            {showPasswordModal && (
              <>
                {/* Modal Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                  onClick={() => !verifying && setShowPasswordModal(false)}
                />

                {/* Modal Content */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-[70] overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <Lock size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          Admin Authorization Required
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Confirm your identity to create profile
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-6 space-y-4">
                    {passwordError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                          <X size={16} className="text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">{passwordError}</p>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Lock size={16} />
                        Admin Password
                      </label>
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value);
                          setPasswordError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !verifying) {
                            handlePasswordVerification();
                          }
                        }}
                        placeholder="Enter admin password"
                        disabled={verifying}
                        autoFocus
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500 dark:focus:border-amber-400 outline-none transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        🔒 This is a security measure to prevent unauthorized profile creation. Only administrators can
                        create vendor profiles.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowPasswordModal(false);
                        setAdminPassword("");
                        setPasswordError("");
                      }}
                      disabled={verifying}
                      className="flex-1 px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-white dark:hover:bg-slate-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePasswordVerification}
                      disabled={verifying || !adminPassword}
                      className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {verifying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Confirm
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default VendorProfileOnboarding;
