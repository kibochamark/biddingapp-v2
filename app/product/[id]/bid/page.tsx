import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { fetchProductById } from "@/lib/api/products";
import { ChevronRight, Loader2 } from "lucide-react";
import BidPlacementClient from "@/components/bid/bid-placement-client";
import CancelledNotification from "@/components/bid/cancelled-notification";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface BidPageProps {
  id: string;
}

export default async function BidPage({ params }: { params: Promise<BidPageProps> }) {
  const { id } = await params;

  // Check authentication
  const { isAuthenticated, getUser } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect(`/api/auth/login?post_login_redirect_url=/product/${id}/bid`);
  }

  const user = await getUser();

  // Fetch product
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  // // Check if product is active
  // if (product.status !== "ACTIVE") {
  //   redirect(`/product/${id}?error=inactive`);
  // }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Cancelled Payment Notification Handler */}
      <CancelledNotification />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/catalog" className="hover:text-primary transition-colors">
            Catalog
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/product/${id}`} className="hover:text-primary transition-colors">
            {product.title}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Place Bid</span>
        </nav>

        {/* Main Content */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <BidPlacementClient
            product={product}
            user={{
              id: user?.id || "",
              name: `${user?.given_name || ""} ${user?.family_name || ""}`.trim() || "User",
              email: user?.email || "",
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<BidPageProps> }) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `Place Bid - ${product.title} - BidMarket`,
    description: `Place your bid for ${product.title}. Entry fee: $${product.auctions[0].totalBidsCount || 5}`,
  };
}
