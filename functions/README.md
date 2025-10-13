# FitSpark Cloud Functions

This directory contains Firebase Cloud Functions for the FitSpark team competition features.

## Functions

### 1. `syncGoogleFitData`
- **Trigger**: Scheduled (every 6 hours)
- **Purpose**: Automatically sync Google Fit data for all connected users
- **Features**:
  - Fetches steps and calories data from Google Fit API
  - Updates daily activity logs in Firestore
  - Handles token refresh and error recovery
  - Marks users as disconnected if tokens are invalid

### 2. `updateMonthlyLeaderboards`
- **Trigger**: Scheduled (daily at midnight UTC)
- **Purpose**: Calculate and update monthly team leaderboards
- **Features**:
  - Aggregates team member activity data
  - Sorts teams by total steps
  - Creates monthly leaderboard documents
  - Handles member statistics and rankings

### 3. `updateLeaderboardManually`
- **Trigger**: HTTP callable function
- **Purpose**: Manually trigger leaderboard updates for any month/year
- **Features**:
  - Authenticated access only
  - Custom month/year parameters
  - Useful for testing and manual updates

## Setup

### 1. Install Dependencies
```bash
cd functions
npm install
```

### 2. Configure Google API Credentials
Set up your Google Cloud Console credentials:

```bash
firebase functions:config:set google.client_id="your-client-id"
firebase functions:config:set google.client_secret="your-client-secret"
```

### 3. Build and Deploy
```bash
# Build TypeScript
npm run build

# Deploy to Firebase
firebase deploy --only functions
```

## Development

### Local Testing
```bash
# Start Firebase emulators
firebase emulators:start --only functions

# Build and watch for changes
npm run build:watch
```

### Manual Testing
You can test the manual leaderboard update function:

```javascript
// In Firebase console or via SDK
const updateLeaderboard = firebase.functions().httpsCallable('updateLeaderboardManually');
updateLeaderboard({ month: 'December', year: 2024 });
```

## Environment Variables

The functions use Firebase Functions config for sensitive data:

- `google.client_id`: Google OAuth client ID
- `google.client_secret`: Google OAuth client secret

## Monitoring

Monitor function execution in the Firebase Console:
- Go to Functions section
- View logs and metrics
- Set up alerts for errors

## Error Handling

The functions include comprehensive error handling:
- Invalid Google Fit tokens are automatically handled
- Users are marked as disconnected if authentication fails
- Individual user sync failures don't stop the entire process
- Detailed logging for debugging

## Performance Considerations

- Functions are optimized for batch processing
- Uses Promise.allSettled for parallel processing
- Implements proper error boundaries
- Includes retry logic for transient failures
