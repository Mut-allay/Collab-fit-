import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { signupSchema, SignupFormValues } from "@/types/signup";

export function useSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      await signup(data.email, data.password, fullName);
      toast({
        title: "Welcome to FitSpark!",
        description:
          "Your account has been created successfully. Let's set up your profile.",
      });
      navigate("/onboarding");
    } catch (error) {
      toast({
        title: "Signup Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during signup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
}
