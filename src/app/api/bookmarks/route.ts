import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPrisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getPrisma()
    if (!db) {
      return NextResponse.json({ error: 'الخدمة غير متاحة حالياً' }, { status: 503 })
    }

    const body = await request.json()
    const { articleId } = body

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 })
    }

    const existing = await db.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
    })

    if (existing) {
      await db.bookmark.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({ bookmarked: false })
    } else {
      await db.bookmark.create({
        data: {
          userId: user.id,
          articleId,
        },
      })
      return NextResponse.json({ bookmarked: true })
    }
  } catch (error) {
    console.error('Bookmark error:', error)
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getPrisma()
    if (!db) {
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const bookmarks = await db.bookmark.findMany({
      where: { userId: user.id },
      include: {
        article: {
          include: {
            translations: true,
            category: {
              include: { translations: true },
            },
            author: true,
            media: {
              include: { media: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error('Get bookmarks error:', error)
    return NextResponse.json({ error: 'Failed to get bookmarks' }, { status: 500 })
  }
}
