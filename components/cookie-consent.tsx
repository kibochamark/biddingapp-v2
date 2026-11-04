"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <div className="bg-card border border-hairline p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 size-10 rounded-full bg-soft-cloud flex items-center justify-center">
                  <Cookie className="h-5 w-5 text-ink" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-ink mb-2">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm text-mute mb-4">
                    We use cookies to enhance your browsing experience, analyze site traffic,
                    and personalize content. By clicking &quot;Accept All&quot;, you consent to our use
                    of cookies.{" "}
                    <Link
                      href="/cookies"
                      className="text-ink underline underline-offset-4"
                    >
                      Learn more
                    </Link>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={acceptAll} size="sm">
                      Accept All
                    </Button>
                    <Button onClick={acceptEssential} variant="secondary" size="sm">
                      Essential Only
                    </Button>
                    <Button onClick={() => setShowSettings(true)} variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                      Customize
                    </Button>
                  </div>
                </div>

                <button
                  onClick={acceptEssential}
                  className="flex-shrink-0 p-2 hover:bg-soft-cloud rounded-full transition-colors"
                  aria-label="Close and accept essential cookies only"
                >
                  <X className="h-5 w-5 text-mute" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="bg-card border border-hairline max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card sticky-edge-b p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-soft-cloud flex items-center justify-center">
                  <Settings className="h-5 w-5 text-ink" />
                </div>
                <h2 className="text-xl font-semibold text-ink">
                  Cookie Preferences
                </h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-soft-cloud rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-mute" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-mute">
                We use different types of cookies to optimize your experience on our platform.
                You can choose which categories you want to allow below.
              </p>

              {/* Essential Cookies */}
              <div className="bg-soft-cloud p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink mb-1">
                      Essential Cookies
                    </h3>
                    <p className="text-sm text-mute">
                      Required for the platform to function. Cannot be disabled.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="px-3 py-1 rounded-full bg-background border border-hairline text-ink text-xs font-medium">
                      Always Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-hairline p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink mb-1">
                      Analytics Cookies
                    </h3>
                    <p className="text-sm text-mute mb-3">
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
                      <div className="w-11 h-6 bg-hairline-soft peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ink rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-background after:border-hairline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ink"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border border-hairline p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink mb-1">
                      Functional Cookies
                    </h3>
                    <p className="text-sm text-mute mb-3">
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
                      <div className="w-11 h-6 bg-hairline-soft peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ink rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-background after:border-hairline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ink"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-hairline p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink mb-1">
                      Marketing Cookies
                    </h3>
                    <p className="text-sm text-mute mb-3">
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
                      <div className="w-11 h-6 bg-hairline-soft peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ink rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-background after:border-hairline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ink"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-sm text-mute">
                <p>
                  For more information, please read our{" "}
                  <Link href="/cookies" className="text-ink underline underline-offset-4">
                    Cookie Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-ink underline underline-offset-4">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card sticky-edge-t p-6 flex flex-col sm:flex-row gap-3">
              <Button onClick={saveCustomPreferences} className="flex-1">
                Save Preferences
              </Button>
              <Button onClick={acceptAll} variant="secondary" className="flex-1">
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
