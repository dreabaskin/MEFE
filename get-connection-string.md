# Get Your Supabase Connection String

## Quick Steps

1. **Go to your Supabase Dashboard**
   - URL: https://ulzykrzlkahzxwyfyete.supabase.co
   - Or go to https://supabase.com/dashboard and select your project

2. **Navigate to Database Settings**
   - Click the **Settings** icon (⚙️) in the left sidebar
   - Click **"Database"** in the settings menu

3. **Get the Connection String**
   - Scroll down to the **"Connection string"** section
   - Click on the **"URI"** tab (not "JDBC" or "Golang")
   - You'll see something like:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.ulzykrzlkahzxwyfyete.supabase.co:5432/postgres
     ```

4. **Copy the Connection String**
   - Click the copy button next to the connection string
   - **Important**: Make sure to replace `[YOUR-PASSWORD]` with your actual database password

5. **Paste it here** and I'll update your `.env` file automatically!

## Alternative: If you know your password

If you remember your database password, the connection string format is:
```
postgresql://postgres:YOUR_PASSWORD_HERE@db.ulzykrzlkahzxwyfyete.supabase.co:5432/postgres
```

Just replace `YOUR_PASSWORD_HERE` with your actual password.




