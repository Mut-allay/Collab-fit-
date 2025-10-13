import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

const db = admin.firestore();

interface GoogleFitDataSource {
  dataType: {
    name: string;
    field: Array<{
      name: string;
      format: string;
    }>;
  };
  dataStreamId: string;
  dataStreamName: string;
  type: string;
}

interface GoogleFitDataPoint {
  startTimeNanos: string;
  endTimeNanos: string;
  value: Array<{
    intVal?: number;
    fpVal?: number;
  }>;
}

interface GoogleFitDataset {
  dataSourceId: string;
  maxEndTimeNs: string;
  minStartTimeNs: string;
  point: GoogleFitDataPoint[];
}

interface GoogleFitBucket {
  startTimeMillis: string;
  endTimeMillis: string;
  dataset: GoogleFitDataset[];
}

interface GoogleFitResponse {
  bucket: GoogleFitBucket[];
}

interface User {
  uid: string;
  googleFitConnected: boolean;
  googleFitRefreshToken?: string;
  googleFitAccessToken?: string;
  googleFitTokenExpiry?: number;
}

/**
 * Scheduled function that runs every 6 hours to sync Google Fit data
 * for all connected users and update their daily activity logs
 */
export const syncGoogleFitData = functions.pubsub
  .schedule('every 6 hours')
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Starting Google Fit data sync...');
    
    try {
      // Get all users with Google Fit connected
      const usersSnapshot = await db
        .collection('users')
        .where('googleFitConnected', '==', true)
        .get();

      if (usersSnapshot.empty) {
        console.log('No users with Google Fit connected');
        return;
      }

      console.log(`Found ${usersSnapshot.size} users with Google Fit connected`);

      // Process each user
      const syncPromises = usersSnapshot.docs.map(async (userDoc) => {
        const user = userDoc.data() as User;
        return syncUserGoogleFitData(user);
      });

      await Promise.allSettled(syncPromises);
      console.log('Google Fit data sync completed');
    } catch (error) {
      console.error('Error in Google Fit sync:', error);
      throw error;
    }
  });

/**
 * Sync Google Fit data for a specific user
 */
async function syncUserGoogleFitData(user: User): Promise<void> {
  try {
    console.log(`Syncing data for user: ${user.uid}`);

    // Check if we have valid tokens
    if (!user.googleFitRefreshToken) {
      console.log(`No refresh token for user: ${user.uid}`);
      return;
    }

    // Initialize Google Fit API client
    const oauth2Client = new google.auth.OAuth2(
      functions.config().google.client_id,
      functions.config().google.client_secret,
      'postmessage'
    );

    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: user.googleFitRefreshToken,
    });

    const fitness = google.fitness({ version: 'v1', auth: oauth2Client });

    // Get data for the last 7 days
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 7);

    const startTimeMillis = startTime.getTime();
    const endTimeMillis = endTime.getTime();

    // Sync steps data
    await syncStepsData(fitness, user.uid, startTimeMillis, endTimeMillis);

    // Sync calories data
    await syncCaloriesData(fitness, user.uid, startTimeMillis, endTimeMillis);

    // Update last sync time
    await db.collection('users').doc(user.uid).update({
      googleFitLastSync: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Successfully synced data for user: ${user.uid}`);
  } catch (error) {
    console.error(`Error syncing data for user ${user.uid}:`, error);
    
    // If token is invalid, mark user as disconnected
    if (error.code === 401 || error.message?.includes('invalid_grant')) {
      await db.collection('users').doc(user.uid).update({
        googleFitConnected: false,
        googleFitRefreshToken: admin.firestore.FieldValue.delete(),
        googleFitAccessToken: admin.firestore.FieldValue.delete(),
        googleFitTokenExpiry: admin.firestore.FieldValue.delete(),
      });
      console.log(`Marked user ${user.uid} as disconnected due to invalid token`);
    }
  }
}

/**
 * Sync steps data from Google Fit
 */
async function syncStepsData(
  fitness: any,
  userId: string,
  startTimeMillis: number,
  endTimeMillis: number
): Promise<void> {
  try {
    const response = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        }],
        bucketByTime: {
          durationMillis: 86400000 // 24 hours
        },
        startTimeMillis,
        endTimeMillis
      }
    });

    const data = response.data as GoogleFitResponse;
    await processAndStoreStepsData(data, userId);
  } catch (error) {
    console.error(`Error syncing steps for user ${userId}:`, error);
  }
}

/**
 * Sync calories data from Google Fit
 */
async function syncCaloriesData(
  fitness: any,
  userId: string,
  startTimeMillis: number,
  endTimeMillis: number
): Promise<void> {
  try {
    const response = await fitness.users.dataset.aggregate({
      userId: 'me',
      requestBody: {
        aggregateBy: [{
          dataTypeName: 'com.google.calories.expended',
          dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:from_activities'
        }],
        bucketByTime: {
          durationMillis: 86400000 // 24 hours
        },
        startTimeMillis,
        endTimeMillis
      }
    });

    const data = response.data as GoogleFitResponse;
    await processAndStoreCaloriesData(data, userId);
  } catch (error) {
    console.error(`Error syncing calories for user ${userId}:`, error);
  }
}

/**
 * Process and store steps data in Firestore
 */
async function processAndStoreStepsData(data: GoogleFitResponse, userId: string): Promise<void> {
  for (const bucket of data.bucket) {
    const date = new Date(parseInt(bucket.startTimeMillis));
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    let totalSteps = 0;
    for (const dataset of bucket.dataset) {
      for (const point of dataset.point) {
        if (point.value && point.value[0] && point.value[0].intVal) {
          totalSteps += point.value[0].intVal;
        }
      }
    }

    if (totalSteps > 0) {
      const logId = `${userId}_${dateString}`;
      const logRef = db.collection('dailyActivityLogs').doc(logId);
      
      // Get existing log to preserve calories data
      const existingLog = await logRef.get();
      const existingData = existingLog.exists ? existingLog.data() : {};
      
      await logRef.set({
        id: logId,
        userId,
        date: dateString,
        steps: totalSteps,
        calories: existingData.calories || 0,
        source: 'google_fit',
        syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }
  }
}

/**
 * Process and store calories data in Firestore
 */
async function processAndStoreCaloriesData(data: GoogleFitResponse, userId: string): Promise<void> {
  for (const bucket of data.bucket) {
    const date = new Date(parseInt(bucket.startTimeMillis));
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    let totalCalories = 0;
    for (const dataset of bucket.dataset) {
      for (const point of dataset.point) {
        if (point.value && point.value[0] && point.value[0].fpVal) {
          totalCalories += point.value[0].fpVal;
        }
      }
    }

    if (totalCalories > 0) {
      const logId = `${userId}_${dateString}`;
      const logRef = db.collection('dailyActivityLogs').doc(logId);
      
      // Get existing log to preserve steps data
      const existingLog = await logRef.get();
      const existingData = existingLog.exists ? existingLog.data() : {};
      
      await logRef.set({
        id: logId,
        userId,
        date: dateString,
        steps: existingData.steps || 0,
        calories: totalCalories,
        source: 'google_fit',
        syncedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }
  }
}
