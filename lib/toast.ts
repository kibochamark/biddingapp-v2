import { toast as sonnerToast } from "sonner";

/**
 * Reusable toast utility for consistent messaging across the application
 * Uses Sonner toast library with predefined styles and behaviors
 */

export const toast = {
  /**
   * Success toast - for successful operations
   * @param message - The message to display
   */
  success: (message: string) => {
    sonnerToast.success(message, {
      duration: 4000,
      position: "top-right",
      className: "bg-green-200 text-white"
    });
  },

  /**
   * Error toast - for failed operations
   * @param message - The error message to display
   */
  error: (message: string) => {
    sonnerToast.error(message, {
      duration: 5000,
      position: "top-right",
    });
  },

  /**
   * Info toast - for informational messages
   * @param message - The info message to display
   */
  info: (message: string) => {
    sonnerToast.info(message, {
      duration: 4000,
      position: "top-right",
    });
  },

  /**
   * Warning toast - for warning messages
   * @param message - The warning message to display
   */
  warning: (message: string) => {
    sonnerToast.warning(message, {
      duration: 4500,
      position: "top-right",
    });
  },

  /**
   * Default toast - for general messages
   * @param message - The message to display
   */
  message: (message: string) => {
    sonnerToast(message, {
      duration: 3500,
      position: "top-right",
    });
  },

  /**
   * Promise toast - for async operations with loading states
   * @param promise - The promise to track
   * @param messages - Loading, success, and error messages
   */
  promise: <T,>(
    promise: Promise<T> | (() => Promise<T>),
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      position: "top-right",
    });
  },

  /**
   * Bid-specific toast messages
   */
  bid: {
    placed: (entryNumber: number) => {
      sonnerToast.success(`Bid placed successfully! Entry #${entryNumber}`, {
        duration: 5000,
        position: "top-right",
        className: "bg-green-200 text-white",
        description: "Good luck! Winner will be selected soon.",
      });
    },
    failed: (reason?: string) => {
      sonnerToast.error("Failed to place bid", {
        duration: 5000,
        position: "top-right",
        className: "text-white",
        description: reason || "Please try again or contact support.",
      });
    },
    won: (productName: string) => {
      sonnerToast.success(`Congratulations! You won ${productName}!`, {
        duration: 8000,
        position: "top-right",
        description: "Check your profile to claim your prize.",
      });
    },
    loginRequired: () => {
      sonnerToast.warning("Sign in required", {
        duration: 4000,
        position: "top-right",
        description: "Please sign in to place a bid.",
      });
    },
  },

  /**
   * Profile-specific toast messages
   */
  profile: {
    updated: () => {
      sonnerToast.success("Profile updated successfully", {
        duration: 4000,
        position: "top-right",
      });
    },
    updateFailed: (reason?: string) => {
      sonnerToast.error("Failed to update profile", {
        duration: 5000,
        position: "top-right",
        description: reason || "Please try again.",
      });
    },
  },

  /**
   * Address-specific toast messages
   */
  address: {
    added: () => {
      sonnerToast.success("Address added successfully", {
        duration: 4000,
        position: "top-right",
        className:"bg-green-200 text-white"
      });
    },
    updated: () => {
      sonnerToast.success("Address updated successfully", {
        duration: 4000,
        position: "top-right",
      });
    },
    deleted: () => {
      sonnerToast.success("Address deleted successfully", {
        duration: 4000,
        position: "top-right",
      });
    },
    primarySet: () => {
      sonnerToast.success("Primary address updated", {
        duration: 4000,
        position: "top-right",
      });
    },
    failed: (action: "add" | "update" | "delete" | "set primary") => {
      sonnerToast.error(`Failed to ${action} address`, {
        duration: 5000,
        position: "top-right",
        description: "Please try again.",
      });
    },
  },

  /**
   * KYC-specific toast messages
   */
  kyc: {
    submitted: () => {
      sonnerToast.success("KYC verification submitted", {
        duration: 5000,
        position: "top-right",
        description: "We'll review your documents within 24-48 hours.",
      });
    },
    approved: () => {
      sonnerToast.success("KYC verification approved!", {
        duration: 6000,
        position: "top-right",
        description: "Your account is now fully verified.",
      });
    },
    rejected: (reason?: string) => {
      sonnerToast.error("KYC verification rejected", {
        duration: 6000,
        position: "top-right",
        description: reason || "Please resubmit with correct documents.",
      });
    },
  },

  /**
   * Auth-specific toast messages
   */
  auth: {
    loginSuccess: () => {
      sonnerToast.success("Welcome back!", {
        duration: 3000,
        position: "top-right",
      });
    },
    logoutSuccess: () => {
      sonnerToast.success("Logged out successfully", {
        duration: 3000,
        position: "top-right",
      });
    },
    sessionExpired: () => {
      sonnerToast.warning("Session expired", {
        duration: 5000,
        position: "top-right",
        description: "Please sign in again to continue.",
      });
    },
  },
};
