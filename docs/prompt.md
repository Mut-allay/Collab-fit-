Cursor Prompts for the "Injection" Plan
When using Cursor, open your project and use Composer (Cmd+I / Ctrl+I) with the following prompts.

Step A: The "Sanitization" Prompt
Once you have the code from Google AI Studio, paste it into a new folder apps/web/src/components/overhaul/.

Prompt: "I have added new UI components from a design tool into @/components/overhaul/. Please scan these files. Your task is to ensure they use our existing Tailwind configuration and Radix UI primitives. Ensure all absolute imports are converted to our path alias @/. Do NOT add any Firebase or API logic yet; keep them as 'dumb' presentational components."

Step B: The "Logic Glue" Prompt
Run this while having googleFitService.ts and your new Profile component open.

Prompt: "I need to connect the 'Connect Google Fit' button in @/components/overhaul/ProfileView.tsx to our existing logic. Use the initiateGoogleFitConnect function from @/lib/googleFitService.ts. Ensure the button shows a loading state while the redirect is initializing. Refer to CLAUDE.md for the correct OAuth flow parameters."

3. Step-by-Step Implementation Guide
Follow this order to ensure the most critical systems (Auth and Data Sync) are verified first.

Phase 1: Authentication & Layout (The Foundation)
Files: AppLayout.tsx, LoginPage.tsx, SignupPage.tsx

Why: If users can't log in, they can't see the new design.

Action: Replace the UI in PublicLayout first. Ensure the AuthProvider from main.tsx is still wrapping the router.

Phase 2: Profile & Service Connection (The Pipeline)
Files: ProfilePage.tsx, googleFitService.ts

Why: This tests the "Bridge" to your Render backend.

Action: Implement the "Connect Services" card. Verify that clicking "Connect" triggers the api/auth/google route on your Render server.

Phase 3: Dashboard & Activity (The Data)
Files: Dashboard.tsx, dailyActivityLogs hooks

Why: Displays the result of the Google Fit sync.

Action: Connect the "Sync Now" button to the POST /api/sync-google-fit/me endpoint using a Firebase ID token for authentication.

Phase 4: Leaderboards (The Aggregation)
Files: LeaderboardPage.tsx

Why: This is the most complex data fetch.

Action: Ensure the UI reads from the monthlyLeaderboards collection. The UI should display team rankings pre-computed by your backend cron jobs.

4. Final Safety Checklist for Cursor
Environment Variables: Check apps/web/.env one last time. It should only contain VITE_ variables. If Cursor tries to move API_SECRET_KEY from the backend to the frontend, reject the change immediately.

Firebase Admin: Ensure firebase-admin stays only in the api/ folder. The frontend should use the standard Firebase Web SDK.

The "Switch Over" Rule: For each page, keep your const { data, isLoading } = useQuery(...) logic at the top of the file, and only replace the return (<NewComponent ...props />) section.



"Look at @/components/overhaul/ProfileView.tsx. I need to connect the Google Fit button to our backend.

Use initiateGoogleFitConnect from @/lib/googleFitService.ts.

Pass the currentUser.uid from our AuthContext.

Ensure the UI handles the googleFit=connected or googleFit=error URL parameters to show success/error toasts.

Do not delete the existing UI styling."