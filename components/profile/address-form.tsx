"use client";

import { useState } from "react";
import { Address } from "@/lib/types";
import { apiFetchClient } from "@/lib/api";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

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
  const [loading, setLoading] = useState(false);
  const { getAccessTokenRaw } = useKindeBrowserClient();
  const [formData, setFormData] = useState({
    recipientName: initialData?.recipientName || "",
    street: initialData?.street || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    country: initialData?.country || "USA",
    phone: initialData?.phone || "",
    isDefault: initialData?.isDefault || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = getAccessTokenRaw();
      if (!accessToken) throw new Error("Not authenticated");

      let savedAddress: Address;

      if (initialData) {
        // Update existing address
        savedAddress = await apiFetchClient<Address>(
          `/addresses/${initialData.id}`,
          accessToken,
          {
            method: "PUT",
            body: JSON.stringify(formData),
          }
        );
      } else {
        // Create new address
        savedAddress = await apiFetchClient<Address>(`/addresses`, accessToken, {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            userId,
          }),
        });
      }

      onSuccess(savedAddress);
    } catch (error) {
      alert("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Recipient Name *
          </label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Street Address *
        </label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-input rounded-lg bg-background"
          placeholder="123 Main St, Apt 4B"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="San Francisco"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ZIP Code *</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="94102"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Country *</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-input rounded-lg bg-background"
        >
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
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="w-4 h-4"
        />
        <label htmlFor="isDefault" className="text-sm font-medium">
          Set as default address
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Address" : "Add Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 border border-input rounded-lg font-semibold hover:bg-accent disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
