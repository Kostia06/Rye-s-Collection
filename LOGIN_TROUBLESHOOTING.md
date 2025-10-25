# Login Troubleshooting Guide

If you can't login, follow these steps to fix it:

## Step 1: Check the Error Message

1. Open your browser's Developer Console (Press F12 or Right-click → Inspect → Console tab)
2. Try to login
3. Look at the error message that appears - it will tell you what's wrong

Common error messages and solutions:

### Error: "Invalid login credentials"
**Problem**: User doesn't exist in Supabase or wrong password
**Solution**: Create the user in Supabase (see Step 2)

### Error: "Email not confirmed"
**Problem**: Supabase requires email confirmation
**Solution**: Disable email confirmation (see Step 3)

### Error: "Failed to fetch" or network error
**Problem**: Supabase URL or key is wrong, or project doesn't exist
**Solution**: Check your .env.local file (see Step 4)

## Step 2: Create Admin User in Supabase

**You MUST create a user before you can login!**

1. Go to: https://supabase.com/dashboard/project/hzstztezlvzfqyrxllua/auth/users

2. Click **"Add user"** → **"Create new user"**

3. Fill in the form:
   - Email: `admin@example.com`
   - Password: `MyCollection2024!`
   - **IMPORTANT**: Click "Auto Confirm User" checkbox ✓

4. Click **"Create user"**

5. Verify the user appears in the users list

Now try logging in again!

## Step 3: Disable Email Confirmation (Recommended)

To make login easier during development:

1. Go to: https://supabase.com/dashboard/project/hzstztezlvzfqyrxllua/auth/providers

2. Scroll down to **"Email"** provider settings

3. Look for **"Confirm email"** toggle

4. Turn it **OFF** (disable)

5. Click **"Save"**

Now users don't need to confirm their email!

## Step 4: Verify Supabase Configuration

Check your `.env.local` file has the correct credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hzstztezlvzfqyrxllua.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=MyCollection2024!
```

To find your keys:
1. Go to: https://supabase.com/dashboard/project/hzstztezlvzfqyrxllua/settings/api
2. Copy the "Project URL" and "anon public" key
3. Update `.env.local` if different
4. Restart your dev server: `npm run dev`

## Step 5: Check Database Setup

If you still can't login, make sure you've run the database setup:

1. Go to: https://supabase.com/dashboard/project/hzstztezlvzfqyrxllua/sql/new

2. Verify the `collections` table exists

If not, run the SQL from `SUPABASE_SETUP.md`

## Step 6: Test with Console

Open browser console and test Supabase connection:

```javascript
// In browser console on localhost:3000
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  'https://hzstztezlvzfqyrxllua.supabase.co',
  'your-anon-key-here'
);

// Test sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@example.com',
  password: 'MyCollection2024!'
});

console.log('Result:', { data, error });
```

This will show you the exact error!

## Quick Checklist

Before you can login, make sure:

- [ ] Created user in Supabase Authentication
- [ ] Email matches `.env.local` (`admin@example.com`)
- [ ] Password matches `.env.local` (`MyCollection2024!`)
- [ ] Auto-confirmed user OR disabled email confirmation
- [ ] Supabase URL and key are correct in `.env.local`
- [ ] Dev server restarted after changing `.env.local`
- [ ] No typos in email or password

## Most Common Issues

### Issue 1: User Not Created
**90% of login problems are this!**

You MUST manually create the user in Supabase dashboard first. The website cannot create users - only Supabase can.

### Issue 2: Email Confirmation Required
When you create the user, make sure to check "Auto Confirm User" or disable email confirmation in settings.

### Issue 3: Wrong Credentials
Double-check the email and password match exactly between:
- `.env.local` file
- Supabase user you created
- Login form

## Still Not Working?

1. Check browser console for error messages
2. Check Supabase dashboard → Authentication → Logs
3. Verify your Supabase project is active
4. Try creating a new user with a different email

## Need to Change Credentials?

If you want to use different credentials:

1. Edit `.env.local`:
```bash
NEXT_PUBLIC_ADMIN_EMAIL=newemail@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=NewPassword123!
```

2. Create new user in Supabase with these credentials

3. Restart dev server: `npm run dev`

4. Login with new credentials

---

**Most Important**: You MUST create the user in Supabase before you can login! The app cannot create users automatically.
