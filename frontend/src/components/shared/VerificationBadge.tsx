"import type { VerificationStatus } from \"@/types\";
import { Check, ShieldCheck, FlaskConical, HelpCircle, User, AlertTriangle } from \"lucide-react\";

const CONFIG: Record<VerificationStatus, { label: string; classes: string; Icon: any }> = {
  official: { label: \"Official\", classes: \"bg-green-50 text-green-800 border-green-300\", Icon: ShieldCheck },
  account_verified: { label: \"Account Verified\", classes: \"bg-blue-50 text-blue-800 border-blue-300\", Icon: Check },
  formula_tested: { label: \"Formula Tested\", classes: \"bg-indigo-50 text-indigo-800 border-indigo-300\", Icon: FlaskConical },
  estimated: { label: \"Estimated\", classes: \"bg-gray-50 text-gray-700 border-gray-300\", Icon: HelpCircle },
  user_modified: { label: \"User Modified\", classes: \"bg-amber-50 text-amber-800 border-amber-300\", Icon: User },
  review_required: { label: \"Review Required\", classes: \"bg-red-50 text-red-800 border-red-300\", Icon: AlertTriangle },
};

export const VerificationBadge = ({
  status,
  size = \"sm\",
  className = \"\",
}: {
  status: VerificationStatus;
  size?: \"sm\" | \"md\";
  className?: string;
}) => {
  const cfg = CONFIG[status] ?? CONFIG.review_required;
  const Icon = cfg.Icon;
  const pad = size === \"md\" ? \"px-2 py-1 text-[12px]\" : \"px-1.5 py-0.5 text-[10.5px]\";
  return (
    <span
      className={`inline-flex items-center gap-1 border font-medium uppercase tracking-[0.06em] ${pad} ${cfg.classes} ${className}`}
      data-testid={`verification-badge-${status}`}
      title={cfg.label}
    >
      <Icon size={size === \"md\" ? 12 : 11} strokeWidth={2} />
      {cfg.label}
    </span>
  );
};
"