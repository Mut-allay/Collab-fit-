import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProfileFormSchema, ProfileFormData } from "@/types/profile";

export function useProfileForm() {
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
    if (!validateForm()) {
      return;
    }

    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      const updateData = {
        ...formData,
        updatedAt: new Date(),
      };

      if (userDoc.exists()) {
        await updateDoc(userRef, updateData);
      } else {
        await setDoc(userRef, {
          ...updateData,
          uid: currentUser.uid,
          email: currentUser.email,
          createdAt: new Date(),
        });
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
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
      const userRef = doc(db, "users", currentUser!.uid);
      await deleteDoc(userRef);
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

  return {
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
  };
}
