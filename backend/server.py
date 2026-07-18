import os
import time
from collections import defaultdict, deque
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from .calculator import CalculationError, calculate_mtf, compare_mtf, project_holding_periods
from .private_tariffs import BROKERS, TARIFF_VERSIONS

app = FastAPI(
    title="KnowYourPNL Private Calculation API",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

allowed_origins = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ORIGINS", "http://localhost:4173,http://localhost:5173"
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

request_windows: dict[str, deque[float]] = defaultdict(deque)
RATE_LIMIT = int(os.environ.get("API_RATE_LIMIT_PER_MINUTE", "60"))


@app.middleware("http")
async def protect_api(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > 16_384:
                return _error_response(413, "Request body is too large")
        except ValueError:
            return _error_response(400, "Invalid Content-Length header")

    client_ip = request.headers.get("x-real-ip", "").strip() or (
        request.client.host if request.client else "unknown"
    )
    now = time.monotonic()
    window = request_windows[client_ip]
    while window and window[0] < now - 60:
        window.popleft()
    if len(window) >= RATE_LIMIT:
        return _error_response(429, "Too many requests; please wait before trying again")
    window.append(now)

    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["X-Robots-Tag"] = "noindex, nofollow"
    return response


def _error_response(status_code: int, message: str):
    from fastapi.responses import JSONResponse

    return JSONResponse(status_code=status_code, content={"detail": message})


def _public_brokers():
    return [record["public"] for record in BROKERS.values()]


@app.get("/api/v1/health")
async def health():
    return {"status": "ok"}


@app.get("/api/v1/brokers")
async def list_brokers():
    return _public_brokers()


@app.get("/api/v1/brokers/{slug}")
async def get_broker(slug: str):
    record = BROKERS.get(slug)
    if record is None:
        raise HTTPException(status_code=404, detail="Broker not found")
    return record["public"]


@app.get("/api/v1/tariffs/current")
async def current_tariffs():
    current: dict[str, dict[str, Any]] = {}
    for version in TARIFF_VERSIONS:
        key = f'{version["brokerSlug"]}:{version["planId"]}'
        if key not in current:
            current[key] = version
    return list(current.values())


@app.get("/api/v1/tariffs/history")
async def tariff_history(broker: str | None = None):
    return [
        version
        for version in TARIFF_VERSIONS
        if broker is None or version["brokerSlug"] == broker
    ]


@app.post("/api/v1/calculations/mtf")
async def calculate(payload: dict[str, Any]):
    try:
        return calculate_mtf(payload)
    except CalculationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.post("/api/v1/calculations/mtf/projection")
async def projection(payload: dict[str, Any]):
    try:
        return project_holding_periods(payload)
    except CalculationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.post("/api/v1/comparisons/mtf")
async def compare(payload: dict[str, Any]):
    try:
        return compare_mtf(payload)
    except CalculationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
