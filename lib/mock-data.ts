import { Category, Product, ProductCondition } from "./types";

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: "1",
    slug: "smartphones",
    name: "Smartphones",
    description: "Latest smartphones and mobile devices",
    icon: "📱",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    slug: "laptops",
    name: "Laptops",
    description: "Powerful laptops and notebooks",
    icon: "💻",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    slug: "tablets",
    name: "Tablets",
    description: "Tablets and iPads",
    icon: "📲",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    slug: "audio",
    name: "Audio",
    description: "Headphones, earbuds, and speakers",
    icon: "🎧",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    slug: "wearables",
    name: "Wearables",
    description: "Smartwatches and fitness trackers",
    icon: "⌚",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    slug: "gaming",
    name: "Gaming",
    description: "Gaming consoles and accessories",
    icon: "🎮",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Helper function to generate dates
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const hoursFromNow = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

// Helper to create auction object
const createAuction = (
  id: string,
  prizeValue: number,
  entryFee: number,
  startDate: Date,
  endDate: Date,
  totalBidsCount: number,
  status: "ACTIVE" | "ENDED" = "ACTIVE"
) => ({
  id,
  prizeValue: prizeValue.toString(),
  entryFee: entryFee.toString(),
  startDate: startDate.toISOString(),
  endDate: endDate.toISOString(),
  status,
  winnerId: "",
  winningBidAmount: "0",
  totalBidsCount,
});

// Mock Products aligned with Product interface
export const mockProducts: Product[] = [
  {
    id: "1",
    title: "iPhone 14 Pro Max 256GB",
    description:
      "Brand new iPhone 14 Pro Max in Deep Purple. Features the A16 Bionic chip, 48MP camera system, and Dynamic Island. Factory sealed with full warranty.",
    categoryId: "1",
    condition: "NEW" as ProductCondition,
    images: ["/iphone-14-pro-max-purple.jpg", "/iphone-box.jpg"],
    retailValue: 1199,
    entryFee: 5,
    status: "ACTIVE",
    auctions: [
      createAuction("auction-1", 1199, 5, daysFromNow(-5), hoursFromNow(4), 42),
    ],
    endDate: hoursFromNow(4),
    startDate: daysFromNow(-5),
    sellerId: "seller1",
    sellerName: "TechDeals Pro",
    sellerRating: 4.8,
    specifications: {
      Storage: "256GB",
      Color: "Deep Purple",
      "Battery Health": "100%",
      Warranty: "1 Year Apple Care+",
      Condition: "Brand New",
      Chip: "A16 Bionic",
    },
    isActive: true,
    createdAt: daysFromNow(-5),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: 'MacBook Pro 14" M2 Pro',
    description:
      "Excellent condition MacBook Pro 14-inch with M2 Pro chip, 16GB RAM, and 512GB SSD. Perfect for professionals and creators. Includes original box and charger.",
    categoryId: "2",
    condition: "LIKE_NEW" as ProductCondition,
    images: ["/macbook-pro-m2-on-desk.jpg", "/macbook-keyboard.jpg"],
    retailValue: 2499,
    entryFee: 10,
    status: "ACTIVE",
    auctions: [
      createAuction("auction-2", 2499, 10, daysFromNow(-3), hoursFromNow(8), 15),
    ],
    endDate: hoursFromNow(8),
    startDate: daysFromNow(-3),
    sellerId: "seller2",
    sellerName: "Apple Certified Reseller",
    sellerRating: 4.9,
    specifications: {
      Processor: "Apple M2 Pro",
      RAM: "16GB",
      Storage: "512GB SSD",
      Display: "14.2-inch Liquid Retina XDR",
      "Battery Cycles": "12",
      Color: "Space Gray",
    },
    isActive: true,
    createdAt: daysFromNow(-3),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Samsung Galaxy S23 Ultra 512GB",
    description:
      "Like new Samsung Galaxy S23 Ultra with S Pen. Phantom Black color with 512GB storage. Features 200MP camera and AI capabilities.",
    categoryId: "1",
    condition: "LIKE_NEW" as ProductCondition,
    images: ["/samsung-galaxy-s23-ultra.jpg", "/samsung-galaxy-s23-ultra.png"],
    retailValue: 1299,
    entryFee: 5,
    status: "ACTIVE",
    auctions: [
      createAuction("auction-3", 1299, 5, daysFromNow(-4), hoursFromNow(2), 31),
    ],
    endDate: hoursFromNow(2),
    startDate: daysFromNow(-4),
    sellerId: "seller3",
    sellerName: "Galaxy Hub",
    sellerRating: 4.7,
    specifications: {
      Storage: "512GB",
      Color: "Phantom Black",
      "Battery Health": "98%",
      Warranty: "90 Days",
      "S Pen": "Included",
      Camera: "200MP Main",
    },
    isActive: true,
    createdAt: daysFromNow(-4),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "iPad Air M1 256GB",
    description:
      "iPad Air with M1 chip, stunning Liquid Retina display. Excellent condition with Apple Pencil 2nd gen included.",
    categoryId: "3",
    condition: "GOOD" as ProductCondition,
    images: ["/ipad-air-m1.jpg", "/ipad-air-m1.png"],
    retailValue: 799,
    entryFee: 5,
    status: "ACTIVE",
    auctions: [
      createAuction("auction-4", 799, 5, daysFromNow(-2), hoursFromNow(12), 18),
    ],
    endDate: hoursFromNow(12),
    startDate: daysFromNow(-2),
    sellerId: "seller1",
    sellerName: "TechDeals Pro",
    sellerRating: 4.8,
    specifications: {
      Storage: "256GB",
      Color: "Space Gray",
      "Display Size": "10.9 inches",
      Chip: "Apple M1",
      Accessories: "Apple Pencil 2nd Gen",
    },
    isActive: true,
    createdAt: daysFromNow(-2),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "Sony WH-1000XM5 Wireless Headphones",
    description:
      "Industry-leading noise canceling headphones. Like new condition with all original accessories and packaging.",
    categoryId: "4",
    condition: "LIKE_NEW" as ProductCondition,
    images: ["/sony-wh1000xm5.jpg", "/sony-wh1000xm5.jpg"],
    retailValue: 399,
    entryFee: 3,
    status: "ACTIVE",
    auctions: [
      createAuction("auction-5", 399, 3, daysFromNow(-1), hoursFromNow(6), 27),
    ],
    endDate: hoursFromNow(6),
    startDate: daysFromNow(-1),
    sellerId: "seller4",
    sellerName: "Audio Excellence",
    sellerRating: 4.9,
    specifications: {
      Color: "Black",
      "Battery Life": "30 hours",
      "Noise Canceling": "Industry-leading",
      Connectivity: "Bluetooth 5.2",
      Condition: "Like New",
    },
    isActive: true,
    createdAt: daysFromNow(-1),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "Apple Watch Ultra 2",
    description:
      "Rugged and capable Apple Watch Ultra 2 with 49mm titanium case. GPS + Cellular with Ocean Band. Perfect for outdoor adventures.",
    categoryId: "5",
    condition: "NEW" as ProductCondition,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    retailValue: 849,
    entryFee: 5,
    status: "ACTIVE",
    auctions: [
      createAuction("auction-6", 849, 5, daysFromNow(-1), hoursFromNow(18), 12),
    ],
    endDate: hoursFromNow(18),
    startDate: daysFromNow(-1),
    sellerId: "seller2",
    sellerName: "Apple Certified Reseller",
    sellerRating: 4.9,
    specifications: {
      "Case Size": "49mm",
      Material: "Titanium",
      Band: "Ocean Band",
      GPS: "Yes",
      Cellular: "Yes",
    },
    isActive: true,
    createdAt: daysFromNow(-1),
    updatedAt: new Date(),
  },
  {
    id: "7",
    title: "Dell XPS 15 (2024) - i7, 32GB RAM",
    description:
      "High-performance Dell XPS 15 with Intel Core i7, 32GB RAM, and 1TB SSD. Perfect for professionals and content creators.",
    categoryId: "2",
    condition: "GOOD" as ProductCondition,
    images: ["/macbook-pro-m2-on-desk.png", "/macbook-keyboard.jpg"],
    retailValue: 1899,
    entryFee: 8,
    status: "ACTIVE",
    auctions: [
      createAuction("auction-7", 1899, 8, daysFromNow(-2), daysFromNow(1), 9),
    ],
    endDate: daysFromNow(1),
    startDate: daysFromNow(-2),
    sellerId: "seller5",
    sellerName: "PC Master",
    sellerRating: 4.6,
    specifications: {
      Processor: "Intel Core i7-13700H",
      RAM: "32GB DDR5",
      Storage: "1TB SSD",
      Display: "15.6-inch 4K OLED",
      GPU: "NVIDIA RTX 4050",
    },
    isActive: true,
    createdAt: daysFromNow(-2),
    updatedAt: new Date(),
  },
  {
    id: "8",
    title: "PlayStation 5 Digital Edition",
    description:
      "Sony PlayStation 5 Digital Edition with extra DualSense controller. Excellent condition, comes with 5 digital games.",
    categoryId: "6",
    condition: "GOOD" as ProductCondition,
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    retailValue: 499,
    entryFee: 5,
    status: "ACTIVE",
    auctions: [
      createAuction("auction-8", 499, 5, daysFromNow(-3), hoursFromNow(10), 34),
    ],
    endDate: hoursFromNow(10),
    startDate: daysFromNow(-3),
    sellerId: "seller6",
    sellerName: "Gaming Central",
    sellerRating: 4.8,
    specifications: {
      Edition: "Digital",
      Controllers: "2x DualSense",
      Storage: "825GB SSD",
      "Games Included": "5 Digital Games",
      Warranty: "30 Days",
    },
    isActive: true,
    createdAt: daysFromNow(-3),
    updatedAt: new Date(),
  },
  {
    id: "9",
    title: "AirPods Pro 2nd Generation",
    description:
      "Brand new AirPods Pro with USB-C charging case. Active noise cancellation and transparency mode.",
    categoryId: "4",
    condition: "NEW" as ProductCondition,
    images: ["/airpods-pro-lifestyle.jpg", "/airpods-pro-lifestyle.png"],
    retailValue: 249,
    entryFee: 3,
    status: "ACTIVE",
    auctions: [
      createAuction("auction-9", 249, 3, daysFromNow(-2), hoursFromNow(3), 41),
    ],
    endDate: hoursFromNow(3),
    startDate: daysFromNow(-2),
    sellerId: "seller1",
    sellerName: "TechDeals Pro",
    sellerRating: 4.8,
    specifications: {
      Generation: "2nd",
      "Charging Case": "USB-C",
      "Active Noise Cancellation": "Yes",
      "Spatial Audio": "Yes",
      Warranty: "1 Year",
    },
    isActive: true,
    createdAt: daysFromNow(-2),
    updatedAt: new Date(),
  },
  {
    id: "10",
    title: "Samsung Galaxy Tab S9 Ultra",
    description:
      "Premium Android tablet with stunning 14.6-inch display, S Pen included. Perfect for productivity and entertainment.",
    categoryId: "3",
    condition: "LIKE_NEW" as ProductCondition,
    images: ["/ipad-air-m1.png", "/ipad-air-m1.jpg"],
    retailValue: 1199,
    entryFee: 8,
    status: "ACTIVE",
    auctions: [
      createAuction("auction-10", 1199, 8, daysFromNow(-1), daysFromNow(2), 7),
    ],
    endDate: daysFromNow(2),
    startDate: daysFromNow(-1),
    sellerId: "seller3",
    sellerName: "Galaxy Hub",
    sellerRating: 4.7,
    specifications: {
      "Display Size": "14.6 inches",
      Storage: "512GB",
      RAM: "12GB",
      "S Pen": "Included",
      "5G": "Yes",
    },
    isActive: true,
    createdAt: daysFromNow(-1),
    updatedAt: new Date(),
  },
];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find((cat) => cat.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return mockProducts.filter((product) => product.categoryId === categoryId);
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  // Return products ending soon (within 24 hours)
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return mockProducts
    .filter((product) => product.endDate <= tomorrow && product.isActive)
    .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
    .slice(0, 6);
};

export const getNewestProducts = (limit: number = 6): Product[] => {
  return [...mockProducts]
    .filter((product) => product.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

export const getEndingSoonProducts = (limit: number = 6): Product[] => {
  return [...mockProducts]
    .filter((product) => product.isActive)
    .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
    .slice(0, limit);
};
