"use client";

import { useState } from "react";
import { deleteProduct } from "../actions/products";
import { useRouter } from "next/navigation";
import { DataTable } from "@/Globalcomponents/ReusableTable";
import { productcolumns } from "./columns";
import { Product } from "@/lib/types";

// Mock data - replace with real data from server
const mockProducts = [
  {
    id: "1",
    title: "iPhone 15 Pro Max 256GB",
    category: "Electronics",
    condition: "NEW",
    currentBid: 899,
    totalBids: 45,
    status: "ACTIVE",
    endDate: new Date("2024-02-15"),
    images: ["/placeholder.png"],
  },
  {
    id: "2",
    title: "MacBook Pro 16-inch M3",
    category: "Electronics",
    condition: "NEW",
    currentBid: 2299,
    totalBids: 78,
    status: "ACTIVE",
    endDate: new Date("2024-02-20"),
    images: ["/placeholder.png"],
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles = {
    ACTIVE: "bg-green-500/10 text-green-600 border-green-500/20",
    ENDED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
    DRAFT: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${
        styles[status as keyof typeof styles]
      }`}
    >
      {status}
    </span>
  );
}

function ConditionBadge({ condition }: { condition: string }) {
  const styles = {
    NEW: "bg-green-500/10 text-green-600",
    LIKE_NEW: "bg-blue-500/10 text-blue-600",
    GOOD: "bg-yellow-500/10 text-yellow-600",
    FAIR: "bg-orange-500/10 text-orange-600",
    POOR: "bg-red-500/10 text-red-600",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[condition as keyof typeof styles]
      }`}
    >
      {condition.replace("_", " ")}
    </span>
  );
}

function DeleteConfirmModal({
  productTitle,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  productTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Delete Product</h3>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete "<strong>{productTitle}</strong>"? This action cannot be
          undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsTable({products}:{products:Product[] | []}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    const result = await deleteProduct(productToDelete.id);
    if (result.success) {
      setProductToDelete(null);
      router.refresh();
    }
    setIsDeleting(false);
  };

  return (
    <div className="space-y-4 w-full">
      <DataTable columns={productcolumns} data={products} search_alias_name={"products"} filters={[
{
  filtercolumn:"condition",
  filtervalue:"All"
},
{
  filtercolumn:"condition",
  filtervalue:"NEW",
  classnames:"border border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/20"
},
{
  filtercolumn:"condition",
  filtervalue:"MINT",
  classnames:"border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
},
{
  filtercolumn:"condition",
  filtervalue:"EXCELLENT",
  classnames:"border border-blue-500/20 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
},
{
  filtercolumn:"condition",
  filtervalue:"GOOD",
  classnames:"border border-yellow-500/20 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
},
{
  filtercolumn:"condition",
  filtervalue:"FAIR",
  classnames:"border border-orange-500/20 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
}

      ]} defaultfilter="All"/>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <DeleteConfirmModal
          productTitle={productToDelete.title}
          onConfirm={handleDelete}
          onCancel={() => setProductToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
