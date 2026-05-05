## Quick Reference - Admin & User Role System

### What Changed?

#### Before
- Single dashboard for all users
- Payment config accessible by everyone
- No role separation

#### After
- **Admin Dashboard** (`/admin`)
  - Setup payment gateway
  - Manage user roles
  
- **User Dashboard** (`/dashboard`)
  - Manage products & orders
  - Can only see payment info (read-only)

---

## Key Files

| File | Change | Reason |
|------|--------|--------|
| `types/index.ts` | Added `role` field | Track user type |
| `middleware.ts` | Check role for `/admin/*` | Block non-admin users |
| `lib/auth.ts` | Include role in session | Store role in cookie |
| `actions/auth.actions.ts` | Pass role on login | Redirect based on role |
| `components/dashboard/Sidebar.tsx` | Removed admin link | Hide payment config from users |
| `components/admin/AdminSidebar.tsx` | **NEW** | Admin-specific sidebar |
| `app/admin/users/page.tsx` | **NEW** | User management page |
| `app/api/admin/users/route.ts` | **NEW** | User role API |

---

## User Flows

### Register New Account
```
User fills form → Backend sets role='user' → Redirect to /dashboard
```

### Login as User
```
Email + Password → Role=user check → /dashboard
```

### Login as Admin
```
Email + Password → Role=admin check → /admin/settings
```

### Promote User to Admin
```
Admin clicks "Make Admin" on user → API updates role='admin' 
→ User now access /admin/*
```

---

## Testing Quick Commands

```bash
# Check if dev server is running
curl http://localhost:3001

# Check if middleware is working
# Try accessing /admin while logged in as user → should redirect

# Check admin endpoints
curl -X GET http://localhost:3001/api/admin/users \
  -H "Cookie: session=..." # Should return user list or 401
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Page not found" at /admin | Not logged in or not admin → login |
| User can't see admin panel | Role is 'user', not 'admin' → promote them |
| Admin can't see user list | Session might be invalid → re-login |
| Payment settings not showing | Check user settings → should show "managed by admin" |
| Error 403 on /api/admin/users | User making request not admin → check session |

---

## Session Format

Stored in `SESSION_COOKIE_NAME` cookie:

```
Base64 encoded:
{
  "userId": "1234567890-abc",
  "role": "admin" or "user",
  "exp": 1234567890000
}
```

---

## Next Actions

1. **Setup First Admin** (if needed)
   - Edit database or create setup script
   
2. **Test All Flows**
   - Register user → Login → See dashboard
   - Register admin → Login → See /admin
   - Promote user → Re-login → Access admin
   
3. **Deploy**
   - Push to production
   - Monitor login/redirect behavior
   - Check admin access controls

---

## Support

For issues or questions, refer to:
- `FINAL_SETUP_SUMMARY.md` - Complete documentation
- `ROLE_SYSTEM.md` - Role system details
- `ADMIN_DASHBOARD_SETUP.md` - Admin features
- `IMPLEMENTATION_ROLE_SYSTEM.md` - Implementation details
