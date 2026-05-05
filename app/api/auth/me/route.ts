import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('[v0] Auth me error:', error)
    // Return 401 on any error to trigger login redirect
    return NextResponse.json({ error: 'Session error' }, { status: 401 })
  }
}
