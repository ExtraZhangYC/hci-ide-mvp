import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-40 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/30",
        secondary:
          "bg-ink-700 text-slate-100 hover:bg-ink-600 border border-slate-700/70",
        ghost: "text-slate-300 hover:bg-ink-700 hover:text-white",
        outline:
          "border border-slate-700 text-slate-200 hover:bg-ink-700 hover:border-slate-600",
        success: "bg-emerald-600 text-white hover:bg-emerald-500",
        warning: "bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold",
        danger: "bg-rose-600 text-white hover:bg-rose-500",
        council:
          "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-900/30",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
