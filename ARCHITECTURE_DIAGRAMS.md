## System Architecture Diagram

### User Registration & Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER REGISTRATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Form: Email, Password, Name                                     │
│    ↓                                                              │
│  Backend: Hash password                                          │
│    ↓                                                              │
│  Create User with role = 'user'  [AUTO SET]                      │
│    ↓                                                              │
│  Create Session (userId, role='user')                            │
│    ↓                                                              │
│  Redirect to /dashboard                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      USER LOGIN                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Form: Email, Password                                           │
│    ↓                                                              │
│  Verify credentials                                              │
│    ↓                                                              │
│  Get user from DB → Check role                                  │
│    ↓                                                              │
│  ┌─────────────────┬──────────────────┐                         │
│  │ role='user'     │ role='admin'      │                         │
│  │ Create session  │ Create session    │                         │
│  │ redirect        │ redirect          │                         │
│  │ /dashboard      │ /admin/settings   │                         │
│  └─────────────────┴──────────────────┘                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard Access Control

```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         │
    Check session role
         │
    ┌────┴────┐
    │          │
role='user'   role='admin'
    │          │
    ▼          ▼
┌────────┐   ┌──────────┐
│ /dash  │   │  /admin  │
│ board  │   │          │
└────────┘   └──────────┘
    │          │
    │          ├─ settings/
    │          ├─ users/
    │          └─ Dashboard Toko
    │
    ├─ Dashboard
    ├─ Products
    ├─ Orders
    ├─ Profile
    └─ Settings (bot only)


MIDDLEWARE CHECK:
┌────────────────────────────────────┐
│  Request to /admin/* route?        │
├────────────────────────────────────┤
│  ├─ Yes: Check session role        │
│  │  ├─ role='admin' → Allow ✓      │
│  │  └─ role='user' → Redirect      │
│  │                to /dashboard     │
│  │                                  │
│  └─ No: Continue to route ✓         │
└────────────────────────────────────┘
```

### Role Promotion Flow

```
┌──────────────────────────────────────────────────────┐
│        ADMIN PROMOTES USER TO ADMIN                  │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Admin visits /admin/users                           │
│    ↓                                                  │
│  Sees list of all users                              │
│    ↓                                                  │
│  Find target user, click "Make Admin"                │
│    ↓                                                  │
│  API: PATCH /api/admin/users                         │
│  Body: { userId: "xxx", role: "admin" }              │
│    ↓                                                  │
│  Backend verifies admin role                         │
│    ↓                                                  │
│  Update user in database: role = 'admin'             │
│    ↓                                                  │
│  Return success                                      │
│    ↓                                                  │
│  Frontend updates UI                                 │
│    ↓                                                  │
│  User can now login to /admin/*                      │
│                                                       │
│  REVERSE (Demote):                                   │
│  "Remove Admin" → role = 'user'                      │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Payment Configuration Access

```
BEFORE (User could see everything):
┌─────────────────────────────────────┐
│    /dashboard/settings              │
│  ┌───────────────────────────────┐  │
│  │ Bot Settings                  │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Payment Config Forms          │  │ ← User could change!
│  │ (Orkut, Midtrans setup)       │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘

AFTER (Separated):
USER DASHBOARD:                    ADMIN DASHBOARD:
┌──────────────────┐              ┌──────────────────┐
│ /dashboard/      │              │ /admin/settings  │
│ settings         │              │                  │
├──────────────────┤              ├──────────────────┤
│ Bot Settings     │              │ Bot Dashboard    │
│                  │              │                  │
│ Payment Info:    │              │ Payment Config:  │
│ "Managed by      │              │ └─ Orkut Setup   │
│  admin"          │              │ └─ Midtrans      │
│ (Read-only)      │              │                  │
└──────────────────┘              │ User Management: │
                                   │ └─ List users    │
                                   │ └─ Toggle roles  │
                                   └──────────────────┘
```

### Session & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              REQUEST WITH AUTHENTICATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Browser sends request with SESSION_COOKIE                       │
│    ↓                                                              │
│  Server receives cookie                                          │
│    ↓                                                              │
│  Middleware checks route                                         │
│    ├─ Protected route? → Verify session exists ✓                │
│    └─ Admin route? → Verify role='admin' ✓                      │
│    ↓                                                              │
│  If checks pass → Execute handler ✓                              │
│    ↓                                                              │
│  API Handler (additional checks)                                 │
│    ├─ Call getSession() → returns user data + role              │
│    ├─ Check: role === 'admin'? → Yes: process, No: 403         │
│    ↓                                                              │
│  Return response (200 / 401 / 403)                               │
│                                                                   │
│  Session Cookie Content (Base64 encoded):                        │
│  ┌──────────────────────────────────────┐                       │
│  │ {                                    │                       │
│  │   "userId": "1234567890-abc",        │                       │
│  │   "role": "admin" | "user",          │                       │
│  │   "exp": 1234567890000               │                       │
│  │ }                                    │                       │
│  └──────────────────────────────────────┘                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### API Access Matrix

```
┌──────────────────────┬───────────┬──────────┐
│ Endpoint             │ Admin     │ User     │
├──────────────────────┼───────────┼──────────┤
│ /api/auth/me         │ ✓         │ ✓        │
│ /api/settings/*      │ ✓         │ ✓        │
│ /api/payments/*      │ ✓         │ ✓        │
│ /api/admin/users     │ ✓ (GET)   │ ✗        │
│ /api/admin/users     │ ✓ (PATCH) │ ✗        │
│ /api/admin/settings  │ ✓         │ ✗        │
│ /dashboard/*         │ ✗         │ ✓        │
│ /admin/*             │ ✓         │ ✗        │
└──────────────────────┴───────────┴──────────┘

Legend:
✓ = Allowed
✗ = Blocked/Redirect
```

### File Organization

```
PROJECT ROOT
├── types/
│   └── index.ts                          ← Added role field
│
├── lib/
│   ├── auth.ts                           ← Updated session (with role)
│   └── github-db.ts
│
├── middleware.ts                         ← Role checking
│
├── actions/
│   └── auth.actions.ts                   ← Pass role on login
│
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── profile/
│   │   │   └── settings/                 ← Updated (removed payment config)
│   │   └── ...
│   │
│   └── admin/                            ← NEW ADMIN SECTION
│       ├── layout.tsx                    ← Role check + AdminSidebar
│       ├── settings/
│       │   └── page.tsx                  ← Payment config
│       └── users/
│           └── page.tsx                  ← User management (NEW)
│
├── api/
│   ├── auth/
│   │   └── me/route.ts
│   ├── admin/
│   │   └── users/route.ts                ← NEW API
│   ├── payments/
│   └── settings/
│
├── components/
│   ├── dashboard/
│   │   └── Sidebar.tsx                   ← Removed admin link
│   └── admin/
│       └── AdminSidebar.tsx              ← NEW Sidebar (admin)
│
└── Documentation/
    ├── FINAL_SETUP_SUMMARY.md            ← Complete docs
    ├── ROLE_SYSTEM.md
    ├── QUICK_REFERENCE.md
    └── IMPLEMENTATION_ROLE_SYSTEM.md
```
