import VendorProfileNewPageWrapper from "@/components/mobile/PagesWrapper/VendorProfileNewPageWrapper";
import { getVendorProfileByUsername } from "../../../../../../../../database/actions/FetchActions";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const profile = await getVendorProfileByUsername(username);

  if (!profile) {
    return { title: "Profile Not Found | PlanWAB" };
  }

  return {
    title: `${profile.vendorName} - Profile | Vendors Media Hub`,
    description: profile?.bio
      ? `${profile.bio.substring(0, 160)}...`
      : `Book ${profile.vendorName} for your event.`,
    openGraph: {
      title: `${profile.vendorName} - PlanWAB`,
      images: profile.vendorAvatar ? [{ url: profile.vendorAvatar }] : [],
    },
  };
}

export default async function VendorProfilePage({ params }) {
  const { username } = await params;

  const profileData = await getVendorProfileByUsername(username);

  return (
    <VendorProfileNewPageWrapper
      initialProfile={profileData}
    />
  );
}