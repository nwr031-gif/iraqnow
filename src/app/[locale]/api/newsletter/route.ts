import { NextRequest, NextResponse } from 'next/server'
import { storeAddSubscriber } from '@/lib/supabase-store'

type LocaleParam = 'ar' | 'ku' | 'en'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const safeLocale: LocaleParam = ['ar', 'ku', 'en'].includes(locale) ? locale : 'ar'

    const result = await storeAddSubscriber(email, safeLocale)
    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Failed to subscribe' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
