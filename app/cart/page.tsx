"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Trash2, ShoppingBag, CreditCard } from "lucide-react";

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
      <h1 className="text-3xl font-bold mb-8">Your Bids & Cart</h1>

      {cartItems.length === 0 ? (
        // Empty Cart
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">
            Start bidding on auctions to add items to your cart
          </p>
          <Link
            href="/catalog"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
          >
            Browse Auctions
          </Link>
        </div>
      ) : (
        // Cart with Items
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-lg p-4 flex gap-4"
              >
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
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
                    className="font-semibold hover:text-primary"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.condition}
                  </p>
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground">Your bid: </span>
                    <span className="font-semibold">
                      {formatPrice(item.bidAmount)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.status === "winning" ? (
                      <span className="text-green-600">✓ Currently winning</span>
                    ) : (
                      <span className="text-yellow-600">⚠ Outbid</span>
                    )}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl">{formatPrice(total)}</span>
                </div>
              </div>

              <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 mb-4">
                <CreditCard className="h-5 w-5" />
                Proceed to Checkout
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Payment will only be processed if you win the auction
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Bids Section */}
      {cartItems.length === 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Your Active Bids</h2>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              You don't have any active bids at the moment
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
