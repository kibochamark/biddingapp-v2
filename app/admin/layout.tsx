import { getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  Gavel,
  ShieldCheck,
  UserX
} from "lucide-react";
import Sidebar from "@/components/admin/layout/Sidebar";
import Navbar from "@/components/admin/layout/Navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, getPermission, getPermissions, getRoles } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/api/auth/login");
  }

  const allowedPermissions = await getPermissions()
  // Check if user has admin access
  const adminAccess = await getPermission("admin:access");

  console.log("Admin Access:", allowedPermissions);

  if (!adminAccess?.isGranted) {
    redirect("/"); // Redirect to home if not admin
  }

  // Get all permissions to show/hide nav items
  const canManageProducts = await getPermission("manage:products");
  const canManageCategories = await getPermission("manage:categories");
  const canManageAccounts = await getPermission("manage:accounts");
  const canManageBids = await getPermission("manage:bids");
  const canManageKYC = await getPermission("approve:kyc");

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: Package,
      show: canManageProducts?.isGranted,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: FolderTree,
      show: canManageCategories?.isGranted,
    },
    {
      href: "/admin/accounts",
      label: "Accounts",
      icon: Users,
      show: canManageAccounts?.isGranted,
    },
    {
      href: "/admin/bids",
      label: "Bids",
      icon: Gavel,
      show: canManageBids?.isGranted,
    },
    {
      href: "/admin/kyc",
      label: "KYC Verification",
      icon: ShieldCheck,
      show: canManageKYC?.isGranted,
    },
  ];

  const permissions = { 
    canManageProducts,
    canManageCategories,
    canManageAccounts,
    canManageBids,
    canManageKYC
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar permissions={permissions} />

        {/* Main Content */}
        <div className="lg:pl-64 flex-1 min-w-0">
          {/* Mobile Header */}
          <Navbar permissions={permissions}/>

          {/* Page Content */}
          <main className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
