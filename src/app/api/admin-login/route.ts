import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, expectedAdminToken, verifyAdminPassword } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/* حد محاولات بسيط في الذاكرة */
let attempts: number[] = []

export async function POST(request: NextRequest) {
  const now = Date.now()
  attempts = attempts.filter((t) => now - t < 10 * 60_000)
  if (attempts.length >= 12) {
    return NextResponse.json({ error: 'محاولات كثيرة — انتظر قليلاً' }, { status: 429 })
  }

  let password = ''
  try {
    const body = await request.json()
    password = String(body?.password || '')
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 })
  }

  const ok = await verifyAdminPassword(password)
  if (!ok) {
    attempts.push(now)
    await new Promise((r) => setTimeout(r, 600))
    return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 })
  }

  const token = await expectedAdminToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
