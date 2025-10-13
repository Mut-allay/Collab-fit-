// Vercel Serverless Function for Leaderboard Updates
// Deploy to: /api/update-leaderboards.js

import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authentication check
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { month, year } = req.body;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    console.log(`Updating leaderboard for ${month} ${year}...`);
    
    // Get all active teams
    const teamsSnapshot = await getDocs(
      query(collection(db, 'teams'), where('isActive', '==', true))
    );

    if (teamsSnapshot.empty) {
      return res.status(200).json({ message: 'No active teams found' });
    }

    console.log(`Found ${teamsSnapshot.size} active teams`);

    // Calculate team statistics for the month
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

    // Sort teams by total steps (descending)
    teamEntries.sort((a, b) => b.totalSteps - a.totalSteps);

    // Create or update the monthly leaderboard
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
    
    return res.status(200).json({ 
      message: 'Leaderboard updated successfully',
      teamsCount: teamEntries.length,
      month,
      year
    });

  } catch (error) {
    console.error('Error updating leaderboards:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function calculateTeamStats(team, month, year) {
  try {
    // Get date range for the month
    const startDate = new Date(year, getMonthIndex(month), 1);
    const endDate = new Date(year, getMonthIndex(month) + 1, 0);
    
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    // Get all team members' activity for the month
    const memberStats = [];
    let totalSteps = 0;
    let totalCalories = 0;

    for (const memberId of team.memberIds) {
      try {
        // Get user info
        const userDoc = await getDocs(
          query(collection(db, 'users'), where('uid', '==', memberId))
        );
        
        if (userDoc.empty) continue;
        
        const user = userDoc.docs[0].data();
        
        // Get user's activity logs for the month
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

    // Sort members by steps (descending)
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
