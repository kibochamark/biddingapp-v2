import { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Users, Trophy, DollarSign, Shield, Zap, Target, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "How Bidding Works - BidMarket",
  description: "Learn about our unique lowest unique bid auction system and how you can win amazing products.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
            <TrendingUp className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How BidMarket Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Win amazing products for a fraction of their value through our unique lowest unique bid system
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* The Concept */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">The Concept</h2>
          <div className="bg-card border border-border rounded-xl p-8 max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground mb-6">
              Unlike traditional auctions where the highest bid wins, our <strong className="text-foreground">Lowest Unique Bid</strong> system rewards strategy and smart thinking. The winner is the person who places the <strong className="text-primary">lowest bid amount that only one person chose</strong>.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Quick Example
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Imagine 10 people bidding on an iPhone worth $999:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">9 people bid: <span className="font-mono">$5.00</span></span>
                  <span className="text-red-500">❌ Not unique</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">1 person bids: <span className="font-mono font-bold text-primary">$3.47</span></span>
                  <span className="text-green-500 font-semibold">✅ WINNER!</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                The person who bid $3.47 wins the $999 iPhone because it's the lowest amount that only one person chose!
              </p>
            </div>
          </div>
        </section>

        {/* How To Participate */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How to Participate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Create Account</h3>
              <p className="text-sm text-muted-foreground">
                Sign up for free in seconds using your email or social accounts
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Choose Auction</h3>
              <p className="text-sm text-muted-foreground">
                Browse our active auctions and pick a product you want to win
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Place Your Bid</h3>
              <p className="text-sm text-muted-foreground">
                Pay the small bidding fee and choose your strategic bid amount
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Win & Receive</h3>
              <p className="text-sm text-muted-foreground">
                If you have the lowest unique bid, win the product for your bid amount!
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Example */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Real-World Example</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Gift className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">MacBook Pro 14" Auction</h3>
              </div>

              <div className="bg-background rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Product Value</p>
                    <p className="text-2xl font-bold text-foreground">$1,999</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bidding Fee</p>
                    <p className="text-2xl font-bold text-primary">$10</p>
                  </div>
                </div>

                <h4 className="font-semibold text-foreground mb-4">Bids Placed:</h4>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>$2.00</span>
                    <span className="text-muted-foreground">3 people ❌</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>$3.50</span>
                    <span className="text-muted-foreground">1 person ✓</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>$5.00</span>
                    <span className="text-muted-foreground">5 people ❌</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-primary/20 border border-primary rounded">
                    <span className="font-bold text-primary">$2.99</span>
                    <span className="text-primary font-semibold">1 person ✅ WINNER!</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>$7.00</span>
                    <span className="text-muted-foreground">1 person ✓</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span>$10.00</span>
                    <span className="text-muted-foreground">2 people ❌</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground rounded-lg p-6">
                <h4 className="font-semibold mb-2">🎉 Result:</h4>
                <p className="text-sm mb-3">
                  The person who bid <strong>$2.99</strong> won the MacBook Pro!
                </p>
                <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-primary-foreground/20">
                  <div>
                    <p className="text-xs opacity-80">They Paid</p>
                    <p className="text-lg font-bold">$12.99</p>
                    <p className="text-xs">($10 fee + $2.99 bid)</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">They Saved</p>
                    <p className="text-lg font-bold">$1,986</p>
                    <p className="text-xs">(98.5% discount!)</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Product Value</p>
                    <p className="text-lg font-bold">$1,999</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why Choose BidMarket?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">100% Fair & Transparent</h3>
              <p className="text-sm text-muted-foreground">
                All bids are public and verifiable. No hidden tricks, just pure strategy.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Winners are announced immediately when the auction closes. No waiting!
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Premium Products</h3>
              <p className="text-sm text-muted-foreground">
                Win genuine, brand-new products from top brands at unbeatable prices.
              </p>
            </div>
          </div>
        </section>

        {/* Bidding Tips */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Pro Bidding Tips</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                  Think Outside the Box
                </h3>
                <p className="text-sm text-muted-foreground">
                  Avoid obvious numbers like $1, $5, or $10. Choose unusual amounts like $3.47 or $7.23 to increase your chances of being unique.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                  Multiple Entries Strategy
                </h3>
                <p className="text-sm text-muted-foreground">
                  You can place multiple bids with different amounts to cover more ground and increase your winning chances.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
                  Study the Competition
                </h3>
                <p className="text-sm text-muted-foreground">
                  Watch how many bids are being placed. More participants mean you should think more creatively with your amounts.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">4</span>
                  Bid Early or Late
                </h3>
                <p className="text-sm text-muted-foreground">
                  Early bids set the tone, but late bids can catch others off guard. Find the timing that works for you!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-12 max-w-3xl mx-auto">
            <Trophy className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Win?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of smart bidders winning amazing products every day!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/catalog"
                className="px-8 py-4 bg-background text-foreground rounded-lg hover:bg-background/90 transition-colors font-semibold inline-flex items-center justify-center gap-2"
              >
                <TrendingUp className="h-5 w-5" />
                Browse Active Auctions
              </Link>
              <Link
                href="/api/auth/register"
                className="px-8 py-4 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground rounded-lg hover:bg-primary-foreground/20 transition-colors font-semibold border border-primary-foreground/20"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
