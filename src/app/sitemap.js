export default function sitemap() {
  const baseUrl = "https://www.planwab.com";
  const lastModified = new Date();

  return [
    // 1. Core Pages (Highest Priority)
    { url: `${baseUrl}`, lastModified, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/plan-my-event`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    
    // 2. Main Event Categories
    { url: `${baseUrl}/events`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/wedding`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/anniversary`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/birthday`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/events`, lastModified, changeFrequency: 'weekly', priority: 0.8 },

    // 3. Marketplace & Vendor Categories
    { url: `${baseUrl}/vendors/marketplace`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/vendors/marketplace/planners`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/photographers`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/venues`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/makeup`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/catering`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/djs`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/vendors/marketplace/mehendi`, lastModified, changeFrequency: 'daily', priority: 0.8 },

    // 4. Vendor Onboarding
    { url: `${baseUrl}/vendor/onboarding`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/vendor/register`, lastModified, changeFrequency: 'monthly', priority: 0.7 },

    // 5. Informational Pages
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about/blogs`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about/contact`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
  ];
}