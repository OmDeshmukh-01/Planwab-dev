import { NextResponse } from "next/server";
import { connectToDatabase } from '../../../../../database/mongoose';
import VendorProfile from "../../../../../database/models/VendorProfileModel";

// Helper function to extract keywords from text
function extractKeywords(text) {
  if (!text) return [];
  // Remove HTML tags and special characters
  const cleanText = text
    .replace(/<[^>]*>/g, " ")
    .replace(/[^\w\s#@]/g, " ")
    .toLowerCase();
  
  // Extract hashtags
  const hashtags = cleanText.match(/#\w+/g) || [];
  
  // Extract meaningful words (excluding common words)
  const commonWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can", "need",
    "our", "your", "his", "her", "its", "their", "this", "that", "these",
    "those", "i", "you", "he", "she", "it", "we", "they", "what", "which",
    "who", "whom", "whose", "where", "when", "why", "how", "all", "each",
    "every", "both", "few", "more", "most", "other", "some", "such", "no",
    "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just",
    "nbsp", "amp", "www", "com", "http", "https"
  ]);
  
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word) && !word.startsWith("#"));
  
  return [...new Set([...hashtags, ...words])];
}

// Calculate similarity score between two profiles
function calculateSimilarityScore(sourceProfile, targetProfile) {
  let score = 0;
  
  // Category match (highest weight - 50 points)
  if (sourceProfile.category?.toLowerCase() === targetProfile.category?.toLowerCase()) {
    score += 50;
  }
  
  // Location matching
  const sourceLocation = sourceProfile.location || {};
  const targetLocation = targetProfile.location || {};
  
  // Same city (20 points)
  if (sourceLocation.city && targetLocation.city && 
      sourceLocation.city.toLowerCase() === targetLocation.city.toLowerCase()) {
    score += 20;
  }
  // Same state (10 points)
  else if (sourceLocation.state && targetLocation.state && 
           sourceLocation.state.toLowerCase() === targetLocation.state.toLowerCase()) {
    score += 10;
  }
  // Same country (5 points)
  else if (sourceLocation.country && targetLocation.country && 
           sourceLocation.country.toLowerCase() === targetLocation.country.toLowerCase()) {
    score += 5;
  }
  
  // Content similarity based on keywords
  const sourceKeywords = new Set([
    ...extractKeywords(sourceProfile.bio),
    ...sourceProfile.posts?.flatMap(p => extractKeywords(p.description)) || [],
    ...sourceProfile.reels?.flatMap(r => extractKeywords(r.caption + " " + r.title)) || []
  ]);
  
  const targetKeywords = [
    ...extractKeywords(targetProfile.bio),
    ...targetProfile.posts?.flatMap(p => extractKeywords(p.description)) || [],
    ...targetProfile.reels?.flatMap(r => extractKeywords(r.caption + " " + r.title)) || []
  ];
  
  // Calculate keyword overlap (up to 15 points)
  let keywordMatches = 0;
  targetKeywords.forEach(keyword => {
    if (sourceKeywords.has(keyword)) keywordMatches++;
  });
  score += Math.min(keywordMatches * 2, 15);
  
  // Engagement level similarity (up to 10 points)
  const sourceTrust = sourceProfile.trust || 0;
  const targetTrust = targetProfile.trust || 0;
  const trustDiff = Math.abs(sourceTrust - targetTrust);
  score += Math.max(0, 10 - trustDiff);
  
  // Content volume similarity (up to 5 points)
  const sourceContentCount = (sourceProfile.posts?.length || 0) + (sourceProfile.reels?.length || 0);
  const targetContentCount = (targetProfile.posts?.length || 0) + (targetProfile.reels?.length || 0);
  
  if (sourceContentCount > 0 && targetContentCount > 0) {
    const contentRatio = Math.min(sourceContentCount, targetContentCount) / 
                         Math.max(sourceContentCount, targetContentCount);
    score += contentRatio * 5;
  }
  
  return score;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorProfileId = searchParams.get("vendorProfileId");
    const limit = parseInt(searchParams.get("limit")) || 5;

    if (!vendorProfileId) {
      return NextResponse.json(
        { success: false, error: "vendorProfileId is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get the source profile
    const sourceProfile = await VendorProfile.findById(vendorProfileId).lean();

    if (!sourceProfile) {
      return NextResponse.json(
        { success: false, error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    // Find potential similar profiles
    // First, prioritize same category
    const sameCategoryProfiles = await VendorProfile.find({
      _id: { $ne: vendorProfileId },
      category: { $regex: new RegExp(`^${sourceProfile.category}$`, "i") }
    })
      .select("vendorId vendorBusinessName vendorName username vendorAvatar category location trust trustedBy posts reels bio")
      .limit(20)
      .lean();

    // Then get some from other categories for diversity
    const otherProfiles = await VendorProfile.find({
      _id: { $ne: vendorProfileId },
      category: { $not: { $regex: new RegExp(`^${sourceProfile.category}$`, "i") } }
    })
      .select("vendorId vendorBusinessName vendorName username vendorAvatar category location trust trustedBy posts reels bio")
      .limit(10)
      .lean();

    const allProfiles = [...sameCategoryProfiles, ...otherProfiles];

    // Calculate similarity scores and sort
    const scoredProfiles = allProfiles.map(profile => ({
      ...profile,
      similarityScore: calculateSimilarityScore(sourceProfile, profile)
    }));

    scoredProfiles.sort((a, b) => b.similarityScore - a.similarityScore);

    // Take top results and format response
    const similarProfiles = scoredProfiles.slice(0, limit).map(profile => ({
      _id: profile._id,
      vendorId: profile.vendorId,
      vendorBusinessName: profile.vendorBusinessName,
      vendorName: profile.vendorName,
      username: profile.username,
      vendorAvatar: profile.vendorAvatar,
      category: profile.category,
      location: profile.location,
      trust: profile.trust,
      trustedBy: profile.trustedBy || [],
      postsCount: profile.posts?.length || 0,
      reelsCount: profile.reels?.length || 0,
      similarityScore: profile.similarityScore
    }));

    return NextResponse.json({
      success: true,
      data: similarProfiles,
      sourceCategory: sourceProfile.category
    });

  } catch (error) {
    console.error("Error fetching similar profiles:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

const CATEGORY_RELATIONS = {
  photographers: {
    related: ["videographers", "cinematographers", "drone-operators", "photo-booth", "album-designers"],
    keywords: ["photo", "camera", "shoot", "portrait", "candid", "visual", "image", "picture"],
    industry: "media"
  },
  videographers: {
    related: ["photographers", "cinematographers", "drone-operators", "video-editors", "film-makers"],
    keywords: ["video", "film", "cinema", "shoot", "recording", "footage", "motion"],
    industry: "media"
  },
  cinematographers: {
    related: ["videographers", "photographers", "film-makers", "drone-operators", "video-editors"],
    keywords: ["cinema", "film", "movie", "visual", "story", "shoot"],
    industry: "media"
  },
  djs: {
    related: ["musicians", "bands", "singers", "sound-systems", "lighting", "entertainment", "emcees"],
    keywords: ["music", "sound", "party", "dance", "entertainment", "audio", "mix"],
    industry: "entertainment"
  },
  musicians: {
    related: ["djs", "bands", "singers", "instrumentalists", "orchestras", "sound-systems"],
    keywords: ["music", "instrument", "song", "melody", "performance", "live"],
    industry: "entertainment"
  },
  bands: {
    related: ["musicians", "djs", "singers", "orchestras", "entertainment", "sound-systems"],
    keywords: ["music", "live", "performance", "song", "band", "group"],
    industry: "entertainment"
  },
  singers: {
    related: ["musicians", "bands", "djs", "entertainment", "orchestras"],
    keywords: ["sing", "vocal", "voice", "song", "music", "performance"],
    industry: "entertainment"
  },
  caterers: {
    related: ["chefs", "bakers", "cake-designers", "food-stylists", "bartenders", "food-trucks"],
    keywords: ["food", "cuisine", "meal", "dining", "catering", "menu", "cook"],
    industry: "food"
  },
  chefs: {
    related: ["caterers", "bakers", "cake-designers", "food-stylists", "restaurants"],
    keywords: ["food", "cook", "cuisine", "culinary", "kitchen", "recipe"],
    industry: "food"
  },
  bakers: {
    related: ["cake-designers", "caterers", "chefs", "dessert-specialists", "pastry-chefs"],
    keywords: ["bake", "cake", "pastry", "dessert", "sweet", "bread"],
    industry: "food"
  },
  "cake-designers": {
    related: ["bakers", "caterers", "dessert-specialists", "pastry-chefs", "chefs"],
    keywords: ["cake", "dessert", "sweet", "custom", "design", "wedding-cake"],
    industry: "food"
  },
  decorators: {
    related: ["florists", "event-planners", "wedding-planners", "lighting", "balloon-decorators", "stage-designers"],
    keywords: ["decor", "design", "setup", "theme", "aesthetic", "arrangement"],
    industry: "decor"
  },
  florists: {
    related: ["decorators", "event-planners", "wedding-planners", "gift-shops", "balloon-decorators"],
    keywords: ["flower", "floral", "bouquet", "arrangement", "bloom", "garland"],
    industry: "decor"
  },
  "balloon-decorators": {
    related: ["decorators", "florists", "event-planners", "party-planners", "stage-designers"],
    keywords: ["balloon", "decor", "party", "celebration", "arrangement"],
    industry: "decor"
  },
  "makeup-artists": {
    related: ["hair-stylists", "mehndi-artists", "beauty-salons", "bridal-stylists", "nail-artists"],
    keywords: ["makeup", "beauty", "bridal", "cosmetic", "look", "style", "glam"],
    industry: "beauty"
  },
  "hair-stylists": {
    related: ["makeup-artists", "beauty-salons", "bridal-stylists", "barbers", "nail-artists"],
    keywords: ["hair", "style", "cut", "bridal", "salon", "beauty"],
    industry: "beauty"
  },
  "mehndi-artists": {
    related: ["makeup-artists", "bridal-stylists", "beauty-salons", "nail-artists", "tattoo-artists"],
    keywords: ["mehndi", "henna", "bridal", "design", "art", "traditional"],
    industry: "beauty"
  },
  "bridal-stylists": {
    related: ["makeup-artists", "hair-stylists", "fashion-designers", "boutiques", "jewelers"],
    keywords: ["bridal", "wedding", "style", "fashion", "dress", "look"],
    industry: "beauty"
  },
  "wedding-planners": {
    related: ["event-planners", "decorators", "venues", "caterers", "photographers", "coordinators"],
    keywords: ["wedding", "plan", "organize", "coordinate", "event", "management"],
    industry: "planning"
  },
  "event-planners": {
    related: ["wedding-planners", "decorators", "venues", "caterers", "corporate-events", "party-planners"],
    keywords: ["event", "plan", "organize", "coordinate", "management", "party"],
    industry: "planning"
  },
  "party-planners": {
    related: ["event-planners", "decorators", "balloon-decorators", "caterers", "djs", "entertainment"],
    keywords: ["party", "celebration", "birthday", "event", "fun", "organize"],
    industry: "planning"
  },
  venues: {
    related: ["hotels", "resorts", "banquet-halls", "farmhouses", "wedding-planners", "caterers"],
    keywords: ["venue", "location", "hall", "space", "place", "destination"],
    industry: "venue"
  },
  hotels: {
    related: ["venues", "resorts", "banquet-halls", "restaurants", "destination-weddings"],
    keywords: ["hotel", "accommodation", "stay", "hospitality", "rooms"],
    industry: "venue"
  },
  resorts: {
    related: ["hotels", "venues", "destination-weddings", "farmhouses", "banquet-halls"],
    keywords: ["resort", "destination", "luxury", "getaway", "stay"],
    industry: "venue"
  },
  "banquet-halls": {
    related: ["venues", "hotels", "wedding-planners", "caterers", "decorators"],
    keywords: ["banquet", "hall", "venue", "event", "reception", "function"],
    industry: "venue"
  },
  pandits: {
    related: ["priests", "astrologers", "wedding-planners", "religious-services", "puja-services"],
    keywords: ["pandit", "priest", "puja", "ceremony", "ritual", "religious", "vedic"],
    industry: "religious"
  },
  priests: {
    related: ["pandits", "religious-services", "wedding-planners", "ceremony-officiants"],
    keywords: ["priest", "ceremony", "religious", "ritual", "blessing", "officiant"],
    industry: "religious"
  },
  choreographers: {
    related: ["dancers", "entertainment", "wedding-planners", "sangeet-coordinators", "dance-troupes"],
    keywords: ["dance", "choreography", "sangeet", "performance", "routine", "steps"],
    industry: "entertainment"
  },
  dancers: {
    related: ["choreographers", "dance-troupes", "entertainment", "performers", "musicians"],
    keywords: ["dance", "perform", "stage", "entertainment", "show"],
    industry: "entertainment"
  },
  entertainment: {
    related: ["djs", "musicians", "bands", "dancers", "magicians", "anchors", "emcees"],
    keywords: ["entertainment", "show", "perform", "fun", "act", "program"],
    industry: "entertainment"
  },
  anchors: {
    related: ["emcees", "entertainment", "event-planners", "djs", "comedians"],
    keywords: ["anchor", "host", "emcee", "mc", "event", "stage", "speak"],
    industry: "entertainment"
  },
  emcees: {
    related: ["anchors", "entertainment", "djs", "event-planners", "comedians"],
    keywords: ["emcee", "mc", "host", "anchor", "event", "stage"],
    industry: "entertainment"
  },
  jewelers: {
    related: ["boutiques", "fashion-designers", "bridal-stylists", "accessory-designers", "goldsmiths"],
    keywords: ["jewelry", "jewellery", "gold", "diamond", "ornament", "bridal"],
    industry: "fashion"
  },
  boutiques: {
    related: ["fashion-designers", "jewelers", "bridal-stylists", "tailors", "lehenga-stores"],
    keywords: ["boutique", "fashion", "dress", "clothing", "designer", "wear"],
    industry: "fashion"
  },
  "fashion-designers": {
    related: ["boutiques", "tailors", "bridal-stylists", "jewelers", "lehenga-stores"],
    keywords: ["fashion", "design", "clothing", "dress", "style", "couture"],
    industry: "fashion"
  },
  tailors: {
    related: ["fashion-designers", "boutiques", "alterations", "embroidery", "bridal-wear"],
    keywords: ["tailor", "stitch", "alterations", "fitting", "custom", "sew"],
    industry: "fashion"
  },
  "invitation-designers": {
    related: ["graphic-designers", "printers", "wedding-planners", "calligraphers", "stationery"],
    keywords: ["invitation", "card", "design", "print", "wedding-card", "stationery"],
    industry: "print"
  },
  "graphic-designers": {
    related: ["invitation-designers", "printers", "photographers", "video-editors", "branding"],
    keywords: ["graphic", "design", "visual", "digital", "creative", "art"],
    industry: "print"
  },
  transportation: {
    related: ["car-rentals", "luxury-cars", "vintage-cars", "limousines", "travel-agents"],
    keywords: ["transport", "car", "vehicle", "travel", "ride", "rental"],
    industry: "transport"
  },
  "car-rentals": {
    related: ["transportation", "luxury-cars", "vintage-cars", "limousines", "chauffeurs"],
    keywords: ["car", "rental", "vehicle", "hire", "drive", "transport"],
    industry: "transport"
  },
  "luxury-cars": {
    related: ["car-rentals", "vintage-cars", "limousines", "transportation", "chauffeurs"],
    keywords: ["luxury", "car", "premium", "high-end", "vehicle", "wedding-car"],
    industry: "transport"
  },
  lighting: {
    related: ["decorators", "djs", "sound-systems", "stage-designers", "event-planners"],
    keywords: ["light", "lighting", "led", "ambiance", "effect", "stage"],
    industry: "technical"
  },
  "sound-systems": {
    related: ["djs", "musicians", "lighting", "av-equipment", "event-planners"],
    keywords: ["sound", "audio", "speaker", "system", "pa", "music"],
    industry: "technical"
  },
  "drone-operators": {
    related: ["photographers", "videographers", "cinematographers", "aerial-photography"],
    keywords: ["drone", "aerial", "fly", "shoot", "video", "photo"],
    industry: "media"
  }
};

// Industry-based groupings for fallback
const INDUSTRY_CATEGORIES = {
  media: ["photographers", "videographers", "cinematographers", "drone-operators", "video-editors", "film-makers", "photo-booth", "album-designers"],
  entertainment: ["djs", "musicians", "bands", "singers", "dancers", "choreographers", "entertainment", "anchors", "emcees", "magicians", "comedians"],
  food: ["caterers", "chefs", "bakers", "cake-designers", "bartenders", "food-trucks", "dessert-specialists", "pastry-chefs"],
  decor: ["decorators", "florists", "balloon-decorators", "stage-designers", "lighting", "theme-decorators"],
  beauty: ["makeup-artists", "hair-stylists", "mehndi-artists", "bridal-stylists", "beauty-salons", "nail-artists"],
  planning: ["wedding-planners", "event-planners", "party-planners", "coordinators", "corporate-events"],
  venue: ["venues", "hotels", "resorts", "banquet-halls", "farmhouses", "destination-weddings"],
  fashion: ["jewelers", "boutiques", "fashion-designers", "tailors", "bridal-wear", "lehenga-stores", "accessory-designers"],
  religious: ["pandits", "priests", "astrologers", "religious-services", "puja-services"],
  transport: ["transportation", "car-rentals", "luxury-cars", "vintage-cars", "limousines", "chauffeurs"],
  print: ["invitation-designers", "graphic-designers", "printers", "calligraphers", "stationery"],
  technical: ["lighting", "sound-systems", "av-equipment", "stage-designers"]
};

// Default popular categories as ultimate fallback
const DEFAULT_CATEGORIES = [
  { category: "photographers", displayName: "Photographers", icon: "📸" },
  { category: "videographers", displayName: "Videographers", icon: "🎥" },
  { category: "makeup-artists", displayName: "Makeup Artists", icon: "💄" },
  { category: "decorators", displayName: "Decorators", icon: "🎨" },
  { category: "caterers", displayName: "Caterers", icon: "🍽️" },
  { category: "djs", displayName: "DJs", icon: "🎧" },
  { category: "wedding-planners", displayName: "Wedding Planners", icon: "💒" },
  { category: "venues", displayName: "Venues", icon: "🏛️" },
  { category: "florists", displayName: "Florists", icon: "💐" },
  { category: "mehndi-artists", displayName: "Mehndi Artists", icon: "🖐️" }
];

// Category display names and icons
const CATEGORY_META = {
  photographers: { displayName: "Photographers", icon: "📸" },
  videographers: { displayName: "Videographers", icon: "🎥" },
  cinematographers: { displayName: "Cinematographers", icon: "🎬" },
  djs: { displayName: "DJs", icon: "🎧" },
  musicians: { displayName: "Musicians", icon: "🎵" },
  bands: { displayName: "Bands", icon: "🎸" },
  singers: { displayName: "Singers", icon: "🎤" },
  caterers: { displayName: "Caterers", icon: "🍽️" },
  chefs: { displayName: "Chefs", icon: "👨‍🍳" },
  bakers: { displayName: "Bakers", icon: "🧁" },
  "cake-designers": { displayName: "Cake Designers", icon: "🎂" },
  decorators: { displayName: "Decorators", icon: "🎨" },
  florists: { displayName: "Florists", icon: "💐" },
  "balloon-decorators": { displayName: "Balloon Decorators", icon: "🎈" },
  "makeup-artists": { displayName: "Makeup Artists", icon: "💄" },
  "hair-stylists": { displayName: "Hair Stylists", icon: "💇" },
  "mehndi-artists": { displayName: "Mehndi Artists", icon: "🖐️" },
  "bridal-stylists": { displayName: "Bridal Stylists", icon: "👰" },
  "wedding-planners": { displayName: "Wedding Planners", icon: "💒" },
  "event-planners": { displayName: "Event Planners", icon: "📋" },
  "party-planners": { displayName: "Party Planners", icon: "🎉" },
  venues: { displayName: "Venues", icon: "🏛️" },
  hotels: { displayName: "Hotels", icon: "🏨" },
  resorts: { displayName: "Resorts", icon: "🏝️" },
  "banquet-halls": { displayName: "Banquet Halls", icon: "🎪" },
  pandits: { displayName: "Pandits", icon: "🙏" },
  priests: { displayName: "Priests", icon: "⛪" },
  choreographers: { displayName: "Choreographers", icon: "💃" },
  dancers: { displayName: "Dancers", icon: "🕺" },
  entertainment: { displayName: "Entertainment", icon: "🎭" },
  anchors: { displayName: "Anchors", icon: "🎙️" },
  emcees: { displayName: "Emcees", icon: "📢" },
  jewelers: { displayName: "Jewelers", icon: "💎" },
  boutiques: { displayName: "Boutiques", icon: "👗" },
  "fashion-designers": { displayName: "Fashion Designers", icon: "✂️" },
  tailors: { displayName: "Tailors", icon: "🧵" },
  "invitation-designers": { displayName: "Invitation Designers", icon: "💌" },
  "graphic-designers": { displayName: "Graphic Designers", icon: "🖼️" },
  transportation: { displayName: "Transportation", icon: "🚗" },
  "car-rentals": { displayName: "Car Rentals", icon: "🚙" },
  "luxury-cars": { displayName: "Luxury Cars", icon: "🚘" },
  lighting: { displayName: "Lighting", icon: "💡" },
  "sound-systems": { displayName: "Sound Systems", icon: "🔊" },
  "drone-operators": { displayName: "Drone Operators", icon: "🚁" }
};

// ==================== HELPER FUNCTIONS ====================

// Normalize category string
function normalizeCategory(category) {
  if (!category) return "";
  return category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Get category metadata
function getCategoryMeta(category) {
  const normalized = normalizeCategory(category);
  const meta = CATEGORY_META[normalized];
  
  if (meta) return { category: normalized, ...meta };
  
  // Generate display name from category string
  const displayName = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    category: normalized,
    displayName,
    icon: "📦"
  };
}

// Calculate similarity score between two categories
function calculateCategorySimilarity(sourceCategory, targetCategory) {
  const source = normalizeCategory(sourceCategory);
  const target = normalizeCategory(targetCategory);
  
  if (source === target) return 0; // Same category, skip
  
  let score = 0;
  const sourceConfig = CATEGORY_RELATIONS[source];
  
  if (!sourceConfig) return 10; // Unknown category, low base score
  
  // Direct relation (highest score)
  if (sourceConfig.related?.includes(target)) {
    score += 100;
  }
  
  // Same industry
  if (sourceConfig.industry) {
    const industryCategories = INDUSTRY_CATEGORIES[sourceConfig.industry] || [];
    if (industryCategories.includes(target)) {
      score += 50;
    }
  }
  
  // Keyword matching
  const targetConfig = CATEGORY_RELATIONS[target];
  if (sourceConfig.keywords && targetConfig?.keywords) {
    const sourceKeywords = new Set(sourceConfig.keywords);
    const matchingKeywords = targetConfig.keywords.filter(k => sourceKeywords.has(k));
    score += matchingKeywords.length * 10;
  }
  
  // String similarity (partial match)
  if (source.includes(target) || target.includes(source)) {
    score += 30;
  }
  
  // Common substring
  const minLen = Math.min(source.length, target.length);
  for (let len = minLen; len >= 3; len--) {
    for (let i = 0; i <= source.length - len; i++) {
      const substr = source.substring(i, i + len);
      if (target.includes(substr)) {
        score += len * 2;
        break;
      }
    }
  }
  
  return score;
}

// Find similar categories
async function findSimilarCategories(sourceCategory, limit = 5) {
  const normalized = normalizeCategory(sourceCategory);
  const results = [];
  
  // Method 1: Get directly related categories from config
  const sourceConfig = CATEGORY_RELATIONS[normalized];
  if (sourceConfig?.related) {
    for (const relatedCat of sourceConfig.related.slice(0, limit)) {
      results.push({
        ...getCategoryMeta(relatedCat),
        score: 100,
        reason: "directly_related"
      });
    }
  }
  
  // Method 2: Get same industry categories
  if (sourceConfig?.industry && results.length < limit) {
    const industryCategories = INDUSTRY_CATEGORIES[sourceConfig.industry] || [];
    for (const cat of industryCategories) {
      if (cat !== normalized && !results.find(r => r.category === cat)) {
        results.push({
          ...getCategoryMeta(cat),
          score: 50,
          reason: "same_industry"
        });
        if (results.length >= limit * 2) break;
      }
    }
  }
  
  // Method 3: Score all known categories
  if (results.length < limit) {
    const allCategories = Object.keys(CATEGORY_RELATIONS);
    const scored = allCategories
      .filter(cat => cat !== normalized && !results.find(r => r.category === cat))
      .map(cat => ({
        ...getCategoryMeta(cat),
        score: calculateCategorySimilarity(sourceCategory, cat),
        reason: "similarity_score"
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    results.push(...scored);
  }
  
  // Sort by score and take top results
  results.sort((a, b) => b.score - a.score);
  const topResults = results.slice(0, limit);
  
  // Fallback if not enough results
  if (topResults.length < limit) {
    const existingCategories = new Set(topResults.map(r => r.category));
    existingCategories.add(normalized);
    
    for (const defaultCat of DEFAULT_CATEGORIES) {
      if (!existingCategories.has(defaultCat.category)) {
        topResults.push({
          ...defaultCat,
          score: 5,
          reason: "fallback"
        });
        if (topResults.length >= limit) break;
      }
    }
  }
  
  return topResults.slice(0, limit);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { vendorProfileId, category: directCategory, limit = 5 } = body;

    let sourceCategory = directCategory;

    // If vendorProfileId provided, fetch category from database
    if (vendorProfileId && !directCategory) {
      await connectToDatabase();
      
      const vendorProfile = await VendorProfile.findById(vendorProfileId)
        .select("category")
        .lean();

      if (!vendorProfile) {
        return NextResponse.json(
          { success: false, error: "Vendor profile not found" },
          { status: 404 }
        );
      }

      sourceCategory = vendorProfile.category;
    }

    // Validate category exists
    if (!sourceCategory) {
      return NextResponse.json(
        { success: false, error: "Category not found. Provide vendorProfileId or category." },
        { status: 400 }
      );
    }

    // Find similar categories
    const similarCategories = await findSimilarCategories(sourceCategory, limit);

    // Get count of vendors in each category from database
    await connectToDatabase();
    const categoryCounts = await VendorProfile.aggregate([
      {
        $match: {
          category: {
            $in: similarCategories.map(c => new RegExp(`^${c.category}$`, "i"))
          }
        }
      },
      {
        $group: {
          _id: { $toLower: "$category" },
          count: { $sum: 1 }
        }
      }
    ]);

    const countMap = {};
    categoryCounts.forEach(item => {
      countMap[item._id] = item.count;
    });

    // Enrich results with vendor counts
    const enrichedCategories = similarCategories.map(cat => ({
      ...cat,
      vendorCount: countMap[cat.category] || 0
    }));

    // Get source category metadata
    const sourceCategoryMeta = getCategoryMeta(sourceCategory);

    return NextResponse.json({
      success: true,
      data: {
        sourceCategory: sourceCategoryMeta,
        similarCategories: enrichedCategories
      }
    });

  } catch (error) {
    console.error("Error fetching similar categories:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}