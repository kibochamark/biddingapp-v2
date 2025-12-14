"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Address } from "@/lib/types";
import { deleteAddress, setDefaultAddress } from "@/lib/api/addresses";
import AddressForm from "./address-form";

interface AddressesSectionProps {
  initialAddresses: Address[];
  userId: string;
}

export default function AddressesSection({
  initialAddresses,
  userId,
}: AddressesSectionProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setLoading(addressId);
    try {
      await deleteAddress(addressId, userId);
      setAddresses(addresses.filter((a) => a.id !== addressId));
    } catch (error) {
      alert("Failed to delete address. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setLoading(addressId);
    try {
      await setDefaultAddress(addressId, userId);
      // Update local state
      setAddresses(
        addresses.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        }))
      );
    } catch (error) {
      alert("Failed to set default address. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleFormSuccess = (address: Address) => {
    if (editingAddress) {
      // Update existing
      setAddresses(addresses.map((a) => (a.id === address.id ? address : a)));
    } else {
      // Add new
      setAddresses([...addresses, address]);
    }
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Shipping Addresses</h2>
        <button
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h3>
          <AddressForm
            userId={userId}
            initialData={editingAddress || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="glass-card rounded-lg p-8 text-center">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            You haven't added any addresses yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`glass-card rounded-lg p-6 relative ${
                address.isDefault ? "ring-2 ring-primary" : ""
              }`}
            >
              {address.isDefault && (
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-semibold px-2 py-1 bg-primary text-primary-foreground rounded">
                    Default
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="p-2 hover:bg-accent rounded-lg"
                  disabled={loading === address.id}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                  disabled={loading === address.id}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className={address.isDefault ? "pr-16 pl-0" : "pr-16"}>
                <h3 className="font-semibold text-lg mb-2">
                  {address.recipientName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {address.street}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {address.country}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {address.phone}
                </p>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-3 text-sm text-primary hover:underline"
                    disabled={loading === address.id}
                  >
                    {loading === address.id
                      ? "Setting as default..."
                      : "Set as default"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
