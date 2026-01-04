"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Upload, X, Eye, Loader2, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setKYCData,
  setLoading,
  setError,
  setUploadingDocument,
  addDocument,
  removeDocument,
  setPersonalInfoSubmitted,
  KYCDocument,
} from "@/lib/redux/slices/kycSlice";
import { submitKYCPersonalInfo, uploadKYCDocument } from "@/app/actions/kyc";
import { toast } from "sonner";
import Image from "next/image";

interface KYCFormProps {
  accountId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Yup validation schema for personal info
const personalInfoSchema = Yup.object({
  fullName: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
  dateOfBirth: Yup.date()
    .max(new Date(Date.now() - 567648000000), "You must be at least 18 years old") // 18 years
    .required("Date of birth is required"),
  nationality: Yup.string()
    .min(2, "Nationality must be at least 2 characters")
    .required("Nationality is required"),
});

export default function KYCFormNew({ accountId, onSuccess, onCancel }: KYCFormProps) {
  const dispatch = useAppDispatch();
  const { data, loading, uploadingDocument, personalInfoSubmitted } = useAppSelector((state) => state.kyc);

  const [step, setStep] = useState<'personal' | 'documents'>('personal');
  const [previewImage, setPreviewImage] = useState<{ type: string; url: string } | null>(null);

  // Formik for personal information
  const formik = useFormik({
    initialValues: {
      fullName: "",
      dateOfBirth: "",
      nationality: "",
    },
    validationSchema: personalInfoSchema,
    onSubmit: async (values) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const result = await submitKYCPersonalInfo(values);

        if (result.success) {
          dispatch(setPersonalInfoSubmitted(true));
          dispatch(setKYCData({
            ...data!,
            accountId,
            personalInfo: values,
            status: 'NOT_SUBMITTED',
            documents: data?.documents || [],
          }));
          toast.success("Personal information saved successfully!");
          setStep('documents');
        } else {
          dispatch(setError(result.error || "Failed to submit personal information"));
          toast.error(result.error || "Failed to submit personal information");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "An error occurred";
        dispatch(setError(message));
        toast.error(message);
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  // Handle file upload
  const handleFileUpload = async (
    file: File,
    documentType: KYCDocument['documentType'],
    idDocumentNumber?: string
  ) => {
    if (!file) return;

    dispatch(setUploadingDocument(documentType));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      // Only add idDocumentNumber for ID documents
      if (
        (documentType === 'NATIONAL_ID' ||
         documentType === 'PASSPORT' ||
         documentType === 'DRIVERS_LICENSE') &&
        idDocumentNumber
      ) {
        formData.append('idDocumentNumber', idDocumentNumber);
      }

      const result = await uploadKYCDocument(formData);

      if (result.success && result.data) {
        const document: KYCDocument = {
          documentType,
          url: result.data.url,
          ...(idDocumentNumber && { idDocumentNumber }),
        };

        dispatch(addDocument(document));
        toast.success(`${documentType.replace('_', ' ')} uploaded successfully!`);
      } else {
        toast.error(result.error || "Failed to upload document");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload document";
      toast.error(message);
    } finally {
      dispatch(setUploadingDocument(null));
    }
  };

  // Handle document deletion
  const handleDeleteDocument = (documentType: string) => {
    dispatch(removeDocument(documentType));
    toast.success("Document removed");
  };

  // Get document by type
  const getDocument = (type: KYCDocument['documentType']) => {
    return data?.documents.find(doc => doc.documentType === type);
  };

  // Check if all required documents are uploaded
  const allDocumentsUploaded = () => {
    const requiredDocs: KYCDocument['documentType'][] = [
      'NATIONAL_ID',
      'SELFIE',
      'PROOF_OF_ADDRESS'
    ];

    return requiredDocs.every(type =>
      data?.documents.some(doc => doc.documentType === type)
    );
  };

  // Handle final submission
  const handleFinalSubmit = async () => {
    if (!allDocumentsUploaded()) {
      toast.error("Please upload all required documents");
      return;
    }

    toast.success("KYC submitted for review!");
    if (onSuccess) onSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step === 'personal' ? 'text-primary' : personalInfoSubmitted ? 'text-green-600' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'personal' ? 'border-primary bg-primary text-primary-foreground' : personalInfoSubmitted ? 'border-green-600 bg-green-600 text-white' : 'border-border'}`}>
            {personalInfoSubmitted ? <CheckCircle className="h-4 w-4" /> : '1'}
          </div>
          <span className="text-sm font-medium">Personal Info</span>
        </div>

        <div className="w-16 h-0.5 bg-border"></div>

        <div className={`flex items-center gap-2 ${step === 'documents' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'documents' ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
            2
          </div>
          <span className="text-sm font-medium">Documents</span>
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {step === 'personal' && (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name (as on ID) *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg bg-background ${
                    formik.touched.fullName && formik.errors.fullName
                      ? 'border-red-500'
                      : 'border-input'
                  }`}
                  placeholder="John Michael Doe"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg bg-background ${
                    formik.touched.dateOfBirth && formik.errors.dateOfBirth
                      ? 'border-red-500'
                      : 'border-input'
                  }`}
                />
                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nationality *
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formik.values.nationality}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg bg-background ${
                    formik.touched.nationality && formik.errors.nationality
                      ? 'border-red-500'
                      : 'border-input'
                  }`}
                  placeholder="e.g., Kenyan"
                />
                {formik.touched.nationality && formik.errors.nationality && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.nationality}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !formik.isValid}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Saving..." : "Continue to Documents"}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-6 py-2 border border-input rounded-lg font-semibold hover:bg-accent disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Step 2: Document Uploads */}
      {step === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upload Documents</h3>
            <button
              onClick={() => setStep('personal')}
              className="text-sm text-primary hover:underline"
            >
              ← Back to Personal Info
            </button>
          </div>

          {/* National ID/Passport */}
          <DocumentUpload
            title="National ID / Passport *"
            description="Upload a clear photo of your government-issued ID"
            documentType="NATIONAL_ID"
            document={getDocument('NATIONAL_ID')}
            onUpload={handleFileUpload}
            onDelete={handleDeleteDocument}
            onPreview={setPreviewImage}
            uploading={uploadingDocument === 'NATIONAL_ID'}
            requiresIdNumber
          />

          {/* Selfie */}
          <DocumentUpload
            title="Selfie *"
            description="Upload a clear photo of your face"
            documentType="SELFIE"
            document={getDocument('SELFIE')}
            onUpload={handleFileUpload}
            onDelete={handleDeleteDocument}
            onPreview={setPreviewImage}
            uploading={uploadingDocument === 'SELFIE'}
          />

          {/* Proof of Address */}
          <DocumentUpload
            title="Proof of Address *"
            description="Utility bill, bank statement, or lease agreement (within last 3 months)"
            documentType="PROOF_OF_ADDRESS"
            document={getDocument('PROOF_OF_ADDRESS')}
            onUpload={handleFileUpload}
            onDelete={handleDeleteDocument}
            onPreview={setPreviewImage}
            uploading={uploadingDocument === 'PROOF_OF_ADDRESS'}
          />

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleFinalSubmit}
              disabled={!allDocumentsUploaded() || loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              Submit for Verification
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <Image
              src={previewImage.url}
              alt={previewImage.type}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Document Upload Component
interface DocumentUploadProps {
  title: string;
  description: string;
  documentType: KYCDocument['documentType'];
  document?: KYCDocument;
  onUpload: (file: File, documentType: KYCDocument['documentType'], idNumber?: string) => void;
  onDelete: (documentType: string) => void;
  onPreview: (preview: { type: string; url: string }) => void;
  uploading: boolean;
  requiresIdNumber?: boolean;
}

function DocumentUpload({
  title,
  description,
  documentType,
  document,
  onUpload,
  onDelete,
  onPreview,
  uploading,
  requiresIdNumber,
}: DocumentUploadProps) {
  const [idNumber, setIdNumber] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (requiresIdNumber && !idNumber) {
        toast.error("Please enter ID document number first");
        return;
      }
      onUpload(file, documentType, idNumber);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {requiresIdNumber && !document && (
        <div className="mb-3">
          <label className="block text-sm font-medium mb-2">
            ID Document Number *
          </label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg bg-background"
            placeholder="Enter ID number"
          />
        </div>
      )}

      {document ? (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Document uploaded
            </span>
            {document.idDocumentNumber && (
              <span className="text-xs text-muted-foreground">
                (ID: {document.idDocumentNumber})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview({ type: documentType, url: document.url })}
              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4 text-green-700 dark:text-green-400" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(documentType)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-red-600" />
            </button>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer block bg-muted/30">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="h-12 w-12 mx-auto mb-3 text-primary animate-spin" />
          ) : (
            <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          )}
          <p className="text-sm font-medium mb-1">
            {uploading ? "Uploading..." : "Click to upload"}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG or PDF (max 10MB)
          </p>
        </label>
      )}
    </div>
  );
}
