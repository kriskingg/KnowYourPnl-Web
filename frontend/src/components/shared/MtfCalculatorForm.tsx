"import { useEffect, useMemo, useState } from \"react\";
import type { Broker, CalculationInput, CalculationResult } from \"@/types\";
import { BrokerSelector } from \"./BrokerSelector\";
import { BrokeragePlanSelector } from \"./BrokeragePlanSelector\";
import { Input } from \"@/components/ui/input\";
import { Label } from \"@/components/ui/label\";
import { Button } from \"@/components/ui/button\";
import { calculateMtf } from \"@/services/calculationService\";

const inputCls =
  \"rounded-none border-[#0a0a0a] h-10 focus-visible:ring-1 focus-visible:ring-black font-mono-ibm text-[13px]\";

type Props = {
  brokers: Broker[];
  initialBrokerSlug?: string;
  onResult: (result: CalculationResult) => void;
};

export const MtfCalculatorForm = ({ brokers, initialBrokerSlug, onResult }: Props) => {
  const defaultBroker = brokers.find((b) => b.slug === initialBrokerSlug) ?? brokers[0];

  const [brokerSlug, setBrokerSlug] = useState(defaultBroker.slug);
  const broker = useMemo(() => brokers.find((b) => b.slug === brokerSlug)!, [brokers, brokerSlug]);
  const [planId, setPlanId] = useState(broker.plans[0].id);

  const [buyPrice, setBuyPrice] = useState(2890.5);
  const [quantity, setQuantity] = useState(40);
  const [expectedSellPrice, setExpectedSellPrice] = useState(3050);
  const [purchaseDate, setPurchaseDate] = useState(\"2026-01-08\");
  const [expectedExitDate, setExpectedExitDate] = useState(\"2026-03-08\");
  const [userMarginPct, setUserMarginPct] = useState(broker.mtf.minMarginPct);
  const [brokerFundedPct, setBrokerFundedPct] = useState(broker.mtf.brokerFundedPct);
  const [annualInterestRatePct, setAnnualInterestRatePct] = useState(broker.mtf.annualInterestRatePct);
  const [pledgeRequests, setPledgeRequests] = useState(1);
  const [unpledgeRequests, setUnpledgeRequests] = useState(1);
  const [dpDebitEvents, setDpDebitEvents] = useState(1);

  // Sync assumptions when broker changes
  useEffect(() => {
    setPlanId(broker.plans[0].id);
    setUserMarginPct(broker.mtf.minMarginPct);
    setBrokerFundedPct(broker.mtf.brokerFundedPct);
    setAnnualInterestRatePct(broker.mtf.annualInterestRatePct);
  }, [broker]);

  const compute = () => {
    const input: CalculationInput = {
      brokerSlug,
      planId,
      buyPrice: Number(buyPrice) || 0,
      quantity: Number(quantity) || 0,
      expectedSellPrice: Number(expectedSellPrice) || 0,
      purchaseDate,
      expectedExitDate,
      userMarginPct: Number(userMarginPct) || 0,
      brokerFundedPct: Number(brokerFundedPct) || 0,
      annualInterestRatePct: Number(annualInterestRatePct) || 0,
      pledgeRequests: Number(pledgeRequests) || 0,
      unpledgeRequests: Number(unpledgeRequests) || 0,
      dpDebitEvents: Number(dpDebitEvents) || 0,
    };
    onResult(calculateMtf(input));
  };

  // Auto-calculate on mount and on input changes for live UX
  useEffect(() => {
    compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    brokerSlug,
    planId,
    buyPrice,
    quantity,
    expectedSellPrice,
    purchaseDate,
    expectedExitDate,
    userMarginPct,
    brokerFundedPct,
    annualInterestRatePct,
    pledgeRequests,
    unpledgeRequests,
    dpDebitEvents,
  ]);

  return (
    <form className=\"border border-[#0a0a0a] bg-white\" onSubmit={(e) => { e.preventDefault(); compute(); }} data-testid=\"mtf-calculator-form\">
      <div className=\"px-4 py-3 border-b border-black flex items-center justify-between\">
        <h3 className=\"font-editorial text-lg font-semibold\">MTF Inputs</h3>
        <span className=\"kypnl-overline\">All values editable</span>
      </div>
      <div className=\"p-4 grid grid-cols-2 gap-3\">
        <Field label=\"Broker\">
          <BrokerSelector brokers={brokers} value={brokerSlug} onChange={setBrokerSlug} />
        </Field>
        <Field label=\"Plan\">
          <BrokeragePlanSelector plans={broker.plans} value={planId} onChange={setPlanId} />
        </Field>

        <Field label=\"Buy price\">
          <Input className={inputCls} type=\"number\" step=\"0.05\" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} data-testid=\"input-buy-price\" />
        </Field>
        <Field label=\"Quantity\">
          <Input className={inputCls} type=\"number\" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} data-testid=\"input-quantity\" />
        </Field>

        <Field label=\"Expected sell price\">
          <Input className={inputCls} type=\"number\" step=\"0.05\" value={expectedSellPrice} onChange={(e) => setExpectedSellPrice(Number(e.target.value))} data-testid=\"input-sell-price\" />
        </Field>
        <Field label=\"Purchase date\">
          <Input className={inputCls} type=\"date\" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} data-testid=\"input-purchase-date\" />
        </Field>

        <Field label=\"Expected exit date\">
          <Input className={inputCls} type=\"date\" value={expectedExitDate} onChange={(e) => setExpectedExitDate(e.target.value)} data-testid=\"input-exit-date\" />
        </Field>
        <Field label=\"MTF interest (% p.a.)\">
          <Input className={inputCls} type=\"number\" step=\"0.01\" value={annualInterestRatePct} onChange={(e) => setAnnualInterestRatePct(Number(e.target.value))} data-testid=\"input-interest\" />
        </Field>

        <Field label=\"User margin (%)\">
          <Input className={inputCls} type=\"number\" step=\"0.5\" value={userMarginPct} onChange={(e) => setUserMarginPct(Number(e.target.value))} data-testid=\"input-user-margin\" />
        </Field>
        <Field label=\"Broker funded (%)\">
          <Input className={inputCls} type=\"number\" step=\"0.5\" value={brokerFundedPct} onChange={(e) => setBrokerFundedPct(Number(e.target.value))} data-testid=\"input-broker-funded\" />
        </Field>

        <Field label=\"Pledge requests\">
          <Input className={inputCls} type=\"number\" value={pledgeRequests} onChange={(e) => setPledgeRequests(Number(e.target.value))} data-testid=\"input-pledge\" />
        </Field>
        <Field label=\"Unpledge requests\">
          <Input className={inputCls} type=\"number\" value={unpledgeRequests} onChange={(e) => setUnpledgeRequests(Number(e.target.value))} data-testid=\"input-unpledge\" />
        </Field>

        <Field label=\"DP debit events\">
          <Input className={inputCls} type=\"number\" value={dpDebitEvents} onChange={(e) => setDpDebitEvents(Number(e.target.value))} data-testid=\"input-dp\" />
        </Field>
        <div className=\"flex items-end\">
          <Button
            type=\"submit\"
            className=\"w-full rounded-none bg-black text-[#f9f9f7] hover:bg-[#d43325] h-10 font-medium\"
            data-testid=\"calculate-mtf-button\"
          >
            Recalculate
          </Button>
        </div>
      </div>
    </form>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className=\"flex flex-col gap-1\">
    <Label className=\"kypnl-overline\">{label}</Label>
    {children}
  </div>
);
"