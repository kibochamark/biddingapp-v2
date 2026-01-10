# Admin Portal - Kinde Permissions Setup

This document outlines all the permissions required for the BidMarket Admin Portal. Add these permissions to your Kinde dashboard to enable role-based access control.

## Required Permissions

### 1. Admin Access
**Permission Code:** `admin:access`
**Description:** Grants access to the admin portal
**Required For:** All admin users
**Used In:** `/app/admin/layout.tsx`

### 2. Product Management
**Permission Code:** `manage:products`
**Description:** Create, update, and delete products
**Required For:** Product managers, Super admins
**Used In:**
- `/app/admin/products/*`
- `/app/admin/actions/products.ts`

### 3. Category Management
**Permission Code:** `manage:categories`
**Description:** Create, update, and delete product categories
**Required For:** Product managers, Super admins
**Used In:**
- `/app/admin/categories/*`
- `/app/admin/actions/categories.ts` (to be created)

### 4. Account Management
**Permission Code:** `manage:accounts`
**Description:** View and manage user accounts
**Required For:** Account managers, Super admins
**Used In:**
- `/app/admin/accounts/*`
- `/app/admin/actions/accounts.ts`

### 5. Account Termination
**Permission Code:** `terminate:accounts`
**Description:** Suspend or permanently terminate user accounts
**Required For:** Senior moderators, Super admins
**Used In:**
- `/app/admin/accounts/*` (terminate/suspend functionality)
- `/app/admin/actions/accounts.ts`

### 6. Bid Management
**Permission Code:** `manage:bids`
**Description:** View and monitor all bidding activity
**Required For:** Bid moderators, Super admins
**Used In:**
- `/app/admin/bids/*`
- `/app/admin/actions/bids.ts` (to be created)

### 7. KYC Approval
**Permission Code:** `approve:kyc`
**Description:** Approve KYC verification submissions
**Required For:** KYC reviewers, Super admins
**Used In:**
- `/app/admin/kyc/*`
- `/app/admin/actions/kyc.ts`

### 8. KYC Rejection
**Permission Code:** `reject:kyc`
**Description:** Reject KYC verification submissions with reason
**Required For:** KYC reviewers, Super admins
**Used In:**
- `/app/admin/kyc/*`
- `/app/admin/actions/kyc.ts`

### 9. Analytics View (Future)
**Permission Code:** `view:analytics`
**Description:** View dashboard analytics and reports
**Required For:** All admin users
**Used In:** `/app/admin/page.tsx` (dashboard)

---

## Suggested Role Assignments

### Super Admin
All permissions:
- `admin:access`
- `manage:products`
- `manage:categories`
- `manage:accounts`
- `terminate:accounts`
- `manage:bids`
- `approve:kyc`
- `reject:kyc`
- `view:analytics`

### Product Manager
- `admin:access`
- `manage:products`
- `manage:categories`
- `view:analytics`

### Account Manager
- `admin:access`
- `manage:accounts`
- `view:analytics`

### KYC Reviewer
- `admin:access`
- `approve:kyc`
- `reject:kyc`
- `view:analytics`

### Moderator
- `admin:access`
- `manage:accounts`
- `terminate:accounts`
- `manage:bids`
- `view:analytics`

---

## How to Add Permissions in Kinde

1. **Login to Kinde Dashboard**
   - Go to https://app.kinde.com
   - Navigate to your organization

2. **Navigate to Permissions**
   - Click on "Settings" in the sidebar
   - Select "Permissions"
   - Click "Add permission"

3. **Add Each Permission**
   For each permission above:
   - **Key:** Use the permission code (e.g., `admin:access`)
   - **Name:** Use a descriptive name (e.g., "Admin Portal Access")
   - **Description:** Copy from the description above

4. **Create Roles**
   - Navigate to "Roles" in settings
   - Create roles based on suggested assignments above
   - Assign permissions to each role

5. **Assign Roles to Users**
   - Go to "Users" section
   - Select a user
   - Assign appropriate role(s)

---

## Permission Checking in Code

### Server-Side (Recommended)
```typescript
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Check single permission
const { getPermission } = getKindeServerSession();
const canManageProducts = await getPermission("manage:products");

if (canManageProducts?.isGranted) {
  // User has permission
}

// Get all permissions
const { getPermissions } = getKindeServerSession();
const permissions = await getPermissions();
console.log(permissions.permissions); // ["admin:access", "manage:products", ...]
```

### Client-Side (Less Common)
```typescript
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const { permissions } = useKindeBrowserClient();
const canManageProducts = permissions?.some(p => p === "manage:products");
```

---

## Admin Portal Routes Summary

| Route | Required Permission | Description |
|-------|---------------------|-------------|
| `/admin` | `admin:access` | Dashboard |
| `/admin/products` | `manage:products` | Product management |
| `/admin/categories` | `manage:categories` | Category management |
| `/admin/accounts` | `manage:accounts` | Account management |
| `/admin/accounts/[id]/terminate` | `terminate:accounts` | Account termination |
| `/admin/bids` | `manage:bids` | Bid monitoring |
| `/admin/kyc` | `approve:kyc` OR `reject:kyc` | KYC verification |

---

## Security Notes

1. **Always verify permissions server-side** - Client-side checks are for UI only
2. **Principle of least privilege** - Only grant permissions users absolutely need
3. **Audit trails** - Consider logging all admin actions (future enhancement)
4. **Session management** - Kinde handles this, but be aware of token expiry
5. **Permission inheritance** - Super admins should have all permissions

---

## Future Enhancements

Consider adding these permissions as the platform grows:

- `manage:reports` - Generate and export reports
- `manage:settings` - Modify platform settings
- `manage:admins` - Add/remove other admin users
- `view:audit_logs` - View system audit logs
- `manage:payments` - Handle payment disputes
- `manage:refunds` - Process refunds

---

## Troubleshooting

**User can't access admin portal:**
1. Verify user has `admin:access` permission
2. Check if user is authenticated
3. Verify permission is spelled correctly in Kinde
4. Check server logs for permission check failures

**Permission changes not taking effect:**
1. User may need to log out and log back in
2. Clear browser cache
3. Verify permission was saved in Kinde dashboard
4. Check if using correct permission code in code

---

## Contact

For questions about permissions or admin portal access, contact the development team.
