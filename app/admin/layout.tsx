import { getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/layout/Sidebar";
import Navbar from "@/components/admin/layout/Navbar";
import { getAdminRoleLabel } from "@/components/admin/layout/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, getPermission, getUser } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/api/auth/login");
  }

  // Check if user has admin access
  const adminAccess = await getPermission("admin:access");

  if (!adminAccess?.isGranted) {
    redirect("/"); // Redirect to home if not admin
  }

  // Get all permissions to show/hide nav items — the single source of truth
  // for nav structure lives in components/admin/layout/admin-nav.ts and
  // consumes this same permissions object on both Sidebar and MobileSidebar.
  const [canManageProducts, canManageCategories, canManageAccounts, canManageBids, canManageKYC, kindeUser] =
    await Promise.all([
      getPermission("manage:products"),
      getPermission("manage:categories"),
      getPermission("manage:accounts"),
      getPermission("manage:bids"),
      getPermission("approve:kyc"),
      getUser(),
    ]);

  const permissions = {
    canManageProducts,
    canManageCategories,
    canManageAccounts,
    canManageBids,
    canManageKYC,
  };

  const user = {
    name: `${kindeUser?.given_name || ""} ${kindeUser?.family_name || ""}`.trim() || "Admin",
    email: kindeUser?.email || "",
    picture: kindeUser?.picture || null,
    role: getAdminRoleLabel(permissions),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar permissions={permissions} user={user} />

        {/* Main Content */}
        <div className="lg:pl-64 flex-1 min-w-0">
          {/* Mobile Header */}
          <Navbar permissions={permissions} user={user} />

          {/* Page Content */}
          <main className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
