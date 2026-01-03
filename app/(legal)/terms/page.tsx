import { Metadata } from "next";
import Link from "next/link";
import { Shield, FileText, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - BidMarket",
  description: "Read our terms of service and user agreement for using BidMarket's auction platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 3, 2026</p>
        </div>

        {/* Important Notice */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Important</h3>
              <p className="text-sm text-muted-foreground">
                By accessing and using BidMarket, you agree to be bound by these Terms of Service. Please read them carefully.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using BidMarket (&quot;the Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              BidMarket is a lowest unique bid auction platform where users can:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Place bids on products listed for auction</li>
              <li>Win products by placing the lowest unique bid amount</li>
              <li>View auction history and track active bids</li>
              <li>Manage their account and bidding preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Eligibility</h2>
            <p className="text-muted-foreground mb-4">
              To use BidMarket, you must:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Bidding Rules</h2>
            <h3 className="text-xl font-semibold text-foreground mb-3">4.1 How Bidding Works</h3>
            <p className="text-muted-foreground mb-4">
              Our platform operates on a &quot;lowest unique bid&quot; system:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Each bid requires a bidding fee (non-refundable)</li>
              <li>The winner is determined by the lowest bid amount that only one person placed</li>
              <li>If multiple people bid the same amount, that bid is not considered &quot;unique&quot;</li>
              <li>Users can place multiple bids on the same auction</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">4.2 Bid Confirmation</h3>
            <p className="text-muted-foreground mb-4">
              All bids are final once confirmed. By placing a bid, you agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Pay the bidding fee immediately</li>
              <li>Accept that bidding fees are non-refundable</li>
              <li>Complete the purchase if you win the auction</li>
              <li>Provide accurate payment information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Payment Terms</h2>
            <p className="text-muted-foreground mb-4">
              All payments are processed securely through our payment partners (Stripe/PayPal). By making a payment, you agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Provide valid payment information</li>
              <li>Authorize us to charge your payment method</li>
              <li>Accept that bidding fees are non-refundable</li>
              <li>Pay the product price if you win an auction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. User Conduct</h2>
            <p className="text-muted-foreground mb-4">
              Users agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Use automated systems or bots to place bids</li>
              <li>Manipulate or interfere with the bidding process</li>
              <li>Create multiple accounts to gain unfair advantage</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to reverse engineer or hack the platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Account Termination</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to suspend or terminate your account if:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>You violate these Terms of Service</li>
              <li>You engage in fraudulent activity</li>
              <li>You provide false information</li>
              <li>We detect suspicious account activity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              BidMarket is provided &quot;as is&quot; without warranties of any kind. We are not liable for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Lost bids due to technical issues</li>
              <li>Delays in auction processing</li>
              <li>Product quality issues (covered by product warranties)</li>
              <li>Indirect, incidental, or consequential damages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All content on BidMarket, including logos, designs, text, and graphics, is owned by BidMarket or its licensors and is protected by copyright and trademark laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground"><strong>Email:</strong> legal@bidmarket.com</p>
              <p className="text-sm text-foreground"><strong>Phone:</strong> +1 (234) 567-890</p>
              <p className="text-sm text-foreground"><strong>Address:</strong> 123 Auction St, New York, NY 10001</p>
            </div>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Related Documents</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Shield className="h-4 w-4" />
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <FileText className="h-4 w-4" />
              Cookie Policy
            </Link>
            <Link
              href="/shipping-returns"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <FileText className="h-4 w-4" />
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
