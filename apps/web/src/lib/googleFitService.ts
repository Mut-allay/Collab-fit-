/**
 * Google Fit integration — all actual syncing is done by the Render backend.
 * The frontend only handles:
 *   1. Redirecting the user through the OAuth consent screen (connect)
 *   2. Asking the backend to delete the stored tokens (disconnect)
 *   3. Requesting an on-demand sync (sync now)
 */

const API_URL = import.meta.env.VITE_API_URL as string;

/**
 * Redirects the browser to the backend OAuth consent screen.
 * After the user grants access, Google redirects back to the backend callback,
 * which stores the refresh token and redirects to /profile?googleFit=connected.
 *
 * Sends `returnOrigin` (current browser origin) so a **deployed** API can send
 * the user back to **local Vite** (http://localhost:5173) when that origin is
 * allowed by the API (`FRONTEND_URL` list or localhost rules in server.js).
 */
export function initiateGoogleFitConnect(userId: string): void {
  const params = new URLSearchParams({ userId });
  if (typeof window !== 'undefined' && window.location?.origin) {
    params.set('returnOrigin', window.location.origin);
  }
  window.location.href = `${API_URL}/api/auth/google?${params.toString()}`;
}

/**
 * Removes the stored Google Fit tokens and marks the user as disconnected.
 * Requires a valid Firebase ID token — only the owner can disconnect.
 */
export async function disconnectGoogleFit(idToken: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/auth/google/disconnect`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || 'Failed to disconnect Google Fit');
  }
}

/**
 * Triggers an immediate sync of the current user's Google Fit data (last 7 days).
 * Requires a valid Firebase ID token.
 */
export async function syncGoogleFitNow(idToken: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/sync-google-fit/me`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || 'Sync failed');
  }
}
