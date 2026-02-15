import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { fetchUserBids } from "@/lib/api/bids";
import MyBidsSection from "@/components/profile/my-bids-section";

export default async function BidsPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login");
  }

  const user = await getUser();
  console.log(user)
  if (!user?.id) {
    redirect("/api/auth/login");
  }

  // Fetch user bids from server with error handling
  const result = await fetchUserBids(user.id);

  return (
    <MyBidsSection
      bids={result.success ? result.bids : []}
      error={result.success ? undefined : result.error}
    />
  );
}
