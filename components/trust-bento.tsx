"use client";

import { useRef, useState } from "react";
import {
  Shield,
  Truck,
  BadgeCheck,
  HeadphonesIcon,
  CreditCard,
  RefreshCcw,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Spotlight Card Component - Aceternity inspired
function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-white dark:bg-gray-900",
        className
      )}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,165,0,0.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

// Animated Border Card - Aceternity inspired
function AnimatedBorderCard({
  children,
  className,
  gradientColor = "from-primary via-orange-500 to-yellow-500",
}: {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
}) {
  return (
    <div className={cn("relative group", className)}>
      {/* Animated gradient border */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-2xl bg-linear-to-r opacity-0 group-hover:opacity-100 blur transition-all duration-500",
          gradientColor
        )}
      />
      <div className="relative rounded-2xl bg-white dark:bg-gray-900 h-full">
        {children}
      </div>
    </div>
  );
}

// Feature Card with 3D hover effect
function FeatureCard3D({
  icon: Icon,
  title,
  description,
  gradient,
  iconBg,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
}) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000"
      style={{ perspective: "1000px" }}
    >
      <div
        className={cn(
          "rounded-2xl p-5 transition-all duration-200 ease-out cursor-pointer",
          "bg-linear-to-br border border-white/20",
          gradient
        )}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className={cn("p-2.5 rounded-xl w-fit mb-4", iconBg)}
          style={{ transform: "translateZ(20px)" }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3
          className="font-semibold text-white mb-1"
          style={{ transform: "translateZ(30px)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm text-white/70"
          style={{ transform: "translateZ(25px)" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

// Glowing stat number
function GlowingStat({
  value,
  label,
  delay = 0,
}: {
  value: string;
  label: string;
  delay?: number;
}) {
  return (
    <div className="text-center group" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative inline-block">
        {/* Glow effect */}
        <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <p className="relative text-3xl sm:text-4xl font-bold bg-linear-to-r from-primary via-orange-500 to-yellow-500 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export default function TrustBento() {
  return (
    <div className="space-y-4">
      {/* Main Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Hero Card - Why Choose BidMarket */}
        <SpotlightCard className="col-span-2 row-span-2">
          <div className="relative p-6 sm:p-8 h-full flex flex-col overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full translate-y-24 -translate-x-24 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit mb-4">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  Trusted Platform
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Why Choose
                <span className="block bg-linear-to-r from-primary via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  BidMarket?
                </span>
              </h2>

              <p className="text-muted-foreground text-sm mb-6 flex-1">
                Join thousands of happy bidders who trust us for secure auctions,
                verified products, and amazing deals every day.
              </p>

              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-primary">50K+</p>
                  <p className="text-[10px] text-muted-foreground">Happy Users</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-primary">4.9/5</p>
                  <p className="text-[10px] text-muted-foreground">Rating</p>
                </div>
              </div>

              <Link
                href="/catalog"
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-primary to-orange-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                Start Bidding
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </SpotlightCard>

        {/* Feature Cards with 3D Effect */}
        <FeatureCard3D
          icon={BadgeCheck}
          title="Verified Items"
          description="Every product inspected"
          gradient="from-green-500 to-emerald-600"
          iconBg="bg-white/20"
        />

        <FeatureCard3D
          icon={CreditCard}
          title="Secure Pay"
          description="Protected by Stripe"
          gradient="from-blue-500 to-indigo-600"
          iconBg="bg-white/20"
        />

        {/* Shipping Card - Wider */}
        <AnimatedBorderCard className="col-span-2">
          <div className="p-5 h-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-linear-to-br from-primary/10 to-orange-100 dark:from-primary/20 dark:to-orange-900/30">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Fast & Free Shipping</h3>
                <p className="text-xs text-muted-foreground">
                  Quick delivery to your doorstep. Free shipping on orders over $50.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Zap className="h-3 w-3 text-primary" />
                    2-3 day delivery
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Award className="h-3 w-3 text-primary" />
                    Insured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedBorderCard>

        {/* More Feature Cards */}
        <FeatureCard3D
          icon={HeadphonesIcon}
          title="24/7 Support"
          description="Always here to help"
          gradient="from-purple-500 to-violet-600"
          iconBg="bg-white/20"
        />

        <FeatureCard3D
          icon={RefreshCcw}
          title="Easy Returns"
          description="30-day guarantee"
          gradient="from-amber-500 to-orange-600"
          iconBg="bg-white/20"
        />
      </div>

      {/* Stats Bar with Glow Effects */}
      <SpotlightCard className="overflow-hidden">
        <div className="relative p-6 sm:p-8">
          {/* Background beam effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 left-1/4 w-1/2 h-full bg-linear-to-b from-primary/10 via-transparent to-transparent rotate-12 blur-3xl" />
            <div className="absolute -bottom-1/2 right-1/4 w-1/2 h-full bg-linear-to-t from-orange-500/10 via-transparent to-transparent -rotate-12 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Trusted by Thousands</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              <GlowingStat value="50K+" label="Happy Customers" delay={0} />
              <GlowingStat value="100K+" label="Auctions Completed" delay={100} />
              <GlowingStat value="99.9%" label="Uptime" delay={200} />
              <GlowingStat value="$2M+" label="Prizes Awarded" delay={300} />
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* CTA Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,165,0,0.1),transparent)] animate-shimmer" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Ready to Win Amazing Deals?
            </h3>
            <p className="text-white/60 text-sm">
              Start bidding today and save up to 90% on premium products
            </p>
          </div>
          <Link
            href="/catalog"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Auctions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Skeleton for loading state
export function TrustBentoSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="col-span-2 row-span-2 rounded-2xl bg-muted h-[320px]" />
        <div className="col-span-1 rounded-2xl bg-muted h-[140px]" />
        <div className="col-span-1 rounded-2xl bg-muted h-[140px]" />
        <div className="col-span-2 rounded-2xl bg-muted h-[100px]" />
        <div className="col-span-1 rounded-2xl bg-muted h-[140px]" />
        <div className="col-span-1 rounded-2xl bg-muted h-[140px]" />
      </div>
      <div className="rounded-2xl bg-muted h-[140px]" />
      <div className="rounded-2xl bg-muted h-[100px]" />
    </div>
  );
}
