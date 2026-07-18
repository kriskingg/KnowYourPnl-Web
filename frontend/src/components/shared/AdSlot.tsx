import { ReactNode } from "react";

export type AdMode = "disabled" | "house" | "direct" | "adsense";

type Props = {
  id: string;
  label?: string;
  mode?: AdMode;
  children?: ReactNode;
  className?: string;
};

export const AdSlot = ({ id, label = "Advertisement", mode = "house", children, className = "" }: Props) => {
  if (mode === "disabled") return null;
  return (
    <aside
      id={id}
      aria-label={label}
      className={`my-8 min-h-[108px] border border-[#d8d5cc] bg-[#f1efe8] px-5 py-4 flex items-center justify-center text-center ${className}`}
      data-ad-mode={mode}
      data-testid={`ad-slot-${id}`}
    >
      <div>
        <div className="kypnl-overline mb-2">{label}</div>
        {children ?? (
          <>
            <p className="font-editorial text-lg">Understand the cost before you use leverage.</p>
            <a href="/calculator" className="mt-2 inline-block text-sm font-medium underline underline-offset-4">Try the MTF calculator</a>
          </>
        )}
      </div>
    </aside>
  );
};
