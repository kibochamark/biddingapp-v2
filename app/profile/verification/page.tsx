import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { fetchKYCStatus } from "@/app/actions/kyc";
import KYCSectionNew from "@/components/profile/kyc-section-new";

export default async function VerificationPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login");
  }

  const user = await getUser();
  if (!user?.id) {
    redirect("/api/auth/login");
  }

  // Fetch KYC status from server
  const kycResult = await fetchKYCStatus();
  const kycData = kycResult.success ? kycResult.data : null;

  return <KYCSectionNew accountId={user.id} initialKYCData={kycData} />;
}
