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
    const { articleId, content, parentId } = body

    if (!articleId || !content) {
      return NextResponse.json({ error: 'Article ID and content required' }, { status: 400 })
    }

    const comment = await db.comment.create({
      data: {
        articleId,
        userId: user.id,
        content,
        parentId,
        status: 'approved',
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 })
    }

    const db = await getPrisma()
    if (!db) {
      return NextResponse.json([])
    }

    const comments = await db.comment.findMany({
      where: {
        articleId,
        parentId: null,
        status: 'approved',
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        replies: {
          where: { status: 'approved' },
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ error: 'Failed to get comments' }, { status: 500 })
  }
}
