"use client";

import { Address } from "@/lib/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAddress, updateAddress } from "@/lib/api/addresses";
import { toast } from "@/lib/toast";

interface AddressFormProps {
  initialData?: Address;
  onSuccess: (address: Address) => void;
  onCancel: () => void;
}

export default function AddressForm({
  initialData,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const addressFormikForm = useFormik({
    initialValues: {
      recipientName: initialData?.recipientName || "",
      phone: initialData?.phone || "",
      street: initialData?.street || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipCode: initialData?.zipCode || "",
      country: initialData?.country || "",
      label: initialData?.label || "",
      isPrimary: initialData?.isPrimary || false,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      recipientName: Yup.string().required("Recipient name is required"),
      label: Yup.string().required("Label is required"),
      phone: Yup.string()
        .matches(/^[\d\s\-\+\(\)]+$/, "Invalid phone number")
        .min(10, "Phone number must be at least 10 digits")
        .required("Phone number is required"),
      street: Yup.string().required("Street address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zipCode: Yup.string().required("Zip code is required"),
      country: Yup.string().required("Country is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        if (initialData?.id) {
          const updatedAddress = await updateAddress(initialData.id, values);
          toast.address.updated();
          onSuccess(updatedAddress);
        } else {
          const res = await createAddress(values);
          if (res.status === 201) {
            toast.address.added();
            onSuccess(res.address);
          } else {
            toast.address.failed("add");
          }
        }
      } catch (error: any) {
        console.error("Failed to save address:", error);
        toast.address.failed(initialData?.id ? "update" : "add");
      }
    },
  });

  const fieldError = (field: keyof typeof addressFormikForm.values) =>
    addressFormikForm.errors[field] && addressFormikForm.touched[field]
      ? (addressFormikForm.errors[field] as string)
      : null;

  return (
    <form onSubmit={addressFormikForm.handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Label */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Label
          </label>
          <select
            name="label"
            value={addressFormikForm.values.label}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="">Select a label</option>
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
          {fieldError("label") && (
            <p className="text-destructive text-xs mt-1.5">
              {fieldError("label")}
            </p>
          )}
        </div>

        {/* Recipient Name */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Recipient Name
          </label>
          <input
            type="text"
            name="recipientName"
            value={addressFormikForm.values.recipientName}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="John Doe"
          />
          {fieldError("recipientName") && (
            <p className="text-destructive text-xs mt-1.5">
              {fieldError("recipientName")}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={addressFormikForm.values.phone}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="+1 (555) 000-0000"
          />
          {fieldError("phone") && (
            <p className="text-destructive text-xs mt-1.5">
              {fieldError("phone")}
            </p>
          )}
        </div>
      </div>

      {/* Street */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">
          Street Address
        </label>
        <input
          type="text"
          name="street"
          value={addressFormikForm.values.street}
          onChange={addressFormikForm.handleChange}
          onBlur={addressFormikForm.handleBlur}
          className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          placeholder="123 Main St, Apt 4B"
        />
        {fieldError("street") && (
          <p className="text-destructive text-xs mt-1.5">
            {fieldError("street")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            City
          </label>
          <input
            type="text"
            name="city"
            value={addressFormikForm.values.city}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="San Francisco"
          />
          {fieldError("city") && (
            <p className="text-destructive text-xs mt-1.5">
              {fieldError("city")}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            State
          </label>
          <input
            type="text"
            name="state"
            value={addressFormikForm.values.state}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="CA"
          />
          {fieldError("state") && (
            <p className="text-destructive text-xs mt-1.5">
              {fieldError("state")}
            </p>
          )}
        </div>

        {/* ZIP Code */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            ZIP Code
          </label>
          <input
            type="text"
            name="zipCode"
            value={addressFormikForm.values.zipCode}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="94102"
          />
          {fieldError("zipCode") && (
            <p className="text-destructive text-xs mt-1.5">
              {fieldError("zipCode")}
            </p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">
          Country
        </label>
        <select
          name="country"
          value={addressFormikForm.values.country}
          onChange={addressFormikForm.handleChange}
          onBlur={addressFormikForm.handleBlur}
          className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <option value="">Select a country</option>
          <option value="USA">United States</option>
          <option value="Canada">Canada</option>
          <option value="Mexico">Mexico</option>
          <option value="UK">United Kingdom</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
        </select>
        {fieldError("country") && (
          <p className="text-destructive text-xs mt-1.5">
            {fieldError("country")}
          </p>
        )}
      </div>

      {/* Primary checkbox */}
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          id="isPrimary"
          name="isPrimary"
          checked={addressFormikForm.values.isPrimary}
          onChange={addressFormikForm.handleChange}
          className="w-4 h-4 rounded border-input"
        />
        <label htmlFor="isPrimary" className="text-sm font-medium">
          Set as default address
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={addressFormikForm.isSubmitting}
          className="h-11 px-6 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {addressFormikForm.isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Address"
            : "Add Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={addressFormikForm.isSubmitting}
          className="h-11 px-6 border border-input rounded-xl font-semibold text-sm hover:bg-accent disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
