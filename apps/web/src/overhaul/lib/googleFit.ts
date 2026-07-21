/**
 * Google Fit integration — frontend side only.
 *
 * Architecture: the frontend never talks to Google OAuth directly.
 * Instead, it redirects the browser to the Render backend, which:
 *   1. Builds the Google consent URL and redirects the user there
 *   2. Receives the auth code on the callback endpoint
 *   3. Exchanges it for tokens and stores the refresh token in Firestore
 *   4. Redirects back to the frontend at /profile?googleFit=connected
 *
 * This keeps the OAuth client secret server-side only and avoids
 * storing sensitive tokens in the browser.
 */

import {
  initiateGoogleFitConnect,
  disconnectGoogleFit,
  syncGoogleFitNow,
} from "@/lib/googleFitService";

export { initiateGoogleFitConnect, disconnectGoogleFit, syncGoogleFitNow };

/**
 * Starts the Google Fit OAuth flow for the given user.
 * Redirects the browser — the page will not return from this call.
 */
export function connectGoogleFit(userId: string): void {
  if (!userId) {
    console.error("connectGoogleFit: userId is required");
    return;
  }
  initiateGoogleFitConnect(userId);
}
