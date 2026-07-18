import { useEffect, useState } from "react";
import { tariffService } from "@/services/tariffService";
import type { TariffVersion } from "@/types";
import { TariffVersionCard } from "@/components/shared/TariffVersionCard";

export const TariffsCurrent = () => {
  const [versions, setVersions] = useState<TariffVersion[]>([]);
  useEffect(() => { tariffService.listCurrent().then(setVersions); }, []);
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid="page-tariffs-current">
      <header className="border-b border-[#102A43] pb-6 mb-8">
        <div className="kypnl-overline">Current Models</div>
        <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">Active broker coverage.</h1>
        <p className="text-[14px] text-[#486581] max-w-2xl mt-3">
          The active private model version for every supported broker and plan. Exact tariff values
          and evidence records remain internal to protect KnowYourPNL’s broker intelligence.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        {versions.map((v) => <TariffVersionCard key={v.id} version={v} />)}
      </div>
    </div>
  );
};
