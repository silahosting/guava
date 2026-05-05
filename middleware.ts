import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/lib/constants'

const protectedRoutes = ['/dashboard', '/admin']
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
  const { pathname } = request.nextUrl

  // Allow /admin/init without authentication (setup page)
  if (pathname === '/admin/init') {
    return NextResponse.next()
  }

  // Check if accessing protected routes without session
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Try to decode session to check role for admin routes
    try {
      const sessionToken = sessionCookie.value
      const session = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'))
      
      // Admin routes require admin role (except /admin/init which we already allowed above)
      if (pathname.startsWith('/admin') && pathname !== '/admin/init' && session.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      console.error('[Middleware] Error parsing session:', error)
      // If session parsing fails, redirect to login
      if (pathname.startsWith('/admin') && pathname !== '/admin/init') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }

  // Check if accessing auth routes with session
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
}
