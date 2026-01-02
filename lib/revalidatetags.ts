// Cache tags for revalidation
export const ADDRESS_TAGS = {
    all: "addresses",
    user: (userId: string) => `addresses-user-${userId}`,
    detail: (id: string) => `address-${id}`,
};