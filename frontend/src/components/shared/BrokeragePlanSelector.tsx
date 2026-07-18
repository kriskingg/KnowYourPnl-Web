import type { BrokeragePlan } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const BrokeragePlanSelector = ({
  plans,
  value,
  onChange,
}: {
  plans: BrokeragePlan[];
  value: string;
  onChange: (id: string) => void;
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className="rounded-none border-[#0a0a0a] h-10 focus:ring-1 focus:ring-black"
        data-testid="plan-selector-trigger"
      >
        <SelectValue placeholder="Select plan" />
      </SelectTrigger>
      <SelectContent className="rounded-none">
        {plans.map((p) => (
          <SelectItem key={p.id} value={p.id} data-testid={`plan-option-${p.id}`}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
