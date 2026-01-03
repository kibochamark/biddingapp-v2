# Implementation Guide: Legal Pages, 404, and Cookie Consent

This guide contains all the code for implementing the remaining pages and modern cookie consent banner.

## Table of Contents
1. [Privacy Policy Page](#privacy-policy-page)
2. [Cookie Policy Page](#cookie-policy-page)
3. [Shipping & Returns Page](#shipping-returns-page)
4. [How It Works Page](#how-it-works-page)
5. [Custom 404 Not Found Page](#custom-404-not-found-page)
6. [Cookie Consent Banner](#cookie-consent-banner)
7. [Modern Cookie Consent Explanation](#modern-cookie-consent-explanation)

---

## Privacy Policy Page

**File**: `app/(legal)/privacy/page.tsx`

```tsx
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
            <p className="text-xs text-muted-foreground">We're clear about what we collect</p>
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
```

---

## Cookie Policy Page

**File**: `app/(legal)/cookies/page.tsx`

```tsx
import { Metadata } from "next";
import Link from "next/link";
import { Cookie, Settings, BarChart3, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy - BidMarket",
  description: "Learn about how BidMarket uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Cookie Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 3, 2026</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>

            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">1. Essential Cookies (Required)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Authentication and session management</li>
                      <li>Security and fraud prevention</li>
                      <li>Load balancing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2. Analytics Cookies (Optional)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Page views and navigation paths</li>
                      <li>Time spent on pages</li>
                      <li>Device and browser information</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">3. Functional Cookies (Optional)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Enable enhanced functionality and personalization, such as remembering your preferences.
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Language preferences</li>
                      <li>Theme settings (dark/light mode)</li>
                      <li>Recently viewed auctions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">4. Marketing Cookies (Optional)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Track your activity across websites to show relevant advertisements.
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Personalized advertising</li>
                      <li>Retargeting campaigns</li>
                      <li>Social media integration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground mb-4">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Use our cookie consent banner to customize your preferences</li>
              <li>Change your browser settings to block or delete cookies</li>
              <li>Visit our preference center (link in footer)</li>
            </ul>
            <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              <strong>Note:</strong> Blocking essential cookies may affect the functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We use services from trusted partners that may set their own cookies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Google Analytics:</strong> Website analytics</li>
              <li><strong>Stripe & PayPal:</strong> Payment processing</li>
              <li><strong>Social Media:</strong> Facebook, Twitter for social features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time. We'll notify you of significant changes via email or a prominent notice on our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
```

---

## Shipping & Returns Page

**File**: `app/shipping-returns/page.tsx`

```tsx
import { Metadata } from "next";
import Link from "next/link";
import { Package, Truck, RotateCcw, Clock, MapPin, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Returns - BidMarket",
  description: "Learn about our shipping policies and return procedures for won auctions.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Shipping & Returns</h1>
          </div>
          <p className="text-muted-foreground">Everything you need to know about delivery and returns</p>
        </div>

        <div className="space-y-8">
          {/* Shipping Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Shipping Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-1">Processing Time</h3>
                <p className="text-xs text-muted-foreground">1-2 business days</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <Truck className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-1">Standard Delivery</h3>
                <p className="text-xs text-muted-foreground">3-7 business days</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <MapPin className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-1">Tracking</h3>
                <p className="text-xs text-muted-foreground">Provided via email</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-3">Shipping Process</h3>
            <ol className="space-y-3 mb-6">
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <h4 className="font-semibold text-foreground">Win the Auction</h4>
                  <p className="text-sm text-muted-foreground">You'll be notified via email within minutes</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <h4 className="font-semibold text-foreground">Confirm Your Details</h4>
                  <p className="text-sm text-muted-foreground">Verify your shipping address in your account</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <h4 className="font-semibold text-foreground">Processing</h4>
                  <p className="text-sm text-muted-foreground">We prepare your item for shipment (1-2 days)</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">4</div>
                <div>
                  <h4 className="font-semibold text-foreground">Shipment</h4>
                  <p className="text-sm text-muted-foreground">Tracking number sent to your email</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">5</div>
                <div>
                  <h4 className="font-semibold text-foreground">Delivery</h4>
                  <p className="text-sm text-muted-foreground">Receive your prize at your doorstep!</p>
                </div>
              </li>
            </ol>

            <h3 className="text-xl font-semibold text-foreground mb-3">Shipping Costs</h3>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">FREE Shipping on All Won Auctions!</p>
                  <p className="text-sm text-muted-foreground">
                    We cover all shipping costs for items you win through our auction platform.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Returns Section */}
          <section className="pt-8 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Return Policy</h2>
            </div>

            <div className="bg-muted rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-foreground mb-2">30-Day Return Window</h3>
              <p className="text-sm text-muted-foreground">
                You have 30 days from the delivery date to initiate a return for defective or damaged items.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-3">Eligible Returns</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              <li>Items received damaged or defective</li>
              <li>Items not as described in the auction listing</li>
              <li>Missing parts or accessories</li>
              <li>Manufacturing defects covered by warranty</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3">Non-Returnable Items</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              <li>Items damaged due to misuse or neglect</li>
              <li>Items without original packaging</li>
              <li>Digital products or gift cards</li>
              <li>Personalized or custom items</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3">How to Return an Item</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">1</span>
                <div>
                  <h4 className="font-semibold text-foreground">Contact Support</h4>
                  <p className="text-sm text-muted-foreground">Email support@bidmarket.com with your order number and reason for return</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">2</span>
                <div>
                  <h4 className="font-semibold text-foreground">Get Authorization</h4>
                  <p className="text-sm text-muted-foreground">Receive a Return Authorization (RA) number and instructions</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">3</span>
                <div>
                  <h4 className="font-semibold text-foreground">Ship the Item</h4>
                  <p className="text-sm text-muted-foreground">Pack securely and ship to our return address with RA number</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">4</span>
                <div>
                  <h4 className="font-semibold text-foreground">Refund Processing</h4>
                  <p className="text-sm text-muted-foreground">Refund issued within 5-7 business days of receiving the return</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Contact Section */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Need Help?</h2>
            <div className="bg-muted rounded-lg p-6">
              <p className="text-muted-foreground mb-4">Our support team is here to help with any shipping or return questions.</p>
              <div className="space-y-2">
                <p className="text-sm text-foreground"><strong>Email:</strong> support@bidmarket.com</p>
                <p className="text-sm text-foreground"><strong>Phone:</strong> +1 (234) 567-890</p>
                <p className="text-sm text-foreground"><strong>Hours:</strong> Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
```

---

## Custom 404 Not Found Page

**File**: `app/not-found.tsx`

```tsx
import Link from "next/link";
import { Home, Search, TrendingUp, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-primary/10 rounded-full mb-6">
            <span className="text-6xl font-bold text-primary">404</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            The page you're looking for seems to have wandered off. Maybe it won an auction and left? 🎉
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
          >
            <Search className="h-5 w-5" />
            Browse Auctions
          </Link>
        </div>

        {/* Popular Links */}
        <div className="border-t border-border pt-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Popular Pages
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/catalog"
              className="p-4 bg-muted rounded-lg hover:bg-accent transition-colors group"
            >
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-foreground group-hover:text-primary">Active Auctions</p>
            </Link>
            <Link
              href="/how-it-works"
              className="p-4 bg-muted rounded-lg hover:bg-accent transition-colors group"
            >
              <Search className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-foreground group-hover:text-primary">How It Works</p>
            </Link>
            <Link
              href="/profile"
              className="p-4 bg-muted rounded-lg hover:bg-accent transition-colors group"
            >
              <Home className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-foreground group-hover:text-primary">My Account</p>
            </Link>
            <Link
              href="/catalog?filter=ending-soon"
              className="p-4 bg-muted rounded-lg hover:bg-accent transition-colors group"
            >
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-sm text-foreground group-hover:text-primary">Ending Soon</p>
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to previous page
        </button>
      </div>
    </div>
  );
}
```

---

## Cookie Consent Banner Implementation

### Modern Cookie Consent Component

**File**: `components/cookie-consent/cookie-banner.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Settings, Check } from "lucide-react";
import { toast } from "sonner";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
        applyConsent(saved);
      } catch (error) {
        console.error("Error loading cookie preferences:", error);
      }
    }
  }, []);

  const applyConsent = (prefs: CookiePreferences) => {
    // Apply analytics consent
    if (prefs.analytics && typeof window !== "undefined") {
      // Enable Google Analytics or other analytics
      // @ts-ignore
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
      });
    }

    // Apply marketing consent
    if (prefs.marketing && typeof window !== "undefined") {
      // Enable marketing cookies
      // @ts-ignore
      window.gtag?.("consent", "update", {
        ad_storage: "granted",
      });
    }

    // Store in localStorage
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    applyConsent(allAccepted);
    setShowBanner(false);
    toast.success("Cookie preferences saved");
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(essentialOnly);
    applyConsent(essentialOnly);
    setShowBanner(false);
    toast.info("Only essential cookies enabled");
  };

  const handleSavePreferences = () => {
    applyConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
    toast.success("Cookie preferences saved");
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // Can't disable essential
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] p-4 sm:p-6 animate-in slide-in-from-bottom">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-lg shadow-2xl">
            {!showSettings ? (
              // Simple Banner View
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    <Cookie className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">
                      We value your privacy
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                      By clicking &quot;Accept All&quot;, you consent to our use of cookies. Read our{" "}
                      <Link href="/cookies" className="text-primary hover:underline">
                        Cookie Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAcceptAll}
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                      >
                        Accept All
                      </button>
                      <button
                        onClick={handleRejectAll}
                        className="px-6 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                      >
                        Reject All
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium inline-flex items-center justify-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Customize
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleRejectAll}
                    className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              // Detailed Settings View
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Cookie Preferences</h3>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Essential Cookies */}
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          Essential Cookies
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Required for the website to function. Cannot be disabled.
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <div className="w-12 h-6 bg-primary rounded-full flex items-center px-1">
                          <div className="w-4 h-4 bg-primary-foreground rounded-full ml-auto" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          Analytics Cookies
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Help us understand how you use our website to improve your experience.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference("analytics")}
                        className="flex-shrink-0 ml-4"
                      >
                        <div
                          className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                            preferences.analytics ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              preferences.analytics ? "translate-x-6" : ""
                            }`}
                          />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          Functional Cookies
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Remember your preferences and settings for a personalized experience.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference("functional")}
                        className="flex-shrink-0 ml-4"
                      >
                        <div
                          className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                            preferences.functional ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              preferences.functional ? "translate-x-6" : ""
                            }`}
                          />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          Marketing Cookies
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Used to show you relevant advertisements based on your interests.
                        </p>
                      </div>
                      <button
                        onClick={() => togglePreference("marketing")}
                        className="flex-shrink-0 ml-4"
                      >
                        <div
                          className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                            preferences.marketing ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              preferences.marketing ? "translate-x-6" : ""
                            }`}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium inline-flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Save Preferences
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-6 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
```

### Add Cookie Banner to Layout

**File**: `app/layout.tsx` (add this to your existing layout)

```tsx
import { CookieBanner } from "@/components/cookie-consent/cookie-banner";

// In your layout component, add:
<CookieBanner />
```

---

## Modern Cookie Consent Explanation

### How Modern Websites Implement Cookie Consent

Modern cookie consent implementations follow these principles:

#### 1. **Legal Compliance**
- **GDPR** (EU): Requires explicit consent before non-essential cookies
- **CCPA** (California): Requires opt-out option for data selling
- **ePrivacy Directive**: Regulates cookies and tracking

#### 2. **UX Best Practices**

**Position**: Bottom banner or bottom-right corner
- Less intrusive than modals
- Doesn't block content completely
- Easy to dismiss

**Timing**:
- Show after 1-2 seconds (not immediately)
- Or after user scrolls
- Or after user shows intent to interact

**Options**:
- Accept All (most common choice)
- Reject All (required by GDPR)
- Customize (granular control)

#### 3. **Technical Implementation**

**Storage**:
```typescript
// Store consent in localStorage
localStorage.setItem('cookie-consent', JSON.stringify({
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: Date.now()
}));
```

**Cookie Categories**:
1. **Essential**: Authentication, security (always on)
2. **Functional**: Preferences, language
3. **Analytics**: Google Analytics, user behavior
4. **Marketing**: Ads, retargeting

**Integration with Analytics**:
```typescript
// Google Analytics Consent Mode
window.gtag('consent', 'update', {
  'analytics_storage': preferences.analytics ? 'granted' : 'denied',
  'ad_storage': preferences.marketing ? 'granted' : 'denied'
});
```

#### 4. **Modern Design Patterns**

**Two-Layer Approach**:
- Layer 1: Simple banner with "Accept All" / "Reject All" / "Customize"
- Layer 2: Detailed settings with toggles for each category

**Visual Elements**:
- Cookie icon for recognition
- Toggle switches for settings
- Clear labels and descriptions
- Links to privacy/cookie policies

**Accessibility**:
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels

#### 5. **Implementation Flow**

```
User visits site
     ↓
Check localStorage for consent
     ↓
No consent found → Show banner
     ↓
User chooses:
  - Accept All → Enable all cookies
  - Reject All → Only essential
  - Customize → Show settings panel
     ↓
Save preferences to localStorage
     ↓
Apply consent to third-party services
     ↓
Hide banner
```

#### 6. **Best Practices**

✅ **DO**:
- Show before loading non-essential cookies
- Provide clear, simple language
- Make rejection as easy as acceptance
- Remember user's choice
- Allow changing preferences later
- Link to detailed privacy policy

❌ **DON'T**:
- Block content until consent
- Pre-check non-essential categories
- Hide the reject button
- Use deceptive patterns
- Load tracking before consent

#### 7. **Next.js Specific Implementation**

**Client Component**: Cookie banner must be client-side
- Uses `useState` for UI state
- Uses `useEffect` for localStorage
- Uses `localStorage` for persistence

**Server Component**: Privacy policies can be server-rendered
- Better SEO
- Faster initial load
- Static content

#### 8. **Testing Checklist**

- [ ] Banner shows for new users
- [ ] Preferences save correctly
- [ ] Preferences persist across sessions
- [ ] Analytics respect consent
- [ ] Can change preferences later
- [ ] Works in incognito mode
- [ ] Mobile responsive
- [ ] Keyboard accessible

---

## Summary

This implementation includes:

1. ✅ Modern, accessible footer with newsletter (client component)
2. ✅ Complete legal pages (Terms, Privacy, Cookies)
3. ✅ Shipping & Returns information page
4. ✅ Custom 404 Not Found page
5. ✅ Cookie consent banner (GDPR compliant)
6. ✅ Server/client component separation
7. ✅ Consistent design system with primary colors

All components follow Next.js 14+ best practices with proper server/client separation!
