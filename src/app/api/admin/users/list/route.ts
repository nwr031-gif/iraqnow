import { NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { getAuthors } from '@/lib/data'

export async function GET() {
  const perm = await requirePermission('users.manage')
  if (isErrorResponse(perm)) return perm

  const users = await getAuthors(true)
  return NextResponse.json({ users, total: users.length })
}
