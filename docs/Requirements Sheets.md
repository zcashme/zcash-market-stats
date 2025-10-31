Here is the requirements sheet converted into a single markdown code block, with corrections for JSON, text blocks, and LaTeX formatting.

Markdown

\# ZCPI (Zcash Consumer Price Index) — Requirements Sheet

\#\# Overview

The ZCPI (Zcash Consumer Price Index) quantifies how much of the official U.S. CPI “food at home” basket one ZEC can buy over time.  
The system merges BLS CPI data (for grocery categories) with CoinGecko ZEC/USD price data to compute, visualize, and summarize purchasing power.  
The deliverable is a dashboard similar to CoinMarketCap:

\* **\*\*Top section:\*\*** time-series plot of all CPI components (lines).  
\* **\*\*Bottom section:\*\*** summary table showing per-category statistics and recent performance.

\---

\#\# 1\. Data Sources

\#\#\# 1.1 Bureau of Labor Statistics (BLS) Public Data API

\* **\*\*Endpoint:\*\*** \`https://api.bls.gov/publicAPI/v2/timeseries/data/\`  
\* **\*\*Method:\*\*** POST  
\* **\*\*Payload Example:\*\***  
    \`\`\`json  
    {  
      "seriesid": \[  
        "CUUR0000SAF11",  
        "CUUR0000SAF111",  
        "CUUR0000SAF112",  
        "CUUR0000SAF113",  
        "CUUR0000SAF114",  
        "CUUR0000SAF115",  
        "CUUR0000SAF116"  
      \],  
      "startyear": "2016",  
      "endyear": "2025"  
    }  
    \`\`\`  
\* \*\*Returned fields:\*\*  
    \* \`year\`  
    \* \`periodName\` (month)  
    \* \`value\` (CPI index, base 1982–84 \= 100\)  
\* \*\*Update frequency:\*\* Monthly

\#\#\# 1.2 CoinGecko API

\* **\*\*Endpoint:\*\*** \`https://api.coingecko.com/api/v3/coins/zcash/market\_chart?vs\_currency=usd\&days=max\`  
\* **\*\*Returned fields:\*\***  
    \* \`prices\`: array of \`\[timestamp, price\_usd\]\` pairs (daily)  
\* **\*\*Processing:\*\***  
    \* Convert to monthly averages to align with CPI data.  
    \* Compute rolling averages for 7d, 30d, 3m, 6m, 9m, 1y, 5y windows.  
\* **\*\*Update frequency:\*\*** Daily

\---

\#\# 2\. Data Model

\#\#\# 2.1 Base Tables

**\*\*cpi*\_data\*\****  
***| Field | Type | Description |***  
***|---|---|---|***  
***| category | string | CPI category name |***  
***| series\_id | string | BLS series code |***  
***| date | YYYY-MM | Month of record |***  
***| cpi\_value | float | CPI index value |***

***\*\*zec\_*****price*\_data\*\****  
***| Field | Type | Description |***  
***|---|---|---|***  
***| date | YYYY-MM | Month of record |***  
***| avg\_price\_usd | float | Monthly average ZEC/USD |***  
***| 7d\_avg | float | 7-day average |***  
***| 30d\_avg | float | 30-day average |***  
***| 3m\_avg | float | 3-month average |***  
***| 6m\_avg | float | 6-month average |***  
***| 9m\_avg | float | 9-month average |***  
***| 1y\_avg | float | 12-month average |***  
***| 5y\_avg | float | 60-month average |***

***\*\*zcpi\_data\*\****  
***| Field | Type | Description |***  
***|---|---|---|***  
***| category | string | CPI category |***  
***| date | YYYY-MM | Month of record |***  
***| cpi\_value | float | From cpi\_data |***  
***| zec\_usd | float | From zec\_price\_data |***  
***| zcpi\_value | float | Computed as \`(zec\_usd / (cpi\_value / 100))\` |***  
***| pct\_change\_7d | float | Percent change (7-day) |***  
***| pct\_change\_1m | float | Percent change (1-month) |***  
***| pct\_change\_3m | float | Percent change (3-month) |***  
***| pct\_change\_6m | float | Percent change (6-month) |***  
***| pct\_change\_9m | float | Percent change (9-month) |***  
***| pct\_change\_1y | float | Percent change (12-month) |***  
***| pct\_change\_5y | float | Percent change (60-month) |***  
***| pct\_change\_max | float | Change from first observation |***

***\---***

***\#\# 3\. Data Flow***

***\#\#\# 3.1 Overview***

***The system follows a modular ETL process with intermediate datasets for traceability and performance.***

***\*\*Flow:\*\****

***1\.  \*\*Fetch Raw Data\*\****  
    ***\* Retrieve CPI data from BLS (JSON)***  
    ***\* Retrieve ZEC/USD daily data from CoinGecko (JSON)***  
***2\.  \*\*Intermediate Datasets\*\****  
    ***\* Store in \`/data/raw/bls/\` and \`/data/raw/coingecko/\`***  
    ***\* Transform into structured tables:***  
        ***\* \`/data/processed/cpi\_monthly.csv\`***  
        ***\* \`/data/processed/zec\_monthly.csv\`***  
***3\.  \*\*Merge Layer\*\****  
    ***\* Join on \`date\`***  
    ***\* Compute ZCPI value and percent changes***  
    ***\* Save as \`/data/processed/zcpi\_computed.csv\`***  
***4\.  \*\*Analytics Layer\*\****  
    ***\* Create normalized and indexed versions***  
    ***\* Store visualization-ready dataset \`/data/final/zcpi\_dashboard.json\`***  
***5\.  \*\*Frontend Visualization\*\****  
    ***\* Consume \`/api/zcpi\` endpoint serving JSON from final dataset***

***\*\*Pipeline Structure:\*\****

***\`\`\`text***  
***raw (BLS, CoinGecko)***  
***↓***  
***intermediate (clean monthly tables)***  
***↓***  
***merged (ZCPI computation)***  
***↓***  
***final (normalized, dashboard-ready)***

**Intermediate Data Benefits:**

* Reproducible builds (each stage verifiable)  
* Fast incremental updates (only reprocess latest month)  
* Debugging and API reliability isolation

---

## **4\. Calculations**

### **4.1 ZCPI Value**

$$ZCPI \= \\frac{ZEC/USD}{(CPI/100)}$$

### **4.2 Normalization**

$$ZCPI\_{norm}(t) \= 100 \\times \\frac{ZCPI(t)}{ZCPI(2020\\text{-}01)}$$

### **4.3 Percentage Changes**

$$pct\\\_change\\\_n \= \\frac{ZCPI(t) \- ZCPI(t-n)}{ZCPI(t-n)} \\times 100$$

---

## **5\. Dashboard Structure**

### **5.1 Plot Section (Top)**

* **Type:** Multi-line timeseries  
* **X-axis:** Month  
* **Y-axis:** Normalized ZCPI (Jan 2020 \= 100\)  
* **Lines:** Each CPI component (same categories shown in table)  
* **Highlight:** "Food at home" as main index

### **5.2 Summary Table (Bottom)**

Functions like CoinMarketCap listings.

| Category | CPI | ZEC/USD | ZCPI | 7d | 1m | 3m | 6m | 9m | 1y | 5y | Max | Line |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Food at home | 304.6 | 23.45 | 7.7 | \+1.2% | −2.0% | −5.8% | \+3.4% | \+8.1% | −27% | −74% | −93% | ⬤ |
| Meats, poultry, fish, eggs | 345.1 | 23.45 | 6.8 | … | … | … | … | … | … | … | … | ⬤ |

* “Line” column shows color markers matching the plotted lines above.  
* Clicking a row filters/highlights its corresponding line in the plot.

---

## **6\. Technical Requirements**

### **Backend**

* **Language:** Python 3.x  
* **Libraries:** requests, pandas, matplotlib or plotly, schedule  
* **Storage:** SQLite or PostgreSQL  
* **Cron jobs:**  
  * **Daily:** CoinGecko update  
  * **Monthly:** BLS CPI update

### **Frontend**

* **Framework:** React (preferred) or Svelte/Vue  
* **Charting:** Plotly.js or Chart.js  
* **Data:** served as JSON from /api/zcpi

### **File Structure**

Plaintext

/data  
  /raw  
    /bls/  
    /coingecko/  
  /processed/  
  /final/  
/scripts  
  fetch\_bls.py  
  fetch\_zec.py  
  merge\_zcpi.py  
/frontend  
  components/  
    plots/  
    tables/

---

## **7\. Deliverables**

* ETL scripts for BLS and CoinGecko ingestion  
* Merge and compute module for ZCPI calculations  
* Database schema or migration script  
* /api/zcpi endpoint serving normalized dataset  
* Frontend dashboard with:  
  * Multi-line ZCPI plot  
  * CoinMarketCap-style summary table  
* Documentation (README.md) explaining refresh, update, and dependency setup