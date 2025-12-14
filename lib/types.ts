// Type definitions based on API documentation

export type ProductCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
export type KycStatus = "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  condition: ProductCondition;
  images: string[];
  startingPrice: number;
  reservePrice?: number;
  buyNowPrice?: number;
  currentBid?: number;
  bidsCount?: number;
  endDate: Date;
  startDate?: Date;
  sellerId: string;
  sellerName: string;
  sellerRating?: number;
  specifications: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  kindeId: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface KYC {
  id: string;
  accountId: string;
  status: KycStatus;
  idDocumentUrl: string;
  selfieUrl?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

// Extended KYC type for verification forms
export interface KYCVerification {
  id?: string;
  userId: string;
  status: KycStatus;
  fullName?: string;
  dateOfBirth?: string;
  nationality?: string;
  idType?: "passport" | "drivers_license" | "national_id";
  idNumber?: string;
  idExpiryDate?: string;
  idFrontImage?: string;
  idBackImage?: string;
  selfieImage?: string;
  addressProofImage?: string;
  rejectionReason?: string;
  submittedAt?: string;
  verifiedAt?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  bidAmount: number;
}
