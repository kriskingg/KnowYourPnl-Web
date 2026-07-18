"import type { Broker } from \"@/types\";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from \"@/components/ui/select\";

export const BrokerSelector = ({
  brokers,
  value,
  onChange,
  disabled = false,
}: {
  brokers: Broker[];
  value: string;
  onChange: (slug: string) => void;
  disabled?: boolean;
}) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className=\"rounded-none border-[#0a0a0a] h-10 focus:ring-1 focus:ring-black\"
        data-testid=\"broker-selector-trigger\"
      >
        <SelectValue placeholder=\"Select broker\" />
      </SelectTrigger>
      <SelectContent className=\"rounded-none\">
        {brokers.map((b) => (
          <SelectItem key={b.slug} value={b.slug} data-testid={`broker-option-${b.slug}`}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
"