import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  X,
  ChevronRight,
  CheckCircle,
  Store,
  MapPin,
  Tag,
  Lock,
  Sparkles,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  KeyRound,
  RefreshCw
} from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "color",
  "background",
  "link",
];

const UpdateProfileDrawer = ({ vendor, profile, id, onProfileUpdated, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

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
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Initialize form with existing data
  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        vendorBusinessName: profile.vendorBusinessName || vendor?.name || "",
        username: profile.username || "",
        vendorName: profile.vendorName || vendor?.name || "",
        category: profile.category || vendor?.category || "",
        bio: profile.bio || "",
        profilePicture: profile.vendorAvatar || "",
        coverImage: profile.vendorCoverImage || "",
        location: {
          address: profile.location?.address || "",
          city: profile.location?.city || "",
          state: profile.location?.state || "",
          country: profile.location?.country || "",
          zipCode: profile.location?.zipCode || "",
        },
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setProfilePicture(profile.vendorAvatar || null);
      setProfilePicturePreview(profile.vendorAvatar || null);
      setCoverImage(profile.vendorCoverImage || null);
      setCoverImagePreview(profile.vendorCoverImage || null);
      setError("");
      setSuccess(false);
      setShowPasswordSection(false);
    }
  }, [isOpen, profile, vendor]);

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
    setError("");
  };

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

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingProfile(true);
    setError("");

    try {
      const url = await uploadImageToImageKit(file, "/profiles/avatars");
      setProfilePicture(url);
      setFormData((prev) => ({ ...prev, profilePicture: url }));
    } catch (err) {
      setError("Failed to upload profile picture. Please try again.");
      setProfilePicturePreview(profile?.vendorAvatar || null);
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingCover(true);
    setError("");

    try {
      const url = await uploadImageToImageKit(file, "/profiles/covers");
      setCoverImage(url);
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch (err) {
      setError("Failed to upload cover image. Please try again.");
      setCoverImagePreview(profile?.vendorCoverImage || null);
    } finally {
      setUploadingCover(false);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    setFormData((prev) => ({ ...prev, profilePicture: "" }));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    setFormData((prev) => ({ ...prev, coverImage: "" }));
  };

  const validateForm = () => {
    if (!formData.vendorBusinessName || !formData.vendorName) {
      setError("Business name and contact name are required");
      return false;
    }

    if (!profilePicture) {
      setError("Profile picture is required");
      return false;
    }

    // Password change validation
    if (showPasswordSection) {
      if (formData.newPassword && formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        return false;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError("New passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
      };

      // Include password change if requested
      if (showPasswordSection && formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const response = await fetch(`/api/vendor/${id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update profile");
      }

      setSuccess(true);

      setTimeout(() => {
        if (onClose) onClose();
        if (onProfileUpdated) onProfileUpdated(data.data);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="update-profile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            key="update-profile-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Store size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Update Profile</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Edit your vendor information</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success-state"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
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
                      Profile Updated!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                      Your changes have been saved successfully.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form-state"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
                      >
                        <AlertCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
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
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-sm"
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
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Profile Picture */}
                    <div className="space-y-3 p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800/50">
                      <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Store size={16} className="text-purple-600 dark:text-purple-400" />
                        Profile Picture *
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
                                <RefreshCw size={14} />
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
                              Click to browse (Max 5MB)
                            </p>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Cover Image */}
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
                                <RefreshCw size={14} />
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
                              Click to browse (Max 5MB)
                            </p>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Bio Field */}
                    <div className="space-y-3 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800/50">
                      <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
                        Bio
                        <span className="text-xs font-normal text-slate-500">(Optional)</span>
                      </label>

                      <div className="relative">
                        <div className="rich-text-editor-wrapper rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                          <ReactQuill
                            theme="snow"
                            value={formData.bio}
                            onChange={(content, delta, source, editor) => {
                              const plainText = editor.getText().trim();
                              if (plainText.length <= 1000) {
                                setFormData((prev) => ({ ...prev, bio: content }));
                              }
                            }}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="✨ Tell us about your business..."
                            className="custom-quill-editor"
                          />
                        </div>

                        <div className="flex justify-between items-center mt-3 px-2">
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            📝 Formatting supported
                          </span>
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${(formData.bio?.replace(/<[^>]*>/g, "").trim().length || 0) > 900
                                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                              }`}
                          >
                            {formData.bio?.replace(/<[^>]*>/g, "").trim().length || 0}/1000
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Tag size={16} />
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g., Photography, Catering, Venue"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-colors text-sm"
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
                          className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          name="location.state"
                          value={formData.location.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          name="location.country"
                          value={formData.location.country}
                          onChange={handleInputChange}
                          placeholder="Country"
                          className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none text-sm"
                        />
                        <input
                          type="text"
                          name="location.zipCode"
                          value={formData.location.zipCode}
                          onChange={handleInputChange}
                          placeholder="Zip Code"
                          className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                      <button
                        type="button"
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        <span className="flex items-center gap-2">
                          <Lock size={16} />
                          Change Password
                        </span>
                        <motion.div
                          animate={{ rotate: showPasswordSection ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight size={18} className="rotate-90" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {showPasswordSection && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 pt-3 border-t border-amber-200 dark:border-amber-800">

                              {/* New Password */}
                              <div className="relative">
                                <input
                                  type={showNewPassword ? "text" : "password"}
                                  name="newPassword"
                                  value={formData.newPassword}
                                  onChange={handleInputChange}
                                  placeholder="New password (min. 6 characters)"
                                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500 outline-none text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>

                              {/* Confirm New Password */}
                              <input
                                type="password"
                                name="confirmNewPassword"
                                value={formData.confirmNewPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm new password"
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500 outline-none text-sm"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {!success && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading || uploadingProfile || uploadingCover}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpdateProfileDrawer;