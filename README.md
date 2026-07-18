# KnowYourPNL

KnowYourPNL is an independent, MTF-focused broker-cost intelligence prototype.
It estimates funding interest, brokerage, statutory and operational charges,
break-even price and net P&L using transparent, editable assumptions.

## Included

- Broker-independent MTF calculator with Kotak Neo demonstration tariffs
- Broker profile, tariff evidence and version history
- Reusable one-scenario broker comparison engine
- Device-local MTF ledger with add, edit, delete, import and export
- Methodology and verification-status documentation
- Advertiser-ready slots with explicit labelling
- Privacy, cookie, advertising, terms, contact and disclaimer pages
- SEO-ready blog with three substantive MTF articles
- Sitemap, robots file and ads.txt placeholder

All tariff values are demonstration data marked for review. The product is
educational and is not affiliated with a broker.

## Development

```bash
cd frontend
npm ci
npm run dev
```

## Verification

```bash
npm test
npm run build
```

See `deploy/README.md` for the zero-monthly-cost OCI deployment shape.
