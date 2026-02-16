// Type definitions based on API documentation

export type ProductCondition = "NEW" | "MINT" | "EXCELLENT" | "GOOD" | "FAIR" | "LIKE_NEW" | "POOR";
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
  // Pricing / Bidding
  retailValue: number;   // Decimal(10,2) → number on frontend
  entryFee: number;      // Decimal(10,2)


  

  status?: ProductStatus;  // Product status in bidding system

  auctions:{
    id: string,
   
    prizeValue: string
    entryFee: string
    startDate: string
    endDate: string
    status: 'ACTIVE' | 'ENDED' | 'WINNER_DETERMINED'
    winnerId: string
    winningBidAmount: string,
    totalBidsCount: number,
    

  }[];


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
  label?: string; 
  accountId?: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
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

// User bid from /bids/my-bids API endpoint
export type AuctionStatus = "ACTIVE" | "ENDED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface UserBidAuction {
  id: string;
  title: string;
  status: AuctionStatus;
  endDate: string;
  prizeValue?: string;
}

export interface UserBid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  bidAmount: string;
  entryFeePaid: string;
  totalPaid: string;
  paymentIntentId: string;
  paymentStatus: PaymentStatus;
  isUnique: boolean;
  isWinning: boolean;
  placedAt: string;
  auction: UserBidAuction;
}
