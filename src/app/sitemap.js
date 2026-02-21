export default function sitemap() {
  const baseUrl = "https://www.planwab.com";
  const lastModified = new Date();

  return [
    { url: `${baseUrl}`, lastModified },

    { url: `${baseUrl}/about`, lastModified },
    { url: `${baseUrl}/about/blogs`, lastModified },
    { url: `${baseUrl}/about/contact`, lastModified },

    { url: `${baseUrl}/events`, lastModified },
    { url: `${baseUrl}/events/birthday-planner`, lastModified },
    { url: `${baseUrl}/events/planning-tools`, lastModified },

    { url: `${baseUrl}/pricing`, lastModified },

    { url: `${baseUrl}/plan-my-event`, lastModified },

    { url: `${baseUrl}/vendor/onboarding`, lastModified },
    { url: `${baseUrl}/vendor/register`, lastModified },

    { url: `${baseUrl}/vendors/marketplace`, lastModified },
  ];
}
