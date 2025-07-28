const admin = require("firebase-admin");

// Initialize Firebase Admin for staging
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "fitspark-staging",
  });
}

const db = admin.firestore();

// User data for sichilima mulenga
const USER_ID = "sichilima_mulenga_test"; // We'll need to get the actual UID
const USER_EMAIL = "willsonmulenga7@gmail.com";

// Exercise data for realistic workouts
const EXERCISES = [
  { id: "squat", name: "Squat", category: "legs" },
  { id: "deadlift", name: "Deadlift", category: "back" },
  { id: "bench-press", name: "Bench Press", category: "chest" },
  { id: "overhead-press", name: "Overhead Press", category: "shoulders" },
  { id: "barbell-row", name: "Barbell Row", category: "back" },
  { id: "pull-ups", name: "Pull-ups", category: "back" },
  { id: "dips", name: "Dips", category: "chest" },
  { id: "lunges", name: "Lunges", category: "legs" },
  { id: "curls", name: "Bicep Curls", category: "arms" },
  { id: "tricep-extensions", name: "Tricep Extensions", category: "arms" },
];

// Generate realistic workout data for 3 weeks
function generateWorkoutHistory() {
  const workouts = [];
  const today = new Date();

  // Generate 3 weeks of data (21 days)
  for (let day = 20; day >= 0; day--) {
    const workoutDate = new Date(today);
    workoutDate.setDate(workoutDate.getDate() - day);

    // Skip some days to create realistic workout patterns (3-4 workouts per week)
    const dayOfWeek = workoutDate.getDay();
    const shouldWorkout = [1, 3, 5, 6].includes(dayOfWeek); // Mon, Wed, Fri, Sat

    if (shouldWorkout && Math.random() > 0.2) {
      // 80% chance of working out on workout days
      const workout = generateWorkout(workoutDate, day);
      workouts.push(workout);
    }
  }

  return workouts;
}

function generateWorkout(date, dayOffset) {
  const startTime = new Date(date);
  startTime.setHours(8 + Math.floor(Math.random() * 4)); // 8 AM to 12 PM
  startTime.setMinutes(Math.floor(Math.random() * 60));

  const duration = 45 + Math.floor(Math.random() * 30); // 45-75 minutes
  const endTime = new Date(startTime.getTime() + duration * 60000);

  // Progressive overload - weights increase over time
  const baseWeight = 100 + dayOffset * 2; // Gradual weight increase
  const baseReps = 8 + Math.floor(Math.random() * 4); // 8-12 reps

  const exercises = [];
  const exerciseCount = 4 + Math.floor(Math.random() * 3); // 4-6 exercises per workout

  // Select random exercises for this workout
  const selectedExercises = EXERCISES.sort(() => 0.5 - Math.random()).slice(
    0,
    exerciseCount
  );

  let totalVolume = 0;

  selectedExercises.forEach((exercise, index) => {
    const sets = 3 + Math.floor(Math.random() * 2); // 3-4 sets
    const weight = Math.max(
      20,
      baseWeight - index * 10 + Math.floor(Math.random() * 20)
    );
    const reps = baseReps + Math.floor(Math.random() * 4) - 2; // Variation in reps

    const exerciseSets = [];
    for (let set = 1; set <= sets; set++) {
      const setWeight = weight + Math.floor(Math.random() * 10) - 5; // Small variation per set
      const setReps = reps + Math.floor(Math.random() * 3) - 1; // Small variation per set

      exerciseSets.push({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        setNumber: set,
        weight: Math.max(10, setWeight),
        reps: Math.max(1, setReps),
        completed: true,
      });

      totalVolume += setWeight * setReps;
    }

    exercises.push(...exerciseSets);
  });

  return {
    userId: USER_ID,
    workoutPlanId: "beginner-strength",
    phaseId: "day-1",
    phaseName: "Strength Training",
    startTime: startTime,
    endTime: endTime,
    sets: exercises,
    totalVolume: totalVolume,
    duration: duration,
  };
}

async function findUserByEmail() {
  try {
    // Try to find user by email in Firestore
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", USER_EMAIL).get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      console.log(
        `✅ Found user: ${userDoc.data().displayName} (${userDoc.id})`
      );
      return userDoc.id;
    } else {
      console.log(`❌ User with email ${USER_EMAIL} not found in Firestore`);
      console.log("Creating test user data...");
      return USER_ID; // Use test ID
    }
  } catch (error) {
    console.error("Error finding user:", error);
    return USER_ID;
  }
}

async function seedWorkoutHistory() {
  console.log("🏋️ Seeding workout history for sichilima mulenga...\n");

  try {
    // Find the actual user ID
    const actualUserId = await findUserByEmail();

    // Generate workout history
    const workouts = generateWorkoutHistory();

    console.log(`📊 Generated ${workouts.length} workouts over 3 weeks`);

    // Add workouts to Firestore
    const batch = db.batch();
    let successCount = 0;

    for (const workout of workouts) {
      // Update userId to actual user ID
      workout.userId = actualUserId;

      const workoutRef = db
        .collection("workoutLogs")
        .doc(`${actualUserId}_${workout.startTime.getTime()}`);
      batch.set(workoutRef, {
        ...workout,
        startTime: admin.firestore.Timestamp.fromDate(workout.startTime),
        endTime: admin.firestore.Timestamp.fromDate(workout.endTime),
        createdAt: admin.firestore.Timestamp.now(),
      });
      successCount++;
    }

    await batch.commit();

    console.log(`✅ Successfully seeded ${successCount} workout logs`);
    console.log(
      `📅 Date range: ${workouts[0].startTime.toLocaleDateString()} to ${workouts[workouts.length - 1].startTime.toLocaleDateString()}`
    );
    console.log(
      `💪 Total volume: ${workouts.reduce((sum, w) => sum + w.totalVolume, 0).toLocaleString()} lbs`
    );
    console.log(
      `⏱️ Total time: ${workouts.reduce((sum, w) => sum + w.duration, 0)} minutes`
    );

    console.log(
      "\n🌐 Check your data at: https://console.firebase.google.com/project/fitspark-staging/firestore"
    );
    console.log(
      "🎯 Test the progress features at: https://fitspark-staging.web.app/progress"
    );
  } catch (error) {
    console.error("❌ Error seeding workout history:", error);
  }
}

if (require.main === module) {
  seedWorkoutHistory()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedWorkoutHistory };
