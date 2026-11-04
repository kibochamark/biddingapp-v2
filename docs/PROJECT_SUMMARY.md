# BidMarket - Bidding App Frontend

A modern, minimalistic bidding platform frontend inspired by BackMarket's design aesthetic.

## 🎨 Design Features

### Color Scheme
- **Primary Accent**: Orange (#ff7b00 inspired) - `oklch(0.65 0.19 45)`
- **Clean Typography**: System fonts with antialiasing
- **Responsive Border Radius**: 0.5rem for consistent rounded corners
- **Dark Mode Support**: Full theme switching capability

### Design Principles
- Minimalistic and clean interface
- Smooth transitions and hover effects
- Responsive grid layouts
- High-quality image handling with Next.js Image optimization

## 📁 Project Structure

```
bidding-app/
├── app/
│   ├── catalog/
│   │   └── page.tsx          # Product catalog with advanced filters
│   ├── cart/
│   │   └── page.tsx          # Cart and checkout page
│   ├── product/[id]/
│   │   └── page.tsx          # Individual product detail page
│   ├── profile/
│   │   └── page.tsx          # User profile with KYC & addresses
│   ├── signin/
│   │   └── page.tsx          # Sign in/Sign up page
│   ├── layout.tsx            # Root layout with Navbar & Footer
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles and theme
├── components/
│   ├── navbar.tsx            # Global navigation
│   ├── footer.tsx            # Global footer
│   ├── product-card.tsx      # Reusable product card
│   ├── product-carousel.tsx  # Product carousel component
│   ├── hero-carousel.tsx     # Hero section carousel
│   ├── category-grid.tsx     # Category grid display
│   ├── catalog-filters.tsx   # Advanced filtering sidebar
│   ├── bid-form.tsx          # Bidding form component
│   └── image-gallery.tsx     # Product image gallery
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   ├── mock-data.ts          # Mock products and categories
│   ├── format.ts             # Formatting utilities
│   └── utils.ts              # Utility functions
└── next.config.ts            # Next.js configuration

```

## 🚀 Features Implemented

### 1. Homepage
- **Hero Carousel**: Features products ending soon (within 24 hours)
- **Category Grid**: Browse by product categories
- **Product Carousels**: 
  - Ending Soon section
  - New Arrivals section
- **Trust Section**: Quality, Security, and Shipping badges

### 2. Product Catalog Page
- **Advanced Filters**:
  - Category selection
  - Condition filters (NEW, LIKE_NEW, GOOD, FAIR, POOR)
  - Price range filtering
  - Sort options (Ending Soon, Newest, Highest Bid, Lowest Price)
- **Responsive Grid**: 1-3 columns based on screen size
- **Mobile Filter Drawer**: Slide-out filters on mobile devices
- **Results Count**: Shows number of auctions found

### 3. Product Detail Page
- **Image Gallery**: Multiple images with thumbnail navigation
- **Product Information**:
  - Title, description, and condition
  - Specifications table
  - Time remaining countdown
  - Current bid and bid history
- **Bid Form**:
  - Place bid functionality (triggers alert - payment not implemented)
  - Buy Now option (when available)
  - Minimum bid validation
- **Seller Information**: Seller name and rating
- **Related Products**: Similar auctions from same category
- **Trust Badges**: Buyer protection, fast shipping, quality checked

### 4. Cart/Checkout Page
- **Empty State**: Attractive empty cart design
- **Cart Items**: Display of active bids
- **Order Summary**:
  - Subtotal calculation
  - Shipping costs
  - Tax calculation (8%)
  - Total amount
- **Bid Status**: Shows if user is currently winning or outbid

### 5. Sign In Page
- **Dual Mode**: Toggle between Sign In and Sign Up
- **Form Fields**:
  - Email and password
  - Full name (sign up only)
- **Social Login**: Google and GitHub buttons (UI only)
- **Responsive Design**: Mobile-optimized form
- **Terms & Privacy**: Links to legal documents

### 6. Profile Page
**Tabbed Navigation**:
- **Profile Tab**: Edit personal information and account status
- **Addresses Tab**: 
  - Manage shipping addresses
  - Add, edit, delete addresses
  - Label addresses (Home, Work, etc.)
- **Verification (KYC) Tab**:
  - Upload ID documents
  - Upload selfie (optional)
  - Track verification status (NOT_SUBMITTED, PENDING, APPROVED, REJECTED)
- **My Bids Tab**: View active bids
- **My Listings Tab**: Create and manage product listings

### 7. Global Components

#### Navbar
- Sticky navigation
- Search bar with icon
- Cart with item count badge
- User profile link
- Sign In button
- Mobile responsive with hamburger menu
- Mobile search bar

#### Footer
- Brand information
- Navigation links (Shop, Support, Legal)
- Four-column responsive grid
- Copyright information

## 🎯 Mock Data

### Products (10 Sample Products)
- iPhone 15 Pro Max
- MacBook Pro M3
- Samsung Galaxy S24 Ultra
- iPad Pro M2
- Sony WH-1000XM5 Headphones
- Apple Watch Ultra 2
- Dell XPS 15
- PlayStation 5
- AirPods Pro 2nd Gen
- Samsung Galaxy Tab S9 Ultra

### Categories (6 Categories)
- Smartphones 📱
- Laptops 💻
- Tablets 📲
- Audio 🎧
- Wearables ⌚
- Gaming 🎮

## 💾 Data Structure (Based on API)

All types follow the provided API documentation:
- `Product`: Complete product with bidding information
- `Category`: Hierarchical categories with slugs
- `Account`: User account information
- `Address`: Shipping addresses with labels
- `KYC`: Identity verification data

## 🎨 Theme Configuration

### Light Mode
- Background: Pure white
- Foreground: Near black
- Primary: Orange accent
- Borders: Light gray

### Dark Mode
- Background: Dark gray
- Foreground: Near white
- Primary: Bright orange
- Borders: Subtle white with opacity

## 🔧 Technical Details

### Next.js Configuration
- **Image Optimization**: Configured for `images.unsplash.com`
- **Remote Patterns**: Properly set up for external images
- **App Router**: Using Next.js 14+ App Router

### Component Architecture
- **Server Components**: Default for all pages (better performance)
- **Client Components**: Only where needed (forms, interactive elements)
- **TypeScript**: Full type safety throughout

### Styling
- **Tailwind CSS 4**: Latest version with custom theme
- **CSS Custom Properties**: For theme variables
- **OKLCH Color Space**: Modern color definitions
- **Responsive Design**: Mobile-first approach

## 🚫 Out of Scope (As Requested)

1. **Payment Processing**: Bid placement shows alert only
2. **API Integration**: Using mock data instead
3. **Authentication**: UI only, no backend
4. **Real-time Bidding**: Static mock data
5. **Image Upload**: UI only for KYC documents

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Key Design Decisions

1. **Orange Primary Color**: Inspired by BackMarket's brand
2. **Clean Cards**: Subtle shadows and borders
3. **Smooth Animations**: 200-500ms transitions
4. **Accessible**: Proper ARIA labels and semantic HTML
5. **SEO Friendly**: Server-side rendering with metadata

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Notes

- All bidding functionality displays alerts instead of processing payments
- Mock data is used throughout the application
- No actual API calls are made
- Authentication is UI-only (no real login)
- File uploads are UI-only (no actual file handling)

## ✨ Future Enhancements (Not Implemented)

- Real-time bidding with WebSockets
- Payment gateway integration
- Email notifications
- Seller dashboard
- Analytics and reporting
- Advanced search with Elasticsearch
- Bid history and activity feed
- Wishlist functionality
- Product reviews and ratings
