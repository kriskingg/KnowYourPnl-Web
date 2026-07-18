import { Link } from "react-router-dom";
import { ArrowRight, ShieldAlert, Calculator as CalcIcon, Landmark, BookOpen } from "lucide-react";
import { AdSlot } from "@/components/shared/AdSlot";

export const Home = () => {
  return (
    <div data-testid="page-home">
      {/* HERO */}
      <section className="border-b border-[#102A43]">
        <div className="mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-16 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <div className="kypnl-overline mb-6">Independent MTF Cost Intelligence</div>
            <h1 className="font-editorial text-4xl md:text-6xl leading-[1.02] tracking-tight font-semibold">
              Know the true<br /> cost of <span className="italic text-[#087F6D]">MTF</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[#102A43]">
              Calculate MTF interest, brokerage, taxes, pledge charges, unpledge charges, DP charges,
              break-even price and estimated net profit using transparent, broker-specific
              assumptions — with every value traceable to a verifiable source.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 bg-[#102A43] text-[#F7F5EF] px-5 py-3 text-[14px] font-medium hover:bg-[#087F6D] transition-colors duration-100"
                data-testid="home-cta-calculate"
              >
                Calculate MTF cost <ArrowRight size={14} strokeWidth={2} />
              </Link>
              <Link
                to="/brokers"
                className="inline-flex items-center gap-2 border border-[#102A43] px-5 py-3 text-[14px] font-medium hover:bg-white transition-colors duration-100"
                data-testid="home-cta-brokers"
              >
                Explore broker charges
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 border border-[#102A43] bg-white p-5">
            <div className="kypnl-overline">Editor's Note</div>
            <p className="mt-2 text-[13px] leading-relaxed">
              KnowYourPNL exists because MTF cost disclosure across brokers is inconsistent.
              Interest is quoted per year; charges are quoted per event; ledgers are quoted after
              the fact. We reconcile all three, then show our work.
            </p>
            <div className="mt-4 pt-4 border-t border-[#e5e5df] flex items-center gap-2 text-[12px] text-[#486581]">
              <ShieldAlert size={13} strokeWidth={1.75} />
              All values shown are demonstration data pending verification.
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-6"><AdSlot id="home-leaderboard" /></div>
      {/* CAPABILITIES */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-3 gap-0 border border-[#102A43] bg-white">
          <Capability
            icon={<CalcIcon size={16} strokeWidth={1.75} />}
            title="MTF Cost Calculator"
            body="Interest, brokerage, taxes, pledge and DP charges reconciled into a single break-even and net P&L."
            to="/calculator"
            testid="capability-calculator"
          />
          <Capability
            icon={<Landmark size={16} strokeWidth={1.75} />}
            title="Broker Charges"
            body="Every MTF line-item for supported brokers, versioned, dated and cross-referenced."
            to="/brokers"
            testid="capability-brokers"
            border
          />
          <Capability
            icon={<BookOpen size={16} strokeWidth={1.75} />}
            title="Methodology"
            body="Formulas, assumptions and verification statuses that determine every value on this site."
            to="/methodology"
            testid="capability-methodology"
            border
          />
        </div>
      </section>

      {/* WHAT WE COVER */}
      <section className="border-t border-[#102A43]">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="kypnl-overline">Currently Covered</div>
            <h2 className="font-editorial text-3xl mt-2">MTF, in full.</h2>
          </div>
          <ul className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-[#e5e5df] border border-[#102A43] bg-white">
            {[
              "MTF cost calculation",
              "MTF broker charges",
              "MTF broker comparison",
              "MTF ledger tracking",
              "MTF tariff verification",
              "MTF methodology",
              "MTF evidence sources",
            ].map((c) => (
              <li key={c} className="px-4 py-4 text-[14px] border-b sm:border-b border-[#e5e5df]">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

const Capability = ({
  icon,
  title,
  body,
  to,
  testid,
  border,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  to: string;
  testid: string;
  border?: boolean;
}) => (
  <Link
    to={to}
    className={`p-6 hover:bg-[#f5f5ef] transition-colors duration-100 ${border ? "border-t md:border-t-0 md:border-l border-[#102A43]" : ""}`}
    data-testid={testid}
  >
    <div className="flex items-center gap-2 kypnl-overline">{icon} {title}</div>
    <p className="mt-3 text-[14px] leading-relaxed text-[#102A43]">{body}</p>
    <div className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium">
      Open <ArrowRight size={13} strokeWidth={2} />
    </div>
  </Link>
);
