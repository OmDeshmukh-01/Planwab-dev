import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeClerkProvider from "../lib/ThemeClerkProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import ReactQueryProvider from "../components/providers/ReactQueryProvider";
import ClientModalWrapper from "../components/shared/ClientModalWrapper";
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DOMAIN = "https://www.planwab.com";

export const metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "PlanWAB - Book Event Vendors & Plan Weddings, Birthdays Online",
    template: "%s | PlanWAB Marketplace",
  },
  description:
    "India's most affordable event planning marketplace. Find and book verified vendors for Weddings, Anniversaries, and Birthdays.",
  keywords: [
    "Event Vendor Marketplace",
    "Book Wedding Vendors India",
    "Affordable Event Planning",
    "PlanWAB",
    "Online Event Booking",
  ],
  authors: [{ name: "PlanWAB Team", url: DOMAIN }],
  creator: "PlanWAB",
  publisher: "PlanWAB",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "PlanWAB - Plan Your Dream Event & Book Vendors",
    description: "Compare and book the best vendors for your Wedding, Anniversary, or Birthday at affordable prices.",
    url: DOMAIN,
    siteName: "PlanWAB",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/WeddingDesign.png",
        width: 1200,
        height: 630,
        alt: "PlanWAB Wedding Planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanWAB - The Event Vendor Marketplace",
    description: "Find affordable vendors for weddings and parties. Booking made easy.",
    images: ["/WeddingDesign.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EventPlanner",
    name: "PlanWAB",
    url: DOMAIN,
    logo: `${DOMAIN}/planwablogo.png`,
    image: `${DOMAIN}/WeddingDesign.png`,
    description: "PlanWAB is an event planning marketplace connecting users with verified vendors.",
    telephone: "+91-6267430959",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "Noida",
    },
    offers: {
      "@type": "Offer",
      description: "Affordable booking for Event Vendors and Full Planning Services",
    },
  };

  return (
    <ThemeProvider>
      <ReactQueryProvider>
      <ThemeClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          </head>
          <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-50 text-gray-900`}>
            <NextTopLoader color="#2563eb" height={3} crawl={false} showSpinner={false} easing="linear" speed={300} shadow={false} zIndex={1600} />
            {children}
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-ML8HLB62X6"} />
            <Toaster position="bottom-center" richColors closeButton />
            <ClientModalWrapper />
          </body>
        </html>
      </ThemeClerkProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}