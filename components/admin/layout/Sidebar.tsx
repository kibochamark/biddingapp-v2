"use client";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { usePathname } from "next/navigation";
import {
  getAdminNavItems,
  isAdminNavItemActive,
  type AdminPermissions,
  type AdminUser,
} from "./admin-nav";

const Sidebar = ({
  permissions,
  user,
}: {
  permissions: AdminPermissions;
  user: AdminUser;
}) => {
  const path = usePathname();
  const navItems = getAdminNavItems(permissions).filter((item) => item.show);

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-hairline lg:bg-background">
      {/* Logo/Header */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-hairline shrink-0">
        <div className="w-8 h-8 bg-primary flex items-center justify-center">
          <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-ink">BidMarket</h1>
          <p className="text-xs text-mute">Management Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isAdminNavItemActive(path, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                active ? "bg-primary/10 text-primary" : "text-ink hover:bg-soft-cloud"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Identity + sign out */}
      <div className="border-t border-hairline p-4 space-y-3 shrink-0">
        <div className="flex items-center gap-3 px-2">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-9 h-9 rounded-full shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-soft-cloud flex items-center justify-center text-sm font-medium text-ink shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink truncate">{user.name}</p>
            <p className="text-xs text-mute truncate">{user.role}</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-mute hover:text-ink hover:bg-soft-cloud rounded-full transition-colors"
        >
          Back to Site
        </Link>
        <LogoutLink className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-sale hover:bg-sale/10 rounded-full transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </LogoutLink>
      </div>
    </aside>
  );
};

export default Sidebar;
