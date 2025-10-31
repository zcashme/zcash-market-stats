"""
fetch_zec.py — Retrieve ZEC/USD data, save raw JSON, and store monthly averages
"""
import os
import json
import requests
import pandas as pd
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def fetch_zec_data():
    url = "https://api.coingecko.com/api/v3/coins/zcash/market_chart"

    cg_api_key = os.getenv("COINGECKO_API_KEY")

    params = {
        "vs_currency": "usd",
        "days": "max" if cg_api_key else 365 
    }

    if cg_api_key:
        params["x_cg_demo_api_key"] = cg_api_key

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }

    os.makedirs("data/raw/coingecko", exist_ok=True)
    os.makedirs("data/processed", exist_ok=True)

    print("📡 Fetching ZEC/USD price data from CoinGecko ...")
    response = requests.get(url, params=params, headers=headers)

    if response.status_code != 200:
        print(f"❌ Error: API returned {response.status_code}")
        print(response.text[:500])
        return

    data = response.json()

    # Save raw JSON
    raw_path = f"data/raw/coingecko/zec_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(raw_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"🪣 Saved raw CoinGecko JSON → {raw_path}")

    if "prices" not in data:
        print("⚠️ API response missing 'prices' field.")
        return

    prices = [
        {"date": datetime.fromtimestamp(p[0]/1000, tz=timezone.utc).strftime("%Y-%m-%d"), "price_usd": p[1]}
        for p in data["prices"]
    ]

    df = pd.DataFrame(prices)
    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.to_period("M").astype(str)
    monthly = df.groupby("month")["price_usd"].mean().reset_index()

    out_path = "data/processed/zec_monthly.csv"
    monthly.to_csv(out_path, index=False)
    print(f"✅ Saved ZEC price data → {out_path}")

if __name__ == "__main__":
    fetch_zec_data()
