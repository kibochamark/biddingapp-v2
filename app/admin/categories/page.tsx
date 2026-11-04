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
          <h1 className="text-3xl font-bold text-ink mb-2">Categories</h1>
          <p className="text-mute">
            Organize products into categories and subcategories
          </p>
        </div>
        <div className="flex items-center gap-2 p-3 bg-soft-cloud">
          <FolderTree className="h-5 w-5 text-ink" />
          <div>
            <p className="text-xs text-mute">Hierarchy Enabled</p>
            <p className="text-sm font-semibold text-ink">Parent/Child Support</p>
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
