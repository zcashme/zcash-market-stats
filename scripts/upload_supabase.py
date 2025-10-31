from supabase import create_client, Client
import pandas as pd
import os
import numpy as np
from dotenv import load_dotenv
import math
import json

# Load .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load dataset
df = pd.read_csv("data/processed/zcpi_computed.csv")

# 🔍 Check invalid rows
invalid = df[
    df.isin([np.inf, -np.inf]).any(axis=1) |
    df.isnull().any(axis=1)
]
print(f"Invalid rows before cleaning: {len(invalid)}")

# ✅ Clean inf/nan and normalize
df = df.replace([np.inf, -np.inf], np.nan)
df = df.where(pd.notnull(df), None)

# ✅ Convert YYYY-MM → YYYY-MM-01 for Supabase date column
df["date"] = df["date"].apply(lambda x: f"{x}-01" if isinstance(x, str) and len(x) == 7 else x)
print("✅ Date format normalized for Supabase")

# ✅ Ensure all floats are JSON-compliant (convert to normal float or None)
def make_json_safe(val):
    if isinstance(val, (float, np.float64)) and (math.isnan(val) or math.isinf(val)):
        return None
    return float(val) if isinstance(val, (float, np.float64)) else val

records = [
    {k: make_json_safe(v) for k, v in row.items()}
    for _, row in df.iterrows()
]

# 🔹 Validate JSON before upload
try:
    json.dumps(records[:5])  # test encoding few rows
    print("✅ JSON encoding validation passed")
except Exception as e:
    print("❌ JSON encoding error:", e)
    exit()

# Upload in batches (using upsert to handle duplicates gracefully)
batch_size = 500
for i in range(0, len(records), batch_size):
    chunk = records[i:i + batch_size]
    supabase.table("zcpi_data").upsert(chunk).execute()
    print(f"✅ Uploaded/updated {len(chunk)} rows")

print("🎉 Upload complete — ZCPI data is now live in Supabase!")
