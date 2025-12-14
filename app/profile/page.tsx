import { Suspense } from "react";
import ProfileClient from "./profile-client";
import { fetchUserAddresses } from "@/lib/api/addresses";
import { fetchKYCStatus } from "@/lib/api/kyc";
import { ProfileSkeleton } from "@/components/loading-skeleton";

// Dummy user ID for development (will be replaced with actual Kinde auth)
const DUMMY_USER_ID = "dummy_kinde_user_123";

async function ProfileContent() {
  // Fetch user data in parallel
  const [addresses, kycStatus] = await Promise.all([
    fetchUserAddresses(DUMMY_USER_ID),
    fetchKYCStatus(DUMMY_USER_ID),
  ]);

  return (
    <ProfileClient
      addresses={addresses}
      kycStatus={kycStatus}
      userId={DUMMY_USER_ID}
    />
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}

// Generate metadata for SEO
export const metadata = {
  title: "My Profile - BidMarket",
  description: "Manage your BidMarket account, addresses, and verification status",
};
