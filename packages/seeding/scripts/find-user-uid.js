const admin = require("firebase-admin");

// Initialize Firebase Admin for staging
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "fitspark-staging",
  });
}

const auth = admin.auth();

async function findUserByEmail() {
  const email = "willsonmulenga7@gmail.com";

  try {
    console.log(`🔍 Looking for user with email: ${email}`);

    // List all users and find the one with matching email
    const listUsersResult = await auth.listUsers();

    const user = listUsersResult.users.find((u) => u.email === email);

    if (user) {
      console.log(`✅ Found user:`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Display Name: ${user.displayName || "Not set"}`);
      console.log(`   Created: ${user.metadata.creationTime}`);
      console.log(`   Last Sign In: ${user.metadata.lastSignInTime}`);

      return user.uid;
    } else {
      console.log(`❌ No user found with email: ${email}`);
      console.log(`\n📋 Available users:`);
      listUsersResult.users.forEach((u) => {
        console.log(`   - ${u.email} (${u.uid})`);
      });
      return null;
    }
  } catch (error) {
    console.error("❌ Error finding user:", error.message);
    return null;
  }
}

async function createUserIfNotExists() {
  const email = "willsonmulenga7@gmail.com";
  const password = "TestPassword123!"; // Temporary password

  try {
    console.log(`🔍 Checking if user exists: ${email}`);

    // Try to create user (will fail if already exists)
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: "sichilima mulenga",
      emailVerified: true,
    });

    console.log(`✅ Created new user:`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Email: ${userRecord.email}`);
    console.log(`   Display Name: ${userRecord.displayName}`);

    return userRecord.uid;
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      console.log(`ℹ️ User already exists, finding UID...`);
      return await findUserByEmail();
    } else {
      console.error("❌ Error creating user:", error.message);
      return null;
    }
  }
}

async function main() {
  console.log("🔍 Finding user UID for willsonmulenga7@gmail.com...\n");

  let uid = await findUserByEmail();

  if (!uid) {
    console.log("\n🆕 User not found, creating new user...");
    uid = await createUserIfNotExists();
  }

  if (uid) {
    console.log(`\n🎯 User UID: ${uid}`);
    console.log(`\n📋 Next steps:`);
    console.log(`1. Use this UID to update the workout data`);
    console.log(
      `2. Replace 'sichilima_mulenga_test' with '${uid}' in all workout documents`
    );
    console.log(`3. Add the workout data to Firestore`);
  } else {
    console.log("\n❌ Could not find or create user");
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { findUserByEmail, createUserIfNotExists };
