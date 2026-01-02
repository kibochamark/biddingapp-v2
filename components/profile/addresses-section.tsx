"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
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
  userId: string;
}

export default function AddressesSection({
  initialAddresses,
  userId,
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
      router.refresh(); // Refresh server data
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
      const updatedAddress = await setPrimaryAddress(addressId);
      toast.address.primarySet();
      router.refresh(); // Refresh server data
    } catch (error: any) {
      console.error("Failed to set primary address:", error);
      toast.address.failed("set primary");
    } finally {
      setLoading(null);
    }
  };

  const handleFormSuccess = (address: Address) => {
    setShowForm(false);
    setEditingAddress(null);
    router.refresh(); // Refresh server data to show new/updated address
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

      {initialAddresses.length === 0 ? (
        <div className="glass-card rounded-lg p-8 text-center">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            You haven't added any addresses yet
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[600px] w-full rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {initialAddresses.map((address) => (
              <div
                key={address.id}
                className={`glass-card rounded-lg p-6 relative ${
                  address.isPrimary  ? "ring-2 ring-primary" : ""
                }`}
              >
                {address.isPrimary && (
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
                    onClick={() => handleDeleteClick(address.id)}
                    className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                    disabled={loading === address.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className={address.isPrimary ? "pr-16 pl-0 mt-6" : "pr-16"}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">
                      {address.recipientName}
                    </h3>
                    {address.label && (
                      <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
                        {address.label}
                      </span>
                    )}
                  </div>
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
                  {!address.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(address.id)}
                      className="mt-3 text-sm text-primary hover:underline"
                      disabled={loading === address.id}
                    >
                      {loading === address.id
                        ? "Setting as primary..."
                        : "Set as primary"}
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
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 border border-input rounded-lg font-medium hover:bg-accent"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
