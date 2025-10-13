import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

interface Team {
  id: string;
  name: string;
  memberIds: string[];
  isActive: boolean;
}

interface DailyActivityLog {
  id: string;
  userId: string;
  date: string;
  steps: number;
  calories: number;
}

interface User {
  uid: string;
  displayName?: string;
  email: string;
}

interface TeamMemberStats {
  userId: string;
  displayName: string;
  steps: number;
  calories: number;
}

interface TeamLeaderboardEntry {
  teamId: string;
  teamName: string;
  totalSteps: number;
  totalCalories: number;
  memberCount: number;
  members: TeamMemberStats[];
}

interface MonthlyLeaderboard {
  id: string;
  month: string;
  year: number;
  teams: TeamLeaderboardEntry[];
  lastUpdated: admin.firestore.Timestamp;
}

/**
 * Scheduled function that runs daily at midnight UTC to update monthly leaderboards
 */
export const updateMonthlyLeaderboards = functions.pubsub
  .schedule('0 0 * * *') // Daily at midnight UTC
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Starting monthly leaderboard update...');
    
    try {
      const now = new Date();
      const currentMonth = now.toLocaleString('default', { month: 'long' });
      const currentYear = now.getFullYear();
      
      // Update current month's leaderboard
      await updateLeaderboardForMonth(currentMonth, currentYear);
      
      console.log(`Updated leaderboard for ${currentMonth} ${currentYear}`);
    } catch (error) {
      console.error('Error updating monthly leaderboards:', error);
      throw error;
    }
  });

/**
 * Update leaderboard for a specific month and year
 */
async function updateLeaderboardForMonth(month: string, year: number): Promise<void> {
  try {
    // Get all active teams
    const teamsSnapshot = await db
      .collection('teams')
      .where('isActive', '==', true)
      .get();

    if (teamsSnapshot.empty) {
      console.log('No active teams found');
      return;
    }

    console.log(`Found ${teamsSnapshot.size} active teams`);

    // Calculate team statistics for the month
    const teamEntries: TeamLeaderboardEntry[] = [];
    
    for (const teamDoc of teamsSnapshot.docs) {
      const team = { id: teamDoc.id, ...teamDoc.data() } as Team;
      
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
    const leaderboardData: MonthlyLeaderboard = {
      id: leaderboardId,
      month,
      year,
      teams: teamEntries,
      lastUpdated: admin.firestore.Timestamp.now(),
    };

    await db
      .collection('monthlyLeaderboards')
      .doc(leaderboardId)
      .set(leaderboardData, { merge: true });

    console.log(`Updated leaderboard with ${teamEntries.length} teams`);
  } catch (error) {
    console.error(`Error updating leaderboard for ${month} ${year}:`, error);
    throw error;
  }
}

/**
 * Calculate team statistics for a specific month
 */
async function calculateTeamStats(
  team: Team,
  month: string,
  year: number
): Promise<TeamLeaderboardEntry | null> {
  try {
    // Get date range for the month
    const startDate = new Date(year, getMonthIndex(month), 1);
    const endDate = new Date(year, getMonthIndex(month) + 1, 0);
    
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];

    // Get all team members' activity for the month
    const memberStats: TeamMemberStats[] = [];
    let totalSteps = 0;
    let totalCalories = 0;

    for (const memberId of team.memberIds) {
      try {
        // Get user info
        const userDoc = await db.collection('users').doc(memberId).get();
        if (!userDoc.exists) continue;
        
        const user = userDoc.data() as User;
        
        // Get user's activity logs for the month
        const activitySnapshot = await db
          .collection('dailyActivityLogs')
          .where('userId', '==', memberId)
          .where('date', '>=', startDateString)
          .where('date', '<=', endDateString)
          .get();

        let memberSteps = 0;
        let memberCalories = 0;

        activitySnapshot.docs.forEach(doc => {
          const activity = doc.data() as DailyActivityLog;
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

/**
 * Get month index from month name
 */
function getMonthIndex(monthName: string): number {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months.indexOf(monthName);
}

/**
 * Manual trigger function to update leaderboards for any month/year
 * Can be called via HTTP or Firebase console
 */
export const updateLeaderboardManually = functions.https.onCall(
  async (data, context) => {
    // Verify user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated to trigger leaderboard update'
      );
    }

    const { month, year } = data;
    
    if (!month || !year) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Month and year are required'
      );
    }

    try {
      await updateLeaderboardForMonth(month, year);
      return { success: true, message: `Updated leaderboard for ${month} ${year}` };
    } catch (error) {
      console.error('Error in manual leaderboard update:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to update leaderboard'
      );
    }
  }
);
