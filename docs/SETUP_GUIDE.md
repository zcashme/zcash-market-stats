# Complete Setup Guide

This guide explains how to set up the ZCPI project from scratch, including how environment variables and `.env` files work.

## 📋 Overview

The project uses **environment variables** to securely store API keys. There are two ways to provide these:

1. **`.env` file (Recommended)** - Easiest for local development
2. **System environment variables** - Useful for CI/CD or production

## 🔧 How It Works

### For Python Scripts

All Python scripts (`fetch_bls.py`, `fetch_zec.py`, `upload_supabase.py`) use `python-dotenv` to automatically load variables from a `.env` file in the root directory.

**Workflow:**
1. User creates `.env` file from `env.example`
2. User adds their API keys to `.env`
3. Scripts call `load_dotenv()` at startup
4. Scripts read keys via `os.getenv("KEY_NAME")`
5. `.env` file is ignored by Git (never committed)

### For Frontend (React/Vite)

The frontend uses Vite, which automatically loads `.env` files from the `frontend/` directory.

**Workflow:**
1. User creates `frontend/.env` file
2. User adds Supabase credentials
3. Vite automatically loads `VITE_*` prefixed variables
4. React code accesses via `import.meta.env.VITE_SUPABASE_URL`
5. `.env` file is ignored by Git

## 🚀 Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/zcpi.git
cd zcpi
```

### 2. Set Up Python Environment

```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\activate  # Windows PowerShell
# or
source venv/bin/activate  # Linux/Mac

# Install dependencies (includes python-dotenv)
pip install -r requirements.txt
```

### 3. Create Root `.env` File (For Python Scripts)

```powershell
# Copy the example file
cp env.example .env

# Edit .env with your favorite editor
notepad .env  # Windows
# or
nano .env     # Linux/Mac
```

Add your API keys:
```env
# Optional: BLS API Key (for higher rate limits)
BLS_API_KEY=your_actual_bls_key_here

# Optional: CoinGecko API Key (for full historical data)
COINGECKO_API_KEY=your_actual_coingecko_key_here

# Required for Supabase upload script
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_KEY=your-actual-anon-key-here
```

**Where to get API keys:**
- **BLS:** https://data.bls.gov/registrationKey/
- **CoinGecko:** https://www.coingecko.com/en/api/pricing
- **Supabase:** Project Settings → API (in your Supabase dashboard)

### 4. Set Up Frontend (Optional - for dashboard)

```powershell
cd frontend

# Install dependencies
npm install

# Create frontend/.env file
# Copy from env.example or create manually
```

Create `frontend/.env`:
```env
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run the Scripts

Now you can run the Python scripts, and they'll automatically load from `.env`:

```powershell
# All scripts will automatically read from .env
python scripts/fetch_bls.py
python scripts/fetch_zec.py
python scripts/merge_zcpi.py
python scripts/upload_supabase.py  # Requires SUPABASE_URL and SUPABASE_KEY
```

### 6. Start Frontend (Optional)

```powershell
cd frontend
npm run dev
```

The frontend will automatically load Supabase credentials from `frontend/.env`.

## 🔒 Security

### What's Protected

✅ **`.env` files** - Listed in `.gitignore`, never committed to Git  
✅ **API Keys** - Never hardcoded in source code  
✅ **Environment Variables** - Only loaded at runtime  

### What's Safe to Commit

✅ `env.example` - Only contains placeholder values  
✅ All source code - No keys in code  
✅ Configuration files - No sensitive data  

### Verification

Before pushing to GitHub, verify no `.env` files are tracked:

```powershell
git status
# Should NOT show .env files

# Or check explicitly
git ls-files | grep .env
# Should return nothing
```

## 🆘 Troubleshooting

### "ModuleNotFoundError: No module named 'dotenv'"

**Solution:** Install dependencies:
```powershell
pip install -r requirements.txt
```

### Scripts not finding API keys from `.env`

**Check:**
1. `.env` file exists in the root directory (same folder as `README.md`)
2. `.env` file is in the correct format (no quotes around values)
3. Variable names match exactly (e.g., `BLS_API_KEY`, not `bls_api_key`)

**Example correct format:**
```env
BLS_API_KEY=abc123def456
```

**Wrong formats:**
```env
BLS_API_KEY="abc123def456"  # ❌ Quotes not needed
bls_api_key=abc123def456    # ❌ Wrong case
BLS_API_KEY = abc123def456  # ❌ Spaces around =
```

### Frontend can't connect to Supabase

**Check:**
1. `frontend/.env` file exists
2. Variables start with `VITE_` prefix
3. Supabase URL and key are correct
4. Supabase project has RLS policies set up (see [Troubleshooting Guide](../frontend/TROUBLESHOOTING.md))

## 📚 Related Documentation

- [API Keys Setup Guide](API_KEYS_SETUP.md) - Detailed API key configuration
- [Frontend Troubleshooting](../frontend/TROUBLESHOOTING.md) - Frontend-specific issues
- [Main README](../README.md) - Project overview

