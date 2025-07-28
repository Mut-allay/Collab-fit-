import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if the user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
