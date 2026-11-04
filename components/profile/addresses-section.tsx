"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, MapPin, Star } from "lucide-react";
import { Address } from "@/lib/types";
import { deleteAddress, setPrimaryAddress } from "@/lib/api/addresses";
import AddressForm from "./address-form";
import { toast } from "@/lib/toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddressesSectionProps {
  initialAddresses: Address[];
}

export default function AddressesSection({
  initialAddresses,
}: AddressesSectionProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleDeleteClick = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;

    setLoading(addressToDelete);
    setDeleteDialogOpen(false);

    try {
      await deleteAddress(addressToDelete);
      toast.address.deleted();
      router.refresh();
    } catch (error: any) {
      console.error("Failed to delete address:", error);
      toast.address.failed("delete");
    } finally {
      setLoading(null);
      setAddressToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const handleSetPrimary = async (addressId: string) => {
    setLoading(addressId);
    try {
      await setPrimaryAddress(addressId);
      toast.address.primarySet();
      router.refresh();
    } catch (error: any) {
      console.error("Failed to set primary address:", error);
      toast.address.failed("set primary");
    } finally {
      setLoading(null);
    }
  };

  const handleFormSuccess = (_address: Address) => {
    setShowForm(false);
    setEditingAddress(null);
    router.refresh();
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-medium text-ink uppercase">
            Shipping Addresses
          </h2>
          <p className="text-sm text-mute mt-1">
            Manage your delivery locations
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="border border-hairline overflow-hidden">
          <div className="px-6 py-5 border-b border-hairline">
            <h3 className="text-lg font-medium text-ink">
              {editingAddress ? "Edit Address" : "New Address"}
            </h3>
          </div>
          <div className="p-6">
            <AddressForm
              initialData={editingAddress || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingAddress(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Address Cards */}
      {initialAddresses.length === 0 ? (
        <div className="border border-dashed border-hairline p-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-soft-cloud mb-4">
            <MapPin className="h-6 w-6 text-mute" />
          </div>
          <p className="text-base font-medium mb-1 text-ink">No addresses yet</p>
          <p className="text-sm text-mute">
            Add a shipping address to get started
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[600px] w-full rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
            {initialAddresses.map((address) => (
              <div
                key={address.id}
                className={`border overflow-hidden transition-colors ${
                  address.isPrimary
                    ? "border-primary/40"
                    : "border-hairline hover:border-ink/20"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-hairline">
                  <div className="flex items-center gap-2">
                    {address.isPrimary && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                        <Star className="h-3 w-3 fill-primary" />
                        Default
                      </span>
                    )}
                    {address.label && (
                      <Badge variant="default">{address.label}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 rounded-full hover:bg-soft-cloud transition-colors"
                      disabled={loading === address.id}
                    >
                      <Edit className="h-3.5 w-3.5 text-mute" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(address.id)}
                      className="p-2 rounded-full hover:bg-sale/10 transition-colors"
                      disabled={loading === address.id}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-mute hover:text-sale" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-medium text-base mb-2 text-ink">
                    {address.recipientName}
                  </h3>
                  <div className="space-y-0.5 text-sm text-mute">
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                  <p className="text-sm text-mute mt-3">
                    {address.phone}
                  </p>
                  {!address.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(address.id)}
                      className="mt-4 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
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
        </ScrollArea>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
