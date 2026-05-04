import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase-admin/app';
import { cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { google } from 'googleapis';
import express from 'express';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

/** Comma-separated `FRONTEND_URL` values (e.g. prod + http://localhost:5173). */
function parseFrontendUrls() {
  const raw = process.env.FRONTEND_URL || '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function getDefaultFrontendUrl() {
  const list = parseFrontendUrls();
  return list[0] || 'http://localhost:5173';
}

/**
 * After Google Fit OAuth, redirect only to allowed origins (no open redirects).
 * Allows localhost / 127.0.0.1 and any origin listed in FRONTEND_URL.
 */
function isAllowedReturnOrigin(returnOrigin) {
  if (!returnOrigin || typeof returnOrigin !== 'string') return false;
  let u;
  try {
    u = new URL(returnOrigin);
  } catch {
    return false;
  }
  if (u.pathname && u.pathname !== '/') return false;
  const h = u.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return true;
  for (const o of parseFrontendUrls()) {
    try {
      if (new URL(o).origin === u.origin) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}

function resolveFrontendRedirect(returnOrigin) {
  const fallback = getDefaultFrontendUrl().replace(/\/$/, '');
  if (!returnOrigin || typeof returnOrigin !== 'string') return fallback;
  const normalized = returnOrigin.replace(/\/$/, '');
  if (!isAllowedReturnOrigin(normalized)) return fallback;
  return normalized;
}

function getCorsOriginOption() {
  const list = parseFrontendUrls();
  if (list.length === 0) return '*';
  if (list.length === 1) return list[0];
  return list;
}

function getAdminCredential() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  if (rawJson?.startsWith('{')) {
    const sa = JSON.parse(rawJson);
    return cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key.replace(/\\n/g, '\n'),
    });
  }
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Set FIREBASE_SERVICE_ACCOUNT (JSON) or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY',
    );
  }
  return cert({ projectId, clientEmail, privateKey });
}

// ---------------------------------------------------------------------------
// Firebase Admin SDK — bypasses Firestore security rules entirely
// ---------------------------------------------------------------------------
initializeApp({
  credential: getAdminCredential(),
});

const db = getFirestore();
const adminAuth = getAuth();

// ---------------------------------------------------------------------------
// Express
// ---------------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: getCorsOriginOption() }));
app.use(express.json());

// ---------------------------------------------------------------------------
// Google OAuth2 helpers
// ---------------------------------------------------------------------------
function createOAuth2Client(refreshToken = null) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI, // e.g. https://your-app.onrender.com/api/auth/google/callback
  );
  if (refreshToken) {
    client.setCredentials({ refresh_token: refreshToken });
  }
  return client;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// For cron-job.org endpoints — shared API key in Authorization header
function verifyApiKey(req, res, next) {
  if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// For user-facing endpoints — Firebase ID token
async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decoded = await adminAuth.verifyIdToken(header.split('Bearer ')[1]);
    req.uid = decoded.uid;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ---------------------------------------------------------------------------
// Health check — also used as a keep-alive ping by UptimeRobot / cron-job.org
// ---------------------------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Google Fit OAuth flow
// ---------------------------------------------------------------------------

/**
 * Step 1 — Frontend redirects the user here to start the OAuth consent flow.
 * Query params: userId (Firebase UID of the logged-in user)
 */
app.get('/api/auth/google', (req, res) => {
  const { userId, returnOrigin } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const originStr =
    typeof returnOrigin === 'string' ? returnOrigin.replace(/\/$/, '') : '';
  if (originStr && !isAllowedReturnOrigin(originStr)) {
    return res.status(400).json({ error: 'Invalid returnOrigin' });
  }

  // Encode userId (and optional returnOrigin) into state for post-callback redirect
  const state = Buffer.from(
    JSON.stringify({
      userId,
      ts: Date.now(),
      ...(originStr ? { returnOrigin: originStr } : {}),
    }),
  ).toString('base64');

  const authUrl = createOAuth2Client().generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Forces Google to return a refresh_token every time
    scope: [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read',
      'https://www.googleapis.com/auth/fitness.location.read',
    ],
    state,
  });

  res.redirect(authUrl);
});

/**
 * Step 2 — Google redirects back here after the user grants (or denies) access.
 * Exchanges the auth code for tokens and stores them in Firestore.
 * Then redirects the user back to the frontend.
 */
app.get('/api/auth/google/callback', async (req, res) => {
  const fallbackFront = getDefaultFrontendUrl().replace(/\/$/, '');
  const { code, state, error } = req.query;

  const frontendFromState = () => {
    if (!state || typeof state !== 'string') return fallbackFront;
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64').toString());
      return resolveFrontendRedirect(parsed.returnOrigin);
    } catch {
      return fallbackFront;
    }
  };

  if (error) {
    console.error('OAuth denied:', error);
    const fu = frontendFromState();
    return res.redirect(`${fu}/profile?googleFit=error`);
  }

  let userId;
  let returnOrigin;
  try {
    const parsed = JSON.parse(Buffer.from(state, 'base64').toString());
    userId = parsed.userId;
    returnOrigin = parsed.returnOrigin;
  } catch {
    return res.redirect(`${fallbackFront}/profile?googleFit=error`);
  }

  const frontendUrl = resolveFrontendRedirect(returnOrigin);

  try {
    const client = createOAuth2Client();
    const { tokens } = await client.getToken(code);

    if (!tokens.refresh_token) {
      // Can happen if the user already authorized without 'prompt: consent'.
      // The initiation URL uses prompt:'consent' to prevent this.
      console.error('No refresh_token received for user', userId);
      return res.redirect(
        `${frontendUrl}/profile?googleFit=error&reason=no_refresh_token`,
      );
    }

    await db.collection('users').doc(userId).update({
      googleFitConnected: true,
      googleFitRefreshToken: tokens.refresh_token,
      googleFitLastSync: null,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`Google Fit connected for user ${userId}`);
    return res.redirect(`${frontendUrl}/profile?googleFit=connected`);
  } catch (err) {
    console.error('Error exchanging OAuth code:', err);
    return res.redirect(`${frontendUrl}/profile?googleFit=error`);
  }
});

/**
 * Disconnect — removes stored tokens and marks the user as disconnected.
 * Authenticated via Firebase ID token so only the owner can disconnect.
 */
app.delete('/api/auth/google/disconnect', verifyFirebaseToken, async (req, res) => {
  try {
    await db.collection('users').doc(req.uid).update({
      googleFitConnected: false,
      googleFitRefreshToken: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Disconnect error:', err);
    res.status(500).json({ error: 'Failed to disconnect' });
  }
});

// ---------------------------------------------------------------------------
// Sync endpoints
// ---------------------------------------------------------------------------

/**
 * Sync a single user's data — called by the frontend "Sync Now" button.
 * Authenticated via Firebase ID token.
 */
app.post('/api/sync-google-fit/me', verifyFirebaseToken, async (req, res) => {
  try {
    const snap = await db.collection('users').doc(req.uid).get();
    if (!snap.exists) return res.status(404).json({ error: 'User not found' });

    const user = { uid: req.uid, ...snap.data() };
    if (!user.googleFitConnected || !user.googleFitRefreshToken) {
      return res.status(400).json({ error: 'Google Fit not connected' });
    }

    await syncUserGoogleFitData(user);
    res.json({ success: true, message: 'Sync complete' });
  } catch (err) {
    console.error('User sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

/**
 * Sync all connected users — called daily by cron-job.org.
 * Authenticated via API secret key.
 */
app.post('/api/sync-google-fit', verifyApiKey, async (req, res) => {
  try {
    const snapshot = await db.collection('users')
      .where('googleFitConnected', '==', true)
      .get();

    if (snapshot.empty) {
      return res.json({ message: 'No connected users', syncedUsers: 0 });
    }

    const results = [];
    for (const docSnap of snapshot.docs) {
      const user = { uid: docSnap.id, ...docSnap.data() };
      try {
        await syncUserGoogleFitData(user);
        results.push({ userId: user.uid, status: 'success' });
      } catch (err) {
        console.error(`Sync failed for ${user.uid}:`, err.message);
        results.push({ userId: user.uid, status: 'error', error: err.message });
      }
    }

    res.json({
      message: 'Bulk sync complete',
      syncedUsers: results.filter(r => r.status === 'success').length,
      results,
    });
  } catch (err) {
    console.error('Bulk sync error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update monthly leaderboards — called daily at 00:05 UTC by cron-job.org.
 * Authenticated via API secret key.
 */
app.post('/api/update-leaderboards', verifyApiKey, async (req, res) => {
  try {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const result = await performLeaderboardUpdate(month, year);
    res.json(result);
  } catch (err) {
    console.error('Leaderboard update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

async function syncUserGoogleFitData(user) {
  const auth = createOAuth2Client(user.googleFitRefreshToken);
  const fitness = google.fitness({ version: 'v1', auth });

  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 7); // Pull last 7 days on each sync

  await syncActivityData(
    fitness,
    user.uid,
    startTime.getTime().toString(),
    endTime.getTime().toString(),
  );

  await db.collection('users').doc(user.uid).update({
    googleFitLastSync: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

async function syncActivityData(fitness, userId, startTimeMillis, endTimeMillis) {
  const response = await fitness.users.dataset.aggregate({
    userId: 'me',
    requestBody: {
      aggregateBy: [
        {
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
        },
        {
          dataTypeName: 'com.google.calories.expended',
          dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:from_activities',
        },
        {
          dataTypeName: 'com.google.distance.delta',
          dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
        },
      ],
      bucketByTime: { durationMillis: '86400000' }, // 1 day per bucket
      startTimeMillis,
      endTimeMillis,
    },
  });

  for (const bucket of response.data.bucket || []) {
    const date = new Date(parseInt(bucket.startTimeMillis));
    const dateString = date.toISOString().split('T')[0];

    let steps = 0;
    let calories = 0;
    let distanceMeters = 0;

    for (const dataset of bucket.dataset || []) {
      const sourceId = dataset.dataSourceId || '';
      for (const point of dataset.point || []) {
        if (sourceId.includes('step_count')) {
          steps += point.value?.[0]?.intVal || 0;
        } else if (sourceId.includes('calories')) {
          calories += point.value?.[0]?.fpVal || 0;
        } else if (sourceId.includes('distance')) {
          distanceMeters += point.value?.[0]?.fpVal || 0;
        }
      }
    }

    if (steps > 0 || calories > 0) {
      const logId = `${userId}_${dateString}`;
      await db.collection('dailyActivityLogs').doc(logId).set(
        {
          id: logId,
          userId,
          date: dateString,
          steps,
          calories: Math.round(calories),
          distanceMeters: Math.round(distanceMeters),
          source: 'google_fit',
          syncedAt: FieldValue.serverTimestamp(),
          lastUpdated: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }
  }
}

async function performLeaderboardUpdate(month, year) {
  const teamsSnap = await db.collection('teams')
    .where('isActive', '==', true)
    .get();

  if (teamsSnap.empty) {
    return { message: 'No active teams', teamsCount: 0, month, year };
  }

  const teamEntries = [];
  for (const teamDoc of teamsSnap.docs) {
    const team = { id: teamDoc.id, ...teamDoc.data() };
    const entry = await calculateTeamStats(team, month, year);
    if (entry) teamEntries.push(entry);
  }

  teamEntries.sort((a, b) => b.totalSteps - a.totalSteps);

  const leaderboardId = `${year}-${month}`;
  await db.collection('monthlyLeaderboards').doc(leaderboardId).set(
    {
      id: leaderboardId,
      month,
      year,
      teams: teamEntries,
      lastUpdated: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { message: 'Leaderboard updated', teamsCount: teamEntries.length, month, year };
}

async function calculateTeamStats(team, month, year) {
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  const startDate = new Date(year, monthIndex, 1).toISOString().split('T')[0];
  const endDate = new Date(year, monthIndex + 1, 0).toISOString().split('T')[0];

  const memberStats = [];
  let totalSteps = 0;
  let totalCalories = 0;

  for (const memberId of team.memberIds || []) {
    try {
      const userDoc = await db.collection('users').doc(memberId).get();
      if (!userDoc.exists) continue;
      const user = userDoc.data();

      const activitySnap = await db.collection('dailyActivityLogs')
        .where('userId', '==', memberId)
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .get();

      let memberSteps = 0;
      let memberCalories = 0;
      activitySnap.docs.forEach(d => {
        memberSteps += d.data().steps || 0;
        memberCalories += d.data().calories || 0;
      });

      memberStats.push({
        userId: memberId,
        displayName: user.displayName || user.email,
        steps: memberSteps,
        calories: memberCalories,
      });
      totalSteps += memberSteps;
      totalCalories += memberCalories;
    } catch (err) {
      console.error(`Stats error for member ${memberId}:`, err.message);
    }
  }

  memberStats.sort((a, b) => b.steps - a.steps);

  return {
    teamId: team.id,
    teamName: team.name,
    totalSteps,
    totalCalories,
    memberCount: team.memberIds?.length || 0,
    members: memberStats,
  };
}

// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`FitSpark API running on port ${PORT}`);
});
