"use client";

import { Address } from "@/lib/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAddress, updateAddress } from "@/lib/api/addresses";
import { toast } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          <Label htmlFor="label" className="mb-2">
            Label
          </Label>
          <Select
            value={addressFormikForm.values.label}
            onValueChange={(value) =>
              addressFormikForm.setFieldValue("label", value)
            }
          >
            <SelectTrigger id="label" className="w-full bg-soft-cloud">
              <SelectValue placeholder="Select a label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {fieldError("label") && (
            <p className="text-sale text-xs mt-1.5">
              {fieldError("label")}
            </p>
          )}
        </div>

        {/* Recipient Name */}
        <div>
          <Label htmlFor="recipientName" className="mb-2">
            Recipient Name
          </Label>
          <Input
            id="recipientName"
            type="text"
            name="recipientName"
            value={addressFormikForm.values.recipientName}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            placeholder="John Doe"
          />
          {fieldError("recipientName") && (
            <p className="text-sale text-xs mt-1.5">
              {fieldError("recipientName")}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="mb-2">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            name="phone"
            value={addressFormikForm.values.phone}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            placeholder="+1 (555) 000-0000"
          />
          {fieldError("phone") && (
            <p className="text-sale text-xs mt-1.5">
              {fieldError("phone")}
            </p>
          )}
        </div>
      </div>

      {/* Street */}
      <div>
        <Label htmlFor="street" className="mb-2">
          Street Address
        </Label>
        <Input
          id="street"
          type="text"
          name="street"
          value={addressFormikForm.values.street}
          onChange={addressFormikForm.handleChange}
          onBlur={addressFormikForm.handleBlur}
          placeholder="123 Main St, Apt 4B"
        />
        {fieldError("street") && (
          <p className="text-sale text-xs mt-1.5">
            {fieldError("street")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City */}
        <div>
          <Label htmlFor="city" className="mb-2">
            City
          </Label>
          <Input
            id="city"
            type="text"
            name="city"
            value={addressFormikForm.values.city}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            placeholder="San Francisco"
          />
          {fieldError("city") && (
            <p className="text-sale text-xs mt-1.5">
              {fieldError("city")}
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <Label htmlFor="state" className="mb-2">
            State
          </Label>
          <Input
            id="state"
            type="text"
            name="state"
            value={addressFormikForm.values.state}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            placeholder="CA"
          />
          {fieldError("state") && (
            <p className="text-sale text-xs mt-1.5">
              {fieldError("state")}
            </p>
          )}
        </div>

        {/* ZIP Code */}
        <div>
          <Label htmlFor="zipCode" className="mb-2">
            ZIP Code
          </Label>
          <Input
            id="zipCode"
            type="text"
            name="zipCode"
            value={addressFormikForm.values.zipCode}
            onChange={addressFormikForm.handleChange}
            onBlur={addressFormikForm.handleBlur}
            placeholder="94102"
          />
          {fieldError("zipCode") && (
            <p className="text-sale text-xs mt-1.5">
              {fieldError("zipCode")}
            </p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <Label htmlFor="country" className="mb-2">
          Country
        </Label>
        <Select
          value={addressFormikForm.values.country}
          onValueChange={(value) =>
            addressFormikForm.setFieldValue("country", value)
          }
        >
          <SelectTrigger id="country" className="w-full bg-soft-cloud">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USA">United States</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Mexico">Mexico</SelectItem>
            <SelectItem value="UK">United Kingdom</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="France">France</SelectItem>
          </SelectContent>
        </Select>
        {fieldError("country") && (
          <p className="text-sale text-xs mt-1.5">
            {fieldError("country")}
          </p>
        )}
      </div>

      {/* Primary checkbox */}
      <div className="flex items-center gap-2.5">
        <Checkbox
          id="isPrimary"
          name="isPrimary"
          checked={addressFormikForm.values.isPrimary}
          onChange={addressFormikForm.handleChange}
        />
        <Label htmlFor="isPrimary">
          Set as default address
        </Label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={addressFormikForm.isSubmitting}>
          {addressFormikForm.isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Address"
            : "Add Address"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={addressFormikForm.isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
