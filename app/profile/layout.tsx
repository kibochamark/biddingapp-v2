import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ProfileNav from "@/components/profile/profile-nav";

export const metadata = {
  title: "My Profile - BidMarket",
  description:
    "Manage your BidMarket account, addresses, and verification status",
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login");
  }

  const user = await getUser();
  const initials =
    user?.given_name && user?.family_name
      ? `${user.given_name[0]}${user.family_name[0]}`
      : user?.email?.[0]?.toUpperCase() ?? "U";

  const displayName =
    user?.given_name && user?.family_name
      ? `${user.given_name} ${user.family_name}`
      : user?.email ?? "User";

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <div className="border-b border-border bg-linear-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary flex items-center justify-center shrink-0">
              <span className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                {initials}
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {displayName}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation + Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-56 shrink-0">
            <ProfileNav />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
