import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectTrigger = ({ className, children, ...props }: SelectPrimitive.SelectTriggerProps) => (
  <SelectPrimitive.Trigger className={cn("flex h-10 w-full items-center justify-between border border-[#102A43] bg-white px-3 text-sm", className)} {...props}>
    {children}<SelectPrimitive.Icon><ChevronDown size={15} /></SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);
export const SelectContent = ({ className, children, ...props }: SelectPrimitive.SelectContentProps) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content className={cn("z-50 min-w-[var(--radix-select-trigger-width)] border border-[#102A43] bg-white shadow-xl", className)} {...props}>
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);
export const SelectItem = ({ className, children, ...props }: SelectPrimitive.SelectItemProps) => (
  <SelectPrimitive.Item className={cn("relative flex cursor-pointer select-none items-center py-2 pl-8 pr-3 text-sm outline-none hover:bg-[#f1efe8]", className)} {...props}>
    <span className="absolute left-2"><SelectPrimitive.ItemIndicator><Check size={14} /></SelectPrimitive.ItemIndicator></span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);
