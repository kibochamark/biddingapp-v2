import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ListingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase">My Listings</h2>
        <Button>
          <Plus className="h-4 w-4" />
          Create Listing
        </Button>
      </div>
      <div className="border border-hairline p-8 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-mute" />
        <p className="text-mute">
          You haven't created any listings yet
        </p>
      </div>
    </div>
  );
}
