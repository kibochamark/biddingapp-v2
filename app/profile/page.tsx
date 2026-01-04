import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { fetchProfile } from "@/lib/api/account";
import ProfileInfoClient from "@/components/profile/profile-info-client";
import { fetchUSERKYCStatus } from "../actions/kyc";

export default async function ProfilePage() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login");
  }

  const user = await getUser();

  // Fetch user profile data
  const userProfile = await fetchProfile().catch(() => null);
  const verification_status = await fetchUSERKYCStatus() || "UNKNOWN";

  const profileData = {
    fullName: userProfile?.fullName || "",
    contact: userProfile?.contact || "",
    email: user?.email || "",
  };

  return <ProfileInfoClient initialData={profileData} verification_status={verification_status.data?.status ||"NOT_SUBMITTED"} />;
}
