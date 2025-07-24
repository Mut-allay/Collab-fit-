const admin = require("firebase-admin");

// Initialize Firebase Admin for production
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "fitspark-production",
  });
}

const db = admin.firestore();

// Import seeding data
const { exercises } = require("./seed-exercises");
const { workoutPlans } = require("./seed-plans");

async function seedExercises() {
  console.log("🏋️ Seeding exercises to Firestore (Production)...");

  const batch = db.batch();

  exercises.forEach((exercise) => {
    const docRef = db.collection("exercises").doc(exercise.id);
    batch.set(docRef, exercise);
  });

  try {
    await batch.commit();
    console.log(`✅ Successfully seeded ${exercises.length} exercises!`);
  } catch (error) {
    console.error("❌ Error seeding exercises:", error);
    throw error;
  }
}

async function seedPlans() {
  console.log("📋 Seeding workout plans to Firestore (Production)...");

  const batch = db.batch();

  workoutPlans.forEach((plan) => {
    const docRef = db.collection("workoutPrograms").doc(plan.id);
    batch.set(docRef, plan);
  });

  try {
    await batch.commit();
    console.log(`✅ Successfully seeded ${workoutPlans.length} workout plans!`);
  } catch (error) {
    console.error("❌ Error seeding workout plans:", error);
    throw error;
  }
}

async function seedFirestore() {
  console.log("🔥 Starting Firestore seeding process for PRODUCTION...\n");

  try {
    // Seed exercises first (plans reference exercises)
    await seedExercises();
    console.log("");

    // Then seed workout plans
    await seedPlans();
    console.log("");

    console.log("🎉 Firestore seeding completed successfully!");
    console.log("📊 Collections created:");
    console.log("  - exercises (11 exercises)");
    console.log("  - workoutPrograms (4 plans)");
    console.log("");
    console.log(
      "🌐 Check your data at: https://console.firebase.google.com/project/fitspark-production/firestore"
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedFirestore()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedFirestore };
