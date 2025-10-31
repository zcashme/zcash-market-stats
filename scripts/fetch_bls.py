"""
fetch_bls.py — Retrieve CPI data from the BLS API, save raw JSON, and store as CSV
"""
import os
import json
import requests
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def fetch_bls_data():
    url = "https://api.bls.gov/publicAPI/v2/timeseries/data/"
    payload = {
        "seriesid": [
            "CUUR0000SAF11", "CUUR0000SAF111", "CUUR0000SAF112",
            "CUUR0000SAF113", "CUUR0000SAF114", "CUUR0000SAF115",
            "CUUR0000SAF116"
        ],
        "startyear": "2016",
        "endyear": "2025"
    }

    # Add optional API key (higher rate limits)
    bls_api_key = os.getenv("BLS_API_KEY")
    if bls_api_key:
        payload["registrationkey"] = bls_api_key

    os.makedirs("data/raw/bls", exist_ok=True)
    os.makedirs("data/processed", exist_ok=True)

    print("📡 Fetching CPI data from BLS API ...")
    response = requests.post(url, json=payload)

    if response.status_code != 200:
        print(f"❌ Error: API returned {response.status_code}")
        print(response.text[:500])
        return

    res = response.json()

    # Save raw JSON
    raw_path = f"data/raw/bls/bls_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(raw_path, "w") as f:
        json.dump(res, f, indent=2)
    print(f"🪣 Saved raw BLS JSON → {raw_path}")

    # Parse into DataFrame
    records = []
    for s in res.get("Results", {}).get("series", []):
        for d in s.get("data", []):
            records.append({
                "series_id": s["seriesID"],
                "year": d["year"],
                "periodName": d["periodName"],
                "value": float(d["value"])
            })

    if not records:
        print("⚠️ No CPI records found in API response.")
        return

    df = pd.DataFrame(records)
    df["date"] = pd.to_datetime(df["year"] + "-" + df["periodName"], format="%Y-%B", errors="coerce")
    df.dropna(subset=["date"], inplace=True)

    out_path = "data/processed/cpi_monthly.csv"
    df.to_csv(out_path, index=False)
    print(f"✅ Saved CPI data → {out_path}")

if __name__ == "__main__":
    fetch_bls_data()
