/**
 * Quick Supabase connection test
 * Run this with: node test-supabase.js
 * 
 * Make sure you have a .env file with:
 * VITE_SUPABASE_URL=your-url
 * VITE_SUPABASE_ANON_KEY=your-key
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Note: This uses dotenv for Node.js. For browser, use import.meta.env
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Key:', supabaseAnonKey ? '✅ Set (length: ' + supabaseAnonKey.length + ')' : '❌ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  try {
    // Test 1: Simple query
    console.log('\n1. Testing basic query...')
    const { data, error, count } = await supabase
      .from('zcpi_data')
      .select('*', { count: 'exact' })
      .limit(5)

    if (error) {
      console.error('❌ Error:', error)
      console.error('Error Code:', error.code)
      console.error('Error Message:', error.message)
      console.error('Error Details:', error.details)
      console.error('Error Hint:', error.hint)
      
      if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('RLS')) {
        console.error('\n⚠️  This looks like a Row Level Security (RLS) issue!')
        console.error('Solution: Check RLS policies in your Supabase dashboard.')
      }
    } else {
      console.log('✅ Query successful!')
      console.log('Data count:', data?.length || 0)
      console.log('Total rows in table:', count)
      
      if (data && data.length > 0) {
        console.log('\nSample row:', JSON.stringify(data[0], null, 2))
        console.log('\n✅ Data found! Your Supabase connection is working.')
      } else {
        console.log('\n⚠️  No data returned. Table may be empty.')
        console.log('Run: python scripts/upload_supabase.py')
      }
    }

    // Test 2: Check table exists
    console.log('\n2. Checking table structure...')
    if (data && data.length > 0) {
      const firstRow = data[0]
      const expectedColumns = ['series_id', 'year', 'periodName', 'value', 'date', 'category', 'price_usd', 'zcpi_value', 'zcpi_norm']
      const actualColumns = Object.keys(firstRow)
      
      console.log('Expected columns:', expectedColumns)
      console.log('Actual columns:', actualColumns)
      
      const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col))
      if (missingColumns.length > 0) {
        console.warn('⚠️  Missing columns:', missingColumns)
      } else {
        console.log('✅ All expected columns present')
      }
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

test()

