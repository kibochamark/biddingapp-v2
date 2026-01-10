"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader, Check } from "lucide-react";
import Image from "next/image";
import { uploadProductImages, deleteProductImage } from "../../actions/products";
import { toast } from "sonner";

interface ProductImageUploadProps {
  productId: string;
  existingImages?: string[];
  onComplete?: () => void;
  onImagesChange?: (images: string[]) => void;
}

export default function ProductImageUpload({
  productId,
  existingImages = [],
  onComplete,
  onImagesChange,
}: ProductImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file count
    if (images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Validate file types
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("files", file);
      });

      const result = await uploadProductImages(productId, formData);

      if (result.success && result.data?.images) {
        const newImages = [...images, ...result.data.images];
        setImages(newImages);
        onImagesChange?.(newImages);
        toast.success(`${validFiles.length} image(s) uploaded successfully`);
      } else {
        toast.error(result.error || "Failed to upload images");
      }
    } catch (error) {
      toast.error("An error occurred while uploading images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    setDeletingImage(imageUrl);
    try {
      const result = await deleteProductImage(productId, imageUrl);

      if (result.success) {
        const newImages = images.filter((img) => img !== imageUrl);
        setImages(newImages);
        onImagesChange?.(newImages);
        toast.success("Image deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete image");
      }
    } catch (error) {
      toast.error("An error occurred while deleting image");
    } finally {
      setDeletingImage(null);
    }
  };

  const handleComplete = () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    onComplete?.();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-all ${
          uploading
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-primary hover:bg-primary/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading || images.length >= 10}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <Loader className="w-12 h-12 text-primary animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">
              {uploading ? "Uploading..." : "Click to upload images"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF up to 10MB each (Max 10 images)
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {images.length} / 10 images uploaded
          </p>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
              >
                <Image
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteImage(imageUrl)}
                  disabled={deletingImage === imageUrl}
                  className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  title="Delete image"
                >
                  {deletingImage === imageUrl ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>
                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            The first image will be used as the primary product image
          </p>
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ImageIcon className="w-16 h-16 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload at least one image to continue
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= 10}
          className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all text-sm font-medium disabled:opacity-50"
        >
          Add More Images
        </button>
        {onComplete && (
          <button
            onClick={handleComplete}
            disabled={images.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-primary to-orange-600 text-white rounded-lg hover:from-primary/90 hover:to-orange-600/90 transition-all text-sm font-medium disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Complete & View Product
          </button>
        )}
      </div>
    </div>
  );
}
