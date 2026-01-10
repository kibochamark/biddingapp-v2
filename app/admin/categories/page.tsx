import { Suspense } from "react";
import { Loader, FolderTree } from "lucide-react";
import CategoriesManager from "./categories-manager";

function CategoriesLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-primary w-12 h-12" />
        <p className="text-muted-foreground">Loading categories...</p>
      </div>
    </div>
  );
}

export default async function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Categories</h1>
          <p className="text-muted-foreground">
            Organize products into categories and subcategories
          </p>
        </div>
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <FolderTree className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Hierarchy Enabled</p>
            <p className="text-sm font-semibold text-foreground">Parent/Child Support</p>
          </div>
        </div>
      </div>

      {/* Categories Manager */}
      <Suspense fallback={<CategoriesLoading />}>
        <CategoriesManager />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Categories - Admin Portal",
  description: "Manage product categories",
};
