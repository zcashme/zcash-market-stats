import React, { useState, useEffect } from 'react'
import ZcpiChart from './ZcpiChart'
import SummaryTable from './SummaryTable'
import { supabase } from './supabaseClient'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [metric, setMetric] = useState('zcpi_value')
  const [highlightedCategory, setHighlightedCategory] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // First, test connection with a simple query
        console.log('Testing Supabase connection...')
        const { data: testData, error: testError } = await supabase
          .from('zcpi_data')
          .select('id', { count: 'exact' })
          .limit(1)
        
        console.log('Connection test:', { testData, testError, hasData: !!testData })

        // Fetch all data from Supabase
        const { data: rawData, error: fetchError, count } = await supabase
          .from('zcpi_data')
          .select('*', { count: 'exact' })
          .order('date', { ascending: true })

        console.log('Supabase Response - Full Object:', {
          data: rawData,
          dataCount: rawData?.length || 0,
          error: fetchError,
          errorCode: fetchError?.code,
          errorMessage: fetchError?.message,
          errorDetails: fetchError?.details,
          errorHint: fetchError?.hint,
          sampleRow: rawData?.[0],
          count: count
        })
        console.log('Raw response type:', typeof rawData, Array.isArray(rawData))

        if (fetchError) {
          console.error('Supabase Error Details:', fetchError)
          throw fetchError
        }

        if (!rawData || rawData.length === 0) {
          console.warn('No data returned from Supabase. Table may be empty or there may be a permissions issue.')
          setData([])
          setLoading(false)
          return
        }

        // Determine metric dynamically (same logic as ZcpiChart)
        const hasNormData = rawData.some(row => 
          row.zcpi_norm !== null && row.zcpi_norm !== undefined && !isNaN(row.zcpi_norm)
        )
        const selectedMetric = hasNormData ? 'zcpi_norm' : 'zcpi_value'
        setMetric(selectedMetric)

        setData(rawData)
      } catch (err) {
        console.error('Error fetching data:', err)
        // Provide more detailed error information
        const errorMessage = err.message || err.error_description || err.details || 'Failed to fetch data from Supabase'
        console.error('Full error object:', err)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRowClick = (category) => {
    // Toggle: if same category clicked, deselect it
    setHighlightedCategory(prev => prev === category ? null : category)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 dark:border-blue-900 mx-auto mb-6"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 absolute top-0 left-1/2 -translate-x-1/2"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xl font-semibold animate-pulse">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 dark:text-red-400 font-semibold text-xl mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <p className="text-sm text-red-500 dark:text-red-400">
            Please check your Supabase connection settings in the .env file.
          </p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center max-w-md">
          <h2 className="text-gray-700 dark:text-gray-300 font-semibold text-xl mb-2">No Data Available</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The dashboard is ready, but no data was found in Supabase. Please ensure data has been uploaded.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center animate-fade-in-down">
          <div className="inline-block mb-4">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 animate-gradient">
              ZCPI Dashboard
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 font-medium">
            Zcash Consumer Price Index — Purchasing Power of 1 ZEC Over Time
          </p>
          {highlightedCategory && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-300 dark:border-blue-700 animate-fade-in">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Showing: <strong className="font-bold">{highlightedCategory}</strong>
              </span>
              <button
                onClick={() => setHighlightedCategory(null)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                title="Clear selection"
              >
                ✕
              </button>
            </div>
          )}
        </header>

        <ZcpiChart 
          data={data}
          metric={metric}
          highlightedCategory={highlightedCategory}
          onCategoryClick={handleRowClick}
        />

        <SummaryTable 
          data={data}
          metric={metric}
          onRowClick={handleRowClick}
          highlightedCategory={highlightedCategory}
        />

        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
          <p className="opacity-70">Data sourced from Supabase • Last updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  )
}

export default App
