import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { createEditor, updateUser, deleteUser } from '@/lib/content-service'

export async function POST(request: NextRequest) {
  const perm = await requirePermission('users.manage')
  if (isErrorResponse(perm)) return perm

  try {
    const body = await request.json()
    const result = await createEditor({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || 'JOURNALIST',
      jobTitle: body.jobTitle,
      bio: body.bio,
    })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, id: result.id, demo: result.mock })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const perm = await requirePermission('users.manage')
  if (isErrorResponse(perm)) return perm

  try {
    const body = await request.json()
    const { id, password, ...data } = body
    if (!id) return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })

    if (id === perm.user.id && data.role && data.role !== perm.user.role) {
      return NextResponse.json({ error: 'لا يمكنك تغيير دورك الخاص' }, { status: 400 })
    }

    const result = await updateUser(id, { ...data, password })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, demo: result.mock })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const perm = await requirePermission('users.manage')
  if (isErrorResponse(perm)) return perm

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
  if (id === perm.user.id) return NextResponse.json({ error: 'لا يمكنك حذف حسابك الخاص' }, { status: 400 })

  const result = await deleteUser(id)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ success: true, demo: result.mock })
}
