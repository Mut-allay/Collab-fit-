import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  OnboardingStepOneSchema,
  OnboardingStepTwoSchema,
  OnboardingStepThreeSchema,
  OnboardingStepFourSchema,
  OnboardingDataSchema,
  type OnboardingStepOne,
  type OnboardingStepTwo,
  type OnboardingStepThree,
  type OnboardingStepFour,
  type OnboardingData,
} from "@fitspark/shared";
import {
  Target,
  User,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Dumbbell,
} from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Fitness Goals",
    description: "Let's understand what you want to achieve",
    icon: Target,
    schema: OnboardingStepOneSchema,
  },
  {
    id: 2,
    title: "Personal Info",
    description: "Help us personalize your experience",
    icon: User,
    schema: OnboardingStepTwoSchema,
  },
  {
    id: 3,
    title: "Activity Level",
    description: "Tell us about your current activity",
    icon: Activity,
    schema: OnboardingStepThreeSchema,
  },
  {
    id: 4,
    title: "Equipment & Preferences",
    description: "Final details to perfect your plan",
    icon: Settings,
    schema: OnboardingStepFourSchema,
  },
];

const GOALS = [
  {
    value: "weight_loss",
    label: "Weight Loss",
    emoji: "🔥",
    description: "Burn fat and lose weight",
  },
  {
    value: "muscle_gain",
    label: "Muscle Gain",
    emoji: "💪",
    description: "Build lean muscle mass",
  },
  {
    value: "strength",
    label: "Strength",
    emoji: "🏋️",
    description: "Increase overall strength",
  },
  {
    value: "endurance",
    label: "Endurance",
    emoji: "🏃",
    description: "Improve cardiovascular fitness",
  },
  {
    value: "general_fitness",
    label: "General Fitness",
    emoji: "⚡",
    description: "Stay healthy and active",
  },
];

const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to fitness or returning after a break",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Some experience with regular workouts",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Experienced with consistent training",
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
  "No Equipment",
  "Dumbbells",
  "Resistance Bands",
  "Pull-up Bar",
  "Yoga Mat",
  "Kettlebell",
  "Barbell",
  "Full Gym Access",
  "Treadmill",
  "Stationary Bike",
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentStepData = STEPS.find((step) => step.id === currentStep)!;

  const form = useForm({
    resolver: zodResolver(currentStepData.schema),
    defaultValues: onboardingData,
    mode: "onChange",
  });

  const handleNext = async (data: any) => {
    // Merge current step data
    const updatedData = { ...onboardingData, ...data };
    setOnboardingData(updatedData);

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      // Reset form for next step
      form.reset();
    } else {
      // Final step - submit all data
      await handleSubmit(updatedData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      form.reset();
    }
  };

  const handleSubmit = async (finalData: OnboardingData) => {
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      // Validate complete data
      const validatedData = OnboardingDataSchema.parse(finalData);

      // TODO: Replace with tRPC call when implemented
      // await trpc.user.onboardNewUser.mutate(validatedData);

      console.log("Onboarding data:", validatedData);

      toast({
        title: "Welcome to FitSpark! 🎉",
        description: "Your profile has been created successfully.",
      });

      navigate("/plans");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne form={form} />;
      case 2:
        return <StepTwo form={form} />;
      case 3:
        return <StepThree form={form} />;
      case 4:
        return <StepFour form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spark-50 via-fitness-50 to-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-8 w-8 text-spark-500" />
            <span className="text-2xl font-bold text-spark-500">FitSpark</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome to Your Fitness Journey!
          </h1>
          <p className="text-muted-foreground">
            Let's create a personalized workout plan just for you
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-spark-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 transition-colors ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              Step {currentStep}: {currentStepData.title}
            </CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleNext)}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

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

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                    variant={currentStep === STEPS.length ? "spark" : "default"}
                  >
                    {currentStep === STEPS.length ? (
                      isSubmitting ? (
                        "Creating Profile..."
                      ) : (
                        "Complete Setup"
                      )
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Step Components
function StepOne({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              What's your primary fitness goal?
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOALS.map((goal) => (
                  <Card
                    key={goal.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      field.value === goal.value
                        ? "ring-2 ring-spark-500 bg-spark-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => field.onChange(goal.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{goal.emoji}</div>
                      <div className="font-medium">{goal.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {goal.description}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fitnessExperience"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              What's your fitness experience?
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                {EXPERIENCE_LEVELS.map((level) => (
                  <Card
                    key={level.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      field.value === level.value
                        ? "ring-2 ring-spark-500 bg-spark-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => field.onChange(level.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {level.description}
                          </div>
                        </div>
                        {field.value === level.value && (
                          <CheckCircle className="h-5 w-5 text-spark-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function StepTwo({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="25"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="175"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
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
                  placeholder="70"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function StepThree({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="activityLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              What's your current activity level?
            </FormLabel>
            <FormControl>
              <div className="space-y-3">
                {ACTIVITY_LEVELS.map((level) => (
                  <Card
                    key={level.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      field.value === level.value
                        ? "ring-2 ring-spark-500 bg-spark-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => field.onChange(level.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {level.description}
                          </div>
                        </div>
                        {field.value === level.value && (
                          <CheckCircle className="h-5 w-5 text-spark-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="workoutDaysPerWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Days Per Week</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                    <SelectItem key={days} value={days.toString()}>
                      {days} {days === 1 ? "day" : "days"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workoutDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Workout Duration (minutes)</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function StepFour({ form }: { form: any }) {
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [injuries, setInjuries] = useState<string[]>([]);

  const toggleEquipment = (equipment: string) => {
    const updated = selectedEquipment.includes(equipment)
      ? selectedEquipment.filter((e) => e !== equipment)
      : [...selectedEquipment, equipment];
    setSelectedEquipment(updated);
    form.setValue("equipment", updated);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="equipment"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              What equipment do you have access to?
            </FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EQUIPMENT_OPTIONS.map((equipment) => (
                  <Badge
                    key={equipment}
                    variant={
                      selectedEquipment.includes(equipment)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer p-3 h-auto text-center justify-center hover:bg-spark-100"
                    onClick={() => toggleEquipment(equipment)}
                  >
                    {equipment}
                  </Badge>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="targetWeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Weight (kg) - Optional</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="65"
                {...field}
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="injuries"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Any injuries or limitations? (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., knee injury, back problems"
                value={injuries.join(", ")}
                onChange={(e) => {
                  const injuryList = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  setInjuries(injuryList);
                  field.onChange(injuryList);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
