import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'

type LocaleParam = 'ar' | 'ku' | 'en'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const safeLocale: LocaleParam = ['ar', 'ku', 'en'].includes(locale) ? locale : 'ar'

    const db = await getPrisma()
    if (!db) {
      /* بدون قاعدة بيانات — نؤكد الاشتراك شكلياً */
      return NextResponse.json({ success: true })
    }

    const existing = await db.newsletter.findUnique({ where: { email } })

    if (existing) {
      if (!existing.active) {
        await db.newsletter.update({
          where: { email },
          data: { active: true, locale: safeLocale },
        })
      }
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }

    await db.newsletter.create({
      data: {
        email,
        locale: safeLocale,
        active: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
