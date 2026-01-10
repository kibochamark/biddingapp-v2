import { fetchProductById } from "@/lib/api/products";
import EditProductForm from "../components/EditProductForm";
import { redirect } from "next/navigation";

interface EditProductPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function EditProductPage({ searchParams }: EditProductPageProps) {
  const params = await searchParams;
  const productId = params.id;

  if (!productId) {
    redirect("/admin/products");
  }

  const product = await fetchProductById(productId);

  if (!product) {
    redirect("/admin/products");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Edit Product</h1>
        <p className="text-muted-foreground">
          Update product information and manage images
        </p>
      </div>

      <EditProductForm product={product} />
    </div>
  );
}

export const metadata = {
  title: "Edit Product - Admin Portal",
  description: "Edit product details",
};
