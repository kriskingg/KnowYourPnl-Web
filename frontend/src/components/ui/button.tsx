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
        variant === "default" && "bg-black text-white hover:bg-[#c83c2f]",
        variant === "outline" && "border border-black bg-transparent hover:bg-black hover:text-white",
        variant === "ghost" && "hover:bg-black/5",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
