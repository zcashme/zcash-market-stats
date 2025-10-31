import React, { useMemo } from 'react'
import { generateColorMap } from './utils/colors'

function SummaryTable({ data, metric, onRowClick, highlightedCategory }) {
  const tableData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Get all unique categories
    const categories = [...new Set(data.map(row => row.category))].sort()
    const colorMap = generateColorMap(categories)

    // Helper function to find value at a target date for a category
    const findValueAtDate = (categoryData, targetDate) => {
      // Find first date that is <= targetDate (going backwards from latest)
      const targetPoint = categoryData.find(row => {
        const rowDate = new Date(row.date)
        return rowDate <= targetDate
      })
      return targetPoint ? targetPoint[metric] : null
    }

    /**
     * Calculate percentage change for a category over a given period
     * 
     * Formula: ((Latest Value - Period Value) / Period Value) × 100
     * 
     * For time-based periods (7d, 1m, etc.):
     * - Finds the closest data point before/on the target date
     * - Calculates % change from that point to latest
     * 
     * For 'max' period:
     * - Uses the first (oldest) available value for the category
     * - Calculates % change from first to latest
     * 
     * Returns null if no data exists for the period (displays as "N/A")
     * 
     * @see PERCENTAGE_CALCULATIONS.md for detailed documentation and examples
     */
    const calculatePercentageChange = (categoryData, latestValue, periodDays) => {
      if (!categoryData || categoryData.length === 0 || latestValue == null || isNaN(latestValue)) {
        return null
      }

      if (periodDays === 'max') {
        // Max: from first available date to latest
        const firstValue = categoryData[categoryData.length - 1]?.[metric]
        if (firstValue == null || isNaN(firstValue)) return null
        return ((latestValue - firstValue) / firstValue) * 100
      }

      // Find the latest date across all data to determine target date
      const allValidData = data
        .filter(row => row[metric] != null && !isNaN(row[metric]))
        .sort((a, b) => new Date(b.date) - new Date(a.date))

      if (allValidData.length === 0) return null

      const latestDate = new Date(allValidData[0].date)
      const targetDate = new Date(latestDate)
      targetDate.setDate(targetDate.getDate() - periodDays)

      const periodValue = findValueAtDate(categoryData, targetDate)
      if (periodValue == null || isNaN(periodValue)) {
        return null
      }

      return ((latestValue - periodValue) / periodValue) * 100
    }

    // Calculate latest values and percentage changes for each category
    const rows = categories.map(category => {
      const categoryData = data
        .filter(row => row.category === category)
        .sort((a, b) => new Date(b.date) - new Date(a.date))

      if (categoryData.length === 0) return null

      const latest = categoryData[0]

      // Get latest value, CPI, and price_usd
      const latestMetric = latest[metric]
      const latestCPI = latest.value
      const latestPrice = latest.price_usd

      // Get sorted category data for calculations
      const categoryDataSorted = categoryData
        .filter(row => row[metric] != null && !isNaN(row[metric]))
        .sort((a, b) => new Date(b.date) - new Date(a.date))

      // Calculate percentage changes
      const pct7d = calculatePercentageChange(categoryDataSorted, latestMetric, 7)
      const pct1m = calculatePercentageChange(categoryDataSorted, latestMetric, 30)
      const pct3m = calculatePercentageChange(categoryDataSorted, latestMetric, 90)
      const pct6m = calculatePercentageChange(categoryDataSorted, latestMetric, 180)
      const pct9m = calculatePercentageChange(categoryDataSorted, latestMetric, 270)
      const pct1y = calculatePercentageChange(categoryDataSorted, latestMetric, 365)
      const pct5y = calculatePercentageChange(categoryDataSorted, latestMetric, 1825)
      const pctMax = calculatePercentageChange(categoryDataSorted, latestMetric, 'max')

      return {
        category,
        cpi: latestCPI,
        priceUsd: latestPrice,
        zcpi: latestMetric,
        pct7d,
        pct1m,
        pct3m,
        pct6m,
        pct9m,
        pct1y,
        pct5y,
        pctMax,
        color: colorMap[category],
      }
    }).filter(row => row !== null)

    return rows
  }, [data, metric])

  const formatPercentage = (value) => {
    if (value == null || isNaN(value)) return 'N/A'
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  const getPercentageColor = (value) => {
    if (value == null || isNaN(value)) return 'text-gray-500'
    return value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 overflow-x-auto border border-gray-100 dark:border-gray-700 transition-all duration-300">
      <div className="animate-fade-in">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <th className="text-left p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">Category</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">CPI</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">ZEC/USD</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">ZCPI</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">7d</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">1m</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">3m</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">6m</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">9m</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">1y</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">5y</th>
              <th className="text-right p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">Max</th>
              <th className="text-center p-4 font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wider">Line</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={row.category}
                onClick={() => onRowClick(row.category)}
                className={`
                  border-b border-gray-100 dark:border-gray-700/50
                  hover:bg-blue-50/50 dark:hover:bg-blue-900/10
                  cursor-pointer transition-all duration-200
                  transform hover:scale-[1.01]
                  ${highlightedCategory === row.category 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 shadow-md border-l-4 border-l-blue-500' 
                    : ''
                  }
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
              <td className="p-4 font-semibold text-gray-900 dark:text-gray-100 transition-colors">
                {row.category}
              </td>
              <td className="p-4 text-right text-gray-700 dark:text-gray-300 font-mono">
                {row.cpi != null ? row.cpi.toFixed(2) : <span className="text-gray-400">N/A</span>}
              </td>
              <td className="p-4 text-right text-gray-700 dark:text-gray-300 font-mono">
                {row.priceUsd != null ? `$${row.priceUsd.toFixed(2)}` : <span className="text-gray-400">N/A</span>}
              </td>
              <td className="p-4 text-right text-gray-900 dark:text-gray-100 font-bold font-mono">
                {row.zcpi != null ? row.zcpi.toFixed(4) : <span className="text-gray-400">N/A</span>}
              </td>
              <td className={`p-4 text-right font-semibold font-mono transition-colors ${getPercentageColor(row.pct7d)}`}>
                {formatPercentage(row.pct7d)}
              </td>
              <td className={`p-4 text-right font-semibold font-mono transition-colors ${getPercentageColor(row.pct1m)}`}>
                {formatPercentage(row.pct1m)}
              </td>
              <td className={`p-4 text-right font-semibold font-mono transition-colors ${getPercentageColor(row.pct3m)}`}>
                {formatPercentage(row.pct3m)}
              </td>
              <td className={`p-4 text-right font-semibold font-mono transition-colors ${getPercentageColor(row.pct6m)}`}>
                {formatPercentage(row.pct6m)}
              </td>
              <td className={`p-4 text-right font-semibold font-mono transition-colors ${getPercentageColor(row.pct9m)}`}>
                {formatPercentage(row.pct9m)}
              </td>
              <td className={`p-4 text-right font-semibold font-mono transition-colors ${getPercentageColor(row.pct1y)}`}>
                {formatPercentage(row.pct1y)}
              </td>
              <td className={`p-4 text-right font-semibold font-mono transition-colors ${getPercentageColor(row.pct5y)}`}>
                {formatPercentage(row.pct5y)}
              </td>
              <td className={`p-4 text-right font-semibold font-mono transition-colors ${getPercentageColor(row.pctMax)}`}>
                {formatPercentage(row.pctMax)}
              </td>
              <td className="p-4 text-center">
                <div
                  className="w-5 h-5 rounded-full mx-auto shadow-md transition-all duration-200 hover:scale-125 hover:shadow-lg"
                  style={{ backgroundColor: row.color }}
                  title={row.category}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default SummaryTable

