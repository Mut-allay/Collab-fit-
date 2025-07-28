import { Link } from "react-router-dom";
import { useLoginForm } from "@/hooks/useLoginForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export function LoginForm() {
    const { form, isLoading, onSubmit } = useLoginForm();

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="m@example.com"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <Link to="/forgot-password" className="text-sm underline">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                        <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
                            Login with Google
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
