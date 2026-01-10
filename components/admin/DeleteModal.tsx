"use client";

import { useState } from "react";
import { Trash2, Loader, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface DeleteModalProps {
  resourceName: string;
  resourceTitle: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function DeleteModal({
  resourceName,
  resourceTitle,
  onDelete,
  trigger,
  onSuccess,
}: DeleteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pathname = usePathname();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await onDelete();

      if (result.success) {
        toast.success(`${resourceName} deleted successfully`);
        setIsOpen(false);
        onSuccess?.();
        // The server action should handle revalidatePath
      } else {
        toast.error(result.error || `Failed to delete ${resourceName.toLowerCase()}`);
      }
    } catch (error) {
      toast.error(`An error occurred while deleting ${resourceName.toLowerCase()}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
          title={`Delete ${resourceName.toLowerCase()}`}
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border max-w-md w-full p-6">
            {/* Icon and Title */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">Delete {resourceName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground">
                Are you sure you want to delete{" "}
                <strong className="font-semibold">"{resourceTitle}"</strong>?
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This will permanently remove this {resourceName.toLowerCase()} and all associated data.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all text-sm font-medium disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete {resourceName}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
