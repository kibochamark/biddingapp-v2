"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, MapPin, Star } from "lucide-react";
import { Address } from "@/lib/types";
import { deleteAddress, setPrimaryAddress } from "@/lib/api/addresses";
import AddressForm from "./address-form";
import { toast } from "@/lib/toast";
import { ScrollArea } from "@/components/ui/scroll-area";
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
          <h2 className="text-xl font-bold tracking-tight">
            Shipping Addresses
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your delivery locations
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h3 className="text-lg font-bold tracking-tight">
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
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted mb-4">
            <MapPin className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold mb-1">No addresses yet</p>
          <p className="text-sm text-muted-foreground">
            Add a shipping address to get started
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[600px] w-full rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
            {initialAddresses.map((address) => (
              <div
                key={address.id}
                className={`rounded-2xl border bg-card overflow-hidden transition-all ${
                  address.isPrimary
                    ? "border-primary/40 ring-1 ring-primary/20"
                    : "border-border hover:border-primary/20"
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    {address.isPrimary && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        <Star className="h-3 w-3 fill-primary" />
                        Default
                      </span>
                    )}
                    {address.label && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {address.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      disabled={loading === address.id}
                    >
                      <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(address.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                      disabled={loading === address.id}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="font-semibold text-base mb-2">
                    {address.recipientName}
                  </h3>
                  <div className="space-y-0.5 text-sm text-muted-foreground">
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {address.phone}
                  </p>
                  {!address.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(address.id)}
                      className="mt-4 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
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
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 border border-input rounded-xl font-medium text-sm hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-xl font-medium text-sm hover:bg-destructive/90 transition-colors"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
