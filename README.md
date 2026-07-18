# KnowYourPNL

KnowYourPNL is an independent, MTF-focused broker-cost intelligence product.
It estimates funding interest, grouped charges, break-even price and net P&L
using a private, server-side broker tariff model.

## Included

- Server-calculated MTF estimates without exposing tariff rules to the browser
- Broker profile, private model status and version history
- Reusable one-scenario broker comparison engine
- Device-local MTF ledger with add, edit, delete, import and export
- Methodology and verification-status documentation
- Advertiser-ready slots with explicit labelling
- Privacy, cookie, advertising, terms, contact and disclaimer pages
- SEO-ready blog with three substantive MTF articles
- Sitemap, robots file and ads.txt placeholder

Broker tariff values, caps and formulas live in the ignored server-only file
`backend/private_tariffs.local.json` during local development, and in a
root-readable JSON file outside the repository in production. They are never
included in the Vite build or returned by public metadata APIs.
The product is educational and is not affiliated with a broker.

## Development

```bash
cd frontend
npm ci
npm run dev
```

In a second terminal:

```bash
python -m venv .venv
.venv/Scripts/pip install -r backend/requirements.txt
.venv/Scripts/uvicorn backend.server:app --host 127.0.0.1 --port 8000
```

## Verification

```bash
npm test
npm run build
cd ..
python -m unittest backend.test_calculator
```

See `deploy/README.md` for the zero-monthly-cost OCI deployment shape.
