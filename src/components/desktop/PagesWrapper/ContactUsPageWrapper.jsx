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
          duration: 5000,
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
        duration: 5000,
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 text-center shadow-xl max-w-md mx-auto border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for reaching out to us. Our support team will review your message and get back to you within 24
            hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-semibold shadow-lg shadow-pink-200 hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Desktop Header / Breadcrumb Area */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          <h1 className="text-xl font-bold text-gray-900">Contact Support</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">We're Here to Help!</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our services, pricing, or need support? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Contact Info & Methods */}
          <div className="space-y-8">
            {/* Quick Contact Methods */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Get in Touch</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={index}
                    href={method.action}
                    whileHover={{ scale: 1.02 }}
                    className="block bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${method.color} group-hover:scale-110 transition-transform`}>
                        <method.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{method.title}</h4>
                        <p className="text-gray-600 font-medium">{method.subtitle}</p>
                        <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                      </div>
                      <ExternalLink size={18} className="text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Office Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Visit Our Office</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-2.5 bg-pink-50 rounded-lg h-fit">
                    <MapPin size={22} className="text-pink-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">PlanWAB Headquarters</p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Tower B, 5th Floor, DLF Cyber Hub,
                      <br />
                      Noida, Uttar Pradesh, India
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2.5 bg-pink-50 rounded-lg h-fit">
                    <Clock size={22} className="text-pink-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Business Hours</p>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                      <p>Sunday: 10:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Follow Us</h3>
              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`p-2 rounded-lg ${social.color} group-hover:ring-2 ring-offset-2 ring-gray-100`}>
                      <social.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{social.name}</p>
                      <p className="text-xs text-gray-500">{social.handle}</p>
                    </div>
                    <ExternalLink size={16} className="text-gray-300 group-hover:text-gray-500" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form & FAQ */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h3>
                <p className="text-gray-500">Fill out the form below and we'll get back to you shortly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">I am a:</label>
                  <div className="flex gap-4">
                    {["customer", "vendor"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange("userType", type)}
                        className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold border-2 transition-all ${
                          formData.userType === type
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 focus:bg-white transition-colors ${
                        errors.name ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-pink-500"
                      } focus:outline-none`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 focus:bg-white transition-colors ${
                        errors.email ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-pink-500"
                      } focus:outline-none`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 focus:bg-white transition-colors ${
                        errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-pink-500"
                      } focus:outline-none`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 focus:bg-white transition-colors ${
                        errors.subject ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-pink-500"
                      } focus:outline-none`}
                      placeholder="What's this about?"
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1 font-medium">{errors.subject}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 focus:bg-white transition-colors min-h-[150px] resize-y ${
                      errors.message ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-pink-500"
                    } focus:outline-none`}
                    placeholder="Tell us more about your query..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message}</p>}
                </div>

                {errors.general && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">
                    <AlertCircle size={18} />
                    {errors.general}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full p-5 text-left flex items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-gray-900">{faq.question}</span>
                      {expandedFAQ === index ? (
                        <ChevronUp size={20} className="text-pink-600" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
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
                          <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-white">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPageWrapper;
