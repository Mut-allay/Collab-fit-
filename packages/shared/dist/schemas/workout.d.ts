import { z } from 'zod';
export declare const ExerciseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<["strength", "cardio", "flexibility", "sports"]>;
    muscleGroups: z.ZodArray<z.ZodString, "many">;
    equipment: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    instructions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    videoUrl: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    category: "strength" | "cardio" | "flexibility" | "sports";
    muscleGroups: string[];
    equipment: string[];
    instructions: string[];
    description?: string | undefined;
    videoUrl?: string | undefined;
    imageUrl?: string | undefined;
}, {
    id: string;
    name: string;
    category: "strength" | "cardio" | "flexibility" | "sports";
    muscleGroups: string[];
    description?: string | undefined;
    equipment?: string[] | undefined;
    instructions?: string[] | undefined;
    videoUrl?: string | undefined;
    imageUrl?: string | undefined;
}>;
export declare const WorkoutSetSchema: z.ZodObject<{
    exerciseId: z.ZodString;
    sets: z.ZodNumber;
    reps: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    duration: z.ZodOptional<z.ZodNumber>;
    distance: z.ZodOptional<z.ZodNumber>;
    restTime: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    exerciseId: string;
    sets: number;
    restTime: number;
    reps?: number | undefined;
    weight?: number | undefined;
    duration?: number | undefined;
    distance?: number | undefined;
}, {
    exerciseId: string;
    sets: number;
    reps?: number | undefined;
    weight?: number | undefined;
    duration?: number | undefined;
    distance?: number | undefined;
    restTime?: number | undefined;
}>;
export declare const WorkoutSessionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    exercises: z.ZodArray<z.ZodObject<{
        exerciseId: z.ZodString;
        sets: z.ZodNumber;
        reps: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodNumber>;
        distance: z.ZodOptional<z.ZodNumber>;
        restTime: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        exerciseId: string;
        sets: number;
        restTime: number;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
    }, {
        exerciseId: string;
        sets: number;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
        restTime?: number | undefined;
    }>, "many">;
    estimatedDuration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    exercises: {
        exerciseId: string;
        sets: number;
        restTime: number;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
    }[];
    estimatedDuration: number;
    description?: string | undefined;
}, {
    id: string;
    name: string;
    exercises: {
        exerciseId: string;
        sets: number;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
        restTime?: number | undefined;
    }[];
    estimatedDuration: number;
    description?: string | undefined;
}>;
export declare const WorkoutProgramSchema: z.ZodObject<{
    id: z.ZodString;
    trainerId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
    goal: z.ZodEnum<["weight_loss", "muscle_gain", "strength", "endurance", "general_fitness"]>;
    durationWeeks: z.ZodNumber;
    sessionsPerWeek: z.ZodNumber;
    phases: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        exercises: z.ZodArray<z.ZodObject<{
            exerciseId: z.ZodString;
            sets: z.ZodNumber;
            reps: z.ZodOptional<z.ZodNumber>;
            weight: z.ZodOptional<z.ZodNumber>;
            duration: z.ZodOptional<z.ZodNumber>;
            distance: z.ZodOptional<z.ZodNumber>;
            restTime: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            exerciseId: string;
            sets: number;
            restTime: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
        }, {
            exerciseId: string;
            sets: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
            restTime?: number | undefined;
        }>, "many">;
        estimatedDuration: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        exercises: {
            exerciseId: string;
            sets: number;
            restTime: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
        }[];
        estimatedDuration: number;
        description?: string | undefined;
    }, {
        id: string;
        name: string;
        exercises: {
            exerciseId: string;
            sets: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
            restTime?: number | undefined;
        }[];
        estimatedDuration: number;
        description?: string | undefined;
    }>, "many">;
    visibility: z.ZodDefault<z.ZodEnum<["public", "private", "clients_only"]>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    createdAt: Date;
    updatedAt: Date;
    id: string;
    trainerId: string;
    title: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    goal: "strength" | "weight_loss" | "muscle_gain" | "endurance" | "general_fitness";
    durationWeeks: number;
    sessionsPerWeek: number;
    phases: {
        id: string;
        name: string;
        exercises: {
            exerciseId: string;
            sets: number;
            restTime: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
        }[];
        estimatedDuration: number;
        description?: string | undefined;
    }[];
    visibility: "public" | "private" | "clients_only";
    tags: string[];
    description?: string | undefined;
}, {
    createdAt: Date;
    updatedAt: Date;
    id: string;
    trainerId: string;
    title: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    goal: "strength" | "weight_loss" | "muscle_gain" | "endurance" | "general_fitness";
    durationWeeks: number;
    sessionsPerWeek: number;
    phases: {
        id: string;
        name: string;
        exercises: {
            exerciseId: string;
            sets: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
            restTime?: number | undefined;
        }[];
        estimatedDuration: number;
        description?: string | undefined;
    }[];
    description?: string | undefined;
    visibility?: "public" | "private" | "clients_only" | undefined;
    tags?: string[] | undefined;
}>;
export declare const LoggedSetSchema: z.ZodObject<{
    exerciseId: z.ZodString;
    setNumber: z.ZodNumber;
    reps: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    duration: z.ZodOptional<z.ZodNumber>;
    distance: z.ZodOptional<z.ZodNumber>;
    completed: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    exerciseId: string;
    setNumber: number;
    completed: boolean;
    reps?: number | undefined;
    weight?: number | undefined;
    duration?: number | undefined;
    distance?: number | undefined;
}, {
    exerciseId: string;
    setNumber: number;
    reps?: number | undefined;
    weight?: number | undefined;
    duration?: number | undefined;
    distance?: number | undefined;
    completed?: boolean | undefined;
}>;
export declare const WorkoutLogSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    programId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    timestamp: z.ZodDate;
    startTime: z.ZodDate;
    endTime: z.ZodOptional<z.ZodDate>;
    sets: z.ZodArray<z.ZodObject<{
        exerciseId: z.ZodString;
        setNumber: z.ZodNumber;
        reps: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodNumber>;
        distance: z.ZodOptional<z.ZodNumber>;
        completed: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        exerciseId: string;
        setNumber: number;
        completed: boolean;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
    }, {
        exerciseId: string;
        setNumber: number;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
        completed?: boolean | undefined;
    }>, "many">;
    notes: z.ZodOptional<z.ZodString>;
    completed: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    id: string;
    name: string;
    sets: {
        exerciseId: string;
        setNumber: number;
        completed: boolean;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
    }[];
    completed: boolean;
    timestamp: Date;
    startTime: Date;
    programId?: string | undefined;
    sessionId?: string | undefined;
    endTime?: Date | undefined;
    notes?: string | undefined;
}, {
    userId: string;
    id: string;
    name: string;
    sets: {
        exerciseId: string;
        setNumber: number;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
        completed?: boolean | undefined;
    }[];
    timestamp: Date;
    startTime: Date;
    completed?: boolean | undefined;
    programId?: string | undefined;
    sessionId?: string | undefined;
    endTime?: Date | undefined;
    notes?: string | undefined;
}>;
export declare const CreateWorkoutProgramSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
    goal: z.ZodEnum<["weight_loss", "muscle_gain", "strength", "endurance", "general_fitness"]>;
    durationWeeks: z.ZodNumber;
    sessionsPerWeek: z.ZodNumber;
    phases: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        exercises: z.ZodArray<z.ZodObject<{
            exerciseId: z.ZodString;
            sets: z.ZodNumber;
            reps: z.ZodOptional<z.ZodNumber>;
            weight: z.ZodOptional<z.ZodNumber>;
            duration: z.ZodOptional<z.ZodNumber>;
            distance: z.ZodOptional<z.ZodNumber>;
            restTime: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            exerciseId: string;
            sets: number;
            restTime: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
        }, {
            exerciseId: string;
            sets: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
            restTime?: number | undefined;
        }>, "many">;
        estimatedDuration: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        exercises: {
            exerciseId: string;
            sets: number;
            restTime: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
        }[];
        estimatedDuration: number;
        description?: string | undefined;
    }, {
        id: string;
        name: string;
        exercises: {
            exerciseId: string;
            sets: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
            restTime?: number | undefined;
        }[];
        estimatedDuration: number;
        description?: string | undefined;
    }>, "many">;
    visibility: z.ZodDefault<z.ZodEnum<["public", "private", "clients_only"]>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    goal: "strength" | "weight_loss" | "muscle_gain" | "endurance" | "general_fitness";
    durationWeeks: number;
    sessionsPerWeek: number;
    phases: {
        id: string;
        name: string;
        exercises: {
            exerciseId: string;
            sets: number;
            restTime: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
        }[];
        estimatedDuration: number;
        description?: string | undefined;
    }[];
    visibility: "public" | "private" | "clients_only";
    tags: string[];
    description?: string | undefined;
}, {
    title: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    goal: "strength" | "weight_loss" | "muscle_gain" | "endurance" | "general_fitness";
    durationWeeks: number;
    sessionsPerWeek: number;
    phases: {
        id: string;
        name: string;
        exercises: {
            exerciseId: string;
            sets: number;
            reps?: number | undefined;
            weight?: number | undefined;
            duration?: number | undefined;
            distance?: number | undefined;
            restTime?: number | undefined;
        }[];
        estimatedDuration: number;
        description?: string | undefined;
    }[];
    description?: string | undefined;
    visibility?: "public" | "private" | "clients_only" | undefined;
    tags?: string[] | undefined;
}>;
export declare const CreateWorkoutLogSchema: z.ZodObject<{
    programId: z.ZodOptional<z.ZodString>;
    sessionId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    sets: z.ZodArray<z.ZodObject<{
        exerciseId: z.ZodString;
        setNumber: z.ZodNumber;
        reps: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        duration: z.ZodOptional<z.ZodNumber>;
        distance: z.ZodOptional<z.ZodNumber>;
        completed: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        exerciseId: string;
        setNumber: number;
        completed: boolean;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
    }, {
        exerciseId: string;
        setNumber: number;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
        completed?: boolean | undefined;
    }>, "many">;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    sets: {
        exerciseId: string;
        setNumber: number;
        completed: boolean;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
    }[];
    programId?: string | undefined;
    sessionId?: string | undefined;
    notes?: string | undefined;
}, {
    name: string;
    sets: {
        exerciseId: string;
        setNumber: number;
        reps?: number | undefined;
        weight?: number | undefined;
        duration?: number | undefined;
        distance?: number | undefined;
        completed?: boolean | undefined;
    }[];
    programId?: string | undefined;
    sessionId?: string | undefined;
    notes?: string | undefined;
}>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type WorkoutSet = z.infer<typeof WorkoutSetSchema>;
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;
export type WorkoutProgram = z.infer<typeof WorkoutProgramSchema>;
export type LoggedSet = z.infer<typeof LoggedSetSchema>;
export type WorkoutLog = z.infer<typeof WorkoutLogSchema>;
export type CreateWorkoutProgram = z.infer<typeof CreateWorkoutProgramSchema>;
export type CreateWorkoutLog = z.infer<typeof CreateWorkoutLogSchema>;
