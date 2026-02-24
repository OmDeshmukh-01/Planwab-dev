// app/api/vendor/route.js

import { NextResponse } from "next/server";
import {
  Vendor,
  VenueVendor,
  CatererVendor,
  PhotographerVendor,
  MakeupVendor,
  PlannerVendor,
  ClothesVendor,
  MehendiVendor,
  CakeVendor,
  JewelleryVendor,
  InvitationVendor,
  DjVendor,
  HairstylingVendor,
  OtherVendor,
} from "@/database/models/VendorModel";
import { connectToDatabase } from "@/database/mongoose";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PlanWAB@12345";
const VENDOR_EDIT_ADMIN_PASSWORD = process.env.VENDOR_EDIT_ADMIN_PASSWORD || "EDit@PlanWAB@12345";

const verifyAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};

const verifyVendorEditPassword = (password) => {
  return password === VENDOR_EDIT_ADMIN_PASSWORD;
};

const cleanVendorData = (data) => {
  const cleaned = { ...data };

  const trimString = (val) => (typeof val === "string" ? val.trim() : val);
  const parseNumber = (val, defaultVal = 0) => {
    if (val === "" || val === null || val === undefined) return defaultVal;
    const num = Number(val);
    return isNaN(num) ? defaultVal : num;
  };

  // Basic string fields
  const stringFields = [
    "name",
    "username",
    "email",
    "phoneNo",
    "whatsappNo",
    "description",
    "shortDescription",
    "videoUrl",
    "availabilityStatus",
    "priceUnit",
    "responseTime",
    "repeatCustomerRate",
    "responseRate",
    "metaTitle",
    "metaDescription",
  ];

  stringFields.forEach((field) => {
    if (cleaned[field] !== undefined) {
      cleaned[field] = trimString(cleaned[field]);
    }
  });

  // Number fields
  const numberFields = [
    "basePrice",
    "rating",
    "reviews",
    "reviewCount",
    "bookings",
    "yearsExperience",
    "profileViews",
    "favorites",
    "shares",
  ];

  numberFields.forEach((field) => {
    if (cleaned[field] !== undefined) {
      cleaned[field] = parseNumber(cleaned[field]);
    }
  });

  // Boolean fields
  const booleanFields = ["isVerified", "isActive", "isFeatured"];
  booleanFields.forEach((field) => {
    if (cleaned[field] !== undefined) {
      cleaned[field] = Boolean(cleaned[field]);
    }
  });

  // Contact person
  if (cleaned.contactPerson) {
    cleaned.contactPerson = {
      firstName: trimString(cleaned.contactPerson.firstName || ""),
      lastName: trimString(cleaned.contactPerson.lastName || ""),
    };
  }

  // Address
  if (cleaned.address) {
    cleaned.address = {
      street: trimString(cleaned.address.street || ""),
      city: trimString(cleaned.address.city || ""),
      state: trimString(cleaned.address.state || ""),
      postalCode: trimString(cleaned.address.postalCode || ""),
      country: trimString(cleaned.address.country || "India"),
      googleMapUrl: trimString(cleaned.address.googleMapUrl || ""),
      location: cleaned.address.location || { type: "Point", coordinates: [0, 0] },
    };

    // Validate coordinates
    if (cleaned.address.location?.coordinates) {
      const coords = cleaned.address.location.coordinates;
      cleaned.address.location.coordinates = [parseNumber(coords[0], 0), parseNumber(coords[1], 0)];
    }
  }

  // Per day price
  if (cleaned.perDayPrice) {
    cleaned.perDayPrice = {
      min: parseNumber(cleaned.perDayPrice.min, null),
      max: parseNumber(cleaned.perDayPrice.max, null),
    };
    // Remove null values
    if (cleaned.perDayPrice.min === null) delete cleaned.perDayPrice.min;
    if (cleaned.perDayPrice.max === null) delete cleaned.perDayPrice.max;
  }

  // Social links
  if (cleaned.socialLinks) {
    const socialFields = ["website", "facebook", "instagram", "twitter", "youtube", "linkedin"];
    const cleanedSocial = {};
    socialFields.forEach((field) => {
      const val = trimString(cleaned.socialLinks[field] || "");
      if (val) cleanedSocial[field] = val;
    });
    cleaned.socialLinks = cleanedSocial;
  }

  // Vendor Profile (NEW)
  if (cleaned.vendorProfile) {
    const vp = cleaned.vendorProfile;
    cleaned.vendorProfile = {
      profilePicture: trimString(vp.profilePicture || ""),
      coverPhoto: trimString(vp.coverPhoto || ""),
      bio: trimString(vp.bio || ""),
      tagline: trimString(vp.tagline || ""),
      pronouns: trimString(vp.pronouns || ""),
      website: trimString(vp.website || ""),

      // Instagram
      instagramHandle: trimString(vp.instagramHandle || ""),
      instagramFollowers: trimString(vp.instagramFollowers || ""),
      instagramPosts: trimString(vp.instagramPosts || ""),
      instagramFollowing: trimString(vp.instagramFollowing || ""),

      // Other social handles
      facebookHandle: trimString(vp.facebookHandle || ""),
      twitterHandle: trimString(vp.twitterHandle || ""),
      linkedinHandle: trimString(vp.linkedinHandle || ""),
      youtubeHandle: trimString(vp.youtubeHandle || ""),
      youtubeSubscribers: trimString(vp.youtubeSubscribers || ""),
      tiktokHandle: trimString(vp.tiktokHandle || ""),
      pinterestHandle: trimString(vp.pinterestHandle || ""),
      threadsHandle: trimString(vp.threadsHandle || ""),

      // Contact
      businessEmail: trimString(vp.businessEmail || ""),
      publicPhone: trimString(vp.publicPhone || ""),

      // Category
      category: trimString(vp.category || ""),
      subCategory: trimString(vp.subCategory || ""),

      // Testimonial
      testimonialQuote: trimString(vp.testimonialQuote || ""),
      testimonialAuthor: trimString(vp.testimonialAuthor || ""),

      // Verification
      verifiedSince: vp.verifiedSince || null,
      profileCompleteness: parseNumber(vp.profileCompleteness, 0),
      lastActive: vp.lastActive || null,

      // Arrays
      highlights: Array.isArray(vp.highlights) ? vp.highlights.filter(Boolean).map(trimString) : [],
      featuredWork: Array.isArray(vp.featuredWork) ? vp.featuredWork.filter(Boolean) : [],
    };

    // Remove empty string values from vendorProfile
    Object.keys(cleaned.vendorProfile).forEach((key) => {
      const val = cleaned.vendorProfile[key];
      if (val === "" || val === null) {
        delete cleaned.vendorProfile[key];
      }
    });
  }

  // Array fields - clean and filter
  const arrayStringFields = [
    "tags",
    "amenities",
    "facilities",
    "highlightPoints",
    "eventTypes",
    "paymentMethods",
    "metaKeywords",
    "images",
  ];

  arrayStringFields.forEach((field) => {
    if (Array.isArray(cleaned[field])) {
      cleaned[field] = cleaned[field].filter(Boolean).map(trimString);
    }
  });

  // Complex array fields
  const complexArrayFields = [
    "landmarks",
    "directions",
    "operatingHours",
    "stats",
    "highlights",
    "awards",
    "specialOffers",
    "packages",
    "policies",
    "faqs",
    "gallery",
  ];

  complexArrayFields.forEach((field) => {
    if (Array.isArray(cleaned[field])) {
      cleaned[field] = cleaned[field]
        .filter((item) => item && typeof item === "object")
        .map((item) => {
          const cleanedItem = {};
          Object.keys(item).forEach((key) => {
            const val = item[key];
            if (Array.isArray(val)) {
              cleanedItem[key] = val.filter(Boolean).map((v) => (typeof v === "string" ? v.trim() : v));
            } else if (typeof val === "string") {
              cleanedItem[key] = val.trim();
            } else if (typeof val === "number" || typeof val === "boolean") {
              cleanedItem[key] = val;
            } else if (val !== null && val !== undefined) {
              cleanedItem[key] = val;
            }
          });
          return cleanedItem;
        });
    }
  });

  // Packages special handling
  if (Array.isArray(cleaned.packages)) {
    cleaned.packages = cleaned.packages.map((pkg) => ({
      name: trimString(pkg.name || ""),
      price: parseNumber(pkg.price, 0),
      originalPrice: parseNumber(pkg.originalPrice, 0),
      duration: trimString(pkg.duration || ""),
      features: Array.isArray(pkg.features) ? pkg.features.filter(Boolean).map(trimString) : [],
      notIncluded: Array.isArray(pkg.notIncluded) ? pkg.notIncluded.filter(Boolean).map(trimString) : [],
      isPopular: Boolean(pkg.isPopular),
      savingsPercentage: parseNumber(pkg.savingsPercentage, 0),
    }));
  }

  // Policies special handling
  if (Array.isArray(cleaned.policies)) {
    cleaned.policies = cleaned.policies.map((policy) => ({
      title: trimString(policy.title || ""),
      content: trimString(policy.content || ""),
      icon: trimString(policy.icon || "FileText"),
      iconColor: trimString(policy.iconColor || "text-gray-500"),
      details: Array.isArray(policy.details) ? policy.details.filter(Boolean).map(trimString) : [],
    }));
  }

  // FAQs special handling
  if (Array.isArray(cleaned.faqs)) {
    cleaned.faqs = cleaned.faqs
      .map((faq) => ({
        question: trimString(faq.question || ""),
        answer: trimString(faq.answer || ""),
      }))
      .filter((faq) => faq.question || faq.answer);
  }

  // Default image
  if (Array.isArray(cleaned.images) && cleaned.images.length > 0 && !cleaned.defaultImage) {
    cleaned.defaultImage = cleaned.images[0];
  }

  return cleaned;
};

// =============================================================================
// GET - Fetch all vendors with pagination, filters, and search (OPTIMIZED)
// =============================================================================

const SUBCATEGORY_MAPPINGS = {
  // Venues
  "banquet-halls": { venueType: /banquet.*hall/i },
  farmhouses: { venueType: /farm/i },
  hotels: { venueType: /hotel/i },
  resorts: { venueType: /resort/i },
  lawns: { venueType: /lawn|garden/i },
  destination: { venueType: /destination/i },
  beach: { venueType: /beach/i },
  palace: { venueType: /palace|heritage/i },

  // Photographers
  "wedding-photography": { services: /wedding.*photo/i },
  "pre-wedding": { services: /pre.*wedding/i },
  candid: { services: /candid/i },
  traditional: { services: /traditional/i },
  videography: { services: /videography|video/i },
  drone: { $or: [{ droneAvailable: true }, { services: /drone/i }] },
  album: { services: /album/i },
  photobooth: { services: /photo.*booth/i },

  // Makeup
  "bridal-makeup": { services: /bridal.*makeup/i },
  "party-makeup": { services: /party.*makeup/i },
  airbrush: { services: /airbrush/i },
  "hd-makeup": { services: /hd.*makeup/i },
  engagement: { services: /engagement/i },
  reception: { services: /reception/i },
  "hair-styling": { services: /hair.*styling/i },
  draping: { services: /draping|saree/i },

  // Planners
  "full-planning": { specializations: /full.*planning/i },
  "partial-planning": { specializations: /partial/i },
  "day-coordination": { specializations: /day.*coordination/i },
  "destination-planning": { $or: [{ destinationWeddings: true }, { specializations: /destination/i }] },
  "budget-planning": { specializations: /budget/i },
  "vendor-management": { specializations: /vendor.*management/i },
  "guest-management": { specializations: /guest.*management/i },
  "theme-design": { specializations: /theme.*design/i },

  // Catering
  vegetarian: { menuTypes: /vegetarian|veg/i },
  "non-vegetarian": { menuTypes: /non.*veg/i },
  "multi-cuisine": { cuisines: /multi/i },
  "south-indian": { cuisines: /south.*indian/i },
  "north-indian": { cuisines: /north.*indian/i },
  chinese: { cuisines: /chinese|oriental/i },
  continental: { cuisines: /continental/i },
  "live-counters": { liveCounters: true },

  // Clothes
  "bridal-lehenga": { outfitTypes: /bridal.*lehenga/i },
  "groom-sherwani": { outfitTypes: /sherwani|groom/i },
  "designer-wear": { outfitTypes: /designer/i },
  rental: { rentalAvailable: true },
  accessories: { outfitTypes: /accessories/i },
  jewelry: { outfitTypes: /jewelry|jewellery/i },
  footwear: { outfitTypes: /footwear|shoe/i },
  trousseau: { outfitTypes: /trousseau/i },

  // Mehendi
  "bridal-mehendi": { designs: /bridal/i },
  arabic: { designs: /arabic/i },
  rajasthani: { designs: /rajasthani/i },
  portrait: { designs: /portrait/i },
  minimal: { designs: /minimal/i },
  glitter: { designs: /glitter/i },
  "white-henna": { designs: /white.*henna/i },
  "nail-art": { designs: /nail.*art/i },

  // DJs
  "wedding-dj": { genres: /wedding/i },
  "sangeet-dj": { genres: /sangeet/i },
  cocktail: { genres: /cocktail/i },
  "live-band": { genres: /live.*band/i },
  dhol: { genres: /dhol/i },
  "sound-system": { equipmentProvided: true },
  lighting: { lightingIncluded: true },
  anchoring: { emceeServices: true },
};

// =============================================================================
// SORT MAPPING - Maps frontend sort IDs to MongoDB sort objects
// =============================================================================
const SORT_MAPPINGS = {
  rating: { rating: -1, reviewCount: -1 },
  "price-asc": { basePrice: 1, "perDayPrice.min": 1 },
  "price-desc": { basePrice: -1, "perDayPrice.min": -1 },
  bookings: { bookings: -1, rating: -1 },
  newest: { createdAt: -1 },
  reviews: { reviewCount: -1, rating: -1 },
  createdAt: { createdAt: -1 },
  popular: { isFeatured: -1, rating: -1, bookings: -1 },
};

// =============================================================================
// GET - Fetch vendors with advanced filtering, search, and pagination
// =============================================================================
export async function GET(request) {
  const startTime = Date.now();

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    // =============================================================================
    // EXTRACT QUERY PARAMETERS
    // =============================================================================
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const vendorId = searchParams.get("id");

    // Filter parameters
    const category = searchParams.get("category");
    const categories = searchParams.get("categories");
    const subcategory = searchParams.get("subcategory");
    const availability = searchParams.get("availability");
    const featured = searchParams.get("featured");
    const minRating = searchParams.get("minRating");
    const cities = searchParams.get("cities");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const verifiedOnly = searchParams.get("verifiedOnly");
    const activeOnly = searchParams.get("activeOnly");

    // Sort parameters
    const sortBy = searchParams.get("sortBy") || "rating";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // =============================================================================
    // HANDLE SINGLE VENDOR REQUEST
    // =============================================================================
    if (vendorId) {
      const vendor = await Vendor.findById(vendorId).select("-reviewsList -likedBy -bookmarkedBy").lean().exec();

      if (!vendor) {
        return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: vendor });
    }

    // =============================================================================
    // BUILD QUERY OBJECT
    // =============================================================================
    const query = {};
    const andConditions = [];

    // ---------------------------------------------------------------------------
    // 1. CATEGORY FILTERING
    // ---------------------------------------------------------------------------
    if (categories) {
      const categoryArray = categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (categoryArray.length === 1) {
        query.category = categoryArray[0];
      } else if (categoryArray.length > 1) {
        query.category = { $in: categoryArray };
      }
    } else if (category && category !== "all") {
      query.category = category;
    }

    // ---------------------------------------------------------------------------
    // 2. SUBCATEGORY FILTERING
    // ---------------------------------------------------------------------------
    if (subcategory && subcategory !== "" && SUBCATEGORY_MAPPINGS[subcategory]) {
      const subcategoryQuery = SUBCATEGORY_MAPPINGS[subcategory];
      andConditions.push(subcategoryQuery);
    }

    // ---------------------------------------------------------------------------
    // 3. AVAILABILITY STATUS
    // ---------------------------------------------------------------------------
    if (availability && availability !== "all") {
      query.availabilityStatus = availability;
    }

    // ---------------------------------------------------------------------------
    // 4. FEATURED VENDORS
    // ---------------------------------------------------------------------------
    if (featured === "true") {
      query.isFeatured = true;
    }

    // ---------------------------------------------------------------------------
    // 4b. VERIFIED VENDORS
    // ---------------------------------------------------------------------------
    if (verifiedOnly === "true") {
      query.isVerified = true;
    }

    // ---------------------------------------------------------------------------
    // 4c. ACTIVE VENDORS
    // ---------------------------------------------------------------------------
    if (activeOnly === "true") {
      query.$or = [
        { availabilityStatus: "Available" },
        { isActive: true },
      ];
    }

    // ---------------------------------------------------------------------------
    // 5. MINIMUM RATING FILTER
    // ---------------------------------------------------------------------------
    if (minRating && !isNaN(parseFloat(minRating))) {
      const ratingValue = parseFloat(minRating);
      if (ratingValue > 0) {
        query.rating = { $gte: ratingValue };
      }
    }

    // ---------------------------------------------------------------------------
    // 6. CITY/LOCATION FILTERING
    // ---------------------------------------------------------------------------
    if (cities) {
      const cityArray = cities
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (cityArray.length === 1) {
        query["address.city"] = new RegExp(cityArray[0], "i");
      } else if (cityArray.length > 1) {
        query["address.city"] = { $in: cityArray.map((c) => new RegExp(c, "i")) };
      }
    }

    // ---------------------------------------------------------------------------
    // 7. PRICE RANGE FILTERING
    // ---------------------------------------------------------------------------
    if (minPrice || maxPrice) {
      const priceConditions = [];

      if (minPrice && !isNaN(parseInt(minPrice))) {
        const minPriceValue = parseInt(minPrice);
        priceConditions.push({
          $or: [{ basePrice: { $gte: minPriceValue } }, { "perDayPrice.min": { $gte: minPriceValue } }],
        });
      }

      if (maxPrice && !isNaN(parseInt(maxPrice))) {
        const maxPriceValue = parseInt(maxPrice);
        priceConditions.push({
          $or: [{ basePrice: { $lte: maxPriceValue } }, { "perDayPrice.min": { $lte: maxPriceValue } }],
        });
      }

      if (priceConditions.length > 0) {
        andConditions.push(...priceConditions);
      }
    }

    // ---------------------------------------------------------------------------
    // 8. SEARCH QUERY (Full-text search across multiple fields)
    // ---------------------------------------------------------------------------
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      const searchConditions = [
        { name: searchRegex },
        { email: searchRegex },
        { username: searchRegex },
        { "address.city": searchRegex },
        { "address.state": searchRegex },
        { "address.street": searchRegex },
        { tags: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { amenities: searchRegex },
        { facilities: searchRegex },
        { eventTypes: searchRegex },
      ];

      andConditions.push({ $or: searchConditions });
    }

    // ---------------------------------------------------------------------------
    // 9. COMBINE ALL CONDITIONS
    // ---------------------------------------------------------------------------
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // =============================================================================
    // BUILD SORT OBJECT
    // =============================================================================
    let sort = {};

    if (SORT_MAPPINGS[sortBy]) {
      // Use predefined sort mapping
      sort = { ...SORT_MAPPINGS[sortBy] };

      // Apply sortOrder to the primary sort field only if it's not a compound sort
      if (sortOrder === "asc" && Object.keys(sort).length === 1) {
        const primaryField = Object.keys(sort)[0];
        sort[primaryField] = 1;
      }
    } else {
      // Fallback: sort by the field name with given order
      sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    // Always add _id as secondary sort for consistency
    if (!sort._id) {
      sort._id = -1;
    }

    // =============================================================================
    // PAGINATION CALCULATION
    // =============================================================================
    const skip = (page - 1) * limit;

    // =============================================================================
    // OPTIMIZED: PARALLEL QUERY EXECUTION
    // =============================================================================
    // Only fetch availableCities if cities filter is NOT applied (optimization)
    const shouldFetchCities = !cities;

    // Build query for cities (exclude city filter to get all available)
    const citiesQuery = shouldFetchCities
      ? {
        ...query,
        "address.city": undefined,
      }
      : null;

    // Execute all queries in parallel for maximum performance
    const [vendors, total, availableCities] = await Promise.all([
      // Main vendor query with optimized select and lean
      Vendor.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-reviewsList -likedBy -bookmarkedBy -__v") // Exclude large/unnecessary fields
        .collation({ locale: "en", strength: 2 })
        .lean({ virtuals: false }) // Disable virtuals for faster execution
        .exec(),

      // Count query (optimized with hint if needed)
      Vendor.countDocuments(query).exec(),

      // Conditional cities query - only run if needed
      shouldFetchCities ? Vendor.distinct("address.city", citiesQuery).exec() : Promise.resolve([]),
    ]);

    // =============================================================================
    // OPTIMIZED: DATA PROCESSING (Minimize operations)
    // =============================================================================
    const processedVendors = vendors.map((vendor) => ({
      ...vendor,
      bookings: vendor.bookings ?? vendor.totalBookings ?? 0,
      reviews: vendor.reviews ?? vendor.reviewCount ?? vendor.totalReviews ?? 0,
      rating: vendor.rating ?? vendor.averageRating ?? 0,
    }));

    // =============================================================================
    // CALCULATE PAGINATION METADATA
    // =============================================================================
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // =============================================================================
    // PREPARE OPTIMIZED RESPONSE
    // =============================================================================
    return NextResponse.json({
      success: true,
      data: processedVendors,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
        currentPage: page,
        resultsOnPage: processedVendors.length,
      },
      filters: {
        availableCities: shouldFetchCities ? availableCities.filter(Boolean).sort() : [],
        appliedFilters: {
          category: categories || category,
          subcategory,
          featured: featured === "true",
          cities: cities ? cities.split(",") : [],
          priceRange: {
            min: minPrice ? parseInt(minPrice) : 0,
            max: maxPrice ? parseInt(maxPrice) : null,
          },
          minRating: minRating ? parseFloat(minRating) : 0,
          search: search || null,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        queryExecutionTime: Date.now() - startTime,
        sortApplied: {
          sortBy,
          sortOrder,
          sortMapping: SORT_MAPPINGS[sortBy] ? "predefined" : "dynamic",
        },
      },
    });
  } catch (error) {
    // Handle specific error types
    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid parameter format",
          error: error.message,
        },
        { status: 400 }
      );
    }

    if (error.name === "MongooseError" || error.name === "MongoError") {
      return NextResponse.json(
        {
          success: false,
          message: "Database error occurred",
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vendors",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// PUT - Update vendor (requires admin password)
// =============================================================================

export async function PUT(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { id, password, ...updateData } = body;

    // Validate ID
    if (!id) {
      return NextResponse.json({ success: false, message: "Vendor ID is required" }, { status: 400 });
    }

    // Verify admin password
    if (!verifyVendorEditPassword(password)) {
      return NextResponse.json({ success: false, message: "Invalid admin password" }, { status: 401 });
    }

    // Find existing vendor
    const existingVendor = await Vendor.findById(id).lean();
    if (!existingVendor) {
      return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
    }

    // Clean and prepare update data
    const cleanedData = cleanVendorData(updateData);

    // Remove fields that shouldn't be updated
    const protectedFields = ["_id", "createdAt", "category", "__v"];
    protectedFields.forEach((field) => delete cleanedData[field]);

    // Merge nested objects properly (preserve existing data if not provided)
    const mergeFields = ["contactPerson", "address", "perDayPrice", "socialLinks", "vendorProfile"];
    mergeFields.forEach((field) => {
      if (cleanedData[field] && existingVendor[field]) {
        cleanedData[field] = {
          ...existingVendor[field],
          ...cleanedData[field],
        };
      }
    });

    // Update vendor with optimized query
    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      {
        $set: {
          ...cleanedData,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
        lean: true,
        projection: {
          __v: 0,
        },
      }
    );

    if (!updatedVendor) {
      return NextResponse.json({ success: false, message: "Failed to update vendor" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor updated successfully!",
      vendor: updatedVendor,
    });
  } catch (error) {
    // Validation Error
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return NextResponse.json({ success: false, message: "Validation Error", errors }, { status: 400 });
    }

    // Duplicate Key Error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      return NextResponse.json(
        { success: false, message: `A vendor with this ${field} already exists.` },
        { status: 409 }
      );
    }

    // Invalid ID Format
    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid vendor ID format" }, { status: 400 });
    }

    // Generic Error
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update vendor",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Delete vendor (requires admin password)
// =============================================================================

export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const password = searchParams.get("password");

    // Validate ID
    if (!id) {
      return NextResponse.json({ success: false, message: "Vendor ID is required" }, { status: 400 });
    }

    // Verify admin password
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ success: false, message: "Invalid admin password" }, { status: 401 });
    }

    // Find and delete vendor
    const deletedVendor = await Vendor.findByIdAndDelete(id);

    if (!deletedVendor) {
      return NextResponse.json({ success: false, message: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor deleted successfully!",
      vendor: {
        id: deletedVendor._id,
        name: deletedVendor.name,
        username: deletedVendor.username,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return NextResponse.json({ success: false, message: "Invalid vendor ID format" }, { status: 400 });
    }

    return NextResponse.json(
      { success: false, message: "Failed to delete vendor", error: error.message },
      { status: 500 }
    );
  }
}
