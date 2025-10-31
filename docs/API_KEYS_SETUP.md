# 🔑 API Keys Setup Guide

This project uses optional API keys to improve rate limits and data access. You can run the scripts without keys, but with limited functionality.

## 📋 Quick Setup

### Option 1: Environment Variables (Recommended)

#### Windows PowerShell
```powershell
# Set BLS API key
$env:BLS_API_KEY="your_bls_api_key_here"

# Set CoinGecko API key
$env:COINGECKO_API_KEY="your_coingecko_api_key_here"

# Run scripts
python scripts/fetch_bls.py
python scripts/fetch_zec.py
```

#### Windows Command Prompt
```cmd
set BLS_API_KEY=your_bls_api_key_here
set COINGECKO_API_KEY=your_coingecko_api_key_here
```

#### Linux/Mac
```bash
export BLS_API_KEY="your_bls_api_key_here"
export COINGECKO_API_KEY="your_coingecko_api_key_here"
```

### Option 2: Create a `.env` file (Recommended)

**Step 1:** Copy the example file:
```powershell
cp env.example .env
```

**Step 2:** Edit `.env` and add your actual API keys:
```env
BLS_API_KEY=your_actual_bls_api_key_here
COINGECKO_API_KEY=your_actual_coingecko_api_key_here
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_KEY=your-actual-anon-key-here
```

**Step 3:** The Python scripts will automatically load variables from `.env` when you run them. No need to set environment variables manually!

**Important:** The `.env` file is already in `.gitignore`, so it won't be committed to Git. ✅

## 🎯 BLS API Key

**Status:** Optional (works without key, lower rate limits)

### How to Get:
1. Visit: https://data.bls.gov/registrationKey/
2. Enter your email address
3. Check your email for the registration key
4. Copy the key

### Benefits:
- Higher rate limits for API requests
- More reliable data fetching

### Usage:
```powershell
$env:BLS_API_KEY="abc123def456..."
python scripts/fetch_bls.py
```

## 🦎 CoinGecko API Key

**Status:** Optional (works without key, limited to 365 days of data)

### How to Get:
1. Visit: https://www.coingecko.com/en/api/pricing
2. Choose a plan (Free tier available)
3. Sign up and get your API key

### Benefits:
- **With key:** Full historical data (all-time)
- **Without key:** Limited to last 365 days
- Higher rate limits

### Usage:
```powershell
$env:COINGECKO_API_KEY="CG-abc123def456..."
python scripts/fetch_zec.py
```

## 📊 What Works Without Keys

| API | Without Key | With Key |
|-----|-------------|----------|
| **BLS** | ✅ Works (rate limits) | ✅ Higher rate limits |
| **CoinGecko** | ⚠️ Last 365 days only | ✅ Full historical data |

## 🔄 Making Keys Permanent (Windows)

### PowerShell Profile
Add to your `$PROFILE`:
```powershell
notepad $PROFILE
```

Add these lines:
```powershell
$env:BLS_API_KEY="your_bls_api_key_here"
$env:COINGECKO_API_KEY="your_coingecko_api_key_here"
```

### System Environment Variables (Global)
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Click "Environment Variables"
3. Under "User variables", click "New"
4. Add `BLS_API_KEY` and `COINGECKO_API_KEY` with their values
5. Click OK on all dialogs

## ✅ Testing Your Setup

Run these commands to verify:

```powershell
# Test BLS with key
$env:BLS_API_KEY="your_key"
python scripts/fetch_bls.py

# Test CoinGecko with key
$env:COINGECKO_API_KEY="your_key"
python scripts/fetch_zec.py
```

Expected output:
```
✅ Saved CPI data → data/processed/cpi_monthly.csv
✅ Saved ZEC price data → data/processed/zec_monthly.csv
```

## 🐛 Troubleshooting

### "Your request exceeds the allowed time range"
- **Problem:** CoinGecko free tier limit
- **Solution:** Add `COINGECKO_API_KEY` environment variable

### Rate limit errors
- **Problem:** Too many requests
- **Solution:** Add API keys for higher limits or wait between requests

### Keys not working
- Verify keys are correctly set: `echo $env:BLS_API_KEY` (PowerShell)
- Check for typos or extra spaces
- Ensure you're using the correct variable names

## 📝 Example Session

```powershell
# Start a new PowerShell session
# Set your keys once
$env:BLS_API_KEY="abc123..."
$env:COINGECKO_API_KEY="CG-xyz789..."

# Now run all scripts
python scripts/fetch_bls.py
python scripts/fetch_zec.py
python scripts/merge_zcpi.py
python scripts/plot_zcpi.py
```

Keys remain active for the current PowerShell session.

## 🔒 Security Notes

- **Never commit API keys to Git**
- Add `.env` to `.gitignore` if you create one
- Keys in environment variables are session-specific (safer)
- Consider using a secrets manager for production

## 📚 More Information

- BLS API: https://www.bls.gov/developers/
- CoinGecko API: https://www.coingecko.com/en/api/documentation

