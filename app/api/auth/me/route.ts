import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()
    
    if (!user) {
      // Return 401 silently - this is expected when user is not logged in
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch {
    // Return 401 on any error to trigger login redirect
    return NextResponse.json({ error: 'Session error' }, { status: 401 })
  }
}
