import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Settings,
  LogOut,
  Trash2,
  Lock,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  AlertTriangle,
  Save,
  Edit,
} from "lucide-react";
import { doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserSchema } from "@fitspark/shared";

// Form validation schema
const ProfileFormSchema = UserSchema.pick({
  displayName: true,
  age: true,
  gender: true,
  height: true,
  weight: true,
  goal: true,
  fitnessExperience: true,
});

type ProfileFormData = {
  displayName: string;
  age: number | undefined;
  gender: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
  height: number | undefined;
  weight: number | undefined;
  goal:
    | "weight_loss"
    | "muscle_gain"
    | "strength"
    | "endurance"
    | "general_fitness"
    | undefined;
  fitnessExperience: "beginner" | "intermediate" | "advanced" | undefined;
};

const GOAL_OPTIONS = [
  { value: "weight_loss", label: "Lose Weight" },
  { value: "muscle_gain", label: "Gain Muscle" },
  { value: "strength", label: "Build Strength" },
  { value: "endurance", label: "Improve Endurance" },
  { value: "general_fitness", label: "General Fitness" },
];

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export default function ProfilePage() {
  const { currentUser, userProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: "",
    age: undefined,
    gender: undefined,
    height: undefined,
    weight: undefined,
    goal: undefined,
    fitnessExperience: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // App settings state
  const [settings, setSettings] = useState({
    darkMode: false,
    dailyReminders: true,
    weeklyEmails: true,
  });

  // Mock motivational stats (replace with real data from Firestore)
  const [motivationalStats] = useState({
    currentStreak: 3,
    totalWorkouts: 24,
    timeSpentWorkingOut: 720, // in minutes
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        age: userProfile.age,
        gender: userProfile.gender,
        height: userProfile.height,
        weight: userProfile.weight,
        goal: userProfile.goal,
        fitnessExperience: userProfile.fitnessExperience,
      });
    }
  }, [userProfile]);

  const calculateBMI = () => {
    if (!formData.height || !formData.weight) return null;

    const heightInMeters = formData.height / 100;
    const bmi = formData.weight / (heightInMeters * heightInMeters);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Healthy Weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    return { value: bmi.toFixed(1), category };
  };

  const validateForm = () => {
    try {
      ProfileFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSave = async () => {
    console.log("🔍 Save attempt - Current user:", currentUser?.uid);
    console.log("🔍 Save attempt - Form data:", formData);

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    if (!currentUser) {
      console.log("❌ No current user");
      toast({
        title: "Error",
        description: "You must be logged in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔍 Attempting to update user document...");
      const userRef = doc(db, "users", currentUser.uid);
      console.log("🔍 User document reference:", userRef.path);

      // Check if user document exists
      const userDoc = await getDoc(userRef);
      console.log("🔍 User document exists:", userDoc.exists());

      const updateData = {
        ...formData,
        updatedAt: new Date(),
      };
      console.log("🔍 Update data:", updateData);

      if (userDoc.exists()) {
        // Document exists, update it
        await updateDoc(userRef, updateData);
        console.log("✅ Profile updated successfully");
      } else {
        // Document doesn't exist, create it
        console.log("🔍 Creating new user document...");
        await setDoc(userRef, {
          ...updateData,
          uid: currentUser.uid,
          email: currentUser.email,
          createdAt: new Date(),
        });
        console.log("✅ Profile created successfully");
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      console.error("❌ Error details:", {
        code: (error as any)?.code,
        message: (error as any)?.message,
        stack: (error as any)?.stack,
      });
      toast({
        title: "Error",
        description: `Failed to update profile: ${(error as any)?.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") return;

    setIsLoading(true);
    try {
      // Delete user data from Firestore
      const userRef = doc(db, "users", currentUser!.uid);
      await deleteDoc(userRef);

      // Delete Firebase Auth user
      await currentUser!.delete();

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
      setDeleteConfirmation("");
    }
  };

  const bmi = calculateBMI();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-muted-foreground mt-1">
                Manage your data, track progress, and control your experience
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="hidden sm:flex"
            >
              Back to Dashboard
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-spark-600" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and fitness goals
                    </CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isLoading}
                  >
                    {isEditing ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={formData.displayName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              displayName: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className={errors.displayName ? "border-red-500" : ""}
                        />
                        {errors.displayName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.displayName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              age: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          disabled={!isEditing}
                          className={errors.age ? "border-red-500" : ""}
                        />
                        {errors.age && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.age}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value: any) =>
                            setFormData({ ...formData, gender: value })
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger
                            className={errors.gender ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENDER_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.gender && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.gender}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Physical Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Physical Metrics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={formData.height || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              height: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          disabled={!isEditing}
                          className={errors.height ? "border-red-500" : ""}
                        />
                        {errors.height && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.height}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={formData.weight || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              weight: e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            })
                          }
                          disabled={!isEditing}
                          className={errors.weight ? "border-red-500" : ""}
                        />
                        {errors.weight && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.weight}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fitness Goals */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Fitness Goals
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="goal">Primary Goal</Label>
                        <Select
                          value={formData.goal}
                          onValueChange={(value: any) =>
                            setFormData({ ...formData, goal: value })
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger
                            className={errors.goal ? "border-red-500" : ""}
                          >
                            <SelectValue placeholder="Select your goal" />
                          </SelectTrigger>
                          <SelectContent>
                            {GOAL_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.goal && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.goal}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="experience">Experience Level</Label>
                        <Select
                          value={formData.fitnessExperience}
                          onValueChange={(value: any) =>
                            setFormData({
                              ...formData,
                              fitnessExperience: value,
                            })
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger
                            className={
                              errors.fitnessExperience ? "border-red-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPERIENCE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.fitnessExperience && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.fitnessExperience}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="min-w-[120px]"
                      >
                        {isLoading ? (
                          "Saving..."
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Calculated Stats */}
            {bmi && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-spark-600" />
                      Calculated Stats
                    </CardTitle>
                    <CardDescription>
                      Metrics calculated from your physical data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-spark-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Body Mass Index (BMI)
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {bmi.value} - {bmi.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-spark-600">
                            {bmi.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Motivational Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-spark-600" />
                    Your Progress
                  </CardTitle>
                  <CardDescription>
                    Track your fitness journey achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Current Streak
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Consecutive weeks
                        </p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {motivationalStats.currentStreak}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Total Workouts
                        </p>
                        <p className="text-sm text-muted-foreground">
                          All time
                        </p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {motivationalStats.totalWorkouts}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Clock className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Time Spent
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Working out
                        </p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(motivationalStats.timeSpentWorkingOut / 60)}h
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* App Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-spark-600" />
                    App Settings
                  </CardTitle>
                  <CardDescription>
                    Customize your FitSpark experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, darkMode: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Daily Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Get daily workout reminders
                      </p>
                    </div>
                    <Switch
                      checked={settings.dailyReminders}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, dailyReminders: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Emails</p>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly progress summaries
                      </p>
                    </div>
                    <Switch
                      checked={settings.weeklyEmails}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, weeklyEmails: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Management */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="border-0 shadow-lg border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Account Management
                  </CardTitle>
                  <CardDescription className="text-red-600">
                    Critical account actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full justify-start"
                    disabled={isLoading}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={isLoading}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and new password to update
                          your account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Update Password</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="deleteConfirmation">
                            Type "DELETE" to confirm
                          </Label>
                          <Input
                            id="deleteConfirmation"
                            value={deleteConfirmation}
                            onChange={(e) =>
                              setDeleteConfirmation(e.target.value)
                            }
                            placeholder="DELETE"
                          />
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={
                            deleteConfirmation !== "DELETE" || isLoading
                          }
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isLoading ? "Deleting..." : "Delete Account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
