import { Metadata } from "next";
import Link from "next/link";
import { Shield, Eye, Lock, Database, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - BidMarket",
  description: "Learn how BidMarket protects your privacy and handles your personal data.",
};

export default function PrivacyPolicyPage() {
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
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 3, 2026</p>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-muted rounded-lg">
            <Lock className="h-5 w-5 text-primary mb-2" />
            <h3 className="font-semibold text-foreground text-sm mb-1">Secure</h3>
            <p className="text-xs text-muted-foreground">Your data is encrypted and protected</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <Eye className="h-5 w-5 text-primary mb-2" />
            <h3 className="font-semibold text-foreground text-sm mb-1">Transparent</h3>
            <p className="text-xs text-muted-foreground">We&apos;re clear about what we collect</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <UserCheck className="h-5 w-5 text-primary mb-2" />
            <h3 className="font-semibold text-foreground text-sm mb-1">Your Control</h3>
            <p className="text-xs text-muted-foreground">You control your personal data</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-foreground mb-3">1.1 Information You Provide</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Account information (name, email, password)</li>
              <li>Payment information (processed securely by Stripe/PayPal)</li>
              <li>Shipping address for prize delivery</li>
              <li>Profile information (optional)</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3">1.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Device information (browser, OS, device type)</li>
              <li>Usage data (pages visited, bid history)</li>
              <li>Cookies and similar technologies</li>
              <li>IP address and location data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Process your bids and transactions</li>
              <li>Send auction notifications and updates</li>
              <li>Improve our platform and user experience</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Sharing</h2>
            <p className="text-muted-foreground mb-4">We share your data with:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Payment Processors:</strong> Stripe and PayPal for secure transactions</li>
              <li><strong>Shipping Partners:</strong> To deliver your prizes</li>
              <li><strong>Analytics Services:</strong> To improve our platform</li>
              <li><strong>Legal Authorities:</strong> When required by law</li>
            </ul>
            <p className="text-muted-foreground">We never sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Access:</strong> Request a copy of your data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Export your data</li>
              <li><strong>Object:</strong> Opt-out of marketing communications</li>
              <li><strong>Withdraw Consent:</strong> At any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Encrypted databases for data at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing (PCI DSS compliant)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar technologies for authentication, preferences, and analytics.
              See our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link> for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground mb-2">For privacy-related questions:</p>
              <p className="text-sm text-foreground"><strong>Email:</strong> privacy@bidmarket.com</p>
              <p className="text-sm text-foreground"><strong>Phone:</strong> +1 (234) 567-890</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
