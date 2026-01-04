// Cache tags for revalidation
export const ADDRESS_TAGS = {
    all: "addresses",
    user: (userId: string) => `addresses-user-${userId}`,
    detail: (id: string) => `address-${id}`,
};


// Cache tags for revalidation
export const PRODUCT_TAGS = {
    all: "products",
    list: "products-list",
    detail: (id: string) => `product-${id}`,
    category: (id: string) => `products-category-${id}`,
    search: "products-search",
    endingSoon: "products-ending-soon",
    newest: "products-newest",
};