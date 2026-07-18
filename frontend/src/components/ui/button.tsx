import * as React from "react";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" && "bg-[#102A43] text-white hover:bg-[#087F6D]",
        variant === "outline" && "border border-[#102A43] bg-transparent hover:bg-[#102A43] hover:text-white",
        variant === "ghost" && "hover:bg-[#102A43]/5",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
