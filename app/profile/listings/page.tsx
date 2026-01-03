import { Package, Plus } from "lucide-react";

export default function ListingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">My Listings</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Create Listing
        </button>
      </div>
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          You haven't created any listings yet
        </p>
      </div>
    </div>
  );
}
