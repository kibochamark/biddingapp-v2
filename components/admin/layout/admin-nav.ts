import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  Gavel,
  ShieldCheck,
} from "lucide-react";

// Single source of truth for the admin nav — imported independently by the
// server layout (permission checks) and by the client Sidebar/MobileSidebar
// (rendering), so a role's visible sections never drift between the two.

export interface AdminPermissions {
  canManageProducts?: { isGranted: boolean } | null;
  canManageCategories?: { isGranted: boolean } | null;
  canManageAccounts?: { isGranted: boolean } | null;
  canManageBids?: { isGranted: boolean } | null;
  canManageKYC?: { isGranted: boolean } | null;
}

export interface AdminNavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  show: boolean;
}

export interface AdminUser {
  name: string;
  email: string;
  picture: string | null;
  role: string;
}

export function getAdminNavItems(permissions: AdminPermissions): AdminNavItem[] {
  return [
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
      show: !!permissions.canManageProducts?.isGranted,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: FolderTree,
      show: !!permissions.canManageCategories?.isGranted,
    },
    {
      href: "/admin/accounts",
      label: "Accounts",
      icon: Users,
      show: !!permissions.canManageAccounts?.isGranted,
    },
    {
      href: "/admin/bids",
      label: "Bids",
      icon: Gavel,
      show: !!permissions.canManageBids?.isGranted,
    },
    {
      href: "/admin/kyc",
      label: "KYC Verification",
      icon: ShieldCheck,
      show: !!permissions.canManageKYC?.isGranted,
    },
  ];
}

export function isAdminNavItemActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

// Mirrors the "Suggested Role Assignments" in ADMIN_PERMISSIONS.md. Display
// label only — the real gate is always the permission checks above.
export function getAdminRoleLabel(permissions: AdminPermissions): string {
  const granted = {
    products: !!permissions.canManageProducts?.isGranted,
    categories: !!permissions.canManageCategories?.isGranted,
    accounts: !!permissions.canManageAccounts?.isGranted,
    bids: !!permissions.canManageBids?.isGranted,
    kyc: !!permissions.canManageKYC?.isGranted,
  };

  if (Object.values(granted).every(Boolean)) return "Super Admin";
  if (granted.accounts && granted.bids) return "Moderator";
  if (granted.products && granted.categories) return "Product Manager";
  if (granted.kyc) return "KYC Reviewer";
  if (granted.accounts) return "Account Manager";
  return "Admin";
}
