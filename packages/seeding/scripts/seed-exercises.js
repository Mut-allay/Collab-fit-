// Exercise data for seeding Firestore

const exercises = [
  // Upper Body - Push
  {
    id: "push-up",
    name: "Push-up",
    description: "Classic bodyweight chest exercise",
    category: "strength",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: ["bodyweight"],
    instructions: [
      "Start in a plank position with hands shoulder-width apart",
      "Lower your body until chest nearly touches the floor",
      "Push back up to starting position",
      "Keep your body in a straight line throughout",
    ],
    videoUrl: "",
    imageUrl: "",
  },
  {
    id: "bench-press",
    name: "Bench Press",
    description: "Fundamental chest-building exercise",
    category: "strength",
    muscleGroups: ["chest", "triceps", "shoulders"],
    equipment: ["barbell", "bench"],
    instructions: [
      "Lie on bench with feet flat on floor",
      "Grip barbell slightly wider than shoulder-width",
      "Lower bar to chest with control",
      "Press bar up until arms are fully extended",
    ],
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    description: "Standing shoulder press with barbell",
    category: "strength",
    muscleGroups: ["shoulders", "triceps", "core"],
    equipment: ["barbell"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Hold barbell at shoulder level",
      "Press bar straight up overhead",
      "Lower with control to starting position",
    ],
  },

  // Upper Body - Pull
  {
    id: "pull-up",
    name: "Pull-up",
    description: "Bodyweight back exercise",
    category: "strength",
    muscleGroups: ["back", "biceps"],
    equipment: ["pull-up bar"],
    instructions: [
      "Hang from bar with palms facing away",
      "Pull body up until chin clears bar",
      "Lower with control to full hang",
      "Keep core engaged throughout",
    ],
  },
  {
    id: "bent-over-row",
    name: "Bent-over Row",
    description: "Back strengthening exercise with barbell",
    category: "strength",
    muscleGroups: ["back", "biceps", "rear-delts"],
    equipment: ["barbell"],
    instructions: [
      "Stand with feet hip-width apart",
      "Hinge at hips, keep back straight",
      "Pull barbell to lower chest",
      "Lower with control",
    ],
  },

  // Lower Body
  {
    id: "squat",
    name: "Squat",
    description: "Fundamental lower body exercise",
    category: "strength",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["bodyweight"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower hips back and down",
      "Keep chest up and knees tracking over toes",
      "Return to standing position",
    ],
  },
  {
    id: "deadlift",
    name: "Deadlift",
    description: "Full-body strength exercise",
    category: "strength",
    muscleGroups: ["hamstrings", "glutes", "back", "traps"],
    equipment: ["barbell"],
    instructions: [
      "Stand with feet hip-width apart",
      "Hinge at hips and knees to grab bar",
      "Keep back straight, chest up",
      "Drive through heels to stand up straight",
    ],
  },
  {
    id: "lunge",
    name: "Lunge",
    description: "Single-leg strength exercise",
    category: "strength",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["bodyweight"],
    instructions: [
      "Step forward into a long stride",
      "Lower back knee toward ground",
      "Keep front knee over ankle",
      "Push back to starting position",
    ],
  },

  // Cardio
  {
    id: "burpee",
    name: "Burpee",
    description: "Full-body cardio exercise",
    category: "cardio",
    muscleGroups: ["full-body"],
    equipment: ["bodyweight"],
    instructions: [
      "Start standing, drop into squat",
      "Place hands on ground, jump feet back to plank",
      "Do a push-up",
      "Jump feet back to squat, then jump up with arms overhead",
    ],
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    description: "Classic cardio warm-up exercise",
    category: "cardio",
    muscleGroups: ["full-body"],
    equipment: ["bodyweight"],
    instructions: [
      "Start with feet together, arms at sides",
      "Jump feet apart while raising arms overhead",
      "Jump back to starting position",
      "Maintain steady rhythm",
    ],
  },

  // Core
  {
    id: "plank",
    name: "Plank",
    description: "Isometric core strengthening exercise",
    category: "strength",
    muscleGroups: ["core", "shoulders"],
    equipment: ["bodyweight"],
    instructions: [
      "Start in push-up position",
      "Hold body straight from head to heels",
      "Keep core engaged",
      "Breathe normally while holding position",
    ],
  },
];

module.exports = { exercises };
