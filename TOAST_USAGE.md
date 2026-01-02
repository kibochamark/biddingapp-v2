# Toast Notification System

A reusable toast notification utility built on Sonner for consistent messaging across the application.

## Installation

The toast utility is already configured and ready to use. It's located at `lib/toast.ts`.

## Basic Usage

```typescript
import { toast } from "@/lib/toast";

// Success message
toast.success("Operation completed successfully!");

// Error message
toast.error("Something went wrong!");

// Info message
toast.info("This is an informational message");

// Warning message
toast.warning("Please be careful!");

// General message
toast.message("Hello there!");
```

## Promise-based Operations

For async operations with loading states:

```typescript
import { toast } from "@/lib/toast";

// With promise
const saveData = async () => {
  toast.promise(
    fetch("/api/save").then(res => res.json()),
    {
      loading: "Saving...",
      success: "Data saved successfully!",
      error: "Failed to save data",
    }
  );
};

// With dynamic success message
toast.promise(
  createUser({ name: "John" }),
  {
    loading: "Creating user...",
    success: (data) => `${data.name} created successfully!`,
    error: (err) => `Error: ${err.message}`,
  }
);
```

## Domain-Specific Toast Messages

### Bidding

```typescript
import { toast } from "@/lib/toast";

// Bid placed successfully
toast.bid.placed(15); // Entry #15

// Bid failed
toast.bid.failed("Insufficient funds");

// User won a bid
toast.bid.won("iPhone 15 Pro");

// Login required
toast.bid.loginRequired();
```

### Profile

```typescript
import { toast } from "@/lib/toast";

// Profile updated
toast.profile.updated();

// Profile update failed
toast.profile.updateFailed("Invalid email format");
```

### Address Management

```typescript
import { toast } from "@/lib/toast";

// Address added
toast.address.added();

// Address updated
toast.address.updated();

// Address deleted
toast.address.deleted();

// Address operation failed
toast.address.failed("add");
toast.address.failed("update");
toast.address.failed("delete");
```

### KYC Verification

```typescript
import { toast } from "@/lib/toast";

// KYC submitted
toast.kyc.submitted();

// KYC approved
toast.kyc.approved();

// KYC rejected
toast.kyc.rejected("Invalid ID document");
```

### Authentication

```typescript
import { toast } from "@/lib/toast";

// Login success
toast.auth.loginSuccess();

// Logout success
toast.auth.logoutSuccess();

// Session expired
toast.auth.sessionExpired();
```

## Real-World Examples

### Example 1: Bid Form Component

```typescript
"use client";

import { toast } from "@/lib/toast";

export default function BidForm() {
  const handlePlaceBid = async () => {
    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error("Failed to place bid");

      toast.bid.placed(totalBids + 1);
      router.refresh();
    } catch (error: any) {
      toast.bid.failed(error.message);
    }
  };

  return <button onClick={handlePlaceBid}>Place Bid</button>;
}
```

### Example 2: Profile Update

```typescript
"use client";

import { toast } from "@/lib/toast";
import { useFormik } from "formik";

export default function ProfileForm() {
  const formik = useFormik({
    onSubmit: async (values) => {
      try {
        await createProfile(values);
        toast.profile.updated();
      } catch (error: any) {
        toast.profile.updateFailed(error.message);
      }
    },
  });

  return <form onSubmit={formik.handleSubmit}>...</form>;
}
```

### Example 3: Async Operation with Promise Toast

```typescript
"use client";

import { toast } from "@/lib/toast";

export default function DataFetcher() {
  const fetchData = () => {
    toast.promise(
      fetch("/api/data").then(res => res.json()),
      {
        loading: "Loading data...",
        success: "Data loaded successfully!",
        error: "Failed to load data",
      }
    );
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## Configuration

All toasts are configured with:
- **Position**: `top-right`
- **Duration**: 3-5 seconds depending on message type
- **Description**: Optional secondary text for context

## Customization

To add new domain-specific toast messages, edit `lib/toast.ts`:

```typescript
export const toast = {
  // ... existing methods

  // Add your custom domain
  payment: {
    success: (amount: number) => {
      sonnerToast.success(`Payment of ${amount} processed`, {
        duration: 5000,
        position: "top-right",
        description: "Receipt sent to your email.",
      });
    },
    failed: (reason?: string) => {
      sonnerToast.error("Payment failed", {
        duration: 5000,
        position: "top-right",
        description: reason || "Please try again.",
      });
    },
  },
};
```

## Current Implementations

✅ Bid Form ([components/bid-form.tsx](components/bid-form.tsx))
✅ Profile Form ([app/profile/profile-client.tsx](app/profile/profile-client.tsx))

## Next Steps

- [ ] Implement in Address forms
- [ ] Implement in KYC forms
- [ ] Add to authentication flows
- [ ] Add to payment processing
