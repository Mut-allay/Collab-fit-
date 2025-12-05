import { motion } from "framer-motion";
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
import { useProfileForm } from "@/hooks/useProfileForm";
import { GOAL_OPTIONS, EXPERIENCE_OPTIONS, GENDER_OPTIONS } from "@/types/profile";

export default function ProfilePage() {
  const {
    // State
    isEditing,
    isLoading,
    formData,
    errors,
    deleteConfirmation,
    showDeleteDialog,
    settings,
    motivationalStats,

    // Actions
    setIsEditing,
    setFormData,
    setDeleteConfirmation,
    setShowDeleteDialog,
    setSettings,

    // Computed
    calculateBMI,

    // Handlers
    handleSave,
    handleLogout,
    handleDeleteAccount,
  } = useProfileForm();

  const bmi = calculateBMI();

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/hero-2.png"
          alt="Fitness background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/70" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <User className="h-5 w-5 text-spark-600" />
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Update your personal information and fitness goals
                    </CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
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
                          value={formData.gender || ""}
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
                          value={formData.goal || ""}
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
                          value={formData.fitnessExperience || ""}
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
