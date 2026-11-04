import { LayoutDashboard } from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import type { AdminPermissions, AdminUser } from "./admin-nav";

const Navbar = ({
  permissions,
  user,
}: {
  permissions: AdminPermissions;
  user: AdminUser;
}) => {
  return (
    <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-16 px-4 glass-navbar">
      <div className="w-8 h-8 bg-primary flex items-center justify-center shrink-0">
        <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-ink truncate">BidMarket</h1>
      </div>

      <div className="ml-auto">
        <MobileSidebar permissions={permissions} user={user} />
      </div>
    </div>
  );
};

export default Navbar;
