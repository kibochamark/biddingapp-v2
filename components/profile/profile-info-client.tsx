"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader, User, Mail, Phone, Shield } from "lucide-react";
import { createProfile } from "@/lib/api/account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-10">
      {/* Profile Information */}
      <div>
        <div className="pb-5   mb-6">
          <h2 className="text-lg font-medium text-ink">
            Profile Information
          </h2>
          <p className="text-sm text-mute mt-1">
            Update your personal details and contact information
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="mb-2 block">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your full name"
                className="flex h-12 w-full min-w-0 rounded-full bg-soft-cloud pl-12 pr-5 text-base text-ink placeholder:text-mute transition-[background-color,box-shadow] outline-none focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-soft-cloud"
              />
            </div>
            {formik.errors.fullName && formik.touched.fullName && (
              <p className="text-sale text-xs mt-1.5">
                {formik.errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
              <input
                id="email"
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled
                className="flex h-12 w-full min-w-0 rounded-full bg-soft-cloud pl-12 pr-5 text-base text-mute outline-none cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-mute mt-1.5">
              Email is managed by your authentication provider
            </p>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="contact" className="mb-2 block">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
              <input
                id="contact"
                type="tel"
                name="contact"
                placeholder="+1 (555) 000-0000"
                value={formik.values.contact}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="flex h-12 w-full min-w-0 rounded-full bg-soft-cloud pl-12 pr-5 text-base text-ink placeholder:text-mute transition-[background-color,box-shadow] outline-none focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-soft-cloud"
              />
            </div>
            {formik.errors.contact && formik.touched.contact && (
              <p className="text-sale text-xs mt-1.5">
                {formik.errors.contact}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={formik.isSubmitting || !formik.isValid}>
              {formik.isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Account Status */}
      <div>
        <div className="pb-5   mb-6">
          <h2 className="text-lg font-medium text-ink">Account</h2>
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-soft-cloud">
              <Shield className="h-4 w-4 text-ink" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Account Type</p>
              <p className="text-xs text-mute">
                Your membership tier
              </p>
            </div>
          </div>
          <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-soft-cloud text-ink">
            Standard
          </span>
        </div>
      </div>
    </div>
  );
}
