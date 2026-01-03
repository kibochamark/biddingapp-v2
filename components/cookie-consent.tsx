"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Settings } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch (e) {
        console.error("Failed to parse cookie consent:", e);
      }
    }
  }, []);

  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(prefs));
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    savePreferences(essentialOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Simple Banner */}
      {!showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="bg-card border border-border rounded-xl shadow-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic,
                    and personalize content. By clicking &quot;Accept All&quot;, you consent to our use
                    of cookies.{" "}
                    <Link
                      href="/cookies"
                      className="text-primary hover:underline"
                    >
                      Learn more
                    </Link>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={acceptAll}
                      className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={acceptEssential}
                      className="px-6 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                    >
                      Essential Only
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-6 py-2.5 bg-background text-foreground border border-border rounded-lg hover:bg-accent transition-colors text-sm font-medium inline-flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Customize
                    </button>
                  </div>
                </div>

                <button
                  onClick={acceptEssential}
                  className="flex-shrink-0 p-2 hover:bg-accent rounded-lg transition-colors"
                  aria-label="Close and accept essential cookies only"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Cookie Preferences
                </h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-muted-foreground">
                We use different types of cookies to optimize your experience on our platform.
                You can choose which categories you want to allow below.
              </p>

              {/* Essential Cookies */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Essential Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Required for the platform to function. Cannot be disabled.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                      Always Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Analytics Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Help us understand how visitors interact with our platform through
                      anonymous data collection.
                    </p>
                  </div>
                  <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({ ...preferences, analytics: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Functional Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enable enhanced functionality like remembering your preferences and
                      personalized features.
                    </p>
                  </div>
                  <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) =>
                          setPreferences({ ...preferences, functional: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      Marketing Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Used to deliver relevant advertisements and track campaign effectiveness.
                    </p>
                  </div>
                  <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) =>
                          setPreferences({ ...preferences, marketing: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  For more information, please read our{" "}
                  <Link href="/cookies" className="text-primary hover:underline">
                    Cookie Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={saveCustomPreferences}
                className="flex-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Save Preferences
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 px-6 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
