import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 text-sm font-medium font-manrope transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-cyan-500/30 bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-cyan-300 hover:from-cyan-900/20 hover:to-blue-900/20 hover:text-cyan-200 hover:border-cyan-400/50 backdrop-blur-sm shadow-lg shadow-cyan-500/5 hover:shadow-xl hover:shadow-cyan-500/15",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "text-cyan-300 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20 hover:text-cyan-200",
        link: "text-primary underline-offset-4 hover:underline",
        // FitSpark custom variants (kept for compatibility)
        spark: "bg-spark-500 text-white shadow hover:bg-spark-600",
        fitness: "bg-fitness-500 text-white shadow hover:bg-fitness-600",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
