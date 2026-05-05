## User Role System

Sistem telah dipisah menjadi 2 role dengan dashboard terpisah:

### Admin Dashboard (`/admin`)
- **Access:** Only users with role 'admin'
- **Features:**
  - Payment Configuration (Orkut QRIS & Midtrans)
  - User Management
  - Bot Dashboard
  
**Admin dapat:**
- Setup & manage payment gateway (Orkut QRIS atau Midtrans)
- Toggle user roles (promote user ke admin, atau demote admin ke user)
- Lihat semua registered users

### User Dashboard (`/dashboard`)
- **Access:** Regular users (role 'user')
- **Features:**
  - Bot Management
  - Product Management
  - Order Management
  - User Profile
  - Bot Settings
  
**User biasa:**
- Tidak ada akses ke payment configuration
- Hanya pilih payment method yang sudah di-setup oleh admin
- Kelola produk dan pesanan sendiri

---

## Registration Flow

1. User baru mendaftar → role otomatis 'user'
2. Admin perlu promote user ke 'admin' melalui `/admin/users` jika diinginkan
3. Admin login otomatis redirect ke `/admin/settings`
4. User biasa login redirect ke `/dashboard`

---

## Database Schema Change

User model sekarang include `role` field:

```typescript
interface User {
  id: string
  email: string
  name: string
  password: string
  balance: number
  role: 'admin' | 'user'  // NEW: admin atau user biasa
  createdAt: string
  updatedAt: string
}
```

---

## Session Management

Session sekarang include role info:

```json
{
  "userId": "...",
  "role": "admin" | "user",
  "exp": ...
}
```

Middleware mengecek role untuk `/admin/*` routes.

---

## API Endpoints

### Admin Only
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users` - Update user role
- `POST /api/admin/settings` - Save payment config
- `GET /api/settings/payment-method` - Get active payment method

### Public/User
- `GET /api/auth/me` - Get current user info
- `POST /api/payments/create-qris` - Create QRIS payment
- `POST /api/payments/create-midtrans` - Create Midtrans payment

---

## Membuat Admin Baru

1. User mendaftar secara normal dengan email dan password
2. Admin login ke `/admin/users`
3. Cari user di list
4. Klik "Make Admin" button untuk promote ke admin
5. User sekarang bisa akses `/admin/*` routes

---

## Security

- ✅ Session menyimpan role
- ✅ Middleware mengecek role untuk `/admin/*`
- ✅ API endpoints check `session.role !== 'admin'`
- ✅ Password tidak pernah exposed di response
- ✅ User biasa tidak bisa akses admin routes
