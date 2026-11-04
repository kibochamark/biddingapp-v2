import { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Users, Trophy, DollarSign, Shield, Zap, Target, Gift, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "How Bidding Works - BidMarket",
  description: "Learn about our unique lowest unique bid auction system and how you can win amazing products.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className=" ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
            <TrendingUp className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium text-ink uppercase mb-4">
            How BidMarket Works
          </h1>
          <p className="text-xl text-mute max-w-2xl mx-auto">
            Win amazing products for a fraction of their value through our unique lowest unique bid system
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* The Concept */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase mb-8 text-center">The Concept</h2>
          <div className="bg-card shadow-surface p-8 max-w-3xl mx-auto">
            <p className="text-lg text-mute mb-6">
              Unlike traditional auctions where the highest bid wins, our <strong className="text-ink">Lowest Unique Bid</strong> system rewards strategy and smart thinking. The winner is the person who places the <strong className="text-primary">lowest bid amount that only one person chose</strong>.
            </p>
            <div className="bg-soft-cloud p-6">
              <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Quick Example
              </h3>
              <p className="text-sm text-mute mb-4">
                Imagine 10 people bidding on an iPhone worth $999:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-mute">9 people bid: <span className="font-mono">$5.00</span></span>
                  <Badge variant="sale">Not unique</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-mute">1 person bids: <span className="font-mono font-bold text-primary">$3.47</span></span>
                  <Badge variant="success">Winner</Badge>
                </div>
              </div>
              <p className="text-xs text-mute mt-4">
                The person who bid $3.47 wins the $999 iPhone because it&apos;s the lowest amount that only one person chose!
              </p>
            </div>
          </div>
        </section>

        {/* How To Participate */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase mb-8 text-center">How to Participate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline">
            <div className="bg-background p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <Users className="h-8 w-8 text-ink mx-auto mb-3" />
              <h3 className="font-semibold text-ink mb-2">Create Account</h3>
              <p className="text-sm text-mute">
                Sign up for free in seconds using your email or social accounts
              </p>
            </div>

            <div className="bg-background p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <TrendingUp className="h-8 w-8 text-ink mx-auto mb-3" />
              <h3 className="font-semibold text-ink mb-2">Choose Auction</h3>
              <p className="text-sm text-mute">
                Browse our active auctions and pick a product you want to win
              </p>
            </div>

            <div className="bg-background p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <DollarSign className="h-8 w-8 text-ink mx-auto mb-3" />
              <h3 className="font-semibold text-ink mb-2">Place Your Bid</h3>
              <p className="text-sm text-mute">
                Pay the small bidding fee and choose your strategic bid amount
              </p>
            </div>

            <div className="bg-background p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <Trophy className="h-8 w-8 text-ink mx-auto mb-3" />
              <h3 className="font-semibold text-ink mb-2">Win & Receive</h3>
              <p className="text-sm text-mute">
                If you have the lowest unique bid, win the product for your bid amount!
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Example */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase mb-8 text-center">Real-World Example</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-card shadow-surface p-8">
              <div className="flex items-center gap-3 mb-6">
                <Gift className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-ink">MacBook Pro 14&quot; Auction</h3>
              </div>

              <div className="bg-soft-cloud p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-mute mb-1">Product Value</p>
                    <p className="text-2xl font-bold text-ink">$1,999</p>
                  </div>
                  <div>
                    <p className="text-sm text-mute mb-1">Bidding Fee</p>
                    <p className="text-2xl font-bold text-primary">$10</p>
                  </div>
                </div>

                <h4 className="font-semibold text-ink mb-4">Bids Placed:</h4>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between items-center p-2 bg-background">
                    <span>$2.00</span>
                    <span className="flex items-center gap-2 font-sans text-mute">
                      3 people <Badge variant="sale">Not unique</Badge>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background">
                    <span>$3.50</span>
                    <span className="flex items-center gap-2 font-sans text-mute">
                      1 person <Badge variant="default">Unique</Badge>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background">
                    <span>$5.00</span>
                    <span className="flex items-center gap-2 font-sans text-mute">
                      5 people <Badge variant="sale">Not unique</Badge>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-success/10 border border-success">
                    <span className="font-bold text-success">$2.99</span>
                    <span className="flex items-center gap-2 font-sans text-success font-semibold">
                      1 person <Badge variant="success">Winner</Badge>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background">
                    <span>$7.00</span>
                    <span className="flex items-center gap-2 font-sans text-mute">
                      1 person <Badge variant="default">Unique</Badge>
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background">
                    <span>$10.00</span>
                    <span className="flex items-center gap-2 font-sans text-mute">
                      2 people <Badge variant="sale">Not unique</Badge>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-ink text-background p-6">
                <h4 className="font-semibold mb-2">Result:</h4>
                <p className="text-sm mb-3">
                  The person who bid <strong>$2.99</strong> won the MacBook Pro!
                </p>
                <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-background/20">
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
          <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase mb-8 text-center">Why Choose BidMarket?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline">
            <div className="bg-background p-6">
              <Shield className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-semibold text-ink mb-2">100% Fair &amp; Transparent</h3>
              <p className="text-sm text-mute">
                All bids are public and verifiable. No hidden tricks, just pure strategy.
              </p>
            </div>

            <div className="bg-background p-6">
              <Zap className="h-6 w-6 text-ink mb-4" />
              <h3 className="font-semibold text-ink mb-2">Instant Results</h3>
              <p className="text-sm text-mute">
                Winners are announced immediately when the auction closes. No waiting!
              </p>
            </div>

            <div className="bg-background p-6">
              <Gift className="h-6 w-6 text-ink mb-4" />
              <h3 className="font-semibold text-ink mb-2">Premium Products</h3>
              <p className="text-sm text-mute">
                Win genuine, brand-new products from top brands at unbeatable prices.
              </p>
            </div>
          </div>
        </section>

        {/* Bidding Tips */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase mb-8 text-center">Pro Bidding Tips</h2>
          <div className="max-w-3xl mx-auto">
            <div className=" ">
              <div className="p-6">
                <h3 className="font-semibold text-ink mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm shrink-0">1</span>
                  Think Outside the Box
                </h3>
                <p className="text-sm text-mute">
                  Avoid obvious numbers like $1, $5, or $10. Choose unusual amounts like $3.47 or $7.23 to increase your chances of being unique.
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-ink mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm shrink-0">2</span>
                  Multiple Entries Strategy
                </h3>
                <p className="text-sm text-mute">
                  You can place multiple bids with different amounts to cover more ground and increase your winning chances.
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-ink mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm shrink-0">3</span>
                  Study the Competition
                </h3>
                <p className="text-sm text-mute">
                  Watch how many bids are being placed. More participants mean you should think more creatively with your amounts.
                </p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-ink mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm shrink-0">4</span>
                  Bid Early or Late
                </h3>
                <p className="text-sm text-mute">
                  Early bids set the tone, but late bids can catch others off guard. Find the timing that works for you!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-ink text-background p-8 sm:p-12 max-w-3xl mx-auto text-center">
            <Trophy className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-medium uppercase mb-4">Ready to Win?</h2>
            <p className="text-lg mb-8 opacity-80">
              Join thousands of smart bidders winning amazing products every day!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/catalog?sortBy=ending_soon"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-background text-ink rounded-full font-medium hover:bg-soft-cloud active:scale-95 transition-[transform,background-color]"
              >
                <TrendingUp className="h-5 w-5" />
                Browse Active Auctions
              </Link>
              <Link
                href="/api/auth/register"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-transparent text-background rounded-full font-medium border border-background/30 hover:bg-background/10 active:scale-95 transition-[transform,background-color]"
              >
                Create Free Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
