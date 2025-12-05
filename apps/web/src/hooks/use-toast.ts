import { toast as sonnerToast } from "sonner";

// --- IMPERATIVE API ---
// Wrapper for sonner toast to maintain compatibility with existing code
export function toast({ title, description, variant, ...props }: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  [key: string]: any;
}) {
  if (variant === "destructive") {
    return sonnerToast.error(title || description || "An error occurred", {
      description: title && description ? description : undefined,
      ...props,
    });
  }
  
  if (variant === "success") {
    return sonnerToast.success(title || description || "Success", {
      description: title && description ? description : undefined,
      ...props,
    });
  }

  return sonnerToast(title || description || "Notification", {
    description: title && description ? description : undefined,
    ...props,
  });
}

// --- REACT HOOK ---
// Hook for compatibility with existing code
export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}
