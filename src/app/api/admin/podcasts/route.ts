import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { createPodcastEpisode, updatePodcastFull, removePodcast } from '@/lib/content-service'

export async function POST(request: NextRequest) {
  const perm = await requirePermission('podcasts.manage')
  if (isErrorResponse(perm)) return perm

  try {
    const body = await request.json()
    const result = await createPodcastEpisode(body)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, id: result.id, demo: result.mock })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const perm = await requirePermission('podcasts.manage')
  if (isErrorResponse(perm)) return perm

  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: 'معرف الحلقة مطلوب' }, { status: 400 })
    const result = await updatePodcastFull(id, data)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, demo: result.mock })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const perm = await requirePermission('podcasts.manage')
  if (isErrorResponse(perm)) return perm

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'معرف الحلقة مطلوب' }, { status: 400 })

  const result = await removePodcast(id)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ success: true, demo: result.mock })
}
