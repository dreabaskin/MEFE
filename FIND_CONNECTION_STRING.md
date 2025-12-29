# How to Find Your Supabase Connection String

## Step-by-Step Visual Guide

### Step 1: Open Your Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Log in if needed
3. You should see your project "ulzykrzlkahzxwyfyete" in the list
4. **Click on your project** to open it

### Step 2: Navigate to Settings
1. Look at the **left sidebar** (menu on the left side)
2. Find the **⚙️ Settings** icon (gear/cog icon) - it's usually near the bottom
3. **Click on "Settings"**

### Step 3: Go to Database Settings
1. In the Settings page, you'll see a menu on the left with options like:
   - General
   - API
   - **Database** ← Click this one!
   - Auth
   - Storage
   - etc.
2. **Click on "Database"**

### Step 4: Find Connection String
1. Scroll down on the Database settings page
2. Look for a section called **"Connection string"** or **"Connection pooling"**
3. You'll see tabs like: **"URI"**, "JDBC", "Golang", etc.
4. **Click on the "URI" tab**
5. You'll see a connection string that looks like one of these:

   **Option A (Direct connection):**
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.ulzykrzlkahzxwyfyete.supabase.co:5432/postgres
   ```

   **Option B (Pooler connection - more common):**
   ```
   postgresql://postgres.ulzykrzlkahzxwyfyete:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

### Step 5: Copy the Connection String
1. Click the **copy button** (📋 icon) next to the connection string
2. Or select all the text and copy it
3. **Important**: The connection string will have `[YOUR-PASSWORD]` in it - that's normal, Supabase shows it that way for security

## Alternative: If You Can't Find It

If you still can't find it, try this:

1. In your Supabase dashboard, look for **"Project Settings"** or **"API Settings"**
2. Or try going directly to: `https://supabase.com/dashboard/project/ulzykrzlkahzxwyfyete/settings/database`
3. Look for any section about "Database" or "Connection"

## What to Look For

The connection string section might be labeled as:
- "Connection string"
- "Connection pooling" 
- "Database URL"
- "Connection info"
- "Connection parameters"

## Still Stuck?

If you're still having trouble, you can also:
1. Tell me what you see in the Settings → Database page
2. Or I can help you try a different approach to set up the connection




