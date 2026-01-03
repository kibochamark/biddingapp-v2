import { Metadata } from "next";
import Link from "next/link";
import { Cookie, CheckCircle, Settings, BarChart3, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy - BidMarket",
  description: "Learn about how BidMarket uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
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
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Cookie Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: January 3, 2026</p>
        </div>

        {/* Introduction */}
        <div className="bg-muted rounded-lg p-6 mb-8">
          <p className="text-muted-foreground">
            This Cookie Policy explains how BidMarket uses cookies and similar technologies
            to recognize you when you visit our platform. It explains what these technologies
            are and why we use them, as well as your rights to control our use of them.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files that are placed on your device when you visit a website.
              They are widely used to make websites work more efficiently, provide a better user
              experience, and provide information to website owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>

            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Essential Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      These cookies are strictly necessary for the operation of our platform.
                      They enable core functionality such as security, network management, and accessibility.
                    </p>
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-xs text-muted-foreground mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Authentication cookies (keep you logged in)</li>
                        <li>Security cookies (prevent fraud)</li>
                        <li>Load balancing cookies (distribute traffic)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                    Always Active
                  </span>
                  <span className="text-xs text-muted-foreground">Cannot be disabled</span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Analytics Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      These cookies help us understand how visitors interact with our platform
                      by collecting and reporting information anonymously.
                    </p>
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-xs text-muted-foreground mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Google Analytics (visitor statistics)</li>
                        <li>Page view tracking</li>
                        <li>User behavior patterns</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-muted text-foreground rounded text-xs font-medium">
                    Optional
                  </span>
                  <span className="text-xs text-muted-foreground">Can be disabled</span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Functional Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      These cookies enable enhanced functionality and personalization, such as
                      remembering your preferences and settings.
                    </p>
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-xs text-muted-foreground mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Language preferences</li>
                        <li>Theme settings (light/dark mode)</li>
                        <li>Previously viewed auctions</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-muted text-foreground rounded text-xs font-medium">
                    Optional
                  </span>
                  <span className="text-xs text-muted-foreground">Can be disabled</span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Marketing Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      These cookies are used to deliver advertisements more relevant to you and
                      your interests. They may also limit the number of times you see an ad.
                    </p>
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-xs text-muted-foreground mb-2"><strong>Examples:</strong></p>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Targeted advertising cookies</li>
                        <li>Social media integration</li>
                        <li>Retargeting campaigns</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-muted text-foreground rounded text-xs font-medium">
                    Optional
                  </span>
                  <span className="text-xs text-muted-foreground">Can be disabled</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Some cookies are placed by third-party services that appear on our pages. We use:
            </p>
            <div className="bg-card border border-border rounded-lg p-6">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <div>
                    <strong className="text-foreground">Google Analytics:</strong> To analyze platform usage and improve user experience
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <div>
                    <strong className="text-foreground">Stripe:</strong> For secure payment processing
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <div>
                    <strong className="text-foreground">PayPal:</strong> For alternative payment options
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <div>
                    <strong className="text-foreground">Social Media:</strong> For sharing and social features
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to decide whether to accept or reject cookies. You can manage
              your cookie preferences through:
            </p>

            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold text-foreground text-sm mb-2">1. Cookie Consent Banner</h3>
                <p className="text-sm text-muted-foreground">
                  When you first visit our platform, you&apos;ll see a cookie consent banner where
                  you can accept or customize your preferences.
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold text-foreground text-sm mb-2">2. Browser Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Most browsers allow you to refuse or accept cookies through their settings.
                  Visit your browser&apos;s help section for specific instructions.
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold text-foreground text-sm mb-2">3. Opt-Out Tools</h3>
                <p className="text-sm text-muted-foreground">
                  You can opt out of Google Analytics tracking by installing the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>.
                </p>
              </div>
            </div>

            <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>Please note:</strong> Disabling certain cookies may affect the functionality
                of our platform and limit your ability to use some features.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Cookie Lifespan</h2>
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-foreground font-medium">Session Cookies</span>
                  <span className="text-muted-foreground">Deleted when you close browser</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-foreground font-medium">Authentication Cookies</span>
                  <span className="text-muted-foreground">30 days</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-foreground font-medium">Preference Cookies</span>
                  <span className="text-muted-foreground">1 year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-medium">Analytics Cookies</span>
                  <span className="text-muted-foreground">2 years</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Cookie Policy from time to time to reflect changes in technology
              or legal requirements. We will notify you of any significant changes by posting the
              new policy on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-foreground mb-2">
                If you have questions about our use of cookies:
              </p>
              <p className="text-sm text-foreground"><strong>Email:</strong> privacy@bidmarket.com</p>
              <p className="text-sm text-foreground"><strong>Phone:</strong> +1 (234) 567-890</p>
            </div>
          </section>

          <section>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-sm text-muted-foreground">
                For more information about how we handle your personal data, please see our{" "}
                <Link href="/privacy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
