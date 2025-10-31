# ZCPI — Zcash Consumer Price Index

A project to calculate and visualize the purchasing power of Zcash (ZEC) against the U.S. CPI "food at home" basket.

## 📊 What is ZCPI?

The ZCPI quantifies how much of the official U.S. CPI "food at home" basket one ZEC can buy over time. It combines:
- **CPI data** from the Bureau of Labor Statistics (BLS)
- **ZEC/USD prices** from CoinGecko

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Virtual environment (recommended)

### Installation

```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Setup (Optional but Recommended)

Create a `.env` file in the root directory for API keys:

```powershell
# Copy the example file
cp env.example .env

# Edit .env and add your API keys (optional)
# BLS_API_KEY=your_bls_api_key_here
# COINGECKO_API_KEY=your_coingecko_api_key_here
# SUPABASE_URL=https://yourproject.supabase.co
# SUPABASE_KEY=your-anon-key-here
```

**Note:** All API keys are optional. The scripts will work without them, but with limited functionality:
- Without BLS API key: Lower rate limits
- Without CoinGecko API key: Limited to last 365 days of data
- Without Supabase credentials: Cannot upload data to Supabase (frontend won't work)

### Running the Scripts

```powershell
# Fetch CPI data
python scripts/fetch_bls.py

# Fetch ZEC price data
python scripts/fetch_zec.py

# Merge and compute ZCPI
python scripts/merge_zcpi.py

# Visualize results
python scripts/plot_zcpi.py
```

## 🔑 API Keys (Optional)

API keys improve functionality but aren't required to get started:

- **BLS API Key:** Higher rate limits
- **CoinGecko API Key:** Full historical data (vs. 365 days)
- **Supabase URL & Key:** Required for frontend dashboard

### Quick Setup

**Option 1: Using .env file (Recommended)**
```powershell
# 1. Copy the example file
cp env.example .env

# 2. Edit .env and add your keys
# The scripts will automatically load from .env
```

**Option 2: Using environment variables**
```powershell
# Set environment variables (PowerShell)
$env:BLS_API_KEY="your_bls_key"
$env:COINGECKO_API_KEY="your_coingecko_key"

# Now run scripts with enhanced features
python scripts/fetch_zec.py  # Gets full historical data
```

See [API Keys Setup](docs/API_KEYS_SETUP.md) for detailed setup instructions.

## 📁 Project Structure

```
ZCPI/
├── data/
│   ├── processed/      # Cleaned CSV files
│   └── raw/            # Raw data dumps
├── scripts/
│   ├── fetch_bls.py    # Fetch CPI data from BLS
│   ├── fetch_zec.py    # Fetch ZEC/USD prices
│   ├── merge_zcpi.py   # Compute ZCPI
│   └── plot_zcpi.py    # Visualize results
├── docs/               # Project documentation
│   ├── API_KEYS_SETUP.md
│   ├── frontend/
│   └── ...
└── README.md           # This file
```

## 📈 Data Sources

### BLS CPI Data
- **Endpoint:** https://api.bls.gov/publicAPI/v2/timeseries/data/
- **Series:** Food at home categories (CUUR0000SAF11, etc.)
- **Update Frequency:** Monthly
- **Key Required:** Optional (higher rate limits)

### CoinGecko ZEC/USD
- **Endpoint:** https://api.coingecko.com/api/v3/coins/zcash/market_chart
- **Update Frequency:** Daily
- **Key Required:** Optional (full history vs. 365 days)

## 🛠️ What Each Script Does

| Script | Purpose | Output |
|--------|---------|--------|
| `fetch_bls.py` | Downloads CPI data from BLS API | `data/processed/cpi_monthly.csv` |
| `fetch_zec.py` | Downloads ZEC/USD prices | `data/processed/zec_monthly.csv` |
| `merge_zcpi.py` | Merges data and calculates ZCPI | `data/processed/zcpi_computed.csv` |
| `plot_zcpi.py` | Generates visualization | Plotly chart |

## 📊 Data Processing

1. **Fetch Stage:** Download raw data from APIs
2. **Clean Stage:** Parse dates, handle missing values
3. **Merge Stage:** Align CPI and ZEC data by month
4. **Calculate ZCPI:** Divide CPI by ZEC/USD price
5. **Visualize:** Generate time-series plots

## 🔧 Troubleshooting

### "Your request exceeds the allowed time range"
- **Cause:** CoinGecko free tier limit
- **Fix:** Set `COINGECKO_API_KEY` environment variable

### Rate limit errors
- **Cause:** Too many API requests
- **Fix:** Add API keys or wait between requests

### Date parsing warnings
- **Status:** Fixed in latest version
- **No action needed**

## 📚 Documentation

All documentation is located in the [`docs/`](docs/) folder:

- **[Complete Setup Guide](docs/SETUP_GUIDE.md)** - Step-by-step setup instructions (start here if cloning)
- **[API Keys Setup](docs/API_KEYS_SETUP.md)** - API key configuration guide
- **[POC Development Roadmap](docs/POC%20Development%20Roadmap.md)** - Development phases and architecture
- **[Requirements Sheets](docs/Requirements%20Sheets.md)** - Detailed project specifications
- **[Frontend Documentation](docs/frontend/)** - Frontend-specific guides:
  - [Percentage Calculations](docs/frontend/PERCENTAGE_CALCULATIONS.md) - How percentage changes are calculated
  - [Troubleshooting Guide](docs/frontend/TROUBLESHOOTING.md) - Common issues and solutions

## 🔗 Links

- **BLS API:** https://www.bls.gov/developers/
- **CoinGecko API:** https://www.coingecko.com/en/api/documentation
- **Zcash:** https://z.cash/

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contributing guidelines here]

