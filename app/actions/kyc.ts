'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Fetch KYC status for the authenticated user
 */
export async function fetchUSERKYCStatus() {
  try {
    const { isAuthenticated, getAccessTokenRaw, getUser } = getKindeServerSession();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    const accessToken = await getAccessTokenRaw();
    const user = await getUser();


    console.log('Fetching KYC status for user:', user);

    const response = await fetch(`${API_URL}/kyc/status/${user?.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (response.status === 404) {
      // No KYC data found
      return { success: true, data: null };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP error! status: ${response.status}`
      };
    }

    const data = await response.json();
    // console.log('Fetched KYC status:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching KYC status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch KYC status'
    };
  }
}

/**
 * Submit personal information for KYC
 */
export async function submitKYCPersonalInfo(personalInfo: {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
}) {
  try {
    const { isAuthenticated, getAccessTokenRaw, getUser } = getKindeServerSession();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    const accessToken = await getAccessTokenRaw();
    const user = await getUser();

    const response = await fetch(`${API_URL}/kyc`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: user?.id,
        ...personalInfo,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP error! status: ${response.status}`
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting KYC personal info:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit personal information'
    };
  }
}

/**
 * Upload KYC document
 */
export async function uploadKYCDocument(formData: FormData) {
  try {
    const { isAuthenticated, getAccessTokenRaw, getUser } = getKindeServerSession();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    const accessToken = await getAccessTokenRaw();
    const user = await getUser();

    // Add accountId to formData
    formData.append('accountId', user?.id || '');

    const response = await fetch(`${API_URL}/upload/kyc-document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP error! status: ${response.status}`
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error uploading KYC document:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload document'
    };
  }
}
