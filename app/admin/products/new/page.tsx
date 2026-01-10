import CreateProductForm from "../components/CreateProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Create New Product</h1>
        <p className="text-muted-foreground">
          Add a new product to the auction platform
        </p>
      </div>

      <CreateProductForm />
    </div>
  );
}

export const metadata = {
  title: "Create Product - Admin Portal",
  description: "Create a new product",
};
