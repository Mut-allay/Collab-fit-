// Workout plan data for seeding Firestore

const workoutPlans = [
  {
    id: "beginner-bodyweight",
    title: "Beginner Bodyweight",
    description:
      "Perfect for starting your fitness journey at home with no equipment needed",
    difficulty: "beginner",
    goal: "general_fitness",
    durationWeeks: 4,
    sessionsPerWeek: 3,
    visibility: "public",
    tags: ["bodyweight", "home", "beginner"],
    phases: [
      {
        id: "day-1",
        name: "Full Body Strength",
        description:
          "A complete bodyweight workout targeting all major muscle groups",
        exercises: [
          { exerciseId: "jumping-jacks", sets: 1, reps: 30, restTime: 30 },
          { exerciseId: "push-up", sets: 3, reps: 8, restTime: 60 },
          { exerciseId: "squat", sets: 3, reps: 12, restTime: 60 },
          { exerciseId: "plank", sets: 3, duration: 30, restTime: 60 },
          { exerciseId: "lunge", sets: 2, reps: 8, restTime: 60 },
        ],
        estimatedDuration: 25,
      },
      {
        id: "day-2",
        name: "Cardio & Core",
        description: "Heart-pumping cardio with core strengthening",
        exercises: [
          { exerciseId: "jumping-jacks", sets: 2, reps: 30, restTime: 30 },
          { exerciseId: "burpee", sets: 3, reps: 5, restTime: 90 },
          { exerciseId: "squat", sets: 3, reps: 15, restTime: 45 },
          { exerciseId: "plank", sets: 3, duration: 45, restTime: 60 },
          { exerciseId: "push-up", sets: 2, reps: 6, restTime: 60 },
        ],
        estimatedDuration: 20,
      },
      {
        id: "day-3",
        name: "Strength & Endurance",
        description: "Building strength while improving muscular endurance",
        exercises: [
          { exerciseId: "squat", sets: 4, reps: 15, restTime: 45 },
          { exerciseId: "push-up", sets: 3, reps: 10, restTime: 60 },
          { exerciseId: "lunge", sets: 3, reps: 10, restTime: 60 },
          { exerciseId: "plank", sets: 3, duration: 60, restTime: 60 },
          { exerciseId: "burpee", sets: 2, reps: 8, restTime: 90 },
        ],
        estimatedDuration: 30,
      },
    ],
    trainerId: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "beginner-strength",
    title: "Beginner Strength Training",
    description: "Build foundational strength with basic equipment",
    difficulty: "beginner",
    goal: "strength",
    durationWeeks: 6,
    sessionsPerWeek: 3,
    visibility: "public",
    tags: ["strength", "gym", "beginner"],
    phases: [
      {
        id: "day-1",
        name: "Upper Body Push",
        description: "Chest, shoulders, and triceps development",
        exercises: [
          {
            exerciseId: "bench-press",
            sets: 3,
            reps: 8,
            weight: 45,
            restTime: 120,
          },
          {
            exerciseId: "overhead-press",
            sets: 3,
            reps: 6,
            weight: 35,
            restTime: 120,
          },
          { exerciseId: "push-up", sets: 2, reps: 10, restTime: 60 },
        ],
        estimatedDuration: 35,
      },
      {
        id: "day-2",
        name: "Lower Body",
        description: "Leg and glute strength building",
        exercises: [
          { exerciseId: "squat", sets: 3, reps: 10, restTime: 90 },
          {
            exerciseId: "deadlift",
            sets: 3,
            reps: 5,
            weight: 65,
            restTime: 120,
          },
          { exerciseId: "lunge", sets: 3, reps: 8, restTime: 60 },
        ],
        estimatedDuration: 40,
      },
      {
        id: "day-3",
        name: "Upper Body Pull",
        description: "Back and bicep development",
        exercises: [
          {
            exerciseId: "bent-over-row",
            sets: 3,
            reps: 8,
            weight: 40,
            restTime: 120,
          },
          { exerciseId: "pull-up", sets: 3, reps: 3, restTime: 120 },
          { exerciseId: "plank", sets: 3, duration: 45, restTime: 60 },
        ],
        estimatedDuration: 35,
      },
    ],
    trainerId: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "intermediate-strength",
    title: "Intermediate Strength",
    description:
      "Take your strength to the next level with progressive overload",
    difficulty: "intermediate",
    goal: "strength",
    durationWeeks: 8,
    sessionsPerWeek: 4,
    visibility: "public",
    tags: ["strength", "gym", "intermediate"],
    phases: [
      {
        id: "day-1",
        name: "Heavy Upper Push",
        description: "Focus on heavy pressing movements",
        exercises: [
          {
            exerciseId: "bench-press",
            sets: 4,
            reps: 5,
            weight: 85,
            restTime: 180,
          },
          {
            exerciseId: "overhead-press",
            sets: 4,
            reps: 6,
            weight: 55,
            restTime: 150,
          },
          { exerciseId: "push-up", sets: 3, reps: 15, restTime: 60 },
        ],
        estimatedDuration: 45,
      },
      {
        id: "day-2",
        name: "Heavy Lower",
        description: "Heavy squats and deadlifts",
        exercises: [
          { exerciseId: "squat", sets: 4, reps: 6, weight: 95, restTime: 180 },
          {
            exerciseId: "deadlift",
            sets: 4,
            reps: 3,
            weight: 115,
            restTime: 180,
          },
          { exerciseId: "lunge", sets: 3, reps: 12, restTime: 90 },
        ],
        estimatedDuration: 50,
      },
    ],
    trainerId: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: "weight-loss-cardio",
    title: "Weight Loss Cardio",
    description: "High-intensity workouts designed for fat burning",
    difficulty: "intermediate",
    goal: "weight_loss",
    durationWeeks: 6,
    sessionsPerWeek: 4,
    visibility: "public",
    tags: ["cardio", "weight-loss", "hiit"],
    phases: [
      {
        id: "day-1",
        name: "HIIT Circuit",
        description:
          "High-intensity interval training for maximum calorie burn",
        exercises: [
          { exerciseId: "burpee", sets: 4, reps: 10, restTime: 45 },
          { exerciseId: "jumping-jacks", sets: 4, reps: 30, restTime: 30 },
          { exerciseId: "squat", sets: 4, reps: 20, restTime: 45 },
          { exerciseId: "push-up", sets: 3, reps: 12, restTime: 60 },
        ],
        estimatedDuration: 25,
      },
    ],
    trainerId: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = { workoutPlans };
