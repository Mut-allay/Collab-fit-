import * as admin from 'firebase-admin';
import { syncGoogleFitData } from './syncGoogleFit';
import { updateMonthlyLeaderboards } from './leaderboardAggregation';

// Initialize Firebase Admin
admin.initializeApp();

// Export all functions
export { syncGoogleFitData, updateMonthlyLeaderboards };
