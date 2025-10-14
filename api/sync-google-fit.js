// Vercel Serverless Function for Google Fit Sync
// Deploy to: /api/sync-google-fit.js

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleAuth } from 'google-auth-library';
import { fitness_v1 } from 'googleapis';

// Firebase config for fitspark-2 project
const firebaseConfig = {
  apiKey: "AIzaSyAI_StR3wQSNcEZb78eFrVdz5HoGaXgcHg",
  authDomain: "fitspark-2.firebaseapp.com",
  projectId: "fitspark-2",
  storageBucket: "fitspark-2.firebasestorage.app",
  messagingSenderId: "996004291289",
  appId: "1:996004291289:web:dad5a0de6b0c1eff1e54c8",
  measurementId: "G-W2J6MW7NWL"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple authentication check (you can add more security)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting Google Fit data sync...');
    
    // Get all users with Google Fit connected
    const usersSnapshot = await getDocs(
      query(collection(db, 'users'), where('googleFitConnected', '==', true))
    );

    if (usersSnapshot.empty) {
      console.log('No users with Google Fit connected');
      return res.status(200).json({ message: 'No users to sync' });
    }

    console.log(`Found ${usersSnapshot.size} users with Google Fit connected`);

    // Process each user
    const results = [];
    for (const userDoc of usersSnapshot.docs) {
      const user = userDoc.data();
      try {
        await syncUserGoogleFitData(user);
        results.push({ userId: user.uid, status: 'success' });
      } catch (error) {
        console.error(`Error syncing user ${user.uid}:`, error);
        results.push({ userId: user.uid, status: 'error', error: error.message });
      }
    }

    console.log('Google Fit data sync completed');
    return res.status(200).json({ 
      message: 'Sync completed', 
      results,
      syncedUsers: results.filter(r => r.status === 'success').length
    });

  } catch (error) {
    console.error('Error in Google Fit sync:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function syncUserGoogleFitData(user) {
  if (!user.googleFitRefreshToken) {
    throw new Error('No refresh token available');
  }

  // Initialize Google Auth
  const auth = new GoogleAuth({
    credentials: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: user.googleFitRefreshToken,
    },
    scopes: [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read'
    ]
  });

  const fitness = new fitness_v1.Fitness({ auth });

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
  await updateDoc(doc(db, 'users', user.uid), {
    googleFitLastSync: serverTimestamp(),
  });
}

async function syncStepsData(fitness, userId, startTimeMillis, endTimeMillis) {
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

    const data = response.data;
    await processAndStoreStepsData(data, userId);
  } catch (error) {
    console.error(`Error syncing steps for user ${userId}:`, error);
  }
}

async function syncCaloriesData(fitness, userId, startTimeMillis, endTimeMillis) {
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

    const data = response.data;
    await processAndStoreCaloriesData(data, userId);
  } catch (error) {
    console.error(`Error syncing calories for user ${userId}:`, error);
  }
}

async function processAndStoreStepsData(data, userId) {
  for (const bucket of data.bucket || []) {
    const date = new Date(parseInt(bucket.startTimeMillis));
    const dateString = date.toISOString().split('T')[0];
    
    let totalSteps = 0;
    for (const dataset of bucket.dataset || []) {
      for (const point of dataset.point || []) {
        if (point.value && point.value[0] && point.value[0].intVal) {
          totalSteps += point.value[0].intVal;
        }
      }
    }

    if (totalSteps > 0) {
      const logId = `${userId}_${dateString}`;
      const logRef = doc(db, 'dailyActivityLogs', logId);
      
      await setDoc(logRef, {
        id: logId,
        userId,
        date: dateString,
        steps: totalSteps,
        calories: 0, // Will be updated separately
        source: 'google_fit',
        syncedAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      }, { merge: true });
    }
  }
}

async function processAndStoreCaloriesData(data, userId) {
  for (const bucket of data.bucket || []) {
    const date = new Date(parseInt(bucket.startTimeMillis));
    const dateString = date.toISOString().split('T')[0];
    
    let totalCalories = 0;
    for (const dataset of bucket.dataset || []) {
      for (const point of dataset.point || []) {
        if (point.value && point.value[0] && point.value[0].fpVal) {
          totalCalories += point.value[0].fpVal;
        }
      }
    }

    if (totalCalories > 0) {
      const logId = `${userId}_${dateString}`;
      const logRef = doc(db, 'dailyActivityLogs', logId);
      
      await setDoc(logRef, {
        id: logId,
        userId,
        date: dateString,
        steps: 0, // Will be updated separately
        calories: totalCalories,
        source: 'google_fit',
        syncedAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      }, { merge: true });
    }
  }
}
