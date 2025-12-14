"use client";

import { useState } from "react";
import {
  User,
  MapPin,
  ShieldCheck,
  Package,
  Gavel,
  Plus,
} from "lucide-react";
import { Address, KYCVerification } from "@/lib/types";
import AddressesSection from "@/components/profile/addresses-section";
import KYCSection from "@/components/profile/kyc-section";

interface ProfileClientProps {
  addresses: Address[];
  kycStatus: KYCVerification | null;
  userId: string;
}

export default function ProfileClient({
  addresses,
  kycStatus,
  userId,
}: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "kyc" | "bids" | "listings"
  >("profile");

  // Mock user data (will be replaced with actual auth data)
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinedDate: "January 2024",
    verified: kycStatus?.status === "APPROVED",
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "kyc", label: "Verification", icon: ShieldCheck },
    { id: "bids", label: "My Bids", icon: Gavel },
    { id: "listings", label: "My Listings", icon: Package },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                    />
                  </div>
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90">
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Account Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">{user.joinedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Verification status
                    </span>
                    <span
                      className={`font-medium ${
                        user.verified ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {user.verified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <AddressesSection initialAddresses={addresses} userId={userId} />
          )}

          {/* KYC Tab */}
          {activeTab === "kyc" && (
            <KYCSection kycStatus={kycStatus} userId={userId} />
          )}

          {/* My Bids Tab */}
          {activeTab === "bids" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">My Active Bids</h2>
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Gavel className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  You don't have any active bids
                </p>
                <a
                  href="/catalog"
                  className="inline-block mt-4 text-primary hover:underline"
                >
                  Browse auctions
                </a>
              </div>
            </div>
          )}

          {/* My Listings Tab */}
          {activeTab === "listings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">My Listings</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Create Listing
                </button>
              </div>
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  You haven't created any listings yet
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
