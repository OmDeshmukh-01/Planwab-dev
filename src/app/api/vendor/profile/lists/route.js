// app/api/vendor-profile/route.js

import { NextResponse } from "next/server";
import VendorProfile from "../../../../../database/models/VendorProfileModel";
import { connectToDatabase } from "../../../../../database/mongoose";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const cleanProfileData = (data) => {
  const cleaned = { ...data };

  // Remove sensitive data
  if (cleaned.password) delete cleaned.password;
  if (cleaned.__v) delete cleaned.__v;

  return cleaned;
};

// =============================================================================
// SORT MAPPING - Maps frontend sort IDs to MongoDB sort objects
// =============================================================================
const SORT_MAPPINGS = {
  trust: { trust: -1, likes: -1 }, // Default: Most trusted
  "trust-asc": { trust: 1 },
  "trust-desc": { trust: -1, likes: -1 },
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  popular: { likes: -1, trust: -1 },
  "most-liked": { likes: -1, trust: -1 },
  "most-trusted-by": { trustedBy: -1, trust: -1 },
  alphabetical: { vendorBusinessName: 1 },
  "posts-count": { "posts.length": -1 },
  "reels-count": { "reels.length": -1 },
};

// =============================================================================
// GET - Fetch vendor profiles with advanced filtering, search, and pagination
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
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    
    // Single profile fetch parameters
    const profileId = searchParams.get("id");
    const username = searchParams.get("username");
    const vendorId = searchParams.get("vendorId");

    // Filter parameters
    const category = searchParams.get("category");
    const categories = searchParams.get("categories");
    const city = searchParams.get("city");
    const cities = searchParams.get("cities");
    const state = searchParams.get("state");
    const country = searchParams.get("country");
    const minTrust = searchParams.get("minTrust");
    const search = searchParams.get("search");
    const hasHighlights = searchParams.get("hasHighlights");
    const hasPosts = searchParams.get("hasPosts");
    const hasReels = searchParams.get("hasReels");

    // Sort parameters
    const sortBy = searchParams.get("sortBy") || "trust"; // Default: most trusted
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // =============================================================================
    // HANDLE SINGLE PROFILE REQUEST
    // =============================================================================
    if (profileId || username || vendorId) {
      let profile;

      if (profileId) {
        profile = await VendorProfile.findById(profileId)
          .select("-password -__v")
          .lean()
          .exec();
      } else if (username) {
        profile = await VendorProfile.findOne({ username })
          .select("-password -__v")
          .lean()
          .exec();
      } else if (vendorId) {
        profile = await VendorProfile.findOne({ vendorId })
          .select("-password -__v")
          .lean()
          .exec();
      }

      if (!profile) {
        return NextResponse.json(
          { success: false, message: "Vendor profile not found" },
          { status: 404 }
        );
      }

      // Add computed fields
      const enrichedProfile = {
        ...profile,
        likesCount: Array.isArray(profile.likes) ? profile.likes.length : 0,
        trustedByCount: Array.isArray(profile.trustedBy) ? profile.trustedBy.length : 0,
        highlightsCount: Array.isArray(profile.highlights) ? profile.highlights.length : 0,
        postsCount: Array.isArray(profile.posts) ? profile.posts.length : 0,
        reelsCount: Array.isArray(profile.reels) ? profile.reels.length : 0,
      };

      return NextResponse.json({
        success: true,
        data: enrichedProfile,
      });
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
    // 2. LOCATION FILTERING
    // ---------------------------------------------------------------------------
    if (cities) {
      const cityArray = cities
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (cityArray.length === 1) {
        query["location.city"] = new RegExp(cityArray[0], "i");
      } else if (cityArray.length > 1) {
        query["location.city"] = {
          $in: cityArray.map((c) => new RegExp(c, "i")),
        };
      }
    } else if (city) {
      query["location.city"] = new RegExp(city, "i");
    }

    if (state) {
      query["location.state"] = new RegExp(state, "i");
    }

    if (country) {
      query["location.country"] = new RegExp(country, "i");
    }

    // ---------------------------------------------------------------------------
    // 3. TRUST LEVEL FILTERING
    // ---------------------------------------------------------------------------
    if (minTrust && !isNaN(parseFloat(minTrust))) {
      const trustValue = parseFloat(minTrust);
      if (trustValue > 0) {
        query.trust = { $gte: trustValue };
      }
    }

    // ---------------------------------------------------------------------------
    // 4. CONTENT AVAILABILITY FILTERS
    // ---------------------------------------------------------------------------
    if (hasHighlights === "true") {
      query["highlights.0"] = { $exists: true };
    }

    if (hasPosts === "true") {
      query["posts.0"] = { $exists: true };
    }

    if (hasReels === "true") {
      query["reels.0"] = { $exists: true };
    }

    // ---------------------------------------------------------------------------
    // 5. SEARCH QUERY (Full-text search across multiple fields)
    // ---------------------------------------------------------------------------
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      const searchConditions = [
        { vendorBusinessName: searchRegex },
        { vendorName: searchRegex },
        { username: searchRegex },
        { bio: searchRegex },
        { category: searchRegex },
        { "location.city": searchRegex },
        { "location.state": searchRegex },
        { "location.address": searchRegex },
      ];

      andConditions.push({ $or: searchConditions });
    }

    // ---------------------------------------------------------------------------
    // 6. COMBINE ALL CONDITIONS
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

      // Apply sortOrder override if needed
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
    const shouldFetchCities = !cities && !city;
    const shouldFetchCategories = !categories && !category;

    // Build queries for aggregates
    const citiesQuery = shouldFetchCities ? { ...query, "location.city": undefined } : null;
    const categoriesQuery = shouldFetchCategories ? { ...query, category: undefined } : null;

    // Execute all queries in parallel
    const [profiles, total, availableCities, availableCategories] = await Promise.all([
      // Main profiles query with optimized select and lean
      VendorProfile.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-password -__v -posts.reviews -posts.savedBy -reels.savedBy -highlights.items.comments")
        .collation({ locale: "en", strength: 2 })
        .lean({ virtuals: false })
        .exec(),

      // Count query
      VendorProfile.countDocuments(query).exec(),

      // Conditional cities query
      shouldFetchCities
        ? VendorProfile.distinct("location.city", citiesQuery).exec()
        : Promise.resolve([]),

      // Conditional categories query
      shouldFetchCategories
        ? VendorProfile.distinct("category", categoriesQuery).exec()
        : Promise.resolve([]),
    ]);

    // =============================================================================
    // DATA PROCESSING - Add computed fields
    // =============================================================================
    const processedProfiles = profiles.map((profile) => ({
      ...profile,
      likesCount: Array.isArray(profile.likes) ? profile.likes.length : 0,
      trustedByCount: Array.isArray(profile.trustedBy) ? profile.trustedBy.length : 0,
      highlightsCount: Array.isArray(profile.highlights) ? profile.highlights.length : 0,
      postsCount: Array.isArray(profile.posts) ? profile.posts.length : 0,
      reelsCount: Array.isArray(profile.reels) ? profile.reels.length : 0,
      
      // Remove large arrays for list view (keep counts only)
      likes: undefined,
      trustedBy: undefined,
    }));

    // =============================================================================
    // CALCULATE PAGINATION METADATA
    // =============================================================================
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // =============================================================================
    // PREPARE RESPONSE
    // =============================================================================
    return NextResponse.json({
      success: true,
      data: processedProfiles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
        currentPage: page,
        resultsOnPage: processedProfiles.length,
      },
      filters: {
        availableCities: shouldFetchCities
          ? availableCities.filter(Boolean).sort()
          : [],
        availableCategories: shouldFetchCategories
          ? availableCategories.filter(Boolean).sort()
          : [],
        appliedFilters: {
          category: categories || category,
          cities: cities ? cities.split(",") : city ? [city] : [],
          state: state || null,
          country: country || null,
          minTrust: minTrust ? parseFloat(minTrust) : 0,
          search: search || null,
          hasHighlights: hasHighlights === "true",
          hasPosts: hasPosts === "true",
          hasReels: hasReels === "true",
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
        message: "Failed to fetch vendor profiles",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}