const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  setDoc,
  writeBatch,
} = require("firebase/firestore");

// Import seeding data
const { exercises } = require("./seed-exercises");
const { workoutPlans } = require("./seed-plans");

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

async function seedExercises() {
  console.log("🏋️ Seeding exercises to Firestore...");

  const batch = writeBatch(db);

  exercises.forEach((exercise) => {
    const docRef = doc(collection(db, "exercises"), exercise.id);
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
  console.log("📋 Seeding workout plans to Firestore...");

  const batch = writeBatch(db);

  workoutPlans.forEach((plan) => {
    const docRef = doc(collection(db, "workoutPrograms"), plan.id);
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
  console.log("🔥 Starting Firestore seeding process...\n");

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
      "🌐 Check your data at: https://console.firebase.google.com/project/fitspark-staging/firestore"
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
