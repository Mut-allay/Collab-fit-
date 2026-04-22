// Thin client for the Render backend.
// Only exposes endpoints that are authenticated via Firebase ID token
// (user-specific). The bulk cron endpoints require the API_SECRET_KEY
// which must never be in the frontend — they are called by cron-job.org only.

const API_URL = import.meta.env.VITE_API_URL as string;

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Request failed' };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Trigger a sync for the currently logged-in user.
 * Pass the Firebase ID token obtained via `currentUser.getIdToken()`.
 */
export async function syncCurrentUser(idToken: string): Promise<ApiResponse> {
  return makeRequest('/api/sync-google-fit/me', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  });
}
