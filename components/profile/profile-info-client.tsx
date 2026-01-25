"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader } from "lucide-react";
import { createProfile } from "@/lib/api/account";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";

interface ProfileInfoClientProps {
  initialData: {
    fullName: string;
    contact: string;
    email: string;
  };
}

const profileSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  contact: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Contact number is required"),
});

export default function ProfileInfoClient({ initialData }: ProfileInfoClientProps) {
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
        router.refresh(); // Refresh server data
      } catch (error: any) {
        console.error("Error updating profile:", error);
        toast.error(error.message || "Failed to update profile");
      }
    },
  });



  return (
    <div className="space-y-6">
      <div className="glass-card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Profile Information</h2>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>
            {formik.errors.fullName && formik.touched.fullName && (
              <div className="text-red-500 text-sm mb-1">{formik.errors.fullName}</div>
            )}
            <input
              type="text"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            {formik.errors.email && formik.touched.email && (
              <div className="text-red-500 text-sm mb-1">{formik.errors.email}</div>
            )}
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            {formik.errors.contact && formik.touched.contact && (
              <div className="text-red-500 text-sm mb-1">{formik.errors.contact}</div>
            )}
            <input
              type="tel"
              name="contact"
              placeholder="+1 (555) 000-0000"
              value={formik.values.contact}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
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
        </form>
      </div>

      <div className="glass-card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Account Status</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Type</span>
            <span className="font-medium">Standard Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}
