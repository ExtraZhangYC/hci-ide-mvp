import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
  {
    variants: {
      variant: {
        default: "bg-slate-800 text-slate-300 border-slate-700",
        blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
        green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        red: "bg-rose-500/15 text-rose-300 border-rose-500/30",
        violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
        slate: "bg-slate-700/40 text-slate-300 border-slate-600/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
