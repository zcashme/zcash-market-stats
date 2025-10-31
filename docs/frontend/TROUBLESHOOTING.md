# Troubleshooting Guide

## "No Data Available" Error

If you see "No Data Available" in the dashboard, check the following:

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and check the Console tab. Look for:
- `Supabase Response:` log - shows what data (if any) was returned
- Any error messages from Supabase

### 2. Verify Supabase Connection

**Check `.env` file exists in `frontend/` directory:**
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Verify values:**
- URL should look like: `https://xxxxxxxxxxxxx.supabase.co`
- Anon key should be a long string starting with `eyJ...`

### 3. Verify Data Has Been Uploaded

Run the Python upload script to ensure data is in Supabase:
```bash
cd scripts
python upload_supabase.py
```

You should see:
```
✅ Uploaded X rows
🎉 Upload complete — ZCPI data is now live in Supabase!
```

### 4. Check Supabase Table

In your Supabase dashboard:
1. Go to Table Editor
2. Select `zcpi_data` table
3. Verify it contains rows
4. Check that columns match:
   - `series_id`, `year`, `periodName`, `value`, `date`, `category`, `price_usd`, `zcpi_value`, `zcpi_norm`

### 5. Check Row Level Security (RLS)

If RLS is enabled on the `zcpi_data` table:
1. Go to Authentication > Policies in Supabase
2. Ensure there's a policy allowing SELECT operations for anonymous users
3. Or temporarily disable RLS for testing (enable it back for production)

**Quick RLS Policy (if needed):**
```sql
CREATE POLICY "Allow anonymous read access"
ON zcpi_data FOR SELECT
USING (true);
```

### 6. Verify Table Name

Ensure the table name in Supabase exactly matches: `zcpi_data` (case-sensitive)

### 7. Check Date Format

The upload script converts dates from `YYYY-MM` to `YYYY-MM-DD` format. Verify in Supabase that dates look like: `2024-11-01` not `2024-11`.

### 8. Network Issues

- Check browser console for CORS errors
- Verify Supabase URL is correct
- Ensure you're using the **anon/public** key, not the service role key

## Common Error Messages

### "Missing Supabase environment variables"
- Solution: Create `.env` file with correct variables

### "Failed to fetch data from Supabase"
- Check Supabase URL and key
- Verify table exists
- Check RLS policies
- Look at browser console for detailed error

### Empty response but no error
- Data may not be uploaded yet
- RLS policies may be blocking access
- Table may be empty


