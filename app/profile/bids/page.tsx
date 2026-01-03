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
  if (!user?.id) {
    redirect("/api/auth/login");
  }

  // Fetch user bids from server
  const bids = await fetchUserBids(user.id).catch(() => []);

  return <MyBidsSection bids={bids} />;
}
