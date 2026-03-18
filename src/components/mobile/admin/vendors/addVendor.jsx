"use client";

import { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  Building,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  Calendar,
  Clock,
  Users,
  Camera,
  Palette,
  ChefHat,
  Home,
  Plus,
  X,
  Check,
  ChevronDown,
  Search,
  Star,
  Award,
  Shield,
  Globe,
  DollarSign,
  Building2,
  Paintbrush2,
  UserCheck,
  UtensilsCrossed,
  Shirt,
  Hand,
  CakeSlice,
  Gem,
  Music,
  Scissors,
} from "lucide-react";

export default function AddVendor() {
  const categories = [
    { key: "venues", label: "Venues", icon: Building2 },
    { key: "photographers", label: "Photographers", icon: Camera },
    { key: "makeup", label: "Makeup", icon: Paintbrush2 },
    { key: "planners", label: "Planners", icon: UserCheck },
    { key: "catering", label: "Catering", icon: UtensilsCrossed },
    { key: "clothes", label: "Clothes Wear", icon: Shirt },
    { key: "mehendi", label: "Mehendi", icon: Hand },
    { key: "cakes", label: "Cakes", icon: CakeSlice },
    { key: "jewellery", label: "Jewellery", icon: Gem },
    { key: "invitations", label: "Invitations", icon: Mail },
    { key: "djs", label: "DJs", icon: Music },
    { key: "hairstyling", label: "Hairstyling", icon: Scissors },
    { key: "other", label: "Other", icon: FileText },
  ];

  const initialFormData = {
    name: "",
    email: "",
    phoneNo: "",
    username: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
    description: "",
    tags: [],
    availableAreas: [],
    amenities: [],
    facilities: [],
    contactPerson: { firstName: "", lastName: "" },
    planId: 1,
    creditBalance: 10,
    categoryData: {},
  };

  const [activeCategory, setActiveCategory] = useState("venues");
  const [formData, setFormData] = useState(initialFormData);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState({
    type: null,
    message: "",
  });

  const fieldOptions = {
    makeupServices: ["Bridal Makeup", "Party Makeup", "Engagement Makeup", "Airbrush Makeup", "Hairstyling"],
    makeupBrands: ["MAC", "Huda Beauty", "Bobbi Brown", "NARS", "Dior", "Chanel", "Kryolan"],
    plannerServices: ["Full Wedding Planning", "Partial Planning", "Day-of Coordination", "Destination Weddings"],
    eventTypes: ["Weddings", "Corporate Events", "Private Parties", "Birthdays"],
    clothingTypes: ["Bridal Lehengas", "Groom Sherwanis", "Sarees", "Suits", "Indo-Western"],
    mehendiTypes: ["Traditional", "Arabic", "Bridal Mehendi", "Glitter Mehendi"],
    cakeFlavors: ["Chocolate Truffle", "Red Velvet", "Pineapple", "Black Forest", "Butterscotch", "Custom"],
    jewelleryTypes: ["For Rent", "For Purchase"],
    jewelleryStyles: ["Traditional Gold", "Kundan", "Polki", "Diamond", "Modern Designs"],
    invitationTypes: ["Digital E-vites", "Printed Cards", "Boxed Invitations", "Luxury Invitations"],
    djGenres: ["Bollywood", "Punjabi", "Hip Hop", "EDM", "Retro", "Commercial"],
    hairstylingServices: ["Bridal Hairstyling", "Guest Hairstyling", "Hair Extensions", "Hair Treatments"],
    cuisineTypes: ["North Indian", "South Indian", "Chinese", "Italian", "Continental", "Thai", "Mexican"],
    menuOptions: ["Pure Vegetarian", "Non-Vegetarian", "Vegan", "Jain Food", "Gluten-Free"],
    photographerServices: ["Wedding Photography", "Pre-Wedding Photoshoot", "Candid Photography", "Drone Shoots"],
    photographerPackages: ["Basic Package", "Standard Package", "Premium Package", "Custom Packages"],
    equipment: ["Professional DSLR", "Mirrorless Cameras", "Drones", "Gimbals", "Professional Lighting"],
    decoratorThemes: ["Traditional", "Modern", "Rustic", "Floral", "Royal", "Minimalist"],
    designStyles: ["Classic", "Contemporary", "Vintage", "Bohemian", "Luxurious"],
    materialsUsed: ["Fresh Flowers", "Artificial Flowers", "Fabric Draping", "LED Lighting", "Custom Props"],
    amenities: ["Air Conditioning", "Parking", "Valet Parking", "Bridal Suite", "Sound System", "Wi-Fi"],
    facilities: ["Main Stage", "Dance Floor", "Green Room", "Guest Restrooms", "Outdoor Area", "Swimming Pool"],
    availableAreas: ["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Jaipur"],
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
  ];

  const resetForm = () => {
    setFormData(initialFormData);
    setUploadedFiles([]);
    setErrors({});
    setActiveCategory("venues");
  };

  const handleCategorySelect = (categoryKey) => {
    setActiveCategory(categoryKey);
    setFormData((prev) => ({ ...prev, categoryData: {} }));
    setErrors({});
  };

  const handleInputChange = (field, value, isNested = false, nestedField = "") => {
    setFormData((prev) => {
      if (isNested) {
        return { ...prev, [field]: { ...prev[field], [nestedField]: value } };
      }
      return { ...prev, [field]: value };
    });
    const errorKey = isNested ? nestedField : field;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleCategoryDataChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      categoryData: { ...prev.categoryData, [field]: value },
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const maxSize = 10 * 1024 * 1024;
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
    setUploadedFiles((prev) => [...prev, ...validFiles]);
    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeFile = (index) => setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Business name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Business name must be at least 2 characters long";
    }

    if (!formData.phoneNo.trim()) newErrors.phoneNo = "Phone number is required";

    if (!formData.username.trim()) newErrors.username = "Username is required";

    if (!formData.address.city.trim()) newErrors.city = "City is required";

    if (uploadedFiles.length === 0) newErrors.images = "At least one image is required";

    const { categoryData } = formData;

    switch (activeCategory) {
      case "venues":
        if (!categoryData.perDayPrice?.min || !categoryData.perDayPrice?.max) {
          newErrors.perDayPrice = "Both minimum and maximum rental prices are required.";
        }
        break;

      case "catering":
        if (!categoryData.price?.min) {
          newErrors.price = "A minimum price per plate is required.";
        }
        break;

      case "other":
        if (!categoryData.name || !categoryData.name.trim()) {
          newErrors.name = "Service name is required for the 'Other' category.";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitFeedback({ type: null, message: "" });

    if (!validateForm()) {
      setSubmitFeedback({
        type: "error",
        message: "Please fix the errors before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get ImageKit auth params once for all uploads
      const authRes = await fetch("/api/imagekit/auth");
      const authData = await authRes.json();

      const uploadPromises = uploadedFiles.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
        formData.append("signature", authData.signature);
        formData.append("expire", authData.expire);
        formData.append("token", authData.token);
        formData.append("fileName", `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${file.name.split(".").pop()}`);
        formData.append("folder", "/vendors/images");
        return fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: formData,
        }).then((res) => res.json());
      });

      const uploadedImagesData = await Promise.all(uploadPromises);
      const imageUrls = uploadedImagesData.map((data) => data.url);

      if (imageUrls.some((url) => !url)) {
        throw new Error("Some images failed to upload.");
      }

      const payload = {
        ...formData,
        activeCategory: activeCategory,
        images: imageUrls,
        defaultImage: imageUrls[0],
      };

      const response = await fetch("/api/vendor/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (err) {
        console.error("Failed to parse JSON response:", responseText);
        throw new Error(`Server returned an invalid response (Status: ${response.status}).`);
      }

      if (!response.ok) {
        setErrors((prev) => ({ ...prev, ...result.errors }));
        throw new Error(result.message || "An error occurred during vendor registration.");
      }

      setSubmitFeedback({
        type: "success",
        message: "Vendor registered successfully!",
      });
      resetForm();
    } catch (error) {
      setSubmitFeedback({
        type: "error",
        message: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 py-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Vendor Registration
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join our premium network of wedding and event service providers. Complete your professional profile to
              start receiving bookings.
            </p>
          </div>

          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
              Select Your Service Category
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategorySelect(cat.key)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl aspect-square transition-all duration-300 ${activeCategory === cat.key
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  <cat.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium text-center">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <Section title="Business Information" icon={Building} iconColor="from-blue-500 to-blue-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField
                  label="Business Name"
                  id="business-name"
                  icon={Building}
                  placeholder="e.g., Royal Wedding Palace"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={errors.name}
                />
                <InputField
                  label="Username"
                  id="username"
                  icon={User}
                  placeholder="unique_business_handle"
                  required
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  error={errors.username}
                  helper="This will be your unique identifier on the platform"
                />
                <InputField
                  label="Business Email"
                  id="contact-email"
                  type="email"
                  icon={Mail}
                  placeholder="business@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                />
                <InputField
                  label="Primary Phone Number"
                  id="phone-number"
                  type="tel"
                  icon={Phone}
                  placeholder="+91 98765 43210"
                  required
                  value={formData.phoneNo}
                  onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                  error={errors.phoneNo}
                />
              </div>
            </Section>

            <Section title="Primary Contact Person" icon={User} iconColor="from-green-500 to-green-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField
                  label="First Name"
                  id="contact-first-name"
                  placeholder="Rajesh"
                  value={formData.contactPerson.firstName}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value, true, "firstName")}
                />
                <InputField
                  label="Last Name"
                  id="contact-last-name"
                  placeholder="Kumar"
                  value={formData.contactPerson.lastName}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value, true, "lastName")}
                />
              </div>
            </Section>

            <Section title="Business Address" icon={MapPin} iconColor="from-purple-500 to-purple-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <InputField
                    label="Street Address"
                    id="street"
                    placeholder="123, MG Road, Near City Mall"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange("address", e.target.value, true, "street")}
                  />
                </div>
                <InputField
                  label="City"
                  id="city"
                  placeholder="Indore"
                  required
                  value={formData.address.city}
                  onChange={(e) => handleInputChange("address", e.target.value, true, "city")}
                  error={errors.city}
                />
                <SearchableSelect
                  label="State"
                  id="state"
                  options={indianStates}
                  placeholder="Select your state"
                  value={formData.address.state}
                  onChange={(value) => handleInputChange("address", value, true, "state")}
                />
                <InputField
                  label="Postal Code"
                  id="postal-code"
                  placeholder="452001"
                  value={formData.address.postalCode}
                  onChange={(e) => handleInputChange("address", e.target.value, true, "postalCode")}
                />
                <CustomSelect
                  label="Country"
                  id="country"
                  options={["India"]}
                  value={formData.address.country}
                  onChange={(value) => handleInputChange("address", value, true, "country")}
                  disabled
                />
              </div>
            </Section>

            <Section title="Service Information" icon={Globe} iconColor="from-orange-500 to-orange-600">
              <div className="space-y-8">
                <MultiSelect
                  label="Service Areas"
                  id="available-areas"
                  options={fieldOptions.availableAreas}
                  placeholder="Select cities where you provide services"
                  value={formData.availableAreas}
                  onChange={(value) => handleInputChange("availableAreas", value)}
                  helper="Choose all cities where you can provide your services"
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Business Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Describe your business, specialties, experience, and what makes you unique..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-6 py-4 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <TagInput
                  label="Service Tags"
                  value={formData.tags}
                  onChange={(tags) => handleInputChange("tags", tags)}
                  helper="Type a tag and press comma or Enter to add it"
                />
              </div>
            </Section>

            {
              {
                venues: (
                  <Section title="Venue Specifications" icon={Building2}>
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <RangeField
                          label="Guest Capacity"
                          id="seating"
                          required
                          minPlaceholder="Min"
                          maxPlaceholder="Max"
                          value={formData.categoryData.seating}
                          onChange={(min, max) => handleCategoryDataChange("seating", { min, max })}
                        />
                        <RangeField
                          label="Number of Rooms"
                          id="rooms"
                          minPlaceholder="Min"
                          maxPlaceholder="Max"
                          value={formData.categoryData.rooms}
                          onChange={(min, max) => handleCategoryDataChange("rooms", { min, max })}
                        />
                      </div>
                      <InputField
                        label="Parking Capacity"
                        type="number"
                        min="0"
                        value={formData.categoryData.parking || ""}
                        onChange={(e) => handleCategoryDataChange("parking", e.target.value)}
                      />
                      <RangeField
                        label="Per Day Rental Price (₹)"
                        id="perDayPrice"
                        required
                        minPlaceholder="Min Price"
                        maxPlaceholder="Max Price"
                        value={formData.categoryData.perDayPrice}
                        onChange={(min, max) => handleCategoryDataChange("perDayPrice", { min, max })}
                        error={errors.perDayPrice}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <MultiSelect
                          label="Amenities"
                          options={fieldOptions.amenities}
                          value={formData.amenities}
                          onChange={(v) => handleInputChange("amenities", v)}
                        />
                        <MultiSelect
                          label="Facilities"
                          options={fieldOptions.facilities}
                          value={formData.facilities}
                          onChange={(v) => handleInputChange("facilities", v)}
                        />
                      </div>
                    </div>
                  </Section>
                ),
                photographers: (
                  <Section title="Photography Services" icon={Camera}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Services Offered"
                        options={fieldOptions.photographerServices}
                        value={formData.categoryData.services || []}
                        onChange={(v) => handleCategoryDataChange("services", v)}
                      />
                      <MultiSelect
                        label="Packages"
                        options={fieldOptions.photographerPackages}
                        value={formData.categoryData.packages || []}
                        onChange={(v) => handleCategoryDataChange("packages", v)}
                      />
                      <RangeField
                        label="Price Per Event (₹)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                        value={formData.categoryData.price}
                        onChange={(min, max) => handleCategoryDataChange("price", { min, max })}
                      />
                      <InputField
                        label="Delivery Time (in days)"
                        type="number"
                        min="1"
                        value={formData.categoryData.delivery || ""}
                        onChange={(e) => handleCategoryDataChange("delivery", e.target.value)}
                      />
                    </div>
                  </Section>
                ),
                makeup: (
                  <Section title="Makeup Artist Details" icon={Paintbrush2}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Services Offered"
                        options={fieldOptions.makeupServices}
                        value={formData.categoryData.services || []}
                        onChange={(v) => handleCategoryDataChange("services", v)}
                      />
                      <MultiSelect
                        label="Brands Used"
                        options={fieldOptions.makeupBrands}
                        value={formData.categoryData.brands || []}
                        onChange={(v) => handleCategoryDataChange("brands", v)}
                      />
                      <RangeField
                        label="Price Per Session (₹)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                        value={formData.categoryData.price}
                        onChange={(min, max) => handleCategoryDataChange("price", { min, max })}
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="trial"
                          checked={!!formData.categoryData.trial}
                          onChange={(e) => handleCategoryDataChange("trial", e.target.checked)}
                          className="h-4 w-4"
                        />
                        <label htmlFor="trial" className="ml-2">
                          Offers Trial Sessions
                        </label>
                      </div>
                    </div>
                  </Section>
                ),
                planners: (
                  <Section title="Planner Details" icon={UserCheck}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Planning Services"
                        options={fieldOptions.plannerServices}
                        value={formData.categoryData.services || []}
                        onChange={(v) => handleCategoryDataChange("services", v)}
                      />
                      <MultiSelect
                        label="Event Types Handled"
                        options={fieldOptions.eventTypes}
                        value={formData.categoryData.events || []}
                        onChange={(v) => handleCategoryDataChange("events", v)}
                      />
                      <InputField
                        label="Years of Experience"
                        type="number"
                        min="0"
                        value={formData.categoryData.experience || ""}
                        onChange={(e) => handleCategoryDataChange("experience", e.target.value)}
                      />
                      <RangeField
                        label="Service Fee (₹)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                        value={formData.categoryData.fee}
                        onChange={(min, max) => handleCategoryDataChange("fee", { min, max })}
                      />
                    </div>
                  </Section>
                ),
                catering: (
                  <Section title="Catering Services" icon={UtensilsCrossed}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Cuisine Types"
                        options={fieldOptions.cuisineTypes}
                        value={formData.categoryData.cuisines || []}
                        onChange={(v) => handleCategoryDataChange("cuisines", v)}
                      />
                      <MultiSelect
                        label="Menu Options"
                        options={fieldOptions.menuOptions}
                        value={formData.categoryData.menus || []}
                        onChange={(v) => handleCategoryDataChange("menus", v)}
                      />
                      <RangeField
                        label="Price Per Plate (₹)"
                        required
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                        value={formData.categoryData.price}
                        onChange={(min, max) => handleCategoryDataChange("price", { min, max })}
                      />
                      <InputField
                        label="Minimum Order (plates)"
                        type="number"
                        min="10"
                        value={formData.categoryData.minOrder || ""}
                        onChange={(e) => handleCategoryDataChange("minOrder", e.target.value)}
                      />
                    </div>
                  </Section>
                ),
                clothes: (
                  <Section title="Clothing Vendor Details" icon={Shirt}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Clothing Types"
                        options={fieldOptions.clothingTypes}
                        value={formData.categoryData.types || []}
                        onChange={(v) => handleCategoryDataChange("types", v)}
                      />
                      <RangeField
                        label="Price Range (₹)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                        value={formData.categoryData.price}
                        onChange={(min, max) => handleCategoryDataChange("price", { min, max })}
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="custom"
                          checked={!!formData.categoryData.custom}
                          onChange={(e) => handleCategoryDataChange("custom", e.target.checked)}
                          className="h-4 w-4"
                        />
                        <label htmlFor="custom" className="ml-2">
                          Customization Available
                        </label>
                      </div>
                    </div>
                  </Section>
                ),
                mehendi: (
                  <Section title="Mehendi Artist Details" icon={Hand}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Mehendi Types"
                        options={fieldOptions.mehendiTypes}
                        value={formData.categoryData.types || []}
                        onChange={(v) => handleCategoryDataChange("types", v)}
                      />
                      <RangeField
                        label="Bridal Package Price (₹)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                        value={formData.categoryData.bridalPrice}
                        onChange={(min, max) => handleCategoryDataChange("bridalPrice", { min, max })}
                      />
                      <InputField
                        label="Price Per Hand (₹)"
                        type="number"
                        min="100"
                        value={formData.categoryData.perHand || ""}
                        onChange={(e) => handleCategoryDataChange("perHand", e.target.value)}
                      />
                    </div>
                  </Section>
                ),
                cakes: (
                  <Section title="Cake Vendor Details" icon={CakeSlice}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Flavors Available"
                        options={fieldOptions.cakeFlavors}
                        value={formData.categoryData.flavors || []}
                        onChange={(v) => handleCategoryDataChange("flavors", v)}
                      />
                      <InputField
                        label="Price Per KG (₹)"
                        type="number"
                        min="500"
                        value={formData.categoryData.priceKg || ""}
                        onChange={(e) => handleCategoryDataChange("priceKg", e.target.value)}
                      />
                      <InputField
                        label="Minimum Weight (KG)"
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={formData.categoryData.minWeight || ""}
                        onChange={(e) => handleCategoryDataChange("minWeight", e.target.value)}
                      />
                    </div>
                  </Section>
                ),
                jewellery: (
                  <Section title="Jewellery Vendor Details" icon={Gem}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Jewellery Type"
                        options={fieldOptions.jewelleryTypes}
                        value={formData.categoryData.types || []}
                        onChange={(v) => handleCategoryDataChange("types", v)}
                      />
                      <MultiSelect
                        label="Styles"
                        options={fieldOptions.jewelleryStyles}
                        value={formData.categoryData.styles || []}
                        onChange={(v) => handleCategoryDataChange("styles", v)}
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="customJewel"
                          checked={!!formData.categoryData.custom}
                          onChange={(e) => handleCategoryDataChange("custom", e.target.checked)}
                          className="h-4 w-4"
                        />
                        <label htmlFor="customJewel" className="ml-2">
                          Custom Designs Available
                        </label>
                      </div>
                    </div>
                  </Section>
                ),
                invitations: (
                  <Section title="Invitation Vendor Details" icon={Mail}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Invitation Types"
                        options={fieldOptions.invitationTypes}
                        value={formData.categoryData.types || []}
                        onChange={(v) => handleCategoryDataChange("types", v)}
                      />
                      <RangeField
                        label="Price Per Piece (₹)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                        value={formData.categoryData.price}
                        onChange={(min, max) => handleCategoryDataChange("price", { min, max })}
                      />
                      <InputField
                        label="Minimum Order Quantity"
                        type="number"
                        min="20"
                        value={formData.categoryData.minOrder || ""}
                        onChange={(e) => handleCategoryDataChange("minOrder", e.target.value)}
                      />
                    </div>
                  </Section>
                ),
                djs: (
                  <Section title="DJ Details" icon={Music}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Music Genres"
                        options={fieldOptions.djGenres}
                        value={formData.categoryData.genres || []}
                        onChange={(v) => handleCategoryDataChange("genres", v)}
                      />
                      <RangeField
                        label="Price Per Event (₹)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                        value={formData.categoryData.price}
                        onChange={(min, max) => handleCategoryDataChange("price", { min, max })}
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="equipment"
                          checked={!!formData.categoryData.equipment}
                          onChange={(e) => handleCategoryDataChange("equipment", e.target.checked)}
                          className="h-4 w-4"
                        />
                        <label htmlFor="equipment" className="ml-2">
                          Provides Own Equipment
                        </label>
                      </div>
                    </div>
                  </Section>
                ),
                hairstyling: (
                  <Section title="Hairstyling Details" icon={Scissors}>
                    <div className="space-y-8">
                      <MultiSelect
                        label="Services Offered"
                        options={fieldOptions.hairstylingServices}
                        value={formData.categoryData.services || []}
                        onChange={(v) => handleCategoryDataChange("services", v)}
                      />
                      <RangeField
                        label="Price Per Session (₹)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                        value={formData.categoryData.price}
                        onChange={(min, max) => handleCategoryDataChange("price", { min, max })}
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="hairTrial"
                          checked={!!formData.categoryData.trial}
                          onChange={(e) => handleCategoryDataChange("trial", e.target.checked)}
                          className="h-4 w-4"
                        />
                        <label htmlFor="hairTrial" className="ml-2">
                          Offers Trial Sessions
                        </label>
                      </div>
                    </div>
                  </Section>
                ),
                other: (
                  <Section title="Other Service Details" icon={FileText}>
                    <div className="space-y-8">
                      <InputField
                        label="Service Name"
                        required
                        value={formData.categoryData.name || ""}
                        onChange={(e) => handleCategoryDataChange("name", e.target.value)}
                      />
                      <RangeField
                        label="Price (₹)"
                        minPlaceholder="Min"
                        maxPlaceholder="Max"
                        value={formData.categoryData.price}
                        onChange={(min, max) => handleCategoryDataChange("price", { min, max })}
                      />
                    </div>
                  </Section>
                ),
              }[activeCategory]
            }

            <Section title="Business Images" icon={UploadCloud} iconColor="from-red-500 to-orange-500">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive
                    ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                  } ${errors.images ? "border-red-500" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold inline-block my-2"
                >
                  Choose Files
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">or drag and drop</p>
              </div>
              {errors.images && <p className="mt-2 text-sm text-red-500 text-center">{errors.images}</p>}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              {submitFeedback.message && (
                <div
                  className={`p-4 mb-4 rounded-lg text-center font-medium ${submitFeedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                >
                  {submitFeedback.message}
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 w-48 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Register Vendor</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, icon: Icon, children, iconColor }) => (
  <div className="bg-white/50 dark:bg-gray-700/30 rounded-2xl p-8 border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
    <div className="flex items-center space-x-4 mb-8">
      <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
    </div>
    {children}
  </div>
);
const InputField = ({ label, id, icon: Icon, required, className = "", helper, error, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <input
        id={id}
        {...props}
        required={required}
        className={`w-full ${Icon ? "pl-11" : "pl-4"
          } pr-4 py-3 bg-white dark:bg-gray-700/50 border-2 rounded-xl transition-all ${error
            ? "border-red-500 ring-red-500"
            : "border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
          } ${className}`}
      />
    </div>
    {helper && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helper}</p>}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);
const CustomSelect = ({ label, id, options, placeholder, required, value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-white dark:bg-gray-700/50 border-2 rounded-xl text-left flex items-center justify-between ${disabled ? "cursor-not-allowed bg-gray-100" : "border-gray-200 dark:border-gray-600"
            }`}
          disabled={disabled}
        >
          <span className={value ? "" : "text-gray-500"}>{value || placeholder}</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const SearchableSelect = ({ label, id, options, placeholder, required, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredOptions = options.filter((o) => o?.toLowerCase().includes(searchTerm?.toLowerCase()));
  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-left flex items-center justify-between"
        >
          <span className={value ? "" : "text-gray-500"}>{value || placeholder}</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border rounded-lg shadow-lg">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-600 border rounded-md text-sm"
              />
            </div>
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => handleSelect(o)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    {o}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No results</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const MultiSelect = ({ label, options, placeholder, required, value = [], onChange, helper }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredOptions = options.filter((o) => o?.toLowerCase().includes(searchTerm?.toLowerCase()));
  const toggleOption = (option) =>
    onChange(value.includes(option) ? value.filter((i) => i !== option) : [...value, option]);
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-left flex items-center justify-between"
        >
          <span className={value.length > 0 ? "" : "text-gray-500"}>
            {value.length > 0 ? `${value.length} selected` : placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border rounded-lg shadow-xl">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-600 border rounded-md text-sm"
              />
            </div>
            <div className="max-h-48 overflow-auto">
              {filteredOptions.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggleOption(o)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-between"
                >
                  <span>{o}</span>
                  {value.includes(o) && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {helper && <p className="mt-2 text-xs text-gray-500">{helper}</p>}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((i) => i !== item))}
                className="ml-2 hover:text-indigo-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
const RangeField = ({ label, id, minPlaceholder, maxPlaceholder, required, onChange, value = {}, helper, error }) => {
  const [minValue, setMinValue] = useState(value.min ?? "");
  const [maxValue, setMaxValue] = useState(value.max ?? "");
  useEffect(() => {
    setMinValue(value.min ?? "");
    setMaxValue(value.max ?? "");
  }, [value]);
  const handleMinChange = (e) => {
    const val = e.target.value;
    setMinValue(val);
    onChange?.(val ? parseInt(val) : null, maxValue ? parseInt(maxValue) : null);
  };
  const handleMaxChange = (e) => {
    const val = e.target.value;
    setMaxValue(val);
    onChange?.(minValue ? parseInt(minValue) : null, val ? parseInt(val) : null);
  };
  const hasError = (minValue && maxValue && parseInt(minValue) > parseInt(maxValue)) || !!error;
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          placeholder={minPlaceholder}
          value={minValue}
          onChange={handleMinChange}
          className={`w-full px-4 py-3 bg-white dark:bg-gray-700/50 border-2 rounded-xl ${hasError ? "border-red-500" : "border-gray-200 dark:border-gray-600"
            }`}
          min="0"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          placeholder={maxPlaceholder}
          value={maxValue}
          onChange={handleMaxChange}
          className={`w-full px-4 py-3 bg-white dark:bg-gray-700/50 border-2 rounded-xl ${hasError ? "border-red-500" : "border-gray-200 dark:border-gray-600"
            }`}
          min="0"
        />
      </div>
      {helper && !error && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
const TagInput = ({ label, value = [], onChange, helper }) => {
  const [inputValue, setInputValue] = useState("");
  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }
    setInputValue("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };
  const removeTag = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-indigo-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder="Add tags..."
        className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl"
      />
      {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
    </div>
  );
};
