import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    className?: string;
    message?: string;
}

export function LoadingSpinner({ className, message }: LoadingSpinnerProps) {
    return (
        <div className={cn("flex items-center justify-center min-h-screen", className)}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spark-500 mx-auto"></div>
                {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
            </div>
        </div>
    );
}
