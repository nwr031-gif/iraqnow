import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { getAdminArticles } from '@/lib/data'

export async function GET(request: NextRequest) {
  const perm = await requirePermission('articles.view.own')
  if (isErrorResponse(perm)) return perm

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined

  const articles = await getAdminArticles(status || undefined)

  /* الصحفيون يرون مقالاتهم فقط */
  const filtered = perm.user.role === 'JOURNALIST'
    ? articles.filter((a) => a.authorId === perm.user.id)
    : articles

  return NextResponse.json({ articles: filtered, total: filtered.length })
}
