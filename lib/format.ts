// Utility functions for formatting

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // To allow up to two decimal places (e.g., $10.50)
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatTimeRemaining(endDate: Date): string {
  const now = new Date();
  const diff = new Date(endDate).getTime() - now.getTime();

  if (diff <= 0) {
    return "Ended";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function formatCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    NEW: "Brand New",
    LIKE_NEW: "Like New",
    GOOD: "Good",
    FAIR: "Fair",
    POOR: "Poor",
  };
  return conditionMap[condition] || condition;
}

export function getConditionColor(condition: string): string {
  const colorMap: Record<string, string> = {
    NEW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    LIKE_NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    GOOD: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    FAIR: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    POOR: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return colorMap[condition] || "bg-gray-100 text-gray-800";
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date | string): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

