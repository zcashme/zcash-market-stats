## 🗺️ **ZCPI POC Development Roadmap**

---

### **🔹 Phase 1 — Setup & Initialization**

| Step | Task                                                          | Tools          | Output                           |
| ---- | ------------------------------------------------------------- | -------------- | -------------------------------- |
| 1    | Create a new GitHub repo (e.g., `zcpi-poc`)                   | GitHub         | Central repo for code + frontend |
| 2    | Setup basic folder structure:                                 | Local / GitHub | Organized project                |
|      | `text<br>/data<br>/scripts<br>/frontend`                      |                |                                  |
| 3    | Create a Python virtual environment and install dependencies: | Python         | Clean dev setup                  |
|      | `bash<br>pip install requests pandas supabase plotly`         |                |                                  |

---

### **🔹 Phase 2 — Data Collection (ETL Base)**

| Step | Task                                      | Script          | Output                              |
| ---- | ----------------------------------------- | --------------- | ----------------------------------- |
| 4    | Fetch CPI data from **BLS API**           | `fetch_bls.py`  | `/data/processed/cpi_monthly.csv`   |
| 5    | Fetch ZEC/USD data from **CoinGecko API** | `fetch_zec.py`  | `/data/processed/zec_monthly.csv`   |
| 6    | Merge both datasets and compute **ZCPI**  | `merge_zcpi.py` | `/data/processed/zcpi_computed.csv` |

📘 *Goal:* You should now have one merged dataset ready for visualization.

---

### **🔹 Phase 3 — Data Upload to Supabase**

| Step | Task                                                                                                 | Tools                                | Output                  |
| ---- | ---------------------------------------------------------------------------------------------------- | ------------------------------------ | ----------------------- |
| 7    | Create a free **Supabase project**                                                                   | [supabase.com](https://supabase.com) | Hosted Postgres + API   |
| 8    | Create a table `zcpi_data` (columns: `category`, `date`, `cpi_value`, `zec_usd`, `zcpi_value`, etc.) | Supabase dashboard                   | Empty table             |
| 9    | Use Python `supabase` client to upload your computed dataset:                                        | `upload_supabase.py`                 | Data hosted in Supabase |
|      | `python<br>from supabase import create_client`                                                       |                                      |                         |

✅ *Now your backend API endpoint is ready automatically via Supabase REST.*

---

### **🔹 Phase 4 — Frontend (React + GitHub Pages)**

| Step | Task                                                        | Tools                                   | Output             |
| ---- | ----------------------------------------------------------- | --------------------------------------- | ------------------ |
| 10   | Create a React app                                          | `npx create-react-app frontend`         | `/frontend` folder |
| 11   | Install charting library                                    | `npm install plotly.js react-plotly.js` | Ready for chart    |
| 12   | Create a component to fetch from Supabase REST and display: | React                                   | Basic dashboard    |
|      | - Top: Line chart (Plotly)  <br> - Bottom: Summary table    |                                         |                    |
| 13   | Commit + push to GitHub                                     | GitHub                                  | Version control    |
| 14   | Enable **GitHub Pages** in repo settings                    | GitHub Pages                            | Live dashboard     |

🌐 *Example output:*
`https://yourusername.github.io/zcpi-poc`

---

### **🔹 Phase 5 — Automation (Optional for POC)**

| Step | Task                                                 | Tools                          | Output                 |
| ---- | ---------------------------------------------------- | ------------------------------ | ---------------------- |
| 15   | Add a **GitHub Action** to rerun ETL scripts monthly | `.github/workflows/update.yml` | Auto-refresh           |
| 16   | On success, push new data to Supabase                | Python Action                  | Always-fresh ZCPI data |

---

### **🔹 Phase 6 — Final Touches**

| Step | Task                                           | Tools    | Output                 |
| ---- | ---------------------------------------------- | -------- | ---------------------- |
| 17   | Add README.md with setup, refresh instructions | Markdown | Clear documentation    |
| 18   | Record a short Loom or PPT for demo            | Optional | Presentation-ready POC |

---

## 🧩 **Final Architecture Overview**

```
[BLS API] ─┐
            ├──▶ fetch_bls.py ┐
[CoinGecko] ─┘                ├──▶ merge_zcpi.py ───▶ zcpi_computed.csv
                               │
                               ▼
                        upload_supabase.py
                               │
                               ▼
                      [Supabase Table: zcpi_data]
                               │
                               ▼
                     React App (GitHub Pages)
                  fetches via Supabase REST API
```


