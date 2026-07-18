import { useEffect, useState } from "react";
import { tariffService } from "@/services/tariffService";
import type { TariffVersion } from "@/types";
import { TariffHistoryTimeline } from "@/components/shared/TariffHistoryTimeline";

export const TariffsHistory = () => {
  const [versions, setVersions] = useState<TariffVersion[]>([]);
  useEffect(() => { tariffService.listHistory().then(setVersions); }, []);
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10" data-testid="page-tariffs-history">
      <header className="border-b border-[#102A43] pb-6 mb-10">
        <div className="kypnl-overline">Tariff History</div>
        <h1 className="font-editorial text-4xl md:text-5xl font-semibold mt-2">Every change, ever.</h1>
        <p className="text-[14px] text-[#486581] max-w-2xl mt-3">
          A dated timeline of every MTF tariff revision we've captured. Each version supersedes the
          one before it, with itemised diffs where available.
        </p>
      </header>
      <TariffHistoryTimeline versions={versions} />
    </div>
  );
};
