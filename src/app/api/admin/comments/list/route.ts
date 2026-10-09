import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { getAdminComments } from '@/lib/data'

export async function GET(request: NextRequest) {
  const perm = await requirePermission('comments.moderate')
  if (isErrorResponse(perm)) return perm

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined

  const comments = await getAdminComments(status || undefined)
  return NextResponse.json({ comments, total: comments.length })
}
