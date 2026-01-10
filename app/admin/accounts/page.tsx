import { Suspense } from "react";
import { Loader } from "lucide-react";
import AccountsTable from "./accounts-table";

function AccountsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-primary w-12 h-12" />
        <p className="text-muted-foreground">Loading accounts...</p>
      </div>
    </div>
  );
}

export default async function AccountsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">User Accounts</h1>
        <p className="text-muted-foreground">
          Manage user accounts, view activity, and moderate platform access
        </p>
      </div>

      {/* Accounts Table */}
      <Suspense fallback={<AccountsLoading />}>
        <AccountsTable />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Accounts - Admin Portal",
  description: "Manage user accounts",
};
