"use client";

import { useState } from "react";
import {
  User,
  MapPin,
  ShieldCheck,
  Package,
  Gavel,
  Plus,
  Edit,
  Trash2,
  Upload,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "addresses" | "kyc" | "bids" | "listings"
  >("profile");

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinedDate: "January 2024",
    verified: false,
  };

  // Mock addresses
  const [addresses, setAddresses] = useState([
    {
      id: "1",
      label: "Home",
      street: "123 Main St",
      city: "San Francisco",
      zipCode: "94102",
      country: "USA",
    },
    {
      id: "2",
      label: "Work",
      street: "456 Market St",
      city: "San Francisco",
      zipCode: "94103",
      country: "USA",
    },
  ]);

  // Mock KYC data
  const [kycStatus, setKycStatus] = useState<"NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED">(
    "NOT_SUBMITTED"
  );

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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Shipping Addresses</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Add Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="glass-card rounded-lg p-6 relative"
                  >
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button className="p-2 hover:bg-accent rounded-lg">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="pr-16">
                      <h3 className="font-semibold text-lg mb-2">
                        {address.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {address.street}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.zipCode}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KYC Tab */}
          {activeTab === "kyc" && (
            <div className="space-y-6">
              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Identity Verification</h2>
                <p className="text-muted-foreground mb-6">
                  Complete your identity verification to unlock higher bidding
                  limits and seller privileges.
                </p>

                {kycStatus === "NOT_SUBMITTED" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ID Document
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                          Upload ID Document
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Passport, Driver's License, or National ID
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Selfie (Optional)
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                          Upload Selfie
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Clear photo of your face
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setKycStatus("PENDING")}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
                    >
                      Submit for Verification
                    </button>
                  </div>
                )}

                {kycStatus === "PENDING" && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
                      <ShieldCheck className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Verification Pending
                    </h3>
                    <p className="text-muted-foreground">
                      Your documents are being reviewed. This usually takes 1-2
                      business days.
                    </p>
                  </div>
                )}

                {kycStatus === "APPROVED" && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                      <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-300" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Verification Complete
                    </h3>
                    <p className="text-muted-foreground">
                      Your account is fully verified and ready to go!
                    </p>
                  </div>
                )}

                {kycStatus === "REJECTED" && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
                      <ShieldCheck className="h-8 w-8 text-red-600 dark:text-red-300" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Verification Failed
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Unfortunately, we couldn't verify your documents. Please
                      try again with clearer images.
                    </p>
                    <button
                      onClick={() => setKycStatus("NOT_SUBMITTED")}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
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
