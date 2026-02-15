"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader, User, Mail, Phone, Shield } from "lucide-react";
import { createProfile } from "@/lib/api/account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfileInfoClientProps {
  initialData: {
    fullName: string;
    contact: string;
    email: string;
  };
}

const profileSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  contact: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Contact number is required"),
});

export default function ProfileInfoClient({
  initialData,
}: ProfileInfoClientProps) {
  const router = useRouter();

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: profileSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        await createProfile(values);
        toast.success("Profile updated successfully!");
        router.refresh();
      } catch (error: any) {
        console.error("Error updating profile:", error);
        toast.error(error.message || "Failed to update profile");
      }
    },
  });

  return (
    <div className="space-y-8">
      {/* Profile Information Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-xl font-bold tracking-tight">
            Profile Information
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Update your personal details and contact information
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your full name"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            {formik.errors.fullName && formik.touched.fullName && (
              <p className="text-destructive text-xs mt-1.5">
                {formik.errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-muted text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Email is managed by your authentication provider
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                name="contact"
                placeholder="+1 (555) 000-0000"
                value={formik.values.contact}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            {formik.errors.contact && formik.touched.contact && (
              <p className="text-destructive text-xs mt-1.5">
                {formik.errors.contact}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="h-11 px-6 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Status Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-xl font-bold tracking-tight">Account</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Account Type</p>
                <p className="text-xs text-muted-foreground">
                  Your membership tier
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-muted">
              Standard
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
