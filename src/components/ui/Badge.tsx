import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-ink-800 text-slate-300 border-line-bright",
        blue: "bg-command/10 text-command-soft border-command/30",
        green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
        amber: "bg-human/10 text-human-soft border-human/30",
        red: "bg-rose-500/10 text-rose-300 border-rose-500/30",
        violet: "bg-violet-500/10 text-violet-300 border-violet-500/30",
        slate: "bg-slate-700/30 text-slate-400 border-line-bright",
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
