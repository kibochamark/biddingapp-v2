import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { fetchUSERKYCStatus } from "@/app/actions/kyc";
import KYCSectionNew from "@/components/profile/kyc-section";

export default async function page() {
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
  const kycResult = await fetchUSERKYCStatus();
  console.log('KYC Result in page:', kycResult);
  const kycData = kycResult.success ? kycResult.data : null;

  return <KYCSectionNew accountId={user.id} initialKYCData={kycData} />;
}
