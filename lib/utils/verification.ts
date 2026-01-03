import { KYCData } from '../redux/slices/kycSlice';

/**
 * Check if user is verified and can place bids
 */
export function isUserVerified(kycData: KYCData | null): boolean {
  return kycData?.status === 'APPROVED';
}

/**
 * Check if KYC is pending review
 */
export function isKYCPending(kycData: KYCData | null): boolean {
  return kycData?.status === 'PENDING';
}

/**
 * Check if user needs to submit KYC
 */
export function needsKYCSubmission(kycData: KYCData | null): boolean {
  return !kycData || kycData.status === 'NOT_SUBMITTED' || kycData.status === 'REJECTED';
}

/**
 * Get verification status message
 */
export function getVerificationMessage(kycData: KYCData | null): {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
} {
  if (!kycData || kycData.status === 'NOT_SUBMITTED') {
    return {
      type: 'warning',
      message: 'Please complete identity verification to place bids',
    };
  }

  switch (kycData.status) {
    case 'PENDING':
      return {
        type: 'info',
        message: 'Your verification is being reviewed. You cannot place bids yet.',
      };
    case 'APPROVED':
      return {
        type: 'success',
        message: 'Your account is verified and ready to bid!',
      };
    case 'REJECTED':
      return {
        type: 'error',
        message: 'Your verification was rejected. Please resubmit with correct information.',
      };
    default:
      return {
        type: 'warning',
        message: 'Verification status unknown',
      };
  }
}
