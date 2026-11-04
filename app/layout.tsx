import type { Metadata } from "next";
import "./globals.css";

import Footer from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import StoreProvider from "@/lib/redux/StoreProvider";
import { Inter, Bebas_Neue } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner";
import RealtimeNotifications from "@/components/realtime-notifications";
import MainNavbarPage from "@/components/navbar/main_navbar_page";

// Inter carries every UI tier (nav, buttons, prices, captions); Bebas Neue is the
// open-source stand-in for Nike's proprietary Futura ND display headline tier.
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter' })
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: ['400'], variable: '--font-bebas' })


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
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans bg-background text-foreground min-h-screen flex flex-col`}>
        <StoreProvider>
          <Toaster position="top-right"/>
          <RealtimeNotifications />
          <MainNavbarPage />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieConsent />
        </StoreProvider>
      </body>
    </html>
  );
}
