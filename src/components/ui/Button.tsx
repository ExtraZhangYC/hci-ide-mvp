import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-command/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:pointer-events-none disabled:opacity-40 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        // routine machine command
        primary:
          "bg-command text-white hover:bg-command-soft shadow-glow",
        secondary:
          "bg-ink-700/70 text-slate-100 hover:bg-ink-600 border border-line-bright",
        ghost: "text-slate-300 hover:bg-ink-700 hover:text-white",
        outline:
          "border border-line-bright text-slate-200 hover:bg-ink-700 hover:border-slate-500",
        success: "bg-emerald-600 text-white hover:bg-emerald-500",
        // human-authority act — the warm thread
        warning:
          "bg-human text-ink-950 hover:bg-human-soft font-semibold shadow-glow-human",
        danger: "bg-rose-600 text-white hover:bg-rose-500",
        council:
          "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-900/30",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
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
