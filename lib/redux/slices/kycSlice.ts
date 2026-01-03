import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface KYCPersonalInfo {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface KYCDocument {
  documentType: 'NATIONAL_ID' | 'PASSPORT' | 'DRIVERS_LICENSE' | 'SELFIE' | 'PROOF_OF_ADDRESS';
  url: string;
  idDocumentNumber?: string;
}

export interface KYCData {
  id?: string;
  accountId: string;
  status: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  personalInfo?: KYCPersonalInfo;
  documents: KYCDocument[];
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KYCState {
  data: KYCData | null;
  loading: boolean;
  error: string | null;
  uploadingDocument: string | null;
  personalInfoSubmitted: boolean;
}

const initialState: KYCState = {
  data: null,
  loading: false,
  error: null,
  uploadingDocument: null,
  personalInfoSubmitted: false,
};

// Slice
const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setKYCData: (state, action: PayloadAction<KYCData>) => {
      state.data = action.payload;
      state.personalInfoSubmitted = !!action.payload.personalInfo;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUploadingDocument: (state, action: PayloadAction<string | null>) => {
      state.uploadingDocument = action.payload;
    },
    setPersonalInfoSubmitted: (state, action: PayloadAction<boolean>) => {
      state.personalInfoSubmitted = action.payload;
    },
    addDocument: (state, action: PayloadAction<KYCDocument>) => {
      if (state.data) {
        const existingIndex = state.data.documents.findIndex(
          (doc) => doc.documentType === action.payload.documentType
        );
        if (existingIndex >= 0) {
          state.data.documents[existingIndex] = action.payload;
        } else {
          state.data.documents.push(action.payload);
        }
      }
    },
    removeDocument: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.documents = state.data.documents.filter(
          (doc) => doc.documentType !== action.payload
        );
      }
    },
    resetKYC: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.uploadingDocument = null;
      state.personalInfoSubmitted = false;
    },
  },
});

export const {
  setKYCData,
  setLoading,
  setError,
  setUploadingDocument,
  setPersonalInfoSubmitted,
  addDocument,
  removeDocument,
  resetKYC,
} = kycSlice.actions;

export default kycSlice.reducer;
