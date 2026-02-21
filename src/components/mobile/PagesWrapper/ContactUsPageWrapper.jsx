"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const ContactUsPageWrapper = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    userType: "customer",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I register as a vendor?",
      answer:
        "Click on 'Become a Vendor' and fill out the registration form. Our team will review and approve your profile within 24-48 hours.",
    },
    {
      question: "What are the charges for using PlanWAB?",
      answer:
        "PlanWAB is free for customers. Vendors pay a small commission only when they receive confirmed bookings through our platform.",
    },
    {
      question: "How do I cancel or modify my booking?",
      answer:
        "You can manage your bookings through the app. For cancellations, please check the vendor's cancellation policy or contact our support team.",
    },
    {
      question: "Is my payment secure on PlanWAB?",
      answer:
        "Yes, we use industry-standard encryption and secure payment gateways. Your financial information is completely safe with us.",
    },
    {
      question: "How do I report an issue with a vendor?",
      answer:
        "You can report issues through the app's feedback system or contact our support team directly. We take all complaints seriously.",
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      subtitle: "+91 6267430959",
      action: "tel:+916267430959",
      color: "bg-green-100 text-green-600",
      description: "Available 24/7 for urgent queries",
    },
    {
      icon: Mail,
      title: "Email Us",
      subtitle: "support@planwab.com",
      action: "mailto:support@planwab.com",
      color: "bg-blue-100 text-blue-600",
      description: "Get detailed responses within 24 hours",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      subtitle: "Chat with us",
      action: "https://wa.me/916267430959",
      color: "bg-green-100 text-green-600",
      description: "Quick support via WhatsApp",
    },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      name: "Instagram",
      handle: "@planwab.official",
      url: "https://www.instagram.com/planwab.official?igsh=MWlqMmxpcnF6NThjZw==",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Facebook,
      name: "Facebook",
      handle: "PlanWAB",
      url: "https://www.facebook.com/share/16sos5hq5m/",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      handle: "PlanWAB",
      url: "https://www.linkedin.com/company/planwab/",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
 
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      if (data.success) {
        toast.success("Message sent successfully!", {
          description: "Our support team will get back to you within 24 hours.",
        });

        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          userType: "customer",
        });
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);

      toast.error("Failed to send message", {
        description: error.message || "Please try again later.",
      });

      setErrors({
        general: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 text-center shadow-lg max-w-sm mx-auto"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
          <p className="text-gray-600 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Contact Us</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-6 pb-8">
        {/* Hero Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">We're Here to Help!</h2>
          <p className="text-gray-600">Have questions? Need support? We'd love to hear from you.</p>
        </div>

        {/* Quick Contact Methods */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Get in Touch</h3>
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.action}
              whileTap={{ scale: 0.98 }}
              className="block bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${method.color}`}>
                  <method.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{method.title}</h4>
                  <p className="text-gray-600">{method.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                </div>
                <ExternalLink size={16} className="text-gray-400" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Office Information */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Our Office</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin size={20} className="text-pink-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">PlanWAB Headquarters</p>
                <p className="text-gray-600">Noida, Uttar Pradesh, India</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock size={20} className="text-pink-600" />
              <div>
                <p className="font-medium text-gray-900">Business Hours</p>
                <p className="text-gray-600">Mon-Sat: 9:00 AM - 7:00 PM</p>
                <p className="text-gray-600">Sunday: 10:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Send us a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange("userType", "customer")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    formData.userType === "customer" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("userType", "vendor")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    formData.userType === "vendor" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Vendor
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.name ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none`}
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.subject ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none`}
                placeholder="What's this about?"
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.message ? "border-red-500" : "border-gray-200"
                } focus:border-pink-500 focus:outline-none`}
                rows="4"
                placeholder="Tell us more about your query..."
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>

            {errors.general && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={16} />
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-3 text-left flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-3 pb-3 text-gray-600 text-sm">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
          <div className="space-y-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${social.color}`}>
                  <social.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{social.name}</p>
                  <p className="text-sm text-gray-600">{social.handle}</p>
                </div>
                <ExternalLink size={16} className="text-gray-400" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPageWrapper;
