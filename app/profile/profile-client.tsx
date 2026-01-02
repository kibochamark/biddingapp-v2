"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  User,
  MapPin,
  ShieldCheck,
  Package,
  Gavel,
  Plus,
  Loader,
} from "lucide-react";
import { Address, KYCVerification, Bid } from "@/lib/types";
import AddressesSection from "@/components/profile/addresses-section";
import KYCSection from "@/components/profile/kyc-section";
import MyBidsSection from "@/components/profile/my-bids-section";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createProfile } from "@/lib/api/account";
import { toast } from "@/lib/toast";

interface ProfileClientProps {
  addresses: Address[];
  kycStatus: KYCVerification | null;
  userId: string;
  userBids: Bid[];
  userProfile: {
    fullName: string;
    contact: string;
    email: string;
  };
  user: {
    name: string;
    email: string;
    picture: string | null;
  };
}

type TabType = "profile" | "addresses" | "kyc" | "bids" | "listings";

export default function ProfileClient({
  addresses,
  kycStatus,
  userId,
  userBids,
  userProfile,
  user,
}: ProfileClientProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabType | null;

  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Set initial tab from URL parameter
  useEffect(() => {
    if (tabParam && ["profile", "addresses", "kyc", "bids", "listings"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

 

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "kyc", label: "Verification", icon: ShieldCheck },
    { id: "bids", label: "My Bids", icon: Gavel },
    { id: "listings", label: "My Listings", icon: Package },
  ];

  const profileFormikForm =useFormik({
    initialValues:{
      fullName: userProfile.fullName,
      contact: userProfile.contact,
      email: userProfile.email
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      contact: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .required('Contact number is required'),
    }),
    validateOnBlur:true,
    validateOnChange:true,
    onSubmit: async(values) => {
      console.log("Profile form submitted with values:", values);

      try {
        await createProfile(values);
        toast.profile.updated();
      } catch (error: any) {
        console.error("Error updating profile:", error);
        toast.profile.updateFailed(error.message);
        throw error;
      }
    }
  })


 


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
                <form className="space-y-4" onSubmit={profileFormikForm.handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    {profileFormikForm.errors.fullName && profileFormikForm.touched.fullName && (
                      <div className="text-red-500 text-sm mb-1">{profileFormikForm.errors.fullName}</div>
                    )}
                    <input
                      type="text"
                      defaultValue={profileFormikForm.values.fullName}
                      onChange={profileFormikForm.handleChange}
                      name="fullName"
                      onBlur={profileFormikForm.handleBlur}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    {profileFormikForm.errors.email && profileFormikForm.touched.email && (
                      <div className="text-red-500 text-sm mb-1">{profileFormikForm.errors.email}</div>
                    )}
                    <input
                      type="email"
                      defaultValue={profileFormikForm.values.email}
                      onChange={profileFormikForm.handleChange}
                      name="email"
                      onBlur={profileFormikForm.handleBlur}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    {profileFormikForm.errors.contact && profileFormikForm.touched.contact && (
                      <div className="text-red-500 text-sm mb-1">{profileFormikForm.errors.contact}</div>
                    )}
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      defaultValue={profileFormikForm.values.contact}
                      onChange={profileFormikForm.handleChange}
                      name="contact"
                      onBlur={profileFormikForm.handleBlur}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                    />
                  </div>
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 cursor-pointer" disabled={profileFormikForm.isSubmitting}>
                    {profileFormikForm.isSubmitting ? <><Loader className="text-white animate animate-spin"/></> : 'Save Changes'}
                  </button>
                </form>
              </div>

              <div className="glass-card rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Account Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    {/* <span className="font-medium">{userProfile.joinedDate}</span> */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Verification status
                    </span>
                    <span
                      className={`font-medium ${
                        // userProfile.verified ? "text-green-600" : "text-yellow-600"
                        "text-yellow-600"
                      }`}
                    >
                      {/* {userProfile.verified ? "Verified" : "Not Verified"} */}
                    Not Verified
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
            <MyBidsSection bids={userBids} />
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
