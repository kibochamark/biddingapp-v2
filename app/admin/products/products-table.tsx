"use client";

import { useState } from "react";
import { deleteProduct } from "../actions/products";
import { useRouter } from "next/navigation";
import { DataTable } from "@/Globalcomponents/ReusableTable";
import { productcolumns } from "./columns";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-hairline max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-ink mb-2">Delete Product</h3>
        <p className="text-mute mb-6">
          Are you sure you want to delete "<strong>{productTitle}</strong>"? This action cannot be
          undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
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
  filtervalue:"NEW"
},
{
  filtercolumn:"condition",
  filtervalue:"MINT"
},
{
  filtercolumn:"condition",
  filtervalue:"EXCELLENT"
},
{
  filtercolumn:"condition",
  filtervalue:"GOOD"
},
{
  filtercolumn:"condition",
  filtervalue:"FAIR"
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
