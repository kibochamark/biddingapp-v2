import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import StoreProvider from "@/lib/redux/StoreProvider";
import { Figtree } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner";

const figtree = Figtree({ subsets: ['latin'], weight: ['500', '700'] })


export const metadata: Metadata = {
  title: "BidMarket - Your Trusted Bidding Marketplace",
  description: "Bid on quality electronics at unbeatable prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${figtree.className} bg-background text-foreground min-h-screen flex flex-col`}>
        <StoreProvider>
          <Toaster />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieConsent />
        </StoreProvider>
      </body>
    </html>
  );
}
