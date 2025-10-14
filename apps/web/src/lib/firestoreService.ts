import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  WorkoutLog,
  WorkoutProgram,
  MetricSnapshot,
  Exercise,
  CreateWorkoutLog,
  CreateMetricSnapshot,
  Team,
  TeamInvitation,
  DailyActivityLog,
  MonthlyLeaderboard,
  CreateTeam,
  UpdateDailyActivity,
} from "@fitspark/shared";

// --- Generic Document ---
export async function getDocument<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

// --- Workout Logs ---
export function onWorkoutLogsUpdate(
  userId: string,
  callback: (logs: WorkoutLog[]) => void
) {
  const q = query(collection(db, "workoutLogs"), where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Safely convert Timestamps to Dates
      timestamp: doc.data().timestamp?.toDate(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
    })) as WorkoutLog[];

    // Sort by timestamp descending in JavaScript to avoid Firestore indexing issues
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    callback(logs);
  });
}

export async function addWorkoutLog(
  userId: string,
  logData: CreateWorkoutLog
): Promise<string> {
  const newLog = {
    ...logData,
    userId: userId,
    timestamp: serverTimestamp(),
    startTime: serverTimestamp(),
    completed: false,
  };
  const docRef = await addDoc(collection(db, "workoutLogs"), newLog);
  return docRef.id;
}

export function updateWorkoutLog(
  logId: string,
  updates: Partial<WorkoutLog>
): Promise<void> {
  const logRef = doc(db, "workoutLogs", logId);
  return updateDoc(logRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export function deleteWorkoutLog(logId: string): Promise<void> {
  return deleteDoc(doc(db, "workoutLogs", logId));
}

// --- Exercises ---
export async function getExercises(): Promise<Exercise[]> {
  const querySnapshot = await getDocs(collection(db, "exercises"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Exercise[];
}

// --- Metric Snapshots ---
export function onMetricSnapshotsUpdate(
  userId: string,
  callback: (metrics: MetricSnapshot[]) => void
) {
  const q = query(
    collection(db, "metricSnapshots"),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snapshot) => {
    const metrics = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as MetricSnapshot[];

    // Sort in JavaScript
    metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    callback(metrics);
  });
}

export async function addMetricSnapshot(
  userId: string,
  metricData: CreateMetricSnapshot
): Promise<string> {
  const newMetric = {
    ...metricData,
    userId: userId,
    timestamp: Timestamp.fromDate(new Date()),
  };
  const docRef = await addDoc(collection(db, "metricSnapshots"), newMetric);
  return docRef.id;
}

// --- Workout Programs ---
export async function getPublicWorkoutPrograms(): Promise<WorkoutProgram[]> {
  const q = query(
    collection(db, "workoutPrograms"),
    where("visibility", "==", "public")
  );
  const querySnapshot = await getDocs(q);
  const programs = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as WorkoutProgram[];

  // Sort in JavaScript
  programs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return programs;
}

// --- Team Management ---
export async function createTeam(
  leaderId: string,
  teamData: CreateTeam
): Promise<string> {
  const newTeam = {
    ...teamData,
    leaderId,
    memberIds: [leaderId], // Leader is automatically a member
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    currentMonthTotal: { steps: 0, calories: 0 },
    isActive: true,
  };
  const docRef = await addDoc(collection(db, "teams"), newTeam);
  return docRef.id;
}

export async function getTeam(teamId: string): Promise<Team | null> {
  return getDocument<Team>("teams", teamId);
}

export async function updateTeam(
  teamId: string,
  updates: Partial<Team>
): Promise<void> {
  const teamRef = doc(db, "teams", teamId);
  return updateDoc(teamRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function addTeamMember(teamId: string, userId: string): Promise<void> {
  const teamRef = doc(db, "teams", teamId);
  const team = await getTeam(teamId);
  
  if (!team) {
    throw new Error("Team not found");
  }
  
  if (team.memberIds.includes(userId)) {
    throw new Error("User is already a member of this team");
  }
  
  return updateDoc(teamRef, {
    memberIds: [...team.memberIds, userId],
    updatedAt: serverTimestamp(),
  });
}

export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  const teamRef = doc(db, "teams", teamId);
  const team = await getTeam(teamId);
  
  if (!team) {
    throw new Error("Team not found");
  }
  
  if (team.leaderId === userId) {
    throw new Error("Cannot remove team leader");
  }
  
  const updatedMemberIds = team.memberIds.filter((id: string) => id !== userId);
  
  return updateDoc(teamRef, {
    memberIds: updatedMemberIds,
    updatedAt: serverTimestamp(),
  });
}

export async function leaveTeam(teamId: string, userId: string): Promise<void> {
  const team = await getTeam(teamId);
  
  if (!team) {
    throw new Error("Team not found");
  }
  
  if (team.leaderId === userId) {
    throw new Error("Team leader cannot leave team. Transfer leadership first.");
  }
  
  return removeTeamMember(teamId, userId);
}

// --- Team Invitations ---
export async function sendTeamInvitation(
  teamId: string,
  invitedUserId: string,
  invitedByUserId: string
): Promise<string> {
  const team = await getTeam(teamId);
  
  if (!team) {
    throw new Error("Team not found");
  }
  
  if (team.memberIds.includes(invitedUserId)) {
    throw new Error("User is already a member of this team");
  }
  
  const invitation = {
    teamId,
    teamName: team.name,
    invitedUserId,
    invitedByUserId,
    status: "pending" as const,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  };
  
  const docRef = await addDoc(collection(db, "teamInvitations"), invitation);
  return docRef.id;
}

export async function respondToInvitation(
  invitationId: string,
  status: "accepted" | "rejected"
): Promise<void> {
  const invitationRef = doc(db, "teamInvitations", invitationId);
  const invitation = await getDocument<TeamInvitation>("teamInvitations", invitationId);
  
  if (!invitation) {
    throw new Error("Invitation not found");
  }
  
  if (status === "accepted") {
    // Add user to team
    await addTeamMember(invitation.teamId, invitation.invitedUserId);
  }
  
  return updateDoc(invitationRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export function onTeamInvitationsUpdate(
  userId: string,
  callback: (invitations: TeamInvitation[]) => void
) {
  const q = query(
    collection(db, "teamInvitations"),
    where("invitedUserId", "==", userId),
    where("status", "==", "pending")
  );

  return onSnapshot(q, (snapshot) => {
    const invitations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate(),
    })) as TeamInvitation[];

    callback(invitations);
  });
}

// --- Daily Activity Logs ---
export async function updateDailyActivity(
  userId: string,
  activityData: UpdateDailyActivity
): Promise<string> {
  const logId = `${userId}_${activityData.date}`;
  const logRef = doc(db, "dailyActivityLogs", logId);
  
  const logData = {
    userId,
    ...activityData,
    source: "google_fit" as const,
    syncedAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
  };
  
  // Use setDoc with merge to create or update
  await updateDoc(logRef, logData).catch(async () => {
    // If document doesn't exist, create it
    await addDoc(collection(db, "dailyActivityLogs"), {
      id: logId,
      ...logData,
    });
  });
  
  return logId;
}

export async function getUserDailyActivity(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DailyActivityLog[]> {
  const q = query(
    collection(db, "dailyActivityLogs"),
    where("userId", "==", userId),
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    syncedAt: doc.data().syncedAt?.toDate(),
    lastUpdated: doc.data().lastUpdated?.toDate(),
  })) as DailyActivityLog[];
}

// --- Monthly Leaderboards ---
export async function getMonthlyLeaderboard(
  month: string,
  year: number
): Promise<MonthlyLeaderboard | null> {
  const leaderboardId = `${year}-${month}`;
  return getDocument<MonthlyLeaderboard>("monthlyLeaderboards", leaderboardId);
}

export async function updateMonthlyLeaderboard(
  month: string,
  year: number,
  leaderboardData: MonthlyLeaderboard
): Promise<void> {
  const leaderboardId = `${year}-${month}`;
  const leaderboardRef = doc(db, "monthlyLeaderboards", leaderboardId);
  
  return updateDoc(leaderboardRef, {
    ...leaderboardData,
    lastUpdated: serverTimestamp(),
  }).catch(async () => {
    // If document doesn't exist, create it
    await addDoc(collection(db, "monthlyLeaderboards"), {
      ...leaderboardData,
      id: leaderboardId,
      lastUpdated: serverTimestamp(),
    });
  });
}
