import { Metadata } from "next";
import Link from "next/link";
import { Shield, Eye, Lock, UserCheck } from "lucide-react";

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
            className="inline-flex items-center text-sm text-mute hover:text-primary mb-4"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-soft-cloud rounded-full">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium text-ink uppercase">Privacy Policy</h1>
          </div>
          <p className="text-mute">Last updated: January 3, 2026</p>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline mb-8">
          <div className="p-4 bg-background">
            <Lock className="h-5 w-5 text-ink mb-2" />
            <h3 className="font-semibold text-ink text-sm mb-1">Secure</h3>
            <p className="text-xs text-mute">Your data is encrypted and protected</p>
          </div>
          <div className="p-4 bg-background">
            <Eye className="h-5 w-5 text-ink mb-2" />
            <h3 className="font-semibold text-ink text-sm mb-1">Transparent</h3>
            <p className="text-xs text-mute">We&apos;re clear about what we collect</p>
          </div>
          <div className="p-4 bg-background">
            <UserCheck className="h-5 w-5 text-ink mb-2" />
            <h3 className="font-semibold text-ink text-sm mb-1">Your Control</h3>
            <p className="text-xs text-mute">You control your personal data</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-ink mb-4">1. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-ink mb-3">1.1 Information You Provide</h3>
            <ul className="list-disc list-inside text-mute space-y-2 mb-4">
              <li>Account information (name, email, password)</li>
              <li>Payment information (processed securely by Stripe/PayPal)</li>
              <li>Shipping address for prize delivery</li>
              <li>Profile information (optional)</li>
            </ul>

            <h3 className="text-lg font-semibold text-ink mb-3">1.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-mute space-y-2 mb-4">
              <li>Device information (browser, OS, device type)</li>
              <li>Usage data (pages visited, bid history)</li>
              <li>Cookies and similar technologies</li>
              <li>IP address and location data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-4">2. How We Use Your Information</h2>
            <p className="text-mute mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-mute space-y-2 mb-4">
              <li>Process your bids and transactions</li>
              <li>Send auction notifications and updates</li>
              <li>Improve our platform and user experience</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
              <li>Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-4">3. Data Sharing</h2>
            <p className="text-mute mb-4">We share your data with:</p>
            <ul className="list-disc list-inside text-mute space-y-2 mb-4">
              <li><strong>Payment Processors:</strong> Stripe and PayPal for secure transactions</li>
              <li><strong>Shipping Partners:</strong> To deliver your prizes</li>
              <li><strong>Analytics Services:</strong> To improve our platform</li>
              <li><strong>Legal Authorities:</strong> When required by law</li>
            </ul>
            <p className="text-mute">We never sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-4">4. Your Rights</h2>
            <p className="text-mute mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-mute space-y-2 mb-4">
              <li><strong>Access:</strong> Request a copy of your data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Export your data</li>
              <li><strong>Object:</strong> Opt-out of marketing communications</li>
              <li><strong>Withdraw Consent:</strong> At any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-4">5. Data Security</h2>
            <p className="text-mute mb-4">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc list-inside text-mute space-y-2 mb-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Encrypted databases for data at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing (PCI DSS compliant)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-4">6. Cookies</h2>
            <p className="text-mute mb-4">
              We use cookies and similar technologies for authentication, preferences, and analytics.
              See our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link> for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ink mb-4">7. Contact Us</h2>
            <div className="bg-soft-cloud p-4">
              <p className="text-sm text-ink mb-2">For privacy-related questions:</p>
              <p className="text-sm text-ink"><strong>Email:</strong> privacy@bidmarket.com</p>
              <p className="text-sm text-ink"><strong>Phone:</strong> +1 (234) 567-890</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
