"use client";
import Link from 'next/link';
import React from 'react'
import { Permission } from './MobileSidebar';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Users,
    Gavel,
    ShieldCheck,
    UserX
} from "lucide-react";
import { usePathname } from 'next/navigation';



export interface NavItems{
    href: string;
    label: string;
    icon?: React.ComponentType<any>;
    show: boolean | undefined;
}


const Sidebar = ({permissions}:{permissions: Permission}) => {
    const path = usePathname()
    const navItems = [
        {
            href: "/admin",
            label: "Dashboard",
            icon: LayoutDashboard,
            show: true,
            isactive: path === "/admin",
        },
        {
            href: "/admin/products",
            label: "Products",
            icon: Package,
            show: permissions.canManageProducts?.isGranted,
            isactive: path.startsWith("/admin/products"),
        },
        {
            href: "/admin/categories",
            label: "Categories",
            icon: FolderTree,
            show: permissions.canManageCategories?.isGranted,
            isactive: path.startsWith("/admin/categories"),
        },
        {
            href: "/admin/accounts",
            label: "Accounts",
            icon: Users,
            show: permissions.canManageAccounts?.isGranted,
            isactive: path.startsWith("/admin/accounts"),
        },
        {
            href: "/admin/bids",
            label: "Bids",
            icon: Gavel,
            show: permissions.canManageBids?.isGranted,
            isactive: path.startsWith("/admin/bids"),
        },
        {
            href: "/admin/kyc",
            label: "KYC Verification",
            icon: ShieldCheck,
            show: permissions.canManageKYC?.isGranted,
            isactive: path.startsWith("/admin/kyc"),
        },
    ];
  return (
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-border lg:bg-card/50 lg:backdrop-blur-sm">
          {/* Logo/Header */}
          <div className="flex items-center gap-3 h-16 px-6 border-b border-border">
              <div className="w-8 h-8 bg-linear-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                  <h1 className="text-lg font-bold text-foreground">BidMarket</h1>
                  <p className="text-xs text-muted-foreground">Management Console</p>
              </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navItems.filter(item => item.show).map((item) => {
                  const Icon = item.icon;
                  return (
                      <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all group ${item.isactive ? 'bg-primary/10 text-primary' : ''}`}
                      >
                          <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span>{item.label}</span>
                      </Link>
                  );
              })}
          </nav>

          {/* Back to Site Link */}
          <div className="p-4 border-t border-border">
              <Link
                  href="/"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
              >
                  ← Back to Site
              </Link>
          </div>
      </aside>
  )
}

export default Sidebar