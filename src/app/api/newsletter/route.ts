import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

export const dynamic = 'force-dynamic'

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL
const SBK = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000)
  list.push(now)
  hits.set(ip, list)
  return list.length > 5
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 120
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('cf-connecting-ip') || 'anon'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'طلبات كثيرة — انتظر دقيقة ثم حاول مجدداً' }, { status: 429 })
  }

  let email = ''
  try {
    const body = await request.json()
    email = String(body?.email || '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 })
  }

  if (!validEmail(email)) {
    return NextResponse.json({ error: 'يرجى إدخال بريد إلكتروني صحيح' }, { status: 400 })
  }

  if (!SB || !SBK) {
    return NextResponse.json({ error: 'الخدمة غير متاحة حالياً' }, { status: 503 })
  }

  const headers = { apikey: SBK, Authorization: `Bearer ${SBK}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }

  try {
    /* فحص التكرار */
    const dup = await fetch(
      `${SB}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(email)}&select=id`,
      { headers: { apikey: SBK, Authorization: `Bearer ${SBK}` } }
    )
    if (dup.status === 200) {
      const rows = await dup.json()
      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json({ error: 'هذا البريد مشترك مسبقاً في النشرة' }, { status: 409 })
      }
    }

    /* الإشتراك */
    const id = createHash('sha256').update(email + Date.now()).digest('hex').slice(0, 24)
    const ins = await fetch(`${SB}/rest/v1/newsletter_subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ id, email, active: true, created_at: new Date().toISOString() }),
    })

    if (ins.status >= 200 && ins.status < 300) {
      return NextResponse.json({ ok: true, message: 'تم الاشتراك بنجاح — ستصلك أحدث الأخبار أولاً' })
    }
    return NextResponse.json({ error: 'تعذر إتمام الاشتراك — حاول لاحقاً' }, { status: 500 })
  } catch {
    return NextResponse.json({ error: 'تعذر الاتصال — حاول مجدداً' }, { status: 500 })
  }
}
