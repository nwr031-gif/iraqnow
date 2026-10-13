import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

export const dynamic = 'force-dynamic'

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL
const SBK = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const RESEND = process.env.RESEND_API_KEY

const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < 300_000)
  list.push(now)
  hits.set(ip, list)
  return list.length > 3
}

function clean(s: unknown, max: number): string {
  return String(s || '').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, max)
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('cf-connecting-ip') || 'anon'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'أرسلت عدة تقارير مؤخراً — انتظر قليلاً' }, { status: 429 })
  }

  let payload: { name?: string; contact?: string; body?: string } = {}
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 })
  }

  const name = clean(payload.name, 80)
  const contact = clean(payload.contact, 120)
  const body = clean(payload.body, 3000)

  if (body.length < 20) {
    return NextResponse.json({ error: 'يرجى كتابة تفاصيل الخبر (20 حرفاً على الأقل)' }, { status: 400 })
  }

  const id = createHash('sha256').update(body + Date.now()).digest('hex').slice(0, 24)

  /* 1) التخزين في قاعدة البيانات (إن وُجد الجدول) */
  let stored = false
  if (SB && SBK) {
    try {
      const res = await fetch(`${SB}/rest/v1/news_tips`, {
        method: 'POST',
        headers: { apikey: SBK, Authorization: `Bearer ${SBK}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ id, name, contact, body, status: 'NEW', created_at: new Date().toISOString() }),
      })
      stored = res.status >= 200 && res.status < 300
    } catch { /* التخزين اختياري */ }
  }

  /* 2) إشعار بريدي عبر Resend (إن توفرت المفاتيح) */
  let emailed = false
  if (RESEND) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.NEWS_FROM_EMAIL || 'onboarding@resend.dev',
          to: 'info@iraqnow.iq',
          subject: `أرسل خبراً — من ${name || 'مجهول'}`,
          text: `الاسم: ${name || '—'}\nالتواصل: ${contact || '—'}\n\n${body}\n\n(معرّف: ${id} | محفوظ: ${stored ? 'نعم' : 'لا'})`,
        }),
      })
      emailed = res.status === 200
    } catch { /* البريد اختياري */ }
  }

  if (stored || emailed) {
    return NextResponse.json({ ok: true, message: 'شكراً لك — وصلنا تقريرك وسيراجعه فريق التحرير' })
  }

  return NextResponse.json({ error: 'تعذر استلام التقرير الآن — حاول لاحقاً أو راسلنا مباشرة' }, { status: 500 })
}
