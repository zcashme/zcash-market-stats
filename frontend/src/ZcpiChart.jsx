import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { generateColorMap } from './utils/colors'

function ZcpiChart({ data, metric, highlightedCategory, onCategoryClick }) {
  const [plotData, setPlotData] = useState([])
  const [layout, setLayout] = useState({})

  useEffect(() => {
    if (!data || !metric || data.length === 0) return

    // Group data by category
    const categories = [...new Set(data.map(row => row.category))].sort()
    const colorMap = generateColorMap(categories)

    // Create traces for each category
    const traces = categories.map(category => {
      const categoryData = data
        .filter(row => row.category === category)
        .sort((a, b) => new Date(a.date) - new Date(b.date))

      const x = categoryData.map(row => row.date)
      const y = categoryData.map(row => row[metric]).filter(val => val != null && !isNaN(val))

      // Filter x to match valid y values
      const validX = categoryData
        .map((row, idx) => ({ date: row.date, val: row[metric] }))
        .filter(item => item.val != null && !isNaN(item.val))
        .map(item => item.date)

      const isSelected = category === highlightedCategory
      
      // If a category is selected, only show that category (hide others)
      const shouldShow = !highlightedCategory || isSelected

      return {
        x: validX,
        y,
        type: 'scatter',
        mode: 'lines',
        name: category,
        line: {
          color: colorMap[category],
          width: 3, // Same width for all lines
          shape: 'spline',
        },
        hovertemplate: `<b>${category}</b><br>` +
          `Date: %{x}<br>` +
          `${metric === 'zcpi_norm' ? 'ZCPI (Normalized)' : 'ZCPI Value'}: %{y:.4f}<extra></extra>`,
        opacity: shouldShow ? 1 : 0, // Hide instead of dimming
        visible: shouldShow,
      }
    })

    // If a category is selected, show only that category; otherwise show all
    const filteredTraces = highlightedCategory
      ? traces.filter(t => t.name === highlightedCategory)
      : traces

    setPlotData(filteredTraces)

    // Update layout
    const metricLabel = metric === 'zcpi_norm' 
      ? 'ZCPI (Normalized, Jan 2020 = 100)' 
      : 'ZCPI Value (ZEC/USD ÷ CPI)'

    setLayout({
      title: {
        text: 'ZCPI — Purchasing Power of 1 ZEC Over Time',
        x: 0.5,
        font: { family: 'Segoe UI', size: 18 },
      },
      xaxis: {
        title: 'Date',
        type: 'date',
        font: { family: 'Segoe UI', size: 14 },
      },
      yaxis: {
        title: metricLabel,
        font: { family: 'Segoe UI', size: 14 },
      },
      hovermode: 'x unified',
      template: 'plotly_white',
      legend: {
        title: { text: 'Category', font: { family: 'Segoe UI' } },
        orientation: 'v',
        x: 1.02,
        y: 1,
        font: { family: 'Segoe UI', size: 12 },
      },
      margin: { l: 50, r: 120, t: 80, b: 50 },
      font: { family: 'Segoe UI', size: 14 },
      autosize: true,
      responsive: true,
    })
  }, [data, metric, highlightedCategory])

  if (!data || !metric || data.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 mb-8 transition-all duration-300 hover:shadow-3xl border border-gray-100 dark:border-gray-700">
      <div className="animate-fade-in">
        <Plot
          data={plotData}
          layout={layout}
          config={{
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
            displaylogo: false,
          }}
          style={{ width: '100%', height: '600px' }}
        />
      </div>
      {highlightedCategory && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
            Showing only: <span className="font-semibold text-blue-600 dark:text-blue-400">{highlightedCategory}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default ZcpiChart
