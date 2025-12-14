// API configuration and utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// API fetch wrapper with error handling and revalidation tags
// Can be used with or without authentication
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { tags?: string[]; accessToken?: string }
): Promise<T> {
  const { tags, accessToken, ...fetchOptions } = options || {};

  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authorization header if access token is provided
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Merge with any additional headers from fetchOptions
  if (fetchOptions.headers) {
    Object.assign(headers, fetchOptions.headers);
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
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

// Authenticated API fetch wrapper for client-side mutations
// Used in client components where we have access to the access token
export async function apiFetchClient<T>(
  endpoint: string,
  accessToken: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return await response.json();
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
