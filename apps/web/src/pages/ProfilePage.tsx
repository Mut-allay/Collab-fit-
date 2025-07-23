import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
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
  UserProfileUpdateSchema,
  type UserProfileUpdate,
} from "@fitspark/shared";
import {
  User,
  Edit,
  Save,
  X,
  Target,
  Activity,
  Calendar,
  Weight,
  Ruler,
  Award,
} from "lucide-react";

const GOALS = [
  { value: "weight_loss", label: "Weight Loss", emoji: "🔥" },
  { value: "muscle_gain", label: "Muscle Gain", emoji: "💪" },
  { value: "strength", label: "Strength", emoji: "🏋️" },
  { value: "endurance", label: "Endurance", emoji: "🏃" },
  { value: "general_fitness", label: "General Fitness", emoji: "⚡" },
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary" },
  { value: "lightly_active", label: "Lightly Active" },
  { value: "moderately_active", label: "Moderately Active" },
  { value: "very_active", label: "Very Active" },
  { value: "extremely_active", label: "Extremely Active" },
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

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();

  const form = useForm<UserProfileUpdate>({
    resolver: zodResolver(UserProfileUpdateSchema),
    defaultValues: {
      displayName: "",
      goal: undefined,
      activityLevel: undefined,
      age: undefined,
      gender: undefined,
      height: undefined,
      weight: undefined,
      targetWeight: undefined,
      fitnessExperience: undefined,
      workoutDaysPerWeek: undefined,
      workoutDuration: undefined,
      equipment: [],
      injuries: [],
    },
  });

  useEffect(() => {
    if (userProfile) {
      // Populate form with existing user data
      form.reset({
        displayName: userProfile.displayName || currentUser?.displayName || "",
        goal: userProfile.goal,
        activityLevel: userProfile.activityLevel,
        age: userProfile.age,
        gender: userProfile.gender,
        height: userProfile.height,
        weight: userProfile.weight,
        targetWeight: userProfile.targetWeight,
        fitnessExperience: userProfile.fitnessExperience,
        workoutDaysPerWeek: userProfile.workoutDaysPerWeek,
        workoutDuration: userProfile.workoutDuration,
        equipment: userProfile.equipment || [],
        injuries: userProfile.injuries || [],
      });
      setSelectedEquipment(userProfile.equipment || []);
    }
    setIsLoading(false);
  }, [userProfile, currentUser, form]);

  const toggleEquipment = (equipment: string) => {
    const updated = selectedEquipment.includes(equipment)
      ? selectedEquipment.filter((e) => e !== equipment)
      : [...selectedEquipment, equipment];
    setSelectedEquipment(updated);
    form.setValue("equipment", updated);
  };

  const handleSave = async (data: UserProfileUpdate) => {
    if (!currentUser) return;

    setIsSaving(true);
    try {
      // TODO: Replace with tRPC call when implemented
      // await trpc.user.updateProfile.mutate(data);

      console.log("Profile update data:", data);

      toast({
        title: "Profile updated! ✅",
        description: "Your changes have been saved successfully.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
    if (userProfile) {
      setSelectedEquipment(userProfile.equipment || []);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">👤</div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const currentGoal = GOALS.find((g) => g.value === userProfile?.goal);
  const currentExperience = EXPERIENCE_LEVELS.find(
    (e) => e.value === userProfile?.fitnessExperience
  );
  const currentActivity = ACTIVITY_LEVELS.find(
    (a) => a.value === userProfile?.activityLevel
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-muted-foreground">
                Manage your personal information and fitness preferences
              </p>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={form.handleSubmit(handleSave)}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-spark-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-spark-600" />
                </div>
                <CardTitle className="text-xl">
                  {userProfile?.displayName ||
                    currentUser?.displayName ||
                    "User"}
                </CardTitle>
                <CardDescription>{currentUser?.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentGoal && (
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-spark-600" />
                    <div>
                      <p className="font-medium">
                        {currentGoal.emoji} {currentGoal.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Primary Goal
                      </p>
                    </div>
                  </div>
                )}

                {currentExperience && (
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-spark-600" />
                    <div>
                      <p className="font-medium">{currentExperience.label}</p>
                      <p className="text-sm text-muted-foreground">
                        Experience Level
                      </p>
                    </div>
                  </div>
                )}

                {userProfile?.workoutDaysPerWeek && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-spark-600" />
                    <div>
                      <p className="font-medium">
                        {userProfile.workoutDaysPerWeek} days/week
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Workout Frequency
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSave)}
                className="space-y-6"
              >
                {/* Basic Information */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              className={!isEditing ? "bg-gray-50" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-gray-50" : ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : undefined
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
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className={!isEditing ? "bg-gray-50" : ""}
                                >
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

                      <FormField
                        control={form.control}
                        name="fitnessExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className={!isEditing ? "bg-gray-50" : ""}
                                >
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {EXPERIENCE_LEVELS.map((level) => (
                                  <SelectItem
                                    key={level.value}
                                    value={level.value}
                                  >
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Physical Information */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Weight className="h-5 w-5" />
                      Physical Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-gray-50" : ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : undefined
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
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-gray-50" : ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : undefined
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
                        name="targetWeight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Weight (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-gray-50" : ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? Number(e.target.value)
                                      : undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Fitness Preferences */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Fitness Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Goal</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={!isEditing ? "bg-gray-50" : ""}
                              >
                                <SelectValue placeholder="Select goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GOALS.map((goal) => (
                                <SelectItem key={goal.value} value={goal.value}>
                                  {goal.emoji} {goal.label}
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
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditing}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={!isEditing ? "bg-gray-50" : ""}
                              >
                                <SelectValue placeholder="Select activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ACTIVITY_LEVELS.map((level) => (
                                <SelectItem
                                  key={level.value}
                                  value={level.value}
                                >
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              defaultValue={field.value?.toString()}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className={!isEditing ? "bg-gray-50" : ""}
                                >
                                  <SelectValue placeholder="Select days" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                                  <SelectItem
                                    key={days}
                                    value={days.toString()}
                                  >
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
                            <FormLabel>Workout Duration (minutes)</FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              defaultValue={field.value?.toString()}
                              disabled={!isEditing}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className={!isEditing ? "bg-gray-50" : ""}
                                >
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

                    {/* Equipment */}
                    <FormField
                      control={form.control}
                      name="equipment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Equipment</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {EQUIPMENT_OPTIONS.map((equipment) => (
                                <Badge
                                  key={equipment}
                                  variant={
                                    selectedEquipment.includes(equipment)
                                      ? "default"
                                      : "outline"
                                  }
                                  className={`cursor-pointer p-2 text-center justify-center hover:bg-spark-100 ${
                                    !isEditing
                                      ? "cursor-default opacity-50"
                                      : ""
                                  }`}
                                  onClick={
                                    isEditing
                                      ? () => toggleEquipment(equipment)
                                      : undefined
                                  }
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
                  </CardContent>
                </Card>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
