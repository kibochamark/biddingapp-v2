"use client"
import React, { use } from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { HamburgerIcon, MenuIcon } from 'lucide-react'
import Sidebar, { NavItems } from './Sidebar'
import Link from 'next/link'

import {
    LayoutDashboard,
    Package,
    FolderTree,
    Users,
    Gavel,
    ShieldCheck,
    UserX
} from "lucide-react";
import { usePathname } from 'next/navigation'



export interface Permission {
    canManageProducts?: { isGranted: boolean  } | null;
    canManageCategories?: { isGranted: boolean  } | null;
    canManageAccounts?: { isGranted: boolean  } | null;
    canManageBids?: { isGranted: boolean  } | null;
    canManageKYC?: { isGranted: boolean  } | null;
}


const MobileSidebar = ({permissions}:{permissions: Permission}) => {
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
            isactuve: path.startsWith("/admin/products"),
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
    <div className="h-full">
        
          <Sheet>
              <SheetTrigger>
                <MenuIcon className='w-6 h-6 text-primary hover:cursor-pointer' />
              </SheetTrigger>
              <SheetContent>
                  {/* Navigation */}
                  <nav className="flex-1 px-4 py-6 my-6 space-y-1 overflow-y-auto">
                      {navItems.filter(item => item.show).map((item) => {
                          const Icon = item.icon;
                          return (
                              <SheetClose asChild>
                              <Link
                                  key={item.href}
                                  href={item.href}
                                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary bg-primary/5 rounded-lg transition-all group ${item.isactive ? 'bg-primary/10 text-primary' : ''}`}
                              >
                                  <Icon className="h-5 w-5 group-hover:scale-110 text-primary transition-transform" />
                                  <span className='font-semibold'>{item.label}</span>
                              </Link>
                              </SheetClose>
                          );
                      })}
                  </nav>
              </SheetContent>
          </Sheet>
    
    </div>
  )
}

export default MobileSidebar