# Cloud Functions Deployment Guide

This guide explains how to deploy and manage the FitSpark Cloud Functions for team competition features.

## Prerequisites

1. **Firebase CLI**: Install and configure Firebase CLI
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Google Cloud Console Setup**:
   - Create a Google Cloud project
   - Enable Google Fit API
   - Create OAuth 2.0 credentials
   - Note down your Client ID and Client Secret

## Initial Setup

### 1. Install Function Dependencies
```bash
cd functions
npm install
```

### 2. Configure Google API Credentials
Set your Google OAuth credentials in Firebase Functions config:

```bash
# For staging environment
firebase use fitspark-staging
firebase functions:config:set google.client_id="your-staging-client-id"
firebase functions:config:set google.client_secret="your-staging-client-secret"

# For production environment
firebase use fitspark-production
firebase functions:config:set google.client_id="your-production-client-id"
firebase functions:config:set google.client_secret="your-production-client-secret"
```

### 3. Build Functions
```bash
cd functions
npm run build
```

## Deployment Commands

### Deploy Functions Only
```bash
# Deploy to current project
pnpm run deploy:functions

# Deploy to staging
pnpm run deploy:functions:staging

# Deploy to production
pnpm run deploy:functions:production
```

### Deploy Everything
```bash
# Deploy hosting + functions to current project
firebase deploy

# Deploy to staging
pnpm run deploy:staging

# Deploy to production
pnpm run deploy:production
```

## Local Development

### Start Functions Emulator
```bash
pnpm run functions:serve
```

This will start the Firebase emulators including:
- Functions emulator on port 5001
- Firestore emulator on port 8080
- Auth emulator on port 9099
- Hosting emulator on port 5000

### Test Functions Locally
```bash
# Test scheduled functions manually
curl -X POST http://localhost:5001/your-project-id/us-central1/syncGoogleFitData

# Test callable functions
curl -X POST http://localhost:5001/your-project-id/us-central1/updateLeaderboardManually \
  -H "Content-Type: application/json" \
  -d '{"data": {"month": "December", "year": 2024}}'
```

## Monitoring and Logs

### View Function Logs
```bash
# View all function logs
pnpm run functions:logs

# View logs for specific function
firebase functions:log --only syncGoogleFitData

# Follow logs in real-time
firebase functions:log --follow
```

### Monitor in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Functions section
4. View metrics, logs, and performance data

## Function Details

### 1. syncGoogleFitData
- **Schedule**: Every 6 hours
- **Purpose**: Sync Google Fit data for all connected users
- **Trigger**: `functions.pubsub.schedule('every 6 hours')`

### 2. updateMonthlyLeaderboards
- **Schedule**: Daily at midnight UTC
- **Purpose**: Update monthly team leaderboards
- **Trigger**: `functions.pubsub.schedule('0 0 * * *')`

### 3. updateLeaderboardManually
- **Type**: HTTP callable function
- **Purpose**: Manual leaderboard updates
- **Authentication**: Required
- **Parameters**: `{ month: string, year: number }`

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Google OAuth credentials are correct
   - Check that Google Fit API is enabled
   - Ensure OAuth consent screen is configured

2. **Permission Errors**
   - Verify Firebase project permissions
   - Check Firestore security rules
   - Ensure functions have proper IAM roles

3. **Build Errors**
   - Run `npm run build` in functions directory
   - Check TypeScript compilation errors
   - Verify all dependencies are installed

### Debug Mode
Enable debug logging by setting environment variables:
```bash
firebase functions:config:set debug.enabled=true
```

## Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Firestore Rules**: Ensure proper security rules are in place
3. **Authentication**: All callable functions require authentication
4. **Rate Limiting**: Consider implementing rate limiting for API calls

## Performance Optimization

1. **Batch Processing**: Functions process users in parallel
2. **Error Handling**: Individual failures don't stop the entire process
3. **Caching**: Consider implementing caching for frequently accessed data
4. **Monitoring**: Set up alerts for function failures

## Cost Management

1. **Function Execution Time**: Monitor and optimize execution time
2. **API Calls**: Track Google Fit API usage and costs
3. **Firestore Reads/Writes**: Monitor database operations
4. **Scheduling**: Adjust sync frequency based on needs

## Backup and Recovery

1. **Function Code**: Version control all function code
2. **Configuration**: Backup Firebase Functions config
3. **Data**: Regular Firestore backups
4. **Disaster Recovery**: Document recovery procedures

## Support

For issues or questions:
1. Check Firebase Console logs
2. Review function execution metrics
3. Test functions locally with emulators
4. Consult Firebase documentation
