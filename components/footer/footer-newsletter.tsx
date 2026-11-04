"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");

      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || isSubscribed}
          className="pl-11"
        />
      </div>
      <Button type="submit" disabled={isLoading || isSubscribed} className="px-5">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden sm:inline">Subscribing...</span>
          </>
        ) : isSubscribed ? (
          <>
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Subscribed!</span>
          </>
        ) : (
          <span>Subscribe</span>
        )}
      </Button>
    </form>
  );
}
