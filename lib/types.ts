// Type definitions based on API documentation

export type ProductCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
export type KycStatus = "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
export type ProductStatus = "DRAFT" | "ACTIVE" | "CLOSED" | "WINNER_SELECTED" | "COMPLETED" | "CANCELLED";
export type BidStatus = "PENDING" | "CONFIRMED" | "FAILED" | "REFUNDED" | "WON" | "LOST";

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

  // Pricing (legacy fields for compatibility)
  startingPrice: number;
  reservePrice?: number;
  buyNowPrice?: number;
  currentBid?: number;

  // Bidding System Fields
  biddingFee?: number;  // Fixed fee per bid entry
  originalPrice?: number;  // Actual product value
  totalBids?: number;  // Count of confirmed bids
  totalRevenue?: number;  // Sum of all bidding fees
  status?: ProductStatus;  // Product status in bidding system
  winnerId?: string;  // Winner's account ID
  winnerBidId?: string;  // Winning bid ID

  // Dates
  endDate: Date;
  startDate?: Date;

  // Seller Info
  sellerId: string;
  sellerName: string;
  sellerRating?: number;

  // Additional
  specifications: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Backwards compatibility
  bidsCount?: number;  // Alias for totalBids
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

// Bidding System Types
export interface Bid {
  id: string;
  productId: string;
  bidderId: string;
  bidderName?: string;
  bidderEmail?: string;
  amount: number;  // Bidding fee paid
  status: BidStatus;
  paymentReference?: string;
  paymentConfirmedAt?: Date;
  isWinner: boolean;
  createdAt: Date;
  updatedAt: Date;
}
