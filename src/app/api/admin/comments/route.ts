import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { moderateComment, removeComment } from '@/lib/content-service'

export async function PATCH(request: NextRequest) {
  const perm = await requirePermission('comments.moderate')
  if (isErrorResponse(perm)) return perm

  try {
    const body = await request.json()
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'معرف التعليق والحالة مطلوبان' }, { status: 400 })
    }
    const result = await moderateComment(body.id, body.status)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, demo: result.mock })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const perm = await requirePermission('comments.moderate')
  if (isErrorResponse(perm)) return perm

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'معرف التعليق مطلوب' }, { status: 400 })

  const result = await removeComment(id)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ success: true, demo: result.mock })
}
