import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none rounded-md border border-line-bright bg-ink-900 px-3 py-2 font-mono text-[13px] leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-command focus:outline-none focus:ring-1 focus:ring-command/40",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
