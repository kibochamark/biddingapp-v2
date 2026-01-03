import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ProfileNav from "@/components/profile/profile-nav";

export const metadata = {
  title: "My Profile - BidMarket",
  description: "Manage your BidMarket account, addresses, and verification status",
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <ProfileNav />
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}
