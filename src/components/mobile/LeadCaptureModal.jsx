"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Sparkles, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAppValuesStore } from "../../GlobalState/AppValuesStore";
import SmartMedia from './SmartMediaLoader';
import { useNavbarVisibilityStore } from './../../GlobalState/navbarVisibilityStore';

const SPRING_CONFIG = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

const OVERLAY_SPRING = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

const LeadCaptureModalMobile = ({ isOpen, onClose, actionType, title, subtitle }) => {
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({ name: "", phone: "" });
  const [touched, setTouched] = useState({ name: false, phone: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { setIsNavbarVisible } = useNavbarVisibilityStore();

  const { setCanContinue, setAllowedAction } = useAppValuesStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsNavbarVisible(false);
    } else {
      document.body.style.overflow = "unset";
      setFormData({ name: "", phone: "" });
      setErrors({ name: "", phone: "" });
      setTouched({ name: false, phone: false });
      setSubmitStatus(null);
    }
    return () => {
      document.body.style.overflow = "unset";
      setIsNavbarVisible(true);
    };
  }, [isOpen]);

  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should contain only letters";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Phone number is required";
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) return "Phone number must be 10 digits";
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) return "Please enter a valid Indian mobile number";
    return "";
  };

  const handleInputChange = (field, value) => {
    if (field === "phone") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 10) {
        setFormData((prev) => ({ ...prev, [field]: cleaned }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    if (touched[field]) {
      const error = field === "name" ? validateName(value) : validatePhone(value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = field === "name" ? validateName(formData[field]) : validatePhone(formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameError = validateName(formData.name);
    const phoneError = validatePhone(formData.phone);

    setErrors({ name: nameError, phone: phoneError });
    setTouched({ name: true, phone: true });

    if (nameError || phoneError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          actionType: actionType || "general",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitStatus("success");
      setCanContinue(true);
      setAllowedAction(actionType || "general");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneDisplay = (phone) => {
    if (phone.length <= 5) return phone;
    if (phone.length <= 10) return `${phone.slice(0, 5)}-${phone.slice(5)}`;
    return phone;
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_SPRING}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50, rotateX: 15 }}
              transition={SPRING_CONFIG}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <button
                type="button"
  onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-700 transition-colors z-50" 
              >
                <X size={24} />
              </button>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                style={{ transformOrigin: "left" }}
              />

              <div className="relative px-6 sm:px-8 pt-8 pb-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, ...SPRING_CONFIG }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg"
                >
                  <SmartMedia 
                    src="/planwablogo.png"
                    alt="Planwab Logo"
                    width={52}
                    height={52}
                    className="absolute object-cover w-13 h-13 rounded-full"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                    {title || "Get Started Today"}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500">
                    {subtitle || "Share your details and we'll help plan your perfect event"}
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <User size={20} className={errors.name && touched.name ? "text-red-400" : "text-gray-400"} />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        placeholder="Enter your full name"
                        className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all ${
                          errors.name && touched.name
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        }`}
                      />
                      <AnimatePresence>
                        {touched.name && !errors.name && formData.name && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            <CheckCircle size={20} className="text-green-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {errors.name && touched.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle size={14} />
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                        <Phone
                          size={20}
                          className={errors.phone && touched.phone ? "text-red-400" : "text-gray-400"}
                        />
                        <span className="text-gray-500 font-medium">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={formatPhoneDisplay(formData.phone)}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        placeholder="98765-43210"
                        className={`w-full pl-24 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all ${
                          errors.phone && touched.phone
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        }`}
                      />
                      <AnimatePresence>
                        {touched.phone && !errors.phone && formData.phone.length === 10 && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            <CheckCircle size={20} className="text-green-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {errors.phone && touched.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 text-sm text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle size={14} />
                          {errors.phone}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <AnimatePresence>
                    {submitStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-4 rounded-xl flex items-center gap-3 ${
                          submitStatus === "success"
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        {submitStatus === "success" ? (
                          <>
                            <CheckCircle size={20} className="text-green-600" />
                            <span className="text-sm font-semibold text-green-700">
                              Successfully submitted! Redirecting...
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={20} className="text-red-600" />
                            <span className="text-sm font-semibold text-red-700">
                              Something went wrong. Please try again.
                            </span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting || submitStatus === "success"}
                      className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Processing...
                        </>
                      ) : submitStatus === "success" ? (
                        <>
                          <CheckCircle size={20} />
                          Success!
                        </>
                      ) : (
                        "Continue"
                      )}
                    </motion.button>
                  </motion.div>
                </form>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-gray-400 text-center mt-3"
                >
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </motion.p>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                style={{ transformOrigin: "right" }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModalMobile;