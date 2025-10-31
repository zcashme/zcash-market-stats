# ZCPI Dashboard

React dashboard for visualizing Zcash Consumer Price Index (ZCPI) data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the `frontend` directory:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**How to get your Supabase credentials:**
- Create a free account at [supabase.com](https://supabase.com)
- Create a new project
- Go to Project Settings → API
- Copy the "Project URL" → `VITE_SUPABASE_URL`
- Copy the "anon public" key → `VITE_SUPABASE_ANON_KEY`

**Note:** Vite automatically loads `.env` files. The `.env` file is already in `.gitignore` and won't be committed.

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Features

- **Interactive Plotly Chart**: Multi-line time series visualization with hover mode
- **Summary Table**: CoinMarketCap-style table with percentage changes (7d, 1m, 3m, 6m, 9m, 1y, 5y, Max)
- **Category Highlighting**: Click table rows to highlight corresponding chart lines
- **Dynamic Metric Selection**: Automatically uses `zcpi_norm` if available, else `zcpi_value`
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Compatible with dark mode preferences

## Tech Stack

- React 18
- Vite
- Plotly.js (via react-plotly.js)
- Supabase Client
- Tailwind CSS

## Documentation

- **[Percentage Calculations](../docs/frontend/PERCENTAGE_CALCULATIONS.md)**: Detailed explanation of how percentage changes (7d, 1m, 3m, 6m, 9m, 1y, 5y, Max) are calculated with examples
- **[Troubleshooting Guide](../docs/frontend/TROUBLESHOOTING.md)**: Common issues and solutions for the dashboard
