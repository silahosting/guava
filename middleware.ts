import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/lib/constants'

const protectedRoutes = ['/dashboard']
const authRoutes = ['/login', '/register']

// Lightweight check that the cookie value at least looks like a valid session token.
// We can't fully verify it here (edge runtime, no DB) but we can spot obviously
// corrupt cookies and prevent infinite redirect loops.
function isSessionTokenShapeValid(token: string | undefined): boolean {
  if (!token) return false
  try {
    // Decode base64 (atob is available in edge runtime)
    const decoded = atob(token)
    const session = JSON.parse(decoded)
    return (
      typeof session === 'object' &&
      session !== null &&
      typeof session.userId === 'string' &&
      typeof session.exp === 'number' &&
      session.exp > Date.now()
    )
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
  const hasValidSession = isSessionTokenShapeValid(sessionCookie?.value)
  const { pathname } = request.nextUrl

  // Check if accessing protected routes without a valid session
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!hasValidSession) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      // Clear the bad cookie so we don't loop
      if (sessionCookie) {
        response.cookies.delete(SESSION_COOKIE_NAME)
      }
      return response
    }
  }

  // Check if accessing auth routes with a valid session
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (hasValidSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // If cookie exists but is invalid, clear it so user can log in again
    if (sessionCookie && !hasValidSession) {
      const response = NextResponse.next()
      response.cookies.delete(SESSION_COOKIE_NAME)
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
