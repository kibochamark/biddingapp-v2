import { Suspense } from "react";
import Link from "next/link";
import { Plus, Loader } from "lucide-react";
import ProductsTable from "./products-table";
import { getAllProducts } from "@/lib/api/products";
import { Button } from "@/components/ui/button";

function ProductsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-primary w-12 h-12" />
        <p className="text-mute">Loading products...</p>
      </div>
    </div>
  );
}

export default async function ProductsPage({searchParams}: {searchParams: Promise<{ [key: string]: string | undefined }>}) {
  const params = await searchParams;
  console.log("Search Params:", params);
  const products = await getAllProducts(params?.next)?? [];

  // console.log("Products fetched:", products);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">Products</h1>
          <p className="text-mute">
            Manage all products and auctions in the system
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-5 w-5" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Products Table */}
      <Suspense fallback={<ProductsLoading />}>
        <ProductsTable products ={products}/>
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: "Products - Admin Portal",
  description: "Manage products and auctions",
};
