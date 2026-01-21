// Express server for Render deployment
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleAuth } from 'google-auth-library';
import { fitness_v1 } from 'googleapis';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app_firebase = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app_firebase);

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Core function for Google Fit sync (can be called by route or cron)
async function performGoogleFitSync() {
  console.log('Starting Google Fit data sync...');
  
  const usersSnapshot = await getDocs(
    query(collection(db, 'users'), where('googleFitConnected', '==', true))
  );

  if (usersSnapshot.empty) {
    console.log('No users with Google Fit connected');
    return { message: 'No users to sync', results: [], syncedUsers: 0 };
  }

  console.log(`Found ${usersSnapshot.size} users with Google Fit connected`);

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
  return { 
    message: 'Sync completed', 
    results,
    syncedUsers: results.filter(r => r.status === 'success').length
  };
}

// Google Fit Sync endpoint
app.post('/api/sync-google-fit', authenticate, async (req, res) => {
  try {
    const result = await performGoogleFitSync();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in Google Fit sync:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Core function for leaderboard update (can be called by route or cron)
async function performLeaderboardUpdate(month, year) {
  if (!month || !year) {
    throw new Error('Month and year are required');
  }

  console.log(`Updating leaderboard for ${month} ${year}...`);
  
  const teamsSnapshot = await getDocs(
    query(collection(db, 'teams'), where('isActive', '==', true))
  );

  if (teamsSnapshot.empty) {
    return { message: 'No active teams found', teamsCount: 0, month, year };
  }

  console.log(`Found ${teamsSnapshot.size} active teams`);

  const teamEntries = [];
  
  for (const teamDoc of teamsSnapshot.docs) {
    const team = { id: teamDoc.id, ...teamDoc.data() };
    
    try {
      const teamEntry = await calculateTeamStats(team, month, year);
      if (teamEntry) {
        teamEntries.push(teamEntry);
      }
    } catch (error) {
      console.error(`Error calculating stats for team ${team.id}:`, error);
    }
  }

  teamEntries.sort((a, b) => b.totalSteps - a.totalSteps);

  const leaderboardId = `${year}-${month}`;
  const leaderboardData = {
    id: leaderboardId,
    month,
    year,
    teams: teamEntries,
    lastUpdated: serverTimestamp(),
  };

  await setDoc(
    doc(db, 'monthlyLeaderboards', leaderboardId),
    leaderboardData,
    { merge: true }
  );

  console.log(`Updated leaderboard with ${teamEntries.length} teams`);
  
  return { 
    message: 'Leaderboard updated successfully',
    teamsCount: teamEntries.length,
    month,
    year
  };
}

// Leaderboard Update endpoint
app.post('/api/update-leaderboards', authenticate, async (req, res) => {
  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const result = await performLeaderboardUpdate(month, year);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error updating leaderboards:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
async function syncUserGoogleFitData(user) {
  if (!user.googleFitRefreshToken) {
    throw new Error('No refresh token available');
  }

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

  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 7);

  const startTimeMillis = startTime.getTime();
  const endTimeMillis = endTime.getTime();

  await syncStepsData(fitness, user.uid, startTimeMillis, endTimeMillis);
  await syncCaloriesData(fitness, user.uid, startTimeMillis, endTimeMillis);

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

async function calculateTeamStats(team, month, year) {
  try {
    const startDate = new Date(year, getMonthIndex(month), 1);
    const endDate = new Date(year, getMonthIndex(month) + 1, 0);
    
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    const memberStats = [];
    let totalSteps = 0;
    let totalCalories = 0;

    for (const memberId of team.memberIds) {
      try {
        const userDoc = await getDocs(
          query(collection(db, 'users'), where('uid', '==', memberId))
        );
        
        if (userDoc.empty) continue;
        
        const user = userDoc.docs[0].data();
        
        const activitySnapshot = await getDocs(
          query(
            collection(db, 'dailyActivityLogs'),
            where('userId', '==', memberId),
            where('date', '>=', startDateString),
            where('date', '<=', endDateString)
          )
        );

        let memberSteps = 0;
        let memberCalories = 0;

        activitySnapshot.docs.forEach(doc => {
          const activity = doc.data();
          memberSteps += activity.steps || 0;
          memberCalories += activity.calories || 0;
        });

        memberStats.push({
          userId: memberId,
          displayName: user.displayName || user.email,
          steps: memberSteps,
          calories: memberCalories,
        });

        totalSteps += memberSteps;
        totalCalories += memberCalories;
      } catch (error) {
        console.error(`Error getting stats for member ${memberId}:`, error);
      }
    }

    memberStats.sort((a, b) => b.steps - a.steps);

    return {
      teamId: team.id,
      teamName: team.name,
      totalSteps,
      totalCalories,
      memberCount: team.memberIds.length,
      members: memberStats,
    };
  } catch (error) {
    console.error(`Error calculating team stats for ${team.id}:`, error);
    return null;
  }
}

function getMonthIndex(monthName) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months.indexOf(monthName);
}

// Scheduled tasks using node-cron
// Google Fit sync - runs daily at 12:00 PM UTC
cron.schedule('0 12 * * *', async () => {
  console.log('Running scheduled Google Fit sync...');
  try {
    const result = await performGoogleFitSync();
    console.log('Scheduled sync result:', result);
  } catch (error) {
    console.error('Error in scheduled sync:', error);
  }
});

// Leaderboard update - runs daily at midnight UTC
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled leaderboard update...');
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();
  
  try {
    const result = await performLeaderboardUpdate(month, year);
    console.log('Scheduled leaderboard update result:', result);
  } catch (error) {
    console.error('Error in scheduled leaderboard update:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
