import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginForm } from "@/hooks/useLoginForm";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6
    }
  }
};

export default function LoginPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { form, isLoading, onSubmit } = useLoginForm();

  // Redirect if the user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <AuthLayout>
      <motion.div 
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AuthHeader 
          title="Welcome Back"
          subtitle="Sign in to continue your fitness journey"
        />

        <AuthForm
          title="Access Your Account"
          description="Enter your credentials to continue"
          footer={
            <>
              <p className="text-sm text-gray-400 font-medium font-manrope">
                Don't have an account?{' '}
                <motion.span whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/signup" 
                    className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                  >
                    Join Now
                  </Link>
                </motion.span>
              </p>
              <motion.div 
                className="mt-4 text-center"
                variants={itemVariants}
              >
                <motion.span 
                  className="text-xs text-gray-500 hover:text-cyan-400 cursor-pointer font-medium font-manrope"
                  whileHover={{ scale: 1.05 }}
                >
                  Forgot Password?
                </motion.span>
              </motion.div>
            </>
          }
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <label className="text-sm font-bold text-gray-300 font-manrope">Email</label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...form.register('email')} 
                  className="w-full"
                  disabled={isLoading}
                />
              </motion.div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-400 font-manrope">{form.formState.errors.email.message}</p>
              )}
            </motion.div>
            
            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <label className="text-sm font-bold text-gray-300 font-manrope">Password</label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  {...form.register('password')} 
                  className="w-full"
                  disabled={isLoading}
                />
              </motion.div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-400 font-manrope">{form.formState.errors.password.message}</p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-3 text-lg font-bold font-manrope disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </motion.div>
          </form>
        </AuthForm>

        <AuthFooter />
      </motion.div>
    </AuthLayout>
  );
}
