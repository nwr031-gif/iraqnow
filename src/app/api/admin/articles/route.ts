import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { createArticle, updateArticleFull, updateArticleStatus, deleteArticle } from '@/lib/content-service'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://iraqnow.pages.dev'

/** Ping IndexNow — فهرسة فورية في Bing وYandex عند النشر */
async function pingIndexNow(slug: string) {
  try {
    const urls = ['ar', 'ku', 'en'].map((l) => `${APP_URL}/${l}/article/${slug}`)
    urls.push(`${APP_URL}/ar`)
    await fetch(`${APP_URL}/api/indexnow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
      signal: AbortSignal.timeout(9000),
    })
  } catch { /* الفهرسة ليست حرجة */ }
}

export async function POST(request: NextRequest) {
  const perm = await requirePermission('articles.create')
  if (isErrorResponse(perm)) return perm

  try {
    const body = await request.json()
    const result = await createArticle({
      translations: body.translations,
      categorySlug: body.categorySlug,
      authorId: body.authorId || perm.user.id,
      status: body.status,
      breaking: body.breaking,
      featured: body.featured,
      image: body.image,
      governorateSlug: body.governorateSlug,
      tagSlugs: body.tagSlugs,
      readingTime: body.readingTime,
    })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, id: result.id, demo: result.mock })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const user = await requirePermission('articles.edit.any')
  if (isErrorResponse(user)) {
    const own = await requirePermission('articles.edit.own')
    if (isErrorResponse(own)) return own
    const body = await request.json()
    const result = await updateArticleFull(body.id, body.data || body)
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ success: true, demo: result.mock })
  }

  try {
    const body = await request.json()

    if (body.action === 'status' && body.id) {
      const result = await updateArticleStatus(body.id, body.status)
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
      /* فهرسة فورية عند النشر */
      if (body.status === 'PUBLISHED' && body.slug) {
        pingIndexNow(body.slug).catch(() => {})
      }
      return NextResponse.json({ success: true, demo: result.mock })
    }

    if (body.id) {
      const result = await updateArticleFull(body.id, body.data || body)
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
      /* فهرسة فورية عند التعديل والنشر */
      if ((body.data?.status || body.status) === 'PUBLISHED' && (body.data?.slug || body.slug)) {
        pingIndexNow(body.data?.slug || body.slug).catch(() => {})
      }
      return NextResponse.json({ success: true, demo: result.mock })
    }

    return NextResponse.json({ error: 'معرف المقال مطلوب' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const perm = await requirePermission('articles.delete')
  if (isErrorResponse(perm)) return perm

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'معرف المقال مطلوب' }, { status: 400 })

  const result = await deleteArticle(id)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json({ success: true, demo: result.mock })
}
