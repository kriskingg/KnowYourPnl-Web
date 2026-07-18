import { useEffect, useMemo, useState } from "react";
import type { Broker, CalculationInput, CalculationResult } from "@/types";
import { BrokerSelector } from "./BrokerSelector";
import { BrokeragePlanSelector } from "./BrokeragePlanSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/apiService";

const inputCls =
  "rounded-none border-[#102A43] h-10 focus-visible:ring-1 focus-visible:ring-[#102A43] font-mono-ibm text-[13px]";

type Props = {
  brokers: Broker[];
  initialBrokerSlug?: string;
  onResult: (result: CalculationResult) => void;
};

export const MtfCalculatorForm = ({ brokers, initialBrokerSlug, onResult }: Props) => {
  const defaultBroker = brokers.find((b) => b.slug === initialBrokerSlug) ?? brokers[0];
  const [brokerSlug, setBrokerSlug] = useState(defaultBroker.slug);
  const broker = useMemo(
    () => brokers.find((candidate) => candidate.slug === brokerSlug) ?? brokers[0],
    [brokers, brokerSlug],
  );
  const [planId, setPlanId] = useState(broker.plans[0].id);
  const [buyPrice, setBuyPrice] = useState(2890.5);
  const [quantity, setQuantity] = useState(40);
  const [expectedSellPrice, setExpectedSellPrice] = useState(3050);
  const [purchaseDate, setPurchaseDate] = useState("2026-01-08");
  const [expectedExitDate, setExpectedExitDate] = useState("2026-03-08");
  const [pledgeRequests, setPledgeRequests] = useState(1);
  const [unpledgeRequests, setUnpledgeRequests] = useState(1);
  const [dpDebitEvents, setDpDebitEvents] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPlanId(broker.plans[0].id);
  }, [broker]);

  const input = (): CalculationInput => ({
    brokerSlug,
    planId,
    buyPrice: Number(buyPrice) || 0,
    quantity: Number(quantity) || 0,
    expectedSellPrice: Number(expectedSellPrice) || 0,
    purchaseDate,
    expectedExitDate,
    pledgeRequests: Number(pledgeRequests) || 0,
    unpledgeRequests: Number(unpledgeRequests) || 0,
    dpDebitEvents: Number(dpDebitEvents) || 0,
  });

  const compute = async () => {
    setLoading(true);
    setError("");
    try {
      onResult(await apiService.calculateMtf(input()));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to calculate right now");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="border border-[#102A43] bg-white"
      onSubmit={(event) => {
        event.preventDefault();
        void compute();
      }}
      data-testid="mtf-calculator-form"
    >
      <div className="px-4 py-3 border-b border-[#102A43] flex items-center justify-between">
        <h3 className="font-editorial text-lg font-semibold">Trade Scenario</h3>
        <span className="kypnl-overline">Tariffs applied securely</span>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Broker">
          <BrokerSelector brokers={brokers} value={brokerSlug} onChange={setBrokerSlug} />
        </Field>
        <Field label="Plan">
          <BrokeragePlanSelector plans={broker.plans} value={planId} onChange={setPlanId} />
        </Field>
        <Field label="Buy price">
          <Input className={inputCls} type="number" min="0.01" step="0.05" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} data-testid="input-buy-price" />
        </Field>
        <Field label="Quantity">
          <Input className={inputCls} type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} data-testid="input-quantity" />
        </Field>
        <Field label="Expected sell price">
          <Input className={inputCls} type="number" min="0.01" step="0.05" value={expectedSellPrice} onChange={(e) => setExpectedSellPrice(Number(e.target.value))} data-testid="input-sell-price" />
        </Field>
        <Field label="Purchase date">
          <Input className={inputCls} type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} data-testid="input-purchase-date" />
        </Field>
        <Field label="Expected exit date">
          <Input className={inputCls} type="date" value={expectedExitDate} onChange={(e) => setExpectedExitDate(e.target.value)} data-testid="input-exit-date" />
        </Field>
        <Field label="Pledge requests">
          <Input className={inputCls} type="number" min="0" max="100" step="1" value={pledgeRequests} onChange={(e) => setPledgeRequests(Number(e.target.value))} data-testid="input-pledge" />
        </Field>
        <Field label="Unpledge requests">
          <Input className={inputCls} type="number" min="0" max="100" step="1" value={unpledgeRequests} onChange={(e) => setUnpledgeRequests(Number(e.target.value))} data-testid="input-unpledge" />
        </Field>
        <Field label="DP debit events">
          <Input className={inputCls} type="number" min="0" max="100" step="1" value={dpDebitEvents} onChange={(e) => setDpDebitEvents(Number(e.target.value))} data-testid="input-dp" />
        </Field>
        <div className="sm:col-span-2">
          {error && <p className="mb-2 text-[12px] text-red-700" role="alert">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-none bg-[#102A43] text-[#F7F5EF] hover:bg-[#087F6D] h-10 font-medium disabled:opacity-60"
            data-testid="calculate-mtf-button"
          >
            {loading ? "Calculating…" : "Calculate securely"}
          </Button>
        </div>
      </div>
    </form>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <Label className="kypnl-overline">{label}</Label>
    {children}
  </div>
);
