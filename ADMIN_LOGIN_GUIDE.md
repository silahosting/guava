# Admin Login Guide - SewaBot System

## Cara Setup & Login Admin

### Step 1: Akses Halaman Init Admin
Buka URL berikut di browser:
```
http://localhost:3000/admin/init
```

### Step 2: Buat Admin User
Klik tombol "Buat Admin User" untuk membuat akun admin pertama.

### Step 3: Salin Kredensial
Setelah berhasil, sistem akan menampilkan kredensial login:

**Email:** 
```
admin@sewa.app
```

**Password:** 
```
Admin@123456
```

> ⚠️ **PENTING:** Harap ubah password ini setelah login pertama kali untuk keamanan!

### Step 4: Login ke Admin Panel
1. Buka halaman login: `http://localhost:3000/login`
2. Masukkan email: `admin@sewa.app`
3. Masukkan password: `Admin@123456`
4. Klik "Login"

### Step 5: Akses Admin Dashboard
Setelah login, Anda akan otomatis di-redirect ke `/admin/settings`.

Admin dashboard memiliki 3 menu utama:
- **Payment Config** - Setup Orkut QRIS atau Midtrans
- **Kelola User** - Manage user roles (convert user menjadi admin)
- **Dashboard Toko** - Back to user dashboard

---

## Admin Dashboard Features

### 1. Payment Configuration (`/admin/settings`)

Pilih provider pembayaran:

#### Orkut QRIS
Setup fields:
- **Username** - Username akun Orkut
- **API Key** - API Key dari Orkut
- **Token** - Token Orkut
- **Merchant ID** - ID merchant Orkut
- **QRIS Code** - Kode QRIS statis

#### Midtrans
Setup fields:
- **Client Key** - Public key dari Midtrans
- **Server Key** - Secret key dari Midtrans
- **Merchant ID** - Merchant ID dari Midtrans

### 2. User Management (`/admin/users`)

- Lihat semua user terdaftar
- Ubah role user dari "user" menjadi "admin" atau sebaliknya
- Monitor email dan tanggal pendaftaran

---

## Neo-Style UI

Dashboard admin sudah menggunakan Neo-style components:
- NeoButton - Tombol dengan style modern
- NeoCard - Card container
- NeoBadge - Badge/label
- NeoInput - Input field
- AdminSidebar - Sidebar dengan gradient dan transisi smooth

---

## Security Notes

1. **Password Default**: `Admin@123456` harus diganti setelah login pertama
2. **Admin Only**: Hanya user dengan role 'admin' bisa akses `/admin/*`
3. **Middleware Protection**: Jika user biasa coba akses `/admin`, akan di-redirect ke `/dashboard`
4. **Credentials**: Jangan share credentials default dengan siapapun

---

## Troubleshooting

### Admin page tidak bisa di-akses
- Pastikan Anda login dengan akun admin
- Cek di `/admin/users` apakah role Anda adalah 'admin'

### Admin user sudah ada
Jika error "Admin user sudah ada" saat membuat:
- Admin user sudah pernah dibuat sebelumnya
- Gunakan email `admin@sewa.app` untuk login

### Lupa password admin
- Edit database atau buat user baru dengan role admin via database
- Atau reset database dan buat admin baru

---

## User Flow

```
1. User Register → Role: 'user' (default)
   ↓
2. User Login → Redirect ke /dashboard
   ├─ Lihat produk
   ├─ Lihat pesanan
   └─ Tidak bisa akses /admin

3. Admin Login → Redirect ke /admin/settings
   ├─ Setup payment gateway
   ├─ Manage users
   └─ Bisa berpindah ke /dashboard jika ingin
```

---

## Admin Sidebar Menu

- 🏠 **Dashboard Toko** - Kembali ke user dashboard
- ⚙️ **Payment Config** - Konfigurasi Orkut/Midtrans
- 👥 **Kelola User** - User management
- 🚪 **Logout** - Keluar dari sistem

---

## Setting Payment untuk User

Setelah admin setup payment gateway:
1. User akan melihat info "Payment method tersedia"
2. Saat checkout, user pilih metode pembayaran (Orkut/Midtrans)
3. User tidak perlu setup apapun - hanya pilih

---

Semua sudah siap! Akses `/admin/init` untuk membuat admin user pertama. 🚀
