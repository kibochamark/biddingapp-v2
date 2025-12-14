"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { KYCVerification } from "@/lib/types";
import { submitKYC, uploadKYCDocument } from "@/lib/api/kyc";

interface KYCFormProps {
  userId: string;
  onSuccess: (verification: KYCVerification) => void;
  onCancel: () => void;
}

export default function KYCForm({ userId, onSuccess, onCancel }: KYCFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    idType: "passport" as "passport" | "drivers_license" | "national_id",
    idNumber: "",
    idExpiryDate: "",
    idFrontImage: "",
    idBackImage: "",
    selfieImage: "",
    addressProofImage: "",
  });

  const handleFileUpload = async (
    file: File,
    documentType: string,
    fieldName: keyof typeof formData
  ) => {
    setUploadingDoc(documentType);
    try {
      const url = await uploadKYCDocument(file, documentType);
      setFormData({ ...formData, [fieldName]: url });
    } catch (error) {
      alert("Failed to upload document. Please try again.");
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.idFrontImage || !formData.selfieImage || !formData.addressProofImage) {
      alert("Please upload all required documents");
      return;
    }

    setLoading(true);
    try {
      const verification = await submitKYC({
        userId,
        ...formData,
      });
      onSuccess(verification);
    } catch (error) {
      alert("Failed to submit verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name (as on ID) *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
              placeholder="John Michael Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Nationality *
          </label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="United States"
          />
        </div>
      </div>

      {/* ID Document */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">ID Document</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              ID Type *
            </label>
            <select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            >
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver's License</option>
              <option value="national_id">National ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              ID Number *
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-lg bg-background"
              placeholder="123456789"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            ID Expiry Date *
          </label>
          <input
            type="date"
            name="idExpiryDate"
            value={formData.idExpiryDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
          />
        </div>
      </div>

      {/* Document Uploads */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Document Uploads</h3>

        {/* ID Front */}
        <div>
          <label className="block text-sm font-medium mb-2">
            ID Front Image *
          </label>
          <div className="relative">
            {formData.idFrontImage ? (
              <div className="border border-input rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm text-green-600">✓ Document uploaded</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, idFrontImage: "" })}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, "id_front", "idFrontImage");
                  }}
                  className="hidden"
                  disabled={uploadingDoc === "id_front"}
                />
                <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  {uploadingDoc === "id_front" ? "Uploading..." : "Upload ID Front"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Clear photo of the front of your ID
                </p>
              </label>
            )}
          </div>
        </div>

        {/* ID Back (optional for passport) */}
        {formData.idType !== "passport" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              ID Back Image {formData.idType !== "passport" && "*"}
            </label>
            <div className="relative">
              {formData.idBackImage ? (
                <div className="border border-input rounded-lg p-4 flex items-center justify-between">
                  <span className="text-sm text-green-600">✓ Document uploaded</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, idBackImage: "" })}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "id_back", "idBackImage");
                    }}
                    className="hidden"
                    disabled={uploadingDoc === "id_back"}
                  />
                  <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    {uploadingDoc === "id_back" ? "Uploading..." : "Upload ID Back"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Clear photo of the back of your ID
                  </p>
                </label>
              )}
            </div>
          </div>
        )}

        {/* Selfie */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Selfie *
          </label>
          <div className="relative">
            {formData.selfieImage ? (
              <div className="border border-input rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm text-green-600">✓ Document uploaded</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, selfieImage: "" })}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, "selfie", "selfieImage");
                  }}
                  className="hidden"
                  disabled={uploadingDoc === "selfie"}
                />
                <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  {uploadingDoc === "selfie" ? "Uploading..." : "Upload Selfie"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Clear photo of your face
                </p>
              </label>
            )}
          </div>
        </div>

        {/* Address Proof */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Proof of Address *
          </label>
          <div className="relative">
            {formData.addressProofImage ? (
              <div className="border border-input rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm text-green-600">✓ Document uploaded</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, addressProofImage: "" })}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer block">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, "address_proof", "addressProofImage");
                  }}
                  className="hidden"
                  disabled={uploadingDoc === "address_proof"}
                />
                <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  {uploadingDoc === "address_proof" ? "Uploading..." : "Upload Address Proof"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Utility bill, bank statement, or lease agreement
                </p>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || !!uploadingDoc}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit for Verification"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading || !!uploadingDoc}
          className="px-6 py-2 border border-input rounded-lg font-semibold hover:bg-accent disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
