import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ProfileClient from "./profile-client";
import { fetchUserAddresses } from "@/lib/api/addresses";
import { fetchKYCStatus } from "@/lib/api/kyc";
import { fetchUserBids } from "@/lib/api/bids";
import { ProfileSkeleton } from "@/components/loading-skeleton";
import { fetchProfile } from "@/lib/api/account";

async function ProfileContent() {
  const { isAuthenticated, getUser, getAccessTokenRaw } = getKindeServerSession();

  // Check if user is authenticated
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login");
  }

  // Get user data and access token
  const user = await getUser();
  const accessToken = await getAccessTokenRaw();

  if (!user?.id || !accessToken) {
    redirect("/api/auth/login");
  }

  // Fetch user data in parallel with access token for authorization
  const [addresses, kycStatus, userBids, userProfile] = await Promise.all([
    fetchUserAddresses(user.id).catch(() => []),
    fetchKYCStatus(user.id).catch(() => null),
    fetchUserBids(user.id).catch(() => []),
    fetchProfile().catch(() => null),
  ]);

  // console.log("User Profile Data:", userProfile);

  return (
    <ProfileClient
      addresses={addresses}
      kycStatus={kycStatus}
      userId={user.id}
      userBids={userBids}
      userProfile={{
        fullName: `${userProfile?.fullName || ""}`.trim() || "Guest User",
        contact: `${userProfile?.contact || ""}`.trim() || "",
        email: user.email || "",
      }}
      user={{
        name: `${user.given_name || ""} ${user.family_name || ""}`.trim() || "User",
        email: user.email || "",
        picture: user.picture || null,
      }}
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
