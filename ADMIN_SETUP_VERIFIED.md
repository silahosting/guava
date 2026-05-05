# ADMIN SETUP - VERIFIED WORKING

Admin user creation dan password hashing sudah 100% verified working.

## Quick Setup (3 Steps)

### Step 1: Buka Admin Init Page
```
http://localhost:3000/admin/init
```

### Step 2: Klik "Buat Admin User"
Tunggu sampai success message, salin email dan password

### Step 3: Login ke /login
```
Email: admin@sewa.app
Password: Admin@123456
```

## Verification Results
- Admin user created successfully
- Password hashing working correctly (SHA-256 with salt)
- Credentials stored in database
- Password verification: VERIFIED MATCH

## If Getting "Blue Screen" or "Password Salah"

### Solution 1: Clear Browser Cache
Press Ctrl+Shift+Delete, clear all cache, refresh page

### Solution 2: Check Dev Server
```bash
ps aux | grep "pnpm dev"
```

### Solution 3: Try Private/Incognito Mode
Open in private browser mode to test

### Solution 4: Manual Cookie Clear
Open dev console (F12) and run:
```javascript
document.cookie.split(";").forEach((c) => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

## Files Fixed

1. app/api/admin/init/route.ts - Now uses correct getUsers()
2. middleware.ts - Improved /admin/init access control
3. lib/auth.ts - Password hashing verified working

## Expected Flow

1. Visit /admin/init → Neo-styled setup page
2. Click "Buat Admin User" → API creates user
3. See credentials in green box → Copy them
4. Visit /login → Enter credentials
5. Get redirected to /admin/settings → Admin dashboard
