import { updateDailyActivity } from './firestoreService';

// Extend Window interface to include gapi
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gapi: any;
  }
}

// Google Fit API configuration
const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read'
];

const GOOGLE_FIT_DISCOVERY_DOC = 'https://fitness.googleapis.com/$discovery/rest?version=v1';

// Types for Google Fit API responses
// interface GoogleFitDataSource {
//   dataType: {
//     name: string;
//     field: Array<{
//       name: string;
//       format: string;
//     }>;
//   };
//   dataStreamId: string;
//   dataStreamName: string;
//   type: string;
// }

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

class GoogleFitService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private gapi: any = null;
  private isInitialized = false;

  async initGoogleFit(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google API script if not already loaded
      if (typeof window !== 'undefined' && !window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('client:auth2', () => {
            this.initializeGapi(resolve, reject);
          });
        };
        script.onerror = reject;
        document.head.appendChild(script);
      } else if (window.gapi) {
        this.initializeGapi(resolve, reject);
      } else {
        reject(new Error('Failed to load Google API'));
      }
    });
  }

  private async initializeGapi(resolve: () => void, reject: (error: unknown) => void): Promise<void> {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

      if (!clientId || !apiKey) {
        throw new Error('Google API credentials not configured');
      }

      await window.gapi.client.init({
        apiKey,
        clientId,
        discoveryDocs: [GOOGLE_FIT_DISCOVERY_DOC],
        scope: GOOGLE_FIT_SCOPES.join(' ')
      });

      this.gapi = window.gapi;
      this.isInitialized = true;
      resolve();
    } catch (error) {
      reject(error);
    }
  }

  async connectGoogleFit(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initGoogleFit();
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      
      if (user.isSignedIn()) {
        // Update user's Google Fit connection status in Firestore
        await this.updateUserGoogleFitStatus(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting to Google Fit:', error);
      return false;
    }
  }

  async disconnectGoogleFit(): Promise<void> {
    if (!this.isInitialized) {
      await this.initGoogleFit();
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      
      // Update user's Google Fit connection status in Firestore
      await this.updateUserGoogleFitStatus(false);
    } catch (error) {
      console.error('Error disconnecting from Google Fit:', error);
    }
  }

  async isConnected(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initGoogleFit();
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      return authInstance.isSignedIn.get();
    } catch (error) {
      console.error('Error checking Google Fit connection:', error);
      return false;
    }
  }

  async getLastSyncTime(): Promise<Date | null> {
    // This would typically be stored in user's profile or a separate sync log
    // For now, we'll return null to indicate no previous sync
    return null;
  }

  async syncDailySteps(startDate: Date, endDate: Date): Promise<void> {
    if (!this.isInitialized) {
      await this.initGoogleFit();
    }

    try {
      const stepsData = await this.fetchStepsData(startDate, endDate);
      await this.processAndStoreStepsData(stepsData);
    } catch (error) {
      console.error('Error syncing daily steps:', error);
      throw error;
    }
  }

  async syncCalories(startDate: Date, endDate: Date): Promise<void> {
    if (!this.isInitialized) {
      await this.initGoogleFit();
    }

    try {
      const caloriesData = await this.fetchCaloriesData(startDate, endDate);
      await this.processAndStoreCaloriesData(caloriesData);
    } catch (error) {
      console.error('Error syncing calories:', error);
      throw error;
    }
  }

  private async fetchStepsData(startDate: Date, endDate: Date): Promise<GoogleFitResponse> {
    const startTimeMillis = startDate.getTime();
    const endTimeMillis = endDate.getTime();

    const response = await this.gapi.client.fitness.users.dataset.aggregate({
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

    return response.result;
  }

  private async fetchCaloriesData(startDate: Date, endDate: Date): Promise<GoogleFitResponse> {
    const startTimeMillis = startDate.getTime();
    const endTimeMillis = endDate.getTime();

    const response = await this.gapi.client.fitness.users.dataset.aggregate({
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

    return response.result;
  }

  private async processAndStoreStepsData(data: GoogleFitResponse): Promise<void> {
    const userId = await this.getCurrentUserId();
    
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

      if (totalSteps > 0 && dateString) {
        await updateDailyActivity(userId, {
          date: dateString,
          steps: totalSteps,
          calories: 0 // Will be updated separately
        });
      }
    }
  }

  private async processAndStoreCaloriesData(data: GoogleFitResponse): Promise<void> {
    const userId = await this.getCurrentUserId();
    
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

      if (totalCalories > 0 && dateString) {
        // Get existing activity log and update calories
        const existingLog = await this.getExistingActivityLog();
        await updateDailyActivity(userId, {
          date: dateString,
          steps: existingLog?.steps || 0,
          calories: totalCalories
        });
      }
    }
  }

  private async getCurrentUserId(): Promise<string> {
    // This should get the current authenticated user's ID
    // For now, we'll use a placeholder - this should be replaced with actual auth logic
    const auth = this.gapi.auth2.getAuthInstance();
    const user = auth.currentUser.get();
    return user.getId();
  }

  private async getExistingActivityLog(): Promise<{ steps: number } | null> {
    // This would fetch existing activity log for the date
    // For now, return null - this should be implemented with actual Firestore query
    return null;
  }

  private async updateUserGoogleFitStatus(connected: boolean): Promise<void> {
    // This would update the user's Google Fit connection status in Firestore
    // For now, this is a placeholder - should be implemented with actual user update logic
    console.log(`Google Fit connection status updated: ${connected}`);
  }
}

// Export singleton instance
export const googleFitService = new GoogleFitService();

// Export individual functions for easier testing
export const initGoogleFit = () => googleFitService.initGoogleFit();
export const connectGoogleFit = () => googleFitService.connectGoogleFit();
export const disconnectGoogleFit = () => googleFitService.disconnectGoogleFit();
export const isGoogleFitConnected = () => googleFitService.isConnected();
export const getLastSyncTime = () => googleFitService.getLastSyncTime();
export const syncDailySteps = (startDate: Date, endDate: Date) => 
  googleFitService.syncDailySteps(startDate, endDate);
export const syncCalories = (startDate: Date, endDate: Date) => 
  googleFitService.syncCalories(startDate, endDate);
