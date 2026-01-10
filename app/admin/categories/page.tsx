import { FolderTree } from "lucide-react";
import CategoriesManager from "./categories-manager";
import { fetchAdminCategories } from "../actions/categories";

export default async function CategoriesPage() {
  const result = await fetchAdminCategories();
  const categories = result.success && result.data ? result.data : [];

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
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}

export const metadata = {
  title: "Categories - Admin Portal",
  description: "Manage product categories",
};
