This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


```
Planwab-dev
├─ .dockerignore
├─ components.json
├─ Dockerfile
├─ eslint.config.mjs
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ GlowLoadingGif.gif
│  ├─ logo.svg
│  ├─ next.svg
│  ├─ planwablogo.ico
│  ├─ planwablogo.png
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ layout.jsx
│  │  │  ├─ loading.js
│  │  │  ├─ sign-in
│  │  │  │  └─ [[...sign-in]]
│  │  │  │     └─ page.jsx
│  │  │  └─ sign-up
│  │  │     └─ [[...sign-up]]
│  │  │        └─ page.jsx
│  │  ├─ (desktop)
│  │  │  ├─ (admin)
│  │  │  │  └─ admin
│  │  │  │     ├─ dashboard
│  │  │  │     │  └─ page.jsx
│  │  │  │     ├─ events
│  │  │  │     │  └─ page.jsx
│  │  │  │     ├─ layout.js
│  │  │  │     ├─ loading.js
│  │  │  │     ├─ settings
│  │  │  │     │  └─ page.jsx
│  │  │  │     ├─ users
│  │  │  │     │  └─ page.jsx
│  │  │  │     ├─ vendor-requests
│  │  │  │     │  └─ page.jsx
│  │  │  │     └─ vendors
│  │  │  │        └─ page.jsx
│  │  │  ├─ (pages)
│  │  │  │  ├─ about
│  │  │  │  │  ├─ blogs
│  │  │  │  │  │  ├─ loading.js
│  │  │  │  │  │  └─ page.jsx
│  │  │  │  │  ├─ contact
│  │  │  │  │  │  ├─ loading.js
│  │  │  │  │  │  └─ page.jsx
│  │  │  │  │  ├─ loading.js
│  │  │  │  │  └─ page.jsx
│  │  │  │  ├─ events
│  │  │  │  │  ├─ page.js
│  │  │  │  │  └─ [category]
│  │  │  │  │     ├─ birthday-planner
│  │  │  │  │     │  └─ page.js
│  │  │  │  │     ├─ page.js
│  │  │  │  │     └─ planning-tools
│  │  │  │  │        └─ page.js
│  │  │  │  ├─ plan-my-event
│  │  │  │  │  └─ [category]
│  │  │  │  │     └─ page.js
│  │  │  │  ├─ pricing
│  │  │  │  │  ├─ loading.js
│  │  │  │  │  └─ page.jsx
│  │  │  │  ├─ user
│  │  │  │  │  ├─ bookings
│  │  │  │  │  │  ├─ loading.js
│  │  │  │  │  │  └─ page.jsx
│  │  │  │  │  ├─ checkout
│  │  │  │  │  │  ├─ loading.js
│  │  │  │  │  │  └─ page.jsx
│  │  │  │  │  ├─ profile
│  │  │  │  │  │  ├─ loading.js
│  │  │  │  │  │  └─ page.jsx
│  │  │  │  │  └─ proposals
│  │  │  │  │     └─ tracking
│  │  │  │  │        └─ [id]
│  │  │  │  │           ├─ loading.js
│  │  │  │  │           └─ page.js
│  │  │  │  ├─ vendor
│  │  │  │  │  ├─ onboarding
│  │  │  │  │  │  ├─ loading.js
│  │  │  │  │  │  └─ page.jsx
│  │  │  │  │  ├─ register
│  │  │  │  │  │  ├─ loading.js
│  │  │  │  │  │  └─ page.jsx
│  │  │  │  │  └─ [category]
│  │  │  │  │     ├─ profile
│  │  │  │  │     │  └─ [username]
│  │  │  │  │     │     ├─ loading.js
│  │  │  │  │     │     └─ page.jsx
│  │  │  │  │     └─ [id]
│  │  │  │  │        ├─ loading.js
│  │  │  │  │        ├─ page.jsx
│  │  │  │  │        └─ profile
│  │  │  │  │           ├─ loading.js
│  │  │  │  │           └─ page.jsx
│  │  │  │  └─ vendors
│  │  │  │     ├─ explore
│  │  │  │     │  └─ [category]
│  │  │  │     │     ├─ loading.js
│  │  │  │     │     └─ page.js
│  │  │  │     └─ marketplace
│  │  │  │        ├─ page.jsx
│  │  │  │        └─ [category]
│  │  │  │           └─ page.jsx
│  │  │  ├─ layout.js
│  │  │  └─ page.js
│  │  ├─ (mobile)
│  │  │  └─ m
│  │  │     ├─ (admin)
│  │  │     │  └─ admin
│  │  │     │     ├─ dashboard
│  │  │     │     │  └─ page.jsx
│  │  │     │     ├─ events
│  │  │     │     │  └─ page.jsx
│  │  │     │     ├─ layout.js
│  │  │     │     ├─ loading.js
│  │  │     │     ├─ settings
│  │  │     │     │  └─ page.jsx
│  │  │     │     ├─ users
│  │  │     │     │  └─ page.jsx
│  │  │     │     └─ vendors
│  │  │     │        └─ page.jsx
│  │  │     ├─ (pages)
│  │  │     │  ├─ about
│  │  │     │  │  ├─ blogs
│  │  │     │  │  │  ├─ loading.js
│  │  │     │  │  │  └─ page.jsx
│  │  │     │  │  ├─ contact
│  │  │     │  │  │  ├─ loading.js
│  │  │     │  │  │  └─ page.jsx
│  │  │     │  │  ├─ loading.js
│  │  │     │  │  └─ page.jsx
│  │  │     │  ├─ events
│  │  │     │  │  ├─ page.js
│  │  │     │  │  └─ [category]
│  │  │     │  │     ├─ birthday-planner
│  │  │     │  │     │  └─ page.js
│  │  │     │  │     └─ page.js
│  │  │     │  ├─ plan-my-event
│  │  │     │  │  └─ [category]
│  │  │     │  │     ├─ loading.js
│  │  │     │  │     └─ page.js
│  │  │     │  ├─ pricing
│  │  │     │  │  ├─ loading.js
│  │  │     │  │  └─ page.jsx
│  │  │     │  ├─ user
│  │  │     │  │  ├─ bookings
│  │  │     │  │  │  ├─ loading.js
│  │  │     │  │  │  └─ page.jsx
│  │  │     │  │  ├─ checkout
│  │  │     │  │  │  ├─ loading.js
│  │  │     │  │  │  └─ page.jsx
│  │  │     │  │  ├─ profile
│  │  │     │  │  │  ├─ loading.js
│  │  │     │  │  │  └─ page.jsx
│  │  │     │  │  └─ proposals
│  │  │     │  │     └─ tracking
│  │  │     │  │        └─ [id]
│  │  │     │  │           ├─ loading.js
│  │  │     │  │           └─ page.js
│  │  │     │  ├─ vendor
│  │  │     │  │  ├─ onboarding
│  │  │     │  │  │  ├─ loading.js
│  │  │     │  │  │  └─ page.jsx
│  │  │     │  │  ├─ register
│  │  │     │  │  │  ├─ loading.js
│  │  │     │  │  │  └─ page.jsx
│  │  │     │  │  └─ [category]
│  │  │     │  │     ├─ profile
│  │  │     │  │     │  └─ [username]
│  │  │     │  │     │     ├─ loading.js
│  │  │     │  │     │     └─ page.jsx
│  │  │     │  │     └─ [id]
│  │  │     │  │        ├─ loading.js
│  │  │     │  │        ├─ page.jsx
│  │  │     │  │        └─ profile
│  │  │     │  │           ├─ loading.js
│  │  │     │  │           └─ page.jsx
│  │  │     │  └─ vendors
│  │  │     │     ├─ explore
│  │  │     │     │  └─ [category]
│  │  │     │     │     ├─ loading.js
│  │  │     │     │     └─ page.js
│  │  │     │     └─ marketplace
│  │  │     │        ├─ loading.js
│  │  │     │        ├─ page.jsx
│  │  │     │        └─ [category]
│  │  │     │           ├─ loading.js
│  │  │     │           └─ page.jsx
│  │  │     ├─ layout.js
│  │  │     ├─ loading.js
│  │  │     └─ page.js
│  │  ├─ api
│  │  │  ├─ admin
│  │  │  │  └─ dashboard
│  │  │  │     └─ route.js
│  │  │  ├─ leads
│  │  │  │  └─ route.js
│  │  │  ├─ media
│  │  │  │  └─ route.js
│  │  │  ├─ orders
│  │  │  │  └─ route.js
│  │  │  ├─ planned-events
│  │  │  │  ├─ get-all
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ route.js
│  │  │  │  └─ [id]
│  │  │  │     └─ route.js
│  │  │  ├─ plannedevent
│  │  │  │  ├─ add
│  │  │  │  │  └─ route.js
│  │  │  │  └─ route.js
│  │  │  ├─ user
│  │  │  │  ├─ me
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ route.js
│  │  │  │  ├─ status
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ toggle-like
│  │  │  │  │  └─ route.js
│  │  │  │  └─ toggle-watchlist
│  │  │  │     └─ route.js
│  │  │  ├─ vendor
│  │  │  │  ├─ add
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ bulk
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ lists
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ route.js
│  │  │  │  ├─ profile
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ requests
│  │  │  │  │  ├─ birthday-routes
│  │  │  │  │  │  └─ route.js
│  │  │  │  │  ├─ detail-booking
│  │  │  │  │  │  ├─ route.js
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     └─ route.js
│  │  │  │  │  └─ route.js
│  │  │  │  ├─ route.js
│  │  │  │  └─ [id]
│  │  │  │     ├─ profile
│  │  │  │     │  ├─ interactions
│  │  │  │     │  │  └─ route.js
│  │  │  │     │  ├─ posts
│  │  │  │     │  │  ├─ interactions
│  │  │  │     │  │  │  └─ route.js
│  │  │  │     │  │  └─ route.js
│  │  │  │     │  ├─ reels
│  │  │  │     │  │  ├─ interactions
│  │  │  │     │  │  │  └─ route.js
│  │  │  │     │  │  └─ route.js
│  │  │  │     │  ├─ route.js
│  │  │  │     │  ├─ upload-config
│  │  │  │     │  │  └─ route.js
│  │  │  │     │  └─ verify-password
│  │  │  │     │     └─ route.js
│  │  │  │     ├─ reviews
│  │  │  │     │  ├─ route.js
│  │  │  │     │  └─ [reviewId]
│  │  │  │     │     └─ route.js
│  │  │  │     ├─ route.js
│  │  │  │     └─ unified
│  │  │  │        └─ route.js
│  │  │  └─ webhooks
│  │  │     └─ clerk
│  │  │        └─ route.js
│  │  ├─ error.js
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.js
│  │  ├─ loading.js
│  │  ├─ not-found.js
│  │  ├─ robots.js
│  │  └─ sitemap.js
│  ├─ components
│  │  ├─ desktop
│  │  │  ├─ admin
│  │  │  │  ├─ DashboardStatsCard.jsx
│  │  │  │  ├─ events
│  │  │  │  │  ├─ AddEvent.jsx
│  │  │  │  │  ├─ AllEvents.jsx
│  │  │  │  │  ├─ EditEventTab.jsx
│  │  │  │  │  └─ ViewEventTab.jsx
│  │  │  │  ├─ Header.jsx
│  │  │  │  ├─ LayoutWrapper.jsx
│  │  │  │  ├─ modals
│  │  │  │  │  ├─ DropdownMenu.jsx
│  │  │  │  │  ├─ events
│  │  │  │  │  │  ├─ DeleteEventModal.jsx
│  │  │  │  │  │  ├─ EditEventModal.jsx
│  │  │  │  │  │  └─ ViewEventModal.jsx
│  │  │  │  │  ├─ ModalBackdrop.jsx
│  │  │  │  │  ├─ users
│  │  │  │  │  │  ├─ DeleteUserModal.jsx
│  │  │  │  │  │  └─ ViewUserModal.jsx
│  │  │  │  │  └─ vendors
│  │  │  │  │     ├─ DeleteVendorModal.jsx
│  │  │  │  │     ├─ EditVendorModal.jsx
│  │  │  │  │     └─ ViewVendorModal.jsx
│  │  │  │  ├─ Sidebar.jsx
│  │  │  │  ├─ users
│  │  │  │  │  └─ AllUsers.jsx
│  │  │  │  ├─ vendor-requests
│  │  │  │  │  ├─ AllVendorRequests.jsx
│  │  │  │  │  └─ viewVendorRequestTab.jsx
│  │  │  │  └─ vendors
│  │  │  │     ├─ addVendor.jsx
│  │  │  │     ├─ AllVendors.jsx
│  │  │  │     ├─ EditVendorTab.jsx
│  │  │  │     └─ ViewVendorTab.jsx
│  │  │  ├─ Anniversary.jsx
│  │  │  ├─ AuthPromo.jsx
│  │  │  ├─ Birthday.jsx
│  │  │  ├─ CarouselHeader.jsx
│  │  │  ├─ ClientWrapper.jsx
│  │  │  ├─ CompareModalDesktop.jsx
│  │  │  ├─ ConditionalNavbar.jsx
│  │  │  ├─ Footer.jsx
│  │  │  ├─ Header.jsx
│  │  │  ├─ HomePage
│  │  │  │  ├─ CardsWithBanner.jsx
│  │  │  │  ├─ CategoriesGrid.jsx
│  │  │  │  ├─ HeroSection.jsx
│  │  │  │  ├─ HowItWorks.jsx
│  │  │  │  ├─ PlanningTools.jsx
│  │  │  │  ├─ SearchSection.jsx
│  │  │  │  ├─ ServicesBanner.jsx
│  │  │  │  ├─ TestimonialsSection.jsx
│  │  │  │  └─ VendorsSection.jsx
│  │  │  ├─ Img.jsx
│  │  │  ├─ LeadCaptureModal.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ PagesWrapper
│  │  │  │  ├─ AboutPageWrapper.jsx
│  │  │  │  ├─ BirthdayPlannerWrapper.jsx
│  │  │  │  ├─ BlogPageWrapper.jsx
│  │  │  │  ├─ CategoryEventsPageWrapper.jsx
│  │  │  │  ├─ CheckoutPageWrapper.jsx
│  │  │  │  ├─ ContactUsPageWrapper.jsx
│  │  │  │  ├─ FindAVendorPageWrapper.jsx
│  │  │  │  ├─ HomePageWrapper.jsx
│  │  │  │  ├─ PlanMyEventPageWrapper.jsx
│  │  │  │  ├─ PlanningToolsPageWrapper.jsx
│  │  │  │  ├─ PricingPageWrapper.jsx
│  │  │  │  ├─ SignInPageWrapper.jsx
│  │  │  │  ├─ SignUpPageWrapper.jsx
│  │  │  │  ├─ TrackingProposalsPagewrapper.jsx
│  │  │  │  ├─ UserBookingsPageWrapper.jsx
│  │  │  │  ├─ UserProfilePageWrapper.jsx
│  │  │  │  ├─ VendorDetailsPageWrapper.jsx
│  │  │  │  ├─ VendorOnboardingPageWrapper.jsx
│  │  │  │  ├─ VendorProfileNewPageWrapper.jsx
│  │  │  │  ├─ VendorProfilePageWrapper.jsx
│  │  │  │  ├─ VendorRegisterPageWrapper.jsx
│  │  │  │  └─ VendorsMarketplacePageWrapper.jsx
│  │  │  ├─ ReviewSection.jsx
│  │  │  ├─ SearchModal.jsx
│  │  │  ├─ SkeletonCard.jsx
│  │  │  ├─ SmartMediaLoader.jsx
│  │  │  ├─ ui
│  │  │  │  ├─ EventsPage
│  │  │  │  │  ├─ Banner1.jsx
│  │  │  │  │  ├─ HeroSection.jsx
│  │  │  │  │  ├─ HowItWorks.jsx
│  │  │  │  │  └─ SearchSection.jsx
│  │  │  │  ├─ FloatingLinesUiEffect.jsx
│  │  │  │  ├─ landingPage
│  │  │  │  │  ├─ HeroSection.jsx
│  │  │  │  │  ├─ HowItWorks.jsx
│  │  │  │  │  ├─ SearchSection.jsx
│  │  │  │  │  ├─ ServicesBanner.jsx
│  │  │  │  │  ├─ ServicesSection.jsx
│  │  │  │  │  ├─ TestimonialsSection.jsx
│  │  │  │  │  └─ VendorsSection.jsx
│  │  │  │  ├─ skeletons
│  │  │  │  │  └─ DetailsPageSkeleton.jsx
│  │  │  │  └─ vendor
│  │  │  │     └─ VendorCard.jsx
│  │  │  ├─ UpdateProfileDrawer.jsx
│  │  │  ├─ VendorProfileCreate.jsx
│  │  │  ├─ VendorsCarousel1.jsx
│  │  │  └─ Wedding.jsx
│  │  ├─ mobile
│  │  │  ├─ admin
│  │  │  │  ├─ DashboardStatsCard.jsx
│  │  │  │  ├─ events
│  │  │  │  │  ├─ AddEvent.jsx
│  │  │  │  │  └─ AllEvents.jsx
│  │  │  │  ├─ Header.jsx
│  │  │  │  ├─ LayoutWrapper.jsx
│  │  │  │  ├─ modals
│  │  │  │  │  ├─ DropdownMenu.jsx
│  │  │  │  │  ├─ events
│  │  │  │  │  │  ├─ DeleteEventModal.jsx
│  │  │  │  │  │  ├─ EditEventModal.jsx
│  │  │  │  │  │  └─ ViewEventModal.jsx
│  │  │  │  │  ├─ ModalBackdrop.jsx
│  │  │  │  │  ├─ users
│  │  │  │  │  │  ├─ DeleteUserModal.jsx
│  │  │  │  │  │  └─ ViewUserModal.jsx
│  │  │  │  │  └─ vendors
│  │  │  │  │     ├─ DeleteVendorModal.jsx
│  │  │  │  │     ├─ EditVendorModal.jsx
│  │  │  │  │     └─ ViewVendorModal.jsx
│  │  │  │  ├─ Sidebar.jsx
│  │  │  │  ├─ users
│  │  │  │  │  └─ AllUsers.jsx
│  │  │  │  └─ vendors
│  │  │  │     ├─ addVendor.jsx
│  │  │  │     └─ AllVendors.jsx
│  │  │  ├─ Anniversary.jsx
│  │  │  ├─ AppEntryGate.jsx
│  │  │  ├─ AuthPromo.jsx
│  │  │  ├─ Birthday.jsx
│  │  │  ├─ BirthdayPage
│  │  │  │  ├─ BookingPage.jsx
│  │  │  │  ├─ Button.jsx
│  │  │  │  ├─ ConfirmationPage.jsx
│  │  │  │  ├─ FloatingInput.jsx
│  │  │  │  ├─ HotelCard.jsx
│  │  │  │  ├─ HotelsPage.jsx
│  │  │  │  ├─ Navigation.jsx
│  │  │  │  └─ SurpriseCard.jsx
│  │  │  ├─ ClientWrapper.jsx
│  │  │  ├─ CompareModalMobile.jsx
│  │  │  ├─ ConditionalNavbar.jsx
│  │  │  ├─ Footer.jsx
│  │  │  ├─ ForceLightMode.js
│  │  │  ├─ Header.jsx
│  │  │  ├─ homepage
│  │  │  │  ├─ AreYouVendor.jsx
│  │  │  │  ├─ AsyncSections.jsx
│  │  │  │  ├─ CategoriesGrid.jsx
│  │  │  │  ├─ HomePageShimmer.jsx
│  │  │  │  ├─ MostBooked.jsx
│  │  │  │  ├─ QuickServices.jsx
│  │  │  │  ├─ SampleProposals.jsx
│  │  │  │  ├─ ServicesSteps.jsx
│  │  │  │  └─ WhyWeBetter.jsx
│  │  │  ├─ Img.jsx
│  │  │  ├─ LeadCaptureModal.jsx
│  │  │  ├─ LoaderStarter.jsx
│  │  │  ├─ MapContainer.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ PagesWrapper
│  │  │  │  ├─ AboutPageWrapper.jsx
│  │  │  │  ├─ BirthdayPlannerWrapper.jsx
│  │  │  │  ├─ BlogPageWrapper.jsx
│  │  │  │  ├─ CategoryEventsPageWrapper.jsx
│  │  │  │  ├─ CheckoutPageWrapper.jsx
│  │  │  │  ├─ ContactUsPageWrapper.jsx
│  │  │  │  ├─ FindAVendorPageWrapper.jsx
│  │  │  │  ├─ HomePageWrapper.jsx
│  │  │  │  ├─ PlanMyEventPageWrapper.jsx
│  │  │  │  ├─ PricingPageWrapper.jsx
│  │  │  │  ├─ SignInPageWrapper.jsx
│  │  │  │  ├─ SignUpPageWrapper.jsx
│  │  │  │  ├─ TrackingProposalsPagewrapper.jsx
│  │  │  │  ├─ UserBookingsPageWrapper.jsx
│  │  │  │  ├─ UserProfilePageWrapper.jsx
│  │  │  │  ├─ VendorDetailsPageWrapper.jsx
│  │  │  │  ├─ VendorOnboardingPageWrapper.jsx
│  │  │  │  ├─ VendorProfileNewPageWrapper.jsx
│  │  │  │  ├─ VendorProfilePageWrapper.jsx
│  │  │  │  ├─ VendorRegisterPageWrapper.jsx
│  │  │  │  └─ VendorsMarketplacePageWrapper.jsx
│  │  │  ├─ RawHeroMedia.jsx
│  │  │  ├─ ReviewSection.jsx
│  │  │  ├─ SkeletonCard.jsx
│  │  │  ├─ SmartMediaLoader.jsx
│  │  │  ├─ ui
│  │  │  │  ├─ EventsPage
│  │  │  │  │  ├─ Banner1.jsx
│  │  │  │  │  ├─ Banner2.jsx
│  │  │  │  │  ├─ HeroSection.jsx
│  │  │  │  │  ├─ HowItWorks.jsx
│  │  │  │  │  └─ SearchSection.jsx
│  │  │  │  ├─ landingPage
│  │  │  │  │  ├─ HeroSection.jsx
│  │  │  │  │  ├─ HowItWorks.jsx
│  │  │  │  │  ├─ SearchSection.jsx
│  │  │  │  │  ├─ ServicesBanner.jsx
│  │  │  │  │  ├─ ServicesSection.jsx
│  │  │  │  │  ├─ TestimonialsSection.jsx
│  │  │  │  │  └─ VendorsSection.jsx
│  │  │  │  └─ skeletons
│  │  │  │     └─ DetailsPageSkeleton.jsx
│  │  │  ├─ UpdateProfileDrawer.jsx
│  │  │  ├─ VendorProfile
│  │  │  │  ├─ MoreOptionsDrawer.jsx
│  │  │  │  ├─ PostDetailModal.jsx
│  │  │  │  ├─ ReelsViewer.jsx
│  │  │  │  └─ UploadModal.jsx
│  │  │  ├─ VendorProfileCreate.jsx
│  │  │  └─ Wedding.jsx
│  │  ├─ providers
│  │  │  └─ ReactQueryProvider.jsx
│  │  └─ shared
│  │     └─ ClientModalWrapper.jsx
│  ├─ contexts
│  │  └─ ThemeContext.js
│  ├─ database
│  │  ├─ actions
│  │  │  ├─ FetchActions.js
│  │  │  └─ UserActions.js
│  │  ├─ models
│  │  │  ├─ BirthdayBooking.js
│  │  │  ├─ DetailsBookingRequestModel.js
│  │  │  ├─ LeadsModel.js
│  │  │  ├─ Orders.js
│  │  │  ├─ PlannedEvent.js
│  │  │  ├─ PlannedToolEvent.js
│  │  │  ├─ userModel.js
│  │  │  ├─ VendorModel.js
│  │  │  ├─ VendorProfileModel.js
│  │  │  ├─ VendorRequestsModel.js
│  │  │  └─ VendorsReviewsModel.js
│  │  └─ mongoose.js
│  ├─ GlobalState
│  │  ├─ AppValuesStore.js
│  │  ├─ CartDataStore.js
│  │  ├─ CategoryStore.js
│  │  └─ navbarVisibilityStore.js
│  ├─ hooks
│  │  ├─ useNavigationState.js
│  │  ├─ useNavigationWithReturn.js
│  │  └─ useReviews.js
│  ├─ lib
│  │  ├─ AppUtils.js
│  │  ├─ constants
│  │  │  └─ index.ts
│  │  ├─ getDeviceType.js
│  │  ├─ navigationUtils.js
│  │  ├─ reviewUtils.js
│  │  ├─ ThemeClerkProvider.jsx
│  │  └─ utils.js
│  └─ middleware.ts
├─ tailwind.config.js
└─ tsconfig.json

```