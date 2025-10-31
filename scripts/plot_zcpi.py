"""
plot_zcpi.py — Interactive ZCPI visualization using Plotly
"""
import pandas as pd
import plotly.express as px
import os

# Load processed dataset
df = pd.read_csv("data/processed/zcpi_computed.csv")

# Decide which metric to show
metric = "zcpi_value"
if "zcpi_norm" in df.columns and not df["zcpi_norm"].isna().all():
    metric = "zcpi_norm"  # use normalized if available

# Create interactive line chart
fig = px.line(
    df,
    x="date",
    y=metric,
    color="category",
    title="ZCPI — Purchasing Power of 1 ZEC Over Time",
    labels={
        "date": "Date",
        "zcpi_value": "ZCPI Value (ZEC/USD ÷ CPI)",
        "zcpi_norm": "ZCPI (Normalized, Jan 2020 = 100)",
        "category": "CPI Category"
    },
    line_shape="spline",
    template="plotly_white"
)

# Aesthetic tweaks
fig.update_layout(
    title_x=0.5,
    legend_title_text="Category",
    hovermode="x unified",
    margin=dict(l=50, r=50, t=80, b=50),
    font=dict(family="Segoe UI", size=14),
)

# Save for sharing
os.makedirs("data/outputs", exist_ok=True)
fig.write_html("data/outputs/zcpi_chart.html")

print("✅ Interactive chart saved → data/outputs/zcpi_chart.html")

# Show locally (optional)
fig.show()
