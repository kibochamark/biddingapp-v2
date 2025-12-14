// API configuration and utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const DUMMY_KINDE_ID = "dummy_kinde_user_123"; // For development

// API fetch wrapper with error handling and revalidation tags
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { tags?: string[] }
): Promise<T> {
  const { tags, ...fetchOptions } = options || {};

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      next: {
        tags: tags || [],
        revalidate: 60, // Cache for 60 seconds by default
      },
    });

    if (!response.ok) {
      // Handle HTTP errors
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Revalidation helper
export function revalidateTag(tag: string) {
  // This will be used with Server Actions
  return fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag }),
  });
}

// Export dummy Kinde ID for development
export { DUMMY_KINDE_ID };
