import { NextRequest, NextResponse } from 'next/server'
import { getUsers, updateUser } from '@/lib/github-db'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const users = await getUsers()

    // Remove passwords from response
    const sanitizedUsers = users.map(({ password, ...user }) => user)

    return NextResponse.json({
      success: true,
      users: sanitizedUsers,
    })
  } catch (error) {
    console.error('[Admin Users GET] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { userId, role } = await request.json()

    if (!userId || !role || !['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid userId or role' },
        { status: 400 }
      )
    }

    const updatedUser = await updateUser(userId, { role })

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
    })
  } catch (error) {
    console.error('[Admin Users PATCH] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user' },
      { status: 500 }
    )
  }
}
