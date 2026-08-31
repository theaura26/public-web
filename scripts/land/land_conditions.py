#!/usr/bin/env python3
"""
Daily land conditions for a farm plot, from free, key-free, open APIs.

Fetches, day by day, for one coordinate:

  · air temperature — max, min, mean
  · precipitation   — daily total, in stated millimetres
  · relative humidity — daily mean
  · soil temperature — 0–7 cm
  · soil moisture    — 0–7 cm volumetric water content
  · elevation and an estimated slope for the point

Everything comes from Open-Meteo, which needs no registration, no token
and no key, and permits non-commercial use freely (check their terms for
commercial use). Two endpoints do the work:

  archive-api.open-meteo.com/v1/archive
      ERA5 / ERA5-Land reanalysis. Authoritative, but it lags real time
      by about five days.

  api.open-meteo.com/v1/forecast
      Operational model with `past_days`, which covers the gap the
      archive leaves. Slightly less settled, and it is what fills the
      last few days here.

  api.open-meteo.com/v1/elevation
      Copernicus DEM, ~90 m. Point queries, and it accepts several
      coordinates at once — which is what makes the slope estimate below
      a single request rather than five.

OpenTopography was the other candidate for elevation and was not used:
its API has required a registered key since 2022, which fails this
script's no-key constraint.

READ THIS BEFORE TRUSTING A NUMBER
----------------------------------
None of this is measured on your land. It is a global model sampled at
the nearest grid cell, and for ERA5-Land that cell is roughly 9 km
across. The script reports the coordinate the API actually snapped to,
and how far that is from the one you asked for, because in hill country
that distance is the difference between a figure you can use and one you
cannot. Rainfall is the worst case: convective storms are patchy at a
scale far below the grid, so a daily total can be badly wrong on any one
day while the seasonal total is broadly right.

Usage
-----
    pip install requests pandas
    python land_conditions.py
    python land_conditions.py --lat 13.1686 --lon 75.4340 --days 30
    python land_conditions.py --start 2026-07-01 --end 2026-08-25 --csv out.csv
"""

from __future__ import annotations

import argparse
import datetime as dt
import math
import sys
from typing import Any

import pandas as pd
import requests

# ── The plot ─────────────────────────────────────────────────────────────
# Aura Estate, Mudigere, Karnataka. Change these two numbers, or pass
# --lat/--lon, and every figure below follows. Decimal degrees, north and
# east positive; a coordinate south of the equator or west of Greenwich
# is simply negative.
DEFAULT_LAT = 13.1686
DEFAULT_LON = 75.4340
DEFAULT_TZ = "Asia/Kolkata"      # the plot's own timezone, not yours

ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
ELEVATION_URL = "https://api.open-meteo.com/v1/elevation"

TIMEOUT = 30
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "land-conditions/1.0 (open data client)"})

# The archive is the better source but trails real time. Anything inside
# this window is filled from the operational model instead.
ARCHIVE_LAG_DAYS = 6


def _get(url: str, params: dict[str, Any]) -> dict[str, Any]:
    """One GET, with the failure modes named rather than swallowed."""
    response = SESSION.get(url, params=params, timeout=TIMEOUT)
    response.raise_for_status()
    payload = response.json()
    if "error" in payload:
        raise RuntimeError(f"{url} refused the request: {payload.get('reason')}")
    return payload


# ── Weather and soil ─────────────────────────────────────────────────────

# Daily aggregates the archive computes for us. Naming is Open-Meteo's.
ARCHIVE_DAILY = [
    "temperature_2m_max",
    "temperature_2m_min",
    "temperature_2m_mean",
    "precipitation_sum",
    "relative_humidity_2m_mean",
    "soil_temperature_0_to_7cm_mean",
    "soil_moisture_0_to_7cm_mean",
]

# The forecast model exposes the same daily aggregates for temperature and
# rain, but soil only hourly — and under different depth bands, because it
# is a different model. Those are aggregated to daily below.
FORECAST_DAILY = [
    "temperature_2m_max",
    "temperature_2m_min",
    "temperature_2m_mean",
    "precipitation_sum",
]
FORECAST_HOURLY = [
    "relative_humidity_2m",
    "soil_temperature_6cm",
    "soil_moisture_3_to_9cm",
]


def fetch_archive(lat: float, lon: float, start: dt.date, end: dt.date, tz: str) -> pd.DataFrame:
    """ERA5 reanalysis, one row per day. Empty frame if the range is
    entirely inside the archive's lag."""
    if start > end:
        return pd.DataFrame()
    payload = _get(ARCHIVE_URL, {
        "latitude": lat,
        "longitude": lon,
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "daily": ",".join(ARCHIVE_DAILY),
        "timezone": tz,
    })
    daily = payload.get("daily", {})
    if not daily.get("time"):
        return pd.DataFrame()

    frame = pd.DataFrame(daily).rename(columns={
        "time": "date",
        "temperature_2m_max": "air_temp_max_c",
        "temperature_2m_min": "air_temp_min_c",
        "temperature_2m_mean": "air_temp_mean_c",
        "precipitation_sum": "precipitation_mm",
        "relative_humidity_2m_mean": "humidity_mean_pct",
        "soil_temperature_0_to_7cm_mean": "soil_temp_0_7cm_c",
        "soil_moisture_0_to_7cm_mean": "soil_moisture_0_7cm_m3m3",
    })
    frame["source"] = "era5_archive"
    frame.attrs["grid_lat"] = payload.get("latitude")
    frame.attrs["grid_lon"] = payload.get("longitude")
    frame.attrs["elevation_m"] = payload.get("elevation")
    return frame


def fetch_recent(lat: float, lon: float, past_days: int, tz: str) -> pd.DataFrame:
    """Operational model for the days the archive has not caught up on.
    Soil arrives hourly and is averaged to a daily mean here."""
    past_days = max(0, min(past_days, 92))     # the endpoint's own ceiling
    if past_days == 0:
        return pd.DataFrame()

    payload = _get(FORECAST_URL, {
        "latitude": lat,
        "longitude": lon,
        "daily": ",".join(FORECAST_DAILY),
        "hourly": ",".join(FORECAST_HOURLY),
        "past_days": past_days,
        "forecast_days": 1,
        "timezone": tz,
    })

    daily = payload.get("daily", {})
    if not daily.get("time"):
        return pd.DataFrame()

    frame = pd.DataFrame(daily).rename(columns={
        "time": "date",
        "temperature_2m_max": "air_temp_max_c",
        "temperature_2m_min": "air_temp_min_c",
        "temperature_2m_mean": "air_temp_mean_c",
        "precipitation_sum": "precipitation_mm",
    })

    # Hourly → daily. The depth bands differ from the archive's 0–7 cm
    # (6 cm and 3–9 cm here), so they are close cousins rather than the
    # same measurement, and the `source` column says which you have.
    hourly = payload.get("hourly", {})
    if hourly.get("time"):
        hours = pd.DataFrame(hourly)
        hours["date"] = pd.to_datetime(hours["time"]).dt.date.astype(str)
        rolled = hours.groupby("date").agg(
            humidity_mean_pct=("relative_humidity_2m", "mean"),
            soil_temp_0_7cm_c=("soil_temperature_6cm", "mean"),
            soil_moisture_0_7cm_m3m3=("soil_moisture_3_to_9cm", "mean"),
        ).round(3).reset_index()
        frame = frame.merge(rolled, on="date", how="left")

    frame["source"] = "operational_model"
    frame.attrs["grid_lat"] = payload.get("latitude")
    frame.attrs["grid_lon"] = payload.get("longitude")
    frame.attrs["elevation_m"] = payload.get("elevation")
    return frame


# ── Topography ───────────────────────────────────────────────────────────

def fetch_topography(lat: float, lon: float, offset_m: float = 120.0) -> dict[str, Any]:
    """
    Elevation for the point, and a slope estimate around it.

    The slope comes from sampling four neighbours — north, south, east,
    west — and taking the central difference in each direction. The offset
    defaults to 120 m because the DEM behind this endpoint is roughly 90 m
    per cell: sample closer together than the cell and the "slope" you get
    is the DEM's own quantisation, not the hill.

    All five points go in one request; the endpoint takes comma-separated
    lists and returns elevations in the same order.
    """
    # Metres → degrees. Latitude is near enough constant; longitude
    # narrows with the cosine of the latitude.
    d_lat = offset_m / 111_320.0
    d_lon = offset_m / (111_320.0 * math.cos(math.radians(lat)))

    points = [
        (lat, lon),                    # centre
        (lat + d_lat, lon),            # north
        (lat - d_lat, lon),            # south
        (lat, lon + d_lon),            # east
        (lat, lon - d_lon),            # west
    ]
    payload = _get(ELEVATION_URL, {
        "latitude": ",".join(f"{p[0]:.6f}" for p in points),
        "longitude": ",".join(f"{p[1]:.6f}" for p in points),
    })
    elevations = payload.get("elevation") or []
    if len(elevations) < 5 or any(e is None for e in elevations):
        return {"elevation_m": elevations[0] if elevations else None}

    centre, north, south, east, west = elevations

    # Central differences: rise over the full 2 × offset run.
    grad_ns = (north - south) / (2 * offset_m)
    grad_ew = (east - west) / (2 * offset_m)
    gradient = math.hypot(grad_ns, grad_ew)

    # Aspect: compass bearing of steepest descent, 0° = north.
    aspect = (math.degrees(math.atan2(-grad_ew, -grad_ns)) + 360) % 360

    return {
        "elevation_m": centre,
        "slope_deg": round(math.degrees(math.atan(gradient)), 2),
        "slope_pct": round(gradient * 100, 2),
        "aspect_deg": round(aspect, 1),
        "dem_sample_offset_m": offset_m,
    }


# ── Assembly ─────────────────────────────────────────────────────────────

COLUMNS = [
    "date",
    "air_temp_min_c", "air_temp_mean_c", "air_temp_max_c",
    "precipitation_mm", "humidity_mean_pct",
    "soil_temp_0_7cm_c", "soil_moisture_0_7cm_m3m3",
    "elevation_m", "slope_deg", "slope_pct", "aspect_deg",
    "source",
]


def land_conditions(
    lat: float = DEFAULT_LAT,
    lon: float = DEFAULT_LON,
    start: dt.date | None = None,
    end: dt.date | None = None,
    tz: str = DEFAULT_TZ,
) -> pd.DataFrame:
    """One row per day, archive where it reaches and the operational model
    for the tail it does not."""
    today = dt.date.today()
    end = end or today
    start = start or (end - dt.timedelta(days=29))

    archive_end = min(end, today - dt.timedelta(days=ARCHIVE_LAG_DAYS))
    frames: list[pd.DataFrame] = []

    if start <= archive_end:
        frames.append(fetch_archive(lat, lon, start, archive_end, tz))

    if end > archive_end:
        # One extra day of overlap, so a boundary is never a hole.
        frames.append(fetch_recent(lat, lon, past_days=(today - archive_end).days + 1, tz=tz))

    frames = [f for f in frames if not f.empty]
    if not frames:
        raise RuntimeError("No data came back for that coordinate and range.")

    grid_lat = frames[0].attrs.get("grid_lat")
    grid_lon = frames[0].attrs.get("grid_lon")

    frame = pd.concat(frames, ignore_index=True)
    # Archive wins wherever both have the day.
    frame = frame.drop_duplicates(subset="date", keep="first").sort_values("date")
    frame = frame[(frame["date"] >= start.isoformat()) & (frame["date"] <= end.isoformat())]

    topography = fetch_topography(lat, lon)
    for key, value in topography.items():
        if key in COLUMNS:
            frame[key] = value

    for column in COLUMNS:
        if column not in frame.columns:
            frame[column] = pd.NA

    frame = frame[COLUMNS].reset_index(drop=True)

    # Provenance travels with the data, because the grid cell is not the
    # plot and anyone reading a number should be able to see how far away
    # it was computed.
    frame.attrs.update({
        "requested_lat": lat,
        "requested_lon": lon,
        "grid_lat": grid_lat,
        "grid_lon": grid_lon,
        "offset_km": round(haversine_km(lat, lon, grid_lat, grid_lon), 2)
        if grid_lat is not None else None,
        "timezone": tz,
        "topography": topography,
    })
    return frame


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance, for reporting how far the grid cell sits
    from the coordinate that was asked for."""
    radius = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = p2 - p1
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * radius * math.asin(math.sqrt(a))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--lat", type=float, default=DEFAULT_LAT)
    parser.add_argument("--lon", type=float, default=DEFAULT_LON)
    parser.add_argument("--tz", default=DEFAULT_TZ, help="the plot's timezone, e.g. Asia/Kolkata")
    parser.add_argument("--days", type=int, default=30, help="days back from today, when no --start is given")
    parser.add_argument("--start", help="YYYY-MM-DD")
    parser.add_argument("--end", help="YYYY-MM-DD")
    parser.add_argument("--csv", help="also write the table here")
    args = parser.parse_args()

    end = dt.date.fromisoformat(args.end) if args.end else dt.date.today()
    start = dt.date.fromisoformat(args.start) if args.start else end - dt.timedelta(days=args.days - 1)

    frame = land_conditions(args.lat, args.lon, start, end, args.tz)
    meta = frame.attrs

    print(f"\nPlot        {meta['requested_lat']}, {meta['requested_lon']}  ({meta['timezone']})")
    print(f"Model cell  {meta['grid_lat']}, {meta['grid_lon']}  — {meta['offset_km']} km from the plot")
    topo = meta["topography"]
    print(f"Terrain     {topo.get('elevation_m')} m, slope {topo.get('slope_deg')}° "
          f"({topo.get('slope_pct')}%), facing {topo.get('aspect_deg')}°")
    print(f"Range       {start} to {end}   ({len(frame)} days)\n")

    with pd.option_context("display.width", 200, "display.max_columns", None):
        print(frame.drop(columns=["elevation_m", "slope_deg", "slope_pct", "aspect_deg"]).to_string(index=False))

    print(f"\nRainfall over the period: {frame['precipitation_mm'].sum():.1f} mm")
    print("Every figure above is modelled at the cell named, not measured on the plot.")

    if args.csv:
        frame.to_csv(args.csv, index=False)
        print(f"Written to {args.csv}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
