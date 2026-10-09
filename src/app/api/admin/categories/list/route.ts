import { NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { getCategories } from '@/lib/data'

export async function GET() {
  const perm = await requirePermission('categories.manage')
  if (isErrorResponse(perm)) return perm

  const categories = await getCategories()
  return NextResponse.json({ categories, total: categories.length })
}
