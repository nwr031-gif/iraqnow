import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const existing = await prisma.newsletter.findUnique({ where: { email } })

    if (existing) {
      if (!existing.active) {
        await prisma.newsletter.update({
          where: { email },
          data: { active: true, locale: (locale as 'ar' | 'ku' | 'en') || 'ar' },
        })
      }
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }

    await prisma.newsletter.create({
      data: {
        email,
        locale: (locale as 'ar' | 'ku' | 'en') || 'ar',
        active: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}