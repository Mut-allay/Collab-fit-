// Production exercise data for seeding Firestore
// Curated, high-quality exercises for production environment

const exercises = [
  // Upper Body - Push
  {
    id: "push-up",
    name: "Push-up",
    description:
      "Classic bodyweight chest exercise that builds strength and endurance",
    category: "strength",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: ["bodyweight"],
    instructions: [
      "Start in a plank position with hands shoulder-width apart",
      "Lower your body until chest nearly touches the floor",
      "Push back up to starting position",
      "Keep your body in a straight line throughout the movement",
      "Breathe steadily throughout the exercise",
    ],
    videoUrl: "",
    imageUrl: "",
  },
  {
    id: "bench-press",
    name: "Bench Press",
    description:
      "Fundamental compound exercise for chest development and upper body strength",
    category: "strength",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: ["barbell", "bench"],
    instructions: [
      "Lie on bench with feet flat on floor and back arched slightly",
      "Grip barbell slightly wider than shoulder-width",
      "Unrack the bar and lower it to your chest with control",
      "Press the bar up until arms are fully extended",
      "Keep your core engaged and maintain proper form",
    ],
    videoUrl: "",
    imageUrl: "",
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    description:
      "Standing shoulder press that builds functional strength and stability",
    category: "strength",
    muscleGroups: ["shoulders", "triceps", "core"],
    equipment: ["barbell"],
    instructions: [
      "Stand with feet shoulder-width apart and core engaged",
      "Hold barbell at shoulder level with palms facing forward",
      "Press the bar straight up overhead while keeping core tight",
      "Lower with control to starting position",
      "Avoid excessive back arch during the press",
    ],
    videoUrl: "",
    imageUrl: "",
  },

  // Upper Body - Pull
  {
    id: "pull-up",
    name: "Pull-up",
    description: "Advanced bodyweight exercise for back and bicep development",
    category: "strength",
    muscleGroups: ["back", "biceps"],
    equipment: ["pull-up bar"],
    instructions: [
      "Hang from bar with palms facing away from you",
      "Engage your core and pull your body up until chin clears the bar",
      "Lower with control to full hang position",
      "Keep your body straight and avoid swinging",
      "Focus on using your back muscles to initiate the pull",
    ],
    videoUrl: "",
    imageUrl: "",
  },
  {
    id: "bent-over-row",
    name: "Bent-over Row",
    description: "Compound back exercise that builds thickness and strength",
    category: "strength",
    muscleGroups: ["back", "biceps", "rear-delts"],
    equipment: ["barbell"],
    instructions: [
      "Stand with feet hip-width apart and knees slightly bent",
      "Hinge at hips, keeping back straight and chest up",
      "Pull barbell to lower chest while squeezing shoulder blades",
      "Lower with control to starting position",
      "Keep the bar close to your body throughout the movement",
    ],
    videoUrl: "",
    imageUrl: "",
  },

  // Lower Body
  {
    id: "squat",
    name: "Squat",
    description:
      "Fundamental lower body exercise that builds leg strength and stability",
    category: "strength",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["bodyweight"],
    instructions: [
      "Stand with feet shoulder-width apart and toes slightly out",
      "Lower hips back and down as if sitting in a chair",
      "Keep chest up and knees tracking over toes",
      "Go as deep as comfortable while maintaining form",
      "Push through heels to return to standing position",
    ],
    videoUrl: "",
    imageUrl: "",
  },
  {
    id: "deadlift",
    name: "Deadlift",
    description: "Full-body compound exercise that builds strength and power",
    category: "strength",
    muscleGroups: ["hamstrings", "glutes", "back", "traps"],
    equipment: ["barbell"],
    instructions: [
      "Stand with feet hip-width apart and bar over mid-foot",
      "Bend at hips and knees to grip the bar",
      "Keep back straight and chest up as you lift",
      "Stand up straight while keeping bar close to body",
      "Lower with control, maintaining proper form throughout",
    ],
    videoUrl: "",
    imageUrl: "",
  },
  {
    id: "lunge",
    name: "Lunge",
    description: "Unilateral leg exercise that improves balance and strength",
    category: "strength",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["bodyweight"],
    instructions: [
      "Stand with feet hip-width apart",
      "Step forward with one leg and lower hips until both knees are bent",
      "Keep front knee over ankle and back knee near ground",
      "Push through front foot to return to starting position",
      "Alternate legs for balanced development",
    ],
    videoUrl: "",
    imageUrl: "",
  },

  // Core
  {
    id: "plank",
    name: "Plank",
    description: "Isometric core exercise that builds stability and endurance",
    category: "strength",
    muscleGroups: ["core", "shoulders"],
    equipment: ["bodyweight"],
    instructions: [
      "Start in push-up position with arms straight",
      "Lower to forearms and maintain straight body line",
      "Engage core muscles and hold position",
      "Keep hips level and avoid sagging",
      "Breathe steadily throughout the hold",
    ],
    videoUrl: "",
    imageUrl: "",
  },

  // Cardio
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    description:
      "Classic cardio exercise that elevates heart rate and warms up the body",
    category: "cardio",
    muscleGroups: ["full-body"],
    equipment: ["bodyweight"],
    instructions: [
      "Start standing with feet together and arms at sides",
      "Jump feet apart while raising arms overhead",
      "Jump back to starting position",
      "Maintain steady rhythm and controlled movement",
      "Land softly to reduce impact on joints",
    ],
    videoUrl: "",
    imageUrl: "",
  },
  {
    id: "burpee",
    name: "Burpee",
    description:
      "High-intensity full-body exercise that combines strength and cardio",
    category: "cardio",
    muscleGroups: ["full-body"],
    equipment: ["bodyweight"],
    instructions: [
      "Start standing, then drop into a squat position",
      "Place hands on ground and kick feet back to plank",
      "Perform a push-up (optional for beginners)",
      "Jump feet back to squat position",
      "Jump up with arms overhead and repeat",
    ],
    videoUrl: "",
    imageUrl: "",
  },
];

module.exports = { exercises };
