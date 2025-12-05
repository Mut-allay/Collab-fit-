import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFooter } from "@/components/auth/AuthFooter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSignupForm } from "@/hooks/useSignupForm";

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

export default function SignupPage() {
  const { form, isLoading, onSubmit } = useSignupForm();

  return (
    <AuthLayout>
      <motion.div 
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AuthHeader 
          title="Join the Movement"
          subtitle="Start your transformation today"
        />

        <AuthForm
          title="Create Your Account"
          description="Build your legacy • Track your power"
          footer={
            <>
              <p className="text-sm text-gray-400 font-medium font-manrope">
                Already have an account?{' '}
                <motion.span whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/login" 
                    className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                  >
                    Sign In
                  </Link>
                </motion.span>
              </p>
              <div className="mt-4 text-xs text-gray-500 text-center font-manrope">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">
                  Privacy Policy
                </Link>
              </div>
            </>
          }
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div 
                className="grid grid-cols-2 gap-3"
                variants={itemVariants}
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-manrope">First Name</FormLabel>
                      <FormControl>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input
                            placeholder="First name"
                            {...field}
                            disabled={isLoading}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-manrope">Last Name</FormLabel>
                      <FormControl>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input
                            placeholder="Last name"
                            {...field}
                            disabled={isLoading}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-manrope">Email</FormLabel>
                      <FormControl>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            disabled={isLoading}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-manrope">Password</FormLabel>
                      <FormControl>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input
                            type="password"
                            placeholder="Create a password"
                            {...field}
                            disabled={isLoading}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-manrope">Confirm Password</FormLabel>
                      <FormControl>
                        <motion.div whileFocus={{ scale: 1.02 }}>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                            disabled={isLoading}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full py-3 text-lg font-bold font-manrope disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Start Training"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </AuthForm>

        <AuthFooter />
      </motion.div>
    </AuthLayout>
  );
}
