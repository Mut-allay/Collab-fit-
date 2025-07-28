// Generate workout data with instructions for manual UID update
const fs = require("fs");

// User data for sichilima mulenga
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
    userId: "REPLACE_WITH_ACTUAL_UID", // This will need to be updated with actual UID
    workoutPlanId: "beginner-strength",
    phaseId: "day-1",
    phaseName: "Strength Training",
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    sets: exercises,
    totalVolume: totalVolume,
    duration: duration,
    createdAt: new Date().toISOString(),
  };
}

function generateFirestoreData() {
  console.log("🏋️ Generating workout history data for sichilima mulenga...\n");

  const workouts = generateWorkoutHistory();

  console.log(`📊 Generated ${workouts.length} workouts over 3 weeks`);
  console.log(
    `📅 Date range: ${workouts[0].startTime.split("T")[0]} to ${workouts[workouts.length - 1].startTime.split("T")[0]}`
  );
  console.log(
    `💪 Total volume: ${workouts.reduce((sum, w) => sum + w.totalVolume, 0).toLocaleString()} lbs`
  );
  console.log(
    `⏱️ Total time: ${workouts.reduce((sum, w) => sum + w.duration, 0)} minutes`
  );

  // Save to file for easy copying
  const outputData = {
    collection: "workoutLogs",
    documents: workouts.map((workout, index) => ({
      id: `workout_${index + 1}_${workout.startTime.split("T")[0]}`,
      data: workout,
    })),
  };

  fs.writeFileSync(
    "workout-data-with-placeholder-uid.json",
    JSON.stringify(outputData, null, 2)
  );

  console.log("\n📋 Instructions:");
  console.log(
    "1. Go to Firebase Console: https://console.firebase.google.com/project/fitspark-staging/authentication"
  );
  console.log("2. Find the user with email: willsonmulenga7@gmail.com");
  console.log("3. Copy the UID (it will look like: abc123def456...)");
  console.log("4. Open the file: workout-data-with-placeholder-uid.json");
  console.log(
    "5. Replace all instances of 'REPLACE_WITH_ACTUAL_UID' with the actual UID"
  );
  console.log(
    "6. Add each document to the 'workoutLogs' collection in Firestore"
  );
  console.log(
    "7. Test the progress features at: https://fitspark-staging.web.app/progress"
  );

  console.log("\n💾 Data saved to 'workout-data-with-placeholder-uid.json'");
  console.log("\n🔍 To find the UID manually:");
  console.log("1. Go to Firebase Console > Authentication > Users");
  console.log("2. Look for willsonmulenga7@gmail.com");
  console.log("3. Copy the UID from the user row");

  // Also show sample data
  console.log("\n📄 Sample workout data (first workout):");
  console.log(JSON.stringify(workouts[0], null, 2));
}

if (require.main === module) {
  generateFirestoreData();
}

module.exports = { generateFirestoreData };
