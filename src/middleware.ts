import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, userAgent } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)", 
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // 1. Auth Protection
  if (isAdminRoute(req)) {
    await auth.protect();
  }

  // 2. Skip internal files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. Device Detection
  const { device } = userAgent(req);
  const isMobile = device.type === "mobile";

  // FIX: Precisely target the /m directory, ignoring routes like /makeup or /my-account
  const isMobilePath = pathname === "/m" || pathname.startsWith("/m/");

  // 4. PREVENT DIRECT ACCESS TO /m ON DESKTOP
  if (!isMobile && isMobilePath) {
    // Safely remove the exact /m or /m/ prefix
    const newPath = pathname.replace(/^\/m(\/|$)/, "/");
    url.pathname = newPath || "/";
    return NextResponse.redirect(url);
  }

  // 5. ADAPTIVE REWRITE FOR MOBILE
  if (isMobile) {
    if (!isMobilePath) {
      // FIX: Prevent rewriting "/" to "/m/" to avoid Next.js 308 trailing slash redirects
      url.pathname = pathname === "/" ? "/m" : `/m${pathname}`;
      
      const response = NextResponse.rewrite(url);
      // FIX: Google requires this header when doing Dynamic Serving on the same URL
      response.headers.set("Vary", "User-Agent");
      return response;
    }
  }

  // Ensure desktop responses also tell Google that content varies by device
  const response = NextResponse.next();
  response.headers.set("Vary", "User-Agent");
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|json)).*)",
    "/(api|trpc)(.*)",
  ],
};