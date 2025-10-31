"""
merge_zcpi.py — Merge CPI + ZEC data and compute ZCPI index (raw + normalized)
"""
import pandas as pd

def compute_zcpi():
    # Load data
    cpi = pd.read_csv("data/processed/cpi_monthly.csv")
    zec = pd.read_csv("data/processed/zec_monthly.csv").rename(columns={"month": "date"})

    # Map series_id → category names
    category_map = {
        "CUUR0000SAF11": "Food at home",
        "CUUR0000SAF111": "Cereals and bakery",
        "CUUR0000SAF112": "Meats, poultry, fish, eggs",
        "CUUR0000SAF113": "Dairy",
        "CUUR0000SAF114": "Fruits and vegetables",
        "CUUR0000SAF115": "Nonalcoholic beverages",
        "CUUR0000SAF116": "Other food at home"
    }
    cpi["category"] = cpi["series_id"].map(category_map)
    cpi["date"] = pd.to_datetime(cpi["date"]).dt.to_period("M").astype(str)

    # Merge CPI + ZEC by month
    merged = cpi.merge(zec, on="date", how="inner")
    merged["zcpi_value"] = merged["price_usd"] / (merged["value"] / 100)

    # Compute normalized ZCPI (Jan 2020 = 100)
    merged_sorted = merged.sort_values("date")
    baseline = merged_sorted.loc[merged_sorted["date"] == "2020-01", "zcpi_value"].mean()
    if pd.notna(baseline) and baseline != 0:
        merged_sorted["zcpi_norm"] = (merged_sorted["zcpi_value"] / baseline) * 100
    else:
        merged_sorted["zcpi_norm"] = None
        print("⚠️ Baseline (2020-01) missing — normalization skipped.")

    merged_sorted.to_csv("data/processed/zcpi_computed.csv", index=False)
    print("✅ Saved merged ZCPI data → data/processed/zcpi_computed.csv")

if __name__ == "__main__":
    compute_zcpi()
