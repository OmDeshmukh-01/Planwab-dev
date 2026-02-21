export default function robots() {
  const baseUrl = "https://www.planwab.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/about/blogs",
          "/about/contact",
          "/events",
          "/events/birthday-planner",
          "/events/planning-tools",
          "/pricing",
          "/plan-my-event",
          "/vendor/onboarding",
          "/vendor/register",
          "/vendors/marketplace",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/user/",
          "/vendor/[category]/",
          "/vendors/explore/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
