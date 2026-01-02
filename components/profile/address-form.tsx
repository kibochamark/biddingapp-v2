"use client";

import { useState } from "react";
import { Address } from "@/lib/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAddress, updateAddress } from "@/lib/api/addresses";
import { toast } from "@/lib/toast";

interface AddressFormProps {
  userId: string;
  initialData?: Address;
  onSuccess: (address: Address) => void;
  onCancel: () => void;
}

export default function AddressForm({
  userId,
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
      isPrimary: initialData?.isPrimary || false
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      recipientName: Yup.string().required('Recipient name is required'),
      label: Yup.string().required('Label is required'),
      phone: Yup.string()
        .matches(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number')
        .min(10, 'Phone number must be at least 10 digits')
        .required('Phone number is required'),
      street: Yup.string().required('Street address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zipCode: Yup.string().required('Zip code is required'),
      country: Yup.string().required('Country is required'),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      console.log("Address form submitted with values:", values);

      try {
        if (initialData?.id) {
          // Update existing address
          const updatedAddress = await updateAddress(initialData.id, values);
          console.log("Address updated:", updatedAddress);
          toast.address.updated();
          onSuccess(updatedAddress);
        } else {
          // Create new address
          const res = await createAddress(values);
          console.log("Create address response:", res);

          if (res.status === 201) {
            toast.address.added();
            onSuccess(res.address);
          } else {
            console.error("Unexpected response status:", res.status);
            toast.address.failed("add");
          }
        }
      } catch (error: any) {
        console.error("Failed to save address:", error);
        console.error("Error details:", {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        toast.address.failed(initialData?.id ? "update" : "add");
      }

    }
  })

  return (
    <form onSubmit={addressFormikForm.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
        <div>

          <label className="block text-sm font-medium mb-2">
            Label
          </label>
          {addressFormikForm.errors.label && addressFormikForm.touched.label && (
            <div className="text-red-500 text-sm mb-1">{addressFormikForm.errors.label}</div>
          )}
          <select
            name="label"
            value={addressFormikForm.values.label}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
          >
            <option value="">Select a label</option>
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
        </div>


        <div>

          <label className="block text-sm font-medium mb-2">
            Recipient Name *
          </label>
          {addressFormikForm.errors.recipientName && addressFormikForm.touched.recipientName && (
            <div className="text-red-500 text-sm mb-1">{addressFormikForm.errors.recipientName}</div>
          )}
          <input
            type="text"
            name="recipientName"
            value={addressFormikForm.values.recipientName}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Number *
          </label>

          {addressFormikForm.errors.phone && addressFormikForm.touched.phone && (
            <div className="text-red-500 text-sm mb-1">{addressFormikForm.errors.phone}</div>
          )}

          <input
            type="tel"
            name="phone"
            value={addressFormikForm.values.phone}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Street Address *
        </label>
        {addressFormikForm.errors.street && addressFormikForm.touched.street && (
          <div className="text-red-500 text-sm mb-1">{addressFormikForm.errors.street}</div>
        )}
        <input
          type="text"
          name="street"
          value={addressFormikForm.values.street}
          onChange={addressFormikForm.handleChange}
          onBlur={addressFormikForm.handleBlur}
          className="w-full px-4 py-2 border border-input rounded-lg bg-background"
          placeholder="123 Main St, Apt 4B"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">City *</label>

          {addressFormikForm.errors.city && addressFormikForm.touched.city && (
            <div className="text-red-500 text-sm mb-1">{addressFormikForm.errors.city}</div>
          )}
          <input
            type="text"
            name="city"
            value={addressFormikForm.values.city}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="San Francisco"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">State *</label>

          {addressFormikForm.errors.state && addressFormikForm.touched.state && (
            <div className="text-red-500 text-sm mb-1">{addressFormikForm.errors.state}</div>
          )}
          <input
            type="text"
            name="state"
            value={addressFormikForm.values.state}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ZIP Code *</label>

          {addressFormikForm.errors.zipCode && addressFormikForm.touched.zipCode && (
            <div className="text-red-500 text-sm mb-1">{addressFormikForm.errors.zipCode}</div>
          )}
          <input
            type="text"
            name="zipCode"
            value={addressFormikForm.values.zipCode}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="94102"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Country *</label>

        {addressFormikForm.errors.country && addressFormikForm.touched.country && (
          <div className="text-red-500 text-sm mb-1">{addressFormikForm.errors.country}</div>
        )}

        <select
          name="country"
          value={addressFormikForm.values.country}
          onChange={addressFormikForm.handleChange}
          onBlur={addressFormikForm.handleBlur}
          className="w-full px-4 py-2 border border-input rounded-lg bg-background"
        >
          <option value="">Select a country</option>
          <option value="USA">United States</option>
          <option value="Canada">Canada</option>
          <option value="Mexico">Mexico</option>
          <option value="UK">United Kingdom</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPrimary"
          name="isPrimary"
          checked={addressFormikForm.values.isPrimary}
          onChange={addressFormikForm.handleChange}
          className="w-4 h-4"
        />
        <label htmlFor="isPrimary" className="text-sm font-medium">
          Set as primary address
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={addressFormikForm.isSubmitting}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
        >
          {addressFormikForm.isSubmitting ? "Saving..." : initialData ? "Update Address" : "Add Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={addressFormikForm.isSubmitting}
          className="px-6 py-2 border border-input rounded-lg font-semibold hover:bg-accent disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
