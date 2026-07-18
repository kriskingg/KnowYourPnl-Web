"""Load server-only broker tariffs and combine them with public metadata."""

import json
import os
from pathlib import Path
from typing import Any

PUBLIC_BROKERS = {
    "kotak-neo": {
        "slug": "kotak-neo",
        "name": "Kotak Neo",
        "legalName": "Kotak Securities Limited",
        "established": 1994,
        "headquarters": "Mumbai, India",
        "sebiRegNo": "INZ000200137",
        "overview": (
            "Kotak Neo MTF calculations are supported by KnowYourPNL's "
            "privately maintained and regularly reviewed tariff model."
        ),
        "supportedProducts": ["MTF"],
        "currentTariffVersion": "v2026.02",
        "lastVerificationDate": "2026-02-14",
        "verificationStatus": "review_required",
        "plans": [
            {
                "id": "neo-trader",
                "name": "Neo Trader",
                "description": "Supported MTF brokerage plan.",
                "isDefault": True,
            }
        ],
        "disclaimer": (
            "KnowYourPNL is independent and is not affiliated with Kotak "
            "Securities. Results are estimates and should be checked against "
            "the broker's current terms and your contract note."
        ),
    }
}


def _load_private_records() -> dict[str, Any]:
    default_path = Path(__file__).with_name("private_tariffs.local.json")
    path = Path(os.environ.get("BROKER_TARIFFS_FILE", default_path))
    if not path.is_file():
        raise RuntimeError(
            "Private tariff file is missing. Set BROKER_TARIFFS_FILE to a "
            "server-only JSON file that is not committed to source control."
        )
    with path.open("r", encoding="utf-8") as handle:
        records = json.load(handle)
    missing = set(PUBLIC_BROKERS) - set(records)
    if missing:
        raise RuntimeError(f"Private tariff records missing for: {', '.join(sorted(missing))}")
    return records


_PRIVATE_RECORDS = _load_private_records()
BROKERS = {
    slug: {"public": public, "private": _PRIVATE_RECORDS[slug]}
    for slug, public in PUBLIC_BROKERS.items()
}


TARIFF_VERSIONS = [
    {
        "id": "kn-neo-v2026.02",
        "brokerSlug": "kotak-neo",
        "planId": "neo-trader",
        "version": "v2026.02",
        "effectiveDate": "2026-01-01",
        "publishedDate": "2025-12-20",
        "supersedes": "kn-neo-v2025.09",
        "changeSummary": "Broker tariff model reviewed and calculation rules refreshed.",
        "verificationStatus": "review_required",
        "lastCheckedDate": "2026-02-14",
    },
    {
        "id": "kn-neo-v2025.09",
        "brokerSlug": "kotak-neo",
        "planId": "neo-trader",
        "version": "v2025.09",
        "effectiveDate": "2025-09-01",
        "publishedDate": "2025-08-18",
        "supersedes": "kn-neo-v2025.04",
        "changeSummary": "Operational charge rules updated after broker review.",
        "verificationStatus": "estimated",
        "lastCheckedDate": "2025-10-02",
    },
    {
        "id": "kn-neo-v2025.04",
        "brokerSlug": "kotak-neo",
        "planId": "neo-trader",
        "version": "v2025.04",
        "effectiveDate": "2025-04-01",
        "publishedDate": "2025-03-15",
        "changeSummary": "Initial internally reviewed MTF tariff model.",
        "verificationStatus": "estimated",
        "lastCheckedDate": "2025-06-10",
    },
]

