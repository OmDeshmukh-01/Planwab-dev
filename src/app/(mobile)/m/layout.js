import ClientWrapper from "@/components/mobile/ClientWrapper";
import ConditionalNavbar from "@/components/mobile/ConditionalNavbar";
import ForceLightMode from "@/components/mobile/ForceLightMode";

export const metadata = {
  title: {
    default: "PlanWAB - Book Event Vendors & Plan Weddings, Birthdays Online",
    template: "%s | PlanWAB Marketplace",
  },
  description:
    "India's most affordable event planning marketplace. Find and book verified vendors for Weddings, Anniversaries, and Birthdays.",
  appleWebApp: {
    title: "PlanWAB",
    statusBarStyle: "default",
  },
  alternates: {
    canonical: "https://www.planwab.com",
  },
};

export default function MobileLayout({ children }) {
  return (
    <ForceLightMode>
      <ClientWrapper>
        {children}
      </ClientWrapper>
      <ConditionalNavbar />
    </ForceLightMode>
  );
}