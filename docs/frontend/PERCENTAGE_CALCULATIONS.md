# Percentage Change Calculations Documentation

## Overview

The Summary Table displays percentage changes for various time periods (7d, 1m, 3m, 6m, 9m, 1y, 5y, Max) showing how the ZCPI metric has changed over time relative to the most recent available date.

## Formula

```
Percentage Change = ((Latest Value - Period Value) / Period Value) × 100
```

Where:
- **Latest Value** = The most recent ZCPI metric value for a category
- **Period Value** = The ZCPI metric value from the target period ago
- Result is expressed as a percentage

---

## Calculation Method

### For Time-Based Periods (7d, 1m, 3m, 6m, 9m, 1y, 5y)

1. **Find Latest Date**: Identify the most recent date across all data (regardless of category)
2. **Find Latest Value**: Get the most recent ZCPI metric value for the specific category
3. **Calculate Target Date**: Subtract the period duration from the latest date
   - 7d = Latest Date - 7 days
   - 1m = Latest Date - 30 days
   - 3m = Latest Date - 90 days
   - etc.
4. **Find Period Value**: Locate the closest data point that is **before or on** the target date for that category
5. **Calculate Change**: Apply the formula above

### For Max Period

1. **Find Latest Value**: Get the most recent ZCPI metric value for the category
2. **Find First Value**: Get the oldest (first) available ZCPI metric value for the category
3. **Calculate Change**: Apply the formula using first value as the period value

---

## Simple Example

Let's say we have monthly data for the "Food at home" category:

| Date       | ZCPI Value |
|------------|------------|
| 2024-06-01 | 100.0      |
| 2024-07-01 | 105.0      |
| 2024-08-01 | 102.0      |
| 2024-09-01 | 108.0      |
| 2024-10-01 | 110.0      |
| 2024-11-01 | 115.0      |
| 2024-12-01 | 120.0      |

**Latest Date**: 2024-12-01  
**Latest Value**: 120.0

### Calculating 1 Month Change

1. **Target Date**: 2024-12-01 - 30 days = 2024-11-01
2. **Period Value**: 115.0 (from 2024-11-01)
3. **Calculation**:
   ```
   % Change = ((120.0 - 115.0) / 115.0) × 100
            = (5.0 / 115.0) × 100
            = 0.0435 × 100
            = +4.35%
   ```
4. **Result**: **+4.35%** (indicating a 4.35% increase from November to December)

### Calculating 3 Month Change

1. **Target Date**: 2024-12-01 - 90 days = 2024-09-01 (approximately)
2. **Period Value**: 108.0 (from 2024-09-01 - closest date on or before target)
3. **Calculation**:
   ```
   % Change = ((120.0 - 108.0) / 108.0) × 100
            = (12.0 / 108.0) × 100
            = 0.1111 × 100
            = +11.11%
   ```
4. **Result**: **+11.11%** (indicating an 11.11% increase from September to December)

### Calculating Max Change

1. **Latest Value**: 120.0 (from 2024-12-01)
2. **First Value**: 100.0 (from 2024-06-01 - the oldest available)
3. **Calculation**:
   ```
   % Change = ((120.0 - 100.0) / 100.0) × 100
            = (20.0 / 100.0) × 100
            = 0.20 × 100
            = +20.0%
   ```
4. **Result**: **+20.0%** (indicating a 20% increase from the first recorded value to the latest)

---

## Real-World Example

### Example Scenario

Suppose we're looking at "Dairy" category with the following data:

| Date       | ZCPI Value (zcpi_value) |
|------------|-------------------------|
| 2024-01-01 | 12.5                    |
| 2024-02-01 | 11.8                    |
| 2024-03-01 | 13.2                    |
| 2024-04-01 | 12.9                    |
| 2024-05-01 | 14.1                    |
| 2024-06-01 | 13.5                    |
| 2024-07-01 | 15.0                    |
| 2024-08-01 | 14.2                    |
| 2024-09-01 | 16.5                    |

**Latest Date**: 2024-09-01  
**Latest Value**: 16.5

### Calculations for Each Period

#### 7 Days (7d)
- **Target**: 2024-09-01 - 7 days = 2024-08-24
- **Closest data point**: 2024-08-01 (value: 14.2)
- **Result**: `((16.5 - 14.2) / 14.2) × 100 = +16.20%`

#### 1 Month (1m)
- **Target**: 2024-09-01 - 30 days = 2024-08-02
- **Closest data point**: 2024-08-01 (value: 14.2)
- **Result**: `((16.5 - 14.2) / 14.2) × 100 = +16.20%`

#### 3 Months (3m)
- **Target**: 2024-09-01 - 90 days = 2024-06-03
- **Closest data point**: 2024-06-01 (value: 13.5)
- **Result**: `((16.5 - 13.5) / 13.5) × 100 = +22.22%`

#### 6 Months (6m)
- **Target**: 2024-09-01 - 180 days = 2024-03-05
- **Closest data point**: 2024-03-01 (value: 13.2)
- **Result**: `((16.5 - 13.2) / 13.2) × 100 = +25.00%`

#### 9 Months (9m)
- **Target**: 2024-09-01 - 270 days = 2023-12-06
- **Closest data point**: 2024-01-01 (value: 12.5) - if data exists, otherwise null
- **Result**: `((16.5 - 12.5) / 12.5) × 100 = +32.00%`

#### 1 Year (1y)
- **Target**: 2024-09-01 - 365 days = 2023-09-01
- **Closest data point**: First available data point before/on this date
- **Result**: Calculated if data exists, otherwise "N/A"

#### 5 Years (5y)
- **Target**: 2024-09-01 - 1825 days = 2019-09-01
- **Closest data point**: First available data point before/on this date
- **Result**: Calculated if data exists, otherwise "N/A"

#### Max
- **First Value**: 12.5 (from 2024-01-01)
- **Latest Value**: 16.5 (from 2024-09-01)
- **Result**: `((16.5 - 12.5) / 12.5) × 100 = +32.00%`

---

## Handling Missing Data

### When Data Doesn't Exist for a Period

If there's no data point available for the target period, the calculation returns `null`, which displays as **"N/A"** in the table.

**Example**:
- Latest date: 2024-09-01
- Target for 5y: 2019-09-01
- If no data exists before 2020-01-01, the 5y column shows **"N/A"**

### Edge Cases

1. **Insufficient History**: If a category has less than the required period of data, that period shows "N/A"
2. **No Valid Values**: If a category has no valid ZCPI values, all periods show "N/A"
3. **Exact Date Match**: If a data point exists exactly on the target date, it's used; otherwise, the closest earlier date is used

---

## Interpretation Guide

### Positive Values (+)
- Indicates **increase** in purchasing power
- Example: `+15.5%` means the ZCPI metric increased by 15.5% over the period
- **Green color** in the dashboard

### Negative Values (-)
- Indicates **decrease** in purchasing power
- Example: `-8.2%` means the ZCPI metric decreased by 8.2% over the period
- **Red color** in the dashboard

### Zero (0%)
- No change occurred over the period
- The latest value equals the period value

### N/A
- Data not available for that time period
- Either no historical data exists, or the calculation couldn't find a valid comparison point

---

## Implementation Details

### Data Processing Flow

```
1. Fetch all data from Supabase → Filter by category
2. Sort by date (newest first) for the category
3. Get latest value (first entry)
4. For each period:
   a. Calculate target date (latest - period days)
   b. Find closest data point ≤ target date
   c. Calculate percentage change
   d. If no data found → return null (shows as "N/A")
5. For Max:
   a. Get oldest value (last entry after sorting)
   b. Calculate percentage change from oldest to latest
```

### Code Location

The calculation logic is implemented in:
- **File**: `frontend/src/SummaryTable.jsx`
- **Function**: `calculatePercentageChange()`
- **Lines**: ~22-52

---

## Notes

1. **Monthly Data**: Since ZCPI data is monthly (YYYY-MM-DD with day = 01), exact day-based periods (7d, 30d) may not align perfectly with month boundaries. The calculation finds the closest available data point.

2. **Consistency**: All periods use the same latest date as the reference point, ensuring consistent comparisons.

3. **Category-Specific**: Each category calculates its own percentage changes independently, as different categories may have different data availability.

4. **Metric Selection**: The calculation uses either `zcpi_norm` (if available) or `zcpi_value` (fallback), determined automatically by the dashboard.

---

## Quick Reference

| Period | Days | Example Calculation |
|--------|------|---------------------|
| 7d     | 7    | Latest vs 7 days ago |
| 1m     | 30   | Latest vs 30 days ago |
| 3m     | 90   | Latest vs 90 days ago |
| 6m     | 180  | Latest vs 180 days ago |
| 9m     | 270  | Latest vs 270 days ago |
| 1y     | 365  | Latest vs 365 days ago |
| 5y     | 1825 | Latest vs 1825 days ago |
| Max    | -    | Latest vs first available value |

---

**Last Updated**: January 2025


