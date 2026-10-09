import { NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { getPodcasts } from '@/lib/data'

export async function GET() {
  const perm = await requirePermission('podcasts.manage')
  if (isErrorResponse(perm)) return perm

  const podcasts = await getPodcasts()
  return NextResponse.json({ podcasts, total: podcasts.length })
}
