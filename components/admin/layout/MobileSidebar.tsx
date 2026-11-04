"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getAdminNavItems,
  isAdminNavItemActive,
  type AdminPermissions,
  type AdminUser,
} from "./admin-nav";

const MobileSidebar = ({
  permissions,
  user,
}: {
  permissions: AdminPermissions;
  user: AdminUser;
}) => {
  const path = usePathname();
  const navItems = getAdminNavItems(permissions).filter((item) => item.show);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="size-10 flex items-center justify-center rounded-full hover:bg-soft-cloud transition-colors"
          aria-label="Open admin menu"
        >
          <Menu className="w-5 h-5 text-ink" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 sm:w-80 p-0 flex flex-col">
        <SheetHeader className="px-5 py-4   shrink-0">
          <SheetTitle className="text-base">Admin Menu</SheetTitle>
          <div className="flex items-center gap-3 pt-2">
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
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-medium text-ink truncate">{user.name}</p>
              <p className="text-xs text-mute truncate">{user.role}</p>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isAdminNavItemActive(path, item.href);
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-full transition-colors ${
                    active ? "bg-primary/10 text-primary" : "text-ink hover:bg-soft-cloud"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="  p-4 space-y-1 shrink-0">
          <SheetClose asChild>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-mute hover:text-ink hover:bg-soft-cloud rounded-full transition-colors"
            >
              Back to Site
            </Link>
          </SheetClose>
          <LogoutLink className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-sale hover:bg-sale/10 rounded-full transition-colors">
            <LogOut className="h-4 w-4" />
            Sign Out
          </LogoutLink>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
