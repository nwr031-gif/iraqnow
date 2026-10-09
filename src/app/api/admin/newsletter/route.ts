import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { removeSubscriber } from '@/lib/content-service'
import { getSubscribers } from '@/lib/data'

export async function GET(request: NextRequest) {
  const perm = await requirePermission('newsletter.view')
  if (isErrorResponse(perm)) return perm

  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format')

  const subscribers = await getSubscribers()

  if (format === 'csv') {
    const csv = [
      'email,locale,active,subscribed_at',
      ...subscribers.map((s) => `${s.email},${s.locale},${s.active},${s.createdAt}`),
    ].join('\n')

    return new NextResponse('\uFEFF' + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  return NextResponse.json({ subscribers, total: subscribers.length })
}

export async function DELETE(request: NextRequest) {
  const perm = await requirePermission('newsletter.send')
  if (isErrorResponse(perm)) return perm

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'معرف المشترك مطلوب' }, { status: 400 })

  const result = await removeSubscriber(id)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ success: true, demo: result.mock })
}
