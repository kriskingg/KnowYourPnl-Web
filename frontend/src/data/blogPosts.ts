export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readMinutes: number;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-mtf-interest-is-calculated",
    title: "How MTF interest is calculated",
    description: "A practical explanation of funded amount, daily rates, holding days and the assumptions that change your final MTF interest.",
    publishedAt: "2026-07-18",
    readMinutes: 7,
    sections: [
      { heading: "Start with the funded amount", paragraphs: ["MTF interest is normally charged on the amount funded by the broker—not the full market value and not your own margin. If a ₹1,00,000 purchase uses ₹25,000 of your capital, the funded amount is ₹75,000.", "Always verify whether the broker calculates funding from trade value, ledger debit or another daily balance. That definition can change the result."] },
      { heading: "Convert the annual rate into a daily cost", paragraphs: ["Funding cost grows with the broker-funded balance and the holding period. The exact rate, day-count convention and rounding rules depend on the broker and plan.", "Weekends, holidays, settlement dates and the broker's posting convention may affect the charged number. Treat a calculator result as an estimate until it is reconciled with your ledger."] },
      { heading: "Interest is only one part of cost", paragraphs: ["Brokerage, statutory levies, pledge requests, unpledge requests and DP debit events can materially alter break-even. KnowYourPNL keeps these lines separate so that interest is not mistaken for the total cost of the position."] },
    ],
  },
  {
    slug: "mtf-break-even-price",
    title: "How holding period changes MTF break-even",
    description: "See why an unchanged share price can still become a losing MTF position as funding costs accumulate.",
    publishedAt: "2026-07-18",
    readMinutes: 6,
    sections: [
      { heading: "Break-even is a moving number", paragraphs: ["The purchase price is not the economic break-even price. A useful estimate adds projected buy-side, holding, operational and exit costs, then spreads those costs across the quantity held.", "Because interest usually increases with every holding day, break-even moves higher even when the market price does not change."] },
      { heading: "Use scenarios, not a single forecast", paragraphs: ["Compare seven, thirty, sixty and ninety-day holding periods. The purpose is not to predict the exit date; it is to understand how much delay the position can tolerate.", "Recalculate after a partial sale, additional funding debit or tariff change. Old assumptions should not silently remain attached to a live position."] },
      { heading: "Keep gross and net P&L separate", paragraphs: ["Gross P&L is simply the price movement multiplied by quantity. Net P&L subtracts the estimated full cost. Showing both prevents a profitable-looking price move from hiding a negative economic result."] },
    ],
  },
  {
    slug: "read-an-mtf-ledger",
    title: "How to read an MTF ledger",
    description: "A field-by-field guide to user capital, broker funding, accrued interest, verification status and estimated net P&L.",
    publishedAt: "2026-07-18",
    readMinutes: 8,
    sections: [
      { heading: "Separate cash from exposure", paragraphs: ["User capital tells you how much of your money supports the position. Broker funding is the financed portion. Market exposure is their sum and should reconcile to quantity multiplied by the purchase price, subject to broker ledger conventions."] },
      { heading: "Track tariff and methodology versions", paragraphs: ["A reproducible ledger records which tariff and calculation method produced each estimate. If a broker changes an interest rate or operational charge, the historical result should not be silently rewritten.", "Verification status communicates evidence quality. Demonstration or estimated data should never look identical to an account-verified value."] },
      { heading: "Current price is an input, not a fact", paragraphs: ["Current price is user-entered and must be treated as a scenario input. The resulting unrealised and net P&L figures are estimates, not live broker statements or investment advice."] },
    ],
  },
];

export const findBlogPost = (slug?: string) => blogPosts.find((post) => post.slug === slug);
