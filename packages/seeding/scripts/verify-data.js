const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} = require("firebase/firestore");

// Firebase config (use staging project)
const firebaseConfig = {
  apiKey: "AIzaSyCEwPpL6Om4k5uvtgt2jWi--IcIEXq-ZPQ",
  authDomain: "fitspark-staging.firebaseapp.com",
  projectId: "fitspark-staging",
  storageBucket: "fitspark-staging.firebasestorage.app",
  messagingSenderId: "781274816005",
  appId: "1:781274816005:web:081464c33a1afa416e466c",
  measurementId: "G-P9Y0SCVENL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function verifyExercises() {
  console.log("🏋️ Verifying exercises collection...");

  try {
    const exercisesRef = collection(db, "exercises");
    const snapshot = await getDocs(exercisesRef);

    console.log(`📊 Found ${snapshot.size} exercises`);

    if (snapshot.size === 0) {
      console.log("❌ No exercises found!");
      return false;
    }

    // Show sample exercises
    console.log("\n📋 Sample exercises:");
    let count = 0;
    snapshot.forEach((doc) => {
      if (count < 3) {
        // Show first 3
        const data = doc.data();
        console.log(
          `  • ${data.name} (${data.category}) - ${data.muscleGroups.join(", ")}`
        );
        count++;
      }
    });

    if (snapshot.size >= 10) {
      console.log("✅ Exercise seeding successful!");
      return true;
    } else {
      console.log(`⚠️ Expected at least 10 exercises, found ${snapshot.size}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Error verifying exercises:", error.message);
    return false;
  }
}

async function verifyWorkoutPlans() {
  console.log("\n📋 Verifying workout plans collection...");

  try {
    const plansRef = collection(db, "workoutPrograms");
    const snapshot = await getDocs(plansRef);

    console.log(`📊 Found ${snapshot.size} workout plans`);

    if (snapshot.size === 0) {
      console.log("❌ No workout plans found!");
      return false;
    }

    // Show sample plans
    console.log("\n📋 Available workout plans:");
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(
        `  • ${data.title} (${data.difficulty}) - ${data.description}`
      );
      console.log(
        `    📅 ${data.durationWeeks} weeks, ${data.sessionsPerWeek} sessions/week`
      );
      console.log(`    🎯 Goal: ${data.goal}`);
      console.log("");
    });

    if (snapshot.size >= 3) {
      console.log("✅ Workout plans seeding successful!");
      return true;
    } else {
      console.log(`⚠️ Expected at least 3 plans, found ${snapshot.size}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Error verifying workout plans:", error.message);
    return false;
  }
}

async function verifySpecificData() {
  console.log("\n🔍 Checking specific data integrity...");

  try {
    // Check a specific exercise
    const pushUpRef = doc(db, "exercises", "push-up");
    const pushUpDoc = await getDoc(pushUpRef);

    if (pushUpDoc.exists()) {
      const data = pushUpDoc.data();
      console.log(`✅ Push-up exercise found: ${data.name}`);
      console.log(`   Instructions: ${data.instructions.length} steps`);
      console.log(`   Muscle groups: ${data.muscleGroups.join(", ")}`);
    } else {
      console.log("❌ Push-up exercise not found");
      return false;
    }

    // Check a specific workout plan
    const beginnerPlanRef = doc(db, "workoutPrograms", "beginner-bodyweight");
    const beginnerPlanDoc = await getDoc(beginnerPlanRef);

    if (beginnerPlanDoc.exists()) {
      const data = beginnerPlanDoc.data();
      console.log(`✅ Beginner bodyweight plan found: ${data.title}`);
      console.log(`   Phases: ${data.phases.length} workout days`);
      console.log(
        `   First workout: ${data.phases[0].name} (${data.phases[0].exercises.length} exercises)`
      );
    } else {
      console.log("❌ Beginner bodyweight plan not found");
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Error checking specific data:", error.message);
    return false;
  }
}

async function runVerification() {
  console.log("🔥 Starting Firestore Data Verification...\n");

  try {
    const exercisesOk = await verifyExercises();
    const plansOk = await verifyWorkoutPlans();
    const specificOk = await verifySpecificData();

    console.log("\n" + "=".repeat(50));

    if (exercisesOk && plansOk && specificOk) {
      console.log("🎉 VERIFICATION SUCCESSFUL!");
      console.log("✅ All data seeded correctly");
      console.log("✅ Firestore is ready for development");
      console.log(
        "\n🌐 View in console: https://console.firebase.google.com/project/fitspark-staging/firestore"
      );
    } else {
      console.log("❌ VERIFICATION FAILED!");
      console.log("Some data is missing or incomplete");
      console.log("Consider re-running the seeding script");
    }
  } catch (error) {
    console.error("❌ Verification failed:", error);
  }
}

// Run verification
if (require.main === module) {
  runVerification()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { runVerification };
