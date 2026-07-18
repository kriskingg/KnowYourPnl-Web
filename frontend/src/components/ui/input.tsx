import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn("w-full border border-black bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20", className)} {...props} />
  ),
);
Input.displayName = "Input";
