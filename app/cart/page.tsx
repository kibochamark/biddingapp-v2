"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  // Mock cart state - in a real app, this would come from context or state management
  const [cartItems, setCartItems] = useState<any[]>([]);

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.bidAmount, 0);
  const shipping = cartItems.length > 0 ? 15 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-medium text-ink uppercase mb-8">Your Bids & Cart</h1>

      {cartItems.length === 0 ? (
        // Empty Cart
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-mute" />
          <h2 className="text-2xl font-medium text-ink mb-2">Your cart is empty</h2>
          <p className="text-mute mb-8">
            Start bidding on auctions to add items to your cart
          </p>
          <Button asChild>
            <Link href="/catalog?sortBy=ending_soon">Browse Auctions</Link>
          </Button>
        </div>
      ) : (
        // Cart with Items
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items — one continuous list, single divider between rows */}
          <div className="lg:col-span-2    ">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-4 flex gap-4"
              >
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-soft-cloud">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <Link
                    href={`/product/${item.id}`}
                    className="font-medium text-ink hover:text-primary"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-mute mt-1">
                    {item.condition}
                  </p>
                  <div className="mt-2">
                    <span className="text-sm text-mute">Your bid: </span>
                    <span className="font-medium text-ink">
                      {formatPrice(item.bidAmount)}
                    </span>
                  </div>
                  <p className="text-xs mt-1">
                    {item.status === "winning" ? (
                      <span className="text-success">✓ Currently winning</span>
                    ) : (
                      <span className="text-sale">⚠ Outbid</span>
                    )}
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="hover:bg-sale/10 hover:text-sale"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-soft-cloud sticky top-24">
              <h2 className="text-xl font-medium text-ink mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-mute">Subtotal</span>
                  <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mute">Shipping</span>
                  <span className="font-medium text-ink">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mute">Tax (8%)</span>
                  <span className="font-medium text-ink">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="pt-4   mb-6">
                <div className="flex justify-between">
                  <span className="font-medium text-lg text-ink">Total</span>
                  <span className="font-semibold text-2xl text-ink">{formatPrice(total)}</span>
                </div>
              </div>

              <Button className="w-full mb-4">
                <CreditCard className="h-5 w-5" />
                Proceed to Checkout
              </Button>

              <p className="text-xs text-mute text-center">
                Payment will only be processed if you win the auction
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Bids Section */}
      {cartItems.length === 0 && (
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase mb-6">Your Active Bids</h2>
          <div className="bg-soft-cloud p-8 text-center">
            <p className="text-mute">
              You don't have any active bids at the moment
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
