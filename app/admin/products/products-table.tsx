"use client";

import { useState } from "react";
import { deleteProduct } from "../actions/products";
import { useRouter } from "next/navigation";
import { DataTable } from "@/Globalcomponents/ReusableTable";
import { productcolumns } from "./columns";
import { Product } from "@/lib/types";

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
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
