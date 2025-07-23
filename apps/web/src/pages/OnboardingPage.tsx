import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { OnboardingSchema, type OnboardingData } from "@fitspark/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Activity,
  User,
  Ruler,
  Dumbbell,
  CheckCircle,
} from "lucide-react";

const GOALS = [
  {
    value: "weight_loss",
    label: "Weight Loss",
    icon: "🔥",
    description: "Burn fat and get lean",
  },
  {
    value: "muscle_gain",
    label: "Muscle Gain",
    icon: "💪",
    description: "Build strength and muscle mass",
  },
  {
    value: "strength",
    label: "Strength",
    icon: "🏋️",
    description: "Increase overall strength",
  },
  {
    value: "endurance",
    label: "Endurance",
    icon: "🏃",
    description: "Improve cardiovascular fitness",
  },
  {
    value: "general_fitness",
    label: "General Fitness",
    icon: "🎯",
    description: "Overall health and wellness",
  },
];

const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to fitness or returning after a long break",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Some experience with regular workouts",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Experienced with various training methods",
  },
];

const ACTIVITY_LEVELS = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little to no exercise",
  },
  {
    value: "lightly_active",
    label: "Lightly Active",
    description: "Light exercise 1-3 days/week",
  },
  {
    value: "moderately_active",
    label: "Moderately Active",
    description: "Moderate exercise 3-5 days/week",
  },
  {
    value: "very_active",
    label: "Very Active",
    description: "Hard exercise 6-7 days/week",
  },
  {
    value: "extremely_active",
    label: "Extremely Active",
    description: "Very hard exercise, physical job",
  },
];

const EQUIPMENT_OPTIONS = [
  "Bodyweight Only",
  "Dumbbells",
  "Resistance Bands",
  "Pull-up Bar",
  "Bench",
  "Barbell",
  "Kettlebell",
  "Cardio Equipment",
  "Full Gym Access",
];

const INJURY_OPTIONS = [
  "None",
  "Back Pain",
  "Knee Issues",
  "Shoulder Problems",
  "Ankle/Foot Issues",
  "Wrist/Elbow Issues",
  "Other",
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>([]);
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const form = useForm<OnboardingData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      displayName: userProfile?.displayName || "",
      age: userProfile?.age || undefined,
      gender: userProfile?.gender || "prefer_not_to_say",
      height: userProfile?.height || undefined,
      weight: userProfile?.weight || undefined,
      targetWeight: userProfile?.targetWeight || undefined,
      goal: userProfile?.goal || "general_fitness",
      fitnessExperience: userProfile?.fitnessExperience || "beginner",
      activityLevel: userProfile?.activityLevel || "moderately_active",
      workoutDaysPerWeek: userProfile?.workoutDaysPerWeek || 3,
      workoutDuration: userProfile?.workoutDuration || 45,
      equipment: userProfile?.equipment || [],
      injuries: userProfile?.injuries || [],
    },
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEquipmentToggle = (equipment: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
    form.setValue("equipment", selectedEquipment);
  };

  const handleInjuryToggle = (injury: string) => {
    setSelectedInjuries((prev) =>
      prev.includes(injury)
        ? prev.filter((i) => i !== injury)
        : [...prev, injury]
    );
    form.setValue("injuries", selectedInjuries);
  };

  const onSubmit = async (data: OnboardingData) => {
    try {
      // TODO: Implement tRPC procedure to save onboarding data
      console.log("Onboarding data:", data);

      // For now, just navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <User className="h-12 w-12 mx-auto mb-4 text-spark-600" />
              <h2 className="text-2xl font-bold mb-2">
                Tell Us About Yourself
              </h2>
              <p className="text-muted-foreground">
                Let's start with some basic information
              </p>
            </div>

            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Ruler className="h-12 w-12 mx-auto mb-4 text-spark-600" />
              <h2 className="text-2xl font-bold mb-2">Physical Information</h2>
              <p className="text-muted-foreground">
                Help us understand your current physical state
              </p>
            </div>

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your height in cm"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your height in centimeters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your current weight in kg"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your current weight in kilograms
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your target weight in kg"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || undefined)
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your target weight in kilograms
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Target className="h-12 w-12 mx-auto mb-4 text-spark-600" />
              <h2 className="text-2xl font-bold mb-2">Fitness Goals</h2>
              <p className="text-muted-foreground">
                What do you want to achieve?
              </p>
            </div>

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Goal</FormLabel>
                  <div className="grid gap-3">
                    {GOALS.map((goal) => (
                      <div
                        key={goal.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          field.value === goal.value
                            ? "border-spark-500 bg-spark-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => field.onChange(goal.value)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{goal.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold">{goal.label}</h3>
                            <p className="text-sm text-muted-foreground">
                              {goal.description}
                            </p>
                          </div>
                          {field.value === goal.value && (
                            <CheckCircle className="h-5 w-5 text-spark-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fitnessExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Experience</FormLabel>
                  <div className="grid gap-3">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <div
                        key={level.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          field.value === level.value
                            ? "border-spark-500 bg-spark-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => field.onChange(level.value)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{level.label}</h3>
                            <p className="text-sm text-muted-foreground">
                              {level.description}
                            </p>
                          </div>
                          {field.value === level.value && (
                            <CheckCircle className="h-5 w-5 text-spark-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Activity className="h-12 w-12 mx-auto mb-4 text-spark-600" />
              <h2 className="text-2xl font-bold mb-2">Activity & Schedule</h2>
              <p className="text-muted-foreground">
                How active are you and how much time can you commit?
              </p>
            </div>

            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Activity Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIVITY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div>
                            <div className="font-medium">{level.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {level.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="workoutDaysPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workout Days per Week</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="7"
                        placeholder="3"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workoutDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workout Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        max="180"
                        placeholder="45"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-spark-600" />
              <h2 className="text-2xl font-bold mb-2">Equipment & Health</h2>
              <p className="text-muted-foreground">
                What equipment do you have access to?
              </p>
            </div>

            <FormField
              control={form.control}
              name="equipment"
              render={() => (
                <FormItem>
                  <FormLabel>Available Equipment</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {EQUIPMENT_OPTIONS.map((equipment) => (
                      <div
                        key={equipment}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedEquipment.includes(equipment)
                            ? "border-spark-500 bg-spark-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleEquipmentToggle(equipment)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {equipment}
                          </span>
                          {selectedEquipment.includes(equipment) && (
                            <CheckCircle className="h-4 w-4 text-spark-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="injuries"
              render={() => (
                <FormItem>
                  <FormLabel>Health Considerations (Optional)</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {INJURY_OPTIONS.map((injury) => (
                      <div
                        key={injury}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedInjuries.includes(injury)
                            ? "border-spark-500 bg-spark-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleInjuryToggle(injury)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{injury}</span>
                          {selectedInjuries.includes(injury) && (
                            <CheckCircle className="h-4 w-4 text-spark-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Select any health considerations that might affect your
                    workouts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to FitSpark!
          </CardTitle>
          <CardDescription>
            Let's personalize your fitness journey
          </CardDescription>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
            <div
              className="bg-spark-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex items-center gap-2">
                    Complete Setup
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
