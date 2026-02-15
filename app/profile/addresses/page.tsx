import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { fetchUserAddresses } from "@/lib/api/addresses";
import AddressesSection from "@/components/profile/addresses-section";

export default async function AddressesPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login");
  }

  const user = await getUser();
  if (!user?.id) {
    redirect("/api/auth/login");
  }

  // Fetch addresses from server
  const addresses = await fetchUserAddresses(user.id).catch(() => []);

  return <AddressesSection initialAddresses={addresses} />;
}
